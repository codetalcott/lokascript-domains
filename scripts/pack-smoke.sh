#!/usr/bin/env bash
# Pack-and-install smoke for the @lokascript/domains aggregate: npm pack the
# built package, install the tarball into a clean temp dir (framework/semantic
# resolve from the registry, exactly like a consumer), and run the smoke.
# Guards the class of failure workspace symlinks can never see: missing dist
# chunks in `files`, d.ts that reference private package names, exports-map
# typos. NEVER pipe this through tail/head — the pipeline exit code lies.
set -euo pipefail
cd "$(dirname "$0")/.."

PKG_DIR="packages/domains"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

TARBALL="$(cd "$PKG_DIR" && npm pack --pack-destination "$TMP" --silent)"
echo "packed: $TARBALL"

cd "$TMP"
npm init -y >/dev/null
npm pkg set type=module >/dev/null
npm install --no-audit --no-fund --silent "./$TARBALL"

cat > smoke.mjs <<'EOF'
import { createSQLDSL } from '@lokascript/domains/sql';
import { registerAllDomains, createDomainRegistry, DOMAIN_PRIORITY } from '@lokascript/domains';
import { DomainRegistry } from '@lokascript/framework';

const r = createSQLDSL().compile('select name from users', 'en');
if (!r.ok || !/select/i.test(String(r.code))) {
  throw new Error(`compile smoke failed: ${JSON.stringify(r)}`);
}

const reg = new DomainRegistry();
await registerAllDomains(reg);
const resp = await reg.handleToolCall('parse_sql', {
  query: 'select name from users',
  language: 'en',
});
const payload = JSON.parse(resp.content[0].text);
if (payload.action !== 'select') throw new Error(`dispatch smoke failed: ${resp.content[0].text}`);

const schemas = reg.getSchemas('sql');
if (!schemas || schemas.length === 0) throw new Error('schema attach failed');

if (!createDomainRegistry().canHandle('parse_flow')) {
  throw new Error('createDomainRegistry smoke failed');
}

// Every subpath export must load from the installed copy.
const SUBPATHS = ['sql','flow','bdd','behaviorspec','jsx','llm','todo','voice','learn',
                  'animation','control','events','html','hypermedia','sprites'];
for (const s of SUBPATHS) {
  const mod = await import(`@lokascript/domains/${s}`);
  if (!mod.allSchemas) throw new Error(`subpath ${s}: allSchemas missing`);
}

console.log(`PACK SMOKE OK — ${DOMAIN_PRIORITY.length} registry domains, ${SUBPATHS.length} subpaths load`);
EOF

node smoke.mjs
