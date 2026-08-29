"""A small Home Assistant client: REST (urllib) and the websocket API. The
conductor speaks through this and nothing else, so a fake of these few
methods is a whole fake Home Assistant for the tests."""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from contextlib import contextmanager
from typing import Any

from .errors import HouseError


class HomeAssistant:
    def __init__(self, url: str = "http://127.0.0.1:8123", token: str | None = None):
        self.url = url.rstrip("/")
        self.token = token

    # --- REST -------------------------------------------------------------
    def _request(
        self, method: str, path: str, body: bytes | None, headers: dict, auth: bool
    ) -> tuple[int, Any]:
        h = dict(headers)
        if auth:
            if not self.token:
                raise HouseError(f"{path}: no token to speak with")
            h["Authorization"] = f"Bearer {self.token}"
        req = urllib.request.Request(self.url + path, data=body, method=method, headers=h)
        try:
            with urllib.request.urlopen(req, timeout=60) as r:  # noqa: S310 - the brain's own address
                raw = r.read()
                status = r.status
        except urllib.error.HTTPError as exc:
            raw = exc.read()
            status = exc.code
        except urllib.error.URLError as exc:
            raise HouseError(f"{self.url}: not reachable ({exc.reason})") from exc
        try:
            data = json.loads(raw) if raw else None
        except ValueError:
            data = raw.decode("utf-8", "replace")
        return status, data

    def get(self, path: str, auth: bool = True) -> tuple[int, Any]:
        return self._request("GET", path, None, {}, auth)

    def post(self, path: str, body: dict, auth: bool = True) -> tuple[int, Any]:
        data = json.dumps(body).encode("utf-8")
        return self._request("POST", path, data, {"Content-Type": "application/json"}, auth)

    def post_form(self, path: str, fields: dict) -> tuple[int, Any]:
        data = urllib.parse.urlencode(fields).encode("utf-8")
        return self._request(
            "POST", path, data, {"Content-Type": "application/x-www-form-urlencoded"}, False
        )

    # --- websocket --------------------------------------------------------
    @contextmanager
    def ws(self):
        from websockets.sync.client import connect  # imported here: the REST half needs nothing

        ws_url = self.url.replace("http://", "ws://").replace("https://", "wss://")
        try:
            conn = connect(f"{ws_url}/api/websocket", open_timeout=30)
        except OSError as exc:
            raise HouseError(f"{ws_url}/api/websocket: not reachable ({exc})") from exc
        try:
            first = json.loads(conn.recv())
            if first.get("type") != "auth_required":
                raise HouseError(f"websocket: expected auth_required, got {first}")
            conn.send(json.dumps({"type": "auth", "access_token": self.token}))
            reply = json.loads(conn.recv())
            if reply.get("type") != "auth_ok":
                raise HouseError(f"websocket: refused ({reply.get('message', reply)})")
            yield Ws(conn)
        finally:
            conn.close()


class Ws:
    def __init__(self, conn):
        self.conn = conn
        self.n = 0

    def call(self, type_: str, **payload) -> Any:
        self.n += 1
        msg = {"id": self.n, "type": type_, **payload}
        self.conn.send(json.dumps(msg))
        while True:
            reply = json.loads(self.conn.recv())
            if reply.get("id") != self.n or reply.get("type") != "result":
                continue  # an event for somebody else
            if not reply.get("success"):
                err = reply.get("error", {})
                raise HouseError(f"{type_}: {err.get('code')} — {err.get('message')}")
            return reply.get("result")
