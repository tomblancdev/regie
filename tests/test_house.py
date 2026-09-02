import pytest

from regie.errors import HouseError
from regie.house import load_house, zigbee_group_id


def test_witness_loads_with_one_of_every_kind(witness):
    kinds = set(witness.by_kind())
    assert kinds == witness.known_kinds, "the witness carries one thing of every known kind"
    assert len(witness.areas) == 5
    assert [p.name for p in witness.packs] == [
        "modes",
        "signals",
        "scenes",
        "fx",
        "notify",
        "scenarios",
        "lighting",
        "matter",
        "chalet",
    ]
    assert witness.packs[-1].origin == "house"
    assert witness.labels.lang == "fr" and witness.labels.found


def test_the_only_warning_is_the_unpaired_lamp(witness):
    assert witness.warnings == [
        "bedroom_b_lamp: via zigbee, no ieee — not paired yet (the walk fills it in)"
    ]


def test_entities_derive_from_kind_and_id(witness):
    assert witness.entity(witness.thing("living_ceiling")) == "light.living_ceiling"
    assert witness.entity(witness.thing("kitchen_plug")) == "switch.kitchen_plug"
    assert witness.entity(witness.thing("hall_motion")) == "binary_sensor.hall_motion"
    assert witness.entity(witness.thing("living_remote")) is None
    assert witness.entity({"id": "x", "kind": "light", "entity": "light.custom"}) == "light.custom"


def test_coordinator_resolves_from_its_thing_and_groups_by_room(witness):
    (c,) = witness.coordinators()
    assert (c["host"], c["port"], c["adapter"], c["base_topic"]) == (
        "192.0.2.10",
        6638,
        "zstack",
        "zigbee2mqtt",
    )
    assert "bedroom_b_lamp" not in [t["id"] for t in c["things"]], "no ieee, not on the radio yet"
    groups = {g["area"]["id"]: [t["id"] for t in g["things"]] for g in c["groups"]}
    assert groups["living"] == [
        "living_ceiling",
        "living_ceiling_2",
        "living_ceiling_3",
        "living_floor_lamp",
    ]
    # the numbers are DERIVED from the rooms' ids, never counted: they live in
    # the bulbs' own group tables, so a room gaining its first light may not
    # renumber the rest of the flat
    assert [g["number"] for g in c["groups"]] == [
        zigbee_group_id(g["area"]["id"]) for g in c["groups"]
    ]
    assert zigbee_group_id("living") == zigbee_group_id("living") != zigbee_group_id("kitchen")
    assert all(1 <= n <= 65534 for n in (zigbee_group_id(x) for x in ("a", "b", "living")))


def test_mqtt_users_and_secret_names(witness):
    users = {u["name"]: u["topics"] for u in witness.mqtt_users()}
    assert users["home"] == ["#"]
    assert users["zigbee2mqtt_main"] == ["zigbee2mqtt/#", "homeassistant/#"]
    assert users["kitchen_energy"] == ["kitchen_energy/#", "homeassistant/+/kitchen_energy/#"]
    assert set(witness.secret_names()) == {
        "owner_password",
        "backup_password",
        "mqtt_password_home",
        "mqtt_password_zigbee2mqtt_main",
        "mqtt_password_kitchen_energy",
        "zigbee_main_network_key",
        "zigbee_main_pan_id",
        "zigbee_main_ext_pan_id",
        "oidc_client_secret",
    }


def test_pins_merge_house_over_profile(witness, house_with):
    assert witness.pins()["home_assistant"] == witness.profile.pins["home_assistant"]
    pinned = load_house(
        house_with(lambda d: d.setdefault("pins", {}).update({"home_assistant": "2030.1.0"}))
    )
    assert pinned.pins()["home_assistant"] == "2030.1.0"
    assert pinned.pins()["mosquitto"] == witness.profile.pins["mosquitto"]


@pytest.mark.parametrize(
    "mutate, expected",
    [
        (
            lambda d: d["things"].append(dict(d["things"][1])),
            "thing ids used twice: living_ceiling",
        ),
        (lambda d: d["things"][1].update(area="attic"), "area 'attic' does not exist"),
        (lambda d: d["things"][3].update(bind=["nowhere"]), "bind target 'nowhere'"),
        (
            lambda d: d["zigbee"]["coordinators"][0].update(thing="ghost"),
            "thing 'ghost' does not exist",
        ),
        (lambda d: d["zigbee"]["coordinators"][0].pop("thing"), "neither a thing nor a host"),
        (lambda d: d.pop("zigbee"), r"zigbee thing\(s\) but no zigbee.coordinators"),
    ],
)
def test_cross_checks_name_the_fault(house_with, mutate, expected):
    with pytest.raises(HouseError, match=expected):
        load_house(house_with(mutate))


def test_schema_errors_name_the_path(house_with):
    with pytest.raises(HouseError, match=r"things/0/ieee"):
        load_house(house_with(lambda d: d["things"][0].update(ieee="not-an-address")))
    with pytest.raises(HouseError, match=r"things/0: Additional properties"):
        load_house(house_with(lambda d: d["things"][0].update(colour="blue")))


def test_a_hardware_address_is_six_bytes_or_a_thread_eui64(house_with):
    """A Matter node's diagnostics report the address it speaks with, and on
    THREAD that is an eight-byte EUI-64 — `pair --matter` reads it back, and it
    is the only key most of those things offer (five of the six IKEA things
    walked in 2026-09 report no serial at all). Six bytes stays right for Wi-Fi
    and Ethernet; anything else is still a fault, lowercase included."""
    load_house(house_with(lambda d: d["things"][0].update(mac="98:17:3c:f3:ca:fe")))
    load_house(house_with(lambda d: d["things"][0].update(mac="ca:41:2e:31:5c:3f:80:f5")))
    for bad in ("ca:41:2e:31:5c:3f:80", "ca:41:2e:31:5c:3f:80:f5:11", "CA:41:2E:31:5C:3F:80:F5"):
        with pytest.raises(HouseError, match=r"things/0/mac"):
            load_house(house_with(lambda d, b=bad: d["things"][0].update(mac=b)))


def test_unknown_pack_lists_the_known_ones(house_with):
    with pytest.raises(
        HouseError,
        match=r"unknown pack 'voice' — product packs: fx, lighting, matter, modes, notify, "
        r"scenarios, scenes, signals; house packs \(packs\): chalet",
    ):
        load_house(house_with(lambda d: d.update(packs=["voice"])))


def test_unknown_profile_lists_the_known_ones(house_with):
    with pytest.raises(HouseError, match="unknown profile 'pi' — known: ct"):
        load_house(house_with(lambda d: d.update(profile="pi")))


def test_other_schema_versions_are_refused_with_a_hint(house_with):
    with pytest.raises(HouseError, match="schema 0 — `regie migrate`"):
        load_house(house_with(lambda d: d.update(schema=0)))
    with pytest.raises(HouseError, match="schema 2 — this engine writes schema 1"):
        load_house(house_with(lambda d: d.update(schema=2)))


def test_unknown_kind_and_via_are_warnings_not_errors(house_with):
    h = load_house(
        house_with(
            lambda d: d["things"].append(
                {"id": "x", "area": "hall", "kind": "robot", "via": "carrier_pigeon"}
            )
        )
    )
    assert any("kind 'robot'" in w for w in h.warnings)
    assert any("via 'carrier_pigeon'" in w for w in h.warnings)
    assert h.labels.kind("robot") == "robot"


def test_a_house_pack_may_not_shadow_a_product_pack(house_with, tmp_path):
    path = house_with(lambda d: None)
    (path.parent / "packs" / "lighting").mkdir()
    (path.parent / "packs" / "lighting" / "pack.yml").write_text("name: lighting\n")
    with pytest.raises(HouseError, match="may not wear a product pack's name: lighting"):
        load_house(path)


def test_pack_fragment_constrains_options(house_with):
    with pytest.raises(HouseError, match=r"things/\d+/options/off_after"):
        load_house(
            house_with(
                lambda d: next(t for t in d["things"] if t["id"] == "hall_motion")[
                    "options"
                ].update(off_after="five minutes")
            )
        )


def test_unknown_language_falls_back_to_english_with_a_warning(house_with):
    h = load_house(house_with(lambda d: d["house"].update(lang="xx")))
    assert not h.labels.found and h.labels.kind("light") == "Light"
    assert any("no labels for lang 'xx'" in w for w in h.warnings)


def test_a_light_may_not_wear_its_roles_name(house_with):
    def add(d):
        d["things"].append(
            {"id": "hall_main", "area": "hall", "kind": "light", "via": "matter", "role": "main"}
        )

    with pytest.raises(HouseError, match=r"hall_main: a light may not wear its role's name"):
        load_house(house_with(add))


def test_daylight_first_defaults_cover_every_period(witness):
    b = next(a for a in witness.areas if a["id"] == "bedroom_b")
    table = witness.defaults_of(b)
    assert set(table) == {"morning", "day", "evening", "night"}
    assert all(row == {"dark": "soft", "dim": "soft", "bright": "soft"} for row in table.values())


def test_a_period_key_overrides_the_daylight_base(house_with):
    # the hall's defaults live in rooms/hall.yml (include: the file's keys
    # win); a PARTIAL period map cannot ride the settings panel, so it is
    # turned off for this house
    path = house_with(lambda d: d.update(controls={"panel": False}))
    room = path.parent / "rooms" / "hall.yml"
    room.write_text(
        room.read_text(encoding="utf-8").replace(
            "defaults: { dark: dim, dim: dim, bright: dim }   "
            "# daylight-first (H34): always its one look",
            "defaults: { dark: dim, dim: dim, bright: dim, night: { dark: dim } }",
        ),
        encoding="utf-8",
    )
    house = load_house(path)
    hall = next(a for a in house.areas if a["id"] == "hall")
    table = house.defaults_of(hall)
    assert table["day"] == {"dark": "dim", "dim": "dim", "bright": "dim"}
    # night's partial map rides the base for what it does not say
    assert table["night"] == {"dark": "dim", "dim": "dim", "bright": "dim"}


def test_a_default_that_lights_nothing_is_refused(house_with):
    # the hall's defaults live in rooms/hall.yml (include: the file's keys win)
    path = house_with(lambda d: None)
    room = path.parent / "rooms" / "hall.yml"
    room.write_text(
        room.read_text(encoding="utf-8").replace(
            "defaults: { dark: dim, dim: dim, bright: dim }   "
            "# daylight-first (H34): always its one look",
            "defaults: { dark: off, dim: dim, bright: dim }",
        ),
        encoding="utf-8",
    )
    with pytest.raises(HouseError, match="hall: default morning/dark is 'off', which lights"):
        load_house(path)


def test_a_default_naming_an_all_off_scene_is_refused(house_with):
    path = house_with(lambda d: None)
    room = path.parent / "rooms" / "hall.yml"
    text = room.read_text(encoding="utf-8")
    text = text.replace(
        "defaults: { dark: dim, dim: dim, bright: dim }   "
        "# daylight-first (H34): always its one look",
        "defaults: { dark: blackout, dim: dim, bright: dim }",
    )
    text = text.replace(
        "  dim: { main: { brightness: 20, ct: warm } }",
        "  dim: { main: { brightness: 20, ct: warm } }\n  blackout: { main: off }",
    )
    room.write_text(text, encoding="utf-8")
    with pytest.raises(HouseError, match="is 'blackout', which lights nothing"):
        load_house(path)


def test_the_knobs_carry_the_panel_and_the_presence_switch(witness):
    knobs = {k["entity"]: k["value"] for k in witness.knobs()}
    assert knobs["input_boolean.presence_drives_mode"] == "on"
    assert knobs["input_select.living_look_dark"] == "evening"
    assert knobs["input_select.living_look_bright"] == "day"
    assert knobs["input_select.living_look_night"] == "night"
    assert knobs["input_select.living_look_morning"] == "sun"  # no override: follow the sun
    assert knobs["input_select.hall_look_night"] == "sun"
    # 4 rooms with a base × (3 daylights + 4 periods) + 4 times + mode + presence
    assert len(knobs) == 4 * 7 + 6


def test_the_panel_needs_a_daylight_base(house_with):
    path = house_with(lambda d: None)
    room = path.parent / "rooms" / "hall.yml"
    room.write_text(
        room.read_text(encoding="utf-8").replace(
            "defaults: { dark: dim, dim: dim, bright: dim }   "
            "# daylight-first (H34): always its one look",
            "defaults: { morning: dim, day: dim, evening: dim, night: dim }",
        ),
        encoding="utf-8",
    )
    with pytest.raises(HouseError, match="hall: the settings panel .* needs daylight-first"):
        load_house(path)


def test_the_panel_refuses_a_partial_period_map(house_with):
    path = house_with(lambda d: None)
    room = path.parent / "rooms" / "hall.yml"
    room.write_text(
        room.read_text(encoding="utf-8").replace(
            "defaults: { dark: dim, dim: dim, bright: dim }   "
            "# daylight-first (H34): always its one look",
            "defaults: { dark: dim, dim: dim, bright: dim, night: { dark: dim } }",
        ),
        encoding="utf-8",
    )
    with pytest.raises(
        HouseError, match="hall: the settings panel cannot carry a partial period map"
    ):
        load_house(path)
