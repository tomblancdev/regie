"""The lighting pack's own tests — what it instantiates from the things."""

import yaml

from regie.house import load_house
from regie.render import render


def test_a_room_with_lights_gets_its_group_and_its_silent_alert(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/lighting_living.yaml").read_text(encoding="utf-8")
    )
    group = pkg["light"][0]
    assert group["name"] == "living_lights" and group["entities"] == [
        "light.living_ceiling",
        "light.living_ceiling_2",
        "light.living_ceiling_3",
        "light.living_floor_lamp",
        "light.living_bulb",
    ]
    assert (
        pkg["homeassistant"]["customize"]["light.living_lights"]["friendly_name"]
        == "Salon — lumières"
    )
    autos = {a["id"]: a for a in pkg["automation"]}
    silent = autos["regie_living_silent"]
    assert silent["id"] == "regie_living_silent"
    assert "light.living_floor_lamp" in silent["triggers"][0]["entity_id"]
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
        lambda d: d.update(
            things=[
                t for t in d["things"] if not (t["area"] == "bedroom_b" and t["kind"] == "light")
            ]
        )
    )
    render(load_house(path), tmp_path, secrets)
    assert not (tmp_path / "home-assistant/packages/lighting_bedroom_b.yaml").exists()
    dash = yaml.safe_load(
        (tmp_path / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    )
    assert "Chambre B" not in [c.get("title") for c in dash["views"][0]["cards"]]


def test_a_role_gets_its_group_and_a_layout_its_rows(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/lighting_living.yaml").read_text(encoding="utf-8")
    )
    groups = {g["name"]: g for g in pkg["light"]}
    assert groups["living_main"]["entities"] == [
        "light.living_ceiling",
        "light.living_ceiling_2",
        "light.living_ceiling_3",
    ]
    assert groups["living_lamp"]["entities"] == ["light.living_floor_lamp"]  # the role, the bulb
    assert groups["living_main_front"]["entities"] == [
        "light.living_ceiling",
        "light.living_ceiling_2",
    ], "front_left + front_right filled: the front row exists; back has one bulb: no group"
    assert "living_main_back" not in groups
    names = pkg["homeassistant"]["customize"]
    assert names["light.living_main"]["friendly_name"] == "Salon — Plafond"
    assert names["light.living_main_front"]["friendly_name"] == "Salon — Plafond front"


def test_restore_default_and_the_silent_gate(rendered, house_with, secrets, tmp_path):
    import yaml as _yaml

    from regie.house import load_house
    from regie.render import render as _render

    pkg = _yaml.safe_load(
        (rendered / "home-assistant/packages/lighting_living.yaml").read_text(encoding="utf-8")
    )
    autos = {a["id"]: a for a in pkg["automation"]}
    restore = autos["regie_living_restore_default"]
    assert {
        "trigger": "state",
        "entity_id": "light.living_floor_lamp",
        "from": "unavailable",
        "to": "on",
    } in restore["triggers"]
    assert restore["actions"][0]["target"]["entity_id"] == "script.living_default"
    assert "regie_living_silent" in autos, "silent stays on by default"

    hushed = load_house(
        house_with(lambda d: d.update(controls={"silent": False, "restore_default": False}))
    )
    _render(hushed, tmp_path, secrets)
    pkg2 = _yaml.safe_load(
        (tmp_path / "home-assistant/packages/lighting_bedroom_a.yaml").read_text(encoding="utf-8")
    )
    assert "automation" not in pkg2, "no motions, no restore, silent off: no automation block"


def test_the_room_card_leads_with_the_smart_on(rendered):
    text = (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    assert "script.living_default" in text and "script.living_off" in text


def test_the_room_card_carries_its_looks_as_buttons(rendered):
    """The manual way into a scene: the room's own looks, in the order its file
    writes them, each with the name and the face the vocabulary gives it."""
    body = (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    salon = body[body.index("title: Salon") :]
    salon = salon[: salon.index("light.living_lights")]
    assert "script.living_day" in salon and "name: Jour" in salon, "a standard look is translated"
    assert "icon: mdi:white-balance-sunny" in salon, "and wears a standard face"
    assert "script.living_party" in salon and "name: Fête" in salon
    assert "icon: mdi:party-popper" in salon, "a look the house invented says its own"
    assert "script.living_off" in salon, "off keeps the button it already had"
    assert salon.count("- entity: script.living_off") == 1, "and only that one"
