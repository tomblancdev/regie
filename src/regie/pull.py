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
phone and how to write the files; the fourth kind (V5, a look tuned in the
light panel and kept) will say the same four things.

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
from .edit import set_leaf
from .errors import HouseError
from .host import STATE

KINDS = ("knobs", "plan", "palettes")
NO_MEMORY = object()  # the conductor has no memory of a seed
MARKS = "knobs.json"


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
def read_marks(root: Path) -> dict:
    p = Path(root) / STATE / MARKS
    if p.is_file():
        return json.loads(p.read_text(encoding="utf-8"))
    return {}


def write_marks(root: Path, marks: dict) -> None:
    p = Path(root) / STATE / MARKS
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
    return out
