"""What the phone owns (0.33, the audit's V4): ONE rule for every thing a
person may tune on the phone that the files also declare — a knob (a
period's hour, a room's look for a stretch of the day, the day's palette
rules as one thing), the plan's draft, a palette store. Three mechanisms
said it three ways before (the knobs' marks with the UI winning for good,
the workbench's seed, a store freed on its name alone); they read the same
three things now and speak the same words.

THE RULE — three readings and one word. The FILES: what the house declares.
The PHONE: what the brain holds. The SEED: what the conductor last wrote to
the brain, its memory (`.regie/knobs.json`, `.regie/plan-seed.json`; a
store's seed is definitional — the conductor only ever frees one).

  phone == files            → agree:  it FOLLOWS THE FILES (the memory refreshed)
  no memory                 → blind:  the kind says — a fresh helper has no word
                                       of its own, the file leads; a draft may hold
                                       a person's work, a hand decides
  phone == seed, files moved → file:   the file leads — written to the phone
  files == seed, phone moved → phone:  EDITED ON THE PHONE, kept, not yet pulled
  both moved                → both:   BY HAND — `regie pull` keeps the phone's,
                                       `regie push` the files'

`regie pull home.yml [kind …]` brings the phone's edits into the house files
(every other byte kept — edit.py), `regie push home.yml [kind …]` writes the
files' word onto the phone, the hand's override. A KIND says how to read
the three, how to describe the way between two readings, how to write the
phone and how to write the files.

THE FOURTH KIND (0.36, the audit's V5): a LOOK KEPT ON THE PHONE. A room has
one button, « Garder » (input_button.<room>_keep): tune the bulbs in Home
Assistant's own light panel, press it. The button IS the record — its state
is the moment it was pressed, and the recorder holds every bulb's brightness
and colour for its days — so the conductor reads the room's lights and the
look the room wore (input_select.<room>_look) AT THAT SECOND, projects them
onto the look's own shape (an `on` agrees with any lit bulb, a brightness
within a point agrees, a colour temperature within the house's word agrees,
a key the look does not name is left alone) and speaks the same words: the
FILES are the room's resolved look, the PHONE the projection, the SEED the
files' look at the last converge that settled the room (`.regie/looks.json`
— refreshed at every converge with no keep pending, never while one waits).
`regie pull home.yml looks` writes the roles that moved into the room's own
`scenes:` (the house's looks are never touched — the room says what differs,
0.35), a look the room did not write landing where the page's order stays;
`regie push home.yml looks` settles a keep the files should win over. A keep
while the room wore `off`, a palette look or a moving look, or one older
than the recorder's days, writes nothing and says why.

A knob the file only gives a BIRTH word to — a switch born on, the mode the
house is born in, the palette's select, « Repeint les pièces » — is the
family's after its first breath: seeded once, never followed, never
pulled; the rule has nothing to say about it.
"""

from __future__ import annotations

import json
from collections.abc import Callable
from dataclasses import dataclass, field
from pathlib import Path

from . import palette as palette_mod
from .edit import Word, flow, set_leaf
from .errors import HouseError
from .host import STATE
from .house import LOOK_KEYS, SCENE_KEYS

KINDS = ("knobs", "plan", "palettes", "looks")
NO_MEMORY = object()  # the conductor has no memory of a seed
MARKS = "knobs.json"
LOOKS = "looks.json"  # the looks' memory: per room, the keep settled and the files' looks then


# --- the rule -------------------------------------------------------------------------
def state(files, phone, seed) -> str:
    """The one word: agree · blind · file · phone · both."""
    if phone == files:
        return "agree"
    if seed is NO_MEMORY:
        return "blind"
    if phone == seed:
        return "file"
    if files == seed:
        return "phone"
    return "both"


def words(
    kind: str, st: str, *, head: str = "", edits: str = "", way: str = "", wrote: str = "set"
) -> tuple[str, str]:
    """The step's state and detail — the same words for every kind."""
    verb = f"`regie pull home.yml {kind}`"
    back = f"`regie push home.yml {kind}`"
    h = f"{head} — " if head else ""
    if st == "agree":
        return "ok", f"{h}follows the files"
    if st == "file":
        return "changed", f"{wrote} from the files ({way}) — the phone had not moved"
    if st == "phone":
        return "ok", f"{h}edited on the phone ({edits}), kept — not yet pulled: {verb} writes it"
    if st == "both":
        return (
            "hand",
            f"{h}edited on the phone ({edits}) and the files moved too ({way}) — kept, "
            f"by hand: {verb} keeps the phone's, {back} the files'",
        )
    return (
        "hand",
        f"{h}differs from the files ({way}) and the conductor has no memory of a seed — "
        f"kept, by hand: {verb} if that is your work, else {back}",
    )


@dataclass
class Owned:
    """One thing the phone may own, read three ways."""

    kind: str  # knobs | plan | palettes — the pull's word
    name: str  # the step's name
    files: object
    phone: object
    seed: object  # NO_MEMORY when the conductor has none
    describe: Callable  # (a, b) -> the way from one reading to the other, in a few words
    write: Callable  # (value) -> put a files' value on the phone (the file leads, push)
    remember: Callable  # (value) -> the memory refreshed
    fresh: str = "file"  # what no memory means: the FILE leads, or a HAND decides
    head: str = ""  # the phone's reading in a word, at the line's head
    stale: bool = False  # agree, but the memory lags in what the normal form does not read
    wrote: str = "set"  # the write's verb, for the line
    settled: str = ""  # the line when agreeing takes a visible write (a re-seed, a free)
    edits: str = ""  # the phone's edits in words, when describe(seed, phone) would not do
    way: str = ""  # the files' move in words, when describe(seed, files) would not do
    leaf: dict = field(default_factory=dict)  # where the pull writes: file, room, path, value

    def decide(self) -> str:
        st = state(self.files, self.phone, self.seed)
        return self.fresh if st == "blind" else st


def settle(o: Owned, check: bool) -> tuple[str, str]:
    """Act on the rule for one thing and say it: the conductor's step."""
    st = o.decide()
    if st == "agree":
        if o.seed != o.files or o.stale:
            if not check:
                o.remember(o.files)
            if o.settled:
                return "changed", o.settled
        return words(o.kind, "agree", head=o.head)
    if st == "file":
        way = o.describe(o.phone if o.seed is NO_MEMORY else o.seed, o.files)
        if not check:
            o.write(o.files)
            o.remember(o.files)
        return words(o.kind, "file", way=way, wrote=o.wrote)
    edits = o.edits or (o.describe(o.seed, o.phone) if o.seed is not NO_MEMORY else "")
    way = o.way or o.describe(o.seed if o.seed is not NO_MEMORY else o.phone, o.files)
    return words(o.kind, st, head=o.head, edits=edits, way=way)


# --- the knobs: a helper the file declares a value for -------------------------------------
def read_marks(root: Path, name: str = MARKS) -> dict:
    p = Path(root) / STATE / name
    if p.is_file():
        return json.loads(p.read_text(encoding="utf-8"))
    return {}


def write_marks(root: Path, marks: dict, name: str = MARKS) -> None:
    p = Path(root) / STATE / name
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(marks, indent=2) + "\n", encoding="utf-8")


def _shown(k: dict, raw: str) -> str:
    shown = k["reads"](raw)
    return shown[:5] if k["entity"].startswith("input_datetime.") else shown


def _service(ha, k: dict, entity: str, value) -> None:
    domain, service = k["action"].split("/")
    data = dict(k["data"])
    if domain == "input_datetime":
        data = {"time": value + ":00"}
    elif domain == "input_select":
        data = {"option": value}
    elif domain == "input_boolean":
        service = f"turn_{value}"
    elif domain in ("input_number", "input_text"):
        data = {"value": float(value) if domain == "input_number" else value}
    st, body = ha.post(f"/api/services/{domain}/{service}", {"entity_id": entity, **data})
    if st != 200:
        raise HouseError(f"{entity}: {st} {body}")


def read_knobs(house, ha, marks: dict) -> tuple[list[Owned], list[dict]]:
    """Every knob of the house read on the brain: the owned ones as things
    under the rule; the born ones as lines of their own (a birth is not a
    conflict — `seed` names the knob still to be born). A helper the brain
    does not have is left alone."""
    owned: list[Owned] = []
    born: list[dict] = []
    groups: dict[str, list] = {}
    for k in house.knobs():
        entity = k["entity"]
        status, st = ha.get(f"/api/states/{entity}")
        name = f"knob {entity.split('.', 1)[1]}"
        if status == 404:
            born.append({"name": name, "state": "ok", "detail": "no such helper on the brain"})
            continue
        if status != 200:
            raise HouseError(f"{entity}: {status} {st}")
        shown = _shown(k, st.get("state", "unknown"))
        if k.get("group"):
            groups.setdefault(k["group"], []).append((k, shown))
            continue
        if k.get("born"):
            if entity not in marks:
                born.append(
                    {
                        "name": name,
                        "state": "changed",
                        "detail": f"born {k['value']} (was {shown})",
                        "seed": k,
                    }
                )
            else:
                born.append(
                    {
                        "name": name,
                        "state": "ok",
                        "detail": f"{shown} (born {k['value']}, the family's since)",
                    }
                )
            continue
        owned.append(_single(ha, marks, k, name, shown))
    for group, members in groups.items():
        owned.append(_grouped(house, ha, marks, group, members))
    return owned, born


def seed_born(ha, marks: dict, born: list[dict]) -> None:
    """The born knobs still to be born: the file's one word, then the family's."""
    for b in born:
        k = b.get("seed")
        if k:
            _service(ha, k, k["entity"], k["value"])
            marks[k["entity"]] = k["value"]


def _single(ha, marks: dict, k: dict, name: str, shown: str) -> Owned:
    entity = k["entity"]

    def write(value):
        _service(ha, k, entity, value)

    def remember(value):
        marks[entity] = value

    return Owned(
        kind=k.get("pull", "knobs"),
        name=name,
        files=k["value"],
        phone=shown,
        seed=marks.get(entity, NO_MEMORY),
        describe=lambda a, b: f"{a} → {b}",
        write=write,
        remember=remember,
        head=shown,
        leaf=k.get("leaf") or {},
    )


def _grouped(house, ha, marks: dict, group: str, members: list) -> Owned:
    """The day's rules as ONE thing: its helpers' values as a dict, the
    phone's reading round-tripped through the rules (a helper moved in a way
    the rules cannot say — a count under « toutes » — is no edit)."""
    by_entity = {k["entity"]: k for k, _ in members}
    files = {k["entity"]: k["value"] for k, _ in members}
    raw = {k["entity"]: shown for k, shown in members}
    phone = palette_mod.rules_round_trip(raw, house.palettes()["today"], house.kelvin())
    if all(e in marks for e in files):
        seed: object = {e: marks[e] for e in files}
    else:
        seed = NO_MEMORY

    def describe(a, b):
        a, b = a or {}, b or {}
        moved = [
            f"{e.split('_today_', 1)[-1] if '_today_' in e else e.split('.', 1)[1]} "
            f"{a.get(e)} → {b.get(e)}"
            for e in files
            if a.get(e) != b.get(e)
        ]
        return ", ".join(moved[:4]) + (f", +{len(moved) - 4}" if len(moved) > 4 else "")

    def write(value):
        for e, v in value.items():
            if raw.get(e) != v:
                _service(ha, by_entity[e], e, v)

    def remember(value):
        marks.update(value)

    return Owned(
        kind=members[0][0].get("pull", "palettes"),
        name=group,
        files=files,
        phone=phone,
        seed=seed,
        describe=describe,
        write=write,
        remember=remember,
        wrote="seeded",
    )


# --- the plan's draft --------------------------------------------------------------------
def read_plan(house, root: Path, draft: dict | None, ws, link) -> Owned | None:
    """The workbench's draft, the files' card and the memory of the seed under
    the normal form (plan.normal) — and `stale` when the memory lags the files
    in what the normal form does not read (a label, a badge's face)."""
    from . import plan

    fresh = plan._json(plan.find_card(plan.workbench_config(house, link)))
    card = plan.find_card(draft or {})
    seeded = plan.read_seed(root)
    files_n = plan.normal(house, fresh)

    def write(_value):
        plan.seed(ws, house, root, link)

    o = Owned(
        kind="plan",
        name="workbench",
        files=files_n,
        phone=plan.normal(house, card) if card else None,
        seed=plan.normal(house, seeded) if seeded else NO_MEMORY,
        describe=plan.describe,
        write=write,
        remember=write,
        fresh="hand",
        head=f"/{plan.WORKBENCH}",
        stale=seeded != fresh,
        wrote="re-seeded",
        settled=f"/{plan.WORKBENCH} re-seeded from the files (the draft agreed with them — "
        "nothing lost)",
    )
    return o


# --- the palette stores ------------------------------------------------------------------
def read_stores(house, ha) -> list[Owned]:
    """Every store that holds a palette: the phone's reading is the store, the
    files' is the named palette of that slug (or nothing), the seed is free —
    a store the files carry as it stands is freed, one the files carry
    differently waits for a hand."""
    if not house.has_pack("palette"):
        return []

    def read(e):
        status, st = ha.get(f"/api/states/{e}")
        return st if status == 200 else None

    named = house.palettes()["named"]
    out = []
    for i in range(1, palette_mod.keep_of(house) + 1):
        prefix = palette_mod.store_prefix(i)
        p = palette_mod.store_from_helpers(prefix, read)
        if not p:
            continue
        slug = palette_mod.slug(p["label"])
        theirs = named.get(slug)
        if theirs is None:
            theirs = next((v for v in named.values() if v.get("label") == p["label"]), None)
            slug = next((k for k, v in named.items() if v is theirs), slug)

        def write(_value, prefix=prefix):
            ha.post(
                "/api/services/input_text/set_value",
                {"entity_id": f"input_text.{prefix}_name", "value": ""},
            )

        mine, yours = palette_mod.store_normal(p), palette_mod.store_normal(theirs)
        out.append(
            Owned(
                kind="palettes",
                name=f"store {prefix.rsplit('_', 1)[1]} « {p['label']} »",
                files=yours,
                phone=mine,
                seed=None,
                describe=palette_mod.describe_store,
                write=write,
                remember=write,
                settled=f"freed — the files carry `{slug}` now",
                edits=f"kept as `{slug}`",
                way=palette_mod.describe_store(mine, yours) if yours else "",
                leaf={"file": "fx", "path": ["palettes", slug], "value": p},
            )
        )
    return out


# --- the looks: a look kept on the phone (0.36, the audit's V5) -----------------------------
KEEP_TOLERANCE = 1  # brightness points a bulb may quantise away and still agree
COLOUR_TOLERANCE = 3  # per channel: a bulb's gamut rounds a colour


def keep_button(area_id: str) -> str:
    return f"input_button.{area_id}_keep"


def _place(thing: dict) -> str:
    return thing.get("at") or thing["id"]


def _word(value):
    """A look's value for one light as the grammar's word: `on`, `off`, or
    the mapping of its own keys (a place key is not a look key)."""
    if value is True or value == "on":
        return "on"
    if value is False or value == "off":
        return "off"
    if isinstance(value, dict):
        own = {k: value[k] for k in value if k in LOOK_KEYS}
        return own or "on"
    return "on"


def look_shape(house, area: dict, look_id: str) -> dict[str, dict]:
    """The files' look, light by light: role → place (the `at:` word, else
    the thing's id) → the grammar's word, for every LIGHT the look reaches.
    A role the look does not name is not in it; a place a look names
    nothing for (no base) neither — the look leaves it alone."""
    raw = (area.get("scenes") or {}).get(look_id) or {}
    if not isinstance(raw, dict):
        return {}
    filled = house.roles_in(area["id"])
    out: dict[str, dict] = {}
    for role, value in raw.items():
        if role in SCENE_KEYS:
            continue
        lights = [t for t in filled.get(role, []) if t["kind"] == "light"]
        if not lights:
            continue
        places = house.places_of(area, role)
        per: dict = {}
        if isinstance(value, dict) and any(k in places for k in value):
            base = {k: v for k, v in value.items() if k in LOOK_KEYS}
            named = {k: v for k, v in value.items() if k in places}
            for t in lights:
                key = _place(t)
                v = named.get(key)
                if v is None:
                    for prefix, pv in named.items():
                        spec = places.get(prefix) or {}
                        if not spec.get("group"):
                            continue
                        covered = spec.get("places") or [x.get("at") for x in spec["things"]]
                        if key in covered:
                            v = pv
                            break
                if v is None:
                    if not base:
                        continue
                    v = base
                per[key] = _word(v)
        else:
            for t in lights:
                per[_place(t)] = _word(value)
        if per:
            out[role] = per
    return out


def _kelvin_of(ct, kelvin: dict) -> int | None:
    if isinstance(ct, str):
        return kelvin.get(ct)
    return int(ct)


def _same_ct(a, b, kelvin: dict) -> bool:
    from .look import CT_TOLERANCE

    if a == b:
        return True
    ka, kb = _kelvin_of(a, kelvin), _kelvin_of(b, kelvin)
    return ka is not None and kb is not None and abs(ka - kb) <= CT_TOLERANCE


def _same_colour(a, b) -> bool:
    if a == b:
        return True
    try:
        ca = [int(a[i : i + 2], 16) for i in (1, 3, 5)]
        cb = [int(b[i : i + 2], 16) for i in (1, 3, 5)]
    except (TypeError, ValueError):
        return False
    return all(abs(x - y) <= COLOUR_TOLERANCE for x, y in zip(ca, cb, strict=True))


def _project_one(f, r, kelvin: dict):
    """One light: the file's word `f` against the bulb's reading `r`, as the
    file would say it when they agree and as the bulb says it when they do
    not. Not read: the file's word stands (no word against it)."""
    if r is None:
        return f
    lit = r != "off"
    if f == "off":
        return "off" if not lit else r
    if f == "on":
        return "on" if lit else "off"
    if not lit:
        return "off"
    if r == "on":
        return f
    out: dict = {}
    for k, fv in f.items():
        if k == "brightness":
            rv = r.get("brightness")
            out[k] = fv if rv is None or abs(int(rv) - int(fv)) <= KEEP_TOLERANCE else rv
        elif k not in ("ct", "color"):
            out[k] = fv  # a transition: the bulb cannot say it, the file's stands
    f_key = "ct" if "ct" in f else "color" if "color" in f else None
    r_key = "ct" if "ct" in r else "color" if "color" in r else None
    if f_key and r_key is None:
        out[f_key] = f[f_key]
    elif f_key == r_key == "ct":
        out["ct"] = f["ct"] if _same_ct(f["ct"], r["ct"], kelvin) else r["ct"]
    elif f_key == r_key == "color":
        out["color"] = f["color"] if _same_colour(f["color"], r["color"]) else r["color"]
    elif f_key and r_key:
        out[r_key] = r[r_key]  # the bulb went from white to colour, or back
    ordered = {k: out[k] for k in f if k in out}
    ordered.update({k: v for k, v in out.items() if k not in ordered})
    return ordered


def project(shape: dict, reading: dict, kelvin: dict) -> dict:
    """The phone's reading onto the files' shape: the same roles and places,
    the file's words where the bulbs agree, the bulbs' where they moved."""
    out: dict = {}
    for role, places in shape.items():
        got = reading.get(role) or {}
        out[role] = {p: _project_one(f, got.get(p), kelvin) for p, f in places.items()}
    return out


def _say(v) -> str:
    if v is None:
        return "—"
    if isinstance(v, dict):
        return flow(_bare(v))
    return str(v)


def _pair(a, b) -> str:
    """The way from one light's word to another's: the keys that moved when
    both are mappings, the two words otherwise."""
    if isinstance(a, dict) and isinstance(b, dict):
        keys = [k for k in dict.fromkeys([*a, *b]) if a.get(k) != b.get(k)]
        return " ".join(f"{k} {_say(a.get(k))} → {_say(b.get(k))}" for k in keys)
    return f"{_say(a)} → {_say(b)}"


def describe_look(a: dict | None, b: dict | None) -> str:
    """The way from one shape to another in a few words: a role when all of
    its places moved the same way, a place otherwise."""
    a, b = a or {}, b or {}
    moved: list[str] = []
    for role in dict.fromkeys([*a, *b]):
        pa, pb = a.get(role) or {}, b.get(role) or {}
        places = [p for p in dict.fromkeys([*pa, *pb]) if pa.get(p) != pb.get(p)]
        if not places:
            continue
        one_from = len({json.dumps(pa.get(p), sort_keys=True) for p in places}) == 1
        one_to = len({json.dumps(pb.get(p), sort_keys=True) for p in places}) == 1
        if one_from and one_to and len(places) == len(pa) == len(pb):
            moved.append(f"{role} {_pair(pa[places[0]], pb[places[0]])}")
        else:
            moved += [f"{role}.{p} {_pair(pa.get(p), pb.get(p))}" for p in places]
    return ", ".join(moved[:4]) + (f", +{len(moved) - 4}" if len(moved) > 4 else "")


def _bare(v):
    """`on` / `off` spelled bare in the file, the way a look reads."""
    if v in ("on", "off"):
        return Word(v)
    if isinstance(v, dict):
        return {k: _bare(x) for k, x in v.items()}
    return v


def _dynamic(house, area: dict, plan: dict) -> bool:
    """A look whose bulbs are not a person's to keep: the palette paints
    them, a drift or life moves them, or the file says so."""
    return bool(
        house.scene_palette(area, plan) or house.moving(area, plan) or "dynamic" in plan["tags"]
    )


def _when(pressed: str) -> str:
    import datetime as dt

    try:
        return dt.datetime.fromisoformat(pressed).strftime("%m-%d %H:%M") + " UTC"
    except ValueError:
        return pressed


def _newer(pressed: str, kept: str) -> bool:
    import datetime as dt

    if not kept:
        return True
    try:
        return dt.datetime.fromisoformat(pressed) > dt.datetime.fromisoformat(kept)
    except ValueError:
        return pressed != kept


def read_looks(house, ha, memory: dict) -> tuple[list[Owned], list[dict]]:
    """Every room's button read: a keep newer than the memory is the room's
    bulbs and its look at that second, projected — a thing under the rule;
    a keep that can name nothing (the room wore `off`, a palette look, the
    recorder holds nothing that old) is a line of its own, settled at once.
    A room with nothing new refreshes the memory of the files' looks."""
    from .look import room_places, states_at

    owned: list[Owned] = []
    notes: list[dict] = []
    for a in house.areas:
        if house.parking(a):
            continue
        plans = {p["id"]: p for p in house.scene_plan(a) if p["renders"]}
        if not plans:
            continue
        button = keep_button(a["id"])
        status, st = ha.get(f"/api/states/{button}")
        if status == 404:
            continue  # a brain before the button
        if status != 200:
            raise HouseError(f"{button}: {status} {st}")
        pressed = st.get("state") or ""
        if pressed in ("unknown", "unavailable"):
            pressed = ""
        mem = memory.get(a["id"]) or {}
        static = {
            lid: look_shape(house, a, lid)
            for lid, p in plans.items()
            if lid != "off" and not _dynamic(house, a, p)
        }

        def refresh(_value=None, area_id=a["id"], pressed=pressed, static=static):
            memory[area_id] = {"kept": pressed, "looks": static}

        if not pressed or not _newer(pressed, mem.get("kept", "")):
            refresh()
            continue
        head = f"kept {_when(pressed)}"
        name = f"look {a['id']}"
        select = f"input_select.{a['id']}_look"
        lights = [
            e
            for things in house.roles_in(a["id"]).values()
            for t in things
            if t["kind"] == "light" and (e := house.entity(t))
        ]
        at = states_at(ha, [select, *lights], pressed)
        if not at:
            notes.append(
                {
                    "name": name,
                    "state": "ok",
                    "detail": f"{head} — the recorder holds nothing that old any more: "
                    "nothing to write (keep again)",
                }
            )
            refresh()
            continue
        wore = (at.get(select) or {}).get("state") or ""
        if wore in ("", "off", "unknown", "unavailable"):
            notes.append(
                {
                    "name": name,
                    "state": "ok",
                    "detail": f"{head} while the room wore {wore or 'no look'} — nothing to "
                    "write (take a look, tune the bulbs, keep)",
                }
            )
            refresh()
            continue
        plan = plans.get(wore)
        if plan is None or wore not in static:
            why = (
                f"« {plan['label']} », a look whose bulbs are the palette's or a walk's"
                if plan
                else f"« {wore} », a look the room renders no more"
            )
            notes.append(
                {
                    "name": f"{name}/{wore}",
                    "state": "ok",
                    "detail": f"{head} while the room wore {why} — nothing to write",
                }
            )
            refresh()
            continue
        files = static[wore]
        reading, _read_notes = room_places(house, a, lambda e, at=at: at.get(e))
        phone = project(files, reading, house.kelvin())
        seed = (mem.get("looks") or {}).get(wore, NO_MEMORY)
        moved = {role: phone[role] for role in files if phone[role] != files[role]}
        owned.append(
            Owned(
                kind="looks",
                name=f"{name}/{wore}",
                files=files,
                phone=phone,
                seed=seed,
                describe=describe_look,
                write=lambda _value: None,  # the script carries the file's look already
                remember=refresh,
                fresh="hand",
                head=head,
                stale=True,
                leaf={"file": "rooms", "room": a["id"], "look": wore, "moved": moved},
            )
        )
    return owned, notes


def _folded(house, area: dict, role: str, per: dict):
    from .look import fold_role

    return fold_role(area, role, per, [])


def pull_looks(house, owned: list[Owned], files: dict) -> list[str]:
    """The kept looks into the rooms' own `scenes:` blocks: the roles that
    moved, each as the bulbs read (folded by place), replacing the role's
    line in a look the room writes, or a look the room takes as it is
    (`true`); a look the room does not write is added where the page's
    order stays — above the first look the room writes that follows it."""
    import yaml

    lines = []
    for o in owned:
        if o.kind != "looks" or o.decide() not in ("phone", "both", "hand"):
            continue
        leaf = o.leaf
        path = files["rooms"].get(leaf["room"])
        if path is None:
            lines.append(f"  ! {o.name}: no room file to write (rooms/{leaf['room']}.yml)")
            continue
        area = house.area(leaf["room"])
        look = leaf["look"]
        moved = {
            role: _bare(_folded(house, area, role, per)) for role, per in leaf["moved"].items()
        }
        was = {role: _folded(house, area, role, o.files[role]) for role in moved}
        text = path.read_text(encoding="utf-8")
        raw = (yaml.safe_load(text) or {}).get("scenes") or {}
        if look not in raw:
            order = list(area.get("scenes") or {})
            after = order[order.index(look) + 1 :] if look in order else []
            before = next((k for k in after if k in raw), None)
            out = set_leaf(text, ["scenes", look], moved, before=before)
        elif raw[look] is True:
            out = set_leaf(text, ["scenes", look], moved)
        else:
            out = text
            for role, value in moved.items():
                out = set_leaf(out, ["scenes", look, role], value)
        if out == text:
            lines.append(f"  = {path.name}: scenes.{look} unchanged")
            continue
        path.write_text(out, encoding="utf-8")
        for role, value in moved.items():
            lines.append(f"  + {path.name}: scenes.{look}.{role} {_say(was[role])} → {_say(value)}")
    return lines


# --- the verbs -----------------------------------------------------------------------------
def house_files(house, rooms_dir: Path | None = None, **over) -> dict:
    """Which file holds what: modes, fx, plan and the rooms by id."""
    from .plan import room_files

    def one(key):
        if over.get(key):
            return Path(over[key])
        paths = house.included.get(key) or []
        return Path(paths[0]) if paths else None

    return {
        "modes": one("modes"),
        "fx": one("fx"),
        "plan": one("plan"),
        "rooms": room_files(house, rooms_dir),
    }


def _path_of(files: dict, leaf: dict) -> Path | None:
    if leaf.get("file") == "rooms":
        return files["rooms"].get(leaf["room"])
    return files.get(leaf.get("file"))


def _write_leaf(path: Path, leaf_path: list[str], value) -> bool:
    text = path.read_text(encoding="utf-8")
    out = set_leaf(text, leaf_path, value)
    if out == text:
        return False
    path.write_text(out, encoding="utf-8")
    return True


def pull_knobs(owned: list[Owned], files: dict) -> list[str]:
    """The knobs the phone moved, written at their leaf in the house files."""
    lines = []
    for o in owned:
        if o.kind != "knobs" or o.decide() not in ("phone", "both"):
            continue
        leaf = o.leaf
        path = _path_of(files, leaf)
        if path is None:
            lines.append(f"  ! {o.name}: no file to write ({leaf.get('file')})")
            continue
        value = leaf["value"](o.phone) if callable(leaf.get("value")) else o.phone
        if _write_leaf(path, leaf["path"], value):
            lines.append(f"  + {path.name}: {'.'.join(leaf['path'])} {o.seed} → {o.phone}")
        else:
            lines.append(f"  = {path.name}: {'.'.join(leaf['path'])} unchanged")
    return lines


def pull_palettes(house, ha, owned: list[Owned], files: dict) -> list[str]:
    """The kept stores and the day's rules, into the fx file's `palettes:`
    block leaf by leaf — a rule the phone did not move is not touched."""
    lines = []
    fx = files.get("fx")
    if fx is None:
        return ["  ! no fx file to write — the house includes none (include.fx)"]

    def read(e):
        status, st = ha.get(f"/api/states/{e}")
        return st if status == 200 else None

    mine = house.palettes()["today"]
    theirs = palette_mod.rules_from_helpers(read, mine)
    a, b = palette_mod.rules_normal(mine), palette_mod.rules_normal(theirs)
    for key in ("harmonies", "avoid", "saturation", "level", "alive", "life", "turns"):
        if a.get(key) == b.get(key):
            continue
        value = theirs.get(key)
        if _write_leaf(fx, ["palettes", palette_mod.AUTO, key], value):
            lines.append(f"  + {fx.name}: palettes.{palette_mod.AUTO}.{key} {a.get(key)} → {value}")
    for o in owned:
        if o.kind != "palettes" or not o.leaf or o.decide() not in ("phone", "both"):
            continue
        if _write_leaf(fx, o.leaf["path"], o.leaf["value"]):
            lines.append(f"  + {fx.name}: palettes.{o.leaf['path'][-1]} ← {o.name}")
    return lines


def pull_plan(house, ws, files: dict) -> list[str]:
    from . import plan

    try:
        config = ws.call("lovelace/config", url_path=plan.WORKBENCH)
    except HouseError as exc:
        return [f"  ! /{plan.WORKBENCH}: {exc} — `regie apply` opens it"]
    card = plan.find_card(config or {})
    if not card:
        return [f"  ! /{plan.WORKBENCH} holds no plan card — `regie push home.yml plan` seeds it"]
    blocks, notes = plan.pull(house, card)
    lines = [f"  ~ {n}" for n in notes]
    for rid, block in blocks.items():
        path = files["rooms"].get(rid)
        if path is None:
            lines.append(f"  ! {rid}: no room file to write (rooms/{rid}.yml)")
            continue
        # the identity by VALUE: a block the draft reads back as the file
        # declares it is not rewritten (its notes, its flow lines stand)
        if plan._json(block) == plan._json(house.area(rid).get("plan") or {}):
            lines.append(f"  = {path.name}: unchanged")
            continue
        lines.append(
            f"  + {path.name}: plan written"
            if plan.rewrite(path, block)
            else f"  = {path.name}: unchanged"
        )
    walls = plan.pull_walls(card)
    if walls and files.get("plan"):
        p = files["plan"]
        lines.append(
            f"  + {p.name}: {len(walls)} wall(s) written"
            if plan.rewrite_walls(p, walls)
            else f"  = {p.name}: walls unchanged"
        )
    elif walls:
        lines.append(
            f"  ~ {len(walls)} wall(s) drawn and no plan file to hold them — "
            "`include: plan: plan.yml` in home.yml, or --plan FILE"
        )
    return lines


def pull(house, ha, root: Path, kinds: list[str], files: dict, link) -> list[str]:
    """`regie pull`: the phone's edits into the house files, kind by kind."""
    out = []
    marks = read_marks(root)
    owned, _ = read_knobs(house, ha, marks)
    if "knobs" in kinds:
        out.append("knobs:")
        out += pull_knobs(owned, files) or ["  = nothing the phone moved"]
    if "plan" in kinds and house.plan() is not None:
        out.append("plan:")
        with ha.ws() as ws:
            out += pull_plan(house, ws, files)
    if "palettes" in kinds and house.has_pack("palette"):
        out.append("palettes:")
        out += pull_palettes(house, ha, read_stores(house, ha), files) or [
            "  = nothing the phone moved"
        ]
    if "looks" in kinds:
        # the memory is read, never written here: the next converge settles a
        # keep the files now agree with
        kept, _ = read_looks(house, ha, read_marks(root, LOOKS))
        out.append("looks:")
        out += pull_looks(house, kept, files) or ["  = nothing kept on the phone"]
    written = sum(1 for line in out if line.startswith("  + "))
    out.append(f"pull: {written} leaf/file(s) written — review the diff, commit, converge")
    return out


def push(house, ha, root: Path, kinds: list[str], link) -> list[str]:
    """`regie push`: the files' word onto the phone — the hand's override
    for a `both` or a draft the conductor has no memory of."""
    out = []
    marks = read_marks(root)
    owned, _ = read_knobs(house, ha, marks)
    if "knobs" in kinds:
        out.append("knobs:")
        for o in owned:
            if o.kind != "knobs":
                continue
            if o.phone == o.files:
                o.remember(o.files)
                continue
            o.write(o.files)
            o.remember(o.files)
            out.append(f"  + {o.name}: {o.phone} → {o.files}")
        write_marks(root, marks)
    if "plan" in kinds and house.plan() is not None:
        from . import plan

        with ha.ws() as ws:
            plan.seed(ws, house, root, link)
        out.append("plan:")
        out.append(f"  + /{plan.WORKBENCH}: seeded from the files — the draft it held is gone")
    if "palettes" in kinds and house.has_pack("palette"):
        out.append("palettes:")
        for o in owned:
            if o.kind == "palettes" and o.phone != o.files:
                o.write(o.files)
                o.remember(o.files)
                out.append(f"  + {o.name}: seeded from the files")
        write_marks(root, marks)
        for o in read_stores(house, ha):
            if o.files is not None and o.phone != o.files:
                o.write(None)
                out.append(f"  + {o.name}: freed — the files' version stands")
    if "looks" in kinds:
        memory = read_marks(root, LOOKS)
        kept, _ = read_looks(house, ha, memory)
        out.append("looks:")
        for o in kept:
            if o.decide() != "agree":
                o.remember(o.files)
                out.append(f"  + {o.name}: settled — the files' version stands")
        write_marks(root, memory, LOOKS)
    return out
