# Changelog

## 0.2.0 — the brain (2026-08-29)

The brain runs, and what only its API can set is set from the file:

- **`regie up`** — the rendered brain on this host (profile `ct`): units
  placed under systemd, images pulled when absent, a service restarted when
  its unit or its rendered files changed since the last `up`, started when
  it is not running, a unit the house no longer renders stopped and
  removed; the pinned custom components the house asks for fetched and
  verified by digest (`auth_oidc` v1.2.1 for the OIDC door); `--check`
  prints the plan
- **`regie apply`** — the conductor, first release: the first boot (the
  owner account from `owner:`, the core config, analytics off), the
  long-lived tokens the house names (`tokens:`, root-only under
  `<root>/.regie/tokens/`; the conductor's own re-minted by the owner's
  password if lost), floors and areas (keyed on the house's id kept as an
  alias), the MQTT integration, the backup schedule (`backup:`, encrypted);
  `--check` prints the plan. Two new secrets: `owner_password`,
  `backup_password`
- **the sketchpad is closed** — `automations.yaml`, `scenes.yaml`,
  `scripts.yaml` are rendered empty at every render: automations are
  packages (read-only in the UI by Home Assistant's own rule); a draft saved
  in the UI works until the next render
- **the schema** gains `owner`, `backup`, `tokens`, `floors`,
  `paths.units_dir`, and `oidc.features` / `oidc.claims` passed to the
  component as is
- **role `brain`** built: the house handed over, `check` → `render` → `up`
  → `apply`, secrets through the environment, `changed` read from the
  engine's own counts; `render --out` defaults to the house's root
- `backup` / `restore` / `doctor` move to 0.3


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
