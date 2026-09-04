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


def test_a_room_that_senses_gets_one_automation_on_its_occupancy(rendered):
    """0.17, behaviour motion_light: one automation per ROOM on its occupancy
    signal, the look of the hour when the room is dark and unlit, off only
    what the sensors lit — and the hold belongs to the signal."""
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/lighting_hall.yaml").read_text(encoding="utf-8")
    )
    helpers = pkg["input_boolean"]
    assert list(helpers) == ["hall_motion", "hall_pinned", "hall_lit_by_motion"]
    assert helpers["hall_motion"]["name"] == "Entrée — Les capteurs allument"
    autos = {a["id"]: a for a in pkg["automation"]}
    assert "regie_hall_hall_motion_motion_light" not in autos, "never one per sensor"
    motion = autos["regie_hall_motion"]
    assert motion["mode"] == "queued"
    assert [t["entity_id"] for t in motion["triggers"]] == ["binary_sensor.hall_occupied"] * 2
    assert [t["id"] for t in motion["triggers"]] == ["occupied", "cleared"]
    assert motion["conditions"] == [
        {"condition": "state", "entity_id": "input_boolean.hall_motion", "state": "on"},
        {"condition": "state", "entity_id": "input_boolean.hall_pinned", "state": "off"},
    ]
    on, off = motion["actions"][0]["choose"]
    assert {"condition": "state", "entity_id": "binary_sensor.hall_dark", "state": "on"} in on[
        "conditions"
    ], "the light rule: what lights a room without a hand asks the room's dark signal"
    assert {"condition": "state", "entity_id": "light.hall_lights", "state": "off"} in on[
        "conditions"
    ], "a room a hand lit is a hand's room"
    assert on["sequence"][0] == {"action": "script.hall_default"}, "the look of the hour"
    assert on["sequence"][1]["target"]["entity_id"] == "input_boolean.hall_lit_by_motion"
    assert {
        "condition": "state",
        "entity_id": "input_boolean.hall_lit_by_motion",
        "state": "on",
    } in off["conditions"]
    assert off["sequence"] == [{"action": "script.hall_off"}]
    assert "delay" not in yaml.dump(motion), "the hold is the occupancy signal's"


def test_the_sensors_switches_sit_on_the_rooms_settings_page(rendered):
    body = (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    assert "input_boolean.hall_motion" in body and "input_boolean.hall_pinned" in body
    assert "input_boolean.hall_lit_by_motion" not in body, "the sensors' mark is no family dial"


def test_the_old_motion_options_are_warned_not_read(house_with):
    def old(d):
        m = [t for t in d["things"] if t["id"] == "hall_motion"][0]
        m["options"] = {"lights": ["hall_ceiling"], "only_at_night": True}

    h = load_house(house_with(old))
    assert any(
        "hall_motion: option(s) lights, only_at_night no longer read" in w for w in h.warnings
    )


def test_dark_below_without_a_sensor_is_warned(house_with):
    path = house_with(lambda d: None)
    living = path.parent / "rooms" / "living.yml"
    living.write_text(living.read_text(encoding="utf-8") + "dark_below: 30\n", encoding="utf-8")
    h = load_house(path)
    assert any("living: dark_below reads nothing" in w for w in h.warnings)


def test_a_room_without_lights_gets_no_package_and_a_way_in_that_names_nothing(
    house_with, secrets, tmp_path
):
    """A room with no light has no light group — so its row on the first page
    may not name one. It stays a room you can walk into (its settings live
    there); it is simply not a switch."""
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
    rooms = dash["views"][0]["sections"][-1]["cards"]
    row = next(c for c in rooms if c.get("name") == "Chambre B")
    assert row["type"] == "button" and "entity" not in row
    assert row["tap_action"]["navigation_path"] == "/regie-phone/bedroom_b"


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
    assert names["light.living_main_front"]["friendly_name"] == "Salon — Devant", (
        "a place group wears the room's own word for it — the same one the card prints"
    )


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


def test_a_room_shows_the_look_it_pinned_and_hides_the_rest(rendered):
    """Only what the room's file PINNED reaches its page. Everything else is one
    tap away on the room's `looks` page, applied by hand — `off` among them, last:
    the room's own row is what you press to turn it off."""
    dash = yaml.safe_load(
        (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    )
    views = {v["path"]: v for v in dash["views"]}
    on_page = [c["name"] for c in views["living"]["sections"][0]["cards"] if c["type"] == "button"]
    assert on_page == ["Normal", "Fête", "Plus…"], "the ordinary one, what you pinned, the way on"
    party = next(c for c in views["living"]["sections"][0]["cards"] if c.get("name") == "Fête")
    assert party["entity"] == "script.living_party" and party["icon"] == "mdi:party-popper"

    by_hand = [c["name"] for c in views["living-looks"]["sections"][-1]["cards"][1:]]
    assert by_hand == ["Jour", "Soirée", "Cinéma", "Nuit", "Éteint"], "off exists, and comes last"
    assert "Fête" not in by_hand, "a pinned look is not offered twice"


def test_a_place_the_room_has_not_named_falls_back_to_its_prefix(house_with, secrets, tmp_path):
    """The witness names every prefix it groups, so nothing here exercised the
    other branch — and the real house rendered `La Cantine — None` from it.
    Jinja's `default()` replaces the UNDEFINED; a dict's `.get` returns None."""

    def unnamed(d):
        d["things"] += [
            {
                "id": f"living_shelf_{side}",
                "area": "living",
                "kind": "light",
                "via": "zigbee",
                "ieee": f"0x000d6ffffe0003{i:02d}",
                "role": "shelf",
                "at": f"top_{side}",
            }
            for i, side in enumerate(("left", "right"))
        ]

    path = house_with(unnamed)
    room = path.parent / "rooms" / "living.yml"
    body = room.read_text(encoding="utf-8").replace(
        "  lamp:      { label: Lampadaire }",
        "  lamp:      { label: Lampadaire }\n"
        "  shelf:     { label: Étagère, layout: [top_left, top_right] }",
    )
    room.write_text(body, encoding="utf-8")
    render(load_house(path), tmp_path, secrets)
    names = yaml.safe_load(
        (tmp_path / "home-assistant/packages/lighting_living.yaml").read_text(encoding="utf-8")
    )["homeassistant"]["customize"]
    assert names["light.living_shelf_top"]["friendly_name"] == "Salon — Étagère top"
    assert not any("None" in n["friendly_name"] for n in names.values())
