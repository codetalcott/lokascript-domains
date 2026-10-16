/**
 * The patterns `createLLMDSL()` reads with, per language and command, as plain JSON: what the golden
 * pattern snapshot pins. framework keeps them in the DSL's registry, which its public type does not
 * show; this reads it, for the golden test and its regen script only.
 */

import { createLLMDSL } from '../index';
import { allSchemas } from '../schemas';
import { allProfiles } from '../profiles';

interface PatternRegistry {
  registry: { getPatterns(language: string): { command: string }[] };
}

export function dslPatterns(): Record<string, Record<string, unknown[]>> {
  const { registry } = createLLMDSL() as unknown as PatternRegistry;
  const out: Record<string, Record<string, unknown[]>> = {};
  for (const profile of allProfiles) {
    const patterns = registry.getPatterns(profile.code);
    out[profile.code] = Object.fromEntries(
      allSchemas.map(schema => [
        schema.action,
        JSON.parse(JSON.stringify(patterns.filter(p => p.command === schema.action))) as unknown[],
      ])
    );
  }
  return out;
}
