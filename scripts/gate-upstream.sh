#!/usr/bin/env bash
# The domain gate against an UNPUBLISHED framework: hyperfixi's framework / semantic / intent packed
# from a working tree, measured before they are released (hyperfixi's DOMAINS_RETHINK.md, Phase 3:
# "Then the domain gate re-baselines: silent pairs become refused; none may go the other way").
#
#   (in hyperfixi)  npm run build --prefix packages/framework && (cd packages/framework && npm pack)
#   (here)          UPSTREAM_TARBALLS="/abs/lokascript-framework-4.5.0.tgz" bash scripts/gate-upstream.sh
#
# UPSTREAM_TARBALLS is pack-smoke's variable: space-separated absolute paths. Each package not given
# keeps the lockfile's copy. Report only: the committed baseline stays measured on the lockfile's
# framework, so this never writes it. Exit 1 when a case is worse than the baseline lists.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${UPSTREAM_TARBALLS:-}" ]; then
  echo "UPSTREAM_TARBALLS is not set (space-separated absolute paths to .tgz files)" >&2
  exit 2
fi

PKG_DIR="packages/domains"
# Inside the package, so an unpacked package's own dependencies (nearley, …) resolve up the tree to the
# repo's node_modules.
ROOT="$(pwd)/$PKG_DIR/.gate-upstream"
rm -rf "$ROOT"
mkdir -p "$ROOT/node_modules/@lokascript"
trap 'rm -rf "$ROOT"' EXIT

# shellcheck disable=SC2086 # a list of paths
for tarball in $UPSTREAM_TARBALLS; do
  unpack="$(mktemp -d)"
  tar -xzf "$tarball" -C "$unpack"
  name="$(node -p "require('$unpack/package/package.json').name")"
  case "$name" in
    @lokascript/framework | @lokascript/semantic | @lokascript/intent) ;;
    *)
      echo "not an upstream package: $name ($tarball)" >&2
      exit 2
      ;;
  esac
  mv "$unpack/package" "$ROOT/node_modules/$name"
  rm -rf "$unpack"
  echo "upstream: $name@$(node -p "require('$ROOT/node_modules/$name/package.json').version") from $tarball"
done
# A package not given resolves to the lockfile's copy.
for name in framework semantic intent; do
  [ -e "$ROOT/node_modules/@lokascript/$name" ] ||
    ln -s "$(pwd)/node_modules/@lokascript/$name" "$ROOT/node_modules/@lokascript/$name"
done

npm run build --silent >/dev/null
cd "$PKG_DIR"
GATE_UPSTREAM_ROOT="$ROOT" node --import tsx --import ./gate/upstream.mjs \
  scripts/regen-round-trip-baseline.ts --report --fail-on-worse
