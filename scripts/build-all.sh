#!/usr/bin/env bash
# Topological build: toolkit (dev harness) -> the 16 domains -> domain-config
# (depends on 9 of them) -> mcp-multilingual-intent (private MCP surface).
set -euo pipefail
cd "$(dirname "$0")/.."

ORDER=(
  domain-toolkit
  domain-sql domain-bdd domain-behaviorspec domain-jsx domain-llm
  domain-todo domain-flow domain-voice domain-learn
  domain-events domain-animation domain-control domain-html domain-hypermedia
  domain-sprites
  domain-config
  domains
  mcp-multilingual-intent
)

for d in "${ORDER[@]}"; do
  echo "=== build: $d ==="
  npm run build --prefix "packages/$d"
done
