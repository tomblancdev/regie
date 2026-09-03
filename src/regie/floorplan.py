"""The plan — the flat drawn from declarations (0.13).

A house says where its rooms are: each room's `plan.outline`, in centimetres,
in one frame — the flat's outer envelope, `plan.size`. It says where its doors
and windows pierce the walls, and where each thing hangs (`plan.at`, by role
and, for a ceiling of many lights, by place — the layout's own words). This
turns those declarations into the one card the Plan tab is drawn with,
`easy-floorplan` (vendored under base/www/, see VENDOR.md; loaded through the
same `extra_module_url` seam as the skin): the walls are the outlines' edges,
an opening sits on the edge nearest to its point, an area per room is linked to
Home Assistant's area and holds the room's page one gesture away, and an item
per placed thing pools the light's own colour and brightness on the plan.

Nothing here is inferred (guidelines 1.12): a thing with no point is not on
the plan, and `check` says so. The grammar is the house's; the card is a
renderer, and a renderer can be swapped without a room file changing.
"""

from __future__ import annotations

import math

from .house import House

GLOW = 130  # how far a light at full brightness pools its colour, in centimetres
OPACITY = 0.5  # how strongly the house's own drawing shows under the walls

# a thing with no entity of its own is a static badge (never "offline"), and
# wears an icon for what the house calls it. The product's kinds first; then
# the words a house tends to invent for its appliances (kept and labelled by
# their id, house.py) - a hood on a family's map should not be a question mark
ICONS = {
    "remote": "mdi:remote",
    "satellite": "mdi:microphone",
    "coordinator": "mdi:access-point",
    "proxy": "mdi:bluetooth",
    "receiver": "mdi:audio-video",
    "amplifier": "mdi:audio-video",
    "hood": "mdi:fan",
    "oven": "mdi:stove",
    "hob": "mdi:pot-steam",
    "fridge": "mdi:fridge",
    "freezer": "mdi:fridge",
    "washer": "mdi:washing-machine",
    "dryer": "mdi:tumble-dryer",
    "dishwasher": "mdi:dishwasher",
    "printer": "mdi:printer",
    "router": "mdi:router-wireless",
    "nas": "mdi:nas",
    "console": "mdi:controller",
    "projector": "mdi:projector",
    "screen": "mdi:television",
    "speaker": "mdi:speaker",
}
DEFAULT_ICON = "mdi:checkbox-blank-circle-outline"


def edge_angle(outline: list, point: list) -> float:
    """The angle (degrees, 0 ≤ a < 180) of the outline's edge nearest to the
    point — the wall an opening pierces."""
    best, angle = None, 0.0
    px, py = point
    n = len(outline)
    for i in range(n):
        (x1, y1), (x2, y2) = outline[i], outline[(i + 1) % n]
        dx, dy = x2 - x1, y2 - y1
        length2 = dx * dx + dy * dy
        if length2 == 0:
            continue
        t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / length2))
        d = math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
        if best is None or d < best:
            best = d
            angle = math.degrees(math.atan2(dy, dx)) % 180
    return round(angle, 1)


def inside(outline: list, point: list) -> bool:
    """Ray casting — is the point inside the polygon (a point on an edge counts
    as inside, near enough for a typo check)."""
    x, y = point
    n = len(outline)
    hit = False
    for i in range(n):
        (x1, y1), (x2, y2) = outline[i], outline[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            cross = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            if x < cross:
                hit = not hit
        # on the edge: within a centimetre of the segment
        dx, dy = x2 - x1, y2 - y1
        length2 = dx * dx + dy * dy
        if length2:
            t = max(0.0, min(1.0, ((x - x1) * dx + (y - y1) * dy) / length2))
            if math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)) <= 1.0:
                return True
    return hit


def placements(house: House, area: dict) -> tuple[list[dict], list[dict]]:
    """Where this room's things hang: (placed, not placed). Placed = a list of
    {thing, x, y}; a role without a layout takes one point for every thing
    filling it (several stack a hand apart); a role with a layout takes one
    point per PLACE, and a thing is placed by its `at`."""
    plan = area.get("plan") or {}
    at = plan.get("at") or {}
    # a role a door or a window names is drawn AS that opening's leaf: its
    # thing is neither a badge nor missing
    bound = {
        o["role"] for kind in ("doors", "windows") for o in (plan.get(kind) or []) if o.get("role")
    }
    placed: list[dict] = []
    left: list[dict] = []
    for role, things in house.roles_in(area["id"]).items():
        if role in bound:
            continue
        pos = at.get(role)
        for i, t in enumerate(things):
            if pos is None:
                left.append(t)
            elif isinstance(pos, dict):
                p = pos.get(t.get("at") or "")
                if p is None:
                    left.append(t)
                else:
                    placed.append({"thing": t, "x": p[0], "y": p[1]})
            else:
                placed.append({"thing": t, "x": pos[0] + 20 * i, "y": pos[1]})
    return placed, left


def rooms_drawn(house: House) -> list[dict]:
    return [a for a in house.areas if (a.get("plan") or {}).get("outline")]


def _points(outline: list) -> list[dict]:
    return [{"x": p[0], "y": p[1]} for p in outline]


def _opening(house: House, area: dict, kind: str, i: int, spec: dict) -> dict:
    out: dict = {
        "id": f"{area['id']}_{kind}_{i + 1}",
        "type": kind,
        "x": spec["at"][0],
        "y": spec["at"][1],
        "length": spec["width"],
        "angle": edge_angle(area["plan"]["outline"], spec["at"]),
        "motion": "swing" if kind == "door" else "fixed",
    }
    if spec.get("role"):
        things = house.roles_in(area["id"]).get(spec["role"], [])
        entity = next((e for e in (house.entity(t) for t in things) if e), None)
        if entity:
            out["entity"] = entity
            if kind == "window":
                out["motion"] = "swing"
    if spec.get("flip_h"):
        out["flipH"] = True
    if spec.get("flip_v"):
        out["flipV"] = True
    return out


def _item(house: House, area: dict, glow: float, placed: dict) -> dict:
    t = placed["thing"]
    entity = house.entity(t)
    out: dict = {
        "id": t["id"],
        "x": placed["x"],
        "y": placed["y"],
        "name": t.get("label") or house.labels.kind(t["kind"]),
        "showName": False,
        "showState": False,
    }
    if entity:
        out["entity"] = entity
        out["kind"] = entity.split(".")[0]
    else:
        out["icon"] = ICONS.get(t["kind"], DEFAULT_ICON)
    if t["kind"] == "light":
        out["glow"] = True
        out["glowRadius"] = glow
    return out


def _area(house: House, area: dict, link) -> dict:
    out: dict = {
        "id": area["id"],
        "name": area["label"],
        "showName": True,
        "haArea": area["id"],
        "points": _points(area["plan"]["outline"]),
        # tap zooms the plan onto the room (the card's own gesture, the map's
        # own question: where is what); holding walks to the room's page
        "hold_action": {"action": "navigate", "navigation_path": link(area["id"])},
    }
    motion = [t for t in house.things_in(area["id"]) if t["kind"] == "motion"]
    entity = next((e for e in (house.entity(t) for t in motion) if e), None)
    if entity:
        out["entity"] = entity
        out["highlight"] = "fill"
    return out


def floor_of(house: House, area: dict) -> str:
    """Which floor a room is drawn on: its own, or the house's first."""
    floors = house.floors()
    return area.get("floor") or (floors[0]["id"] if floors else "ground")


def card(house: House, link) -> dict:
    """The whole card: one floor per floor the drawn rooms name, every floor
    in the house's frame; the house's drawing under the first."""
    plan = house.plan() or {}
    width, height = plan["size"]
    glow = plan.get("glow", GLOW)
    by_floor: dict[str, dict] = {}
    for area in rooms_drawn(house):
        fid = floor_of(house, area)
        f = by_floor.setdefault(fid, {"walls": [], "openings": [], "areas": [], "items": []})
        outline = area["plan"]["outline"]
        for i in range(len(outline)):
            (x1, y1), (x2, y2) = outline[i], outline[(i + 1) % len(outline)]
            f["walls"].append(
                {"id": f"{area['id']}_w{i + 1}", "x1": x1, "y1": y1, "x2": x2, "y2": y2}
            )
        for kind in ("door", "window"):
            for i, spec in enumerate(area["plan"].get(f"{kind}s") or []):
                f["openings"].append(_opening(house, area, kind, i, spec))
        f["areas"].append(_area(house, area, link))
        placed, _left = placements(house, area)
        f["items"] += [_item(house, area, glow, p) for p in placed]

    labels = {f["id"]: f for f in house.floors()}
    floors = []
    for n, (fid, f) in enumerate(by_floor.items()):
        # a house on one floor that never named it: the floor is the house
        name = labels.get(fid, {}).get("label") or house.data["house"]["label"]
        floor: dict = {"id": fid, "name": name}
        if n == 0 and plan.get("image"):
            floor["image"] = f"/local/{plan['image'].rsplit('/', 1)[-1]}"
            floor["imageFit"] = "stretch"
            floor["imageOpacity"] = plan.get("opacity", OPACITY)
        floor.update(f)
        floors.append(floor)

    out: dict = {
        "type": "custom:easy-floorplan-card",
        "width": width,
        "height": height,
        # badges keep their screen size while the plan scales - a bulb stays a
        # thumb's target on a phone, and zooming a room spreads them apart
        "overlayScale": "fixed",
        "compactHeader": True,
        "pressEffect": "scale",
        "offlineStyle": "dim",
        "floors": floors,
    }
    if floors:
        out["defaultFloor"] = floors[0]["id"]
    return out
