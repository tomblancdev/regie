"""A release points at itself: the package, the collection and the engine role
name the same version (0.12.1's lesson, repeated at 0.25.5)."""

import pathlib
import re

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
