import { describe, it, expect } from 'vitest';
import { lintDomain, formatResult } from '@lokascript/framework/testing/gate';
import type { DomainLintInput } from '@lokascript/framework/testing/gate';
import { validateCommandSchema } from '@lokascript/semantic';

import { allSchemas } from '../schemas';
import { allProfiles } from '../profiles';
import {
  EnglishTodoTokenizer,
  SpanishTodoTokenizer,
  JapaneseTodoTokenizer,
  ArabicTodoTokenizer,
  KoreanTodoTokenizer,
  ChineseTodoTokenizer,
  TurkishTodoTokenizer,
  FrenchTodoTokenizer,
} from '../tokenizers';

function buildInput(): DomainLintInput {
  return {
    name: 'todo',
    // R1/R2: semantic's schema validator. Its schema type names hyperscript's actions; the checks
    // read only the roles.
    validateSchema: schema =>
      validateCommandSchema(schema as unknown as Parameters<typeof validateCommandSchema>[0]),
    schemas: allSchemas,
    profiles: allProfiles,
    tokenizers: {
      en: EnglishTodoTokenizer,
      es: SpanishTodoTokenizer,
      ja: JapaneseTodoTokenizer,
      ar: ArabicTodoTokenizer,
      ko: KoreanTodoTokenizer,
      zh: ChineseTodoTokenizer,
      tr: TurkishTodoTokenizer,
      fr: FrenchTodoTokenizer,
    },
  };
}

describe('domain-todo: lint', () => {
  it('passes all enabled rules with zero errors', () => {
    const result = lintDomain(buildInput());
    if (result.errorCount > 0 || result.warningCount > 0) {
      // eslint-disable-next-line no-console
      console.log(formatResult(result));
    }
    expect(result.errorCount).toBe(0);
  });
});
