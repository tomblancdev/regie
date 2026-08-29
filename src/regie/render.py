"""The files half: the units (the profile's) and the config tree (the base's
and the packs') rendered into one directory, from the house and the secret
values. The renderer marks what it writes (a manifest) so a later render
removes what the house no longer names — and never touches what it did not
write."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, PrefixLoader, StrictUndefined

from . import __version__
from .errors import HouseError
from .house import House
from .secrets import mosquitto_hash

BASE = Path(__file__).parent / "base"
MANIFEST = ".regie/manifest.json"


def to_yaml(value) -> str:
    """A scalar or a flow-style collection, as YAML — quoted only when it must be."""
    text = yaml.safe_dump(value, default_flow_style=True, allow_unicode=True, width=10**6)
    if text.endswith("...\n"):
        text = text[:-4]
    return text.strip()


@dataclass
class Rendered:
    written: list[Path] = field(default_factory=list)
    unchanged: list[Path] = field(default_factory=list)
    kept: list[Path] = field(default_factory=list)
    removed: list[Path] = field(default_factory=list)


def base_plan() -> list[dict]:
    return yaml.safe_load((BASE / "base.yml").read_text(encoding="utf-8"))["templates"]


def base_components() -> dict:
    """The custom components the product pins (base.yml), by domain."""
    return yaml.safe_load((BASE / "base.yml").read_text(encoding="utf-8")).get("components", {})


def make_env(house: House) -> Environment:
    loaders = {
        "base": FileSystemLoader(str(BASE / "templates")),
        "profile": FileSystemLoader(str(house.profile.templates_dir)),
    }
    for p in house.packs:
        loaders[f"pack/{p.name}"] = FileSystemLoader(str(p.templates_dir))
    env = Environment(
        loader=PrefixLoader(loaders, delimiter=":"),
        undefined=StrictUndefined,
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
        autoescape=False,
    )
    env.filters["to_yaml"] = to_yaml
    env.filters["mosquitto_hash"] = mosquitto_hash
    return env


def context(house: House, secrets: dict) -> dict:
    return {
        "house": house,
        "data": house.data,
        "labels": house.labels,
        "profile": house.profile,
        "pins": house.pins(),
        "images": house.profile.images,
        "root": house.root(),
        "secrets": secrets,
        "version": __version__,
        "entity": house.entity,
        "coordinators": house.coordinators(),
        "mqtt_users": house.mqtt_users(),
        "areas": house.areas,
        "things": house.things,
        "people": house.people,
    }


def each_items(house: House, each: str | None) -> list[tuple[str | None, dict | None]]:
    if each is None:
        return [(None, None)]
    if each == "coordinators":
        return [("coordinator", c) for c in house.coordinators()]
    if each == "areas":
        return [("area", a) for a in house.areas]
    raise HouseError(f"a template's `each` must be coordinators or areas, not {each!r}")


def item_context(house: House, key: str | None, item: dict | None, index: int) -> dict:
    ctx: dict = {"index": index}
    if key:
        ctx[key] = item
    if key == "area" and item is not None:
        ctx["area_things"] = house.things_in(item["id"])
        ctx["kinds"] = house.kinds_in(item["id"])
    return ctx


def _render_cards(env: Environment, house: House, ctx: dict) -> list[str]:
    cards = []
    for p in house.packs:
        for c in p.cards:
            for i, (key, item) in enumerate(each_items(house, c.get("each"))):
                text = env.get_template(f"pack/{p.name}:{c['src']}").render(
                    ctx, **item_context(house, key, item, i)
                )
                if text.strip():
                    cards.append(text.strip("\n"))
    return cards


def _owner_uid(house: House, t: dict) -> int | None:
    """The uid a template's `owner` resolves to - only when the engine can chown
    (root on the host); elsewhere (tests, a staging render) the file stays ours."""
    name = t.get("owner")
    if not name or os.geteuid() != 0:
        return None
    uid = house.profile.users.get(name)
    if uid is None:
        raise HouseError(
            f"{t['dst']}: owner {name!r} is not a user profile {house.profile.name} names"
        )
    return int(uid)


def plan(house: House) -> list[tuple[str, dict]]:
    items = [("base", t) for t in base_plan()]
    items += [("profile", t) for t in house.profile.templates]
    for p in house.packs:
        items += [(f"pack/{p.name}", t) for t in p.templates]
    return items


def render(house: House, out: Path, secrets: dict) -> Rendered:
    out = Path(out)
    missing = [n for n in house.secret_names() if n not in secrets]
    if missing:
        raise HouseError(
            "missing secrets: " + ", ".join(missing) + " — `regie mint` writes fresh ones, "
            "`--secrets FILE` or REGIE_SECRET_<NAME> hands them over"
        )
    env = make_env(house)
    ctx = context(house, secrets)
    ctx["cards"] = _render_cards(env, house, ctx)

    manifest_path = out / MANIFEST
    previous: set[str] = set()
    if manifest_path.is_file():
        previous = set(json.loads(manifest_path.read_text(encoding="utf-8")).get("files", []))

    result = Rendered()
    current: set[str] = set()
    for prefix, t in plan(house):
        for i, (key, item) in enumerate(each_items(house, t.get("each"))):
            ictx = item_context(house, key, item, i)
            rel = env.from_string(t["dst"]).render(ctx, **ictx)
            text = env.get_template(f"{prefix}:{t['src']}").render(ctx, **ictx)
            if not text.strip():
                continue  # nothing to say for this item (a room without lights)
            target = out / rel
            current.add(rel)
            if t.get("keep") and target.exists():
                result.kept.append(target)
                continue
            mode = int(t.get("mode", "0644"), 8)
            uid = _owner_uid(house, t)
            if (
                target.exists()
                and target.read_text(encoding="utf-8") == text
                and (target.stat().st_mode & 0o777) == mode
                and (uid is None or target.stat().st_uid == uid)
            ):
                result.unchanged.append(target)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(text, encoding="utf-8")
            target.chmod(mode)
            if uid is not None:
                os.chown(target, uid, uid)
            result.written.append(target)

    for rel in sorted(previous - current):
        stale = out / rel
        if stale.is_file():
            stale.unlink()
            result.removed.append(stale)

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps({"engine": __version__, "files": sorted(current)}, indent=2) + "\n",
        encoding="utf-8",
    )
    return result
