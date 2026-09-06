"""La Régie — the product's own component inside the brain (0.31).

The pieces rendered YAML cannot say live here, each a tenant of one domain
`regie:` that the packages configure and the brain reads once at start. The
first tenant is the porter (conversation.py, porter.py): a conversation agent
in front of the house's LLM. The component is copied into the brain's
config by `render` (base.yml, when the house carries pack assist) and its
version below is its own: it moves when a tenant changes, not with every
release of the product — a changed file restarts the brain (up.py's rule).
"""

from __future__ import annotations

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import discovery
from homeassistant.helpers.typing import ConfigType

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

CONFIG_SCHEMA = vol.Schema(
    {DOMAIN: vol.Schema({vol.Optional("porter"): PORTER_SCHEMA})}, extra=vol.ALLOW_EXTRA
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    conf = config.get(DOMAIN) or {}
    hass.data[DOMAIN] = conf
    if "porter" in conf:
        hass.async_create_task(
            discovery.async_load_platform(hass, "conversation", DOMAIN, conf["porter"], config)
        )
    return True
