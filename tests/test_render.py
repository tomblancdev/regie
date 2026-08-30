import stat

import pytest
import yaml

from regie.errors import HouseError
from regie.house import load_house
from regie.render import render

EXPECTED = {
    "units/home-assistant.container",
    "units/mosquitto.container",
    "units/zigbee2mqtt-main.container",
    "units/matter-server.container",
    "home-assistant/configuration.yaml",
    "home-assistant/automations.yaml",
    "home-assistant/scenes.yaml",
    "home-assistant/scripts.yaml",
    "home-assistant/secrets.yaml",
    "home-assistant/dashboards/phone.yaml",
    "home-assistant/packages/lighting_hall.yaml",
    "home-assistant/packages/lighting_living.yaml",
    "home-assistant/packages/lighting_kitchen.yaml",
    "home-assistant/packages/lighting_bedroom_a.yaml",
    "home-assistant/packages/lighting_bedroom_b.yaml",
    "home-assistant/packages/signals.yaml",
    "home-assistant/packages/modes.yaml",
    "home-assistant/packages/scenes_living.yaml",
    "home-assistant/packages/scenes_hall.yaml",
    "home-assistant/packages/scenes_bedroom_a.yaml",
    "home-assistant/packages/scenes_bedroom_b.yaml",
    "home-assistant/packages/fx.yaml",
    "home-assistant/packages/notify.yaml",
    "home-assistant/packages/scenarios.yaml",
    "mosquitto/config/mosquitto.conf",
    "mosquitto/config/acl",
    "mosquitto/config/passwd",
    "zigbee2mqtt/main/configuration.yaml",
    "zigbee2mqtt/main/devices.yaml",
    "zigbee2mqtt/main/groups.yaml",
    "zigbee2mqtt/main/secret.yaml",
}


def files(root):
    return {
        str(p.relative_to(root)) for p in root.rglob("*") if p.is_file() and ".regie" not in p.parts
    }


def test_the_witness_renders_the_whole_tree(rendered):
    assert files(rendered) == EXPECTED


def test_every_yaml_we_write_is_yaml(rendered):
    for rel in EXPECTED:
        if rel.endswith(".yaml"):
            text = (rendered / rel).read_text(encoding="utf-8")
            # Home Assistant's and Zigbee2MQTT's own tags are not ours to parse
            text = (
                text.replace("!include_dir_named", "")
                .replace("!include", "")
                .replace("!secret", "")
            )
            yaml.safe_load(text)


def test_units_pin_the_images(rendered, witness):
    ha = (rendered / "units/home-assistant.container").read_text()
    assert f"Image=ghcr.io/home-assistant/home-assistant:{witness.pins()['home_assistant']}" in ha
    assert "Network=host" in ha and "Volume=/srv/home/home-assistant:/config:Z" in ha
    z2m = (rendered / "units/zigbee2mqtt-main.container").read_text()
    assert "Requires=mosquitto.service" in z2m and "/srv/home/zigbee2mqtt/main:/app/data:Z" in z2m


def test_home_assistant_configuration(rendered):
    text = (rendered / "home-assistant/configuration.yaml").read_text(encoding="utf-8")
    assert "\ndefault_config:\n" in text  # the witness keeps `my`: one line
    assert "packages: !include_dir_named packages" in text
    assert "automation: !include automations.yaml" in text
    assert "trusted_proxies" not in text  # the reverse proxy is the conductor's (stored config)
    assert "client_secret: !secret oidc_client_secret" in text
    assert "    admin: admins\n    user: household" in text
    assert "internal_url: https://home.example.com" in text
    assert "prometheus:" in text
    secrets = yaml.safe_load((rendered / "home-assistant/secrets.yaml").read_text())
    assert secrets == {
        "mqtt_password": "example-home-password",
        "oidc_client_secret": "example-oidc-client-secret",
    }


def test_zigbee2mqtt_configuration(rendered):
    text = (rendered / "zigbee2mqtt/main/configuration.yaml").read_text()
    assert "port: tcp://192.0.2.10:6638" in text and "adapter: zstack" in text
    assert "channel: 25" in text and "network_key: !secret network_key" in text
    assert "user: zigbee2mqtt_main" in text and "base_topic: zigbee2mqtt" in text
    assert "host: 127.0.0.1\n  port: 8080" in text, (
        "the UI listens on the loopback: an admin's tunnel, not a door"
    )
    devices = yaml.safe_load(
        (rendered / "zigbee2mqtt/main/devices.yaml").read_text(encoding="utf-8")
    )
    assert devices["0x000d6ffffe000002"] == {
        "friendly_name": "living_lamp",
        "description": "Lampadaire — Salon",
    }
    assert "0x000d6ffffe000001" in devices and len(devices) == 18
    groups = yaml.safe_load((rendered / "zigbee2mqtt/main/groups.yaml").read_text(encoding="utf-8"))
    assert groups["2"] == {
        "friendly_name": "living",
        "description": "Salon",
        "devices": ["living_ceiling", "living_ceiling_2", "living_ceiling_3", "living_lamp"],
    }
    secret = yaml.safe_load((rendered / "zigbee2mqtt/main/secret.yaml").read_text())
    assert secret["network_key"] == [1, 3, 5, 7, 9, 11, 13, 15, 0, 2, 4, 6, 8, 10, 12, 13]
    assert secret["pan_id"] == 6754 and secret["mqtt_password"] == "example-z2m-password"


def test_mosquitto_users(rendered):
    acl = (rendered / "mosquitto/config/acl").read_text()
    assert "user home\ntopic readwrite #" in acl
    assert (
        "user kitchen_energy\ntopic readwrite kitchen_energy/#\n"
        "topic readwrite homeassistant/+/kitchen_energy/#" in acl
    )
    passwd = (rendered / "mosquitto/config/passwd").read_text().splitlines()
    assert [line.split(":")[0] for line in passwd] == ["home", "zigbee2mqtt_main", "kitchen_energy"]
    assert all(line.split(":")[1].startswith("$7$101$") for line in passwd)
    conf = (rendered / "mosquitto/config/mosquitto.conf").read_text()
    assert "listener 1883 0.0.0.0" in conf and "allow_anonymous false" in conf


def test_secret_files_are_private(rendered):
    for rel in (
        "home-assistant/secrets.yaml",
        "mosquitto/config/passwd",
        "zigbee2mqtt/main/secret.yaml",
    ):
        assert stat.S_IMODE((rendered / rel).stat().st_mode) == 0o600
    assert stat.S_IMODE((rendered / "home-assistant/configuration.yaml").stat().st_mode) == 0o644


def test_the_dashboard_has_a_card_per_room_and_the_house_pack_card(rendered):
    dash = yaml.safe_load(
        (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    )
    cards = dash["views"][0]["cards"]
    assert [c["type"] for c in cards] == ["entities"] * 6 + ["markdown"]
    assert cards[0]["title"] == "Maison", "the house card (pack modes) comes first: packs order"
    living = next(c for c in cards if c["title"] == "Salon")
    assert living["entities"][0] == {"entity": "light.living_lights", "name": "lumières"}
    assert {"entity": "light.living_lamp", "name": "Lampadaire"} in living["entities"]
    assert "pack `chalet`" in cards[-1]["content"]


def test_render_is_idempotent(witness, secrets, tmp_path):
    first = render(witness, tmp_path, secrets)
    assert len(first.written) == len(EXPECTED)
    second = render(witness, tmp_path, secrets)
    assert second.written == [] and second.removed == []
    assert len(second.unchanged) + len(second.kept) == len(EXPECTED)


def test_the_sketchpad_is_put_back_empty(witness, secrets, tmp_path):
    render(witness, tmp_path, secrets)
    for name in ("automations", "scenes", "scripts"):
        sketch = tmp_path / f"home-assistant/{name}.yaml"
        assert sketch.read_text().rstrip().endswith("[]")
        sketch.write_text("- id: drafted_in_the_ui\n")
    result = render(witness, tmp_path, secrets)
    assert len(result.written) == 3 and result.kept == []
    assert (tmp_path / "home-assistant/automations.yaml").read_text().rstrip().endswith("[]")


def test_a_render_removes_what_the_house_no_longer_names(house_with, secrets, tmp_path):
    path = house_with(lambda d: None)
    render(load_house(path), tmp_path, secrets)
    assert (tmp_path / "home-assistant/packages/lighting_bedroom_b.yaml").exists()
    gone = house_with(
        lambda d: d.update(things=[t for t in d["things"] if not t["id"].startswith("bedroom_b")])
    )
    result = render(load_house(gone), tmp_path, secrets)
    assert [p.name for p in result.removed] == ["lighting_bedroom_b.yaml"]
    assert not (tmp_path / "home-assistant/packages/lighting_bedroom_b.yaml").exists()


def test_a_render_never_touches_what_it_did_not_write(witness, secrets, tmp_path):
    stranger = tmp_path / "home-assistant/packages/mine.yaml"
    stranger.parent.mkdir(parents=True)
    stranger.write_text("mine: true\n")
    render(witness, tmp_path, secrets)
    render(witness, tmp_path, secrets)
    assert stranger.read_text() == "mine: true\n"


def test_missing_secrets_are_named_before_anything_is_written(witness, secrets, tmp_path):
    partial = {k: v for k, v in secrets.items() if k != "zigbee_main_pan_id"}
    with pytest.raises(HouseError, match="missing secrets: zigbee_main_pan_id"):
        render(witness, tmp_path, partial)
    assert files(tmp_path) == set()


def test_the_brokers_files_name_their_owner(witness):
    from regie.render import base_plan

    owners = {t["dst"]: t.get("owner") for t in base_plan()}
    assert owners["mosquitto/config/passwd"] == "mosquitto"
    assert witness.profile.users["mosquitto"] == 1883


def test_owner_is_chowned_only_as_root(witness, secrets, tmp_path, monkeypatch):
    import os

    import regie.render as r

    calls = []
    monkeypatch.setattr(os, "geteuid", lambda: 0)
    monkeypatch.setattr(os, "chown", lambda p, u, g: calls.append((p.name, u, g)))
    r.render(witness, tmp_path, secrets)
    assert ("passwd", 1883, 1883) in calls and ("acl", 1883, 1883) in calls
    assert not [c for c in calls if c[0] == "configuration.yaml"]


def test_a_house_without_my_renders_default_config_written_out(house_with, secrets, tmp_path):
    """house.my: false — the brain's own door is the OAuth callback, so the `my`
    integration must not load: default_config's members are written out
    without it (the list the product pins in base.yml)."""
    from regie.house import load_house
    from regie.render import base_default_config, render

    def no_my(d):
        d["house"]["my"] = False

    house = load_house(house_with(no_my))
    out = tmp_path / "no-my"
    render(house, out, secrets)
    text = (out / "home-assistant/configuration.yaml").read_text(encoding="utf-8")
    assert "default_config:" not in text.replace("# default_config", "")
    assert "\nmy:\n" not in text
    members = base_default_config()
    assert "my" in members and len(members) >= 20
    for domain in members:
        if domain != "my":
            assert f"\n{domain}:\n" in text, domain


def test_the_matter_pack_renders_the_server_unit_and_the_brain_waits_for_it(rendered):
    unit = (rendered / "units/matter-server.container").read_text(encoding="utf-8")
    assert "Image=ghcr.io/matter-js/matterjs-server:1.3.3" in unit
    assert "Network=host" in unit and "Volume=/srv/home/matter-server:/data:Z" in unit
    assert "Environment=LISTEN_ADDRESS=127.0.0.1" in unit
    brain = (rendered / "units/home-assistant.container").read_text(encoding="utf-8")
    assert "After=network-online.target mosquitto.service matter-server.service" in brain


def test_without_the_matter_pack_no_server_unit(house_with, secrets, tmp_path):
    def drop(d):
        d["packs"].remove("matter")
        d["things"] = [t for t in d["things"] if t.get("via") != "matter"]

    house = load_house(house_with(drop))
    render(house, tmp_path, secrets)
    assert not (tmp_path / "units/matter-server.container").exists()
    brain = (tmp_path / "units/home-assistant.container").read_text(encoding="utf-8")
    assert "After=network-online.target mosquitto.service\n" in brain


def test_a_when_the_engine_does_not_know_is_a_fault(witness):
    with pytest.raises(HouseError, match="when: moon"):
        witness.wanted({"when": "moon"})
