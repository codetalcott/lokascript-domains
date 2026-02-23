/**
 * Event Handling Tokenizers
 *
 * Language-specific tokenizers for event handling input (8 languages),
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
// English
// =============================================================================

const cssExtractor = new CssSelectorExtractor();

export const EnglishEventsTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'en',
  customExtractors: [cssExtractor],
  keywords: [
    'listen', 'trigger', 'filter', 'delegate', 'throttle', 'debounce',
    'on', 'by', 'from', 'in',
    'click', 'input', 'submit', 'change', 'keydown', 'keyup', 'scroll',
    'focus', 'blur', 'load', 'mouseover', 'mouseout',
  ],
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Spanish
// =============================================================================

export const SpanishEventsTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'es',
  customExtractors: [cssExtractor],
  keywords: [
    'escuchar', 'disparar', 'filtrar', 'delegar', 'limitar', 'retardar',
    'en', 'por', 'de', 'cada',
    'click', 'input', 'submit', 'change', 'keydown', 'scroll',
  ],
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Japanese
// =============================================================================

export const JapaneseEventsTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ja',
  customExtractors: [cssExtractor],
  keywords: [
    '聞く', '発火', 'フィルター', '委任', '制限', '遅延',
    'で', 'から', 'の中', 'ごと',
    'click', 'input', 'submit', 'change', 'keydown', 'scroll',
  ],
  keywordExtras: [
    { native: '聞く', normalized: 'listen' },
    { native: '発火', normalized: 'trigger' },
    { native: 'フィルター', normalized: 'filter' },
    { native: '委任', normalized: 'delegate' },
    { native: '制限', normalized: 'throttle' },
    { native: '遅延', normalized: 'debounce' },
    { native: 'で', normalized: 'on' },
    { native: 'から', normalized: 'from' },
    { native: 'の中', normalized: 'in' },
    { native: 'ごと', normalized: 'by' },
  ],
  keywordProfile: {
    keywords: {
      listen: { primary: '聞く' },
      trigger: { primary: '発火' },
      filter: { primary: 'フィルター' },
      delegate: { primary: '委任' },
      throttle: { primary: '制限' },
      debounce: { primary: '遅延' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Arabic
// =============================================================================

export const ArabicEventsTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ar',
  direction: 'rtl',
  customExtractors: [cssExtractor],
  keywords: [
    'استمع', 'أطلق', 'صفّي', 'فوّض', 'قيّد', 'أخّر',
    'على', 'بـ', 'من', 'في', 'كل',
    'click', 'input', 'submit', 'change', 'keydown', 'scroll',
  ],
  keywordExtras: [
    { native: 'استمع', normalized: 'listen' },
    { native: 'أطلق', normalized: 'trigger' },
    { native: 'صفّي', normalized: 'filter' },
    { native: 'فوّض', normalized: 'delegate' },
    { native: 'قيّد', normalized: 'throttle' },
    { native: 'أخّر', normalized: 'debounce' },
    { native: 'على', normalized: 'on' },
    { native: 'بـ', normalized: 'by' },
    { native: 'من', normalized: 'from' },
    { native: 'في', normalized: 'in' },
    { native: 'كل', normalized: 'by' },
  ],
  keywordProfile: {
    keywords: {
      listen: { primary: 'استمع' },
      trigger: { primary: 'أطلق' },
      filter: { primary: 'صفّي' },
      delegate: { primary: 'فوّض' },
      throttle: { primary: 'قيّد' },
      debounce: { primary: 'أخّر' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Korean
// =============================================================================

export const KoreanEventsTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ko',
  customExtractors: [cssExtractor],
  keywords: [
    '듣기', '발생', '필터', '위임', '제한', '지연',
    '에서', '로', '안', '마다',
    'click', 'input', 'submit', 'change', 'keydown', 'scroll',
  ],
  keywordExtras: [
    { native: '듣기', normalized: 'listen' },
    { native: '발생', normalized: 'trigger' },
    { native: '필터', normalized: 'filter' },
    { native: '위임', normalized: 'delegate' },
    { native: '제한', normalized: 'throttle' },
    { native: '지연', normalized: 'debounce' },
    { native: '에서', normalized: 'on' },
    { native: '로', normalized: 'by' },
    { native: '안', normalized: 'in' },
    { native: '마다', normalized: 'by' },
  ],
  keywordProfile: {
    keywords: {
      listen: { primary: '듣기' },
      trigger: { primary: '발생' },
      filter: { primary: '필터' },
      delegate: { primary: '위임' },
      throttle: { primary: '제한' },
      debounce: { primary: '지연' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Chinese
// =============================================================================

export const ChineseEventsTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'zh',
  customExtractors: [cssExtractor],
  keywords: [
    '监听', '触发', '过滤', '委托', '节流', '防抖',
    '在', '按', '从', '里', '每',
    'click', 'input', 'submit', 'change', 'keydown', 'scroll',
  ],
  keywordExtras: [
    { native: '监听', normalized: 'listen' },
    { native: '触发', normalized: 'trigger' },
    { native: '过滤', normalized: 'filter' },
    { native: '委托', normalized: 'delegate' },
    { native: '节流', normalized: 'throttle' },
    { native: '防抖', normalized: 'debounce' },
    { native: '在', normalized: 'on' },
    { native: '按', normalized: 'by' },
    { native: '从', normalized: 'from' },
    { native: '里', normalized: 'in' },
    { native: '每', normalized: 'by' },
  ],
  keywordProfile: {
    keywords: {
      listen: { primary: '监听' },
      trigger: { primary: '触发' },
      filter: { primary: '过滤' },
      delegate: { primary: '委托' },
      throttle: { primary: '节流' },
      debounce: { primary: '防抖' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Turkish
// =============================================================================

export const TurkishEventsTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'tr',
  customExtractors: [cssExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'dinle', 'tetikle', 'filtrele', 'devret', 'kısıtla', 'geciktir',
    'de', 'ile', 'den', 'içinde', 'her',
    'click', 'input', 'submit', 'change', 'keydown', 'scroll',
  ],
  keywordExtras: [
    { native: 'dinle', normalized: 'listen' },
    { native: 'tetikle', normalized: 'trigger' },
    { native: 'filtrele', normalized: 'filter' },
    { native: 'devret', normalized: 'delegate' },
    { native: 'kısıtla', normalized: 'throttle' },
    { native: 'geciktir', normalized: 'debounce' },
    { native: 'de', normalized: 'on' },
    { native: 'ile', normalized: 'by' },
    { native: 'den', normalized: 'from' },
    { native: 'içinde', normalized: 'in' },
    { native: 'her', normalized: 'by' },
  ],
  keywordProfile: {
    keywords: {
      listen: { primary: 'dinle' },
      trigger: { primary: 'tetikle' },
      filter: { primary: 'filtrele' },
      delegate: { primary: 'devret' },
      throttle: { primary: 'kısıtla' },
      debounce: { primary: 'geciktir' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// French
// =============================================================================

export const FrenchEventsTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'fr',
  customExtractors: [cssExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'écouter', 'déclencher', 'filtrer', 'déléguer', 'limiter', 'temporiser',
    'sur', 'par', 'de', 'dans', 'chaque',
    'click', 'input', 'submit', 'change', 'keydown', 'scroll',
  ],
  keywordExtras: [
    { native: 'écouter', normalized: 'listen' },
    { native: 'déclencher', normalized: 'trigger' },
    { native: 'filtrer', normalized: 'filter' },
    { native: 'déléguer', normalized: 'delegate' },
    { native: 'limiter', normalized: 'throttle' },
    { native: 'temporiser', normalized: 'debounce' },
    { native: 'sur', normalized: 'on' },
    { native: 'par', normalized: 'by' },
    { native: 'de', normalized: 'from' },
    { native: 'dans', normalized: 'in' },
    { native: 'chaque', normalized: 'by' },
  ],
  keywordProfile: {
    keywords: {
      listen: { primary: 'écouter' },
      trigger: { primary: 'déclencher' },
      filter: { primary: 'filtrer' },
      delegate: { primary: 'déléguer' },
      throttle: { primary: 'limiter' },
      debounce: { primary: 'temporiser' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});
