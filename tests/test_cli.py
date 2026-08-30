import yaml

from conftest import WITNESS
from regie.cli import main


def test_check_reports_and_passes(witness_path, capsys):
    assert (
        main(["check", str(witness_path), "--secrets", str(WITNESS / "secrets.example.yml")]) == 0
    )
    out = capsys.readouterr().out
    assert "maison_temoin — Maison témoin (fr, Europe/Paris)" in out
    assert (
        "profile ct · packs modes, signals, scenes, fx, notify, scenarios, lighting, matter, "
        "chalet (house)" in out
    )
    assert (
        "zigbee main: tcp://192.0.2.10:6638 (zstack), channel 25, 18 paired, 5 room groups" in out
    )
    assert "secrets: 9 needed, all present" in out
    assert "matter: the server beside the brain (ws://localhost:5580/ws), 1 thing(s)" in out
    assert "not paired yet" in out and out.rstrip().endswith("ok")


def test_check_without_secrets_names_them_and_strict_fails_on_warnings(witness_path, capsys):
    assert main(["check", str(witness_path)]) == 0
    assert "9 needed, 9 missing" in capsys.readouterr().out
    assert main(["check", str(witness_path), "--strict"]) == 1


def test_a_broken_house_exits_one_with_the_fault(tmp_path, capsys):
    bad = tmp_path / "home.yml"
    bad.write_text("schema: 1\nhouse: {name: x, label: X}\nprofile: ct\nareas: []\nthings: []\n")
    assert main(["check", str(bad)]) == 1
    assert "areas: [] should be non-empty" in capsys.readouterr().err


def test_render_writes_and_reports(witness_path, tmp_path, capsys):
    rc = main(
        [
            "render",
            str(witness_path),
            "--out",
            str(tmp_path),
            "--secrets",
            str(WITNESS / "secrets.example.yml"),
        ]
    )
    assert rc == 0
    out = capsys.readouterr().out
    assert "31 written, 0 unchanged, 0 kept, 0 removed" in out
    assert "  + units/home-assistant.container" in out


def test_declared_verbs_say_which_release(witness_path, capsys):
    assert main(["doctor", str(witness_path)]) == 2
    assert "lands in 0.6 — the Zigbee walk" in capsys.readouterr().err
    # pair is built for Matter; its Zigbee half says when it lands
    assert main(["pair", str(witness_path), "--room", "living"]) == 2
    assert "lands in 0.6" in capsys.readouterr().err


def test_mint_completes_a_secrets_file(witness_path, tmp_path, capsys):
    out = tmp_path / "secrets.yml"
    out.write_text("mqtt_password_home: keep-me\n")
    assert main(["mint", str(witness_path), "--secrets", str(out)]) == 0
    assert "8 minted" in capsys.readouterr().out
    values = yaml.safe_load(out.read_text())
    assert values["mqtt_password_home"] == "keep-me" and len(values) == 9
    assert len(values["zigbee_main_network_key"]) == 16


def test_init_writes_a_house_that_checks(tmp_path, capsys):
    target = tmp_path / "new"
    assert (
        main(["init", str(target), "--name", "chalet", "--label", "Le chalet", "--lang", "fr"]) == 0
    )
    assert main(["check", str(target / "home.yml"), "--secrets", str(target / "secrets.yml")]) == 0
    assert "secrets: 7 needed, all present" in capsys.readouterr().out
    assert main(["init", str(target)]) == 1


def test_packs_and_profiles_list(capsys):
    assert main(["packs"]) == 0 and "lighting:" in capsys.readouterr().out
    assert main(["profiles"]) == 0 and "ct:" in capsys.readouterr().out
