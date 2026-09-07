"""A palette for the whole house (0.20 — « La Palette du jour », home.md §6.9, H49).

A palette is a VALUE with four optional parts: colours (one arc of the hue
circle that never crosses the yellow-green quarter, one accent from the far
side, a saturation, a white word), level (a curve over the house's periods
and a jitter), alive (how many candidate bulbs roam), life (fx now and then).
A named palette gives numbers; `today` gives RULES, and the day draws within
them.

THE ARITHMETIC IS NOT HERE ANY MORE (0.42, the audit's V8a). The draw, the
room's own draws, a kept palette's normal form and the day's rules as the
helpers hold them live in the COMPONENT's own `palette.py`, which the brain
imports as one of its modules and the engine reads by path
(`regie.component`). Until 0.41 the same steps were written twice — Python
here, a generated Jinja body there — and a test kept them in step over ten
years of days; the sensor is the component's now, so there is one copy and
nothing to keep in step. What stays here is what only the ENGINE does: the
house's palettes read out of `fx.yml` and checked, what a look that reads a
palette renders into, the terminal's colour bars, and the config block the
pack hands the component.
"""

from __future__ import annotations

import colorsys
import json
import sys

from . import component
from .errors import HouseError

_A = component.module("palette")

# the arithmetic, under the names the engine has always used for it
M = _A.M
A = _A.A
DRAWS = _A.DRAWS
HARMONIES = _A.HARMONIES
ORDER = _A.ORDER
COLD = _A.COLD
WARM_ACCENT = _A.WARM_ACCENT
COLD_ACCENT = _A.COLD_ACCENT
DEFAULT_RULES = _A.DEFAULT_RULES
WHITES = _A.WHITES
JITTER_MAX = _A.JITTER_MAX
LIFE_EVERY_MIN = _A.LIFE_EVERY_MIN
AUTO = _A.AUTO
PERIODS = _A.PERIODS
RULES_PREFIX = _A.RULES_PREFIX
RULE_NUMBERS = _A.RULE_NUMBERS
salt_of = _A.salt_of
day_of = _A.day_of
free_arc = _A.free_arc
in_arc = _A.in_arc
draw = _A.draw
named_value = _A.named_value
alive_count = _A.alive_count
room_draw = _A.room_draw
slug = _A.slug
store_normal = _A.store_normal
value = _A.value
source_of = _A.source_of
label_of = _A.label_of
option_labels = _A.option_labels
store_clean = _A.store_clean
rules_from_helpers = _A.rules_from_helpers
rules_entities = _A.rules_entities
_num = _A._num
_txt = _A._txt
_shapes = _A._shapes


# --- the house's palettes, normalised -------------------------------------------
def normalise(raw: dict | None) -> dict:
    """`fx.palettes` as the house wrote it → {"named": {id: …}, "today": rules}.
    Absent → no named palette and the default rules (a house that enables the
    pack without writing a line still has a day)."""
    raw = dict(raw or {})
    today = dict(raw.pop(AUTO, None) or {})
    rules = {
        "harmonies": {**DEFAULT_RULES["harmonies"], **(today.get("harmonies") or {})},
        "avoid": list(today.get("avoid") or DEFAULT_RULES["avoid"]),
        "saturation": list(today.get("saturation") or DEFAULT_RULES["saturation"]),
        "level": today.get("level"),
        "alive": today.get("alive"),
        "life": today.get("life"),
        "turns": str(today.get("turns") or DEFAULT_RULES["turns"]),
        "label": today.get("label"),
    }
    named = {}
    for pid, spec in raw.items():
        spec = dict(spec or {})
        spec.setdefault("label", pid.replace("_", " ").capitalize())
        named[pid] = spec
    return {"named": named, "today": rules}


def check(palettes: dict, shapes: set[str], enabled: list[str] | None, periods: list[str] | None):
    """What `check` refuses or hints about the palettes — the rules of the
    design page, mechanical."""
    errors: list[str] = []
    hints: list[str] = []
    rules = palettes["today"]

    def _life(where: str, life: dict | None) -> None:
        if not life:
            return
        for shape in life.get("shapes") or []:
            if shape not in shapes:
                errors.append(f"{where}: life shape {shape!r} is not one")
            elif enabled and shape not in enabled:
                errors.append(f"{where}: life shape {shape!r} is not enabled in fx")
        if not life.get("shapes"):
            errors.append(f"{where}: life names no shape")
        every = life.get("every") or []
        if len(every) != 2 or every[0] > every[1]:
            errors.append(f"{where}: life.every is [min, max] seconds")
        elif every[0] < LIFE_EVERY_MIN:
            errors.append(f"{where}: life.every under {LIFE_EVERY_MIN} s — a sign, not a storm")
        chance = life.get("chance", 100)
        if not 0 <= chance <= 100:
            errors.append(f"{where}: life.chance is a share of days, 0–100")

    def _level(where: str, level: dict | None, ranged: bool) -> None:
        if not level:
            return
        curve = level.get("curve") or {}
        for k, v in curve.items():
            if periods is not None and k not in periods:
                errors.append(f"{where}: level.curve names period {k!r} — not in modes.periods")
            if not 0 <= v <= 200:
                errors.append(f"{where}: level.curve {k}: {v} — a percentage of the room's number")
        jit = level.get("jitter", 0)
        vals = jit if isinstance(jit, list) else [jit]
        if isinstance(jit, list) and not ranged:
            errors.append(f"{where}: level.jitter is one number on a named palette")
        if any(v < 0 or v > JITTER_MAX for v in vals):
            errors.append(f"{where}: level.jitter above {JITTER_MAX} % — a scatter, not a lottery")

    def _alive(where: str, alive, ranged: bool) -> None:
        if alive is None or alive == "all":
            return
        if isinstance(alive, list):
            if not ranged:
                errors.append(f"{where}: alive is one number or `all` on a named palette")
            elif len(alive) != 2 or (alive[1] != "all" and alive[0] > alive[1]):
                errors.append(f"{where}: alive is [min, max] (max may be `all`)")
        elif not isinstance(alive, int) or alive < 0:
            errors.append(f"{where}: alive is a count, `all`, or a range")

    for pid, p in palettes["named"].items():
        where = f"palette {pid}"
        band = p.get("band") or []
        if len(band) != 2 or any(not 0 <= b <= 360 for b in band):
            errors.append(f"{where}: band is [from, to] in degrees on the hue circle")
        else:
            lo, hi = band
            av0, av1 = rules["avoid"]
            width = (hi - lo) % 360 or 360
            crosses = any(in_arc((lo + d) % 360, av0, av1) for d in range(0, int(width) + 1))
            if crosses:
                hints.append(
                    f"{where}: the arc {lo}→{hi} crosses the avoided quarter "
                    f"({av0}–{av1}°) — a hand's choice, said"
                )
        if p.get("accent") is not None and not 0 <= p["accent"] <= 360:
            errors.append(f"{where}: accent is a hue, 0–360")
        if not 0 <= p.get("saturation", 100) <= 100:
            errors.append(f"{where}: saturation is 0–100")
        if p.get("white", "warm") not in WHITES:
            errors.append(f"{where}: white is one of {', '.join(WHITES)}")
        _level(where, p.get("level"), ranged=False)
        _alive(where, p.get("alive"), ranged=False)
        _life(where, p.get("life"))

    where = f"palette {AUTO}"
    weights = rules["harmonies"]
    for name, wt in weights.items():
        if name not in HARMONIES:
            errors.append(f"{where}: harmony {name!r} is not one ({', '.join(ORDER)})")
        elif wt < 0:
            errors.append(f"{where}: harmony {name} weighs less than nothing")
    if not any(weights.get(n, 0) > 0 for n in ORDER):
        errors.append(f"{where}: no harmony weighs anything — nothing to draw")
    av = rules["avoid"]
    if len(av) != 2 or not all(0 <= a <= 360 for a in av):
        errors.append(f"{where}: avoid is [from, to] on the hue circle — it may wrap through 0°")
    else:
        free = free_arc(av[0], av[1])
        widest = max((HARMONIES[n][1] for n in ORDER if weights.get(n, 0) > 0), default=0)
        if free < widest:
            errors.append(
                f"{where}: the avoided arc leaves {free}° and the widest harmony wants {widest}°"
            )
    sat = rules["saturation"]
    if len(sat) != 2 or not 0 <= sat[0] <= sat[1] <= 100:
        errors.append(f"{where}: saturation is [min, max], 0–100")
    if weights.get("libre", 0) > max(weights.get(n, 0) for n in ("degrade", "duo", "uni")):
        hints.append(f"{where}: libre outweighs the others — most days will be wild")
    _level(where, rules.get("level"), ranged=True)
    _alive(where, rules.get("alive"), ranged=True)
    _life(where, rules.get("life"))
    t = rules["turns"]
    if (
        len(t) != 5
        or t[2] != ":"
        or not (t[:2] + t[3:]).isdigit()
        or int(t[:2]) > 23
        or int(t[3:]) > 59
    ):
        errors.append(f"{where}: turns is an hour, HH:MM")
    return errors, hints


# --- a value as Jinja spells it (a look's script carries numbers inline) ---------
def _j(v) -> str:
    """A value as Jinja spells it."""
    if v is None:
        return "none"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(v)
    if isinstance(v, str):
        return "'" + v.replace("'", "\\'") + "'"
    if isinstance(v, list):
        return "[" + ", ".join(_j(x) for x in v) + "]"
    if isinstance(v, dict):
        return "{" + ", ".join(f"{_j(k)}: {_j(x)}" for k, x in v.items()) + "}"
    raise HouseError(f"palette: cannot spell {v!r} in a template")


# --- the terminal ---------------------------------------------------------------
def rgb(hue: float, saturation: int, light: float = 0.55) -> tuple[int, int, int]:
    r, g, b = colorsys.hls_to_rgb((hue % 360) / 360, light, saturation / 100)
    return int(r * 255), int(g * 255), int(b * 255)


def bar(p: dict, cells: int = 24, colour: bool = True) -> str:
    """The arc as a strip of cells, the accent after it, the white last."""
    if not colour:
        return f"{p['lo']:3d}°→{p['hi']:3d}° · accent {p['accent']}° · {p['white']}"
    out = []
    for i in range(cells):
        r, g, b = rgb(p["lo"] + p["width"] * i / max(cells - 1, 1), p["saturation"])
        out.append(f"\x1b[48;2;{r};{g};{b}m ")
    if p.get("accent") is not None:
        r, g, b = rgb(p["accent"], 100)
        out.append(f"\x1b[0m \x1b[48;2;{r};{g};{b}m  ")
    wr, wg, wb = (255, 217, 168) if p["white"] == "warm" else (241, 239, 232)
    out.append(f"\x1b[0m \x1b[48;2;{wr};{wg};{wb}m  \x1b[0m")
    return "".join(out)


def describe(p: dict, labels: dict | None = None) -> str:
    labels = labels or {}
    h = labels.get(p.get("harmony") or "", p.get("harmony") or "named")
    parts = [f"{h} {p['lo']}→{p['hi']}° ({p['width']}°)", f"sat {p['saturation']}", p["white"]]
    if p.get("accent") is not None:
        parts.insert(1, f"accent {p['accent']}°")
    if p.get("jitter"):
        parts.append(f"±{p['jitter']} %")
    if p.get("alive") is not None:
        parts.append(f"alive {p['alive']}")
    if p.get("life"):
        parts.append("life " + "+".join(p["life"]["shapes"]))
    return " · ".join(parts)


def colour_terminal() -> bool:
    return sys.stdout.isatty()


# --- what the render needs --------------------------------------------------------


# --- step 2: the room reads the palette ------------------------------------------
# `color:` words a look with a palette may use (accent left the grammar in 0.24)
PALETTE_COLOURS = ("band", "roam")
WHITE_WORD = "white"  # `ct: white` — the palette's white
SENSOR = "sensor.house_palette"
PAL_EXPR = f"state_attr('{SENSOR}', 'palette')"


# --- the room's own draws, read off the sensor ------------------------------------
ROOMS_EXPR = f"state_attr('{_A.SENSOR}', 'rooms')"


def room_key(area_id: str, source: str, n_candidates: int, n_targets: int) -> str:
    """What a look calls its room draw. Everything the draw depends on is in
    the name — the room, the palette it reads, and the two counts that decide
    how many randoms are drawn — so two looks asking the same question share
    one entry and two asking different ones never collide."""
    return f"{area_id}.{source}.{n_candidates}.{n_targets}"


def room_expr(key: str, n_candidates: int, n_targets: int) -> str:
    """The room's draw as the look's script reads it: an attribute of the
    sensor, computed by the component (`room_draw`, the same arithmetic the
    engine reads). A sensor that has not answered yet leaves nobody roaming
    and nobody scattered — a look recalled in that second is plain, never
    broken."""
    empty = _j(
        {
            "count": 0,
            "offset": 0,
            "alive": [False] * n_candidates,
            "scatter": [0.0] * n_targets,
        }
    )
    return f"{{{{ ({ROOMS_EXPR} or {{}}).get({_j(key)}) or {empty} }}}}"


def level_expr(brightness, k: int) -> str:
    """The bulb's level at recall: the room's number × the palette's curve at
    the house's period × the bulb's scatter of the day, 1–100."""
    return (
        f"{{{{ [1, [100, ({brightness} * ((pal.curve.get(period, 100) if pal.curve else 100) / 100)"
        f" * (1 + room.scatter[{k}] / 100)) | int] | min] | max }}}}"
    )


def colour_expr(word: str, f: float | None) -> dict:
    """The colour of a palette leaf, as the light service's templated data."""
    if word == WHITE_WORD:
        return {"color_temp_kelvin": "{{ pal.white_kelvin }}"}
    return {
        "hs_color": f"{{{{ [((pal.lo + pal.width * {f}) % 360) | round(1), pal.saturation] }}}}"
    }


def scene_palette(house, area: dict, plan: dict) -> dict | None:
    """A look that names a palette, resolved for the render: the palette as a
    Jinja expression (the sensor for `today`, the numbers for a named one), the
    targets with their words and their positions, the candidates, and the
    variables step every script of the look starts with."""
    pid = plan.get("palette")
    if not pid:
        return None
    palettes = house.palettes()
    layout_of: dict[str, list[str]] = {
        role: list((spec or {}).get("layout") or [])
        for role, spec in (area.get("roles") or {}).items()
    }
    if pid == AUTO:
        # a `today` look follows the SELECT: the sensor is read at recall, and
        # the palette in force decides the arc, the level curve, who roams and
        # by how much each bulb scatters
        pal_expr = PAL_EXPR
    else:
        named = palettes["named"].get(pid)
        if named is None:
            return None
        pal_expr = _j(named_value(named, house.kelvin()))
    targets: list[dict] = []
    for r in plan["roles"]:
        word = r["look"].get("palette")
        if word in ("band", "roam") and r.get("group"):
            # a prefix spread along the arc: each of its places its own hue; a
            # role group with no places (one lamp) stays one target
            places = house.places_of(area, r["role"])
            expanded = []
            for place in r.get("places") or [t.get("at") for t in r.get("things", [])]:
                p = places.get(place)
                if not p or not p["entities"]:
                    continue
                expanded.append({**r, "place": place, "entities": p["entities"], "group": False})
            targets += expanded or [dict(r)]
        else:
            targets.append(dict(r))
    for k, t in enumerate(targets):
        t["k"] = k
        t["word"] = t["look"].get("palette")
        layout = layout_of.get(t["role"], [])
        t["order"] = layout.index(t["place"]) if t.get("place") in layout else len(layout)
    arc = sorted(
        (t for t in targets if t["word"] in ("band", "roam")), key=lambda t: (t["role"], t["order"])
    )
    for i, t in enumerate(arc):
        t["f"] = round(i / (len(arc) - 1), 4) if len(arc) > 1 else 0.5
    candidates = [t for t in arc if t["word"] == "band"]
    for i, t in enumerate(candidates):
        t["gate"] = i
    for t in targets:
        data: dict = {}
        look = t["look"]
        if not look.get("on"):
            t["data"] = None
            continue
        if t["word"]:
            data.update(colour_expr(t["word"], t.get("f")))
        else:
            data.update(
                {k: v for k, v in look.items() if k not in ("on", "brightness_pct", "palette")}
            )
        if look.get("brightness_pct") is not None:
            data["brightness_pct"] = level_expr(look["brightness_pct"], t["k"])
        t["data"] = data
    key = room_key(area["id"], pid, len(candidates), len(targets))
    return {
        "source": pid,
        "pal": pal_expr,
        "targets": targets,
        "arc": arc,
        "candidates": candidates,
        "roamers": [t for t in arc if t["word"] == "roam"],
        "room": {
            "key": key,
            "room": area["id"],
            "source": pid,
            "candidates": len(candidates),
            "targets": len(targets),
        },
        "variables": {
            "pal": f"{{{{ {pal_expr} }}}}",
            "period": "{{ states('sensor.house_period') }}",
            "room": room_expr(key, len(candidates), len(targets)),
        },
    }


# --- step 3: life — a random effect on a random bulb, now and then -------------------
def moves_colour(shape_id: str, shapes: dict, bindings: dict | None = None) -> bool:
    """Does a shape send a COLOUR (a colour or a ct in one of its steps, its
    bricks included)? A level-only shape may land on any bulb, a roaming one
    included — a level flash sits on top of the colour and the next drift step
    paints over it; a colour shape aborts the ramp inside a bulb and lands on
    still bulbs alone."""
    shape = shapes.get(shape_id) or {}
    fields = dict(shape.get("fields") or {})
    bound = {**fields, **(bindings or {})}

    def value(v):
        if isinstance(v, str) and v.startswith("$"):
            return bound.get(v[1:])
        return v

    for step in shape.get("steps") or []:
        if not isinstance(step, dict):
            continue
        if "ct" in step:
            return True
        if value(step.get("colour")) not in (None, "", False):
            return True
        if "use" in step:
            inner = {k: value(v) for k, v in step.items() if k != "use"}
            if moves_colour(step["use"], shapes, inner):
                return True
    return False


def life_plan(house, area: dict, plan: dict, shapes: dict) -> dict | None:
    """A look that reads a palette with life: the loop's own shape — which
    bulbs may take a level shape (every one), which a colour shape (the still
    ones: never a roamer, and a candidate only on a day that left it still),
    the pace, and whether the room said no. For `today` the shapes and the
    pace are the SENSOR's (none on a day without life); for a named palette
    they are its own."""
    if plan.get("life") is False:
        return None
    spal = house.scene_palette(area, plan)
    if not spal:
        return None
    palettes = house.palettes()
    if spal["source"] == AUTO:
        # a `today` look follows the SELECT: the day's rules may carry no life
        # (the house's default) while a named palette the family pins does —
        # the loop exists for every shape any of them names, and the sensor
        # says at each start which shapes, which pace, or none (0.22.2)
        lives = [palettes["today"].get("life")] + [
            p.get("life") for p in palettes["named"].values()
        ]
        lives = [life for life in lives if life and life.get("shapes")]
        if not lives:
            return None
        life = {
            "shapes": sorted({s for life in lives for s in life["shapes"]}),
            "every": list((palettes["today"].get("life") or lives[0])["every"]),
        }
    else:
        life = (palettes["named"].get(spal["source"]) or {}).get("life")
        if not life or not life.get("shapes"):
            return None
    lit = [t for t in spal["targets"] if t["data"] is not None and t["domain"] == "light"]
    if not lit:
        return None
    colour_shapes = [s for s in life["shapes"] if moves_colour(s, shapes)]
    level_shapes = [s for s in life["shapes"] if s not in colour_shapes]
    any_pool = [t["entities"][0] for t in lit]
    # the still bulbs: never a roamer; a candidate only when the day left it still
    still = [t for t in lit if t["word"] != "roam" and t.get("gate") is None]
    gated = [t for t in lit if t.get("gate") is not None]
    return {
        "source": spal["source"],
        "shapes": list(life["shapes"]),
        "colour_shapes": colour_shapes,
        "level_shapes": level_shapes,
        "every": list(life["every"]),
        "any": any_pool,
        "still": [t["entities"][0] for t in still],
        "gated": [(t["entities"][0], t["gate"]) for t in gated],
        "variables": spal["variables"],
        "live": spal["source"] == AUTO,  # the sensor decides day by day
    }


# --- step 4 → the Atelier's step 1 (0.24), the store since 0.42 ------------------
ACCENT_DWELL = 0.2  # the part of a roaming bulb's cycle spent on the accent (the walk's constant)
# A kept palette is a DOCUMENT in the component's store now, not seventeen
# helpers in one of eight numbered slots: no ceiling, no ghost after a
# deletion, nothing to seed at a converge. What is left here is the day's
# RULES, which are still the family's helpers (V8b moves them into the same
# store) and whose grammar — RULE_NUMBERS — is the component's, read above.


def rule_seeds(rules: dict, kelvin: dict | None = None) -> dict:
    """The day's rules as the helpers' values — what the conductor seeds."""
    w = rules["harmonies"]
    level = rules.get("level") or {}
    jit = level.get("jitter", 0)
    jit = jit if isinstance(jit, list) else [jit, jit]
    alive = rules.get("alive")
    if alive is None:
        a_min, a_max, a_all = 0, 0, False
    elif alive == "all":
        a_min, a_max, a_all = 0, 0, True
    elif isinstance(alive, list):
        a_min = int(alive[0])
        a_all = alive[1] == "all"
        a_max = 0 if a_all else int(alive[1])
    else:
        a_min, a_max, a_all = int(alive), int(alive), False
    life = rules.get("life") or {}
    curve = level.get("curve") or {}
    out = {f"input_number.{RULES_PREFIX}_weight_{n}": float(w.get(n, 0)) for n in ORDER}
    out.update(
        {
            f"input_number.{RULES_PREFIX}_avoid_from": float(rules["avoid"][0]),
            f"input_number.{RULES_PREFIX}_avoid_to": float(rules["avoid"][1]),
            f"input_number.{RULES_PREFIX}_saturation_min": float(rules["saturation"][0]),
            f"input_number.{RULES_PREFIX}_saturation_max": float(rules["saturation"][1]),
            f"input_number.{RULES_PREFIX}_jitter_min": float(jit[0]),
            f"input_number.{RULES_PREFIX}_jitter_max": float(jit[1]),
            f"input_number.{RULES_PREFIX}_alive_min": float(a_min),
            f"input_number.{RULES_PREFIX}_alive_max": float(a_max),
            f"input_boolean.{RULES_PREFIX}_alive_all": "on" if a_all else "off",
            f"input_text.{RULES_PREFIX}_shapes": ", ".join(life.get("shapes") or []),
            f"input_number.{RULES_PREFIX}_every_min": float((life.get("every") or [120, 600])[0]),
            f"input_number.{RULES_PREFIX}_every_max": float((life.get("every") or [120, 600])[1]),
            f"input_number.{RULES_PREFIX}_chance": float(life.get("chance", 100) if life else 0),
        }
    )
    for period in PERIODS:
        out[f"input_number.{RULES_PREFIX}_curve_{period}"] = float(curve.get(period, 100))
    return out


def auto_label(palettes: dict, ui) -> str:
    """The select's word for the day's draw: the rules' own label, else the
    house's language."""
    return palettes["today"].get("label") or getattr(ui, "palette_auto", "Auto")


def options(palettes: dict, ui) -> list[dict]:
    """The select's RENDERED options: the day's draw first, then the file's
    named palettes. The kept palettes' names join at runtime — the component
    holds them and sets the select's options whenever one is saved, renamed or
    deleted (palettes.py's `async_names`, the automation's job until 0.41)."""
    out = [{"id": AUTO, "label": auto_label(palettes, ui)}]
    out += [{"id": pid, "label": p["label"]} for pid, p in palettes["named"].items()]
    return out


def knob_value(entity: str, value) -> str:
    """A helper's value as the conductor reads and compares it: a number as
    `str(float)`, an hour to the minute, a switch's word, a text."""
    domain = entity.split(".", 1)[0]
    if domain == "input_number":
        return str(float(value))
    if domain == "input_datetime":
        return str(value)[:5]
    return str(value)


def rules_round_trip(raw: dict, file_rules: dict, kelvin: dict | None = None) -> dict:
    """The rules' helpers as the phone holds them, read into the rules and
    seeded back — a helper moved in a way the rules cannot say (a count under
    « toutes ») reads as no edit."""

    def read(e):
        return {"state": raw[e]} if e in raw else None

    rules = rules_from_helpers(read, file_rules)
    seeds = rule_seeds(rules, kelvin)
    seeds["input_datetime.house_palette_turns"] = rules["turns"]
    return {e: knob_value(e, v) for e, v in seeds.items() if e in raw}


def rules_normal(rules: dict) -> dict:
    """The day's rules in the shape the helpers can say — the pull compares
    the file's and the phone's under it, leaf by leaf."""
    seeds = rule_seeds(rules)
    seeds["input_datetime.house_palette_turns"] = rules["turns"] + ":00"
    out = rules_from_helpers(lambda e: {"state": seeds[e]} if e in seeds else None, rules)
    out.pop("label", None)
    return out


def describe_store(a: dict | None, b: dict | None) -> str:
    """The parts that differ between two palettes under the store's form."""
    a, b = a or {}, b or {}
    keys = ("label", "band", "accent", "saturation", "white", "curve", "jitter", "alive", "life")
    moved = [f"{k} {a.get(k)} → {b.get(k)}" for k in keys if a.get(k) != b.get(k)]
    return ", ".join(moved) or "nothing"


def house_plan(house) -> dict:
    """What the pack renders for the house: the rooms with a part (the switch
    « Palette du jour » and its flip), the repaint's rooms, the rules' helpers
    and the Atelier's words."""
    chip, repaint, flip = [], [], []
    for a in house.areas:
        if house.parking(a):
            continue
        plans = house.scene_plan(a)
        looks = [p["id"] for p in plans if p["renders"] and p.get("palette")]
        if looks:
            repaint.append({"room": a["id"], "looks": looks})
        if any(p["id"] == "today" and p["renders"] for p in plans):
            chip.append(a["id"])
            # the flip (0.26): a room lit in one of its default looks, or in the
            # palette, takes what "on" means now when the switch moves
            defaults = {
                look for row in house.defaults_of(a).values() for look in row.values() if look
            }
            flip.append({"room": a["id"], "looks": sorted(defaults | {"today"})})
    palettes = house.palettes()
    fx = house.fx()
    shapes = list(fx.get("enable") or sorted(house.shapes()))
    ui = house.labels.ui
    labels = {
        k: getattr(ui, f"atelier_{k}", None) or getattr(ui, k, None)
        for k in (
            "title",
            "open",
            "subtitle",
            "rules",
            "new",
            "name",
            "saturation",
            "jitter",
            "white",
            "curve",
            "alive",
            "all",
            "shapes",
            "every",
            "try",
            "random",
            "saveas",
            "delete",
            "confirm",
            "duplicate",
            "arc",
            "accent",
            "file_note",
            "avoid_note",
            "weight",
            "chance",
            "week",
            "try_today",
            "another",
            "saveas_prompt",
            "full",
        )
    }
    for h in ORDER:
        labels[f"harmony_{h}"] = getattr(ui, f"harmony_{h}", h)
    return {
        "chip": chip,
        "repaint": repaint,
        "flip": flip,
        "rules_prefix": RULES_PREFIX,
        "rule_numbers": RULE_NUMBERS,
        "periods": PERIODS,
        "whites": list(house.kelvin()),
        # the card (0.25): the file's palettes read-only, the shapes it may chip,
        # the salt for the week it draws, its words
        "named": [
            {"id": pid, "label": p["label"], "palette": named_value(p, house.kelvin())}
            for pid, p in palettes["named"].items()
        ],
        "shapes": shapes,
        "salt": house.palette_salt(),
        "labels": {k: v for k, v in labels.items() if v},
    }


def rooms_plan(house) -> list[dict]:
    """Every room draw the component computes for the day, one per (room,
    palette source, candidates, targets) a look reads — the key is what the
    look's script names when it reads the `rooms` attribute back. Two looks of
    one room asking the same question share one entry."""
    out: dict[str, dict] = {}
    for a in house.areas:
        if house.parking(a):
            continue
        for p in house.scene_plan(a):
            if not p["renders"] or not p.get("palette"):
                continue
            spal = house.scene_palette(a, p)
            if spal:
                out.setdefault(spal["room"]["key"], spal["room"])
    return list(out.values())


def component_config(house) -> dict:
    """The `regie: palette:` block the pack renders — what the component needs
    that only the FILES can say: the salt, the day's rules and the named
    palettes as written, the white words, the select's word for the draw, and
    the rooms whose draws ride on the sensor."""
    palettes = house.palettes()
    rules = dict(palettes["today"])
    rules.pop("label", None)
    return {
        "salt": house.palette_salt(),
        "auto": auto_label(palettes, house.labels.ui),
        "kelvin": house.kelvin(),
        "rules": rules,
        "named": {pid: dict(p) for pid, p in palettes["named"].items()},
        "rooms": rooms_plan(house),
    }


def render_context(house) -> dict:
    """The select's options, the house's plan and the component's config —
    built here, tested here; the pack's template only places them. The
    sensor's three Jinja templates left with 0.42: the component computes the
    value from the arithmetic both sides read."""
    return {
        "options": options(house.palettes(), house.labels.ui),
        "house": house_plan(house),
        # ONE JSON SCALAR, and this is not decoration. Home Assistant merges a
        # package's config into the main one RECURSIVELY, and every list it
        # meets on the way goes through `cv.remove_falsy` — `avoid: [0, 60]`
        # would arrive `[60]`, `alive: [0, all]` would arrive `[all]`, and a
        # jitter of `[0, 15]` would arrive a single number (config.py,
        # `_recursive_merge`, read at the source 2026-09-07). A scalar crosses
        # the merge untouched, so the block the component reads is a string it
        # parses itself.
        "config": json.dumps(component_config(house), indent=2, ensure_ascii=False),
    }
