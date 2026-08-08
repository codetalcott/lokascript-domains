/**
 * Hypermedia Tokenizers
 *
 * Language-specific tokenizers for hypermedia input (8 languages),
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
// URL Path Extractor — handles /api/users, /products/1 as single tokens
// =============================================================================

class UrlPathExtractor implements ValueExtractor {
  readonly name = 'url-path';

  canExtract(input: string, position: number): boolean {
    return input[position] === '/' && position + 1 < input.length &&
      /[\p{L}\p{N}_-]/u.test(input[position + 1]);
  }

  extract(input: string, position: number): ExtractionResult | null {
    let end = position + 1; // skip /
    while (end < input.length && /[\p{L}\p{N}_./:-]/u.test(input[end])) {
      end++;
    }
    // Trim trailing dot/slash
    while (end > position + 1 && (input[end - 1] === '.' || input[end - 1] === '/')) {
      end--;
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
// Shared extractors
// =============================================================================

const cssExtractor = new CssSelectorExtractor();
const urlExtractor = new UrlPathExtractor();

// =============================================================================
// English
// =============================================================================

export const EnglishHypermediaTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'en',
  customExtractors: [cssExtractor, urlExtractor],
  keywords: [
    'request', 'swap', 'morph', 'push', 'replace',
    'into', 'with',
    'response', 'innerHTML', 'outerHTML', 'beforeend',
  ],
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Spanish
// =============================================================================

export const SpanishHypermediaTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'es',
  customExtractors: [cssExtractor, urlExtractor],
  keywords: [
    'solicitar', 'intercambiar', 'transformar', 'empujar', 'reemplazar',
    'en', 'con',
    'response', 'innerHTML', 'outerHTML', 'beforeend',
  ],
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Japanese
// =============================================================================

export const JapaneseHypermediaTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ja',
  customExtractors: [cssExtractor, urlExtractor],
  keywords: [
    'リクエスト', '入れ替え', '変形', 'プッシュ', '置換',
    'に', 'で',
    'response', 'innerHTML', 'outerHTML', 'beforeend',
  ],
  keywordExtras: [
    { native: 'リクエスト', normalized: 'request' },
    { native: '入れ替え', normalized: 'swap' },
    { native: '変形', normalized: 'morph' },
    { native: 'プッシュ', normalized: 'push' },
    { native: '置換', normalized: 'replace' },
    { native: 'に', normalized: 'into' },
    { native: 'で', normalized: 'with' },
  ],
  keywordProfile: {
    keywords: {
      request: { primary: 'リクエスト' },
      swap: { primary: '入れ替え' },
      morph: { primary: '変形' },
      push: { primary: 'プッシュ' },
      replace: { primary: '置換' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Arabic
// =============================================================================

export const ArabicHypermediaTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ar',
  direction: 'rtl',
  customExtractors: [cssExtractor, urlExtractor],
  keywords: [
    'اطلب', 'بدّل', 'حوّل', 'ادفع', 'استبدل',
    'في', 'بـ',
    'response', 'innerHTML', 'outerHTML', 'beforeend',
  ],
  keywordExtras: [
    { native: 'اطلب', normalized: 'request' },
    { native: 'بدّل', normalized: 'swap' },
    { native: 'حوّل', normalized: 'morph' },
    { native: 'ادفع', normalized: 'push' },
    { native: 'استبدل', normalized: 'replace' },
    { native: 'في', normalized: 'into' },
    { native: 'بـ', normalized: 'with' },
  ],
  keywordProfile: {
    keywords: {
      request: { primary: 'اطلب' },
      swap: { primary: 'بدّل' },
      morph: { primary: 'حوّل' },
      push: { primary: 'ادفع' },
      replace: { primary: 'استبدل' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Korean
// =============================================================================

export const KoreanHypermediaTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ko',
  customExtractors: [cssExtractor, urlExtractor],
  keywords: [
    '요청', '교체', '변환', '푸시', '교환',
    '에', '로',
    'response', 'innerHTML', 'outerHTML', 'beforeend',
  ],
  keywordExtras: [
    { native: '요청', normalized: 'request' },
    { native: '교체', normalized: 'swap' },
    { native: '변환', normalized: 'morph' },
    { native: '푸시', normalized: 'push' },
    { native: '교환', normalized: 'replace' },
    { native: '에', normalized: 'into' },
    { native: '로', normalized: 'with' },
  ],
  keywordProfile: {
    keywords: {
      request: { primary: '요청' },
      swap: { primary: '교체' },
      morph: { primary: '변환' },
      push: { primary: '푸시' },
      replace: { primary: '교환' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Chinese
// =============================================================================

export const ChineseHypermediaTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'zh',
  customExtractors: [cssExtractor, urlExtractor],
  keywords: [
    '请求', '交换', '变形', '推送', '替换',
    '到', '用',
    'response', 'innerHTML', 'outerHTML', 'beforeend',
  ],
  keywordExtras: [
    { native: '请求', normalized: 'request' },
    { native: '交换', normalized: 'swap' },
    { native: '变形', normalized: 'morph' },
    { native: '推送', normalized: 'push' },
    { native: '替换', normalized: 'replace' },
    { native: '到', normalized: 'into' },
    { native: '用', normalized: 'with' },
  ],
  keywordProfile: {
    keywords: {
      request: { primary: '请求' },
      swap: { primary: '交换' },
      morph: { primary: '变形' },
      push: { primary: '推送' },
      replace: { primary: '替换' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Turkish
// =============================================================================

export const TurkishHypermediaTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'tr',
  customExtractors: [cssExtractor, urlExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'iste', 'değiştir', 'dönüştür', 'it', 'yerleştir',
    'içine', 'ile',
    'response', 'innerHTML', 'outerHTML', 'beforeend',
  ],
  keywordExtras: [
    { native: 'iste', normalized: 'request' },
    { native: 'değiştir', normalized: 'swap' },
    { native: 'dönüştür', normalized: 'morph' },
    { native: 'it', normalized: 'push' },
    { native: 'yerleştir', normalized: 'replace' },
    { native: 'içine', normalized: 'into' },
    { native: 'ile', normalized: 'with' },
  ],
  keywordProfile: {
    keywords: {
      request: { primary: 'iste' },
      swap: { primary: 'değiştir' },
      morph: { primary: 'dönüştür' },
      push: { primary: 'it' },
      replace: { primary: 'yerleştir' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// French
// =============================================================================

export const FrenchHypermediaTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'fr',
  customExtractors: [cssExtractor, urlExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'demander', 'échanger', 'transformer', 'pousser', 'remplacer',
    'dans', 'avec',
    'response', 'innerHTML', 'outerHTML', 'beforeend',
  ],
  keywordExtras: [
    { native: 'demander', normalized: 'request' },
    { native: 'échanger', normalized: 'swap' },
    { native: 'transformer', normalized: 'morph' },
    { native: 'pousser', normalized: 'push' },
    { native: 'remplacer', normalized: 'replace' },
    { native: 'dans', normalized: 'into' },
    { native: 'avec', normalized: 'with' },
  ],
  keywordProfile: {
    keywords: {
      request: { primary: 'demander' },
      swap: { primary: 'échanger' },
      morph: { primary: 'transformer' },
      push: { primary: 'pousser' },
      replace: { primary: 'remplacer' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});
