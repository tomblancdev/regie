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
    nothing else reads.

`compiler.py` beside this file is the arithmetic: shapes flattened, holds
clamped, one Home Assistant script per enabled shape. It is reached as a
module of THIS package — the engine loads a pack's declared module with the
pack's own folder as its search path, so a house pack carrying its own
compiler is a folder, on exactly these terms."""

from . import compiler  # noqa: F401 — the arithmetic, reachable through the pack's face
from .compiler import compile_all, known_backends, load_shapes, moves_colour


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
