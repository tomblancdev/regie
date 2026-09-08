"""Packs — use cases. A folder: a pack.yml, an optional schema fragment, the
templates it instantiates from the things, its tests — and, since 0.38 (the
audit's V9), an optional Python module the engine calls at check, render and
apply. The product ships its own; a house adds its own from a directory of
its choosing — same loader, same shape, so what must stay private never
enters the public product, and the plugin shape IS the pack folder.

A pack that carries code carries as MUCH code as it needs: the declared
module is loaded as a package whose search path is the pack's own folder, so
`hooks.py` says `from .compiler import …` and the rest of the pack lives
beside it (0.44, the audit's V14 — fx's four hundred lines of arithmetic came
home that way). One module is the FACE; the folder is the plugin.

A pack that declares `hooks:` is CODE: the module runs inside the engine's
own process, as whoever runs `regie` — root, on the brain, with the
conductor's token in reach. Loading such a pack trusts its author exactly as
much as the engine's. `regie check` and `regie packs` name the packs that
carry one, before a line of it runs; there is no sandbox and a fake one
would be worse than this sentence."""

from __future__ import annotations

import importlib.util
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

from . import yamlio
from .errors import HouseError

HERE = Path(__file__).parent / "packs"

# the call sites, in the order a run meets them (0.38, a fourth at 0.44): the
# words a pack adds to the house — read while the house is cross-checked, and
# printed by `regie check` — then the cross-check's own questions, the
# render's context, the conductor's run. A pack answers to none, some or all.
# `share` (0.45, H52) is the odd one: no run meets it. It is a VERB's hook —
# `regie share` asks a pack to strip one of its things for a friend's plain
# Home Assistant, and the pack that renders a thing is the one that knows how
# to send it (see share.py for the contract it answers by).
HOOKS = ("vocabulary", "check", "context", "apply", "share")


@dataclass
class Pack:
    name: str
    path: Path
    data: dict
    origin: str  # "product" or "house"
    fragment: dict = field(default_factory=dict)
    _module: object | None = field(default=None, init=False, repr=False, compare=False)

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
    def settings(self) -> list[dict]:
        """The cards of the settings view (controls.panel) — same shape as cards."""
        return list(self.data.get("settings", []))

    @property
    def templates_dir(self) -> Path:
        return self.path / "templates"

    @property
    def hooks_file(self) -> str:
        """The Python module the pack declares beside its pack.yml, or "" — a
        pack that declares none carries no code, and none is looked for: a
        stray .py in a folder never runs."""
        return str(self.data.get("hooks") or "")

    @property
    def hooks(self):
        """The pack's module, imported once — None when it declares none.

        Loaded from its PATH, never as `regie.packs.<name>`: the packs ship as
        data (there is no `__init__.py` anywhere under `packs/`) and a house
        pack lives outside the installed engine altogether. One loader for
        both, so a house pack is a plugin on exactly the product's terms.

        It is loaded as a PACKAGE rooted in the pack's folder (0.44): a pack
        whose code outgrows one file says `from .compiler import …` and the
        engine finds it — inside the folder, never outside it."""
        if not self.hooks_file:
            return None
        if self._module is None:
            self._module = _import(self)
        return self._module


def _import(pack: Pack):
    file = pack.path / pack.hooks_file
    name = f"regie_pack_{pack.origin}_{pack.name}"
    # a package, its search path the pack's own folder: `from .compiler import`
    # inside the declared module reaches the file beside it and nothing else
    spec = importlib.util.spec_from_file_location(
        name, file, submodule_search_locations=[str(pack.path)]
    )
    if spec is None or spec.loader is None:
        raise HouseError(f"pack {pack.name}: {file} is not a Python module")
    module = importlib.util.module_from_spec(spec)
    # a pack imported again is imported WHOLE: the modules beside the face are
    # dropped first, or a house pack whose file changed on disk between two
    # loads would run the previous load's code (0.44)
    for stale in [m for m in sys.modules if m == name or m.startswith(f"{name}.")]:
        del sys.modules[stale]
    # named in sys.modules before it runs: a dataclass, a typing lookup or a
    # relative helper inside the module asks for its own name while importing
    sys.modules[name] = module
    try:
        spec.loader.exec_module(module)
    except HouseError:
        del sys.modules[name]
        raise
    except Exception as exc:
        del sys.modules[name]
        raise HouseError(f"pack {pack.name}: {pack.hooks_file} does not import — {exc!r}") from exc
    if not any(hasattr(module, hook) for hook in HOOKS):
        # a module named by pack.yml and answering to nothing is a typo, not a
        # choice — a pack that wants no code declares none
        raise HouseError(
            f"pack {pack.name}: {pack.hooks_file} answers to none of "
            f"{', '.join(HOOKS)} — a misspelt name is silent otherwise"
        )
    return module


def hooks_of(packs: list[Pack], hook: str) -> list[tuple[Pack, object]]:
    """Every pack of the house that answers to `hook`, in the house's own
    order (`packs:` in home.yml) — a pack's hooks run where the house put it."""
    found = []
    for p in packs:
        module = p.hooks
        if module is None:
            continue
        fn = getattr(module, hook, None)
        if fn is None:
            continue
        if not callable(fn):
            raise HouseError(f"pack {p.name}: {hook} in {p.hooks_file} is not a function")
        found.append((p, fn))
    return found


def call_hook(pack: Pack, hook: str, fn, *args):
    """A hook run. Its own HouseError is the pack's word and passes through
    untouched; anything else is named — a broken pack tells the family which
    pack broke, never a traceback."""
    try:
        return fn(*args)
    except HouseError:
        raise
    except Exception as exc:
        raise HouseError(f"pack {pack.name}: the {hook} hook failed — {exc!r}") from exc


def _packs_in(directory: Path | None) -> dict[str, Path]:
    if directory is None or not directory.is_dir():
        return {}
    return {d.name: d for d in sorted(directory.iterdir()) if (d / "pack.yml").is_file()}


def product_packs() -> dict[str, Path]:
    return _packs_in(HERE)


def product_pack(name: str) -> Pack:
    """One of the product's own packs, loaded on its own — the door a pack's
    tests come in by, and the only one: a pack's modules are never importable
    as `regie.packs.<name>.<module>`."""
    paths = product_packs()
    if name not in paths:
        raise HouseError(f"unknown pack {name!r} — product packs: {', '.join(sorted(paths))}")
    return _load(name, paths[name], "product")


def house_packs(house_dir: Path, rel: str | None) -> dict[str, Path]:
    if not rel:
        return {}
    return _packs_in((house_dir / rel).resolve())


def _load(name: str, path: Path, origin: str) -> Pack:
    data = yamlio.load((path / "pack.yml").read_text(encoding="utf-8")) or {}
    if data.get("name") != name:
        raise HouseError(
            f"pack {path}: pack.yml says name {data.get('name')!r}, the folder says {name!r}"
        )
    fragment: dict = {}
    if data.get("schema"):
        fragment = json.loads((path / data["schema"]).read_text(encoding="utf-8"))
    hooks = data.get("hooks")
    if hooks:
        rel = Path(str(hooks))
        if rel.is_absolute() or ".." in rel.parts:
            raise HouseError(
                f"pack {path}: hooks {hooks!r} — a pack's code lives inside its own folder"
            )
        if not (path / rel).is_file():
            raise HouseError(f"pack {path}: pack.yml declares hooks {hooks!r} — no such file")
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
