"""A look you tried on the real ceiling, written down (0.13) — the `look` verb.

The try mode is the room itself: set the bulbs from the plan (Home Assistant's
own panel, the last rung), look at the room, and when it is right, `regie look
--room <id>` reads what the lights are doing and prints it in the house's own
grammar — by role and by place, `brightness:` in percent, `ct:` as one of the
house's words when the bulb sits on one, `color:` as hex — ready to paste
under the room's `scenes:`. The file stays the design; the room was the draft.

Folding: every place of a role reading the same thing is said once, at the
role; a prefix whose places all agree is said once, at the prefix (the words a
look may already use); anything else is said per place, in the layout's order.
"""

from __future__ import annotations

from .errors import HouseError
from .house import KELVIN, House

CT_TOLERANCE = 150  # kelvins: this close to one of the house's words, it IS that word


def look_of_state(state: dict | None, kelvin: dict | None = None) -> str | dict | None:
    """One light's state, as the grammar says it: `off`, `on`, or a mapping.
    None for a light that cannot be read (unavailable, unknown, absent)."""
    kelvin = kelvin or KELVIN
    if not state or state.get("state") in (None, "unavailable", "unknown"):
        return None
    if state["state"] == "off":
        return "off"
    a = state.get("attributes") or {}
    out: dict = {}
    if a.get("brightness") is not None:
        out["brightness"] = max(1, round(int(a["brightness"]) * 100 / 255))
    mode = a.get("color_mode")
    if mode == "color_temp" and a.get("color_temp_kelvin"):
        k = int(a["color_temp_kelvin"])
        word = min(kelvin, key=lambda w: abs(kelvin[w] - k))
        out["ct"] = word if abs(kelvin[word] - k) <= CT_TOLERANCE else k
    elif mode in ("hs", "rgb", "xy", "rgbw", "rgbww") and a.get("rgb_color"):
        r, g, b = (int(v) for v in a["rgb_color"][:3])
        out["color"] = f"#{r:02x}{g:02x}{b:02x}"
    return out or "on"


def fold_places(layout: list[str], per_place: dict) -> str | dict:
    """Per-place readings folded onto the words a look may use."""
    values = list(per_place.values())
    if values and all(v == values[0] for v in values):
        return values[0]
    out: dict = {}
    by_prefix: dict[str, list[str]] = {}
    for place in layout:
        by_prefix.setdefault(place.split("_")[0], []).append(place)
    said: set[str] = set()
    for place in layout:
        if place not in per_place or place in said:
            continue
        prefix = place.split("_")[0]
        siblings = [p for p in by_prefix[prefix] if p in per_place]
        if (
            len(by_prefix[prefix]) >= 2
            and len(siblings) == len(by_prefix[prefix])
            and all(per_place[p] == per_place[place] for p in siblings)
        ):
            out[prefix] = per_place[place]
            said.update(siblings)
        else:
            out[place] = per_place[place]
            said.add(place)
    return out


def room_places(house: House, area: dict, read) -> tuple[dict[str, dict], list[str]]:
    """Every light of every filled role, read one by one: role → place (the
    `at:` word, else the thing's id) → what the grammar says. `read(entity)`
    returns Home Assistant's state object (or None). A light that cannot be
    read is left out, with a note."""
    per_role: dict[str, dict] = {}
    notes: list[str] = []
    for role, things in house.roles_in(area["id"]).items():
        lights = [t for t in things if t["kind"] == "light"]
        if not lights:
            continue
        per: dict = {}
        for t in lights:
            entity = house.entity(t)
            st = read(entity) if entity else None
            v = look_of_state(st, house.kelvin())
            key = t.get("at") or t["id"]
            if v is None:
                notes.append(f"{role}/{key}: {(st or {}).get('state') or 'not read'} — left out")
                continue
            per[key] = v
        if per:
            per_role[role] = per
    return per_role, notes


def fold_role(area: dict, role: str, per: dict, notes: list[str]):
    """One role's per-place readings folded onto the words a look may use:
    by the layout when the role has one; a single value when every light
    agrees; else the first one, said."""
    layout = list(((area.get("roles") or {}).get(role) or {}).get("layout") or [])
    if layout:
        return fold_places(layout, per)
    values = list(per.values())
    if not all(v == values[0] for v in values):
        notes.append(
            f"{role}: {len(values)} lights disagree and the role has no layout — "
            "the first one is written"
        )
    return values[0]


def room_look(house: House, area: dict, read) -> tuple[dict, list[str]]:
    """The room's lights as a look, by role. `read(entity)` returns Home
    Assistant's state object (or None). Returns (look, notes) — a note per
    light left out and why."""
    per_role, notes = room_places(house, area, read)
    return {role: fold_role(area, role, per, notes) for role, per in per_role.items()}, notes


# --- the keep's line (0.36, the audit's V5) -------------------------------------------
KEEP_FIELDS = ("brightness", "color_mode", "color_temp_kelvin", "rgb_color")


def keep_line(ha, button: str, pressed: str) -> dict | None:
    """The logbook line « Garder » wrote when the button was pressed: the
    keep automation logs, on the button itself, the look the room wore and
    what every light of it did at that moment — `{"look": …, "lights":
    [[entity, state, brightness, color_mode, color_temp_kelvin, rgb_color],
    …]}`. The recorder does NOT hold a light's brightness or colour (the
    light domain marks them unrecorded — read in Home Assistant 2026.8's
    own source), so the line is the record; the logbook keeps it for the
    recorder's days. Returns the parsed line as {"look": …, "states":
    {entity: a state object}} or None when the logbook holds none."""
    import datetime as dt
    import json
    import urllib.parse

    start = dt.datetime.fromisoformat(pressed)
    end = start + dt.timedelta(minutes=2)
    query = urllib.parse.urlencode({"entity": button, "end_time": end.isoformat()})
    status, data = ha.get(f"/api/logbook/{urllib.parse.quote(start.isoformat())}?{query}")
    if status != 200:
        raise HouseError(f"logbook at {pressed}: {status} {data}")
    for entry in data or []:
        if entry.get("entity_id") != button or not isinstance(entry.get("message"), str):
            continue
        try:
            line = json.loads(entry["message"])
        except ValueError:
            continue
        if not isinstance(line, dict) or "lights" not in line:
            continue
        states: dict[str, dict] = {}
        for row in line.get("lights") or []:
            if not isinstance(row, list) or len(row) < 2:
                continue
            entity, state, *rest = row
            attributes = dict(zip(KEEP_FIELDS, rest, strict=False))
            states[entity] = {"entity_id": entity, "state": state, "attributes": attributes}
        return {"look": line.get("look"), "states": states, "when": entry.get("when")}
    return None


def _scalar(v) -> str:
    """One value the way the room files spell it: `on` / `off` bare, a colour
    in double quotes (a bare `#` opens a comment), a word or a number as is."""
    if v is True or v == "on":
        return "on"
    if v is False or v == "off":
        return "off"
    if isinstance(v, str):
        return f'"{v}"' if v.startswith("#") else v
    return str(v)


def _leaf(value) -> str:
    """A look for one target: a state word, or a flow mapping with air in it —
    `{ brightness: 30, ct: warm }`, the room files' own shape."""
    if isinstance(value, dict):
        return "{ " + ", ".join(f"{k}: {_scalar(v)}" for k, v in value.items()) + " }"
    return _scalar(value)


def snippet(name: str, look: dict, label: str | None = None) -> str:
    """The block to paste under the room's `scenes:` — every role on its own
    line, a leaf look in flow style, a role's places one under the other.
    Written by hand rather than dumped: a dumper spells `off` as `false` and
    folds a scene of scalars onto one line, and neither is how a room file
    reads."""
    lines = ["scenes:", f"  {name}:"]
    if label:
        lines.append(f"    label: {_scalar(label)}")
    for role, value in look.items():
        places = isinstance(value, dict) and any(isinstance(v, dict) for v in value.values())
        places = places or (
            isinstance(value, dict) and any(v in ("on", "off", True, False) for v in value.values())
        )
        if places:
            lines.append(f"    {role}:")
            lines += [f"      {place}: {_leaf(v)}" for place, v in value.items()]
        else:
            lines.append(f"    {role}: {_leaf(value)}")
    return "\n".join(lines) + "\n"
