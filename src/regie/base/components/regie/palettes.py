"""The palette's store — the component's third tenant (0.42 → 0.43, V8a + V8b).

Until 0.41 a kept palette was seventeen helpers in one of eight numbered
slots, `sensor.house_palette` a two-hundred-line Jinja template the engine
generated so that the brain's draw could agree with Python's, and the day's
rules twenty-one more helpers. Two hundred entities carried the word
*palette*. This file is what replaced them:

- **the documents.** `.storage/regie.palettes` holds one entry per kept
  palette, by an id derived from its first name, in the FILE's own shape
  (`band`, `level`, `alive`, `life`) — so `regie pull` writes one into
  `fx.yml` as it stands, and the sensor reads it through `named_value`, the
  same door a palette named in the file goes through. No slot, no ceiling, no
  helper left behind by a deletion.
- **the day's rules** (0.43), one document beside them under the key `rules`,
  in the FILE's own shape too (`rules_normal`) — so `regie pull` lays them
  into `fx.yml`'s `palettes.today` key by key. ABSENT is the ordinary state:
  the house then wears what the files say, and a file edited and converged
  lands on the brain with nothing to seed and nothing to free. A hand moving a
  slider in the Atelier writes the document; the converge frees it again the
  moment the files carry the same word.
- **the five doors.** `regie/palettes/list · save · delete · random · rules` —
  what the Atelier calls for « Nouvelle », « Enregistrer sous », « Supprimer »,
  « Au hasard » and every control of the rules tab. `save` with no id mints
  one; with an id it replaces. `rules` with no block FREES the rules document.
- **the value.** The sensor's state is the SOURCE the select names (`today`,
  a palette of the file, or a kept one) and its attributes are the palette
  itself, its label, and the rooms' own draws for the day. The arithmetic is
  palette.py's, the module the engine reads too: the day's draw is written
  once now, and the test that kept two copies in step has nothing left to
  compare.

THE SEED, AND WHY IT LIVES IN THE DOCUMENT. A kept palette's seed is
definitional — the files either carry it or they do not. The rules are always
declared by the files, so the same reading would say « by hand » every time a
slider moved. The rules document therefore carries the files' word AS IT WAS
WHEN THE HAND FIRST DEPARTED FROM IT, stamped once at birth: that is the third
reading V4's rule wants, and it travels with the thing it describes.

What is NOT here, by the rule H51 settled: the family's five controls stay
rendered helpers — the select, « Change à », « Une autre », « Repeint » and
the switch « Palette du jour ». They are on the dashboard, they are portable,
and the file seeds them. « Change à » is a rule as much as a control, so it is
read live here and pulled as a knob of its own.

The Atelier keeps its own port of `draw` for the week strip it paints under
the rules — a preview that must follow a slider as it moves, faster than a
sensor recomputed on a round trip through the store. It never says what the
house wears: that is this file's answer alone.
"""

from __future__ import annotations

import json
import logging
import random
import time

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.storage import Store
from homeassistant.helpers.typing import ConfigType
from homeassistant.util import dt as dt_util

from . import palette as P

_LOG = logging.getLogger(__name__)

DOMAIN = "regie"
DATA_PALETTES = "regie_palettes"
STORE_KEY = "regie.palettes"
STORE_VERSION = 1

ROOM_SCHEMA = vol.Schema(
    {
        # the key the look's script reads out of the `rooms` attribute; the
        # render mints it from everything the draw depends on
        vol.Required("key"): cv.string,
        vol.Required("room"): cv.string,
        vol.Optional("source", default=P.AUTO): cv.string,
        vol.Optional("candidates", default=0): vol.Coerce(int),
        vol.Optional("targets", default=0): vol.Coerce(int),
    }
)

PALETTE_BLOCK = vol.Schema(
    {
        vol.Required("salt"): vol.Coerce(int),
        # the select's word for the day's draw (the rules' own label, else the
        # house's language)
        vol.Optional("auto", default="Auto"): cv.string,
        vol.Optional("kelvin", default=None): vol.Any(None, {cv.string: vol.Coerce(int)}),
        # the file's `palettes.today` rules: what a helper cannot say, and the
        # word the phone follows until it is moved
        vol.Optional("rules", default=None): vol.Any(None, dict),
        # the file's named palettes, id → the block as written
        vol.Optional("named", default={}): {cv.string: dict},
        vol.Optional("rooms", default=[]): [ROOM_SCHEMA],
    }
)


def _parsed(text: str) -> dict:
    """The block as the pack renders it: ONE JSON scalar. Home Assistant
    merges a package's config recursively and passes every LIST it meets
    through `cv.remove_falsy` — an `avoid: [0, 60]` would reach us `[60]` and
    an `alive: [0, all]` would reach us `[all]` (config.py `_recursive_merge`,
    read at the source). A scalar crosses that merge untouched."""
    try:
        got = json.loads(text)
    except ValueError as exc:
        raise vol.Invalid(f"regie: palette: not JSON — {exc}") from exc
    if not isinstance(got, dict):
        raise vol.Invalid("regie: palette: a JSON object is expected")
    return got


PALETTE_SCHEMA = vol.All(cv.string, _parsed, PALETTE_BLOCK)


class Palettes:
    """The kept palettes, and the value the sensor wears."""

    def __init__(self, hass: HomeAssistant, conf: dict) -> None:
        self.hass = hass
        self.salt = int(conf["salt"])
        self.auto = conf.get("auto") or "Auto"
        self.kelvin = dict(conf.get("kelvin") or P.KELVIN)
        self.named: dict = dict(conf.get("named") or {})
        # the day's rules the FILES declare, under the one grammar (0.43): the
        # house wears them until a hand moves them on the phone, and they are
        # what a moved document is compared against
        raw_rules = dict(conf.get("rules") or P.DEFAULT_RULES)
        self.file_rules: dict = P.rules_normal(raw_rules)
        self.turns: str = str(raw_rules.get("turns") or P.DEFAULT_RULES["turns"])
        self.rooms: list[dict] = list(conf.get("rooms") or [])
        self.store: Store = Store(hass, STORE_VERSION, STORE_KEY)
        self.docs: dict[str, dict] = {}
        self.rules_doc: dict | None = None  # the rules a hand moved, or None: the files
        self.rules_seed: dict | None = None  # the files' word the hand departed from
        self._listeners: list = []

    # --- the documents -------------------------------------------------------
    async def async_load(self) -> None:
        data = await self.store.async_load() or {}
        raw = data.get("palettes") or {}
        self.docs = {str(k): P.store_clean(v) for k, v in raw.items() if isinstance(v, dict)}
        kept = data.get("rules")
        if isinstance(kept, dict) and isinstance(kept.get("rules"), dict):
            self.rules_doc = P.rules_normal(kept["rules"])
            seed = kept.get("seed")
            self.rules_seed = P.rules_normal(seed) if isinstance(seed, dict) else None

    def _data(self) -> dict:
        data: dict = {"palettes": self.docs}
        if self.rules_doc is not None:
            data["rules"] = {"rules": self.rules_doc, "seed": self.rules_seed}
        return data

    async def _written(self, was: str) -> None:
        """Saved, then the two things a name change moves: the select's options
        and, when the palette in force is the one renamed, its own option."""
        await self.store.async_save(self._data())
        await self.async_names(was)
        self.changed()

    def mint(self, label: str) -> str:
        """A kept palette's id: DERIVED from its first name, never a counter —
        `regie pull` writes it into `fx.yml` under that same slug. A rename
        leaves the id alone (the name is the face, the id is plumbing)."""
        base = P.slug(label)
        pid, n = base, 1
        while pid in self.docs:
            n += 1
            pid = f"{base}_{n}"
        return pid

    async def save(self, pid: str | None, palette: dict) -> str:
        doc = P.store_clean(palette)
        was = self.source()
        if not pid or pid not in self.docs:
            pid = pid or self.mint(doc["label"])
        self.docs[pid] = doc
        await self._written(was)
        return pid

    async def delete(self, pid: str) -> bool:
        if pid not in self.docs:
            return False
        selected = self.source() == pid
        del self.docs[pid]
        # the palette in force was the one deleted: the select falls back to
        # the day's draw, as the delete button always did
        await self._written(P.AUTO if selected else self.source())
        return True

    async def random(self, pid: str) -> dict | None:
        """« Au hasard » on a kept palette: the day's draw from a random seed,
        within the day's rules — its colours change, its level and its life
        stay the ones a hand set."""
        doc = self.docs.get(pid)
        if doc is None:
            return None
        rules = self.live_rules()
        p = P.draw(int(time.time() * 1000) % P.M, random.randrange(0, 99999), self.salt, rules)
        level = dict(doc.get("level") or {})
        if p["jitter"]:
            level["jitter"] = p["jitter"]
        else:
            level.pop("jitter", None)
        drawn = {
            **doc,
            "band": [p["lo"], p["hi"]],
            "accent": p["accent"],
            "saturation": p["saturation"],
            "white": p["white"],
        }
        if level:
            drawn["level"] = level
        else:
            drawn.pop("level", None)
        await self.save(pid, drawn)
        return self.docs[pid]

    # --- the day's rules (0.43, the audit's V8b) ------------------------------
    async def save_rules(self, rules: dict | None) -> dict | None:
        """The day's rules moved on the phone — or FREED (`rules` None), which
        is what the converge does when the files have caught up and what
        `regie push` does when the files should win.

        Rules the house's `check` would refuse are refused HERE too, from the
        same numbers (`rules_refusal`): the phone may not leave the house
        wearing a day the next converge would throw out.

        THE SEED IS STAMPED WHEN THE DOCUMENT IS BORN, and never again: it is
        the files' word the hand departed from, and it is the only thing that
        tells « edited on the phone » from « the files moved too ». Re-stamping
        it at every slider would erase that difference — the second hand would
        silently adopt whatever the files had come to say."""
        if rules is None:
            self.rules_doc = self.rules_seed = None
        else:
            want = P.rules_normal(rules)
            # what `check` would refuse in the file, the door refuses on the
            # phone (0.43): a document nobody could ever converge would leave
            # the house wearing an arc that crosses the quarter it never crosses
            refusal = P.rules_refusal(want)
            if refusal:
                raise ValueError(refusal)
            if self.rules_doc is None:
                self.rules_seed = dict(self.file_rules)
            self.rules_doc = want
        await self.store.async_save(self._data())
        self.changed()
        return self.rules_doc

    # --- the brain's own readings --------------------------------------------
    def _read(self, entity: str):
        st = self.hass.states.get(entity)
        return {"state": st.state} if st is not None else None

    def _txt(self, entity: str) -> str:
        return P._txt(self._read, entity)

    def live_rules(self) -> dict:
        """The day's rules as the house wears them: the document a hand moved,
        else the files' own word — and « Change à », which stays a helper the
        family owns (one of the five the dashboard carries), read live."""
        rules = dict(self.rules_doc or self.file_rules)
        rules["turns"] = self._txt(P.TURNS_ENTITY)[:5] or self.turns
        return rules

    def source(self) -> str:
        """What the select names — the day's draw when it names nothing we
        know (a name that just went, an option lost at a restart)."""
        return P.source_of(self._txt(P.SELECT_ENTITY), self.auto, self.named, self.docs)

    def value(self) -> tuple[str, dict]:
        """The sensor's state and attributes. Three readings and the rest is
        arithmetic: the select's word, the day's rules as the helpers hold
        them, and the roll — everything after that is palette.py's `value`,
        the module the engine reads too."""
        rules = self.live_rules()
        return P.value(
            self.source(),
            P.day_of(dt_util.now(), rules["turns"]),
            int(P._num(self._read, P.ROLL_ENTITY, 0)),
            self.salt,
            rules,
            self.named,
            self.docs,
            self.rooms,
            self.auto,
            self.kelvin,
        )

    # --- the select's options ------------------------------------------------
    async def async_names(self, was: str = "") -> None:
        """THE NAMES ARE THE FACE (0.24, the automation's job since): the
        select lists the day, the file's palettes and every kept name. A
        palette renamed while it was in force keeps the select — `set_options`
        falls back to the first option otherwise (read live)."""
        st = self.hass.states.get(P.SELECT_ENTITY)
        if st is None:
            return
        want = P.option_labels(self.auto, self.named, self.docs)
        if list(st.attributes.get("options") or []) != want:
            await self.hass.services.async_call(
                "input_select",
                "set_options",
                {"entity_id": P.SELECT_ENTITY, "options": want},
                blocking=True,
            )
        if not was:
            return
        label = P.label_of(was, self.auto, self.named, self.docs)
        st = self.hass.states.get(P.SELECT_ENTITY)
        if st is not None and st.state != label and label in (st.attributes.get("options") or []):
            await self.hass.services.async_call(
                "input_select",
                "select_option",
                {"entity_id": P.SELECT_ENTITY, "option": label},
                blocking=True,
            )

    # --- who is listening ----------------------------------------------------
    @callback
    def listen(self, fn):
        """Told when a document moves; the answer unsubscribes."""
        self._listeners.append(fn)

        @callback
        def _drop() -> None:
            if fn in self._listeners:
                self._listeners.remove(fn)

        return _drop

    @callback
    def changed(self) -> None:
        for fn in list(self._listeners):
            fn()


# --- the five doors the Atelier calls ------------------------------------------
def _palettes(hass: HomeAssistant) -> Palettes | None:
    return hass.data.get(DATA_PALETTES)


@websocket_api.websocket_command({vol.Required("type"): "regie/palettes/list"})
@websocket_api.async_response
async def ws_list(hass, connection, msg) -> None:
    p = _palettes(hass)
    if p is None:
        connection.send_error(msg["id"], "not_configured", "the house keeps no palette")
        return
    connection.send_result(
        msg["id"],
        {
            "palettes": p.docs,
            "source": p.source(),
            "auto": p.auto,
            # the rules the tab edits: the document when a hand moved them,
            # else the files' word — with both said, so the card can show which
            # it is and offer the way back
            "rules": p.rules_doc or p.file_rules,
            "rules_files": p.file_rules,
            "rules_moved": p.rules_doc is not None,
            # the third reading V4's rule wants: the files' word the hand
            # departed from, stamped when the document was born
            "rules_seed": p.rules_seed,
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "regie/palettes/save",
        # `id` belongs to the websocket protocol itself (the message's number):
        # a command's own field cannot be called that
        vol.Optional("palette_id"): cv.string,
        vol.Required("palette"): dict,
    }
)
@websocket_api.async_response
async def ws_save(hass, connection, msg) -> None:
    p = _palettes(hass)
    if p is None:
        connection.send_error(msg["id"], "not_configured", "the house keeps no palette")
        return
    pid = await p.save(msg.get("palette_id"), msg["palette"])
    connection.send_result(msg["id"], {"palette_id": pid, "palette": p.docs[pid]})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "regie/palettes/delete", vol.Required("palette_id"): cv.string}
)
@websocket_api.async_response
async def ws_delete(hass, connection, msg) -> None:
    p = _palettes(hass)
    if p is None:
        connection.send_error(msg["id"], "not_configured", "the house keeps no palette")
        return
    connection.send_result(msg["id"], {"deleted": await p.delete(msg["palette_id"])})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "regie/palettes/random", vol.Required("palette_id"): cv.string}
)
@websocket_api.async_response
async def ws_random(hass, connection, msg) -> None:
    p = _palettes(hass)
    if p is None:
        connection.send_error(msg["id"], "not_configured", "the house keeps no palette")
        return
    doc = await p.random(msg["palette_id"])
    if doc is None:
        connection.send_error(msg["id"], "not_found", f"no kept palette {msg['palette_id']!r}")
        return
    connection.send_result(msg["id"], {"palette_id": msg["palette_id"], "palette": doc})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "regie/palettes/rules",
        # no block at all = FREE the document: the house follows the files
        # again. It is « Suivre les fichiers » on the card, and what `regie
        # push home.yml palettes` does from the conductor.
        vol.Optional("rules"): vol.Any(None, dict),
    }
)
@websocket_api.async_response
async def ws_rules(hass, connection, msg) -> None:
    p = _palettes(hass)
    if p is None:
        connection.send_error(msg["id"], "not_configured", "the house keeps no palette")
        return
    try:
        doc = await p.save_rules(msg.get("rules"))
    except ValueError as exc:
        connection.send_error(msg["id"], "invalid_format", str(exc))
        return
    connection.send_result(msg["id"], {"rules": doc or p.file_rules, "moved": doc is not None})


# --- the setup -----------------------------------------------------------------
@callback
def _free_the_entity_id(hass: HomeAssistant) -> None:
    """The entity id is minted ONCE: the template sensor the pack rendered
    until 0.41 left a registry row holding `sensor.house_palette`, and a new
    platform asking for that name would be handed `_2` and every look in the
    house would read an empty palette. The row is ours (a `regie_` unique id
    under another platform) and nothing renders it any more — it goes before
    the component's own sensor asks for the name. A row that is NOT ours is
    left exactly where it is."""
    reg = er.async_get(hass)
    row = reg.async_get(P.SENSOR)
    if row is None or row.platform == DOMAIN:
        return
    if not str(row.unique_id or "").startswith("regie_"):
        _LOG.warning(
            "%s is held by %s (unique id %s) — the palette's sensor cannot take its name",
            P.SENSOR,
            row.platform,
            row.unique_id,
        )
        return
    _LOG.info("%s: the old template sensor's registry row removed (0.42)", P.SENSOR)
    reg.async_remove(P.SENSOR)


async def async_setup(hass: HomeAssistant, conf: dict, config: ConfigType) -> Palettes:
    from homeassistant.helpers.discovery import async_load_platform

    palettes = Palettes(hass, conf)
    await palettes.async_load()
    hass.data[DATA_PALETTES] = palettes
    _free_the_entity_id(hass)
    for command in (ws_list, ws_save, ws_delete, ws_random, ws_rules):
        websocket_api.async_register_command(hass, command)
    hass.async_create_task(async_load_platform(hass, "sensor", DOMAIN, {}, config))
    return palettes
