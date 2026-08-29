"""The lighting pack's own tests — what it instantiates from the things."""

import yaml

from regie.house import load_house
from regie.render import render


def test_a_room_with_lights_gets_its_group_and_its_silent_alert(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/lighting_living.yaml").read_text(encoding="utf-8")
    )
    (group,) = pkg["light"]
    assert group["name"] == "living_lights" and group["entities"] == [
        "light.living_ceiling",
        "light.living_lamp",
    ]
    assert (
        pkg["homeassistant"]["customize"]["light.living_lights"]["friendly_name"]
        == "Salon — lumières"
    )
    (silent,) = pkg["automation"]
    assert silent["id"] == "regie_living_silent"
    assert "light.living_lamp" in silent["triggers"][0]["entity_id"]
    assert "binary_sensor.hall_motion" not in silent["triggers"][0]["entity_id"], (
        "another room's thing"
    )
    assert silent["triggers"][0]["for"] == "01:00:00"
    assert "{{ trigger.to_state.name }} ne répond plus" == silent["actions"][0]["data"]["message"]


def test_a_motion_light_at_night_targets_the_named_lights(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/lighting_hall.yaml").read_text(encoding="utf-8")
    )
    motion = next(a for a in pkg["automation"] if a["id"] == "regie_hall_hall_motion_motion_light")
    assert motion["triggers"] == [
        {"trigger": "state", "entity_id": "binary_sensor.hall_motion", "to": "on"}
    ]
    assert motion["conditions"] == [{"condition": "sun", "after": "sunset", "before": "sunrise"}]
    assert motion["actions"][0]["target"]["entity_id"] == ["light.hall_ceiling"]
    assert motion["actions"][2] == {"delay": "00:03:00"}
    assert motion["alias"] == "Entrée — Mouvement → lumières"


def test_a_motion_without_named_lights_drives_the_room(house_with, secrets, tmp_path):
    path = house_with(
        lambda d: [t for t in d["things"] if t["id"] == "hall_motion"][0].update(options={})
    )
    render(load_house(path), tmp_path, secrets)
    pkg = yaml.safe_load(
        (tmp_path / "home-assistant/packages/lighting_hall.yaml").read_text(encoding="utf-8")
    )
    motion = pkg["automation"][0]
    assert motion["conditions"] == []
    assert motion["actions"][0]["target"]["entity_id"] == ["light.hall_lights"]
    assert motion["actions"][2] == {"delay": "00:05:00"}


def test_a_room_without_lights_gets_no_package_and_no_card(house_with, secrets, tmp_path):
    path = house_with(
        lambda d: d.update(things=[t for t in d["things"] if t["id"] != "bedroom_b_ceiling"])
    )
    render(load_house(path), tmp_path, secrets)
    assert not (tmp_path / "home-assistant/packages/lighting_bedroom_b.yaml").exists()
    dash = yaml.safe_load(
        (tmp_path / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    )
    assert "Chambre B" not in [c.get("title") for c in dash["views"][0]["cards"]]
