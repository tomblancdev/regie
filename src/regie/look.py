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

from .fx import KELVIN
from .house import House

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


def room_look(house: House, area: dict, read) -> tuple[dict, list[str]]:
    """The room's lights as a look, by role. `read(entity)` returns Home
    Assistant's state object (or None). Returns (look, notes) — a note per
    light left out and why."""
    look: dict = {}
    notes: list[str] = []
    roles = area.get("roles") or {}
    for role, things in house.roles_in(area["id"]).items():
        lights = [t for t in things if t["kind"] == "light"]
        if not lights:
            continue
        layout = list((roles.get(role) or {}).get("layout") or [])
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
        if not per:
            continue
        if layout:
            look[role] = fold_places(layout, per)
        else:
            values = list(per.values())
            if all(v == values[0] for v in values):
                look[role] = values[0]
            else:
                look[role] = values[0]
                notes.append(
                    f"{role}: {len(values)} lights disagree and the role has no layout — "
                    "the first one is written"
                )
    return look, notes


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
