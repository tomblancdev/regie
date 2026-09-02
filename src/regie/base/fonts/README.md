# The typefaces the product carries

A theme can *name* a font; it cannot load one, and the only face Home Assistant
ships is Roboto. So the faces live here, and the engine renders them into the
brain's own `www/` as one small ES module of `@font-face` rules (the data is
inlined — nothing is fetched at runtime, and **the family's phones never call a
font server**).

Latin subsets, normal style, taken from the `@fontsource` packages at version
5.2.5 — the same files Google Fonts serves, pinned:

| file | family | weight |
|---|---|---|
| `barlow-400.woff2` · `barlow-500.woff2` · `barlow-600.woff2` | Barlow | 400 · 500 · 600 |
| `oswald-400.woff2` · `oswald-500.woff2` | Oswald | 400 · 500 |

Both are licensed under the SIL Open Font License 1.1 — `OFL-Barlow.txt` and
`OFL-Oswald.txt` beside them, as the licence requires. A house that wants
another face names it in `house.theme.fonts` and installs it on its devices;
what is embedded is what is here.
