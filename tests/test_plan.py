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
    assert view["type"] == "panel" and len(view["cards"]) == 1, "the card alone, filling the page"
    card = view["cards"][0]
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
    assert card["overlayScale"] == "fixed", "a badge stays a thumb's target while the plan scales"
    floors = {f["id"]: f for f in card["floors"]}
    assert list(floors) == ["ground"], "both drawn rooms are on the ground floor"
    ground = floors["ground"]
    assert ground["image"] == "/local/plan.png" and ground["imageFit"] == "stretch"
    assert ground["imageOpacity"] == 0.5
    assert {a["id"] for a in ground["areas"]} == {"living", "hall"}
    living = next(a for a in ground["areas"] if a["id"] == "living")
    assert living["name"] == "Salon"
    assert "haArea" not in living, "the area's id in Home Assistant is the conductor's, not ours"
    assert living["points"][0] == {"x": 20, "y": 20}
    assert living["hold_action"] == {"action": "navigate", "navigation_path": "/regie-phone/living"}
    assert "tap_action" not in living, "a tap zooms — the card's own gesture; holding walks down"
    # the walls are the plan file's own, as drawn (0.15) - not the rooms' edges
    assert [w["id"] for w in ground["walls"]] == [f"wall_{i}" for i in range(1, 8)]
    assert ground["walls"][0] == {"id": "wall_1", "x1": 20, "y1": 20, "x2": 780, "y2": 20}
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


def test_the_card_is_never_an_extra_module(rendered):
    """An extra module is imported by the index while the app loads; the card
    defines an element and must load AFTER the app's registry polyfill — so it
    is a lovelace resource (apply), and the frontend block carries the skin alone."""
    cfg = (rendered / "home-assistant/configuration.yaml").read_text(encoding="utf-8")
    assert "    - /local/regie-skin.js\n" in cfg
    assert "easy-floorplan" not in cfg


def _strip_room_plans(home):
    for room in ("living", "hall"):
        _mutate_room(home, room, lambda r: r.pop("plan"))


def test_no_plan_no_tab_no_module(house_with, secrets, tmp_path):
    home = house_with(lambda d: d["include"].pop("plan"))
    _strip_room_plans(home)
    house = load_house(home)
    assert house.plan() is None
    render(house, tmp_path, secrets)
    assert "plan" not in {v["path"] for v in dashboard(tmp_path)["views"]}
    assert not (tmp_path / "home-assistant/www/easy-floorplan-card.js").exists()
    cfg = (tmp_path / "home-assistant/configuration.yaml").read_text(encoding="utf-8")
    assert "/local/regie-skin.js" in cfg


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
    assert "      back_center: off\n" in text
    assert '      front_left: { brightness: 10, color: "#00a0ff" }\n' in text
    # a bare `off` reads as YAML 1.1's False - the room files' own form (guidelines 1.11)
    assert yaml.safe_load(text)["scenes"]["essai"]["main"]["back_center"] is False
    assert yaml.safe_load(text)["scenes"]["essai"]["main"]["front_left"]["color"] == "#00a0ff"


def test_a_room_read_all_off_is_written_one_role_per_line():
    """Read live on 2026-09-03: La Cantine with every light off came out as
    `essai: {label: Essai, main: false, table: false}` — one flow line, and
    `off` spelt `false`. A scene of scalars is still one role per line."""
    text = snippet(
        "essai", {"main": "off", "table": "off", "lamp": {"brightness": 40, "ct": "warm"}}, "Essai"
    )
    assert text == (
        "scenes:\n  essai:\n    label: Essai\n    main: off\n    table: off\n"
        "    lamp: { brightness: 40, ct: warm }\n"
    )
    assert yaml.safe_load(text)["scenes"]["essai"]["main"] is False


# --- the workbench's pull (0.14): the editor's draft back into the files -----------------------
def _witness_card(witness):
    from regie.dash import link
    from regie.floorplan import card

    return card(witness, link)


def test_pull_reads_the_card_back_into_the_same_blocks(witness):
    """What the files draw, pulled back unchanged: outlines, openings (their
    `to:` kept from the old block), points by role and place, in the layout's
    order. Nothing is lost on a round trip."""
    from regie.plan import pull

    blocks, notes = pull(witness, _witness_card(witness))
    assert notes == []
    living = witness.area("living")["plan"]
    assert blocks["living"]["outline"] == living["outline"]
    assert blocks["living"]["doors"] == [{"at": [420, 250], "width": 80, "to": "hall"}]
    assert blocks["living"]["windows"] == [{"at": [20, 170], "width": 160}]
    assert blocks["living"]["at"]["main"] == living["at"]["main"]
    assert list(blocks["living"]["at"]["main"]) == list(living["at"]["main"])
    assert blocks["living"]["at"]["lamp"] == [390, 290]
    assert blocks["hall"]["doors"] == [
        {"at": [610, 20], "width": 90, "role": "door", "to": "outside"}
    ]
    assert blocks["hall"]["at"] == {"main": [610, 110], "motion": [460, 180]}


def test_pull_follows_the_editor_moves_and_names_what_it_cannot_place(witness):
    """A bulb dragged, a door drawn by the editor (a random id, a length), an
    item added from the picker (an entity, no id of ours), an area drawn that
    is no room, an item that is no thing: each lands or is named."""
    from regie.plan import pull

    card = _witness_card(witness)
    floor = card["floors"][0]
    for it in floor["items"]:
        if it["id"] == "living_ceiling":
            it["x"], it["y"] = 133.4, 96.6
    floor["openings"].append(
        {"id": "door_k3j9x", "type": "door", "x": 300, "y": 320, "length": 75.2, "flipV": True}
    )
    floor["items"].append(
        {"id": "item_z8q1", "entity": "light.living_floor_lamp", "x": 50, "y": 50}
    )
    floor["areas"].append(
        {
            "id": "area_p0o9",
            "name": "Terrasse",
            "points": [{"x": 0, "y": 0}, {"x": 5, "y": 0}, {"x": 5, "y": 5}],
        }
    )
    floor["items"].append({"id": "item_q2w3", "entity": "light.nobody", "x": 1, "y": 1})
    blocks, notes = pull(witness, card)
    assert blocks["living"]["at"]["main"]["front_left"] == [133, 97], "rounded to the centimetre"
    assert {"at": [300, 320], "width": 75, "flip_v": True} in blocks["living"]["doors"]
    assert blocks["living"]["at"]["lamp"] == [50, 50], "the picker's item is found by its entity"
    assert any("area 'area_p0o9' (Terrasse, HA area -) is no room of the house" in n for n in notes)
    assert any("item item_q2w3 (light.nobody) is no thing" in n for n in notes)


def test_a_room_file_keeps_every_other_byte(tmp_path):
    from regie.plan import block_text, rewrite

    f = tmp_path / "hall.yml"
    f.write_text(
        "# the hall\nid: hall\nroles: { main: {}, door: {} }\n"
        "# THE PLAN: traced\nplan:\n  outline: [[0, 0], [1, 0], [1, 1]]\n  at: { main: [0, 0] }\n"
        "defaults: { dark: dim }\n",
        encoding="utf-8",
    )
    plan = {
        "outline": [[440, 20], [780, 20], [780, 200], [440, 200]],
        "doors": [{"at": [610, 20], "width": 90, "role": "door", "to": "outside"}],
        "at": {"main": [610, 110], "motion": [460, 180]},
    }
    assert rewrite(f, plan) is True
    text = f.read_text(encoding="utf-8")
    assert text.startswith(
        "# the hall\nid: hall\nroles: { main: {}, door: {} }\n# THE PLAN: traced\nplan:\n"
    )
    assert text.endswith("defaults: { dark: dim }\n"), "what follows the block is kept"
    assert "  doors:\n    - { at: [610, 20], width: 90, role: door, to: outside }\n" in text
    assert "  at:\n    main: [610, 110]\n    motion: [460, 180]\n" in text
    assert yaml.safe_load(text)["plan"] == plan, "what is written reads back as itself"
    assert rewrite(f, plan) is False, "the same block again changes nothing"
    g = tmp_path / "spare.yml"
    g.write_text("id: spare\nparking: true\n", encoding="utf-8")
    assert rewrite(g, {"outline": [[0, 0], [1, 0], [1, 1]]}) is True
    assert (
        g.read_text(encoding="utf-8")
        == "id: spare\nparking: true\nplan:\n  outline: [[0, 0], [1, 0], [1, 1]]\n"
    )
    assert block_text(
        {"outline": [[0, 0], [1, 0], [1, 1]], "at": {"main": {"a": [1, 2]}}}
    ).endswith("  at:\n    main:\n      a: [1, 2]\n")


def test_find_card_looks_into_views_and_sections():
    from regie.plan import find_card

    card = {"type": "custom:easy-floorplan-card", "floors": []}
    assert find_card({"views": [{"type": "panel", "cards": [card]}]}) is card
    assert (
        find_card(
            {"views": [{"type": "sections", "sections": [{"cards": [{"type": "markdown"}, card]}]}]}
        )
        is card
    )
    assert find_card({"views": [{"cards": [{"type": "markdown"}]}]}) is None


def test_pull_reads_what_the_editor_saves(witness):
    """Read live 2026-09-03: on Save the editor re-mints every id (`area_…`,
    `item_…`, `door_…`) and keeps the link to the Home Assistant area in
    `haArea` and the room's name — the HA area ids are what the conductor
    adopted by alias or made from the label (salon, la_reserve). A room is found
    by any of those; a thing by the entity a row names; a Zigbee address inside
    an entity id names the thing it belongs to without placing it."""
    from regie.plan import pull, room_keys, slug

    assert slug("La Réserve") == "la_reserve" and slug("L'Atelier") == "l_atelier"
    keys = room_keys(witness)
    assert keys["salon"] == "living" and keys["le_salon"] == "living" and keys["living"] == "living"
    assert keys["entree"] == "hall", "a label, slugged the way HA makes an area id"
    card = {
        "type": "custom:easy-floorplan-card",
        "width": 800,
        "height": 600,
        "floors": [
            {
                "id": "ground",
                "areas": [
                    {
                        "id": "area_5m1by2h",
                        "name": "Salon",
                        "haArea": "salon",
                        "points": [
                            {"x": 20, "y": 20},
                            {"x": 420, "y": 20},
                            {"x": 420, "y": 320},
                            {"x": 20, "y": 320},
                        ],
                    },
                    {
                        "id": "area_x",
                        "name": "Entrée",
                        "haArea": "hall",
                        "points": [
                            {"x": 440, "y": 20},
                            {"x": 780, "y": 20},
                            {"x": 780, "y": 200},
                            {"x": 440, "y": 200},
                        ],
                    },
                    {
                        "id": "area_y",
                        "name": "Terrasse",
                        "haArea": "terrasse",
                        "points": [{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 1, "y": 1}],
                    },
                ],
                "openings": [
                    {
                        "id": "door_kmmv3y8",
                        "type": "door",
                        "x": 610,
                        "y": 20,
                        "length": 90,
                        "entity": "binary_sensor.hall_door",
                    }
                ],
                "items": [
                    {"id": "item_hfo6gfa", "entity": "light.living_ceiling", "x": 100, "y": 90},
                    {
                        "id": "item_snw29um",
                        "entity": "sensor.0x000d6ffffe000004_temperature",
                        "x": 300,
                        "y": 300,
                    },
                    {"id": "item_q", "entity": "media_player.nobody", "x": 1, "y": 1},
                ],
                "walls": [],
            }
        ],
    }
    blocks, notes = pull(witness, card)
    assert set(blocks) == {"living", "hall"}
    assert blocks["living"]["at"]["main"]["front_left"] == [100, 90]
    assert blocks["living"]["at"]["lamp"] == [390, 290], "an unfilled place keeps its old point"
    assert blocks["hall"]["doors"] == [
        {"at": [610, 20], "width": 90, "role": "door", "to": "outside"}
    ]
    assert any("Terrasse" in n and "no room of the house" in n for n in notes)
    assert any(
        "living_thermostat" in n and "entity: sensor.0x000d6ffffe000004_temperature" in n
        for n in notes
    ), "a Zigbee address names the thing without placing it"
    assert any("media_player.nobody" in n and "`entity:`" in n for n in notes)


def test_a_kept_point_outside_a_moved_room_is_dropped_and_named(witness):
    """Read on the first real pull: the two cells were swapped in the editor,
    and the ceiling point of the role nothing fills yet stayed where the OLD
    cell was — outside the new outline. Kept points follow the room or go."""
    from regie.plan import pull

    card = _witness_card(witness)
    floor = card["floors"][0]
    living = next(a for a in floor["areas"] if a["id"] == "living")
    living["points"] = [
        {"x": 20, "y": 20},
        {"x": 200, "y": 20},
        {"x": 200, "y": 200},
        {"x": 20, "y": 200},
    ]
    floor["items"] = [i for i in floor["items"] if i["id"] != "living_floor_lamp"]
    blocks, notes = pull(witness, card)
    assert "lamp" not in blocks["living"]["at"], "the lamp's kept point [390, 290] is outside now"
    assert any("living: lamp at [390, 290] fell outside" in n for n in notes)
    assert "front_center" not in blocks["living"]["at"]["main"], (
        "a kept place too: [220, 90] is out"
    )
    assert blocks["living"]["at"]["main"]["front_left"] == [120, 90], "what is inside stays"


# --- the walls (0.15): the flat's own, as drawn -------------------------------------------
def test_the_plan_file_is_included_and_its_walls_are_the_walls(witness):
    """`include.plan` merges the plan's own file: the frame, the drawing and the
    walls a person drew. Declared, the card draws exactly these; the rooms'
    outlines stay their floors."""
    plan = witness.plan()
    assert plan["size"] == [800, 600] and plan["image"] == "plan.png"
    assert len(plan["walls"]) == 7 and plan["walls"][0] == [20, 20, 780, 20]
    assert [p.name for p in witness.included["plan"]] == ["plan.yml"]


def test_without_walls_drawn_the_rooms_edges_stand_in(house_with, secrets, tmp_path):
    """Read live 2026-09-03 (Tom: "some walls don't exist between le passage,
    la cantine and QG, keep the walls as I design them"): an open plan has rooms
    with no wall between them, so a wall is a declaration of its own. A house
    that drew none keeps the old behaviour: every outline edge is a wall."""
    home = house_with(lambda d: None)
    plan_file = home.parent / "plan.yml"
    text = plan_file.read_text(encoding="utf-8")
    plan_file.write_text(text[: text.index("walls:")], encoding="utf-8")
    house = load_house(home)
    assert "walls" not in house.plan()
    render(house, tmp_path, secrets)
    walls = plan_card(tmp_path)["floors"][0]["walls"]
    assert len([w for w in walls if w["id"].startswith("living_")]) == 4
    assert len([w for w in walls if w["id"].startswith("hall_")]) == 4


def test_pull_walls_and_rewrite_keep_the_rest_of_the_plan_file(tmp_path):
    from regie.plan import pull_walls, rewrite_walls

    card = {
        "floors": [
            {
                "walls": [
                    {"id": "wall_x", "x1": 20.4, "y1": 20, "x2": 779.6, "y2": 20},
                    {"id": "w2", "x1": 20, "y1": 20, "x2": 20, "y2": 320},
                ]
            }
        ]
    }
    walls = pull_walls(card)
    assert walls == [[20, 20, 780, 20], [20, 20, 20, 320]], "rounded to the centimetre"
    f = tmp_path / "plan.yml"
    f.write_text(
        "# the frame\nsize: [800, 600]\nimage: plan.png\nwalls:\n  - [1, 1, 2, 2]\n",
        encoding="utf-8",
    )
    assert rewrite_walls(f, walls) is True
    assert (
        f.read_text(encoding="utf-8") == "# the frame\nsize: [800, 600]\nimage: plan.png\nwalls:\n"
        "  - [20, 20, 780, 20]\n  - [20, 20, 20, 320]\n"
    )
    assert rewrite_walls(f, walls) is False
    g = tmp_path / "bare.yml"
    g.write_text("size: [800, 600]\n", encoding="utf-8")
    assert rewrite_walls(g, walls) is True
    assert yaml.safe_load(g.read_text(encoding="utf-8"))["walls"] == walls


def test_a_point_the_card_placed_stays_even_outside_its_room(witness):
    """Read live 2026-09-03: Le Passage's air sensor sits on La Cantine's side
    of the line by Tom's word, and the pull dropped it as if it were a stale
    memory. Only a KEPT point is dropped when outside; a badge a person placed
    is written where it is, and `check` is what says it is outside."""
    from regie.plan import pull

    card = _witness_card(witness)
    floor = card["floors"][0]
    for it in floor["items"]:
        if it["id"] == "living_floor_lamp":
            it["x"], it["y"] = 600, 100  # inside the hall's outline, not the living's
    blocks, notes = pull(witness, card)
    assert blocks["living"]["at"]["lamp"] == [600, 100], "placed by a person: kept as is"
    assert not any("lamp" in n and "fell outside" in n for n in notes)
