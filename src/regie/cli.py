"""regie — the one CLI. `check` and `render` are the files half; `up` runs
it on the host; `apply` is the API half (the conductor); `mint` and `init`
get a house started. The rest are declared here so the shape is fixed from
the first release, and each says which release builds it."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from . import __version__
from . import theme as theme_lib
from .errors import HouseError
from .house import House, load_house
from .packs import product_packs
from .profiles import known_profiles
from .render import render
from .secrets import dump_secrets, load_secrets, mint

WITNESS = Path(__file__).parents[2] / "examples" / "maison-temoin" / "home.yml"

# verb → (what it will do, the release that builds it)
NOT_YET = {
    "backup": ("Home Assistant's own backup, now, through its API", "0.8"),
    "restore": ("Home Assistant's own backup file, restored through its API", "0.8"),
    "doctor": (
        "the brain's health: the units, the pins against the tested ones, what drifted",
        "0.8",
    ),
    "suggest": (
        "the mesh's opinion on rooms, from link quality — suggests, never assigns",
        "0.8 — it reads a walked mesh, so it follows the walk",
    ),
    "migrate": ("move a home.yml to the current schema", "with the first schema bump"),
}


def _secrets_arg(p: argparse.ArgumentParser) -> None:
    p.add_argument(
        "--secrets", type=Path, help="a YAML file of name: value (REGIE_SECRET_<NAME> overrides)"
    )


def cmd_check(args) -> int:
    house = load_house(args.home)
    secrets = load_secrets(args.secrets)
    report(house, secrets)
    if args.strict and house.warnings:
        print(f"regie: {len(house.warnings)} warning(s) with --strict", file=sys.stderr)
        return 1
    return 0


def report(house: House, secrets: dict) -> None:
    h = house.data["house"]
    print(f"{h['name']} — {h['label']} ({h.get('lang', 'en')}, {h.get('timezone', 'UTC')})")
    packs = (
        ", ".join(f"{p.name}{' (house)' if p.origin == 'house' else ''}" for p in house.packs)
        or "none"
    )
    print(f"profile {house.profile.name} · packs {packs}")
    kinds = ", ".join(f"{k} {n}" for k, n in sorted(house.by_kind().items()))
    admins = sum(1 for p in house.people if p.get("admin"))
    print(
        f"{len(house.areas)} areas · {len(house.things)} things ({kinds}) · "
        f"{len(house.people)} people ({admins} admin)"
    )
    for c in house.coordinators():
        print(
            f"zigbee {c['id']}: tcp://{c['host']}:{c['port']} ({c['adapter']}), "
            f"channel {house.data.get('zigbee', {}).get('channel', 25)}, "
            f"{len(c['things'])} paired, {len(c['groups'])} room groups, topic {c['base_topic']}"
        )
    print("mqtt users: " + ", ".join(u["name"] for u in house.mqtt_users()))
    c = house.controls()
    if "controls" in house.data:
        print(
            "controls: "
            + " · ".join(f"{k.replace('_', '-')} {'on' if v else 'off'}" for k, v in c.items())
        )
    skin = house.theme()
    if skin:
        raw = house.data["house"]["theme"]
        shelf = ", ".join(sorted(theme_lib.library()))
        origin = f"{raw['use']} from the library" if raw.get("use") else "the house's own"
        repaint = sorted(k for k in raw if k not in ("use", "name"))
        print(
            f"theme: {skin['name']} — {origin}"
            + (f", repainting {', '.join(repaint)}" if repaint else "")
            + f" (library: {shelf})"
        )
    if house.has_pack("matter"):
        matter = [t for t in house.things if t["via"] in ("matter", "thread")]
        keyed = sum(1 for t in matter if t.get("serial"))
        print(
            f"matter: the server beside the brain (ws://localhost:5580/ws), "
            f"{len(matter)} thing(s), {keyed} keyed by serial"
        )
    if house.thread_network_name():
        thread = house.data.get("thread", {})
        for b in house.border_routers():
            print(
                f"thread {b['id']}: {b['url']} (REST), network "
                f"{house.thread_network_name()}"
                + (f", channel {thread['channel']}" if thread.get("channel") else "")
                + f", {sum(1 for t in house.things if t['via'] == 'thread')} thing(s)"
            )

    pins = house.pins()
    plan = house.plan()
    if plan:
        from .floorplan import placements, rooms_drawn

        drawn = rooms_drawn(house)
        placed = sum(len(placements(house, a)[0]) for a in drawn)
        left = sum(len(placements(house, a)[1]) for a in drawn)
        print(
            f"plan: {plan['size'][0]} × {plan['size'][1]} cm, {len(drawn)} room(s) drawn, "
            f"{placed} thing(s) placed"
            + (f", {left} with a role and no point" if left else "")
            + (f", the drawing {plan['image']}" if plan.get("image") else "")
        )
    print("pins: " + ", ".join(f"{k} {v}" for k, v in pins.items()))
    names = house.secret_names()
    missing = [n for n in names if n not in secrets]
    if missing:
        print(f"secrets: {len(names)} needed, {len(missing)} missing — " + ", ".join(missing))
    else:
        print(f"secrets: {len(names)} needed, all present")
    vocabulary(house)
    if house.warnings:
        print("warnings:")
        for w in house.warnings:
            print(f"  - {w}")
    if house.hints:
        print("hints:")
        for h in house.hints:
            print(f"  - {h}")
    print("ok")


def vocabulary(house: House) -> None:
    """The words the house writes, resolved by role — what renders, what waits."""
    from .fx import compile_all

    m = house.modes()
    if m:
        periods = ", ".join(f"{p['id']} {p['time']}" for p in m["periods"])
        print(
            f"modes: {', '.join(x['id'] for x in m['modes'])} (initial {m['initial']}) · "
            f"periods {periods or 'none'} · clock {len(m['clock'])} rule(s) · "
            f"daylight dark < {m['daylight']['dark_below']}°, "
            f"bright > {m['daylight']['bright_above']}°"
        )
    for a in house.areas:
        declared = house.declared_roles(a)
        if not declared and not a.get("scenes") and not a.get("defaults"):
            continue
        filled = house.roles_in(a["id"])
        roles = " ".join(
            r + (f"({len(spec['layout'])} places)" if spec.get("layout") else "")
            for r, spec in declared.items()
        )
        scripts = sorted(house.rendered_scenes(a))
        line = (
            f"room {a['id']} « {a['label']} »: roles {roles or '—'} · "
            f"filled {' '.join(filled) or 'none'}"
        )
        if a.get("scenes"):
            line += f" · scenes {' '.join(a['scenes'])} → scripts {' '.join(scripts) or 'none yet'}"
        if a.get("defaults"):
            line += " · defaults per period"
        print(line)
    if house.has_pack("fx"):
        scripts, notes, backend = compile_all(house.fx(), house.data["house"]["label"])
        print(
            f"fx: backend {backend['name']} (step {backend['envelope'].get('step', 0)} s) · "
            f"{len(scripts)} script(s): {', '.join(s[3:] for s in scripts)}"
        )
        for n in notes:
            print(f"  ~ {n}")
    if house.scenarios:
        print(f"scenarios: {', '.join(s['id'] for s in house.scenarios)}")
    if house.included:
        parts = [f"{k} {len(v)} file(s)" for k, v in house.included.items() if v]
        if parts:
            print("included: " + ", ".join(parts))


def cmd_render(args) -> int:
    house = load_house(args.home)
    secrets = load_secrets(args.secrets)
    out = Path(args.out) if args.out else Path(house.root())
    result = render(house, out, secrets)
    print(
        f"rendered {out}: {len(result.written)} written, {len(result.unchanged)} unchanged, "
        f"{len(result.kept)} kept, {len(result.removed)} removed"
    )
    for p in result.written:
        print(f"  + {p.relative_to(out)}")
    for p in result.removed:
        print(f"  - {p.relative_to(out)}")
    for w in house.warnings:
        print(f"  ! {w}")
    for h in house.hints:
        print(f"  ~ {h}")
    return 0


def cmd_up(args) -> int:
    from .host import Runner
    from .up import up

    house = load_house(args.home)
    root = Path(args.root) if args.root else Path(house.root())
    units_dir = Path(args.units_dir) if args.units_dir else Path(house.units_dir())
    result = up(house, root, units_dir, Runner(check=args.check), timeout=args.timeout)
    print(result.summary())
    for what, items in (
        ("placed", result.placed),
        ("removed", result.removed),
        ("pulled", result.pulled),
        ("restarted", result.restarted),
        ("started", result.started),
    ):
        for i in items:
            print(f"  {what}: {i}")
    return 0


def cmd_apply(args) -> int:
    from .apply import apply, summary
    from .ha import HomeAssistant

    house = load_house(args.home)
    secrets = load_secrets(args.secrets)
    root = Path(args.root) if args.root else Path(house.root())
    steps = apply(house, secrets, root, HomeAssistant(args.url), args.check)
    for st in steps:
        print(st.line())
    print(summary(steps, args.check))
    return 0


def cmd_look(args) -> int:
    """A look tried on the real ceiling, written down: the room's lights as
    they are right now, in the house's grammar, to paste under `scenes:`."""
    from .apply import Conductor
    from .ha import HomeAssistant
    from .look import room_look, snippet

    house = load_house(args.home)
    secrets = load_secrets(args.secrets)
    root = Path(args.root) if args.root else Path(house.root())
    area = house.area(args.room)
    ha = HomeAssistant(args.url)
    Conductor(house, secrets, root, ha).session_token()

    def read(entity: str) -> dict | None:
        status, data = ha.get(f"/api/states/{entity}")
        return data if status == 200 and isinstance(data, dict) else None

    look, notes = room_look(house, area, read)
    for n in notes:
        print(f"# {n}")
    if not look:
        print(f"# {area['id']}: no light of a role answered — nothing to write")
        return 1
    print(f"# {area['label']} — as the lights are now; paste under rooms/{area['id']}.yml")
    print(snippet(args.name, look, args.label), end="")
    return 0


def cmd_plan(args) -> int:
    """The plan's workbench: `push` re-seeds the editor's draft from the files
    (what `apply` does at every converge unless the draft holds edits not yet
    pulled - `push` does it regardless, and says so); `pull` writes the draft
    back into the room files' `plan:` blocks."""
    from .apply import Conductor
    from .dash import link
    from .ha import HomeAssistant
    from .plan import (
        WORKBENCH,
        find_card,
        pull,
        pull_walls,
        rewrite,
        rewrite_walls,
        room_files,
        seed,
    )

    house = load_house(args.home)
    secrets = load_secrets(args.secrets)
    root = Path(args.root) if args.root else Path(house.root())
    ha = HomeAssistant(args.url)
    Conductor(house, secrets, root, ha).session_token()
    if house.plan() is None:
        print("the house draws no plan (plan: in home.yml, plan: in a room) — nothing to do")
        return 1
    with ha.ws() as ws:
        if args.what == "push":
            seed(ws, house, root, link)
            print(f"/{WORKBENCH}: seeded from the files — the draft it held is gone")
            return 0
        try:
            config = ws.call("lovelace/config", url_path=WORKBENCH)
        except HouseError as exc:
            print(f"/{WORKBENCH}: {exc} — `regie apply` opens it, `regie plan push` seeds it")
            return 1
    card = find_card(config or {})
    if not card:
        print(f"/{WORKBENCH} holds no plan card — `regie plan push` seeds it")
        return 1
    blocks, notes = pull(house, card)
    files = room_files(house, args.rooms)
    for n in notes:
        print(f"  ~ {n}")
    changed = 0
    for rid, plan in blocks.items():
        if rid not in files:
            print(f"  ! {rid}: no room file to write (rooms/{rid}.yml)")
            continue
        if rewrite(files[rid], plan):
            changed += 1
            print(f"  + {files[rid].name}: plan written")
        else:
            print(f"  = {files[rid].name}: unchanged")
    walls = pull_walls(card)
    plan_file = args.plan or (house.included.get("plan") or [None])[0]
    if walls and plan_file:
        if rewrite_walls(Path(plan_file), walls):
            changed += 1
            print(f"  + {Path(plan_file).name}: {len(walls)} wall(s) written")
        else:
            print(f"  = {Path(plan_file).name}: walls unchanged")
    elif walls:
        print(
            f"  ~ {len(walls)} wall(s) drawn and no plan file to hold them — "
            "`include: plan: plan.yml` in home.yml, or --plan FILE"
        )
    print(f"pull: {changed} file(s) written, {len(notes)} note(s)")
    return 0


def cmd_link(args) -> int:
    """The flow walked with a person at hand: a PIN read off the screen, a
    consent given in a browser (the address printed here; the brain's own
    callback finishes it)."""
    from .apply import Step, link
    from .ha import HomeAssistant

    house = load_house(args.home)
    secrets = load_secrets(args.secrets)
    root = Path(args.root) if args.root else Path(house.root())
    ha = HomeAssistant(args.url)

    def prompt(field: str, flow: dict) -> str:
        name = (flow.get("description_placeholders") or {}).get("name") or args.thing
        return input(f"{name} shows a {field.replace('_', ' ')} on its screen — type it: ").strip()

    def on_url(url: str) -> None:
        print(
            "open this address in a browser, logged in with the vendor's account, and give "
            f"the consent (the brain's callback finishes the flow, {args.timeout}s at most):\n"
            f"  {url}"
        )

    def wait_external(flow_id: str) -> bool:
        with ha.ws() as ws:
            sub = ws.subscribe("data_entry_flow_progressed")
            for event in ws.events(sub, args.timeout):
                if (event.get("data") or {}).get("flow_id") == flow_id:
                    return True
        return False

    out = link(
        house,
        secrets,
        root,
        ha,
        args.thing,
        prompt=prompt,
        on_url=on_url,
        wait_external=wait_external,
    )
    print(Step(f"entry {args.thing}", out.state, out.detail).line())
    return 0 if out.state in ("changed", "ok") else 1


def cmd_pair(args) -> int:
    """The walk: the room is the session, the thing introduces itself, the row
    is printed for the house's file. Its Zigbee half (0.7) opens the radio's
    join window and reads the interview; its Matter half (0.5) adopts what the
    phone (or a code) commissioned."""
    from .ha import HomeAssistant

    house = load_house(args.home)
    secrets = load_secrets(args.secrets)
    root = Path(args.root) if args.root else Path(house.root())
    if not args.matter:
        from .apply import pair_zigbee

        row = pair_zigbee(
            house,
            secrets,
            root,
            HomeAssistant(args.url),
            room=args.room,
            role=args.role,
            at=args.at,
            thing_id=args.id,
            coordinator=args.coordinator,
            seconds=args.time,
            adopt=args.adopt,
            anywhere=args.anywhere,
            say=lambda line: print(line, flush=True),
        )
        found = row.pop("_found")
        print(
            f"paired: {found['description'] or found['name']} — {found['type']}"
            + (f", {found['power']}" if found["power"] else "")
            + (", bindable" if found["bindable"] else "")
        )
        print("  it exposes: " + (", ".join(found["exposes"]) or "nothing"))
        if found["supported"] is False:
            print(
                "  NOT in Zigbee2MQTT's database: it is paired, but its capabilities are "
                "generic — check the model's page before counting on it"
            )
        say_row(row)
        return 0
    from .apply import pair_matter

    row = pair_matter(
        house,
        secrets,
        root,
        HomeAssistant(args.url),
        room=args.room,
        role=args.role,
        at=args.at,
        code=args.code,
        serial=args.serial,
        thing_id=args.id,
        only_fabric=args.only_fabric,
    )
    found = row.pop("_found")
    print(
        f"adopted: {found['device']} — entities {', '.join(found['entities']) or 'none yet'}"
        + (f" — at {', '.join(found['addresses'])}" if found["addresses"] else "")
    )
    if found["evicted"]:
        print(f"evicted: {', '.join(found['evicted'])} — the brain's fabric is the only one")
    if found["other_fabrics"]:
        print(
            f"also on: {', '.join(found['other_fabrics'])} — another controller keeps a fabric "
            "on it (--only-fabric removes them)"
        )
    say_row(row)
    return 0


def say_row(row: dict) -> None:
    print("the proposed row (add it to home.yml's things, then `regie apply`):")
    fields = ", ".join(f"{k}: {_yaml_scalar(v)}" for k, v in row.items())
    print(f"  - {{ {fields} }}")


def _yaml_scalar(value) -> str:
    if isinstance(value, list):
        return "[" + ", ".join(_yaml_scalar(v) for v in value) + "]"
    text = str(value)
    if text and all(c.isalnum() or c in "_-" for c in text) and not text[0].isdigit():
        return text
    return '"' + text.replace('"', '\\"') + '"'


def cmd_mint(args) -> int:
    house = load_house(args.home)
    existing = load_secrets(args.secrets) if args.secrets and args.secrets.exists() else {}
    out: Path = args.out or args.secrets or (args.home.parent / "secrets.yml")
    minted = []
    for name in house.secret_names():
        if name not in existing:
            existing[name] = mint(name)
            minted.append(name)
    out.write_text(dump_secrets(existing), encoding="utf-8")
    out.chmod(0o600)
    print(
        f"{out}: {len(minted)} minted"
        + (" — " + ", ".join(minted) if minted else ", nothing missing")
    )
    return 0


def cmd_init(args) -> int:
    target = Path(args.dir)
    home = target / "home.yml"
    if home.exists():
        raise HouseError(f"{home} exists — init writes only into an empty place")
    target.mkdir(parents=True, exist_ok=True)
    home.write_text(
        f"""# a house, for La Régie — see the witness house for one thing of every kind
schema: 1
house:
  name: {args.name}
  label: {args.label}
  lang: {args.lang}
  timezone: {args.timezone}
profile: {args.profile}
packs: [lighting]
zigbee:
  channel: 25
  coordinators:
    - {{ id: main, thing: coordinator_main }}
areas:
  - {{ id: living, label: Living room }}
things:
  - {{ id: coordinator_main, area: living, kind: coordinator, via: lan, host: 192.0.2.10 }}
  # the walk adds the rest: `regie pair --room living`
""",
        encoding="utf-8",
    )
    house = load_house(home)
    secrets = target / "secrets.yml"
    secrets.write_text(dump_secrets({n: mint(n) for n in house.secret_names()}), encoding="utf-8")
    secrets.chmod(0o600)
    print(f"{home} and {secrets} written — edit the first, keep the second in your store")
    return 0


def cmd_packs(args) -> int:
    from .packs import _load

    for name, path in product_packs().items():
        p = _load(name, path, "product")
        print(f"{name}: {p.summary} (kinds: {', '.join(p.kinds) or '—'})")
    return 0


def cmd_profiles(args) -> int:
    from .profiles import load_profile

    for name in known_profiles():
        print(f"{name}: {load_profile(name).summary}")
    return 0


def cmd_not_yet(args) -> int:
    what, release = NOT_YET[args.verb]
    print(f"regie {args.verb}: not built yet — it lands in {release}.\n  {what}", file=sys.stderr)
    return 2


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="regie", description="La Régie — a smart home as files.")
    p.add_argument("--version", action="version", version=f"regie {__version__}")
    sub = p.add_subparsers(dest="verb", required=True, metavar="verb")

    s = sub.add_parser(
        "check", help="validate a home.yml: the schema, the packs, the references; the plan"
    )
    s.add_argument("home", type=Path)
    _secrets_arg(s)
    s.add_argument("--strict", action="store_true", help="a warning fails the check")
    s.set_defaults(func=cmd_check)

    s = sub.add_parser("render", help="write the units and the config tree into a directory")
    s.add_argument("home", type=Path)
    s.add_argument(
        "--out", type=Path, help="the directory (default: the house's root; or a staging one)"
    )
    _secrets_arg(s)
    s.set_defaults(func=cmd_render)

    s = sub.add_parser(
        "up", help="the rendered brain running on this host: units placed, images pulled, started"
    )
    s.add_argument("home", type=Path)
    s.add_argument("--root", type=Path, help="where render wrote (default: the house's root)")
    s.add_argument("--units-dir", type=Path, help="where the units go (default: the profile's)")
    s.add_argument("--check", action="store_true", help="print the plan, change nothing")
    s.add_argument(
        "--timeout", type=int, default=300, help="seconds to wait for a (re)started service"
    )
    s.set_defaults(func=cmd_up)

    s = sub.add_parser(
        "apply",
        help="the conductor: onboarding, tokens, the proxy, floors and areas, the backup "
        "schedule, the things' integrations — what only the API can set",
    )
    s.add_argument("home", type=Path)
    _secrets_arg(s)
    s.add_argument("--root", type=Path, help="the brain's root (tokens live under it)")
    s.add_argument("--url", default="http://127.0.0.1:8123", help="the brain's own address")
    s.add_argument("--check", action="store_true", help="print the plan, change nothing")
    s.set_defaults(func=cmd_apply)

    s = sub.add_parser(
        "link",
        help="a thing's integration set up with a person at hand: the PIN its screen shows, "
        "the consent a browser gives — what apply reports as `by hand`",
    )
    s.add_argument("home", type=Path)
    s.add_argument("thing", help="the thing's id in home.yml")
    _secrets_arg(s)
    s.add_argument("--root", type=Path, help="the brain's root (the conductor's token)")
    s.add_argument("--url", default="http://127.0.0.1:8123", help="the brain's own address")
    s.add_argument(
        "--timeout", type=int, default=600, help="seconds to wait for a consent's callback"
    )
    s.set_defaults(func=cmd_link)

    s = sub.add_parser(
        "pair",
        help="the walk. --matter: a thing commissioned by the phone (or by --code) adopted "
        "into a proposed row — the room is the session, the role and the place the flags, "
        "the serial the key. The Zigbee half: 0.7",
    )
    s.add_argument("home", type=Path)
    s.add_argument("--matter", action="store_true", help="the Matter half of the walk")
    s.add_argument(
        "--time",
        type=int,
        default=254,
        help="how long the Zigbee join window stays open, in seconds (default 254, the most a "
        "radio allows); it is closed again whatever happens",
    )
    s.add_argument(
        "--coordinator", help="which radio to walk (default: the house's first coordinator)"
    )
    s.add_argument(
        "--anywhere",
        action="store_true",
        help="open the join window on every router, not the coordinator's radio alone (for a "
        "thing the coordinator cannot reach; a remote joined through a router keeps its "
        "buttons to itself)",
    )
    s.add_argument(
        "--adopt",
        help="a thing ALREADY in the mesh that no row names, by address or name — writes its "
        "row without a new join (an interrupted walk)",
    )
    s.add_argument("--room", required=True, help="the area the thing is in (the session)")
    s.add_argument("--role", help="what it is for in its room (main, lamp, wall...)")
    s.add_argument("--at", help="its place in the role's layout (left, front_right...)")
    s.add_argument(
        "--code",
        help="a Matter pairing code (11 digits, or MT:...) — the server commissions the "
        "thing over IP: a device another controller shares, or one already on the network",
    )
    s.add_argument(
        "--serial", help="which device, when several are not named yet (a serial or an address)"
    )
    s.add_argument(
        "--only-fabric",
        action="store_true",
        help="remove every other fabric on the node (the phone's commissioning stack leaves "
        "one of its own) — the brain is its only controller",
    )
    s.add_argument("--id", help="the row's id (default: <room>_<role>[_<at>] or <room>_<kind>_<n>)")
    _secrets_arg(s)
    s.add_argument("--root", type=Path, help="the brain's root (the conductor's token)")
    s.add_argument("--url", default="http://127.0.0.1:8123", help="the brain's own address")
    s.set_defaults(func=cmd_pair)

    s = sub.add_parser(
        "look",
        help="a look tried on the real ceiling, written down: the room's lights as they are "
        "now, by role and by place, in the house's grammar — to paste under scenes: (0.13)",
    )
    s.add_argument("home", type=Path)
    s.add_argument("--room", required=True, help="the room (an area id)")
    s.add_argument("--name", default="essai", help="the look's id under scenes: (default essai)")
    s.add_argument("--label", help="the look's label, if it should carry one")
    _secrets_arg(s)
    s.add_argument("--root", type=Path, help="the brain's root (the conductor's token)")
    s.add_argument("--url", default="http://127.0.0.1:8123", help="the brain's own address")
    s.set_defaults(func=cmd_look)

    s = sub.add_parser(
        "plan",
        help="the plan's workbench (0.14): `push` seeds the editor's draft from the files "
        "(apply does it at every converge unless the draft holds edits not yet pulled), "
        "`pull` writes the draft back into the room files' plan: blocks",
    )
    s.add_argument("what", choices=["push", "pull"])
    s.add_argument("home", type=Path)
    s.add_argument(
        "--rooms", type=Path, help="the room files to rewrite (default: the house's own include)"
    )
    s.add_argument(
        "--plan", type=Path, help="the plan file whose walls to rewrite (default: include.plan)"
    )
    _secrets_arg(s)
    s.add_argument("--root", type=Path, help="the brain's root (the conductor's token)")
    s.add_argument("--url", default="http://127.0.0.1:8123", help="the brain's own address")
    s.set_defaults(func=cmd_plan)

    s = sub.add_parser("mint", help="write every secret the house needs and does not have yet")
    s.add_argument("home", type=Path)
    _secrets_arg(s)
    s.add_argument(
        "--out",
        type=Path,
        help="where to write (default: the --secrets file, or secrets.yml beside home.yml)",
    )
    s.set_defaults(func=cmd_mint)

    s = sub.add_parser("init", help="a starter home.yml and its secrets, in an empty directory")
    s.add_argument("dir", nargs="?", default=".")
    s.add_argument("--name", default="home")
    s.add_argument("--label", default="Home")
    s.add_argument("--lang", default="en")
    s.add_argument("--timezone", default="UTC")
    s.add_argument("--profile", default="ct", choices=known_profiles())
    s.set_defaults(func=cmd_init)

    s = sub.add_parser("packs", help="the product's packs")
    s.set_defaults(func=cmd_packs)
    s = sub.add_parser("profiles", help="the product's profiles")
    s.set_defaults(func=cmd_profiles)

    for verb, (what, release) in NOT_YET.items():
        s = sub.add_parser(verb, help=f"[{release}] {what}")
        s.add_argument("args", nargs=argparse.REMAINDER)
        s.set_defaults(func=cmd_not_yet)
    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args, rest = parser.parse_known_args(argv)
    if rest and args.verb not in NOT_YET:
        parser.error(f"unrecognized arguments: {' '.join(rest)}")
    try:
        return args.func(args)
    except HouseError as exc:
        print(f"regie: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
