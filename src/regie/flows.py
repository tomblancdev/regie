"""The flow walker — one config flow, walked from a row's answers.

Home Assistant's integrations are born from *config flows*: a form the UI
posts, sometimes a second one, sometimes a step only a person can take (a
PIN shown on a screen, a consent given in a browser). The walker takes a
domain and the answers a row holds, starts the flow (or continues a
discovered one), fills each form from the answers and the form's own
defaults, and reports how it ended — honestly:

- `changed`  the entry was made
- `ok`       the flow said it exists already (adopted)
- `waiting`  the thing did not answer (off, or not at that address yet):
             the flow is closed, `apply` tries again next time
- `hand`     a person is needed — a PIN, a consent, credentials the
             secrets do not hold; `apply` names the verb (`regie link`)

`apply` walks with no person at hand; `link` walks with one: `prompt` asks
the terminal, `on_url` shows the consent's address and `wait_external`
waits for the callback. The walker never touches a flow past what it can
answer: what it cannot finish it closes (DELETE), so a converge leaves no
half-open flow behind and never makes a screen show a PIN to nobody."""

from __future__ import annotations

import time
from collections.abc import Callable
from dataclasses import dataclass

from .errors import HouseError
from .ha import HomeAssistant

FLOWS = "/api/config/config_entries/flow"
# a form field only a person can answer (read off the screen of the thing)
PERSON_FIELDS = ("pin", "pairing_code")
ADOPT = ("already_configured", "single_instance_allowed", "already_in_progress")
MAX_STEPS = 10


@dataclass
class Outcome:
    state: str  # changed | ok | waiting | hand
    detail: str


def fill_form(schema: list[dict], answers: dict) -> dict:
    """A form's body: the answers for the fields it asks, the form's own
    `default` for what is not answered, and every SECTION (an expandable block
    of advanced options - a required key even when nothing in it is) filled
    the same way from its own schema."""
    body: dict = {}
    for f in schema:
        name = f["name"]
        if f.get("type") == "expandable":
            body[name] = fill_form(f.get("schema", []), answers.get(name) or {})
        elif name in answers:
            body[name] = answers[name]
        elif "default" in f:
            body[name] = f["default"]
    return body


def unanswered(schema: list[dict], body: dict) -> list[str]:
    """The required fields the body does not fill (no answer, no default)."""
    return [
        f["name"]
        for f in schema
        if f.get("type") != "expandable" and not f.get("optional") and f["name"] not in body
    ]


def _errors(flow: dict) -> list[str]:
    out: list[str] = []
    for v in (flow.get("errors") or {}).values():
        out.extend(v if isinstance(v, list) else [v])
    return [str(e) for e in out]


def walk(
    ha: HomeAssistant,
    domain: str,
    answers: dict,
    *,
    flow_id: str | None = None,
    prompt: Callable[[str, dict], str] | None = None,
    on_url: Callable[[str], None] | None = None,
    wait_external: Callable[[str], bool] | None = None,
    verb: str = "regie link",
) -> Outcome:
    """Walk one flow. `flow_id` continues a discovered one; otherwise the flow
    is started as a user would. The answers are consumed by name."""
    answers = dict(answers)
    if flow_id:
        status, flow = ha.get(f"{FLOWS}/{flow_id}")
        if status == 404:
            status, flow = ha.post(FLOWS, {"handler": domain})
    else:
        status, flow = ha.post(FLOWS, {"handler": domain})
    if status != 200 or not isinstance(flow, dict):
        raise HouseError(f"{domain}: the flow refused to start: {status} {flow}")
    pin_tries = 0
    for _ in range(MAX_STEPS):
        kind = flow.get("type")
        fid = flow.get("flow_id")
        if kind == "create_entry":
            return Outcome("changed", f"set up — {flow.get('title') or domain}")
        if kind == "abort":
            reason = flow.get("reason")
            if reason in ADOPT:
                return Outcome("ok", f"already set up ({reason})")
            if reason == "missing_credentials":
                return Outcome(
                    "hand",
                    f"needs application credentials: the secrets {domain}_client_id + "
                    f"{domain}_client_secret (or a cloud link the brain offers)",
                )
            raise HouseError(f"{domain}: the flow aborted ({reason})")
        if kind == "external":
            if not (on_url and wait_external):
                ha.delete(f"{FLOWS}/{fid}")
                return Outcome("hand", f"a consent in a browser — {verb}")
            on_url(flow["url"])
            if not wait_external(fid):
                ha.delete(f"{FLOWS}/{fid}")
                raise HouseError(f"{domain}: no consent came back in time — the flow is closed")
            status, flow = ha.get(f"{FLOWS}/{fid}")
            if status != 200:
                raise HouseError(f"{domain}: after the consent: {status} {flow}")
            continue
        if kind == "progress":
            time.sleep(2)
            status, flow = ha.get(f"{FLOWS}/{fid}")
            continue
        if kind != "form":
            ha.delete(f"{FLOWS}/{fid}")
            raise HouseError(f"{domain}: the flow shows a {kind} step — not walked")
        schema = flow.get("data_schema") or []
        errors = _errors(flow)
        fields = [f["name"] for f in schema]
        if errors:
            if "cannot_connect" in errors:
                ha.delete(f"{FLOWS}/{fid}")
                where = answers.get("host") or domain
                return Outcome(
                    "waiting",
                    f"{where} does not answer (cannot_connect): powered? at this address? "
                    "— tried again at the next apply",
                )
            if "invalid_auth" in errors and prompt and pin_tries < 3:
                pass  # a wrong PIN: ask again below
            else:
                ha.delete(f"{FLOWS}/{fid}")
                raise HouseError(f"{domain}: the form came back with {', '.join(errors)}")
        person = [f for f in fields if f in PERSON_FIELDS]
        if person:
            if not prompt:
                ha.delete(f"{FLOWS}/{fid}")
                return Outcome("hand", f"a {person[0].replace('_', ' ')} on its screen — {verb}")
            for f in person:
                answers[f] = prompt(f, flow)
            pin_tries += 1
        body = fill_form(schema, answers)
        missing = unanswered(schema, body)
        if missing:
            ha.delete(f"{FLOWS}/{fid}")
            raise HouseError(
                f"{domain}: its form ({flow.get('step_id')}) asks {missing}; "
                "nothing in home.yml answers"
            )
        status, flow = ha.post(f"{FLOWS}/{fid}", body)
        if status != 200 or not isinstance(flow, dict):
            ha.delete(f"{FLOWS}/{fid}")
            raise HouseError(f"{domain}: {status} {flow} — the form asked {fields}")
    ha.delete(f"{FLOWS}/{fid}")
    raise HouseError(f"{domain}: the flow did not end after {MAX_STEPS} steps")
