"""A house: home.yml loaded — what it `include:`s merged in — validated
against the schema (the packs' fragments merged), cross-checked, with the
profile, the packs and the labels resolved. Everything a template reads
comes from here: the lists, and the vocabulary resolved by ROLE — a scene
addresses a room's roles, the house says which things fill them (the walk
writes `role:` on a row), and what nothing fills yet renders nothing and is
a hint, never an error."""

from __future__ import annotations

import copy
import json
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator

from .errors import HouseError
from .fx import known_backends, load_shapes
from .include import merge_includes
from .labels import Labels
from .packs import Pack, load_packs
from .profiles import Profile, load_profile

SCHEMA_VERSION = 1
SCHEMA_PATH = Path(__file__).parent / "schema" / "home.schema.json"

# the entity domain a kind lands in; None = a thing with no entity of its own
# (a remote sends events, a coordinator is a radio, a proxy relays)
DOMAIN: dict[str, str | None] = {
    "light": "light",
    "plug": "switch",
    "switch": "switch",
    "sensor": "sensor",
    "remote": None,
    "cover": "cover",
    "door": "binary_sensor",
    "motion": "binary_sensor",
    "cast": "media_player",
    "tv": "media_player",
    "speaker": "media_player",
    "satellite": None,
    "camera": "camera",
    "lock": "lock",
    "thermostat": "climate",
    "valve": "valve",
    "printer": "sensor",
    "coordinator": None,
    "proxy": None,
}
DAYLIGHT = ("dark", "dim", "bright")
# what the implicit `off` scene switches off: the lights and the switches — a
# screen or a speaker goes off only when a scene names it (a TV must not go
# dark because the clock struck night)
OFF_DOMAINS = ("light", "switch")
KELVIN = {"warm": 2700, "neutral": 4000, "cool": 5500}
# the vocabulary's words and the pack that renders each — a house that writes
# one without its pack is told so (a hint)
VOCABULARY_PACKS = {"scenes": "scenes", "modes": "modes", "fx": "fx", "scenarios": "scenarios"}


def base_schema() -> dict:
    return json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))


def scene_ref(value) -> str | None:
    """A scene named in a file: YAML 1.1 reads a bare `off` as false — both mean off."""
    if value is False:
        return "off"
    return value


def normalise_look(look, kelvin: dict | None = None) -> dict:
    """A scene's value for a role, as the light service's data: {"on": bool, ...}."""
    if look is True or look == "on":
        return {"on": True}
    if look is False or look == "off":
        return {"on": False}
    k = {**KELVIN, **(kelvin or {})}
    out: dict = {"on": True}
    if "brightness" in look:
        out["brightness_pct"] = look["brightness"]
    if "ct" in look:
        ct = look["ct"]
        out["color_temp_kelvin"] = k[ct] if isinstance(ct, str) else ct
    if "color" in look:
        c = look["color"]
        out["rgb_color"] = [int(c[i : i + 2], 16) for i in (1, 3, 5)]
    if "transition" in look:
        out["transition"] = look["transition"]
    return out


@dataclass
class House:
    path: Path
    data: dict
    profile: Profile
    packs: list[Pack]
    labels: Labels
    known_kinds: set[str]
    known_via: set[str]
    warnings: list[str] = field(default_factory=list)
    hints: list[str] = field(default_factory=list)
    included: dict = field(default_factory=dict)

    # --- the lists ---------------------------------------------------------
    @property
    def areas(self) -> list[dict]:
        return self.data["areas"]

    @property
    def people(self) -> list[dict]:
        return self.data.get("people", [])

    @property
    def things(self) -> list[dict]:
        return self.data.get("things", [])

    @property
    def scenarios(self) -> list[dict]:
        return self.data.get("scenarios", [])

    def area(self, area_id: str) -> dict:
        for a in self.areas:
            if a["id"] == area_id:
                return a
        raise HouseError(f"no area {area_id!r}")

    def has_pack(self, name: str) -> bool:
        return any(p.name == name for p in self.packs)

    def group_entities(self) -> set[str]:
        """The light groups the lighting pack renders — the vocabulary's
        plumbing (what a scene or an effect aims at), not lights a person
        should see twice: light.<room>_lights, light.<room>_<role>, the
        layout's row groups. The conductor hides them from the UI."""
        out: set[str] = set()
        if not self.has_pack("lighting"):
            return out
        for a in self.areas:
            lights = [t for t in self.things_in(a["id"]) if t["kind"] == "light"]
            if lights:
                out.add(f"light.{a['id']}_lights")
            for role, things in self.roles_in(a["id"]).items():
                if things and all(t["kind"] == "light" for t in things):
                    out.add(f"light.{a['id']}_{role}")
            for role in self.declared_roles(a):
                for g in self.layout_groups(a, role):
                    out.add(f"light.{a['id']}_{role}_{g['prefix']}")
        return out

    def matter_only_fabric(self) -> bool:
        return bool((self.data.get("matter") or {}).get("only_fabric", False))

    def wanted(self, row: dict) -> bool:
        """A template's or a directory's `when`: `pack:<name>` = the house
        carries that pack; absent = always."""
        when = row.get("when")
        if not when:
            return True
        if when.startswith("pack:"):
            return self.has_pack(when[5:])
        raise HouseError(f"`when: {when}` is not one the engine knows (pack:<name>)")

    @staticmethod
    def integrations(thing: dict) -> list[str]:
        """The integration(s) a thing names — one id, or a list of them."""
        raw = thing.get("integration")
        if not raw:
            return []
        return list(raw) if isinstance(raw, list) else [raw]

    def rows_of(self, domain: str) -> list[dict]:
        """The things that name this integration."""
        return [t for t in self.things if domain in self.integrations(t)]

    def thing(self, thing_id: str) -> dict:
        for t in self.things:
            if t["id"] == thing_id:
                return t
        raise HouseError(f"no thing {thing_id!r}")

    def things_in(self, area_id: str) -> list[dict]:
        return [t for t in self.things if t["area"] == area_id]

    def kinds_in(self, area_id: str) -> dict[str, list[dict]]:
        out: dict[str, list[dict]] = {}
        for t in self.things_in(area_id):
            out.setdefault(t["kind"], []).append(t)
        return out

    def by_kind(self) -> Counter:
        return Counter(t["kind"] for t in self.things)

    # --- derived -----------------------------------------------------------
    def entity(self, thing: dict) -> str | None:
        """One name, three systems: the entity is <domain>.<id> unless the row says otherwise."""
        if thing.get("entity"):
            return thing["entity"]
        domain = DOMAIN.get(thing["kind"])
        return f"{domain}.{thing['id']}" if domain else None

    def pins(self) -> dict:
        return {**self.profile.pins, **self.data.get("pins", {})}

    def root(self) -> str:
        return self.data.get("paths", {}).get("root") or self.profile.root

    def units_dir(self) -> str:
        return self.data.get("paths", {}).get("units_dir") or self.profile.units_dir

    def owner(self) -> dict:
        """The brain's own owner — the break-glass account `regie apply` creates at
        the first boot; its password is the secret `owner_password`."""
        o = self.data.get("owner", {})
        return {"username": o.get("username", "owner"), "label": o.get("label", "Owner")}

    def backup(self) -> dict:
        b = self.data.get("backup", {})
        return {"time": b.get("time", "04:00"), "copies": b.get("copies", 7)}

    @property
    def tokens(self) -> list[str]:
        return list(self.data.get("tokens", []))

    def floors(self) -> list[dict]:
        """The floors declared, plus the ones the areas name without a line."""
        out = [dict(f) for f in self.data.get("floors", [])]
        known = {f["id"] for f in out}
        for a in self.areas:
            f = a.get("floor")
            if f and f not in known:
                out.append({"id": f, "label": f.replace("_", " ").capitalize()})
                known.add(f)
        return out

    def area_aliases(self, area: dict) -> list[str]:
        """What Home Assistant's area carries: the house's id (the conductor's
        key), then what people say."""
        out = [area["id"]]
        for alias in area.get("aliases", []):
            if alias not in out:
                out.append(alias)
        return out

    def coordinators(self) -> list[dict]:
        """The radios, resolved: an address, a port, an adapter, a base topic,
        the paired things on each and one Zigbee group per room of lights."""
        out = []
        entries = self.data.get("zigbee", {}).get("coordinators", [])
        for i, c in enumerate(entries):
            host = c.get("host")
            if c.get("thing"):
                host = self.thing(c["thing"]).get("host")
            c_id = c["id"]
            things = [
                t
                for t in self.things
                if t["via"] == "zigbee"
                and t.get("ieee")
                and (t.get("coordinator") or entries[0]["id"]) == c_id
            ]
            groups = []
            for a in self.areas:
                lights = [t for t in things if t["area"] == a["id"] and t["kind"] == "light"]
                if lights:
                    groups.append({"number": len(groups) + 1, "area": a, "things": lights})
            out.append(
                {
                    "id": c_id,
                    "thing": c.get("thing"),
                    "host": host,
                    "port": c.get("port", 6638),
                    "adapter": c.get("adapter", "zstack"),
                    "base_topic": c.get("base_topic")
                    or ("zigbee2mqtt" if i == 0 else f"zigbee2mqtt_{c_id}"),
                    "things": things,
                    "groups": groups,
                }
            )
        return out

    def mqtt_users(self) -> list[dict]:
        """One broker user per client, each on its own topics: the brain, one
        per radio, one per thing that pushes (via: mqtt) — a pushing thing
        announces itself under its own id only."""
        users = [{"name": "home", "topics": ["#"]}]
        for c in self.coordinators():
            users.append(
                {
                    "name": f"zigbee2mqtt_{c['id']}",
                    "topics": [f"{c['base_topic']}/#", "homeassistant/#"],
                }
            )
        for t in self.things:
            if t["via"] == "mqtt":
                users.append(
                    {"name": t["id"], "topics": [f"{t['id']}/#", f"homeassistant/+/{t['id']}/#"]}
                )
        return users

    def secret_names(self) -> list[str]:
        names = ["owner_password", "backup_password"]
        names += [f"mqtt_password_{u['name']}" for u in self.mqtt_users()]
        for c in self.coordinators():
            names += [
                f"zigbee_{c['id']}_network_key",
                f"zigbee_{c['id']}_pan_id",
                f"zigbee_{c['id']}_ext_pan_id",
            ]
        if "oidc" in self.data:
            names.append("oidc_client_secret")
        return names

    # --- the vocabulary, by role ----------------------------------------------
    def roles_in(self, area_id: str) -> dict[str, list[dict]]:
        """The roles FILLED in a room: role → the things that carry it."""
        out: dict[str, list[dict]] = {}
        for t in self.things_in(area_id):
            if t.get("role"):
                out.setdefault(t["role"], []).append(t)
        return out

    def declared_roles(self, area: dict) -> dict[str, dict]:
        """The roles a room HAS: the ones its file declares, plus the ones its things carry."""
        out = {r: dict(spec or {}) for r, spec in (area.get("roles") or {}).items()}
        for r in self.roles_in(area["id"]):
            out.setdefault(r, {})
        return out

    def role_target(self, area: dict, role: str) -> dict | None:
        """Where a scene or an effect aims when it names a role: the room's
        light group for that role when its things are lights (light.<room>_<role>),
        the things themselves otherwise; None when nothing fills it."""
        things = self.roles_in(area["id"]).get(role, [])
        if not things:
            return None
        lights = [t for t in things if t["kind"] == "light"]
        if lights and len(lights) == len(things):
            return {
                "domain": "light",
                "entities": [f"light.{area['id']}_{role}"],
                "things": things,
                "group": True,
            }
        entities = [e for e in (self.entity(t) for t in things) if e]
        if not entities:
            return None
        domains = {e.split(".")[0] for e in entities}
        return {
            "domain": domains.pop() if len(domains) == 1 else "homeassistant",
            "entities": entities,
            "things": things,
            "group": False,
        }

    def layout_groups(self, area: dict, role: str) -> list[dict]:
        """A layout's places that share a prefix (front_left, front_right → front)
        make a group of their own once two of them are filled."""
        spec = (area.get("roles") or {}).get(role) or {}
        layout = spec.get("layout") or []
        if not layout:
            return []
        by_prefix: dict[str, list[str]] = {}
        for place in layout:
            by_prefix.setdefault(place.split("_")[0], []).append(place)
        at = {
            t["at"]: t
            for t in self.roles_in(area["id"]).get(role, [])
            if t["kind"] == "light" and t.get("at")
        }
        out = []
        for prefix, places in by_prefix.items():
            filled = [at[p] for p in places if p in at]
            if len(places) >= 2 and len(filled) >= 2:
                out.append(
                    {
                        "id": f"{area['id']}_{role}_{prefix}",
                        "prefix": prefix,
                        "places": places,
                        "things": filled,
                    }
                )
        return out

    def kelvin(self) -> dict:
        return {**KELVIN, **((self.data.get("fx") or {}).get("kelvin") or {})}

    def scene_plan(self, area: dict) -> list[dict]:
        """Every scene of the room resolved by role: what renders (a filled role,
        its target, its look) and what waits for the walk. `off` is implicit."""
        plans = []
        scenes = dict(area.get("scenes") or {})
        filled_roles = self.roles_in(area["id"])
        if filled_roles and "off" not in scenes:
            scenes["off"] = {
                r: "off"
                for r in filled_roles
                if (t := self.role_target(area, r)) and t["domain"] in OFF_DOMAINS
            }
        for scene_id, looks in scenes.items():
            roles, unfilled = [], []
            for role, look in looks.items():
                target = self.role_target(area, role)
                if target:
                    roles.append(
                        {"role": role, "look": normalise_look(look, self.kelvin()), **target}
                    )
                else:
                    unfilled.append(role)
            plans.append(
                {
                    "id": scene_id,
                    "roles": roles,
                    "unfilled": unfilled,
                    "renders": bool(roles),
                    "implicit": scene_id == "off" and "off" not in (area.get("scenes") or {}),
                }
            )
        return plans

    def rendered_scenes(self, area: dict) -> set[str]:
        return {p["id"] for p in self.scene_plan(area) if p["renders"]}

    def defaults_of(self, area: dict) -> dict[str, dict[str, str]]:
        """The room's default per period, always as a map by daylight."""
        out = {}
        for period, value in (area.get("defaults") or {}).items():
            if not isinstance(value, dict):
                out[period] = dict.fromkeys(DAYLIGHT, scene_ref(value))
            else:
                first = scene_ref(next(iter(value.values())))
                out[period] = {d: scene_ref(value.get(d, first)) for d in DAYLIGHT}
        return out

    def modes(self) -> dict | None:
        """The state machine, normalised: the modes in order, the periods in
        order, the clock rules, the daylight thresholds."""
        m = self.data.get("modes")
        if not m:
            return None
        modes = []
        for mode_id, spec in m["modes"].items():
            spec = spec or {}
            modes.append(
                {
                    "id": mode_id,
                    "label": spec.get("label", mode_id.replace("_", " ").capitalize()),
                    "quiet": bool(spec.get("quiet", False)),
                    "away": bool(spec.get("away", False)),
                    "icon": spec.get("icon"),
                    "scene": scene_ref(spec.get("scene", mode_id)),
                    "else": scene_ref(spec.get("else")),
                    "rooms": {r: scene_ref(s) for r, s in (spec.get("rooms") or {}).items()},
                }
            )
        periods = [
            {
                "id": p,
                "time": t if isinstance(t, str) else t["at"],
                "label": (t.get("label") if isinstance(t, dict) else None) or p,
            }
            for p, t in (m.get("periods") or {}).items()
        ]
        clock = [
            {"period": p, "to": rule["to"], "from": list(rule.get("from") or [])}
            for p, rule in (m.get("clock") or {}).items()
        ]
        daylight = {"dark_below": -6, "bright_above": 10, **(m.get("daylight") or {})}
        return {
            "initial": m.get("initial", "home"),
            "modes": modes,
            "periods": periods,
            "clock": clock,
            "daylight": daylight,
            "follow": bool(m.get("follow", True)),
        }

    def mode_scene(self, mode: dict, area: dict) -> str | None:
        """The scene a room takes when the house enters a mode: the room's own
        line, else the mode's scene, else the mode's `else` — only what renders
        (`default` and `off` always do once a role is filled)."""
        wanted = mode["rooms"].get(area["id"], mode["scene"])
        rendered = self.rendered_scenes(area)
        if wanted == "default":
            return "default" if rendered else None
        if wanted in rendered:
            return wanted
        fallback = mode.get("else")
        if fallback and fallback in rendered:
            return fallback
        return None

    def knobs(self) -> list[dict]:
        """What the conductor seeds ONCE from the files and the UI owns after:
        the periods' times, the house's first mode."""
        m = self.modes()
        if not m:
            return []
        out = [
            {
                "entity": f"input_datetime.house_period_{p['id']}",
                "action": "input_datetime/set_datetime",
                "data": {"time": p["time"] + ":00"},
                "value": p["time"],
                "reads": lambda state, p=p: state[:5],
            }
            for p in m["periods"]
        ]
        out.append(
            {
                "entity": "input_select.house_mode",
                "action": "input_select/select_option",
                "data": {"option": m["initial"]},
                "value": m["initial"],
                "reads": lambda state: state,
            }
        )
        return out

    def fx(self) -> dict:
        f = dict(self.data.get("fx") or {})
        f.setdefault("backend", "ha")
        return f


# --- loading ----------------------------------------------------------------
def _validate(schema: dict, data: dict, path: Path | str) -> None:
    validator = Draft202012Validator(schema, format_checker=Draft202012Validator.FORMAT_CHECKER)
    errors = sorted(validator.iter_errors(data), key=lambda e: [str(p) for p in e.absolute_path])
    if errors:
        lines = [f"{path}: {len(errors)} schema error(s)"]
        for e in errors[:20]:
            where = "/".join(str(p) for p in e.absolute_path) or "<root>"
            lines.append(f"  {where}: {e.message}")
        raise HouseError("\n".join(lines))


def merge_fragment(schema: dict, fragment: dict) -> None:
    thing = schema["$defs"]["thing"]
    thing["properties"].update(fragment.get("thing_properties", {}))
    options = thing["properties"]["options"]
    options.setdefault("properties", {}).update(fragment.get("options_properties", {}))
    schema["$defs"]["area"]["properties"].update(fragment.get("area_properties", {}))
    schema["properties"].update(fragment.get("properties", {}))
    schema["$defs"].update(fragment.get("$defs", {}))


def _fill_defaults(data: dict) -> None:
    for t in data.get("things", []):
        t.setdefault("bind", [])
        t.setdefault("options", {})


def _strip_sources(data: dict) -> dict[str, str]:
    """The `_source` marks the include merger left: taken off before validation,
    kept for the messages."""
    sources = {}
    for a in data.get("areas", []):
        if isinstance(a, dict) and "_source" in a:
            sources[f"area {a.get('id')}"] = a.pop("_source")
    for s in data.get("scenarios", []):
        if isinstance(s, dict) and "_source" in s:
            sources[f"scenario {s.get('id')}"] = s.pop("_source")
    return sources


def _validate_pieces(schema: dict, data: dict, sources: dict[str, str]) -> None:
    """An included file validated on its own first, so a fault names the file."""
    for a in data.get("areas", []):
        src = sources.get(f"area {a.get('id')}")
        if src:
            _validate({"$ref": "#/$defs/area", "$defs": schema["$defs"]}, a, src)
    for s in data.get("scenarios", []):
        src = sources.get(f"scenario {s.get('id')}")
        if src:
            _validate({"$ref": "#/$defs/scenario", "$defs": schema["$defs"]}, s, src)


def _cross_check(house: House) -> tuple[list[str], list[str]]:
    data = house.data
    warnings: list[str] = []
    hints: list[str] = []
    errors: list[str] = []

    for what, items in (("area", house.areas), ("thing", house.things), ("person", house.people)):
        dup = [i for i, n in Counter(x["id"] for x in items).items() if n > 1]
        if dup:
            errors.append(f"{what} ids used twice: {', '.join(sorted(dup))}")

    area_ids = {a["id"] for a in house.areas}
    thing_ids = {t["id"] for t in house.things}
    coordinator_ids = {c["id"] for c in data.get("zigbee", {}).get("coordinators", [])}

    for t in house.things:
        if t["area"] not in area_ids:
            errors.append(f"{t['id']}: area {t['area']!r} does not exist")
        for target in t.get("bind", []):
            if target not in thing_ids and target not in area_ids:
                errors.append(f"{t['id']}: bind target {target!r} is neither a thing nor an area")
        if t.get("coordinator") and t["coordinator"] not in coordinator_ids:
            errors.append(f"{t['id']}: coordinator {t['coordinator']!r} does not exist")
        if t["kind"] not in house.known_kinds:
            warnings.append(
                f"{t['id']}: kind {t['kind']!r} is not one the product or a pack knows "
                "— it is kept, labelled by its id"
            )
        if t["via"] not in house.known_via:
            warnings.append(f"{t['id']}: via {t['via']!r} is not one the product or a pack knows")
        if t["via"] == "zigbee" and not t.get("ieee"):
            warnings.append(
                f"{t['id']}: via zigbee, no ieee — not paired yet (the walk fills it in)"
            )
        if t.get("at") and not t.get("role"):
            errors.append(f"{t['id']}: `at` without a `role` — a place belongs to a role's layout")
        if t.get("role") and t["kind"] == "light" and t["id"] == f"{t['area']}_{t['role']}":
            errors.append(
                f"{t['id']}: a light may not wear its role's name — light.{t['id']} is the "
                f"role's group (what a scene aims at); name it {t['id']}_1 or by its place"
            )
        if t.get("role") and t["area"] in area_ids:
            area = house.area(t["area"])
            spec = (area.get("roles") or {}).get(t["role"]) or {}
            if spec.get("kind") and spec["kind"] != t["kind"]:
                warnings.append(
                    f"{t['id']}: role {t['role']!r} in {area['id']} expects a {spec['kind']}, "
                    f"this is a {t['kind']}"
                )
            layout = spec.get("layout") or []
            if t.get("at") and layout and t["at"] not in layout:
                warnings.append(
                    f"{t['id']}: at {t['at']!r} is not a place of {area['id']}'s {t['role']} layout"
                )

    floor_ids = {f["id"] for f in data.get("floors", [])}
    dup = [i for i, n in Counter(f["id"] for f in data.get("floors", [])).items() if n > 1]
    if dup:
        errors.append(f"floor ids used twice: {', '.join(sorted(dup))}")
    for a in house.areas:
        if floor_ids and a.get("floor") and a["floor"] not in floor_ids:
            warnings.append(
                f"{a['id']}: floor {a['floor']!r} has no line under floors — created by its id"
            )

    zigbee_things = [t for t in house.things if t["via"] == "zigbee"]
    if zigbee_things and not coordinator_ids:
        errors.append(f"{len(zigbee_things)} zigbee thing(s) but no zigbee.coordinators")
    for c in data.get("zigbee", {}).get("coordinators", []):
        if c.get("thing"):
            if c["thing"] not in thing_ids:
                errors.append(f"coordinator {c['id']}: thing {c['thing']!r} does not exist")
            elif not house.thing(c["thing"]).get("host"):
                errors.append(f"coordinator {c['id']}: thing {c['thing']!r} has no host")
        elif not c.get("host"):
            errors.append(f"coordinator {c['id']}: neither a thing nor a host")

    # --- the vocabulary ----------------------------------------------------------
    modes = house.modes()
    mode_ids = {m["id"] for m in modes["modes"]} if modes else set()
    period_ids = [p["id"] for p in modes["periods"]] if modes else []
    for a in house.areas:
        declared = house.declared_roles(a)
        filled = house.roles_in(a["id"])
        scenes = dict(a.get("scenes") or {})
        for scene_id, looks in scenes.items():
            for role in looks:
                if role not in declared:
                    warnings.append(
                        f"{a['id']}: scene {scene_id} names role {role!r} — neither declared "
                        "under roles nor carried by a thing"
                    )
        unfilled = sorted(r for r in declared if r not in filled)
        waiting = [p["id"] for p in house.scene_plan(a) if not p["renders"] and not p["implicit"]]
        if unfilled:
            hints.append(
                f"{a['id']}: role(s) {', '.join(unfilled)} filled by nothing yet — "
                "what names them renders nothing (the walk fills them)"
                + (f"; scene(s) {', '.join(waiting)} wait, no script yet" if waiting else "")
            )
        elif waiting:
            hints.append(
                f"{a['id']}: scene(s) {', '.join(waiting)} wait for their roles, no script yet"
            )
        for period, value in house.defaults_of(a).items():
            if period_ids and period not in period_ids:
                errors.append(f"{a['id']}: defaults name period {period!r} — not in modes.periods")
            for d, scene in value.items():
                if scene not in scenes and scene != "off":
                    errors.append(
                        f"{a['id']}: default {period}/{d} names scene {scene!r} — the room has none"
                    )
        if a.get("defaults") and period_ids:
            missing = [p for p in period_ids if p not in a["defaults"]]
            if missing:
                warnings.append(
                    f"{a['id']}: no default for period(s) {', '.join(missing)} — "
                    "'on' means the room's first scene then"
                )
    if modes:
        if modes["initial"] not in mode_ids:
            errors.append(f"modes: initial {modes['initial']!r} is not a mode")
        for m in modes["modes"]:
            if m["scene"] not in ("default", "off"):
                rooms_with = [a["id"] for a in house.areas if m["scene"] in (a.get("scenes") or {})]
                if not rooms_with and not m.get("else"):
                    hints.append(
                        f"mode {m['id']}: no room has a scene {m['scene']!r} — the transition "
                        "renders nothing (write one, or `else: off`)"
                    )
            for room, scene in m["rooms"].items():
                if room not in area_ids:
                    errors.append(f"mode {m['id']}: room {room!r} does not exist")
                elif scene not in (house.area(room).get("scenes") or {}) and scene not in (
                    "default",
                    "off",
                ):
                    errors.append(f"mode {m['id']}: {room} has no scene {scene!r}")
        for rule in modes["clock"]:
            if rule["period"] not in period_ids:
                errors.append(f"modes.clock: {rule['period']!r} is not a period")
            if rule["to"] not in mode_ids:
                errors.append(f"modes.clock {rule['period']}: to {rule['to']!r} is not a mode")
            for f in rule["from"]:
                if f not in mode_ids:
                    errors.append(f"modes.clock {rule['period']}: from {f!r} is not a mode")
        times = [p["time"] for p in modes["periods"]]
        if times != sorted(times):
            warnings.append(
                "modes.periods: the times are not in the order of the day — the file's order "
                "is the day's; the family's UI edits can still cross"
            )
    fx = house.fx()
    if fx.get("backend") not in known_backends():
        errors.append(
            f"fx: unknown backend {fx.get('backend')!r} — known: {', '.join(known_backends())}"
        )
    shapes = load_shapes(fx.get("shapes"))
    for name in fx.get("enable") or []:
        if name not in shapes:
            errors.append(
                f"fx.enable: {name!r} is not a shape — known: {', '.join(sorted(shapes))}"
            )
    dup = [i for i, n in Counter(s["id"] for s in house.scenarios).items() if n > 1]
    if dup:
        errors.append(f"scenario ids used twice: {', '.join(sorted(dup))}")
    for s in house.scenarios:
        for i, step in enumerate(s["steps"], 1):
            where = f"scenario {s['id']} step {i}"
            if "mode" in step and not modes:
                warnings.append(f"{where}: sets a mode, the house has no modes file")
            elif "mode" in step and step["mode"] not in mode_ids:
                errors.append(f"{where}: mode {step['mode']!r} is not a mode")
            if "scene" in step:
                room, scene = step["scene"].split("/", 1)
                if room not in area_ids:
                    errors.append(f"{where}: room {room!r} does not exist")
                elif scene not in (house.area(room).get("scenes") or {}) and scene not in (
                    "default",
                    "off",
                ):
                    errors.append(f"{where}: {room} has no scene {scene!r}")
                elif scene not in house.rendered_scenes(
                    room and house.area(room)
                ) and scene not in ("default",):
                    hints.append(f"{where}: {room}/{scene} has no script yet (its roles wait)")
            if "fx" in step and step["fx"]["shape"] not in shapes:
                errors.append(f"{where}: shape {step['fx']['shape']!r} is not one")
            if "fx" in step and fx.get("enable") and step["fx"]["shape"] not in fx["enable"]:
                errors.append(f"{where}: shape {step['fx']['shape']!r} is not enabled in fx")
    for word, pack in VOCABULARY_PACKS.items():
        present = (
            bool(data.get(word)) if word != "scenes" else any(a.get("scenes") for a in house.areas)
        )
        if present and not house.has_pack(pack):
            hints.append(
                f"the house writes {word} but pack {pack!r} is not enabled — nothing renders them"
            )

    if not house.labels.found:
        warnings.append(
            f"no labels for lang {house.labels.lang!r} "
            f"(known: {', '.join(Labels.known())}) — English used"
        )
    if errors:
        raise HouseError(f"{house.path}:\n  " + "\n  ".join(errors))
    return warnings, hints


def load_house(path: Path) -> House:
    path = Path(path)
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
    except OSError as exc:
        raise HouseError(f"{path}: {exc.strerror}") from exc
    except yaml.YAMLError as exc:
        raise HouseError(f"{path}: not YAML — {exc}") from exc
    if not isinstance(data, dict):
        raise HouseError(f"{path}: a mapping was expected at the top")

    version = data.get("schema")
    if version != SCHEMA_VERSION:
        hint = (
            "`regie migrate` moves a file forward"
            if isinstance(version, int) and version < SCHEMA_VERSION
            else f"this engine writes schema {SCHEMA_VERSION}"
        )
        raise HouseError(f"{path}: schema {version!r} — {hint}")

    included = merge_includes(data, path.parent)
    sources = _strip_sources(data)

    schema = base_schema()
    _validate_pieces(schema, data, sources)
    # pass 1 — the base alone, loosened where the packs own fields, to learn
    # which profile and packs the house names
    loose = copy.deepcopy(schema)
    loose["$defs"]["thing"]["additionalProperties"] = True
    _validate(loose, data, path)

    profile = load_profile(data["profile"])
    packs = load_packs(data.get("packs", []), path.parent, data.get("paths", {}).get("house_packs"))

    # pass 2 — the packs' fragments merged, strict
    strict = copy.deepcopy(schema)
    known_kinds = set(schema["x-known"]["kinds"])
    known_via = set(schema["x-known"]["via"])
    for p in packs:
        merge_fragment(strict, p.fragment)
        known_kinds |= set(p.kinds)
        known_via |= set(p.via)
    _validate(strict, data, path)

    _fill_defaults(data)
    labels = Labels(data["house"].get("lang", "en"))
    house = House(path, data, profile, packs, labels, known_kinds, known_via, included=included)
    house.warnings, house.hints = _cross_check(house)
    return house
