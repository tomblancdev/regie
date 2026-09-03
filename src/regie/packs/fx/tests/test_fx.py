"""The fx pack — shapes compiled for the ha backend: bricks, fields, ranges."""

import re

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


def test_strike_spikes_above_the_room_and_gives_it_back():
    """Un éclair éclaire une pièce DÉJÀ ALLUMÉE : il pointe au-dessus d'elle et
    la lui rend. Les trois fautes que ce test verrouille — la pièce laissée
    noire, l'absence de retour à l'ambiance, et une couleur prise à la cible."""
    c = compile_shape("strike", load_shapes(), load_backend("ha"))
    # 1. la couleur est celle de LA FORME, et elle est bleu-blanc froide
    assert c.fields["colour"] == "#cfe0ff", "un éclair dans une pièce rouge était rouge"
    # 2. la traîne est un RETOUR À L'AMBIANCE, pas un fondu vers le noir
    back = c.actions[-2]
    assert back["action"] == "scene.turn_on"
    assert back["target"] == {"entity_id": "scene.{{ snapshot }}"}
    assert back["data"] == {"transition": "{{ back }}"}
    assert c.actions[-1] == {"delay": "{{ [back | float, 0.05] | max }}"}
    # 3. plus AUCUN pas ne finit la forme sur du noir
    sets = [a for a in c.actions if a.get("action") == "light.turn_on"]
    assert "'brightness_pct': 0" not in sets[-1]["data"], "la forme ne finit plus éteinte"
    # le traceur et l'arc de retour portent bien la couleur de la forme
    assert "rgb_color=colour_rgb" in sets[0]["data"]
    assert any("'brightness_pct': (range(70, 101) | random)" in a["data"] for a in sets)


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


def test_lightning_keeps_the_room_alive_between_the_strikes():
    """L'ancienne forme tenait `level: 0` pendant 2 à 9 s, trois à six fois :
    une pièce noire avec deux flashs dedans. Elle est maintenant un ARC, et la
    pièce est elle-même entre les coups."""
    c = compile_shape("lightning", load_shapes(), load_backend("ha"))
    (rep,) = c.actions
    seq = rep["repeat"]["sequence"]
    assert rep["repeat"]["count"] == "{{ passes }}"
    backs = [a for a in seq if a.get("action") == "scene.turn_on"]
    # deux retours propres à l'arc + un par `strike` : `use:` aplatit, donc la
    # composition se COMPTE ici — c'est ce qui prouve qu'une brique corrigée
    # corrige tout ce qui l'emploie
    assert len(backs) == 4
    # un `strike` garde son intervalle sombre — 40 à 90 ms — mais le LONG noir
    # a disparu : plus aucun 0 % n'est suivi d'une pause qui se compte en
    # secondes (l'ancienne forme tenait 2 à 9 s, trois à six fois)
    for i, a in enumerate(seq[:-1]):
        if a.get("action") == "light.turn_on" and "'brightness_pct': 0" in a["data"]:
            after = seq[i + 1]
            hi = int(re.search(r"range\(\d+, (\d+)\)", after["delay"]).group(1))
            assert hi <= 1000, f"un noir de {hi} ms suit un pas à 0 %"
    # une ATTENTE existe : un delay que ne précède aucun light.turn_on
    kinds = [a.get("action") or ("delay" if "delay" in a else "repeat") for a in seq]
    assert any(
        kinds[i] == "delay" and kinds[i - 1] == "delay" for i in range(1, len(kinds))
    ), "un pas qui ne dit qu'un hold est une attente, pas un allumage à 100 %"


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
    # la restitution est conditionnelle ; la DESTRUCTION de la scène ne l'est pas
    put_back = flash["sequence"][-2]
    assert put_back["then"] == [
        {"action": "scene.turn_on", "target": {"entity_id": "scene.{{ snapshot }}"}}
    ]
    assert flash["sequence"][-1] == {
        "action": "scene.delete",
        "target": {"entity_id": "scene.{{ snapshot }}"},
    }, "restore: false laissait une entité scene.fx_* par exécution, pour toujours"
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
