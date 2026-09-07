"""The engine reads the component's own modules (0.42, the audit's V8a).

The product's component (`base/components/regie/`) ships INTO the brain as
files; two of its modules are pure arithmetic that both sides must agree on
to the byte — the walker's legs and the palette's draw. The rule H51 settled:
**the engine imports the component's arithmetic, not the reverse.** The day's
draw is written once, in the file the brain runs; `regie palette`, the render
and the tests read that same file.

Loaded from its PATH, never as `regie.base.components.regie.<name>`: the
component is data the render copies, there is no package under `base/`, and a
module that imported the engine could not run inside Home Assistant. Same
loader as a pack's hooks (packs.py), same rule — the arithmetic imports
nothing of ours and nothing of Home Assistant's.
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

from .errors import HouseError

HERE = Path(__file__).parent / "base" / "components" / "regie"
_LOADED: dict[str, object] = {}


def module(name: str):
    """One of the component's arithmetic modules, imported once."""
    if name in _LOADED:
        return _LOADED[name]
    file = HERE / f"{name}.py"
    full = f"regie_component_{name}"
    spec = importlib.util.spec_from_file_location(full, file)
    if spec is None or spec.loader is None:
        raise HouseError(f"the component's {name}.py is not a Python module ({file})")
    mod = importlib.util.module_from_spec(spec)
    # named in sys.modules before it runs: a dataclass looks its own module up
    # while it builds the class (Python 3.13)
    sys.modules[full] = mod
    try:
        spec.loader.exec_module(mod)
    except Exception as exc:  # pragma: no cover - a broken component is a build error
        del sys.modules[full]
        raise HouseError(f"the component's {name}.py does not import — {exc!r}") from exc
    _LOADED[name] = mod
    return mod
