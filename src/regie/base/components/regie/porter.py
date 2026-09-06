"""The doorman's arithmetic — no Home Assistant import, so the product's own
tests read it as it is (tests/test_porter.py); conversation.py wires it.

Three verdicts on one reading of the ceiling's sensor:

- `delegate`  the host is awake: the turn goes to the LLM's agent
- `wake`      the host sleeps and somebody can be knocked: say so, knock
- `try`       nobody can tell (the sensor unavailable, unknown, absent — or
              no knock declared): ask the LLM anyway, and say a failure as
              what it is. A guard built on a lying probe is disarmed.
"""

from __future__ import annotations

DELEGATE = "delegate"
WAKE = "wake"
TRY = "try"

# the product's lines, in English; a house writes its own (assist.ceiling.replies)
REPLIES = {
    "waking": "I am waking the server — give it two minutes and ask me again.",
    "unknown": "The server does not answer, and I cannot tell whether it sleeps.",
    "absent": "The server is awake but does not answer.",
    "knock_failed": "I could not wake the server.",
    "no_agent": "No assistant is connected to the house yet.",
}


def decide(awake: str | None, can_knock: bool) -> str:
    """The verdict for one reading of the ceiling's sensor (`on`, `off`,
    `unavailable`, `unknown`, or None when there is no sensor)."""
    if awake == "on":
        return DELEGATE
    if awake == "off" and can_knock:
        return WAKE
    return TRY


def pick_agent(spec: str, agents: list[tuple[str, str]]) -> str | None:
    """The agent's entity id: `spec` names one (`conversation.x`) or a platform
    (`ollama`) — then the first conversation entity that platform owns, in
    entity-id order. None when it does not exist (yet)."""
    if "." in spec:
        return spec
    owned = sorted(entity_id for entity_id, platform in agents if platform == spec)
    return owned[0] if owned else None


def line(replies: dict, key: str) -> str:
    """The house's line for a verdict, else the product's."""
    return (replies or {}).get(key) or REPLIES[key]
