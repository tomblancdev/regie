# Blueprints — what La Régie sends to a plain Home Assistant

Everything here is for **a Home Assistant that does not run La Régie**. You
need no add-on, no custom component, no HACS repository and no helper: you
import a URL, Home Assistant makes the thing, and it is yours.

These files are **rendered**, never written by hand: CI builds them from the
product's own sources at every tag, and a tag whose blueprints differ from
what its sources render is refused. Edit one here and the next tag puts it
back — the source is the thing to change.

## The effects — `script/regie/fx_<shape>.yaml`

An *effect* is a transient, self-restoring behaviour on a light: a lightning
strike, a candle, a heartbeat, a power-down. It takes a snapshot of the lights
you point it at, runs, and puts the snapshot back as it was. Thirty-three of
them, one file each, compiled for Home Assistant's own light and scene
services — the slowest rung, and the one every brain has.

**To take one:** open **Settings → Automations & scenes → Blueprints → Import
blueprint**, paste the file's raw URL, and import it. Then **Create script**
from it. The blueprint asks you nothing at import: the script itself takes
`target` — the light or the group — and the shape's own fields, filled each
time you call it.

```
https://raw.githubusercontent.com/tomblancdev/regie/main/blueprints/script/regie/fx_strike.yaml
```

Call the script from an automation, a dashboard button or the developer tools:

```yaml
action: script.fx_strike
data:
  target: light.living_room
  intensity: 100
```

`restore: false` leaves the lights where the last step put them. Every run
cleans up after itself — the snapshot scene is created and deleted inside the
script, whatever `restore` says.

**What each one does** is in its own file, at the top: the blueprint's
description names the shape, its fields, and anything the generic light loop
had to stretch (a shape asking for 40 ms steps gets Home Assistant's 50 ms
floor, and says so).

## Where the rest is

A room's *look*, a remote's *behaviour*, the walker, the palette of the day:
those hold on to the house they were made for — its role groups, its memory,
its clock — and they travel on their own terms, later. The engine that makes
all of it is [La Régie](https://github.com/tomblancdev/regie); these files are
the part of it that needs none of it.
