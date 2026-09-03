"""The conductor against a fake Home Assistant: the few REST and websocket
calls it makes, answered from an in-memory state that behaves like the
real thing on the points that matter (onboarding refuses twice, registries
key on aliases, a flow walks its form, a discovered flow is continued, a
consent is an external step, a PIN is a form, the backup config compares)."""

import json
import re
from contextlib import contextmanager

import pytest

from regie.apply import apply, link, pair_matter, summary
from regie.apply import probe as real_probe  # bound before the fixture below stubs it
from regie.errors import HouseError
from regie.flows import walk
from regie.ha import HomeAssistant
from regie.house import load_house

FLOWS = "/api/config/config_entries/flow"
OAUTH = ("home_connect", "smartthings")
IOT_CLASS = {
    "home_connect": "cloud_push",
    "smartthings": "cloud_push",
    "ipp": "local_polling",
    "mqtt": "local_push",
}


class FakeWs:
    def __init__(self, ha):
        self.ha = ha
        self.subs: dict[int, str] = {}

    def call(self, type_, **payload):
        return self.ha.ws_call(type_, payload)

    def subscribe(self, event_type):
        self.ha.n += 1
        self.subs[self.ha.n] = event_type
        return self.ha.n

    def events(self, subscription, timeout):
        # what the brain fired since: the person acted while the walker printed
        while self.ha.queue:
            yield self.ha.queue.pop(0)


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
        # the frontend's themes: what the brain has READ (a restart reads themes/)
        # and the default it hands anyone who has never chosen one
        self.themes: dict[str, dict] = {"temoin": {}}
        self.resources: list[dict] = []  # the lovelace resources (storage mode)
        self.default_theme = "default"
        self.default_dark_theme = None
        self.codes: dict[str, str] = {}
        self.tokens: dict[str, str] = {}  # access token -> kind
        self.llat: list[dict] = []
        self.floors: list[dict] = []
        self.areas: list[dict] = []
        self.entries: dict[str, list] = {}
        self.flows: dict[str, dict] = {}
        self.progress: list[dict] = []  # discovered flows (not started by a user)
        self.credentials: list[dict] = []
        self.consents: set[str] = set()
        self.queue: list[dict] = []
        self.off: set[str] = set()  # hosts that do not answer
        self.pin = "1234"
        self.pin_shown = 0
        self.backup_cfg = {
            "agents": {},
            "automatic_backups_configured": False,
            "create_backup": {"agent_ids": [], "password": None},
            "retention": {"copies": None, "days": None},
            "schedule": {"recurrence": "never", "time": None, "days": []},
        }
        self.n = 0
        self.devices: list[dict] = []  # the device registry
        self.entities: list[dict] = []  # the entity registry
        self.matter_down = False  # the Matter server does not answer on the loopback
        self.otbr_down = False  # the border router's REST API does not answer HA
        self.commissionable: dict[str, dict] = {}  # a pairing code -> the node it makes
        self.commissioned: list[str] = []
        self.states: dict[str, str] = {}  # the helpers' states (the knobs): unknown until set
        self.log: list[str] = []
        default = {"server_port": 8123, "use_x_forwarded_for": False, "trusted_proxies": []}
        self.http = {
            "stable": dict(default),
            "pending": None,
            "active": "stable",
            "default": default,
        }
        self.restarts = 0

    # --- the flows, per handler ---
    def _entry(self, domain, title, data):
        self.n += 1
        e = {
            "entry_id": f"e{self.n}",
            "domain": domain,
            "title": title,
            "source": "user",
            "state": "loaded",
            "_data": data,
        }
        self.entries.setdefault(domain, []).append(e)
        return e

    def _create(self, fid, flow, title, data=None):
        e = self._entry(flow["handler"], title, data or {})
        self.flows.pop(fid, None)
        self.progress = [p for p in self.progress if p["flow_id"] != fid]
        return 200, {"type": "create_entry", "flow_id": fid, "title": title, "result": e}

    def _form(self, fid, step, schema, errors=None):
        return 200, {
            "type": "form",
            "flow_id": fid,
            "step_id": step,
            "data_schema": schema,
            "errors": errors or {},
        }

    def _start(self, fid, flow):
        d = flow["handler"]
        if d == "mqtt":
            fields = ["broker", "port", "username", "password"]
            return self._form(
                fid,
                "broker",
                [{"name": f, "required": True} for f in fields]
                + [{"name": "protocol", "required": True, "default": "5"}]
                + [
                    {
                        "name": "other_settings",
                        "type": "expandable",
                        "required": True,
                        "schema": [
                            {"name": "set_client_cert", "required": True},
                            {"name": "set_ca_cert", "required": True},
                            {"name": "transport", "required": True, "default": "tcp"},
                            {"name": "client_id", "optional": True},
                        ],
                    }
                ],
            )
        if d == "matter":
            if self.entries.get(d):
                self.flows.pop(fid)
                return 200, {"type": "abort", "flow_id": fid, "reason": "already_configured"}
            return self._form(
                fid,
                "manual",
                [{"name": "url", "required": True, "default": "ws://localhost:5580/ws"}],
            )
        if d == "otbr":
            if self.entries.get(d):
                self.flows.pop(fid)
                return 200, {"type": "abort", "flow_id": fid, "reason": "already_configured"}
            return self._form(fid, "user", [{"name": "url", "required": True}])
        if d == "ipp":
            return self._form(
                fid,
                "user",
                [
                    {"name": "host", "required": True},
                    {"name": "port", "required": True, "default": 631},
                    {"name": "base_path", "required": True, "default": "/ipp/print"},
                    {"name": "ssl", "required": True, "default": False},
                    {"name": "verify_ssl", "required": True, "default": False},
                ],
            )
        if d in ("heos", "cast"):
            if self.entries.get(d):
                self.flows.pop(fid)
                return 200, {"type": "abort", "flow_id": fid, "reason": "single_instance_allowed"}
            if d == "cast":
                return self._form(fid, "user", [])
            return self._form(fid, "user", [{"name": "host", "required": True}])
        if d == "androidtv_remote":
            return self._form(fid, "user", [{"name": "host", "required": True}])
        if d in OAUTH:
            if d == "home_connect" and not [c for c in self.credentials if c["domain"] == d]:
                self.flows.pop(fid)
                return 200, {"type": "abort", "flow_id": fid, "reason": "missing_credentials"}
            flow["step"] = "auth"
            return 200, {
                "type": "external",
                "flow_id": fid,
                "step_id": "auth",
                "url": f"https://vendor.example/authorize?state={fid}",
            }
        return self._form(fid, "user", [])  # a confirm-only form

    def _continue(self, fid, flow, body):
        d = flow["handler"]
        if flow.get("step") == "zeroconf_confirm":  # a discovered flow: confirm, no fields
            return self._create(fid, flow, flow.get("title", d), {})
        if d == "mqtt":
            section = body.get("other_settings")
            if section is None or body.get("protocol") is None:
                return 400, {"errors": {"other_settings": "required key not provided"}}
            missing = [
                k for k in ("set_client_cert", "set_ca_cert", "transport") if k not in section
            ]
            if missing:
                return 400, {
                    "errors": {"base": [f"required key not provided @ {k}" for k in missing]}
                }
            if body.get("broker") != "127.0.0.1":
                return self._form(fid, "broker", [], {"base": "cannot_connect"})
            return self._create(fid, flow, body["broker"], body)
        if d == "ipp":
            if body.get("host") in self.off:
                return self._form(
                    fid, "user", [{"name": "host", "required": True}], {"base": "cannot_connect"}
                )
            return self._create(fid, flow, body["host"], body)
        if d == "matter":
            if self.matter_down:
                return self._form(
                    fid, "manual", [{"name": "url", "required": True}], {"base": "cannot_connect"}
                )
            return self._create(fid, flow, "Matter", body)
        if d == "otbr":
            if self.otbr_down:
                return self._form(
                    fid, "user", [{"name": "url", "required": True}], {"base": "cannot_connect"}
                )
            return self._create(fid, flow, "Open Thread Border Router", body)
        if d == "heos":
            if body.get("host") in self.off:
                return self._form(
                    fid, "user", [{"name": "host", "required": True}], {"base": "cannot_connect"}
                )
            return self._create(fid, flow, "HEOS System", body)
        if d == "androidtv_remote":
            if flow.get("step") == "pair":
                if body.get("pin") != self.pin:
                    return self._form(
                        fid, "pair", [{"name": "pin", "required": True}], {"base": "invalid_auth"}
                    )
                return self._create(fid, flow, "TV", flow.get("data"))
            if body.get("host") in self.off:
                return self._form(
                    fid, "user", [{"name": "host", "required": True}], {"base": "cannot_connect"}
                )
            flow["step"] = "pair"
            flow["data"] = body
            self.pin_shown += 1  # the screen shows a PIN from here
            return self._form(fid, "pair", [{"name": "pin", "required": True}])
        return self._create(fid, flow, d, body)

    def _external_state(self, fid, flow):
        if fid in self.consents:
            return self._create(fid, flow, "regie", {"token": "t"})
        return 200, {
            "type": "external",
            "flow_id": fid,
            "step_id": "auth",
            "url": f"https://vendor.example/authorize?state={fid}",
        }

    def consent(self, fid):
        """The person consented: the brain's callback marks the step done and
        fires the event the frontend (and the walker) listens to."""
        self.consents.add(fid)
        self.queue.append(
            {
                "event_type": "data_entry_flow_progressed",
                "data": {"handler": self.flows[fid]["handler"], "flow_id": fid, "refresh": True},
            }
        )

    def matter_node(self, serial, mac, *, vendor="Example", model="Bulb A19", domains=("light",)):
        """A Matter node the phone commissioned: its device (keyed on the
        serial), one entity per domain named the integration's way."""
        self.n += 1
        node = self.n
        dev = {
            "id": f"dev{node}",
            "identifiers": [["matter", f"deviceid_00000000000000FF-{node}-MatterNodeDevice"]]
            + ([["matter", f"serial_{serial}"]] if serial else []),
            "connections": [],
            "serial_number": serial,
            "manufacturer": vendor,
            "model": model,
            "name": f"{model}",
            "name_by_user": None,
            "area_id": None,
            "via_device_id": None,
            "created_at": float(node),
        }
        self.devices.append(dev)
        for d in domains:
            self.entities.append(
                {
                    "entity_id": f"{d}.{model.lower().replace(' ', '_')}_{node}",
                    "device_id": dev["id"],
                    "platform": "matter",
                    "entity_category": None,
                    "disabled_by": None,
                }
            )
        self.entities.append(
            {
                "entity_id": f"update.{model.lower().replace(' ', '_')}_{node}_firmware",
                "device_id": dev["id"],
                "platform": "matter",
                "entity_category": "config",
                "disabled_by": None,
            }
        )
        dev["_mac"] = mac
        dev["_fabrics"] = [(1, "Google LLC"), (2, "Test Vendor")]  # the phone's stack + ours
        return dev

    def network_device(self, mac, name, domains=("media_player",), platform="cast", entry=None):
        """A network thing's device, keyed on its hardware address (or on the
        config entry it came with, when it has no address to give)."""
        self.n += 1
        node = self.n
        dev = {
            "id": f"dev{node}",
            "identifiers": [[platform, f"{platform}-{node}"]],
            "connections": [["mac", mac]] if mac else [],
            "config_entries": [entry["entry_id"]] if entry else [],
            "serial_number": None,
            "manufacturer": "Vendor",
            "model": name,
            "name": name,
            "name_by_user": None,
            "area_id": None,
            "via_device_id": None,
        }
        self.devices.append(dev)
        for d in domains:
            self.entities.append(
                {
                    "entity_id": f"{d}.{name.lower().replace(' ', '_')}_{node}",
                    "device_id": dev["id"],
                    "platform": platform,
                    "entity_category": None,
                    "disabled_by": None,
                }
            )
        return dev

    def bridge_device(self, ieee, domains=("light",), prefix="zigbee2mqtt"):
        """A Zigbee device as the bridge announces it at the INTERVIEW: its
        identifier carries the radio address behind the instance's prefix,
        and everything it is called is that address — the name the walk
        renames a moment later, and the entity id Home Assistant then keeps
        for ever. Every device also brings a diagnostic the rename ignores."""
        self.n += 1
        dev = {
            "id": f"dev{self.n}",
            "identifiers": [["mqtt", f"{prefix}_{ieee}"]],
            "connections": [],
            "config_entries": [],
            "serial_number": None,
            "manufacturer": "IKEA",
            "model": "TRADFRI bulb",
            "name": ieee,
            "name_by_user": None,
            "area_id": None,
            "via_device_id": None,
        }
        self.devices.append(dev)
        for d in domains:
            self.entities.append(
                {
                    "entity_id": f"{d}.{ieee}",
                    "device_id": dev["id"],
                    "platform": "mqtt",
                    "entity_category": None,
                    "disabled_by": None,
                }
            )
        self.entities.append(
            {
                "entity_id": f"sensor.{ieee}_linkquality",
                "device_id": dev["id"],
                "platform": "mqtt",
                "entity_category": "diagnostic",
                "disabled_by": None,
            }
        )
        return dev

    def discover(self, domain, unique_id, title, step="zeroconf_confirm"):
        """A discovered flow, the way zeroconf leaves one waiting for a confirm."""
        self.n += 1
        fid = f"disc{self.n}"
        self.flows[fid] = {"handler": domain, "step": step, "title": title}
        self.progress.append(
            {
                "flow_id": fid,
                "handler": domain,
                "context": {"source": "zeroconf", "unique_id": unique_id},
                "step_id": step,
            }
        )
        return fid

    # --- REST ---
    def _authed(self):
        return self.token in self.tokens

    def get(self, path, auth=True):
        self.log.append(f"GET {path}")
        if path == "/api/onboarding":
            if all(self.onboarded.values()):
                return 404, "404: Not Found"  # the views are gone once every step is done
            return 200, [{"step": k, "done": v} for k, v in self.onboarded.items()]
        if auth and not self._authed():
            return 401, {"message": "Unauthorized"}
        if path == "/api/":
            return 200, {"message": "API running."}
        if path.startswith("/api/states/"):
            entity = path.rsplit("/", 1)[1]
            if entity.split(".")[0] not in ("input_datetime", "input_select", "input_boolean"):
                return 404, {"message": "Entity not found."}
            fresh = {"input_datetime": "00:00:00", "input_select": "home", "input_boolean": "off"}[
                entity.split(".")[0]
            ]
            return 200, {"entity_id": entity, "state": self.states.get(entity, fresh)}
        if path.startswith("/api/config/config_entries/entry?domain="):
            return 200, [
                {k: v for k, v in e.items() if k != "_data"}
                for e in self.entries.get(path.split("=")[1], [])
            ]
        if path.startswith(FLOWS + "/"):
            fid = path.rsplit("/", 1)[1]
            if fid not in self.flows:
                return 404, {"message": "Invalid flow specified"}
            flow = self.flows[fid]
            if flow.get("step") == "auth":
                return self._external_state(fid, flow)
            if flow.get("step") == "zeroconf_confirm":
                return self._form(fid, "zeroconf_confirm", [])
            return self._start(fid, flow)
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
        if path == "/api/services/frontend/set_theme":
            self.default_theme = body["name"]
            self.default_dark_theme = body.get("name_dark")
            return 200, []
        if path.startswith("/api/services/"):
            if path.endswith("/turn_on") and body["entity_id"].startswith("input_boolean."):
                self.states[body["entity_id"]] = "on"
            elif path.endswith("/turn_off") and body["entity_id"].startswith("input_boolean."):
                self.states[body["entity_id"]] = "off"
            else:
                self.states[body["entity_id"]] = body.get("time") or body.get("option")
            return 200, []
        if path == FLOWS:
            self.n += 1
            fid = f"flow{self.n}"
            self.flows[fid] = {"handler": body["handler"]}
            return self._start(fid, self.flows[fid])
        if path.startswith(FLOWS + "/"):
            fid = path.rsplit("/", 1)[1]
            if fid not in self.flows:
                return 404, {"message": "Invalid flow specified"}
            return self._continue(fid, self.flows[fid], body)
        raise AssertionError(path)

    def delete(self, path):
        self.log.append(f"DELETE {path}")
        fid = path.rsplit("/", 1)[1]
        if self.flows.pop(fid, None) is None:
            return 404, {"message": "Invalid flow specified"}
        self.progress = [p for p in self.progress if p["flow_id"] != fid]
        return 200, {"message": "Flow aborted"}

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
                "icon": payload.get("icon"),
            }
            self.areas.append(a)
            return a
        if type_ == "config/area_registry/update":
            for a in self.areas:
                if a["area_id"] == payload["area_id"]:
                    a.update({k: v for k, v in payload.items() if k != "area_id"})
                    return a
        if type_ == "get_config":
            return {"state": "RUNNING", "version": "2026.8.3"}
        if type_ == "http/config":
            h = self.http
            return {
                "stable": h["stable"],
                "pending": h["pending"],
                "active_config_type": h["active"],
                "default": h["default"],
                "revert_at": None,
            }
        if type_ == "http/config/configure":
            conf = dict(payload["config"])
            assert "server_port" in conf, "the whole config, not a patch"
            changed = conf != self.http["pending"]
            self.http["pending"] = conf
            if changed:
                self.restarts += 1
                self.http["active"] = "pending"  # the restart, instantly
            return {"restart": changed}
        if type_ == "http/config/promote":
            assert self.http["pending"] and self.http["active"] == "pending"
            self.http["stable"] = self.http["pending"]
            self.http["pending"] = None
            self.http["active"] = "stable"
            return None
        if type_ == "backup/config/info":
            return {"config": self.backup_cfg}
        if type_ == "backup/config/update":
            for k, v in payload.items():
                if isinstance(v, dict):
                    self.backup_cfg[k].update(v)
                else:
                    self.backup_cfg[k] = v
            return None
        if type_ == "application_credentials/config":
            return {"integrations": {d: {} for d in OAUTH}}
        if type_ == "application_credentials/list":
            return list(self.credentials)
        if type_ == "application_credentials/create":
            self.n += 1
            item = {"id": f"c{self.n}", **payload}
            self.credentials.append(item)
            return item
        if type_ == "frontend/get_translations":
            (domain,) = payload["integration"]
            res = {f"component.{domain}.config.step.user.data.host": "Host"}
            if domain == "androidtv_remote":
                res[f"component.{domain}.config.step.pair.data.pin"] = "PIN"
            return {"resources": res}
        if type_ == "manifest/get":
            return {
                "domain": payload["integration"],
                "iot_class": IOT_CLASS.get(payload["integration"], "local_push"),
            }
        if type_ == "config_entries/flow/progress":
            return list(self.progress)
        if type_ == "config/device_registry/list":
            return [{k: v for k, v in d.items() if not k.startswith("_")} for d in self.devices]
        if type_ == "config/device_registry/update":
            for d in self.devices:
                if d["id"] == payload["device_id"]:
                    d.update({k: v for k, v in payload.items() if k != "device_id"})
                    return d
            raise AssertionError(payload)
        if type_ == "config/entity_registry/list":
            return list(self.entities)
        if type_ == "config/entity_registry/update":
            if "new_entity_id" in payload and any(
                e["entity_id"] == payload["new_entity_id"] for e in self.entities
            ):
                raise HouseError("config/entity_registry/update: invalid_info — already exists")
            for e in self.entities:
                if e["entity_id"] == payload["entity_id"]:
                    if "new_entity_id" in payload:
                        e["entity_id"] = payload["new_entity_id"]
                    skip = ("entity_id", "new_entity_id")
                    e.update({k: v for k, v in payload.items() if k not in skip})
                    return {"entity_entry": e}
            raise AssertionError(payload)
        if type_ == "matter/commission":
            node = self.commissionable.pop(payload["code"], None)
            if node is None:
                raise HouseError("matter/commission: unknown_error — Commissioning failed")
            assert payload.get("network_only") is True
            self.commissioned.append(payload["code"])
            self.matter_node(**node)
            return None
        if type_ == "matter/node_diagnostics":
            dev = next(d for d in self.devices if d["id"] == payload["device_id"])
            return {
                "node_id": 1,
                "network_type": "wifi",
                "mac_address": dev.get("_mac"),
                "ip_adresses": ["fe80::1%eth0"] if dev.get("_mac") else [],  # no-environment: ok
                "available": True,
                "active_fabrics": [
                    {"fabric_index": i, "vendor_name": v} for i, v in dev.get("_fabrics", [])
                ],
                "active_fabric_index": 2,
            }
        if type_ == "matter/remove_matter_fabric":
            dev = next(d for d in self.devices if d["id"] == payload["device_id"])
            dev["_fabrics"] = [f for f in dev["_fabrics"] if f[0] != payload["fabric_index"]]
            return None
        if type_ == "subscribe_events":
            return None
        if type_ == "frontend/get_themes":
            return {
                "themes": self.themes,
                "default_theme": self.default_theme,
                "default_dark_theme": self.default_dark_theme,
            }
        if type_ == "lovelace/resources":
            return list(self.resources)
        if type_ == "lovelace/resources/create":
            item = {
                "id": f"r{len(self.resources) + 1}",
                "type": payload["res_type"],
                "url": payload["url"],
            }
            self.resources.append(item)
            return item
        if type_ == "lovelace/resources/update":
            for r in self.resources:
                if r["id"] == payload["resource_id"]:
                    r.update({k: v for k, v in payload.items() if k == "url"})
                    if "res_type" in payload:
                        r["type"] = payload["res_type"]
                    return r
            raise AssertionError(payload)
        if type_ == "lovelace/resources/delete":
            self.resources = [r for r in self.resources if r["id"] != payload["resource_id"]]
            return None
        raise AssertionError(type_)


def states(steps):
    return {s.name: s.state for s in steps}


def entry_titles(ha, domain):
    return [e["title"] for e in ha.entries.get(domain, [])]


@pytest.fixture(autouse=True)
def _door_answers(monkeypatch):
    """The witness's door (https://home.example.com) answers 200 through the proxy."""
    monkeypatch.setattr("regie.apply.probe", lambda url, via=None: 200)
    monkeypatch.setattr("regie.apply.time.sleep", lambda s: None)


@pytest.fixture
def with_oven(house_with):
    """The witness plus a cloud oven (Home Connect) and a HEOS receiver."""

    def add(d):
        d["things"].append(
            {
                "id": "kitchen_oven",
                "area": "kitchen",
                "kind": "oven",
                "via": "wifi",
                "host": "192.0.2.33",
                "mac": "00:00:5e:00:53:33",
                "integration": "home_connect",
            }
        )
        d["things"].append(
            {
                "id": "living_receiver",
                "area": "living",
                "kind": "receiver",
                "via": "wifi",
                "host": "192.0.2.24",
                "integration": "heos",
            }
        )

    return load_house(house_with(add))


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
        "spare",  # a parking room is a room: its things are roomed, nothing acts on them
    }
    hall = next(a for a in ha.areas if a["aliases"] == ["hall"])
    assert hall["name"] == "Entrée" and hall["floor_id"] == ha.floors[0]["floor_id"]
    entry = ha.entries["mqtt"][0]["_data"]
    assert entry["username"] == "home" and entry["protocol"] == "5"
    assert entry["other_settings"] == {
        "set_client_cert": False,
        "set_ca_cert": "off",
        "transport": "tcp",
    }
    assert ha.backup_cfg["schedule"] == {"recurrence": "daily", "time": "04:00", "days": []}
    assert ha.backup_cfg["create_backup"]["password"] == "example-backup-password"
    # the reverse proxy: configured (a restart), then promoted in the same run
    assert st["http"] == "changed" and ha.restarts == 1
    assert ha.http["stable"]["trusted_proxies"] == ["192.0.2.2"] and ha.http["pending"] is None
    assert (
        ha.http["stable"]["use_x_forwarded_for"] is True
        and ha.http["stable"]["server_port"] == 8123
    )
    # the things' integrations: the printer's form answered from its row, the
    # confirm-only ones confirmed, the TV's PIN left to a hand
    assert st["entry kitchen_printer"] == "changed" and entry_titles(ha, "ipp") == ["192.0.2.32"]
    assert ha.entries["ipp"][0]["_data"] == {
        "host": "192.0.2.32",
        "port": 631,
        "base_path": "/ipp/print",
        "ssl": False,
        "verify_ssl": False,
    }
    assert st["entry kitchen_plug"] == "changed"
    # the TV is two things to Home Assistant: its cast entry made (one for every
    # cast on the lane - the puck's row is served by the same one), its remote a hand
    assert st["entry living_tv (cast)"] == "changed" and st["entry living_cast"] == "ok"
    assert len(ha.entries["cast"]) == 1
    assert st["entry living_tv (androidtv_remote)"] == "hand"
    assert ha.pin_shown == 0 and not ha.flows
    tv = next(s for s in steps if s.name == "entry living_tv (androidtv_remote)")
    assert tv.detail == "androidtv_remote: a pin on its screen — regie link living_tv"
    hand = sum(1 for s in steps if s.state == "hand")
    ok = sum(1 for s in steps if s.state == "ok")  # the puck's cast row: served by the TV's entry
    # the mesh: no Zigbee2MQTT answers in a test, so the radio's step waits
    # (the walk's own half has its own file, test_zigbee.py)
    waiting = sum(1 for s in steps if s.state == "waiting")
    assert ok == 1 and waiting == 1
    assert summary(steps, False) == (
        f"apply: {len(steps) - hand - ok - waiting} changed, 1 ok, {hand} by hand, "
        f"{waiting} waiting"
    )

    # the knobs: the files seed the helpers once (a fresh time helper reads
    # 00:00, not unknown — the conductor's own mark says it has spoken)
    assert st["knob house_period_morning"] == "changed" and st["knob house_mode"] == "changed"
    assert ha.states["input_datetime.house_period_evening"] == "18:00:00"
    assert ha.states["input_select.house_mode"] == "home"
    marks = json.loads((tmp_path / ".regie/knobs.json").read_text())
    assert marks["input_datetime.house_period_morning"] == "06:30"

    again = apply(witness, secrets, tmp_path, ha, check=False)
    assert set(states(again).values()) == {"ok", "hand", "waiting"}, states(again)
    assert states(again)["entry kitchen_printer"] == "ok"
    assert len(ha.entries["ipp"]) == 1 and len(ha.entries["cast"]) == 1  # keyed on the domain


def test_a_knob_the_family_moved_is_read_and_kept(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    ha.states["input_datetime.house_period_morning"] = "07:00:00"  # edited in the UI
    ha.states["input_select.house_mode"] = "cinema"
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    morning = next(s for s in steps if s.name == "knob house_period_morning")
    assert morning.state == "ok" and morning.detail == (
        "07:00 — set from the UI (the file says 06:30), kept"
    )
    assert ha.states["input_datetime.house_period_morning"] == "07:00:00"
    assert ha.states["input_select.house_mode"] == "cinema"
    assert next(s for s in steps if s.name == "knob house_period_day").detail == "09:00"
    # the marks lost (a rebuilt brain): seeded again, the family's 07:00 overwritten
    (tmp_path / ".regie/knobs.json").unlink()
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert states(steps)["knob house_period_morning"] == "changed"
    assert ha.states["input_datetime.house_period_morning"] == "06:30:00"


def test_a_room_renamed_is_adopted_by_its_old_id_now_an_alias(
    witness, secrets, tmp_path, house_with
):
    """`salon` becomes `living_room` (the ids clean up): the live area keeps its
    Home Assistant id and its things; its aliases move, nothing is duplicated."""
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    before = next(a for a in ha.areas if a["aliases"][0] == "living")

    def rename(d):
        living = next(a for a in d["areas"] if a["id"] == "living")
        living["id"] = "living_room"
        living["aliases"] = ["living", "salon"]
        for t in d["things"]:
            if t["area"] == "living":
                t["area"] = "living_room"
            t["bind"] = ["living_room" if b == "living" else b for b in t.get("bind", [])]

    path = house_with(rename)
    room = path.parent / "rooms" / "living.yml"
    room.write_text(
        room.read_text()
        .replace("id: living\n", "id: living_room\n")
        .replace("aliases: [salon", "aliases: [living, salon")
    )
    story = path.parent / "scenarios" / "wakeup.yml"
    story.write_text(
        story.read_text()
        .replace("living/", "living_room/")
        .replace("light.living_", "light.living_room_")
    )
    house = load_house(path)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    st = states(steps)
    assert st["area living_room"] == "changed"
    after = next(a for a in ha.areas if a["area_id"] == before["area_id"])
    assert after["aliases"] == ["living_room", "living", "salon", "le salon"]
    assert len([a for a in ha.areas if a["name"] == "Salon"]) == 1
    assert "area (salon)" not in st


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
    ha.token = next(t for t, k in ha.tokens.items() if k == "llat")
    with pytest.raises(HouseError, match="asks"):
        walk(ha, "mqtt", {"nothing": 1})
    assert not ha.flows  # closed behind it


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
    assert living["aliases"] == ["living", "salon", "le salon"] and living["name"] == "Salon"
    assert living["floor_id"] == ha.floors[0]["floor_id"]
    assert [a for a in ha.areas if a["name"] == "Salon"] == [living]  # adopted, not duplicated
    assert st["area kitchen"] == "changed"  # Cuisine adopted by the witness's kitchen too
    assert (
        st["area (chambre)"] == "ok" and "area (cuisine)" not in st
    )  # Chambre reported, left alone
    again = apply(witness, secrets, tmp_path, ha, check=False)
    assert set(states(again).values()) == {"ok", "hand", "waiting"}  # + the mesh, absent here


def test_a_trial_that_fails_at_the_door_is_not_promoted(witness, secrets, tmp_path, monkeypatch):
    ha = FakeHA()
    monkeypatch.setattr("regie.apply.probe", lambda url, via=None: 400)
    with pytest.raises(HouseError, match="answers 400"):
        apply(witness, secrets, tmp_path, ha, check=False)
    assert ha.http["pending"] is not None and ha.http["stable"]["trusted_proxies"] == []


def test_a_pending_trial_left_running_is_promoted_on_the_next_run(witness, secrets, tmp_path):
    ha = FakeHA()
    ha.http["pending"] = {
        **ha.http["default"],
        "use_x_forwarded_for": True,
        "trusted_proxies": ["192.0.2.2/32"],
    }
    ha.http["active"] = "pending"
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert states(steps)["http"] == "changed" and ha.restarts == 0
    assert ha.http["stable"]["trusted_proxies"] == ["192.0.2.2/32"]


def test_a_failed_pending_is_ignored_and_a_fresh_trial_configured(witness, secrets, tmp_path):
    ha = FakeHA()
    ha.http["pending"] = {
        **ha.http["default"],
        "use_x_forwarded_for": True,
        "trusted_proxies": ["192.0.2.2"],
        "error": "not_promoted",
    }
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert states(steps)["http"] == "changed" and ha.restarts == 1 and ha.http["pending"] is None


def test_the_door_is_proven_through_the_proxy(witness, secrets, tmp_path, monkeypatch):
    seen = {}
    monkeypatch.setattr(
        "regie.apply.probe", lambda url, via=None: seen.update(url=url, via=via) or 200
    )
    apply(witness, secrets, tmp_path, FakeHA(), check=False)
    assert seen == {"url": "https://home.example.com/manifest.json", "via": "192.0.2.2"}


def test_probe_speaks_http_through_a_given_address(monkeypatch):
    import socket as _socket

    sent = {}

    class FakeSock:
        def __enter__(self):
            return self

        def __exit__(self, *a):
            return False

        def sendall(self, data):
            sent["req"] = data.decode()

        def recv(self, n):
            return b"HTTP/1.1 200 OK\r\nContent-Type: x\r\n\r\n"

    monkeypatch.setattr(
        _socket,
        "create_connection",
        lambda addr, timeout=None: sent.update(addr=addr) or FakeSock(),
    )
    assert real_probe("http://door.example.com/manifest.json", via="192.0.2.2") == 200
    assert sent["addr"] == ("192.0.2.2", 80) and "Host: door.example.com" in sent["req"]


# --- the things' integrations (0.3) --------------------------------------------


def test_check_plans_the_entries_without_starting_a_flow(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    ha.entries = {"mqtt": ha.entries["mqtt"]}  # the things' entries gone (a rebuilt brain)
    seen = len(ha.log)
    steps = apply(witness, secrets, tmp_path, ha, check=True)
    st = states(steps)
    assert st["entry kitchen_printer"] == "would"
    assert st["entry living_tv (androidtv_remote)"] == "hand"
    assert st["entry living_tv (cast)"] == "would"
    printer = next(s for s in steps if s.name == "entry kitchen_printer")
    assert printer.detail == "set up ipp at 192.0.2.32"
    assert not ha.flows and ha.pin_shown == 0 and "POST " + FLOWS not in ha.log[seen:]
    # 8 entries wanted + the Matter server's + the border router's, 1 by hand
    assert summary(steps, True).startswith("apply: 9 would change")


def test_a_thing_that_does_not_answer_is_waiting_not_a_fault(witness, secrets, tmp_path):
    ha = FakeHA()
    ha.off.add("192.0.2.32")  # the printer is off (or not at its reserved address yet)
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    printer = next(s for s in steps if s.name == "entry kitchen_printer")
    assert printer.state == "waiting" and "192.0.2.32 does not answer" in printer.detail
    assert "ipp" not in ha.entries and not ha.flows  # nothing made, nothing left open
    assert ", 2 waiting" in summary(steps, False)  # the printer, and the mesh no test answers for
    ha.off.clear()  # powered on: the next apply makes the entry
    again = apply(witness, secrets, tmp_path, ha, check=False)
    assert states(again)["entry kitchen_printer"] == "changed"


def test_a_pin_is_a_hand_for_apply_and_typed_by_link(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    assert ha.pin_shown == 0
    asked = []

    def prompt(field, flow):
        asked.append(field)
        return "0000" if len(asked) == 1 else "1234"  # a typo first, then the right one

    out = link(
        witness,
        {},
        tmp_path,
        ha,
        "living_tv",
        prompt=prompt,
        on_url=lambda url: None,
        wait_external=lambda fid: True,
    )
    assert out.state == "changed" and asked == ["pin", "pin"] and ha.pin_shown == 1
    assert entry_titles(ha, "androidtv_remote") == ["TV"]
    assert ha.entries["androidtv_remote"][0]["_data"]["host"] == "192.0.2.20"
    assert out.detail.startswith("androidtv_remote: set up")  # cast was in already: skipped
    again = apply(witness, secrets, tmp_path, ha, check=False)
    assert states(again)["entry living_tv (androidtv_remote)"] == "ok"
    assert (
        link(
            witness,
            {},
            tmp_path,
            ha,
            "living_tv",
            prompt=prompt,
            on_url=lambda url: None,
            wait_external=lambda fid: True,
        ).state
        == "ok"
    )  # nothing left to link


def test_a_consent_needs_credentials_then_a_browser(with_oven, secrets, tmp_path):
    ha = FakeHA()
    steps = apply(with_oven, secrets, tmp_path, ha, check=False)
    st = states(steps)
    assert "credentials home_connect" not in st  # no secret, no credential: nothing to say
    oven = next(s for s in steps if s.name == "entry kitchen_oven")
    assert oven.state == "hand" and oven.detail == (
        "home_connect: a consent in a browser — regie link kitchen_oven "
        "[cloud_push: its control needs the internet]"
    )
    assert st["entry living_receiver"] == "changed" and entry_titles(ha, "heos") == ["HEOS System"]
    # link without credentials: the brain says what it lacks
    out = link(
        with_oven,
        {},
        tmp_path,
        ha,
        "kitchen_oven",
        prompt=lambda f, fl: "",
        on_url=lambda u: None,
        wait_external=lambda fid: True,
    )
    assert out.state == "hand" and "home_connect_client_id" in out.detail and not ha.flows
    # the secrets carry the credentials: apply creates them, link walks the consent
    with_creds = {**secrets, "home_connect_client_id": "id-1", "home_connect_client_secret": "s-1"}
    steps = apply(with_oven, with_creds, tmp_path, ha, check=False)
    assert states(steps)["credentials home_connect"] == "changed"
    assert [(c["domain"], c["client_id"], c["name"]) for c in ha.credentials] == [
        ("home_connect", "id-1", "regie")
    ]
    seen = {}

    def on_url(url):
        seen["url"] = url
        ha.consent(
            re.search(r"state=(\w+)", url).group(1)
        )  # the person consents, the callback lands

    out = link(
        with_oven,
        with_creds,
        tmp_path,
        ha,
        "kitchen_oven",
        prompt=lambda f, fl: "",
        on_url=on_url,
        wait_external=lambda fid: any(True for _ in FakeWs(ha).events(0, 1)),
    )
    assert out.state == "changed" and seen["url"].startswith("https://vendor.example/authorize")
    assert entry_titles(ha, "home_connect") == ["regie"] and not ha.flows
    again = apply(with_oven, with_creds, tmp_path, ha, check=False)
    st = states(again)
    assert st["credentials home_connect"] == "ok" and st["entry kitchen_oven"] == "ok"
    assert len(ha.credentials) == 1


def test_a_consent_that_never_comes_closes_the_flow(with_oven, secrets, tmp_path):
    ha = FakeHA()
    apply(with_oven, secrets, tmp_path, ha, check=False)
    ha.token = next(t for t, k in ha.tokens.items() if k == "llat")
    # smartthings consents through a cloud link: no credentials needed, a browser is
    with pytest.raises(HouseError, match="no consent"):
        walk(ha, "smartthings", {}, on_url=lambda u: None, wait_external=lambda fid: False)
    assert not ha.flows


def test_a_discovered_flow_of_a_listed_thing_is_continued(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    del ha.entries["ipp"]
    fid = ha.discover("ipp", "urn:uuid:printer-1", "EPSON XP")  # zeroconf saw the printer
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    printer = next(s for s in steps if s.name == "entry kitchen_printer")
    assert printer.state == "changed" and entry_titles(ha, "ipp") == ["EPSON XP"]
    assert f"GET {FLOWS}/{fid}" in ha.log and not ha.progress  # continued, not started anew


def test_a_discovered_flow_that_may_not_be_this_row_is_left_alone(
    witness, secrets, tmp_path, house_with
):
    def two_printers(d):
        d["things"].append(
            {
                "id": "hall_printer",
                "area": "hall",
                "kind": "printer",
                "via": "wifi",
                "host": "192.0.2.34",
                "integration": "ipp",
            }
        )

    house = load_house(house_with(two_printers))
    ha = FakeHA()
    fid = ha.discover("ipp", "urn:uuid:printer-1", "EPSON XP")
    steps = apply(house, secrets, tmp_path, ha, check=False)
    st = states(steps)
    assert st["entry kitchen_printer"] == st["entry hall_printer"] == "changed"
    assert sorted(entry_titles(ha, "ipp")) == ["192.0.2.32", "192.0.2.34"]
    assert fid in ha.flows  # two rows, one discovered flow: whose? the UI's to say


def test_a_discovered_thing_no_row_names_is_a_line_not_a_tile(witness, secrets, tmp_path):
    ha = FakeHA()
    fid = ha.discover("denonavr", "Denon X-1", "Denon X")
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    line = next(s for s in steps if s.name == "discovered (denonavr)")
    assert (
        line.state == "ok" and line.detail == "Denon X-1 (zeroconf) — not in home.yml, left alone"
    )
    assert fid in ha.flows and "denonavr" not in ha.entries  # left to the UI, or to a row


def test_a_discovered_tv_is_the_rows_by_its_mac(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    fid = ha.discover("androidtv_remote", "00:00:5e:00:53:20", "TV")
    out = link(
        witness,
        {},
        tmp_path,
        ha,
        "living_tv",
        prompt=lambda f, fl: "1234",
        on_url=lambda u: None,
        wait_external=lambda fid: True,
    )
    assert out.state == "changed" and f"GET {FLOWS}/{fid}" in ha.log
    assert entry_titles(ha, "androidtv_remote") == ["TV"]


def test_the_conductor_names_the_door_on_every_request(witness, monkeypatch):
    """Without `my`, Home Assistant builds the OAuth callback from the header the
    frontend sends (HA-Frontend-Base): the client sends the house's url."""
    import io
    import urllib.request

    from regie.apply import Conductor

    seen = {}

    class Reply(io.BytesIO):
        status = 200

        def __enter__(self):
            return self

        def __exit__(self, *a):
            return False

    def fake_urlopen(req, timeout=None):
        seen.update(req.headers)
        return Reply(b"{}")

    monkeypatch.setattr(urllib.request, "urlopen", fake_urlopen)
    ha = HomeAssistant("http://127.0.0.1:8123", token="t")
    Conductor(witness, {}, "/tmp/x", ha)
    ha.post(FLOWS, {"handler": "home_connect"})
    assert seen.get("Ha-frontend-base") == "https://home.example.com"


# --- the Matter pack: the server's entry, a device's room, the walk's Matter half ---


def test_the_matter_server_gets_its_entry_and_a_keyed_device_its_room(witness, secrets, tmp_path):
    ha = FakeHA()
    bulb = ha.matter_node("EX-000001", "00:00:5e:00:53:41")  # commissioned by the phone
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    st = states(steps)
    assert st["entry matter"] == "changed"
    assert ha.entries["matter"][0]["_data"] == {"url": "ws://localhost:5580/ws"}
    # the bulb's row (living_bulb, serial EX-000001): roomed, named, its light renamed
    assert st["device living_bulb"] == "changed"
    living = next(a for a in ha.areas if a["aliases"][0] == "living")
    assert bulb["area_id"] == living["area_id"] and bulb["name_by_user"] == "living_bulb"
    assert "light.living_bulb" in {e["entity_id"] for e in ha.entities}
    assert "update.bulb_a19_" in "".join(e["entity_id"] for e in ha.entities)  # untouched
    again = states(apply(witness, secrets, tmp_path, ha, check=False))
    assert again["entry matter"] == "ok" and again["device living_bulb"] == "ok"
    assert len(ha.entries["matter"]) == 1


def test_a_box_that_is_two_devices_is_roomed_twice_and_renamed_never(witness, secrets, tmp_path):
    ha = FakeHA()
    tv_cast = ha.network_device("00:00:5e:00:53:20", "TV cast", platform="cast")
    tv_remote = ha.network_device("00:00:5e:00:53:20", "TV remote", platform="androidtv_remote")
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    st = states(steps)
    assert st["device living_tv (TV cast)"] == "changed"
    assert st["device living_tv (TV remote)"] == "changed"
    living = next(a for a in ha.areas if a["aliases"][0] == "living")
    assert tv_cast["area_id"] == living["area_id"] and tv_remote["area_id"] == living["area_id"]
    assert tv_cast["name_by_user"] == "living_tv" and tv_remote["name_by_user"] == "living_tv"
    ids = {e["entity_id"] for e in ha.entities}
    assert "media_player.living_tv" not in ids  # two players for one box keep their own numbering


def test_a_device_not_there_yet_is_skipped_in_silence(witness, secrets, tmp_path):
    ha = FakeHA()
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert "device living_bulb" not in states(steps)


def test_a_device_with_no_address_is_keyed_on_an_identifier(secrets, tmp_path, house_with):
    """A cast speaker gives the registry no MAC and no serial_number - its
    identifier value (the cast UUID) is the serial its row keys on (0.6.2)."""
    ha = FakeHA()
    speaker = ha.network_device("", "Mi Smart Speaker", platform="cast")
    ident = speaker["identifiers"][0][1]
    home = house_with(
        lambda d: d["things"].append(
            {
                "id": "hall_speaker",
                "area": "hall",
                "kind": "speaker",
                "via": "wifi",
                "label": "Enceinte",
                "integration": "cast",
                "serial": ident,
            }
        )
    )
    steps = apply(load_house(home), secrets, tmp_path, ha, check=False)
    st = states(steps)
    assert st["device hall_speaker"] == "changed"
    hall = next(a for a in ha.areas if a["aliases"][0] == "hall")
    assert speaker["area_id"] == hall["area_id"] and speaker["name_by_user"] == "Enceinte"
    assert "media_player.hall_speaker" in {e["entity_id"] for e in ha.entities}


def test_a_zigbee_thing_is_keyed_on_its_radio_address_and_its_light_renamed(
    witness, secrets, tmp_path
):
    """The defect this fixes: a Zigbee row carries neither serial nor mac, so
    it never reached this step at all — and Home Assistant had minted its
    entity id at the interview, from the radio address. Every scene, default
    and effect in the house aims at `light.<id>`: unless the entity wears
    that name, a look reaches no bulb."""
    ha = FakeHA()
    ceiling = ha.bridge_device("0x000d6ffffe000001")
    lamp = ha.bridge_device("0x000d6ffffe000002")
    st = states(apply(witness, secrets, tmp_path, ha, check=False))
    assert st["device living_ceiling"] == "changed"
    assert st["device living_floor_lamp"] == "changed"
    living = next(a for a in ha.areas if a["aliases"][0] == "living")
    assert ceiling["area_id"] == living["area_id"] and ceiling["name_by_user"] == "living_ceiling"
    assert lamp["area_id"] == living["area_id"] and lamp["name_by_user"] == "Lampadaire"
    ids = {e["entity_id"] for e in ha.entities}
    assert {"light.living_ceiling", "light.living_floor_lamp"} <= ids
    assert not any(e.startswith("light.0x") for e in ids)
    assert "sensor.0x000d6ffffe000001_linkquality" in ids  # a diagnostic is not the thing
    again = states(apply(witness, secrets, tmp_path, ha, check=False))
    assert again["device living_ceiling"] == "ok" and again["device living_floor_lamp"] == "ok"


def test_a_zigbee_device_the_bridge_names_without_its_prefix_still_matches(
    witness, secrets, tmp_path
):
    """The prefix is the instance's, not the protocol's — one radio per
    instance, and a bridge may publish the address alone."""
    ha = FakeHA()
    ceiling = ha.bridge_device("0x000d6ffffe000001", prefix="")
    ceiling["identifiers"] = [["mqtt", "0x000d6ffffe000001"]]
    st = states(apply(witness, secrets, tmp_path, ha, check=False))
    assert st["device living_ceiling"] == "changed"
    assert "light.living_ceiling" in {e["entity_id"] for e in ha.entities}


def test_a_zigbee_device_that_is_two_lights_is_roomed_and_renamed_never(witness, secrets, tmp_path):
    """Two lights under one radio address: which one is the row? Neither —
    the room and the name still land, the entity ids stay the bridge's."""
    ha = FakeHA()
    dev = ha.bridge_device("0x000d6ffffe000001")
    ha.entities.append(
        {
            "entity_id": "light.0x000d6ffffe000001_2",
            "device_id": dev["id"],
            "platform": "mqtt",
            "entity_category": None,
            "disabled_by": None,
        }
    )
    st = states(apply(witness, secrets, tmp_path, ha, check=False))
    assert st["device living_ceiling"] == "changed"
    living = next(a for a in ha.areas if a["aliases"][0] == "living")
    assert dev["area_id"] == living["area_id"]
    assert "light.living_ceiling" not in {e["entity_id"] for e in ha.entities}


def test_check_plans_the_zigbee_rename_and_touches_nothing(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)  # furnished
    ceiling = ha.bridge_device("0x000d6ffffe000001")
    steps = apply(witness, secrets, tmp_path, ha, check=True)
    step = next(s for s in steps if s.name == "device living_ceiling")
    assert step.state == "would" and "light.living_ceiling" in step.detail
    assert ceiling["area_id"] is None
    assert "light.0x000d6ffffe000001" in {e["entity_id"] for e in ha.entities}


def test_check_plans_the_room_and_touches_nothing(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)  # furnished
    bulb = ha.matter_node("EX-000001", "00:00:5e:00:53:41")
    steps = apply(witness, secrets, tmp_path, ha, check=True)
    st = states(steps)
    assert st["device living_bulb"] == "would"
    assert bulb["area_id"] is None and bulb["name_by_user"] is None
    assert "light.living_bulb" not in {e["entity_id"] for e in ha.entities}


def test_a_server_that_does_not_answer_is_waiting_not_a_fault(witness, secrets, tmp_path):
    ha = FakeHA()
    ha.matter_down = True
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    entry = next(s for s in steps if s.name == "entry matter")
    assert entry.state == "waiting" and "matter-server.service up?" in entry.detail
    assert not ha.entries.get("matter") and not ha.flows


def test_pair_matter_adopts_the_fresh_node_into_a_row(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    ha.matter_node("EX-000001", "00:00:5e:00:53:41")  # the witness's row already
    ha.matter_node(
        "EX-000002", "00:00:5e:00:53:42", model="Bulb E14"
    )  # the phone just did this one
    row = pair_matter(
        witness, secrets, tmp_path, ha, room="hall", role="main", at=None, code=None, serial=None
    )
    found = row.pop("_found")
    assert row == {
        "id": "hall_main_2",  # hall_ceiling fills main already; light.hall_main is the group
        "area": "hall",
        "kind": "light",
        "via": "matter",
        "vendor": "Example",
        "model": "Bulb E14",
        "serial": "EX-000002",
        "mac": "00:00:5e:00:53:42",
        "role": "main",
    }
    assert found["device"] == "Bulb E14"
    assert len(found["entities"]) == 1 and found["entities"][0].startswith("light.bulb_e14_")


def test_pair_matter_by_code_commissions_over_ip_first(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    ha.commissionable["34970112332"] = {"serial": "EX-000009", "mac": "00:00:5e:00:53:49"}
    row = pair_matter(witness, secrets, tmp_path, ha, room="hall", code="34970112332")
    assert ha.commissioned == ["34970112332"]
    # hall_ceiling is the hall's first light: the generated id counts from it
    assert row["id"] == "hall_light_2" and row["serial"] == "EX-000009"


def test_pair_matter_says_when_nothing_or_too_much_is_fresh(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    with pytest.raises(HouseError, match="no Matter device the house does not already name"):
        pair_matter(witness, secrets, tmp_path, ha, room="hall")
    ha.matter_node("EX-000002", "00:00:5e:00:53:42")
    ha.matter_node("EX-000003", "00:00:5e:00:53:43")
    with pytest.raises(HouseError, match="2 Matter devices the house does not name") as exc:
        pair_matter(witness, secrets, tmp_path, ha, room="hall")
    assert "serial 'EX-000003'" in str(exc.value)
    row = pair_matter(witness, secrets, tmp_path, ha, room="hall", serial="EX-000003")
    assert row["serial"] == "EX-000003"
    with pytest.raises(HouseError, match="no such area"):
        pair_matter(witness, secrets, tmp_path, ha, room="attic")
    with pytest.raises(HouseError, match="--at needs a --role"):
        pair_matter(witness, secrets, tmp_path, ha, room="hall", at="left")


def test_a_device_with_no_address_is_the_one_under_the_rows_entry(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)  # the printer's ipp entry made
    ipp = ha.entries["ipp"][0]
    printer = ha.network_device(None, "ET-4750", domains=("sensor",), platform="ipp", entry=ipp)
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert states(steps)["device kitchen_printer"] == "changed"
    kitchen = next(a for a in ha.areas if a["aliases"][0] == "kitchen")
    assert printer["area_id"] == kitchen["area_id"]
    assert printer["name_by_user"] == "kitchen_printer"
    assert "sensor.kitchen_printer" in {e["entity_id"] for e in ha.entities}


def test_an_entry_holding_two_devices_names_no_row(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    cast = ha.entries["cast"][0]  # one entry for every cast on the lane
    a = ha.network_device(None, "Puck A", platform="cast", entry=cast)
    b = ha.network_device(None, "Puck B", platform="cast", entry=cast)
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert "device living_cast" not in states(steps)
    assert a["area_id"] is None and b["area_id"] is None


def test_a_node_without_a_serial_is_keyed_on_its_address(witness, secrets, tmp_path, house_with):
    """A Govee bulb reports no serial number: the walk keys its row on the
    hardware address the node's diagnostics report; apply finds it by that."""
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    ha.matter_node("EX-000001", "00:00:5e:00:53:41")  # the witness's own row
    bulb = ha.matter_node(None, "00:00:5e:00:53:52", model="Bulb")
    row = pair_matter(witness, secrets, tmp_path, ha, room="hall", role="lamp", only_fabric=True)
    found = row.pop("_found")
    assert "serial" not in row and row["mac"] == "00:00:5e:00:53:52"
    assert row["id"] == "hall_lamp_1"  # light.hall_lamp is the role's group, never a bulb's
    assert found["evicted"] == ["Google LLC (fabric 1)"] and bulb["_fabrics"] == [
        (2, "Test Vendor")
    ]

    house = load_house(
        house_with(lambda d: d["things"].append(row))
    )  # the row, where the house keeps them
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["device hall_lamp_1"] == "changed"
    hall = next(a for a in ha.areas if a["aliases"][0] == "hall")
    assert bulb["area_id"] == hall["area_id"] and bulb["name_by_user"] == "hall_lamp_1"
    assert "light.hall_lamp_1" in {e["entity_id"] for e in ha.entities}
    # a second walk: the bulb is named now, nothing is fresh
    with pytest.raises(HouseError, match="no Matter device the house does not already name"):
        pair_matter(house, secrets, tmp_path, ha, room="hall")
    # and --serial takes an address too
    ha.matter_node(None, "00:00:5e:00:53:53", model="Bulb")
    assert (
        pair_matter(house, secrets, tmp_path, ha, room="hall", serial="00:00:5E:00:53:53")["mac"]
        == "00:00:5e:00:53:53"
    )


def test_other_fabrics_are_reported_and_kept_unless_asked(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    ha.matter_node("EX-000001", "00:00:5e:00:53:41")
    bulb = ha.matter_node("EX-000002", "00:00:5e:00:53:42")
    row = pair_matter(witness, secrets, tmp_path, ha, room="hall")
    assert row["_found"]["other_fabrics"] == ["Google LLC (fabric 1)"]
    assert not row["_found"]["evicted"] and len(bulb["_fabrics"]) == 2


def test_the_house_policy_evicts_other_fabrics_at_every_apply(secrets, tmp_path, house_with):
    def policy(d):
        d["matter"] = {"only_fabric": True}

    house = load_house(house_with(policy))
    ha = FakeHA()
    apply(house, secrets, tmp_path, ha, check=False)
    bulb = ha.matter_node("EX-000001", "00:00:5e:00:53:41")  # the witness's living_bulb
    steps = apply(house, secrets, tmp_path, ha, check=True)
    evict = [s for s in steps if s.name == "device living_bulb" and "evict" in s.detail]
    assert evict and evict[0].state == "would" and len(bulb["_fabrics"]) == 2
    steps = apply(house, secrets, tmp_path, ha, check=False)
    evict = [s for s in steps if s.name == "device living_bulb" and "evict" in s.detail]
    assert evict[0].detail == "evict Google LLC (fabric 1) — the brain's fabric only"
    assert bulb["_fabrics"] == [(2, "Test Vendor")]
    again = apply(house, secrets, tmp_path, ha, check=False)
    assert not [s for s in again if "evict" in s.detail]  # nothing left to evict
    assert states(again)["device living_bulb"] == "ok"


def test_the_rooms_get_their_icons_and_the_groups_are_hidden(secrets, tmp_path, house_with):
    def icons(d):
        for a in d["areas"]:
            if a["id"] == "living":
                a["icon"] = "mdi:sofa"

    house = load_house(house_with(icons))
    ha = FakeHA()
    # the group entities the packages render, as HA registers them at start
    for g in ("light.living_lights", "light.living_main", "light.living_lamp"):
        ha.entities.append(
            {"entity_id": g, "device_id": None, "platform": "group", "hidden_by": None}
        )
    steps = apply(house, secrets, tmp_path, ha, check=False)
    living = next(a for a in ha.areas if a["aliases"][0] == "living")
    assert living.get("icon") == "mdi:sofa"
    st = [s for s in steps if s.name == "plumbing"]
    assert {s.detail.split()[1] for s in st} == {
        "light.living_lights",
        "light.living_main",
        "light.living_lamp",
    }
    assert all(e.get("hidden_by") == "user" for e in ha.entities if e.get("platform") == "group")
    again = apply(house, secrets, tmp_path, ha, check=False)
    assert not [s for s in again if s.name == "plumbing"]  # hidden already


def test_pair_ends_a_light_in_a_known_state(witness, secrets, tmp_path):
    ha = FakeHA()
    apply(witness, secrets, tmp_path, ha, check=False)
    ha.matter_node("EX-000001", "00:00:5e:00:53:41")
    ha.matter_node("EX-000002", "00:00:5e:00:53:42")
    pair_matter(witness, secrets, tmp_path, ha, room="hall", role="main")
    on = [x for x in ha.log if x == "POST /api/services/light/turn_on"]
    off = [x for x in ha.log if x == "POST /api/services/light/turn_off"]
    assert on and off, "the adoption blink: on bright, a breath, off - the state agrees after"


# --- the plan's card as a lovelace resource (0.13.2) --------------------------------
def test_the_plan_card_is_a_lovelace_resource_registered_once(witness, secrets, tmp_path):
    """Read live on 2026-09-03: imported through extra_module_url the card raced
    Home Assistant's app and lost its element to the scoped-registry polyfill.
    A resource loads after the app. The conductor registers exactly one, keyed
    on the file, rewrites it when the version in the URL moves, and never
    registers it twice."""
    from regie.floorplan import CARD_URL

    ha = FakeHA()
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert states(steps)["resource plan"] == "changed"
    assert [r["url"] for r in ha.resources] == [CARD_URL]
    assert ha.resources[0]["type"] == "module"
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert states(steps)["resource plan"] == "ok"
    assert len(ha.resources) == 1, "a second run adds nothing"
    # an older version of the card on the brain: the one resource is rewritten
    ha.resources[0]["url"] = "/local/easy-floorplan-card.js?v=0.0.1"
    steps = apply(witness, secrets, tmp_path, ha, check=True)
    assert states(steps)["resource plan"] == "would"
    assert ha.resources[0]["url"].endswith("v=0.0.1"), "check changes nothing"
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert states(steps)["resource plan"] == "changed" and ha.resources[0]["url"] == CARD_URL


def test_a_house_without_a_plan_owns_no_card_resource(house_with, secrets, tmp_path):
    import yaml

    home = house_with(lambda d: d.pop("plan"))
    for room in ("living", "hall"):
        f = home.parent / "rooms" / f"{room}.yml"
        data = yaml.safe_load(f.read_text(encoding="utf-8"))
        data.pop("plan")
        f.write_text(yaml.safe_dump(data, allow_unicode=True), encoding="utf-8")
    house = load_house(home)
    ha = FakeHA()
    ha.resources.append(
        {"id": "r1", "type": "module", "url": "/local/easy-floorplan-card.js?v=1.0.0"}
    )
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["resource plan"] == "changed"
    assert ha.resources == [], "a resource for a plan the house does not draw is removed"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert "resource plan" not in states(steps)
