"""The plan (0.13) — the flat drawn from declarations, and a look written down.

Nothing on the Plan tab is inferred: a room draws its own outline, places its
own things by role and by place, and `check` names what a file did not place.
The card is a renderer; the grammar is the house's.
"""

import yaml

from regie.errors import HouseError
from regie.floorplan import edge_angle, inside, placements
from regie.house import load_house
from regie.look import fold_places, look_of_state, room_look, snippet
from regie.render import render


def dashboard(root):
    return yaml.safe_load(
        (root / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    )


def plan_card(root):
    views = {v["path"]: v for v in dashboard(root)["views"]}
    assert "plan" in views, "the witness declares a plan: the tab exists"
    view = views["plan"]
    assert "subview" not in view, "a tab, beside the rooms — not a page behind one"
    card = view["sections"][0]["cards"][0]
    assert card["type"] == "custom:easy-floorplan-card"
    return card


# --- the geometry ----------------------------------------------------------------
def test_an_opening_takes_the_angle_of_the_wall_it_pierces():
    box = [[0, 0], [100, 0], [100, 50], [0, 50]]
    assert edge_angle(box, [50, 0]) == 0, "the top wall runs left to right"
    assert edge_angle(box, [100, 25]) == 90, "the right wall runs up and down"
    assert edge_angle(box, [0, 40]) == 90
    assert edge_angle(box, [30, 50]) == 0


def test_inside_counts_the_edge_and_nothing_beyond():
    box = [[0, 0], [100, 0], [100, 50], [0, 50]]
    assert inside(box, [50, 25])
    assert inside(box, [100, 25]), "a door sits ON the outline"
    assert not inside(box, [150, 25])
    assert not inside(box, [50, -10])


# --- the card, from the witness --------------------------------------------------
def test_the_tab_carries_the_frame_the_rooms_and_the_drawing(rendered):
    card = plan_card(rendered)
    assert (card["width"], card["height"]) == (800, 600), "1 cm = 1 unit, the house's frame"
    assert card["grid_options"] == {"columns": "full"}
    assert card["overlayScale"] == "fixed", "a badge stays a thumb's target while the plan scales"
    floors = {f["id"]: f for f in card["floors"]}
    assert list(floors) == ["ground"], "both drawn rooms are on the ground floor"
    ground = floors["ground"]
    assert ground["image"] == "/local/plan.png" and ground["imageFit"] == "stretch"
    assert ground["imageOpacity"] == 0.5
    assert {a["id"] for a in ground["areas"]} == {"living", "hall"}
    living = next(a for a in ground["areas"] if a["id"] == "living")
    assert living["haArea"] == "living" and living["name"] == "Salon"
    assert living["points"][0] == {"x": 20, "y": 20}
    assert living["hold_action"] == {"action": "navigate", "navigation_path": "/regie-phone/living"}
    assert "tap_action" not in living, "a tap zooms — the card's own gesture; holding walks down"
    # four corners = four walls, per room
    assert len([w for w in ground["walls"] if w["id"].startswith("living_")]) == 4
    assert (rendered / "home-assistant/www/plan.png").read_bytes()[:4] == b"\x89PNG"
    assert (rendered / "home-assistant/www/easy-floorplan-card.js").stat().st_size > 100_000


def test_a_thing_is_drawn_where_its_role_and_place_say(rendered):
    card = plan_card(rendered)
    items = {i["id"]: i for i in card["floors"][0]["items"]}
    # living_ceiling is main at front_left; the point is the room's own
    assert items["living_ceiling"]["x"] == 120 and items["living_ceiling"]["y"] == 90
    assert items["living_ceiling"]["entity"] == "light.living_ceiling"
    assert items["living_ceiling"]["glow"] is True and items["living_ceiling"]["glowRadius"] == 130
    assert items["living_ceiling"]["showName"] is False, "a badge, not a label — the room is small"
    # a role without a layout takes one point
    assert (items["living_floor_lamp"]["x"], items["living_floor_lamp"]["y"]) == (390, 290)
    # a screen thing: its media_player entity, no glow
    assert items["living_tv"]["kind"] == "media_player" and "glow" not in items["living_tv"]
    # the remote carries no role: not on the plan
    assert "living_remote" not in items


def test_a_door_bound_to_its_sensor_follows_it_and_the_sensor_is_not_drawn_twice(rendered):
    card = plan_card(rendered)
    ground = card["floors"][0]
    door = next(o for o in ground["openings"] if o["id"] == "hall_door_1")
    assert door["type"] == "door" and door["motion"] == "swing"
    assert door["angle"] == 0, "the front door pierces the hall's top wall"
    assert door["entity"] == "binary_sensor.hall_door"
    assert door["length"] == 90
    assert "hall_door" not in {i["id"] for i in ground["items"]}, "the leaf IS the sensor"
    window = next(o for o in ground["openings"] if o["id"] == "living_window_1")
    assert window["motion"] == "fixed" and "entity" not in window
    hall = next(a for a in ground["areas"] if a["id"] == "hall")
    assert hall["entity"] == "binary_sensor.hall_motion" and hall["highlight"] == "fill"


def test_the_module_rides_the_skin_seam(rendered):
    cfg = (rendered / "home-assistant/configuration.yaml").read_text(encoding="utf-8")
    assert "    - /local/regie-skin.js\n    - /local/easy-floorplan-card.js\n" in cfg


def _strip_room_plans(home):
    for room in ("living", "hall"):
        _mutate_room(home, room, lambda r: r.pop("plan"))


def test_no_plan_no_tab_no_module(house_with, secrets, tmp_path):
    home = house_with(lambda d: d.pop("plan"))
    _strip_room_plans(home)
    house = load_house(home)
    assert house.plan() is None
    render(house, tmp_path, secrets)
    assert "plan" not in {v["path"] for v in dashboard(tmp_path)["views"]}
    assert not (tmp_path / "home-assistant/www/easy-floorplan-card.js").exists()
    cfg = (tmp_path / "home-assistant/configuration.yaml").read_text(encoding="utf-8")
    assert "easy-floorplan" not in cfg and "/local/regie-skin.js" in cfg


def test_a_frame_with_no_room_drawn_is_a_hint_not_a_tab(house_with):
    home = house_with(lambda d: None)
    _strip_room_plans(home)
    house = load_house(home)
    assert house.plan() is None
    assert any("no room draws an outline" in h for h in house.hints)


# --- check: the faults a plan can be written into -----------------------------
def _room(home, room_id):
    return home.parent / "rooms" / f"{room_id}.yml"


def _mutate_room(home, room_id, fn):
    p = _room(home, room_id)
    data = yaml.safe_load(p.read_text(encoding="utf-8"))
    fn(data)
    p.write_text(yaml.safe_dump(data, allow_unicode=True), encoding="utf-8")


def test_a_point_for_a_role_the_room_does_not_have_is_refused(house_with):
    home = house_with(lambda d: None)
    _mutate_room(home, "living", lambda r: r["plan"]["at"].update({"fountain": [10, 10]}))
    try:
        load_house(home)
    except HouseError as exc:
        assert "plan places role 'fountain', and the room has no such role" in str(exc)
    else:
        raise AssertionError("a role the room does not have")


def test_one_point_for_a_role_with_places_is_refused(house_with):
    home = house_with(lambda d: None)
    _mutate_room(home, "living", lambda r: r["plan"]["at"].update({"main": [200, 100]}))
    try:
        load_house(home)
    except HouseError as exc:
        assert "one point, and the role has places" in str(exc)
    else:
        raise AssertionError("a layout wants a point per place")


def test_a_place_the_layout_does_not_know_is_refused(house_with):
    home = house_with(lambda d: None)
    _mutate_room(home, "living", lambda r: r["plan"]["at"]["main"].update({"ceiling_9": [1, 1]}))
    try:
        load_house(home)
    except HouseError as exc:
        assert "plan places ceiling_9 in main, and its layout has no such place" in str(exc)
    else:
        raise AssertionError("an unknown place")


def test_a_point_outside_the_room_is_a_warning_and_an_unplaced_thing_a_hint(house_with):
    home = house_with(lambda d: None)
    _mutate_room(home, "living", lambda r: r["plan"]["at"].update({"lamp": [700, 500]}))
    house = load_house(home)
    assert any(
        "puts lamp at [700, 500], outside the room's own outline" in w for w in house.warnings
    )
    # the witness's hall places main and motion, not its door thing — the door
    # is an opening; and bedroom_b draws no plan at all, which is silence
    assert not any("hall: plan:" in h for h in house.hints)


def test_a_parking_room_is_nowhere(house_with):
    home = house_with(lambda d: None)
    _mutate_room(home, "spare", lambda r: r.update({"plan": {"outline": [[0, 0], [1, 0], [1, 1]]}}))
    try:
        load_house(home)
    except HouseError as exc:
        assert "a parking room is nowhere" in str(exc)
    else:
        raise AssertionError("a parking room has no place on a plan")


def test_a_thing_with_no_entity_wears_an_icon_for_its_kind(house_with, secrets, tmp_path):
    """A house's own word for an appliance (a hood, an oven) is kept and
    labelled by its id (house.py); on the map it wears an icon for the word,
    never a question mark — and an unknown word a plain ring."""

    def appliances(d):
        d["things"] += [
            {"id": "hood", "area": "living", "kind": "hood", "via": "wifi", "role": "hood"},
            {"id": "gizmo", "area": "living", "kind": "gizmo", "via": "wifi", "role": "gizmo"},
        ]

    home = house_with(appliances)
    _mutate_room(
        home,
        "living",
        lambda r: (
            r["roles"].update({"hood": {}, "gizmo": {}}),
            r["plan"]["at"].update({"hood": [100, 100], "gizmo": [120, 100]}),
        ),
    )
    render(load_house(home), tmp_path, secrets)
    items = {i["id"]: i for i in plan_card(tmp_path)["floors"][0]["items"]}
    assert items["hood"]["icon"] == "mdi:fan" and "entity" not in items["hood"]
    assert items["gizmo"]["icon"] == "mdi:checkbox-blank-circle-outline"


def test_a_house_that_names_no_floor_draws_itself_as_the_floor(house_with, secrets, tmp_path):
    def one_floor(d):
        d.pop("floors")
        for a in d["areas"]:
            a.pop("floor", None)

    render(load_house(house_with(one_floor)), tmp_path, secrets)
    (floor,) = plan_card(tmp_path)["floors"]
    assert floor["id"] == "ground" and floor["name"] == "Maison témoin"


def test_placements_split_placed_from_left(witness):
    living = witness.area("living")
    placed, left = placements(witness, living)
    assert {p["thing"]["id"] for p in placed} >= {
        "living_ceiling",
        "living_floor_lamp",
        "living_tv",
    }
    assert left == [], "every roled thing of the witness's living room has a point"


# --- the look verb: a try written down ---------------------------------------------
def test_a_state_reads_as_the_grammar_says_it():
    assert look_of_state({"state": "off"}) == "off"
    assert look_of_state({"state": "unavailable"}) is None
    assert look_of_state(None) is None
    warm = {
        "state": "on",
        "attributes": {"brightness": 153, "color_mode": "color_temp", "color_temp_kelvin": 2750},
    }
    assert look_of_state(warm) == {"brightness": 60, "ct": "warm"}, "2750 K is the house's warm"
    odd = {
        "state": "on",
        "attributes": {"brightness": 255, "color_mode": "color_temp", "color_temp_kelvin": 3300},
    }
    assert look_of_state(odd) == {"brightness": 100, "ct": 3300}, "far from every word: the number"
    colour = {
        "state": "on",
        "attributes": {"brightness": 10, "color_mode": "xy", "rgb_color": [0, 160, 255]},
    }
    assert look_of_state(colour) == {"brightness": 4, "color": "#00a0ff"}
    assert look_of_state({"state": "on", "attributes": {}}) == "on"


def test_places_fold_onto_the_words_a_look_may_use():
    layout = ["front_left", "front_right", "back_left", "back_right"]
    same = {p: {"brightness": 40, "ct": "warm"} for p in layout}
    assert fold_places(layout, same) == {"brightness": 40, "ct": "warm"}, "all agree: the role"
    per = {
        "front_left": {"color": "#00a0ff", "brightness": 4},
        "front_right": {"color": "#00a0ff", "brightness": 4},
        "back_left": "off",
        "back_right": {"brightness": 18},
    }
    assert fold_places(layout, per) == {
        "front": {"color": "#00a0ff", "brightness": 4},
        "back_left": "off",
        "back_right": {"brightness": 18},
    }, "a prefix whose places agree is said once; the rest per place, in layout order"
    # every place READ agrees: the role says it once, and the note names the
    # one left out (the look applies to it too, once it is back)
    partial = {"front_left": "off", "back_left": "off", "back_right": "off"}
    assert fold_places(layout, partial) == "off"
    mixed = {"front_left": "off", "back_left": "off", "back_right": {"brightness": 5}}
    assert fold_places(layout, mixed) == {
        "front_left": "off",
        "back_left": "off",
        "back_right": {"brightness": 5},
    }, "two places of one prefix disagree: each is said"


def test_room_look_reads_the_room_by_role_and_names_what_it_left_out(witness):
    living = witness.area("living")
    states = {
        "light.living_ceiling": {
            "state": "on",
            "attributes": {"brightness": 26, "color_mode": "xy", "rgb_color": [0, 160, 255]},
        },
        "light.living_ceiling_2": {
            "state": "on",
            "attributes": {"brightness": 26, "color_mode": "xy", "rgb_color": [0, 160, 255]},
        },
        "light.living_ceiling_3": {"state": "off"},
        "light.living_floor_lamp": {"state": "unavailable"},
    }
    look, notes = room_look(witness, living, states.get)
    assert (
        look
        == {
            "main": {
                "front_left": {"brightness": 10, "color": "#00a0ff"},
                "front_right": {"brightness": 10, "color": "#00a0ff"},
                "back_center": "off",
            }
        }
        or look["main"]["back_center"] == "off"
    )
    assert notes == ["lamp/living_floor_lamp: unavailable — left out"]
    text = snippet("essai", look, "Essai")
    assert text.startswith("scenes:\n  essai:\n    label: Essai\n    main:\n")
    assert "back_center: off" in text and "{brightness: 10, color: '#00a0ff'}" in text
    # a bare `off` reads as YAML 1.1's False - the room files' own form (guidelines 1.11)
    assert yaml.safe_load(text)["scenes"]["essai"]["main"]["back_center"] is False
