"""A house: home.yml loaded — what it `include:`s merged in — validated
against the schema (the packs' fragments merged), cross-checked, with the
profile, the packs and the labels resolved. Everything a template reads
comes from here: the lists, and the vocabulary resolved by ROLE — a scene
addresses a room's roles, the house says which things fill them (the walk
writes `role:` on a row), and what nothing fills yet renders nothing and is
a hint, never an error."""

from __future__ import annotations

import copy
import hashlib
import json
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator

from . import theme as theme_lib
from .errors import HouseError
from .fx import KELVIN, known_backends, load_shapes
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


def zigbee_group_id(area_id: str) -> int:
    """A room's Zigbee group number, DERIVED from its id and nothing else.

    The number is written into every member bulb's own group table, so it may
    never move: numbering the groups in order (1, 2, 3…) would renumber half
    the flat the day a room gains its first light, and every bulb would keep
    answering on an id nothing addresses any more — a silent break, in the
    hardware, of the thing that must work with the brain down. A hash of the
    room's id is stable whatever else the house grows; `check` refuses the
    collision (1 in 65534 per pair of rooms) rather than leaving two rooms one
    switch.
    """
    digest = hashlib.sha256(area_id.encode("utf-8")).digest()
    return 1 + int.from_bytes(digest[:2], "big") % 65534


DAYLIGHT = ("dark", "dim", "bright")
# what the implicit `off` scene switches off: the lights and the switches — a
# screen or a speaker goes off only when a scene names it (a TV must not go
# dark because the clock struck night)
OFF_DOMAINS = ("light", "switch")
# what a look itself says; anything else in the mapping is one of the role's PLACES
LOOK_KEYS = ("brightness", "ct", "color", "transition")
# a scene's own keys — never a role name (check refuses a role wearing one)
SCENE_KEYS = ("label", "icon", "tags", "run", "pinned")
# the standard looks wear a standard face, so a row of buttons is readable at a
# glance; a look a house invents says its own `icon:` (an icon has no language,
# so it lives here and not beside the labels)
SCENE_ICONS = {
    "day": "mdi:white-balance-sunny",
    "soft": "mdi:weather-sunset",
    "evening": "mdi:sofa",
    "night": "mdi:weather-night",
    "cinema": "mdi:movie-open",
    "game": "mdi:gamepad-variant",
    "alarm": "mdi:alarm-light",
    "cooking": "mdi:chef-hat",
    "focus": "mdi:target",
    "low": "mdi:lightbulb-on-10",
    "off": "mdi:lightbulb-off-outline",
    "guest": "mdi:account-group",
    "party": "mdi:party-popper",
    "morning": "mdi:coffee",
    "reading": "mdi:book-open-page-variant",
    "relax": "mdi:spa",
    "bright": "mdi:brightness-7",
}
# the drift's defaults, and the measured floor between two colour commands on a
# Zigbee bulb: below this a new command aborts the ramp still running inside the
# bulb and the walk reads as jitter (Le QG, IKEA LED2109G6/LED2110R3 — 0.5 s was
# visibly dirty, 2 s was clean)
DRIFT = {"band": [190.0, 330.0], "saturation": 100, "period": [80.0, 175.0], "step": 2.5}
# a group of lights earns a PAGE of its own at this many things, or as soon as it
# holds groups (its layout's places). Below it the group is drawn where it stands,
# its members under it: a step with one way on is not a step.
NAV_PAGE_MIN = 4
# the vocabulary's words and the pack that renders each — a house that writes
# one without its pack is told so (a hint)
VOCABULARY_PACKS = {"scenes": "scenes", "modes": "modes", "fx": "fx", "scenarios": "scenarios"}


def base_schema() -> dict:
    return json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))


def scene_ref(value) -> str | None:
    """A scene named in a file: YAML 1.1 reads a bare `off` as false — both
    mean off; `none` (or nothing) means NO scene — a mode that touches no
    light (H35: entering `home` is a pure state flip)."""
    if value is False:
        return "off"
    if value in (None, "none"):
        return None
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


def hue_template(period: float, phase: float, lo: float, hi: float) -> str:
    """One walker's hue, as a Home Assistant template: a triangle wave of the
    CLOCK. No stored position, no accumulated drift — the brain may restart
    mid-walk and the ceiling picks up exactly where the time says it should."""
    return (
        "{% set x = ((as_timestamp(now()) / " + f"{period}" + ") + " + f"{phase}" + ") % 1 %}"
        "{% set t = 2 * x if x < 0.5 else 2 * (1 - x) %}"
        "{{ " + f"{lo}" + " + " + f"{hi - lo}" + " * t }}"
    )


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

    def controls(self) -> dict:
        """The family's controls (W3b): every switch explicit, defaults off —
        a house opts in; `silent` is the one on by default (an alert is a
        sane default; a house may hush it)."""
        c = dict(self.data.get("controls") or {})
        return {
            "panel": bool(c.get("panel", False)),
            "presence": bool(c.get("presence", False)),
            "restore_default": bool(c.get("restore_default", False)),
            "silent": bool(c.get("silent", True)),
        }

    def look_options(self, area: dict) -> list[str]:
        """The scenes a room's default may take (the settings panel's
        choices): rendered, and lighting something — H34's rule as a list."""
        if self.parking(area):
            return []
        out = []
        for scene_id, looks in (area.get("scenes") or {}).items():
            roles = {r: v for r, v in (looks or {}).items() if r not in SCENE_KEYS}
            if scene_id == "off" or not roles:
                continue
            if all(not normalise_look(v)["on"] for v in roles.values()):
                continue
            out.append(scene_id)
        return out

    def defaults_base(self, area: dict) -> dict[str, str]:
        """The daylight base of a room's defaults (H34), filled: a missing
        daylight takes the first named one."""
        raw = area.get("defaults") or {}
        base = {d: scene_ref(raw[d]) for d in DAYLIGHT if d in raw}
        if base:
            first = next(iter(base.values()))
            for d in DAYLIGHT:
                base.setdefault(d, first)
        return base

    def matter_only_fabric(self) -> bool:
        return bool((self.data.get("matter") or {}).get("only_fabric", False))

    def plan(self) -> dict | None:
        """THE PLAN (0.13): the frame the rooms are drawn in, and the drawing
        under the walls — None when the house declares none. A house that
        declares the frame but draws no room renders no Plan tab (a hint)."""
        plan = self.data.get("plan")
        if not plan:
            return None
        if not any((a.get("plan") or {}).get("outline") for a in self.areas):
            return None
        return plan

    def theme(self) -> dict | None:
        """The house's skin, RESOLVED — a `use:` merged with what the house
        repaints on top of it (theme.py). None when the house names no skin,
        which is a choice too: Home Assistant's own is a real answer."""
        raw = self.data["house"].get("theme")
        return theme_lib.resolve(raw) if raw else None

    def wanted(self, row: dict) -> bool:
        """A template's or a directory's `when`: `pack:<name>` = the house
        carries that pack; absent = always."""
        when = row.get("when")
        if not when:
            return True
        if when.startswith("pack:"):
            return self.has_pack(when[5:])
        if when == "theme":
            return self.theme() is not None
        if when == "plan":
            return self.plan() is not None
        if when == "plan_image":
            return bool((self.plan() or {}).get("image"))
        raise HouseError(
            f"`when: {when}` is not one the engine knows (pack:<name>, theme, plan, plan_image)"
        )

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
                    groups.append({"number": zigbee_group_id(a["id"]), "area": a, "things": lights})
            out.append(
                {
                    "id": c_id,
                    "thing": c.get("thing"),
                    "host": host,
                    "port": c.get("port", 6638),
                    "adapter": c.get("adapter", "zstack"),
                    "base_topic": c.get("base_topic")
                    or ("zigbee2mqtt" if i == 0 else f"zigbee2mqtt_{c_id}"),
                    # the instance's own UI, on the loopback: the door the
                    # engine walks and binds through (one per radio, in order)
                    "frontend_port": 8080 + i,
                    "things": things,
                    "groups": groups,
                }
            )
        return out

    def border_routers(self) -> list[dict]:
        """The Thread border routers, resolved: an id, an address, a port and
        the URL of the REST API the brain will be pointed at.

        The same seam as `coordinators()` — the address comes from the thing
        the row names, never typed twice — because on a two-radio box it is
        literally the same thing: one row, one reservation, one alias, two
        radios (home.md §4.3)."""
        out = []
        for b in self.data.get("thread", {}).get("border_routers", []):
            host = b.get("host")
            if b.get("thing"):
                host = self.thing(b["thing"]).get("host")
            port = b.get("port", 8080)
            out.append(
                {
                    "id": b["id"],
                    "thing": b.get("thing"),
                    "host": host,
                    "port": port,
                    "url": f"http://{host}:{port}",
                }
            )
        return out

    def thread_network_name(self) -> str | None:
        """The name of the Thread network the house owns, or None if it owns
        none. It is the whole of what the engine checks a border router
        against: the dataset itself is the fleet's to mint and to push."""
        return (self.data.get("thread") or {}).get("network_name")

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

    # --- the descent: what the dashboard walks down (0.10) ------------------------
    def parking(self, area: dict) -> bool:
        """A PARKING room: things wait here for a room and a role. Nothing is
        rendered that would ACT on them — no scene, no default, no automation —
        and `check` asks the room for none. They stay visible: a bulb with no
        place is still a bulb somebody wants to try."""
        return bool(area.get("parking"))

    def place_labels(self, area: dict, role: str) -> dict[str, str]:
        """What to call a place of this role — the room file's `places:`."""
        return dict(((area.get("roles") or {}).get(role) or {}).get("places") or {})

    def _leaf(self, thing: dict) -> dict:
        """A thing, at the bottom of the descent: it has no way on."""
        return {
            "node": "thing",
            "id": thing["id"],
            "entity": self.entity(thing),
            "label": thing.get("label") or self.labels.kind(thing["kind"]),
            "kind": thing["kind"],
            "count": 1,
            "children": [],
            "page": False,
            "thing": thing,
        }

    def _group(self, gid: str, label: str, things: list[dict], path: str) -> dict:
        """A light group of the house's own making (a role's, or a place's).
        It earns a PAGE when it holds NAV_PAGE_MIN things or when what is
        inside it is itself grouped; below that it is drawn where it stands."""
        children = [self._leaf(t) for t in things]
        return {
            "node": "group",
            "id": gid,
            "entity": f"light.{gid}",
            "label": label,
            "count": len(things),
            "children": children,
            "page": len(things) >= NAV_PAGE_MIN,
            "path": path,
        }

    def role_children(self, area: dict, role: str) -> list[dict]:
        """Inside a role: its layout's place groups, then the lights no place
        group covers. A single place group that holds the whole role is not a
        step of its own — its lights are returned instead."""
        lights = [t for t in self.roles_in(area["id"]).get(role, []) if t["kind"] == "light"]
        names = self.place_labels(area, role)
        groups = self.layout_groups(area, role)
        covered = {t["id"] for g in groups for t in g["things"]}
        nodes = [
            self._group(
                g["id"],
                names.get(g["prefix"], g["prefix"]),
                g["things"],
                f"{area['id']}-{role}-{g['prefix']}",
            )
            for g in groups
        ]
        nodes += [self._leaf(t) for t in lights if t["id"] not in covered]
        if len(nodes) == 1 and nodes[0]["node"] == "group":
            return nodes[0]["children"]
        return nodes

    def role_node(self, area: dict, role: str) -> dict:
        """A role, as one node of the room's page."""
        lights = [t for t in self.roles_in(area["id"]).get(role, []) if t["kind"] == "light"]
        node = self._group(
            f"{area['id']}_{role}",
            (self.declared_roles(area).get(role) or {}).get("label") or role,
            lights,
            f"{area['id']}-{role}",
        )
        node["children"] = self.role_children(area, role)
        node["page"] = node["page"] or any(c["node"] == "group" for c in node["children"])
        return node

    def room_nodes(self, area: dict) -> list[dict]:
        """What a room's page carries under the room's own group: one node per
        role of lights, a role of a single light as that light, then the lights
        no role names, then the plugs and switches. A room whose ONE role holds
        every light it has is not drawn twice — the room group already is it."""
        things = self.things_in(area["id"])
        lights = [t for t in things if t["kind"] == "light"]
        extras = [self._leaf(t) for t in things if t["kind"] in ("plug", "switch")]
        if not lights:
            return extras
        filled = self.roles_in(area["id"])
        light_roles = [
            r
            for r in self.declared_roles(area)
            if (ts := filled.get(r)) and all(t["kind"] == "light" for t in ts)
        ]
        roled = {t["id"] for r in light_roles for t in filled[r]}
        if len(light_roles) == 1 and len(roled) == len(lights):
            return self.role_children(area, light_roles[0]) + extras
        nodes: list[dict] = []
        for role in light_roles:
            node = self.role_node(area, role)
            nodes.append(node["children"][0] if node["count"] == 1 else node)
        nodes += [self._leaf(t) for t in lights if t["id"] not in roled]
        return nodes + extras

    def nav_pages(self, area: dict) -> list[dict]:
        """Every group of this room that is a page of its own, in the order the
        descent meets them — each carries the area it belongs to."""
        out: list[dict] = []

        def walk(nodes: list[dict]) -> None:
            for n in nodes:
                if n["node"] != "group":
                    continue
                if n["page"]:
                    out.append({**n, "area": area})
                walk(n["children"])

        walk(self.room_nodes(area))
        return out

    def nav_pages_all(self) -> list[dict]:
        return [page for a in self.areas for page in self.nav_pages(a)]

    def pinned_scenes(self, area: dict) -> list[dict]:
        """The looks the room's file put on its own page (`pinned: true`)."""
        return [p for p in self.scene_plan(area) if p["renders"] and p["pinned"]]

    def other_scenes(self, area: dict) -> list[dict]:
        """Every other look the room has — one tap away, applied by hand. `off`
        is one of them and comes last: the room's own row is what you press to
        turn it off, and this is where the word still exists for anyone who
        looks for it."""
        rest = [p for p in self.scene_plan(area) if p["renders"] and not p["pinned"]]
        return sorted(rest, key=lambda p: p["id"] == "off")

    def kelvin(self) -> dict:
        return {**KELVIN, **((self.data.get("fx") or {}).get("kelvin") or {})}

    def places_of(self, area: dict, role: str) -> dict[str, dict]:
        """Where a role's PLACES aim, by the name a look may call them: every
        `layout:` entry the room DECLARES, plus every prefix two or more of them
        share. Declared, not paired — a place the walk has not reached yet is a
        word the room already owns, and what fills nothing renders nothing (a
        hint, never an error), exactly like a role. The keys are the room file's
        own words; a look never names an entity."""
        spec = (area.get("roles") or {}).get(role) or {}
        layout = spec.get("layout") or []
        if not layout:
            return {}
        at = {t["at"]: t for t in self.roles_in(area["id"]).get(role, []) if t.get("at")}
        groups = {g["prefix"]: g for g in self.layout_groups(area, role)}
        out: dict[str, dict] = {}
        for place in layout:
            thing = at.get(place)
            entity = self.entity(thing) if thing else None
            out[place] = {
                "domain": entity.split(".")[0] if entity else "light",
                "entities": [entity] if entity else [],
                "things": [thing] if thing else [],
            }
        by_prefix: dict[str, list[str]] = {}
        for place in layout:
            by_prefix.setdefault(place.split("_")[0], []).append(place)
        for prefix, places in by_prefix.items():
            if len(places) < 2 or prefix in out:
                continue
            if prefix in groups:
                out[prefix] = {
                    "domain": "light",
                    "entities": [f"light.{groups[prefix]['id']}"],
                    "things": groups[prefix]["things"],
                    "group": True,
                }
                continue
            # fewer than two of them paired: no group of their own yet, so the
            # prefix aims at whichever ARE there (none, and it renders nothing)
            things = [at[p] for p in places if p in at]
            entities = [e for e in (self.entity(x) for x in things) if e]
            out[prefix] = {
                "domain": entities[0].split(".")[0] if entities else "light",
                "entities": entities,
                "things": things,
                "group": True,
                "places": places,
            }
        return out

    def look_plan(self, area: dict, role: str, look) -> tuple[list[dict], list[str]]:
        """One role's look resolved to (target, look) pairs. A plain look aims
        at the role as a whole; a look that names PLACES aims at each of them,
        the look's own keys (if any) being the base every unnamed place takes.
        Returns the pairs and the places named that this room has no word for."""
        places = self.places_of(area, role)
        # a word that is neither the look's own nor one of the role's places is
        # a typo, and it must be said: `normalise_look` would ignore it in
        # silence and the scene would read as a plain `on`
        problems = (
            [
                f"{role}.{k} — no such place in that role's layout (nor a prefix two of them share)"
                for k in look
                if k not in places and k not in LOOK_KEYS
            ]
            if isinstance(look, dict)
            else []
        )
        named = {k: v for k, v in look.items() if k in places} if isinstance(look, dict) else {}
        if not named:
            target = self.role_target(area, role)
            if not target:
                return [], problems
            return [{"role": role, "look": normalise_look(look, self.kelvin()), **target}], problems
        # a prefix speaks for all of its places: naming one of them TOO would
        # send that light two looks in the same breath, and which wins is a race
        for prefix in named:
            if not places[prefix].get("group"):
                continue
            covered_by = places[prefix].get("places") or [
                x.get("at") for x in places[prefix]["things"]
            ]
            for place in covered_by:
                if place in named:
                    problems.append(
                        f"{role}.{place} is named beside {role}.{prefix}, "
                        "the prefix that already speaks for it — one look each, or one for both"
                    )
        base = {k: v for k, v in look.items() if k in LOOK_KEYS}
        pairs = [
            {
                "role": role,
                "place": place,
                "look": normalise_look(value, self.kelvin()),
                **places[place],
            }
            for place, value in named.items()
            if places[place]["entities"]
        ]
        if not base:
            return pairs, problems
        # the base is what every place the look did NOT name takes; a prefix
        # that was named speaks for all of its own places, so they are covered
        covered = set(named)
        for place in named:
            if places[place].get("group"):
                covered |= set(
                    places[place].get("places") or [t.get("at") for t in places[place]["things"]]
                )
        pairs += [
            {
                "role": role,
                "place": place,
                "look": normalise_look(base, self.kelvin()),
                **target,
            }
            for place, target in places.items()
            if not target.get("group") and place not in covered and target["entities"]
        ]
        return pairs, problems

    def scene_meta(self, area: dict, scene_id: str) -> dict:
        """A scene's own keys: what the card calls it, its icon, what picks it."""
        raw = (area.get("scenes") or {}).get(scene_id) or {}
        raw = raw if isinstance(raw, dict) else {}
        return {
            "label": raw.get("label") or self.labels.scene(scene_id),
            "icon": raw.get("icon") or SCENE_ICONS.get(scene_id, "mdi:palette"),
            "tags": list(raw.get("tags") or []),
            "run": raw.get("run") or {},
            "pinned": bool(raw.get("pinned")),
        }

    def drift_places(self, area: dict, spec: dict) -> list[tuple[str, str]]:
        """The (place, entity) pairs a drift walks, in layout order: the places
        a prefix covers, an explicit list, or every filled place of the role."""
        role = spec["role"]
        places = self.places_of(area, role)
        layout = ((area.get("roles") or {}).get(role) or {}).get("layout") or []
        exact = [
            p
            for p in layout
            if p in places and not places[p].get("group") and places[p]["entities"]
        ]
        want = spec.get("places")
        if want is None:
            chosen = exact
        elif isinstance(want, str):
            chosen = [p for p in exact if p.split("_")[0] == want] or (
                [want] if want in exact else []
            )
        else:
            chosen = [p for p in exact if p in want]
        return [(p, places[p]["entities"][0]) for p in chosen]

    def drift_plan(self, area: dict, plan: dict) -> dict | None:
        """A scene's sustained colour walk, resolved: one walker per place, each
        with its OWN period, so no two are ever in step and the ceiling never
        falls into a pattern. Stateless by design — a walker's hue is a pure
        function of the clock, so a restart resumes mid-stride and nothing is
        stored. Brightness is absent on purpose: the scene sets it once, and a
        level command would abort the colour ramp running inside the bulb."""
        spec = (plan.get("run") or {}).get("drift")
        if not spec:
            return None
        pairs = self.drift_places(area, spec)
        if not pairs:
            return None
        band = spec.get("band") or DRIFT["band"]
        period = spec.get("period") or DRIFT["period"]
        step = float(spec.get("step") or DRIFT["step"])
        floor = self.colour_floor(area, spec["role"], [p for p, _ in pairs])
        n = len(pairs)
        walkers = []
        for i, (place, entity) in enumerate(pairs):
            walkers.append(
                {
                    "place": place,
                    "entity": entity,
                    # spread the periods across the band: incommensurate clocks
                    "period": round(period[0] + (period[1] - period[0]) * (i / max(n - 1, 1)), 2),
                    "phase": round(i / n, 4),
                    "hue": hue_template(
                        round(period[0] + (period[1] - period[0]) * (i / max(n - 1, 1)), 2),
                        round(i / n, 4),
                        float(band[0]),
                        float(band[1]),
                    ),
                }
            )
        return {
            "role": spec["role"],
            "lo": float(band[0]),
            "hi": float(band[1]),
            "saturation": int(spec.get("saturation", DRIFT["saturation"])),
            "step": max(step, floor),
            "asked": step,
            "floor": floor,
            "walkers": walkers,
        }

    def colour_floor(self, area: dict, role: str, places: list[str]) -> float:
        """The slowest colour clock the targets impose. A Zigbee bulb ramps
        colour in its own firmware and a command arriving before that ramp ends
        ABORTS it: below ~2 s the walk reads as jitter, not as movement
        (measured in the room, not read in a datasheet). Anything else: no floor."""
        at = {t.get("at"): t for t in self.roles_in(area["id"]).get(role, [])}
        return 2.0 if any((at.get(p) or {}).get("via") == "zigbee" for p in places) else 0.5

    def drift_errors(self, area: dict, plan: dict) -> list[str]:
        spec = (plan.get("run") or {}).get("drift")
        if not spec:
            return []
        role = spec["role"]
        if role not in self.declared_roles(area):
            return [
                f"{area['id']}: scene {plan['id']} drifts role {role!r} — not a role of this room"
            ]
        want = spec.get("places")
        if want is None:
            return []
        # checked against the LAYOUT, never against what is paired: places the
        # walk has not reached yet make the drift WAIT (a hint), exactly like a
        # role nothing fills. A name the layout does not know is the typo.
        layout = ((area.get("roles") or {}).get(role) or {}).get("layout") or []
        prefixes = {p.split("_")[0] for p in layout}
        wanted = [want] if isinstance(want, str) else list(want)
        missing = [w for w in wanted if w not in layout and w not in prefixes]
        if missing:
            return [
                f"{area['id']}: scene {plan['id']} drifts {role}.{', '.join(missing)} — "
                f"no such place in that role's layout (nor a prefix its places share)"
            ]
        return []

    def scene_plan(self, area: dict) -> list[dict]:
        """Every scene of the room resolved by role: what renders (a filled role,
        its target, its look) and what waits for the walk. `off` is implicit.
        A PARKING room has none: nothing there is acted upon."""
        if self.parking(area):
            return []
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
            roles, unfilled, unknown = [], [], []
            for role, look in looks.items():
                if role in SCENE_KEYS:
                    continue
                pairs, bad = self.look_plan(area, role, look)
                unknown += bad
                if pairs:
                    roles += pairs
                else:
                    unfilled.append(role)
            meta = self.scene_meta(area, scene_id)
            plans.append(
                {
                    "id": scene_id,
                    "roles": roles,
                    "unfilled": unfilled,
                    "unknown": unknown,
                    "renders": bool(roles),
                    "implicit": scene_id == "off" and "off" not in (area.get("scenes") or {}),
                    **meta,
                }
            )
        return plans

    def rendered_scenes(self, area: dict) -> set[str]:
        return {p["id"] for p in self.scene_plan(area) if p["renders"]}

    def defaults_of(self, area: dict) -> dict[str, dict[str, str]]:
        """The room's default per period, always as a map by daylight.

        Two forms (H34 — a default is a LOOK, what "on" means, never a
        state): daylight-first — top-level `dark` / `dim` / `bright` keys
        are the base the sun drives, period keys override it for their
        stretch of the day (a scene for the whole period, or a partial
        daylight map); period-first — the original form, period keys only.
        With a daylight base the table covers every period of the modes.
        A PARKING room has none: nothing there is acted upon."""
        raw = {} if self.parking(area) else (area.get("defaults") or {})
        if not raw:
            return {}
        base = {d: scene_ref(raw[d]) for d in DAYLIGHT if d in raw}
        period_keys = [k for k in raw if k not in DAYLIGHT]
        m = self.modes()
        periods = [p["id"] for p in m["periods"]] if m else period_keys
        out = {}
        for period in periods if base else period_keys:
            value = raw.get(period)
            if value is None:
                row = dict(base)
            elif not isinstance(value, dict):
                row = dict.fromkeys(DAYLIGHT, scene_ref(value))
            else:
                fallback = dict(base) if base else {}
                first = scene_ref(next(iter(value.values())))
                row = {d: scene_ref(value.get(d, fallback.get(d, first))) for d in DAYLIGHT}
            missing = [d for d in DAYLIGHT if row.get(d) is None]
            if missing and row:
                first = next(v for v in row.values() if v is not None)
                for d in missing:
                    row[d] = first
            out[period] = row
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
            # the modes `follow` may act in: no imposed look — the mode's
            # scene is `default` (the rooms are AT their defaults) or `none`
            # (the mode has no opinion); a mode imposing a scene (night,
            # cinema, off) is never fought by a boundary
            "following": [x["id"] for x in modes if x["scene"] in (None, "default")],
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
        controls = self.controls()
        if controls["presence"]:
            out.append(
                {
                    "entity": "input_boolean.presence_drives_mode",
                    "action": "input_boolean/turn_on",
                    "data": {},
                    "value": "on",
                    "reads": lambda state: state,
                }
            )
        if controls["panel"]:
            period_ids = [p["id"] for p in m["periods"]]
            for a in self.areas:
                raw = a.get("defaults") or {}
                base = self.defaults_base(a)
                if not base:
                    continue
                for d in DAYLIGHT:
                    out.append(
                        {
                            "entity": f"input_select.{a['id']}_look_{d}",
                            "action": "input_select/select_option",
                            "data": {"option": base[d]},
                            "value": base[d],
                            "reads": lambda state: state,
                        }
                    )
                for period in period_ids:
                    value = raw.get(period)
                    seed = scene_ref(value) if isinstance(value, str | bool) else "sun"
                    out.append(
                        {
                            "entity": f"input_select.{a['id']}_look_{period}",
                            "action": "input_select/select_option",
                            "data": {"option": seed},
                            "value": seed,
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
    # the derived group numbers, checked for the collision they can have: two
    # rooms on one number would share a switch and a scene, in the bulbs'
    # own group tables, where nothing in this file would show it
    by_number: dict[int, list[str]] = {}
    for a in house.areas:
        by_number.setdefault(zigbee_group_id(a["id"]), []).append(a["id"])
    for number, rooms in by_number.items():
        if len(rooms) > 1:
            errors.append(
                f"rooms {', '.join(sorted(rooms))} derive the same Zigbee group number "
                f"({number}) — rename one of them (the number comes from the id)"
            )
    for c in data.get("zigbee", {}).get("coordinators", []):
        if c.get("thing"):
            if c["thing"] not in thing_ids:
                errors.append(f"coordinator {c['id']}: thing {c['thing']!r} does not exist")
            elif not house.thing(c["thing"]).get("host"):
                errors.append(f"coordinator {c['id']}: thing {c['thing']!r} has no host")
        elif not c.get("host"):
            errors.append(f"coordinator {c['id']}: neither a thing nor a host")

    thread = data.get("thread") or {}
    for b in thread.get("border_routers", []):
        if b.get("thing"):
            if b["thing"] not in thing_ids:
                errors.append(f"border router {b['id']}: thing {b['thing']!r} does not exist")
            elif not house.thing(b["thing"]).get("host"):
                errors.append(f"border router {b['id']}: thing {b['thing']!r} has no host")
        elif not b.get("host"):
            errors.append(f"border router {b['id']}: neither a thing nor a host")
    if thread and not house.has_pack("matter"):
        # a Thread thing reaches the brain through the MATTER fabric: the
        # border router carries the packets, the Matter server speaks to the
        # device. A border router with no fabric behind it is a mesh nothing
        # can join (home.md 4.3)
        errors.append(
            "thread: the house declares a border router but carries no `matter` pack — "
            "a Thread thing reaches the brain through the Matter fabric; add matter to packs:"
        )
    # THE CHANNEL GUARD. Zigbee and Thread are both 802.15.4 in the 2.4 GHz
    # band, and on a two-radio box they are two aerials centimetres apart: the
    # same channel is two meshes shouting over each other, and the failure is
    # silent - things drop, nothing logs a cause. Home Assistant has a
    # collision check of its own, but it only ever fires for ZHA behind a
    # multiprotocol add-on, which is not this house. Nothing else watches it.
    zig_channel = data.get("zigbee", {}).get("channel", 25)
    thread_channel = thread.get("channel")
    if thread_channel is not None and thread.get("border_routers"):
        shared = {b["thing"] for b in thread["border_routers"] if b.get("thing")} & {
            c["thing"] for c in data.get("zigbee", {}).get("coordinators", []) if c.get("thing")
        }
        if shared and thread_channel == zig_channel:
            errors.append(
                f"thread: channel {thread_channel} is the Zigbee channel, and "
                f"{', '.join(sorted(shared))} carries both radios — two 802.15.4 meshes on one "
                "box on one channel drown each other, and nothing logs a cause; move one"
            )

    # --- the plan (0.13) ---------------------------------------------------------
    # every point a room writes is checked against the words the room already
    # owns: a role it has, a place its layout knows, one point per place when
    # the role has places. What the plan does not name is a hint, like a role
    # nothing fills: a thing with no point is simply not on the plan.
    from .floorplan import inside, placements  # noqa: PLC0415 - a leaf, imported here to stay one

    frame = data.get("plan")
    drawn = [a for a in house.areas if (a.get("plan") or {}).get("outline")]
    if frame and not drawn:
        hints.append("plan: the house gives a frame and no room draws an outline — no Plan tab")
    for a in house.areas:
        rp = a.get("plan")
        if not rp:
            continue
        if not frame:
            errors.append(
                f"{a['id']}: plan: the room draws itself and the house gives no frame — "
                "add `plan: {size: [width, height]}` (centimetres) beside areas:"
            )
        if house.parking(a):
            errors.append(f"{a['id']}: a parking room is nowhere — drop its `plan:`")
            continue
        declared = house.declared_roles(a)
        outline = rp["outline"]
        if frame:
            w, h = frame["size"]
            off = [p for p in outline if not (0 <= p[0] <= w and 0 <= p[1] <= h)]
            if off:
                warnings.append(
                    f"{a['id']}: plan: {len(off)} corner(s) outside the house's frame "
                    f"({w} × {h} cm) — {off[0]}"
                )
        for role, pos in (rp.get("at") or {}).items():
            if role not in declared:
                errors.append(
                    f"{a['id']}: plan places role {role!r}, and the room has no such role"
                )
                continue
            layout = list((declared.get(role) or {}).get("layout") or [])
            if isinstance(pos, dict):
                if not layout:
                    errors.append(
                        f"{a['id']}: plan gives role {role} a point per place, and the role "
                        "has no layout — one point, or a layout under roles:"
                    )
                    continue
                unknown = sorted(p for p in pos if p not in layout)
                if unknown:
                    errors.append(
                        f"{a['id']}: plan places {', '.join(unknown)} in {role}, and its layout "
                        "has no such place"
                    )
                points = list(pos.values())
            else:
                if layout:
                    errors.append(
                        f"{a['id']}: plan gives role {role} one point, and the role has places "
                        f"({', '.join(layout)}) — one point per place"
                    )
                points = [pos]
            for pt in points:
                if len(outline) >= 3 and not inside(outline, pt):
                    warnings.append(
                        f"{a['id']}: plan puts {role} at {pt}, outside the room's own outline"
                    )
        for kind in ("doors", "windows"):
            for i, o in enumerate(rp.get(kind) or []):
                if o.get("role") and o["role"] not in declared:
                    errors.append(
                        f"{a['id']}: plan {kind[:-1]} {i + 1} names role {o['role']!r}, and the "
                        "room has no such role"
                    )
                if len(outline) >= 3 and not inside(outline, o["at"]):
                    warnings.append(
                        f"{a['id']}: plan {kind[:-1]} {i + 1} at {o['at']} is not on the "
                        "room's outline"
                    )
        _placed, left = placements(house, a)
        if left:
            hints.append(
                f"{a['id']}: plan: {len(left)} thing(s) with a role and no point — not drawn: "
                + ", ".join(t["id"] for t in left)
            )

    # --- the vocabulary ----------------------------------------------------------
    modes = house.modes()
    mode_ids = {m["id"] for m in modes["modes"]} if modes else set()
    period_ids = [p["id"] for p in modes["periods"]] if modes else []
    for a in house.areas:
        if house.parking(a):
            # a PARKING room is a shelf, not a room that acts. Anything that would
            # act is a contradiction the file must resolve, not something to skip
            # quietly: the whole point is that nothing here is automated.
            said = [k for k in ("roles", "scenes", "defaults") if a.get(k)]
            if said:
                errors.append(
                    f"{a['id']}: a parking room declares {', '.join(said)} — nothing there is "
                    "acted upon; drop them, or drop `parking` and make it a room"
                )
            placed = sorted(t["id"] for t in house.things_in(a["id"]) if t.get("role"))
            if placed:
                errors.append(
                    f"{a['id']}: {', '.join(placed)} carry a role in a parking room — a thing "
                    "with a role has a place; move it to the room it lives in"
                )
            continue
        declared = house.declared_roles(a)
        filled = house.roles_in(a["id"])
        scenes = dict(a.get("scenes") or {})
        for role, spec in (a.get("roles") or {}).items():
            named = (spec or {}).get("places") or {}
            layout = (spec or {}).get("layout") or []
            known = set(layout) | {place.split("_")[0] for place in layout}
            for word in named:
                if word not in known:
                    errors.append(
                        f"{a['id']}: role {role} calls a place {word!r} something, and its "
                        "layout has no such place (nor a prefix of one)"
                    )
        for scene_id, looks in scenes.items():
            for role in looks:
                if role in SCENE_KEYS:
                    continue
                if role not in declared:
                    warnings.append(
                        f"{a['id']}: scene {scene_id} names role {role!r} — neither declared "
                        "under roles nor carried by a thing"
                    )
        for role in declared:
            if role in SCENE_KEYS:
                errors.append(
                    f"{a['id']}: role {role!r} wears a scene's own word — "
                    f"{', '.join(SCENE_KEYS)} can never be role names"
                )
        for plan in house.scene_plan(a):
            if plan["unknown"]:
                errors += [f"{a['id']}: scene {plan['id']}: {u}" for u in plan["unknown"]]
            errors += house.drift_errors(a, plan)
            d = house.drift_plan(a, plan) if not house.drift_errors(a, plan) else None
            if (plan.get("run") or {}).get("drift") and d is None:
                hints.append(
                    f"{a['id']}: scene {plan['id']} moves nothing yet — no place of "
                    f"{plan['run']['drift']['role']} it drifts is paired (the walk fills them)"
                )
            if d and d["step"] > d["asked"]:
                hints.append(
                    f"{a['id']}: scene {plan['id']} asks {d['asked']} s between colours on "
                    f"{d['role']} — the backend gives {d['floor']} s, stretched (a Zigbee bulb "
                    "ramps colour itself; a command inside that ramp aborts it)"
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
        raw_defaults = a.get("defaults") or {}
        has_base = any(d in raw_defaults for d in DAYLIGHT)
        if house.controls()["panel"] and raw_defaults:
            if not has_base:
                errors.append(
                    f"{a['id']}: the settings panel (controls.panel) needs daylight-first "
                    "defaults (H34) — a dark/dim/bright base the selects can carry"
                )
            partial = [
                k for k, v in raw_defaults.items() if k not in DAYLIGHT and isinstance(v, dict)
            ]
            if partial:
                errors.append(
                    f"{a['id']}: the settings panel cannot carry a partial period map "
                    f"({', '.join(partial)}) — a period override on the panel is a whole "
                    "scene, or `sun`"
                )
        for period in raw_defaults:
            if period in DAYLIGHT:
                continue
            if period_ids and period not in period_ids:
                errors.append(f"{a['id']}: defaults name period {period!r} — not in modes.periods")
        lightless = {
            s
            for s, looks in (a.get("scenes") or {}).items()
            if (roles := {r: v for r, v in (looks or {}).items() if r not in SCENE_KEYS})
            and all(not normalise_look(v)["on"] for v in roles.values())
        }
        for period, value in house.defaults_of(a).items():
            for d, scene in value.items():
                if scene not in scenes and scene != "off":
                    errors.append(
                        f"{a['id']}: default {period}/{d} names scene {scene!r} — the room has none"
                    )
                elif scene == "off" or scene in lightless:
                    errors.append(
                        f"{a['id']}: default {period}/{d} is {scene!r}, which lights nothing — "
                        "a default is what 'on' MEANS (H34); a person's off is the switch or "
                        "the mode, never the clock"
                    )
        if raw_defaults and period_ids and not has_base:
            missing = [p for p in period_ids if p not in raw_defaults]
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
