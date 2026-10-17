/**
 * @lokascript/domain-learn — Multilingual Learning DSL
 *
 * A learning domain built on @lokascript/framework that formalizes
 * the morphology engine: 15 verbs x 10 languages x 7 communicative
 * functions, with sentence generation, interlinear glosses, and
 * cross-language rendering.
 *
 * Unlike domain-sql (natural language -> SQL), domain-learn's "compiled
 * output" IS natural language sentences with morphology applied. The
 * commanding sentence, the command a learner types, is `@lokascript/semantic`'s:
 * what the hyperscript adapter runs (hyperfixi domains rethink, decision D2), so
 * the DSL reads and writes it with semantic. `compile` returns it in English.
 * The extended generateForFunction() powers the exercise engine.
 *
 * @example
 * ```typescript
 * import { createLearnDSL } from '@lokascript/domain-learn';
 *
 * const learn = createLearnDSL();
 *
 * // Parse multilingual command input
 * const node = learn.parse('add .active to #button', 'en');
 *
 * // Generate sentence in any language x function
 * import { generateForFunction } from '@lokascript/domain-learn';
 * generateForFunction(node, 'narrating', 'ja');
 * // -> { sentence: 'システムは #buttonに .activeを 追加しました', ... }
 *
 * // Cross-language translation
 * learn.translate('add .active to #button', 'en', 'ja');
 *
 * // Interlinear gloss
 * import { generateGloss } from '@lokascript/domain-learn';
 * generateGloss(node, 'commanding', 'ja');
 * // -> { tokens: ['#buttonに', '.activeを', '追加'], roles: ['DEST', 'PAT', 'VERB'], ... }
 * ```
 */

import type { MultilingualDSL } from '@lokascript/framework';
import { ALL_PROFILES } from './profiles';
import { registerProfile } from './generators/sentence-generator';
import { createSemanticLearnDSL } from './dsl';

/**
 * Create the learning DSL: commanding sentences in its 10 languages, read and written by
 * `@lokascript/semantic`. Also registers all language profiles with the sentence generator.
 */
export function createLearnDSL(): MultilingualDSL {
  // Register all profiles with the sentence generator
  for (const [code, profile] of Object.entries(ALL_PROFILES)) {
    registerProfile(code, profile);
  }
  return createSemanticLearnDSL();
}

// ─── Re-exports ──────────────────────────────────────────────────

// Types
export type {
  CommunicativeFunction,
  CoreVerb,
  SemanticRole,
  VerbValence,
  CommandProfile,
  SentenceFrame,
  LanguageFrames,
  RenderedSentence,
  InterlinearGloss,
  LearnLanguageProfile,
  EnglishForms,
  JapaneseForms,
  SpanishForms,
  ArabicForms,
  ChineseForms,
  KoreanForms,
  FrenchForms,
  TurkishForms,
  GermanForms,
  PortugueseForms,
  AnyForms,
} from './types';

export { ALL_FUNCTIONS, ALL_VERBS } from './types';

// Schemas
export { allSchemas } from './schemas';

// Profiles
export {
  ALL_PROFILES,
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
} from './profiles';

// Tokenizers
export {
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
} from './tokenizers';

// Generators
export {
  learnCodeGenerator,
  generateForFunction,
  generateAllFunctions,
  generateCrossLingual,
  registerProfile,
  getProfile,
  resolveMarker,
  attachMarker,
} from './generators/sentence-generator';

export { renderLearn } from './generators/learn-renderer';
export { commandingSentence, commandingVerb, toSemanticNode } from './commanding';
export { LEARN_LANGUAGES } from './dsl';
export { generateGloss } from './generators/gloss-generator';

// Domain scan config (for AOT / Vite plugin integration)
export const learnScanConfig = {
  attributes: ['data-learn', '_learn'] as const,
  scriptTypes: ['text/learn-dsl'] as const,
  defaultLanguage: 'en',
};
