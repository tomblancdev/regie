# What is vendored here, and why

| file | project | version | sha256 |
|---|---|---|---|
| `easy-floorplan-card.js` | [nicosandller/easy-floorplan](https://github.com/nicosandller/easy-floorplan) (MIT) | **v3.1.0** (2026-10-17) | `f726aa67ca04a0ec5d458ca9843b1d62ce98e4a2d720dd6a1b523e1ca5249026` |

The card the Plan tab is drawn with (`floorplan.py`). It is carried by the
product, not fetched at converge and never through a store: a house renders
it into the brain's own `www/` and the frontend loads it through the same
`extra_module_url` seam as the skin — nothing is downloaded at runtime, and the
family's phones never call anyone.

Read once before vendoring (2026-09-03): the bundle names no host but GitHub in
two documentation strings, opens no fetch, socket or XHR of its own, and speaks
to Home Assistant only through the `hass` object every card is handed
(`callService`); it registers itself under `window.customCards`.

To bump: download the release asset, check its sha256 against the release,
replace the file, update this table and the changelog. The plan's grammar is
the house's (`plan:`), never the card's, so a breaking change upstream is a
renderer's problem and not a room file's.
