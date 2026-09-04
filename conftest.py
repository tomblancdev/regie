import shutil
from pathlib import Path

import pytest
import yaml

from regie.apply import Conductor
from regie.house import load_house
from regie.render import render
from regie.secrets import load_secrets

ROOT = Path(__file__).parent
WITNESS = ROOT / "examples" / "maison-temoin"


@pytest.fixture(autouse=True)
def _no_patience_in_tests(monkeypatch):
    """The conductor waits for a Zigbee2MQTT frontend that is not listening
    yet (0.7.2) — a door being restarted by `up` under it. A test meets a
    door that is simply not there, and waiting a minute for each is a suite
    that hangs; the wait itself is proved by its own test in test_zigbee.py."""
    monkeypatch.setattr(Conductor, "z2m_wait", 0)


@pytest.fixture(autouse=True)
def _border_router_holds_the_house_network(monkeypatch):
    """The witness house declares a Thread border router (`maison-temoin`), and
    the conductor READS it before introducing it to Home Assistant. Left alone
    every test in the suite would reach for 192.0.2.10 — a documentation
    address that answers nothing — and wait out a real timeout. So the default
    router holds the house's network; the tests that care about the guard
    replace it (test_thread.py)."""

    class _Holding:
        def network_name(self):
            return "maison-temoin"

    monkeypatch.setattr(Conductor, "otbr_of", lambda self, border_router: _Holding())


@pytest.fixture(scope="session")
def witness_path() -> Path:
    return WITNESS / "home.yml"


@pytest.fixture(scope="session")
def witness(witness_path):
    """Loaded ONCE for the whole run: no test mutates it (the ones that need a
    changed house copy it through `house_with`) — the render tests read it."""
    return load_house(witness_path)


@pytest.fixture(scope="session")
def secrets() -> dict:
    return load_secrets(WITNESS / "secrets.example.yml", environ={})


@pytest.fixture(scope="session")
def rendered(tmp_path_factory, witness, secrets):
    """The witness rendered ONCE for the whole run (forty tests read it, none
    writes into it) — a render was eight seconds by 0.22, and the suite had
    crossed ten minutes."""
    out = tmp_path_factory.mktemp("rendered")
    render(witness, out, secrets)
    return out


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


@pytest.fixture
def rendered_fresh(rendered, tmp_path):
    """A copy of the shared render for a test that WRITES into it (`up`
    installs units and stamps files)."""
    out = tmp_path / "rendered"
    shutil.copytree(rendered, out)
    return out
