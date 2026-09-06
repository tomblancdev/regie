#!/bin/sh
# release — one command cuts a release. The three version marks (the package,
# the collection, the engine role's pin) are bumped together, CI's checks run
# on the tree that will be tagged, and one commit, one annotated tag and one
# push follow. Eleven hand steps were the recipe before (2026-09-06: four
# releases in an afternoon), and two of them forgot a mark twice (0.5.1,
# 0.12.1). This script ends at the pushed tag: whoever pins it does so in
# their own configuration.
#
#   sh tools/release.sh 0.29.0
#
# The CHANGELOG entry is written by a person, with the work, and committed
# with it: its heading `## <version> — <title> (<date>)` must be the file's
# first entry, and its title becomes the commit's and the tag's message. The
# story is written once.
#
# It refuses, before touching anything: a dirty tree (untracked files too);
# the three marks disagreeing (someone edited one by hand); a version not
# above the current one, or a tag that already exists here or on origin; a
# CHANGELOG whose first heading is not this version; a branch with no
# upstream, or behind it. Red checks restore the marks and leave nothing
# committed.
#
# The checks (ruff, pytest) run through an optional prefix, RELEASE_RUN —
# empty means this shell, with .venv/bin/<tool> when there is one, else the
# PATH. A laptop with nothing on it but podman:
#   RELEASE_RUN="podman run --rm -v $PWD:/src -w /src docker.io/library/python:3.13-slim" sh tools/release.sh 0.29.0
# (relative paths resolve the same inside; git stays on the host, with the keys).
set -eu
cd "$(dirname "$0")/.."

PACKAGE=pyproject.toml
COLLECTION=ansible/galaxy.yml
ENGINE=ansible/roles/engine/defaults/main.yml
CHANGELOG=CHANGELOG.md

refuse() { echo "release: $*" >&2; exit 1; }

version=${1:-}
[ -n "$version" ] || { echo "usage: sh tools/release.sh <version>    (e.g. 0.29.0)" >&2; exit 2; }
case $version in
	*[!0-9.]* | .* | *. | *..*) refuse "not a version: $version (digits and dots, e.g. 0.29.0)" ;;
esac

# ---- the tree ------------------------------------------------------------
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || refuse "not a git checkout"
[ -z "$(git status --porcelain)" ] || refuse "the tree is dirty — commit the work (the CHANGELOG entry with it) first:
$(git status --short)"

# ---- the marks -----------------------------------------------------------
mark_package() { sed -n 's/^version = "\([^"]*\)"$/\1/p' "$PACKAGE" | head -1; }
mark_collection() { sed -n 's/^version: \(.*\)$/\1/p' "$COLLECTION" | head -1; }
mark_engine() { sed -n 's/^regie_version: "v\([^"]*\)"$/\1/p' "$ENGINE" | head -1; }

current=$(mark_package)
[ -n "$current" ] || refuse "no version mark in $PACKAGE"
[ "$(mark_collection)" = "$current" ] && [ "$(mark_engine)" = "$current" ] \
	|| refuse "the marks disagree before the bump — package $current, collection $(mark_collection), engine $(mark_engine)"
[ "$version" != "$current" ] || refuse "$version is the current version"
[ "$(printf '%s\n%s\n' "$current" "$version" | sort -V | tail -1)" = "$version" ] \
	|| refuse "$version is not above the current $current"

# ---- the tag -------------------------------------------------------------
tag=v$version
! git rev-parse -q --verify "refs/tags/$tag" >/dev/null || refuse "the tag $tag already exists here"
echo "release: fetching origin"
git fetch -q origin
[ -z "$(git ls-remote --tags origin "refs/tags/$tag")" ] || refuse "the tag $tag already exists on origin"
upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null) \
	|| refuse "this branch has no upstream to push to"
[ "$(git rev-list --count "HEAD..$upstream")" -eq 0 ] || refuse "this branch is behind $upstream — pull first"

# ---- the changelog -------------------------------------------------------
heading=$(grep -m1 '^## ' "$CHANGELOG" || true)
case $heading in
	"## $version "*) ;;
	*) refuse "the first entry of $CHANGELOG is not $version:
  $heading
  expected: ## $version — <title> (YYYY-MM-DD)" ;;
esac
date=$(printf '%s' "$heading" | sed -n 's/.*(\([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\))$/\1/p')
[ -n "$date" ] || refuse "the entry's heading does not end with its date: $heading"
title=$(printf '%s' "$heading" | sed "s/^## $version //; s/ ($date)\$//; s/^— //; s/^- //")
[ -n "$title" ] || refuse "the entry's heading carries no title: $heading"

# ---- the bump ------------------------------------------------------------
rewrite() { # rewrite <file> <sed-expression> — portable, no sed -i
	tmp=$(mktemp)
	sed "$2" "$1" >"$tmp" && cat "$tmp" >"$1" && rm -f "$tmp"
}
released=0
restore() {
	[ "$released" -eq 1 ] && return 0
	git checkout -q -- "$PACKAGE" "$COLLECTION" "$ENGINE"
	echo "release: the marks are back at $current; nothing was committed" >&2
}
trap restore EXIT INT TERM

rewrite "$PACKAGE" "s/^version = \"$current\"$/version = \"$version\"/"
rewrite "$COLLECTION" "s/^version: $current$/version: $version/"
rewrite "$ENGINE" "s/^regie_version: \"v$current\"$/regie_version: \"v$version\"/"
[ "$(mark_package)" = "$version" ] && [ "$(mark_collection)" = "$version" ] && [ "$(mark_engine)" = "$version" ] \
	|| refuse "the bump did not land in all three files"
echo "release: $current -> $version in $PACKAGE, $COLLECTION, $ENGINE"

# ---- the checks (CI's list, on the tree that will be tagged) -------------
tool() { if [ -x ".venv/bin/$1" ]; then echo ".venv/bin/$1"; else echo "$1"; fi; }
run() {
	echo "+ ${RELEASE_RUN:+$RELEASE_RUN }$*"
	# shellcheck disable=SC2086 — the prefix is a command line, split on purpose
	${RELEASE_RUN:-} "$@"
}
sh tools/no-environment.sh
run "$(tool ruff)" check .
run "$(tool ruff)" format --check .
run "$(tool pytest)" -q

# ---- the commit, the tag, the push ---------------------------------------
message="$version — $title"
git add -- "$PACKAGE" "$COLLECTION" "$ENGINE"
git commit -q -m "$message"
git tag -a "$tag" -m "$message"
released=1
git push --follow-tags
echo "release: $tag — $title"
