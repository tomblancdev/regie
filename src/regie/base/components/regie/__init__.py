"""La Régie — the product's own component inside the brain (0.31).

The pieces rendered YAML cannot say live here, each a tenant of one domain
`regie:` that the packages configure and the brain reads once at start. Three
tenants so far: the porter (conversation.py, porter.py), a conversation agent
in front of the house's LLM, the walker (walker.py, walk.py), which runs a
look's colour walks one order per leg (0.39, the audit's V7), and the palette
(palettes.py, sensor.py, palette.py), whose kept palettes are documents in a
store of ours and whose sensor is computed here from the arithmetic the engine
reads by path (0.42, the audit's V8a).

The component SHIPS WITH EVERY HOUSE since 0.39: `configuration.yaml` carries
the bare `regie:` that loads it, and a pack that has something to configure —
the porter's package — merges its own key into that one (Home Assistant's
package merge fills an empty domain, read at the source, config.py). Its
version below is its own: it moves when a tenant changes, not with every
release of the product — a changed file restarts the brain (up.py's rule).
"""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components.conversation.const import DATA_COMPONENT
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .palettes import PALETTE_SCHEMA

DOMAIN = "regie"

PORTER_SCHEMA = vol.Schema(
    {
        vol.Optional("name", default="Porter"): cv.string,
        # the agent the turn is handed to: a platform (`ollama` — the first
        # conversation entity that integration owns) or an entity id
        vol.Required("llm"): cv.string,
        # the ceiling's sensor and the knock — both optional: without them the
        # LLM's host is taken as always up
        vol.Optional("awake"): cv.entity_id,
        vol.Optional("knock"): cv.service,
        vol.Optional("replies", default={}): vol.Schema({cv.string: cv.string}),
    }
)

# `regie:` with nothing under it is the ordinary case now — a house with no
# pack to configure still loads the component for its walks, so the domain's
# value may be None and the schema must say so (a bare key would otherwise be
# refused as "expected a dict")
CONFIG_SCHEMA = vol.Schema(
    {
        DOMAIN: vol.Any(
            None,
            vol.Schema(
                {
                    vol.Optional("porter"): PORTER_SCHEMA,
                    vol.Optional("palette"): PALETTE_SCHEMA,
                }
            ),
        )
    },
    extra=vol.ALLOW_EXTRA,
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    conf = config.get(DOMAIN) or {}
    hass.data[DOMAIN] = conf
    from . import walker

    await walker.async_setup(hass)
    if "palette" in conf:
        from . import palettes

        store = await palettes.async_setup(hass, dict(conf["palette"]), config)

        async def _names(_event) -> None:
            # the select is a rendered helper and is not there yet at setup:
            # its options take the kept names when the house is up
            await store.async_names()

        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _names)
    if "porter" in conf:
        # handed to the conversation component the way its own default agent
        # is (default_agent.py): that component never arms platform discovery
        # — its async_setup keeps the EntityComponent without calling
        # async_setup(config) on it, so a discovered platform dies unheard and
        # async_setup_platform refuses ("async_setup needs to be called
        # first"). Read live on Home Assistant 2026.8.3 (0.31.2). The registry
        # row's platform is therefore `conversation`; the conductor knows the
        # entity by its unique id.
        from .conversation import Porter

        await hass.data[DATA_COMPONENT].async_add_entities([Porter(hass, dict(conf["porter"]))])
    return True
