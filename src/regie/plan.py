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

import json
import re
import unicodedata
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


def slug(text: str) -> str:
    """What Home Assistant makes of a label as an id: ascii, lower, one
    underscore between words (« La Réserve » → la_reserve, « L'Atelier » → l_atelier)."""
    ascii_ = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "_", ascii_.lower()).strip("_")


def room_keys(house: House) -> dict[str, str]:
    """Every name a room answers to → its id: the id itself, its label, its
    aliases (what people say — and what the conductor adopted an area by), all
    as Home Assistant would slug them. The editor rewrites an area's id and
    keeps the link to the HA area (`haArea`) and the name; either finds the room."""
    out: dict[str, str] = {}
    for a in house.areas:
        for word in [a["id"], a.get("label") or ""] + list(a.get("aliases") or []):
            if word:
                out.setdefault(slug(word), a["id"])
    return out


def _room_of_area(house: House, keys: dict[str, str], area: dict) -> str | None:
    for word in (area.get("id"), area.get("haArea"), area.get("name")):
        if word and slug(str(word)) in keys:
            return keys[slug(str(word))]
    return None


_IEEE = re.compile(r"0x[0-9a-f]{16}")


def _thing_of_entity(house: House, by_entity: dict, entity: str) -> tuple[dict | None, str | None]:
    """The thing behind an entity the editor's picker chose: the entity the
    engine derives, or the one a row names (`entity:`); failing both, a Zigbee
    address inside the id names the thing without placing it (a hint)."""
    if entity in by_entity:
        return by_entity[entity], None
    m = _IEEE.search(entity)
    if m:
        for t in house.things:
            if (t.get("ieee") or "").lower() == m.group(0):
                return None, (
                    f"{entity} is {t['id']}'s ({t.get('label') or t['kind']}) — "
                    f"name it on the row (`entity: {entity}`) and give it a room and a role"
                )
    return None, None


def pull(house: House, card: dict) -> tuple[dict[str, dict], list[str]]:
    """The card as a person left it → one `plan:` block per room, and the notes."""
    notes: list[str] = []
    by_entity = {house.entity(t): t for t in house.things if house.entity(t)}
    by_entity.update({t["entity"]: t for t in house.things if t.get("entity")})
    by_id = {t["id"]: t for t in house.things}
    keys = room_keys(house)
    blocks: dict[str, dict] = {}
    outlines: dict[str, list] = {}

    for f in _floors(card):
        for a in f.get("areas") or []:
            rid = _room_of_area(house, keys, a)
            if rid is None:
                notes.append(
                    f"area {a.get('id')!r} ({a.get('name') or '?'}, HA area "
                    f"{a.get('haArea') or '-'}) is no room of the house — skipped"
                )
                continue
            if rid in blocks:
                notes.append(f"{rid}: drawn twice ({a.get('id')}) — the first outline is kept")
                continue
            pts = [_pt(p["x"], p["y"]) for p in a.get("points") or []]
            if len(pts) < 3:
                notes.append(f"{rid}: fewer than three corners — skipped")
                continue
            outlines[rid] = pts
            blocks[rid] = {"outline": pts}

    old_plans = {a["id"]: (a.get("plan") or {}) for a in house.areas}
    placed: set[tuple] = set()  # (room, role, place) the CARD placed - a person's gesture
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
            thing, _hint = _thing_of_entity(house, by_entity, o.get("entity") or "")
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
            thing, hint = _thing_of_entity(house, by_entity, it.get("entity") or "")
            thing = thing or by_id.get(it.get("id") or "")
            if not thing:
                notes.append(
                    hint
                    or f"item {it.get('id')} ({it.get('entity') or it.get('name') or '?'}) is no "
                    "thing of the house — a row naming it (`entity:`) would place it; skipped"
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
                placed.add((rid, role, place))
            else:
                at[role] = point
                placed.add((rid, role, None))
    # a KEPT point (a place nothing fills yet) that fell outside the room's NEW
    # outline is dropped and named: a room that moved in the editor left it
    # behind, and a point outside its room is a wrong answer, not a memory. A
    # point the card PLACED stays wherever it is - a person put it there (the
    # air sensor of Le Passage sits on La Cantine's side; check says so) - read
    # live 2026-09-03, when the first cut dropped it
    for rid, block in blocks.items():
        at = block.get("at") or {}
        for role in list(at):
            v = at[role]
            if isinstance(v, dict):
                for place in list(v):
                    if (rid, role, place) in placed:
                        continue
                    if not floorplan.inside(block["outline"], v[place]):
                        notes.append(
                            f"{rid}: {role}/{place} at {v[place]} fell outside the room's new "
                            "outline — dropped (place it again once a thing hangs there)"
                        )
                        del v[place]
                if not v:
                    del at[role]
            elif (rid, role, None) not in placed and not floorplan.inside(block["outline"], v):
                notes.append(
                    f"{rid}: {role} at {v} fell outside the room's new outline — dropped "
                    "(place it again once a thing hangs there)"
                )
                del at[role]
        if "at" in block and not block["at"]:
            del block["at"]
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


# --- the walls (0.15): the flat's own, as drawn -------------------------------------------
def pull_walls(card: dict) -> list[list[int]]:
    """Every wall a person drew, first floor first, rounded to the centimetre."""
    out: list[list[int]] = []
    for f in _floors(card):
        for w in f.get("walls") or []:
            try:
                out.append(_pt(w["x1"], w["y1"]) + _pt(w["x2"], w["y2"]))
            except (KeyError, TypeError, ValueError):
                continue
    return out


WALLS = re.compile(r"^walls:\n(?:(?:[ \t]+.*|\s*)\n?)*", re.M)


def walls_text(walls: list[list[int]]) -> str:
    lines = ["walls:"] + [f"  - [{w[0]}, {w[1]}, {w[2]}, {w[3]}]" for w in walls]
    return "\n".join(lines) + "\n"


def rewrite_walls(path: Path, walls: list[list[int]]) -> bool:
    """Replace the plan file's top-level `walls:` block (append one if it has
    none); every other byte of the file - the frame, the drawing - is kept."""
    text = path.read_text(encoding="utf-8")
    new = walls_text(walls)
    m = WALLS.search(text)
    out = (
        text[: m.start()] + new + text[m.end() :]
        if m
        else text + ("" if text.endswith("\n") else "\n") + new
    )
    if out == text:
        return False
    path.write_text(out, encoding="utf-8")
    return True


# --- the sync (0.16): the draft follows the files, unless it holds a person's work -----
# Tom, 2026-09-04: the things the install placed (sensors, remotes, the stars,
# the corridor's six) were in the room files and NOT in his editor - apply
# seeded the workbench once and only `plan push` re-seeded it, by hand. The
# rule now: at every converge the draft follows the files, UNLESS it holds
# edits not yet pulled - then the converge says so and keeps the person's
# work. Never the other way: the files change by `regie plan pull`, a hand's
# act. To tell a person's gesture from the files' own move, the conductor
# remembers what it last seeded (<root>/.regie/plan-seed.json) and compares
# the draft and the files against that memory - the way the pull would read
# them, never on ids: the editor re-mints every id on Save.
SEED = "plan-seed.json"


def seed_path(root: Path) -> Path:
    from .host import STATE

    return Path(root) / STATE / SEED


def _json(value):
    return json.loads(json.dumps(value))


def read_seed(root: Path) -> dict | None:
    """The card as it was last seeded, or None when the conductor has no memory
    of one (a workbench opened before 0.16, a fresh root)."""
    p = seed_path(root)
    if not p.is_file():
        return None
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except ValueError:
        return None
    return data.get("card") if isinstance(data, dict) else None


def seed(ws, house: House, root: Path, link) -> dict:
    """Seed the workbench with the card as the files draw it, and remember
    what was seeded - the memory is what lets a later converge tell a draft
    still equal to its seed (it follows the files) from one a person drew on
    since (it is kept)."""
    config = workbench_config(house, link)
    ws.call("lovelace/config/save", url_path=WORKBENCH, config=config)
    p = seed_path(root)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps({"card": find_card(config)}, indent=2) + "\n", encoding="utf-8")
    return config


def _thing_key(item: dict) -> str:
    # the entity survives a Save (the picker set it), the id does not; a thing
    # with no entity is known by its name, the pull's own limit
    return item.get("entity") or item.get("name") or item.get("id") or "?"


def normal(house: House, card: dict) -> dict:
    """What the pull READS and nothing the editor rewrites by itself: a room's
    outline by the room's own id (an area re-minted on Save is found the way
    the pull finds it), a thing's point by its entity, an opening by what it
    is and where it stands, the walls - every number rounded to the
    centimetre. Two cards with the same normal form pull into the same files."""
    keys = room_keys(house)
    rooms: dict[str, list] = {}
    things: dict[str, list] = {}
    openings: list[list] = []
    for f in _floors(card):
        for a in f.get("areas") or []:
            rid = _room_of_area(house, keys, a) or slug(
                str(a.get("haArea") or a.get("name") or a.get("id") or "?")
            )
            rooms.setdefault(rid, [_pt(p["x"], p["y"]) for p in a.get("points") or []])
        for o in f.get("openings") or []:
            openings.append(
                [
                    "window" if o.get("type") == "window" else "door",
                    *_pt(o.get("x", 0), o.get("y", 0)),
                    int(round(float(o.get("length") or 80))),
                    o.get("entity") or "",
                    bool(o.get("flipH")),
                    bool(o.get("flipV")),
                ]
            )
        for it in f.get("items") or []:
            things.setdefault(_thing_key(it), _pt(it.get("x", 0), it.get("y", 0)))
    return {
        "rooms": rooms,
        "things": things,
        "openings": sorted(openings, key=json.dumps),
        "walls": sorted(pull_walls(card)),
    }


def _some(names, n: int = 3) -> str:
    names = list(names)
    return ", ".join(names[:n]) + (f", +{len(names) - n}" if len(names) > n else "")


def describe(before: dict, after: dict) -> str:
    """The way from one normal form to the other, in a few words."""
    out: list[str] = []
    ra, rb = before["rooms"], after["rooms"]
    for word, rooms in (
        ("drawn", [r for r in rb if r not in ra]),
        ("gone", [r for r in ra if r not in rb]),
        ("redrawn", [r for r in rb if r in ra and ra[r] != rb[r]]),
    ):
        if rooms:
            out.append(f"{len(rooms)} room(s) {word} ({_some(rooms)})")
    ta, tb = before["things"], after["things"]
    for word, things in (
        ("placed", [t for t in tb if t not in ta]),
        ("removed", [t for t in ta if t not in tb]),
        ("moved", [t for t in tb if t in ta and ta[t] != tb[t]]),
    ):
        if things:
            out.append(f"{len(things)} thing(s) {word} ({_some(things)})")
    if before["openings"] != after["openings"]:
        out.append("the openings")
    if before["walls"] != after["walls"]:
        out.append("the walls")
    return ", ".join(out) or "nothing"


def sync(house: House, root: Path, draft: dict | None, link) -> tuple[str, str, bool]:
    """THE ONE-WAY SYNC: the step's state and detail, and whether to re-seed.
    Three readings decide - the draft, the files, and the memory of the last
    seed: a draft that still is its seed follows the files; a draft a person
    drew on since is kept, and the converge says so - `hand` when the files
    moved too, so the two truths wait for the pull to meet."""
    fresh = _json(find_card(workbench_config(house, link)))
    files_n = normal(house, fresh)
    card = find_card(draft or {})
    if card is None:
        return "changed", f"/{WORKBENCH} re-seeded from the files (it held no plan card)", True
    draft_n = normal(house, card)
    seeded = read_seed(root)
    seed_n = normal(house, seeded) if seeded else None
    if draft_n == files_n:
        # nothing a pull would write: the draft agrees with the files, and what
        # the files alone say (a label, the drawing, a badge's face) reaches it
        if seeded == fresh:
            return "ok", f"/{WORKBENCH} follows the files", False
        return (
            "changed",
            f"/{WORKBENCH} re-seeded from the files (the draft agreed with them - nothing lost)",
            True,
        )
    if seed_n is None:
        return (
            "hand",
            f"/{WORKBENCH} differs from the files ({describe(files_n, draft_n)}) and the "
            "conductor has no memory of the last seed - kept; `regie plan pull` if that is "
            "your work, then `regie plan push`",
            False,
        )
    if draft_n == seed_n:
        way = describe(seed_n, files_n)
        return "changed", f"/{WORKBENCH} re-seeded from the files ({way})", True
    edits = describe(seed_n, draft_n)
    if files_n == seed_n:
        return (
            "ok",
            f"/{WORKBENCH} holds edits not yet pulled ({edits}) - `regie plan pull` writes them",
            False,
        )
    return (
        "hand",
        f"/{WORKBENCH} holds edits not yet pulled ({edits}) and the files moved since "
        f"({describe(seed_n, files_n)}) - kept; `regie plan pull`, then converge",
        False,
    )
