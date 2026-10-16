/**
 * Regenerate the golden pattern snapshot for domain-behaviorspec.
 *
 * Captures the patterns `createBehaviorSpecDSL()` reads with (on the core: the
 * schema-pattern generator's) for every registered language × every schema.
 * The parity test (`src/__test__/pattern-parity.test.ts`) asserts the live
 * patterns are byte-identical to this snapshot, so any change to profiles,
 * schemas, or the framework generator shows up as a reviewable golden-file diff.
 *
 * Run from packages/domain-behaviorspec:
 *   npx tsx scripts/generate-golden-patterns.ts
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allSchemas } from '../src/schemas';
import { dslPatterns } from '../src/__test__/dsl-patterns';

const golden = dslPatterns();

const outPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../src/__test__/golden/generated-patterns.golden.json'
);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(golden, null, 2) + '\n');
console.log(
  `Wrote ${Object.keys(golden).length} languages × ${allSchemas.length} schemas → ${outPath}`
);
