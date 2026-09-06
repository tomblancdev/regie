"""A release points at itself: the package, the collection and the engine role
name the same version (0.12.1's lesson, repeated at 0.25.5) — and the package
carries every file the render copies (0.31.0's lesson: the component's
manifest.json was in the checkout, not in the wheel the tag builds)."""

import pathlib
import re
import tomllib

from regie.render import BASE, plan

ROOT = pathlib.Path(__file__).resolve().parents[1]


def test_the_three_versions_say_the_same_thing():
    package = re.search(r'^version = "([^"]+)"', (ROOT / "pyproject.toml").read_text(), re.M)[1]
    collection = re.search(r"^version: (\S+)", (ROOT / "ansible/galaxy.yml").read_text(), re.M)[1]
    engine = re.search(
        r'^regie_version: "v([^"]+)"',
        (ROOT / "ansible/roles/engine/defaults/main.yml").read_text(),
        re.M,
    )[1]
    assert package == collection == engine, (package, collection, engine)


def _packaged() -> set[pathlib.Path]:
    """The files pyproject's package-data globs carry into the wheel."""
    data = tomllib.loads((ROOT / "pyproject.toml").read_text(encoding="utf-8"))
    globs = data["tool"]["setuptools"]["package-data"]["regie"]
    pkg = ROOT / "src" / "regie"
    return {f.resolve() for g in globs for f in pkg.glob(g) if f.is_file()}


def test_the_package_carries_what_the_render_copies(witness):
    """Every file the render copies as it is (the plan's `copy` rows) and every
    file of the product's own components must be named by a package-data glob:
    the .py files of a component ride as namespace packages, its manifest.json
    does not — 0.31.0 rendered nothing on a brain installed from its tag."""
    packaged = _packaged()
    copied = {(BASE / t["copy"]).resolve() for _, t in plan(witness) if t.get("copy")}
    components = {
        f.resolve()
        for f in (BASE / "components").rglob("*")
        if f.is_file() and "__pycache__" not in f.parts
    }
    assert copied and components
    missing = sorted(str(f.relative_to(ROOT)) for f in (copied | components) - packaged)
    assert not missing, missing
