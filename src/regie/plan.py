"""The plan's workbench (0.14) — the editor is the draft, the files are the design.

Tom, 2026-09-03: *"it will be better if I can edit it myself using the editor
cause there is a lot to edit and I have the real vision"*. The family's
dashboard is rendered from the room files and cannot be edited in place; the
card's own drag-and-drop editor needs a storage dashboard. So the conductor
opens one — « L'Atelier du plan », admins only — seeded with the card exactly
as the files draw it. A person drags walls, doors and bulbs there and presses
Save; `regie plan pull` reads that draft back and rewrites the `plan:` block of
every room file, and nothing else in them. `regie plan push` re-seeds the
workbench from the files (a draft is overwritten on purpose, and says so).

What the pull keys on: an area is a room by its id; a thing is found by its
entity (the editor's picker sets one) or by its id (ours); an opening belongs
to the room whose outline it lies on. Every number is rounded to the
centimetre. What the pull cannot place is named, never dropped in silence.
"""

from __future__ import annotations

import re
from pathlib import Path

import yaml

from . import floorplan
from .errors import HouseError
from .house import House

WORKBENCH = "regie-atelier"  # the storage dashboard's url_path (a hyphen is required)


def workbench_config(house: House, link) -> dict:
    """One panel view holding the card as the files draw it."""
    return {
        "title": house.labels.ui.workbench,
        "views": [
            {
                "title": house.labels.ui.plan,
                "path": "plan",
                "type": "panel",
                "cards": [floorplan.card(house, link)],
            }
        ],
    }


def find_card(config: dict) -> dict | None:
    for view in (config or {}).get("views") or []:
        cards = list(view.get("cards") or [])
        for section in view.get("sections") or []:
            cards += section.get("cards") or []
        for c in cards:
            if c.get("type") == "custom:easy-floorplan-card":
                return c
    return None


def _floors(card: dict) -> list[dict]:
    if card.get("floors"):
        return list(card["floors"])
    return [{k: card.get(k) or [] for k in ("walls", "openings", "items", "areas")}]


def _pt(x, y) -> list[int]:
    return [int(round(float(x))), int(round(float(y)))]


def _nearest_room(rooms: dict[str, list], point: list) -> str | None:
    """The room whose outline the point lies on (within a hand), else None."""
    best, best_d = None, None
    for rid, outline in rooms.items():
        d = _edge_distance(outline, point)
        if best_d is None or d < best_d:
            best, best_d = rid, d
    return best if best_d is not None and best_d <= 15 else None


def _edge_distance(outline: list, point: list) -> float:
    import math

    px, py = point
    best = None
    n = len(outline)
    for i in range(n):
        (x1, y1), (x2, y2) = outline[i], outline[(i + 1) % n]
        dx, dy = x2 - x1, y2 - y1
        l2 = dx * dx + dy * dy
        t = 0.0 if l2 == 0 else max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / l2))
        d = math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
        best = d if best is None else min(best, d)
    return best if best is not None else float("inf")


def pull(house: House, card: dict) -> tuple[dict[str, dict], list[str]]:
    """The card as a person left it → one `plan:` block per room, and the notes."""
    notes: list[str] = []
    by_entity = {house.entity(t): t for t in house.things if house.entity(t)}
    by_id = {t["id"]: t for t in house.things}
    area_ids = {a["id"] for a in house.areas}
    blocks: dict[str, dict] = {}
    outlines: dict[str, list] = {}

    for f in _floors(card):
        for a in f.get("areas") or []:
            rid = a.get("id")
            if rid not in area_ids:
                notes.append(f"area {rid!r} ({a.get('name') or '?'}) is not a room — skipped")
                continue
            pts = [_pt(p["x"], p["y"]) for p in a.get("points") or []]
            if len(pts) < 3:
                notes.append(f"{rid}: fewer than three corners — skipped")
                continue
            outlines[rid] = pts
            blocks[rid] = {"outline": pts}

    old_plans = {a["id"]: (a.get("plan") or {}) for a in house.areas}
    # a point is where a PLACE is, whether or not a thing hangs there yet: the
    # card draws no badge for an unfilled place, so the old block's points stay
    # the base and the card's badges override them
    for rid in blocks:
        old_at = (old_plans.get(rid) or {}).get("at") or {}
        if old_at:
            blocks[rid]["at"] = {
                role: (dict(v) if isinstance(v, dict) else list(v)) for role, v in old_at.items()
            }
    for f in _floors(card):
        for o in f.get("openings") or []:
            point = _pt(o.get("x", 0), o.get("y", 0))
            rid = _nearest_room(outlines, point)
            if rid is None:
                notes.append(
                    f"opening {o.get('id')} at {point} lies on no room's outline — skipped"
                )
                continue
            kind = "windows" if o.get("type") == "window" else "doors"
            entry: dict = {"at": point, "width": int(round(float(o.get("length") or 80)))}
            thing = by_entity.get(o.get("entity") or "")
            if thing and thing.get("role") and thing["area"] == rid:
                entry["role"] = thing["role"]
            if o.get("flipH"):
                entry["flip_h"] = True
            if o.get("flipV"):
                entry["flip_v"] = True
            # `to:` is for the reader: kept from the old block by position
            index = len(blocks[rid].get(kind) or [])
            olds = (old_plans.get(rid) or {}).get(kind) or []
            if index < len(olds) and olds[index].get("to"):
                entry["to"] = olds[index]["to"]
            blocks[rid].setdefault(kind, []).append(entry)

        for it in f.get("items") or []:
            thing = by_entity.get(it.get("entity") or "") or by_id.get(it.get("id") or "")
            if not thing:
                notes.append(
                    f"item {it.get('id')} ({it.get('entity') or it.get('name') or '?'}) is no "
                    "thing of the house — skipped"
                )
                continue
            rid, role = thing["area"], thing.get("role")
            if not role:
                notes.append(f"{thing['id']} carries no role — a point needs one; skipped")
                continue
            if rid not in blocks:
                notes.append(f"{thing['id']}: its room {rid} is not drawn — skipped")
                continue
            point = _pt(it.get("x", 0), it.get("y", 0))
            spec = (house.area(rid).get("roles") or {}).get(role) or {}
            at = blocks[rid].setdefault("at", {})
            if spec.get("layout"):
                place = thing.get("at")
                if not place:
                    notes.append(
                        f"{thing['id']}: role {role} has places and the thing no `at` — skipped"
                    )
                    continue
                at.setdefault(role, {})[place] = point
            else:
                at[role] = point
    for rid in blocks:
        if "at" in blocks[rid]:
            # the layout's own order, then the roles as the room declares them
            area = house.area(rid)
            roles = list((area.get("roles") or {}).keys())
            ordered: dict = {}
            for role in roles + [r for r in blocks[rid]["at"] if r not in roles]:
                if role not in blocks[rid]["at"]:
                    continue
                v = blocks[rid]["at"][role]
                if isinstance(v, dict):
                    layout = list(((area.get("roles") or {}).get(role) or {}).get("layout") or [])
                    v = {p: v[p] for p in layout if p in v} | {
                        p: v[p] for p in v if p not in layout
                    }
                ordered[role] = v
            blocks[rid]["at"] = ordered
    return blocks, notes


# --- the block, written the way the room files are -----------------------------------
def _pair(p) -> str:
    return f"[{p[0]}, {p[1]}]"


def block_text(plan: dict) -> str:
    lines = ["plan:", "  outline: [" + ", ".join(_pair(p) for p in plan["outline"]) + "]"]
    for kind in ("doors", "windows"):
        if plan.get(kind):
            lines.append(f"  {kind}:")
            for o in plan[kind]:
                parts = [f"at: {_pair(o['at'])}", f"width: {o['width']}"]
                for k in ("role", "to"):
                    if o.get(k):
                        parts.append(f"{k}: {o[k]}")
                for k in ("flip_h", "flip_v"):
                    if o.get(k):
                        parts.append(f"{k}: true")
                lines.append("    - { " + ", ".join(parts) + " }")
    if plan.get("at"):
        lines.append("  at:")
        for role, v in plan["at"].items():
            if isinstance(v, dict):
                lines.append(f"    {role}:")
                lines += [f"      {place}: {_pair(p)}" for place, p in v.items()]
            else:
                lines.append(f"    {role}: {_pair(v)}")
    return "\n".join(lines) + "\n"


BLOCK = re.compile(r"^plan:\n(?:(?:[ \t]+.*|\s*)\n?)*", re.M)


def rewrite(path: Path, plan: dict) -> bool:
    """Replace the file's top-level `plan:` block (append one if it has none);
    every other byte of the file is kept. Returns whether it changed."""
    text = path.read_text(encoding="utf-8")
    new = block_text(plan)
    m = BLOCK.search(text)
    if m:
        out = text[: m.start()] + new + text[m.end() :]
    else:
        out = text + ("" if text.endswith("\n") else "\n") + new
    if out == text:
        return False
    path.write_text(out, encoding="utf-8")
    return True


def room_files(house: House, rooms_dir: Path | None = None) -> dict[str, Path]:
    """Which file holds which room: the included room files, by their `id:`."""
    paths = list(house.included.get("rooms") or [])
    if rooms_dir is not None:
        paths = sorted(Path(rooms_dir).glob("*.yml"))
    out: dict[str, Path] = {}
    for p in paths:
        try:
            data = yaml.safe_load(p.read_text(encoding="utf-8")) or {}
        except yaml.YAMLError as exc:
            raise HouseError(f"{p.name}: not YAML — {exc}") from exc
        if isinstance(data, dict) and data.get("id"):
            out[data["id"]] = p
    return out
