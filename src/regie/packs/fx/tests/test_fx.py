"""The fx pack — shapes compiled for the ha backend: bricks, fields, ranges."""

import pytest
import yaml

from regie.errors import HouseError
from regie.fx import compile_shape, load_backend, load_shapes, product_shapes

# The shapes the product ships. VERBS, never nouns: a product shape says what a
# light DOES and may never name a room, a role, a place or a French title —
# those are the house's own, and they live in `ansible/home/fx/`.
BRICKS = {
    # the atoms
    "flash", "fade", "ramp", "pulse", "blackout", "flicker",
    # the brightness-only bricks: they carry the motion, and they are already
    # complete effects on La Cantine's colourless E14 chandelier
    "thump", "flame", "beats",
    # storm
    "strike", "lightning", "farstorm",
    # nervous
    "glitch", "neon",
    # warm
    "fire", "ember", "candle", "dawn",
    # dread
    "gutter", "breath", "heartbeat", "passing", "dying", "possessed",
    "drain", "presence",
    # alive
    "telly",
    # machine
    "prime", "beacon", "redalert", "powerdown",
    # tell
    "doorbell", "timerdone",
}


def test_the_bricks_and_the_backends_load():
    assert set(product_shapes()) == BRICKS
    ha = load_backend("ha")
    assert ha["envelope"]["step"] == 0.05 and ha["compiler"] == "engine"
    zig = load_backend("zigbee")
    assert zig["measured"] is False and zig["envelope"]["group_budget"]["messages"] == 8


def test_flash_compiles_to_two_sets_a_delay_each_and_a_repeat():
    c = compile_shape("flash", load_shapes(), load_backend("ha"))
    (rep,) = c.actions
    assert rep["repeat"]["count"] == "{{ times }}"
    on, hold1, off, hold2 = rep["repeat"]["sequence"]
    assert on["action"] == "light.turn_on" and on["target"] == {"entity_id": "{{ target }}"}
    assert "'brightness_pct': level" in on["data"] and "rgb_color=colour_rgb" in on["data"]
    assert hold1 == {"delay": "{{ [hold | float, 0.05] | max }}"}, "clamped at run time"
    assert "'brightness_pct': 0" in off["data"]
    assert c.notes == [], "0.12 s holds sit above the 0.05 floor: nothing to say"


def sets_and_delays(actions):
    """Flatten repeats: the turn_on data strings and the delays, in order."""
    out = []
    for a in actions:
        if "repeat" in a:
            out.append(("repeat", a["repeat"]["count"]))
            out += sets_and_delays(a["repeat"]["sequence"])
        elif "delay" in a:
            out.append(("delay", a["delay"]))
        else:
            out.append(("set", a["data"]))
    return out


def test_strike_is_a_stroke_with_random_inside_its_leash():
    c = compile_shape("strike", load_shapes(), load_backend("ha"))
    flat = sets_and_delays(c.actions)
    delays = [v for k, v in flat if k == "delay"]
    # the leader: 60-120 ms drawn at run time, clamped at the floor
    assert delays[0] == "{{ [((range(60, 121) | random) / 1000), 0.05] | max }}"
    # the dark gap
    assert delays[2] == "{{ [((range(40, 101) | random) / 1000), 0.05] | max }}"
    # the flickers: 1 to 3 of them, 20-50 %, 40-90 ms
    repeats = [v for k, v in flat if k == "repeat"]
    assert "{{ (range(1, 4) | random) }}" in repeats
    sets = [v for k, v in flat if k == "set"]
    assert any("'brightness_pct': (range(20, 51) | random)" in s for s in sets)
    # the return stroke and the tail
    assert any("'brightness_pct': (range(70, 101) | random)" in s for s in sets)
    assert any("'transition': ((range(300, 801) | random) / 1000)" in s for s in sets)
    assert delays[-1] == "{{ [((range(300, 801) | random) / 1000), 0.05] | max }}"
    assert c.notes == [
        "strike: asks 0.04 s steps, ha gives 0.05",
        "strike: holds down to 0.04 s asked, the backend gives 0.05 → the low end stretched",
        "strike/flash: holds down to 0.04 s asked, the backend gives 0.05 → the low end stretched",
    ]
    assert all("colour_rgb" in s for s in sets[:-1]), "the outer colour reaches every brick"


def test_lightning_glitch_neon_fire():
    shapes, ha = load_shapes(), load_backend("ha")
    storm = compile_shape("lightning", shapes, ha)
    (rep,) = storm.actions
    assert rep["repeat"]["count"] == "{{ (range(3, 7) | random) }}"
    assert rep["repeat"]["sequence"][-1]["delay"] == (
        "{{ [((range(2000, 9001) | random) / 1000), 0.05] | max }}"
    )
    glitch = compile_shape("glitch", shapes, ha)
    flat = sets_and_delays(glitch.actions)
    assert flat[0] == ("repeat", "{{ (range(2, 5) | random) }}")
    assert ("repeat", "{{ (range(3, 9) | random) }}") in flat, "the flicker bursts"
    assert any("range(30, 101)" in v for k, v in flat if k == "set")
    neon = compile_shape("neon", shapes, ha)
    assert neon.restore is False, "a neon that started stays on"
    fire = compile_shape("fire", shapes, ha)
    (rep,) = fire.actions
    assert rep["repeat"]["count"] == "{{ cycles }}"
    assert "rgb_color=colour_rgb" in rep["repeat"]["sequence"][0]["data"]
    assert (
        "'transition': ((range(100, 301) | random) / 1000)" in rep["repeat"]["sequence"][0]["data"]
    )


def test_a_house_shape_and_a_bad_reference():
    shapes = load_shapes({"blink3": {"steps": [{"use": "flash", "times": 3}]}})
    c = compile_shape("blink3", shapes, load_backend("ha"))
    assert c.actions[0]["repeat"]["count"] == 3
    with pytest.raises(HouseError, match="has no field 'speed'"):
        compile_shape(
            "bad",
            load_shapes({"bad": {"steps": [{"use": "flash", "speed": 1}]}}),
            load_backend("ha"),
        )
    with pytest.raises(HouseError, match=r"a range reads \[lo, hi\]"):
        compile_shape("r", load_shapes({"r": {"steps": [{"level": [90, 10]}]}}), load_backend("ha"))
    with pytest.raises(HouseError, match="unknown backend"):
        load_backend("nope")


def test_the_scripts_render_with_snapshot_and_restore(rendered):
    pkg = yaml.safe_load((rendered / "home-assistant/packages/fx.yaml").read_text(encoding="utf-8"))
    scripts = pkg["script"]
    assert set(scripts) == {f"fx_{b}" for b in BRICKS}
    flash = scripts["fx_flash"]
    assert flash["mode"] == "parallel" and flash["fields"]["target"]["required"] is True
    assert flash["fields"]["hold"]["default"] == 0.12
    assert flash["variables"]["hold"] == "{{ hold | default(0.12) }}"
    # one scene per run, named by the clock (a script's variables know no `context`)
    assert flash["variables"]["snapshot"] == (
        "fx_{{ this.entity_id[7:] }}_{{ now().strftime('%Y%m%d%H%M%S%f') }}"
    )
    assert "context" not in flash["variables"]["snapshot"]
    assert flash["sequence"][0] == {
        "action": "scene.create",
        "data": {"scene_id": "{{ snapshot }}", "snapshot_entities": "{{ target }}"},
    }
    last = flash["sequence"][-1]
    assert (
        last["then"][0]["action"] == "scene.turn_on" and last["then"][1]["action"] == "scene.delete"
    )
    assert scripts["fx_neon"]["fields"]["restore"]["default"] is False


def test_enable_narrows_the_scripts(house_with, secrets, tmp_path):
    from regie.house import load_house
    from regie.render import render

    path = house_with(lambda d: None)
    (path.parent / "fx.yml").write_text("enable: [flash, pulse]\n", encoding="utf-8")
    render(load_house(path), tmp_path, secrets)
    pkg = yaml.safe_load((tmp_path / "home-assistant/packages/fx.yaml").read_text())
    assert list(pkg["script"]) == ["fx_flash", "fx_pulse"]
    (path.parent / "fx.yml").write_text("enable: [flash]\n", encoding="utf-8")
    with pytest.raises(HouseError, match="shape 'pulse' is not enabled"):
        load_house(path)  # the witness's story uses pulse
