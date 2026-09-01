"""The Thread half: the border router introduced to Home Assistant, and the
guard that decides whether it may be.

The guard is the reason this file exists. Home Assistant's `otbr` flow reads
the router's active dataset when the entry is made and, on a router holding
none, it MINTS a network of its own — a random PAN id and a key nobody wrote
down. Every test below is one shape of "may the brain be pointed at this
box", and the answer is only ever yes while the box is already holding the
house's network."""

import pytest

from regie.apply import Conductor, apply
from regie.errors import HouseError
from regie.house import load_house
from regie.otbr import Otbr

from .test_apply import (
    FakeHA,
    _door_answers,  # noqa: F401 — autouse: the witness's door answers 200
    states,
)


class FakeOtbr:
    """A border router at its REST door, as the engine uses it: one read."""

    def __init__(self, network=None, silent=False):
        self.network = network
        self.silent = silent
        self.reads = 0

    def network_name(self):
        self.reads += 1
        if self.silent:
            raise HouseError("http://192.0.2.10:8080: no border router at that door (timed out)")
        return self.network


@pytest.fixture
def router(monkeypatch):
    """Replaces the suite's default router (conftest) with one of our own."""

    def use(**kwargs):
        box = FakeOtbr(**kwargs)
        monkeypatch.setattr(Conductor, "otbr_of", lambda self, border_router: box)
        return box

    return use


# --- the entry ---------------------------------------------------------------


def test_the_border_router_gets_its_entry_and_keeps_it(witness, secrets, tmp_path, router):
    box = router(network="maison-temoin")
    ha = FakeHA()
    st = states(apply(witness, secrets, tmp_path, ha, check=False))
    assert st["thread main"] == "changed"
    assert ha.entries["otbr"][0]["_data"] == {"url": "http://192.0.2.10:8080"}
    # the address is the THING's, never typed twice: coordinator_main's host
    assert box.reads == 1
    again = states(apply(witness, secrets, tmp_path, ha, check=False))
    assert again["thread main"] == "ok"
    assert len(ha.entries["otbr"]) == 1


def test_check_reports_the_entry_it_would_make_and_makes_none(witness, secrets, tmp_path, router):
    # the brain is furnished first (a check on a bare brain stops at onboarding),
    # with the router still holding the demo network so no entry is made
    box = router(network="OpenThread-ESP")
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    box.network = "maison-temoin"
    steps = apply(witness, secrets, tmp_path, ha, check=True)
    step = next(s for s in steps if s.name == "thread main")
    assert step.state == "would" and "http://192.0.2.10:8080" in step.detail
    assert not ha.entries.get("otbr") and not ha.flows


# --- the guard ---------------------------------------------------------------


def test_a_router_holding_no_network_is_never_introduced(witness, secrets, tmp_path, router):
    """The sharp one: an empty router is exactly what makes Home Assistant
    mint a network of its own. The flow is never started."""
    router(network=None)
    ha = FakeHA()
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    step = next(s for s in steps if s.name == "thread main")
    assert step.state == "waiting"
    assert "no network at all" in step.detail and "MINT" in step.detail
    assert not ha.entries.get("otbr") and not ha.flows  # not even a flow was opened


def test_a_router_holding_someone_elses_network_is_never_introduced(
    witness, secrets, tmp_path, router
):
    """A factory-reset SLZB forms OpenThread's PUBLISHED example network —
    same name, same key, on every box of that firmware in the world."""
    router(network="OpenThread-ESP")
    ha = FakeHA()
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    step = next(s for s in steps if s.name == "thread main")
    assert step.state == "waiting"
    assert "'OpenThread-ESP'" in step.detail and "'maison-temoin'" in step.detail
    assert not ha.entries.get("otbr") and not ha.flows


def test_a_silent_router_waits_and_does_not_fail_the_fleet(witness, secrets, tmp_path, router):
    router(silent=True)
    ha = FakeHA()
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    step = next(s for s in steps if s.name == "thread main")
    assert step.state == "waiting" and "no border router at that door" in step.detail
    # the rest of the run happened: a box on the lane is not the fleet's health
    assert states(steps)["entry matter"] == "changed"


def test_a_rest_api_home_assistant_cannot_reach_waits(witness, secrets, tmp_path, router):
    """The box answered US and not Home Assistant — a door, not a network."""
    router(network="maison-temoin")
    ha = FakeHA()
    ha.otbr_down = True
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    step = next(s for s in steps if s.name == "thread main")
    assert step.state == "waiting" and "did not answer Home Assistant" in step.detail
    assert not ha.entries.get("otbr") and not ha.flows


def test_a_house_with_no_thread_block_reads_no_router(house_with, secrets, tmp_path, router):
    box = router(network="maison-temoin")
    house = load_house(house_with(lambda d: d.pop("thread")))
    steps = apply(house, secrets, tmp_path, FakeHA(), check=False)
    assert not [s for s in steps if s.name.startswith("thread ")]
    assert box.reads == 0


# --- what `check` refuses -----------------------------------------------------


def test_thread_and_zigbee_may_not_share_a_channel_on_one_box(house_with):
    """Two 802.15.4 meshes, two aerials centimetres apart, one channel: things
    drop and nothing logs a cause. Home Assistant's own collision check only
    fires for ZHA behind a multiprotocol add-on — never for this house."""
    with pytest.raises(HouseError) as exc:
        load_house(house_with(lambda d: d["thread"].update({"channel": 25})))
    assert "channel 25 is the Zigbee channel" in str(exc.value)
    assert "coordinator_main" in str(exc.value)


def test_two_radios_in_two_boxes_may_share_a_channel(house_with):
    """The guard is about ONE box: a border router somewhere else in the flat
    is a different radio in a different place, and 25 is 25 for both."""

    def separate(d):
        d["things"].append(
            {
                "id": "attic_otbr",
                "area": "bedroom_a",
                "kind": "coordinator",
                "via": "lan",
                "host": "192.0.2.11",
            }
        )
        d["thread"].update(
            {"channel": 25, "border_routers": [{"id": "main", "thing": "attic_otbr"}]}
        )

    house = load_house(house_with(separate))
    assert house.border_routers()[0]["url"] == "http://192.0.2.11:8080"


def test_a_border_router_needs_the_matter_pack_behind_it(house_with):
    with pytest.raises(HouseError) as exc:
        load_house(house_with(lambda d: d["packs"].remove("matter")))
    assert "reaches the brain through the Matter fabric" in str(exc.value)


def test_a_border_router_on_a_thing_that_does_not_exist_is_refused(house_with):
    with pytest.raises(HouseError) as exc:
        load_house(
            house_with(lambda d: d["thread"]["border_routers"][0].update({"thing": "ghost"}))
        )
    assert "border router main: thing 'ghost' does not exist" in str(exc.value)


# --- the reader ---------------------------------------------------------------


def test_the_reader_takes_the_name_in_either_spelling(monkeypatch):
    """SLZB-OS answers PascalCase; the same REST API upstream answers
    camelCase since Sept 2025. Home Assistant's client normalises between the
    two — so this one accepts both rather than pinning today's box."""
    for body in ({"NetworkName": "maison-temoin"}, {"networkName": "maison-temoin"}):
        monkeypatch.setattr(Otbr, "_get", lambda self, path, b=body: b)
        assert Otbr("http://192.0.2.10:8080").network_name() == "maison-temoin"


def test_an_unknown_path_answering_200_reads_as_no_network(monkeypatch):
    """The trap this firmware sets: an unknown path answers 200 with a body
    that says 404. A status code proves nothing — the name is read out of the
    body, and a body with no name is no network."""
    monkeypatch.setattr(
        Otbr, "_get", lambda self, path: {"ErrorCode": "404", "ErrorMessage": "404 Not Found"}
    )
    assert Otbr("http://192.0.2.10:8080").network_name() is None
