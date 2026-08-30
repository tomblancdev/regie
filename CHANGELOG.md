# Changelog

## 0.3.1 (2026-08-30)

- the `no-environment` gate's hatch on Home Assistant's own backup agent id
  (`backup.local`, a real value by nature) was lost in 0.3.0's rewrite of
  `apply.py`: CI red for a name that names nobody — restored

## 0.3.0 — the things' integrations (2026-08-30)

A row that names an `integration:` becomes a config entry:

- **`regie apply`** walks one config flow per such row (`src/regie/flows.py`,
  the walker the MQTT entry now rides too): the flow started as a user
  would — or a discovered one continued when it is certainly this thing's
  (its unique id is the row's mac, or the domain's only one for the house's
  only row) — each form filled from the row (`host`, `mac`, the label) and
  the form's own defaults. **Keyed on the domain**: the API shows an
  entry's domain and title, never its address or unique id, so a domain's
  entries satisfy its rows in order and the integration's own unique id
  keeps a thing from being set up twice. Two new step states beside
  ok/changed: **`waiting`** (the thing did not answer — off, or not at that
  address yet; the flow is closed and tried again at the next apply, the
  converge does not fail) and **`by hand`** (a person is needed). What
  needs a person is read from the brain, never from a table of ours: the
  domains that take application credentials (`application_credentials/config`
  — a consent in a browser) and the forms with a `pin`/`pairing_code`
  field (the domain's own translations — a PIN read off a screen). Such a
  flow is never started by a converge: nothing makes a screen show a PIN
  to nobody. The step line carries the domain's `iot_class` when it is a
  cloud one: the dossier can say what stops without the internet
- **application credentials** created from the secrets `<domain>_client_id`
  + `<domain>_client_secret` for the OAuth domains the rows name, keyed on
  the domain and the client id
- **`regie link home.yml <thing>`** — the same walker with a person at
  hand: the PIN typed from the screen, the consent's address printed for a
  browser and the brain's callback awaited (`data_entry_flow_progressed`),
  then the entry
- the walk (`pair`, `suggest`) and `backup`/`restore`/`doctor` move to 0.4
- the rendered files no longer carry the engine's version in their header (the
  render manifest does): an engine bump whose templates did not change rewrites
  nothing and restarts nothing — found live at the first 0.3 converge (10 files
  rewritten, both services restarted, for a header)

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
