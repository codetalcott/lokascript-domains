/**
 * The parse snapshot (Phase 2 step 4 of hyperfixi's docs-internal/DOMAINS_RETHINK.md): every round
 * trip's parse, as one line, in `baselines/parse-snapshot.json`. Fails on any parse that moved, so a
 * change shows what it moved even where no gate outcome did. If the moves are intended:
 * `npm run gate:regen`, and the snapshot's diff is the review.
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import {
  DOMAINS,
  SNAPSHOT_PATH,
  runDomain,
  snapshotChanges,
  type Snapshot,
} from '../../gate/round-trip.js';

const snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as Snapshot;

describe.each(DOMAINS)('%s', domain => {
  it('every round trip parses as the snapshot records', async () => {
    const changes = snapshotChanges(domain, await runDomain(domain), snapshot);
    const shown = changes
      .slice(0, 30)
      .map(
        c =>
          `  ${c.lang} ${c.source}\n      was: ${c.was ?? '(new)'}\n      now: ${c.now ?? '(gone)'}`
      )
      .join('\n');
    expect(
      changes,
      `${changes.length} parse(s) moved; if intended, \`npm run gate:regen\`:\n${shown}`
    ).toEqual([]);
  });
});
