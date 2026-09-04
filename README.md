<p align="center"><img src="ui/static/logo-animated.svg" alt="la régie — house as code" width="640"></p>

# La Régie

**A smart home as files.** One `home.yml` says what the house is — the
rooms, the people, the things and how each is reached — and one engine lays
the brain down from it: Home Assistant, Mosquitto and Zigbee2MQTT as pinned
containers, their whole configuration rendered, and (from 0.2) what only
their APIs can set — the onboarding, the integrations, the registries, the
Zigbee names, groups and bindings. Rendering twice changes nothing; a
rebuilt brain with the same file and the same secrets is the same house,
and the same Zigbee network — nothing re-pairs.

It is built for *every* house, along two axes that have to be there from
the first commit or never are:

- **profiles** — where a brain runs. The engine assumes a Debian-like host
  with podman and systemd, nothing more: `ct` (an LXC container, a VM, a
  mini-PC — Quadlet units, host networking) now; `pi`, `docker` later.
- **packs** — what a house does. A pack is a folder: the services it
  brings, the templates it instantiates from the things, the schema fields
  it adds, its tests. `lighting` now; `presence`, `energy`, `security`,
  `media`, `voice`, `matter`, `cameras` the day a need names them. **A house
  adds its own packs** from a directory of its choosing — the same loader,
  the same shape — so what must stay private never enters this repo.

The **schema is the contract** (`schema: 1`, [`home.schema.json`](src/regie/schema/home.schema.json)):
`kind` and `via` are open vocabularies — an unknown value is a warning,
never an error, so a new use case is a pack, not a schema bump. Labels come
from a table per language ([`labels/`](src/regie/labels)); the same dashboard
prints in the family's words in any house.

## What it does

| Verb | Does | Since |
|---|---|---|
| `regie check home.yml` | validates the schema (the packs' fragments merged, the included files first so a fault names the file), cross-checks every reference, prints the plan: the radios, the broker's users, the secrets it needs, what is not paired yet — and since 0.4 the vocabulary: the modes and periods, each room's roles (filled / waiting), its scenes and the scripts they render, the effects' backend and every stretch, the stories; `hints:` beside `warnings:` | 0.1 · 0.4 |
| `regie render home.yml --out DIR` | writes the units (the profile's) and the config tree (the base's and the packs'): Home Assistant's `configuration.yaml`, packages and dashboard, Mosquitto's conf/ACL/passwd, one Zigbee2MQTT instance per radio with its devices and room groups. Marks what it writes, prunes what the house no longer names, never touches what it did not write; files that hold a secret are `0600` | 0.1 |
| **the vocabulary** (0.4) | five words, one pack each, written **by role** before a single bulb exists and filled by the walk: **signals** (`house_period` from four times edited in the UI, `daylight` from the sun, `night`, `house_occupied`, `house_quiet`, `<room>_occupied`), **modes** (`input_select.house_mode`, a transition per mode, the clock rules, the defaults that follow), **scenes** (`script.<room>_<scene>` by role, with a `label`, an `icon` and `tags:` of its own; a look may name the **places** inside a role — its `layout:` words, or a prefix several of them share — and `run:` gives a look something that MOVES while it holds; `<room>_default` = what "on" means now per period × daylight), **fx** (`script.fx_<shape>`: shapes are bricks — `flash · fade · pulse · blackout · strike · lightning · flicker · glitch · neon · fire`, any number a `[lo, hi]` drawn at run time — backends compile them at the protocol's resolution and say what they stretch), **notify** (`script.tell`, the mouth), **scenarios** (a story file → a script). `include:` brings the small files in — `rooms/*.yml`, `modes.yml`, `fx.yml`, `scenarios/*.yml` | 0.4 |
| **the dashboard** (0.10) | **the descent**, generated from the rooms' files: one page per rung — the house · a room · a group of lights · a place inside it — and the last rung is Home Assistant's own light panel. *A page answers one question and offers one way on; a step with one way on is not a step*: a room whose single role holds every light it has does not draw that role, and a group of two or three bulbs is drawn where it stands instead of earning a page. One row does two things (the icon toggles, the row walks down, the bar dims). What a room's page shows is **declared**: the looks its file marked `pinned`, and nothing else — every other look waits one tap away. Its cog opens the room's own settings: the defaults, the kill-switches, and the **health** of its things (`sensor.<room>_offline`) | 0.10 |
| **the plan** (0.13) | `plan:` — the flat drawn from declarations: the house gives the frame (`size`, centimetres) and a drawing to lay under the walls; every room gives its outline, its doors and windows on it, and where each thing hangs, by role and by place. One tab, drawn with easy-floorplan (vendored, `base/www/VENDOR.md`), registered by `apply` as a Lovelace resource — never an extra module, which races the app's registry polyfill: a badge per placed thing, the bulb's own colour pooled on the plan, a room tinted by its motion sensor, holding a room opens its page. **`regie look --room <id>`** writes a look tried on the real ceiling in the house's grammar, ready to paste under `scenes:`. **The workbench** (0.14): `apply` opens « L'Atelier du plan », a storage dashboard seeded once with the card, for the card's own drag-and-drop editor; **`regie plan pull`** writes the draft back into the room files' `plan:` blocks and nothing else, **since 0.16 the draft follows the files at every converge** unless it holds edits not yet pulled — then the converge says so and keeps them (the conductor remembers what it last seeded, `.regie/plan-seed.json`, and compares the way the pull reads, never on the editor's re-minted ids); **`regie plan push`** re-seeds the draft from the files regardless | 0.13 · 0.14 · 0.16 |
| **the skin** (0.10 · a library at 0.11) | `house.theme` — a palette in the house's own words (`ground · panel · edge · ink · ink_soft · accent · lit · alert`) plus the geometry that carries as much of the feel (a card's radius, a tile's icon radius, the height of a feature bar), mapped onto the frontend's own variables with separate light and dark modes; `apply` makes it the default for both. **`use:` picks one of the themes the product carries** — `nuit` (soft dark, no borders, Manrope), `verre` (translucent over a glow) or `atelier` (painted steel) — and anything beside it overrides that theme, palettes merging key by key. The typefaces ride **inside the brain** — a theme may name a family but not load one — as one ES module of `@font-face` rules with the data inlined, so nothing is fetched at runtime | 0.10 · 0.11 |
| `regie mint home.yml` | writes every secret the house needs and does not have yet (a Zigbee network key, the broker's passwords…) — into *your* store, whatever it is | 0.1 |
| `regie init DIR` | a starter house and its secrets, in an empty directory | 0.1 |
| `regie up home.yml` | the rendered brain running on this host (the profile's runtime): units placed, images pulled when absent, a service restarted when its unit or its files changed, the pinned custom components fetched and verified by digest; `--check` prints the plan | 0.2 |
| `regie apply home.yml` | **the conductor**: what only the API can set — the first boot (the owner, analytics off), the long-lived tokens the house names, the reverse proxy it trusts, floors and areas (with what people say for them; a room whose id changed is adopted by its old id, now an alias), the knobs the files seed once (the periods' times, the first mode — the UI's value kept after), the backup schedule, **one config entry per thing that names an `integration:`** (the broker rides the same walker; a box that is several things to Home Assistant lists them — `integration: [heos, denonavr]`) and the application credentials the OAuth ones take (secrets `<domain>_client_id` + `<domain>_client_secret`). Declarative, idempotent, keyed on names that survive a rebuild; `--check` prints the plan. A flow that needs a person — a PIN on a screen, a consent in a browser, read from the brain itself — is never started by a converge: the line says `by hand: regie link <thing>`; a thing that does not answer is `waiting`, tried again next time. Since 0.7 it also makes the **mesh** match the rows: every thing wears its id, every room with Zigbee lights has its group holding exactly its lights, every `bind:` is a binding inside the mesh (a binding the house does not name is removed only when its target is ours; a thing paired with no row is reported, never removed). Since 0.8 it introduces the **Thread border router** to Home Assistant (the `otbr` entry, pointed at the box's own REST API) — but **only while the router is already holding the house's network**: the flow mints a network of its own on a router holding none, so a reset box `waits` rather than becoming a Thread network nobody can reproduce | 0.2 · things 0.3 · the mesh 0.7 · Thread 0.8 |
| `regie link home.yml <thing>` | one thing's integration with a person at hand: the PIN typed from its screen, the consent's address printed for a browser and the brain's callback awaited — then the entry, the same walker. A consent comes back through `my.home-assistant.io` (Home Assistant's default) unless the house says `house.my: false` — then the brain's own door is the callback (`<url>/auth/external/callback`, the address a vendor's app registers) and `default_config` is rendered without `my` | 0.3 |
| `regie backup` / `restore` / `doctor` | Home Assistant's own backup through its API; the brain's health, the pins against the tested ones, what drifted | 0.8 |
| `regie pair home.yml --room <area> [--role <role> --at <place>]` | **the walk's Zigbee half**: the room is the session — the join window opens on the radio, a person holds the thing's reset button, and the thing introduces itself. Its kind is read from its own interview (the `exposes` list), its vendor and model come with it, the name is generated, and the **row is printed, never written**; a control that can send commands is proposed bound to its room, a light blinks and ends dark. The window is closed again whatever happens. `--adopt <address>` takes a thing already in the mesh (an interrupted walk), `--time` shortens the window, `--coordinator` picks the radio | 0.7 |
| `regie pair home.yml --matter --room <area> [--code <code>]` | **the walk's Matter half**: the thing commissioned by the phone (a fresh one — Bluetooth, the phone puts it on the Wi-Fi) or by a code the server commissions over IP, then adopted into a proposed row keyed on its serial; `apply` rooms and names the device from the row | 0.5 |
| `regie suggest` | the mesh's opinion on rooms, from link quality — suggests, never assigns | 0.8 |

Secrets are **values** the engine is handed (`--secrets FILE`, or
`REGIE_SECRET_<NAME>`); it never knows the store. sops, age, a password
manager, a `.env` — the house's business.

## Try it on the witness house

```sh
pip install git+https://github.com/tomblancdev/regie@v0.2.0
regie check  examples/maison-temoin/home.yml --secrets examples/maison-temoin/secrets.example.yml
regie render examples/maison-temoin/home.yml --secrets examples/maison-temoin/secrets.example.yml --out /tmp/brain
```

or with nothing installed:

```sh
podman run --rm -v "$PWD:/house" ghcr.io/tomblancdev/regie check /house/home.yml
```

[`examples/maison-temoin`](examples/maison-temoin) is five rooms on two
floors, one thing of every kind, two people, the product's packs and one of
the house's own, four room files, a modes file, a story — rendered and
validated on every commit (and `check_config`'d in the pinned Home
Assistant before a release). It is the
documentation and the smoke test at once. Its addresses are the RFC
documentation reserves: it describes nowhere.

## How it is meant to work, in a house

1. `regie init` (or copy the witness), edit `home.yml`: the rooms, the
   people, the radio's address, the door (`oidc:` if you have a provider —
   without it, Home Assistant's own login), the owner account, the packs.
   Then the small files it `include:`s — one per room (`rooms/<room>.yml`:
   its label, what people say, its **roles** and its scenes **by role**,
   what "on" means per period and daylight), `modes.yml`, `fx.yml`, one
   story per file — written before any bulb exists.
2. `regie mint` → put the secrets in your store.
3. `regie render --out /srv/home` on the host, `regie up` → an empty brain
   with its units, its broker, its Zigbee instance. `regie apply` → its
   people, its integrations, its dashboards.
4. `regie pair --room living --role main` → walk the room; the rows appear
   with their role; everything written by role lights up at once.
5. Every later change is a line in `home.yml`, a `render`, an `up`, an
   `apply`. Automations are packages, read-only in the UI by Home
   Assistant's own rule; `automations.yaml` is rendered empty every time —
   a draft saved there from the UI lives until the next render.

A **fleet** runs the same verbs from a converge through the ansible
collection [`tomblancdev.regie`](ansible) — role `engine` installs the CLI
from this tag, role `brain` hands the house over and runs the verbs. Both paths go
through the same code, so the fleet never has a feature the house lacks.

## Layout

| Part | What | Where |
|---|---|---|
| the engine | `check` · `render` · `up` · `apply` · `link` · `mint` · `init` — the include merger, the fx compiler — and the verbs declared for 0.5 | [`src/regie/`](src/regie) |
| the schema | the contract every house writes to | [`src/regie/schema/`](src/regie/schema) |
| the base | the config tree every profile renders, the dashboard's descent (`dash.py`) and the skin (`theme.py`, `base/fonts/`) | [`src/regie/base/`](src/regie/base) |
| themes | the skins the product carries — `nuit` · `verre` · `atelier` | [`src/regie/themes/`](src/regie/themes) |
| profiles | `ct` — Quadlet units, host networking | [`src/regie/profiles/`](src/regie/profiles) |
| packs | `lighting` — room groups (+ per role, per layout row), the rooms that sense (0.17: one automation per room on its occupancy, the look of the hour when `<room>_dark` says so, off only what the sensors lit, a switch and a pin per room), silent alerts, the room's health sensor · the vocabulary: `signals` (+ `<room>_dark` and the occupancy's hold, 0.17) · `modes` · `scenes` (+ the room's look memory, 0.17) · `fx` (shapes/ the bricks, backends/ the envelopes) · `notify` · `scenarios` · `when` (0.18: a thing's state, or the house's mode, picks a look, a mode or a story — one automation per thing, a switch each; the verbs in `verbs.py`, rendered once) | [`src/regie/packs/`](src/regie/packs) |
| labels | the family's words, per language | [`src/regie/labels/`](src/regie/labels) |
| the witness | `maison-temoin` | [`examples/`](examples) |
| the collection | `tomblancdev.regie` — the fleet driver | [`ansible/`](ansible) |
| the image | `ghcr.io/tomblancdev/regie` | [`Containerfile`](Containerfile) |

## This repo carries no environment

Anyone can run this. Whoever does keeps their addresses, hostnames,
domains, room names and house word in their own configuration; the only
thing crossing between that and this repo is a pinned tag. CI runs
[`tools/no-environment.sh`](tools/no-environment.sh) first: examples and
tests describe nowhere (RFC 5737 / 3849 / 7042 / 2606 reserves). A house's
own packs are the seam for the rest.

## Development

```sh
pip install -e ".[dev]"
ruff check . && ruff format --check . && pytest -q
```

The profile pins the versions this release was tested against
(Home Assistant 2026.8.3, Mosquitto 2.0.22, Zigbee2MQTT 2.13.0); a house may
override them under `pins:` and `doctor` will say so. A bump of the product
is a tag; a schema change ships a `migrate` and a line in the
[changelog](CHANGELOG.md).

MIT — Tom Blanc.
