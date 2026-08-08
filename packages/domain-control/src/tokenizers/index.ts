/**
 * Control Flow Tokenizers
 *
 * Language-specific tokenizers for control flow input (8 languages),
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
// Shared constants
// =============================================================================

const cssExtractor = new CssSelectorExtractor();

// Condition words used across languages (always in English in the DSL input)
const CONDITION_WORDS = [
  'is', 'empty', 'valid', 'visible', 'true', 'false',
];

// Numbers 1-20 as keywords
const NUMBERS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
];

// =============================================================================
// English
// =============================================================================

export const EnglishControlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'en',
  customExtractors: [cssExtractor],
  keywords: [
    'check', 'repeat', 'iterate', 'guard', 'loop',
    'times', 'as', 'while', 'until',
    ...CONDITION_WORDS,
    ...NUMBERS,
  ],
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Spanish
// =============================================================================

export const SpanishControlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'es',
  customExtractors: [cssExtractor],
  keywords: [
    'verificar', 'repetir', 'iterar', 'proteger', 'bucle',
    'veces', 'como', 'mientras', 'hasta',
    ...CONDITION_WORDS,
    ...NUMBERS,
  ],
  keywordExtras: [
    { native: 'verificar', normalized: 'check' },
    { native: 'repetir', normalized: 'repeat' },
    { native: 'iterar', normalized: 'iterate' },
    { native: 'proteger', normalized: 'guard' },
    { native: 'bucle', normalized: 'loop' },
    { native: 'veces', normalized: 'times' },
    { native: 'como', normalized: 'as' },
    { native: 'mientras', normalized: 'while' },
    { native: 'hasta', normalized: 'until' },
  ],
  keywordProfile: {
    keywords: {
      check: { primary: 'verificar' },
      repeat: { primary: 'repetir' },
      iterate: { primary: 'iterar' },
      guard: { primary: 'proteger' },
      loop: { primary: 'bucle' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Japanese
// =============================================================================

export const JapaneseControlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ja',
  customExtractors: [cssExtractor],
  keywords: [
    '確認', '繰り返す', '反復', '守る', 'ループ',
    '回', 'として', '間', 'まで',
    ...CONDITION_WORDS,
    ...NUMBERS,
  ],
  keywordExtras: [
    { native: '確認', normalized: 'check' },
    { native: '繰り返す', normalized: 'repeat' },
    { native: '反復', normalized: 'iterate' },
    { native: '守る', normalized: 'guard' },
    { native: 'ループ', normalized: 'loop' },
    { native: '回', normalized: 'times' },
    { native: 'として', normalized: 'as' },
    { native: '間', normalized: 'while' },
    { native: 'まで', normalized: 'until' },
  ],
  keywordProfile: {
    keywords: {
      check: { primary: '確認' },
      repeat: { primary: '繰り返す' },
      iterate: { primary: '反復' },
      guard: { primary: '守る' },
      loop: { primary: 'ループ' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Arabic
// =============================================================================

export const ArabicControlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ar',
  direction: 'rtl',
  customExtractors: [cssExtractor],
  keywords: [
    'تحقق', 'كرر', 'عدّد', 'احمِ', 'حلقة',
    'مرات', 'كـ', 'بينما', 'حتى',
    ...CONDITION_WORDS,
    ...NUMBERS,
  ],
  keywordExtras: [
    { native: 'تحقق', normalized: 'check' },
    { native: 'كرر', normalized: 'repeat' },
    { native: 'عدّد', normalized: 'iterate' },
    { native: 'احمِ', normalized: 'guard' },
    { native: 'حلقة', normalized: 'loop' },
    { native: 'مرات', normalized: 'times' },
    { native: 'كـ', normalized: 'as' },
    { native: 'بينما', normalized: 'while' },
    { native: 'حتى', normalized: 'until' },
  ],
  keywordProfile: {
    keywords: {
      check: { primary: 'تحقق' },
      repeat: { primary: 'كرر' },
      iterate: { primary: 'عدّد' },
      guard: { primary: 'احمِ' },
      loop: { primary: 'حلقة' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Korean
// =============================================================================

export const KoreanControlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ko',
  customExtractors: [cssExtractor],
  keywords: [
    '확인', '반복', '반복하기', '보호', '루프',
    '번', '로', '동안', '까지',
    ...CONDITION_WORDS,
    ...NUMBERS,
  ],
  keywordExtras: [
    { native: '확인', normalized: 'check' },
    { native: '반복', normalized: 'repeat' },
    { native: '반복하기', normalized: 'iterate' },
    { native: '보호', normalized: 'guard' },
    { native: '루프', normalized: 'loop' },
    { native: '번', normalized: 'times' },
    { native: '로', normalized: 'as' },
    { native: '동안', normalized: 'while' },
    { native: '까지', normalized: 'until' },
  ],
  keywordProfile: {
    keywords: {
      check: { primary: '확인' },
      repeat: { primary: '반복' },
      iterate: { primary: '반복하기' },
      guard: { primary: '보호' },
      loop: { primary: '루프' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Chinese
// =============================================================================

export const ChineseControlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'zh',
  customExtractors: [cssExtractor],
  keywords: [
    '检查', '重复', '遍历', '守卫', '循环',
    '次', '作为', '当', '直到',
    ...CONDITION_WORDS,
    ...NUMBERS,
  ],
  keywordExtras: [
    { native: '检查', normalized: 'check' },
    { native: '重复', normalized: 'repeat' },
    { native: '遍历', normalized: 'iterate' },
    { native: '守卫', normalized: 'guard' },
    { native: '循环', normalized: 'loop' },
    { native: '次', normalized: 'times' },
    { native: '作为', normalized: 'as' },
    { native: '当', normalized: 'while' },
    { native: '直到', normalized: 'until' },
  ],
  keywordProfile: {
    keywords: {
      check: { primary: '检查' },
      repeat: { primary: '重复' },
      iterate: { primary: '遍历' },
      guard: { primary: '守卫' },
      loop: { primary: '循环' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Turkish
// =============================================================================

export const TurkishControlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'tr',
  customExtractors: [cssExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'kontrol', 'tekrarla', 'yinele', 'koru', 'döngü',
    'kez', 'olarak', 'iken', 'kadar',
    ...CONDITION_WORDS,
    ...NUMBERS,
  ],
  keywordExtras: [
    { native: 'kontrol', normalized: 'check' },
    { native: 'tekrarla', normalized: 'repeat' },
    { native: 'yinele', normalized: 'iterate' },
    { native: 'koru', normalized: 'guard' },
    { native: 'döngü', normalized: 'loop' },
    { native: 'kez', normalized: 'times' },
    { native: 'olarak', normalized: 'as' },
    { native: 'iken', normalized: 'while' },
    { native: 'kadar', normalized: 'until' },
  ],
  keywordProfile: {
    keywords: {
      check: { primary: 'kontrol' },
      repeat: { primary: 'tekrarla' },
      iterate: { primary: 'yinele' },
      guard: { primary: 'koru' },
      loop: { primary: 'döngü' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// French
// =============================================================================

export const FrenchControlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'fr',
  customExtractors: [cssExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'vérifier', 'répéter', 'itérer', 'garder', 'boucle',
    'fois', 'comme', 'pendant', 'jusque',
    ...CONDITION_WORDS,
    ...NUMBERS,
  ],
  keywordExtras: [
    { native: 'vérifier', normalized: 'check' },
    { native: 'répéter', normalized: 'repeat' },
    { native: 'itérer', normalized: 'iterate' },
    { native: 'garder', normalized: 'guard' },
    { native: 'boucle', normalized: 'loop' },
    { native: 'fois', normalized: 'times' },
    { native: 'comme', normalized: 'as' },
    { native: 'pendant', normalized: 'while' },
    { native: 'jusque', normalized: 'until' },
  ],
  keywordProfile: {
    keywords: {
      check: { primary: 'vérifier' },
      repeat: { primary: 'répéter' },
      iterate: { primary: 'itérer' },
      guard: { primary: 'garder' },
      loop: { primary: 'boucle' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});
