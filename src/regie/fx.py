"""Effects — shapes × backends. A SHAPE is protocol-free: steps of level,
colour, hold and transition, repeats, bricks composed with `use:`. A BACKEND
declares its ENVELOPE (the finest step it honours, what it cannot do) and
compiles a shape into what the brain runs. At 0.4 one backend exists, `ha` —
the generic light-service loop, the slowest rung; its numbers are a floor to
measure, not a promise. The per-protocol backends are folders with their
envelope written down and no compiler yet: a new protocol is a folder, never
a rewrite.

A shape's step says `$name` to read one of its fields at run time, and
`[lo, hi]` for a number drawn at run time inside those bounds — the leash on
the randomness that makes a strike or a flicker feel natural; a step that
`use:`s another shape binds that shape's fields to numbers, ranges or the
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


# ce que warm / neutral / cool veulent dire. La carte VIT ICI parce que c'est le
# vocabulaire des effets ; `house.py` l'importe, et une maison la surcharge par
# `fx.kelvin:`. Une seule vérité, un seul endroit.
KELVIN = {"warm": 2700, "neutral": 4000, "cool": 5500}


def _ct(raw, kelvin: dict, where: str):
    """`ct:` — une TEMPÉRATURE de couleur : un mot de la maison (fx.yml
    `kelvin:`), un nombre en kelvins, ou une plage tirée à l'exécution. Résolu
    ICI, à la compilation : un `$champ` devrait porter un MOT jusque dans le
    script, et aucune forme n'en a besoin — c'est refusé plutôt qu'à moitié
    supporté."""
    if isinstance(raw, str) and raw.startswith("$"):
        raise HouseError(f"fx: {where}: `ct:` prend un mot ou un nombre, pas {raw}")
    v = _value(raw, {})
    if isinstance(v, Range):
        return v
    if isinstance(v, str):
        if v not in kelvin:
            raise HouseError(
                f"fx: {where}: {v!r} n'est pas une température — "
                f"{', '.join(sorted(kelvin))}, ou un nombre en kelvins"
            )
        return int(kelvin[v])
    if isinstance(v, bool) or not isinstance(v, int | float):
        raise HouseError(f"fx: {where}: `ct:` prend un mot ou un nombre, pas {raw!r}")
    return int(v)


def _ct_note(value, backend: dict, notes: list[str], where: str) -> None:
    """Une température que le matériel n'atteint pas est DITE, pas laissée à
    l'ampoule à écrêter en silence : ces globes s'arrêtent à 4000 K, et
    `cool: 5500` a été demandé — et écrêté sans un mot — depuis W3a."""
    rng = (backend.get("envelope") or {}).get("ct_range")
    if not rng or isinstance(value, Range):
        return
    lo, hi = float(rng[0]), float(rng[1])
    if not lo <= value <= hi:
        notes.append(
            f"{where.rsplit(' step', 1)[0]}: {value:g} K demandés, "
            f"{backend['name']} atteint {lo:g}-{hi:g} K → l'ampoule écrête"
        )


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


class Range:
    """`[lo, hi]` in a shape — drawn at run time, inside the bounds the shape's
    author wrote: the leash on the randomness."""

    __slots__ = ("lo", "hi")

    def __init__(self, lo: float, hi: float):
        if hi < lo:
            raise HouseError(f"fx: a range reads [lo, hi], not [{lo:g}, {hi:g}]")
        self.lo, self.hi = lo, hi

    def __repr__(self) -> str:
        return f"[{self.lo:g}, {self.hi:g}]"


def _value(raw, bindings: dict):
    """A step's value resolved through the bindings: a number, a string, None,
    a Ref to an outer field, or a Range."""
    if isinstance(raw, str) and raw.startswith("$"):
        name = raw[1:]
        if name not in bindings:
            raise HouseError(f"fx: ${name} is not a field of this shape")
        return bindings[name]
    if (
        isinstance(raw, list)
        and len(raw) == 2
        and all(isinstance(x, int | float) and not isinstance(x, bool) for x in raw)
    ):
        return Range(float(raw[0]), float(raw[1]))
    return raw


def _expr(v, kind: str) -> str:
    """A value as a Jinja EXPRESSION for Home Assistant (bare, no braces):
    a constant, the script's field, or a draw inside a range — `time` in
    seconds (drawn in milliseconds), `int` a level or a count."""
    if isinstance(v, Ref):
        return v.name
    if isinstance(v, Range):
        if kind == "time":
            lo, hi = round(v.lo * 1000), round(v.hi * 1000)
            return f"((range({lo}, {hi + 1}) | random) / 1000)"
        return f"(range({int(v.lo)}, {int(v.hi) + 1}) | random)"
    if v is None:
        return "none"
    if isinstance(v, float) and v.is_integer() and kind == "int":
        return repr(int(v))
    return repr(v)


def _is_expr(v) -> bool:
    return isinstance(v, Ref | Range)


@dataclass
class Compiled:
    id: str
    shape: dict
    fields: dict  # name -> default
    actions: list  # Home Assistant actions
    notes: list[str] = field(default_factory=list)
    restore: bool = True


def _hold_action(hold, envelope_step: float, notes: list[str], where: str) -> dict | None:
    """A hold as a delay — clamped to the backend's step: at compile time for a
    number, at run time for a field or a range (the low end may sit under the
    floor; the shape asked for what feels right, the backend says what it
    honours — both are said)."""
    if hold is None:
        return None
    shape_name = where.rsplit(" step", 1)[0]
    if isinstance(hold, Ref):
        return {"delay": "{{ [" + hold.name + " | float, " + str(envelope_step) + "] | max }}"}
    if isinstance(hold, Range):
        if hold.lo < envelope_step:
            notes.append(
                f"{shape_name}: holds down to {hold.lo:g} s asked, the backend gives "
                f"{envelope_step:g} → the low end stretched"
            )
        return {"delay": "{{ [" + _expr(hold, "time") + ", " + str(envelope_step) + "] | max }}"}
    hold = float(hold)
    if hold < envelope_step:
        notes.append(
            f"{shape_name}: holds of {hold:g} s asked, the backend gives "
            f"{envelope_step:g} → stretched"
        )
        hold = envelope_step
    return {"delay": hold}


def _ambient_action(transition) -> dict:
    """`ambient:` — la pièce TELLE QUE L'EXÉCUTION L'A TROUVÉE, au milieu de la
    séquence : l'instantané remis. La scène est créée une fois en haut du script
    et détruite tout en bas, donc une forme peut l'appeler autant qu'elle veut —
    `scene.turn_on` ne la consomme pas et accepte une transition. C'est ce qui
    permet à un orage d'éclairer une pièce DÉJÀ ALLUMÉE : entre deux éclairs la
    pièce est elle-même, pas du noir."""
    a: dict = {"action": "scene.turn_on", "target": {"entity_id": "scene.{{ snapshot }}"}}
    if _is_expr(transition):
        a["data"] = {"transition": "{{ " + _expr(transition, "time") + " }}"}
    elif transition:
        a["data"] = {"transition": float(transition)}
    return a


def _set_action(level, colour, transition, kelvin=None) -> dict:
    """Un seul light.turn_on : le niveau et la transition en expression, puis UN
    descripteur de couleur — une liste rgb constante, le colour_rgb du script,
    une TEMPÉRATURE, ou rien. Un seul : le schéma de Home Assistant les met dans
    un même groupe `vol.Exclusive`, donc un pas qui en porte deux est refusé à
    la compilation plutôt qu'au moment où la lumière ne s'allume pas."""
    base = (
        "{'brightness_pct': "
        + _expr(level, "int")
        + ", 'transition': "
        + _expr(transition, "time")
        + "}"
    )
    if kelvin is not None:
        return {
            "action": "light.turn_on",
            "target": {"entity_id": "{{ target }}"},
            "data": "{{ dict(" + base + ", color_temp_kelvin=" + _expr(kelvin, "int") + ") }}",
        }
    if isinstance(colour, Ref):
        data_t = (
            "{% set d = " + base + " %}"
            "{% if colour_rgb %}{% set d = dict(d, rgb_color=colour_rgb) %}{% endif %}{{ d }}"
        )
    elif colour:
        rgb = "[" + ", ".join(str(int(colour[i : i + 2], 16)) for i in (1, 3, 5)) + "]"
        data_t = "{{ dict(" + base + ", rgb_color=" + rgb + ") }}"
    else:
        data_t = "{{ " + base + " }}"
    return {"action": "light.turn_on", "target": {"entity_id": "{{ target }}"}, "data": data_t}


def _expand(
    shape_id: str,
    shapes: dict,
    bindings: dict,
    backend: dict,
    notes: list[str],
    depth: int = 0,
    trail: str = "",
    kelvin: dict | None = None,
) -> list[dict]:
    if depth > 8:
        raise HouseError(f"fx: {shape_id} composes itself (a loop of `use:`)")
    shape = shapes[shape_id]
    kelvin = kelvin or KELVIN
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
            actions += _expand(inner_id, shapes, inner_bind, backend, notes, depth + 1, name, kelvin)
            continue
        if step.get("ambient"):
            for k in ("level", "colour"):
                if k in step:
                    raise HouseError(
                        f"fx: {where}: `ambient` est la pièce telle qu'elle a été trouvée, "
                        f"elle ne prend pas de {k!r}"
                    )
            actions.append(_ambient_action(_value(step.get("transition", 0), bindings)))
            delay = _hold_action(_value(step.get("hold"), bindings), step_floor, notes, where)
            if delay:
                actions.append(delay)
            continue
        if set(step) == {"hold"}:
            # un pas qui ne dit QU'UN `hold:` est une ATTENTE. Sans cette
            # branche il prenait `level: 100` par défaut : une attente était
            # inexprimable, et « attendre » est la chose la plus naturelle à
            # écrire au milieu d'une séquence.
            delay = _hold_action(_value(step["hold"], bindings), step_floor, notes, where)
            if delay:
                actions.append(delay)
            continue
        level = _value(step.get("level", "$level" if "level" in bindings else 100), bindings)
        colour = _value(step.get("colour", "$colour" if "colour" in bindings else None), bindings)
        transition = _value(step.get("transition", 0), bindings)
        hold = _value(step.get("hold"), bindings)
        ct = _ct(step["ct"], kelvin, where) if "ct" in step else None
        if ct is not None:
            if colour:
                raise HouseError(
                    f"fx: {where}: un pas dit une couleur OU une température, jamais les deux"
                )
            _ct_note(ct, backend, notes, where)
        actions.append(_set_action(level, colour, transition, ct))
        delay = _hold_action(hold, step_floor, notes, where)
        if delay:
            actions.append(delay)
    repeat = _value(shape.get("repeat"), bindings)
    if repeat is not None and repeat != 1:
        count = "{{ " + _expr(repeat, "int") + " }}" if _is_expr(repeat) else int(repeat)
        actions = [{"repeat": {"count": count, "sequence": actions}}]
    return actions


def compile_shape(
    shape_id: str, shapes: dict, backend: dict, kelvin: dict | None = None
) -> Compiled:
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
    actions = _expand(shape_id, shapes, bindings, backend, notes, kelvin=kelvin)
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
    # one snapshot scene per run, named by the clock: a script's variables know
    # `this` (the script's state) but no `context` - found live on the first
    # bulb (0.5.0: "'context' is undefined" and the run never started)
    variables["snapshot"] = "fx_{{ this.entity_id[7:] }}_{{ now().strftime('%Y%m%d%H%M%S%f') }}"
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
                {"action": "scene.turn_on", "target": {"entity_id": "scene.{{ snapshot }}"}}
            ],
        },
        # la scène part QUOI QUE DISE `restore` : elle était détruite dans la
        # branche restore seule, donc une forme `restore: false` laissait une
        # entité scene.fx_* derrière elle À CHAQUE exécution, pour toute la vie
        # du cerveau. Six formes finissent ainsi maintenant (fade, neon, dying,
        # drain, dawn, prime, powerdown).
        {"action": "scene.delete", "target": {"entity_id": "scene.{{ snapshot }}"}},
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
    kelvin = {**KELVIN, **(fx.get("kelvin") or {})}
    enabled = fx.get("enable") or sorted(shapes)
    scripts, notes = {}, []
    for shape_id in enabled:
        c = compile_shape(shape_id, shapes, backend, kelvin)
        scripts[f"fx_{shape_id}"] = script(c, house_label)
        notes += c.notes
    return scripts, notes, backend
