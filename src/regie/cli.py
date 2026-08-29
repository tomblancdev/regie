"""regie — the one CLI. `check` and `render` are the files half, built;
`mint` and `init` get a house started; the rest are declared here so the
shape is fixed from the first release, and each says which release builds it."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from . import __version__
from .errors import HouseError
from .house import House, load_house
from .packs import product_packs
from .profiles import known_profiles
from .render import render
from .secrets import dump_secrets, load_secrets, mint

WITNESS = Path(__file__).parents[2] / "examples" / "maison-temoin" / "home.yml"

# verb → (what it will do, the release that builds it)
NOT_YET = {
    "up": ("start the rendered brain on this host (the profile's runtime)", "0.2 — the brain"),
    "apply": (
        "the conductor — what only the APIs can set: onboarding, tokens, the integrations' "
        "config entries, the registries (areas, names), Zigbee names, groups and bindings, "
        "the backup schedule; a plan under --check",
        "0.2 — the brain",
    ),
    "backup": ("Home Assistant's own backup, through its API", "0.2 — the brain"),
    "restore": ("Home Assistant's own backup file, restored through its API", "0.2 — the brain"),
    "doctor": (
        "the brain's health: the units, the pins against the tested ones, what drifted",
        "0.2 — the brain",
    ),
    "pair": (
        "the walk — `pair --room <area>`: open the join window, turn each interview into a row "
        "(the room is the session, the kind is the thing's own, the name is generated)",
        "0.3 — the walk",
    ),
    "suggest": (
        "the mesh's opinion on rooms, from link quality — suggests, never assigns",
        "0.3 — the walk",
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
    pins = house.pins()
    print("pins: " + ", ".join(f"{k} {v}" for k, v in pins.items()))
    names = house.secret_names()
    missing = [n for n in names if n not in secrets]
    if missing:
        print(f"secrets: {len(names)} needed, {len(missing)} missing — " + ", ".join(missing))
    else:
        print(f"secrets: {len(names)} needed, all present")
    if house.warnings:
        print("warnings:")
        for w in house.warnings:
            print(f"  - {w}")
    print("ok")


def cmd_render(args) -> int:
    house = load_house(args.home)
    secrets = load_secrets(args.secrets)
    result = render(house, args.out, secrets)
    print(
        f"rendered {args.out}: {len(result.written)} written, {len(result.unchanged)} unchanged, "
        f"{len(result.kept)} kept, {len(result.removed)} removed"
    )
    for p in result.written:
        print(f"  + {p.relative_to(args.out)}")
    for p in result.removed:
        print(f"  - {p.relative_to(args.out)}")
    for w in house.warnings:
        print(f"  ! {w}")
    return 0


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
        "--out", type=Path, required=True, help="the directory (the brain's root, or a staging one)"
    )
    _secrets_arg(s)
    s.set_defaults(func=cmd_render)

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
