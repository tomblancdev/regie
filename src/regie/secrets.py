"""Secrets are VALUES the engine is handed — it never knows the store. A file
(`--secrets FILE`, YAML name → value) and/or the environment
(REGIE_SECRET_<NAME>); the file wins nothing, the environment overrides."""

from __future__ import annotations

import base64
import hashlib
import os
import secrets as _secrets
from pathlib import Path

import yaml

from .errors import HouseError

ENV_PREFIX = "REGIE_SECRET_"
MOSQUITTO_ITERATIONS = 101


def mosquitto_hash(password: str, salt_seed: str) -> str:
    """A Mosquitto 2.x password_file entry: $7$<iterations>$<salt>$<pbkdf2-sha512>.

    The salt is derived from the user's name and the password, so rendering
    the same secret twice writes the same bytes (a converge reads changed=0);
    a changed password changes the salt with it.
    """
    salt = hashlib.sha256(f"{salt_seed}:{password}".encode()).digest()[:12]
    key = hashlib.pbkdf2_hmac("sha512", password.encode(), salt, MOSQUITTO_ITERATIONS, dklen=64)
    return (
        f"$7${MOSQUITTO_ITERATIONS}$"
        f"{base64.b64encode(salt).decode()}${base64.b64encode(key).decode()}"
    )


def mint(name: str):
    """A fresh value of the right shape for a secret's name."""
    if name.endswith("_network_key"):
        return [_secrets.randbelow(256) for _ in range(16)]
    if name.endswith("_ext_pan_id"):
        return [_secrets.randbelow(256) for _ in range(8)]
    if name.endswith("_pan_id"):
        return 1 + _secrets.randbelow(0xFFFE - 1)  # never 0 nor the broadcast 0xFFFF
    return _secrets.token_urlsafe(24)


def _structured(name: str) -> bool:
    return name.endswith(("_network_key", "_ext_pan_id", "_pan_id"))


def load_secrets(path: Path | None, environ: dict | None = None) -> dict:
    values: dict = {}
    if path is not None:
        try:
            data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        except (OSError, yaml.YAMLError) as exc:
            raise HouseError(f"secrets {path}: {exc}") from exc
        if not isinstance(data, dict):
            raise HouseError(f"secrets {path}: a mapping of name: value was expected")
        values.update(data)
    env = os.environ if environ is None else environ
    for key, raw in env.items():
        if not key.startswith(ENV_PREFIX):
            continue
        name = key[len(ENV_PREFIX) :].lower()
        values[name] = yaml.safe_load(raw) if _structured(name) else raw
    return values


def dump_secrets(values: dict) -> str:
    return yaml.safe_dump(values, allow_unicode=True, sort_keys=True, default_flow_style=None)
