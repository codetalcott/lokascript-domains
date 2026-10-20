/**
 * BehaviorSpec vocabularies + their injected grammar slices.
 *
 * Each language pairs a domain-authored {@link DomainVocabulary} (the structural
 * keywords + destination suppression — the ONLY per-language authoring here)
 * with the language's grammar from `@lokascript/framework/languages` (word order).
 * The framework bridge (`buildPatternProfile`) combines the two in `../profiles`.
 *
 * BehaviorSpec's tokenizers are custom `BaseTokenizer` subclasses (not
 * migrated); this vocab feeds only the pattern profiles. Its interaction /
 * assertion vocabulary lives in the renderer + mappings + constants tables,
 * outside the bridge.
 */

import type { DomainVocabulary, GrammarProfileSlice } from '@lokascript/framework';

import { englishGrammar as enSlice } from '@lokascript/framework/languages/en';
import { spanishGrammar as esSlice } from '@lokascript/framework/languages/es';
import { japaneseGrammar as jaSlice } from '@lokascript/framework/languages/ja';
import { arabicGrammar as arSlice } from '@lokascript/framework/languages/ar';
import { koreanGrammar as koSlice } from '@lokascript/framework/languages/ko';
import { chineseGrammar as zhSlice } from '@lokascript/framework/languages/zh';
import { turkishGrammar as trSlice } from '@lokascript/framework/languages/tr';
import { frenchGrammar as frSlice } from '@lokascript/framework/languages/fr';

import { enVocabulary } from './en';
import { esVocabulary } from './es';
import { jaVocabulary } from './ja';
import { arVocabulary } from './ar';
import { koVocabulary } from './ko';
import { zhVocabulary } from './zh';
import { trVocabulary } from './tr';
import { frVocabulary } from './fr';

export { enVocabulary } from './en';
export { esVocabulary } from './es';
export { jaVocabulary } from './ja';
export { arVocabulary } from './ar';
export { koVocabulary } from './ko';
export { zhVocabulary } from './zh';
export { trVocabulary } from './tr';
export { frVocabulary } from './fr';
export { SCHEMA_OWNED_MARKERS } from './shared';

export interface BehaviorSpecLanguageSource {
  readonly slice: GrammarProfileSlice;
  readonly vocab: DomainVocabulary;
}

/** Grammar slice + BehaviorSpec vocabulary per supported language. */
export const BEHAVIORSPEC_LANGUAGES: Readonly<Record<string, BehaviorSpecLanguageSource>> = {
  en: { slice: enSlice, vocab: enVocabulary },
  es: { slice: esSlice, vocab: esVocabulary },
  ja: { slice: jaSlice, vocab: jaVocabulary },
  ar: { slice: arSlice, vocab: arVocabulary },
  ko: { slice: koSlice, vocab: koVocabulary },
  zh: { slice: zhSlice, vocab: zhVocabulary },
  tr: { slice: trSlice, vocab: trVocabulary },
  fr: { slice: frSlice, vocab: frVocabulary },
};
