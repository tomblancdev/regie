import io
import zipfile
from pathlib import Path

import pytest

from regie.errors import HouseError
from regie.host import Runner, sha256
from regie.render import base_components
from regie.up import image_of, unit_for, up


class FakeRunner(Runner):
    """Records the commands; answers queries from a small live state."""

    def __init__(self, check=False):
        super().__init__(check=check)
        self.images: set[str] = set()
        self.active: set[str] = set()

    def run(self, *cmd):
        self.log.append(" ".join(cmd))
        if self.check:
            return ""
        if cmd[:2] == ("podman", "pull"):
            self.images.add(cmd[-1])
        if cmd[:2] == ("systemctl", "restart") or cmd[:2] == ("systemctl", "start"):
            self.active.add(cmd[-1])
        if cmd[:2] == ("systemctl", "stop"):
            self.active.discard(cmd[-1])
        return ""

    def query(self, *cmd):
        if cmd[:3] == ("podman", "image", "exists"):
            return (0 if cmd[-1] in self.images else 1), ""
        if cmd[:2] == ("systemctl", "is-active"):
            return (0 if cmd[-1] in self.active else 3), ""
        raise AssertionError(cmd)


def fake_zip(with_folder=False) -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as z:
        prefix = "auth_oidc/" if with_folder else ""
        z.writestr(f"{prefix}__init__.py", "# the component\n")
        z.writestr(f"{prefix}manifest.json", '{"domain": "auth_oidc"}\n')
        z.writestr(f"{prefix}config/schema.py", "x = 1\n")
    return buf.getvalue()


@pytest.fixture
def pinned(monkeypatch):
    """The product's component pin, pointed at the fake archive."""
    data = fake_zip()
    spec = {
        "auth_oidc": {
            "when": "oidc",
            "version": "v9.9.9",
            "url": "https://example.com/{version}.zip",
            "sha256": sha256(data),
        }
    }
    monkeypatch.setattr("regie.up.base_components", lambda: spec)
    return data


def test_no_wait_in_tests(monkeypatch):
    monkeypatch.setattr("regie.up.wait_for", lambda *a, **k: None)


@pytest.fixture(autouse=True)
def _no_wait(monkeypatch):
    monkeypatch.setattr("regie.up.wait_for", lambda *a, **k: None)


def test_unit_for_and_image_of():
    assert unit_for("home-assistant/configuration.yaml") == "home-assistant"
    assert unit_for("mosquitto/config/acl") == "mosquitto"
    assert unit_for("zigbee2mqtt/main/devices.yaml") == "zigbee2mqtt-main"
    assert unit_for("units/mosquitto.container") is None
    assert image_of("[Container]\nImage=docker.io/x/y:1.2\n") == "docker.io/x/y:1.2"


def test_up_needs_a_render_first(witness, tmp_path):
    with pytest.raises(HouseError, match="nothing rendered"):
        up(witness, tmp_path, tmp_path / "units", FakeRunner())


def test_first_up_places_pulls_starts_then_nothing_to_do(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    result = up(witness, rendered_fresh, units_dir, runner, fetcher=lambda url: pinned)
    assert result.units == ["home-assistant", "matter-server", "mosquitto", "zigbee2mqtt-main"]
    assert result.placed == [
        "home-assistant.container",
        "matter-server.container",
        "mosquitto.container",
        "zigbee2mqtt-main.container",
    ]
    # the broker first, the Matter server before the brain that dials it, the radio last
    assert len(result.pulled) == 4 and result.started == [
        "mosquitto",
        "matter-server",
        "home-assistant",
        "zigbee2mqtt-main",
    ]
    assert result.components == ["auth_oidc v9.9.9"]
    oidc = rendered_fresh / "home-assistant/custom_components/auth_oidc"
    assert (oidc / "manifest.json").is_file()
    assert (oidc / "config/schema.py").is_file()
    assert (rendered_fresh / "home-assistant/packages").is_dir()
    # the server's data, made before its first start
    assert (rendered_fresh / "matter-server").is_dir()
    assert (units_dir / "mosquitto.container").read_text() == (
        rendered_fresh / "units/mosquitto.container"
    ).read_text()
    assert "systemctl daemon-reload" in runner.log
    assert result.changed and "nothing to do" not in result.summary()

    again = up(witness, rendered_fresh, units_dir, runner, fetcher=lambda url: pinned)
    assert not again.changed and again.summary().endswith("nothing to do")


def test_a_changed_file_restarts_only_its_service(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    up(witness, rendered_fresh, units_dir, runner, fetcher=lambda url: pinned)
    acl = rendered_fresh / "mosquitto/config/acl"
    acl.write_text(acl.read_text() + "# a change\n")
    result = up(witness, rendered_fresh, units_dir, runner, fetcher=lambda url: pinned)
    assert result.restarted == ["mosquitto"] and not result.started and not result.placed


def test_a_unit_the_house_dropped_is_stopped_and_removed(house_with, secrets, tmp_path, pinned):
    from regie.house import load_house
    from regie.render import render

    path = house_with(lambda d: None)
    house = load_house(path)
    root = tmp_path / "root"
    render(house, root, secrets)
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    up(house, root, units_dir, runner, fetcher=lambda url: pinned)
    assert (units_dir / "zigbee2mqtt-main.container").is_file()

    def no_zigbee(d):
        d.pop("zigbee")
        d["things"] = [t for t in d["things"] if t["via"] != "zigbee"]

    path2 = house_with(no_zigbee)
    living = (
        path2.parent / "rooms" / "living.yml"
    )  # its remote went with the radio: so does its hands: line
    living.write_text(
        living.read_text(encoding="utf-8").replace(
            "hands:\n  living_remote: { behaviour: room_remote }\n", ""
        ),
        encoding="utf-8",
    )
    house2 = load_house(path2)
    render(house2, root, secrets)
    result = up(house2, root, units_dir, runner, fetcher=lambda url: pinned)
    assert result.removed == ["zigbee2mqtt-main.container"]
    assert not (units_dir / "zigbee2mqtt-main.container").exists()
    assert "systemctl stop zigbee2mqtt-main.service" in runner.log


def test_check_plans_and_touches_nothing(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner(check=True)
    result = up(witness, rendered_fresh, units_dir, runner, fetcher=lambda url: pinned)
    assert result.check and "would place 4" in result.summary()
    assert not units_dir.exists() and not runner.images
    assert not (rendered_fresh / "home-assistant/custom_components").exists()


def test_a_wrong_digest_installs_nothing(witness, rendered_fresh, tmp_path, pinned):
    bad = fake_zip(with_folder=True)  # different bytes, wrong digest
    with pytest.raises(HouseError, match="sha256"):
        up(witness, rendered_fresh, tmp_path / "s", FakeRunner(), fetcher=lambda url: bad)
    assert not (rendered_fresh / "home-assistant/custom_components").exists()


def test_a_component_pinned_by_the_product_is_pinned_by_digest():
    for domain, spec in base_components().items():
        assert spec["version"].startswith("v") and len(spec["sha256"]) == 64, domain
        assert "{version}" in spec["url"]


def test_state_files_live_under_dot_regie(witness, rendered_fresh, tmp_path, pinned):
    up(witness, rendered_fresh, tmp_path / "s", FakeRunner(), fetcher=lambda url: pinned)
    names = {p.name for p in (rendered_fresh / ".regie").iterdir()}
    assert {"manifest.json", "units.json", "stamps.json", "components.json"} <= names
    assert isinstance(Path(rendered_fresh), Path)
