"""The walker's arithmetic (base/components/regie/walk.py) — read as it is,
without Home Assistant: the legs of a cycle, the one order each of them is, and
the two ways a Zigbee bulb is told to move.

The rule under all of it: the hue is a function of the CLOCK, never a stored
position. Every test below asks the same question twice at two times and expects
the answers to agree with `hue_at`, which is the look's own recall in Python.
"""

import importlib.util
import sys
from pathlib import Path

HERE = Path(__file__).parent.parent / "src" / "regie" / "base" / "components" / "regie"
spec = importlib.util.spec_from_file_location("walk", HERE / "walk.py")
walk = importlib.util.module_from_spec(spec)
# a module loaded by PATH must be in sys.modules before it runs: `dataclass`
# looks its own module up while it builds the class (Python 3.13), and a
# missing entry throws where the class is declared
sys.modules["walk"] = walk
spec.loader.exec_module(walk)


def test_the_cycle_is_two_legs_up_and_down():
    ls = walk.legs(190, 140)
    assert [(leg.x0, leg.x1, leg.start, leg.end) for leg in ls] == [
        (0.0, 0.5, 190, 330),
        (0.5, 1.0, 330, 190),
    ]
    assert ls[0].up and not ls[1].up
    assert not any(leg.hold for leg in ls)


def test_an_accent_adds_a_hold_and_shortens_the_two_arcs():
    ls = walk.legs(190, 140, accent=45)
    assert [(round(leg.x0, 3), round(leg.x1, 3)) for leg in ls] == [
        (0.0, 0.4),
        (0.4, 0.8),
        (0.8, 1.0),
    ]
    assert ls[-1].hold and ls[-1].end == 45
    # the dwell is the palette's own constant: a fifth of every cycle
    assert round(ls[-1].x1 - ls[-1].x0, 6) == walk.ACCENT_DWELL


def test_a_band_wider_than_the_span_is_cut_into_equal_orders():
    """One order may not travel more than half the circle: `moveToHue` needs an
    unambiguous direction, and a band of 360° would ask a hue of itself."""
    ls = walk.legs(0, 360)
    rising = [leg for leg in ls if leg.up]
    assert len(rising) == 3, "360° at a span of 170 is three orders each way"
    assert [round(leg.end - leg.start, 6) for leg in rising] == [120.0, 120.0, 120.0]
    assert rising[0].start == 0 and rising[-1].end == 360
    assert all(abs(leg.end - leg.start) <= walk.SPAN for leg in ls)


def test_the_legs_agree_with_the_hue_the_clock_asks_for():
    """The legs are a re-reading of `hue_template`, not a second design: at any
    moment the leg's own line through (x0, start) → (x1, end) must land where
    the look's recall would."""
    for accent in (None, 45.0):
        ls = walk.legs(190, 140, accent)
        for leg in ls:
            for f in (0.0, 0.25, 0.5, 0.75):
                x = leg.x0 + (leg.x1 - leg.x0) * f
                here = leg.start + (leg.end - leg.start) * (0 if leg.hold else f)
                assert round(here % 360, 6) == round(walk.hue_at(x, 190, 140, accent), 6)


def test_one_order_carries_the_leg_and_says_when_to_speak_again():
    order = walk.order_at(0, 120, 0.0, 190, 140)
    assert (order.hue, order.seconds, order.wait) == (330.0, 60.0, 60.0)
    assert order.travel and order.up and order.degrees == 140.0
    # half way through, the same leg, re-anchored: the END and the time LEFT —
    # this is what a restart and an `on` report get, and why nothing is stored
    order = walk.order_at(30, 120, 0.0, 190, 140)
    assert (order.hue, order.seconds, order.wait, order.degrees) == (330.0, 30.0, 30.0, 70.0)
    # the way back is one order too, downwards
    order = walk.order_at(60, 120, 0.0, 190, 140)
    assert (order.hue, order.seconds, order.up) == (190.0, 60.0, False)


def test_a_walker_speaks_four_times_a_cycle_where_it_painted_fifty():
    """Kowloon's own numbers: a 120 s cycle at 2.5 s a step is 48 commands; the
    legs are two, and an accent adds the two approaches its jumps need."""
    said = []
    now, until = 0.0, 120.0
    while now < until:
        order = walk.order_at(now, 120, 0.0, 190, 140)
        if order.hue is not None:
            said.append(order.hue)
        now += max(order.wait, 0.05)
    assert len(said) == 2
    said = []
    now = 0.0
    while now < until:
        order = walk.order_at(now, 120, 0.0, 190, 140, accent=45)
        if order.hue is not None:
            said.append(round(order.hue, 1))
        now += max(order.wait, 0.05)
    assert said == [190.0, 330.0, 190.0, 45.0], (
        "the rise opens by snapping back from the accent, and the dwell is reached once"
    )


def test_a_discontinuous_leg_opens_with_an_approach_and_a_smooth_one_does_not():
    # the accent's own leg: the hue JUMPS there, so the leg opens with a short
    # order to its start — the walk keeps the shape the look drew
    order = walk.order_at(96, 120, 0.0, 190, 140, accent=45)
    assert (order.hue, order.seconds, order.travel) == (45.0, 2.5, False)
    # and once reached, nothing more is said until the leg ends
    order = walk.order_at(100, 120, 0.0, 190, 140, accent=45)
    assert order.hue is None and round(order.wait, 6) == 20.0
    # a leg that continues where the one before it ended says its end at once
    assert walk.order_at(60, 120, 0.0, 190, 140).travel


def test_the_move_order_re_anchors_every_leg_and_takes_a_whole_rate():
    """The GU10's fallback: `moveHue` carries a rate, not an endpoint, so each
    leg is re-anchored first or its error accumulates."""
    approach = walk.order_at(0, 120, 0.0, 190, 140, anchor=True)
    assert (approach.hue, approach.travel) == (190.0, False)
    order = walk.order_at(3, 120, 0.0, 190, 140, anchor=True)
    assert order.travel and order.up
    # 140° in 57 s is 2.45°/s; the bulb's unit is 1.417°, so a rate of 2
    assert walk.rate_of(order) == 2
    assert walk.rate_of(walk.order_at(0, 60, 0.0, 0, 180)) == 4


def test_the_slowest_rung_is_the_loop_it_always_was():
    order = walk.step_order(0, 120, 0.0, 190, 140, step=2.5)
    assert order.wait == 2.5 and order.seconds == 2.5 and not order.travel
    assert round(order.hue, 4) == round(walk.hue_at(2.5 / 120, 190, 140), 4), (
        "the hue asked for is the one the clock will want a step from now"
    )


def test_the_hue_register_is_the_bulbs_own_254_units():
    assert walk.zcl_hue(0) == 0
    assert walk.zcl_hue(360) == 0, "the circle closes"
    assert walk.zcl_hue(180) == 127
    assert 0 <= walk.zcl_hue(359.9) < 254


def test_only_a_hand_s_off_ends_a_walk():
    """0.25.5's rule, read again after it cost a walk: every bulb OFF ends the
    walk — and `unavailable` is not off. Live 2026-09-07 13:46:47, a restart
    put every walker `unavailable` for 35 s and the walk turned its own switch
    out; the same reading killed a walk at its look's start, the bulbs' states
    not yet caught up with the paint."""
    assert walk.ended(["off", "off", "off"])
    assert not walk.ended(["off", "on", "off"])
    assert not walk.ended(["unavailable", "unavailable", "unavailable"])
    assert not walk.ended(["unknown", "off"])
    assert not walk.ended([]), "a walk with no walker has nothing to end"


def test_a_bulb_that_narrates_its_movement_is_stepped_not_ramped():
    """0.41, measured on a Govee H6008: the same 140° over the same 50 s cost
    91 state changes as ONE order with a 50 s transition, and 20 as twenty
    orders of 7° with no transition — one report per order, 4.5x cheaper. A
    Matter bulb reports every ~1.5° it moves, and every one of those rows holds
    the word `on` and nothing else, because the light domain keeps no colour.
    So it is not asked to move: it is stepped, and it does not get a
    transition. A Zigbee bulb turns in silence and keeps its leg."""
    assert walk.stepped("matter") and walk.stepped("ha")
    assert not walk.stepped("zigbee"), "a TRÅDFRI reports nothing while it turns"
    # only Matter is asked to JUMP: the ramp is what it narrates. Anything else
    # keeps the transition the loop always had — a bulb with no firmware ramp
    # of its own needs it to look like movement
    assert not walk.ramps("matter")
    assert walk.ramps("ha") and walk.ramps("zigbee")
