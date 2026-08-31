# Changelog

## 0.6.1 — settings live in Réglages alone (2026-08-31)

With `controls.panel` on, the house card (the rooms view) keeps only the
mode and the two signals — the four period times no longer duplicate there:
a setting has one home, the Réglages view.

## 0.6.0 — the family's controls (2026-08-31, W3b)

Four asks from the house's owner, one block: `controls:` — every autonomous
piece explicit, every one with an off-switch a person can reach.

- **`panel`** — the settings view (« Réglages » on the phone dashboard):
  each room's default LOOKS become selects the family edits with a simple
  form — one per daylight (`dark` / `dim` / `bright`) and one per period
  whose first choice is **`sun`** (= follow the sun, no override). Seeded
  once from the files (the knob pattern), the UI owns them after; the
  room's default sensor reads the selects. Needs daylight-first defaults
  (H34); a partial period map cannot ride a form — `check` says so
- **`presence`** — the phones drive home/away: last one leaves (zone.home
  = 0, five quiet minutes) → `away`; first one back → `home`; only ever
  between those two, and only while the visible kill-switch
  (`input_boolean.presence_drives_mode`, seeded on) is on
- **`restore_default`** — a light coming back from power (the wall switch,
  an outage) takes its room's **default look**, never its last state
- **`silent: false`** — the "ne répond plus" alerts hushed (the notify
  story is a later choice); on by default in the product
- the Zigbee walk moves to 0.7

## 0.5.2 — a default is a look, a mode may be a pure flip (2026-08-31)

The house's first lived-in morning (three bulbs, one 06:30) re-cut the
vocabulary's top layer. Two rules, from the owner's own words:

- **defaults are LOOKS, daylight-first (H34)** — a room's `defaults:` may
  now put `dark` / `dim` / `bright` at the top level: the base the sun
  drives through the year with nothing to edit; period keys override their
  stretch of the day (a scene, or a partial daylight map riding the base).
  The period-first form stays valid. And a default may not light nothing:
  `off`, or a scene whose every look is off, is **refused** by `check` — a
  default is what "on" *means* when someone acts; a person's off is the
  switch or the mode, never the clock
- **`scene: none` on a mode (H35)** — entering it is a pure state flip: no
  automation renders, no light is touched (`home` = ending `away`, the
  auto-alarm's hook); `follow` still counts such a mode (it has no opinion
  to fight) — the following set is computed in the engine now (modes whose
  scene is `default` or `none`), not in the template
- the witness's night scenes became looks (a 5 % glimmer, never all-off)

## 0.5.1 — a release carries its own pin (2026-08-30)

The v0.5.0 tag's collection still said `regie_version: v0.4.1` in role
`engine`'s defaults — a fleet pinning the tag **downgraded its brain's
engine** to 0.4.1 (found live: the pin converge refused the very rooms the
overlay run had just laid). The release step that was missing, written
down: a tag bumps `pyproject.toml`, `ansible/galaxy.yml` *and* the engine
role's default `regie_version`, together. No code change.

## 0.5.0 — the Matter pack, and the walk's Matter half (2026-08-31)

A Matter thing over Wi-Fi needs no coordinator: the server beside the brain
and a phone commission it, the engine adopts it. So the walk's Matter half
lands before its Zigbee half (0.6), and with it the row every network thing
was missing — its room.

- **pack `matter`** — the Matter server (matter.js's `matterjs-server`, the
  successor of python-matter-server, archived 2026-06) as a unit of profile
  `ct`: host networking, `/data` under the root owned by the image's uid,
  the websocket and the dashboard on the loopback only
  (`LISTEN_ADDRESS=127.0.0.1` — the brain dials `ws://localhost:5580/ws`,
  nobody else has a door; Matter itself binds the host's interfaces on its
  own); pinned **1.3.3**, the line of the client library Home Assistant
  2026.8 pins (`matter-python-client` 1.3.0). The brain's unit waits for it.
  Matter runs over IPv6 on the brain's own link (link-local is enough for
  Wi-Fi things) and mDNS: the host must let both reach the brain — the
  engine cannot do that for it, `check` says so with the pack
- **the conductor makes the `matter` entry** on the loopback, keyed on the
  domain (one server); a server that does not answer is `waiting`, tried
  again next time — never a fault
- **`serial` on a thing's row** — a Matter thing's key: its BasicInformation
  serial number, the one identifier that survives a rebuilt fabric (node
  ids are the fabric's)
- **a device's room** (`apply`, step `device <thing>`): a row's Home
  Assistant device found by its serial (Matter) or its hardware address (a
  `mac` — the TV, the receiver…) is placed in the row's area and named by
  its label; the entity of the thing's own domain is renamed to the
  house's id (`light.<thing>`) when the row is one device with one such
  entity — so a scene or an effect written by role reaches a bulb the
  moment its row exists. A box that is several devices to Home Assistant
  (a TV: cast + remote) is roomed and named twice, renamed never. A row
  whose device is not there yet is skipped in silence
- **`regie pair home.yml --matter --room <area> [--role --at] [--code]`** —
  the walk's Matter half. The commissioning is the phone's (a fresh thing:
  Bluetooth, the phone puts it on the Wi-Fi, the brain's fabric takes it —
  Home Assistant's own way) or the code's (`--code`: a thing another
  controller shares, or one already on the network — the server
  commissions it over IP, no phone). Then the freshest node the house does
  not name is adopted: vendor, model, serial, its hardware address from the
  node's diagnostics, its kind from its entities — into a **proposed row**
  printed for the house file (`<room>_<role>[_<at>]`, else
  `<room>_<kind>_<n>`). Nothing is written by the engine: the row goes
  where the house keeps its rows, `apply` rooms and names from it. Two
  fresh nodes: say which (`--serial`)
- **profiles declare their `dirs`** (a path under the root, an `owner`
  among the profile's users, a `when`) — `up` makes them before the first
  start and chowns them when root; **`when: pack:<name>`** on a profile's
  template or dir renders it only when the house carries that pack
- **house `matter.only_fabric: true`** — the brain is a thing's only
  controller: `apply` removes every other fabric it finds on a node the
  house names (the phone's commissioning stack leaves a *Google LLC* fabric
  on every bulb it pairs; a vendor's app would leave its own) — said in the
  step, idempotent. `pair --only-fabric` does the same once, at adoption
- a Matter node that reports **no serial number** (a Govee H6008 does not)
  is keyed on the hardware address its diagnostics report: the row carries
  `mac`, `apply` finds the device through the node's diagnostics
- **fx: a run never started** — the snapshot scene was named with
  `context.id`, and a script's variables know `this` but no `context`
  (found on the first bulb: *'context' is undefined*); named by the clock
  now (`now().strftime(...)`), one scene per run as before
- the Zigbee walk (`pair --room` alone, `suggest`), `backup`, `restore`,
  `doctor` move to 0.6

## 0.4.1 — effects that feel natural (2026-08-30)

Tom, on 0.4.0's strike: *"2 secs for a stroke is really a lot … random
times and light, not too much random, it should keep a stroke logic … a
glitch effect like a glitching neon … push to the limits of the ms."*

- **the `ha` backend's floor is 0.05 s**, not 0.2: Home Assistant's own
  engine honours a 50 ms delay and a `turn_on` returns once the integration
  has sent its message — the radio underneath is the real floor (the
  per-protocol envelopes, measured at the bench, take over when the
  compiler picks a backend per target). 0.4.0's 0.2 was a guess that
  stretched every stroke into a metronome
- **ranges in the shape language** — any number in a step may be `[lo, hi]`
  (a hold, a level, a transition, a repeat count), drawn at run time by the
  script inside those bounds (`range(60, 121) | random`, milliseconds for a
  time); the shape is the logic, the width of each range is the leash; a
  range whose low end sits under the floor is clamped at run time and said
  in `check` (*holds down to 0.04 s asked, the backend gives 0.05 → the low
  end stretched*)
- **`strike` rewritten as a stroke**: a leader flash (60–120 ms), a dark gap
  (40–100 ms), one to three after-flickers at 20–50 % (40–90 ms), the return
  stroke at 70–100 % (80–140 ms), a tail fading out over 0.3–0.8 s — ≈
  0.5–1.5 s in all, two runs never the same
- **new bricks**: `lightning` (a storm — 3 to 6 strikes with 2–9 s of dark
  between), `flicker` (random short on/off at random levels — a faulty
  contact), `glitch` (a glitching neon — bursts of flicker, dark between),
  `neon` (a neon starting up: stutters, then on — `restore: false`), `fire`
  (a flame — warm levels wandering 40–90 % with 100–300 ms ramps, one
  message per step: a budget question on Zigbee, a program elsewhere later)
- none of it has run on a light yet: the bench at the walk writes the real
  floors into the envelopes

## 0.4.0 — the skeleton: the vocabulary by role (2026-08-30)

The house's standard library, buildable before a single bulb exists — a
mode machine, signals, scenes, effects and stories rendered on a brain with
zero lights, filled by the walk later. Five words, one pack each; one file
holds one thing.

- **`role`** on a thing's row — what it is FOR in its room (`main`, `accent`,
  `lamp`, `strip`, `night`, `shelf`, `console`, `screen`, `speaker`,
  `satellite`, `motion`, `door`…; open, like `kind`) — and **`at`**, its place
  in the role's layout (`front_left`, `row_3`); a role couples a scene to a
  purpose, not to a device, so the room files are written now and survive a
  bulb's replacement. A room declares its roles (`roles:` — a label, a
  `layout` for a ceiling of many lights); a role nothing fills renders
  nothing and `check` lists it as a hint, never an error
- **`aliases`** on areas and things — what people say; the conductor pushes
  them to Home Assistant's area aliases beside the id, and **adopts an area
  by alias**: a room whose id changes (`salon` → `living_room`) keeps its
  Home Assistant area and its things, nothing is duplicated
- **`include:`** — an engine feature: `rooms: rooms/*.yml` (one file per
  room, merged into the area of the same id or appended), `modes: modes.yml`,
  `fx: fx.yml`, `scenarios: scenarios/*.yml` (one story per file), relative
  to home.yml; each file validated on its own first so a fault names the
  file; a literal path must exist, a glob may match nothing
- **pack `signals`** — `sensor.house_period` (the last period boundary
  passed today, from **four times the family edits in the UI**:
  `input_datetime.house_period_<period>`, re-read every minute),
  `sensor.daylight` (`dark · dim · bright` from the sun's elevation, the
  thresholds in modes.yml), `binary_sensor.night`, `house_occupied` (off in
  a mode that says `away: true`), `house_quiet` (a mode that says `quiet:
  true`), `<room>_occupied` wherever a room has a motion thing — a signal
  that cannot be measured is absent, never "off"
- **pack `modes`** — `input_select.house_mode` from modes.yml, one automation
  per transition (the mode → every room → its scene: the mode's `scene`,
  `default`, `off`, the room's own line, or `else`), the **clock rules** (a
  period's beginning moves the mode, only from the modes named), the
  **defaults that follow** (a lit room takes its new default when the period
  or the daylight changes, in a mode whose scene is `default`); the house
  card on the phone: the mode, the period, the daylight, the four times
- **pack `scenes`** — `script.<room>_<scene>` per scene by role once a role
  it names is filled (`brightness`, `ct: warm|neutral|cool|<kelvin>`,
  `color: #rrggbb`, `transition`; a light role aims at its group
  `light.<room>_<role>`, a switch role at its things), `off` implicit (every
  filled light or switch role off — a screen or a speaker goes off only when
  a scene names it),
  `script.<room>_default` + `sensor.<room>_default` = the scene "on" means
  now, per period × daylight (`defaults:` in the room file)
- **pack `fx`** — `shapes/` are the bricks (`flash · fade · pulse · blackout ·
  strike`, composed with `use:`; a step says `$field` to read the script's
  field at run time), `backends/` the compilers with their **envelope**
  (`ha` compiles: the generic light-service loop, its 0.2 s step a floor to
  measure; `zigbee`, `wled`, `yeelight`, `matter` carry their numbers, read
  at the source, and no compiler yet); `script.fx_<shape>` with `target` +
  the shape's fields — snapshot (`scene.create`), the steps, the snapshot
  back (`scene.turn_on` + `scene.delete`); every hold under the backend's
  step is stretched **and said** in `check`, a runtime hold clamped
- **pack `notify`** — the mouth: `script.tell` (message, title, severity —
  a persistent notification always, the phones unless `house_quiet` is on or
  the severity is alarm); `notify.household` and `notify.<person>` from the
  people's **`phone:`** (the companion app's slug)
- **pack `scenarios`** — a story file (`steps:` of `mode` · `scene:
  room/scene` · `fx` · `wait` · `tell`) → `script.scenario_<id>`
- pack `lighting`: **one light group per role** (`light.<room>_<role>`) and
  per layout row (`light.<room>_<role>_<prefix>` once two of its places are
  filled), beside the room's
- the conductor: **the knobs** — the periods' times and the first mode are
  seeded ONCE per brain from the files, and the UI's value is read, compared
  and kept after (`knob house_period_morning: 07:00 — set from the UI (the
  file says 06:30), kept`); the conductor keeps its own memory of the seed
  (`<root>/.regie/knobs.json`) because a fresh helper does not read
  `unknown` — a time helper starts at 00:00, a select at its first option
  (found live: four boundaries at 00:00 made the period `night` and the
  clock rule moved the house to night); the engine renders no `initial:` on
  a helper, which would reset it at every restart
- `check` reports the vocabulary: the modes, the periods, the clock, each
  room's roles (filled / waiting), its scenes and the scripts they render,
  the fx backend and every stretch, the stories, the files included — and
  `hints:` beside `warnings:` (`--strict` fails on warnings only)
- the witness house grows: room files, modes.yml, fx.yml, a story, roles on
  its things, a 12-place ceiling; rendered, then `check_config` in Home
  Assistant 2026.8.3 clean
- read at the source while building: a script field's selector is written
  bare (`text:`), `text: {}` is refused; YAML 1.1 reads a bare `off` as
  false — the schema takes both; `input_datetime`'s `initial` overrides the
  restored value at every start
- the walk, `backup` / `restore` / `doctor` move to 0.5

## 0.3.5 (2026-08-30)

- a test's expectation corrected (a second row of a single-entry domain is
  served by the first's entry: `ok`, not `changed`) — 0.3.4 shipped with it red
  because a `pytest | tail` pipeline reports `tail`'s status; the release
  chain reads pytest's own now

## 0.3.4 — a box that is several things (2026-08-30)

- **`integration:` takes a list** — one config entry per domain named: a
  receiver is `[heos, denonavr]` (the music view and the amplifier's own
  inputs, sound modes, zones), a TV `[androidtv_remote, cast]` (the remote
  and the screen things are sent to); the step lines read `entry <thing>
  (<domain>)`; `regie link <thing>` walks every domain of the row that has
  no entry yet and skips the ones that do

## 0.3.3 — the brain's own door for a consent (2026-08-30)

- **`house.my: false`** — Home Assistant's oauth2 helper sends every consent
  through `my.home-assistant.io` whenever the `my` integration is loaded, and
  `default_config` has no "minus one"; a house that wants its own door as the
  callback (`<url>/auth/external/callback`, what a vendor's app registers)
  renders `default_config`'s members written out without `my` (the list the
  product pins in `base.yml`, read from the manifest at the tested version)
- the client sends **`HA-Frontend-Base: <house url>`** — the header the
  frontend sends and the one Home Assistant builds that callback from when
  `my` is absent (`regie link` answered "No header in request" without it)

## 0.3.2 (2026-08-30)

- the `no-environment` gate's hatch on Home Assistant's own local backup
  agent id (a real value by nature) was lost in 0.3.0's rewrite of `apply.py`,
  then landed on the wrong line under the formatter in 0.3.1: CI red twice for
  a name that names nobody — the hatch sits on the value's own line now, and
  the gate runs after the formatter

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
