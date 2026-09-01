"""Zigbee2MQTT, at its own door.

The engine reaches a radio's Zigbee2MQTT through the **frontend's
websocket** (`ws://127.0.0.1:<port>/api`), never through the broker: the
frontend relays every one of the instance's MQTT messages as
`{topic, payload}` and publishes what it is sent. So the walk needs no
broker credential, no MQTT client and no second dependency — one door, on
the loopback the brain already owns, and the same one its UI uses.

On connect the frontend replays what it holds: `bridge/info`,
`bridge/devices`, `bridge/groups`, `bridge/state` and each thing's last
state. That replay IS the snapshot — there is nothing to ask for.

A request is `bridge/request/<name>`; the answer comes back on
`bridge/response/<name>` carrying `status: ok | error`. Every request here
carries a `transaction`, which Zigbee2MQTT echoes (its `utils.js`), so an
answer is matched to its question rather than to whatever arrives next —
a walk publishes while a mesh is chattering.
"""

from __future__ import annotations

import json
import time
from contextlib import contextmanager
from dataclasses import dataclass, field

from .errors import HouseError

CACHED = ("bridge/info", "bridge/devices", "bridge/groups", "bridge/state")


@dataclass
class Z2M:
    """One Zigbee2MQTT instance, over its frontend's websocket."""

    url: str
    conn: object | None = None
    cache: dict = field(default_factory=dict)
    _n: int = 0

    # --- the connection ------------------------------------------------------
    def open(self, timeout: int = 20, wait: float = 0) -> Z2M:
        """`wait` seconds of patience for a door that is not listening YET.

        The converge renders Zigbee2MQTT's files, `up` restarts it when they
        changed, and `apply` follows immediately — but the frontend binds its
        socket seconds after the unit starts, so the connection is REFUSED and
        the whole mesh half (names, the room's group, the bindings) is skipped
        while the run still reports success. Found at W1's walk, 2026-09-01:
        every converge that touches a Z2M file would have needed a second one,
        silently. A refused connection is a door not open yet; anything else
        is a door that is wrong, and fails at once."""
        from websockets.sync.client import connect

        deadline = time.monotonic() + wait
        while True:
            try:
                self.conn = connect(self.url, open_timeout=timeout, max_size=None)
                break
            except (ConnectionRefusedError, OSError) as exc:
                if time.monotonic() >= deadline:
                    raise HouseError(
                        f"{self.url}: no Zigbee2MQTT at that door ({exc}) — is zigbee2mqtt "
                        "running, and is this the right radio's port?"
                    ) from exc
                time.sleep(1)
            except Exception as exc:  # noqa: BLE001 - one message, whatever the transport said
                raise HouseError(
                    f"{self.url}: no Zigbee2MQTT at that door ({exc}) — is zigbee2mqtt running, "
                    "and is this the right radio's port?"
                ) from exc
        self.drain(timeout=timeout)
        return self

    def close(self) -> None:
        if self.conn is not None:
            self.conn.close()
            self.conn = None

    def __enter__(self) -> Z2M:
        return self.open()

    def __exit__(self, *_exc) -> None:
        self.close()

    # --- reading -------------------------------------------------------------
    def recv(self, timeout: float) -> tuple[str, object] | None:
        """The next message, or None when the wait ran out."""
        try:
            raw = self.conn.recv(timeout=timeout)
        except TimeoutError:
            return None
        except Exception as exc:  # noqa: BLE001
            raise HouseError(f"{self.url}: the connection dropped ({exc})") from exc
        try:
            msg = json.loads(raw)
        except (TypeError, ValueError):
            return None
        topic, payload = msg.get("topic"), msg.get("payload")
        if topic in CACHED:
            self.cache[topic] = payload
        return topic, payload

    def drain(self, timeout: float = 10) -> None:
        """Read the replay until the cached topics are in hand (or the wait
        ends): the frontend sends them first, but a busy mesh interleaves."""
        end = time.monotonic() + timeout
        while time.monotonic() < end:
            if all(t in self.cache for t in CACHED):
                return
            if self.recv(timeout=max(0.1, end - time.monotonic())) is None:
                return

    @property
    def info(self) -> dict:
        return self.cache.get("bridge/info") or {}

    @property
    def devices(self) -> list[dict]:
        return [d for d in (self.cache.get("bridge/devices") or []) if d.get("ieee_address")]

    @property
    def groups(self) -> list[dict]:
        return list(self.cache.get("bridge/groups") or [])

    @property
    def online(self) -> bool:
        return (self.cache.get("bridge/state") or {}).get("state") == "online"

    def device(self, ieee: str) -> dict | None:
        return next((d for d in self.devices if d["ieee_address"] == ieee), None)

    # --- writing -------------------------------------------------------------
    def publish(self, topic: str, payload) -> None:
        self.conn.send(json.dumps({"topic": topic, "payload": payload}))

    def request(self, name: str, payload: dict | None = None, timeout: float = 30) -> dict:
        """`bridge/request/<name>` → its `bridge/response/<name>`, matched by
        transaction. Raises what Zigbee2MQTT itself said on `status: error`."""
        self._n += 1
        tag = f"regie-{self._n}"
        self.publish(f"bridge/request/{name}", {**(payload or {}), "transaction": tag})
        end = time.monotonic() + timeout
        while time.monotonic() < end:
            got = self.recv(timeout=max(0.1, end - time.monotonic()))
            if got is None:
                break
            topic, body = got
            if topic != f"bridge/response/{name}" or not isinstance(body, dict):
                continue
            if body.get("transaction") not in (tag, None):
                continue
            if body.get("status") == "error":
                raise HouseError(f"zigbee2mqtt {name}: {body.get('error') or body}")
            return body.get("data") or {}
        raise HouseError(f"zigbee2mqtt {name}: no answer in {timeout:g} s")

    @contextmanager
    def join_window(self, seconds: int):
        """The join window, closed again whatever happens — a window left open
        is a stranger's door (any thing in range joins the house's mesh)."""
        self.request("permit_join", {"time": seconds})
        try:
            yield
        finally:
            try:
                self.request("permit_join", {"time": 0}, timeout=10)
            except HouseError:
                pass
