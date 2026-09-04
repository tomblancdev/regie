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

from . import __version__, dash
from . import theme as skin
from .errors import HouseError
from .fx import compile_all
from .house import DAYLIGHT, House
from .secrets import mosquitto_hash

BASE = Path(__file__).parent / "base"
MANIFEST = ".regie/manifest.json"


def to_yaml(value) -> str:
    """A scalar or a flow-style collection, as YAML — quoted only when it must be."""
    text = yaml.safe_dump(value, default_flow_style=True, allow_unicode=True, width=10**6)
    if text.endswith("...\n"):
        text = text[:-4]
    return text.strip()


def to_block(value, indent: int = 0) -> str:
    """A structure the engine built (a script, an automation), as block YAML,
    keys in the order they were given, indented under the template's key."""
    text = yaml.safe_dump(
        value, default_flow_style=False, allow_unicode=True, sort_keys=False, width=10**6
    )
    pad = " " * indent
    return "".join(pad + line if line.strip() else line for line in text.splitlines(True)).rstrip(
        "\n"
    )


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


def base_default_config() -> list[str]:
    """What Home Assistant's `default_config:` loads at the version the product
    tests against (base.yml) - rendered explicitly when a house drops `my`."""
    return yaml.safe_load((BASE / "base.yml").read_text(encoding="utf-8")).get("default_config", [])


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
    env.filters["to_block"] = to_block
    env.filters["mosquitto_hash"] = mosquitto_hash
    return env


def context(house: House, secrets: dict) -> dict:
    fx_scripts = {}
    if house.has_pack("fx"):
        fx_scripts, _notes, _backend = compile_all(house.fx(), house.data["house"]["label"])
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
        "dashboard_url": dash.URL_PATH,
        "theme": house.theme(),
        "theme_name": (house.theme() or {}).get("name"),
        "theme_file": skin.build(house.theme()) if house.theme() else None,
        "font_faces": skin.font_faces(house.theme()) if house.theme() else [],
        # the plan (0.13): the frame, and the drawing's own file name under www/
        "plan": house.plan(),
        "plan_image": ((house.plan() or {}).get("image") or "").rsplit("/", 1)[-1],
        "default_config": base_default_config(),
        "entity": house.entity,
        "coordinators": house.coordinators(),
        "mqtt_users": house.mqtt_users(),
        "areas": house.areas,
        "things": house.things,
        "people": house.people,
        # the vocabulary, resolved by role (house.py)
        "modes": house.modes(),
        "fx": house.fx(),
        "fx_scripts": fx_scripts,
        "scenarios": house.scenarios,
        "daylight": DAYLIGHT,
        "declared_roles": house.declared_roles,
        "roles_in": house.roles_in,
        "role_target": house.role_target,
        "layout_groups": house.layout_groups,
        "place_labels": house.place_labels,
        "scene_plan": house.scene_plan,
        "drift_plan": house.drift_plan,
        "when_plan": house.when_plan,
        "rendered_scenes": house.rendered_scenes,
        "defaults_of": house.defaults_of,
        "mode_scene": house.mode_scene,
        "area_aliases": house.area_aliases,
        "controls": house.controls(),
        "look_options": house.look_options,
        "defaults_base": house.defaults_base,
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
        ctx["roles"] = house.roles_in(item["id"])
    return ctx


def _pack_cards(
    env: Environment, house: House, ctx: dict, kind: str
) -> tuple[list[dict], dict[str, list[dict]]]:
    """What the packs put on the dashboard, PARSED — a card contributed with no
    `each` belongs to the house (the top of the first page, or of the settings
    page); one contributed `each: areas` belongs to that room's page. They come
    back as structures because the dashboard is built as one (dash.py), and a
    pack whose YAML does not load says so here rather than in the family's
    browser."""
    house_cards: list[dict] = []
    room_cards: dict[str, list[dict]] = {}
    for p in house.packs:
        for c in p.cards if kind == "cards" else p.settings:
            for i, (key, item) in enumerate(each_items(house, c.get("each"))):
                text = env.get_template(f"pack/{p.name}:{c['src']}").render(
                    ctx, **item_context(house, key, item, i)
                )
                if not text.strip():
                    continue
                try:
                    loaded = yaml.safe_load(text)
                except yaml.YAMLError as exc:
                    raise HouseError(f"pack {p.name}: {c['src']} is not YAML — {exc}") from exc
                cards = loaded if isinstance(loaded, list) else [loaded]
                if item is None:
                    house_cards += cards
                else:
                    room_cards.setdefault(item["id"], []).extend(cards)
    return house_cards, room_cards


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
    # `when:` is honoured for the base's rows too — it never was until the skin
    # gave the base its first conditional row (0.10), and an unfiltered base row
    # renders its `dst` against a house that does not have what it names
    items = [("base", t) for t in base_plan() if house.wanted(t)]
    items += [("profile", t) for t in house.profile.templates if house.wanted(t)]
    for p in house.packs:
        items += [(f"pack/{p.name}", t) for t in p.templates if house.wanted(t)]
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
    house_cards, room_cards = _pack_cards(env, house, ctx, "cards")
    house_settings, room_settings = (
        _pack_cards(env, house, ctx, "settings") if house.controls()["panel"] else ([], {})
    )
    ctx["dashboard"] = dash.build(
        house,
        house_cards=house_cards,
        room_cards=room_cards,
        house_settings=house_settings,
        room_settings=room_settings,
    )

    manifest_path = out / MANIFEST
    previous: set[str] = set()
    if manifest_path.is_file():
        previous = set(json.loads(manifest_path.read_text(encoding="utf-8")).get("files", []))

    result = Rendered()
    current: set[str] = set()
    for prefix, t in plan(house):
        if t.get("copy") or t.get("house_file"):
            # a file carried as it is: the product's (base/<copy>) or the
            # house's (a path the house file names, beside home.yml) - bytes,
            # never rendered, marked in the manifest like everything else
            if t.get("copy"):
                src = BASE / t["copy"]
            else:
                named = house.data
                for key in t["house_file"].split("."):
                    named = (named or {}).get(key)
                src = house.path.parent / str(named)
            if not src.is_file():
                raise HouseError(f"{t['dst']}: nothing to copy at {src}")
            rel = env.from_string(t["dst"]).render(ctx)
            target = out / rel
            current.add(rel)
            data = src.read_bytes()
            if target.exists() and target.read_bytes() == data:
                result.unchanged.append(target)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            target.chmod(0o644)
            result.written.append(target)
            continue
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
