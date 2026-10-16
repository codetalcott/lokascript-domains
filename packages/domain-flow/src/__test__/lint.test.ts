import { describe, it, expect } from 'vitest';
import { lintDomain, formatResult } from '@lokascript/framework/testing/gate';
import type { DomainLintInput } from '@lokascript/framework/testing/gate';
import { validateCommandSchema } from '@lokascript/semantic';

import { allSchemas } from '../schemas';
import { allProfiles } from '../profiles';
import {
  EnglishFlowTokenizer,
  SpanishFlowTokenizer,
  JapaneseFlowTokenizer,
  ArabicFlowTokenizer,
  KoreanFlowTokenizer,
  ChineseFlowTokenizer,
  TurkishFlowTokenizer,
  FrenchFlowTokenizer,
  GermanFlowTokenizer,
  PortugueseFlowTokenizer,
  RussianFlowTokenizer,
} from '../tokenizers';

function buildInput(): DomainLintInput {
  return {
    name: 'flow',
    // R1/R2: semantic's schema validator. Its schema type names hyperscript's actions; the checks
    // read only the roles.
    validateSchema: schema =>
      validateCommandSchema(schema as unknown as Parameters<typeof validateCommandSchema>[0]),
    schemas: allSchemas,
    profiles: allProfiles,
    tokenizers: {
      en: EnglishFlowTokenizer,
      es: SpanishFlowTokenizer,
      ja: JapaneseFlowTokenizer,
      ar: ArabicFlowTokenizer,
      ko: KoreanFlowTokenizer,
      zh: ChineseFlowTokenizer,
      tr: TurkishFlowTokenizer,
      fr: FrenchFlowTokenizer,
      de: GermanFlowTokenizer,
      pt: PortugueseFlowTokenizer,
      ru: RussianFlowTokenizer,
    },
  };
}

describe('domain-flow: lint', () => {
  it('passes all enabled rules with zero errors', () => {
    const result = lintDomain(buildInput());
    if (result.errorCount > 0 || result.warningCount > 0) {
      // eslint-disable-next-line no-console
      console.log(formatResult(result));
    }
    expect(result.errorCount).toBe(0);
  });
});
