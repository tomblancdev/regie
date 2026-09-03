"""The descent — the dashboard's shape, and the two rules that give it.

A page answers one question and offers one way on; it never shows what the page
below it is for. And a step with one way on is not a step: a room whose single
role holds every light it has does not draw that role, and a group too small to
be worth opening is drawn where it stands instead.
"""

import pytest
import yaml

from regie.errors import HouseError
from regie.house import load_house
from regie.render import render


def dashboard(root):
    return yaml.safe_load(
        (root / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    )


def views(root):
    return {v["path"]: v for v in dashboard(root)["views"]}


def headings(view):
    return [c["heading"] for s in view["sections"] for c in s["cards"] if c["type"] == "heading"]


def cards(view, heading):
    """The cards of the section a heading opens."""
    for section in view["sections"]:
        names = [c for c in section["cards"] if c["type"] == "heading"]
        if names and names[0]["heading"] == heading:
            return [c for c in section["cards"] if c["type"] != "heading"]
    raise AssertionError(f"no section {heading!r} in {view['path']}")


def test_a_room_whose_one_role_holds_everything_is_not_drawn_twice(rendered):
    """Chambre A is `main` and nothing else, so `light.bedroom_a_main` and
    `light.bedroom_a_lights` are the same set: the room already IS the role.
    Its page shows the bulbs, not a group that would only lead back to them."""
    v = views(rendered)
    assert "bedroom_a-main" not in v, "a role that is the whole room earns no page"
    assert headings(v["bedroom_a"])[-1] == "Ampoules", "not Groupes: there is no group to open"
    below = cards(v["bedroom_a"], "Ampoules")
    assert all("tap_action" not in c for c in below), "a bulb is the bottom — no way on"


def test_a_group_earns_a_page_only_when_it_is_worth_one(house_with, secrets, tmp_path):
    """Two bulbs under one role: the group is drawn where it stands, its own
    bulbs under it — a page holding two rows is a tap nobody wants. Four: a page.
    The room never becomes a dead end either way."""

    def lamps(n):
        def mutate(d):
            d["things"] += [
                {
                    "id": f"bedroom_a_lamp_{i}",
                    "area": "bedroom_a",
                    "kind": "light",
                    "via": "zigbee",
                    "ieee": f"0x000d6ffffe0002{i:02d}",
                    "label": f"Lampe {i}",
                    "role": "lamp",
                }
                for i in range(n)
            ]

        return mutate

    small = tmp_path / "small"
    render(load_house(house_with(lamps(2))), small, secrets)
    room = views(small)["bedroom_a"]
    assert "bedroom_a-lamp" not in views(small)
    drawn = [c.get("name") for c in cards(room, "Groupes")]
    assert "lamp" in drawn and "Lampe 0" in drawn and "Lampe 1" in drawn

    big = tmp_path / "big"
    render(load_house(house_with(lamps(4))), big, secrets)
    v = views(big)
    assert "bedroom_a-lamp" in v, "four bulbs are worth a page"
    row = next(c for c in cards(v["bedroom_a"], "Groupes") if c.get("name") == "lamp")
    assert row["tap_action"]["navigation_path"] == "/regie-phone/bedroom_a-lamp"
    assert row["icon_tap_action"] == {"action": "toggle"}, "one row, two gestures"
    assert "Lampe 3" not in [c.get("name") for c in cards(v["bedroom_a"], "Groupes")]


def test_the_settings_of_a_room_live_with_the_room(rendered):
    """Acting and tuning are different pages: the room's page is what you press
    now, its cog holds the looks it defaults to and the health of its things."""
    v = views(rendered)
    assert v["living"]["sections"][-1]["cards"][0]["tap_action"] == {
        "action": "navigate",
        "navigation_path": "/regie-phone/living-settings",
    }
    settings = v["living-settings"]
    title = next(h for h in headings(settings) if h.startswith("Santé de la pièce"))
    health = cards(settings, title)
    assert health[0]["entity"] == "sensor.living_offline"
    listed = {r["entity"] for c in health if c["type"] == "entities" for r in c["entities"]}
    assert "light.living_ceiling" in listed
    assert all(e.split(".")[1] for e in listed), "every id is one the house minted itself"
    # the house's settings page gathers the rooms rather than holding their knobs
    rooms = cards(v["settings"], "Pièces")
    assert {c["name"] for c in rooms} == {
        "Entrée",
        "Salon",
        "Cuisine",
        "Chambre A",
        "Chambre B",
        "Le carton",
    }


def test_a_parking_room_shows_its_things_and_acts_on_none(rendered):
    """Le carton: what has no room yet. Visible, testable, and nothing in the
    house moves it — no look, no default, no automation, by declaration."""
    v = views(rendered)
    page = v["spare"]
    assert "Ambiances" not in headings(page), "a parking room has no look to press"
    note = page["sections"][0]["cards"][0]
    assert note["type"] == "markdown" and "Rien ici n'est automatis" in note["content"]
    tried = [c.get("name") for c in page["sections"][0]["cards"] if c["type"] == "tile"]
    assert tried == ["Ampoule neuve"], "a bulb with no place is still a bulb you can try"
    # a thing with no control at all is NAMED rather than silently dropped
    assert any(
        c["type"] == "markdown" and "Télécommande neuve" in c["content"]
        for c in page["sections"][0]["cards"][1:]
    )
    assert "spare-main" not in v and "spare-looks" not in v


def test_a_parking_room_renders_no_script_and_no_automation(rendered):
    pkg = yaml.safe_load(
        (rendered / "home-assistant/packages/lighting_spare.yaml").read_text(encoding="utf-8")
    )
    assert [g["name"] for g in pkg["light"]] == ["spare_lights"], "the group stays: it is plumbing"
    assert "automation" not in pkg, "nothing here is automated — that is the whole point"
    assert not (rendered / "home-assistant/packages/scenes_spare.yaml").exists()
    scripts = (rendered / "home-assistant/dashboards/phone.yaml").read_text(encoding="utf-8")
    assert "script.spare_" not in scripts


def test_a_house_picks_a_skin_off_the_shelf_and_repaints_what_it_wants(rendered):
    """`use: nuit` is the whole declaration; the house's own keys land on top and
    the palettes merge KEY BY KEY. It never writes `--state-light-active-color`
    itself — it says `lit`, once, and every card that means "a light is on"
    follows."""
    theme = yaml.safe_load(
        (rendered / "home-assistant/themes/temoin.yaml").read_text(encoding="utf-8")
    )["temoin"]
    assert theme["ha-card-border-radius"] == "18px", "Nuit's geometry, not the default 12"
    assert theme["tile-icon-border-radius"] == "24px", "a round key"
    assert theme["feature-height"] == "44px", "a dimmer a thumb can catch"
    assert theme["ha-font-family-heading"].startswith("Manrope")
    # the thing that makes it modern rather than recoloured: a card leaves the
    # ground by LIFT, not by a line — no border, and a drop shadow with no inset
    assert theme["ha-card-border-width"] == "0px", "Nuit has no borders anywhere"
    dark, light = theme["modes"]["dark"], theme["modes"]["light"]
    assert dark["state-light-active-color"] == "#f0a92a" == dark["state-active-color"], (
        "the house repainted `lit` and the engine spread it everywhere it means"
    )
    assert dark["primary-color"] == "#7aa2ff", "and kept Nuit's accent: a merge, not a swap"
    assert dark["ha-card-border-color"] == "#20242c", "dividers still need a colour"
    assert "inset" not in dark["ha-card-box-shadow"], "a lift, not a plate's highlight"
    assert dark["ha-card-box-shadow"] != light["ha-card-box-shadow"], "the light differs by mode"
    assert light["primary-background-color"] == "#f4f5f8", "the light mode came with it"


def test_the_library_is_what_the_product_carries(witness):
    """Three themes on the shelf, each a whole declaration; an unknown name is
    refused with the list rather than rendering a house with no skin."""
    from regie import theme as skin

    assert {k: v["label"] for k, v in skin.library().items()} == {
        "nuit": "Nuit",
        "verre": "Verre",
        "atelier": "L'Atelier",
    }
    glass = skin.build(skin.resolve({"use": "verre"}))["verre"]
    assert glass["ha-card-backdrop-filter"] == "blur(22px)", "the frosting is a variable HA reads"
    plate = skin.build(skin.resolve({"use": "atelier"}))["atelier"]
    assert plate["ha-card-border-width"] == "1px", "a plate wants its edge"
    assert "inset" in plate["modes"]["dark"]["ha-card-box-shadow"], "and its highlight"
    assert glass["modes"]["dark"]["ha-card-background"].startswith("rgba("), "glass is translucent"
    with pytest.raises(HouseError) as exc:
        skin.resolve({"use": "chartreuse"})
    assert "atelier, nuit, verre" in str(exc.value)


def test_the_typefaces_ride_with_the_brain(rendered):
    """A theme may NAME a font but not load one. The faces the stacks name are
    embedded in the module the frontend loads — so a phone with no internet
    still reads the house's type, and no phone calls a font server."""
    js = (rendered / "home-assistant/www/regie-skin.js").read_text(encoding="utf-8")
    assert js.count("@font-face") == 4, "Manrope 400/500/600/700 — only what the stacks name"
    assert "url(data:font/woff2;base64," in js
    assert "http" not in js.split("//", 1)[1].split("\n")[0], "nothing is fetched at runtime"
    conf = (rendered / "home-assistant/configuration.yaml").read_text(encoding="utf-8")
    assert "themes: !include_dir_merge_named themes" in conf
    assert "- /local/regie-skin.js" in conf


def test_a_house_with_no_theme_renders_none_of_it(house_with, secrets, tmp_path):
    """A house that names no skin keeps Home Assistant's own — which is a
    choice, not an omission, and it must leave no half-file behind."""

    def strip(d):
        d["house"].pop("theme")

    render(load_house(house_with(strip)), tmp_path, secrets)
    assert not (tmp_path / "home-assistant/themes").exists()
    assert not (tmp_path / "home-assistant/www/regie-skin.js").exists()
    conf = (tmp_path / "home-assistant/configuration.yaml").read_text(encoding="utf-8")
    assert "frontend:" not in conf
