/**
 * Animation Natural Language Renderer
 *
 * Renders a SemanticNode back into natural-language animation DSL
 * syntax for a target language. Inverse of the parser.
 */

import type { SemanticNode } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

// =============================================================================
// Keyword Tables
// =============================================================================

const COMMAND_KEYWORDS: Record<string, Record<string, string>> = {
  transition: {
    en: 'transition', es: 'transición', ja: '遷移', ar: 'انتقال',
    ko: '전환', zh: '过渡', tr: 'geçiş', fr: 'transition',
  },
  settle: {
    en: 'settle', es: 'establecer', ja: '安定', ar: 'استقر',
    ko: '정착', zh: '稳定', tr: 'yerleş', fr: 'stabiliser',
  },
  measure: {
    en: 'measure', es: 'medir', ja: '測定', ar: 'قس',
    ko: '측정', zh: '测量', tr: 'ölç', fr: 'mesurer',
  },
  fade: {
    en: 'fade', es: 'desvanecer', ja: 'フェード', ar: 'تلاشى',
    ko: '페이드', zh: '淡化', tr: 'soldur', fr: 'fondu',
  },
  slide: {
    en: 'slide', es: 'deslizar', ja: 'スライド', ar: 'انزلق',
    ko: '슬라이드', zh: '滑动', tr: 'kaydır', fr: 'glisser',
  },
};

const MARKERS: Record<string, Record<string, string>> = {
  to: {
    en: 'to', es: 'a', ja: 'に', ar: 'إلى',
    ko: '로', zh: '到', tr: 'ye', fr: 'à',
  },
  over: {
    en: 'over', es: 'en', ja: 'で', ar: 'خلال',
    ko: '동안', zh: '经过', tr: 'sürede', fr: 'en',
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

function renderTransition(node: SemanticNode, lang: string): string {
  const property = extractRoleValue(node, 'property') || 'opacity';
  const value = extractRoleValue(node, 'value') || '0';
  const duration = extractRoleValue(node, 'duration');
  const keyword = kw('transition', lang);

  const parts: string[] = [];

  if (isSOV(lang)) {
    // SOV: property value marker_to [duration marker_over] keyword
    parts.push(property, value, mk('to', lang));
    if (duration) {
      parts.push(duration, mk('over', lang));
    }
    parts.push(keyword);
  } else {
    // SVO/VSO: keyword property marker_to value [marker_over duration]
    parts.push(keyword, property, mk('to', lang), value);
    if (duration) {
      parts.push(mk('over', lang), duration);
    }
  }

  return parts.join(' ');
}

function renderSettle(node: SemanticNode, lang: string): string {
  const target = extractRoleValue(node, 'target') || 'me';
  const keyword = kw('settle', lang);

  if (isSOV(lang)) {
    return `${target} ${keyword}`;
  }
  return `${keyword} ${target}`;
}

function renderMeasure(node: SemanticNode, lang: string): string {
  const target = extractRoleValue(node, 'target') || '#box';
  const property = extractRoleValue(node, 'property') || 'width';
  const keyword = kw('measure', lang);

  if (isSOV(lang)) {
    return `${target} ${property} ${keyword}`;
  }
  return `${keyword} ${target} ${property}`;
}

function renderFade(node: SemanticNode, lang: string): string {
  const target = extractRoleValue(node, 'target') || '#panel';
  const direction = extractRoleValue(node, 'direction') || 'out';
  const duration = extractRoleValue(node, 'duration');
  const keyword = kw('fade', lang);

  const parts: string[] = [];

  if (isSOV(lang)) {
    // SOV: target direction [duration marker_over] keyword
    parts.push(target, direction);
    if (duration) {
      parts.push(duration, mk('over', lang));
    }
    parts.push(keyword);
  } else {
    // SVO/VSO: keyword target direction [marker_over duration]
    parts.push(keyword, target, direction);
    if (duration) {
      parts.push(mk('over', lang), duration);
    }
  }

  return parts.join(' ');
}

function renderSlide(node: SemanticNode, lang: string): string {
  const target = extractRoleValue(node, 'target') || '#menu';
  const direction = extractRoleValue(node, 'direction') || 'down';
  const duration = extractRoleValue(node, 'duration');
  const keyword = kw('slide', lang);

  const parts: string[] = [];

  if (isSOV(lang)) {
    // SOV: target direction [duration marker_over] keyword
    parts.push(target, direction);
    if (duration) {
      parts.push(duration, mk('over', lang));
    }
    parts.push(keyword);
  } else {
    // SVO/VSO: keyword target direction [marker_over duration]
    parts.push(keyword, target, direction);
    if (duration) {
      parts.push(mk('over', lang), duration);
    }
  }

  return parts.join(' ');
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Render an Animation SemanticNode to natural-language DSL text in the target language.
 */
export function renderAnimation(node: SemanticNode, language: string): string {
  switch (node.action) {
    case 'transition':
      return renderTransition(node, language);
    case 'settle':
      return renderSettle(node, language);
    case 'measure':
      return renderMeasure(node, language);
    case 'fade':
      return renderFade(node, language);
    case 'slide':
      return renderSlide(node, language);
    default:
      return `-- Unknown: ${node.action}`;
  }
}
