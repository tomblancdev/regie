"""The walker's arithmetic — no Home Assistant import, so the product's own
tests read it as it is (tests/test_walk.py); walker.py wires it.

A walk is a sequence of LEGS, and each leg is ONE order to the bulb (H51,
2026-09-07). The hue stays what it has always been — a triangle wave of the
CLOCK, never a stored position — so nothing here accumulates and a brain that
restarts mid-stride picks the leg up where the time says. What changes is who
does the sliding: the bulb, asked once per leg, instead of the brain painting
a colour every 2.5 s.

The bench that allows it (three bulbs, 2026-09-07 12:00–12:12 UTC, the page
« L'Ampoule marche seule »): a TRÅDFRI takes `moveToHue` with a `transtime`
and lands the exact hue, reports nothing while it turns, and STOPS on an off
or on a level command; a Govee over Matter takes `light.turn_on` with a
`transition`, ignores a level, and keeps ramping through an off.

One cycle, in the clock's own fraction x (0 → 1):

    no accent   [0, ½) rises lo → lo+width      [½, 1) falls back to lo
    an accent   [0, .4) rises   [.4, .8) falls   [.8, 1) HOLDS on the accent

An arc wider than `SPAN` is cut into equal sub-legs: one order may not travel
more than half the circle (`moveToHue` needs an unambiguous direction, and a
Matter transition takes the short way round whatever we meant), and a band of
360° would otherwise ask the bulb to go from a hue to itself.

`order_at` is the whole of it: given the clock it answers ONE order and when
to ask again. Called at a leg's boundary it opens the leg; called anywhere
else — a restart, a bulb that came back on, a hand that dimmed — it re-anchors
the leg from wherever the bulb now is, over the time the leg has left.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import ceil

ACCENT_DWELL = 0.2  # the part of a cycle spent on the accent (palette.py's constant)
SPAN = 170.0  # the widest travel one order covers, in degrees
FLOOR = 0.5  # the shortest order we bother sending, in seconds


@dataclass(frozen=True)
class Leg:
    """One order's worth of a cycle: from `x0` to `x1` of the clock's fraction,
    carrying the hue from `start` to `end`. `start == end` is the accent's
    hold — the bulb is asked once and left alone."""

    x0: float
    x1: float
    start: float
    end: float

    @property
    def hold(self) -> bool:
        return self.start == self.end

    @property
    def up(self) -> bool:
        return self.end > self.start


@dataclass(frozen=True)
class Order:
    """What the walker says now, and when it must speak again.

    `hue` None = nothing to send (the accent's hold, already reached): only
    wait. `travel` marks a leg's own movement — the move-order backend sends a
    rate for it and a plain ramp for anything else (an approach) — and
    `degrees` is how far that movement still has to go, which is what a rate is
    computed from. `up` is the direction, None when the shortest way is meant
    (an approach may cross the band any way it likes)."""

    hue: float | None
    seconds: float
    wait: float
    travel: bool
    up: bool | None
    degrees: float = 0.0


def hue_at(x: float, lo: float, width: float, accent: float | None = None) -> float:
    """The hue the clock's fraction `x` asks for — house.py's `hue_template`,
    in Python. Kept because the legs must agree with the look's own recall."""
    x %= 1
    if accent is None:
        t = 2 * x if x < 0.5 else 2 * (1 - x)
        return (lo + width * t) % 360
    keep = 1 - ACCENT_DWELL
    if x >= keep:
        return accent % 360
    y = x / keep
    t = 2 * y if y < 0.5 else 2 * (1 - y)
    return (lo + width * t) % 360


def legs(lo: float, width: float, accent: float | None = None, span: float = SPAN) -> list[Leg]:
    """One cycle cut into orders. The hues are NOT reduced modulo 360: a leg
    keeps the unwrapped arithmetic so its direction is unambiguous; the caller
    reduces the endpoint it sends."""
    keep = 1 - ACCENT_DWELL
    arcs = (
        [(0.0, 0.5, lo, lo + width), (0.5, 1.0, lo + width, lo)]
        if accent is None
        else [
            (0.0, keep / 2, lo, lo + width),
            (keep / 2, keep, lo + width, lo),
            (keep, 1.0, accent, accent),
        ]
    )
    out: list[Leg] = []
    for x0, x1, h0, h1 in arcs:
        if h0 == h1:
            out.append(Leg(x0, x1, h0, h1))
            continue
        n = max(1, ceil(abs(h1 - h0) / span))
        for k in range(n):
            out.append(
                Leg(
                    x0 + (x1 - x0) * k / n,
                    x0 + (x1 - x0) * (k + 1) / n,
                    h0 + (h1 - h0) * k / n,
                    h0 + (h1 - h0) * (k + 1) / n,
                )
            )
    return out


def leg_at(now: float, period: float, phase: float, ls: list[Leg]) -> tuple[Leg, Leg, float, float]:
    """The leg the clock is in, the one before it, how long the clock has been
    inside it and how long it has left — all in seconds."""
    x = ((now / period) + phase) % 1
    for i, leg in enumerate(ls):
        if leg.x0 <= x < leg.x1:
            return leg, ls[i - 1], (x - leg.x0) * period, (leg.x1 - x) * period
    # x is exactly 1 by a rounding: the cycle's last leg, at its very end
    return ls[-1], ls[-2], (x - ls[-1].x0) * period, 0.0


def order_at(
    now: float,
    period: float,
    phase: float,
    lo: float,
    width: float,
    accent: float | None = None,
    span: float = SPAN,
    step: float = 2.5,
    anchor: bool = False,
) -> Order:
    """The one order to send now, and the seconds until the next.

    A leg whose start is not where the leg before it ended — the snap back from
    the accent, and the accent itself — opens with an APPROACH: a short order to
    the leg's own start, so the walk keeps the shape the look's recall drew
    rather than sliding across the band from wherever it was. `anchor` asks for
    that approach on every leg: the move order carries a rate, not an endpoint,
    so it must be re-anchored at each leg or its error accumulates.

    Anywhere else in a leg the answer is the leg's END over the time it has
    left: that is the re-anchor a restart, an `on` report or a dim gets, and it
    is why nothing needs to be stored between two orders."""
    ls = legs(lo, width, accent, span)
    leg, before, since, left = leg_at(now, period, phase, ls)
    approach = leg.start != before.end or anchor
    if approach and since + 1e-3 < step:
        seconds = min(step, left) if left > 0 else step
        return Order(leg.start % 360, max(seconds, FLOOR), seconds, False, None)
    if leg.hold:
        return Order(None, 0.0, left, False, None)
    # the travel still owed: from where the clock says the leg has reached to
    # its end — the same number as the whole leg's when the leg is opening, and
    # the right one when this is a re-anchor part way through
    here = leg.start + (leg.end - leg.start) * (since / (since + left) if since + left else 0.0)
    return Order(leg.end % 360, max(left, FLOOR), left, True, leg.up, leg.end - here)


# THE BACKENDS THAT ARE STEPPED RATHER THAN ASKED FOR A LEG (0.41). A leg is
# one order because the bulb then moves in SILENCE — a TRÅDFRI reports nothing
# at all while it turns, which is the whole of the walker's saving. A MATTER
# bulb is the opposite: it reports every ~1.5° it moves, and every one of those
# reports is a recorder row holding the word `on` and nothing else (the light
# domain keeps no colour). Measured on a Govee H6008, the same 140° over the
# same 50 s: one order with a 50 s transition = 91 state changes; twenty orders
# of 7° with NO transition = 20, one per order — 4.5 times cheaper. So a bulb
# that narrates its own movement is not asked to move: it is stepped at the
# walk's floor, the granularity the eye settled at H42-r, and its own firmware
# ramps each step (the H6008 ramps every change).
STEPPED = ("matter", "ha")


def stepped(backend: str) -> bool:
    """Is this backend walked step by step instead of one order per leg?"""
    return backend in STEPPED


def ramps(backend: str) -> bool:
    """Does an order to this backend carry a transition? A Matter bulb is asked
    to JUMP — a ramp is what it narrates, and the narration is the cost. Every
    other backend keeps the transition it always had: a bulb with no firmware
    ramp of its own needs it to look like movement."""
    return backend != "matter"


def step_order(
    now: float,
    period: float,
    phase: float,
    lo: float,
    width: float,
    accent: float | None = None,
    step: float = 2.5,
) -> Order:
    """The slowest rung, kept: a bulb that cannot ramp by itself is painted the
    hue the clock will ask for one step from now, over that step — the loop
    every walk was before 0.39, driven by the same timer as the legs. A house
    with a Wi-Fi bulb loses nothing; a bulb that CAN ramp never comes here."""
    hue = hue_at(((now + step) / period) + phase, lo, width, accent)
    return Order(hue, step, step, False, None)


def ended(states: list[str]) -> bool:
    """Is the walk over? Only when every bulb of the look is genuinely OFF —
    that is a hand's off, and 0.25.5's rule says it ends the walk.

    A bulb reading `unavailable` or `unknown` has NOT been switched off: it has
    stopped answering, or the brain has just come back and does not know yet.
    Read live 2026-09-07 13:46:47, the restart proof: Home Assistant came back,
    every walker went `unavailable` for 35 s before its radio answered, and a
    walk that counted anything-but-on as off turned its own switch out. The
    same reading killed a walk at its LOOK's start — the look paints the bulbs
    and the walk begins before their states have caught up."""
    return bool(states) and all(s == "off" for s in states)


def rate_of(order: Order, unit: float = 360 / 254) -> int:
    """The move order's rate, in the bulb's own whole units per second (ZCL
    `moveHue` takes nothing finer, and the GU10 answered an enhanced-hue order
    by zeroing its register — not a road). At least 1: a rate of 0 is a bulb
    that does not move, and the leg's length follows the rate it can hold."""
    if order.seconds <= 0:
        return 1
    return max(1, round(abs(order.degrees) / unit / order.seconds))


def zcl_hue(degrees: float, unit: float = 360 / 254) -> int:
    """A hue in degrees as the bulb's own 0–254 register."""
    return int(round((degrees % 360) / unit)) % 254
