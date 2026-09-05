"""La Palette du jour (0.20) — the value, the draw, the template, the checks."""

import datetime as dt
import json

import jinja2
import pytest
import yaml

from regie import palette as P
from regie.errors import HouseError
from regie.house import load_house

RULES = P.normalise(
    {
        "today": {
            "level": {"curve": {"morning": 60, "day": 40}, "jitter": [0, 15]},
            "alive": [0, "all"],
            "life": {"shapes": ["glitch"], "every": [120, 600], "chance": 50},
        }
    }
)["today"]
SALT = P.salt_of("Maison témoin")
DAYS = range(20700, 20700 + 3650)  # ten years of days (the pure-Python sweeps)
SAMPLED = range(20700, 20700 + 3650, 5)  # every fifth day, for the sweeps that render Jinja


def _arc(p: dict) -> list[int]:
    return [(p["lo"] + d) % 360 for d in range(p["width"] + 1)]


def test_the_draw_is_a_pure_function():
    a = P.draw(20800, 0, SALT, RULES)
    assert a == P.draw(20800, 0, SALT, RULES)
    assert a != P.draw(20801, 0, SALT, RULES)
    assert a != P.draw(20800, 1, SALT, RULES)
    assert a != P.draw(20800, 0, SALT + 1, RULES)


def test_the_arc_never_crosses_the_avoided_quarter_over_ten_years():
    av0, av1 = RULES["avoid"]
    seen = set()
    for day in DAYS:
        for roll in (0, 1):
            p = P.draw(day, roll, SALT, RULES)
            seen.add(p["harmony"])
            assert not any(P.in_arc(h, av0, av1) for h in _arc(p)), (day, roll, p)
            lo, hi = P.HARMONIES[p["harmony"]]
            assert lo <= p["width"] <= hi
            assert 85 <= p["saturation"] <= 100
            assert 0 <= p["jitter"] <= 15
            assert p["alive"] == [0, "all"]
            # the accent answers the arc's side: a lamp's colour from the far side
            if p["white"] == "neutral":  # a cold arc
                assert p["accent"] >= 345 or p["accent"] <= 45, p
            else:
                assert 170 <= p["accent"] <= 220, p
    assert seen == {"degrade", "duo", "uni"}  # libre at weight 0 is never drawn


def test_life_comes_on_about_half_the_days():
    on = sum(1 for day in DAYS if P.draw(day, 0, SALT, RULES)["life"])
    assert 0.4 < on / len(DAYS) < 0.6
    p = next(P.draw(day, 0, SALT, RULES) for day in DAYS if P.draw(day, 0, SALT, RULES)["life"])
    assert p["life"] == {"shapes": ["glitch"], "every": [120, 600]}


def test_the_template_agrees_with_python_over_ten_years():
    """One arithmetic, two runtimes: the sensor's Jinja and `regie palette`."""
    body = P.jinja_body(RULES, SALT)
    tpl = jinja2.Environment().from_string(
        "{% set day = D %}{% set roll = R %}" + body + "{{ palette | tojson }}"
    )
    for day in SAMPLED:
        for roll in (0, 3):
            got = json.loads(tpl.render(D=day, R=roll))
            assert got == P.draw(day, roll, SALT, RULES), (day, roll)


def test_the_day_turns_at_the_hour_not_at_midnight():
    tz = dt.timezone(dt.timedelta(hours=2))
    before = dt.datetime(2026, 9, 5, 6, 29, tzinfo=tz)
    after = dt.datetime(2026, 9, 5, 6, 31, tzinfo=tz)
    late = dt.datetime(2026, 9, 5, 23, 59, tzinfo=tz)
    assert P.day_of(before, "06:30") == P.day_of(after, "06:30") - 1
    assert P.day_of(after, "06:30") == P.day_of(late, "06:30")
    # the same instant read from another zone is the same HOUSE day: the house's zone decides
    assert P.day_of(after, "06:30", tz) == P.day_of(after.astimezone(dt.UTC), "06:30", tz)


def test_the_salt_is_the_house_name():
    assert P.salt_of("Le Squat") == P.salt_of("Le Squat")
    assert P.salt_of("Le Squat") != P.salt_of("Le Squat ")
    assert 0 < P.salt_of("") < P.M


def test_a_named_palette_carries_the_same_keys_as_a_draw():
    v = P.named_value({"band": [300, 30], "accent": 200, "white": "cool"}, {"cool": 5500})
    assert v["lo"] == 300 and v["hi"] == 30 and v["width"] == 90
    assert v["white_kelvin"] == 5500
    assert set(v) | {"day", "roll"} == set(P.draw(1, 0, 1, RULES))


def test_normalise_gives_a_day_to_a_house_that_wrote_nothing():
    pal = P.normalise(None)
    assert pal["named"] == {}
    assert pal["today"]["harmonies"] == P.DEFAULT_RULES["harmonies"]
    assert pal["today"]["turns"] == "06:30"
    named = P.normalise({"omega": {"band": [190, 340]}})["named"]["omega"]
    assert named["label"] == "Omega"


@pytest.mark.parametrize(
    "today, said",
    [
        ({"harmonies": {"jazz": 3}}, "harmony 'jazz' is not one"),
        ({"harmonies": {"degrade": 0, "duo": 0, "uni": 0}}, "nothing to draw"),
        ({"avoid": [0, 300], "harmonies": {"libre": 1}}, "the widest harmony wants 220°"),
        ({"level": {"jitter": [0, 40]}}, "jitter above 30"),
        ({"life": {"shapes": ["nope"], "every": [120, 600]}}, "life shape 'nope' is not one"),
        ({"life": {"shapes": ["glitch"], "every": [10, 600]}}, "life.every under 60 s"),
        ({"turns": "6h30"}, "turns is an hour"),
        ({"level": {"curve": {"tea": 50}}}, "names period 'tea'"),
    ],
)
def test_check_refuses_a_rule_off_the_page(today, said):
    pal = P.normalise({"today": today})
    errors, _ = P.check(pal, {"glitch", "flash"}, None, ["morning", "day", "evening", "night"])
    assert any(said in e for e in errors), errors


def test_check_on_a_named_palette():
    pal = P.normalise(
        {
            "sale": {
                "band": [30, 120],
                "white": "beige",
                "life": {"shapes": ["glitch"], "every": [120, 300]},
            },
        }
    )
    errors, hints = P.check(pal, {"glitch"}, ["flash"], None)
    assert any("white is one of" in e for e in errors)
    assert any("not enabled in fx" in e for e in errors)
    assert any("crosses the avoided quarter" in h for h in hints)


def test_the_witness_renders_the_sensor_and_the_helpers(rendered, witness):
    pkg = yaml.safe_load((rendered / "home-assistant/packages/palette.yaml").read_text())
    # the day, the named one, then the Atelier and its slots (0.23)
    assert pkg["input_select"]["house_palette"]["options"][:2] == ["Du jour", "Nuit bleue"]
    assert pkg["counter"]["house_palette_roll"]["restore"] is True
    another = pkg["automation"][0]
    assert another["id"] == "regie_house_palette_another"
    # the first press ever comes from `unknown` — it must count (0.20.1)
    assert another["triggers"][0]["not_from"] == ["unavailable"]
    sensor = pkg["template"][0]["sensor"][0]
    assert sensor["unique_id"] == "regie_house_palette"
    attr = sensor["attributes"]["palette"]
    assert "namespace(" in attr and "{{ palette }}" in attr
    assert "source == 'nuit_bleue'" in attr
    assert str(witness.palette_salt()) in attr
    knobs = {k["entity"]: k["value"] for k in witness.knobs()}
    assert knobs["input_datetime.house_palette_turns"] == "06:30"
    assert knobs["input_select.house_palette"] == "Du jour"


def test_the_witness_sensor_template_evaluates_to_the_draw(witness):
    """The rendered attribute template, run with the brain's inputs stubbed:
    the day's draw, then the named one when the select holds it."""
    from regie.palette import render_context

    ctx = render_context(witness)
    attr = ctx["attr"].replace("{{ palette }}", "{{ palette | tojson }}")
    env = jinja2.Environment()
    rules = witness.palettes()["today"]
    values = {
        "input_select.house_palette": "Du jour",
        "counter.house_palette_roll": "2",
        "input_datetime.house_palette_turns": "06:30:00",
    }
    values.update(_rules_values(rules))  # the day's rules live in helpers since 0.24
    env.globals["states"] = lambda e: values.get(e, "unknown")
    env.globals["is_state"] = lambda e, v: values.get(e, "unknown") == v
    now = dt.datetime(2026, 9, 5, 12, 0, tzinfo=dt.timezone(dt.timedelta(hours=2)))
    env.globals["now"] = lambda: now
    env.globals["as_timestamp"] = lambda t: t.timestamp()
    got = json.loads(env.from_string(attr).render())
    day = P.day_of(now, "06:30")
    assert got == P.draw(day, 2, witness.palette_salt(), rules)
    values["input_select.house_palette"] = "Nuit bleue"
    got = json.loads(env.from_string(attr).render())
    assert got["lo"] == 200 and got["accent"] == 30 and got["day"] == day and got["roll"] == 2
    assert env.from_string(ctx["state"]).render().strip() == "nuit_bleue"
    assert env.from_string(ctx["label"]).render().strip() == "Nuit bleue"


def test_a_house_writing_palettes_without_the_pack_is_told(house_with):
    def mutate(d):
        d["packs"] = [p for p in d["packs"] if p != "palette"]

    # the witness's living room reads the palette: without the pack that is a fault
    with pytest.raises(HouseError, match="pack 'palette' is not enabled"):
        load_house(house_with(mutate))


def test_a_bad_palette_fails_the_load(house_with, tmp_path):
    def mutate(d):
        d["controls"]["palette"] = True

    path = house_with(mutate)
    fx = path.parent / "fx.yml"
    fx.write_text(fx.read_text().replace('turns: "06:30"', 'turns: "25:00"'))
    with pytest.raises(HouseError, match="turns is an hour"):
        load_house(path)


# --- step 2 (0.21): the room reads the palette --------------------------------------
def _lamp(by_entity: dict) -> dict:
    return next(s for e, s in by_entity.items() if any("lamp" in x for x in e))


def _room_env(sensor: dict):
    env = jinja2.Environment()
    env.globals["state_attr"] = lambda e, a: sensor if (e, a) == (P.SENSOR, "palette") else None
    env.globals["states"] = lambda e: {"sensor.house_period": "evening"}.get(e, "unknown")
    return env


@pytest.mark.parametrize("alive", [None, "all", 2, [0, "all"], [1, 3]])
def test_the_rooms_draws_agree_between_python_and_the_template(alive):
    env = _room_env({})
    body = P.room_jinja(SALT, "living", alive, 4, 6, "12")
    for day in range(20700, 20700 + 120):
        for roll in (0, 5):
            env.globals["state_attr"] = lambda e, a, d=day, r=roll: {
                "day": d,
                "roll": r,
                "jitter": 12,
            }
            got = json.loads(
                env.from_string(
                    body.replace("{{ {", "{{ ({").replace("} }}", "}) | tojson }}")
                ).render()
            )
            want = P.room_draw(day, roll, SALT, "living", alive, 4, 6, 12)
            assert got == want, (alive, day, roll)
            assert sum(want["alive"]) == want["count"]
            assert all(-12 <= s <= 12 for s in want["scatter"])
    if alive == "all":
        assert want["count"] == 4
    if alive == 2:
        assert want["count"] == 2


def test_alive_count_reads_the_rule():
    assert P.alive_count(None, 0.9, 4) == 0
    assert P.alive_count("all", 0.1, 4) == 4
    assert P.alive_count(6, 0.1, 4) == 4
    assert P.alive_count([0, "all"], 0.0, 4) == 0
    assert P.alive_count([0, "all"], 0.99, 4) == 4
    assert P.alive_count([1, 3], 0.5, 4) == 2
    assert P.alive_count([2, 9], 0.99, 3) == 3


def test_the_witness_look_that_reads_the_palette_renders_as_templates(rendered, witness):
    pkg = yaml.safe_load((rendered / "home-assistant/packages/scenes_living.yaml").read_text())
    today = pkg["script"]["living_today"]
    seq = today["sequence"]
    variables = next(s for s in seq if "variables" in s)["variables"]
    assert variables["pal"] == "{{ state_attr('sensor.house_palette', 'palette') }}"
    assert "namespace(" in variables["room"]
    par = next(s for s in seq if "parallel" in s)["parallel"]
    by_entity = {tuple(s["target"]["entity_id"]): s for s in par}
    # the front row, spread along the arc: its two paired places, each its own hue
    left = by_entity[("light.living_ceiling",)]["data"]
    right = by_entity[("light.living_ceiling_2",)]["data"]
    assert "pal.width * 0.0" in left["hs_color"] and "pal.width * 0.5" in right["hs_color"]
    assert "pal.curve" in left["brightness_pct"] and "room.scatter[" in left["brightness_pct"]
    # the third bulb is a candidate on the arc too (the accent left the grammar in 0.24)
    assert "pal.width * 1.0" in by_entity[("light.living_ceiling_3",)]["data"]["hs_color"]
    # a walker dwells on the accent for a part of its cycle: one more colour of the walk
    assert _lamp(by_entity)["data"]["color_temp_kelvin"] == "{{ pal.white_kelvin }}"
    # the candidates walk behind a gate, from the sensor's arc
    drift = pkg["script"]["living_today_drift"]["sequence"]
    assert "variables" in drift[0]
    walk = drift[1]["repeat"]["sequence"]
    # a hand's off ends the walk (0.25.5): the first step stops when every walker
    # is off, and every walker is painted only while it is on
    assert walk[0]["then"][-1]["stop"] == "every bulb of the look is off — a hand ended the walk"
    assert (
        "| map('states') | select('eq', 'on') | list | count == 0"
        in walk[0]["if"][0]["value_template"]
    )
    walkers = [s for s in walk if "if" in s and s["then"][0].get("action") == "light.turn_on"]
    for s_ in walkers:
        bulb = s_["then"][0]["target"]["entity_id"]
        assert s_["if"][0] == {"condition": "state", "entity_id": bulb, "state": "on"}
    gated = [s for s in walkers if len(s["if"]) == 2]
    assert len(gated) == 3  # the front's two paired places, and the third bulb
    assert gated[0]["if"][1]["value_template"] == "{{ room.alive[0] }}"
    hue = gated[0]["then"][0]["data"]["hs_color"][0]
    assert hue.startswith("{% set pal = state_attr('sensor.house_palette', 'palette') %}")
    assert "(pal.lo + pal.width * t) % 360" in hue
    assert (
        "{% if x >= 0.8 %}{{ ((pal.accent if pal.accent is not none else pal.lo)) % 360 }}" in hue
    )
    assert "saturation" in gated[0]["then"][0]["data"]["hs_color"][1]
    # the room's drift switch exists like any moving look's
    assert "living_today_drift" in pkg["input_boolean"]


def test_the_witness_templates_evaluate_with_the_brains_inputs(rendered):
    """The look's variables and one bulb's data, rendered with a stubbed
    sensor: the numbers a bulb would receive."""
    pkg = yaml.safe_load((rendered / "home-assistant/packages/scenes_living.yaml").read_text())
    seq = pkg["script"]["living_today"]["sequence"]
    variables = next(s for s in seq if "variables" in s)["variables"]
    sensor = P.draw(20700, 0, SALT, RULES)
    env = _room_env(sensor)
    pal = env.from_string(variables["pal"].replace("}}", "| tojson }}")).render()
    room = env.from_string(
        variables["room"].replace("{{ {", "{{ ({").replace("} }}", "}) | tojson }}")
    ).render()
    ctx = {"pal": json.loads(pal), "room": json.loads(room), "period": "evening"}
    par = next(s for s in seq if "parallel" in s)["parallel"]
    for step in par:
        for key, tpl in (step.get("data") or {}).items():
            value = env.from_string(tpl.replace("}}", "| tojson }}")).render(**ctx)
            value = json.loads(value)
            if key == "brightness_pct":
                assert 1 <= value <= 100
            elif key == "hs_color":
                assert 0 <= value[0] < 360 and 0 <= value[1] <= 100
            elif key == "color_temp_kelvin":
                assert value == sensor["white_kelvin"]


def test_check_refuses_a_palette_word_without_a_palette(house_with):
    path = house_with(lambda d: None)
    living = path.parent / "rooms" / "living.yml"
    living.write_text(living.read_text().replace("    palette: today\n", ""))
    with pytest.raises(HouseError, match="names no palette"):
        load_house(path)
    living.write_text(
        living.read_text().replace(
            "    label: Palette du jour\n", "    label: Palette du jour\n    palette: sunset\n"
        )
    )
    with pytest.raises(HouseError, match="reads palette 'sunset'"):
        load_house(path)


def test_a_named_palette_bakes_its_numbers(house_with, tmp_path):
    path = house_with(lambda d: None)
    living = path.parent / "rooms" / "living.yml"
    living.write_text(
        living.read_text().replace("    palette: today\n", "    palette: nuit_bleue\n")
    )
    house = load_house(path)
    area = house.area("living")
    plan = next(p for p in house.scene_plan(area) if p["id"] == "today")
    spal = house.scene_palette(area, plan)
    assert spal["source"] == "nuit_bleue"
    assert spal["pal"].startswith("{'harmony': none, 'lo': 200")
    drift = house.drift_plan(area, plan)
    assert drift["saturation"].endswith(".saturation }}")
    assert drift["walkers"][0]["hue"].startswith("{% set pal = {'harmony': none")


# --- step 3 (0.22): life --------------------------------------------------------------
def test_a_shape_that_sends_a_colour_is_told_apart():
    from regie.fx import load_shapes

    shapes = load_shapes(None)
    assert not P.moves_colour("glitch", shapes)  # its colour field is null: the target's own
    assert not P.moves_colour("flicker", shapes)
    assert P.moves_colour("lightning", shapes)  # "#cfe0ff" by default
    assert P.moves_colour("ember", shapes)  # the colour set once
    assert P.moves_colour("neon", shapes)  # a ct step


def test_the_witness_life_loop_renders_behind_the_looks_switch(rendered, witness):
    pkg = yaml.safe_load((rendered / "home-assistant/packages/scenes_living.yaml").read_text())
    life = pkg["script"]["living_today_life"]
    seq = life["sequence"]
    assert "variables" in seq[0] and "pal" in seq[0]["variables"]
    assert seq[1] == {"condition": "template", "value_template": "{{ pal.life is not none }}"}
    loop = seq[3]["repeat"]
    assert loop["while"][0]["entity_id"] == "input_boolean.living_today_drift"
    steps = loop["sequence"]
    assert "pal.life.every" in steps[0]["delay"]["seconds"]
    # the switch is read again after the wait (0.22.3): a sign never lands
    # after a hand turned the look's ↻ off
    assert steps[1] == {
        "condition": "state",
        "entity_id": "input_boolean.living_today_drift",
        "state": "on",
    }
    # every bulb of the look off: the switch off, the loop ends (0.25.5)
    assert steps[2]["then"][-1] == {"stop": "every bulb of the look is off — a hand ended the look"}
    pick = steps[3]["variables"]["sign"]
    assert "pal.life.shapes" in pick and "reject('eq', last)" in pick
    assert "room.alive[" in pick  # a candidate is still only on a day that left it so
    assert "namespace(still=" in pick  # the still pool grows on a namespace
    assert "is_state(e, 'on')" in pick  # a sign lands on a bulb that is on
    sign = steps[4]
    assert sign["if"][0]["value_template"] == "{{ sign.bulb != '' }}"
    assert sign["then"][0]["action"] == "script.fx_{{ sign.shape }}"
    assert sign["then"][0]["data"]["target"] == ["{{ sign.bulb }}"]
    assert sign["then"][1]["variables"]["last"] == "{{ sign.bulb }}"
    # the look starts it beside the drift, every other look stops it
    today = pkg["script"]["living_today"]["sequence"]
    assert today[-1]["target"]["entity_id"] == "script.living_today_life"
    assert today[-2]["target"]["entity_id"] == "script.living_today_drift"
    stop = pkg["script"]["living_party"]["sequence"][1]
    assert "script.living_today_life" in stop["target"]["entity_id"]
    # a look that refuses life gets no loop, and a look without a palette neither
    assert "living_evening_life" not in pkg["script"]
    assert "living_party_life" not in pkg["script"]
    # a named palette's life bakes its shapes and its pace
    area = witness.area("living")
    plan = next(p for p in witness.scene_plan(area) if p["id"] == "today")
    live = witness.life_plan(area, plan)
    # the union of every palette's shapes: the day's glitch, Nuit bleue's lightning too
    assert live["live"] and live["colour_shapes"] == ["lightning"]


def test_life_evaluates_a_pick_from_the_pools(rendered):
    pkg = yaml.safe_load((rendered / "home-assistant/packages/scenes_living.yaml").read_text())
    steps = pkg["script"]["living_today_life"]["sequence"][3]["repeat"]["sequence"]
    pick = steps[3]["variables"]["sign"]
    tpl = pick.replace("{{ {", "{{ ({").replace("} }}", "}) | tojson }}")
    env = jinja2.Environment()
    env.globals["is_state"] = lambda e, v: e != "light.living_ceiling_3"  # one bulb is off
    ctx = {
        "pal": {"life": {"shapes": ["glitch"], "every": [120, 600]}},
        "room": {"alive": [True, False]},
        "last": "light.living_ceiling_2",
    }
    for _ in range(20):
        got = json.loads(env.from_string(tpl).render(**ctx))
        assert got["shape"] == "glitch"
        # never the last one, never a bulb that is off
        assert got["bulb"] not in ("light.living_ceiling_2", "light.living_ceiling_3")
    env.globals["is_state"] = lambda e, v: False  # every bulb off: no sign
    assert json.loads(env.from_string(tpl).render(**ctx))["bulb"] == ""
    delay = env.from_string(steps[0]["delay"]["seconds"]).render(**ctx)
    assert 120 <= int(delay) <= 600


def test_life_with_a_colour_shape_and_no_still_bulb_is_refused(house_with):
    path = house_with(lambda d: None)
    living = path.parent / "rooms" / "living.yml"
    s = living.read_text()
    s = s.replace(
        "      front: { color: band, brightness: 40 }\n"
        "      back_center: { color: band, brightness: 30 }\n"
        "    lamp: { ct: white, brightness: 50 }\n",
        "      front: { color: roam, brightness: 40 }\n",
    )
    s = s.replace(
        "    palette: today\n    main:\n      front: { color: roam",
        "    palette: nuit_bleue\n    main:\n      front: { color: roam",
        1,
    )
    living.write_text(s)
    with pytest.raises(HouseError, match="no still bulb to land on"):
        load_house(path)


def test_a_today_look_gets_life_when_only_a_named_palette_has_it(house_with):
    """The day's rules carry no life (the house's default) and Nuit bleue does:
    the look that follows the select must have its loop, the sensor deciding."""
    path = house_with(lambda d: None)
    fx = path.parent / "fx.yml"
    s = fx.read_text()
    assert "    life: { shapes: [glitch], every: [120, 600], chance: 50 }\n" in s
    fx.write_text(s.replace("    life: { shapes: [glitch], every: [120, 600], chance: 50 }\n", ""))
    house = load_house(path)
    area = house.area("living")
    plan = next(p for p in house.scene_plan(area) if p["id"] == "today")
    life = house.life_plan(area, plan)
    assert life and life["live"]
    assert life["shapes"] == ["glitch", "lightning"]  # Nuit bleue's, the union
    assert life["colour_shapes"] == ["lightning"]


# --- step 4 (0.23) → the Atelier's step 1 (0.24): the house, the stores, the rules ------
def test_the_witness_house_gets_the_chip_the_repaint_and_the_stores(rendered, witness):
    pkg = yaml.safe_load((rendered / "home-assistant/packages/palette.yaml").read_text())
    # the rendered options: the day and the file's names; the kept names join at runtime
    assert pkg["input_select"]["house_palette"]["options"] == ["Du jour", "Nuit bleue"]
    chip = pkg["script"]["house_palette_today"]["sequence"][0]["parallel"]
    assert [s["target"]["entity_id"] for s in chip] == ["script.living_today"]
    autos = {a["id"]: a for a in pkg["automation"]}
    rep = autos["regie_house_palette_repaint"]
    assert rep["triggers"][0]["attribute"] == "palette"
    assert "not_from" not in rep["triggers"][0]
    branch = rep["actions"][0]["parallel"][0]
    assert (
        "states('input_select.living_look') in ['evening', 'today']"
        in branch["if"][0]["value_template"]
    )
    # four stores, every part of a palette each, and the day's rules
    for key in (
        "start",
        "width",
        "accent",
        "saturation",
        "jitter",
        "curve_night",
        "alive",
        "every_max",
    ):
        assert f"house_palette_k1_{key}" in pkg["input_number"]
        assert f"house_palette_k4_{key}" in pkg["input_number"]
    assert "house_palette_k5_start" not in pkg["input_number"]
    for key in (
        "weight_degrade",
        "avoid_from",
        "saturation_max",
        "jitter_max",
        "curve_evening",
        "alive_max",
        "every_min",
        "chance",
    ):
        assert f"house_palette_today_{key}" in pkg["input_number"]
    assert "house_palette_today_shapes" in pkg["input_text"]
    assert (
        "house_palette_k2_name" in pkg["input_text"]
        and "house_palette_k2_shapes" in pkg["input_text"]
    )
    # the names are the face: the select follows the kept names
    names = autos["regie_house_palette_names"]
    assert names["actions"][-2]["action"] == "input_select.set_options"
    # a kept palette renamed while selected stays selected under its new name
    assert names["actions"][-1]["then"][0]["data"]["option"] == "{{ trigger.to_state.state }}"
    assert "states('input_text.house_palette_k3_name')" in names["actions"][0]["variables"]["names"]
    # « Nouvelle », « Au hasard », « Supprimer »
    assert (
        autos["regie_house_palette_new"]["actions"][1]["choose"][0]["sequence"][-1]["data"][
            "option"
        ]
        == "Nouvelle 1"
    )
    rnd = autos["regie_house_palette_k2_random"]
    assert "namespace(" in rnd["actions"][0]["variables"]["p"]
    # the sandbox refuses a range over 100 000: the seed is the clock's millisecond
    assert "range(1, 2147483647)" not in rnd["actions"][0]["variables"]["p"]
    assert "as_timestamp(now()) * 1000" in rnd["actions"][0]["variables"]["p"]
    assert autos["regie_house_palette_k4_delete"]["actions"][-1]["data"]["value"] == ""
    knobs = {k["entity"]: k for k in witness.knobs()}
    assert knobs["input_boolean.house_palette_repaint"]["value"] == "on"
    assert knobs["input_number.house_palette_today_weight_degrade"]["value"] == "5.0"
    assert knobs["input_number.house_palette_today_weight_degrade"]["follow"] is True
    assert knobs["input_text.house_palette_today_shapes"]["value"] == "glitch"
    assert knobs["input_number.house_palette_today_chance"]["value"] == "50.0"


def _brain(values: dict):
    env = jinja2.Environment()
    env.globals["states"] = lambda e: values.get(e, "unknown")
    env.globals["is_state"] = lambda e, v: values.get(e, "unknown") == v
    now = dt.datetime(2026, 9, 5, 12, 0, tzinfo=dt.timezone(dt.timedelta(hours=2)))
    env.globals["now"] = lambda: now
    env.globals["as_timestamp"] = lambda t: t.timestamp()
    return env, now


def _rules_values(rules: dict) -> dict:
    return {e: (v if isinstance(v, str) else str(v)) for e, v in P.rule_seeds(rules).items()}


def test_the_sensor_reads_the_rules_from_the_helpers_and_agrees_with_python(witness):
    from regie.palette import render_context

    ctx = render_context(witness)
    attr = ctx["attr"].replace("{{ palette }}", "{{ palette | tojson }}")
    rules = witness.palettes()["today"]
    values = {
        "input_select.house_palette": "Du jour",
        "counter.house_palette_roll": "0",
        "input_datetime.house_palette_turns": "06:30:00",
    }
    values.update(_rules_values(rules))
    env, now = _brain(values)
    got = json.loads(env.from_string(attr).render())
    day = P.day_of(now, "06:30")
    assert got == P.draw(day, 0, witness.palette_salt(), rules)
    # the family edits a rule on the phone: the draw follows the helper, and so does
    # `rules_from_helpers` for the command that compares
    values["input_number.house_palette_today_weight_degrade"] = "0.0"
    values["input_number.house_palette_today_weight_uni"] = "9.0"
    got = json.loads(env.from_string(attr).render())
    live = P.rules_from_helpers(lambda e: {"state": values[e]} if e in values else None, rules)
    assert live["harmonies"]["uni"] == 9 and live["harmonies"]["degrade"] == 0
    assert got == P.draw(day, 0, witness.palette_salt(), live)
    assert got["harmony"] in ("uni", "duo")


def test_the_sensor_reads_a_kept_store_by_its_name(witness):
    from regie.palette import render_context

    ctx = render_context(witness)
    attr = ctx["attr"].replace("{{ palette }}", "{{ palette | tojson }}")
    values = {
        "input_select.house_palette": "Nuit rouge",
        "counter.house_palette_roll": "0",
        "input_datetime.house_palette_turns": "06:30:00",
        "input_text.house_palette_k1_name": "Brume",
        "input_text.house_palette_k2_name": "Nuit rouge",
        "input_number.house_palette_k2_start": "330.0",
        "input_number.house_palette_k2_width": "60.0",
        "input_number.house_palette_k2_accent": "200.0",
        "input_number.house_palette_k2_saturation": "95.0",
        "input_number.house_palette_k2_jitter": "8.0",
        "input_number.house_palette_k2_curve_morning": "50.0",
        "input_number.house_palette_k2_curve_day": "30.0",
        "input_number.house_palette_k2_curve_evening": "100.0",
        "input_number.house_palette_k2_curve_night": "40.0",
        "input_select.house_palette_k2_white": "warm",
        "input_number.house_palette_k2_alive": "2.0",
        "input_boolean.house_palette_k2_alive_all": "off",
        "input_text.house_palette_k2_shapes": "glitch, lightning",
        "input_number.house_palette_k2_every_min": "90.0",
        "input_number.house_palette_k2_every_max": "400.0",
    }
    env, _ = _brain(values)
    got = json.loads(env.from_string(attr).render())
    assert got["lo"] == 330 and got["hi"] == 30 and got["width"] == 60 and got["accent"] == 200
    assert got["curve"] == {"morning": 50, "day": 30, "evening": 100, "night": 40}
    assert got["jitter"] == 8 and got["alive"] == 2
    assert got["life"] == {"shapes": ["glitch", "lightning"], "every": [90, 400]}
    assert env.from_string(ctx["state"]).render().strip() == "k2"
    assert env.from_string(ctx["label"]).render().strip() == "Nuit rouge"
    values["input_boolean.house_palette_k2_alive_all"] = "on"
    assert json.loads(env.from_string(attr).render())["alive"] == "all"


def test_pull_writes_the_stores_and_the_rules_into_the_file(witness, tmp_path):
    values = {
        "input_text.house_palette_k1_name": "Nuit rouge",
        "input_number.house_palette_k1_start": "330.0",
        "input_number.house_palette_k1_width": "60.0",
        "input_number.house_palette_k1_accent": "200.0",
        "input_number.house_palette_k1_saturation": "95.0",
        "input_number.house_palette_k1_jitter": "8.0",
        "input_number.house_palette_k1_curve_evening": "100.0",
        "input_number.house_palette_k1_curve_night": "40.0",
        "input_select.house_palette_k1_white": "warm",
        "input_boolean.house_palette_k1_alive_all": "on",
        "input_text.house_palette_k1_shapes": "glitch",
        "input_number.house_palette_k1_every_min": "90.0",
        "input_number.house_palette_k1_every_max": "400.0",
        # the file carries this one: freed, not re-added
        "input_text.house_palette_k3_name": "Nuit bleue",
    }
    values.update(_rules_values(witness.palettes()["today"]))
    values["input_number.house_palette_today_weight_libre"] = "1.0"

    def read(e):
        return {"state": values[e]} if e in values else None

    palettes = P.pull_palettes(witness, read)
    assert list(palettes) == ["nuit_bleue", "nuit_rouge", "today"]
    assert palettes["nuit_rouge"] == {
        "label": "Nuit rouge",
        "band": [330, 30],
        "accent": 200,
        "saturation": 95,
        "white": "warm",
        "level": {"curve": {"morning": 100, "day": 100, "evening": 100, "night": 40}, "jitter": 8},
        "alive": "all",
        "life": {"shapes": ["glitch"], "every": [90, 400]},
    }
    assert palettes["today"]["harmonies"]["libre"] == 1
    assert palettes["today"]["life"] == {"shapes": ["glitch"], "every": [120, 600], "chance": 50}
    assert P.freed_stores(witness, read) == ["house_palette_k3"]
    fx = tmp_path / "fx.yml"
    fx.write_text(
        "backend: ha\n# the palettes\npalettes:\n  old:\n    band: [1, 2]\nenable: [flash]\n"
    )
    assert P.rewrite_palettes(fx, palettes)
    text = fx.read_text()
    assert text.startswith("backend: ha\n# the palettes\npalettes:\n  nuit_bleue:\n")
    assert "  nuit_rouge:\n    label: Nuit rouge\n    band: [330, 30]\n" in text
    assert text.endswith("enable: [flash]\n")
    assert not P.rewrite_palettes(fx, palettes)
    assert yaml.safe_load(text)["palettes"]["nuit_rouge"]["life"] == {
        "shapes": ["glitch"],
        "every": [90, 400],
    }


def test_the_random_draw_template_yields_a_palette_within_the_rules(witness):
    from regie.palette import render_context

    ctx = render_context(witness)
    values = _rules_values(witness.palettes()["today"])
    env, _ = _brain(values)
    tpl = env.from_string(ctx["random"].replace("{{ palette }}", "{{ palette | tojson }}"))
    seen = set()
    for _ in range(40):
        got = json.loads(tpl.render())
        assert not any(45 < (got["lo"] + d) % 360 < 105 for d in range(got["width"] + 1))
        seen.add((got["lo"], got["hi"]))
    assert len(seen) > 10


def test_slug_and_a_look_saying_accent_is_told(house_with):
    assert P.slug("Soir de pluie !") == "soir_de_pluie" and P.slug("2026") == "p_2026"
    path = house_with(lambda d: None)
    living = path.parent / "rooms" / "living.yml"
    living.write_text(
        living.read_text().replace(
            "      back_center: { color: band, brightness: 30 }",
            "      back_center: { color: accent, brightness: 30 }",
            1,
        )
    )
    with pytest.raises(HouseError, match="accent"):  # the schema refuses it first
        load_house(path)


# --- the Atelier's step 2 (0.25): the window ------------------------------------------------
def test_the_window_is_a_card_on_reglages_fed_with_the_house(rendered, witness):
    dash = yaml.safe_load((rendered / "home-assistant/dashboards/phone.yaml").read_text())
    settings = next(v for v in dash["views"] if v["path"] == "settings")
    cards = [c for sec in settings["sections"] for c in sec["cards"]]
    card = next(c for c in cards if c.get("type") == "custom:regie-palette-atelier")
    assert card["select"] == "input_select.house_palette" and card["auto_label"] == "Du jour"
    assert card["salt"] == witness.palette_salt()
    assert card["rules"] == {"prefix": "house_palette_today", "whites": ["warm", "neutral", "cool"]}
    assert [s["prefix"] for s in card["stores"]] == [f"house_palette_k{i}" for i in (1, 2, 3, 4)]
    assert card["named"][0]["id"] == "nuit_bleue" and card["named"][0]["palette"]["lo"] == 200
    assert "glitch" in card["shapes"] and "lightning" in card["shapes"]
    assert card["labels"]["title"] == "L'Atelier des palettes" and card["labels"]["all"] == "toutes"
    # the plain rows for the stores and the rules left with the window
    titles = [c.get("title") for c in cards]
    assert "Les règles du jour" not in titles and not any(
        c.get("type") == "conditional" for c in cards
    )
    # the card's file ships with the pack, its element named as the card's type
    js = (rendered / "home-assistant/www/regie-atelier.js").read_text()
    assert 'customElements.define("regie-palette-atelier"' in js
    assert "const M = 2147483647, A = 16807;" in js  # the product's arithmetic, ported


def test_the_avoided_arc_may_wrap_through_zero():
    """Tom, on the ring: avoid 300° through 0° to 180° — the free arc is then
    180° → 300°, and every draw sits inside it, in Python and in the template."""
    rules = P.normalise({"today": {"avoid": [300, 180]}})["today"]
    assert P.free_arc(300, 180) == 120 and P.free_arc(45, 105) == 300 and P.free_arc(10, 10) == 360
    assert P.in_arc(350, 300, 180) and P.in_arc(20, 300, 180) and not P.in_arc(200, 300, 180)
    errors, _ = P.check(
        P.normalise(
            {"today": {"avoid": [300, 180], "harmonies": {"degrade": 0, "duo": 0, "uni": 1}}}
        ),
        {"glitch"},
        None,
        None,
    )
    assert errors == []
    errors, _ = P.check(P.normalise({"today": {"avoid": [300, 180]}}), {"glitch"}, None, None)
    assert any(
        "the widest harmony wants 150°" in e for e in errors
    )  # 120° free, dégradé up to 150°
    rules["harmonies"] = {"degrade": 0, "duo": 3, "uni": 2, "libre": 0}
    body = P.jinja_body(rules, SALT)
    tpl = jinja2.Environment().from_string(
        "{% set day = D %}{% set roll = R %}" + body + "{{ palette | tojson }}"
    )
    for day in range(20700, 20700 + 200):
        p = P.draw(day, 0, SALT, rules)
        assert not any(P.in_arc(h, 300, 180) for h in _arc(p)), (day, p)
        assert json.loads(tpl.render(D=day, R=0)) == p
