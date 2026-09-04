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

    house = load_house(house_with(mutate))
    assert any("pack 'palette' is not enabled" in h for h in house.hints)


def test_a_bad_palette_fails_the_load(house_with, tmp_path):
    def mutate(d):
        d["controls"]["palette"] = True

    path = house_with(mutate)
    fx = path.parent / "fx.yml"
    fx.write_text(fx.read_text().replace('turns: "06:30"', 'turns: "25:00"'))
    with pytest.raises(HouseError, match="turns is an hour"):
        load_house(path)
