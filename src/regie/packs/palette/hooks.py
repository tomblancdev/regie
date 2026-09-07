"""The palette pack's hooks (0.38, the audit's V9).

The stores, settled on the brain at every converge — what used to be
`Conductor.palette_slots`. It is the pack's to do and nobody else's: the
slots exist because this pack renders them, and `pull.read_stores` already
refuses to read them for a house that does not carry the pack.

It is also the shape an `apply` hook is allowed to have: it PLACES (it reads
the slots and says what each one is doing), and what it touches — the store
helpers — are rendered objects the manifest remembers, so a house that drops
this pack has them removed by the conductor's own orphan rule. A hook may not
own something that must be un-placed after the pack is gone: the Atelier's
Lovelace resource stays in `resources()` for exactly that reason — a pack no
longer in `packs:` is never loaded, and code that does not run undoes
nothing."""


def apply(conductor):
    """The stores under the rule (0.33; freed on their name alone 0.24 →
    0.32): a store the files carry as it stands is freed — the family kept a
    palette on the phone, `regie pull` wrote it, the file has it; one the
    files do not carry is kept, not yet pulled; one the files carry
    DIFFERENTLY waits for a hand (a re-edit on the phone after the pull, or
    the file's numbers touched) — nothing is lost either way."""
    from regie import pull

    for o in pull.read_stores(conductor.house, conductor.ha):
        state, detail = pull.settle(o, conductor.check)
        conductor.step(o.name, state, detail)
