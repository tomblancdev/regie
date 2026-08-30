"""The fx pack — shapes compiled for the ha backend."""

import pytest
import yaml

from regie.errors import HouseError
from regie.fx import compile_shape, load_backend, load_shapes, product_shapes


def test_the_bricks_and_the_backends_load():
    shapes = product_shapes()
    assert set(shapes) >= {"flash", "fade", "pulse", "blackout", "strike"}
    ha = load_backend("ha")
    assert ha["envelope"]["step"] == 0.2 and ha["compiler"] == "engine"
    zig = load_backend("zigbee")
    assert zig["measured"] is False and zig["envelope"]["group_budget"]["messages"] == 8


def test_flash_compiles_to_two_sets_a_delay_each_and_a_repeat():
    c = compile_shape("flash", load_shapes(), load_backend("ha"))
    (rep,) = c.actions
    assert rep["repeat"]["count"] == "{{ times }}"
    on, hold1, off, hold2 = rep["repeat"]["sequence"]
    assert on["action"] == "light.turn_on" and on["target"] == {"entity_id": "{{ target }}"}
    assert "'brightness_pct': level" in on["data"] and "rgb_color=colour_rgb" in on["data"]
    assert hold1 == {"delay": "{{ [hold | float, 0.2] | max }}"}, "clamped at run time"
    assert "'brightness_pct': 0" in off["data"]
    assert c.notes == ["flash: asks 0.12 s steps, ha gives 0.2"]


def test_strike_composes_bricks_and_binds_their_fields():
    c = compile_shape("strike", load_shapes(), load_backend("ha"))
    delays = [a["delay"] for a in c.actions if "delay" in a]
    assert delays == [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 1], "three flashes stretched, the tail's second"
    assert any("stretched" in n for n in c.notes)
    sets = [a for a in c.actions if "action" in a]
    assert "'brightness_pct': 30" in sets[2]["data"], "the second flash is the weak one"
    assert "'transition': 1" in sets[-1]["data"], "the tail fades over a second"
    assert "colour_rgb" in sets[0]["data"], "the outer colour reaches the inner brick"


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
    with pytest.raises(HouseError, match="unknown backend"):
        load_backend("nope")


def test_the_scripts_render_with_snapshot_and_restore(rendered):
    pkg = yaml.safe_load((rendered / "home-assistant/packages/fx.yaml").read_text(encoding="utf-8"))
    scripts = pkg["script"]
    assert set(scripts) == {"fx_flash", "fx_fade", "fx_pulse", "fx_blackout", "fx_strike"}
    flash = scripts["fx_flash"]
    assert flash["mode"] == "parallel" and flash["fields"]["target"]["required"] is True
    assert flash["fields"]["hold"]["default"] == 0.12
    assert flash["variables"]["hold"] == "{{ hold | default(0.12) }}"
    assert flash["variables"]["snapshot"] == "fx_{{ this.entity_id[7:] }}_{{ context.id | lower }}"
    assert flash["sequence"][0] == {
        "action": "scene.create",
        "data": {"scene_id": "{{ snapshot }}", "snapshot_entities": "{{ target }}"},
    }
    last = flash["sequence"][-1]
    assert (
        last["then"][0]["action"] == "scene.turn_on" and last["then"][1]["action"] == "scene.delete"
    )


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
