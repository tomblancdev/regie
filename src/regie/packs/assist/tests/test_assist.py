"""The assist pack — the ceiling's sensor, the knock, the doorman, what Assist sees."""

import pytest
import yaml

from regie.errors import HouseError
from regie.house import load_house


def _yaml(path):
    return yaml.safe_load(path.read_text(encoding="utf-8").replace("!secret ", ""))


def test_the_ceiling_renders_the_sensor_and_the_knock(rendered):
    pkg = _yaml(rendered / "home-assistant/packages/assist.yaml")
    (rest,) = pkg["rest"]
    assert rest["resource"] == "http://192.0.2.60:8080/api/targets/llm"
    assert rest["scan_interval"] == 30
    (sensor,) = rest["binary_sensor"]
    assert sensor["name"] == "tower_awake" and sensor["unique_id"] == "regie_tower_awake"
    assert sensor["value_template"] == "{{ value_json.up }}"
    # a REST binary_sensor takes no json_attributes: HA refuses the whole
    # rest: block for one (2026.8, read live 2026-09-06 — no tower_awake at all)
    assert "json_attributes" not in sensor
    knock = pkg["rest_command"]["knock_ceiling"]
    assert knock["url"] == "http://192.0.2.60:8080/api/targets/llm/wake"
    assert knock["method"] == "post"
    # the header is a !secret reference to the bearer the secrets file carries
    assert knock["headers"]["authorization"] == "watchman_token_bearer"
    assert "reason" in knock["payload"]


def test_the_secrets_carry_the_bearer_and_the_house_needs_the_token(rendered, witness):
    secrets = yaml.safe_load((rendered / "home-assistant/secrets.yaml").read_text())
    assert secrets["watchman_token_bearer"] == "Bearer example-watchman-token"
    assert "watchman_token" in witness.secret_names()


def test_the_porter_is_configured_and_its_component_laid_down(rendered):
    porter = _yaml(rendered / "home-assistant/packages/porter.yaml")["regie"]["porter"]
    assert porter["llm"] == "ollama"
    assert porter["awake"] == "binary_sensor.tower_awake"
    assert porter["knock"] == "rest_command.knock_ceiling"
    # the witness writes one line of its own; the others are the labels' (fr)
    assert (
        porter["replies"]["waking"] == "Je réveille la tour — compte deux minutes et redemande-moi."
    )
    assert porter["replies"]["unknown"].startswith("Le serveur ne répond pas")
    assert porter["name"] == "Le Portier"
    component = rendered / "home-assistant/custom_components/regie"
    assert {p.name for p in component.iterdir()} == {
        "manifest.json",
        "__init__.py",
        "porter.py",
        "conversation.py",
        # 0.39: the component ships with every house, pack assist or not — the
        # walker is its second tenant and needs no pack to be asked for
        "walk.py",
        "walker.py",
        # 0.42: the palette's three — the arithmetic the engine reads by path,
        # the store behind its four websocket doors, the sensor
        "palette.py",
        "palettes.py",
        "sensor.py",
        "services.yaml",
    }


def test_the_house_resolves_every_default(witness):
    a = witness.assist()
    assert a["llm"]["url"] == "http://192.0.2.50:11434" and a["llm"]["model"] == "example:9b"
    assert a["llm"]["context"] == 8192 and a["llm"]["history"] == 20 and a["llm"]["think"] is False
    assert a["llm"]["instructions"].startswith("Answer in French")
    assert a["ceiling"]["watchman"]["every"] == 30
    assert a["expose"] == {"lights": "roles", "scenes": True, "also": [], "never": []}
    assert a["pipeline"] == {"name": "Maison témoin", "prefer_local": True}


def test_what_assist_sees_is_the_rooms_by_role_never_a_bulb(witness):
    expose, hide = witness.exposure_plan()
    # the room's lights and its role groups
    assert {"light.living_lights", "light.living_main", "light.living_lamp"} <= expose
    # the looks under their labels; the mode and the palette of the day
    assert {"script.living_cinema", "script.living_night", "script.hall_off"} <= expose
    assert {"input_select.house_mode", "input_boolean.house_palette"} <= expose
    # never a bulb, a place group, the mesh's room group, a walk, the room's default
    assert {"light.living_ceiling", "light.living_floor_lamp", "light.living"} <= hide
    assert "light.living_main_front" in hide
    assert {"script.living_evening_drift", "script.living_default"} <= hide
    # a parking room's bulbs neither
    assert "light.spare_bulb" in hide
    assert not (expose & hide)


def test_what_assist_sees_belongs_to_a_room(witness):
    """The exposed groups and looks carry their room; a role group speaks as
    its label, the room's group as the word for lights (aliases, never a
    name); a parking room places nothing."""
    rooms = witness.exposure_rooms()
    assert rooms["light.living_main"] == {"area": "living", "alias": "Plafond"}
    assert rooms["light.living_lamp"] == {"area": "living", "alias": "Lampadaire"}
    assert rooms["light.living_lights"] == {"area": "living", "alias": "Lumières"}
    assert rooms["script.living_cinema"] == {"area": "living", "alias": None}
    assert not any(v["area"] == "spare" for v in rooms.values())
    expose, _ = witness.exposure_plan()
    assert set(rooms) <= expose


def test_the_policy_words_move_the_plan(house_with):
    def rooms_only(d):
        d["assist"]["expose"] = {
            "lights": "rooms",
            "scenes": False,
            "never": ["light.living_lights"],
        }

    house = load_house(house_with(rooms_only))
    expose, hide = house.exposure_plan()
    assert "light.living_main" in hide and "light.living_lights" not in expose
    assert "script.living_cinema" in hide

    def every_bulb(d):
        d["assist"]["expose"] = {"lights": "all", "also": ["switch.kitchen_plug"]}

    house = load_house(house_with(every_bulb))
    expose, _ = house.exposure_plan()
    assert {"light.living_ceiling", "switch.kitchen_plug"} <= expose


def test_the_pack_needs_its_block_and_the_block_its_pack(house_with):
    def no_block(d):
        d.pop("assist")

    with pytest.raises(HouseError, match="pack assist needs an `assist:` block"):
        load_house(house_with(no_block))

    def no_pack(d):
        d["packs"].remove("assist")

    # the block without the pack: a root key no fragment claims, refused
    with pytest.raises(HouseError, match="'assist' was unexpected"):
        load_house(house_with(no_pack))

    def neither(d):
        d["packs"].remove("assist")
        d.pop("assist")

    house = load_house(house_with(neither))
    assert house.assist() is None and "watchman_token" not in house.secret_names()
    assert house.exposure_plan() == (set(), set()) or house.exposure_plan()[0]


def test_no_ceiling_means_no_sensor_no_knock(house_with, secrets, tmp_path):
    from regie.render import render

    def always_up(d):
        d["assist"].pop("ceiling")

    house = load_house(house_with(always_up))
    render(house, tmp_path, secrets)
    assert "rest" not in (_yaml(tmp_path / "home-assistant/packages/assist.yaml") or {})
    porter = _yaml(tmp_path / "home-assistant/packages/porter.yaml")["regie"]["porter"]
    assert "awake" not in porter and "knock" not in porter
    assert "watchman_token" not in house.secret_names()


def test_a_wrong_policy_word_is_refused(house_with):
    def bulbs(d):
        d["assist"]["expose"] = {"lights": "bulbs"}

    with pytest.raises(HouseError, match="lights"):
        load_house(house_with(bulbs))


# --- the ears and the mouth (0.34) ------------------------------------------
def test_the_house_resolves_the_ears_the_mouth_and_the_mics(witness, house_with):
    # two doors (0.34): one verb each, the voice on the mouth's
    a = witness.assist()
    assert a["voice"]["doors"] == [
        {
            "url": "tcp://192.0.2.70:10300",
            "host": "192.0.2.70",
            "port": 10300,
            "kinds": ["stt"],
            "voice": None,
        },
        {
            "url": "tcp://192.0.2.71:10200",
            "host": "192.0.2.71",
            "port": 10200,
            "kinds": ["tts"],
            "voice": "fr_FR-siwis-medium",
        },
    ]
    assert a["mics"] == [{"device": "Téléphone témoin", "room": "living"}]

    # one door for both verbs (0.37): the bridge in front of a standard speech server
    def one_door(d):
        d["assist"]["voice"] = {"url": "tcp://192.0.2.73:10300", "voice": "fr_FR-siwis-medium"}

    a = load_house(house_with(one_door)).assist()
    assert a["voice"]["doors"] == [
        {
            "url": "tcp://192.0.2.73:10300",
            "host": "192.0.2.73",
            "port": 10300,
            "kinds": ["stt", "tts"],
            "voice": "fr_FR-siwis-medium",
        }
    ]


def test_no_voice_means_no_engines_and_no_mics(house_with):
    def typed(d):
        d["assist"].pop("voice")
        d["assist"].pop("mics")

    a = load_house(house_with(typed)).assist()
    assert a["voice"] is None and a["mics"] == []


def test_ears_without_a_mouth_are_refused(house_with):
    def deaf(d):
        d["assist"]["voice"].pop("tts")

    with pytest.raises(HouseError, match="tts"):
        load_house(house_with(deaf))

    def not_a_door(d):
        d["assist"]["voice"]["stt"]["url"] = "http://192.0.2.70:10300"

    with pytest.raises(HouseError, match="url"):
        load_house(house_with(not_a_door))

    # the two forms never mix: one url AND a door per verb is neither
    def both_forms(d):
        d["assist"]["voice"]["url"] = "tcp://192.0.2.73:10300"

    with pytest.raises(HouseError, match="url"):
        load_house(house_with(both_forms))


def test_a_mic_in_no_room_of_the_house_is_refused(house_with):
    def attic(d):
        d["assist"]["mics"] = [{"device": "Téléphone témoin", "room": "attic"}]

    with pytest.raises(HouseError, match="not a room of the house"):
        load_house(house_with(attic))
