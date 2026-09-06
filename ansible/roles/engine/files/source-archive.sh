#!/bin/sh
# source-archive — a checkout of the product, packed for pip. The dev loop of
# the `engine` role (`regie_source`): the working copy on the controller
# reaches the brain's host as one file, with no tag cut. The archive holds
# exactly what a wheel is built from (pyproject.toml, README.md, LICENSE,
# src/), its version marked `+local.<8 hex of the tree's digest>` — a PEP 440
# local label — so `regie --version` on the host says where it came from,
# and it is built reproducibly (sorted, epoch mtimes, no gzip stamp): the same
# tree packs to the same bytes, and a converge that changed nothing copies
# nothing. Prints the digest; the role keys the (re)install on it.
#
#   sh source-archive.sh <checkout> <out.tgz>
set -eu
src=$1
out=$2
[ -f "$src/pyproject.toml" ] && [ -d "$src/src" ] || { echo "source-archive: $src is not a checkout of the product" >&2; exit 2; }

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT INT TERM
cp -R "$src/src" "$tmp/src"
cp "$src/README.md" "$src/LICENSE" "$tmp/"
find "$tmp/src" -name __pycache__ -type d -prune -exec rm -rf {} +
find "$tmp/src" -name '*.pyc' -type f -delete

# the tree's digest: every file's content, in a fixed order, plus the
# pyproject without its version line (the label must not feed itself)
digest=$(
	{
		cd "$tmp" && find src README.md LICENSE -type f | LC_ALL=C sort | xargs sha256sum
		grep -v '^version = ' "$src/pyproject.toml" | sha256sum
	} | sha256sum | cut -c1-64
)
short=$(printf '%s' "$digest" | cut -c1-8)
sed "s/^version = \"\([^\"+]*\)\(+[^\"]*\)\{0,1\}\"$/version = \"\1+local.$short\"/" "$src/pyproject.toml" >"$tmp/pyproject.toml"
grep -q "^version = \".*+local\.$short\"$" "$tmp/pyproject.toml" || { echo "source-archive: the label did not land in pyproject.toml" >&2; exit 2; }

tar --sort=name --mtime=@0 --owner=0 --group=0 --numeric-owner \
	-C "$tmp" -cf - pyproject.toml README.md LICENSE src | gzip -n >"$out"
echo "$digest"
