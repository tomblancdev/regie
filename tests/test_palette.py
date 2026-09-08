"""La Palette du jour (0.20) — the value, the draw, the store, the checks.

Since 0.42 (the audit's V8a) the draw is written ONCE, in the component's own
`palette.py`; the sensor is the component's and the two-hundred-line generated
template is gone. The proof H51 asked for is here: `frozen_0_41.py` carries the
generators as they stood, and the arithmetic that stayed must say byte for byte
what the arithmetic that went said, over ten years of days and every roll.
"""

import ast
import datetime as dt
import json

import jinja2
import pytest
import yaml

from regie import palette as P
from regie.errors import HouseError
from regie.house import load_house

from . import frozen_0_41 as OLD

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


def test_the_draw_is_byte_for_byte_the_template_it_replaced():
    """V8a's proof: the sensor left its generated Jinja and became Python, and
    the value did not move — the 0.41 template, frozen, against the draw the
    component runs now, over ten years of days and two rolls."""
    body = OLD.jinja_body(RULES, SALT)
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


def test_the_witness_renders_the_component_and_the_familys_helpers(rendered, witness):
    pkg = yaml.safe_load((rendered / "home-assistant/packages/palette.yaml").read_text())
    # the day, the named one; the kept names join at runtime (the component)
    assert pkg["input_select"]["house_palette"]["options"][:2] == ["Du jour", "Nuit bleue"]
    assert pkg["counter"]["house_palette_roll"]["restore"] is True
    another = pkg["automation"][0]
    assert another["id"] == "regie_house_palette_another"
    # the first press ever comes from `unknown` — it must count (0.20.1)
    assert another["triggers"][0]["not_from"] == ["unavailable"]
    # 0.42: no template sensor and no store helper — the component's block instead
    assert "template" not in pkg
    # ONE JSON scalar: Home Assistant's package merge passes every list through
    # `cv.remove_falsy`, so a YAML block would arrive with its zeros gone
    raw = pkg["regie"]["palette"]
    assert isinstance(raw, str), "a scalar crosses the package merge untouched"
    conf = json.loads(raw)
    assert conf["rules"]["alive"] == [0, "all"], "the zero the merge would have eaten"
    assert conf["rules"]["level"]["jitter"] == [0, 15]
    assert conf["salt"] == witness.palette_salt() and conf["auto"] == "Du jour"
    assert conf["named"]["nuit_bleue"]["band"] == [200, 250]
    assert conf["rules"]["turns"] == "06:30" and conf["kelvin"]["warm"] == 2700
    assert {r["key"] for r in conf["rooms"]} == {r["key"] for r in P.rooms_plan(witness)}
    assert any(r["room"] == "living" and r["source"] == "today" for r in conf["rooms"])
    helpers = [
        e
        for domain in (
            "input_number",
            "input_text",
            "input_select",
            "input_boolean",
            "input_button",
        )
        for e in (pkg.get(domain) or {})
    ]
    assert not [e for e in helpers if "_k1_" in e or "_k2_" in e], "the eight slots are gone"
    knobs = {k["entity"]: k["value"] for k in witness.knobs()}
    assert knobs["input_datetime.house_palette_turns"] == "06:30"
    assert knobs["input_select.house_palette"] == "Du jour"


def test_the_sensor_value_is_the_draw_the_named_one_and_the_kept_one(witness):
    """What `sensor.house_palette` says, computed the way the component does:
    the state is the SOURCE the select names, the attributes the palette, its
    label and the rooms' draws. Three readings on the brain, arithmetic here."""
    rules = witness.palettes()["today"]
    named = witness.palettes()["named"]
    salt = witness.palette_salt()
    kelvin = witness.kelvin()
    rooms = P.rooms_plan(witness)
    docs = {"nuit_rouge": {"label": "Nuit rouge", "band": [330, 30], "accent": 200}}
    day = P.day_of(
        dt.datetime(2026, 9, 5, 12, 0, tzinfo=dt.timezone(dt.timedelta(hours=2))), "06:30"
    )

    def value(selected):
        source = P.source_of(selected, "Du jour", named, docs)
        return P.value(source, day, 2, salt, rules, named, docs, rooms, "Du jour", kelvin)

    state, attrs = value("Du jour")
    assert state == "today" and attrs["label"] == "Du jour"
    assert attrs["palette"] == P.draw(day, 2, salt, rules, kelvin)
    state, attrs = value("Nuit bleue")
    assert state == "nuit_bleue" and attrs["label"] == "Nuit bleue"
    assert attrs["palette"]["lo"] == 200 and attrs["palette"]["accent"] == 30
    assert attrs["palette"]["day"] == day and attrs["palette"]["roll"] == 2
    # a name the select holds that nobody knows any more falls back to the day
    assert value("Brume")[0] == "today"
    # a KEPT palette answers by its name, through the same door as a file's
    state, attrs = value("Nuit rouge")
    assert state == "nuit_rouge" and attrs["label"] == "Nuit rouge"
    assert attrs["palette"]["lo"] == 330 and attrs["palette"]["hi"] == 30
    # the select's options: the day, the file's, the kept ones — in that order
    assert P.option_labels("Du jour", named, docs) == ["Du jour", "Nuit bleue", "Nuit rouge"]
    # a kept palette never steals a rendered name
    assert P.source_of("Nuit bleue", "Du jour", named, {"x": {"label": "Nuit bleue"}}) == (
        "nuit_bleue"
    )


def test_the_rooms_draws_ride_on_the_sensor(witness):
    """Each room's own draws for the day are attributes now, one entry per
    (room, palette, candidates, targets) a look reads — and the entry a look
    asks for is the entry the render declared."""
    rooms = P.rooms_plan(witness)
    living = next(r for r in rooms if r["room"] == "living")
    assert living["key"] == P.room_key("living", "today", living["candidates"], living["targets"])
    day, roll, salt = 20700, 0, witness.palette_salt()
    rules = witness.palettes()["today"]
    _, attrs = P.value(
        "today",
        day,
        roll,
        salt,
        rules,
        witness.palettes()["named"],
        {},
        rooms,
        "Du jour",
        witness.kelvin(),
    )
    pal = attrs["palette"]
    assert attrs["rooms"][living["key"]] == P.room_draw(
        day,
        roll,
        salt,
        "living",
        pal["alive"],
        living["candidates"],
        living["targets"],
        pal["jitter"],
    )


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
def test_the_rooms_draw_is_byte_for_byte_the_template_it_replaced(alive):
    """The other half of V8a's proof: a room's draws left their generated Jinja
    too, and say the same thing."""
    env = _room_env({})
    body = OLD.room_jinja(SALT, "living", alive, 4, 6, "12")
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
    # 0.42: the room's draws are an attribute of the same sensor, at the key the
    # render minted — no generated arithmetic in the script any more
    assert "state_attr('sensor.house_palette', 'rooms')" in variables["room"]
    # a room may ask the sensor more than one draw — one per look, since the
    # counts decide how many randoms are drawn; the key the script reads is one
    # the render declared to the component
    keys = {r["key"] for r in P.rooms_plan(witness)}
    asked = variables["room"].split(".get('")[1].split("')")[0]
    assert asked in keys and asked == "living.today.3.4"
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
    # the candidates walk behind a gate, and the walk reads the SENSOR at every
    # leg (0.39): the script hands `regie.walk` the plan, it does not paint
    drift = pkg["script"]["living_today_drift"]["sequence"]
    assert "variables" in drift[0]
    call = drift[1]
    assert call["action"] == "regie.walk"
    plan = call["data"]
    assert plan["palette"] == "sensor.house_palette", (
        "the arc is read again at each leg — « Une autre » reaches a walk already going"
    )
    assert plan["id"] == "living.today" and plan["switch"] == "input_boolean.living_today_drift"
    gated = [w for w in plan["walkers"] if "alive" in w]
    assert len(gated) == 3  # the front's two paired places, and the third bulb
    assert gated[0]["alive"] == "{{ room.alive[0] }}"
    assert all(w["backend"] == "zigbee" and w["topic"] for w in plan["walkers"])
    # the room's drift switch exists like any moving look's
    assert "living_today_drift" in pkg["input_boolean"]


def test_the_witness_templates_evaluate_with_the_brains_inputs(rendered):
    """The look's variables and one bulb's data, rendered with a stubbed
    sensor: the numbers a bulb would receive."""
    pkg = yaml.safe_load((rendered / "home-assistant/packages/scenes_living.yaml").read_text())
    seq = pkg["script"]["living_today"]["sequence"]
    variables = next(s for s in seq if "variables" in s)["variables"]
    sensor = P.draw(20700, 0, SALT, RULES)
    key = next(k for k in variables["room"].split("'") if k.startswith("living."))
    rooms = {key: P.room_draw(20700, 0, SALT, "living", RULES["alive"], 3, 6, sensor["jitter"])}
    env = jinja2.Environment()
    env.globals["state_attr"] = lambda e, a: {"palette": sensor, "rooms": rooms}.get(a)
    env.globals["states"] = lambda e: {"sensor.house_period": "evening"}.get(e, "unknown")
    pal = env.from_string(variables["pal"].replace("}}", "| tojson }}")).render()
    # Home Assistant renders a `variables:` step natively: the room's entry
    # comes back a dict, which is what a Python literal of it is here
    room = ast.literal_eval(env.from_string(variables["room"]).render())
    ctx = {"pal": json.loads(pal), "room": room, "period": "evening"}
    assert ctx["room"]["scatter"], "the sensor's entry, not the empty fallback"
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
    # the walks are ended by the walker's own door, the life loop by its script
    assert pkg["script"]["living_party"]["sequence"][1]["action"] == "regie.stop"
    stop = pkg["script"]["living_party"]["sequence"][2]
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
def test_the_witness_house_gets_the_switch_the_flip_and_the_repaint(rendered, witness):
    pkg = yaml.safe_load((rendered / "home-assistant/packages/palette.yaml").read_text())
    # the rendered options: the day and the file's names; the kept names join at runtime
    assert pkg["input_select"]["house_palette"]["options"] == ["Du jour", "Nuit bleue"]
    # « Palette du jour » is a STATE (0.26): a switch, no script that lights the house
    assert "house_palette_today" not in pkg.get("script", {})
    assert pkg["input_boolean"]["house_palette"]["name"] == "Palette du jour"
    autos = {a["id"]: a for a in pkg["automation"]}
    flip = autos["regie_house_palette_flip"]
    assert flip["triggers"] == [
        {
            "trigger": "state",
            "entity_id": "input_boolean.house_palette",
            "to": ["on", "off"],
            "not_from": ["unavailable", "unknown"],
        }
    ]
    living = next(a for a in witness.areas if a["id"] == "living")
    defaults = {
        look for row in witness.defaults_of(living).values() for look in row.values() if look
    }
    looks = json.dumps(sorted(defaults | {"today"})).replace('"', "'")
    (branch,) = flip["actions"][0]["parallel"]
    assert branch["if"][0]["value_template"] == (
        "{{ is_state('light.living_lights', 'on') and states('input_select.living_look') in "
        + looks
        + " }}"
    )
    assert branch["then"][0]["action"] == "script.living_default"
    rep = autos["regie_house_palette_repaint"]
    assert rep["triggers"][0]["attribute"] == "palette"
    assert "not_from" not in rep["triggers"][0]
    branch = rep["actions"][0]["parallel"][0]
    assert (
        "states('input_select.living_look') in ['evening', 'today']"
        in branch["if"][0]["value_template"]
    )
    # 0.43 (V8b): the day's rules left their twenty-one helpers for the store —
    # no number, no text, no switch of the rules is rendered any more
    assert "input_number" not in pkg and "input_text" not in pkg
    assert not [e for e in pkg["input_boolean"] if e.startswith("house_palette_today")]
    # 0.42: no slot, no « les noms », no « Nouvelle » / « Au hasard » / « Supprimer »
    # automation — the documents and the select's options are the component's
    assert set(autos) == {
        "regie_house_palette_another",
        "regie_house_palette_repaint",
        "regie_house_palette_flip",
    }
    # THE PALETTE'S OWN PLUMBING, COUNTED: the family's five controls, the roll
    # behind « Une autre », the three automations, and the sensor the component
    # makes — ten things, where 0.41 had two hundred and 0.42 thirty-one
    mine = [
        f"{domain}.{name}"
        for domain in ("input_select", "input_datetime", "input_boolean", "counter", "input_button")
        for name in (pkg.get(domain) or {})
    ]
    assert sorted(mine) == [
        "counter.house_palette_roll",
        "input_boolean.house_palette",
        "input_boolean.house_palette_repaint",
        "input_button.house_palette_another",
        "input_datetime.house_palette_turns",
        "input_select.house_palette",
    ]
    assert len(mine) + len(autos) + 1 == 10  # + sensor.house_palette, the component's
    knobs = {k["entity"]: k for k in witness.knobs()}
    assert knobs["input_boolean.house_palette_repaint"]["value"] == "on"
    assert knobs["input_boolean.house_palette_repaint"]["born"] is True
    assert not [e for e in knobs if "palette_today" in e], "the rules are not knobs any more"
    # « Change à » is a rule AND a control: it stays a helper, owned on its own
    turns = knobs["input_datetime.house_palette_turns"]
    assert turns["pull"] == "palettes" and "group" not in turns
    assert turns["leaf"] == {"file": "fx", "path": ["palettes", "today", "turns"]}


def _brain(values: dict):
    env = jinja2.Environment()
    env.globals["states"] = lambda e: values.get(e, "unknown")
    env.globals["is_state"] = lambda e, v: values.get(e, "unknown") == v
    now = dt.datetime(2026, 9, 5, 12, 0, tzinfo=dt.timezone(dt.timedelta(hours=2)))
    env.globals["now"] = lambda: now
    env.globals["as_timestamp"] = lambda t: t.timestamp()
    return env, now


def test_the_rules_are_a_document_that_draws_what_the_helpers_drew(witness):
    """V8b's proof, the shape V8a's was: the day's rules left TWENTY-ONE
    HELPERS for one document of the same store, and what the document draws is
    byte for byte what the helpers drew.

    `frozen_0_41` keeps both halves of the old way verbatim — `rule_seeds`, the
    mapping of a rules block onto the helpers, and the sensor's Jinja that READ
    them. Seed the helpers from a rules block, render that sensor, and hold it
    against the draw the component makes from `rules_normal` of the same
    block."""
    rules = witness.palettes()["today"]
    values = {e: (v if isinstance(v, str) else str(v)) for e, v in OLD.rule_seeds(rules).items()}
    env, _ = _brain(values)
    tpl = env.from_string(
        "{% set day = D %}{% set roll = R %}"
        + OLD.jinja_rules(witness.kelvin())
        + OLD.jinja_body_live(SALT, witness.kelvin())
        + "{{ palette | tojson }}"
    )
    document = P.rules_normal(rules)
    for day in SAMPLED:
        for roll in (0, 3):
            assert json.loads(tpl.render(D=day, R=roll)) == P.draw(
                day, roll, SALT, document, witness.kelvin()
            ), (day, roll)
    # and a rule MOVED on the phone moves the draw the same way it did
    moved = {**document, "harmonies": {"degrade": 0, "duo": 0, "uni": 9, "libre": 0}}
    values.update(OLD.rule_seeds({**rules, "harmonies": moved["harmonies"]}))
    assert json.loads(tpl.render(D=20700, R=0)) == P.draw(20700, 0, SALT, moved, witness.kelvin())
    assert P.draw(20700, 0, SALT, moved)["harmony"] == "uni"


def test_the_rules_normal_form_is_the_file_s_own_shape():
    """One grammar for the two sides (0.43): the store's document, what the two
    readings compare under, and what `regie pull` lays into `fx.yml` key by key
    — a rule that says nothing is `None`, which `set_leaf` REMOVES."""
    n = P.rules_normal(RULES)
    assert set(n) == set(P.RULE_KEYS)
    assert n["harmonies"] == P.DEFAULT_RULES["harmonies"]  # unsaid: the default weights
    assert n["avoid"] == [45, 105] and n["saturation"] == [85, 100]
    assert n["level"] == {
        "curve": {"morning": 60, "day": 40, "evening": 100, "night": 100},
        "jitter": [0, 15],
    }
    assert n["alive"] == [0, "all"] and n["life"]["chance"] == 50
    # a rule the family switched off is None, not a flat zero written into the file
    quiet = P.rules_normal({**RULES, "level": {"curve": {"day": 100}}, "alive": 0, "life": None})
    assert quiet["level"] is None and quiet["alive"] is None and quiet["life"] is None
    # `[0, all]` is not `all`: one draws between nothing and every bulb
    assert P.rules_normal({"alive": "all"})["alive"] == "all"
    assert P.rules_normal({"alive": [2, 2]})["alive"] == 2
    # a shape picked while the chance is still nothing is KEPT, off — the family
    # does not have to name its signs again after a quiet week
    off = P.rules_normal({"life": {"shapes": ["glitch"], "every": [90, 400], "chance": 0}})
    assert off["life"] == {"shapes": ["glitch"], "every": [90, 400], "chance": 0}
    assert P.draw(20700, 0, SALT, {**P.rules_normal({}), "life": off["life"]})["life"] is None
    # the file may write the same rules shorter: the same under the form
    assert P.rules_normal({"level": {"jitter": 8}})["level"] == {"jitter": 8}
    assert P.rules_normal({"level": {"jitter": [8, 8]}})["level"] == {"jitter": 8}
    assert P.describe_rules(P.rules_normal({}), P.rules_normal({"avoid": [10, 20]})) == (
        "avoid [45, 105] → [10, 20]"
    )
    assert P.describe_rules(n, n) == "nothing"
    # the form is idempotent: what came out goes back in unchanged
    assert P.rules_normal(n) == n


def test_the_door_refuses_what_the_file_would_be_refused_for():
    """What `check` refuses in `fx.yml`, the store's door refuses on the phone —
    the SAME words, from the same numbers (0.43). Found by the live drill: a
    weight the Atelier accepted made a document no converge could ever pass,
    and the house wore it in the meantime."""
    tight = {"harmonies": {"degrade": 0, "duo": 0, "uni": 1, "libre": 4}, "avoid": [142, 327]}
    said = P.rules_refusal(P.rules_normal(tight))
    assert said == "the avoided arc leaves 175° and the widest harmony wants 220°"
    errors, _ = P.check(P.normalise({"today": tight}), {"glitch"}, None, None)
    assert f"palette today: {said}" in errors, "one refusal, said once, in both places"
    assert P.rules_refusal(P.rules_normal({"harmonies": dict.fromkeys(P.ORDER, 0)})) == (
        "no harmony weighs anything — nothing to draw"
    )
    assert P.rules_refusal(P.rules_normal(RULES)) is None


def test_a_kept_palette_is_a_document_the_file_could_have_written(witness):
    """0.33's form, on a document now (0.42): a kept palette and the file's
    named one compare under `store_normal`, and what the store keeps of what
    the phone sent is what `fx.yml` would carry — `store_clean`."""
    sent = {
        "label": "  Nuit rouge  ",
        "band": [330, 30],
        "accent": 200,
        "saturation": 95,
        "white": "warm",
        "level": {"curve": {"morning": 100, "day": 100, "evening": 100, "night": 40}, "jitter": 8},
        "alive": "all",
        "life": {"shapes": ["glitch"], "every": [90, 400]},
        "colour": "a word the card invented",
    }
    doc = P.store_clean(sent)
    assert doc == {
        "label": "Nuit rouge",
        "band": [330, 30],
        "accent": 200,
        "saturation": 95,
        "white": "warm",
        "level": {"curve": {"morning": 100, "day": 100, "evening": 100, "night": 40}, "jitter": 8},
        "alive": "all",
        "life": {"shapes": ["glitch"], "every": [90, 400]},
    }
    # a document with nothing to say keeps nothing: no level, no alive, no life
    assert P.store_clean({"label": "Brume", "band": [10, 40]}) == {
        "label": "Brume",
        "band": [10, 40],
        "accent": 30,
        "saturation": 100,
        "white": "warm",
    }
    # a life under the floor is lifted, a white nobody knows falls back
    odd = P.store_clean({**sent, "white": "mauve", "life": {"shapes": ["x"], "every": [5, 9]}})
    assert odd["white"] == "warm" and odd["life"]["every"] == [60, 60]
    # the file may write the same palette shorter: the same under the form
    short = {
        "label": "Nuit rouge",
        "band": [330, 30],
        "accent": 200,
        "saturation": 95,
        "level": {"curve": {"night": 40}, "jitter": 8},
        "alive": "all",
        "life": {"shapes": ["glitch"], "every": [90, 400]},
    }
    assert P.store_normal(doc) == P.store_normal(short)
    assert P.describe_store(P.store_normal(doc), P.store_normal({**short, "accent": 120})) == (
        "accent 200 → 120"
    )
    assert P.store_normal(witness.palettes()["named"]["nuit_bleue"])["life"] == {
        "shapes": ["glitch", "lightning"],
        "every": [120, 600],
    }
    # a document reads back out of the sensor exactly as a file's palette does
    assert P.named_value(doc, witness.kelvin())["lo"] == 330


def test_a_rules_document_is_read_and_written_the_way_the_files_are(witness):
    """The store's document IS the file's block: what `regie pull` lays into
    `fx.yml`'s `palettes.today`, key by key, and what the house wears until
    then. `turns` and `label` are not in it — « Change à » is the family's own
    helper, and the label is a word only the file can say."""
    rules = witness.palettes()["today"]
    doc = P.rules_normal(rules)
    assert "turns" not in doc and "label" not in doc
    # the engine's config block still hands the component the file's own rules
    conf = P.component_config(witness)
    assert conf["rules"]["turns"] == "06:30" and "label" not in conf["rules"]
    assert P.rules_normal(conf["rules"]) == doc
    # a rule moved on the phone reads as a move, and only that rule moved
    moved = {**doc, "saturation": [50, 60]}
    assert P.describe_rules(doc, moved) == "saturation [85, 100] → [50, 60]"
    assert [k for k in P.RULE_KEYS if doc[k] != moved[k]] == ["saturation"]


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
    assert card["rules"] == {"whites": ["warm", "neutral", "cool"]}, (
        "0.43: the rules are a document, and the card has no helper name to be told"
    )
    assert "stores" not in card, "0.42: the kept palettes come from the store, not a slot list"
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
    assert "const M = 2147483647, A = 16807;" in js  # the week strip's preview, ported
    # the five doors the card calls (0.42, the rules' own since 0.43): no helper
    # behind a kept palette, and none behind the day's rules either
    for door in ("list", "save", "delete", "random", "rules"):
        assert f'"regie/palettes/{door}"' in js
    assert "input_number.house_palette_today" not in js and "setNumber" not in js
    assert card["labels"]["follow"] == "Suivre les fichiers"


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
    body = OLD.jinja_body(rules, SALT)
    tpl = jinja2.Environment().from_string(
        "{% set day = D %}{% set roll = R %}" + body + "{{ palette | tojson }}"
    )
    for day in range(20700, 20700 + 200):
        p = P.draw(day, 0, SALT, rules)
        assert not any(P.in_arc(h, 300, 180) for h in _arc(p)), (day, p)
        assert json.loads(tpl.render(D=day, R=0)) == p


# --- « Palette du jour » is a state (0.26) ---------------------------------------
def test_the_default_sensor_says_today_while_the_switch_is_on(rendered):
    """Every path that lights a room reads sensor.<room>_default: while the
    house switch is on it names the palette look, off it names the period's."""
    pkg = yaml.safe_load((rendered / "home-assistant/packages/scenes_living.yaml").read_text())
    state = pkg["template"][0]["sensor"][0]["state"]
    assert "input_boolean.house_palette" in state
    env = jinja2.Environment()
    vals = {
        "sensor.house_period": "evening",
        "sensor.daylight": "dark",
        "input_select.living_look_evening": "evening",
        "input_select.living_look_dark": "evening",
    }
    env.globals["states"] = lambda e: vals.get(e, "unknown")
    env.globals["is_state"] = lambda e, v: e == "input_boolean.house_palette" and v == "on"
    assert env.from_string(state).render().strip() == "today"
    env.globals["is_state"] = lambda e, v: e == "input_boolean.house_palette" and v == "off"
    off = env.from_string(state).render().strip()
    assert off and off != "today"


def test_a_room_without_a_part_keeps_its_plain_default_sensor(rendered):
    for f in (rendered / "home-assistant/packages").glob("scenes_*.yaml"):
        pkg = yaml.safe_load(f.read_text())
        if f.name == "scenes_living.yaml" or "template" not in pkg:
            continue
        assert "house_palette" not in pkg["template"][0]["sensor"][0]["state"], f.name


def test_the_house_card_carries_the_switch_not_a_button(rendered):
    dash = yaml.safe_load((rendered / "home-assistant/dashboards/phone.yaml").read_text())

    def walk(node):
        if isinstance(node, dict):
            if node.get("title") == "La palette":
                yield node
            for v in node.values():
                yield from walk(v)
        elif isinstance(node, list):
            for v in node:
                yield from walk(v)

    row = {
        "entity": "input_boolean.house_palette",
        "name": "Palette du jour",
        "icon": "mdi:palette-swatch",
    }
    cards = [c for c in walk(dash) if row in c.get("entities", [])]
    assert len(cards) == 1  # the house card; Réglages carries the select and the hour
    assert not any(r.get("type") == "button" for r in cards[0]["entities"])
    assert (
        "script.house_palette_today"
        not in (rendered / "home-assistant/dashboards/phone.yaml").read_text()
    )
