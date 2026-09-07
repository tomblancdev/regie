"""`sensor.house_palette` — the house's palette, computed here (0.42, V8a).

ONE value every look may read: its state is the SOURCE the select names (the
day's draw, a palette of the file, or one kept on the phone) and its
attributes are the palette itself, the word the select shows, and every room's
own draws for the day. A look's script reads them exactly as it read the
template sensor's before — `state_attr('sensor.house_palette', 'palette')`.

Recomputed on the same six events the template's triggers named: every minute
(the hour the palette turns), at start, and when the select, the hour, the
roll, the day's rules or the store move. Nothing is stored between two reads:
the value is a function of the clock, the helpers and the documents, so a
restart mid-day changes nothing — the property the draw has always had.
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.components.sensor import SensorEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType

from . import palette as P
from .palettes import DATA_PALETTES, Palettes

MINUTE = timedelta(minutes=1)


async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> None:
    palettes: Palettes | None = hass.data.get(DATA_PALETTES)
    if palettes is None:  # the house keeps no palette — the component's other tenants stand
        return
    async_add_entities([HousePalette(palettes)])


class HousePalette(SensorEntity):
    # the object id the whole house names: the entity id is derived from this
    # name, and every look's script says it out loud
    _attr_name = "house_palette"
    _attr_unique_id = "regie_house_palette"
    _attr_icon = "mdi:palette"
    _attr_should_poll = False

    def __init__(self, palettes: Palettes) -> None:
        self._palettes = palettes
        self._state = P.AUTO
        self._attrs: dict = {}

    @property
    def native_value(self) -> str:
        return self._state

    @property
    def extra_state_attributes(self) -> dict:
        return self._attrs

    async def async_added_to_hass(self) -> None:
        self._compute()
        self.async_on_remove(async_track_time_interval(self.hass, self._tick, MINUTE))
        self.async_on_remove(
            async_track_state_change_event(
                self.hass,
                [P.SELECT_ENTITY, P.ROLL_ENTITY, *P.rules_entities()],
                self._moved,
            )
        )
        self.async_on_remove(self._palettes.listen(self._told))

    @callback
    def _tick(self, _now) -> None:
        self._refresh()

    @callback
    def _moved(self, _event) -> None:
        self._refresh()

    @callback
    def _told(self) -> None:
        self._refresh()

    @callback
    def _refresh(self) -> None:
        self._compute()
        self.async_write_ha_state()

    @callback
    def _compute(self) -> None:
        self._state, self._attrs = self._palettes.value()
