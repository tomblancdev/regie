"""The hands pack — a remote's gestures become verbs (0.19, step 3)."""

import pytest
import yaml

from regie.errors import HouseError
from regie.house import load_house


def load(rendered, room):
    return yaml.safe_load(
        (rendered / f"home-assistant/packages/hands_{room}.yaml").read_text(encoding="utf-8")
    )


WHEEL = {
    "id": "bedroom_a_wheel",
    "area": "bedroom_a",
    "kind": "remote",
    "via": "matter",
    "vendor": "IKEA of Sweden",
    "model": "BILRESA scroll wheel",
    "serial": "EX-000003",
}
DUAL = {
    "id": "hall_button",
    "area": "hall",
    "kind": "remote",
    "via": "matter",
    "vendor": "IKEA of Sweden",
    "model": "BILRESA dual button",
    "serial": "EX-000004",
}


def matter_hands(house_with, secrets, tmp_path, hall_hands=None):
    """The witness plus a wheel at the bed and a dual button by the hall's
    door (Matter things), each with its hands: line, rendered."""
    from regie.render import render

    path = house_with(lambda d: d["things"].extend([WHEEL, DUAL]))
    bed = path.parent / "rooms" / "bedroom_a.yml"
    bed.write_text(
        bed.read_text(encoding="utf-8") + "hands:\n  bedroom_a_wheel: { behaviour: dimmer_wheel, "
        "channels: { 1: { role: main, double: [evening, night] } } }\n",
        encoding="utf-8",
    )
    hall = path.parent / "rooms" / "hall.yml"
    hall.write_text(
        hall.read_text(encoding="utf-8")
        + (
            hall_hands or "hands:\n  hall_button: { behaviour: bath_button, full: dim, dim: dim }\n"
        ),
        encoding="utf-8",
    )
    render(load_house(path), tmp_path, secrets)
    return tmp_path


def branches(auto):
    return {
        tuple(c.get("id") or c.get("value_template") for c in b["conditions"]): b["sequence"]
        for b in auto["actions"][0]["choose"]
    }


def test_a_styrbar_is_heard_on_its_topic_and_a_bound_one_is_completed_never_doubled(rendered):
    (auto,) = load(rendered, "living")["automation"]
    assert auto["id"] == "regie_living_living_remote_hands" and auto["mode"] == "restart"
    topics = {t["topic"] for t in auto["triggers"]}
    assert topics == {"zigbee2mqtt/living_remote/action"}, "the plain value Zigbee2MQTT republishes"
    ids = {t["payload"]: t["id"] for t in auto["triggers"]}
    assert ids["arrow_left_hold"] == "hold_left" and ids["brightness_stop"] == "release"
    assert ids["arrow_right_release"] == "release", "every release ends a hold: the restart"
    b = branches(auto)
    assert b[("on",)] == [{"action": "script.living_default"}], "the brain completes a bound on"
    assert b[("off",)] == [{"action": "script.living_off"}]
    assert ("hold_on",) not in b and ("hold_off",) not in b, "bound: the mesh dims, never doubled"
    assert ("release",) not in b, "a release has no verb: the trigger alone restarts"
    nxt = b[("right",)][0]["action"]
    assert nxt.startswith(
        "script.living_{% set looks = ['day', 'evening', 'cinema', 'night', 'party', 'today'] %}"
    )
    assert "(i + 1) % (looks | length)" in nxt and "(i + -1)" in b[("left",)][0]["action"]
    walk = b[("hold_left",)][0]["repeat"]
    assert walk["count"] == 30
    step = walk["sequence"][0]
    assert (
        step["target"] == {"entity_id": "light.living_main"} and "color_temp_kelvin" in step["data"]
    )
    assert step["data"]["transition"] == 2.0 and walk["sequence"][1] == {
        "delay": {"milliseconds": 2000}
    }, "a Zigbee colour needs 2 s to land"
    assert "hs_color" in b[("hold_right",)][0]["repeat"]["sequence"][0]["data"]


def test_a_wheel_reads_its_endpoints_by_channel_and_a_turn_by_its_notches(
    house_with, secrets, tmp_path
):
    rendered = matter_hands(house_with, secrets, tmp_path)
    (auto,) = load(rendered, "bedroom_a")["automation"]
    ents = [t["entity_id"] for t in auto["triggers"]]
    assert ents == ["event.bedroom_a_wheel_1", "event.bedroom_a_wheel_2", "event.bedroom_a_wheel_3"]
    assert (
        "trigger.to_state.state != trigger.from_state.state"
        in auto["conditions"][0]["value_template"]
    ), "a new time is a new press; unavailable and back is not"
    b = branches(auto)
    up = b[("ep1",)][0]
    assert up["target"] == {"entity_id": "light.bedroom_a_main"}, "the channel's role"
    assert (
        up["data"]["brightness_step_pct"]
        == "{{ 5 * (trigger.to_state.attributes.event_type.split('_')[-1] | int(1)) }}"
    )
    assert b[("ep2",)][0]["data"]["brightness_step_pct"].startswith("{{ -5 * ")
    click = b[("ep3", "{{ trigger.to_state.attributes.event_type == 'multi_press_1' }}")]
    assert click[0]["if"][0]["entity_id"] == "light.bedroom_a_main", "the channel's role"
    assert click[0]["then"] == [{"action": "script.bedroom_a_default"}], "the look of the hour"
    assert click[0]["else"] == [
        {"action": "light.turn_off", "target": {"entity_id": "light.bedroom_a_main"}}
    ], "or that light off"
    double = b[("ep3", "{{ trigger.to_state.attributes.event_type == 'multi_press_2' }}")]
    assert "['evening', 'night']" in double[0]["action"], "a list cycles"
    hold = b[("ep3", "{{ trigger.to_state.attributes.event_type == 'long_press' }}")]
    assert hold[0]["repeat"]["sequence"][1] == {"delay": {"milliseconds": 2000}}


def test_a_dual_button_top_and_bottom_with_the_behaviours_fields_filled(
    house_with, secrets, tmp_path
):
    rendered = matter_hands(house_with, secrets, tmp_path)
    (auto,) = load(rendered, "hall")["automation"]
    assert [t["entity_id"] for t in auto["triggers"]] == [
        "event.hall_button_1",
        "event.hall_button_2",
    ]
    b = branches(auto)
    press1 = "{{ trigger.to_state.attributes.event_type == 'multi_press_1' }}"
    press2 = "{{ trigger.to_state.attributes.event_type == 'multi_press_2' }}"
    assert b[("ep1", press1)] == [{"action": "script.hall_default"}]
    assert b[("ep2", press1)] == [{"action": "script.hall_off"}]
    assert b[("ep1", press2)] == [{"action": "script.hall_dim"}], (
        "the field `full` filled by the room"
    )
    hold = b[("ep1", "{{ trigger.to_state.attributes.event_type == 'long_press' }}")][0]["repeat"]
    assert hold["sequence"][0]["data"] == {"brightness_step_pct": 10}
    assert hold["sequence"][0]["target"] == {"entity_id": "light.hall_lights"}


def test_the_house_remote_and_the_pin(house_with, secrets, tmp_path):
    from regie.render import render

    path = house_with(lambda d: d["things"].extend([WHEEL, DUAL]))
    room = path.parent / "rooms" / "hall.yml"
    room.write_text(
        room.read_text(encoding="utf-8")
        + "hands:\n  hall_button: { behaviour: bath_button, full: dim, dim: dim, "
        "top_hold: { pin: true } }\n",
        encoding="utf-8",
    )
    living = path.parent / "rooms" / "living.yml"
    living.write_text(
        living.read_text(encoding="utf-8").replace(
            "  living_remote: { behaviour: room_remote }",
            "  living_remote: { behaviour: house_remote, welcome: [living, hall], "
            "open_plan: [living] }",
        ),
        encoding="utf-8",
    )
    render(load_house(path), tmp_path, secrets)
    hall = yaml.safe_load(
        (tmp_path / "home-assistant/packages/hands_hall.yaml").read_text(encoding="utf-8")
    )
    b = branches(hall["automation"][0])
    press1 = "{{ trigger.to_state.attributes.event_type == 'multi_press_1' }}"
    lift = {
        "action": "input_boolean.turn_off",
        "target": {"entity_id": "input_boolean.hall_pinned"},
    }
    assert b[("ep1", press1)] == [lift, {"action": "script.hall_default"}], (
        "any press lifts the pin"
    )
    hold = b[("ep1", "{{ trigger.to_state.attributes.event_type == 'long_press' }}")]
    assert hold == [
        lift,
        {"action": "input_boolean.turn_on", "target": {"entity_id": "input_boolean.hall_pinned"}},
    ]
    liv = yaml.safe_load(
        (tmp_path / "home-assistant/packages/hands_living.yaml").read_text(encoding="utf-8")
    )
    b = branches(liv["automation"][0])
    assert b[("on",)] == [
        {
            "action": "input_select.select_option",
            "target": {"entity_id": "input_select.house_mode"},
            "data": {"option": "home"},
        },
        {"action": "script.living_default"},
        {"action": "script.hall_default"},
    ], "mode home, then the welcome rooms' default"
    assert b[("hold_off",)][0]["action"] == "media_player.turn_off"
    assert b[("hold_off",)][0]["target"]["entity_id"] == [
        "media_player.living_tv",
        "media_player.living_speaker",
    ], "the deep off: every player of the named kinds"
    assert b[("hold_off",)][1]["data"] == {"option": "away"}
    assert {"action": "script.living_night"} in b[("right",)] and {
        "action": "script.hall_night"
    } not in b[("right",)], "rooms: all = every room that has the look"


@pytest.mark.parametrize(
    ("hands", "said"),
    [
        ("living_tv: { behaviour: room_remote }", "not a remote of this room"),
        ("living_remote: { behaviour: disco }", "behaviour 'disco' is not on the shelf"),
        (
            "living_remote: { behaviour: bath_button }",
            "is written for bilresa_dual, not for a styrbar",
        ),
        (
            "living_remote: { behaviour: room_remote, top: { look: day } }",
            "gesture 'top' — a styrbar has",
        ),
        (
            "living_remote: { behaviour: room_remote, left: { look: disco } }",
            "look 'disco' — living has none",
        ),
        (
            "living_remote: { behaviour: room_remote, left: { pin: true } }",
            "pin — living has no sensor",
        ),
        (
            "living_remote: { behaviour: room_remote, left: { volume: step } }",
            "volume needs thing: a speaker",
        ),
        ("living_remote: { behaviour: house_remote }", "field $welcome is empty"),
        (
            "living_remote: { behaviour: room_remote, left: { look: day, then: { story: nope } } }",
            "story 'nope' — no such scenario",
        ),
        (
            "living_remote: { behaviour: room_remote, left: { look: day, mode: home } }",
            "says 2 verb(s)",
        ),
    ],
)
def test_check_refuses_a_hand_the_house_cannot_keep(house_with, hands, said):
    path = house_with(lambda d: None)
    room = path.parent / "rooms" / "living.yml"
    room.write_text(
        room.read_text(encoding="utf-8").replace(
            "  living_remote: { behaviour: room_remote }", f"  {hands}"
        ),
        encoding="utf-8",
    )
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert said in str(exc.value)


def test_a_say_and_an_unfilled_role_are_hints_not_refusals(house_with):
    path = house_with(lambda d: None)
    room = path.parent / "rooms" / "living.yml"
    room.write_text(
        room.read_text(encoding="utf-8").replace(
            "  living_remote: { behaviour: room_remote }",
            "  living_remote: { behaviour: room_remote, left: { say: time_weather }, "
            "hold_left: { walk: whites, role: strip } }",
        ),
        encoding="utf-8",
    )
    h = load_house(path)
    assert any("say — no verb renders it yet" in x for x in h.hints)
    assert any("role strip filled by nothing yet — renders nothing" in x for x in h.hints)


def test_the_arrows_walk_the_looks_the_remote_names_and_alarm_never_by_default(
    house_with, secrets, tmp_path
):
    from regie.render import render

    path = house_with(lambda d: None)
    living = path.parent / "rooms" / "living.yml"
    text = living.read_text(encoding="utf-8")
    text = text.replace(
        "  living_remote: { behaviour: room_remote }",
        "  living_remote: { behaviour: room_remote, looks: [day, cinema] }",
    ).replace(
        "  night:   { main: off, lamp: { brightness: 5, ct: warm } }",
        "  night:   { main: off, lamp: { brightness: 5, ct: warm } }\n"
        "  alarm:   { main: { brightness: 100, ct: cool } }",
    )
    living.write_text(text, encoding="utf-8")
    render(load_house(path), tmp_path, secrets)
    pkg = yaml.safe_load(
        (tmp_path / "home-assistant/packages/hands_living.yaml").read_text(encoding="utf-8")
    )
    b = branches(pkg["automation"][0])
    assert "looks = ['day', 'cinema']" in b[("right",)][0]["action"], "the remote's own list"
    living.write_text(
        text.replace(", looks: [day, cinema]", ""),
        encoding="utf-8",
    )
    render(load_house(path), tmp_path, secrets)
    pkg = yaml.safe_load(
        (tmp_path / "home-assistant/packages/hands_living.yaml").read_text(encoding="utf-8")
    )
    b = branches(pkg["automation"][0])
    walk = b[("right",)][0]["action"]
    assert "'alarm'" not in walk and "'party'" in walk, "every look of the file but alarm"
    living.write_text(text.replace("looks: [day, cinema]", "looks: [day, disco]"), encoding="utf-8")
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "looks names 'disco' — the room has none" in str(exc.value)
