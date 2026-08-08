/**
 * @lokascript/domain-control — Multilingual Control Flow DSL
 *
 * A lesson domain built on @lokascript/framework that teaches control
 * flow concepts (conditionals, loops, iteration, guards) in
 * 8 languages. Compiles to _hyperscript control flow syntax.
 *
 * @example
 * ```typescript
 * import { createControlDSL } from '@lokascript/domain-control';
 *
 * const control = createControlDSL();
 *
 * // English (SVO)
 * control.compile('check #input is empty', 'en');
 * // → { ok: true, code: 'if #input is empty then ... end' }
 *
 * // Japanese (SOV)
 * control.compile('#input is empty 確認', 'ja');
 * // → { ok: true, code: 'if #input is empty then ... end' }
 *
 * // Arabic (VSO)
 * control.compile('تحقق #input is empty', 'ar');
 * // → { ok: true, code: 'if #input is empty then ... end' }
 * ```
 */

import { createMultilingualDSL, type MultilingualDSL } from '@lokascript/framework';
import {
  allSchemas,
  checkSchema,
  repeatSchema,
  iterateSchema,
  guardSchema,
  loopWhileSchema,
  loopUntilSchema,
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
  EnglishControlTokenizer,
  SpanishControlTokenizer,
  JapaneseControlTokenizer,
  ArabicControlTokenizer,
  KoreanControlTokenizer,
  ChineseControlTokenizer,
  TurkishControlTokenizer,
  FrenchControlTokenizer,
} from './tokenizers';
import { controlCodeGenerator } from './generators/control-generator';

/**
 * Create a multilingual Control Flow DSL instance with all 8 supported languages.
 */
export function createControlDSL(): MultilingualDSL {
  return createMultilingualDSL({
    name: 'Control',
    schemas: allSchemas,
    languages: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        tokenizer: EnglishControlTokenizer,
        patternProfile: englishProfile,
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        tokenizer: SpanishControlTokenizer,
        patternProfile: spanishProfile,
      },
      {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        tokenizer: JapaneseControlTokenizer,
        patternProfile: japaneseProfile,
      },
      {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        tokenizer: ArabicControlTokenizer,
        patternProfile: arabicProfile,
      },
      {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        tokenizer: KoreanControlTokenizer,
        patternProfile: koreanProfile,
      },
      {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        tokenizer: ChineseControlTokenizer,
        patternProfile: chineseProfile,
      },
      {
        code: 'tr',
        name: 'Turkish',
        nativeName: 'Türkçe',
        tokenizer: TurkishControlTokenizer,
        patternProfile: turkishProfile,
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        tokenizer: FrenchControlTokenizer,
        patternProfile: frenchProfile,
      },
    ],
    codeGenerator: controlCodeGenerator,
  });
}

// Re-export schemas for consumers who want to extend
export {
  allSchemas,
  checkSchema,
  repeatSchema,
  iterateSchema,
  guardSchema,
  loopWhileSchema,
  loopUntilSchema,
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
export { controlCodeGenerator } from './generators/control-generator';
export { renderControl } from './generators/control-renderer';
export {
  EnglishControlTokenizer,
  SpanishControlTokenizer,
  JapaneseControlTokenizer,
  ArabicControlTokenizer,
  KoreanControlTokenizer,
  ChineseControlTokenizer,
  TurkishControlTokenizer,
  FrenchControlTokenizer,
} from './tokenizers';

// =============================================================================
// Domain Scan Config (for AOT / Vite plugin integration)
// =============================================================================

/** HTML attribute and script-type patterns for AOT scanning */
export const controlScanConfig = {
  attributes: ['data-control', '_control'] as const,
  scriptTypes: ['text/control-dsl'] as const,
  defaultLanguage: 'en',
};
