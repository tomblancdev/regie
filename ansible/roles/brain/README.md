# brain

The brain laid down by the engine on its host: `home.yml` (and the house's
own files) handed over, then `check` → `render` into the root → `up` →
`apply` (the conductor). Every verb is the engine's; the role reads
`changed` from what the engine prints and logs no secret — the values go
through the environment as `REGIE_SECRET_<NAME>`.

Contract: [`defaults/main.yml`](defaults/main.yml). A fleet that templates
`home.yml` onto the host itself (its rooms and people come from its own
data) leaves `regie_home_yml` empty and points `regie_home_dir` at it.
