"""La Régie — a smart home as files.

One engine owns both halves of a Home Assistant brain from one
schema-validated ``home.yml``: the *files* half (the units and the config
tree it renders) and the *API* half (what only Home Assistant's and
Zigbee2MQTT's APIs can set — the conductor). Profiles say where a brain
runs; packs say what it does. See README.md.
"""

from importlib.metadata import PackageNotFoundError, version

try:
    __version__ = version("regie")
except PackageNotFoundError:  # a checkout run without an install
    __version__ = "0+unknown"
