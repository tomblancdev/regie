import shutil
from pathlib import Path

import pytest
import yaml

from regie.house import load_house
from regie.render import render
from regie.secrets import load_secrets

ROOT = Path(__file__).parent
WITNESS = ROOT / "examples" / "maison-temoin"


@pytest.fixture(scope="session")
def witness_path() -> Path:
    return WITNESS / "home.yml"


@pytest.fixture
def witness(witness_path):
    return load_house(witness_path)


@pytest.fixture(scope="session")
def secrets() -> dict:
    return load_secrets(WITNESS / "secrets.example.yml", environ={})


@pytest.fixture
def rendered(tmp_path, witness, secrets):
    render(witness, tmp_path, secrets)
    return tmp_path


@pytest.fixture
def house_with(tmp_path):
    """A copy of the witness (its packs too), mutated; returns the home.yml path."""

    calls = []

    def make(mutate):
        calls.append(1)
        target = tmp_path / f"house{len(calls)}"
        shutil.copytree(WITNESS, target)
        data = yaml.safe_load((target / "home.yml").read_text(encoding="utf-8"))
        mutate(data)
        (target / "home.yml").write_text(yaml.safe_dump(data, allow_unicode=True), encoding="utf-8")
        return target / "home.yml"

    return make
