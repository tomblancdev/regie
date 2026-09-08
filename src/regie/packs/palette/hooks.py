"""The palette pack's hooks (0.38, the audit's V9).

The palette's store settled on the brain at every converge — the kept palettes
(what used to be `Conductor.palette_slots`) and, since 0.43, the day's rules
with them. It is the pack's to do and nobody else's: they exist because this
pack asks the component for them, and `pull.read_stores` already refuses to
read them for a house that does not carry the pack.

It is also the shape an `apply` hook is allowed to have: it PLACES (it reads
the store and says what each document is doing), and what it touches — a
document of the component's own store — is the phone's, not a rendered object
that must be un-placed once the pack is gone. A pack no longer in `packs:` is
never loaded, and code that does not run undoes nothing; the Atelier's
Lovelace resource stays in `resources()` for exactly that reason."""


def apply(conductor):
    """The store's documents under the rule (0.33; freed on their name alone
    0.24 → 0.32, documents since 0.42, the day's rules with them since 0.43): a
    palette the files carry as it stands is freed — the family kept one on the
    phone, `regie pull` wrote it, the file has it; one the files do not carry is
    kept, not yet pulled; one the files carry DIFFERENTLY waits for a hand (a
    re-edit on the phone after the pull, or the file's numbers touched) —
    nothing is lost either way. The day's rules read the same three ways and
    are freed the same way; a house whose rules nobody has moved has no
    document at all, and the step says so in three words."""
    from regie import pull

    for o in pull.read_stores(conductor.house, conductor.ws):
        state, detail = pull.settle(o, conductor.check)
        conductor.step(o.name, state, detail)
