"""The verbs — what a gesture, a thing's state or a story step may DO, each
rendered to Home Assistant once, per kind of target (the page « One Grammar,
Written Once », 2026-09-04). A `when:` row, a hand and a scenario step all
speak these; none of them spells an action of its own.

0.18: `look` (a look id · default · before · off, on one room or several),
`mode`, `story`. The hands add level, walk, toggle, pin, power, volume, media."""

from __future__ import annotations

from .errors import HouseError

LOOK_WORDS = ("default", "before", "off")


def look_action(room: str, look: str) -> dict:
    """One room takes one look: the look's own script, waited for. `before`
    reads the room's memory (scenes pack, 0.17) — the option may be one the
    room has no script for yet, so that call is allowed to fail."""
    if look == "before":
        return {
            "action": f"script.{room}_{{{{ states('input_select.{room}_look_before') }}}}",
            "continue_on_error": True,
        }
    return {"action": f"script.{room}_{look}"}


def look_actions(look: str, rooms: list[str]) -> list[dict]:
    return [look_action(room, look) for room in rooms]


def mode_actions(mode: str) -> list[dict]:
    return [
        {
            "action": "input_select.select_option",
            "target": {"entity_id": "input_select.house_mode"},
            "data": {"option": mode},
        }
    ]


def story_actions(story: str) -> list[dict]:
    return [{"action": f"script.scenario_{story}"}]


VERBS = ("look", "mode", "story")


def verb_of(row: dict, subject_is_thing: bool) -> str:
    """Which verb a row speaks. `mode` is a verb on a thing's row and the
    SUBJECT of a house row, so a house row may only `look` or `story`."""
    verbs = [v for v in VERBS if v in row and not (v == "mode" and not subject_is_thing)]
    if len(verbs) != 1:
        raise HouseError(f"a row says {len(verbs)} verb(s) — exactly one of {', '.join(VERBS)}")
    return verbs[0]


def actions(row: dict, rooms: list[str], subject_is_thing: bool = True) -> list[dict]:
    verb = verb_of(row, subject_is_thing)
    if verb == "look":
        return look_actions(row["look"], rooms)
    if verb == "mode":
        return mode_actions(row["mode"])
    return story_actions(row["story"])
