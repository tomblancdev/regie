"""A look kept on the phone (0.36, the audit's V5): the rule's FOURTH KIND.
« Garder » pressed in a room writes one logbook line on the button — the
look the room wore and what every light of it did at that moment (the
recorder holds no light's brightness or colour: the light domain marks them
unrecorded). The conductor reads that line, projects the lights onto the
look's shape and names it under the same rule as a knob — kept until
`regie pull home.yml looks` writes the roles that moved into the room's
own file."""

import json

import yaml

from regie import pull as P
from regie.apply import apply
from regie.dash import link
from regie.edit import Word, flow, set_leaf
from regie.house import load_house
from tests.test_apply import (  # noqa: F401 — the two autouse stubs ride along
    FakeHA,
    _door_answers,
    _no_llm_server,
    states,
)

T1 = "2026-09-07T09:12:00.000000+00:00"
T2 = "2026-09-07T10:00:00.000000+00:00"
T3 = "2026-09-07T11:00:00.000000+00:00"
T4 = "2026-09-07T12:00:00.000000+00:00"
OLD = "2026-08-01T12:00:00.000000+00:00"
K = {"warm": 2700, "neutral": 4000, "cool": 5500}
BUTTON = "input_button.living_keep"


def detail(steps, name):
    return next(s.detail for s in steps if s.name == name)


def names(steps, prefix):
    return [s.name for s in steps if s.name.startswith(prefix)]


def warm(entity, pct):
    """One light's row in the keep's line: on, at pct % warm."""
    return [entity, "on", round(pct * 255 / 100), "color_temp", 2700, [255, 167, 88]]


def off(entity):
    return [entity, "off", None, None, None, None]


def press(ha, when, look, *rows):
    """« Garder » pressed at `when` while the room wore `look`: the button's
    state, and the line the keep automation logs on it."""
    ha.states[BUTTON] = when
    message = json.dumps({"look": look, "lights": list(rows)}, separators=(",", ":"))
    ha.logbook.append(
        {"entity_id": BUTTON, "when": when, "name": "Keep the look", "message": message}
    )


def test_the_projection_says_the_files_words_where_the_bulbs_agree():
    """An `on` agrees with any lit bulb; a brightness within a point agrees
    and keeps the file's number; a colour temperature within the house's
    word keeps the word; a key the look does not name is left alone; a
    transition the bulb cannot say stands; the colour family follows the
    bulb when it switched between white and colour."""
    one = P._project_one
    assert one("on", {"brightness": 100, "ct": "neutral"}, K) == "on"
    assert one("on", "on", K) == "on"
    assert one("on", "off", K) == "off"
    assert one("off", "off", K) == "off"
    assert one("off", {"brightness": 40, "ct": "warm"}, K) == {"brightness": 40, "ct": "warm"}
    assert one({"brightness": 30, "ct": "warm"}, {"brightness": 29, "ct": "warm"}, K) == {
        "brightness": 30,
        "ct": "warm",
    }
    assert one({"brightness": 30, "ct": "warm"}, {"brightness": 45, "ct": 2800}, K) == {
        "brightness": 45,
        "ct": "warm",
    }
    assert one({"brightness": 30, "ct": "warm"}, {"brightness": 30, "ct": "cool"}, K) == {
        "brightness": 30,
        "ct": "cool",
    }
    assert one(
        {"brightness": 30, "ct": "warm", "transition": 2}, {"brightness": 30, "color": "#ff8800"}, K
    ) == {"brightness": 30, "transition": 2, "color": "#ff8800"}
    assert one({"brightness": 30}, {"brightness": 30, "ct": "warm"}, K) == {"brightness": 30}
    assert one({"color": "#ff8800"}, {"brightness": 50, "color": "#ff8702"}, K) == {
        "color": "#ff8800"
    }
    assert one({"color": "#ff8800"}, {"brightness": 50, "color": "#ff0000"}, K) == {
        "color": "#ff0000"
    }
    assert one({"brightness": 30}, None, K) == {"brightness": 30}, "not read: the file's word"
    assert one({"brightness": 30}, "off", K) == "off"
    # the shape of a look, place by place, and the way between two shapes
    a = {"main": {"a": {"brightness": 30}, "b": {"brightness": 30}}, "lamp": {"l": "on"}}
    b = {"main": {"a": {"brightness": 45}, "b": {"brightness": 45}}, "lamp": {"l": "off"}}
    assert P.describe_look(a, b) == "main brightness 30 → 45, lamp on → off"
    c = {"main": {"a": {"brightness": 45}, "b": "off"}, "lamp": {"l": "on"}}
    assert P.describe_look(a, c) == "main.a brightness 30 → 45, main.b { brightness: 30 } → off"


def test_set_leaf_places_a_new_key_above_a_sibling_and_a_word_stays_bare():
    text = "scenes:\n  day: { main: on }\n  # the evening\n  evening: { main: off }\n"
    assert set_leaf(text, ["scenes", "soft"], {"main": {"brightness": 30}}, before="evening") == (
        "scenes:\n  day: { main: on }\n  soft:\n    main: { brightness: 30 }\n"
        "  # the evening\n  evening: { main: off }\n"
    )
    assert set_leaf(text, ["scenes", "soft"], {"main": "x"}, before="nowhere") == (
        text + "  soft:\n    main: x\n"
    ), "no such sibling: the block's end"
    assert flow({"main": Word("on"), "lamp": Word("off")}) == "{ main: on, lamp: off }"
    assert flow({"main": "on"}) == '{ main: "on" }', "a plain string is still quoted"


def test_the_press_is_written_down_by_an_automation_on_the_button(rendered, witness):
    """The scenes package of a room that renders a look carries the button
    and ONE automation: the button's state moves → a logbook line on the
    button, the look the room wears and every light of it read by template.
    The Réglages page carries the row."""
    text = (rendered / "home-assistant/packages/scenes_living.yaml").read_text(encoding="utf-8")
    pkg = yaml.safe_load(text)
    assert pkg["input_button"]["living_keep"]["name"] == "Salon — Garder l'ambiance"
    keep = next(a for a in pkg["automation"] if a["id"] == "regie_living_keep")
    assert keep["triggers"] == [{"trigger": "state", "entity_id": BUTTON}]
    (action,) = keep["actions"]
    assert action["action"] == "logbook.log"
    assert action["data"]["entity_id"] == BUTTON
    message = action["data"]["message"]
    for e in witness.room_lights(witness.area("living")):
        assert e in message, e
    assert (
        "state_attr(e, 'brightness')" in message and "states('input_select.living_look')" in message
    )
    assert message.rstrip().endswith("| to_json }}")
    phone = (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    assert "entity: input_button.living_keep\n        name: Garder l'ambiance en cours" in phone
    # a room that renders no look has no button and no line
    assert not (rendered / "home-assistant/packages/scenes_bedroom_b.yaml").exists() or (
        "bedroom_b_keep"
        not in (rendered / "home-assistant/packages/scenes_bedroom_b.yaml").read_text(
            encoding="utf-8"
        )
    )


def test_a_look_kept_on_the_phone_is_named_pulled_then_follows(secrets, tmp_path, house_with):
    """The living room wore cinema, the lamp was tuned to 20 % and « Garder »
    pressed: the keep's line is read from the logbook, named against the
    file at every converge until `regie pull home.yml looks` writes the one
    role that moved into the room's own line — every other byte kept —,
    then it follows the files. Both moved: a hand, `push` settles. A keep
    while the room wore off or a look that moves, or one the logbook no
    longer holds, writes nothing and says why."""
    path = house_with(lambda d: None)
    house = load_house(path)
    living = path.parent / "rooms" / "living.yml"
    ha = FakeHA()
    apply(house, secrets, tmp_path, ha, check=False)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert names(steps, "look living") == [], "nothing kept: the room says nothing"
    memory = json.loads((tmp_path / ".regie/looks.json").read_text())
    assert memory["living"]["kept"] == "" and "cinema" in memory["living"]["looks"]
    assert "party" not in memory["living"]["looks"], "a look that moves is not a person's to keep"
    assert "today" not in memory["living"]["looks"], "nor one the palette paints"
    assert memory["living"]["looks"]["cinema"] == {
        "main": {"front_left": "off", "front_right": "off", "back_center": "off"},
        "lamp": {"living_floor_lamp": {"brightness": 10, "ct": "warm"}},
    }
    # the press: the room wore cinema, the lamp at 20 % warm, the ceilings off
    ceilings = ("light.living_ceiling", "light.living_ceiling_2", "light.living_ceiling_3")
    press(ha, T1, "cinema", warm("light.living_floor_lamp", 20), *(off(e) for e in ceilings))
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["look living/cinema"] == "ok"
    assert detail(steps, "look living/cinema") == (
        "kept 09-07 09:12 UTC — edited on the phone (lamp brightness 10 → 20), kept — "
        "not yet pulled: `regie pull home.yml looks` writes it"
    )
    memory = json.loads((tmp_path / ".regie/looks.json").read_text())
    assert memory["living"]["kept"] == "", "a keep that waits is not settled"
    # the pull: the lamp's entry in the cinema line, the rest of the line kept
    before = living.read_text(encoding="utf-8")
    lines = P.pull(house, ha, tmp_path, ["looks"], P.house_files(house), link)
    assert lines == [
        "looks:",
        "  + living.yml: scenes.cinema.lamp { brightness: 10, ct: warm } → "
        "{ brightness: 20, ct: warm }",
        "pull: 1 leaf/file(s) written — review the diff, commit, converge",
    ]
    after = living.read_text(encoding="utf-8")
    assert after == before.replace(
        "lamp: { brightness: 10, ct: warm }, strip", "lamp: { brightness: 20, ct: warm }, strip"
    )
    house = load_house(path)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "look living/cinema") == "kept 09-07 09:12 UTC — follows the files"
    memory = json.loads((tmp_path / ".regie/looks.json").read_text())
    assert memory["living"]["kept"] == T1, "settled"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert names(steps, "look living") == [], "settled: silent"
    # both moved: the lamp kept at 30 %, the file says 15 — a hand; push settles
    press(ha, T2, "cinema", warm("light.living_floor_lamp", 30), *(off(e) for e in ceilings))
    living.write_text(
        after.replace("brightness: 20, ct: warm }, strip", "brightness: 15, ct: warm }, strip"),
        encoding="utf-8",
    )
    house = load_house(path)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["look living/cinema"] == "hand"
    assert detail(steps, "look living/cinema") == (
        "kept 09-07 10:00 UTC — edited on the phone (lamp brightness 20 → 30) and the files "
        "moved too (lamp brightness 20 → 15) — kept, by hand: `regie pull home.yml looks` "
        "keeps the phone's, `regie push home.yml looks` the files'"
    )
    lines = P.push(house, ha, tmp_path, ["looks"], link)
    assert lines == ["looks:", "  + look living/cinema: settled — the files' version stands"]
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert names(steps, "look living") == []
    assert "brightness: 15" in living.read_text(encoding="utf-8"), "the file's word stood"
    # a keep while the room wore off: nothing to write, said once
    press(ha, T3, "off", *(off(e) for e in ceilings))
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "look living") == (
        "kept 09-07 11:00 UTC while the room wore off — nothing to write "
        "(take a look, tune the bulbs, keep)"
    )
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert names(steps, "look living") == []
    # a keep while the room wore a look that moves: the bulbs are the walk's
    press(ha, T4, "party", warm("light.living_floor_lamp", 20))
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "look living/party") == (
        "kept 09-07 12:00 UTC while the room wore « Fête », a look whose bulbs are the "
        "palette's or a walk's — nothing to write"
    )
    # a press the logbook holds no line for (older than the recorder's days)
    memory = json.loads((tmp_path / ".regie/looks.json").read_text())
    memory["living"]["kept"] = ""
    (tmp_path / ".regie/looks.json").write_text(json.dumps(memory))
    ha.states[BUTTON] = OLD
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "look living") == (
        "kept 08-01 12:00 UTC — the logbook holds no line for it (older than the recorder's "
        "days, or the keep automation not rendered yet): nothing to write (keep again)"
    )
    # a check writes no memory
    ha.states[BUTTON] = T4
    apply(house, secrets, tmp_path, ha, check=True)
    memory = json.loads((tmp_path / ".regie/looks.json").read_text())
    assert memory["living"]["kept"] == OLD


def test_a_kept_house_look_lands_in_the_room_where_the_order_stays(secrets, tmp_path, house_with):
    """A look the room inherits from the house (0.35) and never wrote: kept
    with two ceilings at 45 % and one off, the pull writes the one role that
    moved — by place, the bulbs disagreeing — as a new block in the room's
    file, placed where the page's order and the arrows' walk stay as they
    were; the lamp, untouched, is still the house's."""

    def house_look(d):
        d["scenes"] = {"soft": {"main": {"brightness": 30, "ct": "warm"}, "lamp": "on"}}

    path = house_with(house_look)
    house = load_house(path)
    living = path.parent / "rooms" / "living.yml"
    order = list(house.area("living")["scenes"])
    assert order[0] == "soft", "a house look no room look precedes opens the list"
    assert "soft" not in yaml.safe_load(living.read_text(encoding="utf-8"))["scenes"]
    ha = FakeHA()
    apply(house, secrets, tmp_path, ha, check=False)
    press(
        ha,
        T1,
        "soft",
        warm("light.living_ceiling", 45),
        warm("light.living_ceiling_2", 45),
        off("light.living_ceiling_3"),
        warm("light.living_floor_lamp", 100),
    )
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "look living/soft") == (
        "kept 09-07 09:12 UTC — edited on the phone (main.front_left brightness 30 → 45, "
        "main.front_right brightness 30 → 45, main.back_center { brightness: 30, ct: warm } "
        "→ off), kept — not yet pulled: `regie pull home.yml looks` writes it"
    )
    before = living.read_text(encoding="utf-8")
    lines = P.pull(house, ha, tmp_path, ["looks"], P.house_files(house), link)
    assert lines[1] == (
        "  + living.yml: scenes.soft.main { brightness: 30, ct: warm } → { front_left: "
        "{ brightness: 45, ct: warm }, front_right: { brightness: 45, ct: warm }, "
        "back_center: off }"
    )
    after = living.read_text(encoding="utf-8")
    assert after == before.replace(
        "scenes:\n  day:",
        "scenes:\n  soft:\n    main: { front_left: { brightness: 45, ct: warm }, "
        "front_right: { brightness: 45, ct: warm }, back_center: off }\n  day:",
    )
    house = load_house(path)
    assert list(house.area("living")["scenes"]) == order, "the page's order, the arrows' walk"
    assert house.area("living")["scenes"]["soft"]["lamp"] == "on", "still the house's"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "look living/soft") == "kept 09-07 09:12 UTC — follows the files"


def test_a_look_the_room_takes_as_it_is_becomes_its_own_line(secrets, tmp_path, house_with):
    """`soft: true` in the room (the house's look placed where the room writes
    it): kept with the lamp off, the line becomes the role that moved — the
    others still the house's — and stays where it was."""

    def house_look(d):
        d["scenes"] = {"soft": {"main": {"brightness": 30, "ct": "warm"}, "lamp": "on"}}

    path = house_with(house_look)
    living = path.parent / "rooms" / "living.yml"
    text = living.read_text(encoding="utf-8")
    living.write_text(text.replace("  cinema:", "  soft: true\n  cinema:"), encoding="utf-8")
    house = load_house(path)
    order = list(house.area("living")["scenes"])
    assert order.index("soft") == order.index("cinema") - 1
    ha = FakeHA()
    apply(house, secrets, tmp_path, ha, check=False)
    press(ha, T1, "soft", off("light.living_floor_lamp"))
    apply(house, secrets, tmp_path, ha, check=False)
    lines = P.pull(house, ha, tmp_path, ["looks"], P.house_files(house), link)
    assert lines[1] == "  + living.yml: scenes.soft.lamp on → off"
    assert "  soft: { lamp: off }\n  cinema:" in living.read_text(encoding="utf-8")
    house = load_house(path)
    assert list(house.area("living")["scenes"]) == order
    assert house.area("living")["scenes"]["soft"]["main"] == {"brightness": 30, "ct": "warm"}
