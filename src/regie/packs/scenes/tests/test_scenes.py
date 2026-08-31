"""The scenes pack — looks by role, from rooms/*.yml."""

import yaml


def load(rendered, room):
    return yaml.safe_load(
        (rendered / f"home-assistant/packages/scenes_{room}.yaml").read_text(encoding="utf-8")
    )


def test_a_scene_renders_for_its_filled_roles_and_waits_for_the_rest(rendered):
    pkg = load(rendered, "living")
    evening = pkg["script"]["living_evening"]
    (par,) = evening["sequence"]
    steps = {s["target"]["entity_id"][0]: s for s in par["parallel"]}
    assert steps["light.living_main"] == {
        "action": "light.turn_on",
        "target": {"entity_id": ["light.living_main"]},
        "data": {"brightness_pct": 60, "color_temp_kelvin": 2700},
    }
    assert steps["light.living_lamp"]["action"] == "light.turn_on"  # the role group
    assert "data" not in steps["light.living_lamp"], "a plain `on`"
    cinema = pkg["script"]["living_cinema"]
    ids = [s["target"]["entity_id"][0] for s in cinema["sequence"][0]["parallel"]]
    assert "light.living_strip" not in ids, "the strip role is filled by nothing yet"
    assert "waiting: strip" in cinema["description"]
    assert cinema["sequence"][0]["parallel"][1]["data"] == {
        "brightness_pct": 10,
        "color_temp_kelvin": 2700,
    }


def test_off_is_implicit_and_default_reads_its_sensor(rendered):
    pkg = load(rendered, "living")
    off = pkg["script"]["living_off"]
    actions = sorted(s["action"] for s in off["sequence"][0]["parallel"])
    assert actions == ["light.turn_off"] * 2, (
        "main and lamp; the screen and the speaker go off only when a scene names them"
    )
    default = pkg["script"]["living_default"]
    assert default["sequence"][0]["target"]["entity_id"] == (
        "script.living_{{ states('sensor.living_default') }}"
    )
    assert default["sequence"][0]["continue_on_error"] is True
    sensor = pkg["template"][0]["sensor"][0]
    assert sensor["name"] == "living_default"
    assert "input_select.living_look_" in sensor["state"], "the panel's selects drive it (W3b)"


def test_a_room_with_no_filled_role_keeps_its_default_sensor_only(rendered):
    pkg = load(rendered, "bedroom_b")
    assert "script" not in pkg, "no role filled: no script"
    assert pkg["template"][0]["sensor"][0]["name"] == "bedroom_b_default"


def test_a_room_with_neither_renders_nothing(rendered):
    assert not (rendered / "home-assistant/packages/scenes_kitchen.yaml").exists()


def test_a_color_and_a_switch_role(house_with, secrets, tmp_path):
    from regie.house import load_house
    from regie.render import render

    def mutate(d):
        for t in d["things"]:
            if t["id"] == "kitchen_plug":
                t["role"] = "lamp"
            if t["id"] == "kitchen_ceiling":
                t["role"] = "main"

    path = house_with(mutate)
    (path.parent / "rooms" / "kitchen.yml").write_text(
        "id: kitchen\nscenes:\n  glow: { lamp: on, main: { color: '#200000' } }\n",
        encoding="utf-8",
    )
    render(load_house(path), tmp_path, secrets)
    pkg = yaml.safe_load((tmp_path / "home-assistant/packages/scenes_kitchen.yaml").read_text())
    steps = pkg["script"]["kitchen_glow"]["sequence"][0]["parallel"]
    by = {s["action"]: s for s in steps}
    assert by["switch.turn_on"]["target"]["entity_id"] == ["switch.kitchen_plug"]
    assert by["light.turn_on"]["data"] == {"rgb_color": [32, 0, 0]}


def test_without_the_panel_the_sensor_bakes_the_table(house_with, secrets, tmp_path):
    from regie.house import load_house
    from regie.render import render as _render

    house = load_house(house_with(lambda d: d.update(controls={"panel": False})))
    _render(house, tmp_path, secrets)
    pkg = yaml.safe_load(
        (tmp_path / "home-assistant/packages/scenes_living.yaml").read_text(encoding="utf-8")
    )
    assert "input_select" not in pkg
    state = pkg["template"][0]["sensor"][0]["state"]
    assert "table" in state and "'dark': 'evening'" in state


def test_the_panel_renders_the_look_selects_and_the_sensor_reads_them(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/scenes_living.yaml").read_text(encoding="utf-8")
    )
    sel = pkg["input_select"]
    assert sel["living_look_dark"]["options"] == ["day", "evening", "cinema", "night"]
    assert sel["living_look_night"]["options"][0] == "sun", "the first choice = follow the sun"
    body = pkg["template"][0]["sensor"][0]["state"]
    assert "input_select.living_look_" in body and "sun" in body
    assert "table" not in body, "the panel's sensor reads the selects, not a baked table"
