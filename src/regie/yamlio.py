"""`yaml.safe_load`/`safe_dump` build a pure-Python loader/dumper on every
call, whether or not libyaml's C extension is sitting right there in the same
venv — V11 found two thirds of a render's eight seconds in that unused 8x.
Same SafeLoader/SafeDumper tags and rules; only the engine underneath moves."""

from __future__ import annotations

import yaml


def load(text: str):
    return yaml.load(text, Loader=yaml.CSafeLoader)


def dump(value, **kwargs) -> str:
    return yaml.dump(value, Dumper=yaml.CSafeDumper, **kwargs)
