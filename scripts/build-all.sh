#!/usr/bin/env bash
# Topological build: the 7 domains -> domain-config
# (depends on all 7) -> domains (the published aggregate).
set -euo pipefail
cd "$(dirname "$0")/.."

ORDER=(
  domain-sql domain-behaviorspec domain-llm
  domain-todo domain-flow domain-voice domain-learn
  domain-config
  domains
)

for d in "${ORDER[@]}"; do
  echo "=== build: $d ==="
  npm run build --prefix "packages/$d"
done
