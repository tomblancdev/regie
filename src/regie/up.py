"""`regie up` — the rendered brain, running on this host (profile `ct`: podman
Quadlet units under systemd, host networking). Idempotent: a unit is placed
when its file differs, an image pulled when absent, a service restarted when
its unit or its rendered files changed since the last `up`, started when it
is not running; a unit the house no longer renders is stopped and removed.
Under --check it prints what it would do and touches nothing."""

from __future__ import annotations

import io
import socket
import time
import urllib.error
import urllib.request
import zipfile
from dataclasses import dataclass, field
from pathlib import Path

from .errors import HouseError
from .host import STATE, Runner, fetch, file_hashes, read_state, sha256, write_state
from .house import House
from .render import MANIFEST, base_components

HA_URL = "http://127.0.0.1:8123"


@dataclass
class Up:
    units: list[str] = field(default_factory=list)
    placed: list[str] = field(default_factory=list)
    removed: list[str] = field(default_factory=list)
    pulled: list[str] = field(default_factory=list)
    restarted: list[str] = field(default_factory=list)
    started: list[str] = field(default_factory=list)
    components: list[str] = field(default_factory=list)
    check: bool = False

    @property
    def changed(self) -> bool:
        return any(
            (self.placed, self.removed, self.pulled, self.restarted, self.started, self.components)
        )

    def summary(self) -> str:
        verb = "would " if self.check else ""
        parts = [
            f"{verb}place {len(self.placed)}",
            f"{verb}remove {len(self.removed)}",
            f"{verb}pull {len(self.pulled)}",
            f"{verb}restart {len(self.restarted)}",
            f"{verb}start {len(self.started)}",
        ]
        head = f"up: {len(self.units)} units ({', '.join(self.units)}) — " + ", ".join(parts)
        if self.components:
            did = "install" if self.check else "installed"
            head += f"; components {verb}{did}: {', '.join(self.components)}"
        return head + ("" if self.changed else " — nothing to do")


def unit_for(rel: str) -> str | None:
    """Which service a rendered file belongs to (its restart trigger)."""
    parts = rel.split("/")
    if parts[0] == "home-assistant":
        return "home-assistant"
    if parts[0] == "mosquitto":
        return "mosquitto"
    if parts[0] == "zigbee2mqtt" and len(parts) > 2:
        return f"zigbee2mqtt-{parts[1]}"
    return None


def image_of(unit_text: str) -> str | None:
    for line in unit_text.splitlines():
        if line.startswith("Image="):
            return line[len("Image=") :].strip()
    return None


def install_component(
    house: House, root: Path, runner: Runner, result: Up, fetcher=fetch
) -> set[str]:
    """The pinned custom components the house asks for. Returns the units to
    restart (Home Assistant, when one was installed or bumped)."""
    restart: set[str] = set()
    state = read_state(root, "components.json")
    for domain, spec in base_components().items():
        if spec.get("when") and spec["when"] not in house.data:
            continue
        version = spec["version"]
        target = root / "home-assistant" / "custom_components" / domain
        if state.get(domain) == version and (target / "manifest.json").is_file():
            continue
        result.components.append(f"{domain} {version}")
        restart.add("home-assistant")
        if runner.check:
            continue
        url = spec["url"].format(version=version)
        data = fetcher(url)
        digest = sha256(data)
        if digest != spec["sha256"]:
            raise HouseError(
                f"{domain} {version}: the download's sha256 is {digest}, "
                f"the product pins {spec['sha256']} — not installed"
            )
        with zipfile.ZipFile(io.BytesIO(data)) as z:
            names = z.namelist()
            # the archive is either the component's files at its top or one
            # folder holding them: either way they land under <domain>/
            prefix = ""
            if all(n.startswith(f"{domain}/") for n in names):
                prefix = f"{domain}/"
            if target.exists():
                for p in sorted(target.rglob("*"), reverse=True):
                    p.unlink() if p.is_file() else p.rmdir()
            for n in names:
                rel = n[len(prefix) :]
                if not rel or n.endswith("/"):
                    continue
                dest = target / rel
                if not dest.resolve().is_relative_to(target.resolve().parent):
                    raise HouseError(f"{domain}: the archive escapes its folder ({n})")
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(z.read(n))
        state[domain] = version
        write_state(root, "components.json", state)
    return restart


def _failed(runner: Runner, unit: str) -> None:
    """A unit that gave up is a fault now, not after the timeout: say why."""
    rc, _ = runner.query("systemctl", "is-failed", "--quiet", f"{unit}.service")
    if rc != 0:
        return
    _, log = runner.query(
        "journalctl", "-u", f"{unit}.service", "-n", "15", "-o", "cat", "--no-pager"
    )
    raise HouseError(f"{unit}.service failed — its journal's last lines:\n{log.strip()}")


def wait_for(runner: Runner, unit: str, timeout: int) -> None:
    if runner.check:
        return
    deadline = time.monotonic() + timeout
    if unit == "home-assistant":
        while time.monotonic() < deadline:
            try:
                urllib.request.urlopen(f"{HA_URL}/api/", timeout=5)  # noqa: S310
                return
            except urllib.error.HTTPError as exc:
                if exc.code in (401, 403):
                    return  # alive: it refuses us, which is the healthy answer
            except (urllib.error.URLError, OSError):
                pass
            _failed(runner, unit)
            time.sleep(3)
        raise HouseError(f"home-assistant: {HA_URL}/api/ did not answer within {timeout}s")
    if unit == "mosquitto":
        while time.monotonic() < deadline:
            try:
                with socket.create_connection(("127.0.0.1", 1883), timeout=3):
                    return
            except OSError:
                _failed(runner, unit)
                time.sleep(2)
        raise HouseError(f"mosquitto: port 1883 did not open within {timeout}s")


def up(
    house: House,
    root: Path,
    units_dir: Path,
    runner: Runner,
    fetcher=fetch,
    timeout: int = 300,
) -> Up:
    root, units_dir = Path(root), Path(units_dir)
    manifest = read_state(root, MANIFEST.split("/", 1)[1])
    if not manifest:
        raise HouseError(f"{root}: nothing rendered here — `regie render --out {root}` first")
    rendered = list(manifest.get("files", []))
    result = Up(check=runner.check)

    # the directories the units mount — podman would make them, but the
    # packages dir must exist for Home Assistant's include even when empty
    for rel in ("home-assistant/packages", "mosquitto/data"):
        if not runner.check:
            (root / rel).mkdir(parents=True, exist_ok=True)

    restart = install_component(house, root, runner, result, fetcher)

    # the files each service reads, hashed: a change since the last up = a restart
    stamps = read_state(root, "stamps.json")
    hashes = file_hashes(root, [r for r in rendered if not r.startswith("units/")])
    for rel, digest in hashes.items():
        if stamps.get(rel) != digest:
            u = unit_for(rel)
            if u:
                restart.add(u)

    # the units: place what differs, remove what the house no longer renders
    placed = read_state(root, "units.json").get("placed", [])
    units: list[str] = []
    images: list[str] = []
    for rel in sorted(r for r in rendered if r.startswith("units/")):
        name = rel.split("/", 1)[1]
        text = (root / rel).read_text(encoding="utf-8")
        units.append(name.rsplit(".", 1)[0])
        if img := image_of(text):
            images.append(img)
        dest = units_dir / name
        if dest.is_file() and dest.read_text(encoding="utf-8") == text:
            continue
        result.placed.append(name)
        restart.add(name.rsplit(".", 1)[0])
        if not runner.check:
            units_dir.mkdir(parents=True, exist_ok=True)
            dest.write_text(text, encoding="utf-8")
            dest.chmod(0o644)
    result.units = units
    for name in sorted(
        set(placed) - {u.split("/", 1)[1] for u in rendered if u.startswith("units/")}
    ):
        result.removed.append(name)
        svc = name.rsplit(".", 1)[0]
        runner.run("systemctl", "stop", f"{svc}.service")
        if not runner.check and (units_dir / name).is_file():
            (units_dir / name).unlink()
    if result.placed or result.removed:
        runner.run("systemctl", "daemon-reload")

    # the images: pulled when absent (a bump of a pin is a new tag = a pull)
    for img in images:
        rc, _ = runner.query("podman", "image", "exists", img)
        if rc != 0:
            result.pulled.append(img)
            runner.run("podman", "pull", "-q", img)

    # the services, in the order the units were rendered (the broker before the brain)
    for svc in sorted(units, key=lambda s: (s != "mosquitto", s)):
        rc, _ = runner.query("systemctl", "is-active", "--quiet", f"{svc}.service")
        if svc in restart and rc == 0:
            result.restarted.append(svc)
            runner.run("systemctl", "restart", f"{svc}.service")
        elif rc != 0:
            result.started.append(svc)
            runner.run("systemctl", "start", f"{svc}.service")
        if svc in result.restarted or svc in result.started:
            wait_for(runner, svc, timeout)

    if not runner.check:
        write_state(
            root,
            "units.json",
            {"placed": sorted({u.split("/", 1)[1] for u in rendered if u.startswith("units/")})},
        )
        write_state(root, "stamps.json", hashes)
    return result


__all__ = ["Up", "up", "unit_for", "image_of", "STATE"]
