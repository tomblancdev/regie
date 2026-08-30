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

CLIENT_NAME = "regie"
MATTER_URL = "ws://localhost:5580/ws"  # the server beside the brain (pack matter)
HTTP_META = ("created_at", "error", "error_message")
ENTRIES = "/api/config/config_entries/entry"
MARKS = {"ok": "=", "changed": "+", "would": "?", "hand": "!", "waiting": "~"}


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
                        ws.call(
                            "config/area_registry/update",
                            area_id=found["area_id"],
                            name=a["label"],
                            aliases=wanted,
                            floor_id=floor_id,
                        )
                    continue
            if live:
                taken.add(live["area_id"])
                self.area_ids[a["id"]] = live["area_id"]
                if (
                    live["name"] != a["label"]
                    or (live.get("floor_id") or None) != floor_id
                    or set(live.get("aliases", [])) != set(wanted)
                ):
                    self.step(f"area {a['id']}", "changed", f"update {a['label']}")
                    if not self.check:
                        ws.call(
                            "config/area_registry/update",
                            area_id=live["area_id"],
                            name=a["label"],
                            aliases=wanted,
                            floor_id=floor_id,
                        )
                else:
                    self.step(f"area {a['id']}", "ok", a["label"])
                continue
            self.step(f"area {a['id']}", "changed", f"create {a['label']}")
            if not self.check:
                payload = {"name": a["label"], "aliases": wanted}
                if floor_id:
                    payload["floor_id"] = floor_id
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
            shown = current[:5] if entity.startswith("input_datetime.") else current
            if entity not in marks:
                self.step(name, "changed", f"seed {k['value']} (was {shown})")
                if not self.check:
                    domain, service = k["action"].split("/")
                    st, body = self.ha.post(
                        f"/api/services/{domain}/{service}", {"entity_id": entity, **k["data"]}
                    )
                    if st != 200:
                        raise HouseError(f"{entity}: {st} {body}")
                    marks[entity] = k["value"]
                continue
            if shown == k["value"]:
                self.step(name, "ok", shown)
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

    @staticmethod
    def device_of(devices: list[dict], thing: dict, macs: dict | None = None) -> list[dict]:
        """The Home Assistant device(s) a row is: by its serial (Matter's
        `serial_<sn>` identifier, or the device's own serial field), else by
        its hardware address (a `mac` connection; for a Matter node, the
        address its diagnostics report - `macs`, by device id - since Home
        Assistant's Matter device carries none, and a bulb may carry no
        serial at all). Several devices for one row = a box that is several
        things to Home Assistant."""
        serial = thing.get("serial")
        if serial:
            for d in devices:
                ids = {tuple(i) for i in d.get("identifiers", []) if len(i) == 2}
                if ("matter", f"serial_{serial}") in ids or d.get("serial_number") == serial:
                    return [d]
            return []
        mac = (thing.get("mac") or "").lower()
        if not mac:
            return []
        macs = macs or {}
        return [
            d
            for d in devices
            if ("mac", mac)
            in {(c[0], str(c[1]).lower()) for c in d.get("connections", []) if len(c) == 2}
            or macs.get(d["id"]) == mac
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
        network thing), or as the one device under a config entry the row
        made; the entity of the thing's own domain renamed to the house's id
        when the row is one device with one such entity. A row whose device
        is not there yet is skipped in silence: the entry step (or the walk)
        says what waits."""
        rows = [
            t
            for t in self.house.things
            if t.get("serial") or t.get("mac") or self.house.integrations(t)
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
                name = f"device {t['id']}" + (f" ({dev.get('name')})" if len(found) > 1 else "")
                if not fields and not rename:
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
                self.step(name, "changed", " · ".join(what))
                if self.check:
                    continue
                if fields:
                    ws.call("config/device_registry/update", device_id=dev["id"], **fields)
                if rename:
                    ws.call(
                        "config/entity_registry/update",
                        entity_id=rename[0],
                        new_entity_id=rename[1],
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
        self.mqtt()
        self.matter()
        with self.ha.ws() as ws:
            self.credentials(ws)
            self.entries(ws)
            self.devices(ws)
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
    row["_found"] = {
        "device": dev.get("name_by_user") or dev.get("name"),
        "entities": sorted(e["entity_id"] for e in entities),
        "addresses": diag.get("ip_addresses") or diag.get("ip_adresses") or [],
        "other_fabrics": [fabric_label(f) for f in others],
        "evicted": [fabric_label(f) for f in evicted],
    }
    return row


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
