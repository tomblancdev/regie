"""The ear's arithmetic (base/components/regie/turns.py) — read as it is,
without Home Assistant: a wheel's notches in, the steps a light follows out.

The rule under all of it: every notch the wheel says is handed on exactly
once — the first at once, the rest at most every THROTTLE seconds, what is
left when the turn completes — and Home Assistant's cap of 8 is nowhere.
"""

import importlib.util
import sys
from pathlib import Path

HERE = Path(__file__).parent.parent / "src" / "regie" / "base" / "components" / "regie"
spec = importlib.util.spec_from_file_location("turns", HERE / "turns.py")
turns = importlib.util.module_from_spec(spec)
sys.modules["turns"] = turns  # a dataclass looks its own module up (Python 3.13)
spec.loader.exec_module(turns)

PRESS, ON, END = turns.INITIAL_PRESS, turns.MULTI_PRESS_ONGOING, turns.MULTI_PRESS_COMPLETE
SHORT_RELEASE, LONG_PRESS = 3, 2
KEY = (0x11, 1)


def spin(notches: int, every: float, g=None):
    """A spin as the wheel says it (read live 2026-09-26/28 in the matter-server's
    log): per notch an InitialPress then — from the second — an ongoing count and
    a release; at the end the total. The throttle's timers are run as the ear
    runs them. Returns the steps handed on, as (time, notches)."""
    g = g or turns.Gatherer()
    events, t = [], 0.0
    for n in range(1, notches + 1):
        events.append((t, PRESS, {"newPosition": 1}))
        if n > 1:
            events.append((t + 0.001, ON, {"currentNumberOfPressesCounted": n}))
        events.append((t + 0.002, SHORT_RELEASE, {"previousPosition": 1}))
        t += every
    events.append((t + 0.4, END, {"totalNumberOfPressesCounted": notches}))
    steps, timer, rounds = [], None, 0
    for at, eid, data in events:
        while timer is not None and timer <= at:
            rounds += 1
            assert rounds < 1000, "a timer that never lands (the float trap, 0.47)"
            n, back = g.flush(KEY, timer)
            if n:
                steps.append((timer, n))
            timer = timer + back if back is not None else None
        n, back = g.feed(KEY, eid, data, at)
        if n:
            steps.append((at, n))
        if back is not None and timer is None:
            timer = at + back
    return steps


def test_a_spin_of_eighteen_is_eighteen_notches_the_first_at_once():
    steps = spin(18, every=0.08)
    assert sum(n for _, n in steps) == 18, "every notch, once — no cap of 8"
    assert steps[0] == (0.0, 1), "the first notch moves the light at once"
    gaps = [b[0] - a[0] for a, b in zip(steps, steps[1:], strict=False)]
    assert all(gap >= turns.THROTTLE - 1e-9 for gap in gaps[:-1]), "never faster than the throttle"
    assert 4 <= len(steps) <= 8, "a spin of 1.4 s is a handful of steps, not eighteen commands"


def test_one_notch_is_one_step_and_the_end_adds_nothing():
    assert spin(1, every=0.08) == [(0.0, 1)]


def test_a_slow_turn_hands_every_notch_as_it_comes():
    steps = spin(4, every=0.5)
    assert [n for _, n in steps] == [1, 1, 1, 1]


def test_a_turn_whose_end_was_lost_does_not_swallow_the_next():
    g = turns.Gatherer()
    assert g.feed(KEY, PRESS, {}, 0.0) == (1, None)
    # no MultiPressComplete ever came; three seconds later a new turn begins
    assert g.feed(KEY, PRESS, {}, 3.0) == (1, None)


def test_what_is_not_a_notch_is_not_heard():
    g = turns.Gatherer()
    assert g.feed(KEY, LONG_PRESS, {}, 0.0) == (0, None)
    assert g.feed(KEY, SHORT_RELEASE, {}, 0.0) == (0, None)
    assert g.turns == {}, "a hold or a release opens no turn"
