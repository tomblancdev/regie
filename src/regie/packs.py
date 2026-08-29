"""Packs — use cases. A folder: a pack.yml, an optional schema fragment, the
templates it instantiates from the things, its tests. The product ships its
own; a house adds its own from a directory of its choosing — same loader,
same shape, so what must stay private never enters the public product."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from .errors import HouseError

HERE = Path(__file__).parent / "packs"


@dataclass
class Pack:
    name: str
    path: Path
    data: dict
    origin: str  # "product" or "house"
    fragment: dict = field(default_factory=dict)

    @property
    def summary(self) -> str:
        return self.data.get("summary", "")

    @property
    def kinds(self) -> list[str]:
        return list(self.fragment.get("kinds", self.data.get("kinds", [])))

    @property
    def via(self) -> list[str]:
        return list(self.fragment.get("via", self.data.get("via", [])))

    @property
    def services(self) -> list[dict]:
        return list(self.data.get("services", []))

    @property
    def templates(self) -> list[dict]:
        return list(self.data.get("templates", []))

    @property
    def cards(self) -> list[dict]:
        return list(self.data.get("cards", []))

    @property
    def templates_dir(self) -> Path:
        return self.path / "templates"


def _packs_in(directory: Path | None) -> dict[str, Path]:
    if directory is None or not directory.is_dir():
        return {}
    return {d.name: d for d in sorted(directory.iterdir()) if (d / "pack.yml").is_file()}


def product_packs() -> dict[str, Path]:
    return _packs_in(HERE)


def house_packs(house_dir: Path, rel: str | None) -> dict[str, Path]:
    if not rel:
        return {}
    return _packs_in((house_dir / rel).resolve())


def _load(name: str, path: Path, origin: str) -> Pack:
    data = yaml.safe_load((path / "pack.yml").read_text(encoding="utf-8")) or {}
    if data.get("name") != name:
        raise HouseError(
            f"pack {path}: pack.yml says name {data.get('name')!r}, the folder says {name!r}"
        )
    fragment: dict = {}
    if data.get("schema"):
        fragment = json.loads((path / data["schema"]).read_text(encoding="utf-8"))
    return Pack(name, path, data, origin, fragment)


def load_packs(names: list[str], house_dir: Path, house_rel: str | None) -> list[Pack]:
    product = product_packs()
    house = house_packs(house_dir, house_rel)
    shadowed = sorted(set(product) & set(house))
    if shadowed:
        raise HouseError(
            f"a house pack may not wear a product pack's name: {', '.join(shadowed)} "
            f"(house packs in {house_rel})"
        )
    packs = []
    for name in names:
        if name in product:
            packs.append(_load(name, product[name], "product"))
        elif name in house:
            packs.append(_load(name, house[name], "house"))
        else:
            known = ", ".join(sorted(product)) or "none"
            own = (
                f"; house packs ({house_rel}): {', '.join(sorted(house)) or 'none'}"
                if house_rel
                else ""
            )
            raise HouseError(f"unknown pack {name!r} — product packs: {known}{own}")
    return packs
