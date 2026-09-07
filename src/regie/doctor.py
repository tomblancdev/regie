"""`regie doctor` — the brain's health, read after a converge and said in one
line per check; the verb changes nothing (0.30). Green means the brain agrees
with the files: every unit active and running the image its unit names, the
brain's own version against the pin (the profile's tested one — a house's
own pin is said), `up` with nothing left to do, the configuration valid as
the brain reads it, every entity the packages and the dashboards name present
in the brain, no repair open, no ghost (an entity the registry keeps and
nothing provides any more), the mesh's join window closed. Beside the
verdict, what is worth knowing and is nobody's fault: the things that do not
answer, the log since the start, the recorder (its file, the open run, how
the last one closed — a run closed unfinished is a stop that was a kill). A
red line is a disagreement, and the verb exits 1 on any. A probe that cannot
run says so (`not read`) and is red too: unknown is not green."""

from __future__ import annotations

import re
import sqlite3
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from .apply import CLIENT_NAME
from .errors import HouseError
from .ha import HomeAssistant
from .host import STATE, Runner, read_state
from .house import House
from .render import MANIFEST, OBJECT_DOMAINS
from .up import HA_URL, _HaYaml, image_of, up

MARKS = {"ok": "=", "red": "!", "note": "~"}

# the entity domains a reference may name (the brain's own live list is
# added to these): a `domain.object` token in a package is a reference
# unless `object` is a service of that domain (light.turn_on) or a template's
# prefix (script.living_{{ … }})
ENTITY_DOMAINS = frozenset(
    """automation binary_sensor button camera climate counter cover date datetime
    device_tracker event fan group humidifier image input_boolean input_button
    input_datetime input_number input_select input_text light lock media_player
    number person remote scene schedule script select sensor siren sun switch text
    time timer update vacuum valve water_heater weather zone""".split()
)
# a lookahead, so the matches overlap: `states.sensor.house_period.state`
# offers `sensor.house_period` too, not `states.sensor` alone
REF_RE = re.compile(r"(?=(?<!\w)([a-z_]+)\.([a-z0-9_]+)(?![\w{]))")
RECORDER_DB = "home-assistant/home-assistant_v2.db"


@dataclass
class Line:
    state: str  # ok | red | note
    name: str
    detail: str
    more: list[str] = field(default_factory=list)  # what stands under the line

    def lines(self) -> list[str]:
        return [f"  {MARKS[self.state]} {self.name}: {self.detail}"] + [
            f"      {m}" for m in self.more
        ]


@dataclass
class Report:
    lines: list[Line] = field(default_factory=list)

    def add(self, state: str, name: str, detail: str, more: list[str] | None = None) -> None:
        self.lines.append(Line(state, name, detail, list(more or [])))

    @property
    def red(self) -> list[Line]:
        return [x for x in self.lines if x.state == "red"]

    def exit_code(self) -> int:
        return 1 if self.red else 0

    def text(self) -> list[str]:
        return [t for x in self.lines for t in x.lines()]

    def summary(self) -> str:
        ok = sum(1 for x in self.lines if x.state == "ok")
        notes = sum(1 for x in self.lines if x.state == "note")
        head = f"doctor: {ok} green, {len(self.red)} red, {notes} note(s)"
        if not self.red:
            return head + " — the brain agrees with the files"
        names = list(dict.fromkeys(x.name for x in self.red))
        return head + " — RED: " + ", ".join(names)


# --- the host: the units, the files ---------------------------------------
def container_of(unit_text: str) -> str | None:
    for line in unit_text.splitlines():
        if line.startswith("ContainerName="):
            return line[len("ContainerName=") :].strip()
    return None


def _stamp(value: str) -> str:
    """systemd's `Sun 2026-09-06 10:21:54 UTC`, the recorder's
    `2026-09-06 10:22:00.119167` — one shape: the date, the time to the
    second, the zone when it was given."""
    words = value.strip().split()
    if words and re.fullmatch(r"[A-Za-z]{3}", words[0]):
        words = words[1:]
    if len(words) >= 2 and "." in words[1]:
        words[1] = words[1].split(".", 1)[0]
    return " ".join(words) if words else "?"


def units(root: Path, rendered: list[str], runner: Runner, report: Report) -> None:
    for rel in sorted(r for r in rendered if r.startswith("units/")):
        name = rel.split("/", 1)[1].rsplit(".", 1)[0]
        path = root / rel
        text = path.read_text(encoding="utf-8") if path.is_file() else ""
        image = image_of(text)
        container = container_of(text) or f"systemd-{name}"
        rc, out = runner.query(
            "systemctl",
            "show",
            "-p",
            "ActiveState",
            "-p",
            "SubState",
            "-p",
            "ActiveEnterTimestamp",
            f"{name}.service",
        )
        if rc == 127:
            report.add("red", f"unit {name}", "not read — systemctl is not on this host")
            continue
        props = dict(x.split("=", 1) for x in out.splitlines() if "=" in x)
        state = props.get("ActiveState", "unknown")
        if state != "active":
            report.add("red", f"unit {name}", f"{state} ({props.get('SubState', '?')})")
            continue
        since = _stamp(props.get("ActiveEnterTimestamp", ""))
        rc, out = runner.query("podman", "inspect", "--format", "{{.ImageName}}", container)
        running = out.strip() if rc == 0 else ""
        if rc == 127:
            report.add("red", f"unit {name}", f"active since {since} — podman is not on this host")
        elif running and image and running != image:
            report.add(
                "red",
                f"unit {name}",
                f"active since {since}, runs {running} while the unit names {image} — "
                "a restart pending",
            )
        else:
            report.add("ok", f"unit {name}", f"active since {since} — {running or image}")


def files(house: House, root: Path, units_dir: Path, runner: Runner, report: Report) -> None:
    """`up` with nothing left to do: what runs is what was rendered."""
    was = runner.check
    runner.check = True
    try:
        result = up(house, root, units_dir, runner)
    finally:
        runner.check = was
    if not result.changed:
        report.add("ok", "files", "up has nothing to do — what runs is what was rendered")
        return
    parts = []
    for what, items in (
        ("place", result.placed),
        ("remove", result.removed),
        ("pull", result.pulled),
        ("restart", result.restarted),
        ("reload", result.reloaded),
        ("start", result.started),
        ("install", result.components),
    ):
        if items:
            parts.append(f"{what} {', '.join(items)}")
    report.add("red", "files", "up would " + "; ".join(parts) + " — the last converge did not end")


# --- the brain -------------------------------------------------------------
def _strings(node):
    if isinstance(node, dict):
        for k, v in node.items():
            if isinstance(k, str):
                yield k
            yield from _strings(v)
    elif isinstance(node, list):
        for v in node:
            yield from _strings(v)
    elif isinstance(node, str):
        yield node


def references(
    paths: list[Path], domains: set[str], services: dict[str, set[str]]
) -> dict[str, set[str]]:
    """Every entity the files name, with the files naming it — a
    `domain.object` token in a value or a key, the domain one an entity may
    have, the object not a service of it nor a template's prefix."""
    out: dict[str, set[str]] = {}
    for f in paths:
        try:
            data = yaml.load(f.read_text(encoding="utf-8"), Loader=_HaYaml)
        except (yaml.YAMLError, OSError):
            continue
        for s in _strings(data):
            for m in REF_RE.finditer(s):
                domain, obj = m.groups()
                if domain not in domains or obj.endswith("_") or obj in services.get(domain, ()):
                    continue
                out.setdefault(f"{domain}.{obj}", set()).add(f.name)
    return out


def brain(house: House, root: Path, ha: HomeAssistant, report: Report) -> None:
    status, cfg = ha.get("/api/config")
    if status == 401:
        report.add(
            "red",
            "brain",
            "the conductor's token is refused — `regie apply` mints it again; "
            "the brain was not asked",
        )
        return
    if status != 200 or not isinstance(cfg, dict):
        report.add("red", "brain", f"/api/config answers {status} — the brain was not asked")
        return
    version = str(cfg.get("version"))
    state = cfg.get("state")
    pins = house.pins()
    tested = house.profile.pins
    own = house.data.get("pins", {}) or {}
    if state != "RUNNING":
        report.add("red", "brain", f"{state}, Home Assistant {version}")
    elif version != str(pins.get("home_assistant")):
        report.add(
            "red",
            "brain",
            f"{state}, Home Assistant {version} while the pin says {pins.get('home_assistant')} "
            "— a restart pending",
        )
    elif own.get("home_assistant") and own["home_assistant"] != tested.get("home_assistant"):
        report.add(
            "note",
            "brain",
            f"{state}, Home Assistant {version} — the house's own pin (this release was tested "
            f"against {tested.get('home_assistant')})",
        )
    else:
        report.add(
            "ok",
            "brain",
            f"{state}, Home Assistant {version} — the version this release was tested against",
        )
    for key, value in sorted(own.items()):
        if key != "home_assistant" and str(value) != str(tested.get(key)):
            report.add(
                "note",
                f"pin {key}",
                f"{value} is the house's own (this release was tested against {tested.get(key)})",
            )

    # the configuration, as the brain reads it
    status, check = ha.post("/api/config/core/check_config", {})
    if status != 200 or not isinstance(check, dict):
        report.add("red", "config", f"check_config answers {status}")
    elif check.get("result") == "valid":
        report.add("ok", "config", "valid, as the brain reads it")
    else:
        errors = check.get("errors") or ""
        report.add("red", "config", f"{check.get('result')} — {errors}".strip())

    # the references: every entity the files name, in the brain
    status, states = ha.get("/api/states")
    states = states if status == 200 and isinstance(states, list) else []
    present = {s["entity_id"]: s for s in states}
    status, listed = ha.get("/api/services")
    services = (
        {s["domain"]: set(s.get("services") or ()) for s in listed}
        if status == 200 and isinstance(listed, list)
        else {}
    )
    domains = set(ENTITY_DOMAINS) | {e.split(".", 1)[0] for e in present}
    tree = root / "home-assistant"
    named = references(
        sorted(tree.glob("packages/*.yaml")) + sorted(tree.glob("dashboards/*.yaml")),
        domains,
        services,
    )
    missing = sorted(e for e in named if e not in present)
    if missing:
        report.add(
            "red",
            "references",
            f"{len(missing)} the files name and the brain does not have",
            [f"{e} ({', '.join(sorted(named[e]))})" for e in missing],
        )
    else:
        report.add("ok", "references", f"{len(named)} entities the files name, all in the brain")

    with ha.ws() as ws:
        issues = (ws.call("repairs/list_issues") or {}).get("issues") or []
        log = ws.call("system_log/list") or []
        registry = {e["entity_id"]: e for e in (ws.call("config/entity_registry/list") or [])}

    # the repairs the brain opened
    open_issues = [i for i in issues if not i.get("ignored")]
    if open_issues:
        more = []
        for i in open_issues:
            words = ", ".join(
                f"{k} {v}"
                for k, v in (i.get("translation_placeholders") or {}).items()
                if isinstance(v, str) and k != "edit"
            )
            more.append(
                f"{i.get('domain')} {i.get('translation_key')} ({i.get('severity')})"
                + (f": {words}" if words else "")
            )
        report.add("red", "repairs", f"{len(open_issues)} open", more)
    else:
        report.add("ok", "repairs", "none open")

    # the ghosts: what the registry keeps and nothing provides any more.
    #
    # OURS is a red — a package rendered once and gone leaves its entities
    # behind (0.17's rule, and the 36 this doctor's first read found). ANOTHER
    # INTEGRATION'S is a note, and 0.39.3 is where that was learnt: the hood's
    # `select.hood_functional_light_color_temperature` reads restored whenever
    # Home Connect comes up while the appliance is not reporting that setting —
    # seven of that entry's sixteen entities were unavailable and only this one
    # had no provider in the run — so every converge that restarted the brain
    # failed on a registry row the house never minted and `apply` will never
    # remove (the orphan rule touches ours alone). The line is still said, in
    # full, with what to do about it; the play no longer dies on it.
    ours: dict[str, list[str]] = {}
    theirs: dict[str, list[str]] = {}
    for s in states:
        if s.get("state") != "unavailable" or not (s.get("attributes") or {}).get("restored"):
            continue
        row = registry.get(s["entity_id"]) or {}
        domain, obj = s["entity_id"].split(".", 1)
        mine = str(row.get("unique_id") or "").startswith("regie_") or (
            row.get("platform") in OBJECT_DOMAINS
        )
        (ours if mine else theirs).setdefault(domain, []).append(obj)
    if ours:
        n = sum(len(v) for v in ours.values())
        report.add(
            "red",
            "ghosts",
            f"{n} the registry keeps and nothing provides any more (restored)",
            [f"{d} ×{len(v)}: {', '.join(sorted(v))}" for d, v in sorted(ours.items())],
        )
    elif theirs:
        report.add(
            "ok",
            "ghosts",
            "none of ours — the registry holds what the files render",
        )
    else:
        report.add("ok", "ghosts", "none — the registry holds what the files render")
    if theirs:
        n = sum(len(v) for v in theirs.values())
        report.add(
            "note",
            "restored",
            f"{n} row(s) another integration keeps and does not provide in this run",
            [f"{d} ×{len(v)}: {', '.join(sorted(v))}" for d, v in sorted(theirs.items())]
            + [
                "not ours to remove (no regie_ id): the row goes when its integration "
                "provides it again, or by hand in the entity registry"
            ],
        )

    # the mesh: the bridge connected, the join window closed
    if house.coordinators():
        joins = [e for e in present if e.endswith("_bridge_permit_join")]
        links = [e for e in present if e.endswith("_bridge_connection_state")]
        bad = [f"{e} is on — the join window is open" for e in joins if present[e]["state"] == "on"]
        bad += [
            f"{e} is {present[e]['state']} — the bridge is not on the broker"
            for e in links
            if present[e]["state"] != "on"
        ]
        if bad:
            report.add("red", "mesh", "; ".join(bad))
        elif not joins and not links:
            report.add("note", "mesh", "the bridge's entities are not in the brain — not read")
        else:
            report.add(
                "ok",
                "mesh",
                f"{len(links)} bridge(s) on the broker, the join window closed",
            )

    # the things: what does not answer, what the brain has no entity for
    silent, absent, n = [], [], 0
    for t in house.things:
        e = house.entity(t)
        if not e:
            continue
        n += 1
        if e not in present:
            absent.append(f"{e} ({t['id']})")
        elif present[e]["state"] == "unavailable":
            silent.append(f"{e} ({t['id']})")
    if silent or absent:
        parts = []
        if silent:
            parts.append(f"{len(silent)} of {n} not answering — {', '.join(silent)}")
        if absent:
            parts.append(f"{len(absent)} not in the brain — {', '.join(absent)}")
        report.add("note", "things", "; ".join(parts))
    else:
        report.add("ok", "things", f"{n} answering")

    # the log since the start
    errors = [e for e in log if e.get("level") == "ERROR"]
    warnings = [e for e in log if e.get("level") == "WARNING"]
    if errors or warnings:
        loud = sorted(errors + warnings, key=lambda e: -int(e.get("count") or 1))[:5]
        more = []
        for e in loud:
            message = (e.get("message") or [""])[0]
            more.append(
                f"{str(e.get('level')).lower()} {e.get('name')} ×{e.get('count', 1)}: "
                f"{str(message)[:140]}"
            )
        times = sum(int(e.get("count") or 1) for e in errors)
        report.add(
            "note",
            "log",
            f"{len(errors)} error(s) ({times} times), {len(warnings)} warning(s) since the start",
            more,
        )
    else:
        report.add("ok", "log", "clean since the start")


# --- the recorder ------------------------------------------------------------
def recorder(db: Path, report: Report) -> None:
    """The recorder's file and its runs: the open one, how the last one
    closed — `closed_incorrect` is a stop that did not finish (a kill, a
    crash) —, how many did over the file's life."""
    if not db.is_file():
        report.add("note", "recorder", f"no sqlite file at {db} — not read")
        return
    size = f"{db.stat().st_size / 2**20:.1f} MiB"
    try:
        con = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
        try:
            rows = con.execute(
                "select run_id, start, end, closed_incorrect from recorder_runs order by run_id"
            ).fetchall()
        finally:
            con.close()
    except sqlite3.Error as exc:
        report.add("note", "recorder", f"{size} — the runs not read ({exc})")
        return
    parts = [size]
    open_runs = [r for r in rows if r[2] is None]
    closed = [r for r in rows if r[2] is not None]
    if open_runs:
        parts.append(f"run {open_runs[-1][0]} open since {_stamp(str(open_runs[-1][1]))} UTC")
    if closed:
        last = closed[-1]
        parts.append(
            f"the last closed run ({last[0]}) ended "
            + ("UNFINISHED — its stop was a kill" if last[3] else "clean")
        )
        parts.append(f"{sum(1 for r in closed if r[3])} of {len(closed)} closed runs unfinished")
    report.add("note", "recorder", " — ".join(parts))


# --- the verb -----------------------------------------------------------------
def doctor(
    house: House,
    root: Path,
    units_dir: Path,
    runner: Runner,
    brain_client: HomeAssistant | None = None,
    url: str = HA_URL,
    db: Path | None = None,
) -> Report:
    root, units_dir = Path(root), Path(units_dir)
    report = Report()
    manifest = read_state(root, MANIFEST.split("/", 1)[1])
    if not manifest:
        report.add(
            "red", "files", f"nothing rendered under {root} — `regie render --out {root}` first"
        )
        return report
    units(root, list(manifest.get("files", [])), runner, report)
    try:
        files(house, root, units_dir, runner, report)
    except HouseError as exc:
        report.add("red", "files", f"not read — {exc}")
    token = root / STATE / "tokens" / CLIENT_NAME
    if brain_client is None and not token.is_file():
        report.add(
            "red",
            "brain",
            f"no conductor token at {token} — `regie apply` mints it; the brain was not asked",
        )
    else:
        ha = brain_client or HomeAssistant(url, token=token.read_text("utf-8").strip())
        try:
            brain(house, root, ha, report)
        except HouseError as exc:
            report.add("red", "brain", f"not read — {exc}")
    recorder(db if db is not None else root / RECORDER_DB, report)
    return report


__all__ = ["Report", "Line", "doctor", "references", "recorder", "container_of"]
