"""The host — what the engine does on the brain's machine beyond writing
files: run its commands (systemctl, podman), fetch a pinned artefact, keep a
note of what it placed. `--check` turns every command that changes something
into a line of the plan; queries still run, so the plan is read from the
machine, not guessed."""

from __future__ import annotations

import hashlib
import json
import subprocess
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

from .errors import HouseError

STATE = ".regie"


@dataclass
class Runner:
    """Commands on the host. `run` changes something (skipped under --check);
    `query` only asks (always runs)."""

    check: bool = False
    log: list[str] = field(default_factory=list)

    def run(self, *cmd: str) -> str:
        self.log.append(" ".join(cmd))
        if self.check:
            return ""
        return self._exec(cmd)

    def query(self, *cmd: str) -> tuple[int, str]:
        try:
            p = subprocess.run(cmd, text=True, capture_output=True, check=False)
        except FileNotFoundError:
            if self.check:
                return 127, ""  # the plan can still be printed where the tool is missing
            raise HouseError(f"{cmd[0]} is not installed on this host") from None
        return p.returncode, p.stdout

    def _exec(self, cmd: tuple[str, ...]) -> str:
        p = subprocess.run(cmd, text=True, capture_output=True, check=False)
        if p.returncode != 0:
            raise HouseError(f"{' '.join(cmd)}: exit {p.returncode}\n{p.stderr.strip()}")
        return p.stdout


def fetch(url: str, timeout: int = 120) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "regie"})
    with urllib.request.urlopen(req, timeout=timeout) as r:  # noqa: S310 - a pinned https URL
        return r.read()


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_state(root: Path, name: str) -> dict:
    p = root / STATE / name
    if not p.is_file():
        return {}
    return json.loads(p.read_text(encoding="utf-8"))


def write_state(root: Path, name: str, data: dict) -> None:
    p = root / STATE / name
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def file_hashes(root: Path, rels: list[str]) -> dict[str, str]:
    out = {}
    for rel in rels:
        p = root / rel
        if p.is_file():
            out[rel] = sha256(p.read_bytes())
    return out
