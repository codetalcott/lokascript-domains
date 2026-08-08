/**
 * Animation Tokenizers
 *
 * Language-specific tokenizers for animation input (8 languages),
 * created via the framework's createSimpleTokenizer factory.
 */

import { createSimpleTokenizer } from '@lokascript/framework';
import type { LanguageTokenizer, ValueExtractor, ExtractionResult } from '@lokascript/framework';

// =============================================================================
// CSS Selector Extractor — handles #id and .class as single tokens
// =============================================================================

class CssSelectorExtractor implements ValueExtractor {
  readonly name = 'css-selector';

  canExtract(input: string, position: number): boolean {
    const ch = input[position];
    return (ch === '#' || ch === '.') && position + 1 < input.length &&
      /[\p{L}\p{N}_-]/u.test(input[position + 1]);
  }

  extract(input: string, position: number): ExtractionResult | null {
    let end = position + 1; // skip # or .
    while (end < input.length && /[\p{L}\p{N}_.-]/u.test(input[end])) {
      end++;
    }
    if (end === position + 1) return null;
    return { value: input.slice(position, end), length: end - position };
  }
}

// =============================================================================
// Latin Extended Identifier Extractor
// =============================================================================

class LatinExtendedIdentifierExtractor implements ValueExtractor {
  readonly name = 'latin-extended-identifier';

  canExtract(input: string, position: number): boolean {
    return /\p{L}/u.test(input[position]);
  }

  extract(input: string, position: number): ExtractionResult | null {
    let end = position;
    while (end < input.length && /[\p{L}\p{N}_-]/u.test(input[end])) {
      end++;
    }
    if (end === position) return null;
    return { value: input.slice(position, end), length: end - position };
  }
}

// =============================================================================
// Shared keyword sets
// =============================================================================

const CSS_PROPERTIES = [
  'opacity', 'color', 'width', 'height', 'transform',
  'background', 'margin', 'padding', 'top', 'left', 'right', 'bottom',
];

const DIRECTION_WORDS = ['in', 'out', 'up', 'down', 'left', 'right'];

const COMMON_DURATIONS = [
  '100ms', '200ms', '300ms', '400ms', '500ms',
  '1s', '2s',
];

// =============================================================================
// English
// =============================================================================

const cssExtractor = new CssSelectorExtractor();

export const EnglishAnimationTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'en',
  customExtractors: [cssExtractor],
  keywords: [
    'transition', 'settle', 'measure', 'fade', 'slide',
    'to', 'over',
    ...CSS_PROPERTIES,
    ...DIRECTION_WORDS,
    ...COMMON_DURATIONS,
  ],
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Spanish
// =============================================================================

const latinExtractor = new LatinExtendedIdentifierExtractor();

export const SpanishAnimationTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'es',
  customExtractors: [cssExtractor, latinExtractor],
  keywords: [
    'transición', 'establecer', 'medir', 'desvanecer', 'deslizar',
    'a', 'en',
    ...CSS_PROPERTIES,
    ...DIRECTION_WORDS,
    ...COMMON_DURATIONS,
  ],
  keywordExtras: [
    { native: 'transición', normalized: 'transition' },
    { native: 'establecer', normalized: 'settle' },
    { native: 'medir', normalized: 'measure' },
    { native: 'desvanecer', normalized: 'fade' },
    { native: 'deslizar', normalized: 'slide' },
    { native: 'a', normalized: 'to' },
    { native: 'en', normalized: 'over' },
  ],
  keywordProfile: {
    keywords: {
      transition: { primary: 'transición' },
      settle: { primary: 'establecer' },
      measure: { primary: 'medir' },
      fade: { primary: 'desvanecer' },
      slide: { primary: 'deslizar' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Japanese
// =============================================================================

export const JapaneseAnimationTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ja',
  customExtractors: [cssExtractor],
  keywords: [
    '遷移', '安定', '測定', 'フェード', 'スライド',
    'に', 'で',
    ...CSS_PROPERTIES,
    ...DIRECTION_WORDS,
    ...COMMON_DURATIONS,
  ],
  keywordExtras: [
    { native: '遷移', normalized: 'transition' },
    { native: '安定', normalized: 'settle' },
    { native: '測定', normalized: 'measure' },
    { native: 'フェード', normalized: 'fade' },
    { native: 'スライド', normalized: 'slide' },
    { native: 'に', normalized: 'to' },
    { native: 'で', normalized: 'over' },
  ],
  keywordProfile: {
    keywords: {
      transition: { primary: '遷移' },
      settle: { primary: '安定' },
      measure: { primary: '測定' },
      fade: { primary: 'フェード' },
      slide: { primary: 'スライド' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Arabic
// =============================================================================

export const ArabicAnimationTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ar',
  direction: 'rtl',
  customExtractors: [cssExtractor],
  keywords: [
    'انتقال', 'استقر', 'قس', 'تلاشى', 'انزلق',
    'إلى', 'خلال',
    ...CSS_PROPERTIES,
    ...DIRECTION_WORDS,
    ...COMMON_DURATIONS,
  ],
  keywordExtras: [
    { native: 'انتقال', normalized: 'transition' },
    { native: 'استقر', normalized: 'settle' },
    { native: 'قس', normalized: 'measure' },
    { native: 'تلاشى', normalized: 'fade' },
    { native: 'انزلق', normalized: 'slide' },
    { native: 'إلى', normalized: 'to' },
    { native: 'خلال', normalized: 'over' },
  ],
  keywordProfile: {
    keywords: {
      transition: { primary: 'انتقال' },
      settle: { primary: 'استقر' },
      measure: { primary: 'قس' },
      fade: { primary: 'تلاشى' },
      slide: { primary: 'انزلق' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Korean
// =============================================================================

export const KoreanAnimationTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ko',
  customExtractors: [cssExtractor],
  keywords: [
    '전환', '정착', '측정', '페이드', '슬라이드',
    '로', '동안',
    ...CSS_PROPERTIES,
    ...DIRECTION_WORDS,
    ...COMMON_DURATIONS,
  ],
  keywordExtras: [
    { native: '전환', normalized: 'transition' },
    { native: '정착', normalized: 'settle' },
    { native: '측정', normalized: 'measure' },
    { native: '페이드', normalized: 'fade' },
    { native: '슬라이드', normalized: 'slide' },
    { native: '로', normalized: 'to' },
    { native: '동안', normalized: 'over' },
  ],
  keywordProfile: {
    keywords: {
      transition: { primary: '전환' },
      settle: { primary: '정착' },
      measure: { primary: '측정' },
      fade: { primary: '페이드' },
      slide: { primary: '슬라이드' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Chinese
// =============================================================================

export const ChineseAnimationTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'zh',
  customExtractors: [cssExtractor],
  keywords: [
    '过渡', '稳定', '测量', '淡化', '滑动',
    '到', '经过',
    ...CSS_PROPERTIES,
    ...DIRECTION_WORDS,
    ...COMMON_DURATIONS,
  ],
  keywordExtras: [
    { native: '过渡', normalized: 'transition' },
    { native: '稳定', normalized: 'settle' },
    { native: '测量', normalized: 'measure' },
    { native: '淡化', normalized: 'fade' },
    { native: '滑动', normalized: 'slide' },
    { native: '到', normalized: 'to' },
    { native: '经过', normalized: 'over' },
  ],
  keywordProfile: {
    keywords: {
      transition: { primary: '过渡' },
      settle: { primary: '稳定' },
      measure: { primary: '测量' },
      fade: { primary: '淡化' },
      slide: { primary: '滑动' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Turkish
// =============================================================================

export const TurkishAnimationTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'tr',
  customExtractors: [cssExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'geçiş', 'yerleş', 'ölç', 'soldur', 'kaydır',
    'ye', 'sürede',
    ...CSS_PROPERTIES,
    ...DIRECTION_WORDS,
    ...COMMON_DURATIONS,
  ],
  keywordExtras: [
    { native: 'geçiş', normalized: 'transition' },
    { native: 'yerleş', normalized: 'settle' },
    { native: 'ölç', normalized: 'measure' },
    { native: 'soldur', normalized: 'fade' },
    { native: 'kaydır', normalized: 'slide' },
    { native: 'ye', normalized: 'to' },
    { native: 'sürede', normalized: 'over' },
  ],
  keywordProfile: {
    keywords: {
      transition: { primary: 'geçiş' },
      settle: { primary: 'yerleş' },
      measure: { primary: 'ölç' },
      fade: { primary: 'soldur' },
      slide: { primary: 'kaydır' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// French
// =============================================================================

export const FrenchAnimationTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'fr',
  customExtractors: [cssExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'transition', 'stabiliser', 'mesurer', 'fondu', 'glisser',
    'à', 'en',
    ...CSS_PROPERTIES,
    ...DIRECTION_WORDS,
    ...COMMON_DURATIONS,
  ],
  keywordExtras: [
    { native: 'transition', normalized: 'transition' },
    { native: 'stabiliser', normalized: 'settle' },
    { native: 'mesurer', normalized: 'measure' },
    { native: 'fondu', normalized: 'fade' },
    { native: 'glisser', normalized: 'slide' },
    { native: 'à', normalized: 'to' },
    { native: 'en', normalized: 'over' },
  ],
  keywordProfile: {
    keywords: {
      transition: { primary: 'transition' },
      settle: { primary: 'stabiliser' },
      measure: { primary: 'mesurer' },
      fade: { primary: 'fondu' },
      slide: { primary: 'glisser' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});
