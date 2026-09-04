"""The verbs — what a gesture, a thing's state or a story step may DO, each
rendered to Home Assistant once, per kind of target (the page « One Grammar,
Written Once », 2026-09-04). A `when:` row, a hand and a scenario step all
speak these; none of them spells an action of its own.

0.18: `look` (a look id · default · before · off, one room or several),
`mode`, `story`. 0.19 (the hands): `prev`/`next` and a list to cycle for
`look`, `rooms: all`, `toggle`, `level`, `walk`, `pin`, `power`, `volume`,
`media`, `say` (a hint until the stories), and `then:` — a second verb after."""

from __future__ import annotations

import json
from dataclasses import dataclass, field

from .errors import HouseError

LOOK_WORDS = ("default", "before", "off", "prev", "next")
VERBS = (
    "look",
    "toggle",
    "level",
    "walk",
    "mode",
    "story",
    "pin",
    "power",
    "volume",
    "media",
    "say",
)
MEDIA = {
    "play_pause": "media_play_pause",
    "stop": "media_stop",
    "next": "media_next_track",
    "prev": "media_previous_track",
}
MEDIA_KINDS = ("speaker", "cast", "tv", "receiver")
KELVIN_WARM, KELVIN_COOL, KELVIN_STEP = 2700, 5500, 300
HELD_STEPS, HELD_LEVEL_PCT, NOTCH_PCT = 40, 10, 5


@dataclass
class Ctx:
    """What a verb renders against: the house, the room it speaks from, and
    for a wheel's notch the count `k` (a template) and the direction."""

    house: object
    room: str
    k: str | None = None
    sign: int = 1
    modifiers: dict = field(default_factory=dict)


def look_action(room: str, look, ctx: Ctx | None = None) -> dict:
    """One room takes one look: the look's own script, waited for. `before`
    reads the room's memory (0.17); `prev`/`next` walk the room's looks in the
    file's order from the memory; a LIST cycles through those looks."""
    if look == "before":
        return {
            "action": f"script.{room}_{{{{ states('input_select.{room}_look_before') }}}}",
            "continue_on_error": True,
        }
    if look in ("prev", "next") or isinstance(look, list):
        looks = look if isinstance(look, list) else room_looks(ctx.house, room)
        step = -1 if look == "prev" else 1
        names = json.dumps(list(looks)).replace('"', "'")
        expr = (
            f"{{% set looks = {names} %}}{{% set cur = states('input_select.{room}_look') %}}"
            f"{{% set i = looks.index(cur) if cur in looks else -1 %}}"
            f"{{{{ looks[(i + {step}) % (looks | length)] }}}}"
        )
        return {"action": f"script.{room}_{expr}", "continue_on_error": True}
    return {"action": f"script.{room}_{look}"}


def room_looks(house, room: str) -> list[str]:
    area = next(a for a in house.areas if a["id"] == room)
    return [p["id"] for p in house.scene_plan(area) if p["renders"] and not p["implicit"]]


def rooms_of(ctx: Ctx, verb: dict, look=None) -> list[str]:
    """Which rooms a verb aims at: `room:`, `rooms:` (a list, or `all` = every
    room that has the look), else the room the verb speaks from."""
    if "room" in verb:
        return [verb["room"]]
    rooms = verb.get("rooms")
    if rooms == "all":
        out = []
        for a in ctx.house.areas:
            if ctx.house.parking(a):
                continue
            if look in (None, "default", "before", "off", "prev", "next") or look in (
                a.get("scenes") or {}
            ):
                if ctx.house.scene_plan(a):
                    out.append(a["id"])
        return out
    return list(rooms) if rooms else [ctx.room]


def target_of(ctx: Ctx, verb: dict) -> str | None:
    """The light a `level`/`walk` moves: a role's group, a thing's own light,
    else the room's whole group. None = the role is filled by nothing yet."""
    house = ctx.house
    if "thing" in verb:
        return house.entity(house.thing(verb["thing"]))
    room = verb.get("room", ctx.room)
    if "role" in verb:
        filled = house.roles_in(room).get(verb["role"])
        if not filled:
            return None
        return f"light.{room}_{verb['role']}"
    return f"light.{room}_lights"


def is_zigbee(ctx: Ctx, target: str) -> bool:
    """A Zigbee target takes ~2 s to LAND a colour (H42-r): the walk waits."""
    house = ctx.house
    for t in house.things:
        if t.get("via") == "zigbee" and house.entity(t) == target:
            return True
    room = target.split(".", 1)[1]
    for a in house.areas:
        if room.startswith(a["id"] + "_"):
            for t in house.things_in(a["id"]):
                if t["kind"] == "light" and t.get("via") == "zigbee":
                    return True
    return False


def render(verb: dict, ctx: Ctx) -> list[dict]:
    """A verb dict to HA actions. Exactly one of VERBS must be present; a
    `then:` renders after it."""
    names = [v for v in VERBS if v in verb]
    if len(names) != 1:
        raise HouseError(f"says {len(names)} verb(s) — exactly one of {', '.join(VERBS)}")
    name = names[0]
    out = RENDER[name](verb, ctx)
    if verb.get("then"):
        out += render(verb["then"], ctx)
    return out


def _look(verb: dict, ctx: Ctx) -> list[dict]:
    look = verb["look"]
    return [look_action(room, look, ctx) for room in rooms_of(ctx, verb, look)]


def _toggle(verb: dict, ctx: Ctx) -> list[dict]:
    """The look if the room is off, else off. On a role or a thing: `true`
    flips that light alone (the stars at the bed); a look word lights the room's
    look when the light is off, and switches that light alone off otherwise (a
    wheel's click: the chandelier at the look of the hour, or off)."""
    look = verb["toggle"]
    room = verb.get("room", ctx.room)
    if "role" in verb or "thing" in verb:
        target = target_of(ctx, verb)
        if target is None:
            return []
        if look is True:
            return [{"action": "light.toggle", "target": {"entity_id": target}}]
        return [
            {
                "if": [{"condition": "state", "entity_id": target, "state": "off"}],
                "then": [look_action(room, look, ctx)],
                "else": [{"action": "light.turn_off", "target": {"entity_id": target}}],
            }
        ]
    look = "default" if look is True else look
    return [
        {
            "if": [{"condition": "state", "entity_id": f"light.{room}_lights", "state": "off"}],
            "then": [look_action(room, look, ctx)],
            "else": [look_action(room, "off", ctx)],
        }
    ]


def _level(verb: dict, ctx: Ctx) -> list[dict]:
    """`up`/`down` while held: steps until the next gesture ends the loop;
    `step`: a wheel's notch, `k` notches at once."""
    target = target_of(ctx, verb)
    if target is None:
        return []
    how = verb["level"]
    if how == "step":
        pct = f"{{{{ {ctx.sign * NOTCH_PCT} * ({ctx.k or 1}) }}}}"
        return [
            {
                "action": "light.turn_on",
                "target": {"entity_id": target},
                "data": {"brightness_step_pct": pct},
            }
        ]
    pct = HELD_LEVEL_PCT if how == "up" else -HELD_LEVEL_PCT
    return [
        {
            "repeat": {
                "count": HELD_STEPS,
                "sequence": [
                    {
                        "action": "light.turn_on",
                        "target": {"entity_id": target},
                        "data": {"brightness_step_pct": pct},
                    },
                    {"delay": {"milliseconds": 500}},
                ],
            }
        }
    ]


def _walk(verb: dict, ctx: Ctx) -> list[dict]:
    """The whites from warm to cool (and round again), or the colours around
    the wheel, a step at a time while held; release keeps. A step every 2 s on
    Zigbee — the measured floor (H42-r) — and never a level with it."""
    target = target_of(ctx, verb)
    if target is None:
        return []
    axis = verb["walk"]
    every = 2.0 if is_zigbee(ctx, target) else 0.7
    if axis == "whites":
        expr = (
            f"{{% set k = state_attr('{target}', 'color_temp_kelvin') | int({KELVIN_WARM}) %}}"
            f"{{{{ {KELVIN_WARM} if k >= {KELVIN_COOL - KELVIN_STEP} else k + {KELVIN_STEP} }}}}"
        )
        data = {"color_temp_kelvin": expr, "transition": every}
    else:
        hue = (
            f"{{{{ (((state_attr('{target}', 'hs_color') or [0, 100])[0] | float) + 20) % 360 }}}}"
        )
        data = {"hs_color": [hue, 100], "transition": every}
    return [
        {
            "repeat": {
                "count": 30,
                "sequence": [
                    {"action": "light.turn_on", "target": {"entity_id": target}, "data": data},
                    {"delay": {"milliseconds": int(every * 1000)}},
                ],
            }
        }
    ]


def _mode(verb: dict, ctx: Ctx) -> list[dict]:
    return [
        {
            "action": "input_select.select_option",
            "target": {"entity_id": "input_select.house_mode"},
            "data": {"option": verb["mode"]},
        }
    ]


def _story(verb: dict, ctx: Ctx) -> list[dict]:
    return [{"action": f"script.scenario_{verb['story']}"}]


def _pin(verb: dict, ctx: Ctx) -> list[dict]:
    room = verb.get("room", ctx.room)
    return [
        {"action": "input_boolean.turn_on", "target": {"entity_id": f"input_boolean.{room}_pinned"}}
    ]


def _power(verb: dict, ctx: Ctx) -> list[dict]:
    """`power: off` on every thing of `kinds:` that has a player: the deep off."""
    kinds = verb.get("kinds") or list(MEDIA_KINDS)
    players = []
    for t in ctx.house.things:
        e = ctx.house.entity(t)
        if t["kind"] in kinds and e and e.startswith("media_player."):
            players.append(e)
    if not players:
        return []
    return [{"action": "media_player.turn_off", "target": {"entity_id": players}}]


def _media_target(ctx: Ctx, verb: dict) -> str | None:
    if "thing" in verb:
        return ctx.house.entity(ctx.house.thing(verb["thing"]))
    return None


def _volume(verb: dict, ctx: Ctx) -> list[dict]:
    target = _media_target(ctx, verb)
    if not target:
        return []
    service = "media_player.volume_up" if ctx.sign > 0 else "media_player.volume_down"
    return [
        {
            "repeat": {
                "count": f"{{{{ {ctx.k or 1} }}}}",
                "sequence": [{"action": service, "target": {"entity_id": target}}],
            }
        }
    ]


def _media(verb: dict, ctx: Ctx) -> list[dict]:
    target = _media_target(ctx, verb)
    if not target:
        return []
    return [{"action": f"media_player.{MEDIA[verb['media']]}", "target": {"entity_id": target}}]


def _say(verb: dict, ctx: Ctx) -> list[dict]:
    return []  # the stories session: a hint from check until then


RENDER = {
    "look": _look,
    "toggle": _toggle,
    "level": _level,
    "walk": _walk,
    "mode": _mode,
    "story": _story,
    "pin": _pin,
    "power": _power,
    "volume": _volume,
    "media": _media,
    "say": _say,
}


# --- the 0.18 surface, kept for the when pack ---------------------------------
def verb_of(row: dict, subject_is_thing: bool) -> str:
    """Which verb a `when:` row speaks. `mode` is a verb on a thing's row and
    the SUBJECT of a house row, so a house row may only `look` or `story`."""
    verbs = [
        v
        for v in ("look", "mode", "story")
        if v in row and not (v == "mode" and not subject_is_thing)
    ]
    if len(verbs) != 1:
        raise HouseError(f"a row says {len(verbs)} verb(s) — exactly one of look, mode, story")
    return verbs[0]


def actions(row: dict, rooms: list[str], subject_is_thing: bool = True) -> list[dict]:
    verb = verb_of(row, subject_is_thing)
    if verb == "look":
        return [look_action(room, row["look"]) for room in rooms]
    if verb == "mode":
        return _mode(row, None)
    return _story(row, None)
