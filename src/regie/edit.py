"""One leaf of a house file, edited in place (0.33): the value at a path of
mapping keys is replaced, inserted or removed in the file's OWN text — the
line's comment, its alignment, every other byte kept. `regie pull` writes
what a person tuned on the phone into files a person also writes by hand,
with notes in the margins: the file must come back as it was but for that
leaf, or the pull's diff cannot be read as the person's work.

Two forms only, the ones the house files use: a block mapping (a key on its
own line, its children indented under it) and a flow mapping on ONE line
(`morning: { at: "06:30", label: Matin }`). A sequence never stands on a
path here — the house keys everything by name. A value is written in flow
style (`[45, 105]`, `{ curve: { … } }`, `"06:30"`); a new mapping under a
block parent is written as a block, one key per line, its leaves in flow.
"""

from __future__ import annotations

import re

from .errors import HouseError

_KEY = re.compile(r"^(?P<indent>[ \t]*)(?P<key>[^\s#'\"\[{][^:#]*?):(?P<rest>$|\s.*$)")


def flow(v) -> str:
    """A value in YAML's flow style, the way the house writes its leaves."""
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, str):
        special = any(c in v for c in ":#{}[],&*?|<>=!%@`'\"")
        words = v.lower() in ("true", "false", "yes", "no", "on", "off", "null", "~", "")
        number = re.fullmatch(r"[-+]?(\d[\d_]*(\.\d*)?|\.\d+)([eE][-+]?\d+)?", v) is not None
        return f'"{v}"' if special or words or number or v != v.strip() else v
    if isinstance(v, (list, tuple)):
        return "[" + ", ".join(flow(x) for x in v) + "]"
    if isinstance(v, dict):
        return "{ " + ", ".join(f"{k}: {flow(x)}" for k, x in v.items()) + " }"
    return str(v)


def _indent(line: str) -> int:
    return len(line) - len(line.lstrip(" \t"))


def _real(line: str) -> bool:
    s = line.strip()
    return bool(s) and not s.startswith("#")


def _split_comment(s: str) -> tuple[str, str]:
    """`value   # a note` → ("value", "   # a note"); quotes respected."""
    quote = None
    for i, c in enumerate(s):
        if quote:
            if c == quote:
                quote = None
        elif c in "\"'":
            quote = c
        elif c == "#" and (i == 0 or s[i - 1] in " \t"):
            j = i
            while j > 0 and s[j - 1] in " \t":
                j -= 1
            return s[:j], s[j:]
    return s, ""


def _block_end(lines: list[str], i: int, end: int, indent: int) -> int:
    """The first line after the block opened at lines[i]: a real line, or a
    comment, standing at the parent's indent or less closes it."""
    j = i + 1
    while j < end:
        s = lines[j].strip()
        if s and _indent(lines[j]) <= indent:
            break
        j += 1
    return j


def _find(lines: list[str], start: int, end: int, indent: int, key: str) -> int | None:
    for i in range(start, end):
        if not _real(lines[i]) or _indent(lines[i]) != indent:
            continue
        m = _KEY.match(lines[i])
        if m and m.group("key").strip() == key:
            return i
    return None


def _child_indent(lines: list[str], start: int, end: int, indent: int) -> int:
    for i in range(start, end):
        if _real(lines[i]):
            return _indent(lines[i])
    return indent + 2


def _last_real(lines: list[str], start: int, end: int) -> int:
    """The index after the last real line of the region (start when empty)."""
    for i in range(end - 1, start - 1, -1):
        if _real(lines[i]):
            return i + 1
    return start


def _block_lines(indent: int, path: list[str], value) -> list[str]:
    pad = " " * indent
    if len(path) > 1:
        return [f"{pad}{path[0]}:"] + _block_lines(indent + 2, path[1:], value)
    if isinstance(value, dict):
        return [f"{pad}{path[0]}:"] + [f"{pad}  {k}: {flow(v)}" for k, v in value.items()]
    return [f"{pad}{path[0]}: {flow(value)}"]


# --- flow mappings, on one line ------------------------------------------------------
def _flow_entries(body: str) -> list[list[str]]:
    """`{ a: 1, b: { c: 2 } }` → [["a", "1"], ["b", "{ c: 2 }"]]."""
    s = body.strip()
    if not (s.startswith("{") and s.endswith("}")):
        raise HouseError(f"not a flow mapping: {body.strip()!r}")
    inner = s[1:-1]
    parts: list[str] = []
    depth, quote, cur = 0, None, ""
    for c in inner:
        if quote:
            cur += c
            if c == quote:
                quote = None
            continue
        if c in "\"'":
            quote = c
        elif c in "{[":
            depth += 1
        elif c in "}]":
            depth -= 1
        elif c == "," and depth == 0:
            parts.append(cur)
            cur = ""
            continue
        cur += c
    if cur.strip():
        parts.append(cur)
    out = []
    for p in parts:
        if ":" not in p:
            raise HouseError(f"a flow entry without a key: {p.strip()!r}")
        k, v = p.split(":", 1)
        out.append([k.strip(), v.strip()])
    return out


def _flow_join(entries: list[list[str]]) -> str:
    return "{ " + ", ".join(f"{k}: {v}" for k, v in entries) + " }" if entries else "{}"


def _set_flow(body: str, path: list[str], value) -> str:
    entries = _flow_entries(body)
    key, rest = path[0], path[1:]
    at = next((n for n, (k, _) in enumerate(entries) if k == key), None)
    if rest:
        if at is None:
            if value is None:
                return body
            entries.append([key, flow(_nest(rest, value))])
        else:
            entries[at][1] = _set_flow(entries[at][1], rest, value)
    elif value is None:
        if at is None:
            return body
        del entries[at]
    elif at is None:
        entries.append([key, flow(value)])
    else:
        entries[at][1] = flow(value)
    return _flow_join(entries)


def _nest(path: list[str], value):
    for k in reversed(path):
        value = {k: value}
    return value


# --- the block walk ----------------------------------------------------------------------
def _set(lines: list[str], start: int, end: int, indent: int, path: list[str], value) -> None:
    key, rest = path[0], path[1:]
    i = _find(lines, start, end, indent, key)
    if i is None:
        if value is None:
            return
        at = _last_real(lines, start, end)
        lines[at:at] = _block_lines(indent, path, value)
        return
    m = _KEY.match(lines[i])
    assert m is not None
    head = lines[i][: m.start("rest")]
    body, comment = _split_comment(m.group("rest"))
    stripped = body.strip()
    lead = (body[: len(body) - len(body.lstrip(" \t"))] or " ") if stripped else " "
    if rest:
        if stripped.startswith("{"):
            lines[i] = f"{head}{lead}{_set_flow(body, rest, value)}{comment}"
            return
        if stripped:
            raise HouseError(f"{key}: holds a scalar ({stripped}), not a mapping")
        stop = _block_end(lines, i, end, indent)
        _set(lines, i + 1, stop, _child_indent(lines, i + 1, stop, indent), rest, value)
        return
    stop = _block_end(lines, i, end, indent)
    if value is None:
        del lines[i : _last_real(lines, i + 1, stop)]
        return
    if not stripped and isinstance(value, dict):
        # a block stays a block: its children rewritten, one key per line
        child = _child_indent(lines, i + 1, stop, indent)
        lines[i + 1 : _last_real(lines, i + 1, stop)] = [
            f"{' ' * child}{k}: {flow(v)}" for k, v in value.items()
        ]
        return
    if not stripped and stop > i + 1:
        del lines[i + 1 : _last_real(lines, i + 1, stop)]
    lines[i] = f"{head}{lead}{flow(value)}{comment}"


def set_leaf(text: str, path: list[str], value) -> str:
    """The text with the value at `path` replaced (None: removed; a key on the
    way that the file lacks: created in the file's own form)."""
    if not path:
        raise HouseError("an empty path")
    lines = text.split("\n")
    _set(lines, 0, len(lines), 0, list(path), value)
    return "\n".join(lines)


def set_leaves(text: str, leaves: dict[tuple[str, ...], object]) -> str:
    for path, value in leaves.items():
        text = set_leaf(text, list(path), value)
    return text
