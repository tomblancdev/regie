"""A pack that carries code (0.38, the audit's V9): the pack folder IS the
plugin shape — `hooks: hooks.py` beside pack.yml, and the engine calls
`vocabulary`, `check`, `context` and `apply` at the four places it has for a
pack (`vocabulary` since 0.44, V14: the words a pack adds to the house, which
is how one pack reads another's without importing it). And the declared module
is the pack's FACE, not the limit of its code: the folder is a package, so a
pack whose arithmetic outgrows one file keeps it beside its hooks.

Proven here through a HOUSE pack, the witness's own `chalet`: what a house may
do from a directory of its own is exactly what a product pack does, one loader
for both. The product's users are elsewhere — the fx pack's words, check,
`fx_scripts` and its four-hundred-line compiler (test_fx.py, and the render of
the witness), the palette pack's stores at every converge (test_pull.py)."""

import pytest
import yaml

from regie.cli import report
from regie.errors import HouseError
from regie.house import load_house
from regie.render import context, render
from tests.test_apply import (  # noqa: F401 — the two autouse stubs ride along
    FakeHA,
    _door_answers,
    _no_llm_server,
    states,
)

NOTHING = "the house is unchanged"


def pack_code(path, code, *, name="chalet", declare="hooks.py", filename="hooks.py"):
    """Write `code` into the copied house's own pack, and declare it in its
    pack.yml (declare=None leaves the pack.yml alone — the file is there and
    nothing names it)."""
    folder = path.parent / "packs" / name
    folder.mkdir(parents=True, exist_ok=True)
    (folder / filename).parent.mkdir(parents=True, exist_ok=True)
    (folder / filename).write_text(code, encoding="utf-8")
    pack_yml = folder / "pack.yml"
    data = (
        yaml.safe_load(pack_yml.read_text(encoding="utf-8"))
        if pack_yml.is_file()
        else {"name": name, "summary": "a house pack, for the test"}
    )
    if declare is not None:
        data["hooks"] = declare
    pack_yml.write_text(yaml.safe_dump(data, allow_unicode=True), encoding="utf-8")
    return folder


def second_pack(house_with, code, name="cellier"):
    """The witness plus a second house pack of its own, carrying `code`."""
    path = house_with(lambda d: d["packs"].append(name))
    pack_code(path, code, name=name)
    return path


# --- the file is only read when the pack names it -----------------------------


def test_a_stray_module_never_runs(house_with):
    """The contract is a declaration, not a convention: a .py sitting in a
    pack folder that pack.yml does not name is a file, not code."""
    path = house_with(lambda d: None)
    pack_code(path, "raise RuntimeError('never')", declare=None)
    house = load_house(path)
    assert house.has_pack("chalet")
    assert next(p for p in house.packs if p.name == "chalet").hooks is None


def test_declared_and_absent(house_with):
    path = house_with(lambda d: None)
    pack_code(path, "", declare="ailleurs.py")
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "declares hooks 'ailleurs.py' — no such file" in str(exc.value)


@pytest.mark.parametrize("named", ["../escape.py", "/etc/regie/escape.py"])
def test_the_code_lives_inside_the_folder(house_with, named):
    path = house_with(lambda d: None)
    pack_code(path, "", declare=named)
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "a pack's code lives inside its own folder" in str(exc.value)


# --- the four hooks -----------------------------------------------------------

THREE = """
def check(house):
    return [], [], ["chalet: the roof holds"]


def context(house):
    return {"chalet_word": "vieux bois"}


def apply(conductor):
    conductor.step("chalet", "ok", f"the websocket is at hand: {conductor.ws is not None}")
"""


WORDS = """
def vocabulary(house):
    return {"chalet_woods": ["oak", "pine"]}, ["chalet: two woods, seasoned"]
"""


def test_vocabulary_reaches_the_house_and_regie_check(house_with, secrets, capsys):
    """The words a pack adds: readable by the rest of the house — this is how
    the palette asks the fx pack which shapes send a colour, with neither pack
    importing the other — and said by `regie check`, in the pack's own wording."""
    path = house_with(lambda d: None)
    pack_code(path, WORDS)
    house = load_house(path)
    assert house.vocabulary()[0]["chalet_woods"] == ["oak", "pine"]
    report(house, secrets)
    assert "chalet: two woods, seasoned" in capsys.readouterr().out.splitlines()


def test_two_packs_may_not_claim_one_word(house_with):
    same = 'def vocabulary(house):\n    return {"bois": 1}, []\n'
    path = second_pack(house_with, same)
    pack_code(path, same)
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "the word 'bois' is already pack chalet's" in str(exc.value)


def test_a_vocabulary_that_answers_the_wrong_shape(house_with):
    path = house_with(lambda d: None)
    pack_code(path, 'def vocabulary(house):\n    return {"bois": 1}\n')
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "the vocabulary hook returns (words, lines)" in str(exc.value)


def test_check_speaks_in_its_own_words(house_with):
    path = house_with(lambda d: None)
    pack_code(path, THREE)
    house = load_house(path)
    assert "chalet: the roof holds" in house.hints


def test_check_can_refuse_a_house(house_with):
    path = house_with(lambda d: None)
    pack_code(path, "def check(house):\n    return ['chalet: no chimney'], [], []\n")
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "chalet: no chimney" in str(exc.value)


def test_context_reaches_the_render_and_the_pack_s_own_template(house_with, secrets, tmp_path):
    path = house_with(lambda d: None)
    folder = pack_code(path, THREE)
    (folder / "templates" / "cards" / "note.yaml.j2").write_text(
        '- type: markdown\n  content: "{{ chalet_word }}"\n', encoding="utf-8"
    )
    house = load_house(path)
    assert context(house, secrets)["chalet_word"] == "vieux bois"
    out = tmp_path / "brain"
    render(house, out, secrets)
    written = [f.read_text(encoding="utf-8") for f in out.rglob("*.yaml")]
    assert any("vieux bois" in text for text in written), "the pack's own template reads its key"


def test_apply_runs_the_hook_with_the_websocket_open(house_with, secrets, tmp_path):
    path = house_with(lambda d: None)
    pack_code(path, THREE)
    house = load_house(path)
    steps = apply_steps(house, secrets, tmp_path)
    assert states(steps)["chalet"] == "ok"
    assert next(s for s in steps if s.name == "chalet").detail.endswith("True")


def test_apply_hook_honours_check(house_with, secrets, tmp_path):
    """A hook that only steps is safe under `--check` for free — `step()`
    turns a `changed` into a `would` before the hook sees it. (A brain that
    has never been furnished stops at onboarding, so it is furnished first.)"""
    path = house_with(lambda d: None)
    pack_code(path, "def apply(conductor):\n    conductor.step('chalet', 'changed', 'a roof')\n")
    house = load_house(path)
    ha = FakeHA()
    assert states(apply_steps(house, secrets, tmp_path, ha))["chalet"] == "changed"
    assert states(apply_steps(house, secrets, tmp_path, ha, check=True))["chalet"] == "would"


def apply_steps(house, secrets, tmp_path, ha=None, check=False):
    from regie.apply import apply

    return apply(house, secrets, tmp_path, ha or FakeHA(), check=check)


# --- the folder is the plugin, not the file -----------------------------------


def test_a_pack_folder_carries_more_than_one_module(house_with, secrets):
    """0.44 (V14): the declared module is the pack's face; a pack whose code
    outgrows one file keeps the rest beside it and says `from .x import`. This
    is what let fx's compiler come home — four hundred lines that were the
    engine's, now the folder's."""
    path = house_with(lambda d: None)
    folder = pack_code(
        path,
        "from .grenier import WORD\n\n\ndef context(house):\n    return {'chalet_word': WORD}\n",
    )
    (folder / "grenier.py").write_text("WORD = 'foin'\n", encoding="utf-8")
    assert context(load_house(path), secrets)["chalet_word"] == "foin"
    # and a pack loaded again is loaded WHOLE: the file beside the face is read
    # from disk each time, never left over from the load before
    (folder / "grenier.py").write_text("WORD = 'paille'\n", encoding="utf-8")
    assert context(load_house(path), secrets)["chalet_word"] == "paille"


def test_a_relative_import_may_not_leave_the_folder(house_with):
    """The search path is the pack's own folder and stops there: reaching a
    step above it is not a door onto the engine, it is an import that fails."""
    path = house_with(lambda d: None)
    pack_code(path, "from ..ailleurs import x\n\n\ndef check(house):\n    return [], [], []\n")
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "chalet: hooks.py does not import" in str(exc.value)


# --- what a broken pack says --------------------------------------------------


def test_a_module_that_does_not_import(house_with):
    path = house_with(lambda d: None)
    pack_code(path, "import une_bibliotheque_qui_nexiste_pas\n")
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "chalet: hooks.py does not import" in str(exc.value)


def test_a_hook_that_raises_names_its_pack(house_with):
    path = house_with(lambda d: None)
    pack_code(path, "def check(house):\n    return 1 / 0\n")
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "pack chalet: the check hook failed" in str(exc.value)


def test_a_module_that_answers_to_nothing(house_with):
    """A misspelt hook name is silence — so a declared module that answers to
    none of the three is a fault, not a pack that changed its mind."""
    path = house_with(lambda d: None)
    pack_code(path, "def contxt(house):\n    return {}\n")
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "answers to none of vocabulary, check, context, apply" in str(exc.value)


def test_a_hook_that_is_not_a_function(house_with):
    path = house_with(lambda d: None)
    pack_code(path, "check = 3\n")
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "chalet: check in hooks.py is not a function" in str(exc.value)


def test_a_check_that_answers_the_wrong_shape(house_with):
    path = house_with(lambda d: None)
    pack_code(path, "def check(house):\n    return 'no'\n")
    with pytest.raises(HouseError) as exc:
        load_house(path)
    assert "the check hook returns (errors, warnings, hints)" in str(exc.value)


def test_a_context_that_answers_the_wrong_shape(house_with, secrets):
    path = house_with(lambda d: None)
    pack_code(path, "def context(house):\n    return ['nope']\n")
    with pytest.raises(HouseError) as exc:
        context(load_house(path), secrets)
    assert "the context hook returns a mapping" in str(exc.value)


# --- two packs, one name ------------------------------------------------------


def test_a_pack_may_not_claim_the_engine_s_own_name(house_with, secrets):
    path = house_with(lambda d: None)
    pack_code(path, "def context(house):\n    return {'areas': []}\n")
    with pytest.raises(HouseError) as exc:
        context(load_house(path), secrets)
    assert "context name 'areas' is the engine's own" in str(exc.value)


def test_two_packs_may_not_claim_one_name(house_with, secrets):
    same = "def context(house):\n    return {'mur': 1}\n"
    path = second_pack(house_with, same)
    pack_code(path, same)
    with pytest.raises(HouseError) as exc:
        context(load_house(path), secrets)
    assert "context name 'mur' is already pack chalet's" in str(exc.value)


def test_a_second_pack_s_own_name_is_its_own(house_with, secrets):
    path = second_pack(house_with, "def context(house):\n    return {'cave': 1}\n")
    pack_code(path, "def context(house):\n    return {'grenier': 2}\n")
    ctx = context(load_house(path), secrets)
    assert (ctx["cave"], ctx["grenier"]) == (1, 2)


# --- the code that will run is named before it runs ---------------------------


def test_check_names_the_packs_that_carry_code(house_with, secrets, capsys):
    path = house_with(lambda d: None)
    pack_code(path, THREE)
    report(load_house(path), secrets)
    line = next(
        line for line in capsys.readouterr().out.splitlines() if line.startswith("profile ")
    )
    assert "chalet (house) +hooks" in line
    assert "fx +hooks" in line and "palette +hooks" in line
    assert "modes," in line and "modes +hooks" not in line
