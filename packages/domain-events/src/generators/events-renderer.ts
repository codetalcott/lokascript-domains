/**
 * Events Natural Language Renderer
 *
 * Renders a SemanticNode back into natural-language event handling DSL
 * syntax for a target language. Inverse of the parser.
 */

import type { SemanticNode } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

// =============================================================================
// Keyword Tables
// =============================================================================

const COMMAND_KEYWORDS: Record<string, Record<string, string>> = {
  listen: {
    en: 'listen', es: 'escuchar', ja: '聞く', ar: 'استمع',
    ko: '듣기', zh: '监听', tr: 'dinle', fr: 'écouter',
  },
  trigger: {
    en: 'trigger', es: 'disparar', ja: '発火', ar: 'أطلق',
    ko: '발생', zh: '触发', tr: 'tetikle', fr: 'déclencher',
  },
  filter: {
    en: 'filter', es: 'filtrar', ja: 'フィルター', ar: 'صفّي',
    ko: '필터', zh: '过滤', tr: 'filtrele', fr: 'filtrer',
  },
  delegate: {
    en: 'delegate', es: 'delegar', ja: '委任', ar: 'فوّض',
    ko: '위임', zh: '委托', tr: 'devret', fr: 'déléguer',
  },
  throttle: {
    en: 'throttle', es: 'limitar', ja: '制限', ar: 'قيّد',
    ko: '제한', zh: '节流', tr: 'kısıtla', fr: 'limiter',
  },
  debounce: {
    en: 'debounce', es: 'retardar', ja: '遅延', ar: 'أخّر',
    ko: '지연', zh: '防抖', tr: 'geciktir', fr: 'temporiser',
  },
};

const MARKERS: Record<string, Record<string, string>> = {
  on: {
    en: 'on', es: 'en', ja: 'で', ar: 'على',
    ko: '에서', zh: '在', tr: 'de', fr: 'sur',
  },
  by: {
    en: 'by', es: 'por', ja: 'で', ar: 'بـ',
    ko: '로', zh: '按', tr: 'ile', fr: 'par',
  },
  from: {
    en: 'from', es: 'de', ja: 'から', ar: 'من',
    ko: '에서', zh: '从', tr: 'den', fr: 'de',
  },
  in: {
    en: 'in', es: 'en', ja: 'の中', ar: 'في',
    ko: '안', zh: '里', tr: 'içinde', fr: 'dans',
  },
  every: {
    en: 'by', es: 'cada', ja: 'ごと', ar: 'كل',
    ko: '마다', zh: '每', tr: 'her', fr: 'chaque',
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

function renderListen(node: SemanticNode, lang: string): string {
  const event = extractRoleValue(node, 'event') || 'click';
  const target = extractRoleValue(node, 'target');
  const keyword = kw('listen', lang);

  if (!target) {
    return `${keyword} ${event}`;
  }

  if (isSOV(lang)) {
    return `${target} ${mk('on', lang)} ${event} ${keyword}`;
  }
  return `${keyword} ${event} ${mk('on', lang)} ${target}`;
}

function renderTrigger(node: SemanticNode, lang: string): string {
  const event = extractRoleValue(node, 'event') || 'click';
  const target = extractRoleValue(node, 'target');
  const keyword = kw('trigger', lang);

  if (!target) {
    return `${keyword} ${event}`;
  }

  if (isSOV(lang)) {
    return `${target} ${mk('on', lang)} ${event} ${keyword}`;
  }
  return `${keyword} ${event} ${mk('on', lang)} ${target}`;
}

function renderFilter(node: SemanticNode, lang: string): string {
  const event = extractRoleValue(node, 'event') || 'keydown';
  const condition = extractRoleValue(node, 'condition') || 'Enter';
  const keyword = kw('filter', lang);

  if (isSOV(lang)) {
    return `${event} ${mk('by', lang)} ${condition} ${keyword}`;
  }
  return `${keyword} ${event} ${mk('by', lang)} ${condition}`;
}

function renderDelegate(node: SemanticNode, lang: string): string {
  const event = extractRoleValue(node, 'event') || 'click';
  const selector = extractRoleValue(node, 'selector') || '.item';
  const container = extractRoleValue(node, 'container');
  const keyword = kw('delegate', lang);

  const parts: string[] = [];

  if (isSOV(lang)) {
    parts.push(selector, mk('from', lang), event);
    if (container) {
      parts.push(container, mk('in', lang));
    }
    parts.push(keyword);
  } else {
    parts.push(keyword, event, mk('from', lang), selector);
    if (container) {
      parts.push(mk('in', lang), container);
    }
  }

  return parts.join(' ');
}

function renderThrottle(node: SemanticNode, lang: string): string {
  const event = extractRoleValue(node, 'event') || 'scroll';
  const duration = extractRoleValue(node, 'duration') || '200ms';
  const target = extractRoleValue(node, 'target');
  const keyword = kw('throttle', lang);

  const parts: string[] = [];

  if (isSOV(lang)) {
    parts.push(event, mk('every', lang), duration);
    if (target) {
      parts.push(target, mk('on', lang));
    }
    parts.push(keyword);
  } else {
    parts.push(keyword, event, mk('every', lang), duration);
    if (target) {
      parts.push(mk('on', lang), target);
    }
  }

  return parts.join(' ');
}

function renderDebounce(node: SemanticNode, lang: string): string {
  const event = extractRoleValue(node, 'event') || 'input';
  const duration = extractRoleValue(node, 'duration') || '300ms';
  const target = extractRoleValue(node, 'target');
  const keyword = kw('debounce', lang);

  const parts: string[] = [];

  if (isSOV(lang)) {
    parts.push(event, mk('every', lang), duration);
    if (target) {
      parts.push(target, mk('on', lang));
    }
    parts.push(keyword);
  } else {
    parts.push(keyword, event, mk('every', lang), duration);
    if (target) {
      parts.push(mk('on', lang), target);
    }
  }

  return parts.join(' ');
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Render an Events SemanticNode to natural-language DSL text in the target language.
 */
export function renderEvents(node: SemanticNode, language: string): string {
  switch (node.action) {
    case 'listen':
      return renderListen(node, language);
    case 'trigger':
      return renderTrigger(node, language);
    case 'filter':
      return renderFilter(node, language);
    case 'delegate':
      return renderDelegate(node, language);
    case 'throttle':
      return renderThrottle(node, language);
    case 'debounce':
      return renderDebounce(node, language);
    default:
      return `-- Unknown: ${node.action}`;
  }
}
