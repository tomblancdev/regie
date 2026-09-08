"""One thing travels alone (0.45, the decision H52) — `regie share`.

A friend's plain Home Assistant takes a thing through the app's Import door
and no other: a blueprint, from a URL, no file opened and no helper made. The
verb and the refusals are the engine's; what to send and how to strip it
belongs to the pack that renders the thing (a fifth hook, `share`).

fx is the first user, in the release that adds the hook — a mechanism with no
real user is unproven (V9's rule). The pack's own half is tested in
`packs/fx/tests/test_fx.py`; here is the engine's: the dispatch, the
refusals, the verb, and the discipline that keeps the product's committed
blueprints equal to what its shapes render."""

import pathlib

import pytest
import yaml

from regie.cli import main
from regie.errors import HouseError
from regie.house import load_house
from regie.share import files_of, write
from tests.test_pack_hooks import pack_code

ROOT = pathlib.Path(__file__).resolve().parents[1]
SHELF = ROOT / "blueprints"


# --- the product's own shelf ---------------------------------------------------
def test_the_committed_blueprints_are_what_the_shapes_render(witness):
    """The version marks' discipline, applied to the luggage: the files in
    `blueprints/` are the product's public URLs, so a tag whose shapes render
    something else would publish a lie. CI renders them on the witness at
    every tag; this refuses the tag when they differ.

    To fix a red here: `regie share examples/maison-temoin/home.yml fx --out
    blueprints`, and commit what changed."""
    rendered = files_of(witness, "fx", None)
    on_disk = {
        str(p.relative_to(SHELF)): p.read_text(encoding="utf-8")
        for p in SHELF.rglob("*.yaml")
        if p.is_file()
    }
    assert sorted(on_disk) == sorted(rendered), "a shape was added, renamed or removed"
    drifted = sorted(name for name in rendered if on_disk[name] != rendered[name])
    assert not drifted, drifted


def test_the_shelf_is_the_whole_library_and_nothing_else():
    """33 shapes, one file each, under the folder Home Assistant reads script
    blueprints from — the path in an import URL is the product's promise."""
    shapes = (ROOT / "src/regie/packs/fx/shapes").glob("*.yml")
    files = sorted(p.relative_to(SHELF).as_posix() for p in SHELF.rglob("*.yaml"))
    assert files == sorted(f"script/regie/fx_{p.stem}.yaml" for p in shapes)
    assert len(files) == 33
    # the shelf's own door: what a friend lands on before any of the files
    assert (SHELF / "README.md").is_file()
    assert sorted(p.name for p in SHELF.iterdir()) == ["README.md", "script"]


def test_every_committed_blueprint_is_a_script_blueprint_with_no_inputs():
    for path in sorted(SHELF.rglob("*.yaml")):
        doc = yaml.safe_load(path.read_text(encoding="utf-8"))
        head = doc["blueprint"]
        assert head["domain"] == "script", path
        assert head["input"] == {}, path
        assert head["homeassistant"]["min_version"], path
        assert doc["sequence"] and doc["fields"]["target"], path


# --- the dispatch, and the refusals the engine keeps ---------------------------
def test_a_kind_no_pack_of_this_house_shares(witness):
    with pytest.raises(HouseError, match=r"no pack of this house shares a 'chandelier'"):
        files_of(witness, "chandelier", None)
    # and the sentence names where to look: the packs that share something
    with pytest.raises(HouseError, match=r"the packs that share something: fx"):
        files_of(witness, "chandelier", None)


ABOVE = """
def share(house, kind, id):
    return {"../../../etc/passwd": "nothing good"} if kind == "cellar" else None
"""

EMPTY = """
def share(house, kind, id):
    return {} if kind == "cellar" else None
"""

WRONG = """
def share(house, kind, id):
    return ["script/regie/x.yaml"] if kind == "cellar" else None
"""


def a_house_sharing(house_with, code):
    path = house_with(lambda d: None)
    pack_code(path, code)
    return load_house(path)


def test_a_file_name_may_not_climb_out_of_the_folder(house_with):
    """The verb writes what a pack names into a directory a person gave it.
    A pack is code its author is trusted with (V9's sentence), but a name
    with a `..` in it is a mistake far more often than a plan."""
    house = a_house_sharing(house_with, ABOVE)
    with pytest.raises(HouseError, match=r"named the file '\.\./\.\./\.\./etc/passwd'"):
        files_of(house, "cellar", None)


def test_a_pack_that_claims_a_kind_and_gives_nothing(house_with):
    house = a_house_sharing(house_with, EMPTY)
    with pytest.raises(HouseError, match="claimed 'cellar' and gave no file"):
        files_of(house, "cellar", None)


def test_a_share_hook_that_answers_the_wrong_shape(house_with):
    house = a_house_sharing(house_with, WRONG)
    with pytest.raises(HouseError, match="returns a mapping of file name to text"):
        files_of(house, "cellar", None)


CELLAR = """
def share(house, kind, id):
    if kind != "cellar":
        return None
    return {"script/chalet/cellar.yaml": "alias: the cellar\\n"}
"""


def test_a_house_pack_shares_its_own_thing(house_with, tmp_path):
    """What a house may do from a directory of its own is what a product pack
    does — one loader, one contract, for the fifth hook as for the four."""
    house = a_house_sharing(house_with, CELLAR)
    files = files_of(house, "cellar", None)
    written, unchanged = write(files, tmp_path)
    assert written == ["script/chalet/cellar.yaml"] and not unchanged
    assert (tmp_path / "script/chalet/cellar.yaml").read_text() == "alias: the cellar\n"
    # written again, byte for byte the same: nothing rewritten
    assert write(files, tmp_path) == ([], ["script/chalet/cellar.yaml"])


# --- the verb ------------------------------------------------------------------
def test_the_verb_writes_one_shape_and_prints_its_import_url(witness_path, tmp_path, capsys):
    assert main(["share", str(witness_path), "fx", "strike", "--out", str(tmp_path)]) == 0
    said = capsys.readouterr().out
    assert "1 written, 0 unchanged" in said
    assert "  + script/regie/fx_strike.yaml" in said
    assert (
        "    import: https://raw.githubusercontent.com/tomblancdev/regie/main/"
        "blueprints/script/regie/fx_strike.yaml"
    ) in said
    assert (tmp_path / "script/regie/fx_strike.yaml").is_file()


def test_the_verb_with_no_id_sends_the_whole_shelf(witness_path, tmp_path, capsys):
    assert main(["share", str(witness_path), "fx", "--out", str(tmp_path)]) == 0
    assert "33 written, 0 unchanged" in capsys.readouterr().out
    assert main(["share", str(witness_path), "fx", "--out", str(tmp_path)]) == 0
    assert "0 written, 33 unchanged" in capsys.readouterr().out


def test_the_verb_writes_beside_home_yml_when_no_out_is_given(house_with, capsys):
    path = house_with(lambda d: None)
    assert main(["share", str(path), "fx", "flash"]) == 0
    assert (path.parent / "blueprints/script/regie/fx_flash.yaml").is_file()
    assert f"shared into {path.parent / 'blueprints'}" in capsys.readouterr().out


def test_a_house_with_no_url_is_told_the_file_cannot_be_imported_yet(house_with, tmp_path, capsys):
    """A blueprint is imported from a URL. A house that publishes nowhere may
    still render its files — it is simply not sharing yet, and is told so."""
    path = house_with(lambda d: d.pop("share"))
    assert main(["share", str(path), "fx", "flash", "--out", str(tmp_path)]) == 0
    said = capsys.readouterr().out
    assert "import:" not in said
    assert "declares no `share.url:`" in said
