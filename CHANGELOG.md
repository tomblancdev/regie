# Changelog

## 0.1.0 — the seams (2026-08-29)

The first release fixes the shape, so what comes later is added and never
rewritten:

- **the schema** (`schema: 1`) — a house is `home.yml`: areas, people,
  things (`kind` and `via` are open vocabularies), the radios, the door;
  the packs' fragments are merged before validation
- **the engine** — `check` (validate, cross-check, the plan), `render` (the
  units and the config tree, marked so a later render prunes what the house
  no longer names), `mint` and `init`; `up`, `apply`, `backup`, `restore`,
  `doctor` (0.2) and `pair`, `suggest` (0.3) declared, each naming its release
- **profile `ct`** — a Debian-like host with podman + systemd: Quadlet units on
  host networking, one root; tested against Home Assistant 2026.8.3,
  Mosquitto 2.0.22, Zigbee2MQTT 2.13.0
- **pack `lighting`** — a light group per room, motion lights, "a thing went
  silent", the phone's room cards; a house's own packs load the same way
- **the witness house** (`examples/maison-temoin`) — five rooms, one thing
  of every kind, rendered on every commit
- **the collection `tomblancdev.regie`** — the fleet driver: role `engine`
  (the CLI on a host, from this tag); role `brain` as a contract for 0.2
- the image (`ghcr.io/tomblancdev/regie`), the family mark, MIT
