/**
 * d.ts integrity for the aggregate's published types.
 *
 * The 2.11.0 publish shipped subpath d.ts whose types silently degraded to
 * `any` for consumers: the private domain packages' `build:types` step
 * (`tsc --emitDeclarationOnly --noEmit false`) overwrote tsup's BUNDLED
 * index.d.ts with a per-module tsc tree, and the aggregate's dts `resolve`
 * inlines that tree's root without following its relative imports
 * (`from './parser/spec-parser.js'`) — whose targets never ship. Consumers
 * all compile with skipLibCheck, so the unresolved imports never error; the
 * types just turn to `any` (surfaced as implicit-any noise in
 * lokascript-examples' test-writer, invisible here).
 *
 * The runtime-side guards (dist-identity, pack-smoke) never read the d.ts,
 * so this asserts the type surface directly: every emitted declaration file
 * must be self-contained — no private `@lokascript/domain-*` names, and any
 * relative import must resolve to a declaration file that ships in dist.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const DIST = resolve(__dirname, '../../dist');

/** Strip block and line comments — JSDoc examples legitimately show old package names. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** All import specifiers in a d.ts: `from '...'`, `import '...'`, and inline `import('...')`. */
function importSpecifiers(rawSource: string): string[] {
  const source = stripComments(rawSource);
  const specs: string[] = [];
  for (const re of [
    /from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]) {
    for (const m of source.matchAll(re)) specs.push(m[1]);
  }
  return specs;
}

/** Resolve a relative d.ts import the way tsc would, to a shippable file. */
function relativeTargetExists(fromFile: string, spec: string): boolean {
  const base = join(dirname(fromFile), spec);
  const candidates = [
    base.replace(/\.js$/, '.d.ts'),
    base.replace(/\.js$/, '.d.cts'),
    `${base}.d.ts`,
    base,
    join(base, 'index.d.ts'),
  ];
  return candidates.some(c => existsSync(c));
}

const declarationFiles = readdirSync(DIST).filter(f => f.endsWith('.d.ts') || f.endsWith('.d.cts'));

/** Bare d.ts imports must be resolvable by consumers, i.e. declared dependencies. */
const declaredDeps = new Set(
  Object.keys(
    (JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
    }).dependencies ?? {}
  )
);

function packageNameOf(spec: string): string {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

describe('every shipped d.ts is self-contained', () => {
  it('dist contains declaration files at all', () => {
    expect(declarationFiles.length).toBeGreaterThan(0);
  });

  for (const file of declarationFiles) {
    it(`${file}: no private package names, all relative imports resolve`, () => {
      const path = join(DIST, file);
      const source = readFileSync(path, 'utf8');
      const offenders: string[] = [];
      for (const spec of importSpecifiers(source)) {
        if (/^@lokascript\/domain-/.test(spec)) {
          offenders.push(`private package: ${spec}`);
        } else if (spec.startsWith('.')) {
          if (!relativeTargetExists(path, spec)) {
            offenders.push(`unresolved relative import: ${spec}`);
          }
        } else if (!declaredDeps.has(packageNameOf(spec))) {
          offenders.push(`undeclared dependency: ${spec}`);
        }
      }
      expect(offenders, offenders.join('\n')).toEqual([]);
    });
  }
});
