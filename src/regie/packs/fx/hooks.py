"""The fx pack's hooks (0.38, the audit's V9).

Two questions only this pack can answer, moved out of the engine and into the
folder that owns them: does the house name a backend and shapes that exist
(`check`), and what does the compiler put in front of the templates
(`context` — `fx_scripts`, which `templates/packages/fx.yaml.j2` and nothing
else reads).

The compiler itself is still `src/regie/fx.py`, with `shapes/` and
`backends/` already here; it moves into this folder with the rest of the pack
(the audit's V14). Nothing about the words below changed in the move: the
lines a house reads are the engine's own, to the character."""

from regie.fx import compile_all, known_backends, load_shapes


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
