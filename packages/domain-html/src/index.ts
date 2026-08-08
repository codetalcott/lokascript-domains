/**
 * @lokascript/domain-html — Multilingual HTML Structure DSL
 *
 * A lesson domain built on @lokascript/framework that teaches page
 * structure and HTML elements (creating, nesting, linking, labeling,
 * form inputs) in 8 languages. Compiles to actual HTML.
 *
 * @example
 * ```typescript
 * import { createHtmlDSL } from '@lokascript/domain-html';
 *
 * const html = createHtmlDSL();
 *
 * // English (SVO)
 * html.compile('create button with class "primary"', 'en');
 * // → { ok: true, code: '<button class="primary"></button>' }
 *
 * // Japanese (SOV)
 * html.compile('button で class "primary" 作成', 'ja');
 * // → { ok: true, code: '<button class="primary"></button>' }
 *
 * // Arabic (VSO)
 * html.compile('أنشئ button بـ class "primary"', 'ar');
 * // → { ok: true, code: '<button class="primary"></button>' }
 * ```
 */

import { createMultilingualDSL, type MultilingualDSL } from '@lokascript/framework';
import {
  allSchemas,
  createSchema,
  nestSchema,
  linkSchema,
  labelSchema,
  inputSchema,
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
  EnglishHtmlTokenizer,
  SpanishHtmlTokenizer,
  JapaneseHtmlTokenizer,
  ArabicHtmlTokenizer,
  KoreanHtmlTokenizer,
  ChineseHtmlTokenizer,
  TurkishHtmlTokenizer,
  FrenchHtmlTokenizer,
} from './tokenizers';
import { htmlCodeGenerator } from './generators/html-generator';

/**
 * Create a multilingual HTML DSL instance with all 8 supported languages.
 */
export function createHtmlDSL(): MultilingualDSL {
  return createMultilingualDSL({
    name: 'HTML',
    schemas: allSchemas,
    languages: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        tokenizer: EnglishHtmlTokenizer,
        patternProfile: englishProfile,
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        tokenizer: SpanishHtmlTokenizer,
        patternProfile: spanishProfile,
      },
      {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        tokenizer: JapaneseHtmlTokenizer,
        patternProfile: japaneseProfile,
      },
      {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        tokenizer: ArabicHtmlTokenizer,
        patternProfile: arabicProfile,
      },
      {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        tokenizer: KoreanHtmlTokenizer,
        patternProfile: koreanProfile,
      },
      {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        tokenizer: ChineseHtmlTokenizer,
        patternProfile: chineseProfile,
      },
      {
        code: 'tr',
        name: 'Turkish',
        nativeName: 'Türkçe',
        tokenizer: TurkishHtmlTokenizer,
        patternProfile: turkishProfile,
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        tokenizer: FrenchHtmlTokenizer,
        patternProfile: frenchProfile,
      },
    ],
    codeGenerator: htmlCodeGenerator,
  });
}

// Re-export schemas for consumers who want to extend
export {
  allSchemas,
  createSchema,
  nestSchema,
  linkSchema,
  labelSchema,
  inputSchema,
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
export { htmlCodeGenerator } from './generators/html-generator';
export { renderHtml } from './generators/html-renderer';
export {
  EnglishHtmlTokenizer,
  SpanishHtmlTokenizer,
  JapaneseHtmlTokenizer,
  ArabicHtmlTokenizer,
  KoreanHtmlTokenizer,
  ChineseHtmlTokenizer,
  TurkishHtmlTokenizer,
  FrenchHtmlTokenizer,
} from './tokenizers';

// =============================================================================
// Domain Scan Config (for AOT / Vite plugin integration)
// =============================================================================

/** HTML attribute and script-type patterns for AOT scanning */
export const htmlScanConfig = {
  attributes: ['data-html', '_html'] as const,
  scriptTypes: ['text/html-dsl'] as const,
  defaultLanguage: 'en',
};
