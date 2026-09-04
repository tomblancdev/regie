"""The when pack — a thing's state picks a look (0.18, the grammar's step 2)."""

import pytest
import yaml

from regie.errors import HouseError
from regie.house import load_house

WAS = {"not_from": ["unavailable", "unknown"]}


def load(rendered, room):
    return yaml.safe_load(
        (rendered / f"home-assistant/packages/when_{room}.yaml").read_text(encoding="utf-8")
    )


def test_a_thing_that_speaks_gets_one_automation_behind_its_switch(rendered):
    pkg = load(rendered, "living")
    assert pkg["input_boolean"]["living_living_tv_when"]["name"] == (
        "Salon — living_tv choisit l'ambiance"
    )
    (auto,) = pkg["automation"]
    assert auto["id"] == "regie_living_living_tv_when" and auto["mode"] == "queued"
    assert auto["triggers"] == [
        {"trigger": "state", "entity_id": "media_player.living_tv", "to": "on", **WAS, "id": "r0"},
        {"trigger": "state", "entity_id": "media_player.living_tv", "to": "off", **WAS, "id": "r1"},
    ], "and never from unavailable: a restart of the brain is not the TV coming on"
    assert auto["conditions"] == [
        {"condition": "state", "entity_id": "input_boolean.living_living_tv_when", "state": "on"}
    ]
    on, off = auto["actions"][0]["choose"]
    assert on["conditions"] == [{"condition": "trigger", "id": "r0"}]
    assert on["sequence"] == [{"action": "script.living_cinema"}], "the look's own service"
    assert off["sequence"] == [
        {
            "action": "script.living_{{ states('input_select.living_look_before') }}",
            "continue_on_error": True,
        }
    ], "before: the room's memory gives the look back"


def test_the_houses_mode_speaks_too_and_asks_the_rooms_dark_signal(rendered):
    pkg = load(rendered, "hall")
    assert pkg["input_boolean"]["hall_mode_when"]["name"] == "Entrée — La maison choisit l'ambiance"
    (auto,) = pkg["automation"]
    assert auto["triggers"] == [
        {
            "trigger": "state",
            "entity_id": "input_select.house_mode",
            "to": "home",
            **WAS,
            "id": "r0",
        }
    ]
    (branch,) = auto["actions"][0]["choose"]
    assert {"condition": "state", "entity_id": "binary_sensor.hall_dark", "state": "on"} in branch[
        "conditions"
    ], "the light rule: not a hand, so it asks first"
    assert branch["sequence"] == [{"action": "script.hall_default"}]


def test_a_source_is_heard_twice_and_rooms_take_the_look_together(house_with, secrets, tmp_path):
    from regie.render import render

    path = house_with(lambda d: None)
    room = path.parent / "rooms" / "living.yml"
    room.write_text(
        room.read_text(encoding="utf-8").replace(
            "  - { thing: living_tv, is: on,  look: cinema }\n",
            '  - { thing: living_tv, source: "TV Audio", look: default, rooms: [living, hall] }\n'
            "  - { thing: living_tv, is: on, mode: cinema }\n",
        ),
        encoding="utf-8",
    )
    render(load_house(path), tmp_path, secrets)
    pkg = yaml.safe_load(
        (tmp_path / "home-assistant/packages/when_living.yaml").read_text(encoding="utf-8")
    )
    (auto,) = pkg["automation"]
    src = [t for t in auto["triggers"] if t["id"] == "r0"]
    assert src == [
        {
            "trigger": "state",
            "entity_id": "media_player.living_tv",
            "attribute": "source",
            "to": "TV Audio",
            **WAS,
            "id": "r0",
        },
        {"trigger": "state", "entity_id": "media_player.living_tv", "to": "on", **WAS, "id": "r0"},
    ], "the attribute moving to it, and the thing coming on while it reads it"
    first, second, _ = auto["actions"][0]["choose"]
    assert first["conditions"][1]["value_template"] == (
        "{{ state_attr('media_player.living_tv', 'source') == 'TV Audio' }}"
    )
    assert first["sequence"] == [
        {"action": "script.living_default"},
        {"action": "script.hall_default"},
    ]
    assert second["sequence"] == [
        {
            "action": "input_select.select_option",
            "target": {"entity_id": "input_select.house_mode"},
            "data": {"option": "cinema"},
        }
    ], "mode is a verb on a thing's row"


def test_the_switches_sit_on_the_rooms_settings_page(rendered):
    body = (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    assert "input_boolean.living_living_tv_when" in body and "input_boolean.hall_mode_when" in body


@pytest.mark.parametrize(
    ("row", "said"),
    [
        ("{ thing: living_tv, is: on, look: disco }", "look 'disco' — living has none"),
        ("{ thing: hall_motion, is: on, look: cinema }", "not one of this room's"),
        ("{ thing: living_tv, look: cinema }", "exactly one of `is:` / `source:`"),
        ("{ thing: living_tv, is: on }", "says 0 verb(s)"),
        ("{ mode: cinema, look: cinema, story: nope }", "says 2 verb(s)"),
        ("{ mode: disco, look: default }", "mode 'disco' — not in modes.yml"),
        ("{ thing: living_tv, is: on, story: nope }", "story 'nope' — no such scenario"),
        ("{ thing: living_tv, is: on, look: cinema, rooms: [attic] }", "rooms names 'attic'"),
        ("{ is: on, look: cinema }", "neither `thing:` nor `mode:`"),
    ],
)
def test_check_refuses_a_row_the_house_cannot_keep(house_with, row, said):
    path = house_with(lambda d: None)
    room = path.parent / "rooms" / "living.yml"
    room.write_text(
        room.read_text(encoding="utf-8").replace(
            "  - { thing: living_tv, is: on,  look: cinema }\n", f"  - {row}\n"
        ),
        encoding="utf-8",
    )
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert said in str(exc.value)


def test_without_the_pack_a_when_block_is_refused_by_the_schema(house_with):
    path = house_with(lambda d: d["packs"].remove("when"))
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "'when' was unexpected" in str(exc.value)
