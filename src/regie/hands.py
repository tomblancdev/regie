"""The hands (0.19, the grammar's step 3): a remote's gestures, in the
house's words, become verbs — one automation per remote.

Four layers, one job each: a device says raw events (per transport); a
gesture PROFILE per model turns them into the house's words; a BEHAVIOUR on
the product's shelf maps words to verbs, with fields a house fills (as an fx
shape has); a verb renders once (verbs.py). The house writes one line per
remote: which behaviour, and what differs."""

from __future__ import annotations

from pathlib import Path

import yaml

from . import verbs
from .errors import HouseError

BEHAVIOURS_DIR = Path(__file__).parent / "packs" / "hands" / "behaviours"

# --- the profiles: what a model says, in the house's words --------------------
# Read from the devices on the brain (2026-09-04): a STYRBAR's `action` values as
# Zigbee2MQTT exposes them; a BILRESA's endpoints as the Matter store tags them
# (per channel n: 3n-2 Up, 3n-1 Down, 3n the click; a dual button's 1 = top, 2 =
# bottom); a turn of K notches is ONE `multi_press_K`.
PROFILES: dict[str, dict] = {
    "styrbar": {
        "models": ["E2001/E2002/E2313", "E2001", "E2002", "E2313"],
        "via": "zigbee",
        "gestures": [
            "on",
            "off",
            "hold_on",
            "hold_off",
            "left",
            "right",
            "hold_left",
            "hold_right",
        ],
        "mesh": ["on", "off", "hold_on", "hold_off"],
        # how a 2.4 STYRBAR binds to a room (read live 2026-09-04, and the
        # device's own page): ONE binding, genBasic -> the group, carries every
        # command; the per-cluster ones the converter puts on the coordinator
        # take precedence and starve the group, so they are stripped; the
        # coordinator joins the group to keep hearing (the frames come with the
        # group id). Unbound, the converter's coordinator bindings stay.
        "binding": {
            "cluster": "genBasic",
            "strip": ["genOnOff", "genLevelCtrl", "genScenes"],
            "hear_via_group": True,
        },
        "raw": {
            "on": "on",
            "off": "off",
            "brightness_move_up": "hold_on",
            "brightness_move_down": "hold_off",
            "brightness_stop": "release",
            "arrow_left_click": "left",
            "arrow_right_click": "right",
            "arrow_left_hold": "hold_left",
            "arrow_right_hold": "hold_right",
            "arrow_left_release": "release",
            "arrow_right_release": "release",
        },
    },
    "bilresa_wheel": {
        "models": ["BILRESA scroll wheel"],
        "via": "matter",
        "channels": 3,
        "gestures": ["turn", "click", "double", "triple", "hold"],
        "clicks": {"multi_press_1": "click", "multi_press_2": "double", "multi_press_3": "triple"},
    },
    "bilresa_dual": {
        "models": ["BILRESA dual button"],
        "via": "matter",
        "gestures": ["top", "top_double", "top_hold", "bottom", "bottom_double", "bottom_hold"],
        "buttons": {1: "top", 2: "bottom"},
        "clicks": {"multi_press_1": "", "multi_press_2": "_double"},
    },
}
NOT_FROM = ["unavailable", "unknown"]
K = "trigger.to_state.attributes.event_type.split('_')[-1] | int(1)"


def word(x):
    """YAML 1.1 reads a bare `on`/`off` as a boolean — a gesture key, a look —
    so the house's booleans are read back as the words it wrote."""
    if x is True:
        return "on"
    if x is False:
        return "off"
    return x


def words(verb: dict) -> dict:
    out = {}
    for k, v in verb.items():
        if k in ("look", "toggle") and v is False:
            v = "off"
        if k == "then" and isinstance(v, dict):
            v = words(v)
        out[word(k)] = v
    return out


def profile_of(thing: dict) -> tuple[str, dict] | None:
    model = str(thing.get("model") or "")
    for name, p in PROFILES.items():
        if model in p["models"]:
            return name, p
    return None


def load_behaviour(name: str) -> dict:
    path = BEHAVIOURS_DIR / f"{name}.yml"
    if not path.is_file():
        known = sorted(p.stem for p in BEHAVIOURS_DIR.glob("*.yml"))
        raise HouseError(f"behaviour {name!r} is not on the shelf — {', '.join(known)}")
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def fill(value, fields: dict, where: str):
    """`$name` in a verb's value is the field of that name, filled by the house
    or by the behaviour's default; an empty one is refused."""
    if isinstance(value, str) and value.startswith("$"):
        name = value[1:]
        if name not in fields:
            raise HouseError(f"{where}: field ${name} is not one the behaviour declares")
        if fields[name] in (None, [], ""):
            raise HouseError(f"{where}: field ${name} is empty — the room file must fill it")
        return fields[name]
    if isinstance(value, dict):
        return {k: fill(v, fields, where) for k, v in value.items()}
    if isinstance(value, list):
        return [fill(v, fields, where) for v in value]
    return value


def gestures_of(house, area: dict, thing: dict, spec: dict, pname: str, profile: dict) -> dict:
    """The remote's gesture → verb map: the behaviour's, the house's fields
    filled, its overrides on top; a bound remote's mesh gestures keep no
    `level` (the mesh dims). Not for a wheel — see channels_of."""
    where = f"{area['id']}: hands {thing['id']}"
    b = load_behaviour(spec["behaviour"])
    if pname not in (b.get("profiles") or []):
        raise HouseError(
            f"{where}: behaviour {spec['behaviour']} is written for "
            f"{', '.join(b.get('profiles', []))},"
            f" not for a {pname}"
        )
    fields = dict(b.get("fields") or {})
    for k, v in spec.items():
        if k in fields:
            fields[k] = v
    out: dict = {}
    for g, verb in (b.get("gestures") or {}).items():
        out[word(g)] = words(fill(verb, fields, where))
    for k, v in spec.items():
        k = word(k)
        if k in ("behaviour", "looks", *fields):
            continue
        if isinstance(v, dict):
            v = words(v)
        if k not in profile["gestures"]:
            raise HouseError(
                f"{where}: gesture {k!r} — a {pname} has {', '.join(profile['gestures'])}"
            )
        out[k] = v
    if thing.get("bind"):
        for g in profile.get("mesh", []):
            if g in out and "level" in out[g]:
                del out[g]
    return out


def channels_of(house, area: dict, thing: dict, spec: dict, pname: str, profile: dict) -> dict:
    """A wheel: per channel, the target (a role or a thing) picks the behaviour's
    `light` or `media` gestures; the house's overrides on top (`double:` a look
    or a list = a look verb, `walk:` = the hold's walk)."""
    where = f"{area['id']}: hands {thing['id']}"
    b = load_behaviour(spec["behaviour"])
    if pname not in (b.get("profiles") or []):
        raise HouseError(f"{where}: behaviour {spec['behaviour']} is not written for a {pname}")
    out: dict = {}
    for n, ch in (spec.get("channels") or {}).items():
        try:
            n = int(n)
        except (TypeError, ValueError):
            raise HouseError(f"{where}: channel {n!r} — 1 to {profile['channels']}") from None
        if not 1 <= n <= profile["channels"]:
            raise HouseError(f"{where}: channel {n} — a {pname} has {profile['channels']}")
        ch = dict(ch or {})
        target = {k: ch.pop(k) for k in ("role", "thing") if k in ch}
        if len(target) != 1:
            raise HouseError(f"{where}: channel {n} names exactly one of role: / thing:")
        kind = "light"
        if "thing" in target:
            t = house.thing(target["thing"])
            kind = "media" if t["kind"] in verbs.MEDIA_KINDS else "light"
        base = {word(k): words(v) for k, v in ((b.get("channels") or {}).get(kind) or {}).items()}
        if "double" in ch and not isinstance(ch["double"], dict):
            ch["double"] = {"look": ch["double"]}
        if "walk" in ch and not isinstance(ch["walk"], dict):
            ch["hold"] = {"walk": ch.pop("walk")}
        ch = {word(k): (words(v) if isinstance(v, dict) else v) for k, v in ch.items()}
        for k in ch:
            if k not in profile["gestures"]:
                raise HouseError(
                    f"{where}: channel {n} gesture {k!r} — a wheel has "
                    f"{', '.join(profile['gestures'])}"
                )
        base.update(ch)
        # the channel's target reaches every verb of the channel that names
        # none of its own (a double on the stars keeps its `role: night`)
        for g, verb in base.items():
            if isinstance(verb, dict) and "role" not in verb and "thing" not in verb:
                base[g] = {**target, **verb}
        out[n] = {"target": target, "kind": kind, "gestures": base}
    return out


def pin_lifts(gestures: dict) -> bool:
    return any("pin" in v for v in gestures.values() if isinstance(v, dict))


def sequence(house, area: dict, verb: dict, ctx_kw: dict, lifts: bool, spec=None) -> list[dict]:
    kw = dict(ctx_kw)
    if spec and spec.get("looks"):
        kw["modifiers"] = {**kw.get("modifiers", {}), "looks": list(spec["looks"])}
    ctx = verbs.Ctx(house, area["id"], **kw)
    out = verbs.render(verb, ctx)
    if lifts and out:
        out = [
            {
                "action": "input_boolean.turn_off",
                "target": {"entity_id": f"input_boolean.{area['id']}_pinned"},
            }
        ] + out
    return out


def base_topic_of(house, thing: dict) -> str:
    for c in house.coordinators():
        if any(t["id"] == thing["id"] for t in c["things"]):
            return c["base_topic"]
    return "zigbee2mqtt"


def plan_styrbar(house, area, thing, spec, pname, profile) -> dict:
    gestures = gestures_of(house, area, thing, spec, pname, profile)
    lifts = pin_lifts(gestures)
    topic = f"{base_topic_of(house, thing)}/{thing['id']}/action"
    triggers = [
        {"trigger": "mqtt", "topic": topic, "payload": raw, "id": word}
        for raw, word in profile["raw"].items()
    ]
    branches = []
    for word, verb in gestures.items():
        seq = sequence(house, area, verb, {}, lifts, spec)
        if seq:
            branches.append({"conditions": [{"condition": "trigger", "id": word}], "sequence": seq})
    return {"triggers": triggers, "conditions": [], "branches": branches}


def matter_guard(entities: list[str]) -> list[dict]:
    """An event entity's state is the last event's time: a new time is a new
    press; going unavailable and back is not, nor is a restart."""
    return [
        {
            "condition": "template",
            "value_template": (
                "{{ trigger.from_state is not none and trigger.to_state.state not in "
                "['unavailable', 'unknown'] and trigger.from_state.state not in "
                "['unavailable', 'unknown'] and "
                "trigger.to_state.state != trigger.from_state.state }}"
            ),
        }
    ]


def event_is(kind: str) -> dict:
    return {
        "condition": "template",
        "value_template": f"{{{{ trigger.to_state.attributes.event_type == '{kind}' }}}}",
    }


def plan_wheel(house, area, thing, spec, pname, profile) -> dict:
    channels = channels_of(house, area, thing, spec, pname, profile)
    triggers, branches = [], []
    lifts = any(pin_lifts(c["gestures"]) for c in channels.values())
    for n, ch in sorted(channels.items()):
        up, down, button = 3 * n - 2, 3 * n - 1, 3 * n
        g = ch["gestures"]
        for ep in (up, down, button):
            triggers.append(
                {"trigger": "state", "entity_id": f"event.{thing['id']}_{ep}", "id": f"ep{ep}"}
            )
        if "turn" in g:
            for ep, sign in ((up, 1), (down, -1)):
                seq = sequence(house, area, g["turn"], {"k": K, "sign": sign}, lifts, spec)
                if seq:
                    branches.append(
                        {"conditions": [{"condition": "trigger", "id": f"ep{ep}"}], "sequence": seq}
                    )
        for raw, word in profile["clicks"].items():
            if word in g:
                seq = sequence(house, area, g[word], {}, lifts, spec)
                if seq:
                    branches.append(
                        {
                            "conditions": [
                                {"condition": "trigger", "id": f"ep{button}"},
                                event_is(raw),
                            ],
                            "sequence": seq,
                        }
                    )
        if "hold" in g:
            seq = sequence(house, area, g["hold"], {}, lifts, spec)
            if seq:
                branches.append(
                    {
                        "conditions": [
                            {"condition": "trigger", "id": f"ep{button}"},
                            event_is("long_press"),
                        ],
                        "sequence": seq,
                    }
                )
    return {"triggers": triggers, "conditions": matter_guard([]), "branches": branches}


def plan_dual(house, area, thing, spec, pname, profile) -> dict:
    gestures = gestures_of(house, area, thing, spec, pname, profile)
    lifts = pin_lifts(gestures)
    triggers, branches = [], []
    for ep, side in profile["buttons"].items():
        triggers.append(
            {"trigger": "state", "entity_id": f"event.{thing['id']}_{ep}", "id": f"ep{ep}"}
        )
        for raw, suffix in profile["clicks"].items():
            word = side + suffix
            if word in gestures:
                seq = sequence(house, area, gestures[word], {}, lifts, spec)
                if seq:
                    branches.append(
                        {
                            "conditions": [
                                {"condition": "trigger", "id": f"ep{ep}"},
                                event_is(raw),
                            ],
                            "sequence": seq,
                        }
                    )
        word = side + "_hold"
        if word in gestures:
            seq = sequence(house, area, gestures[word], {}, lifts, spec)
            if seq:
                branches.append(
                    {
                        "conditions": [
                            {"condition": "trigger", "id": f"ep{ep}"},
                            event_is("long_press"),
                        ],
                        "sequence": seq,
                    }
                )
    return {"triggers": triggers, "conditions": matter_guard([]), "branches": branches}


PLANNERS = {"styrbar": plan_styrbar, "bilresa_wheel": plan_wheel, "bilresa_dual": plan_dual}


def hands_plan(house, area: dict) -> list[dict]:
    """One automation per remote of the room that has a `hands:` line."""
    if not house.has_pack("hands"):
        return []
    out = []
    for thing_id, spec in (area.get("hands") or {}).items():
        thing = house.thing(thing_id)
        found = profile_of(thing)
        if found is None:
            raise HouseError(
                f"{area['id']}: hands {thing_id}: no gesture profile for model "
                f"{thing.get('model')!r}"
            )
        pname, profile = found
        plan = PLANNERS[pname](house, area, thing, spec, pname, profile)
        label = thing.get("label") or thing["id"]
        aid = f"regie_{area['id']}_{thing_id}_hands"
        out.append(
            {
                "remote": thing_id,
                "profile": pname,
                "alias": f"{area['label']} — {label}",
                "automation": {
                    "id": aid,
                    "alias": f"{area['label']} — {label}",
                    "description": (
                        f"the hands of {label}: behaviour {spec.get('behaviour')} on a {pname} — "
                        f"rooms/{area['id']}.yml hands: (La Régie, pack hands)"
                    ),
                    "mode": "restart",
                    "triggers": plan["triggers"],
                    "conditions": plan["conditions"],
                    "actions": [{"choose": plan["branches"]}],
                },
            }
        )
    return out


def check_hands(house, area: dict) -> tuple[list[str], list[str]]:
    """What check says of a room's `hands:`: errors it refuses, hints it prints."""
    errors: list[str] = []
    hints: list[str] = []
    if not house.has_pack("hands"):
        return errors, hints
    for thing_id, spec in (area.get("hands") or {}).items():
        where = f"{area['id']}: hands {thing_id}"
        t = next((x for x in house.things if x["id"] == thing_id), None)
        if t is None or t["area"] != area["id"] or t["kind"] != "remote":
            errors.append(f"{where}: not a remote of this room")
            continue
        if not isinstance(spec, dict) or not spec.get("behaviour"):
            errors.append(f"{where}: says no behaviour:")
            continue
        found = profile_of(t)
        if found is None:
            errors.append(f"{where}: no gesture profile for model {t.get('model')!r}")
            continue
        pname, profile = found
        for lk in spec.get("looks") or []:
            if lk not in (area.get("scenes") or {}):
                errors.append(f"{where}: looks names {lk!r} — the room has none")
        try:
            if pname == "bilresa_wheel":
                channels = channels_of(house, area, t, spec, pname, profile)
                if not channels:
                    hints.append(f"{where}: a wheel with no channels: drives nothing yet")
                verb_sets = [(f"channel {n}", c["gestures"]) for n, c in channels.items()]
                for n, c in channels.items():
                    if "role" in c["target"]:
                        role = c["target"]["role"]
                        if role not in house.declared_roles(area):
                            errors.append(f"{where}: channel {n} role {role!r} — the room has none")
                        elif not house.roles_in(area["id"]).get(role):
                            hints.append(
                                f"{where}: channel {n} role {role} filled by nothing yet — "
                                "renders nothing"
                            )
            else:
                verb_sets = [("", gestures_of(house, area, t, spec, pname, profile))]
        except HouseError as exc:
            errors.append(str(exc) if str(exc).startswith(area["id"]) else f"{where}: {exc}")
            continue
        for prefix, gestures in verb_sets:
            for word, verb in gestures.items():
                w = f"{where}{' ' + prefix if prefix else ''} {word}"
                errors += check_verb(house, area, verb, w, hints)
    # an unfilled role is one hint, not one per gesture that names it
    seen: set[str] = set()
    kept: list[str] = []
    for h in hints:
        key = h.split(": role ", 1)[1] if ": role " in h and "filled by nothing" in h else h
        if key in seen:
            continue
        seen.add(key)
        kept.append(h)
    return errors, kept


def check_verb(house, area: dict, verb: dict, where: str, hints: list[str]) -> list[str]:
    errors: list[str] = []
    if not isinstance(verb, dict):
        return [f"{where}: a gesture takes a verb ({{ look: … }}), not {verb!r}"]
    names = [v for v in verbs.VERBS if v in verb]
    if len(names) != 1:
        return [f"{where}: says {len(names)} verb(s) — exactly one of {', '.join(verbs.VERBS)}"]
    name = names[0]
    known = {a["id"]: a for a in house.areas}
    if "room" in verb and verb["room"] not in known:
        errors.append(f"{where}: room {verb['room']!r} — no such room")
    if isinstance(verb.get("rooms"), list):
        for r in verb["rooms"]:
            if r not in known:
                errors.append(f"{where}: rooms names {r!r} — no such room")
    if name == "look" or (name == "toggle" and "role" not in verb and "thing" not in verb):
        look = verb[name]
        looks = look if isinstance(look, list) else [look]
        ctx = verbs.Ctx(house, area["id"])
        rooms = verbs.rooms_of(ctx, verb, look if not isinstance(look, list) else None)
        for lk in looks:
            if lk is True or lk in verbs.LOOK_WORDS:
                continue
            for r in rooms:
                if r in known and lk not in (known[r].get("scenes") or {}):
                    errors.append(f"{where}: look {lk!r} — {r} has none")
    if name == "level" and verb["level"] not in ("up", "down", "step"):
        errors.append(f"{where}: level takes up, down or step")
    if name == "walk" and verb["walk"] not in ("whites", "colours"):
        errors.append(f"{where}: walk takes whites or colours")
    if name in ("level", "walk", "toggle") and "role" in verb:
        room = verb.get("room", area["id"])
        if verb["role"] not in house.declared_roles(known[room]):
            errors.append(f"{where}: role {verb['role']!r} — {room} has none")
        elif not house.roles_in(room).get(verb["role"]):
            hints.append(f"{where}: role {verb['role']} filled by nothing yet — renders nothing")
    if name == "mode":
        m = house.modes()
        if not m or verb["mode"] not in {x["id"] for x in m["modes"]}:
            errors.append(f"{where}: mode {verb['mode']!r} — not in modes.yml")
    if name == "story" and verb["story"] not in {x["id"] for x in house.scenarios}:
        errors.append(f"{where}: story {verb['story']!r} — no such scenario")
    if name == "pin":
        room = verb.get("room", area["id"])
        if not house.kinds_in(room).get("motion"):
            errors.append(f"{where}: pin — {room} has no sensor to hold back")
    if name in ("volume", "media"):
        t = next((x for x in house.things if x["id"] == verb.get("thing")), None)
        if t is None or t["kind"] not in verbs.MEDIA_KINDS:
            errors.append(f"{where}: {name} needs thing: a speaker, a tv or a receiver")
        elif not house.entity(t):
            errors.append(f"{where}: {verb['thing']} has no player entity")
    if name == "media" and verb["media"] not in verbs.MEDIA:
        errors.append(f"{where}: media takes {', '.join(verbs.MEDIA)}")
    if name == "say":
        hints.append(f"{where}: say — no verb renders it yet (the stories); the gesture waits")
    if "then" in verb:
        errors += check_verb(house, area, verb["then"], where + " then", hints)
    return errors
