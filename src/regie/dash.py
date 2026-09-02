"""The dashboard — the descent, built as a structure.

The family's phone shows one page per rung: the house, a room, a group of
lights, a place inside it. **A page answers one question and offers one way
on; it never shows what the page below it is for** — which is why a flat of
thirty-three lights opens on a single screen with no scrolling.

Two rules give the shape:

* **One row, two gestures.** The round icon toggles what the row names; the
  row itself walks down. Native, both on the same tile — no third-party card.
* **A step with one way on is not a step.** A room whose one role holds every
  light it has does not draw that role; a group of two bulbs is drawn where
  it stands instead of earning a page nobody wants to open (`NAV_PAGE_MIN`).
  The tree that decides this is the house's (`House.room_nodes`).

The last rung is Home Assistant's own light panel — the wheel, the colours,
the favourites, the history. We hand over rather than redraw it.

Built here as a dict and rendered through `to_block`: four levels of nested
Lovelace YAML written by hand in a template is indentation, not design.
"""

from __future__ import annotations

from .house import House

# the dashboard's url path — `lovelace.dashboards` in configuration.yaml and
# every `navigation_path` below read this one name
URL_PATH = "regie-phone"

# a section is a twelve-column grid; these are the only widths the descent uses
FULL = 12
HALF = 6
QUARTER = 3


def link(path: str) -> str:
    return f"/{URL_PATH}/{path}"


def _cols(card: dict, columns: int) -> dict:
    card["grid_options"] = {"columns": columns}
    return card


def heading(text: str, *, icon: str | None = None) -> dict:
    card = {"type": "heading", "heading": text, "heading_style": "title"}
    if icon:
        card["icon"] = icon
    return card


def light_tile(
    entity: str,
    name: str,
    *,
    icon: str | None = None,
    navigate: str | None = None,
    columns: int = FULL,
) -> dict:
    """A light or a light group: the icon toggles it, the bar dims it, and the
    row walks down when there is somewhere to go."""
    card: dict = {"type": "tile", "entity": entity, "name": name}
    if icon:
        card["icon"] = icon
    card["features_position"] = "bottom"
    card["features"] = [{"type": "light-brightness"}]
    if navigate:
        card["tap_action"] = {"action": "navigate", "navigation_path": navigate}
        card["icon_tap_action"] = {"action": "toggle"}
    return _cols(card, columns)


def plain_tile(entity: str, name: str, *, icon: str | None = None, columns: int = HALF) -> dict:
    card: dict = {"type": "tile", "entity": entity, "name": name}
    if icon:
        card["icon"] = icon
    return _cols(card, columns)


def look_button(entity: str, name: str, icon: str, columns: int = QUARTER) -> dict:
    """A look, as something you press."""
    return _cols(
        {
            "type": "button",
            "entity": entity,
            "name": name,
            "icon": icon,
            "show_state": False,
            "tap_action": {"action": "toggle"},
        },
        columns,
    )


def nav_button(name: str, icon: str, path: str, columns: int = QUARTER) -> dict:
    """A way on with nothing to toggle: `Plus…`, a room's settings."""
    return _cols(
        {
            "type": "button",
            "name": name,
            "icon": icon,
            "show_state": False,
            "tap_action": {"action": "navigate", "navigation_path": path},
        },
        columns,
    )


def _grid(cards: list[dict]) -> dict:
    return {"type": "grid", "cards": cards}


def _view(
    title: str, path: str, sections: list[dict], *, icon: str | None = None, sub: bool = True
) -> dict:
    view: dict = {"title": title, "path": path}
    if icon:
        view["icon"] = icon
    if sub:
        view["subview"] = True
    view["type"] = "sections"
    view["max_columns"] = 2
    view["sections"] = sections
    return view


# --- the nodes of a room, as cards ---------------------------------------------
def _leaf_card(node: dict, columns: int = HALF) -> dict | None:
    if not node["entity"]:
        return None
    if node["kind"] == "light":
        return light_tile(node["entity"], node["label"], columns=columns)
    return plain_tile(node["entity"], node["label"], columns=columns)


def node_cards(nodes: list[dict]) -> list[dict]:
    """A group that earns a page is a row with a way on; a group that does not
    is drawn where it stands, its own lights under it — never a dead end."""
    cards: list[dict] = []
    for n in nodes:
        if n["node"] == "group":
            if n["page"]:
                cards.append(
                    light_tile(n["entity"], n["label"], navigate=link(n["path"]), columns=FULL)
                )
            else:
                cards.append(light_tile(n["entity"], n["label"], columns=FULL))
                cards += [c for c in (_leaf_card(k) for k in n["children"]) if c]
        else:
            card = _leaf_card(n)
            if card:
                cards.append(card)
    return cards


# --- the views ------------------------------------------------------------------
def _home(house: House, house_cards: list[dict]) -> dict:
    ui = house.labels.ui
    sections = []
    if house_cards:
        sections.append(_grid([heading(ui.house)] + house_cards))
    rows = []
    for area in house.areas:
        lights = [t for t in house.things_in(area["id"]) if t["kind"] == "light"]
        if lights:
            rows.append(
                light_tile(
                    f"light.{area['id']}_lights",
                    area["label"],
                    icon=area.get("icon"),
                    navigate=link(area["id"]),
                    columns=FULL,
                )
            )
        else:
            # no light group exists for this room — a row that named one would
            # point at nothing, so the row is a way in and says only that
            rows.append(
                nav_button(
                    area["label"], area.get("icon") or "mdi:door", link(area["id"]), columns=FULL
                )
            )
    sections.append(_grid([heading(ui.rooms)] + rows))
    return _view(ui.rooms, "rooms", sections, icon="mdi:home", sub=False)


def _parking(house: House, area: dict, extra: list[dict]) -> dict:
    """A room where things WAIT: what is in the box, and the reason nothing
    happens to it. No look, no default, no automation — by declaration."""
    ui = house.labels.ui
    things = house.things_in(area["id"])
    cards: list[dict] = [_cols({"type": "markdown", "content": ui.parking_note}, FULL)]
    seen = [t for t in things if house.entity(t)]
    if seen:
        cards.append(heading(f"{ui.waiting} · {len(things)}"))
        cards += [
            (
                light_tile(house.entity(t), t.get("label") or house.labels.kind(t["kind"]))
                if t["kind"] == "light"
                else plain_tile(house.entity(t), t.get("label") or house.labels.kind(t["kind"]))
            )
            for t in seen
        ]
    quiet = [t for t in things if not house.entity(t)]
    if quiet:
        names = ", ".join(t.get("label") or t["id"] for t in quiet)
        cards.append(_cols({"type": "markdown", "content": f"**{ui.no_entity}** {names}"}, FULL))
    sections = [_grid(cards)]
    if extra:
        sections.append(_grid(extra))
    return _view(area["label"], area["id"], sections, icon=area.get("icon"))


def _room(house: House, area: dict, extra: list[dict]) -> dict:
    ui = house.labels.ui
    if house.parking(area):
        return _parking(house, area, extra)
    sections = []

    looks: list[dict] = []
    if house.defaults_of(area) and house.rendered_scenes(area):
        looks.append(
            look_button(f"script.{area['id']}_default", ui.look_normal, "mdi:lightbulb-auto")
        )
    looks += [
        look_button(f"script.{area['id']}_{p['id']}", p["label"], p["icon"])
        for p in house.pinned_scenes(area)
    ]
    if house.other_scenes(area):
        looks.append(nav_button(ui.more, "mdi:dots-horizontal", link(f"{area['id']}-looks")))
    if looks:
        sections.append(_grid([heading(ui.looks)] + looks))

    if any(t["kind"] == "light" for t in house.things_in(area["id"])):
        sections.append(
            _grid(
                [
                    heading(ui.whole_room),
                    light_tile(
                        f"light.{area['id']}_lights",
                        f"{area['label']} — {ui.lights}",
                        columns=FULL,
                    ),
                ]
            )
        )

    nodes = house.room_nodes(area)
    if nodes:
        title = ui.groups if any(n["node"] == "group" for n in nodes) else ui.bulbs
        sections.append(_grid([heading(title)] + node_cards(nodes)))

    if extra:
        sections.append(_grid(extra))
    sections.append(
        _grid([nav_button(ui.room_settings, "mdi:tune", link(f"{area['id']}-settings"), FULL)])
    )
    return _view(area["label"], area["id"], sections, icon=area.get("icon"))


def _looks(house: House, area: dict) -> dict:
    """Every other look the room has, applied by hand — an override that holds
    until the next one; nothing takes it back."""
    ui = house.labels.ui
    here: list[dict] = []
    if house.defaults_of(area) and house.rendered_scenes(area):
        here.append(
            look_button(f"script.{area['id']}_default", ui.look_normal, "mdi:lightbulb-auto")
        )
    here += [
        look_button(f"script.{area['id']}_{p['id']}", p["label"], p["icon"])
        for p in house.pinned_scenes(area)
    ]
    rest = [
        look_button(f"script.{area['id']}_{p['id']}", p["label"], p["icon"])
        for p in house.other_scenes(area)
    ]
    sections = []
    if here:
        sections.append(_grid([heading(ui.on_room_page)] + here))
    sections.append(_grid([heading(ui.by_hand)] + rest))
    return _view(f"{ui.looks} · {area['label']}", f"{area['id']}-looks", sections)


def health_cards(house: House, area: dict) -> list[dict]:
    """What the room's things are doing — the block that exists nowhere else.
    Every entity named here is one the house itself minted (`light.<thing>`):
    nothing is guessed, so nothing here can point at a name that never was."""
    ui = house.labels.ui
    things = house.things_in(area["id"])
    if not things:
        return []
    cards: list[dict] = [heading(f"{ui.health} · {len(things)}")]
    if any(t["kind"] == "light" for t in things):
        cards.append(
            _cols(
                {"type": "tile", "entity": f"sensor.{area['id']}_offline", "name": ui.offline},
                FULL,
            )
        )
    rows = [
        {
            "entity": house.entity(t),
            "name": t.get("label") or house.labels.kind(t["kind"]),
            "secondary_info": "last-changed",
        }
        for t in things
        if house.entity(t)
    ]
    if rows:
        cards.append({"type": "entities", "entities": rows, "state_color": True})
    quiet = [t for t in things if not house.entity(t)]
    if quiet:
        names = ", ".join(t.get("label") or t["id"] for t in quiet)
        cards.append(_cols({"type": "markdown", "content": f"**{ui.no_entity}** {names}"}, FULL))
    return cards


def _settings(house: House, area: dict, cards: list[dict]) -> dict:
    ui = house.labels.ui
    sections = []
    if cards:
        sections.append(_grid(cards))
    health = health_cards(house, area)
    if health:
        sections.append(_grid(health))
    return _view(f"{ui.settings} · {area['label']}", f"{area['id']}-settings", sections)


def _group(house: House, page: dict) -> dict:
    ui = house.labels.ui
    children = page["children"]
    title = ui.places if any(c["node"] == "group" for c in children) else ui.bulbs
    return _view(
        page["label"],
        page["path"],
        [
            _grid([light_tile(page["entity"], page["label"], columns=FULL)]),
            _grid([heading(title)] + node_cards(children)),
        ],
    )


def _house_settings(house: House, cards: list[dict], rooms: list[dict]) -> dict:
    ui = house.labels.ui
    sections = []
    if cards:
        sections.append(_grid([heading(ui.house)] + cards))
    if rooms:
        sections.append(
            _grid(
                [heading(ui.rooms)]
                + [
                    nav_button(
                        a["label"],
                        a.get("icon") or "mdi:door",
                        link(f"{a['id']}-settings"),
                        FULL,
                    )
                    for a in rooms
                ]
            )
        )
    return _view(ui.settings, "settings", sections, icon="mdi:tune", sub=False)


def build(
    house: House,
    *,
    house_cards: list[dict],
    room_cards: dict[str, list[dict]],
    house_settings: list[dict],
    room_settings: dict[str, list[dict]],
) -> dict:
    """The whole dashboard, top rung first: the house, then every room with
    its own pages beneath it, and the house's settings last (a tab, like the
    house itself — every other page is a subview and wears a back arrow)."""
    views = [_home(house, house_cards)]
    settled = []
    for area in house.areas:
        views.append(_room(house, area, room_cards.get(area["id"], [])))
        if house.other_scenes(area):
            views.append(_looks(house, area))
        cards = room_settings.get(area["id"], [])
        if cards or health_cards(house, area):
            views.append(_settings(house, area, cards))
            settled.append(area)
        for page in house.nav_pages(area):
            views.append(_group(house, page))
    if house_settings or settled:
        views.append(_house_settings(house, house_settings, settled))
    return {"title": house.labels.ui.home, "views": views}
