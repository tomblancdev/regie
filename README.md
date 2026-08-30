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
| `regie check home.yml` | validates the schema (the packs' fragments merged), cross-checks every reference, prints the plan: the radios, the broker's users, the secrets it needs, what is not paired yet | 0.1 |
| `regie render home.yml --out DIR` | writes the units (the profile's) and the config tree (the base's and the packs'): Home Assistant's `configuration.yaml`, packages and dashboard, Mosquitto's conf/ACL/passwd, one Zigbee2MQTT instance per radio with its devices and room groups. Marks what it writes, prunes what the house no longer names, never touches what it did not write; files that hold a secret are `0600` | 0.1 |
| `regie mint home.yml` | writes every secret the house needs and does not have yet (a Zigbee network key, the broker's passwords…) — into *your* store, whatever it is | 0.1 |
| `regie init DIR` | a starter house and its secrets, in an empty directory | 0.1 |
| `regie up home.yml` | the rendered brain running on this host (the profile's runtime): units placed, images pulled when absent, a service restarted when its unit or its files changed, the pinned custom components fetched and verified by digest; `--check` prints the plan | 0.2 |
| `regie apply home.yml` | **the conductor**: what only the API can set — the first boot (the owner, analytics off), the long-lived tokens the house names, the reverse proxy it trusts, floors and areas, the backup schedule, **one config entry per thing that names an `integration:`** (the broker rides the same walker) and the application credentials the OAuth ones take (secrets `<domain>_client_id` + `<domain>_client_secret`). Declarative, idempotent, keyed on names that survive a rebuild; `--check` prints the plan. A flow that needs a person — a PIN on a screen, a consent in a browser, read from the brain itself — is never started by a converge: the line says `by hand: regie link <thing>`; a thing that does not answer is `waiting`, tried again next time. Zigbee names/groups/bindings land with the walk | 0.2 · things 0.3 |
| `regie link home.yml <thing>` | one thing's integration with a person at hand: the PIN typed from its screen, the consent's address printed for a browser and the brain's callback awaited — then the entry, the same walker | 0.3 |
| `regie backup` / `restore` / `doctor` | Home Assistant's own backup through its API; the brain's health, the pins against the tested ones, what drifted | 0.4 |
| `regie pair --room <area>` | **the walk**: open the join window, reset each thing in the room, watch its row appear — the room is the session, the kind is the thing's own interview, the name is generated, the room's remotes bind to the room's group | 0.4 |
| `regie suggest` | the mesh's opinion on rooms, from link quality — suggests, never assigns | 0.4 |

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
floors, one thing of every kind, two people, the product's pack and one of
the house's own — rendered and validated on every commit. It is the
documentation and the smoke test at once. Its addresses are the RFC
documentation reserves: it describes nowhere.

## How it is meant to work, in a house

1. `regie init` (or copy the witness), edit `home.yml`: the rooms, the
   people, the radio's address, the door (`oidc:` if you have a provider —
   without it, Home Assistant's own login), the owner account, the packs.
2. `regie mint` → put the secrets in your store.
3. `regie render --out /srv/home` on the host, `regie up` → an empty brain
   with its units, its broker, its Zigbee instance. `regie apply` → its
   people, its integrations, its dashboards.
4. `regie pair --room living` → walk the room; the rows appear; the lights
   are back.
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
| the engine | `check` · `render` · `up` · `apply` · `link` · `mint` · `init` — and the verbs declared for 0.4 | [`src/regie/`](src/regie) |
| the schema | the contract every house writes to | [`src/regie/schema/`](src/regie/schema) |
| the base | the config tree every profile renders | [`src/regie/base/`](src/regie/base) |
| profiles | `ct` — Quadlet units, host networking | [`src/regie/profiles/`](src/regie/profiles) |
| packs | `lighting` — room groups, motion lights, silent alerts, room cards | [`src/regie/packs/`](src/regie/packs) |
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
