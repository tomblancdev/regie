"""Profiles — where a brain runs. A folder with a profile.yml and the unit
templates that differ from one host to another; the config tree is the
base's and the same everywhere."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import yaml

from .errors import HouseError

HERE = Path(__file__).parent / "profiles"


@dataclass
class Profile:
    name: str
    path: Path
    data: dict

    @property
    def summary(self) -> str:
        return self.data.get("summary", "")

    @property
    def templates(self) -> list[dict]:
        return list(self.data.get("templates", []))

    @property
    def templates_dir(self) -> Path:
        return self.path / "templates"

    @property
    def pins(self) -> dict:
        return dict(self.data.get("pins", {}))

    @property
    def images(self) -> dict:
        return dict(self.data.get("images", {}))

    @property
    def users(self) -> dict:
        """The uid an image runs as, by name (a rendered file it must read is chowned to it)."""
        return dict(self.data.get("users", {}))

    @property
    def dirs(self) -> list[dict]:
        """The directories the units mount, made before the first start (a
        `path` under the root, an `owner` among users, a `when`)."""
        return list(self.data.get("dirs", []))

    @property
    def root(self) -> str:
        return self.data.get("root", "/srv/home")

    @property
    def units_dir(self) -> str:
        return self.data.get("units_dir", "/etc/containers/systemd")


def known_profiles() -> list[str]:
    return sorted(d.name for d in HERE.iterdir() if (d / "profile.yml").is_file())


def load_profile(name: str) -> Profile:
    path = HERE / name
    if not (path / "profile.yml").is_file():
        raise HouseError(f"unknown profile {name!r} — known: {', '.join(known_profiles())}")
    data = yaml.safe_load((path / "profile.yml").read_text(encoding="utf-8")) or {}
    return Profile(name, path, data)
