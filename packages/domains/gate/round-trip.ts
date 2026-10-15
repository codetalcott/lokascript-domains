/**
 * The domain gate: every command of every domain, written in each of its languages by its own renderer
 * and read back by its own parser, against the BUILT aggregate (`../dist`, what consumers install).
 *
 * A case is a command (bracket syntax, parsed in English) and a language:
 *
 * - **round trip**: `render(ref, lang)`, then `parse`. `pass` when the parse is the reference node, or,
 *   for a domain whose compiled output does not depend on the language, when the text compiles to what
 *   the command itself (its bracket form) compiles to (a parser may keep a translated word that the
 *   generator normalizes: bdd ja `#box0 が 表示 前提` is `visible`). English is a lane like the others.
 *   `refused` when the render is null or the parse throws: the caller is told. `silent` otherwise: it
 *   reads, or compiles to, something else.
 * - **leftover**: the same render plus one unknown word. `refused` is the expected outcome; a parse
 *   that returns accepted input it did not read (`silent`).
 *
 * The outcomes are the command-shape gate's (hyperfixi `testing-framework`). The baseline
 * (`baselines/round-trip.json`) lists every case that is not at its best outcome; the gate fails on a
 * case worse than listed and on one better than listed. Regenerate: `npm run gate:regen`.
 */
import { DOMAIN_VALUES, type DomainFixture } from './values.js';

export const DOMAINS = [
  'bdd',
  'behaviorspec',
  'flow',
  'learn',
  'llm',
  'sql',
  'todo',
  'voice',
] as const;
export type Domain = (typeof DOMAINS)[number];

export type Outcome = 'pass' | 'refused' | 'silent';
export type Kind = 'roundTrip' | 'leftover';

/** Best first. A round trip's best is `pass`; leftover input's is `refused`. */
export const RANK: Record<Kind, Record<Outcome, number>> = {
  roundTrip: { pass: 2, refused: 1, silent: 0 },
  leftover: { refused: 2, pass: 2, silent: 0 },
};
export const BEST: Record<Kind, Outcome> = { roundTrip: 'pass', leftover: 'refused' };

/** Appended for the leftover cases: a word no domain's vocabulary has. */
export const UNKNOWN_WORD = 'zzqx';

export interface CaseResult {
  domain: Domain;
  kind: Kind;
  /** The command, in bracket syntax (read in English). */
  source: string;
  lang: string;
  outcome: Outcome;
  /** What the renderer wrote (plus the unknown word, for leftover). */
  text?: string;
  /** Why it is not `pass`: the error, or what the parse read instead. */
  why?: string;
  /** The round trip's parse, summarized (`summarize`); absent when it was refused. */
  read?: string;
}

interface RoleSpec {
  role: string;
  required?: boolean;
  expectedTypes?: string[];
}
interface Schema {
  action: string;
  roles: RoleSpec[];
}
interface Node {
  action: string;
  roles: Map<string, unknown> | Record<string, unknown>;
}
interface DSL {
  parse(input: string, language: string): Node;
  compile(input: string, language: string): { ok: boolean; code?: string; errors?: string[] };
  render?(node: Node, language: string): string | null;
  getSupportedLanguages(): string[];
}

export async function loadDomain(domain: Domain): Promise<{ dsl: DSL; schemas: Schema[] }> {
  const mod: Record<string, unknown> = await import(`../dist/${domain}.js`);
  const factory = Object.keys(mod).find(k => /^create\w*DSL$/.test(k));
  if (!factory) throw new Error(`no DSL factory in dist/${domain}.js`);
  const schemas = mod.allSchemas as Schema[] | undefined;
  if (!Array.isArray(schemas)) throw new Error(`no allSchemas in dist/${domain}.js`);
  return { dsl: (mod[factory] as () => DSL)(), schemas };
}

/** A value no vocabulary uses: a selector where only a selector fits, a plain name otherwise. */
function defaultValue(role: RoleSpec, i: number): string {
  const types = role.expectedTypes ?? [];
  if (types.includes('selector') && !types.includes('literal') && !types.includes('expression'))
    return `#box${i}`;
  return `v${i}x`;
}

function valuesFor(fixture: DomainFixture, action: string, role: RoleSpec, i: number): string[] {
  return (
    fixture.values[`${action}.${role.role}`] ?? fixture.values[role.role] ?? [defaultValue(role, i)]
  );
}

/**
 * The commands a domain is checked on: for each schema, its required roles alone and all its roles
 * (each with its first value), then each further value of a role that takes fixed words, alone.
 */
export function commandsFor(domain: Domain, schemas: Schema[]): string[] {
  const fixture = DOMAIN_VALUES[domain];
  const out = new Set<string>();
  for (const schema of schemas) {
    const required = schema.roles.filter(r => r.required);
    const variants =
      required.length === schema.roles.length ? [required] : [required, schema.roles];
    for (const roles of variants) {
      const values = roles.map((r, i) => valuesFor(fixture, schema.action, r, i));
      const write = (pick: string[]) =>
        `[${schema.action}${roles.map((r, i) => ` ${r.role}:${pick[i]}`).join('')}]`;
      const first = values.map(v => v[0]);
      out.add(write(first));
      values.forEach((vs, i) => {
        for (const v of vs.slice(1)) out.add(write(first.map((f, j) => (j === i ? v : f))));
      });
    }
  }
  return [...out];
}

function roleValues(node: Node): Record<string, string> {
  const entries = node.roles instanceof Map ? [...node.roles] : Object.entries(node.roles ?? {});
  return Object.fromEntries(
    entries
      .map(([k, v]): [string, string] => [
        k,
        String((v as { value?: unknown })?.value ?? (v as { raw?: unknown })?.raw ?? v),
      ])
      .sort(([a], [b]) => (a < b ? -1 : 1))
  );
}

/** A parse as one line: `action role:type=value …`, roles sorted. What the parse snapshot records. */
export function summarize(node: Node): string {
  const entries = node.roles instanceof Map ? [...node.roles] : Object.entries(node.roles ?? {});
  const roles = entries
    .map(([k, v]) => {
      const t = (v as { type?: unknown })?.type;
      const raw = (v as { value?: unknown })?.value ?? (v as { raw?: unknown })?.raw ?? v;
      const text = String(raw);
      return `${k}${t ? `:${String(t)}` : ''}=${/[\s=]/.test(text) ? JSON.stringify(text) : text}`;
    })
    .sort();
  return [node.action, ...roles].join(' ');
}

function describeRead(want: Record<string, string>, ref: Node, back: Node): string {
  if (back.action !== ref.action) return `another command: ${back.action}`;
  const got = roleValues(back);
  const lost = Object.keys(want).filter(k => !(k in got));
  const added = Object.keys(got).filter(k => !(k in want));
  const changed = Object.keys(want).filter(k => k in got && got[k] !== want[k]);
  const parts = [
    ...lost.map(k => `${k} lost`),
    ...added.map(k => `${k} added (${got[k]})`),
    ...changed.map(k => `${k}: ${got[k]}`),
  ];
  return parts.join(', ');
}

const message = (e: unknown) => String((e as Error)?.message ?? e).slice(0, 160);

/** What a command (bracket syntax) compiles to; null when it does not compile on its own. */
export function referenceCode(dsl: DSL, source: string): string | null {
  try {
    const c = dsl.compile(source, 'en');
    return c.ok && typeof c.code === 'string' ? c.code : null;
  } catch {
    return null;
  }
}

export async function runDomain(domain: Domain): Promise<CaseResult[]> {
  const { dsl, schemas } = await loadDomain(domain);
  const { oracle } = DOMAIN_VALUES[domain];
  const languages = dsl.getSupportedLanguages();
  const results: CaseResult[] = [];

  for (const source of commandsFor(domain, schemas)) {
    const ref = dsl.parse(source, 'en');
    const want = roleValues(ref);
    const sameNode = (back: Node) =>
      back.action === ref.action && JSON.stringify(roleValues(back)) === JSON.stringify(want);

    // The code the command itself compiles to: its bracket form, not its English render, or the English
    // lane would be measured against itself (bdd's `When double-click` reads `double`, and compiled to a
    // comment that every correct language then "differed" from). Null when the command does not compile
    // alone; then only the node can pass.
    const refCode = oracle === 'compile' ? referenceCode(dsl, source) : null;

    for (const lang of languages) {
      const at = { domain, source, lang };
      const text = dsl.render?.(ref, lang) ?? null;
      if (!text) {
        results.push({ ...at, kind: 'roundTrip', outcome: 'refused', why: 'no render' });
        continue;
      }
      let back: Node;
      try {
        back = dsl.parse(text, lang);
      } catch (e) {
        results.push({ ...at, kind: 'roundTrip', outcome: 'refused', text, why: message(e) });
        continue;
      }

      let outcome: Outcome = 'silent';
      let why: string | undefined;
      if (sameNode(back)) outcome = 'pass';
      else if (refCode !== null) {
        let code: string | undefined;
        try {
          const c = dsl.compile(text, lang);
          code = c.ok ? c.code : undefined;
        } catch {
          code = undefined;
        }
        if (code === refCode) outcome = 'pass';
        else why = `compiles differently; reads ${describeRead(want, ref, back)}`;
      } else why = `reads ${describeRead(want, ref, back)}`;
      results.push({
        ...at,
        kind: 'roundTrip',
        outcome,
        text,
        ...(why ? { why } : {}),
        read: summarize(back),
      });

      // Leftover input: only where the text itself reads, or a refusal would say nothing.
      const extended = `${text} ${UNKNOWN_WORD}`;
      try {
        const read = dsl.parse(extended, lang);
        results.push({
          ...at,
          kind: 'leftover',
          outcome: 'silent',
          text: extended,
          why: `accepted as ${read.action}`,
        });
      } catch {
        results.push({ ...at, kind: 'leftover', outcome: 'refused', text: extended });
      }
    }
  }
  return results;
}

// ---------------------------------------------------------------------------------------------------
// The baseline
// ---------------------------------------------------------------------------------------------------

export interface ListedCase {
  outcome: Exclude<Outcome, 'pass'>;
  text?: string;
  why?: string;
}

export interface Baseline {
  /** The upstream packages this was measured on (the domains repo's lockfile). */
  upstream: Record<string, string>;
  /** Per domain and kind: cases and outcomes. Written by the regen tool for the reader; not checked. */
  counts: Record<string, Record<Kind, Record<Outcome | 'cases', number>>>;
  /** Per domain, command and language: every round trip that is not `pass`. */
  roundTrip: Record<string, Record<string, Record<string, ListedCase>>>;
  /** Per domain and command: the languages whose leftover case was accepted (`silent`). */
  leftover: Record<string, Record<string, string[]>>;
}

export interface DriftCase {
  kind: Kind;
  source: string;
  lang: string;
  listed: Outcome;
  now: Outcome;
  text?: string;
  why?: string;
}

export interface Drift {
  worse: DriftCase[];
  better: DriftCase[];
  /** Listed cases that are no longer cases at all. */
  stale: { kind: Kind; source: string; lang: string }[];
}

function listedOutcome(
  baseline: Baseline,
  r: Pick<CaseResult, 'domain' | 'kind' | 'source' | 'lang'>
): Outcome {
  if (r.kind === 'roundTrip')
    return baseline.roundTrip[r.domain]?.[r.source]?.[r.lang]?.outcome ?? 'pass';
  return baseline.leftover[r.domain]?.[r.source]?.includes(r.lang) ? 'silent' : 'refused';
}

export function compare(domain: Domain, results: CaseResult[], baseline: Baseline): Drift {
  const drift: Drift = { worse: [], better: [], stale: [] };
  const seen = new Set<string>();
  for (const r of results) {
    seen.add(`${r.kind}\u0000${r.source}\u0000${r.lang}`);
    const listed = listedOutcome(baseline, r);
    const rank = RANK[r.kind];
    const entry = { kind: r.kind, source: r.source, lang: r.lang, listed, now: r.outcome };
    if (rank[r.outcome] < rank[listed]) drift.worse.push({ ...entry, text: r.text, why: r.why });
    else if (rank[r.outcome] > rank[listed]) drift.better.push(entry);
  }
  const listedCases: { kind: Kind; source: string; lang: string }[] = [
    ...Object.entries(baseline.roundTrip[domain] ?? {}).flatMap(([source, langs]) =>
      Object.keys(langs).map(lang => ({ kind: 'roundTrip' as const, source, lang }))
    ),
    ...Object.entries(baseline.leftover[domain] ?? {}).flatMap(([source, langs]) =>
      langs.map(lang => ({ kind: 'leftover' as const, source, lang }))
    ),
  ];
  for (const c of listedCases)
    if (!seen.has(`${c.kind}\u0000${c.source}\u0000${c.lang}`)) drift.stale.push(c);
  return drift;
}

/** The baseline entries for one domain's results. */
export function listingOf(results: CaseResult[]): {
  roundTrip: Record<string, Record<string, ListedCase>>;
  leftover: Record<string, string[]>;
} {
  const roundTrip: Record<string, Record<string, ListedCase>> = {};
  const leftover: Record<string, string[]> = {};
  for (const r of results) {
    if (r.kind === 'roundTrip' && r.outcome !== 'pass') {
      (roundTrip[r.source] ??= {})[r.lang] = {
        outcome: r.outcome,
        ...(r.text ? { text: r.text } : {}),
        ...(r.why ? { why: r.why } : {}),
      };
    } else if (r.kind === 'leftover' && r.outcome === 'silent')
      (leftover[r.source] ??= []).push(r.lang);
  }
  return { roundTrip, leftover };
}

export function countsOf(results: CaseResult[]): Record<Kind, Record<Outcome | 'cases', number>> {
  const counts = {
    roundTrip: { cases: 0, pass: 0, refused: 0, silent: 0 },
    leftover: { cases: 0, pass: 0, refused: 0, silent: 0 },
  };
  for (const r of results) {
    counts[r.kind].cases++;
    counts[r.kind][r.outcome]++;
  }
  return counts;
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

// ---------------------------------------------------------------------------------------------------
// The parse snapshot
// ---------------------------------------------------------------------------------------------------

/**
 * Every round trip's parse, so a change that moves a parse shows it, whether or not an outcome moved
 * (a value's type, a role a passing case gained, what a silent case reads now). `refused` where the
 * parse threw. Leftover cases are not in it: their outcome is the baseline's.
 */
export interface Snapshot {
  upstream: Record<string, string>;
  /** Per domain, command and language. */
  parses: Record<string, Record<string, Record<string, string>>>;
}

export const SNAPSHOT_PATH = new URL('../baselines/parse-snapshot.json', import.meta.url);

export function snapshotOf(results: CaseResult[]): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  for (const r of results)
    if (r.kind === 'roundTrip') (out[r.source] ??= {})[r.lang] = r.read ?? 'refused';
  return out;
}

export interface SnapshotChange {
  source: string;
  lang: string;
  was?: string;
  now?: string;
}

export function snapshotChanges(
  domain: Domain,
  results: CaseResult[],
  snapshot: Snapshot
): SnapshotChange[] {
  const now = snapshotOf(results);
  const was = snapshot.parses[domain] ?? {};
  const changes: SnapshotChange[] = [];
  for (const source of new Set([...Object.keys(was), ...Object.keys(now)]))
    for (const lang of new Set([
      ...Object.keys(was[source] ?? {}),
      ...Object.keys(now[source] ?? {}),
    ])) {
      const a = was[source]?.[lang];
      const b = now[source]?.[lang];
      if (a !== b) changes.push({ source, lang, was: a, now: b });
    }
  return changes;
}
