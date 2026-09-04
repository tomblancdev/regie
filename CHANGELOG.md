# Changelog

## 0.16.2 — la porte de l'intégration continue rouvre (2026-09-04)

Tom : « can we fix the CI for the fonts ? ». Le garde `no-environment` sortait
en 1 sur main depuis 0.15.1 et chaque emploi derrière lui était sauté — lint,
tests, la maison témoin, la collection, l'image : cinq releases sans un test
lancé par la CI (0.16.1 y aurait laissé une ligne trop longue). Quatre causes,
aucune n'était un environnement : les trois licences OFL des polices nomment
`scripts.sil.org` — un texte de licence se garde tel quel, donc `sil.org`
rejoint les dépendances déclarées du garde, une fois ; une ligne du CHANGELOG
qui le citait ; et le test des adresses matérielles de 0.9.3 employait une
vraie MAC et un vrai EUI-64 — remplacés par les réserves de documentation de la
RFC 7042 (`00:00:5E:00:53:xx`, et pour l'EUI-64 `00:00:5E:EF:10:00:00:xx`, que le
garde apprend sous les deux formes où huit octets se lisent : six groupes et
huit). `sh tools/no-environment.sh` répond `clean` ; ruff et les tests passent
localement ; la CI dit le reste.

## 0.16.1 — une porte sur un mur partagé reste à la pièce qui l'a déclarée (2026-09-04)

Lu au premier `plan pull` après le ré-ensemencement de 0.16 : Tom avait
déplacé huit points dans l'atelier et pas une porte, et le pull réécrivait
quatre portes des Douches, de La Piaule, de L'Atelier et des Waters dans le
fichier du Passage, sans leur `to:`. Une porte posée sur un mur que deux pièces
partagent est SUR LES DEUX CONTOURS, à zéro centimètre de chacun ; le pull la
donnait à la première aire de la liste de l'éditeur, une liste que le
ré-ensemencement venait de réécrire dans l'ordre de la maison. Un aller-retour
ensemencer-puis-tirer sans rien toucher n'était pas l'identité. La règle
désormais : **la pièce dont le bloc déclare déjà une ouverture à cet endroit la
garde**, quel que soit l'ordre des aires ; une ouverture neuve va à la pièce la
plus proche, la première dessinée à égalité. Et `to:` suit l'ouverture posée au
même point (à une main, 15 cm), jamais le même rang dans la liste — une porte
dessinée avant elle dans l'éditeur ne lui volait son `to:` que par accident de
rang. Un test qui met la porte du salon sur le mur de l'entrée, l'entrée listée
première, la liste des ouvertures renversée et une porte neuve insérée devant.

## 0.16.0 — le brouillon suit les fichiers (2026-09-04)

Tom, au matin, après l'installation : les choses posées par la convergence
(les capteurs, les télécommandes, les étoiles, les six du Passage) étaient
dans les fichiers de pièce et PAS dans son éditeur — `apply` ensemençait
l'atelier UNE fois et seul `plan push` le ré-ensemençait, à la main. La règle
désormais : **à chaque convergence le brouillon suit les fichiers, SAUF s'il
tient des retouches pas encore tirées** — alors la convergence le dit et garde
le travail de la personne (`hand` quand les fichiers ont bougé aussi : les deux
vérités attendent le pull). Jamais l'autre sens : les fichiers changent par
`regie plan pull`, un geste de la main. Pour distinguer un geste de la personne
d'un mouvement des fichiers, le chef d'orchestre se souvient de ce qu'il a
ensemencé en dernier (`<root>/.regie/plan-seed.json`, écrit par `apply` comme
par `plan push`) et compare le brouillon et les fichiers à cette mémoire sous
leur forme normale — ce que le pull LIT : une pièce par son id, une chose par
son entité, une ouverture par ce qu'elle est et où elle est, les murs, tout
arrondi au centimètre ; jamais les ids, l'éditeur les refrappe à chaque Save.
Le pas `workbench` dit le chemin en quelques mots (*2 thing(s) placed (…), the
walls*). Un brouillon sans carte de plan est ré-ensemencé (rien d'une personne
à garder) ; un atelier dont le chef n'a pas la mémoire (ouvert avant 0.16)
n'est jamais écrasé — `hand`, `plan pull` si c'est votre travail, puis `plan
push`. Trois tests de plus.

## 0.15.1 — un point posé reste où on l'a posé (2026-09-03)

Lu au premier aller-retour complet : le capteur d'air du Passage, posé côté
Cantine par le mot de Tom, a été RETIRÉ par le pull comme un souvenir périmé —
la règle de 0.14.3 (un point gardé hors du nouveau contour est retiré)
s'appliquait à tous les points. Elle ne s'applique qu'aux points GARDÉS (une
place que rien ne remplit) ; un badge qu'une personne a posé est écrit là où
il est, hors contour ou non, et c'est `check` qui le dit. Un test de plus.

## 0.15.0 — les murs sont ceux qu'on a dessinés (2026-09-03)

Tom, devant l'onglet : *« seems that you didn't took the plan I made, notably
some walls don't exist between le passage, la cantine and QG, keep the walls
as I design them »*. Le moteur DÉRIVAIT les murs des contours des pièces —
faux pour un plan ouvert, où une pièce finit sans mur. Le mur devient une
déclaration de la maison : le bloc `plan:` a son propre fichier (`include:
plan: plan.yml` — le cadre, le dessin, et `walls:`, des segments droits dans le
cadre), la carte dessine exactement ceux-là ; sans `walls:`, les arêtes des
contours les remplacent comme avant. `regie plan pull` écrit les murs du
brouillon dans ce fichier (`--plan`, par défaut l'include) et garde le reste
de ses octets ; `pull_walls` arrondit au centimètre. La maison témoin dessine
sept murs. Trois tests de plus.

## 0.14.4 — l'onglet Plan est un panneau (2026-09-03)

Tom : *« I prefer the display in l'atelier du Plan page than in the page you
provided »*. L'onglet de la famille était une vue en sections — la carte sur
deux colonnes, une carte d'indication dessous ; l'atelier est un panneau, la
carte seule qui remplit la page. L'onglet est un panneau lui aussi ; le mot
d'indication (« maintenir une pièce ouvre sa page ») quitte la page pour la
documentation.

## 0.14.3 — un point gardé suit la pièce, ou s'en va (2026-09-03)

Lu au premier vrai `plan pull` : les deux cellules échangées dans l'éditeur, et
le point du plafonnier d'une pièce dont le rôle n'est pas encore rempli resté
là où était l'ANCIENNE cellule — hors du nouveau contour. Un point gardé (une
place que rien ne remplit) qui tombe hors du nouveau contour de sa pièce est
retiré et nommé : un point hors de sa pièce est une mauvaise réponse, pas un
souvenir. Un test de plus.

## 0.14.2 — le brouillon lu comme l'éditeur l'écrit (2026-09-03)

Lu au premier `plan pull` réel : l'éditeur, à Save, refrappe chaque id
(`area_…`, `item_…`, `door_…`) et garde le lien vers l'aire de Home Assistant
(`haArea` : `salon`, `cuisine`, `les_douches`… — l'id adopté par alias, ou fait
depuis le label) et le nom. Le pull ne trouvait aucune pièce et n'écrivait
rien : 63 notes, zéro fichier. Une pièce est trouvée par n'importe lequel de
ses mots — son id, son label, ses alias — slugués comme Home Assistant fait un
id (`slug`, NFKD → ascii → minuscules → `_`). Une chose est trouvée par
l'entité que le moteur dérive OU par celle que sa ligne nomme (`entity:` — le
Denon, la hotte : un `kind` inconnu du produit ne dérive rien). Une adresse
Zigbee dans un id d'entité nomme la chose sans la placer (une note qui dit
quoi écrire). Une pièce dessinée deux fois garde le premier contour. Un test de
plus, sur la forme exacte lue.

## 0.14.1 — l'atelier s'ouvre, et la carte est surveillée (2026-09-03)

Lu à la première convergence : `lovelace/dashboards: unknown_command`. La
collection des tableaux de bord liste sous `/list` (la collection de stockage
générique) ; seule celle des ressources répond sur son nom nu, et 0.14.0 avait
généralisé l'exception. Le pas `workbench` lit `lovelace/dashboards/list`.

**La carte est surveillée, comme du code** (Tom : *« we will get auto updates
from HACS I think »* — HACS notifie, il n'installe pas seul ; ici la
notification sans le bouton) : `tools/vendor-watch.sh` compare la dernière
release d'easy-floorplan avec ce que VENDOR.md porte, et le workflow
`vendor-watch` ouvre chaque lundi une pull request qui apporte le fichier, son
sha256 et la version dans l'URL. La PR est la notification ; la fusionner est la
lecture ; la release et l'épingle restent à une personne.

## 0.14.0 — l'atelier du plan : l'éditeur est le brouillon, les fichiers sont le dessin (2026-09-03)

Tom : *« it will be better if I can edit it myself using the editor cause there
is a lot to edit and I have the real vision »*. Le tableau de bord de la famille
est rendu depuis les fichiers et ne s'édite pas en place ; l'éditeur de la carte
(glisser-déposer : murs, portes, ampoules) veut un tableau de bord en mode
storage. Le chef d'orchestre en ouvre donc UN — **« L'Atelier du plan »**,
`/regie-atelier`, administrateurs seulement — ensemencé UNE FOIS avec la carte
telle que les fichiers la dessinent (pas `workbench`). Il n'est jamais
ré-ensemencé par `apply` : un brouillon appartient à une personne.

**`regie plan pull`** lit le brouillon (`lovelace/config`) et **réécrit le bloc
`plan:` de chaque fichier de pièce, et rien d'autre** — chaque autre octet du
fichier est gardé, un fichier sans bloc en reçoit un à la fin. Ce sur quoi il
s'appuie : une aire est une pièce par son id ; une chose est retrouvée par son
entité (le sélecteur de l'éditeur en pose une) ou par son id (le nôtre) ; une
ouverture appartient à la pièce sur le contour de laquelle elle est posée (à
15 cm près) ; `to:` est gardé de l'ancien bloc par position ; tout est arrondi au
centimètre ; les places sortent dans l'ordre du layout, les rôles dans celui de
la pièce. Ce qu'il ne peut pas placer est NOMMÉ (une aire qui n'est pas une
pièce, une chose qui n'est pas de la maison, un rôle sans layout et sans point),
jamais jeté en silence. **`regie plan push`** ré-ensemence l'atelier depuis les
fichiers, et le dit : le brouillon qu'il tenait disparaît. Un contour se déplace
par les coins de la PIÈCE (l'aire), pas par les traits de mur : les murs sont
redessinés depuis les contours.

Quatre tests de plus : l'atelier ouvert et ensemencé une fois (le brouillon
survit au passage suivant), l'aller-retour sans perte, les gestes de l'éditeur
(une ampoule déplacée, une porte dessinée, une chose ajoutée par l'entité, une
aire et une chose inconnues nommées), la réécriture d'un fichier à l'octet près.

## 0.13.2 — la carte est une ressource, jamais un module de l'index (2026-09-03)

Lu sur Firefox et sur le téléphone, la carte du plan répondait « Configuration
error » sans un mot : le module s'importait, s'exécutait jusqu'à sa dernière
ligne (`customCards` la nomme, son Lit est compté), et
`customElements.get('easy-floorplan-card')` restait vide. La raison est dans
le frontend de Home Assistant : sa première ligne installe le polyfill
`scoped-custom-element-registry`, dont `get` et `whenDefined` ne lisent que
LEUR table. Un module importé par l'index (`extra_module_url`) court contre
l'application ; quand il gagne — le service worker le sert depuis son cache —
il définit son élément dans le registre NATIF, que le polyfill ne consulte
jamais : l'élément existe et le frontend jure qu'il n'existe pas. Le harnais
de la veille passait dans trois moteurs parce qu'il n'avait pas de polyfill.

La carte est donc une RESSOURCE Lovelace, que le frontend charge après son
propre démarrage, donc après le polyfill, à chaque fois : `apply` gagne un pas
`resource plan` (`lovelace/resources` sur le websocket — un seul enregistrement,
clé sur le chemin du fichier ; la version dans l'URL, `?v=1.6.1`, fait d'un bump
un fichier neuf pour tous les caches ; une ancienne URL est réécrite ; une
maison sans plan n'en possède pas). Le bloc `frontend:` ne porte plus que la
peau. Un `haArea` faux (l'id d'une aire chez Home Assistant est celui du chef
d'orchestre, `salon` et non `living_room`) est retiré des aires. Deux tests de
plus sur le pas, un harnais headless dans les notes.

## 0.13.1 — une ambiance lue s'écrit comme une pièce l'écrit (2026-09-03)

Lu sur le cerveau, La Cantine toute éteinte : `regie look` sortait
`essai: {label: Essai, main: false, table: false}` — une seule ligne en style
flux, et `off` épelé `false`. Le dumper YAML replie une scène de scalaires
sur une ligne et n'a pas de mot pour `off` ; ni l'un ni l'autre n'est la
forme d'un fichier de pièce. Le bloc est écrit À LA MAIN : un rôle par ligne,
une ambiance-feuille en flux avec de l'air (`{ brightness: 30, ct: warm }`),
les places d'un rôle l'une sous l'autre, `on` / `off` nus, une couleur entre
guillemets doubles (un `#` nu ouvre un commentaire). Un test de plus, sur le
cas lu.

## 0.13.0 — le plan : la maison dessinée depuis ses déclarations (2026-09-03)

**Un onglet `Plan` à côté des pièces**, et rien n'y figure qu'un fichier n'ait
placé (guidelines 1.12). La maison donne le CADRE — `plan: { size: [979, 826] }`,
l'enveloppe extérieure en centimètres, et un dessin à poser sous les murs
(`image:`, un fichier à côté de home.yml, copié dans le `www/` du cerveau) ;
chaque pièce donne son contour (`plan.outline`, ses angles intérieurs dans ce
cadre), ses portes et fenêtres SUR ce contour (`doors:` / `windows:` — la
paroi percée est l'arête la plus proche du point ; `role:` y attache le
capteur d'ouverture, et le battant le suit), et où pendent ses choses (`at:`,
PAR RÔLE : un point pour un rôle sans layout, un point par place — les mots du
layout — pour un plafond de plusieurs lumières). Une chose dont le rôle n'a pas
de point n'est pas dessinée, et `check` le dit ; un rôle inconnu, une place que
le layout ignore, un point unique pour un rôle à places, une pièce de parking
qui se dessine : refusés ; un point hors du contour : un avertissement.

**Le rendu est easy-floorplan** (nicosandller, MIT, v1.6.1), EMBARQUÉ dans le
produit (`base/www/`, la provenance et le sha256 dans VENDOR.md) et chargé par
la même couture que la peau (`frontend.extra_module_url`) — jamais un store,
rien de téléchargé à l'exécution. Une aire par pièce liée à l'aire de Home
Assistant (un capteur de mouvement la teinte), un badge par chose placée, la
couleur et la luminosité de chaque ampoule ÉTALÉES sur le plan. Un tap sur
une pièce zoome (le geste de la carte) ; MAINTENIR ouvre la page de la pièce
(la descente) ; un tap sur une chose ouvre le panneau de Home Assistant (le
dernier barreau, 1.12). La grammaire est celle de la maison : changer de
carte un jour est le problème du moteur, pas d'un fichier de pièce.

**Le mode essai est la pièce elle-même, et `regie look` l'écrit.** On règle
les ampoules depuis le plan, on regarde le plafond, et `regie look --room
<id>` lit ce que font les lumières et l'imprime dans la grammaire de la maison
— par rôle et par place, `brightness:` en pour cent, `ct:` un mot de la
maison quand l'ampoule est à moins de 150 K de l'un d'eux (sinon le nombre),
`color:` en hexa — prêt à coller sous `scenes:`. Le pli : toutes les places
d'un rôle qui disent la même chose, dit une fois au rôle ; un préfixe dont
les places s'accordent, dit une fois au préfixe ; le reste par place, dans
l'ordre du layout. Une ampoule illisible est nommée en commentaire et laissée
de côté. Un aperçu SIMULÉ (peindre une ambiance sans toucher aux lumières)
n'est pas fait, et par choix : ces ampoules plafonnent à 4000 K et posent une
rampe en deux secondes ; un rectangle peint mentirait deux fois.

Le fichier de la maison témoin dessine deux pièces, la porte d'entrée suit son
capteur, un dessin minuscule passe sous les murs. `render` copie deux fichiers
de plus (36). 19 tests de plus.

**Reste en écart, pas de cette session :** `packs/fx/tests/test_fx.py::
test_lightning_glitch_neon_fire` échoue sur main depuis 0.12.2 (le compte de
passes est devenu `{{ passes }}`), et `tools/no-environment.sh` sort en 1 sur
main (les licences OFL des polices nomment scripts.sil.org).

## 0.11.1 — how a card leaves the ground is the theme's to say (2026-09-02)

Caught by reading the rendered theme rather than trusting the library file:
`nuit` came out with **`ha-card-border-width: 1px` and the plate's inset
highlight**. Both were hard-coded in the engine, written when the only skin was
the industrial one — so the theme that exists precisely because *a card should
separate from the ground by lift and not by a line* rendered with a line.

`border:` and `shadow:` are the theme's own words now. `shadow` names one of
four: **`plate`** (a hairline on the top edge and a hard line under it — wants a
border beside it), **`lift`** (shadow alone, no border), **`glass`** (a lift with
a highlight, for a translucent card), `none`. Nuit is `border: 0` + `lift`,
Verre `1` + `glass`, Atelier `1` + `plate`.

The lesson is the older one: **a default written for the only case there was
becomes a wrong answer the moment there are two**, and the file that declares a
design cannot be trusted until the thing it renders is read back.

203 tests — the new assertions ride the tests that already existed.

## 0.11.0 — a shelf of skins, and Nuit on it (2026-09-02)

The skin that shipped this morning was **industrial on purpose** — painted
steel, plates with a 1 px edge, a square icon key, Oswald uppercase — and the
first thing its house said after living with it was that it did not look modern.
It was not meant to; a breaker panel is not a 2026 app. But a house should not
have to write forty colours to find that out.

**`house.theme` gains `use:`.** The product now carries a **library** of whole
themes (`src/regie/themes/*.yml`) and a house picks one:

```yaml
theme:
  use: nuit
```

Everything beside `use` overrides what that theme says, and **the palettes merge
key by key** — repaint `lit` and every other colour stays Nuit's. Without `use`
a house still declares the whole skin itself, validated exactly as before. The
library holds the *design*, the house holds its *deviations*: the same split as
the packs. `check` prints what is on the shelf, and an unknown name is refused
with the list rather than rendering a house with no skin.

**Three on the shelf:**

* **`nuit`** — soft dark, and the one to reach for. **No borders anywhere**: a
  card separates from the ground by *lift*, not by a line, which is the single
  biggest difference between a modern interface and a dated one. 18 px corners,
  a round icon key, a 44 px dimmer a thumb can catch, and air between things.
  **Manrope** in sentence case with tight tracking. One warm amber means *a
  light is on* and nothing else wears it; one calm blue means *you can press
  this*.
* **`verre`** — Nuit's geometry with **translucent cards over a coloured glow**.
  `--ha-card-backdrop-filter` is a variable Home Assistant reads itself, so the
  frosting is configuration and not code; `blur:` in a theme sets it.
* **`atelier`** — what 0.10 shipped, kept whole. It belongs on a wall panel.

Manrope 400/500/600/700 joins Barlow and Oswald in `base/fonts/` (OFL, beside
their licences). **Which faces get embedded is still derived** from the stacks a
theme names — a house on Nuit ships four faces and no Oswald.

Two smaller things the library needed: a palette colour may now be `rgba(…)` as
well as a hex (glass has to be translucent), and the theme file's *name* comes
from the resolved theme rather than the raw block, so `use: nuit` with no `name:`
renders `themes/nuit.yaml` instead of failing on a key the house never wrote.

203 tests.

## 0.10.3 — `default()` does not catch a None (2026-09-02)

0.10.2's own fix, read off the live house ten minutes later: **`La Cantine —
None`**. A place group whose prefix the room has *not* named came back from
`dict.get` as `None`, and Jinja's `default()` filter replaces the **undefined**,
not a null — so the fallback never ran and the null rendered as the word.

`or` instead, which is what was meant. And the reason the suite said nothing: the
witness house names **every** prefix it groups, so the fallback branch had no
example. It has one now — a role whose layout groups a place the room never named
— and the test also refuses the string `None` anywhere in a friendly name.

202 tests.

## 0.10.2 — a place is called one thing (2026-09-02)

Read off the live house an hour after 0.10.1 landed. The dashboard called the
ceiling's three groups **Spots TV · Rangée · Spots canapé** — the room's own
`places:` — and the entities themselves were still called *Plafond front*,
*Plafond row*, *Plafond back*. Nobody sees it on a card, which overrides the
name; they see it the moment they tap a group that has no page of its own and
Home Assistant's dialog opens with the machine word in its title. **One fact,
rendered in two vocabularies** — the friendly name now comes from `places:` too,
and falls back to the prefix only when the room has not named it.

Beside it: a thing with no `label` is named by its **kind** wherever it is
listed, never by its raw id — `Le Carton` was printing `zigbee` for the
coordinator that has no entity of its own.

## 0.10.1 — a release carries its own pin, and now something proves it (2026-09-02)

0.10.0 was tagged with the `engine` role still installing **v0.9.3**. A fleet
that pinned the new collection got the new roles and the *previous* engine, so
the converge stopped exactly where it should have — `check` refused the house's
new `places:` before rendering a single file — but for a reason nobody would
guess from the message.

This is 0.5.1's lesson repeating: that release bumped the same default by hand
and wrote it down, and writing it down was not enough. **The package's version
and the role's `regie_version` are one fact**, and a test now says so — the two
files are read and compared, so a release that forgets its pin fails in CI
instead of on somebody's brain.

## 0.10.0 — the descent, and a skin the house owns (2026-09-02)

**The dashboard was one page.** Every room an `entities` card, every card the
room's whole list — eight rooms and thirty-three lights stacked into six phone
screens, and nothing on it said where a light *was*: `Plafond 1` … `Plafond 6`
sat flat beside the TV spots and the couch spots. What the family needed was a
room's lights as a group with every one of them still reachable, and Home
Assistant 2026.8.3 ships **no collapsible row** — the row types are divider,
section, buttons, conditional, weblink, attribute, perform-action, and the one
everybody uses for this is a third-party card. So a "dropdown" here is a page.

**The descent.** One page per rung: the house · a room · a group of lights · a
place inside it · the bulb. **A page answers one question and offers one way on;
it never shows what the page below it is for**, which is why a flat of
thirty-three lights now opens on a single screen with no scrolling. The last
rung is Home Assistant's own light panel — the wheel, the colours, the
favourites, the history — and the engine hands over rather than redraw it.

Two rules give it its shape, and both are in `dash.py` beside the code:

* **One row, two gestures.** The round icon toggles what the row names; the row
  itself walks down. `icon_tap_action: toggle` and `tap_action: navigate` on one
  tile — native, no third-party card anywhere.
* **A step with one way on is not a step.** A room whose single role holds every
  light it has does not draw that role (the room group already *is* it); a group
  of two or three bulbs is drawn where it stands, its own bulbs under it, rather
  than earning a page nobody wants to open. Four things, or places inside it,
  and it becomes a page (`NAV_PAGE_MIN`). A group is never a dead end either way.

**Three new words, all in the room's own file — each one the house saying what
it wants rather than the engine guessing:**

* **`pinned: true`** on a scene puts that look on the room's page. Everything
  else waits one tap away on the room's `looks` page, applied by hand — `off`
  among them, last. Nothing is promoted because the engine found it interesting.
* **`places:`** under a role names what a layout's prefixes ARE. Those prefix
  groups were already real light groups, made for the scenes since 0.7.0; naming
  them was all that was missing to put them on a card. `check` refuses a word the
  layout does not know.
* **`parking: true`** on a room: things wait here for a room and a role. **No
  scene, no default, no automation** is rendered for it and `check` asks it for
  none — while its things stay visible, because a bulb with no place is still a
  bulb somebody wants to try. `check` refuses the two contradictions it can be
  written into: a parking room that declares roles, scenes or defaults, and a
  thing that carries a `role` while it is still in there.

**Acting and tuning are different pages.** A room's page is what you press now;
its cog opens the room's own settings — the looks it defaults to, its effects'
kill-switches, and **the health of its things**, which existed nowhere before:
`sensor.<room>_offline` counts the room's own lights that are not answering.
Every entity it names is one the house minted itself (`light.<thing>`), so this
can never count a name that never existed — a battery level, by contrast, is NOT
derivable (Zigbee2MQTT mints that entity id at the interview, from the radio
address, exactly as 0.8.1 found for the lights) and is deliberately absent.

**And a skin the house owns (`house.theme`).** The palette says what a colour
IS — the ground, a plate, its edge, the ink, what you press, what is **lit**,
what is wrong — and the engine maps those eight words onto the forty-odd CSS
variables the frontend reads. The house never writes
`--state-light-active-color`. Geometry comes with it because it changes the feel
more than any colour does: a card's radius (a floating pill, or a plate with an
edge), a tile's icon radius (a round dot, or a square key), the height of a
feature bar (a hint of a slider, or a fader a thumb can catch). Light and dark
are separate palettes, and the plate's inset highlight differs by mode because
the light does.

**The typefaces are the one thing a theme cannot do alone:** it may NAME a
family but not load one, and the only face Home Assistant ships is Roboto. The
product carries a few (Barlow, Oswald — OFL, in `base/fonts/`) and renders the
ones a stack names into the brain's own `www/` as one ES module of `@font-face`
rules with the data inlined, loaded by `frontend.extra_module_url`. Nothing is
fetched at runtime and **the family's phones never call a font server**. Which
faces get embedded is DERIVED from the stacks, never listed twice.

`apply` sets the theme as the default for both light and dark, for everyone who
has not chosen one of their own — and a theme the brain has not read yet
**waits** (0.7.3's rule) rather than being named: naming a theme that is not
loaded is how you hand a family a blank interface.

**YAML 1.1's booleans, twice in one afternoon.** `off` in `labels/*.yml` had
been parsed as the boolean `false` since 0.4 — so the standard look's name was
never found and `off` printed as its id; `Off` in the English file was a boolean
value too. It had never shown because no card had ever printed that scene's own
label until the `looks` page did. Both are quoted now. The palette then walked
into the same trap from the other side, and the answer there was different: the
colour of a lit light is `lit`, not `on`, because **a key that has to be quoted
to mean what it says is a bad key** — a house writes this file by hand.

**And one the descent's own tests found, latent since 0.1:** `when:` was
honoured for the profile's rows and the packs', **never for the base's** — no
base row had ever carried one. The skin gave the base its first, so a house
declaring no theme did not quietly skip the file, it died rendering
`{{ data.house.theme.name }}` against a house that has no theme.

The dashboard is built as a structure (`dash.py`) and rendered through
`to_block`: four levels of nested Lovelace YAML written by hand in a template is
indentation, not design. A pack still contributes a card of its own — with no
`each` to the house's first page, `each: areas` to that room's page — and the
contribution is parsed rather than pasted, so a pack whose YAML does not load
says so at render instead of in the family's browser.

202 tests.

## 0.9.3 — a hardware address is as long as the thing says (2026-09-02)

**`pair --matter` proposed a row `check` then refused.** The walk's Matter half
reads a node's hardware address out of its own diagnostics and writes it into
the row as `mac`; the schema demanded six bytes. **A thing on Thread reports an
eight-byte EUI-64**, so every Thread thing walked came out with a row the engine
rejected — the two halves of the same product disagreeing about what an address
is, and only a real Thread device could say so. Every Matter thing before this
was Wi-Fi, with a six-byte MAC, and the walk had never been run past a border
router.

`$defs/mac` now accepts six **or** eight bytes. It is referenced in exactly one
place — a thing's `mac` — so nothing else widens. Lowercase and the two exact
lengths stay the whole vocabulary: a seven-byte address, a nine-byte one, or an
uppercase one is still a fault.

Why the address and not the serial: `apply` keys a Matter device on its serial
when it has one and on this address otherwise, and most Thread things have no
serial at all (five of the six IKEA things walked on 2026-09-02 report none).
The address is the only key they offer.

189 tests.

## 0.9.2 — the switch is the only truth about a walk (2026-09-02)

Found by reading the live house after a converge: `input_boolean.<room>_<scene>_drift`
read **on** and nothing was walking. A converge re-renders and reloads the
scripts, which kills the loop; the helper survives, so the look sat frozen
while claiming to move. A restart of Home Assistant did the same.

The drift was started in one place only — the scene's own script. It is now
started by **the switch**, through an automation that fires when the helper
goes on and when Home Assistant starts, conditioned on the helper being on.
So the helper is the whole truth: on = walking, off = still, at any moment and
after anything. It is also what makes the switch usable *as a switch* — turning
it back on from the settings view now does what it says.

## 0.9.1 — a look you can press (2026-09-02)

A room's card had two buttons — *on* (through the room's default look) and
*off* — and no way to reach any of the looks the room actually has. Every
scene was a script nobody could see. **The card now carries the room's looks
as buttons**, in the order its file writes them.

For that to read as anything, a look needed a name and a face:

- **A standard look is translated like a kind is.** `day · soft · evening ·
  night · cinema · game · alarm · cooking · focus · low · party · guest ·
  morning · reading · relax · bright` have labels in `labels/<lang>.yml`, so
  a house that writes `cinema:` gets *Cinéma* on a French card for free. A
  look a house invents falls back to its id and says its own `label:`.
- **And it wears a standard icon** (`SCENE_ICONS` — an icon has no language,
  so it lives beside the code and not beside the words). A row of buttons that
  is eight identical palettes is not a row anyone can read.

Both are defaults: `label:` and `icon:` on the scene still win.

## 0.9.0 — a look reaches its places, and a look may move (2026-09-02)

Three things a real ceiling asked for, in the order the room asked them.

**A scene has an identity.** It was a bare mapping of roles, so every script
came out as *"Le Salon — game"* — the raw id — with one icon for all of them
and no way to tell a look from another except by reading it. A scene now
carries `label`, `icon` and `tags:`, the last being what the UI, a scenario
and later the AI pick a look by, the same word `fx` shapes already use. Those
four keys can never be role names, and `check` says so if a room tries.

**A look may name the PLACES inside a role.** Twelve ceiling lights under one
role got one value between them, so "the spot above the couch is off" and "the
ceiling is a gradient" were both unsayable. A look's mapping may now use the
role's own `layout:` words — a place, or a prefix several of them share — each
overriding the base the look sets for everything it did not name:

```yaml
party:
  label: Fête
  tags: [social, dynamic]
  main:
    brightness: 12                            # what every unnamed place takes
    front: { color: "#0096ff", brightness: 6 }
    back_center: off
```

Still by role, still no entity id: a prefix aims at the group its places
already have. The places are the ones the room **declares**, not the ones the
walk has paired — an empty place renders nothing and is a hint, like a role.
`check` refuses a word the layout does not know (it used to be swallowed in
silence and read as a plain `on`) and refuses a place named beside the prefix
that already speaks for it, which would send one bulb two looks in a breath.

**A look may MOVE, for as long as it holds.** `fx` is transient by design —
snapshot, run, restore. Some looks are not: they are alive while you are in
them. `run:` gives a scene a sustained effect, and the first shape is `drift`,
a slow colour walk:

```yaml
  run:
    drift: { role: main, places: row, band: [190, 330], period: [80, 175], step: 2.5 }
```

Every place walks the band on **its own period**, so no two are ever in step
and the ceiling never falls into a pattern. It is **stateless**: a hue is a
pure function of the clock, so nothing is stored, nothing accumulates drift,
and a brain that restarts mid-walk resumes exactly where the time says. Any
other look of the room stops it before setting itself — a moving ceiling
belongs to one look — and the loop's condition **is** a helper on the settings
view, so the kill-switch is not bolted on, it is the mechanism.

**Two properties of real bulbs, measured in a room and now in the code.**
Brightness is never sent by a drift: a level command **aborts the colour ramp
running inside the bulb**, which is what made the first attempt look ragged.
And a colour command needs time to *land* — below ~2 s a new one aborts the
last, so smooth is **slow steps, not many steps** (0.5 s was visibly dirty,
2 s clean). `check` stretches a step below its backend's colour floor and says
so, the way an fx shape is stretched. The floor is the target's, not the
house's: 2 s where a place is Zigbee.

## 0.8.1 — a Zigbee thing wears its name in Home Assistant too (2026-09-01)

**The bug this fixes had made every scene in a real house a no-op.** A look is
rendered by role against `light.<thing id>`; a role's group lists the same
names. In a house whose lights came through the Zigbee walk, not one of those
entities existed — every group read `unavailable`, and `script.<room>_<scene>`
turned nothing on or off. Read from Home Assistant's own registry, a bulb was
`light.0x8c8b48fffe68957a`.

**Why, and it is worth writing down.** Home Assistant mints an entity id
**once**, when a device is first announced. The bridge announces a thing at
its **interview** — while its friendly name is still its radio address. `pair`
renames it a moment later; the *device* follows (which is why the UI reads the
right label and nothing looks wrong), but an entity id belongs to the user, so
the address sticks for ever. A Matter thing is commissioned already named,
which is why those came out right and these did not — the same conductor, two
orders of operations.

`apply`'s device step already did exactly the right thing: room a row's
device, name it, and rename the entity of the thing's own domain to the
house's id. **Zigbee rows never reached it** — the step selected rows carrying
a `serial`, a `mac` or an `integration:`, and a Zigbee row carries an `ieee`.

- **`device_of` learned the radio address**: a Zigbee row matches the device
  whose identifier is its `ieee`, alone or behind the instance's prefix
  (`zigbee2mqtt_0x…` — the prefix is the instance's, not the protocol's, so
  either form matches).
- **The step's rows now include `ieee:`.** A Zigbee thing is roomed, named and
  its entity renamed like every other thing; its diagnostics (linkquality,
  battery) are untouched, as before.
- Unchanged where it was already right: a device that is **two** entities of
  the thing's domain is roomed and named but never renamed — which one would
  be the row? — and a row whose device is not there yet is skipped in silence.

Landing this on a house that has already walked is a one-time move of every
Zigbee entity id, and the report names each one. Recorder history keyed on the
old id does not follow.

## 0.8.0 — the brain learns the border router (2026-09-01, W1b-thread)

The Thread mesh's plumbing landed on the fleet's side the same day: an
SLZB-MR4U running OpenThread on its own second radio, holding the house's
network, watched. What was still missing is the half only the conductor can
do — **Home Assistant's `otbr` config entry**, pointed at the REST API the box
serves on the lane. Nothing can be commissioned onto a Thread network the
brain has never been introduced to.

**A `thread:` block, mirroring `zigbee:`** — hardware the house has, not a
pack. The dataset is not in it and never will be: the key, the PAN ids and the
mesh-local prefix are minted into the secrets and pushed onto the router by
the fleet.

```yaml
thread:
  network_name: maison-temoin
  channel: 15
  border_routers:
    - { id: main, thing: coordinator_main, port: 8080 }
```

The address comes from the thing the row names — the same seam as a
coordinator, because on a two-radio box it is literally the same thing: one
row, one reservation, one alias, two radios.

**The guard is the feature.** Home Assistant's `otbr` flow reads the router's
active dataset when the entry is made, and **on a router holding none it MINTS
a network of its own** — a random PAN id, a generated name, a key nobody wrote
down. The day a border router is factory-reset, an innocent converge would
hand the house a Thread network it cannot reproduce. So `apply` reads the
router's `/node` first and introduces it **only while it is already holding
the house's network**; anything else `waits`, saying which network it actually
found. The house's dataset goes on before anything is commissioned, never
after, and this is that sentence made mechanical.

A router that is off, or that holds the wrong network, **waits — it does not
fail the fleet** (0.7.3's rule): a box on the lane is not the fleet's health,
and the watcher is what goes red.

**`check` gained two refusals the house is the only one that can make:**

- **Thread and Zigbee may not share a channel on one box.** Two 802.15.4
  meshes, two aerials centimetres apart, one channel: things drop and nothing
  logs a cause. Home Assistant has a collision check of its own, but it only
  ever fires for ZHA behind a multiprotocol add-on — never for a house running
  Zigbee2MQTT. Nothing else was watching it.
- **A border router with no `matter` pack behind it** is a mesh nothing can
  join: a Thread thing reaches the brain through the Matter fabric.

**Two things the wire taught us**, both live on SLZB-OS v3.3.1:

- **An unknown path answers `200`, with a body that says 404.** A status code
  proves nothing on this firmware — the network name is read out of the body,
  and a body carrying none is *no border router at this door*, not a network
  named `None`. (The same trap fools `python-otbr-api`'s key-format probe,
  which reads `/api/actions`: it concludes camelCase where the box answers
  PascalCase. Harmless on the read-only path the entry needs — reads are
  normalised either way — but it means this house's dataset can only ever come
  from the fleet's play, never from Home Assistant's UI.)
- **The keys come back PascalCase** where the same REST API upstream has
  spoken camelCase since Sept 2025, so the reader takes either spelling rather
  than pinning the one box we own today.

`regie status` prints the border router, its network and its channel. 174
tests.

## 0.7.3 — a thing that does not answer waits; it does not fail the fleet (2026-09-01, W1's walk)

One bulb, unscrewed from its socket to reset another one in it, **failed the
whole converge** — and every play after it:

```
group/members/add: … 0x8c8b48fffe68d128 … Timeout after 10000ms
```

Group membership and bindings are written into the **thing's own tables**,
over the air. A bulb out of its socket, a remote whose battery died, anything
out of range: it answers nothing and Zigbee2MQTT reports a ZCL timeout. That
is the thing waiting, not the house being wrong.

- **A per-thing radio call degrades to `waiting`** and the run carries on —
  `it does not answer its radio (a ZCL timeout) — unpowered, out of range or
  asleep; the next apply writes it`. Its neighbours still land, the room's
  group is still made, and the drift is in the report rather than in a
  stack trace.
- **An instance-level call still fails loudly** (adding or renaming a group):
  that is our own shape being wrong, and it must not be swallowed.
- The room's group reads `ok` only for what actually answered; the silent
  ones keep the step honest at `waiting`.

## 0.7.2 — the conductor waits for a door being restarted under it (2026-09-01, W1's walk)

The converge renders Zigbee2MQTT's files, `up` restarts it when they
changed, and `apply` follows immediately — but the frontend binds its socket
seconds after the unit starts. So the connection was REFUSED and **the whole
mesh half was skipped** (names, the room's group, every binding) while the
run still reported success: `~ zigbee main: … Connection refused — tried
again at the next apply`. Any converge touching a Z2M file needed a second
one, and nothing said so out loud.

- **`Z2M.open(wait=…)`** retries while the door is *refused* — a socket not
  listening yet — and still fails at once on anything else, which is a door
  that is wrong rather than late. The conductor asks for 60 s; `check` asks
  for none.
- **The suite keeps no patience** (`conftest`): a test meets a door that is
  simply absent, and a minute of waiting each is a suite that hangs — found
  the hard way, three containers still spinning. The wait has its own test
  instead: refused twice then answered, and `wait=0` failing on the first try.

## 0.7.1 — a rendered group is the API's to leave alone (2026-09-01, W1's walk)

Found with thirteen bulbs in the mesh and the converge dying on the first
room's group: **`apply` must never `group/add` a group its own render has
already declared.**

- **The mechanism, read from Zigbee2MQTT's own code.** `groups.yaml` is
  where a group's *name* lives, so `settings.addGroup` refuses a name the
  file already carries — *"friendly_name 'living_room' is already in use"* —
  and the converge fails there. Meanwhile the **radio's** group object does
  not exist yet, so `bridge/groups` is empty and the old code read that
  emptiness as "not created". Both halves were telling the truth about
  different registers.
- **The group is made by its first member.** `zigbee.js` creates the
  herdsman group lazily the first time the name is resolved — *"If group
  does not exist, create it (since it's already in configuration.yaml)"* —
  which the `group/members/add` that follows already does. So the fix is a
  deletion: declare in the file, populate through the API, never add.
- **The fake was the reason the tests missed it.** `FakeZ2M` let
  `group/add` succeed, which the real one never would. It now carries
  `declared` (what the render wrote), refuses `group/add` for a name in it,
  and materialises the group on the first member — the shape of the real
  thing. 159 tests.

## 0.7.0 — the Zigbee walk (2026-09-01, W1)

The mesh half, built against a real radio and a real 2.x Zigbee2MQTT — and
the four things that were wrong in the seams 0.1 left, each found by the
thing refusing to start rather than by reading the diff.

- **`pair --room <room>`, the walk's Zigbee half.** The room is the session:
  the join window opens on the radio, a person holds the thing's reset
  button, and the thing introduces itself. Its **kind is read from its own
  interview** (`definition.exposes`: a `light` expose is a light, a `switch`
  with a state a plug, `occupancy` a motion, `contact` a door, an `action`
  enum a remote, a measured value a sensor), its vendor and model come with
  it, the name is generated (`<room>_<role>_<at>` in a layout,
  `<room>_<role>_<n>`, else `<room>_<kind>_<n>`) and **the row is printed,
  never written** — the house's file is the human's. A control that can send
  commands is proposed **bound to its room**. A light blinks and ends dark:
  it says which one it was. The window is closed again whatever happens —
  an open window is a stranger's door. `--adopt <address>` writes the row for
  a thing already in the mesh (an interrupted walk), `--time` shortens the
  window, `--coordinator` picks the radio.
- **`apply` makes the mesh match the rows.** Every thing wears its row's id
  (a live Zigbee2MQTT does not re-read its files — the rename goes through
  the API), every room with Zigbee lights has its group holding exactly its
  lights, and every `bind:` is a binding inside the mesh. A binding the house
  does not name is **removed only when its target is ours** (a room's group,
  a thing with a row): what the vendor shipped is reported and left alone. A
  thing paired with no row is reported, never removed — the pairing is not
  ours to undo. A radio that does not answer is `waiting`, not a failure.
- **A room's Zigbee group number is DERIVED from the room's id**, not
  counted. The number lives in each member bulb's own group table, so
  numbering in order would renumber half a flat the day a room gains its
  first light — every bulb still answering on an id nothing addresses any
  more, a silent break in the half that must work with the brain down.
  `check` refuses the collision.

**Four corrections that only a running Zigbee2MQTT could produce** (2.x, read
from its own source after it refused to start):

- **`!secret` is a STRING now, not a YAML tag.** Since 2.0 the settings are
  read with plain js-yaml: `network_key: !secret network_key` is an unknown
  tag, the file fails to parse, and the error names neither the key nor the
  line — only "your configuration file is invalid". The form is
  `"!secret network_key"`, and it is resolved for **five keys only**:
  `mqtt.server`, `mqtt.user`, `mqtt.password`, `advanced.network_key`,
  `frontend.auth_token`.
- **`pan_id` and `ext_pan_id` are rendered in the clear**, and that is the
  honest shape: Zigbee2MQTT takes no reference for them (its own validation
  refuses a string that is not `GENERATE`), and a Zigbee beacon carries both
  **unencrypted** — anyone with a sniffer in the street reads them. They are
  minted and kept because they are identity (the same values rebuild the same
  network), not because they are confidential. The network key, which
  encrypts every frame, stays in the secret file.
- **A group has no `devices:` and a device no `description:`** in the 2.x
  schema. Membership lives in the bulbs' own group tables (`apply` puts it
  there through the API); a key the schema does not know is dropped the next
  time Zigbee2MQTT writes the file, and the two would disagree for ever.
- **`version:` is Zigbee2MQTT's settings-schema version** (5 for 2.13), not
  ours: an older one is migrated and backed up at every start, a newer one
  refuses to boot. It moves with the image pin, in the same release.

Also: the frontend port is derived once (`coordinator.frontend_port`) instead
of in the template; `backup`, `restore`, `doctor` and `suggest` say 0.8 —
`suggest` reads a walked mesh, so it follows the walk rather than leads it.
14 new tests against a Zigbee2MQTT that mutates, so a second `apply` reading
`ok` proves idempotence instead of asserting it. 158 tests.

## 0.6.2 — a serial is any identifier a device gives (2026-08-31)

A cast speaker (the corridor's Xiaomi L05G) carries no MAC connection and
no serial_number in Home Assistant's registry — its one stable key is the
cast UUID in `identifiers`. `device_of` now also matches a row's `serial:`
against any device identifier value, so such a thing is roomed and named
like every other. Matter serials and MAC keys are untouched.

And the `no-environment` gate's own findings, excused where the value is
genuinely someone's published name, not a house's: Home Assistant's own
home-zone entity id, the JSON-schema dialect URL, a link-local address in
a test (the hatch the gate itself provides).

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
- **`presence`** — the phones drive home/away: last one leaves (the home
  zone empties, five quiet minutes) → `away`; first one back → `home`; only ever
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
