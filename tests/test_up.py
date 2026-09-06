import io
import zipfile
from pathlib import Path

import pytest

from regie.errors import HouseError
from regie.host import Runner, read_state, sha256, write_state
from regie.render import base_components
from regie.up import RESTART, brain_asks, dashboard_paths, image_of, unit_for, up


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


def test_what_a_changed_brain_file_asks(tmp_path):
    """0.28: a package asks the reload of the domains it holds (a word the
    table does not know = a restart, the safe reading), a theme the themes'
    reload, a dashboard the open pages' refresh, a www file nothing; a core
    key, a secret, a component are read once - a restart."""
    pk = tmp_path / "home-assistant" / "packages"
    pk.mkdir(parents=True)
    (pk / "scenes_living.yaml").write_text(
        "automation:\n  - id: a\nscript:\n  x: {}\ninput_select:\n  y: {}\n"
        "light:\n  - platform: group\n    name: g\nhomeassistant:\n  customize: {}\n"
        "template:\n  - sensor: []\ninput_text:\n  z: { initial: !secret nope }\n"
    )
    (pk / "odd.yaml").write_text("script:\n  x: {}\nhttp:\n  server_port: 1\n")
    (pk / "tpl.yaml").write_text("sensor:\n  - platform: template\n    sensors: {}\n")
    (pk / "broken.yaml").write_text("script: [\n")
    dash = {"home-assistant/dashboards/phone.yaml": "regie-phone"}
    living = brain_asks("home-assistant/packages/scenes_living.yaml", tmp_path, dash)
    assert sorted(living) == [
        "automation/reload",
        "group/reload",
        "homeassistant/reload_core_config",
        "input_select/reload",
        "input_text/reload",
        "script/reload",
        "template/reload",
    ]
    assert all(len(d) == 64 for d in living.values())
    assert list(brain_asks("home-assistant/packages/odd.yaml", tmp_path, dash)) == [RESTART]
    assert list(brain_asks("home-assistant/packages/tpl.yaml", tmp_path, dash)) == [
        "template/reload"
    ]
    assert list(brain_asks("home-assistant/packages/broken.yaml", tmp_path, dash)) == [RESTART]
    assert list(brain_asks("home-assistant/packages/gone.yaml", tmp_path, dash)) == [RESTART]
    assert list(brain_asks("home-assistant/themes/nuit.yaml", tmp_path, dash)) == [
        "frontend/reload_themes"
    ]
    assert list(brain_asks("home-assistant/dashboards/phone.yaml", tmp_path, dash)) == [
        "lovelace_updated regie-phone"
    ]
    assert brain_asks("home-assistant/dashboards/other.yaml", tmp_path, dash) == {}
    assert brain_asks("home-assistant/www/regie-skin.js", tmp_path, dash) == {}
    assert list(brain_asks("home-assistant/automations.yaml", tmp_path, dash)) == [
        "automation/reload"
    ]
    for rel in (
        "home-assistant/configuration.yaml",
        "home-assistant/secrets.yaml",
        "home-assistant/custom_components/auth_oidc/__init__.py",
    ):
        assert list(brain_asks(rel, tmp_path, dash)) == [RESTART], rel
    # 0.28.2: an ask's digest is its own block's - a comment moved or another
    # domain edited leaves it where it was; a secret reference moved counts
    (pk / "scenes_living.yaml").write_text(
        "# a comment\nautomation:\n  - id: a\nscript:\n  x: {}\ninput_select:\n  y: {}\n"
        "light:\n  - platform: group\n    name: g\nhomeassistant:\n  customize: {}\n"
        "template:\n  - sensor: []\ninput_text:\n  z: { initial: !secret other }\n"
    )
    again = brain_asks("home-assistant/packages/scenes_living.yaml", tmp_path, dash)
    assert {a for a in living if again[a] != living[a]} == {"input_text/reload"}


def test_the_dashboards_are_read_from_the_rendered_configuration(rendered):
    assert dashboard_paths(rendered) == {"home-assistant/dashboards/phone.yaml": "regie-phone"}
    assert dashboard_paths(rendered / "nowhere") == {}


class FakeBrain:
    """The brain's API as `up` speaks to it: every POST recorded, answered."""

    def __init__(self, status=200):
        self.posts: list[tuple[str, dict]] = []
        self.status = status

    def post(self, path, body, auth=True):
        self.posts.append((path, body))
        return self.status, ([] if self.status == 200 else {"message": "refused"})


def a_token(root: Path) -> None:
    d = root / ".regie" / "tokens"
    d.mkdir(parents=True, exist_ok=True)
    (d / "regie").write_text("a-token\n")


def a_scenes_package(root: Path) -> Path:
    """The living room's looks: scripts, helpers, templates and the walk's
    starter automation - every domain a look change can touch."""
    p = root / "home-assistant/packages/scenes_living.yaml"
    assert p.is_file()
    return p


def touch_a_look(pkg: Path) -> None:
    """A look edited for real: its script and its walk's starter automation
    both move (a label does exactly that) - the helpers and the sensors beside
    them do not."""
    text = pkg.read_text()
    look, starter = "  living_party:\n", "- id: regie_living_party_drift\n"
    assert look in text and starter in text
    # a key the render never writes: a duplicate would lose to the later one
    text = text.replace(look, look + "    max_exceeded: silent\n", 1)
    pkg.write_text(text.replace(starter, starter + "  variables: { touched: 1 }\n", 1))


def brain_up(witness, root, units_dir, runner, pinned, **kw):
    return up(witness, root, units_dir, runner, fetcher=lambda url: pinned, **kw)


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
    assert {
        "manifest.json",
        "units.json",
        "stamps.json",
        "reloads.json",
        "components.json",
    } <= names
    assert isinstance(Path(rendered_fresh), Path)
    # what every brain file asks, remembered for the day it changes or goes
    remembered = read_state(rendered_fresh, "reloads.json")
    assert list(remembered["home-assistant/configuration.yaml"]) == [RESTART]
    assert (
        "script/reload"
        in remembered[str(a_scenes_package(rendered_fresh).relative_to(rendered_fresh))]
    )


def test_a_package_change_reloads_its_domains_and_the_brain_stays_up(
    witness, rendered_fresh, tmp_path, pinned
):
    """0.28: a look change is a package change - the brain reloads the domains
    the package holds, automations before scripts, and is not restarted."""
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    pkg = a_scenes_package(rendered_fresh)
    touch_a_look(pkg)
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert not result.restarted and not result.started and not result.placed
    assert "systemctl restart home-assistant.service" not in runner.log
    assert "home-assistant: automation.reload" in result.reloaded
    assert "home-assistant: script.reload" in result.reloaded
    paths = [p for p, _ in brain.posts]
    assert paths.index("/api/services/automation/reload") < paths.index(
        "/api/services/script/reload"
    )
    assert all(body == {} for _, body in brain.posts)
    assert result.changed and "reload " in result.summary() and not result.notes
    again = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert not again.changed and again.summary().endswith("nothing to do")


def test_a_core_change_still_restarts_the_brain(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    conf = rendered_fresh / "home-assistant/configuration.yaml"
    conf.write_text(conf.read_text() + "\n# a core key moved\n")
    pkg = a_scenes_package(rendered_fresh)
    pkg.write_text(pkg.read_text() + "# and a look\n")
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert result.restarted == ["home-assistant"] and not result.reloaded
    assert brain.posts == []  # the restart reads everything: no reload beside it


def test_a_theme_change_reloads_the_themes(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    theme = rendered_fresh / "home-assistant/themes/soir.yaml"
    theme.parent.mkdir(exist_ok=True)
    theme.write_text("soir:\n  primary-color: '#123456'\n")
    manifest = read_state(rendered_fresh, "manifest.json")
    manifest["files"].append("home-assistant/themes/soir.yaml")
    write_state(rendered_fresh, "manifest.json", manifest)
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert result.reloaded == ["home-assistant: frontend.reload_themes"] and not result.restarted
    assert brain.posts == [("/api/services/frontend/reload_themes", {})]


def test_a_dashboard_change_tells_the_open_pages(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    dash = rendered_fresh / "home-assistant/dashboards/phone.yaml"
    dash.write_text(dash.read_text() + "# a card moved\n")
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert result.reloaded == ["home-assistant: lovelace_updated regie-phone"]
    assert brain.posts == [("/api/events/lovelace_updated", {"url_path": "regie-phone"})]


def test_a_package_gone_reloads_what_it_held(witness, rendered_fresh, tmp_path, pinned):
    """A room's package removed: the domains it declared are reloaded once
    more so the brain lets go of its entities - no restart."""
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    pkg = a_scenes_package(rendered_fresh)
    rel = str(pkg.relative_to(rendered_fresh))
    held = read_state(rendered_fresh, "reloads.json")[rel]
    pkg.unlink()
    manifest = read_state(rendered_fresh, "manifest.json")
    manifest["files"].remove(rel)
    write_state(rendered_fresh, "manifest.json", manifest)
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert not result.restarted
    assert sorted(p for p, _ in brain.posts) == sorted(f"/api/services/{h}" for h in held)
    assert rel not in read_state(rendered_fresh, "reloads.json")
    assert rel not in read_state(rendered_fresh, "stamps.json")


def test_a_file_gone_with_no_memory_restarts(witness, rendered_fresh, tmp_path, pinned):
    """A brain stamped before 0.28 has no memory of what a file asked: gone,
    it restarts - the safe reading, once."""
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    (rendered_fresh / ".regie/reloads.json").unlink()
    pkg = a_scenes_package(rendered_fresh)
    rel = str(pkg.relative_to(rendered_fresh))
    pkg.unlink()
    manifest = read_state(rendered_fresh, "manifest.json")
    manifest["files"].remove(rel)
    write_state(rendered_fresh, "manifest.json", manifest)
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert result.restarted == ["home-assistant"] and brain.posts == []


def test_no_token_on_disk_restarts_instead_and_says_so(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    pkg = a_scenes_package(rendered_fresh)
    touch_a_look(pkg)
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert result.restarted == ["home-assistant"] and not result.reloaded
    assert brain.posts == [] and any("no conductor token" in n for n in result.notes)


def test_a_refused_token_restarts_instead(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    pkg = a_scenes_package(rendered_fresh)
    touch_a_look(pkg)
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=FakeBrain(401))
    assert result.restarted == ["home-assistant"] and not result.reloaded
    assert any("refused" in n for n in result.notes)
    assert "systemctl restart home-assistant.service" in runner.log


def test_a_refused_reload_is_a_fault_not_a_restart(witness, rendered_fresh, tmp_path, pinned):
    """The brain refuses a reload when the config is broken: say so and stop -
    a restart into the same config would take the house down with it."""
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    pkg = a_scenes_package(rendered_fresh)
    touch_a_look(pkg)
    with pytest.raises(HouseError, match="refused"):
        brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=FakeBrain(500))
    assert "systemctl restart home-assistant.service" not in runner.log


def test_check_plans_the_reload_and_calls_nothing(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    pkg = a_scenes_package(rendered_fresh)
    touch_a_look(pkg)
    brain = FakeBrain()
    planner = FakeRunner(check=True)  # the plan reads the machine as the first up left it
    planner.active, planner.images = set(runner.active), set(runner.images)
    result = brain_up(witness, rendered_fresh, units_dir, planner, pinned, brain=brain)
    assert result.check and "would reload" in result.summary() and not result.notes
    assert not result.started and not result.restarted
    assert "home-assistant: script.reload" in result.reloaded and brain.posts == []
    rel = str(pkg.relative_to(rendered_fresh))
    assert read_state(rendered_fresh, "stamps.json")[rel] != sha256(pkg.read_bytes())


def test_only_the_domain_whose_block_moved_is_reloaded(witness, rendered_fresh, tmp_path, pinned):
    """0.28.2, read live at 0.28.1's converge: an automation edited reloaded
    the package's five domains, the template reload re-made the room's sensors
    and every automation watching them fired (a state born from nothing passes
    `not_from: unavailable`). The grain is the domain whose block moved."""
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    pkg = a_scenes_package(rendered_fresh)
    text = pkg.read_text()
    assert "\nautomation:\n" in text and "\ntemplate:\n" in text
    marker = "- id: regie_living_party_drift\n"
    assert marker in text
    pkg.write_text(text.replace(marker, marker + "  variables: { touched: 1 }\n", 1))
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert result.reloaded == ["home-assistant: automation.reload"] and not result.restarted
    assert brain.posts == [("/api/services/automation/reload", {})]


def test_a_comment_moved_asks_nothing(witness, rendered_fresh, tmp_path, pinned):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    pkg = a_scenes_package(rendered_fresh)
    pkg.write_text("# rendered again, nothing moved\n" + pkg.read_text())
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert not result.changed and brain.posts == [] and result.summary().endswith("nothing to do")
    rel = str(pkg.relative_to(rendered_fresh))
    assert read_state(rendered_fresh, "stamps.json")[rel] == sha256(pkg.read_bytes())


def test_a_memory_from_0_28_0_is_read_as_asks_without_digests(
    witness, rendered_fresh, tmp_path, pinned
):
    units_dir = tmp_path / "systemd"
    runner = FakeRunner()
    brain_up(witness, rendered_fresh, units_dir, runner, pinned)
    a_token(rendered_fresh)
    pkg = a_scenes_package(rendered_fresh)
    rel = str(pkg.relative_to(rendered_fresh))
    old = read_state(rendered_fresh, "reloads.json")
    old[rel] = sorted(old[rel])  # the list 0.28.0 wrote
    write_state(rendered_fresh, "reloads.json", old)
    pkg.write_text("# a comment\n" + pkg.read_text())
    brain = FakeBrain()
    result = brain_up(witness, rendered_fresh, units_dir, runner, pinned, brain=brain)
    assert not result.restarted and sorted(p for p, _ in brain.posts) == sorted(
        f"/api/services/{a}" for a in old[rel]
    )
    assert isinstance(read_state(rendered_fresh, "reloads.json")[rel], dict)
