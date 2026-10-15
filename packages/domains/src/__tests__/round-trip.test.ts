/**
 * The domain gate (Phase 2 of hyperfixi's docs-internal/DOMAINS_RETHINK.md): every command of every
 * domain, rendered in each of its languages and read back, plus each render with one unknown word
 * after it. See `gate/round-trip.ts` for the outcomes.
 *
 * Fails on a case worse than `baselines/round-trip.json` lists, on one better (prune the baseline),
 * and on a listed case that no longer exists. After a change: `npm run gate:regen` (it refuses to
 * write a worse case without `--allow-new`). Runs on the BUILT dist, like dist-identity.
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import {
  DOMAINS,
  BASELINE_PATH,
  commandsFor,
  compare,
  loadDomain,
  runDomain,
  upstreamVersions,
  type Baseline,
  type DriftCase,
} from '../../gate/round-trip.js';
import { DOMAIN_VALUES } from '../../gate/values.js';

const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline;

const show = (cases: DriftCase[]) =>
  cases
    .map(
      c =>
        `  ${c.kind} ${c.lang} ${c.source}: ${c.listed} → ${c.now}` +
        (c.text ? `\n      ${JSON.stringify(c.text)}` : '') +
        (c.why ? `\n      ${c.why}` : '')
    )
    .join('\n');

describe.each(DOMAINS)('%s', domain => {
  it('no case is worse than the baseline, none better, none stale', async () => {
    const drift = compare(domain, await runDomain(domain), baseline);
    const upstream = await upstreamVersions();
    const measuredOn =
      JSON.stringify(upstream) === JSON.stringify(baseline.upstream)
        ? ''
        : `\n(the baseline was measured on ${JSON.stringify(baseline.upstream)}; installed: ${JSON.stringify(upstream)})`;
    expect(
      drift.worse,
      `${drift.worse.length} case(s) worse than the baseline:\n${show(drift.worse)}${measuredOn}`
    ).toEqual([]);
    expect(
      drift.better,
      `${drift.better.length} case(s) better than the baseline; prune it with \`npm run gate:regen\`:\n${show(drift.better)}${measuredOn}`
    ).toEqual([]);
    expect(drift.stale, 'listed cases that no longer exist; `npm run gate:regen`').toEqual([]);
  });

  it("every value in the gate's table names a role the domain has", async () => {
    const { schemas } = await loadDomain(domain);
    const roles = new Set(schemas.flatMap(s => s.roles.map(r => r.role)));
    const actionRoles = new Set(schemas.flatMap(s => s.roles.map(r => `${s.action}.${r.role}`)));
    const unknown = Object.keys(DOMAIN_VALUES[domain].values).filter(k =>
      k.includes('.') ? !actionRoles.has(k) : !roles.has(k)
    );
    expect(unknown, 'keys in gate/values.ts that name no role (a renamed role?)').toEqual([]);
  });

  it.runIf(DOMAIN_VALUES[domain].oracle === 'compile')(
    'every command compiles in English (or the gate cannot compare code)',
    async () => {
      const { dsl, schemas } = await loadDomain(domain);
      const exempt = new Set(DOMAIN_VALUES[domain].englishDoesNotCompile ?? []);
      const failing: string[] = [];
      for (const source of commandsFor(domain, schemas)) {
        const ref = dsl.parse(source, 'en');
        if (exempt.has(ref.action)) continue;
        const english = dsl.render?.(ref, 'en');
        let ok = false;
        try {
          ok = !!english && dsl.compile(english, 'en').ok;
        } catch {
          ok = false;
        }
        if (!ok) failing.push(`${source} (${JSON.stringify(english)})`);
      }
      expect(failing).toEqual([]);
    }
  );
});
