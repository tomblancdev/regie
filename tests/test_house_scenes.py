"""The house's looks, declared once and inherited (0.34, the audit's V10):
a look under the top-level `scenes:` reaches every room that has a role it
names; a room says what differs, refuses with `false`, places with `true`.
And the five rules only a comment knew, said by `check`."""

import pytest
import yaml

from regie.errors import HouseError
from regie.house import load_house
from regie.render import render

NIGHT_LINE = (
    "  night:   { main: off, lamp: { brightness: 5, ct: warm } }   "
    "# a LOOK (H34): the night-light glimmer, never all-off\n"
)
HALL_SCENES = "scenes:\n  dim: { main: { brightness: 20, ct: warm } }\n"


def with_house_looks(house_with, text, rooms=None):
    """The witness with a `scenes.yml` beside home.yml (include: scenes) and,
    per room, an edit of its file's text."""
    path = house_with(lambda d: d["include"].update(scenes="scenes.yml"))
    (path.parent / "scenes.yml").write_text(text, encoding="utf-8")
    for name, edit in (rooms or {}).items():
        room = path.parent / "rooms" / f"{name}.yml"
        room.write_text(edit(room.read_text(encoding="utf-8")), encoding="utf-8")
    return path


def test_a_look_declared_once_reaches_every_room_that_has_its_roles(house_with):
    path = with_house_looks(
        house_with,
        "day: { main: on, lamp: off, strip: off }\n"
        "soft: { main: { brightness: 30, ct: warm }, lamp: on }\n",
    )
    h = load_house(path)
    rooms = {a["id"]: a for a in h.areas}
    # the hall has main alone: the house's two looks cut to it, first in the
    # house's order, its own `dim` after — YAML reads a bare on/off as a bool
    assert list(rooms["hall"]["scenes"]) == ["day", "soft", "dim"]
    assert rooms["hall"]["scenes"]["day"] == {"main": True}
    assert rooms["hall"]["scenes"]["soft"] == {"main": {"brightness": 30, "ct": "warm"}}
    assert h.scene_origin["hall"] == {"day": "house", "soft": "house", "dim": "room"}
    # bedroom_b has a lamp alone and writes its own soft: the house's, restated
    # — the room's word for the lamp wins; the house's day reaches it for the lamp
    assert list(rooms["bedroom_b"]["scenes"]) == ["day", "soft"]
    assert rooms["bedroom_b"]["scenes"]["soft"] == {"lamp": {"brightness": 30, "ct": "warm"}}
    assert rooms["bedroom_b"]["scenes"]["day"] == {"lamp": False}
    assert h.scene_origin["bedroom_b"] == {"soft": "both", "day": "house"}
    # the living room writes its own day (the house's, restated — its strip is a
    # role it has, so the house's word for it rides along) and five looks of
    # its own; the house's soft follows day, the house look before it
    assert rooms["living"]["scenes"]["day"] == {"main": True, "lamp": False, "strip": False}
    assert list(rooms["living"]["scenes"]) == [
        "day",
        "soft",
        "evening",
        "cinema",
        "night",
        "party",
        "today",
    ]
    assert h.scene_origin["living"]["day"] == "both"
    assert h.scene_origin["living"]["soft"] == "house"
    # a parking room inherits nothing; a room with no role of the look neither
    assert not rooms["spare"].get("scenes")
    assert not rooms["kitchen"].get("scenes")
    # what renders: the hall's two new scripts, from one line each
    assert h.rendered_scenes(rooms["hall"]) == {"day", "soft", "dim", "off"}


def test_a_room_refuses_a_look_with_false_and_places_one_with_true(house_with):
    path = with_house_looks(
        house_with,
        "day: { main: on }\nsoft: { main: { brightness: 30, ct: warm } }\n",
        rooms={
            "hall": lambda t: t.replace(
                HALL_SCENES,
                "scenes:\n  soft: false\n"
                "  dim: { main: { brightness: 20, ct: warm } }\n"
                "  day: true\n",
            )
        },
    )
    h = load_house(path)
    hall = h.area("hall")
    assert list(hall["scenes"]) == ["dim", "day"], "day placed where the room wrote it"
    assert hall["scenes"]["day"] == {"main": True}
    assert h.scene_origin["hall"] == {"soft": "refused", "dim": "room", "day": "house"}
    assert not any("hall: refuses" in w for w in h.warnings)
    # refusing a look the house never declared is a slip worth a warning
    path = with_house_looks(
        house_with,
        "day: { main: on }\n",
        rooms={"hall": lambda t: t.replace("scenes:\n", "scenes:\n  party: false\n")},
    )
    h = load_house(path)
    assert any(
        "hall: refuses look 'party' — the house declares no such look" in w for w in h.warnings
    )
    # taking one the house never declared asks for nothing: refused
    path = with_house_looks(
        house_with,
        "day: { main: on }\n",
        rooms={"hall": lambda t: t.replace("scenes:\n", "scenes:\n  party: true\n")},
    )
    with pytest.raises(HouseError, match="hall: scene party: true takes the house's look"):
        load_house(path)


def test_the_rooms_own_keys_win_key_by_key(house_with):
    path = with_house_looks(
        house_with,
        "today:\n"
        "  label: Palette du jour\n"
        "  icon: mdi:palette\n"
        "  palette: today\n"
        "  main: { color: band, brightness: 40 }\n"
        "  lamp: off\n"
        "  strip: off\n"
        "stars: { night: { brightness: 40 } }\n",
    )
    h = load_house(path)
    living = h.area("living")
    today = living["scenes"]["today"]
    # the house's label and palette, the room's own places map for main and its
    # own word for the lamp, the house's word for the strip (a role it has)
    assert today["label"] == "Palette du jour" and today["palette"] == "today"
    assert set(today["main"]) == {"front", "back_center"}
    assert today["lamp"] == {"ct": "white", "brightness": 50}
    assert today["strip"] is False
    assert h.scene_origin["living"]["today"] == "both"
    # the hall takes it whole, for its main; its card calls it by the house's label
    assert h.area("hall")["scenes"]["today"] == {
        "label": "Palette du jour",
        "icon": "mdi:palette",
        "palette": "today",
        "main": {"color": "band", "brightness": 40},
    }
    assert h.scene_meta(h.area("hall"), "today")["label"] == "Palette du jour"
    # `stars` names a role no room has: it reaches nobody
    assert all("stars" not in (a.get("scenes") or {}) for a in h.areas)


def test_one_new_look_at_the_house_level_appears_in_every_room_that_renders_it(
    house_with, rendered, secrets, tmp_path
):
    path = with_house_looks(house_with, "essai: { main: { brightness: 50, ct: warm } }\n")
    out = tmp_path / "out"
    render(load_house(path), out, secrets)
    for room in ("living", "hall", "bedroom_a"):
        pkg = yaml.safe_load(
            (out / f"home-assistant/packages/scenes_{room}.yaml").read_text(encoding="utf-8")
        )
        assert f"{room}_essai" in pkg["script"], room
    # what moved: the rooms' scenes packages, their pages, the living remote's
    # walk (the arrows walk the file's order, the new look in it) and the
    # manifest's objects — nothing else
    moved = sorted(
        str(p.relative_to(out))
        for p in out.rglob("*")
        if p.is_file() and p.read_bytes() != (rendered / p.relative_to(out)).read_bytes()
    )
    assert moved == [
        ".regie/manifest.json",
        "home-assistant/dashboards/phone.yaml",
        "home-assistant/packages/hands_living.yaml",
        "home-assistant/packages/scenes_bedroom_a.yaml",
        "home-assistant/packages/scenes_hall.yaml",
        "home-assistant/packages/scenes_living.yaml",
    ]


def test_a_look_moved_to_the_house_renders_the_same_bytes(house_with, rendered, secrets, tmp_path):
    """The proof of the diet: the living room's night, word for word, at the
    house level; the room keeps its place with one word; bedroom_a keeps its
    own night (the house's, restated); the hall and bedroom_b refuse it —
    and the whole render is byte for byte the witness's."""
    path = with_house_looks(
        house_with,
        "night: { main: off, lamp: { brightness: 5, ct: warm } }\n",
        rooms={
            "living": lambda t: t.replace(NIGHT_LINE, "  night:   true\n"),
            "hall": lambda t: t.replace("scenes:\n", "scenes:\n  night: false\n"),
            "bedroom_b": lambda t: t.replace("scenes:\n", "scenes:\n  night: false\n"),
        },
    )
    h = load_house(path)
    assert h.scene_origin["living"]["night"] == "house"
    assert h.scene_origin["bedroom_a"]["night"] == "both"
    assert h.area("bedroom_a")["scenes"]["night"] == {"main": {"brightness": 5, "ct": "warm"}}
    out = tmp_path / "out"
    render(h, out, secrets)
    ours = {str(p.relative_to(out)) for p in out.rglob("*") if p.is_file()}
    theirs = {str(p.relative_to(rendered)) for p in rendered.rglob("*") if p.is_file()}
    assert ours == theirs
    moved = sorted(f for f in ours if (out / f).read_bytes() != (rendered / f).read_bytes())
    assert moved == []


def test_the_rules_only_a_comment_knew_are_said(witness, house_with):
    # the witness as it stands: fx.yml names no enable, the hall has no today
    # look, the living remote's arrows walk the file's order
    assert any(
        h.startswith("fx: no enable: — every shape of the library renders a script (")
        for h in witness.hints
    )
    assert any(
        h == "hall: no today look — the room sits out of the palette of the day"
        for h in witness.hints
    )
    assert any(
        h == "living: hands living_remote: the arrows walk day · evening · cinema · night · "
        "party · today — the file's order (a looks: line chooses)"
        for h in witness.hints
    )
    # a prefix two places share is a group of its own: unnamed, check names it
    path = house_with(lambda d: None)
    living = path.parent / "rooms" / "living.yml"
    text = living.read_text(encoding="utf-8")
    assert "    places: { front: Devant, back: Derrière }\n" in text
    living.write_text(
        text.replace("    places: { front: Devant, back: Derrière }\n", ""), encoding="utf-8"
    )
    h = load_house(path)
    assert any(
        x == "living: main's places front_left, front_center, front_right share the prefix "
        "'front' — a group light.living_main_front of its own, unnamed (a `places:` line names it)"
        for x in h.hints
    )
    assert not any("share the prefix" in x for x in witness.hints), "named: nothing to say"
    # every place sharing one prefix is a group equal to the role's own: a slip
    living.write_text(
        text.replace(
            "  lamp:      { label: Lampadaire }\n",
            "  lamp:      { label: Lampadaire }\n"
            "  chandelier: { label: Lustre, layout: [arm_1, arm_2] }\n",
        ),
        encoding="utf-8",
    )
    h = load_house(path)
    assert any(
        w == "living: every place of chandelier shares the prefix 'arm' — the group "
        "light.living_chandelier_arm would equal the role's own; write arm1, not arm_1"
        for w in h.warnings
    )
    # the house remote's `rooms: all` skips the rooms without the look — said
    living.write_text(
        text.replace(
            "  living_remote: { behaviour: room_remote }",
            "  living_remote: { behaviour: house_remote, welcome: [living], open_plan: [living] }",
        ),
        encoding="utf-8",
    )
    h = load_house(path)
    assert any(
        x == "living: hands living_remote right: look 'night' for every room skips hall — "
        "no such look there"
        for x in h.hints
    ), h.hints
    assert any(
        x == "living: hands living_remote hold_on: look 'day' for every room skips hall, "
        "bedroom_a — no such look there"
        for x in h.hints
    ), h.hints
    # a `looks:` line on a room remote: the arrows walk that order
    living.write_text(
        text.replace(
            "  living_remote: { behaviour: room_remote }",
            "  living_remote: { behaviour: room_remote, looks: [day, cinema] }",
        ),
        encoding="utf-8",
    )
    h = load_house(path)
    assert any(
        x == "living: hands living_remote: the arrows walk day · cinema — looks:'s order"
        for x in h.hints
    )
