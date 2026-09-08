"""The suite reading itself: a photograph is declared, never kept by accident.

A TEST says what the product must do TODAY. A PHOTOGRAPH says what it USED TO
do — the other side of its `assert` is a replica of code the product has
deleted, kept in the suite only until the rewrite it guards is trusted, and the
day it goes the house loses no behaviour.

The two look alike from a distance and are opposite in what they are worth: a
red test is a house that broke; a red photograph is a rewrite that moved a
value it swore not to. Nothing said which was which until 0.43.1 — `frozen_0_41`
had sat beside thirty-eight ordinary tests for two versions, and V8a and V8b had
each added more of the pattern.

So the shape is declared and the suite holds itself to it:

  * a replica of dead code lives in a module named `frozen_<version>.py`,
    which defines no test of its own and is never imported by `src/`;
  * every test that reads one carries `@pytest.mark.photograph`, and every
    marked test reads one — the mark is never decoration, and a photograph
    is never silent;
  * a marked test says in its docstring what it guards;
  * a frozen module carries ONLY what a photograph still compares — an oracle
    nobody holds anything against is not a proof, it is a copy.

`pytest -m photograph` is then the list of everything the suite still holds to
a dead design, and `pytest -m "not photograph"` is the product as it stands.
The rule is said once for a reader in the README, « A test, and a photograph ».
"""

import ast
from pathlib import Path

ROOT = Path(__file__).parent.parent
TEST_ROOTS = (ROOT / "tests", ROOT / "src" / "regie" / "packs")
MARK = "photograph"
RULE = "see tests/test_photographs.py and the README, « A test, and a photograph »"


def _test_files() -> list[Path]:
    return sorted(p for root in TEST_ROOTS for p in root.rglob("test_*.py"))


def _frozen_modules() -> list[Path]:
    return sorted(p for root in TEST_ROOTS for p in root.rglob("frozen_*.py"))


def _oracle_names(tree: ast.Module) -> set[str]:
    """The names this module binds to a frozen module: the alias of
    `from . import frozen_0_41 as OLD`, or each name of `from .frozen_0_41
    import …` — whichever spelling, reading one of them is reading the oracle."""
    names = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom):
            if node.module and "frozen_" in node.module:
                names |= {a.asname or a.name for a in node.names}
            else:
                names |= {a.asname or a.name for a in node.names if a.name.startswith("frozen_")}
        elif isinstance(node, ast.Import):
            names |= {
                (a.asname or a.name).split(".")[0]
                for a in node.names
                if "frozen_" in a.name.split(".")[-1]
            }
    return names


def _tests_of(tree: ast.Module):
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef | ast.AsyncFunctionDef) and node.name.startswith(
            "test"
        ):
            yield node


def _marked(fn) -> bool:
    for d in fn.decorator_list:
        target = d.func if isinstance(d, ast.Call) else d
        if isinstance(target, ast.Attribute) and target.attr == MARK:
            return True
    return False


def _reads(fn, names: set[str]) -> bool:
    return any(isinstance(n, ast.Name) and n.id in names for n in ast.walk(fn))


def _parsed():
    for path in _test_files():
        yield path, ast.parse(path.read_text(encoding="utf-8"))


def test_the_mark_and_the_oracle_are_the_same_set():
    """The rule, both ways: a test that reads a frozen module carries the mark,
    and a marked test reads one. Neither half alone is worth anything — an
    unmarked photograph is the accident this file exists to end, and a mark on
    a test of current behaviour would hide that behaviour behind `-m "not
    photograph"`, which is where a rewrite goes to check it broke nothing."""
    unmarked, decoration = [], []
    for path, tree in _parsed():
        names = _oracle_names(tree)
        for fn in _tests_of(tree):
            reads = bool(names) and _reads(fn, names)
            if reads and not _marked(fn):
                unmarked.append(f"{path.relative_to(ROOT)}::{fn.name}")
            if _marked(fn) and not reads:
                decoration.append(f"{path.relative_to(ROOT)}::{fn.name}")
    assert not unmarked, (
        f"these read a frozen module and are not marked @pytest.mark.{MARK}: {unmarked} — {RULE}"
    )
    assert not decoration, (
        f"these are marked @pytest.mark.{MARK} and read no frozen module: {decoration} — "
        f"a photograph holds the product against code it no longer runs; {RULE}"
    )


def test_a_photograph_says_what_it_guards():
    """A mark names a kind; only the docstring can name the rewrite the
    photograph proves, which is what tells a reader when it may go."""
    mute = [
        f"{path.relative_to(ROOT)}::{fn.name}"
        for path, tree in _parsed()
        for fn in _tests_of(tree)
        if _marked(fn) and not ast.get_docstring(fn)
    ]
    assert not mute, f"a photograph with no docstring: {mute} — {RULE}"


def test_the_suite_carries_at_least_one_and_names_it():
    """The checks above pass vacuously on a suite with no oracle at all: this
    one fails the day `frozen_*.py` disappears without this file going too."""
    frozen = _frozen_modules()
    assert frozen, (
        f"no frozen_*.py left — the photographs are gone, and so should this file be; {RULE}"
    )
    marked = [fn.name for _, tree in _parsed() for fn in _tests_of(tree) if _marked(fn)]
    assert marked, f"a frozen module {[p.name for p in frozen]} nothing is held against — {RULE}"


def test_the_product_never_imports_an_oracle():
    """A frozen module is dead code by definition: the day `src/` reads one it
    is alive again, and the photograph beside it is comparing the product with
    itself."""
    stems = {p.stem for p in _frozen_modules()}
    guilty = [
        f"{p.relative_to(ROOT)}"
        for p in (ROOT / "src").rglob("*.py")
        if any(stem in p.read_text(encoding="utf-8") for stem in stems)
    ]
    assert not guilty, f"the product reads a frozen module: {guilty} — {RULE}"


def test_a_frozen_module_holds_no_test_of_its_own():
    """It is an oracle, not a test file — pytest must never collect it, and a
    `test_` inside one would be a photograph nothing marked."""
    for path in _frozen_modules():
        tree = ast.parse(path.read_text(encoding="utf-8"))
        assert not list(_tests_of(tree)), f"{path.relative_to(ROOT)} defines tests — {RULE}"


def test_an_oracle_carries_only_what_a_photograph_reads():
    """0.43.1: `frozen_0_41` had grown three pieces nothing compared any more
    (`jinja_day`, `helper_palette_jinja`, the twenty-one helpers' min/max/step
    table). Dead weight inside the one module whose whole job is to be compared:
    a reader cannot tell a proof from a copy, and the copy never goes red."""
    readers = list(_parsed())
    for path in _frozen_modules():
        tree = ast.parse(path.read_text(encoding="utf-8"))
        public = {
            node.name
            for node in tree.body
            if isinstance(node, ast.FunctionDef | ast.ClassDef) and not node.name.startswith("_")
        } | {
            t.id
            for node in tree.body
            if isinstance(node, ast.Assign)
            for t in node.targets
            if isinstance(t, ast.Name) and not t.id.startswith("_")
        }
        read = {
            n.id for n in ast.walk(tree) if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Load)
        }
        for _reader, rtree in readers:
            aliases = _oracle_names(rtree)
            # `from .frozen_0_41 import jinja_body` — the alias IS the name read
            read |= aliases
            # `from . import frozen_0_41 as OLD` — the names read are OLD.<attr>
            read |= {
                n.attr
                for n in ast.walk(rtree)
                if isinstance(n, ast.Attribute)
                and isinstance(n.value, ast.Name)
                and n.value.id in aliases
            }
        idle = sorted(public - read)
        assert not idle, (
            f"{path.relative_to(ROOT)} carries {idle}, which no photograph compares "
            f"and the module itself does not read — {RULE}"
        )
