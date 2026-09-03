#!/bin/sh
# The plan's card, watched (0.14.1): easy-floorplan's latest release against
# what base/www/VENDOR.md carries. Prints `same <version>` or
# `new <version> <sha256>` - and with --fetch, downloads the release asset
# into base/www/ and rewrites the version everywhere it lives (VENDOR.md, the
# URL's ?v= in floorplan.py), leaving the changelog line and the release to a
# person. The PR the workflow opens IS the notification; merging it is the read.
set -eu
cd "$(dirname "$0")/.."
REPO=nicosandller/easy-floorplan
ASSET=easy-floorplan-card.js
DEST=src/regie/base/www/$ASSET
have=$(sed -n 's/.*\*\*v\([0-9.]*\)\*\*.*/\1/p' src/regie/base/www/VENDOR.md | head -1)
tag=$(curl -sSL "https://api.github.com/repos/$REPO/releases/latest" | sed -n 's/.*"tag_name": *"v\{0,1\}\([^"]*\)".*/\1/p' | head -1)
[ -n "$tag" ] || { echo "vendor-watch: no release read for $REPO" >&2; exit 2; }
if [ "$tag" = "$have" ]; then echo "same $have"; exit 0; fi
tmp=$(mktemp)
curl -sSL -o "$tmp" "https://github.com/$REPO/releases/download/v$tag/$ASSET"
sum=$(sha256sum "$tmp" | cut -d' ' -f1)
echo "new $tag $sum"
if [ "${1:-}" = "--fetch" ]; then
  mv "$tmp" "$DEST"
  date=$(curl -sSL "https://api.github.com/repos/$REPO/releases/latest" | sed -n 's/.*"published_at": *"\([0-9-]*\)T.*/\1/p' | head -1)
  sed -i "s/| \*\*v$have\*\* ([0-9-]*) | \`[0-9a-f]*\` |/| **v$tag** ($date) | \`$sum\` |/" src/regie/base/www/VENDOR.md
  sed -i "s/^CARD_VERSION = \"$have\"/CARD_VERSION = \"$tag\"/" src/regie/floorplan.py
  grep -q "v$tag" src/regie/base/www/VENDOR.md && grep -q "CARD_VERSION = \"$tag\"" src/regie/floorplan.py || { echo "vendor-watch: the version did not land everywhere" >&2; exit 2; }
else
  rm -f "$tmp"
fi
