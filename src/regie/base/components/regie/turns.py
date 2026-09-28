"""The ear's arithmetic (0.47) — no Home Assistant in it, so the suite reads it
as it is (tests/test_ear.py).

A BILRESA wheel says a turn notch by notch on its Up or Down endpoint: every
notch an InitialPress, from the second one a MultiPressOngoing with the count
so far, and at the end a MultiPressComplete with the total. Home Assistant's
event entity keeps only that total — and only up to 8
(components/matter/event.py of 2026.8.3: `min(MultiPressMax, 8)`; a larger
count returns in silence, read at the source 2026-09-28), so a spin of 10 or
more was never heard: the wheels of Le Squat had dropped every real spin
since the day they were paired.

The gatherer turns the notches into steps a light can follow: the first
notch at once, then what has gathered at most every THROTTLE seconds, and what
is left when the turn completes — a spin of 18 is 18 notches, said in a
handful of steps."""

from __future__ import annotations

from dataclasses import dataclass

SWITCH = 0x003B  # the Matter Switch cluster
INITIAL_PRESS = 1
MULTI_PRESS_ONGOING = 5
MULTI_PRESS_COMPLETE = 6
# at most one step this often: a Matter light takes 0.1–0.5 s to say yes, and a
# step asked before the last one landed reads a brightness that is already old
THROTTLE = 0.3
# a turn whose end never came (a lost report) is over after this much silence
STALE = 2.0
# a timer that fires at last + THROTTLE can read a hair less than THROTTLE in
# floating point, and ask to come back 1e-17 s later for ever: within a
# millisecond is on time
EARLY = 0.001


@dataclass
class Turn:
    seen: int = 0  # the notches counted so far
    said: int = 0  # the notches already handed on
    last: float = 0.0  # when the last step went
    heard: float = 0.0  # when the last event came


class Gatherer:
    def __init__(self, throttle: float = THROTTLE, stale: float = STALE):
        self.throttle = throttle
        self.stale = stale
        self.turns: dict = {}

    def feed(self, key, event_id: int, data: dict, now: float) -> tuple[int, float | None]:
        """One Switch event of one endpoint. Returns the notches to hand on now
        (0 = none) and, when some wait for the throttle, in how many seconds to
        come back (`flush`); None = nothing waits."""
        t = self.turns.get(key)
        if t is not None and now - t.heard > self.stale:
            t = None  # the last turn never ended: this is a new one
        if t is None:
            if event_id not in (INITIAL_PRESS, MULTI_PRESS_ONGOING, MULTI_PRESS_COMPLETE):
                return 0, None
            t = self.turns[key] = Turn()
        t.heard = now
        if event_id == INITIAL_PRESS:
            # every notch presses; only the first is counted here — the next
            # ones come with their count in the ongoing event that follows
            t.seen = max(t.seen, 1)
        elif event_id == MULTI_PRESS_ONGOING:
            t.seen = max(t.seen, int(data.get("currentNumberOfPressesCounted") or 0))
        elif event_id == MULTI_PRESS_COMPLETE:
            t.seen = max(t.seen, int(data.get("totalNumberOfPressesCounted") or 0))
            n = t.seen - t.said
            del self.turns[key]
            return max(n, 0), None
        else:
            return 0, None
        return self._due(t, now)

    def flush(self, key, now: float) -> tuple[int, float | None]:
        """The throttle's time came: hand on what gathered since."""
        t = self.turns.get(key)
        if t is None:
            return 0, None
        return self._due(t, now)

    def _due(self, t: Turn, now: float) -> tuple[int, float | None]:
        waiting = t.seen - t.said
        if waiting <= 0:
            return 0, None
        if t.said == 0 or now - t.last >= self.throttle - EARLY:
            t.said, t.last = t.seen, now
            return waiting, None
        return 0, self.throttle - (now - t.last)
