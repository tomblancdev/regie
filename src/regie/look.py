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

import re

import yaml

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


def snippet(name: str, look: dict, label: str | None = None) -> str:
    """The block to paste under the room's `scenes:` — leaf mappings in flow
    style, the way the room files are written."""
    body: dict = {}
    if label:
        body["label"] = label
    body.update(look)
    text = yaml.safe_dump(
        {"scenes": {name: _states(body)}},
        default_flow_style=None,
        sort_keys=False,
        allow_unicode=True,
        width=10**6,
    )
    # the room files spell a state `on` / `off`, bare - YAML 1.1's booleans,
    # which is what the loader reads them as; the dumper would write true/false
    return re.sub(
        r": (true|false)$", lambda m: ": on" if m.group(1) == "true" else ": off", text, flags=re.M
    )


def _states(value):
    """`on` / `off` as the booleans YAML 1.1 reads them as (the schema's own
    form), leaving every mapping and colour as it is."""
    if value == "on":
        return True
    if value == "off":
        return False
    if isinstance(value, dict):
        return {k: _states(v) for k, v in value.items()}
    return value
