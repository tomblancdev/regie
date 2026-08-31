"""The modes pack — the state machine from modes.yml."""

import yaml


def load(rendered):
    return yaml.safe_load(
        (rendered / "home-assistant/packages/modes.yaml").read_text(encoding="utf-8")
    )


def test_the_selector_and_one_transition_per_mode_that_has_something_to_do(rendered):
    pkg = load(rendered)
    assert pkg["input_select"]["house_mode"]["options"] == [
        "home",
        "night",
        "away",
        "guest",
        "cinema",
    ]
    assert "initial" not in pkg["input_select"]["house_mode"], "seeded once, the UI's choice kept"
    autos = {a["id"]: a for a in pkg["automation"]}
    # home → every room with a filled role takes its default; night → its night scene, else off
    home = autos["regie_mode_home"]
    assert home["triggers"] == [
        {"trigger": "state", "entity_id": "input_select.house_mode", "to": "home"}
    ]
    assert {"action": "script.turn_on", "target": {"entity_id": "script.living_default"}} in home[
        "actions"
    ]
    night = autos["regie_mode_night"]
    targets = [a["target"]["entity_id"] for a in night["actions"]]
    assert "script.living_night" in targets, "the living room has a night scene"
    assert "script.hall_off" in targets, "the hall has none: the mode's `else: off`"
    away = autos["regie_mode_away"]
    assert all(a["target"]["entity_id"].endswith("_off") for a in away["actions"])
    assert "regie_mode_guest" not in autos, "no room has a guest scene and no else: nothing to do"
    cinema = autos["regie_mode_cinema"]
    assert [a["target"]["entity_id"] for a in cinema["actions"]] == [
        "script.living_cinema",
        "script.bedroom_a_evening",
    ], "the living room's cinema scene; bedroom A's line points at its evening; the hall none"


def test_the_clock_rules_move_the_mode_only_from_the_modes_named(rendered):
    autos = {a["id"]: a for a in load(rendered)["automation"]}
    night = autos["regie_clock_night"]
    assert night["triggers"] == [
        {"trigger": "state", "entity_id": "sensor.house_period", "to": "night"}
    ]
    assert night["conditions"] == [
        {"condition": "state", "entity_id": "input_select.house_mode", "state": ["home"]}
    ]
    assert night["actions"][0]["data"] == {"option": "night"}
    morning = autos["regie_clock_morning"]
    assert morning["conditions"][0]["state"] == ["night"]


def test_the_defaults_follow_in_lit_rooms(rendered):
    autos = {a["id"]: a for a in load(rendered)["automation"]}
    follow = autos["regie_defaults_follow"]
    assert follow["triggers"][0]["entity_id"] == ["sensor.house_period", "sensor.daylight"]
    assert follow["conditions"][0]["state"] == ["home"]
    rooms = [s["if"][0]["entity_id"] for s in follow["actions"]]
    assert "light.living_lights" in rooms and "light.hall_lights" in rooms


def test_a_house_with_no_filled_role_still_gets_the_machine(house_with, secrets, tmp_path):
    from regie.house import load_house
    from regie.render import render

    path = house_with(lambda d: [(t.pop("role", None), t.pop("at", None)) for t in d["things"]])
    render(load_house(path), tmp_path, secrets)
    pkg = yaml.safe_load((tmp_path / "home-assistant/packages/modes.yaml").read_text())
    assert pkg["input_select"]["house_mode"]["options"][0] == "home"
    ids = [a["id"] for a in pkg["automation"]]
    assert ids == [
        "regie_clock_night",
        "regie_clock_morning",
        "regie_presence_away",
        "regie_presence_home",
    ], "the clock rules and presence need no light"


def test_the_house_card(rendered):
    dash = yaml.safe_load(
        (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    )
    card = next(c for c in dash["views"][0]["cards"] if c.get("title") == "Maison")
    ids = [e["entity"] for e in card["entities"]]
    assert ids[:3] == ["input_select.house_mode", "sensor.house_period", "sensor.daylight"]
    assert "input_datetime.house_period_evening" in ids


def test_a_mode_with_scene_none_is_a_pure_state_flip(house_with, secrets, tmp_path):
    """H35: entering `home` only ends `away` — no automation, no light; and
    `follow` still counts it (the mode has no opinion to fight)."""
    from regie.house import load_house
    from regie.render import render

    path = house_with(lambda d: None)  # the modes live in modes.yml (include)
    modes_file = path.parent / "modes.yml"
    modes_file.write_text(
        modes_file.read_text(encoding="utf-8").replace(
            'home:   { label: "À la maison", scene: default }',
            'home:   { label: "À la maison", scene: none }',
        ),
        encoding="utf-8",
    )
    house = load_house(path)
    render(house, tmp_path, secrets)
    pkg = yaml.safe_load((tmp_path / "home-assistant/packages/modes.yaml").read_text())
    autos = {a["id"]: a for a in pkg["automation"]}
    assert "regie_mode_home" not in autos, "nothing to do: no scene, no automation"
    assert autos["regie_defaults_follow"]["conditions"][0]["state"] == ["home"]


def test_presence_drives_home_and_away_behind_its_kill_switch(rendered):
    pkg = load(rendered)
    assert "presence_drives_mode" in pkg["input_boolean"]
    autos = {a["id"]: a for a in pkg["automation"]}
    away = autos["regie_presence_away"]
    assert away["triggers"][0] == {
        "trigger": "numeric_state",
        "entity_id": "zone.home",
        "below": 1,
        "for": "00:05:00",
    }
    states = [c["state"] for c in away["conditions"]]
    assert "on" in states and "home" in states
    home = autos["regie_presence_home"]
    assert home["conditions"][1]["state"] == "away"
    assert home["actions"][0]["data"] == {"option": "home"}
