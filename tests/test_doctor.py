"""`regie doctor` against the fake brain: green when the brain agrees with
the files, one red line per disagreement, a note for what is nobody's
fault, and exit 1 on any red. The host is a fake runner that answers
systemctl and podman from a small live state."""

import sqlite3
from pathlib import Path

import pytest

from regie.cli import main
from regie.doctor import ENTITY_DOMAINS, container_of, doctor, recorder, references
from regie.up import up
from tests.test_apply import FakeHA
from tests.test_up import FakeRunner


class DoctorRunner(FakeRunner):
    """`systemctl show` and `podman inspect` answered from what the units
    fake did: a started unit is active since a fixed stamp and runs the image
    it pulled, unless a test says otherwise."""

    def __init__(self, check=False):
        super().__init__(check)
        self.running: dict[str, str] = {}  # container name -> the image it runs
        self.since = "Sun 2026-09-06 10:21:54 UTC"

    def query(self, *cmd):
        if cmd[:2] == ("systemctl", "show"):
            active = cmd[-1] in self.active  # the fake keeps `<unit>.service`
            return 0, (
                f"ActiveState={'active' if active else 'inactive'}\n"
                f"SubState={'running' if active else 'dead'}\n"
                f"ActiveEnterTimestamp={self.since if active else ''}\n"
            )
        if cmd[:2] == ("podman", "inspect"):
            name = cmd[-1]
            return (0, self.running[name] + "\n") if name in self.running else (125, "")
        return super().query(*cmd)


@pytest.fixture(autouse=True)
def _no_wait(monkeypatch):
    monkeypatch.setattr("regie.up.wait_for", lambda *a, **k: None)


@pytest.fixture
def converged(witness, rendered_fresh):
    """The witness brought up on the fake host, and a fake brain that holds
    every entity the files name — the green case. Returns (runner, ha)."""
    root = rendered_fresh
    runner = DoctorRunner()
    up(witness, root, root / "units", runner)
    for rel in [r for r in runner.log if r.startswith("systemctl start ")]:
        unit = rel.rsplit(" ", 1)[1].removesuffix(".service")
        text = (root / "units" / f"{unit}.container").read_text()
        image = next(x for x in text.splitlines() if x.startswith("Image=")).split("=", 1)[1]
        runner.running[container_of(text) or f"systemd-{unit}"] = image
    ha = FakeHA()
    tokens = root / ".regie" / "tokens"
    tokens.mkdir(parents=True, exist_ok=True)
    (tokens / "regie").write_text("tok")
    ha.tokens["tok"] = "llat"
    ha.token = "tok"
    tree = root / "home-assistant"
    named = references(
        sorted(tree.glob("packages/*.yaml")) + sorted(tree.glob("dashboards/*.yaml")),
        set(ENTITY_DOMAINS),
        {d: set(s) for d, s in ha.services.items()},
    )
    for e in named:
        ha.states[e] = "on"
    for t in witness.things:
        if witness.entity(t):
            ha.states[witness.entity(t)] = "on"
    ha.states["switch.zigbee2mqtt_bridge_permit_join"] = "off"
    ha.states["binary_sensor.zigbee2mqtt_bridge_connection_state"] = "on"
    return runner, ha


def run_doctor(witness, root, runner, ha, db=None):
    return doctor(witness, root, root / "units", runner, brain_client=ha, db=db)


def test_a_converged_brain_is_green(witness, rendered_fresh, converged):
    runner, ha = converged
    report = run_doctor(witness, rendered_fresh, runner, ha)
    text = "\n".join(report.text())
    assert report.exit_code() == 0, text
    assert not report.red
    names = [x.name for x in report.lines]
    assert names[0] == "unit home-assistant" and "unit mosquitto" in names
    for name in ("brain", "files", "config", "references", "repairs", "ghosts", "mesh", "things"):
        assert name in names, text
    assert "  = files: up has nothing to do" in text
    assert "= brain: RUNNING, Home Assistant 2026.8.3 — the version this release" in text
    assert "= unit home-assistant: active since 2026-09-06 10:21:54 UTC — " in text
    assert "= ghosts: none" in text
    assert "= log: clean since the start" in text
    assert "~ recorder: no sqlite file at" in text  # the fake host has none: said, not green
    assert report.summary().endswith("— the brain agrees with the files")


def test_every_disagreement_is_a_red_line(witness, rendered_fresh, converged):
    """A unit down, a container behind its unit, a file changed since the last
    up, a config the brain refuses, an entity the files name and the brain
    lacks, a repair, a ghost helper, the join window open — eight reds, one
    line each, the summary naming them; the things that do not answer and
    the log are notes, never red."""
    runner, ha = converged
    root = rendered_fresh
    runner.active.discard("mosquitto.service")
    runner.running["home-assistant"] = "ghcr.io/home-assistant/home-assistant:2020.1.0"
    pk = next(iter(sorted((root / "home-assistant" / "packages").glob("*.yaml"))))
    pk.write_text(pk.read_text() + "\ninput_boolean:\n  doctor_touched: {}\n")
    ha.config_result = "invalid"
    gone = next(e for e in ha.states if e.startswith("script."))
    del ha.states[gone]
    ha.issues = [
        {
            "domain": "automation",
            "issue_id": "x_service_not_found_script.gone",
            "translation_key": "service_not_found",
            "severity": "error",
            "ignored": False,
            "translation_placeholders": {
                "service": "script.gone",
                "name": "A hand",
                "edit": "/config/automation/edit/x",
            },
        },
        {"domain": "heos", "issue_id": "ignored", "ignored": True, "severity": "warning"},
    ]
    # two of ours: a package rendered once and gone. A restored entity always
    # HAS a registry row — that is what restored means — and the row is what
    # tells ours from another integration's (0.39.3), so the double carries it:
    # a YAML helper's row is keyed on its object id, never a `regie_` id (0.26.2)
    for entity, platform in (
        ("input_text.house_palette_perso1_name", "input_text"),
        ("input_number.house_palette_perso1_start", "input_number"),
    ):
        ha.states[entity] = "unavailable"
        ha.attributes[entity] = {"restored": True}
        ha.entities.append(
            {"entity_id": entity, "platform": platform, "unique_id": entity.split(".", 1)[1]}
        )
    # and one that is NOT ours: a cloud appliance's setting, whose integration
    # came up without it. Named, never a red — the house did not mint that row
    # and `apply` will never remove it
    ha.states["select.hood_functional_light_color_temperature"] = "unavailable"
    ha.attributes["select.hood_functional_light_color_temperature"] = {"restored": True}
    ha.entities.append(
        {
            "entity_id": "select.hood_functional_light_color_temperature",
            "platform": "home_connect",
            "unique_id": "305030540342002302-Cooking.Hood.Setting.ColorTemperature",
        }
    )
    ha.states["switch.zigbee2mqtt_bridge_permit_join"] = "on"
    silent = witness.entity(next(t for t in witness.things if t["kind"] == "light"))
    ha.states[silent] = "unavailable"  # unplugged, still provided: a note
    ha.syslog = [
        {
            "level": "ERROR",
            "name": "homeassistant.components.matter",
            "count": 3,
            "message": ["Peer gone"],
        },
        {
            "level": "WARNING",
            "name": "homeassistant.components.heos",
            "count": 1,
            "message": ["Not logged in"],
        },
    ]
    report = run_doctor(witness, root, runner, ha)
    text = "\n".join(report.text())
    assert report.exit_code() == 1
    by = {x.name: x for x in report.lines}
    assert by["unit mosquitto"].state == "red" and "inactive (dead)" in by["unit mosquitto"].detail
    assert by["unit home-assistant"].state == "red"
    assert "runs ghcr.io/home-assistant/home-assistant:2020.1.0 while the unit names" in text
    assert (
        by["files"].state == "red"
        and "up would reload home-assistant: input_boolean.reload" in text
    )
    assert by["config"].state == "red" and by["config"].detail.startswith("invalid")
    assert by["references"].state == "red"
    assert f"{gone} (" in text
    assert by["repairs"].state == "red" and by["repairs"].detail == "1 open"
    assert by["repairs"].more == [
        "automation service_not_found (error): service script.gone, name A hand"
    ]
    assert by["ghosts"].state == "red"
    assert by["ghosts"].detail.startswith("2 the registry keeps")
    assert by["ghosts"].more == [
        "input_number ×1: house_palette_perso1_start",
        "input_text ×1: house_palette_perso1_name",
    ]
    # the appliance's row is said in full and is a NOTE: a converge does not
    # die on a registry row the house never minted (0.39.3, read live on the
    # hood — it cost every restart a red)
    assert by["restored"].state == "note"
    assert by["restored"].detail.startswith("1 row(s) another integration keeps")
    assert "select ×1: hood_functional_light_color_temperature" in by["restored"].more[0]
    assert "not ours to remove" in by["restored"].more[-1]
    assert by["mesh"].state == "red" and "the join window is open" in by["mesh"].detail
    assert by["things"].state == "note" and "1 of " in by["things"].detail
    assert silent in by["things"].detail
    assert by["log"].state == "note"
    assert by["log"].detail == "1 error(s) (3 times), 1 warning(s) since the start"
    assert by["log"].more[0] == "error homeassistant.components.matter ×3: Peer gone"
    assert report.summary().startswith("doctor: ")
    assert report.summary().endswith(
        "— RED: unit home-assistant, unit mosquitto, files, config, references, repairs, "
        "ghosts, mesh"
    )


def test_a_brain_that_cannot_be_asked_is_red_not_green(witness, rendered_fresh, converged):
    """No conductor token on disk, or a token the brain refuses: the API
    checks are not read, and unknown is not green."""
    runner, ha = converged
    root = rendered_fresh
    (root / ".regie" / "tokens" / "regie").unlink()
    report = doctor(witness, root, root / "units", runner)
    assert [x.name for x in report.red] == ["brain"]
    assert "no conductor token" in report.red[0].detail
    assert "regie apply" in report.red[0].detail
    ha.token = "stale"
    report = run_doctor(witness, root, runner, ha)
    assert [x.name for x in report.red] == ["brain"]
    assert "the conductor's token is refused" in report.red[0].detail


def test_references_read_what_the_files_name(tmp_path):
    """A `domain.object` in a value or a key is a reference; a service of the
    domain is not (light.turn_on), nor a template's prefix
    (script.living_{{ … }}), nor a word of a domain no entity has; the
    `states.sensor.x` spelling counts; a broken file is skipped."""
    (tmp_path / "a.yaml").write_text(
        "script:\n  x:\n    sequence:\n"
        "      - action: light.turn_on\n        target: { entity_id: light.hall_main }\n"
        "      - action: script.living_{{ states('input_select.living_look') }}\n"
        "      - condition: template\n"
        "        value_template: \"{{ states.sensor.house_period.state == 'day' }}\"\n"
        "homeassistant:\n  customize:\n    light.hall_main: { icon: mdi:x }\n"
        'template:\n  - sensor:\n      - name: y\n        state: "{{ example.com }}"\n'
        "        icon: mdi:light-switch\n"
    )
    (tmp_path / "b.yaml").write_text(
        "automation:\n  - alias: z\n    trigger: { entity_id: sun.sun }\n"
    )
    (tmp_path / "broken.yaml").write_text("script: [\n")
    named = references(
        sorted(tmp_path.glob("*.yaml")),
        {"light", "script", "input_select", "sensor", "sun"},
        {"light": {"turn_on"}, "script": {"turn_on"}},
    )
    assert named == {
        "light.hall_main": {"a.yaml"},
        "input_select.living_look": {"a.yaml"},
        "sensor.house_period": {"a.yaml"},
        "sun.sun": {"b.yaml"},
    }


def test_the_recorder_line_reads_the_runs(tmp_path):
    """The file's size, the open run, how the last closed one ended (an
    unfinished close is a stop that was a kill), how many did over the file's
    life; no file = said, a note."""
    from regie.doctor import Report

    db = tmp_path / "home-assistant_v2.db"
    con = sqlite3.connect(db)
    con.execute(
        "create table recorder_runs (run_id integer, start text, end text, "
        "closed_incorrect integer, created text)"
    )
    con.executemany(
        "insert into recorder_runs values (?, ?, ?, ?, ?)",
        [
            (83, "2026-09-05 10:51:14.773428", "2026-09-06 09:00:09.068003", 1, ""),
            (84, "2026-09-06 09:00:09.068003", "2026-09-06 10:21:46.173295", 0, ""),
            (85, "2026-09-06 10:22:00.119167", None, 0, ""),
        ],
    )
    con.commit()
    con.close()
    report = Report()
    recorder(db, report)
    (line,) = report.lines
    assert line.state == "note"
    assert line.detail.endswith(
        "— run 85 open since 2026-09-06 10:22:00 UTC — the last closed run (84) ended clean "
        "— 1 of 2 closed runs unfinished"
    )
    assert line.detail.split(" MiB")[0].replace(".", "").isdigit()
    con = sqlite3.connect(db)
    con.execute("update recorder_runs set closed_incorrect = 1 where run_id = 84")
    con.commit()
    con.close()
    report = Report()
    recorder(db, report)
    assert (
        "the last closed run (84) ended UNFINISHED — its stop was a kill" in report.lines[0].detail
    )
    report = Report()
    recorder(tmp_path / "none.db", report)
    assert report.lines[0].state == "note" and "no sqlite file" in report.lines[0].detail


def test_the_cli_prints_the_report_and_exits_on_red(
    witness_path, witness, rendered_fresh, converged, monkeypatch, capsys
):
    runner, ha = converged
    root = rendered_fresh
    monkeypatch.setattr("regie.host.Runner", lambda check=False: runner)
    monkeypatch.setattr("regie.doctor.HomeAssistant", lambda url, token=None: ha)
    args = [
        "doctor",
        str(witness_path),
        "--root",
        str(root),
        "--units-dir",
        str(root / "units"),
    ]
    assert main(args) == 0
    out = capsys.readouterr().out
    assert out.splitlines()[-1].startswith("doctor: ") and "agrees with the files" in out
    ha.issues = [{"domain": "x", "translation_key": "y", "severity": "error", "ignored": False}]
    assert main(args) == 1
    out = capsys.readouterr().out
    assert "  ! repairs: 1 open" in out
    assert "      x y (error)" in out
    assert out.splitlines()[-1].endswith("— RED: repairs")


def test_a_tool_the_host_lacks_is_said_not_green(witness, rendered_fresh, converged):
    """The doctor runs queries only (Runner(check=True)): a host without
    systemctl answers 127 and the unit line says so, red."""
    runner, ha = converged

    class Bare(DoctorRunner):
        def query(self, *cmd):
            if cmd[0] == "systemctl" and cmd[1] == "show":
                return 127, ""
            return super().query(*cmd)

    bare = Bare()
    bare.active, bare.images, bare.running = runner.active, runner.images, runner.running
    report = run_doctor(witness, rendered_fresh, bare, ha)
    assert all(x.state == "red" for x in report.lines if x.name.startswith("unit "))
    assert "systemctl is not on this host" in report.lines[0].detail


def test_container_of_reads_the_unit():
    assert container_of("[Container]\nImage=x\nContainerName=home-assistant\n") == "home-assistant"
    assert container_of("[Container]\nImage=x\n") is None


def test_nothing_rendered_is_one_red_line(witness, tmp_path):
    report = doctor(witness, tmp_path, tmp_path / "units", DoctorRunner())
    assert [x.state for x in report.lines] == ["red"]
    assert "nothing rendered under" in report.lines[0].detail
    assert Path(report.lines[0].detail.split("under ")[1].split(" ")[0]) == tmp_path
