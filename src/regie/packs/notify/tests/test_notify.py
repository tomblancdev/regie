"""The notify pack — the mouth."""

import yaml


def test_tell_and_the_households_phones(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/notify.yaml").read_text(encoding="utf-8")
    )
    groups = {g["name"]: g for g in pkg["notify"]}
    assert groups["household"]["services"] == [{"action": "mobile_app_alice_pixel"}]
    assert groups["alice"]["services"] == [{"action": "mobile_app_alice_pixel"}]
    assert "bob" not in groups, "no phone on his row"
    tell = pkg["script"]["tell"]
    assert tell["fields"]["severity"]["default"] == "info"
    assert tell["variables"]["loud"] == (
        "{{ severity == 'alarm' or not is_state('binary_sensor.house_quiet', 'on') }}"
    )
    assert tell["sequence"][0]["action"] == "persistent_notification.create"
    assert tell["sequence"][1]["then"][0]["action"] == "notify.household"


def test_no_phone_no_group_but_the_mouth_stays(house_with, secrets, tmp_path):
    from regie.house import load_house
    from regie.render import render

    path = house_with(lambda d: [p.pop("phone", None) for p in d["people"]])
    render(load_house(path), tmp_path, secrets)
    pkg = yaml.safe_load((tmp_path / "home-assistant/packages/notify.yaml").read_text())
    assert "notify" not in pkg
    assert len(pkg["script"]["tell"]["sequence"]) == 1
