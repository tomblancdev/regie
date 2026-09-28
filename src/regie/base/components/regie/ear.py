"""The ear — the component's fourth tenant (0.47, « Les molettes muettes »).

A wheel's turn, notch by notch, heard from the Matter server itself through
Home Assistant's own Matter client (the one its event entities subscribe
with): Home Assistant keeps only a turn's total, and drops any total above 8,
so a real spin never reached a house. The arithmetic is turns.py's; this
file is the wiring — the client found once Home Assistant is up (and again
if the Matter entry reloads with a new one), each Switch event of each
endpoint fed to the gatherer, and what it hands on fired as

    regie_turn {entity_id: event.<thing>_<endpoint>, notches: N}

— the endpoint named by its own event entity, so a rendered automation
listens for the words the house already uses. A house with no Matter entry
simply has a deaf ear.
"""

from __future__ import annotations

import logging
import time
from datetime import timedelta
from functools import partial

from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_call_later, async_track_time_interval

from .turns import SWITCH, Gatherer

_LOGGER = logging.getLogger(__name__)
EVENT = "regie_turn"


class Ear:
    def __init__(self, hass: HomeAssistant):
        self.hass = hass
        self.gatherer = Gatherer()
        self.client = None
        self.unsubscribe = None
        self.fabric: int | None = None
        self.waiting: dict = {}  # key -> the cancel of its throttle timer
        self.names: dict = {}  # (node, endpoint) -> the event entity's unique id

    @callback
    def attach(self, *_):
        """Subscribe to the Matter client, or again to a new one."""
        client = None
        for entry in self.hass.config_entries.async_entries("matter"):
            data = getattr(entry, "runtime_data", None)
            adapter = getattr(data, "adapter", None)
            client = getattr(adapter, "matter_client", None)
            if client is not None:
                break
        if client is None or client is self.client:
            return
        try:
            from matter_server.common.models import EventType
        except ImportError:  # pragma: no cover — Home Assistant ships it with matter
            return
        if self.unsubscribe:
            self.unsubscribe()
        self.client = client
        self.fabric = getattr(client.server_info, "compressed_fabric_id", None)
        self.names = {}
        self.unsubscribe = client.subscribe_events(
            callback=self._on_event, event_filter=EventType.NODE_EVENT
        )
        _LOGGER.info("the ear listens to the Matter server (fabric %016X)", self.fabric or 0)

    @callback
    def _on_event(self, _event, data) -> None:
        if getattr(data, "cluster_id", None) != SWITCH:
            return
        key = (data.node_id, data.endpoint_id)
        n, back = self.gatherer.feed(key, data.event_id, data.data or {}, time.monotonic())
        self._hand_on(key, n, back)

    @callback
    def _flush(self, key, _now) -> None:
        self.waiting.pop(key, None)
        n, back = self.gatherer.flush(key, time.monotonic())
        self._hand_on(key, n, back)

    @callback
    def _hand_on(self, key, n: int, back: float | None) -> None:
        if n:
            entity_id = self._entity(key)
            if entity_id:
                self.hass.bus.async_fire(EVENT, {"entity_id": entity_id, "notches": n})
        if back is not None and key not in self.waiting:
            self.waiting[key] = async_call_later(self.hass, back, partial(self._flush, key))

    def _entity(self, key) -> str | None:
        """The endpoint's event entity: its unique id starts with the node's
        operational id and the endpoint (components/matter/entity.py)."""
        reg = er.async_get(self.hass)
        uid = self.names.get(key)
        if uid is None and self.fabric is not None:
            node, endpoint = key
            prefix = f"{self.fabric:016X}-{node:016X}-MatterNodeDevice-{endpoint}-"
            uid = next(
                (
                    e.unique_id
                    for e in reg.entities.values()
                    if e.platform == "matter"
                    and e.domain == "event"
                    and e.unique_id.startswith(prefix)
                ),
                None,
            )
            if uid is None:
                return None
            self.names[key] = uid
        return reg.async_get_entity_id("event", "matter", uid) if uid else None


async def async_setup(hass: HomeAssistant) -> Ear:
    ear = Ear(hass)
    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, ear.attach)
    # the Matter entry may load after us, or reload with a new client
    async_track_time_interval(hass, ear.attach, timedelta(minutes=1))
    return ear
