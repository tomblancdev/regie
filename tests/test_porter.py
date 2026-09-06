"""The doorman's arithmetic (base/components/regie/porter.py) — read as it is,
without Home Assistant: the verdicts, the agent's lookup, the lines."""

import importlib.util
from pathlib import Path

HERE = Path(__file__).parent.parent / "src" / "regie" / "base" / "components" / "regie"
spec = importlib.util.spec_from_file_location("porter", HERE / "porter.py")
porter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(porter)


def test_the_verdict_reads_the_ceiling():
    assert porter.decide("on", True) == porter.DELEGATE
    assert porter.decide("off", True) == porter.WAKE
    # nobody can tell, or nobody to knock: ask anyway
    assert porter.decide("off", False) == porter.TRY
    assert porter.decide("unavailable", True) == porter.TRY
    assert porter.decide("unknown", True) == porter.TRY
    assert porter.decide(None, True) == porter.TRY


def test_the_agent_is_named_or_found_by_platform():
    agents = [
        ("conversation.home_assistant", "conversation"),
        ("conversation.ollama_conversation", "ollama"),
        ("conversation.ollama_2", "ollama"),
    ]
    assert porter.pick_agent("conversation.x", agents) == "conversation.x"
    assert porter.pick_agent("ollama", agents) == "conversation.ollama_2"
    assert porter.pick_agent("openai_conversation", agents) is None


def test_the_house_line_wins_and_the_product_has_one_for_every_verdict():
    assert porter.line({"waking": "Je réveille la tour."}, "waking") == "Je réveille la tour."
    assert porter.line({}, "waking").startswith("I am waking")
    for key in ("waking", "unknown", "absent", "knock_failed", "no_agent"):
        assert porter.line(None, key)
