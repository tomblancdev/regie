"""`regie apply` — the conductor: what only Home Assistant's API can set,
converged declaratively and idempotently from home.yml. This release (0.2,
the brain): the first boot (the owner, the core config, analytics off), the
long-lived tokens the house needs, floors and areas, the MQTT integration,
the backup schedule. Keyed on names that survive a rebuild; `--check`
prints the plan and changes nothing.

Tokens live root-only under <root>/.regie/tokens/<name>; the conductor's own
is `regie`. If it is lost, the owner's password (a secret) logs the
conductor back in and mints it again — nothing is typed at a screen."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from .errors import HouseError
from .ha import HomeAssistant
from .host import STATE
from .house import House

CLIENT_NAME = "regie"


@dataclass
class Step:
    name: str
    state: str  # ok | changed | would
    detail: str

    def line(self) -> str:
        mark = {"ok": "=", "changed": "+", "would": "?"}[self.state]
        return f"  {mark} {self.name}: {self.detail}"


def _fill_form(schema: list[dict], answers: dict) -> dict:
    """A form's body: the answers for the fields it asks, the form's own
    `default` for what is not answered, and every SECTION (an expandable block
    of advanced options - a required key even when nothing in it is) filled
    the same way from its own schema."""
    body: dict = {}
    for f in schema:
        name = f["name"]
        if f.get("type") == "expandable":
            body[name] = _fill_form(f.get("schema", []), answers.get(name) or {})
        elif name in answers:
            body[name] = answers[name]
        elif "default" in f:
            body[name] = f["default"]
    return body


class Conductor:
    def __init__(
        self, house: House, secrets: dict, root: Path, ha: HomeAssistant, check: bool = False
    ):
        self.house = house
        self.secrets = secrets
        self.root = Path(root)
        self.ha = ha
        self.check = check
        self.steps: list[Step] = []
        self.client_id = ha.url + "/"  # Home Assistant wants a URL as a client id
        self.tokens_dir = self.root / STATE / "tokens"

    # --- helpers ------------------------------------------------------------
    def step(self, name: str, state: str, detail: str) -> None:
        if state == "changed" and self.check:
            state = "would"
        self.steps.append(Step(name, state, detail))

    def token_path(self, name: str) -> Path:
        return self.tokens_dir / name

    def save_token(self, name: str, value: str) -> None:
        self.tokens_dir.mkdir(parents=True, exist_ok=True)
        self.tokens_dir.chmod(0o700)
        p = self.token_path(name)
        p.write_text(value + "\n", encoding="utf-8")
        p.chmod(0o600)

    def exchange(self, code: str) -> str:
        status, data = self.ha.post_form(
            "/auth/token",
            {"grant_type": "authorization_code", "code": code, "client_id": self.client_id},
        )
        if status != 200 or not isinstance(data, dict) or "access_token" not in data:
            raise HouseError(f"/auth/token: {status} {data}")
        return data["access_token"]

    def login(self) -> str:
        """The owner's password → a session (the way the login page does it)."""
        owner = self.house.owner()
        status, flow = self.ha.post(
            "/auth/login_flow",
            {
                "client_id": self.client_id,
                "handler": ["homeassistant", None],
                "redirect_uri": self.client_id,
            },
            auth=False,
        )
        if status != 200:
            raise HouseError(f"/auth/login_flow: {status} {flow}")
        status, done = self.ha.post(
            f"/auth/login_flow/{flow['flow_id']}",
            {
                "username": owner["username"],
                "password": self.secrets["owner_password"],
                "client_id": self.client_id,
            },
            auth=False,
        )
        if status != 200 or done.get("type") != "create_entry":
            raise HouseError(
                f"login as {owner['username']} refused: {done.get('errors') or done}"
                " — the secret owner_password is not the brain's owner password"
            )
        return self.exchange(done["result"])

    # --- the steps ------------------------------------------------------------
    def onboarding(self) -> bool:
        """The first boot. Returns False when nothing can go further (--check on a
        brain that has no owner yet: there is no token to plan with)."""
        owner = self.house.owner()
        status, steps = self.ha.get("/api/onboarding", auth=False)
        if status == 404:
            # the onboarding views are gone once every step is done: 404 IS onboarded
            steps = [
                {"step": k, "done": True}
                for k in ("user", "core_config", "analytics", "integration")
            ]
        elif status != 200 or not isinstance(steps, list):
            raise HouseError(f"/api/onboarding: {status} {steps}")
        done = {s["step"]: s["done"] for s in steps}
        if not done.get("user"):
            self.step("owner", "changed", f"create {owner['username']} ({owner['label']})")
            if self.check:
                return False
            status, reply = self.ha.post(
                "/api/onboarding/users",
                {
                    "name": owner["label"],
                    "username": owner["username"],
                    "password": self.secrets["owner_password"],
                    "client_id": self.client_id,
                    "language": self.house.data["house"].get("lang", "en"),
                },
                auth=False,
            )
            if status != 200:
                raise HouseError(f"/api/onboarding/users: {status} {reply}")
            self.ha.token = self.exchange(reply["auth_code"])
        else:
            self.step("owner", "ok", f"{owner['username']} exists")
            self.ha.token = self.session_token()
        for name in ("core_config", "analytics"):
            if done.get(name):
                self.step(name, "ok", "done")
                continue
            self.step(name, "changed", "finish the step")
            if not self.check:
                status, reply = self.ha.post(f"/api/onboarding/{name}", {})
                if status != 200:
                    raise HouseError(f"/api/onboarding/{name}: {status} {reply}")
        if done.get("integration"):
            self.step("integration", "ok", "done")
        else:
            self.step("integration", "changed", "finish the step")
            if not self.check:
                status, reply = self.ha.post(
                    "/api/onboarding/integration",
                    {"client_id": self.client_id, "redirect_uri": self.client_id},
                )
                if status != 200:
                    raise HouseError(f"/api/onboarding/integration: {status} {reply}")
        return True

    def session_token(self) -> str:
        """The conductor's own long-lived token, or a fresh session by password."""
        p = self.token_path(CLIENT_NAME)
        if p.is_file():
            token = p.read_text(encoding="utf-8").strip()
            self.ha.token = token
            status, _ = self.ha.get("/api/")
            if status == 200:
                return token
            self.step("token regie", "changed", "on disk but refused — logging in again")
        return self.login()

    def tokens(self, ws) -> None:
        wanted = [CLIENT_NAME] + self.house.tokens
        existing = {
            t.get("client_name"): t
            for t in ws.call("auth/refresh_tokens")
            if t.get("type") == "long_lived_access_token"
        }
        for name in wanted:
            client_name = f"{CLIENT_NAME}:{name}" if name != CLIENT_NAME else CLIENT_NAME
            if self.token_path(name).is_file() and client_name in existing:
                self.step(f"token {name}", "ok", "minted")
                continue
            what = "mint" if client_name not in existing else "on disk no more — mint again"
            self.step(f"token {name}", "changed", what)
            if self.check:
                continue
            if client_name in existing:
                ws.call("auth/delete_refresh_token", refresh_token_id=existing[client_name]["id"])
            token = ws.call("auth/long_lived_access_token", client_name=client_name, lifespan=3650)
            self.save_token(name, token)
            if name == CLIENT_NAME:
                self.ha.token = token

    def registries(self, ws) -> None:
        """Floors and areas, keyed on the house's id kept as an alias (Home
        Assistant chooses its own ids from the name)."""
        floors = {a: f for f in ws.call("config/floor_registry/list") for a in f.get("aliases", [])}
        floor_ids: dict[str, str] = {}
        for f in self.house.floors():
            live = floors.get(f["id"])
            if live:
                floor_ids[f["id"]] = live["floor_id"]
                if live["name"] != f["label"] or live.get("level") != f.get("level"):
                    self.step(f"floor {f['id']}", "changed", f"rename to {f['label']}")
                    if not self.check:
                        ws.call(
                            "config/floor_registry/update",
                            floor_id=live["floor_id"],
                            name=f["label"],
                            level=f.get("level"),
                        )
                else:
                    self.step(f"floor {f['id']}", "ok", f["label"])
                continue
            self.step(f"floor {f['id']}", "changed", f"create {f['label']}")
            if not self.check:
                made = ws.call(
                    "config/floor_registry/create",
                    name=f["label"],
                    aliases=[f["id"]],
                    level=f.get("level"),
                )
                floor_ids[f["id"]] = made["floor_id"]
        live_areas = ws.call("config/area_registry/list")
        areas = {a: r for r in live_areas for a in r.get("aliases", [])}
        # Home Assistant's own first-boot areas (Salon, Cuisine, Chambre in
        # French...) carry no alias: one whose name matches a house area is
        # ADOPTED - aliased and floored - never duplicated by name
        unnamed = {r["name"].casefold(): r for r in live_areas if not r.get("aliases")}
        house_ids = {a["id"] for a in self.house.areas}
        for a in self.house.areas:
            live = areas.get(a["id"])
            floor_id = floor_ids.get(a.get("floor") or "")
            if not live and a["label"].casefold() in unnamed:
                found = unnamed.pop(a["label"].casefold())
                self.step(
                    f"area {a['id']}", "changed", f"adopt {found['name']} ({found['area_id']})"
                )
                if not self.check:
                    ws.call(
                        "config/area_registry/update",
                        area_id=found["area_id"],
                        name=a["label"],
                        aliases=[a["id"]],
                        floor_id=floor_id,
                    )
                continue
            if live:
                if live["name"] != a["label"] or (live.get("floor_id") or None) != floor_id:
                    self.step(f"area {a['id']}", "changed", f"update {a['label']}")
                    if not self.check:
                        ws.call(
                            "config/area_registry/update",
                            area_id=live["area_id"],
                            name=a["label"],
                            floor_id=floor_id,
                        )
                else:
                    self.step(f"area {a['id']}", "ok", a["label"])
                continue
            self.step(f"area {a['id']}", "changed", f"create {a['label']}")
            if not self.check:
                payload = {"name": a["label"], "aliases": [a["id"]]}
                if floor_id:
                    payload["floor_id"] = floor_id
                ws.call("config/area_registry/create", **payload)
        # what the brain has that the house does not name: reported, never removed
        for r in live_areas:
            alias = next((x for x in r.get("aliases", []) if x in house_ids), None)
            if alias is None:
                self.step(
                    f"area ({r['area_id']})", "ok", f"{r['name']} — not in home.yml, left alone"
                )

    def config_entry(self, domain: str, answers: dict, label: str) -> None:
        status, entries = self.ha.get(f"/api/config/config_entries/entry?domain={domain}")
        if status != 200:
            raise HouseError(f"config entries of {domain}: {status} {entries}")
        if entries:
            self.step(f"integration {domain}", "ok", label)
            return
        self.step(f"integration {domain}", "changed", f"set up {label}")
        if self.check:
            return
        status, flow = self.ha.post("/api/config/config_entries/flow", {"handler": domain})
        if status != 200:
            raise HouseError(f"{domain}: the flow refused to start: {status} {flow}")
        for _ in range(8):
            if flow.get("type") != "form":
                break
            schema = flow.get("data_schema") or []
            fields = [f["name"] for f in schema]
            body = _fill_form(schema, answers)
            if fields and not any(k in answers for k in fields):
                raise HouseError(f"{domain}: its form asks {fields}; nothing in home.yml answers")
            status, flow = self.ha.post(f"/api/config/config_entries/flow/{flow['flow_id']}", body)
            if status != 200:
                raise HouseError(f"{domain}: {status} {flow} — the form asked {fields}")
            if flow.get("errors"):
                raise HouseError(f"{domain}: the form came back with {flow['errors']}")
        if flow.get("type") != "create_entry":
            raise HouseError(
                f"{domain}: the flow ended on {flow.get('type')} ({flow.get('reason')})"
            )

    def integrations(self) -> None:
        mqtt = self.house.data.get("mqtt", {})
        self.config_entry(
            "mqtt",
            {
                "broker": "127.0.0.1",
                "port": mqtt.get("port", 1883),
                "username": "home",
                "password": self.secrets["mqtt_password_home"],
                # the form's advanced section, the two keys it requires with no
                # default (Home Assistant 2026.8): no client certificate, no CA
                "other_settings": {"set_client_cert": False, "set_ca_cert": "off"},
            },
            "the broker on the loopback, user home",
        )

    def backup(self, ws) -> None:
        want = self.house.backup()
        info = ws.call("backup/config/info")
        cfg = info.get("config", info)
        sched = cfg.get("schedule", {})
        ret = cfg.get("retention", {})
        create = cfg.get("create_backup", {})
        same = (
            sched.get("recurrence") == "daily"
            and str(sched.get("time") or "")[:5] == want["time"]
            and ret.get("copies") == want["copies"]
            and create.get("agent_ids") == ["backup.local"]
            and bool(create.get("password"))
            and cfg.get("automatic_backups_configured") is True
        )
        label = f"daily {want['time']}, keep {want['copies']}, encrypted"
        if same:
            self.step("backup", "ok", label)
            return
        self.step("backup", "changed", f"schedule {label}")
        if self.check:
            return
        ws.call(
            "backup/config/update",
            create_backup={
                "agent_ids": ["backup.local"],
                "include_database": True,
                "include_folders": [],
                "include_all_addons": False,
                "include_addons": [],
                "name": None,
                "password": self.secrets["backup_password"],
            },
            retention={"copies": want["copies"], "days": None},
            schedule={"recurrence": "daily", "time": want["time"], "days": []},
            automatic_backups_configured=True,
        )

    # --- the run ----------------------------------------------------------------
    def run(self) -> list[Step]:
        if not self.onboarding():
            return self.steps
        with self.ha.ws() as ws:
            self.tokens(ws)
            self.registries(ws)
            self.backup(ws)
        self.integrations()
        return self.steps


def apply(house: House, secrets: dict, root: Path, ha: HomeAssistant, check: bool) -> list[Step]:
    missing = [
        n for n in ("owner_password", "backup_password", "mqtt_password_home") if n not in secrets
    ]
    if missing:
        raise HouseError("missing secrets: " + ", ".join(missing))
    return Conductor(house, secrets, root, ha, check).run()


def summary(steps: list[Step], check: bool) -> str:
    changed = sum(1 for s in steps if s.state in ("changed", "would"))
    ok = sum(1 for s in steps if s.state == "ok")
    verb = "would change" if check else "changed"
    return f"apply: {changed} {verb}, {ok} ok"
