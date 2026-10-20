/**
 * Learn vocabularies + their injected grammar slices.
 *
 * Each language pairs a domain-authored {@link DomainVocabulary} (the 15 core
 * verbs — the ONLY per-language pattern authoring) with the language's
 * grammar from `@lokascript/framework/languages` (word order, markers, script).
 * The framework bridge (`buildPatternProfile`) combines the two into each
 * `LearnLanguageProfile.patternProfile` (../profiles). Morphology tables,
 * sentence frames, and the tokenizers stay hand-authored — the bridge
 * doesn't cover them.
 */

import type { DomainVocabulary, GrammarProfileSlice } from '@lokascript/framework';

import { englishGrammar as enSlice } from '@lokascript/framework/languages/en';
import { japaneseGrammar as jaSlice } from '@lokascript/framework/languages/ja';
import { spanishGrammar as esSlice } from '@lokascript/framework/languages/es';
import { arabicGrammar as arSlice } from '@lokascript/framework/languages/ar';
import { chineseGrammar as zhSlice } from '@lokascript/framework/languages/zh';
import { koreanGrammar as koSlice } from '@lokascript/framework/languages/ko';
import { frenchGrammar as frSlice } from '@lokascript/framework/languages/fr';
import { turkishGrammar as trSlice } from '@lokascript/framework/languages/tr';
import { germanGrammar as deSlice } from '@lokascript/framework/languages/de';
import { portugueseGrammar as ptSlice } from '@lokascript/framework/languages/pt';

import { enVocabulary } from './en';
import { jaVocabulary } from './ja';
import { esVocabulary } from './es';
import { arVocabulary } from './ar';
import { zhVocabulary } from './zh';
import { koVocabulary } from './ko';
import { frVocabulary } from './fr';
import { trVocabulary } from './tr';
import { deVocabulary } from './de';
import { ptVocabulary } from './pt';

export { enVocabulary } from './en';
export { jaVocabulary } from './ja';
export { esVocabulary } from './es';
export { arVocabulary } from './ar';
export { zhVocabulary } from './zh';
export { koVocabulary } from './ko';
export { frVocabulary } from './fr';
export { trVocabulary } from './tr';
export { deVocabulary } from './de';
export { ptVocabulary } from './pt';
export { SCHEMA_OWNED_MARKERS } from './shared';

export interface LearnLanguageSource {
  readonly slice: GrammarProfileSlice;
  readonly vocab: DomainVocabulary;
}

/** Grammar slice + learn vocabulary per supported language. */
export const LEARN_LANGUAGES: Readonly<Record<string, LearnLanguageSource>> = {
  en: { slice: enSlice, vocab: enVocabulary },
  ja: { slice: jaSlice, vocab: jaVocabulary },
  es: { slice: esSlice, vocab: esVocabulary },
  ar: { slice: arSlice, vocab: arVocabulary },
  zh: { slice: zhSlice, vocab: zhVocabulary },
  ko: { slice: koSlice, vocab: koVocabulary },
  fr: { slice: frSlice, vocab: frVocabulary },
  tr: { slice: trSlice, vocab: trVocabulary },
  de: { slice: deSlice, vocab: deVocabulary },
  pt: { slice: ptSlice, vocab: ptVocabulary },
};
