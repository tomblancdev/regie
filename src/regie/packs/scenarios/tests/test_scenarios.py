"""The scenarios pack — a story file, a script."""

import yaml


def test_the_witness_story(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/scenarios.yaml").read_text(encoding="utf-8")
    )
    story = pkg["script"]["scenario_wakeup"]
    assert story["alias"] == "Réveil"
    seq = story["sequence"]
    assert seq[0] == {
        "action": "input_select.select_option",
        "target": {"entity_id": "input_select.house_mode"},
        "data": {"option": "home"},
    }
    assert seq[1] == {"action": "script.living_evening", "continue_on_error": True}
    assert seq[2] == {
        "action": "script.fx_pulse",
        "data": {"target": "light.living_main", "times": 2},
    }
    assert seq[3] == {"delay": 5}
    assert seq[4] == {"action": "script.tell", "data": {"message": "Bonjour", "severity": "info"}}


def test_no_story_no_file(house_with, secrets, tmp_path):
    from regie.house import load_house
    from regie.render import render

    path = house_with(lambda d: d["include"].pop("scenarios"))
    render(load_house(path), tmp_path, secrets)
    assert not (tmp_path / "home-assistant/packages/scenarios.yaml").exists()
