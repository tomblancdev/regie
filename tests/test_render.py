import stat
from pathlib import Path

import pytest
import yaml

from regie.errors import HouseError
from regie.house import load_house, zigbee_group_id
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
    "home-assistant/themes/temoin.yaml",
    "home-assistant/www/regie-skin.js",
    "home-assistant/www/easy-floorplan-card.js",
    "home-assistant/www/plan.png",
    "home-assistant/packages/lighting_hall.yaml",
    "home-assistant/packages/lighting_living.yaml",
    "home-assistant/packages/lighting_kitchen.yaml",
    "home-assistant/packages/lighting_bedroom_a.yaml",
    "home-assistant/packages/lighting_bedroom_b.yaml",
    "home-assistant/packages/lighting_spare.yaml",
    "home-assistant/packages/signals.yaml",
    "home-assistant/packages/modes.yaml",
    "home-assistant/packages/scenes_living.yaml",
    "home-assistant/packages/scenes_hall.yaml",
    "home-assistant/packages/scenes_bedroom_a.yaml",
    "home-assistant/packages/scenes_bedroom_b.yaml",
    "home-assistant/packages/fx.yaml",
    "home-assistant/packages/palette.yaml",
    "home-assistant/packages/notify.yaml",
    "home-assistant/packages/scenarios.yaml",
    "home-assistant/packages/when_living.yaml",
    "home-assistant/packages/when_hall.yaml",
    "home-assistant/packages/hands_living.yaml",
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
    conf = yaml.safe_load(text)  # plain YAML: what Zigbee2MQTT itself reads it with
    assert conf["serial"] == {"port": "tcp://192.0.2.10:6638", "adapter": "zstack"}
    assert conf["version"] == 5
    # a value reference is a STRING, never a tag: `!secret x` unquoted is an
    # unknown tag to js-yaml and the whole file fails to parse
    assert conf["advanced"]["network_key"] == "!secret network_key"
    assert conf["mqtt"]["password"] == "!secret mqtt_password"
    # the two identifiers ride the beacons in the clear: they are rendered as
    # values, and Zigbee2MQTT takes a reference for neither
    assert conf["advanced"]["pan_id"] == 6754
    assert conf["advanced"]["ext_pan_id"] == [221, 221, 221, 221, 221, 221, 221, 221]
    assert conf["advanced"]["channel"] == 25
    assert (
        conf["mqtt"]["user"] == "zigbee2mqtt_main" and conf["mqtt"]["base_topic"] == "zigbee2mqtt"
    )
    assert conf["frontend"]["host"] == "127.0.0.1" and conf["frontend"]["port"] == 8080, (
        "the UI listens on the loopback: an admin's tunnel, not a door"
    )
    devices = yaml.safe_load(
        (rendered / "zigbee2mqtt/main/devices.yaml").read_text(encoding="utf-8")
    )
    # friendly_name alone: `description` is not a key of the 2.x schema, and
    # would be dropped the next time Zigbee2MQTT writes the file
    assert devices["0x000d6ffffe000002"] == {"friendly_name": "living_floor_lamp"}
    assert "0x000d6ffffe000001" in devices and len(devices) == 20
    groups = yaml.safe_load((rendered / "zigbee2mqtt/main/groups.yaml").read_text(encoding="utf-8"))
    number = str(zigbee_group_id("living"))
    # no `devices:` either: membership lives in the bulbs' own group tables,
    # and `apply` is what puts it there
    assert groups[number] == {"friendly_name": "living"}
    secret = yaml.safe_load((rendered / "zigbee2mqtt/main/secret.yaml").read_text())
    assert set(secret) == {"network_key", "mqtt_password"}
    assert secret["network_key"] == [1, 3, 5, 7, 9, 11, 13, 15, 0, 2, 4, 6, 8, 10, 12, 13]
    assert secret["mqtt_password"] == "example-z2m-password"


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


def test_the_dashboard_descends_from_the_house_to_a_place(rendered):
    """The descent: the house opens on ONE page listing the rooms, and every
    other page is a subview with a back arrow. A page offers one way on and
    never shows what the page below it is for."""
    dash = yaml.safe_load(
        (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    )
    views = {v["path"]: v for v in dash["views"]}
    home = dash["views"][0]
    assert home["path"] == "rooms" and not home.get("subview"), "the house is the one way in"
    assert dash["views"][1]["path"] == "plan", "the plan (0.13), a tab beside the rooms"
    tabs = ("rooms", "plan", "settings")
    assert all(v.get("subview") for v in dash["views"] if v["path"] not in tabs)
    assert dash["views"][-1]["path"] == "settings", "the house's own settings, the last tab"

    # the house card (pack modes) leads, then one row per room — every room
    first, rooms = home["sections"][0], home["sections"][1]
    assert first["cards"][1]["title"] == "Maison", "a pack's card with no `each` is the house's"
    named = {c.get("name") for c in rooms["cards"] if c["type"] in ("tile", "button")}
    assert named == {"Entrée", "Salon", "Cuisine", "Chambre A", "Chambre B", "Le carton"}

    # one row, two gestures: the icon toggles where you stand, the row walks down
    salon = next(c for c in rooms["cards"] if c.get("name") == "Salon")
    assert salon["entity"] == "light.living_lights"
    assert salon["icon_tap_action"] == {"action": "toggle"}
    assert salon["tap_action"]["navigation_path"] == "/regie-phone/living"
    assert salon["features"] == [{"type": "light-brightness"}]

    # the room's page: its looks, the whole room, then its GROUPS — never its bulbs
    living = views["living"]
    headings = [
        c["heading"] for s in living["sections"] for c in s["cards"] if c["type"] == "heading"
    ]
    assert headings == ["Ambiances", "Toute la pièce", "Groupes"]
    groups = living["sections"][2]["cards"]
    plafond = next(c for c in groups if c.get("name") == "Plafond")
    assert plafond["tap_action"]["navigation_path"] == "/regie-phone/living-main"

    # and the rung below it: the ceiling, then where its bulbs are
    ceiling = views["living-main"]
    assert ceiling["sections"][0]["cards"][0]["entity"] == "light.living_main"
    below = [c.get("name") for c in ceiling["sections"][1]["cards"] if c["type"] == "tile"]
    assert "Devant" in below, "a prefix of the layout, named by the room's `places:`"


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
        d.pop("thread")  # no fabric, no border router (check refuses the pair)

    house = load_house(house_with(drop))
    render(house, tmp_path, secrets)
    assert not (tmp_path / "units/matter-server.container").exists()
    brain = (tmp_path / "units/home-assistant.container").read_text(encoding="utf-8")
    assert "After=network-online.target mosquitto.service\n" in brain


def test_a_when_the_engine_does_not_know_is_a_fault(witness):
    with pytest.raises(HouseError, match="when: moon"):
        witness.wanted({"when": "moon"})


def test_a_base_row_with_a_when_is_filtered_like_any_other(house_with, secrets, tmp_path):
    """`when:` was honoured for the profile's rows and the packs', never for the
    base's — no base row had ever carried one until the skin. An unfiltered row
    renders its `dst` against a house that does not have what it names, so the
    house without a theme died on `{{ data.house.theme.name }}` rather than
    simply not writing the file."""

    def strip(d):
        d["house"].pop("theme")

    render(load_house(house_with(strip)), tmp_path, secrets)
    assert not (tmp_path / "home-assistant/themes").exists()


def test_the_release_carries_its_own_pin():
    """The collection's `engine` role installs the CLI **by tag**, and its
    default is what a fleet gets when it pins the collection. 0.5.1 bumped that
    default by hand and 0.10.0 forgot to — the brain converged with the previous
    engine, whose schema then refused the house's new words. The two versions
    are one fact; this is what makes them one."""
    root = Path(__file__).resolve().parent.parent
    pinned = next(
        line.split(":", 1)[1].strip().strip('"')
        for line in (root / "ansible/roles/engine/defaults/main.yml")
        .read_text(encoding="utf-8")
        .splitlines()
        if line.startswith("regie_version:")
    )
    declared = next(
        line.split("=", 1)[1].strip().strip('"')
        for line in (root / "pyproject.toml").read_text(encoding="utf-8").splitlines()
        if line.startswith("version =")
    )
    assert pinned == f"v{declared}", (
        f"the engine role installs {pinned}, the package is {declared} — "
        "a release that does not carry its own pin ships the previous engine"
    )
