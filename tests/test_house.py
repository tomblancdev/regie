import pytest

from regie.errors import HouseError
from regie.house import load_house


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
        "living_lamp",
    ]
    assert [g["number"] for g in c["groups"]] == [1, 2, 3, 4, 5]


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


def test_unknown_pack_lists_the_known_ones(house_with):
    with pytest.raises(
        HouseError,
        match=r"unknown pack 'voice' — product packs: fx, lighting, modes, notify, scenarios, "
        r"scenes, signals; house packs \(packs\): chalet",
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
