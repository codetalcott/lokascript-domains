/**
 * Golden-snapshot parity for the patterns the DSL reads with.
 *
 * Asserts the patterns `createBehaviorSpecDSL()` matches input against, for every registered language × every
 * schema, are byte-identical to the committed golden file: any change to profiles, schemas, or the
 * framework's generator shows up as a reviewed golden-file update, never slips through. On the core
 * (`engine: 'core'`, hyperfixi domains rethink Phase 5) these are the schema-pattern generator's; before
 * it they were `generatePatternVariants`', which the DSL no longer runs.
 *
 * Regenerate after an intentional change:
 *   npx tsx scripts/generate-golden-patterns.ts
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allSchemas } from '../schemas';
import { allProfiles } from '../profiles';
import { dslPatterns } from './dsl-patterns';

const goldenPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'golden/generated-patterns.golden.json'
);
const golden: Record<string, Record<string, unknown>> = JSON.parse(
  readFileSync(goldenPath, 'utf-8')
);

describe('domain-behaviorspec: generated-pattern parity (golden snapshot)', () => {
  it('covers exactly the registered languages', () => {
    expect(Object.keys(golden).sort()).toEqual(allProfiles.map(p => p.code).sort());
  });

  const live = dslPatterns();
  for (const profile of allProfiles) {
    describe(`language: ${profile.code}`, () => {
      for (const schema of allSchemas) {
        it(`${schema.action} patterns match golden`, () => {
          expect(live[profile.code]?.[schema.action]).toEqual(
            golden[profile.code]?.[schema.action]
          );
        });
      }
    });
  }
});
