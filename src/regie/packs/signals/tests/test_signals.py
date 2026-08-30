"""The signals pack — the semantic sensors, from the modes file and the things."""

import yaml


def test_the_periods_are_helpers_and_the_period_sensor_reads_them(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/signals.yaml").read_text(encoding="utf-8")
    )
    helpers = pkg["input_datetime"]
    assert list(helpers) == [
        "house_period_morning",
        "house_period_day",
        "house_period_evening",
        "house_period_night",
    ]
    assert helpers["house_period_morning"] == {
        "name": "Début — Matin",
        "has_date": False,
        "has_time": True,
        "icon": "mdi:clock-outline",
    }
    assert "initial" not in helpers["house_period_morning"], "the UI's value is kept"
    period = pkg["template"][0]
    assert {"trigger": "time_pattern", "minutes": "/1"} in period["triggers"]
    assert {"trigger": "state", "entity_id": "input_datetime.house_period_night"} in period[
        "triggers"
    ]
    state = period["sensor"][0]["state"]
    assert "['morning', 'day', 'evening', 'night']" in state and "namespace(p='night')" in state


def test_daylight_night_occupied_quiet(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/signals.yaml").read_text(encoding="utf-8")
    )
    block = pkg["template"][1]
    daylight = block["sensor"][0]
    assert daylight["name"] == "daylight" and "e < -6" in daylight["state"]
    assert "e > 10" in daylight["state"]
    names = {b["name"]: b for b in block["binary_sensor"]}
    assert names["night"]["state"] == "{{ is_state('sensor.house_period', 'night') }}"
    assert (
        names["house_occupied"]["state"] == "{{ states('input_select.house_mode') not in [away] }}"
    )
    assert (
        names["house_quiet"]["state"] == "{{ states('input_select.house_mode') in [night, away] }}"
    )
    assert names["hall_occupied"]["state"] == "{{ is_state('binary_sensor.hall_motion', 'on') }}"
    assert "living_occupied" not in names, "no motion thing there: no signal, never 'off'"


def test_no_modes_file_no_signals(house_with, secrets, tmp_path):
    from regie.house import load_house
    from regie.render import render

    path = house_with(lambda d: d["include"].pop("modes"))
    render(load_house(path), tmp_path, secrets)
    assert not (tmp_path / "home-assistant/packages/signals.yaml").exists()
