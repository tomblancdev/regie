"""The walker — the component's second tenant (0.39, the audit's V7).

`regie.walk` takes a look's plan and runs it; `regie.stop` ends a room's
walks. The room's ↻ switch stays the rendered truth (H36) and is the only one:
a walk whose switch is not `on` does not start, and a switch that goes off
ends it. What used to be a script sending a colour every 2.5 s to every bulb
of a look is now one order per leg, per bulb, said in the bulb's own language
— the arithmetic is walk.py's, this file is the wiring.

Four things this file owns, and nothing else:

- **the order**, per backend: a Zigbee bulb gets raw ZCL through
  Zigbee2MQTT's `set` topic (`moveToHue` + `transtime`, or `moveHue` at a rate
  when the look asks for the move order); a Matter bulb gets Home Assistant's
  own `light.turn_on` with a `transition`; anything else gets the same
  service at the floor, which is the loop of before, one order at a time.
- **the clock**, one timer per walker: each order says when to ask again, and
  every answer is computed from the time — nothing is stored, so a brain that
  restarts mid-leg re-anchors with one order for what is left of it.
- **the re-arm**: a TRÅDFRI stops turning on an off and on a level command
  (read live at the bench), so a bulb reporting `on` again, or a new
  brightness, is asked for its leg again. A bulb that is off is never painted
  — a colour command would turn it on, and a hand's off must hold (0.25.5).
- **the end**: every bulb of a look off = the hand ended the walk, and the
  switch goes off with it.
"""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass, field
from datetime import timedelta
from typing import Any

import voluptuous as vol
from homeassistant.core import Event, HomeAssistant, ServiceCall, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.event import (
    async_track_point_in_utc_time,
    async_track_state_change_event,
)
from homeassistant.util import dt as dt_util

from .walk import FLOOR, SPAN, Order, hue_at, order_at, rate_of, step_order, zcl_hue

_LOG = logging.getLogger(__name__)

DOMAIN = "regie"
DATA_WALKS = "regie_walks"

# ZCL's own numbers: the direction of a `moveToHue`, and the ceiling of a
# `transtime` (a uint16 of tenths — 109 minutes, far past any leg)
SHORTEST, UP, DOWN = 0, 2, 3
TRANSTIME_MAX = 65535
# a Matter bulb idle for a long while drops its first command (read live
# 2026-09-04 and again at the bench, on the Govee) — the first leg is said
# twice, the second time recomputed
REPEAT_FIRST = 1.5
# after an order of ours, the bulb's own reports are not a hand: a Matter bulb
# reports every 2 s while it ramps
QUIET = 3.0

WALKER_SCHEMA = vol.Schema(
    {
        vol.Required("entity"): cv.entity_id,
        vol.Required("period"): vol.Coerce(float),
        vol.Required("phase"): vol.Coerce(float),
        # zigbee (the ZCL orders through Zigbee2MQTT) · matter (light.turn_on
        # with a transition) · ha (the same service, the slowest rung)
        vol.Optional("backend", default="ha"): vol.In(("zigbee", "matter", "ha")),
        vol.Optional("topic", default=None): vol.Any(None, cv.string),  # Z2M's, no /set
        vol.Optional("order", default="ramp"): vol.In(("ramp", "move")),
        # a candidate of a palette look walks only on a day that picked it
        vol.Optional("alive", default=True): cv.boolean,
    }
)

WALK_SCHEMA = vol.Schema(
    {
        vol.Required("id"): cv.string,
        vol.Required("switch"): cv.entity_id,
        vol.Required("walkers"): [WALKER_SCHEMA],
        # the arc: numbers for a look's own band or a named palette, or the
        # sensor to read at every leg for the palette of the day
        vol.Optional("palette"): cv.entity_id,
        vol.Optional("lo", default=190.0): vol.Coerce(float),
        vol.Optional("width", default=140.0): vol.Coerce(float),
        vol.Optional("accent"): vol.Any(None, vol.Coerce(float)),
        vol.Optional("saturation", default=100): vol.Coerce(int),
        vol.Optional("step", default=2.5): vol.Coerce(float),
        vol.Optional("span", default=SPAN): vol.Coerce(float),
    }
)

STOP_SCHEMA = vol.Schema({vol.Optional("id"): cv.string, vol.Optional("room"): cv.string})


@dataclass
class Arc:
    """The band a walk paints, as it stands at this leg: a look's own numbers,
    or the palette's read from the sensor now (« Une autre » and the turn of
    the day change them under a walk that is already going)."""

    lo: float
    width: float
    accent: float | None
    saturation: int


@dataclass
class Walker:
    entity: str
    period: float
    phase: float
    backend: str
    topic: str | None
    order: str
    alive: bool
    cancel: Any = None
    quiet_until: float = 0.0
    brightness: Any = None
    first: bool = True


@dataclass
class Walk:
    id: str
    switch: str
    walkers: list[Walker]
    palette: str | None
    lo: float
    width: float
    accent: float | None
    saturation: int
    step: float
    span: float
    listeners: list = field(default_factory=list)

    @property
    def room(self) -> str:
        return self.id.split(".", 1)[0]


class Walks:
    """Every walk the brain is running, by id. One per (room, look): a look
    that starts replaces the walk of the same name, and a room's looks stop
    each other through `regie.stop`."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.walks: dict[str, Walk] = {}

    def _brightness(self, entity: str):
        state = self.hass.states.get(entity)
        return state.attributes.get("brightness") if state and state.state == "on" else None

    # --- the two doors -------------------------------------------------------
    async def start(self, call: ServiceCall) -> None:
        data = call.data  # the registered schema validated it and filled its defaults
        self.stop_walk(data["id"])
        switch = self.hass.states.get(data["switch"])
        if switch is None or switch.state != "on":
            # the switch is the only truth about a sustained walk (H36): a call
            # that arrives before a hand turned it on is not a walk
            _LOG.debug("regie.walk %s: %s is not on — nothing started", data["id"], data["switch"])
            return
        walk = Walk(
            id=data["id"],
            switch=data["switch"],
            walkers=[Walker(**w) for w in data["walkers"]],
            palette=data.get("palette"),
            lo=data["lo"],
            width=data["width"],
            accent=data.get("accent"),
            saturation=data["saturation"],
            step=data["step"],
            span=data["span"],
        )
        self.walks[walk.id] = walk
        walk.listeners.append(
            async_track_state_change_event(
                self.hass, [w.entity for w in walk.walkers], self._reported
            )
        )
        walk.listeners.append(
            async_track_state_change_event(self.hass, [walk.switch], self._switched)
        )
        for w in walk.walkers:
            w.brightness = self._brightness(w.entity)
            await self._arm(walk, w)

    async def stop(self, call: ServiceCall) -> None:
        data = call.data
        if data.get("id"):
            await self.land(data["id"])
        room = data.get("room")
        for walk_id in [k for k, w in self.walks.items() if room and w.room == room]:
            await self.land(walk_id)

    async def land(self, walk_id: str) -> None:
        """End a walk AND end the motion in the bulbs: a leg's order lives in
        the bulb's own firmware, so forgetting the walk would leave it sliding
        to an end nobody wants any more."""
        walk = self.walks.get(walk_id)
        if walk is None:
            return
        for w in walk.walkers:
            if self.hass.states.is_state(w.entity, "on"):
                await self._halt(walk, w)
        self.stop_walk(walk_id)

    def stop_walk(self, walk_id: str) -> None:
        walk = self.walks.pop(walk_id, None)
        if walk is None:
            return
        for unsub in walk.listeners:
            unsub()
        for w in walk.walkers:
            if w.cancel:
                w.cancel()
                w.cancel = None

    # --- the clock -----------------------------------------------------------
    async def _arm(self, walk: Walk, w: Walker) -> None:
        """One order for the leg the clock is in, and a timer for the next."""
        if w.cancel:
            w.cancel()
            w.cancel = None
        if not w.alive:
            return
        if not self.hass.states.is_state(w.entity, "on"):
            # a bulb a hand switched off is never painted: a colour command
            # would light it again. The `on` report re-arms it.
            return
        arc = self._arc(walk)
        now = time.time()
        order = (
            step_order(now, w.period, w.phase, arc.lo, arc.width, arc.accent, walk.step)
            if w.backend == "ha"
            else order_at(
                now,
                w.period,
                w.phase,
                arc.lo,
                arc.width,
                arc.accent,
                walk.span,
                walk.step,
                anchor=w.order == "move",
            )
        )
        if order.hue is not None:
            await self._say(walk, w, order, arc)
            if w.first and w.backend == "matter":
                # the dropped first command (the Govee, twice read): say it
                # again, recomputed, once the bulb is surely awake
                w.first = False
                self._later(walk, w, REPEAT_FIRST)
                return
        w.first = False
        self._later(walk, w, order.wait)

    def _later(self, walk: Walk, w: Walker, seconds: float) -> None:
        when = dt_util.utcnow() + timedelta(seconds=max(seconds, 0.05))

        @callback
        def _fire(_now) -> None:
            w.cancel = None
            self.hass.async_create_task(self._arm(walk, w))

        w.cancel = async_track_point_in_utc_time(self.hass, _fire, when)

    def _arc(self, walk: Walk) -> Arc:
        """The band, read now. A palette look reads the sensor at every leg, as
        its script read it at every step before: « Une autre », « Repeint » and
        the turn of the day reach a walk already going."""
        if not walk.palette:
            return Arc(walk.lo, walk.width, walk.accent, walk.saturation)
        state = self.hass.states.get(walk.palette)
        pal = (state.attributes.get("palette") if state else None) or {}
        lo = _number(pal.get("lo"), walk.lo)
        return Arc(
            lo,
            _number(pal.get("width"), walk.width),
            # a palette with no accent still dwells, on its own low end: the
            # accent is one more colour of the arc, as random as the others
            _number(pal.get("accent"), lo),
            int(_number(pal.get("saturation"), walk.saturation)),
        )

    # --- the orders ----------------------------------------------------------
    async def _say(self, walk: Walk, w: Walker, order: Order, arc: Arc) -> None:
        w.quiet_until = time.time() + QUIET
        if w.backend == "zigbee" and w.topic:
            if order.travel and w.order == "move":
                await self._mqtt(w, {"hue_move": rate_of(order) * (1 if order.up else -1)})
                return
            await self._mqtt(
                w,
                {
                    "zclcommand": {
                        "cluster": "lightingColorCtrl",
                        "command": "moveToHue",
                        "payload": {
                            "hue": zcl_hue(order.hue),
                            "direction": _direction(order.up),
                            "transtime": min(int(round(order.seconds * 10)), TRANSTIME_MAX),
                            "optionsMask": 0,
                            "optionsOverride": 0,
                        },
                    }
                },
            )
            return
        await self.hass.services.async_call(
            "light",
            "turn_on",
            {
                "entity_id": w.entity,
                "hs_color": [round(order.hue, 1), arc.saturation],
                "transition": round(max(order.seconds, FLOOR), 1),
            },
            blocking=False,
        )

    async def _halt(self, walk: Walk, w: Walker) -> None:
        """Stop the motion where it is. Zigbee has the word for it
        (`stopMoveStep`, read live on both models); Matter has none, so the
        bulb is told to land on the hue the clock says now, at once."""
        if w.backend == "ha":
            return  # nothing is moving inside the bulb: the loop simply ends
        w.quiet_until = time.time() + QUIET
        if w.backend == "zigbee" and w.topic:
            await self._mqtt(w, {"hue_move": "stop"})
            return
        arc = self._arc(walk)
        x = ((time.time() / w.period) + w.phase) % 1
        await self.hass.services.async_call(
            "light",
            "turn_on",
            {
                "entity_id": w.entity,
                "hs_color": [round(hue_at(x, arc.lo, arc.width, arc.accent), 1), arc.saturation],
                "transition": 0,
            },
            blocking=False,
        )

    async def _mqtt(self, w: Walker, payload: dict) -> None:
        await self.hass.services.async_call(
            "mqtt",
            "publish",
            {"topic": f"{w.topic}/set", "payload": json.dumps(payload)},
            blocking=False,
        )

    # --- the re-arm ----------------------------------------------------------
    @callback
    def _reported(self, event: Event) -> None:
        entity = event.data["entity_id"]
        old, new = event.data.get("old_state"), event.data.get("new_state")
        for walk in list(self.walks.values()):
            for w in walk.walkers:
                if w.entity != entity:
                    continue
                self.hass.async_create_task(self._heard(walk, w, old, new))

    async def _heard(self, walk: Walk, w: Walker, old, new) -> None:
        if walk.id not in self.walks:
            return
        if new is None or new.state != "on":
            w.brightness = None
            if w.cancel:
                w.cancel()
                w.cancel = None
            await self._all_off(walk)
            return
        level = new.attributes.get("brightness")
        was_off = old is None or old.state != "on"
        dimmed = not was_off and level != w.brightness and time.time() >= w.quiet_until
        w.brightness = level
        if was_off or dimmed:
            # the bulb came back, or a hand moved its level — either ends the
            # motion inside a TRÅDFRI (read live), so the leg is said again
            await self._arm(walk, w)

    async def _all_off(self, walk: Walk) -> None:
        if any(self.hass.states.is_state(w.entity, "on") for w in walk.walkers):
            return
        _LOG.debug("regie.walk %s: every bulb off — a hand ended the walk", walk.id)
        self.stop_walk(walk.id)
        await self.hass.services.async_call(
            "input_boolean", "turn_off", {"entity_id": walk.switch}, blocking=False
        )

    @callback
    def _switched(self, event: Event) -> None:
        new = event.data.get("new_state")
        if new is not None and new.state == "on":
            return
        for walk in list(self.walks.values()):
            if walk.switch == event.data["entity_id"]:
                self.hass.async_create_task(self.land(walk.id))


def _direction(up: bool | None) -> int:
    """ZCL's own word: up, down, or the shortest way round (an approach may
    cross the band whichever way is nearest)."""
    return SHORTEST if up is None else (UP if up else DOWN)


def _number(value, fallback: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return float(fallback)


async def async_setup(hass: HomeAssistant) -> Walks:
    walks = Walks(hass)
    hass.data[DATA_WALKS] = walks
    hass.services.async_register(DOMAIN, "walk", walks.start, schema=WALK_SCHEMA)
    hass.services.async_register(DOMAIN, "stop", walks.stop, schema=STOP_SCHEMA)
    return walks
