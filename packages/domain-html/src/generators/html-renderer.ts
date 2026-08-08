/**
 * HTML Natural Language Renderer
 *
 * Renders a SemanticNode back into natural-language HTML structure DSL
 * syntax for a target language. Inverse of the parser.
 */

import type { SemanticNode } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

// =============================================================================
// Keyword Tables
// =============================================================================

const COMMAND_KEYWORDS: Record<string, Record<string, string>> = {
  create: {
    en: 'create', es: 'crear', ja: '作成', ar: 'أنشئ',
    ko: '생성', zh: '创建', tr: 'oluştur', fr: 'créer',
  },
  nest: {
    en: 'nest', es: 'anidar', ja: '入れ子', ar: 'أدخل',
    ko: '중첩', zh: '嵌套', tr: 'yerleştir', fr: 'imbriquer',
  },
  link: {
    en: 'link', es: 'enlazar', ja: 'リンク', ar: 'اربط',
    ko: '링크', zh: '链接', tr: 'bağla', fr: 'lier',
  },
  label: {
    en: 'label', es: 'etiquetar', ja: 'ラベル', ar: 'وسم',
    ko: '라벨', zh: '标签', tr: 'etiketle', fr: 'étiqueter',
  },
  input: {
    en: 'input', es: 'entrada', ja: '入力', ar: 'حقل',
    ko: '입력', zh: '输入', tr: 'giriş', fr: 'saisie',
  },
};

const MARKERS: Record<string, Record<string, string>> = {
  with: {
    en: 'with', es: 'con', ja: 'で', ar: 'بـ',
    ko: '로', zh: '用', tr: 'ile', fr: 'avec',
  },
  inside: {
    en: 'inside', es: 'dentro', ja: 'の中', ar: 'داخل',
    ko: '안에', zh: '里面', tr: 'içine', fr: 'dans',
  },
  to: {
    en: 'to', es: 'a', ja: 'へ', ar: 'إلى',
    ko: '로', zh: '到', tr: 'ye', fr: 'vers',
  },
  named: {
    en: 'named', es: 'llamado', ja: '名前', ar: 'باسم',
    ko: '이름', zh: '名为', tr: 'adlı', fr: 'nommé',
  },
};

// =============================================================================
// Word Order Helpers
// =============================================================================

const SOV_LANGUAGES = new Set(['ja', 'ko', 'tr']);

function isSOV(lang: string): boolean {
  return SOV_LANGUAGES.has(lang);
}

function kw(command: string, lang: string): string {
  return COMMAND_KEYWORDS[command]?.[lang] ?? command;
}

function mk(marker: string, lang: string): string {
  return MARKERS[marker]?.[lang] ?? marker;
}

// =============================================================================
// Per-Command Renderers
// =============================================================================

function renderCreate(node: SemanticNode, lang: string): string {
  const element = extractRoleValue(node, 'element') || 'div';
  const attribute = extractRoleValue(node, 'attribute');
  const keyword = kw('create', lang);

  if (!attribute) {
    if (isSOV(lang)) {
      return `${element} ${keyword}`;
    }
    return `${keyword} ${element}`;
  }

  if (isSOV(lang)) {
    return `${element} ${mk('with', lang)} ${attribute} ${keyword}`;
  }
  return `${keyword} ${element} ${mk('with', lang)} ${attribute}`;
}

function renderNest(node: SemanticNode, lang: string): string {
  const child = extractRoleValue(node, 'child') || 'paragraph';
  const parent = extractRoleValue(node, 'parent') || 'container';
  const keyword = kw('nest', lang);

  if (isSOV(lang)) {
    return `${child} ${parent} ${mk('inside', lang)} ${keyword}`;
  }
  return `${keyword} ${child} ${mk('inside', lang)} ${parent}`;
}

function renderLink(node: SemanticNode, lang: string): string {
  const text = extractRoleValue(node, 'text') || '"Home"';
  const url = extractRoleValue(node, 'url') || '/home';
  const keyword = kw('link', lang);

  if (isSOV(lang)) {
    return `${text} ${url} ${mk('to', lang)} ${keyword}`;
  }
  return `${keyword} ${text} ${mk('to', lang)} ${url}`;
}

function renderLabel(node: SemanticNode, lang: string): string {
  const target = extractRoleValue(node, 'target') || '#field';
  const text = extractRoleValue(node, 'text') || '"Label"';
  const keyword = kw('label', lang);

  if (isSOV(lang)) {
    return `${target} ${mk('with', lang)} ${text} ${keyword}`;
  }
  return `${keyword} ${target} ${mk('with', lang)} ${text}`;
}

function renderInput(node: SemanticNode, lang: string): string {
  const inputType = extractRoleValue(node, 'type') || 'text';
  const name = extractRoleValue(node, 'name') || '"field"';
  const keyword = kw('input', lang);

  if (isSOV(lang)) {
    return `${inputType} ${mk('named', lang)} ${name} ${keyword}`;
  }
  return `${keyword} ${inputType} ${mk('named', lang)} ${name}`;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Render an HTML SemanticNode to natural-language DSL text in the target language.
 */
export function renderHtml(node: SemanticNode, language: string): string {
  switch (node.action) {
    case 'create':
      return renderCreate(node, language);
    case 'nest':
      return renderNest(node, language);
    case 'link':
      return renderLink(node, language);
    case 'label':
      return renderLabel(node, language);
    case 'input':
      return renderInput(node, language);
    default:
      return `-- Unknown: ${node.action}`;
  }
}
