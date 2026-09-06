# engine

The CLI on the brain's host: a venv under `regie_venv`, the package
installed from the product's git tag (`regie_version` — by default the
collection's own version, so bumping the pin bumps both halves at once),
a `regie` on the PATH. Contract: [`defaults/main.yml`](defaults/main.yml).

**The dev loop (0.29):** `regie_source`, a checkout of the product on the
controller. Set, the role packs it (`files/source-archive.sh`: what a wheel
is built from, the version labelled `+local.<digest>`, reproducible), copies
the one archive to the host and installs the engine from it — so an engine
change in a working copy reaches a brain with no tag cut, and
`regie --version` there says so. The install is keyed on `local:<digest>`:
an edit is a new install, an unchanged copy changes nothing, and the next
run without `regie_source` sees a ref that is not the tag, puts the tag
back and removes the archive. Empty is the tag — the only path a fleet takes.
