"""A house: home.yml loaded, validated against the schema (the packs'
fragments merged), cross-checked, with the profile, the packs and the
labels resolved. Everything a template reads comes from here."""

from __future__ import annotations

import copy
import json
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator

from .errors import HouseError
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


def base_schema() -> dict:
    return json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))


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

    def area(self, area_id: str) -> dict:
        for a in self.areas:
            if a["id"] == area_id:
                return a
        raise HouseError(f"no area {area_id!r}")

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


# --- loading ----------------------------------------------------------------
def _validate(schema: dict, data: dict, path: Path) -> None:
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


def _fill_defaults(data: dict) -> None:
    for t in data.get("things", []):
        t.setdefault("bind", [])
        t.setdefault("options", {})


def _cross_check(house: House) -> list[str]:
    data = house.data
    warnings: list[str] = []
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

    if not house.labels.found:
        warnings.append(
            f"no labels for lang {house.labels.lang!r} "
            f"(known: {', '.join(Labels.known())}) — English used"
        )
    if errors:
        raise HouseError(f"{house.path}:\n  " + "\n  ".join(errors))
    return warnings


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

    schema = base_schema()
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
    house = House(path, data, profile, packs, labels, known_kinds, known_via)
    house.warnings = _cross_check(house)
    return house
