/**
 * Hypermedia Natural Language Renderer
 *
 * Renders a SemanticNode back into natural-language hypermedia DSL
 * syntax for a target language. Inverse of the parser.
 */

import type { SemanticNode } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

// =============================================================================
// Keyword Tables
// =============================================================================

const COMMAND_KEYWORDS: Record<string, Record<string, string>> = {
  request: {
    en: 'request', es: 'solicitar', ja: 'リクエスト', ar: 'اطلب',
    ko: '요청', zh: '请求', tr: 'iste', fr: 'demander',
  },
  swap: {
    en: 'swap', es: 'intercambiar', ja: '入れ替え', ar: 'بدّل',
    ko: '교체', zh: '交换', tr: 'değiştir', fr: 'échanger',
  },
  morph: {
    en: 'morph', es: 'transformar', ja: '変形', ar: 'حوّل',
    ko: '변환', zh: '变形', tr: 'dönüştür', fr: 'transformer',
  },
  push: {
    en: 'push', es: 'empujar', ja: 'プッシュ', ar: 'ادفع',
    ko: '푸시', zh: '推送', tr: 'it', fr: 'pousser',
  },
  replace: {
    en: 'replace', es: 'reemplazar', ja: '置換', ar: 'استبدل',
    ko: '교환', zh: '替换', tr: 'yerleştir', fr: 'remplacer',
  },
};

const MARKERS: Record<string, Record<string, string>> = {
  into: {
    en: 'into', es: 'en', ja: 'に', ar: 'في',
    ko: '에', zh: '到', tr: 'içine', fr: 'dans',
  },
  with: {
    en: 'with', es: 'con', ja: 'で', ar: 'بـ',
    ko: '로', zh: '用', tr: 'ile', fr: 'avec',
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

function renderRequest(node: SemanticNode, lang: string): string {
  const url = extractRoleValue(node, 'url') || '/api/data';
  const destination = extractRoleValue(node, 'destination');
  const method = extractRoleValue(node, 'method');
  const keyword = kw('request', lang);

  const parts: string[] = [];

  if (isSOV(lang)) {
    if (destination) {
      parts.push(destination, mk('into', lang));
    }
    parts.push(url);
    if (method) {
      parts.push(method, mk('with', lang));
    }
    parts.push(keyword);
  } else {
    parts.push(keyword, url);
    if (destination) {
      parts.push(mk('into', lang), destination);
    }
    if (method) {
      parts.push(mk('with', lang), method);
    }
  }

  return parts.join(' ');
}

function renderSwap(node: SemanticNode, lang: string): string {
  const content = extractRoleValue(node, 'content') || 'response';
  const target = extractRoleValue(node, 'target') || '#container';
  const strategy = extractRoleValue(node, 'strategy');
  const keyword = kw('swap', lang);

  const parts: string[] = [];

  if (isSOV(lang)) {
    parts.push(target, mk('into', lang), content);
    if (strategy) {
      parts.push(strategy, mk('with', lang));
    }
    parts.push(keyword);
  } else {
    parts.push(keyword, content, mk('into', lang), target);
    if (strategy) {
      parts.push(mk('with', lang), strategy);
    }
  }

  return parts.join(' ');
}

function renderMorph(node: SemanticNode, lang: string): string {
  const content = extractRoleValue(node, 'content') || 'response';
  const target = extractRoleValue(node, 'target') || '#panel';
  const keyword = kw('morph', lang);

  if (isSOV(lang)) {
    return `${target} ${mk('into', lang)} ${content} ${keyword}`;
  }
  return `${keyword} ${content} ${mk('into', lang)} ${target}`;
}

function renderPush(node: SemanticNode, lang: string): string {
  const url = extractRoleValue(node, 'url') || '/';
  const keyword = kw('push', lang);

  if (isSOV(lang)) {
    return `${url} ${keyword}`;
  }
  return `${keyword} ${url}`;
}

function renderReplace(node: SemanticNode, lang: string): string {
  const url = extractRoleValue(node, 'url') || '/';
  const keyword = kw('replace', lang);

  if (isSOV(lang)) {
    return `${url} ${keyword}`;
  }
  return `${keyword} ${url}`;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Render a Hypermedia SemanticNode to natural-language DSL text in the target language.
 */
export function renderHypermedia(node: SemanticNode, language: string): string {
  switch (node.action) {
    case 'request':
      return renderRequest(node, language);
    case 'swap':
      return renderSwap(node, language);
    case 'morph':
      return renderMorph(node, language);
    case 'push':
      return renderPush(node, language);
    case 'replace':
      return renderReplace(node, language);
    default:
      return `-- Unknown: ${node.action}`;
  }
}
