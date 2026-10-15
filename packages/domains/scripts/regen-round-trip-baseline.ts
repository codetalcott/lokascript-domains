/**
 * Regenerate `baselines/round-trip.json` and `baselines/parse-snapshot.json` from the built dist (`npm run gate:regen`, which rebuilds
 * first), or report without writing (`--report`).
 *
 * Refuses to write when a case is worse than the current baseline lists, unless `--allow-new`: a new
 * failure is a regression to fix, or a decision to record, not something a regen should absorb.
 * Prints, per domain, the round trip and leftover counts, and the queue: non-pass round trips grouped
 * by language and by what went wrong.
 *
 *   npm run gate:regen                    # write (refuses a worse case)
 *   npm run gate:regen -- --allow-new     # write, recording worse cases
 *   npm run gate:regen -- --report        # print only
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import {
  BASELINE_PATH,
  DOMAINS,
  SNAPSHOT_PATH,
  compare,
  countsOf,
  listingOf,
  runDomain,
  snapshotChanges,
  snapshotOf,
  upstreamVersions,
  type Baseline,
  type CaseResult,
  type Snapshot,
} from '../gate/round-trip.js';

const args = new Set(process.argv.slice(2));
const report = args.has('--report');
const allowNew = args.has('--allow-new');

const previous: Baseline | null = existsSync(BASELINE_PATH)
  ? (JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline)
  : null;

const next: Baseline = {
  upstream: await upstreamVersions(),
  counts: {},
  roundTrip: {},
  leftover: {},
};
const previousSnapshot: Snapshot | null = existsSync(SNAPSHOT_PATH)
  ? (JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as Snapshot)
  : null;
const nextSnapshot: Snapshot = { upstream: next.upstream, parses: {} };
let worse = 0;
let better = 0;
let moved = 0;

/** The first clause of a reason, for grouping: "No pattern matched…", "compiles differently", … */
const family = (r: CaseResult) =>
  r.outcome === 'refused'
    ? /no render/.test(r.why ?? '')
      ? 'no render'
      : 'does not read its own render'
    : (r.why ?? '').split(';')[0];

for (const domain of DOMAINS) {
  const results = await runDomain(domain);
  const counts = countsOf(results);
  next.counts[domain] = counts;
  const listing = listingOf(results);
  if (Object.keys(listing.roundTrip).length) next.roundTrip[domain] = listing.roundTrip;
  if (Object.keys(listing.leftover).length) next.leftover[domain] = listing.leftover;
  nextSnapshot.parses[domain] = snapshotOf(results);

  const rt = counts.roundTrip;
  console.log(
    `${domain.padEnd(13)} round trip ${rt.pass}/${rt.cases} (${rt.refused} refused, ${rt.silent} silent); ` +
      `leftover accepted ${counts.leftover.silent}/${counts.leftover.cases}`
  );
  const failing = results.filter(r => r.kind === 'roundTrip' && r.outcome !== 'pass');
  const byLang = new Map<string, number>();
  const byFamily = new Map<string, number>();
  for (const r of failing) {
    byLang.set(r.lang, (byLang.get(r.lang) ?? 0) + 1);
    const f = `${r.outcome}: ${family(r)}`;
    byFamily.set(f, (byFamily.get(f) ?? 0) + 1);
  }
  if (failing.length) {
    const sorted = (m: Map<string, number>) =>
      [...m].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`);
    console.log(`  by language: ${sorted(byLang).join(', ')}`);
    for (const f of sorted(byFamily)) console.log(`  ${f}`);
  }

  if (previous) {
    const drift = compare(domain, results, previous);
    worse += drift.worse.length;
    better += drift.better.length;
    for (const c of drift.worse)
      console.log(
        `  WORSE ${c.kind} ${c.lang} ${c.source}: ${c.listed} → ${c.now} (${c.why ?? ''})`
      );
    if (drift.better.length) console.log(`  better than listed: ${drift.better.length}`);
  }
  if (previousSnapshot) {
    const changes = snapshotChanges(domain, results, previousSnapshot);
    moved += changes.length;
    for (const c of changes.slice(0, 20))
      console.log(`  parse ${c.lang} ${c.source}: ${c.was ?? '(new)'} → ${c.now ?? '(gone)'}`);
    if (changes.length > 20) console.log(`  … ${changes.length - 20} more parses moved`);
  }
}

if (report) process.exit(0);
if (worse && !allowNew) {
  console.error(
    `\nRefusing to write: ${worse} case(s) worse than the baseline. Fix them, or record them with --allow-new.`
  );
  process.exit(1);
}
writeFileSync(BASELINE_PATH, `${JSON.stringify(next, null, 2)}\n`);
writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(nextSnapshot, null, 2)}\n`);
console.log(
  `\nWrote ${BASELINE_PATH.pathname}${previous ? ` (${better} better, ${worse} worse than before)` : ''}`
);
console.log(`Wrote ${SNAPSHOT_PATH.pathname}${previousSnapshot ? ` (${moved} parses moved)` : ''}`);
