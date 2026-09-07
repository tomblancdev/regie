"""The palette's arithmetic — written once, run on both sides (0.42, V8a).

A palette is a VALUE with four optional parts: colours (one arc of the hue
circle that never crosses the yellow-green quarter, one accent from the far
side, a saturation, a white word), level (a curve over the house's periods
and a jitter), alive (how many candidate bulbs roam), life (fx now and then).
A named palette gives numbers; `today` gives RULES, and the day draws within
them — a pure function of (day, roll, salt): nothing stored, a restart
changes nothing, Christmas printed in advance.

This module is the component's, and it is the ONLY copy. Until 0.41 the draw
lived twice — here in Python for `regie palette`, and in a 200-line Jinja
template the engine generated so that the sensor could agree with it, kept in
step by a test. The sensor is the component's now (palettes.py), so the draw
is read from this file on both sides: the brain imports it as a module of its
own component, the engine by path (`regie.component`). It imports nothing —
not Home Assistant, not the engine — precisely so that both can.

`int(x + 0.5)` where a number is rounded, never `round`: Python's is banker's.
"""

from __future__ import annotations

import datetime as dt

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
KELVIN = {"warm": 2700, "neutral": 4000, "cool": 5500}  # the house's white words (fx.kelvin)
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
PERIODS = ("morning", "day", "evening", "night")
# the day's rules as helpers, the family's since 0.24 (V8b moves them to the
# store); the sensor reads them at every draw, so their names live here
RULES_PREFIX = "house_palette_today"
TURNS_ENTITY = "input_datetime.house_palette_turns"
SELECT_ENTITY = "input_select.house_palette"
ROLL_ENTITY = "counter.house_palette_roll"
SENSOR = "sensor.house_palette"


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
    h, m = turns.split(":")[:2]
    if tz is not None:
        when = when.astimezone(tz)
    offset = when.utcoffset()
    local = when.timestamp() + (offset.total_seconds() if offset else 0)
    return int((local - int(h) * 3600 - int(m) * 60) // 86400)


def free_arc(av0: float, av1: float) -> float:
    """What the avoided arc leaves: from its end clockwise to its start — the
    avoided arc may wrap through 0° (Tom, on the ring: 300° through 0° to
    180°); nothing avoided when both ends meet."""
    return (av0 - av1) % 360 or 360


def in_arc(h: float, av0: float, av1: float) -> bool:
    """Is a hue strictly inside the arc from av0 clockwise to av1 (wrapping)?
    The ends belong to the free side: a drawn arc may end where the avoided
    one starts."""
    return 0 < (h - av0) % 360 < (av1 - av0) % 360


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


def draw(day: int, roll: int, salt: int, rules: dict, kelvin: dict | None = None) -> dict:
    """Today's palette from the rules — the one draw, on both sides."""
    k = kelvin or KELVIN
    h, w, s, a, sat, j, lf = _draws(day, roll, salt)
    harmony = _pick(h, rules["harmonies"])
    w0, w1 = HARMONIES[harmony]
    width = w0 + w * (w1 - w0)
    av0, av1 = rules["avoid"]
    start = av1 + s * (free_arc(av0, av1) - width)
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
        "white_kelvin": k[white],
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
    """A palette with NUMBERS as the sensor carries it — a palette named in the
    file, or one kept in the store: both spell themselves the same way, so
    both read out through here (the same keys as a draw)."""
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
        "white_kelvin": k.get(p.get("white", "warm"), k.get("warm", KELVIN["warm"])),
        "curve": level.get("curve"),
        "jitter": level.get("jitter", 0),
        "alive": p.get("alive"),
        "life": p.get("life"),
    }


# --- the room's own draws ---------------------------------------------------------
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


# --- the sensor's value: what the select names, and what it is -----------------------
def option_labels(auto: str, named: dict, docs: dict) -> list[str]:
    """The select's options, in the order the family reads them: the day's
    draw, then the file's palettes, then the kept ones. A name said twice is
    said once (the first wins — a kept palette never steals a rendered name)."""
    out: list[str] = []
    for label in (
        [auto]
        + [(p or {}).get("label") or pid for pid, p in named.items()]
        + [(d or {}).get("label") or pid for pid, d in docs.items()]
    ):
        if label and label not in out:
            out.append(label)
    return out


def source_of(selected: str, auto: str, named: dict, docs: dict) -> str:
    """Which source the select's word names — the day's draw when it names
    nothing we know (a name that just went, an option lost at a restart)."""
    by_label: dict[str, str] = {auto: AUTO}
    for pid, p in named.items():
        by_label.setdefault((p or {}).get("label") or pid, pid)
    for pid, d in docs.items():
        by_label.setdefault((d or {}).get("label") or pid, pid)
    return by_label.get(selected, AUTO)


def label_of(source: str, auto: str, named: dict, docs: dict) -> str:
    if source in named:
        return (named[source] or {}).get("label") or source
    if source in docs:
        return (docs[source] or {}).get("label") or source
    return auto


def value(
    source: str,
    day: int,
    roll: int,
    salt: int,
    rules: dict,
    named: dict,
    docs: dict,
    rooms: list[dict],
    auto: str = "Auto",
    kelvin: dict | None = None,
) -> tuple[str, dict]:
    """The sensor's state and attributes — the whole of what
    `sensor.house_palette` says, computed from numbers alone. The state is the
    SOURCE, and the attributes are the palette, the word the select shows, and
    every room's own draws for the day. A palette with numbers (the file's or a
    kept one) carries the day and the roll all the same: a look reads them off
    the same dict whichever source is in force."""
    k = kelvin or KELVIN
    if source in named:
        pal = {**named_value(named[source], k), "day": day, "roll": roll}
    elif source in docs:
        pal = {**named_value(docs[source], k), "day": day, "roll": roll}
    else:
        source = AUTO
        pal = draw(day, roll, salt, rules, k)
    out = {}
    for r in rooms:
        if r.get("source", AUTO) == AUTO:
            base = pal
        elif r["source"] in named:
            base = named_value(named[r["source"]], k)
        else:
            continue  # a look reading a palette the file no longer names
        out[r["key"]] = room_draw(
            day,
            roll,
            salt,
            r["room"],
            base.get("alive"),
            int(r.get("candidates") or 0),
            int(r.get("targets") or 0),
            float(base.get("jitter") or 0),
        )
    return source, {
        "label": label_of(source, auto, named, docs),
        "palette": pal,
        "rooms": out,
    }


# --- a kept palette: its name, and the form the two sides compare under -------------
def slug(name: str) -> str:
    out = "".join(c.lower() if c.isalnum() else "_" for c in name.strip())
    while "__" in out:
        out = out.replace("__", "_")
    out = out.strip("_") or "palette"
    return out if out[0].isalpha() else "p_" + out


def store_normal(p: dict | None) -> dict | None:
    """A palette as a store spells it, whichever side wrote it — the file's
    named palette and the phone's document compare under this form."""
    if not p:
        return None
    lo, hi = p["band"]
    level = p.get("level") or {}
    curve = level.get("curve") or {}
    jitter = level.get("jitter", 0)
    if isinstance(jitter, list):
        jitter = jitter[-1] if jitter else 0
    alive = p.get("alive")
    life = p.get("life") or {}
    return {
        "label": p.get("label"),
        "band": [int(lo) % 360, int(hi) % 360],
        "accent": int(p["accent"]) if p.get("accent") is not None else 30,
        "saturation": int(p.get("saturation", 100)),
        "white": p.get("white", "warm"),
        "curve": {per: int(curve.get(per, 100)) for per in PERIODS},
        "jitter": int(jitter),
        "alive": "all" if alive == "all" else (int(alive) if alive else 0),
        "life": (
            {
                "shapes": list(life.get("shapes") or []),
                "every": [int(x) for x in (life.get("every") or [120, 600])],
            }
            if life.get("shapes")
            else None
        ),
    }


def store_clean(raw: dict | None) -> dict:
    """What the store keeps of what the phone sent: a document in the FILE's
    own shape (`band`, `level`, `alive`, `life`), so that `regie pull` writes
    it into `fx.yml` as it stands and the sensor reads it through
    `named_value`. Anything else the card sends is dropped here — a store is
    the house's grammar, not a scratch pad."""
    raw = dict(raw or {})
    n = store_normal({**raw, "band": raw.get("band") or [0, 120]})
    out: dict = {
        "label": str(n["label"] or "").strip() or "palette",
        "band": n["band"],
        "accent": n["accent"],
        "saturation": max(0, min(100, n["saturation"])),
        "white": n["white"] if n["white"] in WHITES else "warm",
    }
    level: dict = {}
    if any(v != 100 for v in n["curve"].values()):
        level["curve"] = n["curve"]
    if n["jitter"]:
        level["jitter"] = max(0, min(JITTER_MAX, n["jitter"]))
    if level:
        out["level"] = level
    if n["alive"]:
        out["alive"] = n["alive"]
    if n["life"]:
        every = sorted(max(LIFE_EVERY_MIN, int(x)) for x in n["life"]["every"])
        out["life"] = {"shapes": n["life"]["shapes"], "every": every}
    return out


# --- the day's rules, as the family holds them on the phone -------------------------
RULE_NUMBERS = {  # the day's rules as helpers, seeded from fx.yml; key: (min, max, step, default)
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


def rules_entities() -> list[str]:
    """Every helper `rules_from_helpers` reads — the sensor watches exactly
    this list, and the engine renders exactly it: one grammar, written once."""
    px = RULES_PREFIX
    return (
        [f"input_number.{px}_{k}" for k in RULE_NUMBERS]
        + [f"input_boolean.{px}_alive_all", f"input_text.{px}_shapes"]
        + [TURNS_ENTITY]
    )


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
    turns = _txt(read, TURNS_ENTITY)[:5] or file_rules["turns"]
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
