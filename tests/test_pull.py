"""What the phone owns (0.33, the audit's V4): ONE rule for a knob, the
plan's draft and a palette store — three readings (the files, the phone, the
conductor's memory of what it seeded) and one word at every converge; ONE
verb, `regie pull`, writing the phone's edits into the house files leaf by
leaf with every other byte kept; `regie push`, the hand's override."""

import json

import pytest
import yaml

from regie import palette as palette_mod
from regie import pull as P
from regie.apply import apply
from regie.dash import link
from regie.edit import flow, set_leaf
from regie.errors import HouseError
from regie.house import load_house
from tests.test_apply import (  # noqa: F401 — the two autouse stubs ride along
    FakeHA,
    _door_answers,
    _no_llm_server,
    states,
)


def detail(steps, name):
    return next(s.detail for s in steps if s.name == name)


def test_the_rule_says_one_of_five_words():
    assert P.state("a", "a", P.NO_MEMORY) == "agree"
    assert P.state("a", "b", P.NO_MEMORY) == "blind"
    assert P.state("b", "a", "a") == "file"
    assert P.state("a", "b", "a") == "phone"
    assert P.state("b", "c", "a") == "both"
    assert P.state({"x": 1}, {"x": 1}, {"x": 2}) == "agree", "agreeing wins over a stale memory"


def test_set_leaf_keeps_every_other_byte():
    text = (
        "# modes\n"
        "periods:\n"
        '  morning: { at: "06:30", label: Matin }   # the seed\n'
        '  day:     "09:00"\n'
        "defaults:\n"
        "  dark:    soft\n"
        "  night:   night         # was low\n"
        "# the hands\n"
        "hands: {}\n"
    )
    # a leaf inside a flow map, the comment kept
    assert set_leaf(text, ["periods", "morning", "at"], "07:00") == text.replace(
        'at: "06:30"', 'at: "07:00"'
    )
    # a bare scalar, its alignment kept
    assert set_leaf(text, ["periods", "day"], "09:30") == text.replace('"09:00"', '"09:30"')
    # a block leaf: the value, the spaces and the note kept
    assert set_leaf(text, ["defaults", "night"], "soft") == text.replace(
        "night:   night         # was low", "night:   soft         # was low"
    )
    # removed: the line alone
    assert set_leaf(text, ["defaults", "night"], None) == text.replace(
        "  night:   night         # was low\n", ""
    )
    # inserted at the block's end, before the next top-level comment
    assert set_leaf(text, ["defaults", "evening"], "day") == text.replace(
        "# was low\n", "# was low\n  evening: day\n"
    )
    # a flow entry removed, and one added
    assert set_leaf(text, ["periods", "morning", "label"], None) == text.replace(
        '{ at: "06:30", label: Matin }', '{ at: "06:30" }'
    )
    assert set_leaf(text, ["periods", "morning", "to"], "day") == text.replace(
        '{ at: "06:30", label: Matin }', '{ at: "06:30", label: Matin, to: day }'
    )
    # a new block under a block key: one key per line, leaves in flow
    assert set_leaf(text, ["palettes", "nuit_rouge"], {"label": "Nuit rouge", "band": [330, 30]})
    out = set_leaf(text, ["palettes", "nuit_rouge"], {"label": "Nuit rouge", "band": [330, 30]})
    assert out == text + "palettes:\n  nuit_rouge:\n    label: Nuit rouge\n    band: [330, 30]\n"
    # a block replaced by a mapping keeps the block form; the next key stands
    block = 'palettes:\n  a:\n    label: A\n    band: [1, 2]\n  today:\n    turns: "06:30"\n'
    assert set_leaf(block, ["palettes", "a"], {"label": "B", "band": [3, 4], "accent": 5}) == (
        "palettes:\n  a:\n    label: B\n    band: [3, 4]\n    accent: 5\n"
        '  today:\n    turns: "06:30"\n'
    )
    assert set_leaf(block, ["palettes", "a"], None) == 'palettes:\n  today:\n    turns: "06:30"\n'
    # a scalar on the way is a fault, not a guess
    with pytest.raises(HouseError):
        set_leaf(text, ["periods", "day", "at"], "10:00")
    # what the leaves look like
    assert flow("07:00") == '"07:00"' and flow("soft") == "soft" and flow("on") == '"on"'
    assert flow([0, "all"]) == "[0, all]" and flow({"a": 1.5, "b": True}) == "{ a: 1.5, b: true }"
    assert yaml.safe_load(set_leaf("x: 1\n", ["y", "z"], {"k": "v"})) == {
        "x": 1,
        "y": {"z": {"k": "v"}},
    }


def test_a_knob_the_phone_moved_is_kept_then_pulled_then_follows(secrets, tmp_path, house_with):
    """A period's hour: edited on the phone it is kept and named at every
    converge; `regie pull home.yml knobs` writes it at its leaf in modes.yml
    and nothing else; the next converge says it follows the files, the memory
    refreshed. A file edit while the phone holds nothing: the file wins. Both
    moved: a hand — `push` takes the files' word."""
    path = house_with(lambda d: None)
    house = load_house(path)
    modes = path.parent / "modes.yml"
    ha = FakeHA()
    apply(house, secrets, tmp_path, ha, check=False)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "knob house_period_morning") == "06:30 — follows the files"
    ha.states["input_datetime.house_period_morning"] = "07:00:00"  # the phone
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["knob house_period_morning"] == "ok"
    assert detail(steps, "knob house_period_morning") == (
        "07:00 — edited on the phone (06:30 → 07:00), kept — not yet pulled: "
        "`regie pull home.yml knobs` writes it"
    )
    assert ha.states["input_datetime.house_period_morning"] == "07:00:00", "kept"
    # the pull: one leaf, every other byte kept
    before = modes.read_text(encoding="utf-8")
    lines = P.pull(house, ha, tmp_path, ["knobs"], P.house_files(house), link)
    assert "  + modes.yml: periods.morning.at 06:30 → 07:00" in lines
    assert lines[-1].startswith("pull: 1 leaf/file(s) written")
    after = modes.read_text(encoding="utf-8")
    assert after == before.replace('at: "06:30"', 'at: "07:00"')
    house = load_house(path)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "knob house_period_morning") == "07:00 — follows the files"
    marks = json.loads((tmp_path / ".regie/knobs.json").read_text())
    assert marks["input_datetime.house_period_morning"] == "07:00", "the memory refreshed"
    # the file moves while the phone holds nothing of its own: the file wins
    modes.write_text(after.replace('at: "07:00"', 'at: "06:45"'), encoding="utf-8")
    house = load_house(path)
    steps = apply(house, secrets, tmp_path, ha, check=True)
    assert states(steps)["knob house_period_morning"] == "would"
    assert ha.states["input_datetime.house_period_morning"] == "07:00:00", "a check writes nothing"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["knob house_period_morning"] == "changed"
    assert detail(steps, "knob house_period_morning") == (
        "set from the files (07:00 → 06:45) — the phone had not moved"
    )
    assert ha.states["input_datetime.house_period_morning"] == "06:45:00"
    # both moved: by hand, nothing lost; push takes the files' word
    ha.states["input_datetime.house_period_morning"] = "05:00:00"
    modes.write_text(
        modes.read_text(encoding="utf-8").replace('"06:45"', '"06:15"'), encoding="utf-8"
    )
    house = load_house(path)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["knob house_period_morning"] == "hand"
    assert detail(steps, "knob house_period_morning") == (
        "05:00 — edited on the phone (06:45 → 05:00) and the files moved too (06:45 → 06:15) "
        "— kept, by hand: `regie pull home.yml knobs` keeps the phone's, "
        "`regie push home.yml knobs` the files'"
    )
    assert ha.states["input_datetime.house_period_morning"] == "05:00:00", "kept"
    lines = P.push(house, ha, tmp_path, ["knobs"], link)
    assert "  + knob house_period_morning: 05:00 → 06:15" in lines
    assert ha.states["input_datetime.house_period_morning"] == "06:15:00"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "knob house_period_morning") == "06:15 — follows the files"
    # the memory lost (a rebuilt brain): a fresh helper has no word — the file leads
    (tmp_path / ".regie/knobs.json").unlink()
    ha.states["input_datetime.house_period_morning"] = "05:00:00"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "knob house_period_morning") == (
        "set from the files (05:00 → 06:15) — the phone had not moved"
    )


def test_a_rooms_look_for_a_period_pulls_into_its_defaults(secrets, tmp_path, house_with):
    """The Réglages selects: a look picked for a stretch of the day lands in
    the room file's `defaults:` — a flow map in the witness — replacing the
    period's line or adding it; `sun` removes it (the daylight base drives)."""
    path = house_with(lambda d: None)
    house = load_house(path)
    living = path.parent / "rooms" / "living.yml"
    ha = FakeHA()
    apply(house, secrets, tmp_path, ha, check=False)
    ha.states["input_select.living_look_night"] = "evening"  # the phone
    ha.states["input_select.living_look_day"] = "night"
    ha.states["input_select.living_look_dim"] = "evening"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "knob living_look_day").startswith(
        "night — edited on the phone (sun → night)"
    )
    before = living.read_text(encoding="utf-8")
    lines = P.pull(house, ha, tmp_path, ["knobs"], P.house_files(house), link)
    assert "  + living.yml: defaults.night night → evening" in lines
    assert "  + living.yml: defaults.day sun → night" in lines
    after = living.read_text(encoding="utf-8")
    assert after == before.replace(
        "defaults: { dark: evening, dim: day, bright: day, night: night }",
        "defaults: { dark: evening, dim: evening, bright: day, night: evening, day: night }",
    )
    house = load_house(path)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "knob living_look_day") == "night — follows the files"
    ha.states["input_select.living_look_day"] = "sun"
    P.pull(house, ha, tmp_path, ["knobs"], P.house_files(house), link)
    assert "night: evening }" in living.read_text(encoding="utf-8"), "the period's line gone"


def test_the_days_rules_are_a_document_and_a_store_is_kept_freed_or_a_hand(
    secrets, tmp_path, house_with
):
    """The palette's own three-way, on TWO documents of one store (0.43, V8b).

    The day's rules were twenty-one helpers of a group until then; they are one
    document beside the kept palettes now, read the same way and freed the same
    way. THE FILES: `fx.yml`'s `palettes.today`. THE PHONE: the document, or —
    the ordinary state — nothing at all, and then the house follows the files
    with no seeding and nothing to free. THE SEED: the files' word the hand
    departed from, stamped into the document at its birth.

    A store kept on the phone is named at every converge until pulled; the pull
    writes the rules' leaves that moved and adds the palette as a block, the
    file's notes kept; the next converge frees both. What the files carry
    differently waits for a hand; push frees it."""
    path = house_with(lambda d: None)
    house = load_house(path)
    fx = path.parent / "fx.yml"
    ha = FakeHA()
    ha.palette_file_rules = palette_mod.rules_normal(house.palettes()["today"])
    apply(house, secrets, tmp_path, ha, check=False)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    # no document: the ordinary state, and nothing is written to say so
    assert detail(steps, "the day's rules") == "follows the files"
    assert ha.palette_rules is None

    def door(**kw):
        with ha.ws() as ws:
            return ws.call("regie/palettes/rules", **kw)

    # a hand moves a weight in the Atelier: the document is born, stamped
    rules = dict(ha.palette_file_rules)
    door(rules={**rules, "harmonies": {**rules["harmonies"], "libre": 1}})
    assert ha.palette_rules_seed == ha.palette_file_rules
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["the day's rules"] == "ok"
    assert detail(steps, "the day's rules") == (
        "edited on the phone (harmonies {'degrade': 5, 'duo': 3, 'uni': 2, 'libre': 0} → "
        "{'degrade': 5, 'duo': 3, 'uni': 2, 'libre': 1}), kept — not yet pulled: "
        "`regie pull home.yml palettes` writes it"
    )
    doc = {
        "label": "Nuit rouge",
        "band": [330, 30],
        "accent": 200,
        "saturation": 95,
        "white": "warm",
    }
    ha.palettes["nuit_rouge"] = dict(doc)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["palette « Nuit rouge »"] == "ok"
    assert detail(steps, "palette « Nuit rouge »") == (
        "edited on the phone (kept as `nuit_rouge`), kept — not yet pulled: "
        "`regie pull home.yml palettes` writes it"
    )
    before = fx.read_text(encoding="utf-8")
    lines = P.pull(house, ha, tmp_path, ["palettes"], P.house_files(house), link)
    assert any(line.startswith("  + fx.yml: palettes.today.harmonies ") for line in lines)
    assert "  + fx.yml: palettes.nuit_rouge ← palette « Nuit rouge »" in lines
    # a rule NOBODY moved keeps the file's own line, comment and spelling
    assert not any("palettes.today.avoid" in line for line in lines)
    after = fx.read_text(encoding="utf-8")
    assert "    harmonies: { degrade: 5, duo: 3, uni: 2, libre: 1 }\n" in after
    assert (
        "  nuit_rouge:\n    label: Nuit rouge\n    band: [330, 30]\n    accent: 200\n"
        "    saturation: 95\n    white: warm\n"
    ) in after
    assert "# signs of life" in after, "the file's notes kept"
    assert after.count("\n") == before.count("\n") + 6, "the palette's block and nothing else"
    assert (
        yaml.safe_load(after)["palettes"]["nuit_bleue"]
        == yaml.safe_load(before)["palettes"]["nuit_bleue"]
    )
    # the next converge: the files carry both now, and both documents are freed
    house = load_house(path)
    ha.palette_file_rules = palette_mod.rules_normal(house.palettes()["today"])
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["the day's rules"] == "changed"
    assert detail(steps, "the day's rules") == "freed — the files carry the day's rules now"
    assert ha.palette_rules is None, "the document is deleted, not left lying about"
    assert states(steps)["palette « Nuit rouge »"] == "changed"
    assert detail(steps, "palette « Nuit rouge »") == "freed — the files carry `nuit_rouge` now"
    assert "nuit_rouge" not in ha.palettes, "the document is deleted, not blanked"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "the day's rules") == "follows the files"
    assert "palette « Nuit rouge »" not in states(steps), "a store with nothing in it says nothing"
    # kept again with a number touched: the files carry it differently — a hand
    ha.palettes["nuit_rouge"] = {**doc, "accent": 120}
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["palette « Nuit rouge »"] == "hand"
    assert detail(steps, "palette « Nuit rouge »") == (
        "edited on the phone (kept as `nuit_rouge`) and the files moved too (accent 120 → 200) "
        "— kept, by hand: `regie pull home.yml palettes` keeps the phone's, "
        "`regie push home.yml palettes` the files'"
    )
    assert "nuit_rouge" in ha.palettes, "kept"
    # BOTH MOVED, on the rules: the hand moved them, then the file moved too —
    # the seed stamped at the document's birth is what tells the two apart
    door(rules={**ha.palette_file_rules, "saturation": [50, 60]})
    fx.write_text(
        set_leaf(fx.read_text(encoding="utf-8"), ["palettes", "today", "avoid"], [10, 20]),
        encoding="utf-8",
    )
    house = load_house(path)
    # the brain reads `regie: palette:` once at start: until the converge that
    # changes the package has restarted it, the step SAYS the brain has not read
    # the file — a step must never claim the house follows a word nobody read
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["the day's rules"] == "hand"
    assert detail(steps, "the day's rules").startswith(
        "the brain has not read the files' rules yet (it restarts at a converge that "
        "changes the package) — edited on the phone"
    )
    ha.palette_file_rules = palette_mod.rules_normal(house.palettes()["today"])  # restarted
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["the day's rules"] == "hand"
    assert detail(steps, "the day's rules") == (
        "edited on the phone (saturation [85, 100] → [50, 60]) and the files moved too "
        "(avoid [45, 105] → [10, 20]) — kept, by hand: `regie pull home.yml palettes` "
        "keeps the phone's, `regie push home.yml palettes` the files'"
    )
    lines = P.push(house, ha, tmp_path, ["palettes"], link)
    assert "  + the day's rules: freed — the files' version stands" in lines
    assert "  + palette « Nuit rouge »: freed — the files' version stands" in lines
    assert ha.palette_rules is None and "nuit_rouge" not in ha.palettes
    # a palette the files do not carry is not push's to free
    ha.palettes["aube"] = {**doc, "label": "Aube"}
    P.push(house, ha, tmp_path, ["palettes"], link)
    assert "aube" in ha.palettes


def test_the_hour_the_palette_turns_is_a_knob_of_its_own(secrets, tmp_path, house_with):
    """« Change à » is a rule of the day AND one of the family's five controls:
    it stays a helper (0.43) and is owned on its own — the group of twenty-one
    it belonged to is gone, and the leaf it writes is its own line in fx.yml."""
    path = house_with(lambda d: None)
    house = load_house(path)
    fx = path.parent / "fx.yml"
    ha = FakeHA()
    ha.palette_file_rules = palette_mod.rules_normal(house.palettes()["today"])
    apply(house, secrets, tmp_path, ha, check=False)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "knob house_palette_turns") == "06:30 — follows the files"
    ha.states["input_datetime.house_palette_turns"] = "07:15:00"
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["knob house_palette_turns"] == "ok"
    lines = P.pull(house, ha, tmp_path, ["palettes"], P.house_files(house), link)
    assert "  + fx.yml: palettes.today.turns ← knob house_palette_turns" in lines
    assert 'turns: "07:15"' in fx.read_text(encoding="utf-8"), "an hour is quoted, never a number"


def test_the_plans_draft_is_the_same_thing_under_the_same_rule(secrets, tmp_path, house_with):
    """The workbench's draft, read three ways: it follows the files, is kept
    when drawn on, waits for a hand when both moved; `regie pull home.yml
    plan` writes the rooms' `plan:` blocks; no memory of a seed = a hand."""
    from regie.plan import WORKBENCH, find_card, seed_path

    path = house_with(lambda d: None)
    house = load_house(path)
    ha = FakeHA()
    apply(house, secrets, tmp_path, ha, check=False)
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "workbench") == f"/{WORKBENCH} — follows the files"

    def ceiling():
        card = find_card(ha.dashboard_configs[WORKBENCH])
        return next(i for i in card["floors"][0]["items"] if i["entity"] == "light.living_ceiling")

    ceiling()["x"] = 180
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "workbench") == (
        f"/{WORKBENCH} — edited on the phone (1 thing(s) moved (light.living_ceiling)), kept — "
        "not yet pulled: `regie pull home.yml plan` writes it"
    )
    lines = P.pull(house, ha, tmp_path, ["plan"], P.house_files(house), link)
    assert "  + living.yml: plan written" in lines
    house = load_house(path)
    at = house.area("living")["plan"]["at"]["main"]
    assert any(p[0] == 180 for p in at.values())
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["workbench"] == "changed"
    assert detail(steps, "workbench") == (
        f"/{WORKBENCH} re-seeded from the files (the draft agreed with them — nothing lost)"
    )
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert detail(steps, "workbench") == f"/{WORKBENCH} — follows the files"
    # no memory: never overwritten
    seed_path(tmp_path).unlink()
    ceiling()["x"] = 200
    steps = apply(house, secrets, tmp_path, ha, check=False)
    assert states(steps)["workbench"] == "hand"
    assert "no memory of a seed" in detail(steps, "workbench")
    assert ceiling()["x"] == 200, "kept"
    lines = P.push(house, ha, tmp_path, ["plan"], link)
    assert f"  + /{WORKBENCH}: seeded from the files — the draft it held is gone" in lines
    assert ceiling()["x"] != 200


def test_a_born_knob_is_the_familys_after_its_first_breath(witness, secrets, tmp_path):
    ha = FakeHA()
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert detail(steps, "knob hall_motion") == "born on (was off)"
    assert detail(steps, "knob house_mode") == "born home (was home)", "a select is born at 1"
    ha.states["input_boolean.hall_motion"] = "off"
    ha.states["input_select.house_mode"] = "cinema"
    steps = apply(witness, secrets, tmp_path, ha, check=False)
    assert detail(steps, "knob hall_motion") == "off (born on, the family's since)"
    assert detail(steps, "knob house_mode") == "cinema (born home, the family's since)"
    assert ha.states["input_select.house_mode"] == "cinema"
    lines = P.pull(witness, ha, tmp_path, ["knobs"], P.house_files(witness), link)
    assert "  = nothing the phone moved" in lines, "a birth is not an edit"


def test_a_pull_with_nothing_moved_writes_nothing(secrets, tmp_path, house_with):
    """The round trip is the identity: seeded, then pulled with nothing
    touched, every house file comes back byte for byte."""
    path = house_with(lambda d: None)
    house = load_house(path)
    ha = FakeHA()
    apply(house, secrets, tmp_path, ha, check=False)
    files = sorted(path.parent.rglob("*.yml"))
    before = {f: f.read_text(encoding="utf-8") for f in files}
    lines = P.pull(house, ha, tmp_path, list(P.KINDS), P.house_files(house), link)
    assert lines[-1].startswith("pull: 0 leaf/file(s) written"), lines
    assert {f: f.read_text(encoding="utf-8") for f in files} == before
