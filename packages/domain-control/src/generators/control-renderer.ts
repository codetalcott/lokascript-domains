/**
 * Control Flow Natural Language Renderer
 *
 * Renders a SemanticNode back into natural-language control flow DSL
 * syntax for a target language. Inverse of the parser.
 */

import type { SemanticNode } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

// =============================================================================
// Keyword Tables
// =============================================================================

const COMMAND_KEYWORDS: Record<string, Record<string, string>> = {
  check: {
    en: 'check', es: 'verificar', ja: '確認', ar: 'تحقق',
    ko: '확인', zh: '检查', tr: 'kontrol', fr: 'vérifier',
  },
  repeat: {
    en: 'repeat', es: 'repetir', ja: '繰り返す', ar: 'كرر',
    ko: '반복', zh: '重复', tr: 'tekrarla', fr: 'répéter',
  },
  iterate: {
    en: 'iterate', es: 'iterar', ja: '反復', ar: 'عدّد',
    ko: '반복하기', zh: '遍历', tr: 'yinele', fr: 'itérer',
  },
  guard: {
    en: 'guard', es: 'proteger', ja: '守る', ar: 'احمِ',
    ko: '보호', zh: '守卫', tr: 'koru', fr: 'garder',
  },
  loop: {
    en: 'loop', es: 'bucle', ja: 'ループ', ar: 'حلقة',
    ko: '루프', zh: '循环', tr: 'döngü', fr: 'boucle',
  },
};

const MARKERS: Record<string, Record<string, string>> = {
  times: {
    en: 'times', es: 'veces', ja: '回', ar: 'مرات',
    ko: '번', zh: '次', tr: 'kez', fr: 'fois',
  },
  as: {
    en: 'as', es: 'como', ja: 'として', ar: 'كـ',
    ko: '로', zh: '作为', tr: 'olarak', fr: 'comme',
  },
  while: {
    en: 'while', es: 'mientras', ja: '間', ar: 'بينما',
    ko: '동안', zh: '当', tr: 'iken', fr: 'pendant',
  },
  until: {
    en: 'until', es: 'hasta', ja: 'まで', ar: 'حتى',
    ko: '까지', zh: '直到', tr: 'kadar', fr: 'jusque',
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

function renderCheck(node: SemanticNode, lang: string): string {
  const condition = extractRoleValue(node, 'condition') || '#input is empty';
  const keyword = kw('check', lang);

  if (isSOV(lang)) {
    return `${condition} ${keyword}`;
  }
  return `${keyword} ${condition}`;
}

function renderRepeat(node: SemanticNode, lang: string): string {
  const count = extractRoleValue(node, 'count') || '5';
  const keyword = kw('repeat', lang);
  const timesMarker = mk('times', lang);

  if (isSOV(lang)) {
    return `${count} ${timesMarker} ${keyword}`;
  }
  return `${keyword} ${count} ${timesMarker}`;
}

function renderIterate(node: SemanticNode, lang: string): string {
  const collection = extractRoleValue(node, 'collection') || '.items';
  const variable = extractRoleValue(node, 'variable') || 'item';
  const keyword = kw('iterate', lang);
  const asMarker = mk('as', lang);

  if (isSOV(lang)) {
    return `${collection} ${asMarker} ${variable} ${keyword}`;
  }
  return `${keyword} ${collection} ${asMarker} ${variable}`;
}

function renderGuard(node: SemanticNode, lang: string): string {
  const condition = extractRoleValue(node, 'condition') || '#form is valid';
  const keyword = kw('guard', lang);

  if (isSOV(lang)) {
    return `${condition} ${keyword}`;
  }
  return `${keyword} ${condition}`;
}

function renderLoop(node: SemanticNode, lang: string): string {
  const condition = extractRoleValue(node, 'condition') || '#spinner is visible';
  const mode = extractRoleValue(node, 'mode') || 'while';
  const keyword = kw('loop', lang);
  const modeMarker = mk(mode, lang);

  if (isSOV(lang)) {
    return `${condition} ${modeMarker} ${keyword}`;
  }
  return `${keyword} ${modeMarker} ${condition}`;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Render a Control Flow SemanticNode to natural-language DSL text in the target language.
 */
export function renderControl(node: SemanticNode, language: string): string {
  switch (node.action) {
    case 'check':
      return renderCheck(node, language);
    case 'repeat':
      return renderRepeat(node, language);
    case 'iterate':
      return renderIterate(node, language);
    case 'guard':
      return renderGuard(node, language);
    case 'loop':
      return renderLoop(node, language);
    default:
      return `-- Unknown: ${node.action}`;
  }
}
