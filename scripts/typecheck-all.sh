#!/usr/bin/env bash
# Typecheck every package with a typecheck script. Generated list, not hand-maintained.
set -uo pipefail
cd "$(dirname "$0")/.."

failed=0
for pkg in packages/*/; do
  d=$(basename "$pkg")
  if node -e "process.exit(require('./$pkg/package.json').scripts?.typecheck?0:1)" 2>/dev/null; then
    echo "=== typecheck: $d ==="
    npm run typecheck --prefix "$pkg" || { echo "FAIL: $d"; failed=1; }
  fi
done
exit $failed
