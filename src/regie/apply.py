"""`regie apply` — the conductor: what only Home Assistant's API can set,
converged declaratively and idempotently from home.yml: the first boot (the
owner, the core config, analytics off), the long-lived tokens the house
needs, the reverse proxy it trusts, floors and areas (with what people say
for them, and a room adopted by alias when its id changes), the knobs the
files seed once (the periods' times, the first mode — 0.4), the backup
schedule, and — since 0.3 — one config entry per thing that names an
`integration:` (the MQTT broker rides the same walker). Keyed on names that survive a
rebuild; `--check` prints the plan and changes nothing.

An entry is keyed on its DOMAIN: Home Assistant's API shows an entry's
domain and title, never its address or unique id, so a domain's entries
satisfy its rows in order, and the integration's own unique id keeps a
thing from being set up twice. What a flow needs a person for (a PIN read
off a screen, a consent given in a browser) is read from the brain — the
domains that take application credentials, the fields of the domain's own
forms — and reported as `by hand: regie link <thing>`, never started by a
converge.

Tokens live root-only under <root>/.regie/tokens/<name>; the conductor's own
is `regie`. If it is lost, the owner's password (a secret) logs the
conductor back in and mints it again — nothing is typed at a screen."""

from __future__ import annotations

import ipaddress
import json
import re
import socket
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

from .errors import HouseError
from .flows import PERSON_FIELDS, Outcome, fill_form, walk
from .ha import HomeAssistant
from .host import STATE
from .house import House
from .otbr import Otbr
from .render import MANIFEST
from .z2m import Z2M

CLIENT_NAME = "regie"
MATTER_URL = "ws://localhost:5580/ws"  # the server beside the brain (pack matter)
HTTP_META = ("created_at", "error", "error_message")
ENTRIES = "/api/config/config_entries/entry"
MARKS = {"ok": "=", "changed": "+", "would": "?", "hand": "!", "waiting": "~"}


# a unique id in a rendered package: `unique_id: regie_x` (bare or quoted)
UNIQUE_ID_RE = re.compile(r"unique_id:\s*['\"]?(regie_[A-Za-z0-9_]+)")


def probe(url: str, via: str | None = None) -> int:
    """The status a URL answers (0 = unreachable) - how the conductor proves a
    door before promoting the config that opens it. `via` = the proxy's
    address to connect to, with the door's name as SNI and Host: on the brain
    itself the door's name may resolve to the brain (a host file), which is
    not the way a person comes in."""
    if not via:
        try:
            with urllib.request.urlopen(url, timeout=10) as r:  # noqa: S310
                return r.status
        except urllib.error.HTTPError as exc:
            return exc.code
        except (urllib.error.URLError, OSError):
            return 0
    parts = urllib.parse.urlsplit(url)
    host, path = parts.hostname or "", parts.path or "/"
    tls = parts.scheme == "https"
    port = parts.port or (443 if tls else 80)
    try:
        sock = socket.create_connection((via, port), timeout=10)
        if tls:
            sock = ssl.create_default_context().wrap_socket(sock, server_hostname=host)
        with sock:
            sock.sendall(
                f"GET {path} HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n"
                f"User-Agent: regie\r\n\r\n".encode()
            )
            line = sock.recv(64).decode("ascii", "replace").split("\r\n", 1)[0]
        return int(line.split()[1]) if line.startswith("HTTP/") else 0
    except (OSError, ValueError, IndexError):
        return 0


def _networks(values: list[str] | None) -> set[str]:
    out = set()
    for v in values or []:
        try:
            out.add(str(ipaddress.ip_network(v, strict=False)))
        except ValueError:
            out.add(v)
    return out


@dataclass
class Step:
    name: str
    state: str  # ok | changed | would | hand | waiting
    detail: str

    def line(self) -> str:
        return f"  {MARKS[self.state]} {self.name}: {self.detail}"


_fill_form = fill_form  # the name the tests and older callers know


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
        self.restarting = False  # a configure asked Home Assistant to restart
        self.client_id = ha.url + "/"  # Home Assistant wants a URL as a client id
        self.tokens_dir = self.root / STATE / "tokens"
        self._cache: dict = {}
        self.area_ids: dict[str, str] = {}  # the house's area id -> Home Assistant's, once read
        if house.data["house"].get("url") and not ha.frontend_base:
            ha.frontend_base = house.data["house"]["url"]

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
        if "owner_password" not in self.secrets:
            raise HouseError(
                "the conductor's token is not on disk and the secret owner_password is not "
                "given — nothing can log it back in"
            )
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

    # --- the reverse proxy: an API-managed HTTP config since 2026.x ---------------
    def _http_matches(self, conf: dict | None) -> bool:
        trusted = self.house.data.get("proxy", {}).get("trusted") or []
        if not conf:
            return False
        return bool(conf.get("use_x_forwarded_for", False)) == bool(trusted) and _networks(
            conf.get("trusted_proxies")
        ) == _networks(trusted)

    def proxy_via(self) -> str | None:
        """The proxy's address the brain proves its door through: `proxy.via`, or
        the one trusted proxy when it is a single host."""
        proxy = self.house.data.get("proxy", {})
        if proxy.get("via"):
            return proxy["via"]
        trusted = proxy.get("trusted") or []
        if len(trusted) == 1:
            try:
                net = ipaddress.ip_network(trusted[0], strict=False)
            except ValueError:
                return None
            if net.num_addresses == 1:
                return str(net.network_address)
        return None

    def http(self, ws) -> None:
        """Home Assistant's HTTP config (the reverse proxy it trusts) is stored,
        not read from YAML any more: a new config is a TRIAL - configure, Home
        Assistant restarts with it pending, and it reverts in five minutes
        unless promoted. The conductor configures, waits, proves the door
        through the proxy, promotes."""
        trusted = self.house.data.get("proxy", {}).get("trusted") or []
        cfg = ws.call("http/config")
        stable, pending, active = (
            cfg.get("stable"),
            cfg.get("pending"),
            cfg.get("active_config_type"),
        )
        label = f"reverse proxy trusted: {', '.join(trusted) or 'none'}"
        pending_ok = (
            pending is not None and not pending.get("error") and self._http_matches(pending)
        )
        if self._http_matches(stable) and not pending_ok:
            self.step("http", "ok", label)
            return
        if active == "pending" and pending_ok:
            self.step("http", "changed", f"promote the trial ({label})")
            if self.check:
                return
            url = self.house.data["house"].get("url")
            if url:
                status = probe(f"{url.rstrip('/')}/manifest.json", via=self.proxy_via())
                if status != 200:
                    raise HouseError(
                        f"the door through the proxy answers {status}, not 200 - the trial is not "
                        "promoted (Home Assistant reverts it by itself)"
                    )
            ws.call("http/config/promote")
            return
        base = {k: v for k, v in (stable or cfg.get("default") or {}).items() if k not in HTTP_META}
        wanted = {**base, "use_x_forwarded_for": bool(trusted), "trusted_proxies": list(trusted)}
        self.step("http", "changed", f"configure ({label}) - Home Assistant restarts to try it")
        if self.check:
            return
        result = ws.call("http/config/configure", config=wanted)
        self.restarting = bool((result or {}).get("restart", True))

    def wait_for_running(self, timeout: int = 300) -> None:
        """The HTTP server answers before the core has finished starting; what
        the conductor sets needs a RUNNING core (a config change restarts it)."""
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            try:
                with self.ha.ws() as ws:
                    state = (ws.call("get_config") or {}).get("state")
                    if state == "RUNNING":
                        return
            except HouseError:
                pass
            time.sleep(5)
        raise HouseError(f"Home Assistant's core is not RUNNING after {timeout}s")

    def wait_for_trial(self, timeout: int = 300) -> None:
        """Home Assistant restarts with the pending config: wait until the running
        server says so (the socket goes away and comes back in between)."""
        deadline = time.monotonic() + timeout
        time.sleep(5)
        while time.monotonic() < deadline:
            try:
                with self.ha.ws() as ws:
                    if ws.call("http/config").get("active_config_type") == "pending":
                        return
            except HouseError:
                pass
            time.sleep(5)
        raise HouseError(
            f"Home Assistant did not come back with the trial config within {timeout}s"
        )

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
        taken: set[str] = set()
        for a in self.house.areas:
            wanted = self.house.area_aliases(a)
            live = areas.get(a["id"])
            floor_id = floor_ids.get(a.get("floor") or "")
            icon = a.get("icon")
            if not live:
                # a room renamed (its old id now one of its aliases — `salon`
                # became `living_room`), or Home Assistant's own area named
                # the way people say it: adopted, never duplicated
                spoken = {x.casefold() for x in wanted[1:]}
                found = next(
                    (
                        r
                        for r in live_areas
                        if r["area_id"] not in taken
                        and (
                            set(r.get("aliases", [])) & set(wanted[1:])
                            or (not r.get("aliases") and r["name"].casefold() in spoken)
                        )
                    ),
                    None,
                ) or unnamed.pop(a["label"].casefold(), None)
                if found:
                    taken.add(found["area_id"])
                    self.area_ids[a["id"]] = found["area_id"]
                    self.step(
                        f"area {a['id']}", "changed", f"adopt {found['name']} ({found['area_id']})"
                    )
                    if not self.check:
                        payload = {"name": a["label"], "aliases": wanted, "floor_id": floor_id}
                        if icon:
                            payload["icon"] = icon
                        ws.call("config/area_registry/update", area_id=found["area_id"], **payload)
                    continue
            if live:
                taken.add(live["area_id"])
                self.area_ids[a["id"]] = live["area_id"]
                if (
                    live["name"] != a["label"]
                    or (live.get("floor_id") or None) != floor_id
                    or set(live.get("aliases", [])) != set(wanted)
                    or (icon and live.get("icon") != icon)
                ):
                    self.step(f"area {a['id']}", "changed", f"update {a['label']}")
                    if not self.check:
                        payload = {"name": a["label"], "aliases": wanted, "floor_id": floor_id}
                        if icon:
                            payload["icon"] = icon
                        ws.call("config/area_registry/update", area_id=live["area_id"], **payload)
                else:
                    self.step(f"area {a['id']}", "ok", a["label"])
                continue
            self.step(f"area {a['id']}", "changed", f"create {a['label']}")
            if not self.check:
                payload = {"name": a["label"], "aliases": wanted}
                if floor_id:
                    payload["floor_id"] = floor_id
                if icon:
                    payload["icon"] = icon
                made = ws.call("config/area_registry/create", **payload)
                if isinstance(made, dict) and made.get("area_id"):
                    self.area_ids[a["id"]] = made["area_id"]
        # what the brain has that the house does not name: reported, never removed
        for r in live_areas:
            if r["area_id"] in taken:
                continue
            alias = next((x for x in r.get("aliases", []) if x in house_ids), None)
            if alias is None:
                self.step(
                    f"area ({r['area_id']})", "ok", f"{r['name']} — not in home.yml, left alone"
                )

    def knobs(self) -> None:
        """What the files SEED and the UI owns after: the periods' times, the
        house's first mode. Seeded ONCE per brain — the conductor keeps its own
        memory of it (<root>/.regie/knobs.json): a fresh helper does not read
        `unknown` (a time helper starts at 00:00, a select at its first option
        — found live), so the mark, not the brain's state, says whether the
        file has spoken. A marked knob is read, compared, and kept (the file
        is the seed, never the master — an `initial:` on the helper would
        reset it at every restart, so the engine renders none)."""
        marks_path = self.root / STATE / "knobs.json"
        marks: dict = {}
        if marks_path.is_file():
            marks = json.loads(marks_path.read_text(encoding="utf-8"))
        for k in self.house.knobs():
            entity = k["entity"]
            status, state = self.ha.get(f"/api/states/{entity}")
            name = f"knob {entity.split('.', 1)[1]}"
            if status == 404:
                self.step(name, "ok", "no such helper on the brain — nothing to seed")
                continue
            if status != 200:
                raise HouseError(f"{entity}: {status} {state}")
            current = state.get("state", "unknown")
            shown = k["reads"](current) if k.get("follow") else current
            shown = shown[:5] if entity.startswith("input_datetime.") else shown

            def seed(reason: str, k=k, entity=entity, name=name) -> None:
                self.step(name, "changed", reason)
                if not self.check:
                    domain, service = k["action"].split("/")
                    st, body = self.ha.post(
                        f"/api/services/{domain}/{service}", {"entity_id": entity, **k["data"]}
                    )
                    if st != 200:
                        raise HouseError(f"{entity}: {st} {body}")
                    marks[entity] = k["value"]

            if entity not in marks:
                seed(f"seed {k['value']} (was {shown})")
                continue
            if shown == k["value"]:
                self.step(name, "ok", shown)
            elif k.get("follow") and shown == marks[entity]:
                # the brain still reads what the file seeded last time, and the
                # file moved: the file leads (0.24, the day's rules)
                seed(f"{marks[entity]} → {k['value']} (the file moved, the UI had not)")
            elif k.get("follow") and marks[entity] != k["value"]:
                self.step(
                    name,
                    "hand",
                    f"{shown} on the brain, {k['value']} in the file, both moved since the seed "
                    f"{marks[entity]} — `regie palette pull` keeps the brain's, or edit the file",
                )
            else:
                self.step(
                    name, "ok", f"{shown} — set from the UI (the file says {k['value']}), kept"
                )
        if not self.check and marks:
            marks_path.parent.mkdir(parents=True, exist_ok=True)
            marks_path.write_text(json.dumps(marks, indent=2) + "\n", encoding="utf-8")

    # --- what the brain knows about an integration ----------------------------------
    def oauth_domains(self, ws) -> set[str]:
        """The domains born from a consent: the ones that take application
        credentials (read from the brain, not from a table of ours)."""
        if "oauth" not in self._cache:
            try:
                cfg = ws.call("application_credentials/config") or {}
            except HouseError:
                cfg = {}
            self._cache["oauth"] = set((cfg.get("integrations") or {}).keys())
        return self._cache["oauth"]

    def person_fields(self, ws, domain: str) -> list[str]:
        """The fields of the domain's config forms only a person can answer (a
        PIN read off the thing's screen) - from the translations the brain
        serves for the domain."""
        key = ("fields", domain)
        if key not in self._cache:
            try:
                got = ws.call(
                    "frontend/get_translations",
                    language="en",
                    category="config",
                    integration=[domain],
                )
                resources = (got or {}).get("resources") or {}
            except HouseError:
                resources = {}
            prefix = f"component.{domain}.config.step."
            found = {
                k.rsplit(".data.", 1)[1]
                for k in resources
                if k.startswith(prefix) and ".data." in k
            }
            self._cache[key] = sorted(found & set(PERSON_FIELDS))
        return self._cache[key]

    def iot_class(self, ws, domain: str) -> str | None:
        key = ("iot", domain)
        if key not in self._cache:
            try:
                self._cache[key] = (ws.call("manifest/get", integration=domain) or {}).get(
                    "iot_class"
                )
            except HouseError:
                self._cache[key] = None
        return self._cache[key]

    def asks_a_person(self, ws, domain: str) -> str | None:
        if domain in self.oauth_domains(ws):
            return "a consent in a browser"
        fields = self.person_fields(ws, domain)
        if fields:
            return f"a {fields[0].replace('_', ' ')} on its screen"
        return None

    def domain_entries(self, domain: str) -> list[dict]:
        status, entries = self.ha.get(f"{ENTRIES}?domain={domain}")
        if status != 200 or not isinstance(entries, list):
            raise HouseError(f"config entries of {domain}: {status} {entries}")
        return [e for e in entries if e.get("source") != "ignore"]

    def discovered(self, ws, domain: str, thing: dict) -> str | None:
        """A discovered flow (zeroconf, ssdp...) of this domain that is this
        thing's: its unique id is the row's mac, or it is the domain's only one
        while the house has one row of that domain. Anything less certain is
        left to the UI."""
        flows = [
            f for f in (ws.call("config_entries/flow/progress") or []) if f.get("handler") == domain
        ]
        if not flows:
            return None
        mac = (thing.get("mac") or "").lower()
        for f in flows:
            uid = str((f.get("context") or {}).get("unique_id") or "").lower()
            if mac and uid == mac:
                return f["flow_id"]
        rows = self.house.rows_of(domain)
        if len(flows) == 1 and len(rows) == 1:
            return flows[0]["flow_id"]
        return None

    @staticmethod
    def thing_answers(thing: dict) -> dict:
        out: dict = {}
        for key in ("host", "mac"):
            if thing.get(key):
                out[key] = thing[key]
        out["name"] = thing.get("label") or thing["id"]
        return out

    def credentials(self, ws) -> None:
        """Application credentials for the OAuth domains the rows name, from the
        secrets <domain>_client_id + <domain>_client_secret; keyed on the
        domain and the client id."""
        wanted = {d for t in self.house.things for d in self.house.integrations(t)}
        domains = sorted(wanted & self.oauth_domains(ws))
        if not domains:
            return
        items = ws.call("application_credentials/list") or []
        for d in domains:
            cid, secret = self.secrets.get(f"{d}_client_id"), self.secrets.get(f"{d}_client_secret")
            mine = [i for i in items if i.get("domain") == d]
            if not cid or not secret:
                if mine:
                    self.step(
                        f"credentials {d}",
                        "ok",
                        f"in the brain ({mine[0].get('name')}), not a secret",
                    )
                continue
            if any(i.get("client_id") == cid for i in mine):
                self.step(f"credentials {d}", "ok", "from the secrets")
                continue
            self.step(f"credentials {d}", "changed", "create from the secrets")
            if self.check:
                continue
            ws.call(
                "application_credentials/create",
                domain=d,
                client_id=cid,
                client_secret=secret,
                name=CLIENT_NAME,
            )

    def entries(self, ws) -> None:
        """One config entry per row that names an integration."""
        by_domain: dict[str, list[dict]] = {}
        for t in self.house.things:
            for d in self.house.integrations(t):
                by_domain.setdefault(d, []).append(t)
        for domain, rows in sorted(by_domain.items()):
            have = self.domain_entries(domain)
            iot = self.iot_class(ws, domain)
            note = (
                f" [{iot}: its control needs the internet]"
                if (iot or "").startswith("cloud")
                else ""
            )
            hand = self.asks_a_person(ws, domain)
            for n, t in enumerate(rows):
                # a box that is several things to Home Assistant: one line per domain
                name = f"entry {t['id']}" + (
                    f" ({domain})" if len(self.house.integrations(t)) > 1 else ""
                )
                if n < len(have):
                    self.step(name, "ok", f"{domain} — {have[n].get('title')}{note}")
                    continue
                if hand:
                    self.step(name, "hand", f"{domain}: {hand} — regie link {t['id']}{note}")
                    continue
                where = f" at {t['host']}" if t.get("host") else ""
                if self.check:
                    self.step(name, "changed", f"set up {domain}{where}{note}")
                    continue
                out = walk(
                    self.ha,
                    domain,
                    self.thing_answers(t),
                    flow_id=self.discovered(ws, domain, t),
                    verb=f"regie link {t['id']}",
                )
                self.step(name, out.state, f"{domain}: {out.detail}{note}")
        # what the brain discovered that the house does not name: a line, never a tile
        for f in ws.call("config_entries/flow/progress") or []:
            if f.get("handler") in by_domain:
                continue
            ctx = f.get("context") or {}
            who = (ctx.get("title_placeholders") or {}).get("name") or ctx.get("unique_id") or ""
            self.step(
                f"discovered ({f.get('handler')})",
                "ok",
                f"{who} ({ctx.get('source')}) — not in home.yml, left alone",
            )

    def mqtt(self) -> None:
        if self.domain_entries("mqtt"):
            self.step("entry mqtt", "ok", "the broker on the loopback, user home")
            return
        self.step("entry mqtt", "changed", "set up the broker on the loopback, user home")
        if self.check:
            return
        conf = self.house.data.get("mqtt", {})
        out = walk(
            self.ha,
            "mqtt",
            {
                "broker": "127.0.0.1",
                "port": conf.get("port", 1883),
                "username": "home",
                "password": self.secrets["mqtt_password_home"],
                # the form's advanced section, the two keys it requires with no
                # default (Home Assistant 2026.8): no client certificate, no CA
                "other_settings": {"set_client_cert": False, "set_ca_cert": "off"},
            },
        )
        if out.state != "changed":
            raise HouseError(f"mqtt: {out.detail}")

    def matter(self) -> None:
        """The Matter server's config entry (pack matter): the brain dials the
        server on its own loopback. Keyed on the domain — one server."""
        if not self.house.has_pack("matter"):
            return
        if self.domain_entries("matter"):
            self.step("entry matter", "ok", f"the server on the loopback ({MATTER_URL})")
            return
        if self.check:
            self.step(
                "entry matter", "changed", f"set up the server on the loopback ({MATTER_URL})"
            )
            return
        out = walk(self.ha, "matter", {"url": MATTER_URL})
        if out.state == "waiting":
            self.step(
                "entry matter",
                "waiting",
                "the server does not answer on the loopback (matter-server.service up?) "
                "— tried again at the next apply",
            )
            return
        if out.state != "changed":
            raise HouseError(f"matter: {out.detail}")
        self.step("entry matter", "changed", f"set up the server on the loopback ({MATTER_URL})")

    # --- Thread ---------------------------------------------------------------
    # the seam the tests replace: a border router is a box on the lane, not a
    # service of ours (the same shape as `z2m_of`)
    def otbr_of(self, border_router: dict) -> Otbr:
        return Otbr(border_router["url"])

    def thread(self) -> None:
        """The Thread border router's config entry (`otbr`): the brain is
        pointed at the REST API the box serves on the lane. Keyed on the
        router's border agent id by Home Assistant itself.

        The guard is the point of this step. Home Assistant's flow reads the
        router's active dataset, and **on a router holding none it mints a
        network of its own** — a random PAN id and a key nobody wrote down.
        So the conductor introduces a border router only while it is already
        holding the house's network: the dataset goes on BEFORE anything is
        commissioned (home.md §4.3), and this is that sentence made
        mechanical. A router that is off, or that holds somebody else's
        network, WAITS — it does not fail the fleet (0.7.3's rule); the
        watcher is what goes red."""
        want = self.house.thread_network_name()
        if not want:
            return
        for b in self.house.border_routers():
            name = f"thread {b['id']}"
            try:
                held = self.otbr_of(b).network_name()
            except HouseError as exc:
                self.step(name, "waiting", f"{exc} — tried again at the next apply")
                continue
            if held != want:
                self.step(
                    name,
                    "waiting",
                    f"the border router at {b['url']} holds "
                    + (f"the network {held!r}" if held else "no network at all")
                    + f", not {want!r}: Home Assistant would MINT a network of its own here. "
                    "The house's dataset is pushed by the fleet, and nothing is commissioned "
                    "until it is on — tried again at the next apply",
                )
                continue
            if self.domain_entries("otbr"):
                self.step(name, "ok", f"the border router at {b['url']}, holding {want}")
                continue
            if self.check:
                self.step(name, "changed", f"set up the border router at {b['url']}")
                continue
            out = walk(self.ha, "otbr", {"url": b["url"]})
            if out.state == "waiting":
                self.step(
                    name,
                    "waiting",
                    f"the REST API at {b['url']} did not answer Home Assistant "
                    "— tried again at the next apply",
                )
                continue
            if out.state != "changed":
                raise HouseError(f"otbr: {out.detail}")
            self.step(name, "changed", f"set up the border router at {b['url']}, holding {want}")

    # --- the mesh -----------------------------------------------------------
    # `up` restarts Zigbee2MQTT when the render changed one of its files, and
    # the frontend's socket comes up seconds AFTER the unit does — so the
    # conductor waits for the door instead of skipping the mesh (0.7.2).
    z2m_wait = 60

    def z2m_of(self, coordinator: dict) -> Z2M:
        return Z2M(f"ws://127.0.0.1:{coordinator['frontend_port']}/api")

    def zigbee(self) -> None:
        """The mesh, made to match the rows: every thing wears its id, every
        room with Zigbee lights has its group with exactly its lights in it,
        and every `bind:` is a binding INSIDE the mesh — the half that keeps
        working with the brain down (home.md 4.1). Zigbee2MQTT's files are
        rendered too, but a running instance does not re-read them: what is
        live is set through its API, here."""
        for c in self.house.coordinators():
            name = f"zigbee {c['id']}"
            z = self.z2m_of(c)
            try:
                z.open(timeout=10, wait=0 if self.check else self.z2m_wait)
            except HouseError as exc:
                self.step(name, "waiting", f"{exc} — tried again at the next apply")
                continue
            try:
                if not z.online:
                    self.step(name, "waiting", "the bridge is not online yet (the radio?)")
                    continue
                before = len(self.steps)
                self.zigbee_names(name, z, c)
                self.zigbee_groups(name, z, c)
                self.zigbee_binds(name, z, c)
                self.zigbee_strangers(name, z, c)
                if len(self.steps) == before:
                    # a radio with nothing to do still says it is there: an
                    # empty mesh before the walk reads the same as a silence
                    self.step(
                        name,
                        "ok",
                        f"{len(c['things'])} thing(s), {len(c['groups'])} group(s) — "
                        f"{z.info.get('version', '?')} on {c['host']}:{c['port']}",
                    )
            finally:
                z.close()

    def zigbee_names(self, name: str, z: Z2M, c: dict) -> None:
        """A thing wears its row's id in the mesh: the friendly name, the MQTT
        topic and the Home Assistant entity are one name (decision H8). The
        walk pairs a thing under its address; this is where it gets its own."""
        for t in c["things"]:
            dev = z.device(t["ieee"])
            if dev is None:
                self.step(
                    f"{name} {t['id']}",
                    "waiting",
                    f"{t['ieee']} is in the house but not in the mesh — paired to another "
                    "radio, or lost (re-pair it)",
                )
                continue
            if dev.get("friendly_name") == t["id"]:
                continue
            was = dev.get("friendly_name")
            if not self.check:
                z.request(
                    "device/rename",
                    {"from": was, "to": t["id"], "homeassistant_rename": True},
                )
            self.step(f"{name} {t['id']}", "changed", f"named (was {was})")

    @staticmethod
    def unreachable_said(exc: HouseError) -> str:
        """What Zigbee2MQTT said, cut to the part a person acts on."""
        text = str(exc)
        if "Timeout" in text:
            return (
                "it does not answer its radio (a ZCL timeout) — unpowered, out of range "
                "or asleep; the next apply writes it"
            )
        return f"{text} — tried again at the next apply"

    def zigbee_groups(self, name: str, z: Z2M, c: dict) -> None:
        """One group per room that has Zigbee lights, holding exactly them.
        The number is derived from the room's id (house.zigbee_group_id) and
        lives in each bulb's own table — it never moves."""
        live = {g["id"]: g for g in z.groups}
        for g in c["groups"]:
            number, room = g["number"], g["area"]["id"]
            what = f"{name} group {room}"
            group = live.get(number)
            if group is None:
                # NOT `group/add`. The render already declared this group in
                # groups.yaml, and settings is where Zigbee2MQTT keeps a
                # group's NAME: adding it would be refused outright
                # ("friendly_name '<room>' is already in use", settings.js
                # addGroup). The radio's own group object is made LAZILY, the
                # first time the name is resolved — "If group does not exist,
                # create it (since it's already in configuration.yaml)"
                # (zigbee.js) — which the members/add below is. So a declared
                # group is absent from `bridge/groups` until it has a member,
                # and that is not a fault to repair.
                group = {"id": number, "friendly_name": room, "members": []}
                self.step(what, "changed", f"declared (number {number}) — made by its first member")
            elif group.get("friendly_name") != room:
                if not self.check:
                    z.request("group/rename", {"from": group["friendly_name"], "to": room})
                self.step(what, "changed", f"named {room} (was {group['friendly_name']})")
            members = {m.get("ieee_address") for m in (group or {}).get("members", [])}
            want = {t["ieee"] for t in g["things"]}
            # the coordinator sits in a group whose remote speaks through it
            # (a STYRBAR's binding shape, hands.PROFILES): added when one binds
            # to this room, never removed
            coordinator = (z.info.get("coordinator") or {}).get("ieee_address")
            hears = [
                t
                for t in c["things"]
                if room in (t.get("bind") or []) and (binding_shape(t) or {}).get("hear_via_group")
            ]
            if hears and coordinator and coordinator not in members:
                if not self.check:
                    z.request("group/members/add", {"group": room, "device": "Coordinator"})
                self.step(
                    f"{what} Coordinator",
                    "changed",
                    f"the coordinator in the room's group — {hears[0]['id']} speaks through it",
                )
                members.add(coordinator)
            if coordinator:
                members.discard(coordinator)
            unreachable = set()
            for t in g["things"]:
                if t["ieee"] in members:
                    continue
                if not self.check:
                    try:
                        z.request("group/members/add", {"group": room, "device": t["id"]})
                    except HouseError as exc:
                        unreachable.add(t["ieee"])
                        self.step(f"{what} {t['id']}", "waiting", self.unreachable_said(exc))
                        continue
                self.step(f"{what} {t['id']}", "changed", "in the room's group")
            for ieee in sorted(members - want):
                if not self.check:
                    try:
                        z.request("group/members/remove", {"group": room, "device": ieee})
                    except HouseError as exc:
                        unreachable.add(ieee)
                        self.step(f"{what} {ieee}", "waiting", self.unreachable_said(exc))
                        continue
                self.step(
                    f"{what} {ieee}", "changed", "out of the room's group (no row puts it there)"
                )
            if not (want - members - unreachable) and not (members - want - unreachable):
                self.step(what, "ok", f"{len(want)} light(s), number {number}")

    def zigbee_binds(self, name: str, z: Z2M, c: dict) -> None:
        """`bind: [...]` on a control, made real: the command travels
        remote → bulb (or → the room's group) inside the mesh, and the brain
        only watches. A binding the house does not name is REMOVED only when
        its target is one of ours (a room's group, a thing with a row); a
        binding the vendor shipped is reported and left alone — it is not
        ours to undo."""
        ours = {g["number"]: g["area"]["id"] for g in c["groups"]}
        by_ieee = {t["ieee"]: t for t in c["things"]}
        self._groups, self._things = c["groups"], c["things"]
        for t in c["things"]:
            targets = list(t.get("bind") or [])
            dev = z.device(t["ieee"])
            if dev is None:
                continue
            live: dict[str, set] = {}
            for ep in (dev.get("endpoints") or {}).values():
                for b in ep.get("bindings") or []:
                    tgt = b.get("target") or {}
                    key = (
                        f"group:{tgt.get('id')}"
                        if tgt.get("type") == "group"
                        else f"device:{tgt.get('ieee_address')}"
                    )
                    live.setdefault(key, set()).add(b.get("cluster"))
            shape = binding_shape(t)
            coordinator = (z.info.get("coordinator") or {}).get("ieee_address")
            for target in targets:
                key = self.bind_key(target, c)
                if key is None:
                    self.step(
                        f"{name} bind {t['id']}",
                        "hand",
                        f"target {target!r} is neither a room with Zigbee lights nor a paired "
                        "thing on this radio",
                    )
                    continue
                shaped = bool(shape) and key.startswith("group:")
                if shaped:
                    # ONE cluster to the group, the converter's per-cluster
                    # bindings stripped from the coordinator and the group
                    if not self.strip_bindings(name, z, t, target, shape, live, coordinator):
                        continue
                bound = key in live and (not shaped or shape["cluster"] in live[key])
                if bound:
                    self.step(f"{name} bind {t['id']} -> {target}", "ok", "bound in the mesh")
                    continue
                ask = {"from": t["id"], "to": target}
                if shaped:
                    ask["clusters"] = [shape["cluster"]]
                if not self.check:
                    try:
                        out = z.request("device/bind", ask, timeout=60)
                    except HouseError as exc:
                        # a binding is written into the CONTROL's own table over
                        # the air: a remote asleep or a bulb out of its socket
                        # answers nothing, and that waits (it does not fail the
                        # fleet's converge — W1's walk, 2026-09-01)
                        self.step(
                            f"{name} bind {t['id']} -> {target}",
                            "waiting",
                            self.unreachable_said(exc),
                        )
                        continue
                    got = ", ".join(out.get("clusters") or []) or "nothing"
                    failed = ", ".join(out.get("failed") or [])
                    self.step(
                        f"{name} bind {t['id']} -> {target}",
                        "changed",
                        f"bound: {got}" + (f" (refused: {failed})" if failed else ""),
                    )
                else:
                    self.step(f"{name} bind {t['id']} -> {target}", "changed", "bind in the mesh")
            wanted = {self.bind_key(x, c) for x in targets}
            for key in sorted(live):
                if key in wanted:
                    continue
                kind, _, ident = key.partition(":")
                mine = (kind == "group" and int(ident or 0) in ours) or (
                    kind == "device" and ident in by_ieee
                )
                if not mine:
                    self.step(
                        f"{name} bind {t['id']}",
                        "ok",
                        f"a binding to {key} the house does not name — the thing came with it, "
                        "left alone",
                    )
                    continue
                target = ours[int(ident)] if kind == "group" else by_ieee[ident]["id"]
                if not self.check:
                    try:
                        z.request("device/unbind", {"from": t["id"], "to": target}, timeout=60)
                    except HouseError as exc:
                        self.step(
                            f"{name} bind {t['id']} -> {target}",
                            "waiting",
                            self.unreachable_said(exc),
                        )
                        continue
                self.step(
                    f"{name} bind {t['id']} -> {target}", "changed", "unbound (no row names it)"
                )

    def strip_bindings(
        self, name: str, z: Z2M, t: dict, target: str, shape: dict, live: dict, coordinator
    ) -> bool:
        """The per-cluster bindings a shaped remote must NOT carry: on the
        group (only the shape's cluster stays) and on the coordinator (the
        converter's, which starve the group). False = the remote did not
        answer, the rest waits."""
        strip = set(shape["strip"])
        todo = []
        key = self.bind_key(target, {"groups": self._groups, "things": self._things})
        extra = (live.get(key) or set()) & strip
        if extra:
            todo.append((target, sorted(extra)))
        if coordinator:
            extra = (live.get(f"device:{coordinator}") or set()) & strip
            if extra:
                todo.append(("Coordinator", sorted(extra)))
        for to, clusters in todo:
            self.step(
                f"{name} bind {t['id']} -> {to}",
                "changed",
                f"unbound {', '.join(clusters)} (a {shape['cluster']} binding carries them)",
            )
            if self.check:
                continue
            try:
                z.request(
                    "device/unbind", {"from": t["id"], "to": to, "clusters": clusters}, timeout=60
                )
            except HouseError as exc:
                self.step(f"{name} bind {t['id']} -> {to}", "waiting", self.unreachable_said(exc))
                return False
            if to == "Coordinator":
                live[f"device:{coordinator}"] -= set(clusters)
            else:
                live[key] -= set(clusters)
        return True

    def bind_key(self, target: str, c: dict) -> str | None:
        """What a `bind:` target is in the mesh: a room = its group's number,
        a thing = its address."""
        for g in c["groups"]:
            if g["area"]["id"] == target:
                return f"group:{g['number']}"
        for t in c["things"]:
            if t["id"] == target:
                return f"device:{t['ieee']}"
        return None

    def zigbee_strangers(self, name: str, z: Z2M, c: dict) -> None:
        """A thing in the mesh the house does not name. Never removed - the
        pairing is not ours to undo (a projection marks its own, and this one
        did not make it): it is REPORTED, with the one command that ends it."""
        known = {t["ieee"] for t in c["things"]}
        strangers = [
            d
            for d in z.devices
            if d.get("type") != "Coordinator" and d["ieee_address"] not in known
        ]
        if not strangers:
            return
        for d in strangers:
            what = d.get("definition") or {}
            self.step(
                f"{name} {d['ieee_address']}",
                "hand",
                f"paired, no row: {what.get('vendor', '?')} {what.get('model', '?')} "
                f"(as {d.get('friendly_name')}) — `regie pair --room <room>` writes its row",
            )

    @staticmethod
    def device_of(devices: list[dict], thing: dict, macs: dict | None = None) -> list[dict]:
        """The Home Assistant device(s) a row is: by its serial (Matter's
        `serial_<sn>` identifier, the device's own serial field, or an
        identifier value a domain reports - a cast speaker's UUID: the key
        of a device that carries no address at all, 0.6.2), else by
        its hardware address (a `mac` connection; for a Matter node, the
        address its diagnostics report - `macs`, by device id - since Home
        Assistant's Matter device carries none, and a bulb may carry no
        serial at all), else by its RADIO address (a Zigbee row's `ieee`: the
        bridge publishes it as its device's identifier, alone or behind the
        instance's prefix — `zigbee2mqtt_0x…`). Several devices for one row =
        a box that is several things to Home Assistant."""
        serial = thing.get("serial")
        if serial:
            for d in devices:
                ids = {tuple(i) for i in d.get("identifiers", []) if len(i) == 2}
                if (
                    ("matter", f"serial_{serial}") in ids
                    or d.get("serial_number") == serial
                    or any(v == serial for _, v in ids)
                ):
                    return [d]
            return []
        mac = (thing.get("mac") or "").lower()
        if mac:
            macs = macs or {}
            return [
                d
                for d in devices
                if ("mac", mac)
                in {(c[0], str(c[1]).lower()) for c in d.get("connections", []) if len(c) == 2}
                or macs.get(d["id"]) == mac
            ]
        ieee = str(thing.get("ieee") or "").lower()
        if not ieee:
            return []
        return [
            d
            for d in devices
            if any(
                v == ieee or v.endswith(f"_{ieee}")
                for v in (str(i[1]).lower() for i in d.get("identifiers", []) if len(i) == 2)
            )
        ]

    @staticmethod
    def matter_diagnostics(ws, devices: list[dict]) -> dict[str, dict]:
        """Every Matter node's diagnostics, by device id (one call each -
        local, the brain's own server): its hardware address, its fabrics."""
        out: dict[str, dict] = {}
        for d in devices:
            if not any(len(i) == 2 and i[0] == "matter" for i in d.get("identifiers", [])):
                continue
            try:
                out[d["id"]] = ws.call("matter/node_diagnostics", device_id=d["id"]) or {}
            except HouseError:
                continue
        return out

    @staticmethod
    def matter_macs(ws, devices: list[dict]) -> dict[str, str]:
        """The hardware address of every Matter node, from its diagnostics."""
        return {
            k: str(v["mac_address"]).lower()
            for k, v in Conductor.matter_diagnostics(ws, devices).items()
            if v.get("mac_address")
        }

    @staticmethod
    def other_fabrics(diag: dict) -> list[dict]:
        ours = diag.get("active_fabric_index")
        return [f for f in (diag.get("active_fabrics") or []) if f.get("fabric_index") != ours]

    def evict(self, ws, thing: dict, dev: dict, diag: dict) -> None:
        """The brain as the only controller (house `matter.only_fabric`):
        every other fabric on a node the house names is removed."""
        others = self.other_fabrics(diag)
        if not others:
            return
        names = ", ".join(fabric_label(f) for f in others)
        self.step(f"device {thing['id']}", "changed", f"evict {names} — the brain's fabric only")
        if self.check:
            return
        for f in others:
            ws.call(
                "matter/remove_matter_fabric", device_id=dev["id"], fabric_index=f["fabric_index"]
            )

    def entry_devices(self, devices: list[dict], thing: dict) -> list[dict]:
        """The devices under the config entries a row made (one entry per
        integration it names, the nth entry of a domain for the nth row —
        the entries step's own order). An entry that holds several devices
        says nothing about which is the row's: skipped, the serial or the
        hardware address must say."""
        out: list[dict] = []
        for domain in self.house.integrations(thing):
            rows = self.house.rows_of(domain)
            have = self.domain_entries(domain)
            n = rows.index(thing) if thing in rows else -1
            if n < 0 or n >= len(have):
                continue
            mine = [d for d in devices if have[n]["entry_id"] in (d.get("config_entries") or [])]
            if len(mine) == 1:
                out.append(mine[0])
        return out

    def devices(self, ws) -> None:
        """A row's device, roomed and named by the row (a device's room):
        found by its serial (a Matter thing), by its hardware address (a
        network thing), by its radio address (a Zigbee thing), or as the one
        device under a config entry the row made; the entity of the thing's
        own domain renamed to the house's id when the row is one device with
        one such entity. A row whose device is not there yet is skipped in
        silence: the entry step (or the walk) says what waits.

        The rename is what makes a scene able to reach a bulb, and a Zigbee
        thing needs it most: Home Assistant mints an entity id ONCE, when the
        bridge first announces the device — at the interview, while its name
        is still its radio address. `pair` renames it a moment later and the
        DEVICE follows, but an entity id is the user's, so `light.0x8c8b…`
        stays. (A Matter thing is commissioned already named, which is why
        those came out right and these did not.)"""
        rows = [
            t
            for t in self.house.things
            if t.get("serial") or t.get("mac") or t.get("ieee") or self.house.integrations(t)
        ]
        if not rows:
            return
        devices = ws.call("config/device_registry/list") or []
        entities = ws.call("config/entity_registry/list") or []
        diags = self.matter_diagnostics(ws, devices) if self.house.has_pack("matter") else {}
        macs = {k: str(v["mac_address"]).lower() for k, v in diags.items() if v.get("mac_address")}
        for t in rows:
            found = self.device_of(devices, t, macs)
            if not found:
                found = self.entry_devices(devices, t)
            if not found:
                continue
            if self.house.matter_only_fabric():
                for dev in found:
                    if dev["id"] in diags:
                        self.evict(ws, t, dev, diags[dev["id"]])
            area_id = self.area_ids.get(t["area"])
            label = t.get("label") or t["id"]
            entity = self.house.entity(t)
            for dev in found:
                fields: dict = {}
                if area_id and dev.get("area_id") != area_id:
                    fields["area_id"] = area_id
                if (dev.get("name_by_user") or dev.get("name")) != label:
                    fields["name_by_user"] = label
                rename = None
                if entity and len(found) == 1:
                    domain = entity.split(".", 1)[0]
                    mine = [
                        e
                        for e in entities
                        if e.get("device_id") == dev["id"]
                        and e["entity_id"].split(".", 1)[0] == domain
                        and not e.get("entity_category")
                        and not e.get("disabled_by")
                    ]
                    if len(mine) == 1 and mine[0]["entity_id"] != entity:
                        rename = (mine[0]["entity_id"], entity)
                # every OTHER entity of the thing's device wears the thing's
                # name too (0.17): <domain>.<id>_<what> — the lux a motion
                # thing reports, a wheel's nine switches by endpoint, a
                # battery. Derived from the registry's own unique id and the
                # entity's own name, never from Home Assistant's `_2` counter.
                more: list[tuple[str, str]] = []
                if len(found) == 1:
                    taken = {e["entity_id"] for e in entities}
                    for e in entities:
                        if e.get("device_id") != dev["id"] or e.get("disabled_by"):
                            continue
                        if (rename and e["entity_id"] == rename[0]) or e["entity_id"] == entity:
                            continue
                        suffix = entity_suffix(e)
                        if not suffix:
                            continue
                        want = f"{e['entity_id'].split('.', 1)[0]}.{t['id']}_{suffix}"
                        if want == e["entity_id"]:
                            continue
                        if want in taken:
                            self.step(
                                f"device {t['id']} {e['entity_id']}",
                                "waiting",
                                f"{want} is another entity's — left as it is",
                            )
                            continue
                        taken.add(want)
                        more.append((e["entity_id"], want))
                name = f"device {t['id']}" + (f" ({dev.get('name')})" if len(found) > 1 else "")
                if not fields and not rename and not more:
                    where = f"{label} in {t['area']}" if area_id else label
                    self.step(
                        name, "ok", where + (f" · {entity}" if entity and len(found) == 1 else "")
                    )
                    continue
                what = []
                if "area_id" in fields:
                    what.append(f"room {t['area']}")
                if "name_by_user" in fields:
                    what.append(f"name {label}")
                if rename:
                    what.append(f"{rename[0]} -> {rename[1]}")
                for was, want in more:
                    what.append(f"{was} -> {want}")
                self.step(name, "changed", " · ".join(what))
                if self.check:
                    continue
                if fields:
                    ws.call("config/device_registry/update", device_id=dev["id"], **fields)
                for was, want in ([rename] if rename else []) + more:
                    ws.call("config/entity_registry/update", entity_id=was, new_entity_id=want)

    def plumbing(self, ws) -> None:
        """The lighting pack's group entities are the vocabulary's plumbing
        (a scene's target, an effect's) — hidden from the UI so a room shows
        its real lights once (a person saw five lights where three bulbs
        hung). Idempotent; a group a person unhid stays theirs? No: the
        groups are the engine's, hidden every time."""
        groups = self.house.group_entities()
        if not groups:
            return
        entities = ws.call("config/entity_registry/list") or []
        for e in entities:
            if e["entity_id"] not in groups or e.get("hidden_by"):
                continue
            self.step("plumbing", "changed", f"hide {e['entity_id']} (a group, not a light)")
            if not self.check:
                ws.call("config/entity_registry/update", entity_id=e["entity_id"], hidden_by="user")

    def palette_slots(self) -> None:
        """A store whose name the file now carries is freed (0.23 → 0.24): the
        family kept a palette on the phone, `regie palette pull` wrote it, the
        file has it — the store's name is emptied, the select still offers the
        named one (the file's)."""
        from . import palette as palette_mod

        if not self.house.has_pack("palette"):
            return

        def read(e):
            status, state = self.ha.get(f"/api/states/{e}")
            return state if status == 200 else None

        for prefix in palette_mod.freed_stores(self.house, read):
            self.step("palette", "changed", f"store {prefix} freed — the file carries it now")
            if not self.check:
                self.ha.post(
                    "/api/services/input_text/set_value",
                    {"entity_id": f"input_text.{prefix}_name", "value": ""},
                )

    def orphans(self, ws) -> None:
        """A package rendered once and gone leaves its entities in the registry
        as ghosts — `unavailable`, restored, never coming back: the motion
        lights of 0.16's shape after 0.17, a parking room's occupancy. Every
        id the house mints carries the `regie_` unique id, so its ghosts are
        told from a person's: one of ours that reads unavailable (or has no
        state at all) AND that no rendered package names any more is removed
        (0.17, home.md 13.34 g). The second half is 0.26.1's: a role group
        whose only bulb is unplugged reads unavailable too — the office's
        night group went with the ghosts and its hands aimed at nothing."""
        entities = ws.call("config/entity_registry/list") or []
        rendered = self.rendered_unique_ids()
        gone = self.scripts_gone()
        for e in entities:
            uid = str(e.get("unique_id") or "")
            if e.get("platform") == "script":
                # a YAML script's registry row is keyed on its object id, never
                # a `regie_` unique id (0.26.2): ours are the ones the manifest
                # remembers rendering and renders no more — a look a room lost
                if uid not in gone:
                    continue
                why = "a look the house no longer has"
            elif not uid.startswith("regie_") or uid in rendered:
                continue
            else:
                why = "nothing renders it now"
            status, state = self.ha.get(f"/api/states/{e['entity_id']}")
            if status == 200 and (state or {}).get("state") != "unavailable":
                continue
            self.step("orphan", "changed", f"{e['entity_id']} removed ({why})")
            if not self.check:
                ws.call("config/entity_registry/remove", entity_id=e["entity_id"])

    def scripts_gone(self) -> set[str]:
        """The scripts the manifest remembers rendering and renders no more —
        the render keeps that memory (0.26.2), the conductor acts on it."""
        path = self.root / MANIFEST
        if not path.is_file():
            return set()
        try:
            return set(json.loads(path.read_text(encoding="utf-8")).get("scripts_gone", []))
        except (OSError, ValueError):
            return set()

    def rendered_unique_ids(self) -> set[str]:
        """Every `regie_` unique id the rendered packages carry: what the house
        renders NOW — an entity of ours that reads unavailable but is still in
        a package is not a ghost, it is waiting for its thing."""
        out: set[str] = set()
        packages = self.root / "home-assistant" / "packages"
        if not packages.is_dir():
            return out
        for f in sorted(packages.glob("*.yaml")):
            for m in UNIQUE_ID_RE.finditer(f.read_text()):
                out.add(m.group(1))
        return out

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
            and create.get("agent_ids")
            == [
                "backup.local"  # no-environment: ok
            ]  # no-environment: ok — Home Assistant's own local backup agent, not a host
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
                "agent_ids": [
                    "backup.local"  # no-environment: ok
                ],  # no-environment: ok — Home Assistant's own local backup agent, not a host
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

    def skin(self, ws) -> None:
        """The house's theme as THE default, for everyone who has not chosen one
        of their own — Home Assistant keeps a default per light mode, so both
        are set to it. A theme the brain has not read yet WAITS (0.7.3's rule):
        naming a theme that is not loaded is how you hand a family a blank UI."""
        want = self.house.theme()
        if not want:
            return
        name = want["name"]
        state = ws.call("frontend/get_themes")
        if name not in (state.get("themes") or {}):
            self.step("theme", "waiting", f"{name} not loaded — themes/ is read at a restart")
            return
        if state.get("default_theme") == name and state.get("default_dark_theme") == name:
            self.step("theme", "ok", f"{name}, light and dark")
            return
        self.step("theme", "changed", f"default → {name}, light and dark")
        if self.check:
            return
        status, body = self.ha.post(
            "/api/services/frontend/set_theme", {"name": name, "name_dark": name}
        )
        if status != 200:
            raise HouseError(f"theme {name}: {status} {body}")

    def resources(self, ws) -> None:
        """The cards as LOVELACE RESOURCES (0.13.2): what the frontend loads
        after its own bootstrap - after the scoped-registry polyfill that makes
        an element defined too early invisible. One resource per card, keyed on
        the file's path; its version rides the URL, so a bump is a new URL and
        the old one is rewritten. A house without the plan (or the palette)
        owns no such resource. The plan's card (0.13) and, since 0.25, the
        product's own « L'Atelier des palettes »."""
        from . import __version__
        from .floorplan import CARD_URL

        self._resource(
            ws, "plan", CARD_URL, self.house.plan() is not None, "the house draws no plan"
        )
        self._resource(
            ws,
            "atelier",
            f"/local/regie-atelier.js?v={__version__}",
            self.house.has_pack("palette") and self.house.controls()["palette"],
            "the house keeps no palette",
        )

    def _resource(self, ws, name: str, url: str, want: bool, why_not: str) -> None:
        base = url.split("?")[0]
        have = [
            r
            for r in (ws.call("lovelace/resources") or [])
            if (r.get("url") or "").split("?")[0] == base
        ]
        if not want:
            for r in have:
                self.step(f"resource {name}", "changed", f"{r['url']} removed — {why_not}")
                if not self.check:
                    ws.call("lovelace/resources/delete", resource_id=r["id"])
            return
        if have and have[0].get("url") == url and have[0].get("type") == "module":
            self.step(f"resource {name}", "ok", url)
            return
        if have:
            self.step(f"resource {name}", "changed", f"{have[0]['url']} → {url}")
            if not self.check:
                ws.call(
                    "lovelace/resources/update",
                    resource_id=have[0]["id"],
                    res_type="module",
                    url=url,
                )
            return
        self.step(f"resource {name}", "changed", f"{url} (a page reload picks it up)")
        if not self.check:
            ws.call("lovelace/resources/create", res_type="module", url=url)

    def workbench(self, ws) -> None:
        """THE PLAN'S WORKBENCH (0.14): a storage dashboard, admins only - the
        editor's draft. Since 0.16 THE DRAFT FOLLOWS THE FILES at every
        converge, unless it holds edits not yet pulled: then the converge says
        so and keeps the person's work (`hand` once the files moved too). The
        other way is never automatic: `regie plan pull` writes the draft into
        the room files, by hand; `regie plan push` re-seeds it on purpose."""
        from .dash import link
        from .plan import WORKBENCH, seed, sync

        if self.house.plan() is None:
            return
        # the dashboards collection lists under `/list` (the generic storage
        # collection); only the resources collection answers on its bare name
        # (read at the first converge, 2026-09-03: `unknown_command`)
        dashboards = ws.call("lovelace/dashboards/list") or []
        have = [d for d in dashboards if d.get("url_path") == WORKBENCH]
        if not have:
            self.step("workbench", "changed", f"/{WORKBENCH} created and seeded from the files")
            if self.check:
                return
            ws.call(
                "lovelace/dashboards/create",
                url_path=WORKBENCH,
                title=self.house.labels.ui.workbench,
                icon="mdi:pencil-ruler",
                require_admin=True,
                show_in_sidebar=True,
            )
            seed(ws, self.house, self.root, link)
            return
        try:
            draft = ws.call("lovelace/config", url_path=WORKBENCH)
        except HouseError:
            draft = None  # a dashboard holding no config yet: nothing to keep
        state, detail, reseed = sync(self.house, self.root, draft, link)
        self.step("workbench", state, detail)
        if reseed and not self.check:
            seed(ws, self.house, self.root, link)

    # --- the run ----------------------------------------------------------------
    def run(self) -> list[Step]:
        if not self.onboarding():
            return self.steps
        self.wait_for_running()
        with self.ha.ws() as ws:
            self.tokens(ws)
            self.http(ws)
        if self.restarting:
            self.wait_for_trial()
            self.wait_for_running()
            with self.ha.ws() as ws:
                self.http(ws)  # the trial is running: prove the door, promote
        with self.ha.ws() as ws:
            self.registries(ws)
            self.backup(ws)
        self.knobs()
        self.palette_slots()
        self.mqtt()
        self.matter()
        self.thread()
        self.zigbee()
        with self.ha.ws() as ws:
            self.credentials(ws)
            self.entries(ws)
            self.devices(ws)
            self.plumbing(ws)
            self.orphans(ws)
            self.skin(ws)
            self.resources(ws)
            self.workbench(ws)
        return self.steps


def apply(house: House, secrets: dict, root: Path, ha: HomeAssistant, check: bool) -> list[Step]:
    missing = [
        n for n in ("owner_password", "backup_password", "mqtt_password_home") if n not in secrets
    ]
    if missing:
        raise HouseError("missing secrets: " + ", ".join(missing))
    return Conductor(house, secrets, root, ha, check).run()


def link(
    house: House,
    secrets: dict,
    root: Path,
    ha: HomeAssistant,
    thing_id: str,
    *,
    prompt: Callable[[str, dict], str],
    on_url: Callable[[str], None],
    wait_external: Callable[[str], bool],
) -> Outcome:
    """`regie link <thing>` — the flow walked with a person at hand: the PIN
    typed from the screen, the consent given in a browser. The brain must
    already be furnished (`apply` ran once): the conductor's token is on disk."""
    thing = house.thing(thing_id)
    domains = house.integrations(thing)
    if not domains:
        raise HouseError(f"{thing_id}: no integration on its row — nothing to link")
    c = Conductor(house, secrets, root, ha)
    ha.token = c.session_token()
    with ha.ws() as ws:
        c.credentials(ws)
        pending = [(d, c.discovered(ws, d, thing)) for d in domains if not c.domain_entries(d)]
    if not pending:
        return Outcome("ok", f"{', '.join(domains)}: already set up")
    last = Outcome("ok", "")
    for domain, flow_id in pending:
        last = walk(
            ha,
            domain,
            c.thing_answers(thing),
            flow_id=flow_id,
            prompt=prompt,
            on_url=on_url,
            wait_external=wait_external,
            verb=f"regie link {thing_id}",
        )
        last.detail = f"{domain}: {last.detail}"
        if last.state not in ("changed", "ok"):
            return last
    return last


def binding_shape(thing: dict) -> dict | None:
    """How a remote of this model binds to a room, when its gesture profile
    says (hands.PROFILES[...]["binding"]); None = the mesh's default."""
    from .hands import profile_of

    found = profile_of(thing)
    return (found[1].get("binding") if found else None) or None


def entity_suffix(entity: dict) -> str | None:
    """What a thing's other entity is called under the thing's name: a Matter
    switch by its ENDPOINT (a wheel's nine, a dual button's two — the number a
    gesture profile speaks), anything else by its own name, slugged
    (illuminance, battery, identify_1). None = an entity with no name of its
    own: left alone."""
    uid = str(entity.get("unique_id") or "")
    if entity.get("platform") == "matter" and "-GenericSwitch-" in uid:
        endpoint = uid.split("-MatterNodeDevice-", 1)[-1].split("-", 1)[0]
        return endpoint if endpoint.isdigit() else None
    slug = re.sub(r"[^a-z0-9]+", "_", str(entity.get("original_name") or "").lower()).strip("_")
    return slug or None


def matter_devices(ws) -> list[dict]:
    """Home Assistant's devices that are Matter nodes (not bridged children)."""
    out = []
    for d in ws.call("config/device_registry/list") or []:
        ids = [i for i in d.get("identifiers", []) if len(i) == 2 and i[0] == "matter"]
        if ids and not d.get("via_device_id"):
            out.append(d)
    return out


def pair_matter(
    house: House,
    secrets: dict,
    root: Path,
    ha: HomeAssistant,
    *,
    room: str,
    role: str | None = None,
    at: str | None = None,
    code: str | None = None,
    serial: str | None = None,
    thing_id: str | None = None,
    only_fabric: bool = False,
) -> dict:
    """`regie pair --matter` — the walk's Matter half. The commissioning
    itself is the phone's (a fresh thing: Bluetooth, the phone puts it on the
    Wi-Fi, the brain's fabric takes it) or the code's (`--code`: a thing
    another controller shares, or already on the network — the server
    commissions it over IP, no phone). Then the node is ADOPTED: read from
    Home Assistant (vendor, model, serial, its hardware address from the
    node's diagnostics) into a proposed row keyed on its serial - or on its
    hardware address when it reports no serial (a Govee bulb does not) - the
    room is the session, the role and the place are the flags, the name is
    generated. `only_fabric`: every other fabric on the node (the phone's
    commissioning stack keeps one of its own) is removed - the brain's is the
    only controller. Nothing is written: the row is printed for the house
    file; `apply` rooms and names the device from it."""
    if not house.has_pack("matter"):
        raise HouseError("the house carries no `matter` pack — add it to packs: first")
    area = next((a for a in house.areas if a["id"] == room), None)
    if area is None:
        raise HouseError(f"room {room!r}: no such area in home.yml")
    if at and not role:
        raise HouseError("--at needs a --role (a place belongs to a role's layout)")
    known_serials = {t["serial"] for t in house.things if t.get("serial")}
    known_macs = {t["mac"].lower() for t in house.things if t.get("mac")}
    c = Conductor(house, secrets, root, ha)
    ha.token = c.session_token()
    with ha.ws() as ws:
        if code:
            ws.call("matter/commission", code=code, network_only=True)
        nodes = matter_devices(ws)
        macs = Conductor.matter_macs(ws, nodes)
        fresh = [
            d
            for d in nodes
            if d.get("serial_number") not in known_serials and macs.get(d["id"]) not in known_macs
        ]
        if serial:
            key = serial.lower()
            fresh = [
                d for d in fresh if d.get("serial_number") == serial or macs.get(d["id"]) == key
            ]
            if not fresh:
                raise HouseError(f"no Matter device with serial or address {serial!r} in the brain")
        if not fresh:
            raise HouseError(
                "no Matter device the house does not already name — commission one first "
                "(the phone: Settings › Devices › Add device › Matter; or --code)"
            )
        if len(fresh) > 1:
            lines = [
                f"  {d.get('manufacturer')} {d.get('model')} serial {d.get('serial_number')!r} "
                f"address {macs.get(d['id'])!r}"
                for d in sorted(fresh, key=lambda d: d.get("created_at") or 0)
            ]
            raise HouseError(
                f"{len(fresh)} Matter devices the house does not name — say which: "
                "--serial <serial or address>\n" + "\n".join(lines)
            )
        dev = fresh[0]
        if not dev.get("serial_number") and not macs.get(dev["id"]):
            raise HouseError(
                f"{dev.get('manufacturer')} {dev.get('model')}: no serial number and no hardware "
                "address in its diagnostics — the row cannot be keyed; not one the engine can adopt"
            )
        entities = [
            e
            for e in (ws.call("config/entity_registry/list") or [])
            if e.get("device_id") == dev["id"] and not e.get("entity_category")
        ]
        try:
            diag = ws.call("matter/node_diagnostics", device_id=dev["id"]) or {}
        except HouseError:
            diag = {}
        fabrics = diag.get("active_fabrics") or []
        ours = diag.get("active_fabric_index")
        others = [f for f in fabrics if f.get("fabric_index") != ours]
        evicted: list[dict] = []
        if only_fabric:
            for f in others:
                ws.call(
                    "matter/remove_matter_fabric",
                    device_id=dev["id"],
                    fabric_index=f["fabric_index"],
                )
                evicted.append(f)
            others = []
    domains = {e["entity_id"].split(".", 1)[0] for e in entities}
    kind = next((k for k, d in KIND_OF_DOMAIN.items() if d in domains), None) or "device"
    row: dict = {}
    # the name: <room>_<role>_<at> in a layout, <room>_<role>_<n> otherwise -
    # never <room>_<role> itself, that is the ROLE's entity (the lighting
    # pack's group every scene aims at; found live: the rename collided)
    if thing_id:
        row["id"] = thing_id
    elif role and at:
        row["id"] = f"{room}_{role}_{at}"
    elif role:
        n = len(house.roles_in(room).get(role, [])) + 1
        row["id"] = f"{room}_{role}_{n}"
    else:
        n = sum(1 for t in house.things if t["area"] == room and t["kind"] == kind) + 1
        row["id"] = f"{room}_{kind}_{n}"
    row.update({"area": room, "kind": kind, "via": "matter"})
    if dev.get("manufacturer"):
        row["vendor"] = dev["manufacturer"]
    if dev.get("model"):
        row["model"] = dev["model"]
    if dev.get("serial_number"):
        row["serial"] = dev["serial_number"]
    mac = diag.get("mac_address")
    if mac:
        row["mac"] = mac.lower()
    if role:
        row["role"] = role
    if at:
        row["at"] = at
    # a light ends the adoption in a known state: on bright, a breath, off —
    # the blink says WHICH bulb was adopted, and the walk found live that a
    # fresh H6008 lights up while reporting off (the store, not the LED):
    # the two commands leave the bulb dark and the brain right
    light = next((e["entity_id"] for e in entities if e["entity_id"].startswith("light.")), None)
    if light:
        ha.post("/api/services/light/turn_on", {"entity_id": light, "brightness_pct": 100})
        time.sleep(1.5)
        ha.post("/api/services/light/turn_off", {"entity_id": light})
    row["_found"] = {
        "device": dev.get("name_by_user") or dev.get("name"),
        "entities": sorted(e["entity_id"] for e in entities),
        "addresses": diag.get("ip_addresses") or diag.get("ip_adresses") or [],
        "other_fabrics": [fabric_label(f) for f in others],
        "evicted": [fabric_label(f) for f in evicted],
    }
    return row


# --- the walk's Zigbee half (home.md 5.1, decision H13) ----------------------
# What a thing IS comes from its own interview: Zigbee2MQTT hands over the
# definition's `exposes`, the thing's capability list. The first of these its
# exposes answer to is its kind - a composite type before a single property,
# because a light that also reports power is a light.
KIND_BY_EXPOSE_TYPE = (
    ("light", "light"),
    ("switch", "plug"),
    ("cover", "cover"),
    ("lock", "lock"),
    ("climate", "thermostat"),
)
KIND_BY_PROPERTY = (("occupancy", "motion"), ("contact", "door"), ("action", "remote"))
SENSOR_PROPERTIES = {
    "temperature",
    "humidity",
    "pressure",
    "illuminance",
    "pm25",
    "co2",
    "voc",
    "water_leak",
    "smoke",
    "vibration",
    "battery",
}
# the clusters a control SENDS: a thing carrying one of them as an output can
# be bound to a bulb or a group and drive it with the brain down (home.md 4.1)
CONTROL_CLUSTERS = {"genOnOff", "genLevelCtrl", "lightingColorCtrl", "genScenes"}


def zigbee_kind(exposes: list[dict]) -> str:
    types = {e.get("type") for e in exposes}
    names = {e.get("name") for e in exposes if e.get("name")}
    for expose_type, kind in KIND_BY_EXPOSE_TYPE:
        if expose_type in types:
            return kind
    for prop, kind in KIND_BY_PROPERTY:
        if prop in names:
            return kind
    if names & SENSOR_PROPERTIES:
        return "sensor"
    return "device"


def zigbee_bindable(device: dict) -> bool:
    for ep in (device.get("endpoints") or {}).values():
        if CONTROL_CLUSTERS & set((ep.get("clusters") or {}).get("output") or []):
            return True
    return False


def pair_zigbee(
    house: House,
    secrets: dict,
    root: Path,
    ha: HomeAssistant,
    *,
    room: str,
    role: str | None = None,
    at: str | None = None,
    thing_id: str | None = None,
    coordinator: str | None = None,
    seconds: int = 254,
    adopt: str | None = None,
    anywhere: bool = False,
    say: Callable[[str], None] = lambda _line: None,
) -> dict:
    """`regie pair --room <room>` — the walk, one thing at a time.

    The room is the session: the join window opens on the radio, the human
    holds the thing's reset button, and everything the thing says about
    itself is read from its own interview (its vendor, its model, its
    capability list) instead of typed. The name is generated, the row is
    PRINTED - nothing is written: the row goes into the house's file, and
    `apply` is what makes the mesh match it (the name, the room's group, the
    bindings). The window is closed again whatever happens.

    `adopt` takes a thing already in the mesh that no row names (an
    interrupted walk, a re-run) without asking anyone to press anything.
    """
    area = next((a for a in house.areas if a["id"] == room), None)
    if area is None:
        raise HouseError(f"room {room!r}: no such area in home.yml")
    if at and not role:
        raise HouseError("--at needs a --role (a place belongs to a role's layout)")
    coordinators = house.coordinators()
    if not coordinators:
        raise HouseError("the house has no zigbee.coordinators — no radio to walk")
    if coordinator:
        radio = next((c for c in coordinators if c["id"] == coordinator), None)
        if radio is None:
            raise HouseError(f"coordinator {coordinator!r}: no such radio in home.yml")
    else:
        radio = coordinators[0]
    known = {t["ieee"] for t in house.things if t.get("ieee")}

    with Z2M(f"ws://127.0.0.1:{radio['frontend_port']}/api") as z:
        if not z.online:
            raise HouseError(
                f"zigbee2mqtt {radio['id']} is not online — it answers, but the radio does not "
                "(check the unit's log)"
            )
        strangers = [
            d
            for d in z.devices
            if d.get("type") != "Coordinator" and d["ieee_address"] not in known
        ]
        if adopt:
            dev = next(
                (d for d in strangers if adopt in (d["ieee_address"], d.get("friendly_name"))),
                None,
            )
            if dev is None:
                raise HouseError(
                    f"{adopt!r} is not a thing in the mesh that the house leaves unnamed"
                )
            ieee = dev["ieee_address"]
        else:
            if strangers:
                say(
                    f"note: {len(strangers)} thing(s) already in the mesh with no row "
                    f"({', '.join(d['ieee_address'] for d in strangers)}) — `--adopt <address>` "
                    "writes a row for one without a new join"
                )
            ieee = _join(z, known, seconds, say, anywhere)
            dev = z.device(ieee)
        if dev is None:
            raise HouseError(f"{ieee}: interviewed, but the bridge does not list it yet")

        definition = dev.get("definition") or {}
        kind = zigbee_kind(definition.get("exposes") or [])
        row: dict = {}
        if thing_id:
            row["id"] = thing_id
        elif role and at:
            row["id"] = f"{room}_{role}_{at}"
        elif role:
            n = len(house.roles_in(room).get(role, [])) + 1
            row["id"] = f"{room}_{role}_{n}"
        else:
            n = sum(1 for t in house.things if t["area"] == room and t["kind"] == kind) + 1
            row["id"] = f"{room}_{kind}_{n}"
        row.update({"area": room, "kind": kind, "via": "zigbee"})
        if definition.get("vendor"):
            row["vendor"] = definition["vendor"]
        if definition.get("model"):
            row["model"] = definition["model"]
        row["ieee"] = ieee
        if radio["id"] != coordinators[0]["id"]:
            row["coordinator"] = radio["id"]
        if role:
            row["role"] = role
        if at:
            row["at"] = at
        # a control is bound to the room by default (home.md 5.1): its
        # commands then travel inside the mesh, and the wall switch keeps
        # working when the brain is down
        if kind != "light" and zigbee_bindable(dev):
            row["bind"] = [room]
        # the same courtesy as the Matter half: a light says which one it is,
        # and ends dark and in sync
        if kind == "light":
            z.publish(f"{dev.get('friendly_name') or ieee}/set", {"state": "ON", "brightness": 254})
            time.sleep(1.5)
            z.publish(f"{dev.get('friendly_name') or ieee}/set", {"state": "OFF"})
        row["_found"] = {
            "name": dev.get("friendly_name"),
            "description": definition.get("description"),
            "power": dev.get("power_source"),
            "type": dev.get("type"),
            "supported": dev.get("supported"),
            "exposes": sorted(
                {e.get("name") or e.get("type") for e in (definition.get("exposes") or [])}
            ),
            "bindable": zigbee_bindable(dev),
        }
        return row


def _join(
    z: Z2M, known: set, seconds: int, say: Callable[[str], None], anywhere: bool = False
) -> str:
    """Open the window and follow `bridge/event` until one thing the house
    does not name finishes its interview. Returns its address. The window is
    the coordinator's alone unless `anywhere` (0.19.1)."""
    say(
        f"the join window is open for {seconds} s"
        + ("" if anywhere else " on the coordinator's radio alone")
        + " — reset the thing now (a bulb: the switch off/on the number of times its manual "
        "says; a remote: hold its pairing button until it blinks)"
    )
    end = time.monotonic() + seconds
    with z.join_window(seconds, None if anywhere else "Coordinator"):
        while time.monotonic() < end:
            got = z.recv(timeout=max(1, end - time.monotonic()))
            if got is None:
                continue
            topic, payload = got
            if topic != "bridge/event" or not isinstance(payload, dict):
                continue
            event, data = payload.get("type"), payload.get("data") or {}
            ieee = data.get("ieee_address")
            if event == "device_joined":
                say(f"joined: {ieee} — interviewing (this takes a few seconds)…")
            elif event == "device_interview":
                status = data.get("status")
                if status == "started":
                    continue
                if status == "failed":
                    say(
                        f"interview FAILED for {ieee} — leave it powered and close to the "
                        "coordinator; it usually retries by itself"
                    )
                    continue
                definition = data.get("definition") or {}
                what = f"{definition.get('vendor', '?')} {definition.get('model', '?')}"
                if ieee in known:
                    say(f"{ieee} ({what}) re-joined — the house already names it; still waiting")
                    continue
                say(f"interviewed: {what} — {definition.get('description') or 'no description'}")
                return ieee
    raise HouseError(
        f"nothing new joined in {seconds} s — the window is closed again. "
        "Reset the thing first, then run the walk (some things only join in the first "
        "seconds after a reset)"
    )


def fabric_label(f: dict) -> str:
    return f"{f.get('vendor_name') or f.get('vendor_id')} (fabric {f.get('fabric_index')})"


# a thing's kind from the entities its device carries (the first that matches)
KIND_OF_DOMAIN = {
    "light": "light",
    "switch": "plug",
    "cover": "cover",
    "lock": "lock",
    "climate": "thermostat",
    "binary_sensor": "sensor",
    "sensor": "sensor",
}


def summary(steps: list[Step], check: bool) -> str:
    changed = sum(1 for s in steps if s.state in ("changed", "would"))
    ok = sum(1 for s in steps if s.state == "ok")
    hand = sum(1 for s in steps if s.state == "hand")
    waiting = sum(1 for s in steps if s.state == "waiting")
    verb = "would change" if check else "changed"
    out = f"apply: {changed} {verb}, {ok} ok"
    if hand:
        out += f", {hand} by hand"
    if waiting:
        out += f", {waiting} waiting"
    return out
