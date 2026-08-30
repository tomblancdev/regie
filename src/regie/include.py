"""`include:` — one file holds one thing. A house keeps its rooms, its modes,
its effects and its stories in small files beside home.yml; the engine merges
them in before validation, by a documented rule per kind — an engine feature,
the same on a Pi and on a fleet, never a driver's trick:

- rooms: one file per room; merged INTO the area of the same id (the file's
  keys over the line's), or appended when `areas:` has no line for it
- modes / fx: exactly one file each, standing in for the block in home.yml
- scenarios: one story per file; its id is the file's stem unless it says `id:`

Paths and globs are relative to home.yml. A literal path must exist; a glob
may match nothing (a house with no story yet)."""

from __future__ import annotations

from pathlib import Path

import yaml

from .errors import HouseError

KINDS = ("rooms", "modes", "fx", "scenarios")


def _patterns(value) -> list[str]:
    return [value] if isinstance(value, str) else list(value or [])


def _files(base: Path, pattern: str) -> list[Path]:
    if any(c in pattern for c in "*?["):
        return sorted(p for p in base.glob(pattern) if p.is_file())
    path = base / pattern
    if not path.is_file():
        raise HouseError(f"include: {pattern} — no such file beside home.yml")
    return [path]


def _load(path: Path) -> dict:
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        raise HouseError(f"{path.name}: not YAML — {exc}") from exc
    if not isinstance(data, dict):
        raise HouseError(f"{path.name}: a mapping was expected at the top")
    return data


def merge_includes(data: dict, base: Path) -> dict[str, list[Path]]:
    """Merge every included file into `data`, in place; returns what was read,
    by kind (the check report names the files)."""
    inc = data.get("include")
    if inc is None:
        return {}
    if not isinstance(inc, dict):
        raise HouseError(
            "include: a mapping of rooms / modes / fx / scenarios → files was expected"
        )
    unknown = sorted(set(inc) - set(KINDS))
    if unknown:
        raise HouseError(
            f"include: unknown kind(s) {', '.join(unknown)} — known: {', '.join(KINDS)}"
        )

    read: dict[str, list[Path]] = {}
    for kind in KINDS:
        files = [f for pat in _patterns(inc.get(kind)) for f in _files(base, pat)]
        read[kind] = files
        if not files:
            continue
        if kind == "rooms":
            _merge_rooms(data, files)
        elif kind == "scenarios":
            _merge_scenarios(data, files)
        else:
            if len(files) > 1:
                names = ", ".join(f.name for f in files)
                raise HouseError(
                    f"include.{kind}: one file was expected, {len(files)} matched — {names}"
                )
            if data.get(kind) is not None:
                raise HouseError(
                    f"include.{kind}: {files[0].name} and a `{kind}:` block in home.yml — "
                    "one or the other"
                )
            data[kind] = _load(files[0])
    return read


def _merge_rooms(data: dict, files: list[Path]) -> None:
    areas = data.setdefault("areas", [])
    if not isinstance(areas, list):
        raise HouseError("areas: a list was expected")
    by_id = {a.get("id"): a for a in areas if isinstance(a, dict)}
    seen: dict[str, Path] = {}
    for path in files:
        room = _load(path)
        room_id = room.get("id")
        if not isinstance(room_id, str):
            raise HouseError(f"{path.name}: a room file names its `id:`")
        if room_id in seen:
            raise HouseError(f"{path.name}: room {room_id!r} is already {seen[room_id].name}")
        seen[room_id] = path
        room["_source"] = path.name
        if room_id in by_id:
            by_id[room_id].update(room)
        else:
            areas.append(room)
            by_id[room_id] = room


def _merge_scenarios(data: dict, files: list[Path]) -> None:
    stories = data.setdefault("scenarios", [])
    if not isinstance(stories, list):
        raise HouseError("scenarios: a list was expected")
    for path in files:
        story = _load(path)
        story.setdefault("id", path.stem.replace("-", "_"))
        story["_source"] = path.name
        stories.append(story)
