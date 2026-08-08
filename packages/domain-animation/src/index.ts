/**
 * @lokascript/domain-animation — Multilingual Animation DSL
 *
 * A lesson domain built on @lokascript/framework that teaches CSS
 * animation concepts (transitions, settling, measuring, fading, sliding) in
 * 8 languages. Compiles to _hyperscript animation syntax.
 *
 * @example
 * ```typescript
 * import { createAnimationDSL } from '@lokascript/domain-animation';
 *
 * const animation = createAnimationDSL();
 *
 * // English (SVO)
 * animation.compile('transition opacity to 0 over 300ms', 'en');
 * // → { ok: true, code: 'transition opacity to 0 over 300ms' }
 *
 * // Japanese (SOV)
 * animation.compile('opacity に 0 で 300ms 遷移', 'ja');
 * // → { ok: true, code: 'transition opacity to 0 over 300ms' }
 *
 * // Arabic (VSO)
 * animation.compile('انتقال opacity إلى 0 خلال 300ms', 'ar');
 * // → { ok: true, code: 'transition opacity to 0 over 300ms' }
 * ```
 */

import { createMultilingualDSL, type MultilingualDSL } from '@lokascript/framework';
import {
  allSchemas,
  transitionSchema,
  settleSchema,
  measureSchema,
  fadeSchema,
  slideSchema,
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
  EnglishAnimationTokenizer,
  SpanishAnimationTokenizer,
  JapaneseAnimationTokenizer,
  ArabicAnimationTokenizer,
  KoreanAnimationTokenizer,
  ChineseAnimationTokenizer,
  TurkishAnimationTokenizer,
  FrenchAnimationTokenizer,
} from './tokenizers';
import { animationCodeGenerator } from './generators/animation-generator';

/**
 * Create a multilingual Animation DSL instance with all 8 supported languages.
 */
export function createAnimationDSL(): MultilingualDSL {
  return createMultilingualDSL({
    name: 'Animation',
    schemas: allSchemas,
    languages: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        tokenizer: EnglishAnimationTokenizer,
        patternProfile: englishProfile,
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        tokenizer: SpanishAnimationTokenizer,
        patternProfile: spanishProfile,
      },
      {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        tokenizer: JapaneseAnimationTokenizer,
        patternProfile: japaneseProfile,
      },
      {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        tokenizer: ArabicAnimationTokenizer,
        patternProfile: arabicProfile,
      },
      {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        tokenizer: KoreanAnimationTokenizer,
        patternProfile: koreanProfile,
      },
      {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        tokenizer: ChineseAnimationTokenizer,
        patternProfile: chineseProfile,
      },
      {
        code: 'tr',
        name: 'Turkish',
        nativeName: 'Türkçe',
        tokenizer: TurkishAnimationTokenizer,
        patternProfile: turkishProfile,
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        tokenizer: FrenchAnimationTokenizer,
        patternProfile: frenchProfile,
      },
    ],
    codeGenerator: animationCodeGenerator,
  });
}

// Re-export schemas for consumers who want to extend
export {
  allSchemas,
  transitionSchema,
  settleSchema,
  measureSchema,
  fadeSchema,
  slideSchema,
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
export { animationCodeGenerator } from './generators/animation-generator';
export { renderAnimation } from './generators/animation-renderer';
export {
  EnglishAnimationTokenizer,
  SpanishAnimationTokenizer,
  JapaneseAnimationTokenizer,
  ArabicAnimationTokenizer,
  KoreanAnimationTokenizer,
  ChineseAnimationTokenizer,
  TurkishAnimationTokenizer,
  FrenchAnimationTokenizer,
} from './tokenizers';

// =============================================================================
// Domain Scan Config (for AOT / Vite plugin integration)
// =============================================================================

/** HTML attribute and script-type patterns for AOT scanning */
export const animationScanConfig = {
  attributes: ['data-animation', '_animation'] as const,
  scriptTypes: ['text/animation-dsl'] as const,
  defaultLanguage: 'en',
};
