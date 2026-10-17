/**
 * The domain gate: every command of every domain, written in each of its languages by its own renderer
 * and read back by its own parser, against the BUILT aggregate (`../dist`, what consumers install).
 *
 * The cases, outcomes, baseline and parse snapshot are framework's round-trip gate kit
 * (`@lokascript/framework/testing/gate`, which this file used to hold: hyperfixi domains rethink
 * Phase 4.6). What stays here is the domains' own: which domains, how each loads from the dist, the
 * values each role is written with (`values.ts`), the upstream versions a baseline records, and where
 * the baselines live. The baseline (`baselines/round-trip.json`) lists every case that is not at its
 * best outcome; the gate fails on a case worse than listed and on one better than listed. Regenerate:
 * `npm run gate:regen`.
 */
import {
  commandsFor as kitCommandsFor,
  runRoundTrip,
  type CaseKind,
  type CaseResult,
  type GateBaseline,
  type GateDSL,
  type GateSchema,
  type ParseSnapshot,
} from '@lokascript/framework/testing/gate';
import { DOMAIN_VALUES } from './values.js';

export {
  BEST,
  RANK,
  UNKNOWN_WORD,
  compare,
  countsOf,
  listingOf,
  referenceCode,
  snapshotChanges,
  snapshotOf,
  summarize,
  type CaseResult,
  type Drift,
  type DriftCase,
  type ListedCase,
  type Outcome,
  type SnapshotChange,
} from '@lokascript/framework/testing/gate';

export const DOMAINS = ['behaviorspec', 'flow', 'learn', 'llm', 'sql', 'todo', 'voice'] as const;
export type Domain = (typeof DOMAINS)[number];

export type Kind = CaseKind;
export type Baseline = GateBaseline;
export type Snapshot = ParseSnapshot;

export async function loadDomain(domain: Domain): Promise<{ dsl: GateDSL; schemas: GateSchema[] }> {
  const mod: Record<string, unknown> = await import(`../dist/${domain}.js`);
  const factory = Object.keys(mod).find(k => /^create\w*DSL$/.test(k));
  if (!factory) throw new Error(`no DSL factory in dist/${domain}.js`);
  const schemas = mod.allSchemas as GateSchema[] | undefined;
  if (!Array.isArray(schemas)) throw new Error(`no allSchemas in dist/${domain}.js`);
  return { dsl: (mod[factory] as () => GateDSL)(), schemas };
}

/** The commands a domain is checked on (the kit's `commandsFor`, with the domain's values). */
export function commandsFor(domain: Domain, schemas: readonly GateSchema[]): string[] {
  return kitCommandsFor(schemas, DOMAIN_VALUES[domain]);
}

export async function runDomain(domain: Domain): Promise<CaseResult[]> {
  const { dsl, schemas } = await loadDomain(domain);
  return runRoundTrip(domain, dsl, schemas, DOMAIN_VALUES[domain]);
}

/** The upstream versions installed here: what a baseline measured. */
export async function upstreamVersions(): Promise<Record<string, string>> {
  const { createRequire } = await import('node:module');
  const { existsSync, readFileSync } = await import('node:fs');
  const { dirname, join } = await import('node:path');
  // Under scripts/gate-upstream.sh, resolve from the unpacked tarballs, as the resolve hook does.
  const upstreamRoot = process.env.GATE_UPSTREAM_ROOT;
  const require = createRequire(upstreamRoot ? join(upstreamRoot, 'resolver.js') : import.meta.url);
  const out: Record<string, string> = {};
  for (const name of ['@lokascript/framework', '@lokascript/semantic', '@lokascript/intent']) {
    // `./package.json` is not in their exports: walk up from the entry to the manifest.
    let dir = dirname(require.resolve(name));
    while (
      !existsSync(join(dir, 'package.json')) ||
      readManifest(join(dir, 'package.json')).name !== name
    ) {
      const up = dirname(dir);
      if (up === dir) throw new Error(`no package.json for ${name}`);
      dir = up;
    }
    out[name] = readManifest(join(dir, 'package.json')).version;
  }
  return out;

  function readManifest(path: string): { name?: string; version: string } {
    return JSON.parse(readFileSync(path, 'utf8')) as { name?: string; version: string };
  }
}

export const BASELINE_PATH = new URL('../baselines/round-trip.json', import.meta.url);
export const SNAPSHOT_PATH = new URL('../baselines/parse-snapshot.json', import.meta.url);
