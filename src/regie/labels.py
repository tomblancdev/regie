"""The family's words. Ids are English and stable; labels are per language."""

from __future__ import annotations

from pathlib import Path

import yaml

HERE = Path(__file__).parent / "labels"


class _Attr(dict):
    """A dict a template can read as attributes: labels.ui.home."""

    def __getattr__(self, key: str):
        try:
            return self[key]
        except KeyError as exc:
            raise AttributeError(key) from exc


class Labels:
    def __init__(self, lang: str):
        self.lang = lang
        path = HERE / f"{lang}.yml"
        self.found = path.exists()
        if not self.found:
            path = HERE / "en.yml"
        self.data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}

    @staticmethod
    def known() -> list[str]:
        return sorted(p.stem for p in HERE.glob("*.yml"))

    def kind(self, kind: str) -> str:
        """An unknown kind prints as its id — never an error."""
        return self.data.get("kinds", {}).get(kind, kind)

    def via(self, via: str) -> str:
        return self.data.get("via", {}).get(via, via)

    def scene(self, scene: str) -> str:
        """A look's own `label:` wins; failing that, the standard names are
        translated here like the kinds. A look this house invented — the ones
        worth naming — falls back to its id, and gets a `label:` in its room."""
        return self.data.get("scenes", {}).get(scene, scene)

    @property
    def kinds(self) -> dict[str, str]:
        return dict(self.data.get("kinds", {}))

    @property
    def ui(self) -> _Attr:
        return _Attr(self.data.get("ui", {}))
