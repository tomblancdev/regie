"""The templates and helper seeds La Régie generated until 0.42, frozen as an
ORACLE (0.42 → 0.43).

The palette's draw was written twice for two years — Python for `regie
palette`, and this Jinja for `sensor.house_palette`, kept in step by a test
over ten years of days. The audit's V8a moved the sensor into the component
and left one copy; V8b then moved the day's RULES off their twenty-one helpers
and into a document of the same store. The proof H51 asked for, both times, is
that what stayed says EXACTLY what went said.

So the generators below are the 0.41/0.42 ones, verbatim, never imported by
the product: a reference the suite renders and compares against, so that a
change to the arithmetic that moved cannot pass unnoticed. `rule_seeds` is the
0.42 mapping of the day's rules onto those twenty-one helpers, kept here for
the same reason — the suite seeds the helpers from a rules block, renders the
0.41 sensor that READ them, and holds it against the draw the component now
makes from the document.

They read the constants from the component's own module, which is the point —
the numbers are the same on both sides, only the runtime differs.
"""

from regie import palette as P
from regie.errors import HouseError

M = P.M
A = P.A
DRAWS = P.DRAWS
HARMONIES = P.HARMONIES
ORDER = P.ORDER
COLD = P.COLD
WARM_ACCENT = P.WARM_ACCENT
COLD_ACCENT = P.COLD_ACCENT
KELVIN = {"warm": 2700, "neutral": 4000, "cool": 5500}
PERIODS = P.PERIODS
RULES_PREFIX = "house_palette_today"  # the helpers' prefix until 0.42; gone at 0.43
JITTER_MAX = P.JITTER_MAX
LIFE_EVERY_MIN = P.LIFE_EVERY_MIN
PAL_EXPR = P.PAL_EXPR
salt_of = P.salt_of
free_arc = P.free_arc


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
        f"{{% set start = {av1} + s * ({free_arc(av0, av1)} - width) %}}",
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
        "{% set free = ((av0 - av1) % 360) %}{% if free == 0 %}{% set free = 360 %}{% endif %}",
        "{% set start = av1 + s * (free - width) %}",
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


# --- the day's rules as twenty-one helpers: the 0.42 seeding, verbatim -------------
RULE_NUMBERS = {  # key: (min, max, step, default) — the helpers the render placed
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


def rule_seeds(rules: dict) -> dict:
    """The day's rules as the helpers' values — what the conductor seeded."""
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
    px = RULES_PREFIX
    out = {f"input_number.{px}_weight_{n}": float(w.get(n, 0)) for n in ORDER}
    out.update(
        {
            f"input_number.{px}_avoid_from": float(rules["avoid"][0]),
            f"input_number.{px}_avoid_to": float(rules["avoid"][1]),
            f"input_number.{px}_saturation_min": float(rules["saturation"][0]),
            f"input_number.{px}_saturation_max": float(rules["saturation"][1]),
            f"input_number.{px}_jitter_min": float(jit[0]),
            f"input_number.{px}_jitter_max": float(jit[1]),
            f"input_number.{px}_alive_min": float(a_min),
            f"input_number.{px}_alive_max": float(a_max),
            f"input_boolean.{px}_alive_all": "on" if a_all else "off",
            f"input_text.{px}_shapes": ", ".join(life.get("shapes") or []),
            f"input_number.{px}_every_min": float((life.get("every") or [120, 600])[0]),
            f"input_number.{px}_every_max": float((life.get("every") or [120, 600])[1]),
            f"input_number.{px}_chance": float(life.get("chance", 100) if life else 0),
        }
    )
    for period in PERIODS:
        out[f"input_number.{px}_curve_{period}"] = float(curve.get(period, 100))
    return out
