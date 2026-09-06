"""Le Portier — the conversation agent in front of the house's LLM (0.31).

The pipeline names this entity as its agent, with *prefer handling commands
locally* on: a command never reaches it. What does is a question the
sentences cannot answer. The verdict (porter.py) reads the ceiling's sensor:

- awake: the turn is handed to the LLM's own agent INSIDE THE SAME CHAT LOG
  — `async_converse` re-enters the session the pipeline opened (Home
  Assistant 2026.8: an active log is returned as it is, the user's line is
  not doubled, the pipeline's streaming listener stays attached), so the
  history follows and a spoken answer streams as before;
- asleep: the house's line, and a knock through the service the package
  names — the person hears that the tower is being woken, not an error;
- unknown: the LLM is asked anyway; a failure is said as what it is.

The entity keeps its last verdict and the knock's time as attributes: the
drills read them. It is added by the component's __init__ straight into
the conversation component (no platform discovery there).
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime

from homeassistant.components import conversation
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er

from .porter import DELEGATE, WAKE, decide, line, pick_agent

_LOGGER = logging.getLogger(__name__)

ENTITY_ID = "conversation.porter"
UNIQUE_ID = "regie_porter"


class Porter(conversation.ConversationEntity):
    _attr_has_entity_name = False
    _attr_should_poll = False
    _attr_supported_features = conversation.ConversationEntityFeature.CONTROL

    def __init__(self, hass: HomeAssistant, conf: dict) -> None:
        self.hass = hass
        self._conf = conf
        self._attr_name = conf["name"]
        self._attr_unique_id = UNIQUE_ID
        self.entity_id = ENTITY_ID
        self._last: dict = {"turn": None, "agent": None, "knocked_at": None}

    @property
    def supported_languages(self) -> str:
        return "*"

    @property
    def extra_state_attributes(self) -> dict:
        return dict(self._last)

    async def _async_handle_message(
        self, user_input: conversation.ConversationInput, chat_log: conversation.ChatLog
    ) -> conversation.ConversationResult:
        verdict = decide(self._awake(), bool(self._conf.get("knock")))
        if verdict == WAKE:
            return await self._wake(user_input, chat_log)
        agent = pick_agent(self._conf["llm"], self._agents())
        if agent is None:
            _LOGGER.warning("no conversation agent for %r yet", self._conf["llm"])
            return self._say(user_input, chat_log, "no_agent", None)
        result = None
        why = ""
        try:
            result = await conversation.async_converse(
                self.hass,
                text=user_input.text,
                conversation_id=user_input.conversation_id,
                context=user_input.context,
                language=user_input.language,
                agent_id=agent,
                device_id=user_input.device_id,
                satellite_id=user_input.satellite_id,
                extra_system_prompt=user_input.extra_system_prompt,
            )
        except (HomeAssistantError, ValueError) as err:
            why = str(err)
        if result is not None:
            if result.response.error_code is None:
                self._note("delegated", agent)
                return result
            why = result.response.speech.get("plain", {}).get("speech", "") or str(
                result.response.error_code
            )
        _LOGGER.warning("the LLM's agent %s did not answer: %s", agent, why)
        return self._say(
            user_input, chat_log, "absent" if verdict == DELEGATE else "unknown", agent
        )

    async def _wake(
        self, user_input: conversation.ConversationInput, chat_log: conversation.ChatLog
    ) -> conversation.ConversationResult:
        domain, service = self._conf["knock"].split(".", 1)
        try:
            await self.hass.services.async_call(
                domain, service, {"reason": "assist"}, blocking=True
            )
        except (HomeAssistantError, ValueError) as err:
            _LOGGER.warning("the knock %s failed: %s", self._conf["knock"], err)
            return self._say(user_input, chat_log, "knock_failed", None)
        self._last["knocked_at"] = datetime.now(UTC).isoformat(timespec="seconds")
        return self._say(user_input, chat_log, "waking", None)

    def _say(
        self,
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
        key: str,
        agent: str | None,
    ) -> conversation.ConversationResult:
        text = line(self._conf.get("replies") or {}, key)
        chat_log.async_add_assistant_content_without_tools(
            conversation.AssistantContent(agent_id=self.entity_id, content=text)
        )
        self._note(key, agent)
        return conversation.async_get_result_from_chat_log(user_input, chat_log)

    def _note(self, turn: str, agent: str | None) -> None:
        self._last["turn"] = turn
        self._last["agent"] = agent
        self.async_write_ha_state()

    def _awake(self) -> str | None:
        entity_id = self._conf.get("awake")
        state = self.hass.states.get(entity_id) if entity_id else None
        return state.state if state else None

    def _agents(self) -> list[tuple[str, str]]:
        registry = er.async_get(self.hass)
        return [
            (e.entity_id, e.platform)
            for e in registry.entities.values()
            if e.domain == conversation.DOMAIN
        ]
