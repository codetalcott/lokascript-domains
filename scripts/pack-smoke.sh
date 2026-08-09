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

// The installed d.ts must be self-contained: no private package names, no
// relative imports whose target didn't ship, no undeclared bare deps. The
// 2.11.0 publish shipped d.ts re-exporting from './parser/...' trees that
// never shipped — consumers' types silently degraded to `any` (skipLibCheck).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
const distDir = join(process.cwd(), 'node_modules/@lokascript/domains/dist');
const pkg = JSON.parse(readFileSync(join(distDir, '../package.json'), 'utf8'));
const deps = new Set(Object.keys(pkg.dependencies ?? {}));
const dtsOffenders = [];
for (const f of readdirSync(distDir).filter(f => /\.d\.(c)?ts$/.test(f))) {
  const src = readFileSync(join(distDir, f), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs = [...src.matchAll(/from\s+['"]([^'"]+)['"]/g),
                 ...src.matchAll(/import\s+['"]([^'"]+)['"]/g),
                 ...src.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m => m[1]);
  for (const spec of specs) {
    if (/^@lokascript\/domain-/.test(spec)) dtsOffenders.push(`${f}: private ${spec}`);
    else if (spec.startsWith('.')) {
      const base = join(distDir, dirname(f), spec);
      const ok = [base.replace(/\.js$/, '.d.ts'), base.replace(/\.js$/, '.d.cts'),
                  `${base}.d.ts`, base, join(base, 'index.d.ts')].some(existsSync);
      if (!ok) dtsOffenders.push(`${f}: unresolved ${spec}`);
    } else {
      const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (!deps.has(name)) dtsOffenders.push(`${f}: undeclared dep ${spec}`);
    }
  }
}
if (dtsOffenders.length) throw new Error(`d.ts integrity failed:\n${dtsOffenders.join('\n')}`);

console.log(`PACK SMOKE OK — ${DOMAIN_PRIORITY.length} registry domains, ${SUBPATHS.length} subpaths load`);
EOF

node smoke.mjs
