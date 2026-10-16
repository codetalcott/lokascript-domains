import { describe, it, expect } from 'vitest';
import { lintDomain, formatResult } from '@lokascript/framework/testing/gate';
import type { DomainLintInput } from '@lokascript/framework/testing/gate';
import { validateCommandSchema } from '@lokascript/semantic';

import { allSchemas } from '../schemas';
import {
  englishProfile,
  spanishProfile,
  japaneseProfile,
  arabicProfile,
  koreanProfile,
  chineseProfile,
  turkishProfile,
  frenchProfile,
} from '../profiles';
import {
  EnglishBehaviorSpecTokenizer,
  SpanishBehaviorSpecTokenizer,
  JapaneseBehaviorSpecTokenizer,
  ArabicBehaviorSpecTokenizer,
  KoreanBehaviorSpecTokenizer,
  ChineseBehaviorSpecTokenizer,
  TurkishBehaviorSpecTokenizer,
  FrenchBehaviorSpecTokenizer,
} from '../tokenizers';

function buildInput(): DomainLintInput {
  return {
    name: 'behaviorspec',
    // R1/R2: semantic's schema validator. Its schema type names hyperscript's actions; the checks
    // read only the roles.
    validateSchema: schema =>
      validateCommandSchema(schema as unknown as Parameters<typeof validateCommandSchema>[0]),
    schemas: allSchemas,
    profiles: [
      englishProfile,
      spanishProfile,
      japaneseProfile,
      arabicProfile,
      koreanProfile,
      chineseProfile,
      turkishProfile,
      frenchProfile,
    ],
    tokenizers: {
      en: new EnglishBehaviorSpecTokenizer(),
      es: new SpanishBehaviorSpecTokenizer(),
      ja: new JapaneseBehaviorSpecTokenizer(),
      ar: new ArabicBehaviorSpecTokenizer(),
      ko: new KoreanBehaviorSpecTokenizer(),
      zh: new ChineseBehaviorSpecTokenizer(),
      tr: new TurkishBehaviorSpecTokenizer(),
      fr: new FrenchBehaviorSpecTokenizer(),
    },
  };
}

describe('domain-behaviorspec: lint', () => {
  it('passes all enabled rules with zero errors', () => {
    const result = lintDomain(buildInput());
    if (result.errorCount > 0 || result.warningCount > 0) {
      // eslint-disable-next-line no-console
      console.log(formatResult(result));
    }
    expect(result.errorCount).toBe(0);
  });
});
