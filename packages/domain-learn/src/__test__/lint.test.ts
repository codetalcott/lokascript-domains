import { describe, it, expect } from 'vitest';
import { lintDomain, formatResult } from '@lokascript/framework/testing/gate';
import type { DomainLintInput } from '@lokascript/framework/testing/gate';
import { validateCommandSchema } from '@lokascript/semantic';

import { allSchemas } from '../schemas';
import {
  enProfile,
  jaProfile,
  esProfile,
  arProfile,
  zhProfile,
  koProfile,
  frProfile,
  trProfile,
  deProfile,
  ptProfile,
} from '../profiles';
import {
  EnglishLearnTokenizer,
  JapaneseLearnTokenizer,
  SpanishLearnTokenizer,
  ArabicLearnTokenizer,
  ChineseLearnTokenizer,
  KoreanLearnTokenizer,
  FrenchLearnTokenizer,
  TurkishLearnTokenizer,
  GermanLearnTokenizer,
  PortugueseLearnTokenizer,
} from '../tokenizers';

// domain-learn's profile shape wraps `patternProfile` inside a larger
// LearnLanguageProfile config. Extract the inner PatternGenLanguageProfile
// for the linter. The 10 languages (+ German, Portuguese vs. other
// domains' 8) are all covered.
function buildInput(): DomainLintInput {
  return {
    name: 'learn',
    // R1/R2: semantic's schema validator. Its schema type names hyperscript's actions; the checks
    // read only the roles.
    validateSchema: schema =>
      validateCommandSchema(schema as unknown as Parameters<typeof validateCommandSchema>[0]),
    schemas: allSchemas,
    profiles: [
      enProfile.patternProfile,
      jaProfile.patternProfile,
      esProfile.patternProfile,
      arProfile.patternProfile,
      zhProfile.patternProfile,
      koProfile.patternProfile,
      frProfile.patternProfile,
      trProfile.patternProfile,
      deProfile.patternProfile,
      ptProfile.patternProfile,
    ],
    tokenizers: {
      en: EnglishLearnTokenizer,
      ja: JapaneseLearnTokenizer,
      es: SpanishLearnTokenizer,
      ar: ArabicLearnTokenizer,
      zh: ChineseLearnTokenizer,
      ko: KoreanLearnTokenizer,
      fr: FrenchLearnTokenizer,
      tr: TurkishLearnTokenizer,
      de: GermanLearnTokenizer,
      pt: PortugueseLearnTokenizer,
    },
    waivers: [
      // Turkish dative suffix `-e` on `send.destination` is an agglutinative
      // suffix that, in idiomatic Turkish, attaches directly to the preceding
      // noun (e.g., `kullanıcıya` not `kullanıcı -e`). The standalone form
      // tokenizes as `['-', 'e']`, which R7 correctly flags. Fixing the
      // schema requires Turkish expertise to choose the right alternative
      // (plain postposition? inflected forms?); defer to a Turkish speaker.
      {
        rule: 'marker-tokenization',
        reason: 'Turkish dative suffix -e; needs native-speaker refinement',
        matches: { lang: 'tr', word: '-e' },
      },
    ],
  };
}

describe('domain-learn: lint', () => {
  it('passes all enabled rules with zero errors', () => {
    const result = lintDomain(buildInput());
    if (result.errorCount > 0 || result.warningCount > 0) {
      // eslint-disable-next-line no-console
      console.log(formatResult(result));
    }
    expect(result.errorCount).toBe(0);
  });
});
