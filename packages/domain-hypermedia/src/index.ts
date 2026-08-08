/**
 * @lokascript/domain-hypermedia — Multilingual Hypermedia DSL
 *
 * A lesson domain built on @lokascript/framework that teaches hypermedia
 * concepts (web requests, content swapping, morphing, URL manipulation) in
 * 8 languages. Compiles to _hyperscript syntax.
 *
 * @example
 * ```typescript
 * import { createHypermediaDSL } from '@lokascript/domain-hypermedia';
 *
 * const hypermedia = createHypermediaDSL();
 *
 * // English (SVO)
 * hypermedia.compile('request /api/users into #list', 'en');
 * // → { ok: true, code: 'fetch /api/users then put the result into #list' }
 *
 * // Japanese (SOV)
 * hypermedia.compile('/api/users #list に リクエスト', 'ja');
 * // → { ok: true, code: 'fetch /api/users then put the result into #list' }
 *
 * // Arabic (VSO)
 * hypermedia.compile('اطلب /api/users في #list', 'ar');
 * // → { ok: true, code: 'fetch /api/users then put the result into #list' }
 * ```
 */

import { createMultilingualDSL, type MultilingualDSL } from '@lokascript/framework';
import {
  allSchemas,
  requestSchema,
  swapSchema,
  morphSchema,
  pushSchema,
  replaceSchema,
} from './schemas';
import {
  englishProfile,
  spanishProfile,
  japaneseProfile,
  arabicProfile,
  koreanProfile,
  chineseProfile,
  turkishProfile,
  frenchProfile,
} from './profiles';
import {
  EnglishHypermediaTokenizer,
  SpanishHypermediaTokenizer,
  JapaneseHypermediaTokenizer,
  ArabicHypermediaTokenizer,
  KoreanHypermediaTokenizer,
  ChineseHypermediaTokenizer,
  TurkishHypermediaTokenizer,
  FrenchHypermediaTokenizer,
} from './tokenizers';
import { hypermediaCodeGenerator } from './generators/hypermedia-generator';

/**
 * Create a multilingual Hypermedia DSL instance with all 8 supported languages.
 */
export function createHypermediaDSL(): MultilingualDSL {
  return createMultilingualDSL({
    name: 'Hypermedia',
    schemas: allSchemas,
    languages: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        tokenizer: EnglishHypermediaTokenizer,
        patternProfile: englishProfile,
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        tokenizer: SpanishHypermediaTokenizer,
        patternProfile: spanishProfile,
      },
      {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        tokenizer: JapaneseHypermediaTokenizer,
        patternProfile: japaneseProfile,
      },
      {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        tokenizer: ArabicHypermediaTokenizer,
        patternProfile: arabicProfile,
      },
      {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        tokenizer: KoreanHypermediaTokenizer,
        patternProfile: koreanProfile,
      },
      {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        tokenizer: ChineseHypermediaTokenizer,
        patternProfile: chineseProfile,
      },
      {
        code: 'tr',
        name: 'Turkish',
        nativeName: 'Türkçe',
        tokenizer: TurkishHypermediaTokenizer,
        patternProfile: turkishProfile,
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        tokenizer: FrenchHypermediaTokenizer,
        patternProfile: frenchProfile,
      },
    ],
    codeGenerator: hypermediaCodeGenerator,
  });
}

// Re-export schemas for consumers who want to extend
export {
  allSchemas,
  requestSchema,
  swapSchema,
  morphSchema,
  pushSchema,
  replaceSchema,
};
export {
  englishProfile,
  spanishProfile,
  japaneseProfile,
  arabicProfile,
  koreanProfile,
  chineseProfile,
  turkishProfile,
  frenchProfile,
} from './profiles';
export { hypermediaCodeGenerator } from './generators/hypermedia-generator';
export { renderHypermedia } from './generators/hypermedia-renderer';
export {
  EnglishHypermediaTokenizer,
  SpanishHypermediaTokenizer,
  JapaneseHypermediaTokenizer,
  ArabicHypermediaTokenizer,
  KoreanHypermediaTokenizer,
  ChineseHypermediaTokenizer,
  TurkishHypermediaTokenizer,
  FrenchHypermediaTokenizer,
} from './tokenizers';

// =============================================================================
// Domain Scan Config (for AOT / Vite plugin integration)
// =============================================================================

/** HTML attribute and script-type patterns for AOT scanning */
export const hypermediaScanConfig = {
  attributes: ['data-hypermedia', '_hypermedia'] as const,
  scriptTypes: ['text/hypermedia-dsl'] as const,
  defaultLanguage: 'en',
};
