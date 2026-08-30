"""Effects — shapes × backends. A SHAPE is protocol-free: steps of level,
colour, hold and transition, repeats, bricks composed with `use:`. A BACKEND
declares its ENVELOPE (the finest step it honours, what it cannot do) and
compiles a shape into what the brain runs. At 0.4 one backend exists, `ha` —
the generic light-service loop, the slowest rung; its numbers are a floor to
measure, not a promise. The per-protocol backends are folders with their
envelope written down and no compiler yet: a new protocol is a folder, never
a rewrite.

A shape's step says `$name` to read one of its fields at run time; a step
that `use:`s another shape binds that shape's fields to numbers or to the
outer fields. The compiler flattens the bricks, clamps every hold to the
backend's step (and says so: a refusal is a line, never silence), and emits
Home Assistant actions — a script per shape, its fields the shape's.

The compiled script snapshots its target, runs, and puts the snapshot back
(`restore: false` keeps the last step)."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

import yaml

from .errors import HouseError

HERE = Path(__file__).parent / "packs" / "fx"
SHAPES = HERE / "shapes"
BACKENDS = HERE / "backends"


def product_shapes() -> dict[str, dict]:
    out = {}
    for p in sorted(SHAPES.glob("*.yml")):
        out[p.stem] = yaml.safe_load(p.read_text(encoding="utf-8")) or {}
    return out


def load_shapes(house_shapes: dict | None = None) -> dict[str, dict]:
    shapes = product_shapes()
    for name, shape in (house_shapes or {}).items():
        shapes[name] = shape
    return shapes


def known_backends() -> list[str]:
    return sorted(d.name for d in BACKENDS.iterdir() if (d / "backend.yml").is_file())


def load_backend(name: str) -> dict:
    path = BACKENDS / name / "backend.yml"
    if not path.is_file():
        raise HouseError(f"fx: unknown backend {name!r} — known: {', '.join(known_backends())}")
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    data.setdefault("name", name)
    return data


# --- values -------------------------------------------------------------------
class Ref:
    """`$name` in a shape — a field read at run time."""

    __slots__ = ("name",)

    def __init__(self, name: str):
        self.name = name

    def __repr__(self) -> str:
        return f"${self.name}"


def _value(raw, bindings: dict):
    """A step's value resolved through the bindings: a number, a string, None,
    or a Ref to an outer field."""
    if isinstance(raw, str) and raw.startswith("$"):
        name = raw[1:]
        if name not in bindings:
            raise HouseError(f"fx: ${name} is not a field of this shape")
        return bindings[name]
    return raw


def _template(v, default=None):
    """What lands in the Home Assistant action: a constant, or a template
    reading the script's field (with the shape's default when unset)."""
    if isinstance(v, Ref):
        return "{{ " + v.name + " }}"
    return default if v is None else v


@dataclass
class Compiled:
    id: str
    shape: dict
    fields: dict  # name -> default
    actions: list  # Home Assistant actions
    notes: list[str] = field(default_factory=list)
    restore: bool = True


def _hold_action(hold, envelope_step: float, notes: list[str], where: str) -> dict | None:
    if hold is None:
        return None
    if isinstance(hold, Ref):
        # clamped at run time: the field may be set finer than the backend honours
        return {"delay": "{{ [" + hold.name + " | float, " + str(envelope_step) + "] | max }}"}
    hold = float(hold)
    if hold < envelope_step:
        notes.append(
            f"{where.rsplit(' step', 1)[0]}: holds of {hold:g} s asked, "
            f"the backend gives {envelope_step:g} → stretched"
        )
        hold = envelope_step
    return {"delay": hold}


def _set_action(level, colour, transition) -> dict:
    lvl = _template(level, 100)
    tr = _template(transition, 0)
    if isinstance(colour, Ref):
        colour_expr = "colour_rgb"
    elif colour:
        colour_expr = "[" + ", ".join(str(int(colour[i : i + 2], 16)) for i in (1, 3, 5)) + "]"
    else:
        colour_expr = None
    base = "{'brightness_pct': " + _lit(lvl) + ", 'transition': " + _lit(tr) + "}"
    if colour_expr is None:
        data_t = "{{ " + base + " }}"
    elif colour_expr == "colour_rgb":
        data_t = (
            "{% set d = " + base + " %}"
            "{% if colour_rgb %}{% set d = dict(d, rgb_color=colour_rgb) %}{% endif %}{{ d }}"
        )
    else:
        data_t = "{{ dict(" + base + ", rgb_color=" + colour_expr + ") }}"
    return {"action": "light.turn_on", "target": {"entity_id": "{{ target }}"}, "data": data_t}


def _lit(v) -> str:
    """A value inside a Jinja expression: a template becomes the bare field."""
    if isinstance(v, str) and v.startswith("{{ ") and v.endswith(" }}"):
        return v[3:-3]
    return repr(v)


def _expand(
    shape_id: str,
    shapes: dict,
    bindings: dict,
    backend: dict,
    notes: list[str],
    depth: int = 0,
    trail: str = "",
) -> list[dict]:
    if depth > 8:
        raise HouseError(f"fx: {shape_id} composes itself (a loop of `use:`)")
    shape = shapes[shape_id]
    step_floor = float(backend.get("envelope", {}).get("step", 0))
    actions: list[dict] = []
    name = f"{trail}/{shape_id}" if trail else shape_id
    for i, step in enumerate(shape.get("steps", [])):
        where = f"{name} step {i + 1}"
        if "use" in step:
            inner_id = step["use"]
            if inner_id not in shapes:
                raise HouseError(f"fx: {where} uses {inner_id!r}, not a shape")
            inner = shapes[inner_id]
            inner_bind = {k: _value(v, {}) for k, v in (inner.get("fields") or {}).items()}
            for k, v in step.items():
                if k == "use":
                    continue
                if k not in inner_bind:
                    raise HouseError(f"fx: {where}: {inner_id} has no field {k!r}")
                inner_bind[k] = _value(v, bindings)
            actions += _expand(inner_id, shapes, inner_bind, backend, notes, depth + 1, name)
            continue
        level = _value(step.get("level", "$level" if "level" in bindings else 100), bindings)
        colour = _value(step.get("colour", "$colour" if "colour" in bindings else None), bindings)
        transition = _value(step.get("transition", 0), bindings)
        hold = _value(step.get("hold"), bindings)
        actions.append(_set_action(level, colour, transition))
        delay = _hold_action(hold, step_floor, notes, where)
        if delay:
            actions.append(delay)
    repeat = _value(shape.get("repeat"), bindings)
    if repeat is not None and repeat != 1:
        count = _template(repeat, 1)
        actions = [{"repeat": {"count": count, "sequence": actions}}]
    return actions


def compile_shape(shape_id: str, shapes: dict, backend: dict) -> Compiled:
    if shape_id not in shapes:
        raise HouseError(f"fx: unknown shape {shape_id!r} — known: {', '.join(sorted(shapes))}")
    shape = shapes[shape_id]
    fields = dict(shape.get("fields") or {})
    bindings = {name: Ref(name) for name in fields}
    notes: list[str] = []
    needs = float((shape.get("needs") or {}).get("step", 0) or 0)
    step_floor = float(backend.get("envelope", {}).get("step", 0))
    if needs and needs < step_floor:
        notes.append(f"{shape_id}: asks {needs:g} s steps, {backend['name']} gives {step_floor:g}")
    actions = _expand(shape_id, shapes, bindings, backend, notes)
    notes = list(dict.fromkeys(notes))  # a stretched brick is said once per place, not per step
    return Compiled(shape_id, shape, fields, actions, notes, bool(shape.get("restore", True)))


def script(c: Compiled, house_label: str) -> dict:
    """The Home Assistant script for a compiled shape: target + the shape's
    fields, a snapshot, the steps, the snapshot put back."""
    fields: dict = {
        "target": {
            "name": "target",
            "description": "the light or the group (a room's role: light.<room>_<role>)",
            "required": True,
            "selector": {"entity": {"domain": "light", "multiple": True}},
        }
    }
    variables: dict = {}
    for name, default in c.fields.items():
        spec: dict = {"name": name}
        if name == "colour":
            spec["description"] = "#rrggbb — the target's own colour when empty"
            spec["selector"] = {"text": None}
        elif isinstance(default, bool):
            spec["selector"] = {"boolean": None}
        elif isinstance(default, int | float):
            spec["selector"] = {
                "number": {
                    "min": 0,
                    "max": 100 if name == "level" else 3600,
                    "step": 0.01,
                    "mode": "box",
                }
            }
        else:
            spec["selector"] = {"text": None}
        if default is not None:
            spec["default"] = default
        fields[name] = spec
        # the run's value, the shape's default when the caller gave none
        variables[name] = "{{ " + name + " | default(" + repr(default) + ") }}"
    variables["snapshot"] = "fx_{{ this.entity_id[7:] }}_{{ context.id | lower }}"
    if "colour" in c.fields:
        variables["colour_rgb"] = (
            "{{ [colour[1:3] | int(base=16), colour[3:5] | int(base=16), "
            "colour[5:7] | int(base=16)] if colour else none }}"
        )
    fields["restore"] = {
        "name": "restore",
        "description": "put the target back as it was, after",
        "default": c.restore,
        "selector": {"boolean": None},
    }
    variables["restore"] = "{{ restore | default(" + repr(c.restore) + ") }}"
    sequence: list = [
        {
            "action": "scene.create",
            "data": {"scene_id": "{{ snapshot }}", "snapshot_entities": "{{ target }}"},
        },
        *c.actions,
        {
            "if": [{"condition": "template", "value_template": "{{ restore }}"}],
            "then": [
                {"action": "scene.turn_on", "target": {"entity_id": "scene.{{ snapshot }}"}},
                {"action": "scene.delete", "target": {"entity_id": "scene.{{ snapshot }}"}},
            ],
        },
    ]
    return {
        "alias": f"fx — {c.id}",
        "description": (c.shape.get("summary") or c.id)
        + f" (La Régie, pack fx — {house_label}: a shape compiled for the ha backend)",
        "icon": c.shape.get("icon", "mdi:creation"),
        "mode": "parallel",
        "max": 10,
        "fields": fields,
        "variables": variables,
        "sequence": sequence,
    }


def compile_all(fx: dict | None, house_label: str) -> tuple[dict[str, dict], list[str], dict]:
    """Every enabled shape as a script: {script_id: script}, the notes, the backend."""
    fx = fx or {}
    shapes = load_shapes(fx.get("shapes"))
    backend = load_backend(fx.get("backend", "ha"))
    enabled = fx.get("enable") or sorted(shapes)
    scripts, notes = {}, []
    for shape_id in enabled:
        c = compile_shape(shape_id, shapes, backend)
        scripts[f"fx_{shape_id}"] = script(c, house_label)
        notes += c.notes
    return scripts, notes, backend
