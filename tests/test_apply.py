"""The conductor against a fake Home Assistant: the few REST and websocket
calls it makes, answered from an in-memory state that behaves like the
real thing on the points that matter (onboarding refuses twice, registries
key on aliases, a flow walks its form, the backup config compares)."""

from contextlib import contextmanager

import pytest

from regie.apply import Conductor, apply, summary
from regie.errors import HouseError
from regie.ha import HomeAssistant


class FakeWs:
    def __init__(self, ha):
        self.ha = ha

    def call(self, type_, **payload):
        return self.ha.ws_call(type_, payload)


class FakeHA(HomeAssistant):
    def __init__(self):
        super().__init__("http://127.0.0.1:8123")
        self.onboarded = {
            "user": False,
            "core_config": False,
            "analytics": False,
            "integration": False,
        }
        self.users: dict[str, str] = {}
        self.codes: dict[str, str] = {}
        self.tokens: dict[str, str] = {}  # access token -> kind
        self.llat: list[dict] = []
        self.floors: list[dict] = []
        self.areas: list[dict] = []
        self.entries: dict[str, list] = {}
        self.flows: dict[str, dict] = {}
        self.backup_cfg = {
            "agents": {},
            "automatic_backups_configured": False,
            "create_backup": {"agent_ids": [], "password": None},
            "retention": {"copies": None, "days": None},
            "schedule": {"recurrence": "never", "time": None, "days": []},
        }
        self.n = 0
        self.log: list[str] = []

    # --- REST ---
    def _authed(self):
        return self.token in self.tokens

    def get(self, path, auth=True):
        self.log.append(f"GET {path}")
        if path == "/api/onboarding":
            return 200, [{"step": k, "done": v} for k, v in self.onboarded.items()]
        if auth and not self._authed():
            return 401, {"message": "Unauthorized"}
        if path == "/api/":
            return 200, {"message": "API running."}
        if path.startswith("/api/config/config_entries/entry?domain="):
            return 200, self.entries.get(path.split("=")[1], [])
        raise AssertionError(path)

    def post(self, path, body, auth=True):
        self.log.append(f"POST {path}")
        if path == "/api/onboarding/users":
            if self.onboarded["user"]:
                return 403, {"message": "User step already done"}
            self.users[body["username"]] = body["password"]
            self.onboarded["user"] = True
            self.codes["code1"] = body["client_id"]
            return 200, {"auth_code": "code1"}
        if path == "/auth/login_flow":
            return 200, {"flow_id": "lf1", "step_id": "init"}
        if path == "/auth/login_flow/lf1":
            if self.users.get(body["username"]) != body["password"]:
                return 200, {"type": "form", "errors": {"base": "invalid_auth"}}
            self.codes["code2"] = body["client_id"]
            return 200, {"type": "create_entry", "result": "code2"}
        if auth and not self._authed():
            return 401, {"message": "Unauthorized"}
        if path.startswith("/api/onboarding/"):
            step = path.rsplit("/", 1)[1]
            if self.onboarded[step]:
                return 403, {"message": "already done"}
            self.onboarded[step] = True
            return 200, {} if step != "integration" else {"auth_code": "x"}
        if path == "/api/config/config_entries/flow":
            self.n += 1
            fid = f"flow{self.n}"
            self.flows[fid] = {"handler": body["handler"]}
            fields = ["broker", "port", "username", "password"]
            return 200, {
                "type": "form",
                "flow_id": fid,
                "step_id": "broker",
                # + a section of advanced options: a required key, even empty
                # (Home Assistant 2026.8's broker form, read live 2026-08-29)
                "data_schema": [{"name": f} for f in fields]
                + [{"name": "other_settings", "type": "expandable", "schema": []}],
            }
        if path.startswith("/api/config/config_entries/flow/"):
            fid = path.rsplit("/", 1)[1]
            domain = self.flows[fid]["handler"]
            if "other_settings" not in body:
                return 400, {"errors": {"other_settings": "required key not provided"}}
            if body.get("broker") != "127.0.0.1":
                return 200, {"type": "form", "flow_id": fid, "errors": {"base": "cannot_connect"}}
            self.entries.setdefault(domain, []).append({"domain": domain, "data": body})
            return 200, {"type": "create_entry", "flow_id": fid, "title": body["broker"]}
        raise AssertionError(path)

    def post_form(self, path, fields):
        assert path == "/auth/token" and fields["code"] in self.codes
        tok = f"access-{fields['code']}-{len(self.tokens)}"
        self.tokens[tok] = "session"
        return 200, {"access_token": tok, "refresh_token": "r", "expires_in": 1800}

    @contextmanager
    def ws(self):
        assert self._authed(), "websocket without a valid token"
        yield FakeWs(self)

    def ws_call(self, type_, payload):
        self.log.append(f"WS {type_}")
        if type_ == "auth/refresh_tokens":
            return list(self.llat)
        if type_ == "auth/long_lived_access_token":
            self.n += 1
            tok = f"llat-{payload['client_name']}-{self.n}"
            self.tokens[tok] = "llat"
            self.llat.append(
                {
                    "id": str(self.n),
                    "client_name": payload["client_name"],
                    "type": "long_lived_access_token",
                }
            )
            return tok
        if type_ == "auth/delete_refresh_token":
            self.llat = [t for t in self.llat if t["id"] != payload["refresh_token_id"]]
            return None
        if type_ == "config/floor_registry/list":
            return list(self.floors)
        if type_ == "config/floor_registry/create":
            self.n += 1
            f = {
                "floor_id": f"f{self.n}",
                "name": payload["name"],
                "aliases": payload["aliases"],
                "level": payload.get("level"),
            }
            self.floors.append(f)
            return f
        if type_ == "config/floor_registry/update":
            for f in self.floors:
                if f["floor_id"] == payload["floor_id"]:
                    f.update({k: v for k, v in payload.items() if k != "floor_id"})
                    return f
        if type_ == "config/area_registry/list":
            return list(self.areas)
        if type_ == "config/area_registry/create":
            self.n += 1
            a = {
                "area_id": payload["name"].lower().replace(" ", "_"),
                "name": payload["name"],
                "aliases": payload["aliases"],
                "floor_id": payload.get("floor_id"),
            }
            self.areas.append(a)
            return a
        if type_ == "config/area_registry/update":
            for a in self.areas:
                if a["area_id"] == payload["area_id"]:
                    a.update({k: v for k, v in payload.items() if k != "area_id"})
                    return a
        if type_ == "backup/config/info":
            return {"config": self.backup_cfg}
        if type_ == "backup/config/update":
            for k, v in payload.items():
                if isinstance(v, dict):
                    self.backup_cfg[k].update(v)
                else:
                    self.backup_cfg[k] = v
            return None
        raise AssertionError(type_)


def states(steps):
    return {s.name: s.state for s in steps}


def test_a_fresh_brain_is_onboarded_and_furnished(witness, secrets, tmp_path):
    ha = FakeHA()
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    st = states(steps)
    assert st["owner"] == "changed" and ha.users == {"gardien": "example-owner-password"}
    assert all(ha.onboarded.values())
    assert st["token regie"] == "changed" and st["token scraper"] == "changed"
    assert (tmp_path / ".regie/tokens/regie").read_text().startswith("llat-regie-")
    assert (tmp_path / ".regie/tokens/scraper").read_text().startswith("llat-regie:scraper-")
    assert (tmp_path / ".regie/tokens/regie").stat().st_mode & 0o777 == 0o600
    assert [f["name"] for f in ha.floors] == ["Rez-de-chaussée", "Étage"]
    assert {a["aliases"][0] for a in ha.areas} == {
        "hall",
        "living",
        "kitchen",
        "bedroom_a",
        "bedroom_b",
    }
    hall = next(a for a in ha.areas if a["aliases"] == ["hall"])
    assert hall["name"] == "Entrée" and hall["floor_id"] == ha.floors[0]["floor_id"]
    assert ha.entries["mqtt"][0]["data"]["username"] == "home"
    assert ha.backup_cfg["schedule"] == {"recurrence": "daily", "time": "04:00", "days": []}
    assert ha.backup_cfg["create_backup"]["password"] == "example-backup-password"
    assert summary(steps, False) == f"apply: {len(steps)} changed, 0 ok"

    again = apply(witness, secrets, tmp_path, ha, check=False)
    assert set(states(again).values()) == {"ok"}, states(again)
    assert summary(again, False) == f"apply: 0 changed, {len(again)} ok"


def test_the_token_lost_on_disk_is_minted_again_by_password(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    (tmp_path / ".regie/tokens/regie").unlink()
    before = len(ha.llat)
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert "POST /auth/login_flow" in ha.log
    assert states(steps)["token regie"] == "changed"
    assert len(ha.llat) == before  # the stale one deleted, a new one minted
    assert (tmp_path / ".regie/tokens/regie").is_file()


def test_a_wrong_owner_password_says_so(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    (tmp_path / ".regie/tokens/regie").unlink()
    with pytest.raises(HouseError, match="owner_password"):
        apply(witness, {**secrets, "owner_password": "nope"}, tmp_path, ha, check=False)


def test_check_on_a_fresh_brain_stops_at_the_owner(witness, secrets, tmp_path):
    ha = FakeHA()
    steps = apply(witness, secrets, tmp_path, ha, check=True)
    assert [s.state for s in steps] == ["would"] and not ha.users
    assert summary(steps, True) == "apply: 1 would change, 0 ok"


def test_check_on_a_furnished_brain_plans_a_relabel(witness, secrets, tmp_path, house_with):
    from regie.house import load_house

    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)

    def rename(d):
        d["areas"][0]["label"] = "Vestibule"

    house = load_house(house_with(rename))
    steps = apply(house, secrets, tmp_path, ha, check=True)
    st = states(steps)
    assert st["area hall"] == "would" and ha.areas[0]["name"] == "Entrée"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["area hall"] == "changed" and ha.areas[0]["name"] == "Vestibule"


def test_a_form_the_house_cannot_answer_is_a_fault(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    ha.entries.clear()
    c = Conductor(witness, secrets, tmp_path, ha)
    c.ha.token = next(iter(ha.tokens))
    with pytest.raises(HouseError, match="asks"):
        c.config_entry("mqtt", {"nothing": 1}, "x")


def test_missing_secrets_are_named(witness, tmp_path):
    with pytest.raises(HouseError, match="owner_password"):
        apply(witness, {}, tmp_path, FakeHA(), check=False)


def test_home_assistants_own_first_areas_are_adopted_by_name(witness, secrets, tmp_path):
    ha = FakeHA()
    # what a French first boot leaves behind: three areas, no alias
    for name in ("Salon", "Cuisine", "Chambre"):
        ha.areas.append({"area_id": name.lower(), "name": name, "aliases": [], "floor_id": None})
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    st = states(steps)
    assert st["area living"] == "changed"
    living = next(a for a in ha.areas if a["area_id"] == "salon")
    assert living["aliases"] == ["living"] and living["name"] == "Salon"
    assert living["floor_id"] == ha.floors[0]["floor_id"]
    assert [a for a in ha.areas if a["name"] == "Salon"] == [living]  # adopted, not duplicated
    assert st["area kitchen"] == "changed"  # Cuisine adopted by the witness's kitchen too
    assert (
        st["area (chambre)"] == "ok" and "area (cuisine)" not in st
    )  # Chambre reported, left alone
    again = apply(witness, secrets, tmp_path, ha, check=False)
    assert set(states(again).values()) == {"ok"}
