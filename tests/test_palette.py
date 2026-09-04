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
DAYS = range(20700, 20700 + 3650)  # ten years of days


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
            assert not any(av0 < h < av1 for h in _arc(p)), (day, roll, p)
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
    for day in DAYS:
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
    assert pkg["input_select"]["house_palette"]["options"] == ["Du jour", "Nuit bleue"]
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
    env.globals["states"] = lambda e: {
        "input_select.house_palette": SEL[0],
        "counter.house_palette_roll": "2",
        "input_datetime.house_palette_turns": "06:30:00",
    }[e]
    now = dt.datetime(2026, 9, 5, 12, 0, tzinfo=dt.timezone(dt.timedelta(hours=2)))
    env.globals["now"] = lambda: now
    env.globals["as_timestamp"] = lambda t: t.timestamp()
    SEL = ["Du jour"]
    got = json.loads(env.from_string(attr).render())
    day = P.day_of(now, "06:30")
    assert got == P.draw(day, 2, witness.palette_salt(), witness.palettes()["today"])
    SEL[0] = "Nuit bleue"
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
    for day in range(20700, 20700 + 400):
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
    assert "pal.width * 0.0" in left["hs_color"] and "pal.width * 1.0" in right["hs_color"]
    assert "pal.curve" in left["brightness_pct"] and "room.scatter[" in left["brightness_pct"]
    # the accent lamp and the palette's white
    assert "pal.accent" in by_entity[("light.living_ceiling_3",)]["data"]["hs_color"]
    assert _lamp(by_entity)["data"]["color_temp_kelvin"] == "{{ pal.white_kelvin }}"
    # the candidates walk behind a gate, from the sensor's arc
    drift = pkg["script"]["living_today_drift"]["sequence"]
    assert "variables" in drift[0]
    walk = drift[1]["repeat"]["sequence"]
    gated = [s for s in walk if "if" in s]
    assert len(gated) == 2
    assert gated[0]["if"][0]["value_template"] == "{{ room.alive[0] }}"
    hue = gated[0]["then"][0]["data"]["hs_color"][0]
    assert hue.startswith("{% set pal = state_attr('sensor.house_palette', 'palette') %}")
    assert "(pal.lo + pal.width * t) % 360" in hue
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
