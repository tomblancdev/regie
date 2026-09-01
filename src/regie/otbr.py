"""The Thread border router, at its REST door.

A border router is not a service of the brain's: it is a box on the lane
running OpenThread itself, and the only thing the engine wants from it —
before it hands its address to Home Assistant — is the name of the network
it is holding right now.

That one read is the whole guard. Home Assistant's `otbr` config flow reads
the router's active dataset when it is set up, and **if the router has none
it MINTS one**: a random PAN id, a generated network name, a key nobody
wrote down. So a router that was factory-reset — or that the house's own
dataset was never pushed onto — would quietly become the source of truth for
a Thread network the house cannot reproduce. The house's dataset goes on
BEFORE anything is commissioned, never after (home.md §4.3), and the way to
mean that mechanically is to refuse to introduce a router that is not
already holding the house's network.

Two things the wire taught us, both live on SLZB-OS v3.3.1 (2026-09-01):

- **An unknown path answers `200`, with a body that says 404.** So a status
  code proves nothing here: the network name is read out of the body, and a
  body that does not carry one is "not a border router at this door", not a
  network named `None`.
- **The keys come back PascalCase** (`NetworkName`), while the same REST API
  post-Sept-2025 upstream speaks camelCase (`networkName`) — Home Assistant's
  own client normalises between the two. So this reader accepts either
  spelling rather than pinning the one box we own today.

Nothing here writes. The dataset is minted into the secrets and pushed onto
the router by whatever drives the fleet: the engine reads, and says what it
saw.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request
from dataclasses import dataclass

from .errors import HouseError


@dataclass
class Otbr:
    """One border router, at `http://<host>:<port>`."""

    url: str
    timeout: int = 10

    def _get(self, path: str) -> object:
        req = urllib.request.Request(self.url + path, method="GET")
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as r:  # noqa: S310 - the lane's own box
                raw = r.read()
        except (urllib.error.URLError, OSError, TimeoutError) as exc:
            raise HouseError(f"{self.url}: no border router at that door ({exc})") from exc
        try:
            return json.loads(raw) if raw else None
        except ValueError as exc:
            raise HouseError(f"{self.url}{path}: the answer is not JSON") from exc

    def network_name(self) -> str | None:
        """The name of the network the router holds, or None if it holds none.

        None covers both shapes of empty: a router that has no dataset at all,
        and a door that answers something which is not a border router's
        `/node` — the 200-with-a-404-body an unknown path returns on this
        firmware. Either way there is no network here to introduce."""
        node = self._get("/node")
        if not isinstance(node, dict):
            return None
        for key in ("NetworkName", "networkName"):
            value = node.get(key)
            if isinstance(value, str) and value:
                return value
        return None
