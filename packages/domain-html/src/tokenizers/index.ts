/**
 * HTML Structure Tokenizers
 *
 * Language-specific tokenizers for HTML structure input (8 languages),
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
// Quoted String Extractor — captures content within double quotes as a token
// =============================================================================

class QuotedStringExtractor implements ValueExtractor {
  readonly name = 'quoted-string';

  canExtract(input: string, position: number): boolean {
    return input[position] === '"';
  }

  extract(input: string, position: number): ExtractionResult | null {
    if (input[position] !== '"') return null;
    const end = input.indexOf('"', position + 1);
    if (end === -1) return null;
    // Return the full quoted string including quotes
    const fullLength = end - position + 1;
    return { value: input.slice(position, end + 1), length: fullLength };
  }
}

// =============================================================================
// URL Path Extractor — handles /path tokens
// =============================================================================

class UrlPathExtractor implements ValueExtractor {
  readonly name = 'url-path';

  canExtract(input: string, position: number): boolean {
    return input[position] === '/' && position + 1 < input.length &&
      /[\p{L}\p{N}_-]/u.test(input[position + 1]);
  }

  extract(input: string, position: number): ExtractionResult | null {
    let end = position + 1;
    while (end < input.length && /[\p{L}\p{N}_./:-]/u.test(input[end])) {
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
// Shared extractors
// =============================================================================

const cssExtractor = new CssSelectorExtractor();
const quotedStringExtractor = new QuotedStringExtractor();
const urlPathExtractor = new UrlPathExtractor();

// =============================================================================
// Shared keyword lists
// =============================================================================

const HTML_ELEMENTS = [
  'button', 'div', 'span', 'p', 'h1', 'h2', 'h3',
  'section', 'article', 'nav', 'header', 'footer',
  'paragraph', 'container',
];

const HTML_ATTRIBUTES = ['class', 'type', 'name', 'id', 'for'];

const INPUT_TYPES = ['text', 'email', 'password', 'number', 'checkbox', 'radio'];

// =============================================================================
// English
// =============================================================================

export const EnglishHtmlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'en',
  customExtractors: [cssExtractor, quotedStringExtractor, urlPathExtractor],
  keywords: [
    'create', 'nest', 'link', 'label', 'input',
    'with', 'inside', 'to', 'named',
    ...HTML_ELEMENTS,
    ...HTML_ATTRIBUTES,
    ...INPUT_TYPES,
  ],
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Spanish
// =============================================================================

export const SpanishHtmlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'es',
  customExtractors: [cssExtractor, quotedStringExtractor, urlPathExtractor],
  keywords: [
    'crear', 'anidar', 'enlazar', 'etiquetar', 'entrada',
    'con', 'dentro', 'a', 'llamado',
    ...HTML_ELEMENTS,
    ...HTML_ATTRIBUTES,
    ...INPUT_TYPES,
  ],
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// Japanese
// =============================================================================

export const JapaneseHtmlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ja',
  customExtractors: [cssExtractor, quotedStringExtractor, urlPathExtractor],
  keywords: [
    '作成', '入れ子', 'リンク', 'ラベル', '入力',
    'で', 'の中', 'へ', '名前',
    ...HTML_ELEMENTS,
    ...HTML_ATTRIBUTES,
    ...INPUT_TYPES,
  ],
  keywordExtras: [
    { native: '作成', normalized: 'create' },
    { native: '入れ子', normalized: 'nest' },
    { native: 'リンク', normalized: 'link' },
    { native: 'ラベル', normalized: 'label' },
    { native: '入力', normalized: 'input' },
    { native: 'で', normalized: 'with' },
    { native: 'の中', normalized: 'inside' },
    { native: 'へ', normalized: 'to' },
    { native: '名前', normalized: 'named' },
  ],
  keywordProfile: {
    keywords: {
      create: { primary: '作成' },
      nest: { primary: '入れ子' },
      link: { primary: 'リンク' },
      label: { primary: 'ラベル' },
      input: { primary: '入力' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Arabic
// =============================================================================

export const ArabicHtmlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ar',
  direction: 'rtl',
  customExtractors: [cssExtractor, quotedStringExtractor, urlPathExtractor],
  keywords: [
    'أنشئ', 'أدخل', 'اربط', 'وسم', 'حقل',
    'بـ', 'داخل', 'إلى', 'باسم',
    ...HTML_ELEMENTS,
    ...HTML_ATTRIBUTES,
    ...INPUT_TYPES,
  ],
  keywordExtras: [
    { native: 'أنشئ', normalized: 'create' },
    { native: 'أدخل', normalized: 'nest' },
    { native: 'اربط', normalized: 'link' },
    { native: 'وسم', normalized: 'label' },
    { native: 'حقل', normalized: 'input' },
    { native: 'بـ', normalized: 'with' },
    { native: 'داخل', normalized: 'inside' },
    { native: 'إلى', normalized: 'to' },
    { native: 'باسم', normalized: 'named' },
  ],
  keywordProfile: {
    keywords: {
      create: { primary: 'أنشئ' },
      nest: { primary: 'أدخل' },
      link: { primary: 'اربط' },
      label: { primary: 'وسم' },
      input: { primary: 'حقل' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Korean
// =============================================================================

export const KoreanHtmlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ko',
  customExtractors: [cssExtractor, quotedStringExtractor, urlPathExtractor],
  keywords: [
    '생성', '중첩', '링크', '라벨', '입력',
    '로', '안에', '이름',
    ...HTML_ELEMENTS,
    ...HTML_ATTRIBUTES,
    ...INPUT_TYPES,
  ],
  keywordExtras: [
    { native: '생성', normalized: 'create' },
    { native: '중첩', normalized: 'nest' },
    { native: '링크', normalized: 'link' },
    { native: '라벨', normalized: 'label' },
    { native: '입력', normalized: 'input' },
    { native: '로', normalized: 'with' },
    { native: '안에', normalized: 'inside' },
    { native: '이름', normalized: 'named' },
  ],
  keywordProfile: {
    keywords: {
      create: { primary: '생성' },
      nest: { primary: '중첩' },
      link: { primary: '링크' },
      label: { primary: '라벨' },
      input: { primary: '입력' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Chinese
// =============================================================================

export const ChineseHtmlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'zh',
  customExtractors: [cssExtractor, quotedStringExtractor, urlPathExtractor],
  keywords: [
    '创建', '嵌套', '链接', '标签', '输入',
    '用', '里面', '到', '名为',
    ...HTML_ELEMENTS,
    ...HTML_ATTRIBUTES,
    ...INPUT_TYPES,
  ],
  keywordExtras: [
    { native: '创建', normalized: 'create' },
    { native: '嵌套', normalized: 'nest' },
    { native: '链接', normalized: 'link' },
    { native: '标签', normalized: 'label' },
    { native: '输入', normalized: 'input' },
    { native: '用', normalized: 'with' },
    { native: '里面', normalized: 'inside' },
    { native: '到', normalized: 'to' },
    { native: '名为', normalized: 'named' },
  ],
  keywordProfile: {
    keywords: {
      create: { primary: '创建' },
      nest: { primary: '嵌套' },
      link: { primary: '链接' },
      label: { primary: '标签' },
      input: { primary: '输入' },
    },
  },
  includeOperators: true,
  caseInsensitive: false,
});

// =============================================================================
// Turkish
// =============================================================================

export const TurkishHtmlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'tr',
  customExtractors: [cssExtractor, quotedStringExtractor, urlPathExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'oluştur', 'yerleştir', 'bağla', 'etiketle', 'giriş',
    'ile', 'içine', 'ye', 'adlı',
    ...HTML_ELEMENTS,
    ...HTML_ATTRIBUTES,
    ...INPUT_TYPES,
  ],
  keywordExtras: [
    { native: 'oluştur', normalized: 'create' },
    { native: 'yerleştir', normalized: 'nest' },
    { native: 'bağla', normalized: 'link' },
    { native: 'etiketle', normalized: 'label' },
    { native: 'giriş', normalized: 'input' },
    { native: 'ile', normalized: 'with' },
    { native: 'içine', normalized: 'inside' },
    { native: 'ye', normalized: 'to' },
    { native: 'adlı', normalized: 'named' },
  ],
  keywordProfile: {
    keywords: {
      create: { primary: 'oluştur' },
      nest: { primary: 'yerleştir' },
      link: { primary: 'bağla' },
      label: { primary: 'etiketle' },
      input: { primary: 'giriş' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});

// =============================================================================
// French
// =============================================================================

export const FrenchHtmlTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'fr',
  customExtractors: [cssExtractor, quotedStringExtractor, urlPathExtractor, new LatinExtendedIdentifierExtractor()],
  keywords: [
    'créer', 'imbriquer', 'lier', 'étiqueter', 'saisie',
    'avec', 'dans', 'vers', 'nommé',
    ...HTML_ELEMENTS,
    ...HTML_ATTRIBUTES,
    ...INPUT_TYPES,
  ],
  keywordExtras: [
    { native: 'créer', normalized: 'create' },
    { native: 'imbriquer', normalized: 'nest' },
    { native: 'lier', normalized: 'link' },
    { native: 'étiqueter', normalized: 'label' },
    { native: 'saisie', normalized: 'input' },
    { native: 'avec', normalized: 'with' },
    { native: 'dans', normalized: 'inside' },
    { native: 'vers', normalized: 'to' },
    { native: 'nommé', normalized: 'named' },
  ],
  keywordProfile: {
    keywords: {
      create: { primary: 'créer' },
      nest: { primary: 'imbriquer' },
      link: { primary: 'lier' },
      label: { primary: 'étiqueter' },
      input: { primary: 'saisie' },
    },
  },
  includeOperators: true,
  caseInsensitive: true,
});
