"""The scenes pack — looks by role, from rooms/*.yml."""

import pytest
import yaml


def load(rendered, room):
    return yaml.safe_load(
        (rendered / f"home-assistant/packages/scenes_{room}.yaml").read_text(encoding="utf-8")
    )


def looks(script):
    """The parallel block of a scene's script — a room that has a drift stops
    every one of them first, so the looks are no longer step zero."""
    return next(s["parallel"] for s in script["sequence"] if "parallel" in s)


def test_a_scene_renders_for_its_filled_roles_and_waits_for_the_rest(rendered):
    pkg = load(rendered, "living")
    evening = pkg["script"]["living_evening"]
    steps = {s["target"]["entity_id"][0]: s for s in looks(evening)}
    main = steps["light.living_main"]
    assert main["action"] == "light.turn_on"
    assert main["target"] == {"entity_id": ["light.living_main"]}
    # the witness's evening FOLLOWS the palette (0.21): its warm white stays a
    # number, its level goes through the palette's curve at recall, and the
    # lamp (the role group) takes the palette's white
    assert main["data"]["color_temp_kelvin"] == 2700
    assert "pal.curve" in main["data"]["brightness_pct"]
    assert "(60 *" in main["data"]["brightness_pct"]
    assert steps["light.living_lamp"]["action"] == "light.turn_on"  # the role group
    assert steps["light.living_lamp"]["data"]["color_temp_kelvin"] == "{{ pal.white_kelvin }}"
    cinema = pkg["script"]["living_cinema"]
    ids = [s["target"]["entity_id"][0] for s in looks(cinema)]
    assert "light.living_strip" not in ids, "the strip role is filled by nothing yet"
    assert "waiting: strip" in cinema["description"]
    assert looks(cinema)[1]["data"] == {
        "brightness_pct": 10,
        "color_temp_kelvin": 2700,
    }


def test_off_is_implicit_and_default_reads_its_sensor(rendered):
    pkg = load(rendered, "living")
    off = pkg["script"]["living_off"]
    actions = sorted(s["action"] for s in looks(off))
    assert actions == ["light.turn_off"] * 2, (
        "main and lamp; the screen and the speaker go off only when a scene names them"
    )
    default = pkg["script"]["living_default"]
    assert default["sequence"][0]["action"] == "script.living_{{ states('sensor.living_default') }}"
    assert "target" not in default["sequence"][0], (
        "the look's own service, waited for — script.turn_on returned at once (0.17)"
    )
    assert default["sequence"][0]["continue_on_error"] is True
    sensor = pkg["template"][0]["sensor"][0]
    assert sensor["name"] == "living_default"
    assert "input_select.living_look_" in sensor["state"], "the panel's selects drive it (W3b)"


def test_a_room_with_no_filled_role_keeps_its_default_sensor_only(rendered):
    pkg = load(rendered, "bedroom_b")
    assert "script" not in pkg, "no role filled: no script"
    assert pkg["template"][0]["sensor"][0]["name"] == "bedroom_b_default"


def test_a_room_with_neither_renders_nothing(rendered):
    assert not (rendered / "home-assistant/packages/scenes_kitchen.yaml").exists()


def test_a_color_and_a_switch_role(house_with, secrets, tmp_path):
    from regie.house import load_house
    from regie.render import render

    def mutate(d):
        for t in d["things"]:
            if t["id"] == "kitchen_plug":
                t["role"] = "lamp"
            if t["id"] == "kitchen_ceiling":
                t["role"] = "main"

    path = house_with(mutate)
    (path.parent / "rooms" / "kitchen.yml").write_text(
        "id: kitchen\nscenes:\n  glow: { lamp: on, main: { color: '#200000' } }\n",
        encoding="utf-8",
    )
    render(load_house(path), tmp_path, secrets)
    pkg = yaml.safe_load((tmp_path / "home-assistant/packages/scenes_kitchen.yaml").read_text())
    steps = looks(pkg["script"]["kitchen_glow"])
    by = {s["action"]: s for s in steps}
    assert by["switch.turn_on"]["target"]["entity_id"] == ["switch.kitchen_plug"]
    assert by["light.turn_on"]["data"] == {"rgb_color": [32, 0, 0]}


def test_without_the_panel_the_sensor_bakes_the_table(house_with, secrets, tmp_path):
    from regie.house import load_house
    from regie.render import render as _render

    house = load_house(house_with(lambda d: d.update(controls={"panel": False})))
    _render(house, tmp_path, secrets)
    pkg = yaml.safe_load(
        (tmp_path / "home-assistant/packages/scenes_living.yaml").read_text(encoding="utf-8")
    )
    assert list(pkg["input_select"]) == ["living_look", "living_look_before"], (
        "the memory stays; the panel's selects go"
    )
    state = pkg["template"][0]["sensor"][0]["state"]
    assert "table" in state and "'dark': 'evening'" in state


def test_the_panel_renders_the_look_selects_and_the_sensor_reads_them(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/scenes_living.yaml").read_text(encoding="utf-8")
    )
    sel = pkg["input_select"]
    assert sel["living_look_dark"]["options"] == [
        "day",
        "evening",
        "cinema",
        "night",
        "party",
        "today",
    ]
    assert sel["living_look_night"]["options"][0] == "sun", "the first choice = follow the sun"
    body = pkg["template"][0]["sensor"][0]["state"]
    assert "input_select.living_look_" in body and "sun" in body
    assert "table" not in body, "the panel's sensor reads the selects, not a baked table"


# --- a look may speak to the PLACES inside a role, and a look may MOVE -------


def test_a_look_names_the_places_inside_a_role(rendered):
    """`party` sets the front spots one way, switches the one place above the
    table off, and lets everything it did not name take the look's own keys."""
    pkg = load(rendered, "living")
    party = pkg["script"]["living_party"]
    steps = {s["target"]["entity_id"][0]: s for s in looks(party)}
    assert steps["light.living_main_front"]["data"] == {
        "brightness_pct": 6,
        "rgb_color": [0, 150, 255],
    }, "a prefix its places share aims at the group they already have"
    assert steps["light.living_ceiling_3"]["action"] == "light.turn_off", (
        "back_center, by the name the layout gives it — never an entity id"
    )
    assert party["icon"] == "mdi:party-popper"
    assert party["alias"] == "Salon — Fête", "the scene's own label, not its id"
    assert "tags: social, dynamic" in party["description"]


def with_living(house_with, mutate):
    """The witness, its living-room FILE mutated (a room is its own file)."""
    home = house_with(lambda d: None)
    room = home.parent / "rooms" / "living.yml"
    data = yaml.safe_load(room.read_text(encoding="utf-8"))
    mutate(data)
    room.write_text(yaml.safe_dump(data, allow_unicode=True), encoding="utf-8")
    return home


def test_a_place_named_beside_its_prefix_is_refused(house_with):
    from regie.errors import HouseError
    from regie.house import load_house

    def clash(room):
        room["scenes"]["clash"] = {"main": {"front": "on", "front_left": "off"}}

    with pytest.raises(HouseError) as e:
        load_house(with_living(house_with, clash))
    assert "already speaks for it" in str(e.value)


def test_a_place_the_layout_does_not_know_is_refused(house_with):
    from regie.errors import HouseError
    from regie.house import load_house

    def typo(room):
        room["scenes"]["typo"] = {"main": {"frnt": "on"}}

    with pytest.raises(HouseError) as e:
        load_house(with_living(house_with, typo))
    assert "no such place" in str(e.value)


def test_a_base_look_covers_every_place_the_look_did_not_name(house_with):
    """The look's own keys are what everything unnamed takes — which is how
    `all of them dim, except that one, off` is said in one line."""
    from regie.house import load_house

    def base(room):
        room["scenes"]["base"] = {"main": {"brightness": 30, "front_left": "off"}}

    house = load_house(with_living(house_with, base))
    area = house.area("living")
    plan = next(p for p in house.scene_plan(area) if p["id"] == "base")
    by_place = {r["place"]: r["look"] for r in plan["roles"]}
    assert by_place["front_left"] == {"on": False}
    assert by_place["front_right"] == {"on": True, "brightness_pct": 30}
    assert by_place["back_center"] == {"on": True, "brightness_pct": 30}


def test_the_drift_walks_every_place_on_its_own_clock(rendered):
    pkg = load(rendered, "living")
    drift = pkg["script"]["living_party_drift"]
    (rep,) = drift["sequence"]
    assert rep["repeat"]["while"][0]["entity_id"] == "input_boolean.living_party_drift", (
        "the kill-switch IS the loop's condition — turning it off ends the walk"
    )
    # 0.25.5: a walker is painted only while it is on — the call sits under its `if`
    walk = rep["repeat"]["sequence"]
    calls = [
        s["then"][0] for s in walk if "if" in s and s["then"][0].get("action") == "light.turn_on"
    ]
    delays = [s for s in rep["repeat"]["sequence"] if "delay" in s]
    assert [c["target"]["entity_id"] for c in calls] == [
        "light.living_ceiling",
        "light.living_ceiling_2",
    ]
    assert all("brightness" not in str(c["data"]) for c in calls), (
        "brightness is NEVER sent: a level command aborts the colour ramp in the bulb"
    )
    periods = [c["data"]["hs_color"][0] for c in calls]
    assert "/ 80.0)" in periods[0] and "/ 175.0)" in periods[1], "no two share a clock"
    assert "+ 0.0)" in periods[0] and "+ 0.5)" in periods[1], "nor a phase"
    assert all(c["data"]["transition"] == 2.5 for c in calls)
    assert [d["delay"]["milliseconds"] for d in delays] == [1250, 1250], (
        "the places share the step window between them"
    )


def test_every_other_look_stops_the_drift(rendered):
    pkg = load(rendered, "living")
    for scene in ("living_day", "living_evening", "living_cinema", "living_night", "living_off"):
        first, second = pkg["script"][scene]["sequence"][:2]
        assert first["action"] == "input_boolean.turn_off"
        assert first["target"]["entity_id"] == [
            "input_boolean.living_party_drift",
            "input_boolean.living_today_drift",
        ], "a moving ceiling belongs to ONE look: leaving it must leave it"
        assert second == {
            "action": "script.turn_off",
            "target": {
                "entity_id": [
                    "script.living_party_drift",
                    "script.living_today_drift",
                    "script.living_today_life",
                ]
            },
        }, "and the loop in flight is stopped, not left to paint over the next look (0.19.2)"
    party = pkg["script"]["living_party"]["sequence"]
    assert party[-2]["action"] == "input_boolean.turn_on"
    assert party[-1]["target"]["entity_id"] == "script.living_party_drift"


def test_the_drift_gets_a_switch_on_the_settings_view(rendered):
    body = (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    assert "input_boolean.living_party_drift" in body, "H36: a look that moves can be stopped"


def test_a_zigbee_target_stretches_a_step_below_its_colour_floor(house_with):
    from regie.house import load_house

    def hurry(room):
        room["scenes"]["party"]["run"]["drift"]["step"] = 0.5

    house = load_house(with_living(house_with, hurry))
    plan = next(p for p in house.scene_plan(house.area("living")) if p["id"] == "party")
    d = house.drift_plan(house.area("living"), plan)
    assert d["asked"] == 0.5 and d["step"] == 2.0, (
        "a Zigbee bulb ramps colour itself; a command inside that ramp aborts it"
    )
    assert any("stretched" in h for h in house.hints)


def test_the_switch_starts_the_walk_and_a_restart_resumes_it(rendered):
    """The kill-switch is the only truth: turning it on starts the loop, and
    Home Assistant coming back starts it again. Without this the helper reads
    `on` after a restart (or a converge, which reloads the scripts) while
    nothing walks — a look frozen while claiming to move."""
    pkg = load(rendered, "living")
    auto = next(a for a in pkg["automation"] if a["id"] == "regie_living_party_drift")
    assert [t["trigger"] for t in auto["triggers"]] == ["homeassistant", "state"]
    assert auto["triggers"][1]["entity_id"] == "input_boolean.living_party_drift"
    assert auto["triggers"][1]["to"] == "on"
    assert auto["conditions"][0]["state"] == "on"
    assert auto["actions"][0]["target"]["entity_id"] == "script.living_party_drift"


def test_every_look_writes_the_rooms_memory_and_lets_the_sensors_go(rendered):
    """0.17: the room remembers its look — every look script writes what the
    room wears now and what it wore before (`off` first, so a fresh helper
    reads off), and clears the sensors' mark where the room senses."""
    pkg = load(rendered, "hall")
    sel = pkg["input_select"]
    assert sel["hall_look"]["options"] == ["off", "dim"], "a string, never YAML's boolean"
    assert sel["hall_look_before"]["options"] == ["off", "dim"]
    seq = pkg["script"]["hall_dim"]["sequence"]
    assert seq[0]["if"][0]["value_template"] == (
        "{{ states('input_select.hall_look') in ['off', 'dim'] "
        "and not is_state('input_select.hall_look', 'dim') }}"
    ), "before moves only when the look changes, and never takes an unknown"
    assert seq[0]["then"] == [
        {
            "action": "input_select.select_option",
            "target": {"entity_id": "input_select.hall_look_before"},
            "data": {"option": "{{ states('input_select.hall_look') }}"},
        }
    ]
    assert seq[1] == {
        "action": "input_select.select_option",
        "target": {"entity_id": "input_select.hall_look"},
        "data": {"option": "dim"},
    }
    assert seq[2] == {
        "action": "input_boolean.turn_off",
        "target": {"entity_id": "input_boolean.hall_lit_by_motion"},
    }, "a look is a hand's act: the sensors let go of the room"
    assert pkg["script"]["hall_off"]["sequence"][1]["data"] == {"option": "off"}
    living = load(rendered, "living")["script"]["living_day"]["sequence"]
    assert not any(
        s.get("target", {}).get("entity_id") == "input_boolean.living_lit_by_motion" for s in living
    ), "no sensor in the living room: nothing to let go of"
