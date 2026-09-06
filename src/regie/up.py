"""`regie up` — the rendered brain, running on this host (profile `ct`: podman
Quadlet units under systemd, host networking). Idempotent: a unit is placed
when its file differs, an image pulled when absent, a service started when it
is not running, restarted when its unit or a file it reads ONCE changed since
the last `up` — and Home Assistant reloaded, by domain, when what changed is
a package, a theme or a dashboard (0.28): it reads those live, a restart is
the answer to a core key, a secret, a component or the unit itself. A unit the
house no longer renders is stopped and removed. Under --check it prints what
it would do and touches nothing."""

from __future__ import annotations

import io
import os
import socket
import time
import urllib.error
import urllib.request
import zipfile
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from .apply import CLIENT_NAME  # the conductor's own token, <root>/.regie/tokens/<name>
from .errors import HouseError
from .ha import HomeAssistant
from .host import STATE, Runner, fetch, file_hashes, read_state, sha256, write_state
from .house import House
from .render import MANIFEST, base_components

HA_URL = "http://127.0.0.1:8123"

# What a changed Home Assistant file asks. The brain reads most of its YAML
# live: a domain with a `reload` service re-reads its own share of the
# packages (an automation or a script whose text did not change is kept as it
# runs; a helper keeps its value), the themes have theirs, a YAML dashboard is
# re-read at the next request (its file's mtime) and every open page asks
# again on `lovelace_updated`. Only what is read ONCE, at start, needs a
# restart: configuration.yaml's own keys, the secrets, a custom component —
# and a word in a package this table does not know, the safe reading.
RESTART = "restart"
RELOAD_DOMAINS = {
    "homeassistant": "homeassistant/reload_core_config",  # customize:
    "input_boolean": "input_boolean/reload",
    "input_button": "input_button/reload",
    "input_datetime": "input_datetime/reload",
    "input_number": "input_number/reload",
    "input_select": "input_select/reload",
    "input_text": "input_text/reload",
    "counter": "counter/reload",
    "timer": "timer/reload",
    "schedule": "schedule/reload",
    "template": "template/reload",
    "group": "group/reload",
    "scene": "scene/reload",
    "automation": "automation/reload",
    "script": "script/reload",
}
# a domain's entries carrying `platform:` (light: - platform: group)
RELOAD_PLATFORMS = {"group": "group/reload", "template": "template/reload"}
TOP_RELOADS = {
    "home-assistant/automations.yaml": "automation/reload",
    "home-assistant/scripts.yaml": "script/reload",
    "home-assistant/scenes.yaml": "scene/reload",
}
# the order the asks land in: what a script names first (the helpers, the
# templates, the groups), the automations before the scripts — a walk's
# starter automation, re-made, must be listening when its script comes back
# `off` (pack scenes, 0.28) — the themes and the pages last
RELOAD_ORDER = [*RELOAD_DOMAINS.values(), "frontend/reload_themes"]


class _HaYaml(yaml.SafeLoader):
    """Home Assistant's YAML read for its SHAPE: its own tags (!secret,
    !include_dir_named…) become the tag and its word, so a reference that
    moves still counts as a change."""


_HaYaml.add_multi_constructor(
    "!", lambda loader, suffix, node: f"!{suffix} {getattr(node, 'value', '')}"
)


def _digest(value) -> str:
    """One block of a package, in its normal form: what changed is read from
    this, never from the file's bytes (a comment moved asks nothing)."""
    return sha256(yaml.safe_dump(value, sort_keys=True, allow_unicode=True).encode("utf-8"))


@dataclass
class Up:
    units: list[str] = field(default_factory=list)
    placed: list[str] = field(default_factory=list)
    removed: list[str] = field(default_factory=list)
    pulled: list[str] = field(default_factory=list)
    restarted: list[str] = field(default_factory=list)
    reloaded: list[str] = field(default_factory=list)
    started: list[str] = field(default_factory=list)
    components: list[str] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)
    check: bool = False

    @property
    def changed(self) -> bool:
        return any(
            (
                self.placed,
                self.removed,
                self.pulled,
                self.restarted,
                self.reloaded,
                self.started,
                self.components,
            )
        )

    def summary(self) -> str:
        verb = "would " if self.check else ""
        parts = [
            f"{verb}place {len(self.placed)}",
            f"{verb}remove {len(self.removed)}",
            f"{verb}pull {len(self.pulled)}",
            f"{verb}restart {len(self.restarted)}",
            f"{verb}reload {len(self.reloaded)}",
            f"{verb}start {len(self.started)}",
        ]
        head = f"up: {len(self.units)} units ({', '.join(self.units)}) — " + ", ".join(parts)
        if self.components:
            did = "install" if self.check else "installed"
            head += f"; components {verb}{did}: {', '.join(self.components)}"
        return head + ("" if self.changed else " — nothing to do")


def unit_for(rel: str) -> str | None:
    """Which service a rendered file belongs to."""
    parts = rel.split("/")
    if parts[0] == "home-assistant":
        return "home-assistant"
    if parts[0] == "mosquitto":
        return "mosquitto"
    if parts[0] == "zigbee2mqtt" and len(parts) > 2:
        return f"zigbee2mqtt-{parts[1]}"
    return None


def dashboard_paths(root: Path) -> dict[str, str]:
    """The YAML dashboards configuration.yaml declares: rendered file → url path."""
    conf = root / "home-assistant" / "configuration.yaml"
    if not conf.is_file():
        return {}
    try:
        data = yaml.load(conf.read_text(encoding="utf-8"), Loader=_HaYaml) or {}
    except yaml.YAMLError:
        return {}
    out = {}
    for url_path, spec in ((data.get("lovelace") or {}).get("dashboards") or {}).items():
        if isinstance(spec, dict) and spec.get("filename"):
            out[f"home-assistant/{spec['filename']}"] = url_path
    return out


def brain_asks(rel: str, root: Path, dashboards: dict[str, str]) -> dict[str, str]:
    """What a Home Assistant file asks of the brain, each ask with a digest of
    what it covers: the reload services (`domain/service`) — a package's, one
    per domain it holds, the digest of that domain's block alone —, an event
    (`lovelace_updated <url path>`), nothing (a file served on request) — or
    RESTART when only a start reads it. An ask is made when its digest moved
    since the last up: a look edited reloads the scripts, not the sensors
    beside them (0.28.2)."""
    p = root / rel
    whole = sha256(p.read_bytes()) if p.is_file() else ""
    kind = rel.split("/")[1]
    if kind == "packages" and rel.endswith(".yaml"):
        if not p.is_file():
            return {RESTART: whole}
        try:
            data = yaml.load(p.read_text(encoding="utf-8"), Loader=_HaYaml) or {}
        except yaml.YAMLError:
            return {RESTART: whole}
        blocks: dict[str, list] = {}
        for key, value in data.items():
            if key in RELOAD_DOMAINS:
                blocks.setdefault(RELOAD_DOMAINS[key], []).append((key, value))
                continue
            platforms = (
                {e.get("platform") for e in value}
                if isinstance(value, list) and value and all(isinstance(e, dict) for e in value)
                else set()
            )
            if platforms and platforms <= set(RELOAD_PLATFORMS):
                for x in sorted(platforms):
                    blocks.setdefault(RELOAD_PLATFORMS[x], []).append((key, value))
                continue
            return {RESTART: whole}
        return {
            ask: _digest([list(kv) for kv in sorted(held, key=lambda kv: kv[0])])
            for ask, held in blocks.items()
        }
    if kind == "themes":
        return {"frontend/reload_themes": whole}
    if kind == "dashboards":
        url = dashboards.get(rel)
        return {f"lovelace_updated {url}": whole} if url else {}
    if kind == "www":
        return {}
    if rel in TOP_RELOADS:
        return {TOP_RELOADS[rel]: whole}
    return {RESTART: whole}


def _rank(ask: str) -> tuple[int, str]:
    return (RELOAD_ORDER.index(ask) if ask in RELOAD_ORDER else len(RELOAD_ORDER), ask)


def _shown(ask: str) -> str:
    return ask.replace("/", ".", 1) if "/" in ask else ask


def reload_brain(brain: HomeAssistant, asks: set[str], result: Up) -> bool:
    """The asks, one call each, in order. False when the token is refused —
    the caller restarts instead; any other refusal is a fault (a broken
    config: the brain says so)."""
    for ask in sorted(asks, key=_rank):
        if " " in ask:
            event, url_path = ask.split(" ", 1)
            status, data = brain.post(f"/api/events/{event}", {"url_path": url_path})
        else:
            status, data = brain.post(f"/api/services/{ask}", {})
        if status == 401:
            return False
        if status >= 300:
            raise HouseError(f"home-assistant: {_shown(ask)} refused ({status}): {data}")
        result.reloaded.append(f"home-assistant: {_shown(ask)}")
    return True


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
        # /manifest.json answers 200 without a token - a probe on /api/ would
        # write an "invalid authentication" line into the brain's security log
        # at every converge
        while time.monotonic() < deadline:
            try:
                urllib.request.urlopen(f"{HA_URL}/manifest.json", timeout=5)  # noqa: S310
                return
            except urllib.error.HTTPError:
                return  # alive: it answered, whatever it said
            except (urllib.error.URLError, OSError):
                pass
            _failed(runner, unit)
            time.sleep(3)
        raise HouseError(f"home-assistant: {HA_URL}/manifest.json did not answer within {timeout}s")
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
    brain: HomeAssistant | None = None,
) -> Up:
    root, units_dir = Path(root), Path(units_dir)
    manifest = read_state(root, MANIFEST.split("/", 1)[1])
    if not manifest:
        raise HouseError(f"{root}: nothing rendered here — `regie render --out {root}` first")
    rendered = list(manifest.get("files", []))
    result = Up(check=runner.check)

    # the directories the units mount — podman would make them root-owned:
    # the packages dir must exist for Home Assistant's include even when
    # empty, and an image that drops to a uid must own its data (the
    # profile's `dirs`, an `owner` among its users, chowned when root)
    for d in house.profile.dirs:
        if runner.check or not house.wanted(d):
            continue
        target = root / d["path"]
        target.mkdir(parents=True, exist_ok=True)
        if d.get("owner") and os.geteuid() == 0:
            uid = house.profile.users.get(d["owner"])
            if uid is None:
                raise HouseError(
                    f"dir {d['path']}: owner {d['owner']!r} is not a user the profile names"
                )
            if target.stat().st_uid != int(uid):
                os.chown(target, int(uid), int(uid))

    restart = install_component(house, root, runner, result, fetcher)

    # the files each service reads, hashed: a change since the last up — or a
    # file gone since — is a restart of its service; for the brain it is what
    # the file asks, ask by ask, each made only when the block it covers moved
    # (remembered in reloads.json: a domain a package no longer holds is
    # reloaded once more, to let go of what it declared; a file gone the same)
    stamps = read_state(root, "stamps.json")
    remembered = read_state(root, "reloads.json")
    hashes = file_hashes(root, [r for r in rendered if not r.startswith("units/")])
    dashboards = dashboard_paths(root)
    reloads = {
        rel: brain_asks(rel, root, dashboards)
        for rel in hashes
        if unit_for(rel) == "home-assistant"
    }
    asks: set[str] = set()
    changed = [rel for rel, digest in hashes.items() if stamps.get(rel) != digest]
    gone = [rel for rel in stamps if rel not in hashes]
    for rel in changed + gone:
        u = unit_for(rel)
        if u is None:
            continue
        if u != "home-assistant":
            restart.add(u)
            continue
        now = reloads.get(rel, {})
        before = remembered.get(rel, {} if rel in reloads else {RESTART: ""})
        if isinstance(before, list):  # 0.28.0's memory: the asks, no digests
            before = dict.fromkeys(before, "")
        moved = {a for a in set(now) | set(before) if now.get(a) != before.get(a)}
        if RESTART in moved:
            restart.add(u)
        else:
            asks |= moved

    # the reloads speak with the conductor's own token; a brain that has none
    # yet (a first converge, the tokens not minted) is restarted instead
    token_path = root / STATE / "tokens" / CLIENT_NAME
    if asks and "home-assistant" not in restart and not runner.check:
        if token_path.is_file():
            brain = brain or HomeAssistant(HA_URL, token=token_path.read_text("utf-8").strip())
        else:
            result.notes.append(
                "home-assistant: no conductor token on disk yet — restarted instead of reloaded"
            )
            restart.add("home-assistant")

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

    # the services: the broker first, the Matter server next, the brain after
    # what it dials on the loopback, the radios last. A restart or a start
    # reads everything: the brain is reloaded only when neither is due
    for svc in sorted(units, key=lambda s: (s != "mosquitto", s != "matter-server", s)):
        rc, _ = runner.query("systemctl", "is-active", "--quiet", f"{svc}.service")
        if svc in restart and rc == 0:
            result.restarted.append(svc)
            runner.run("systemctl", "restart", f"{svc}.service")
        elif rc != 0:
            result.started.append(svc)
            runner.run("systemctl", "start", f"{svc}.service")
        elif svc == "home-assistant" and asks:
            if runner.check:
                result.reloaded.extend(
                    f"home-assistant: {_shown(a)}" for a in sorted(asks, key=_rank)
                )
            elif not reload_brain(brain, asks, result):
                result.notes.append(
                    "home-assistant: the conductor's token is refused — restarted instead of "
                    "reloaded (`regie apply` mints it again)"
                )
                result.restarted.append(svc)
                runner.run("systemctl", "restart", f"{svc}.service")
        if svc in result.restarted or svc in result.started:
            wait_for(runner, svc, timeout)

    if not runner.check:
        write_state(
            root,
            "units.json",
            {"placed": sorted({u.split("/", 1)[1] for u in rendered if u.startswith("units/")})},
        )
        write_state(root, "stamps.json", hashes)
        write_state(root, "reloads.json", reloads)
    return result


__all__ = ["Up", "up", "unit_for", "brain_asks", "dashboard_paths", "image_of", "STATE"]
