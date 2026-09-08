"""One thing travels alone (0.45, the decision H52) — the verb `regie share`.

A friend's Home Assistant has three doors: the app's **Import** (a blueprint,
from a URL — no file opened, no helper made, re-import = update), the config
folder (a package — a hand in a file, no update path) and HACS (code only).
Only the first is open to somebody who never opens a file, and it takes a
blueprint and nothing else. So a thing of this house that goes to a friend
goes as a blueprint, and every contract must need no helper.

**The engine's share of it is this module: the verb, and the refusals.** What
knows a shape's fields or a look's roles is the pack that renders them, so the
stripping lives there — a fifth hook, `share(house, kind, id)`, beside
`vocabulary`, `check`, `context` and `apply`:

  * it returns `None` when the kind is not its own — that is how the engine
    finds the one pack that owns `fx`, `look`, `hands` without a register;
  * it returns a mapping of FILE NAME to TEXT, the names relative to a
    blueprints folder (`script/regie/fx_strike.yaml`), so one call may bring
    a whole shelf home;
  * `id` absent means *everything of that kind this house could share* — the
    tag's own render, and the friendliest thing to type;
  * it raises a `HouseError` in the pack's own words for a thing that cannot
    travel — a look that reads the house's palette, a remote whose whole
    point is the house's mode.

The engine refuses two things itself, because no pack should have to: a hook
that answers the wrong shape, and a file name that climbs out of the folder
it is written into."""

from __future__ import annotations

from pathlib import Path, PurePosixPath

import yaml

from .errors import HouseError
from .packs import call_hook, hooks_of


class _Dumper(yaml.SafeDumper):
    """The dump a travelling file is written with — a stranger reads it."""


def _string(dumper, data: str):
    """A description of several paragraphs is written as a block, not as one
    line of `\\n` escapes: this file is read on a web page by somebody who has
    never seen La Régie, and the head is the only prose they get."""
    block = (
        "\n" in data
        and "\r" not in data
        and all(line == line.rstrip() for line in data.split("\n"))
    )
    tag = "tag:yaml.org,2002:str"  # no-environment: ok — YAML's own type tag, not a host
    return dumper.represent_scalar(tag, data, style="|" if block else None)


_Dumper.add_representer(str, _string)


def as_yaml(doc: dict, header: str = "") -> str:
    """A pack's document as the text of a shared file — keys in the order the
    pack gave them, the same width as the render's own `to_block` so a
    template's `{{ … }}` is never folded across two lines."""
    text = yaml.dump(
        doc,
        Dumper=_Dumper,
        default_flow_style=False,
        allow_unicode=True,
        sort_keys=False,
        width=10**6,
    )
    return f"{header.rstrip(chr(10))}\n{text}" if header else text


def _name_is_a_file_under(pack, name: str) -> None:
    path = PurePosixPath(name)
    if (
        not name
        or name.endswith("/")
        or "\\" in name
        or path.is_absolute()
        or ".." in path.parts
        or "." in path.parts
    ):
        raise HouseError(
            f"pack {pack.name}: the share hook named the file {name!r} — a shared file's "
            "name is a path UNDER the blueprints folder, never above it"
        )


def files_of(house, kind: str, id: str | None) -> dict[str, str]:
    """What the house's packs would send: {file name: text}. The first pack
    that claims the kind answers for it; a pack claims a kind by returning
    anything but `None`."""
    carriers = hooks_of(house.packs, "share")
    for pack, fn in carriers:
        said = call_hook(pack, "share", fn, house, kind, id)
        if said is None:
            continue
        ok = isinstance(said, dict) and all(
            isinstance(k, str) and isinstance(v, str) for k, v in said.items()
        )
        if not ok:
            raise HouseError(
                f"pack {pack.name}: the share hook returns a mapping of file name to text, "
                f"or None when the kind is not its own; it returned {said!r}"
            )
        if not said:
            raise HouseError(
                f"pack {pack.name}: the share hook claimed {kind!r} and gave no file — "
                "a thing that cannot travel is refused in a sentence, never in silence"
            )
        for name in said:
            _name_is_a_file_under(pack, name)
        return said
    shares = ", ".join(p.name for p, _ in carriers) or "none"
    raise HouseError(
        f"no pack of this house shares a {kind!r} — the packs that share something: {shares}"
    )


def write(files: dict[str, str], out: Path) -> tuple[list[str], list[str]]:
    """The files under `out`, byte for byte. A file already saying exactly this
    is left alone and named `unchanged` — which is what makes a second run of
    the verb, and the tag's own render, readable."""
    written, unchanged = [], []
    for name in sorted(files):
        path = out / name
        if path.is_file() and path.read_text(encoding="utf-8") == files[name]:
            unchanged.append(name)
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(files[name], encoding="utf-8")
        written.append(name)
    return written, unchanged
