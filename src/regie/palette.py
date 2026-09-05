"""A palette for the whole house (0.20 — « La Palette du jour », home.md §6.9, H49).

A palette is a VALUE with four optional parts: colours (one arc of the hue
circle that never crosses the yellow-green quarter, one accent from the far
side, a saturation, a white word), level (a curve over the house's periods
and a jitter), alive (how many candidate bulbs roam), life (fx now and then).
A named palette gives numbers; `today` gives RULES, and the day draws within
them — a pure function of (day, roll, salt), the way the drift's hue is a
function of the clock: nothing stored, a restart changes nothing, Christmas
printed in advance.

The generator runs in two places from ONE arithmetic: here (`regie palette`,
the tests) and in the sensor's template on the brain (`jinja_body()` emits
it) — the minimal-standard generator (Park–Miller, x ← 16807·x mod 2³¹−1),
integer maths on both sides, and a test proving they agree over ten years of
days. `int(x + 0.5)` where a number is rounded, never `round`: Python's is
banker's, Jinja's is not.
"""

from __future__ import annotations

import colorsys
import datetime as dt
import sys

from .errors import HouseError
from .fx import KELVIN

M = 2147483647  # 2³¹ − 1
A = 16807
DRAWS = 7  # harmony · width · start · accent · saturation · jitter · life — in this order
# the harmonies: the arc's width, in degrees. `libre` is the wide one for wild
# days — weight 0 unless the house wants them
HARMONIES: dict[str, tuple[int, int]] = {
    "degrade": (100, 150),
    "duo": (30, 50),
    "uni": (15, 25),
    "libre": (150, 220),
}
ORDER = tuple(HARMONIES)
COLD = (150, 300)  # an arc whose middle sits here is cold
WARM_ACCENT = (345, 60)  # red → amber, wrapped: 345 + r·60
COLD_ACCENT = (170, 50)  # cyan → blue: 170 + r·50
DEFAULT_RULES: dict = {
    "harmonies": {"degrade": 5, "duo": 3, "uni": 2, "libre": 0},
    "avoid": [45, 105],
    "saturation": [85, 100],
    "turns": "06:30",
}
WHITES = tuple(KELVIN)
JITTER_MAX = 30
LIFE_EVERY_MIN = 60
AUTO = "today"


def salt_of(name: str) -> int:
    """The house's name as a number, so two houses never share a week."""
    h = 7
    for c in name:
        h = (h * 31 + ord(c)) % M
    return h or 1


def day_of(when: dt.datetime, turns: str, tz: dt.tzinfo | None = None) -> int:
    """The house's day: the calendar day shifted by the hour the palette turns —
    a late evening keeps its palette to the end. The HOUSE's zone decides (the
    brain's `now()` is in it); a reader elsewhere passes it."""
    h, m = turns.split(":")
    if tz is not None:
        when = when.astimezone(tz)
    offset = when.utcoffset()
    local = when.timestamp() + (offset.total_seconds() if offset else 0)
    return int((local - int(h) * 3600 - int(m) * 60) // 86400)


def _draws(day: int, roll: int, salt: int) -> list[float]:
    x = (day * 7919 + roll * 104729 + salt) % M
    if x <= 0:
        x = 1
    out = []
    for _ in range(DRAWS):
        x = (x * A) % M
        out.append(x / M)
    return out


def _pick(h: float, weights: dict[str, int]) -> str:
    total = sum(weights.values())
    acc = 0
    for name in ORDER:
        acc += weights.get(name, 0)
        if h * total < acc:
            return name
    return ORDER[0]


def draw(day: int, roll: int, salt: int, rules: dict) -> dict:
    """Today's palette from the rules — the same arithmetic as `jinja_body`."""
    h, w, s, a, sat, j, lf = _draws(day, roll, salt)
    harmony = _pick(h, rules["harmonies"])
    w0, w1 = HARMONIES[harmony]
    width = w0 + w * (w1 - w0)
    av0, av1 = rules["avoid"]
    start = av1 + s * (360 + av0 - av1 - width)
    mid = (start + width / 2) % 360
    cold = COLD[0] <= mid <= COLD[1]
    accent = (
        (WARM_ACCENT[0] + a * WARM_ACCENT[1]) % 360 if cold else COLD_ACCENT[0] + a * COLD_ACCENT[1]
    )
    s0, s1 = rules["saturation"]
    saturation = int(s0 + sat * (s1 - s0) + 0.5)
    level = rules.get("level") or {}
    jit = level.get("jitter", 0)
    jitter = int(jit[0] + j * (jit[1] - jit[0]) + 0.5) if isinstance(jit, list) else int(jit)
    life = rules.get("life")
    alive_today = bool(life) and lf * 100 < life.get("chance", 100)
    white = "neutral" if cold else "warm"
    return {
        "harmony": harmony,
        "lo": int(start % 360 + 0.5) % 360,
        "hi": int((start + width) % 360 + 0.5) % 360,
        "width": int(width + 0.5),
        "accent": int(accent + 0.5) % 360,
        "saturation": saturation,
        "white": white,
        "white_kelvin": KELVIN[white],
        "curve": level.get("curve"),
        "jitter": jitter,
        "alive": rules.get("alive"),
        "life": {"shapes": list(life["shapes"]), "every": list(life["every"])}
        if alive_today
        else None,
        "day": day,
        "roll": roll,
    }


def named_value(p: dict, kelvin: dict | None = None) -> dict:
    """A named palette as the sensor carries it — the same keys as a draw."""
    k = kelvin or KELVIN
    lo, hi = p["band"]
    width = (hi - lo) % 360 or 360
    level = p.get("level") or {}
    return {
        "harmony": None,
        "lo": lo % 360,
        "hi": hi % 360,
        "width": width,
        "accent": p.get("accent"),
        "saturation": p.get("saturation", 100),
        "white": p.get("white", "warm"),
        "white_kelvin": k.get(p.get("white", "warm"), KELVIN["warm"]),
        "curve": level.get("curve"),
        "jitter": level.get("jitter", 0),
        "alive": p.get("alive"),
        "life": p.get("life"),
    }


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
            crosses = any(av0 < (lo + d) % 360 < av1 for d in range(0, int(width) + 1))
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
    if len(av) != 2 or not 0 <= av[0] < av[1] <= 360:
        errors.append(f"{where}: avoid is [from, to], from < to, on the hue circle")
    else:
        free = 360 - (av[1] - av[0])
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


# --- the sensor's template ----------------------------------------------------
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


def jinja_body(rules: dict, salt: int, kelvin: dict | None = None) -> str:
    """The draw as Jinja, expecting `day` and `roll` set before it and leaving
    `palette` (a dict) after it — the same steps as `draw`, in the same order."""
    k = kelvin or KELVIN
    weights = [(n, rules["harmonies"].get(n, 0)) for n in ORDER]
    total = sum(w for _, w in weights)
    av0, av1 = rules["avoid"]
    s0, s1 = rules["saturation"]
    level = rules.get("level") or {}
    jit = level.get("jitter", 0)
    life = rules.get("life")
    lines = [
        f"{{% set ns = namespace(x=((day * 7919 + roll * 104729 + {salt}) % {M}), "
        "r=[], h='degrade', acc=0, done=false) %}",
        "{% if ns.x <= 0 %}{% set ns.x = 1 %}{% endif %}",
        f"{{% for i in range({DRAWS}) %}}{{% set ns.x = (ns.x * {A}) % {M} %}}"
        f"{{% set ns.r = ns.r + [ns.x / {M}] %}}{{% endfor %}}",
        "{% set h, w, s, a, sat, j, lf = ns.r %}",
        f"{{% for name, wt in {_j([[n, w] for n, w in weights])} %}}{{% if not ns.done %}}"
        f"{{% set ns.acc = ns.acc + wt %}}{{% if h * {total} < ns.acc %}}{{% set ns.h = name %}}"
        "{% set ns.done = true %}{% endif %}{% endif %}{% endfor %}",
        f"{{% set wr = {_j({n: list(HARMONIES[n]) for n in ORDER})}[ns.h] %}}",
        "{% set width = wr[0] + w * (wr[1] - wr[0]) %}",
        f"{{% set start = {av1} + s * (360 + {av0} - {av1} - width) %}}",
        "{% set mid = (start + width / 2) % 360 %}",
        f"{{% set cold = {COLD[0]} <= mid and mid <= {COLD[1]} %}}",
        f"{{% set accent = ((({WARM_ACCENT[0]} + a * {WARM_ACCENT[1]}) % 360) if cold "
        f"else ({COLD_ACCENT[0]} + a * {COLD_ACCENT[1]})) %}}",
        f"{{% set saturation = ({s0} + sat * ({s1} - {s0}) + 0.5) | int %}}",
    ]
    if isinstance(jit, list):
        lines.append(f"{{% set jitter = ({jit[0]} + j * ({jit[1]} - {jit[0]}) + 0.5) | int %}}")
    else:
        lines.append(f"{{% set jitter = {int(jit)} %}}")
    if life:
        lines.append(
            f"{{% set life = {_j({'shapes': list(life['shapes']), 'every': list(life['every'])})} "
            f"if lf * 100 < {life.get('chance', 100)} else none %}}"
        )
    else:
        lines.append("{% set life = none %}")
    lines.append("{% set white = 'neutral' if cold else 'warm' %}")
    lines.append(
        "{% set palette = {'harmony': ns.h, 'lo': ((start % 360 + 0.5) | int) % 360, "
        "'hi': (((start + width) % 360 + 0.5) | int) % 360, 'width': (width + 0.5) | int, "
        "'accent': ((accent + 0.5) | int) % 360, 'saturation': saturation, 'white': white, "
        f"'white_kelvin': {k['neutral']} if cold else {k['warm']}, "
        f"'curve': {_j(level.get('curve'))}, 'jitter': jitter, 'alive': {_j(rules.get('alive'))}, "
        "'life': life, 'day': day, 'roll': roll} %}"
    )
    return "\n".join(lines)


def jinja_day(turns_entity: str, roll_entity: str, default_turns: str) -> str:
    """`day` and `roll` from the brain: the hour the palette turns and the roll
    knob — both helpers, both the family's."""
    h, m = default_turns.split(":")
    return "\n".join(
        [
            "{% set t = now() %}",
            f"{{% set turns = states('{turns_entity}') %}}",
            f"{{% set tsec = ((turns[0:2] | int({int(h)})) * 3600 "
            f"+ (turns[3:5] | int({int(m)})) * 60) "
            f"if turns not in ['unknown', 'unavailable'] else {int(h) * 3600 + int(m) * 60} %}}",
            "{% set day = ((as_timestamp(t) + t.utcoffset().total_seconds() - tsec) // 86400) "
            "| int %}",
            f"{{% set roll = states('{roll_entity}') | int(0) %}}",
        ]
    )


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


def alive_count(rule, r: float, n_candidates: int) -> int:
    """How many candidates roam today, from the palette's `alive` rule."""
    if rule is None or n_candidates == 0:
        return 0
    if rule == "all":
        return n_candidates
    if isinstance(rule, list):
        lo, hi = rule
        hi = n_candidates if hi == "all" else min(int(hi), n_candidates)
        lo = min(int(lo), hi)
        return min(lo + int(r * (hi - lo + 1)), hi)
    return min(int(rule), n_candidates)


def room_draw(
    day: int,
    roll: int,
    salt: int,
    room: str,
    alive,
    n_candidates: int,
    n_targets: int,
    jitter: float,
) -> dict:
    """The room's own draws for the day — which candidates roam (a count and
    an offset, so the choice rotates with the day) and each bulb's scatter."""
    x = (day * 7919 + roll * 104729 + salt + salt_of(room)) % M
    if x <= 0:
        x = 1
    r = []
    for _ in range(2 + n_targets):
        x = (x * A) % M
        r.append(x / M)
    count = alive_count(alive, r[0], n_candidates)
    offset = int(r[1] * n_candidates) if n_candidates else 0
    alive_flags = [((k - offset) % n_candidates) < count for k in range(n_candidates)]
    scatter = [int((r[2 + k] * 2 - 1) * jitter * 10 + 0.5) / 10 for k in range(n_targets)]
    return {"count": count, "offset": offset, "alive": alive_flags, "scatter": scatter}


def room_jinja(
    salt: int, room: str, alive, n_candidates: int, n_targets: int, jitter_expr: str
) -> str:
    """`room_draw` as one Jinja template, reading the day and the roll from the
    sensor — the same steps, leaving a dict."""
    nc = n_candidates
    lines = [
        f"{{% set s = {PAL_EXPR} %}}",
        f"{{% set ns = namespace(x=(((s.day | int(0)) * 7919 + (s.roll | int(0)) * 104729 "
        f"+ {salt + salt_of(room)}) % {M}), r=[], alive=[], scatter=[]) %}}",
        "{% if ns.x <= 0 %}{% set ns.x = 1 %}{% endif %}",
        f"{{% for i in range({2 + n_targets}) %}}{{% set ns.x = (ns.x * {A}) % {M} %}}"
        f"{{% set ns.r = ns.r + [ns.x / {M}] %}}{{% endfor %}}",
    ]
    if alive is None or nc == 0:
        lines.append("{% set count = 0 %}")
    elif alive == "all":
        lines.append(f"{{% set count = {nc} %}}")
    elif isinstance(alive, list):
        lo, hi = alive
        hi = nc if hi == "all" else min(int(hi), nc)
        lo = min(int(lo), hi)
        lines.append(f"{{% set count = [{lo} + ((ns.r[0] * {hi - lo + 1}) | int), {hi}] | min %}}")
    else:
        lines.append(f"{{% set count = {min(int(alive), nc)} %}}")
    lines.append(f"{{% set offset = (ns.r[1] * {nc}) | int %}}" if nc else "{% set offset = 0 %}")
    lines.append(f"{{% set jitter = {jitter_expr} %}}")
    # a `set` inside a `for` is scoped to the loop: the lists live on the namespace
    if nc:
        lines.append(
            f"{{% for k in range({nc}) %}}"
            f"{{% set ns.alive = ns.alive + [((k - offset) % {nc}) < count] %}}{{% endfor %}}"
        )
    lines.append(
        f"{{% for k in range({n_targets}) %}}"
        "{% set ns.scatter = ns.scatter + "
        "[(((ns.r[2 + k] * 2 - 1) * jitter * 10 + 0.5) | int) / 10] %}"
        "{% endfor %}"
    )
    lines.append(
        "{{ {'count': count, 'offset': offset, 'alive': ns.alive, 'scatter': ns.scatter} }}"
    )
    return "\n".join(lines)


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
        pal_expr = PAL_EXPR
        alive = palettes["today"]["alive"]
        jitter_expr = "(s.jitter | int(0))"
    else:
        named = palettes["named"].get(pid)
        if named is None:
            return None
        value = named_value(named, house.kelvin())
        pal_expr = _j(value)
        alive = named.get("alive")
        jitter_expr = str((named.get("level") or {}).get("jitter", 0))
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
    return {
        "source": pid,
        "pal": pal_expr,
        "targets": targets,
        "arc": arc,
        "candidates": candidates,
        "roamers": [t for t in arc if t["word"] == "roam"],
        "variables": {
            "pal": f"{{{{ {pal_expr} }}}}",
            "period": "{{ states('sensor.house_period') }}",
            "room": room_jinja(
                house.palette_salt(), area["id"], alive, len(candidates), len(targets), jitter_expr
            ),
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


# --- step 4 → the Atelier's step 1 (0.24): the stores with free names, the day's rules ---
STORE = "k"  # a kept palette lives in a store; its NAME is the face, the number is plumbing
ACCENT_DWELL = 0.2  # the part of a roaming bulb's cycle spent on the accent (the walk's constant)
STORE_NUMBERS = {  # key: (min, max, step, default)
    "start": (0, 360, 1, 200),
    "width": (10, 220, 1, 120),
    "accent": (0, 360, 1, 30),
    "saturation": (0, 100, 1, 90),
    "jitter": (0, JITTER_MAX, 1, 0),
    "curve_morning": (0, 200, 5, 100),
    "curve_day": (0, 200, 5, 100),
    "curve_evening": (0, 200, 5, 100),
    "curve_night": (0, 200, 5, 100),
    "alive": (0, 40, 1, 0),
    "every_min": (LIFE_EVERY_MIN, 3600, 10, 120),
    "every_max": (LIFE_EVERY_MIN, 3600, 10, 600),
}
RULE_NUMBERS = {  # the day's rules as helpers (seeded from fx.yml, the family owns them after)
    "weight_degrade": (0, 20, 1, 5),
    "weight_duo": (0, 20, 1, 3),
    "weight_uni": (0, 20, 1, 2),
    "weight_libre": (0, 20, 1, 0),
    "avoid_from": (0, 360, 1, 45),
    "avoid_to": (0, 360, 1, 105),
    "saturation_min": (0, 100, 1, 85),
    "saturation_max": (0, 100, 1, 100),
    "jitter_min": (0, JITTER_MAX, 1, 0),
    "jitter_max": (0, JITTER_MAX, 1, 0),
    "curve_morning": (0, 200, 5, 100),
    "curve_day": (0, 200, 5, 100),
    "curve_evening": (0, 200, 5, 100),
    "curve_night": (0, 200, 5, 100),
    "alive_min": (0, 40, 1, 0),
    "alive_max": (0, 40, 1, 0),
    "every_min": (LIFE_EVERY_MIN, 3600, 10, 120),
    "every_max": (LIFE_EVERY_MIN, 3600, 10, 600),
    "chance": (0, 100, 5, 0),
}
PERIODS = ("morning", "day", "evening", "night")


def keep_of(house) -> int:
    """How many stores the house keeps (controls.palette: { keep: N }; true = 8)."""
    c = (house.data.get("controls") or {}).get("palette")
    if isinstance(c, dict):
        return int(c.get("keep", c.get("slots", 8)))
    return 8 if c else 0


def store_prefix(i: int) -> str:
    return f"house_palette_{STORE}{i}"


RULES_PREFIX = "house_palette_today"


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


def _num(read, entity: str, default: float) -> float:
    s = read(entity)
    try:
        return float(s["state"]) if isinstance(s, dict) else default
    except (TypeError, ValueError):
        return default


def _txt(read, entity: str) -> str:
    s = read(entity)
    v = (s or {}).get("state") if isinstance(s, dict) else None
    return "" if v in (None, "unknown", "unavailable") else str(v)


def _shapes(text: str) -> list[str]:
    return [w.strip() for w in text.replace(";", ",").split(",") if w.strip()]


def rules_from_helpers(read, file_rules: dict) -> dict:
    """The day's rules as the brain holds them (the family's edits), in the
    shape `draw` takes; the file's rules fill what a helper cannot say."""
    px = RULES_PREFIX
    weights = {
        n: int(_num(read, f"input_number.{px}_weight_{n}", file_rules["harmonies"].get(n, 0)))
        for n in ORDER
    }
    curve = {p: int(_num(read, f"input_number.{px}_curve_{p}", 100)) for p in PERIODS}
    a_min = int(_num(read, f"input_number.{px}_alive_min", 0))
    a_max = int(_num(read, f"input_number.{px}_alive_max", 0))
    a_all = _txt(read, f"input_boolean.{px}_alive_all") == "on"
    alive = (
        [a_min, "all"]
        if a_all
        else ([a_min, a_max] if a_max > 0 else (None if a_min == 0 else a_min))
    )
    shapes = _shapes(_txt(read, f"input_text.{px}_shapes"))
    chance = int(_num(read, f"input_number.{px}_chance", 0))
    life = (
        {
            "shapes": shapes,
            "every": [
                int(_num(read, f"input_number.{px}_every_min", 120)),
                int(_num(read, f"input_number.{px}_every_max", 600)),
            ],
            "chance": chance,
        }
        if shapes and chance > 0
        else None
    )
    turns = _txt(read, "input_datetime.house_palette_turns")[:5] or file_rules["turns"]
    return {
        "harmonies": weights,
        "avoid": [
            int(_num(read, f"input_number.{px}_avoid_from", 45)),
            int(_num(read, f"input_number.{px}_avoid_to", 105)),
        ],
        "saturation": [
            int(_num(read, f"input_number.{px}_saturation_min", 85)),
            int(_num(read, f"input_number.{px}_saturation_max", 100)),
        ],
        "level": {
            "curve": curve,
            "jitter": [
                int(_num(read, f"input_number.{px}_jitter_min", 0)),
                int(_num(read, f"input_number.{px}_jitter_max", 0)),
            ],
        },
        "alive": alive,
        "life": life,
        "turns": turns,
        "label": file_rules.get("label"),
    }


def store_from_helpers(prefix: str, read) -> dict | None:
    """A kept palette as the file would spell it — None when the store is free."""
    name = _txt(read, f"input_text.{prefix}_name")
    if not name:
        return None
    lo = int(_num(read, f"input_number.{prefix}_start", 0))
    width = int(_num(read, f"input_number.{prefix}_width", 120))
    out: dict = {
        "label": name,
        "band": [lo % 360, (lo + width) % 360],
        "accent": int(_num(read, f"input_number.{prefix}_accent", 30)),
        "saturation": int(_num(read, f"input_number.{prefix}_saturation", 100)),
        "white": _txt(read, f"input_select.{prefix}_white") or "warm",
    }
    curve = {p: int(_num(read, f"input_number.{prefix}_curve_{p}", 100)) for p in PERIODS}
    jitter = int(_num(read, f"input_number.{prefix}_jitter", 0))
    if any(v != 100 for v in curve.values()) or jitter:
        out["level"] = {}
        if any(v != 100 for v in curve.values()):
            out["level"]["curve"] = curve
        if jitter:
            out["level"]["jitter"] = jitter
    if _txt(read, f"input_boolean.{prefix}_alive_all") == "on":
        out["alive"] = "all"
    else:
        alive = int(_num(read, f"input_number.{prefix}_alive", 0))
        if alive:
            out["alive"] = alive
    shapes = _shapes(_txt(read, f"input_text.{prefix}_shapes"))
    if shapes:
        out["life"] = {
            "shapes": shapes,
            "every": [
                int(_num(read, f"input_number.{prefix}_every_min", 120)),
                int(_num(read, f"input_number.{prefix}_every_max", 600)),
            ],
        }
    return out


def slug(name: str) -> str:
    out = "".join(c.lower() if c.isalnum() else "_" for c in name.strip())
    while "__" in out:
        out = out.replace("__", "_")
    out = out.strip("_") or "palette"
    return out if out[0].isalpha() else "p_" + out


def stores_from_helpers(house, read) -> dict[str, dict]:
    """Every kept store by its slug, in store order."""
    out = {}
    for i in range(1, keep_of(house) + 1):
        p = store_from_helpers(store_prefix(i), read)
        if p:
            out[slug(p["label"])] = p
    return out


def freed_stores(house, read) -> list[str]:
    """The stores whose name the file now carries: the conductor empties them
    at the converge — the file is the design."""
    named = house.palettes()["named"]
    known = {p["label"] for p in named.values()} | set(named)
    out = []
    for i in range(1, keep_of(house) + 1):
        prefix = store_prefix(i)
        p = store_from_helpers(prefix, read)
        if p and (p["label"] in known or slug(p["label"]) in named):
            out.append(prefix)
    return out


def pull_palettes(house, read) -> dict:
    """The `palettes:` mapping `regie palette pull` writes: the file's own
    named palettes kept as written, the kept stores added by their slug, the
    day's rules as the brain holds them."""
    raw = dict((house.data.get("fx") or {}).get("palettes") or {})
    today = dict(raw.pop(AUTO, None) or {})
    rules = rules_from_helpers(read, house.palettes()["today"])
    new_today: dict = {
        "harmonies": rules["harmonies"],
        "avoid": rules["avoid"],
        "saturation": rules["saturation"],
        "level": rules["level"],
        "turns": rules["turns"],
    }
    if rules["alive"] is not None:
        new_today["alive"] = rules["alive"]
    if rules["life"]:
        new_today["life"] = rules["life"]
    if today.get("label"):
        new_today["label"] = today["label"]
    out = dict(raw)
    for pid, p in stores_from_helpers(house, read).items():
        out[pid] = {k: v for k, v in p.items()}
    out[AUTO] = new_today
    return out


def _flow(v) -> str:
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, str):
        return f'"{v}"' if any(c in v for c in ":#{}[],&*?|<>=!%@`'\"") or v != v.strip() else v
    if isinstance(v, list):
        return "[" + ", ".join(_flow(x) for x in v) + "]"
    if isinstance(v, dict):
        return "{ " + ", ".join(f"{k}: {_flow(x)}" for k, x in v.items()) + " }"
    return str(v)


def palettes_block(palettes: dict) -> str:
    """The `palettes:` block as the house writes it: one palette per key, its
    parts one under the other, leaves in flow style."""
    lines = ["palettes:"]
    for pid, p in palettes.items():
        lines.append(f"  {pid}:")
        for k, v in p.items():
            lines.append(f"    {k}: {_flow(v)}")
    return "\n".join(lines) + "\n"


PALETTES_BLOCK = None  # compiled lazily (re is imported below)


def rewrite_palettes(path, palettes: dict) -> bool:
    """Replace the file's top-level `palettes:` block (append one if it has
    none); every other byte of the file is kept. Returns whether it changed."""
    import re

    block = re.compile(r"^palettes:\n(?:(?:[ \t]+.*|\s*)\n?)*", re.M)
    text = path.read_text(encoding="utf-8")
    new = palettes_block(palettes)
    m = block.search(text)
    out = (
        text[: m.start()] + new + text[m.end() :]
        if m
        else text + ("" if text.endswith("\n") else "\n") + new
    )
    if out == text:
        return False
    path.write_text(out, encoding="utf-8")
    return True


def helper_palette_jinja(prefix: str, kelvin: dict) -> str:
    """A kept palette read from its store's helpers, as the sensor's `palette`
    dict — the same keys as a draw."""
    return (
        f"{{% set lo = states('input_number.{prefix}_start') | int(0) %}}"
        f"{{% set width = states('input_number.{prefix}_width') | int(120) %}}"
        f"{{% set white = states('input_select.{prefix}_white') %}}"
        f"{{% set shapes = states('input_text.{prefix}_shapes') "
        "| replace(';', ',') | replace(' ', '') %}"
        "{% set shapes = shapes.split(',') | reject('eq', '') | list "
        "if shapes not in ['unknown', 'unavailable'] else [] %}"
        f"{{% set curve = {{"
        + ", ".join(f"'{p}': states('input_number.{prefix}_curve_{p}') | int(100)" for p in PERIODS)
        + "} %}"
        f"{{% set palette = {{'harmony': none, 'lo': lo % 360, 'hi': (lo + width) % 360, "
        f"'width': width, 'accent': states('input_number.{prefix}_accent') | int(30), "
        f"'saturation': states('input_number.{prefix}_saturation') | int(100), "
        f"'white': white if white in {_j(list(kelvin))} else 'warm', "
        f"'white_kelvin': {_j(kelvin)}.get(white, {kelvin['warm']}), "
        f"'curve': curve, 'jitter': states('input_number.{prefix}_jitter') | int(0), "
        f"'alive': ('all' if is_state('input_boolean.{prefix}_alive_all', 'on') else "
        f"(none if (states('input_number.{prefix}_alive') | int(0)) == 0 "
        f"else states('input_number.{prefix}_alive') | int(0))), "
        "'life': ({'shapes': shapes, 'every': "
        f"[states('input_number.{prefix}_every_min') | int(120), "
        f"states('input_number.{prefix}_every_max') | int(600)]}} if shapes else none), "
        f"'day': day, 'roll': roll}} %}}"
    )


def jinja_rules(kelvin: dict) -> str:
    """The day's rules read from the helpers, as the variables `jinja_body`
    reads when it runs LIVE: the family's edits shape the draw."""
    px = RULES_PREFIX
    return "\n".join(
        [
            "{% set weights = ["
            + ", ".join(f"states('input_number.{px}_weight_{n}') | int(0)" for n in ORDER)
            + "] %}",
            f"{{% set av0 = states('input_number.{px}_avoid_from') | int(45) %}}",
            f"{{% set av1 = states('input_number.{px}_avoid_to') | int(105) %}}",
            f"{{% set s0 = states('input_number.{px}_saturation_min') | int(85) %}}",
            f"{{% set s1 = states('input_number.{px}_saturation_max') | int(100) %}}",
            f"{{% set j0 = states('input_number.{px}_jitter_min') | int(0) %}}",
            f"{{% set j1 = states('input_number.{px}_jitter_max') | int(0) %}}",
            "{% set curve = {"
            + ", ".join(f"'{p}': states('input_number.{px}_curve_{p}') | int(100)" for p in PERIODS)
            + "} %}",
            f"{{% set a_min = states('input_number.{px}_alive_min') | int(0) %}}",
            f"{{% set a_max = states('input_number.{px}_alive_max') | int(0) %}}",
            f"{{% set alive = ([a_min, 'all'] if is_state('input_boolean.{px}_alive_all', 'on') "
            "else ([a_min, a_max] if a_max > 0 else (none if a_min == 0 else a_min))) %}",
            f"{{% set shapes = states('input_text.{px}_shapes') "
            "| replace(';', ',') | replace(' ', '') %}",
            "{% set shapes = shapes.split(',') | reject('eq', '') | list "
            "if shapes not in ['unknown', 'unavailable'] else [] %}",
            f"{{% set chance = states('input_number.{px}_chance') | int(0) %}}",
            f"{{% set every = [states('input_number.{px}_every_min') | int(120), "
            f"states('input_number.{px}_every_max') | int(600)] %}}",
        ]
    )


def jinja_body_live(salt: int, kelvin: dict) -> str:
    """The draw as Jinja, the rules read from the helpers (`jinja_rules` first)
    — the same steps as `draw` and `jinja_body`, in the same order."""
    k = kelvin
    lines = [
        f"{{% set ns = namespace(x=((day * 7919 + roll * 104729 + {salt}) % {M}), "
        "r=[], h='degrade', acc=0, done=false) %}",
        "{% if ns.x <= 0 %}{% set ns.x = 1 %}{% endif %}",
        f"{{% for i in range({DRAWS}) %}}{{% set ns.x = (ns.x * {A}) % {M} %}}"
        f"{{% set ns.r = ns.r + [ns.x / {M}] %}}{{% endfor %}}",
        "{% set h, w, s, a, sat, j, lf = ns.r %}",
        "{% set total = weights | sum %}",
        f"{{% for name in {_j(list(ORDER))} %}}{{% if not ns.done %}}"
        "{% set ns.acc = ns.acc + weights[loop.index0] %}"
        "{% if h * total < ns.acc %}{% set ns.h = name %}{% set ns.done = true %}"
        "{% endif %}{% endif %}{% endfor %}",
        f"{{% set wr = {_j({n: list(HARMONIES[n]) for n in ORDER})}[ns.h] %}}",
        "{% set width = wr[0] + w * (wr[1] - wr[0]) %}",
        "{% set start = av1 + s * (360 + av0 - av1 - width) %}",
        "{% set mid = (start + width / 2) % 360 %}",
        f"{{% set cold = {COLD[0]} <= mid and mid <= {COLD[1]} %}}",
        f"{{% set accent = ((({WARM_ACCENT[0]} + a * {WARM_ACCENT[1]}) % 360) if cold "
        f"else ({COLD_ACCENT[0]} + a * {COLD_ACCENT[1]})) %}}",
        "{% set saturation = (s0 + sat * (s1 - s0) + 0.5) | int %}",
        "{% set jitter = (j0 + j * (j1 - j0) + 0.5) | int %}",
        "{% set life = ({'shapes': shapes, 'every': every} "
        "if (shapes and lf * 100 < chance) else none) %}",
        "{% set white = 'neutral' if cold else 'warm' %}",
        "{% set palette = {'harmony': ns.h, 'lo': ((start % 360 + 0.5) | int) % 360, "
        "'hi': (((start + width) % 360 + 0.5) | int) % 360, 'width': (width + 0.5) | int, "
        "'accent': ((accent + 0.5) | int) % 360, 'saturation': saturation, 'white': white, "
        f"'white_kelvin': {k['neutral']} if cold else {k['warm']}, "
        "'curve': curve, 'jitter': jitter, 'alive': alive, "
        "'life': life, 'day': day, 'roll': roll} %}",
    ]
    return "\n".join(lines)


def auto_label(palettes: dict, ui) -> str:
    """The select's word for the day's draw: the rules' own label, else the
    house's language."""
    return palettes["today"].get("label") or getattr(ui, "palette_auto", "Auto")


def options(palettes: dict, ui) -> list[dict]:
    """The select's RENDERED options: the day's draw first, then the file's
    named palettes. The kept stores' names join at runtime (the automation
    « les noms » keeps the select in step with them)."""
    out = [{"id": AUTO, "label": auto_label(palettes, ui)}]
    out += [{"id": pid, "label": p["label"]} for pid, p in palettes["named"].items()]
    return out


def house_plan(house) -> dict:
    """What the pack renders for the house: the chip's rooms, the repaint's
    rooms, the stores and the rules' helpers."""
    chip, repaint = [], []
    for a in house.areas:
        if house.parking(a):
            continue
        plans = house.scene_plan(a)
        looks = [p["id"] for p in plans if p["renders"] and p.get("palette")]
        if looks:
            repaint.append({"room": a["id"], "looks": looks})
        if any(p["id"] == "today" and p["renders"] for p in plans):
            chip.append(a["id"])
    return {
        "chip": chip,
        "repaint": repaint,
        "stores": [{"n": i, "prefix": store_prefix(i)} for i in range(1, keep_of(house) + 1)],
        "store_numbers": STORE_NUMBERS,
        "rules_prefix": RULES_PREFIX,
        "rule_numbers": RULE_NUMBERS,
        "periods": PERIODS,
        "whites": list(house.kelvin()),
        "keep": keep_of(house),
    }


def render_context(house) -> dict:
    """The select's options and the sensor's three templates (state, label,
    palette) — built here, tested here; the pack's template only places them."""
    palettes = house.palettes()
    ui = house.labels.ui
    keep = keep_of(house)
    opts = options(palettes, ui)
    by_label = {o["label"]: o["id"] for o in opts}
    by_id = {o["id"]: o["label"] for o in opts}
    auto = auto_label(palettes, ui)
    turns = palettes["today"]["turns"]
    # the source: a rendered name, else a store whose name matches the select
    head = [
        "{% set sel = states('input_select.house_palette') %}",
        f"{{% set ns_src = namespace(source={_j(by_label)}.get(sel, none)) %}}",
    ]
    for i in range(1, keep + 1):
        head.append(
            f"{{% if ns_src.source is none and sel != '' "
            f"and states('input_text.{store_prefix(i)}_name') == sel %}}"
            f"{{% set ns_src.source = '{STORE}{i}' %}}{{% endif %}}"
        )
    head.append(f"{{% set source = ns_src.source if ns_src.source is not none else '{AUTO}' %}}")
    state = "\n".join(head + ["{{ source }}"])
    label = "\n".join(
        head
        + [
            f"{{{{ {_j(by_id)}.get(source, "
            f"sel if source.startswith('{STORE}') else {_j(auto)}) }}}}"
        ]
    )
    lines = list(head)
    lines.append(
        jinja_day("input_datetime.house_palette_turns", "counter.house_palette_roll", turns)
    )
    first = True
    for pid, p in palettes["named"].items():
        lines.append(f"{{% {'if' if first else 'elif'} source == {_j(pid)} %}}")
        lines.append(
            f"{{% set palette = dict({_j(named_value(p, house.kelvin()))}, day=day, roll=roll) %}}"
        )
        first = False
    for i in range(1, keep + 1):
        lines.append(f"{{% {'if' if first else 'elif'} source == '{STORE}{i}' %}}")
        lines.append(helper_palette_jinja(store_prefix(i), house.kelvin()))
        first = False
    lines.append("{% else %}" if not first else "{% if true %}")
    lines.append(jinja_rules(house.kelvin()))
    lines.append(jinja_body_live(house.palette_salt(), house.kelvin()))
    lines.append("{% endif %}")
    lines.append("{{ palette }}")
    # « Au hasard » on a store: the day's draw from a random seed, into the store
    random_draw = "\n".join(
        [
            # the sandbox refuses a range over 100 000 (read live): the seed is
            # the clock's millisecond, and a small random on top
            f"{{% set day = ((as_timestamp(now()) * 1000) | int) % {M} %}}",
            "{% set roll = range(0, 99999) | random %}",
            jinja_rules(house.kelvin()),
            jinja_body_live(house.palette_salt(), house.kelvin()),
            "{{ palette }}",
        ]
    )
    return {
        "options": opts,
        "state": state,
        "label": label,
        "attr": "\n".join(lines),
        "random": random_draw,
        "house": house_plan(house),
    }
