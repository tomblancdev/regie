"""The fx pack's hooks (0.38, the audit's V9; the compiler beside them 0.44,
V14).

The pack's FACE: everything the engine asks of the effects passes through
here, and nothing of the effects lives outside this folder any more.

  * `vocabulary` — the words fx adds to the house: which shapes exist and
    which of them send a COLOUR (the palette's `life:` asks, to know which
    bulbs a sign may land on), and the line `regie check` prints — the
    backend, its step, the scripts, and every hold or temperature the
    envelope stretches;
  * `check` — does the house name a backend and shapes that exist;
  * `context` — `fx_scripts`, which `templates/packages/fx.yaml.j2` and
    nothing else reads;
  * `share` — the pack's luggage (0.45, H52): a shape as a script blueprint,
    for a friend's plain Home Assistant. fx is the first user of the fifth
    hook, in the release that adds it — a mechanism with no real user is
    unproven (V9's rule).

`compiler.py` beside this file is the arithmetic: shapes flattened, holds
clamped, one Home Assistant script per enabled shape. It is reached as a
module of THIS package — the engine loads a pack's declared module with the
pack's own folder as its search path, so a house pack carrying its own
compiler is a folder, on exactly these terms."""

from regie.house import KELVIN

from . import compiler  # noqa: F401 — the arithmetic, reachable through the pack's face
from .compiler import (
    blueprint_file,
    compile_all,
    compile_shape,
    known_backends,
    load_backend,
    load_shapes,
    moves_colour,
)


def vocabulary(house):
    fx = house.fx()
    shapes = load_shapes(fx.get("shapes"))
    words = {"shapes": {name: {"moves_colour": moves_colour(name, shapes)} for name in shapes}}
    if fx.get("backend") not in known_backends():
        # the shapes are still the house's words; the backend is refused by
        # `check` below, once, in a sentence that names every backend there is
        return words, []
    scripts, notes, backend = compile_all(fx, house.data["house"]["label"])
    lines = [
        f"fx: backend {backend['name']} (step {backend['envelope'].get('step', 0)} s) · "
        f"{len(scripts)} script(s): {', '.join(s[3:] for s in scripts)}"
    ]
    lines += [f"  ~ {n}" for n in notes]
    return words, lines


def check(house):
    errors: list[str] = []
    warnings: list[str] = []
    hints: list[str] = []
    fx = house.fx()
    if fx.get("backend") not in known_backends():
        errors.append(
            f"fx: unknown backend {fx.get('backend')!r} — known: {', '.join(known_backends())}"
        )
    shapes = load_shapes(fx.get("shapes"))
    if not fx.get("enable"):
        hints.append(
            f"fx: no enable: — every shape of the library renders a script ({len(shapes)}); "
            "an enable: list picks"
        )
    for name in fx.get("enable") or []:
        if name not in shapes:
            errors.append(
                f"fx.enable: {name!r} is not a shape — known: {', '.join(sorted(shapes))}"
            )
    # a story step that fires an effect: the shape must be one, and enabled —
    # the scenarios pack checks its own words (the modes, the looks), this
    # pack checks the word that is its own
    for s in house.scenarios:
        for i, step in enumerate(s["steps"], 1):
            if "fx" not in step:
                continue
            where = f"scenario {s['id']} step {i}"
            shape = step["fx"]["shape"]
            if shape not in shapes:
                errors.append(f"{where}: shape {shape!r} is not one")
            if fx.get("enable") and shape not in fx["enable"]:
                errors.append(f"{where}: shape {shape!r} is not enabled in fx")
    return errors, warnings, hints


def context(house):
    scripts, _notes, _backend = compile_all(house.fx(), house.data["house"]["label"])
    return {"fx_scripts": scripts}


def share(house, kind, id):
    """A shape, for a friend who does not run La Régie (0.45, H52).

    Its library, not its `enable:` list: what a house RUNS on its own ceilings
    and what it is willing to send are two questions, and a shape it does not
    enable is still one it wrote. `id` absent means the whole shelf — which is
    what CI renders into the product's `blueprints/` at every tag.

    Always compiled for `ha`, whatever backend this house runs on: the generic
    light-service loop is exactly what a plain brain has, and a file compiled
    for a radio the friend's brain cannot drive would be a promise, not a
    gift. The house's own white words travel with it — a `warm` this house
    set to 2400 K leaves as 2400 K, because that is what the shape means
    here."""
    if kind != "fx":
        return None
    fx = house.fx()
    shapes = load_shapes(fx.get("shapes"))
    backend = load_backend("ha")
    kelvin = {**KELVIN, **(fx.get("kelvin") or {})}
    ids = sorted(shapes) if id is None else [id]
    return {
        f"script/regie/fx_{shape_id}.yaml": blueprint_file(
            compile_shape(shape_id, shapes, backend, kelvin), backend
        )
        for shape_id in ids
    }
