/**
 * @lokascript/domain-events — Multilingual Event Handling DSL
 *
 * A lesson domain built on @lokascript/framework that teaches event
 * handling concepts (binding, delegation, throttling, debouncing) in
 * 8 languages. Compiles to _hyperscript `on` syntax.
 *
 * @example
 * ```typescript
 * import { createEventsDSL } from '@lokascript/domain-events';
 *
 * const events = createEventsDSL();
 *
 * // English (SVO)
 * events.compile('listen click on #button', 'en');
 * // → { ok: true, code: 'on click from #button' }
 *
 * // Japanese (SOV)
 * events.compile('#button で click 聞く', 'ja');
 * // → { ok: true, code: 'on click from #button' }
 *
 * // Arabic (VSO)
 * events.compile('استمع click على #button', 'ar');
 * // → { ok: true, code: 'on click from #button' }
 * ```
 */

import { createMultilingualDSL, type MultilingualDSL } from '@lokascript/framework';
import {
  allSchemas,
  listenSchema,
  triggerSchema,
  filterSchema,
  delegateSchema,
  throttleSchema,
  debounceSchema,
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
  EnglishEventsTokenizer,
  SpanishEventsTokenizer,
  JapaneseEventsTokenizer,
  ArabicEventsTokenizer,
  KoreanEventsTokenizer,
  ChineseEventsTokenizer,
  TurkishEventsTokenizer,
  FrenchEventsTokenizer,
} from './tokenizers';
import { eventsCodeGenerator } from './generators/events-generator';

/**
 * Create a multilingual Events DSL instance with all 8 supported languages.
 */
export function createEventsDSL(): MultilingualDSL {
  return createMultilingualDSL({
    name: 'Events',
    schemas: allSchemas,
    languages: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        tokenizer: EnglishEventsTokenizer,
        patternProfile: englishProfile,
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        tokenizer: SpanishEventsTokenizer,
        patternProfile: spanishProfile,
      },
      {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        tokenizer: JapaneseEventsTokenizer,
        patternProfile: japaneseProfile,
      },
      {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        tokenizer: ArabicEventsTokenizer,
        patternProfile: arabicProfile,
      },
      {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        tokenizer: KoreanEventsTokenizer,
        patternProfile: koreanProfile,
      },
      {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
        tokenizer: ChineseEventsTokenizer,
        patternProfile: chineseProfile,
      },
      {
        code: 'tr',
        name: 'Turkish',
        nativeName: 'Türkçe',
        tokenizer: TurkishEventsTokenizer,
        patternProfile: turkishProfile,
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        tokenizer: FrenchEventsTokenizer,
        patternProfile: frenchProfile,
      },
    ],
    codeGenerator: eventsCodeGenerator,
  });
}

// Re-export schemas for consumers who want to extend
export {
  allSchemas,
  listenSchema,
  triggerSchema,
  filterSchema,
  delegateSchema,
  throttleSchema,
  debounceSchema,
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
export { eventsCodeGenerator } from './generators/events-generator';
export { renderEvents } from './generators/events-renderer';
export {
  EnglishEventsTokenizer,
  SpanishEventsTokenizer,
  JapaneseEventsTokenizer,
  ArabicEventsTokenizer,
  KoreanEventsTokenizer,
  ChineseEventsTokenizer,
  TurkishEventsTokenizer,
  FrenchEventsTokenizer,
} from './tokenizers';

// =============================================================================
// Domain Scan Config (for AOT / Vite plugin integration)
// =============================================================================

/** HTML attribute and script-type patterns for AOT scanning */
export const eventsScanConfig = {
  attributes: ['data-events', '_events'] as const,
  scriptTypes: ['text/events-dsl'] as const,
  defaultLanguage: 'en',
};
