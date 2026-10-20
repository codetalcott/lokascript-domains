/**
 * Todo vocabularies + their injected grammar slices.
 *
 * Each language pairs a domain-authored {@link DomainVocabulary} (todo verbs +
 * marker words — the ONLY per-language authoring) with the language's grammar
 * grammar from `@lokascript/framework/languages` (word order, particles, script). The
 * framework bridge (`buildPatternProfile` / `buildDomainTokenizer`) combines
 * the two in `../profiles` and `../tokenizers`.
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
import { germanGrammar as deSlice } from '@lokascript/framework/languages/de';
import { portugueseGrammar as ptSlice } from '@lokascript/framework/languages/pt';
import { russianGrammar as ruSlice } from '@lokascript/framework/languages/ru';

import { enVocabulary } from './en';
import { esVocabulary } from './es';
import { jaVocabulary } from './ja';
import { arVocabulary } from './ar';
import { koVocabulary } from './ko';
import { zhVocabulary } from './zh';
import { trVocabulary } from './tr';
import { frVocabulary } from './fr';
import { deVocabulary } from './de';
import { ptVocabulary } from './pt';
import { ruVocabulary } from './ru';

export { enVocabulary } from './en';
export { esVocabulary } from './es';
export { jaVocabulary } from './ja';
export { arVocabulary } from './ar';
export { koVocabulary } from './ko';
export { zhVocabulary } from './zh';
export { trVocabulary } from './tr';
export { frVocabulary } from './fr';
export { deVocabulary } from './de';
export { ptVocabulary } from './pt';
export { ruVocabulary } from './ru';

export interface TodoLanguageSource {
  readonly slice: GrammarProfileSlice;
  readonly vocab: DomainVocabulary;
}

/** Grammar slice + todo vocabulary per supported language. */
export const TODO_LANGUAGES: Readonly<Record<string, TodoLanguageSource>> = {
  en: { slice: enSlice, vocab: enVocabulary },
  es: { slice: esSlice, vocab: esVocabulary },
  ja: { slice: jaSlice, vocab: jaVocabulary },
  ar: { slice: arSlice, vocab: arVocabulary },
  ko: { slice: koSlice, vocab: koVocabulary },
  zh: { slice: zhSlice, vocab: zhVocabulary },
  tr: { slice: trSlice, vocab: trVocabulary },
  fr: { slice: frSlice, vocab: frVocabulary },
  // Bridge-era languages (arc Phase 2 expansion) — one vocab file each.
  de: { slice: deSlice, vocab: deVocabulary },
  pt: { slice: ptSlice, vocab: ptVocabulary },
  ru: { slice: ruSlice, vocab: ruVocabulary },
};
