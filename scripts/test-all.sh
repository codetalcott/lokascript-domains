#!/usr/bin/env bash
# Compact test gate over every package with a test:check script.
# The package list is generated, not hand-maintained: every packages/* dir
# with a test:check script runs; a dir without one is reported as skipped.
set -uo pipefail
cd "$(dirname "$0")/.."

failed=0
for pkg in packages/*/; do
  d=$(basename "$pkg")
  if node -e "process.exit(require('./$pkg/package.json').scripts?.['test:check']?0:1)" 2>/dev/null; then
    echo "=== test: $d ==="
    if ! npm run test:check --prefix "$pkg"; then
      echo "FAIL: $d"
      failed=1
    fi
  else
    echo "=== skip (no test:check): $d ==="
  fi
done
exit $failed
