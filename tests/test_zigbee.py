"""The mesh half, against a fake Zigbee2MQTT: the walk (a join window, an
interview, a proposed row) and the conductor (names, the room's group, the
bindings) — with a fake that MUTATES, so a second run proving `ok` proves
idempotence rather than asserting it."""

from contextlib import contextmanager

import pytest

from regie.apply import Conductor, apply, pair_zigbee, zigbee_bindable, zigbee_kind
from regie.errors import HouseError
from regie.house import zigbee_group_id

from .test_apply import (
    FakeHA,
    _door_answers,  # noqa: F401 — autouse: the witness's door answers 200
    states,
)


class FakeZ2M:
    """Zigbee2MQTT's frontend, as the engine uses it."""

    def __init__(self, devices=(), groups=(), events=(), online=True, declared=None):
        self.mesh = [dict(d) for d in devices]
        self.groups_ = [dict(g) for g in groups]
        # what groups.yaml declares: Zigbee2MQTT's SETTINGS know these
        # names, its runtime does not — the radio's group object is made
        # lazily, the first time the name is resolved (zigbee.js: "If
        # group does not exist, create it (since it's already in
        # configuration.yaml)"). A rendered group is therefore absent from
        # `groups` AND refused by `group/add`.
        self.declared = dict(declared or {})
        self.script = list(events)
        self.calls: list[tuple[str, dict]] = []
        self.published: list[tuple[str, dict]] = []
        self.windows: list[int] = []
        self.online = online
        self.opened = False
        self.info = {"version": "2.13.0"}

    # --- the connection ---
    def open(self, timeout=20):
        self.opened = True
        return self

    def close(self):
        self.opened = False

    def __enter__(self):
        return self.open()

    def __exit__(self, *_exc):
        self.close()

    # --- reading ---
    @property
    def devices(self):
        return self.mesh

    @property
    def groups(self):
        return self.groups_

    def device(self, ieee):
        return next((d for d in self.mesh if d["ieee_address"] == ieee), None)

    def by_name(self, name):
        return next((d for d in self.mesh if d.get("friendly_name") == name), None)

    def recv(self, timeout):
        return self.script.pop(0) if self.script else None

    # --- writing ---
    def publish(self, topic, payload):
        self.published.append((topic, payload))

    @contextmanager
    def join_window(self, seconds):
        self.windows.append(seconds)
        try:
            yield
        finally:
            self.windows.append(0)

    def group(self, key):
        return next(
            (g for g in self.groups_ if key in (g["friendly_name"], g["id"])),
            None,
        )

    def _materialise(self, key):
        """Resolving a declared group is what creates it on the radio."""
        number = next((n for n, room in self.declared.items() if room == key), None)
        if number is None:
            return None
        self.groups_.append({"id": number, "friendly_name": key, "members": []})
        return self.groups_[-1]

    def request(self, name, payload=None, timeout=30):
        payload = payload or {}
        self.calls.append((name, payload))
        if name == "device/rename":
            self.by_name(payload["from"])["friendly_name"] = payload["to"]
        elif name == "group/add":
            if payload["friendly_name"] in self.declared.values() or self.group(
                payload["friendly_name"]
            ):
                raise HouseError(
                    "zigbee2mqtt group/add: friendly_name "
                    f"'{payload['friendly_name']}' is already in use"
                )
            self.groups_.append(
                {"id": payload["id"], "friendly_name": payload["friendly_name"], "members": []}
            )
        elif name == "group/rename":
            self.group(payload["from"])["friendly_name"] = payload["to"]
        elif name in ("group/members/add", "group/members/remove"):
            group = self.group(payload["group"]) or self._materialise(payload["group"])
            dev = self.by_name(payload["device"]) or self.device(payload["device"])
            member = {"ieee_address": dev["ieee_address"], "endpoint": 1}
            if name.endswith("add"):
                group["members"].append(member)
            else:
                group["members"] = [
                    m for m in group["members"] if m["ieee_address"] != dev["ieee_address"]
                ]
        elif name in ("device/bind", "device/unbind"):
            source = self.by_name(payload["from"])
            group = self.group(payload["to"])
            target = (
                {"type": "group", "id": group["id"]}
                if group
                else {
                    "type": "endpoint",
                    "ieee_address": self.by_name(payload["to"])["ieee_address"],
                    "endpoint": 1,
                }
            )
            ep = source.setdefault("endpoints", {}).setdefault("1", {})
            binds = ep.setdefault("bindings", [])
            if name == "device/bind":
                binds.append({"cluster": "genOnOff", "target": target})
                return {"clusters": ["genOnOff"], "failed": []}
            ep["bindings"] = [b for b in binds if b["target"] != target]
        elif name == "permit_join":
            self.windows.append(payload.get("time"))
        return {}


def mesh_of(house, **kwargs):
    """A mesh holding the house's Zigbee things, each still under its address
    — a flat that has just been walked and not yet converged."""
    (c,) = house.coordinators()
    devices = [
        {
            "ieee_address": t["ieee"],
            "friendly_name": t["ieee"],
            "type": "Router" if t["kind"] == "light" else "EndDevice",
            "definition": {"vendor": t.get("vendor", "?"), "model": t.get("model", "?")},
            "endpoints": {"1": {"clusters": {"input": [], "output": ["genOnOff"]}, "bindings": []}},
        }
        for t in c["things"]
    ]
    devices.append({"ieee_address": "0x00124b0000000000", "type": "Coordinator"})
    kwargs.setdefault("declared", {g["number"]: g["area"]["id"] for g in c["groups"]})
    return FakeZ2M(devices=devices, **kwargs)


@pytest.fixture
def furnished(monkeypatch):
    """The conductor's radio, faked; returns the mesh it will meet."""

    def use(z2m):
        monkeypatch.setattr(Conductor, "z2m_of", lambda self, coordinator: z2m)
        return z2m

    return use


def test_the_mesh_is_made_to_match_the_rows(witness, secrets, tmp_path, furnished):
    z = furnished(mesh_of(witness))
    steps = apply(witness, secrets, tmp_path, FakeHA(), check=False)
    st = states(steps)
    # every thing wears its row's id — one name for the topic, the entity and
    # the file (decision H8)
    assert st["zigbee main living_ceiling"] == "changed"
    assert z.by_name("living_ceiling")["ieee_address"] == "0x000d6ffffe000001"
    assert z.by_name("hall_motion") and z.by_name("kitchen_valve")
    # one group per room WITH Zigbee lights, numbered from the room's id, and
    # holding exactly its lights
    living = z.group("living")
    assert living["id"] == zigbee_group_id("living")
    assert {m["ieee_address"] for m in living["members"]} == {
        "0x000d6ffffe000001",
        "0x000d6ffffe000005",
        "0x000d6ffffe000006",
        "0x000d6ffffe000002",
    }
    assert z.group("bedroom_a") and not z.group("bathroom"), "no Zigbee light, no group"
    # the bindings the rows name: a remote to its room's GROUP, a wall control
    # to one bulb — the half that works with the brain down
    remote = z.by_name("living_remote")["endpoints"]["1"]["bindings"]
    assert remote == [{"cluster": "genOnOff", "target": {"type": "group", "id": living["id"]}}]
    wall = z.by_name("bedroom_a_wall")["endpoints"]["1"]["bindings"]
    assert wall[0]["target"] == {
        "type": "endpoint",
        "ieee_address": "0x000d6ffffe000030",
        "endpoint": 1,
    }
    # and it settles: a second run touches nothing in the mesh
    before = len(z.calls)
    again = apply(witness, secrets, tmp_path, FakeHA(), check=False)
    assert len(z.calls) == before
    assert {s.state for s in again if s.name.startswith("zigbee ")} == {"ok"}


def test_a_rendered_group_is_never_re_added(witness, secrets, tmp_path, furnished):
    """The render declares the room's group in groups.yaml, so Zigbee2MQTT's
    SETTINGS already carry the name while its runtime does not: `group/add`
    would be refused ("friendly_name '<room>' is already in use") and the
    converge would die there. The radio's group object is made lazily by the
    first member — found live at W1's walk, 2026-09-01, with seven bulbs in
    the mesh and the converge failing on Le QG's group."""
    z = furnished(mesh_of(witness))
    assert z.groups == [], "a declared group is not on the bridge until it has a member"
    steps = apply(witness, secrets, tmp_path, FakeHA(), check=False)
    assert not [c for c in z.calls if c[0] == "group/add"], "group/add is Zigbee2MQTT's to refuse"
    living = z.group("living")
    assert living["id"] == zigbee_group_id("living")
    assert {m["ieee_address"] for m in living["members"]}, "its members made it real"
    assert states(steps)["zigbee main group living"] == "changed"


def test_check_plans_the_mesh_and_touches_nothing(witness, secrets, tmp_path, furnished):
    ha = FakeHA()
    furnished(mesh_of(witness))
    apply(witness, secrets, tmp_path, ha, check=False)  # a brain that exists
    z = furnished(mesh_of(witness))  # a mesh walked and not converged
    steps = apply(witness, secrets, tmp_path, ha, check=True)
    assert z.calls == []
    assert states(steps)["zigbee main living_ceiling"] == "would"


def test_a_stranger_in_the_mesh_is_reported_never_removed(witness, secrets, tmp_path, furnished):
    z = mesh_of(witness)
    z.mesh.append(
        {
            "ieee_address": "0x000d6ffffe0000ff",
            "friendly_name": "0x000d6ffffe0000ff",
            "type": "EndDevice",
            "definition": {"vendor": "IKEA", "model": "E2213"},
            "endpoints": {},
        }
    )
    furnished(z)
    steps = apply(witness, secrets, tmp_path, FakeHA(), check=False)
    stranger = next(s for s in steps if s.name == "zigbee main 0x000d6ffffe0000ff")
    assert stranger.state == "hand" and "paired, no row" in stranger.detail
    assert not any(name.startswith("device/remove") for name, _ in z.calls)


def test_a_binding_the_house_does_not_name_is_left_when_it_is_not_ours(
    witness, secrets, tmp_path, furnished
):
    z = mesh_of(witness)
    vendor = {"cluster": "genOnOff", "target": {"type": "group", "id": 21658}}
    z.by_name("0x000d6ffffe000003")["endpoints"]["1"]["bindings"].append(vendor)
    furnished(z)
    steps = apply(witness, secrets, tmp_path, FakeHA(), check=False)
    left = [s for s in steps if s.name == "zigbee main bind living_remote" and s.state == "ok"]
    assert left and "left alone" in left[0].detail
    assert vendor in z.by_name("living_remote")["endpoints"]["1"]["bindings"]
    assert not any(name == "device/unbind" for name, _ in z.calls)


def test_a_binding_of_ours_the_row_dropped_is_unbound(witness, secrets, tmp_path, furnished):
    z = mesh_of(witness)
    # bound to the hall's ceiling, which no row asks for any more
    z.by_name("0x000d6ffffe000003")["endpoints"]["1"]["bindings"].append(
        {
            "cluster": "genOnOff",
            "target": {"type": "endpoint", "ieee_address": "0x000d6ffffe000010"},
        }
    )
    furnished(z)
    apply(witness, secrets, tmp_path, FakeHA(), check=False)
    assert ("device/unbind", {"from": "living_remote", "to": "hall_ceiling"}) in z.calls


def test_a_radio_that_does_not_answer_is_waiting_not_a_fault(
    witness, secrets, tmp_path, monkeypatch
):
    def refuse(self, coordinator):
        class Shut(FakeZ2M):
            def open(self, timeout=20):
                raise HouseError("ws://127.0.0.1:8080/api: no Zigbee2MQTT at that door")

        return Shut()

    monkeypatch.setattr(Conductor, "z2m_of", refuse)
    steps = apply(witness, secrets, tmp_path, FakeHA(), check=False)
    radio = next(s for s in steps if s.name == "zigbee main")
    assert radio.state == "waiting" and "no Zigbee2MQTT" in radio.detail


# --- the walk ---------------------------------------------------------------
def joined(ieee, vendor="IKEA", model="LED1949C5", exposes=None, description="a bulb"):
    return [
        ("bridge/event", {"type": "device_joined", "data": {"ieee_address": ieee}}),
        (
            "bridge/event",
            {
                "type": "device_interview",
                "data": {
                    "ieee_address": ieee,
                    "status": "successful",
                    "definition": {
                        "vendor": vendor,
                        "model": model,
                        "description": description,
                        "exposes": exposes if exposes is not None else [{"type": "light"}],
                    },
                },
            },
        ),
    ]


def walked(monkeypatch, ieee, events, **device):
    z = FakeZ2M(events=events)
    z.mesh.append(
        {
            "ieee_address": ieee,
            "friendly_name": ieee,
            "type": device.pop("type", "Router"),
            "supported": True,
            "endpoints": {"1": {"clusters": {"input": [], "output": []}, "bindings": []}},
            **device,
        }
    )
    monkeypatch.setattr("regie.apply.Z2M", lambda url: z)
    return z


def test_the_walk_reads_the_kind_from_the_interview(witness, secrets, tmp_path, monkeypatch):
    ieee = "0x000d6ffffe0000aa"
    definition = {
        "vendor": "IKEA",
        "model": "LED1949C5",
        "description": "TRADFRI bulb",
        "exposes": [{"type": "light"}],
    }
    z = walked(
        monkeypatch,
        ieee,
        joined(ieee),
        definition=definition,
        power_source="Mains (single phase)",
    )
    row = pair_zigbee(
        witness, secrets, tmp_path, FakeHA(), room="bedroom_b", role="main", seconds=30
    )
    found = row.pop("_found")
    assert row == {
        "id": "bedroom_b_main_1",
        "area": "bedroom_b",
        "kind": "light",
        "via": "zigbee",
        "vendor": "IKEA",
        "model": "LED1949C5",
        "ieee": ieee,
        "role": "main",
    }
    assert found["description"] == "TRADFRI bulb" and found["power"] == "Mains (single phase)"
    # the window was opened and CLOSED again, and the bulb said which one it is
    assert z.windows[0] == 30 and z.windows[-1] == 0
    assert [t for t, _ in z.published] == [f"{ieee}/set", f"{ieee}/set"]


def test_a_control_is_proposed_bound_to_its_room(witness, secrets, tmp_path, monkeypatch):
    ieee = "0x000d6ffffe0000bb"
    definition = {
        "vendor": "IKEA",
        "model": "E2001",
        "description": "STYRBAR remote",
        "exposes": [{"type": "enum", "name": "action", "values": ["on", "off"]}],
    }
    walked(
        monkeypatch,
        ieee,
        joined(ieee, exposes=definition["exposes"]),
        definition=definition,
        type="EndDevice",
        endpoints={"1": {"clusters": {"input": [], "output": ["genOnOff", "genLevelCtrl"]}}},
    )
    row = pair_zigbee(witness, secrets, tmp_path, FakeHA(), room="hall", seconds=5)
    assert row["kind"] == "remote" and row["bind"] == ["hall"]
    assert row["id"] == "hall_remote_1"


def test_a_thing_the_house_already_names_does_not_end_the_walk(
    witness, secrets, tmp_path, monkeypatch
):
    known = "0x000d6ffffe000001"  # living_ceiling, already a row
    fresh = "0x000d6ffffe0000cc"
    events = joined(known) + joined(fresh)
    z = walked(monkeypatch, fresh, events, definition={"exposes": [{"type": "light"}]})
    lines = []
    row = pair_zigbee(
        witness, secrets, tmp_path, FakeHA(), room="hall", seconds=5, say=lines.append
    )
    assert row["ieee"] == fresh
    assert any("already names it" in line for line in lines)
    assert z.windows[-1] == 0


def test_a_walk_that_finds_nothing_says_so_and_closes_the_window(
    witness, secrets, tmp_path, monkeypatch
):
    z = walked(monkeypatch, "0x000d6ffffe0000dd", [])
    with pytest.raises(HouseError, match="nothing new joined"):
        pair_zigbee(witness, secrets, tmp_path, FakeHA(), room="hall", seconds=1)
    assert z.windows[-1] == 0


def test_an_interrupted_walk_is_adopted_without_a_new_join(witness, secrets, tmp_path, monkeypatch):
    ieee = "0x000d6ffffe0000ee"
    z = walked(
        monkeypatch,
        ieee,
        [],
        definition={
            "vendor": "Aqara",
            "model": "RTCGQ11LM",
            "exposes": [{"type": "binary", "name": "occupancy"}],
        },
        type="EndDevice",
    )
    row = pair_zigbee(witness, secrets, tmp_path, FakeHA(), room="hall", adopt=ieee)
    assert row["kind"] == "motion" and row["id"] == "hall_motion_2"
    assert z.windows == [], "no window opens for a thing already in the mesh"


def test_the_kind_comes_from_the_capability_list():
    assert zigbee_kind([{"type": "light"}, {"type": "numeric", "name": "power"}]) == "light"
    assert zigbee_kind([{"type": "switch", "features": [{"name": "state"}]}]) == "plug"
    assert zigbee_kind([{"type": "binary", "name": "occupancy"}, {"name": "battery"}]) == "motion"
    assert zigbee_kind([{"type": "binary", "name": "contact"}]) == "door"
    assert zigbee_kind([{"type": "enum", "name": "action"}]) == "remote"
    assert zigbee_kind([{"type": "numeric", "name": "temperature"}]) == "sensor"
    assert zigbee_kind([{"type": "cover"}]) == "cover"
    assert zigbee_kind([{"type": "text", "name": "mystery"}]) == "device"


def test_a_thing_that_sends_commands_can_be_bound():
    assert zigbee_bindable({"endpoints": {"1": {"clusters": {"output": ["genOnOff"]}}}})
    assert not zigbee_bindable({"endpoints": {"1": {"clusters": {"output": ["genBasic"]}}}})
    assert not zigbee_bindable({})


def test_two_rooms_that_derive_the_same_number_are_refused(house_with, monkeypatch):
    """The one way the derivation can bite: two rooms on one number would
    share a group - one switch, two rooms, in the bulbs' own tables where
    nothing in the file shows it. `check` refuses the house instead."""
    from regie import house as house_module
    from regie.house import load_house

    monkeypatch.setattr(house_module, "zigbee_group_id", lambda area_id: 42)
    with pytest.raises(HouseError, match="derive the same Zigbee group number"):
        load_house(house_with(lambda d: None))
