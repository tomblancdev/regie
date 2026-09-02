"""The skin — a palette the house declares, and what Home Assistant calls it.

A house says what a colour IS — the ground, a panel, its edge, the ink, what is
lit, what is wrong — and this maps those words onto the forty-odd CSS
variables the frontend actually reads. The house never writes
`--state-light-active-color`; it says `lit`, once, and every card that means "a
light is on" follows.

Three lines of geometry come with the palette because they change the *feel*
more than any colour does: a card's radius (a floating pill, or a plate), the
radius of a tile's icon (a round dot, or a square key), and the height of a
feature bar (a hint of a slider, or a fader you can catch with a thumb).

The typefaces are the one thing a theme cannot do alone: it may NAME a family
but not load one, and the only face Home Assistant ships is Roboto. So the
product carries a few (base/fonts/) and renders them into the brain's own
`www/` as one ES module of `@font-face` rules with the data inlined —
`frontend.extra_module_url` loads it on every page, nothing is fetched at
runtime, and the family's phones never call a font server.
"""

from __future__ import annotations

import base64
from pathlib import Path

FONTS = Path(__file__).parent / "base" / "fonts"

# what the product carries, by family and weight — a stack that names one of
# these gets it embedded; a stack that names anything else is a plain fallback
FACES: dict[str, list[int]] = {
    "barlow": [400, 500, 600],
    "oswald": [400, 500],
}

# the words a palette is made of; `header` is optional (a rail darker or lighter
# than the ground) and falls back to it. `lit` is not spelled `on`: YAML 1.1
# reads a bare `on:` as the boolean true, and a key that has to be quoted to
# mean what it says is a bad key — the labels file was carrying that bug for
# five versions before this one found it.
ROLES = ("ground", "panel", "edge", "ink", "ink_soft", "accent", "lit", "alert")

# a plate catches light from above: a hairline highlight on its top edge and a
# hard line under it. The values differ by mode because the light does.
LIFT = {
    "dark": "inset 0 1px 0 rgba(255, 255, 255, 0.055), 0 1px 0 rgba(0, 0, 0, 0.6)",
    "light": "inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 1px 0 rgba(0, 0, 0, 0.12)",
}


def stack(families: list[str] | str) -> str:
    """A font-family stack, quoted where a name has a space in it."""
    names = [families] if isinstance(families, str) else list(families)
    return ", ".join(f"'{n}'" if " " in n else n for n in names)


def mode_vars(palette: dict, mode: str) -> dict[str, str]:
    """One mode's colours — the house's words, in Home Assistant's names."""
    p = dict(palette)
    header = p.get("header", p["ground"])
    return {
        "primary-color": p["accent"],
        "accent-color": p["alert"],
        "primary-background-color": p["ground"],
        "secondary-background-color": p["ground"],
        "card-background-color": p["panel"],
        "ha-card-background": p["panel"],
        "ha-card-border-color": p["edge"],
        "ha-card-box-shadow": LIFT[mode],
        "divider-color": p["edge"],
        "primary-text-color": p["ink"],
        "secondary-text-color": p["ink_soft"],
        "text-primary-color": p["ground"],
        "disabled-text-color": p["ink_soft"],
        "ha-card-header-color": p["ink"],
        "app-header-background-color": header,
        "app-header-text-color": p["ink"],
        "app-header-border-bottom": f"1px solid {p['edge']}",
        "sidebar-background-color": p["panel"],
        "sidebar-text-color": p["ink_soft"],
        "sidebar-icon-color": p["ink_soft"],
        "sidebar-selected-text-color": p["accent"],
        "sidebar-selected-icon-color": p["accent"],
        "state-icon-color": p["ink_soft"],
        "state-active-color": p["lit"],
        "state-light-active-color": p["lit"],
        "state-inactive-color": p["ink_soft"],
        "switch-checked-color": p["lit"],
        "paper-item-icon-active-color": p["lit"],
        "error-color": p["alert"],
        "warning-color": p["alert"],
    }


def shared_vars(theme: dict) -> dict[str, str]:
    """What does not change with the light: the geometry and the type."""
    body = stack(theme.get("body") or ["Roboto", "sans-serif"])
    head = stack(theme.get("heading") or theme.get("body") or ["Roboto", "sans-serif"])
    return {
        "ha-card-border-radius": f"{theme.get('radius', 12)}px",
        "ha-card-border-width": "1px",
        "tile-icon-border-radius": f"{theme.get('icon_radius', 24)}px",
        "feature-border-radius": f"{theme.get('feature_radius', 12)}px",
        "feature-height": f"{theme.get('slider', 40)}px",
        "ha-font-family-body": body,
        "ha-font-family-heading": head,
        "ha-card-header-font-family": head,
    }


def build(theme: dict) -> dict:
    """The whole theme file: what is shared, then one block per mode."""
    out = dict(shared_vars(theme))
    modes = {}
    for mode in ("light", "dark"):
        palette = theme.get(mode)
        if palette:
            modes[mode] = mode_vars(palette, mode)
    if modes:
        out["modes"] = modes
    return {theme["name"]: out}


def wanted_faces(theme: dict) -> list[tuple[str, int]]:
    """Which of the faces the product carries this theme actually asks for —
    DERIVED from the stacks it names, never listed twice."""
    named = {n.strip("'\"").lower() for key in ("body", "heading") for n in (theme.get(key) or [])}
    return [(f, w) for f in FACES if f in named for w in FACES[f]]


def font_faces(theme: dict) -> list[dict]:
    """Each face as a `@font-face` rule's parts, its file inlined. A face the
    product does not carry is simply absent — the stack's next name takes over,
    which is what a fallback is for."""
    out = []
    for family, weight in wanted_faces(theme):
        data = (FONTS / f"{family}-{weight}.woff2").read_bytes()
        out.append(
            {
                "family": family.capitalize(),
                "weight": weight,
                "data": base64.b64encode(data).decode("ascii"),
            }
        )
    return out
