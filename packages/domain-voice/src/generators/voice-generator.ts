/**
 * Voice/Accessibility Code Generator
 *
 * Transforms semantic AST nodes into executable JavaScript snippets
 * for DOM manipulation, navigation, and accessibility actions.
 */

import type { CodeGenerator, SemanticNode } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

// =============================================================================
// String Escaping
// =============================================================================

function esc(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\$/g, '\\$');
}

// =============================================================================
// Shared Element-Finding Helper (injected into generated code)
// Self-initializing guard: safe to include multiple times, defines only once.
// =============================================================================

const FIND_EL = [
  `if(!window._findEl){window._findEl=function(q,root){`,
  `  root=root||document;`,
  `  if(q.startsWith('#')||q.startsWith('.')||q.includes('[')){`,
  `    try{return root.querySelector(q)}catch(e){}`,
  `  }`,
  `  var el=root.querySelector('[aria-label="'+q+'"]');`,
  `  if(el)return el;`,
  `  el=root.querySelector('[role="'+q+'"]');`,
  `  if(el)return el;`,
  `  var c=root.querySelectorAll('button,a,input,[role="button"],[tabindex]');`,
  `  var lq=q.toLowerCase();`,
  `  for(var i=0;i<c.length;i++){`,
  `    if((c[i].textContent||'').toLowerCase().includes(lq))return c[i];`,
  `    if((c[i].getAttribute('aria-label')||'').toLowerCase().includes(lq))return c[i];`,
  `  }`,
  `  return null;`,
  `}}`,
].join('');

// =============================================================================
// i18n Word Sets (all 8 languages)
// =============================================================================

const SELECT_ALL_WORDS = new Set(['all', 'todo', '全て', '全部', 'الكل', '전체', 'hepsi', 'tout']);
/**
 * What `close` closes: a tab, or a dialog (the schema reads `close`'s target only from these). The
 * words are the vocab's (`src/vocab/*.ts`) and, for Arabic, the tests'.
 */
export const TAB_WORDS = new Set([
  'tab',
  'pestaña',
  'タブ',
  '탭',
  '标签',
  'sekme',
  'onglet',
  'aba',
  'вкладка',
]);
export const DIALOG_WORDS = new Set([
  'dialog',
  'modal',
  'diálogo',
  'ダイアログ',
  '대화상자',
  '对话框',
  'diyalog',
  'dialogue',
  'диалог',
  'الحوار',
]);
const PAGE_WORDS = new Set(['page', 'página', 'ページ', 'الصفحة', '페이지', '页面', 'sayfa']);

/**
 * Directions: where `scroll` scrolls and which way `zoom` zooms, each by its English name.
 */
export type ScrollDirection = 'up' | 'down' | 'left' | 'right' | 'top' | 'bottom';
export type ZoomDirection = 'in' | 'out' | 'reset';
export type Direction = ScrollDirection | ZoomDirection;
export const SCROLL_DIRECTIONS: readonly ScrollDirection[] = [
  'up',
  'down',
  'left',
  'right',
  'top',
  'bottom',
];
export const ZOOM_DIRECTIONS: readonly ZoomDirection[] = ['in', 'out', 'reset'];

/**
 * Each language's word for a direction (the vocab's, `src/vocab/*.ts`). A direction a language has
 * no word for is written in English, which every language reads. Until 4.3.0 the generator compared
 * the word with the English names only, so `desplazar arriba` scrolled DOWN and `zoom menos`
 * zoomed IN: every direction word but English compiled to the default.
 */
export const DIRECTION_WORDS: Readonly<Record<string, Partial<Record<Direction, string>>>> = {
  es: { up: 'arriba', down: 'abajo', left: 'izquierda', right: 'derecha', in: 'más', out: 'menos' },
  ja: {
    up: '上',
    down: '下',
    left: '左',
    right: '右',
    in: 'イン',
    out: 'アウト',
    reset: 'リセット',
  },
  ar: { up: 'لأعلى', down: 'لأسفل', left: 'يسار', right: 'يمين' },
  ko: { up: '위', down: '아래', left: '왼쪽', right: '오른쪽' },
  zh: { up: '上', down: '下', left: '左', right: '右', in: '放大', out: '缩小', reset: '重置' },
  tr: { up: 'yukarı', down: 'aşağı', left: 'sol', right: 'sağ' },
  fr: { up: 'haut', down: 'bas', left: 'gauche', right: 'droite' },
  de: {
    up: 'hoch',
    down: 'runter',
    left: 'links',
    right: 'rechts',
    in: 'rein',
    out: 'raus',
    reset: 'zurücksetzen',
  },
  pt: {
    up: 'cima',
    down: 'baixo',
    left: 'esquerda',
    right: 'direita',
    in: 'dentro',
    out: 'fora',
    reset: 'redefinir',
  },
  ru: {
    up: 'вверх',
    down: 'вниз',
    left: 'влево',
    right: 'вправо',
    in: 'внутрь',
    out: 'наружу',
    reset: 'сброс',
  },
};

/**
 * Other words read as a direction: Arabic's bare `أعلى` / `أسفل` (the vocab's) beside `لأعلى` /
 * `لأسفل`, and Japanese `拡大` / `縮小` (enlarge, shrink) beside `イン` / `アウト`.
 */
const DIRECTION_SPELLINGS: Readonly<Record<string, Direction>> = {
  أعلى: 'up',
  أسفل: 'down',
  拡大: 'in',
  縮小: 'out',
};

const DIRECTION_BY_WORD = new Map<string, Direction>([
  ...[...SCROLL_DIRECTIONS, ...ZOOM_DIRECTIONS].map(d => [d, d] as const),
  ...Object.values(DIRECTION_WORDS).flatMap(words =>
    Object.entries(words).map(([d, w]) => [w.toLowerCase(), d as Direction] as const)
  ),
  ...Object.entries(DIRECTION_SPELLINGS),
]);

/** Languages whose zoom verb alone means "zoom in" (ar تكبير, ko 확대, tr yakınlaş, fr zoomer). */
export const ZOOM_IN_VERB_LANGUAGES: ReadonlySet<string> = new Set(['ar', 'ko', 'tr', 'fr']);

/** The English name of a direction word in any language, or undefined. */
export function directionOf(word: string | undefined): Direction | undefined {
  return word ? DIRECTION_BY_WORD.get(word.toLowerCase()) : undefined;
}

/** A language's word for a direction (English where it has none). */
export function directionWord(direction: string, language: string): string {
  return DIRECTION_WORDS[language]?.[direction as Direction] ?? direction;
}

/** Every word a scroll's (or a zoom's) direction is read from, in every language. */
export function directionWords(directions: readonly Direction[]): string[] {
  return [...DIRECTION_BY_WORD].filter(([, d]) => directions.includes(d)).map(([w]) => w);
}

// =============================================================================
// Per-Command Generators
// =============================================================================

function generateNavigate(node: SemanticNode): string {
  const dest = extractRoleValue(node, 'destination');
  if (!dest) return '// navigate: missing destination';
  if (dest.startsWith('/') || dest.startsWith('http')) {
    return `window.location.href = '${esc(dest)}';`;
  }
  return [
    FIND_EL,
    `var el = _findEl('${esc(dest)}');`,
    `if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });`,
    `else window.location.hash = '${esc(dest)}';`,
  ].join('\n');
}

function generateClick(node: SemanticNode): string {
  const patient = extractRoleValue(node, 'patient');
  if (!patient) return '// click: missing target';
  return [FIND_EL, `var el = _findEl('${esc(patient)}');`, `if (el) el.click();`].join('\n');
}

function generateType(node: SemanticNode): string {
  const text = extractRoleValue(node, 'patient');
  if (!text) return '// type: missing text';
  const dest = extractRoleValue(node, 'destination');
  const target = dest
    ? `_findEl('${esc(dest)}') || document.activeElement`
    : `document.activeElement`;
  return [
    FIND_EL,
    `var el = ${target};`,
    `if (el && ('value' in el || el.isContentEditable)) {`,
    `  if ('value' in el) { el.value = (el.value || '') + '${esc(text)}'; }`,
    `  else { el.textContent = (el.textContent || '') + '${esc(text)}'; }`,
    `  el.dispatchEvent(new Event('input', { bubbles: true }));`,
    `}`,
  ].join('\n');
}

function generateScroll(node: SemanticNode): string {
  const manner = directionOf(extractRoleValue(node, 'manner')) ?? 'down';
  const quantity = extractRoleValue(node, 'quantity');
  const px = quantity ? parseInt(quantity, 10) || 300 : 300;

  switch (manner) {
    case 'up':
      return `window.scrollBy({ top: -${px}, behavior: 'smooth' });`;
    case 'down':
      return `window.scrollBy({ top: ${px}, behavior: 'smooth' });`;
    case 'left':
      return `window.scrollBy({ left: -${px}, behavior: 'smooth' });`;
    case 'right':
      return `window.scrollBy({ left: ${px}, behavior: 'smooth' });`;
    case 'top':
      return `window.scrollTo({ top: 0, behavior: 'smooth' });`;
    case 'bottom':
      return `window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });`;
    default:
      return `window.scrollBy({ top: ${px}, behavior: 'smooth' });`;
  }
}

function generateRead(node: SemanticNode): string {
  const patient = extractRoleValue(node, 'patient');
  if (!patient) return '// read: missing target';
  return [
    FIND_EL,
    `var el = _findEl('${esc(patient)}');`,
    `if (el && el.textContent) {`,
    `  var utterance = new SpeechSynthesisUtterance(el.textContent);`,
    `  speechSynthesis.speak(utterance);`,
    `}`,
  ].join('\n');
}

function generateZoom(node: SemanticNode): string {
  const manner = directionOf(extractRoleValue(node, 'manner')) ?? 'in';
  if (manner === 'reset') {
    return [
      `document.documentElement.dataset.zoom = '1';`,
      `document.documentElement.style.transform = '';`,
    ].join('\n');
  }
  const factor = manner === 'out' ? 0.9 : 1.1;
  return [
    `var s = parseFloat(document.documentElement.dataset.zoom || '1');`,
    `s = Math.round(s * ${factor} * 100) / 100;`,
    `document.documentElement.dataset.zoom = s;`,
    `document.documentElement.style.transform = 'scale(' + s + ')';`,
    `document.documentElement.style.transformOrigin = 'top left';`,
  ].join('\n');
}

function generateSelect(node: SemanticNode): string {
  const patient = extractRoleValue(node, 'patient');
  if (!patient) return '// select: missing target';
  const target = SELECT_ALL_WORDS.has(patient) ? 'document.body' : `_findEl('${esc(patient)}')`;
  const lines = SELECT_ALL_WORDS.has(patient) ? [] : [FIND_EL];
  lines.push(
    `var el = ${target};`,
    `if (el) {`,
    `  var range = document.createRange();`,
    `  range.selectNodeContents(el);`,
    `  var sel = window.getSelection();`,
    `  sel.removeAllRanges();`,
    `  sel.addRange(range);`,
    `}`
  );
  return lines.join('\n');
}

function generateBack(node: SemanticNode): string {
  const quantity = extractRoleValue(node, 'quantity');
  const n = quantity ? parseInt(quantity, 10) || 1 : 1;
  return `history.go(-${n});`;
}

function generateForward(node: SemanticNode): string {
  const quantity = extractRoleValue(node, 'quantity');
  const n = quantity ? parseInt(quantity, 10) || 1 : 1;
  return `history.go(${n});`;
}

function generateFocus(node: SemanticNode): string {
  const patient = extractRoleValue(node, 'patient');
  if (!patient) return '// focus: missing target';
  return [FIND_EL, `var el = _findEl('${esc(patient)}');`, `if (el) el.focus();`].join('\n');
}

function generateClose(node: SemanticNode): string {
  const patient = extractRoleValue(node, 'patient') || '';
  if (TAB_WORDS.has(patient)) {
    return `window.close();`;
  }
  if (DIALOG_WORDS.has(patient)) {
    return `var d = document.querySelector('dialog[open]'); if (d) d.close();`;
  }
  // Default: try to close any open dialog or modal
  return [
    `var d = document.querySelector('dialog[open]');`,
    `if (d) { d.close(); }`,
    `else {`,
    `  var m = document.querySelector('[role="dialog"], .modal.show, .modal.open');`,
    `  if (m) m.remove();`,
    `}`,
  ].join('\n');
}

function generateOpen(node: SemanticNode): string {
  const patient = extractRoleValue(node, 'patient');
  if (!patient) return '// open: missing target';
  if (patient.startsWith('/') || patient.startsWith('http')) {
    return `window.open('${esc(patient)}', '_blank');`;
  }
  return [FIND_EL, `var el = _findEl('${esc(patient)}');`, `if (el) el.click();`].join('\n');
}

function generateSearch(node: SemanticNode): string {
  const query = extractRoleValue(node, 'patient');
  if (!query) return '// search: missing query';
  const dest = extractRoleValue(node, 'destination');
  if (dest && PAGE_WORDS.has(dest)) {
    // window.find() is non-standard but no standard alternative exists for "find in page"
    return `window.find('${esc(query)}');`;
  }
  const selector = dest
    ? `'${esc(dest)}'`
    : `'input[type="search"], [role="searchbox"], input[name="q"], input[name="search"]'`;
  return [
    `var searchInput = document.querySelector(${selector});`,
    `if (searchInput) {`,
    `  searchInput.value = '${esc(query)}';`,
    `  searchInput.dispatchEvent(new Event('input', { bubbles: true }));`,
    `  if (searchInput.form) searchInput.form.submit();`,
    `}`,
  ].join('\n');
}

function generateHelp(node: SemanticNode): string {
  const topic = extractRoleValue(node, 'patient');
  const commands = [
    'navigate',
    'click',
    'type',
    'scroll',
    'read',
    'zoom',
    'select',
    'back',
    'forward',
    'focus',
    'close',
    'open',
    'search',
    'help',
  ];
  if (topic) {
    return `console.log('Help: ${esc(topic)}');`;
  }
  return `console.log('Available commands: ${commands.join(', ')}');`;
}

// =============================================================================
// Public Code Generator
// =============================================================================

export const voiceCodeGenerator: CodeGenerator = {
  generate(node: SemanticNode): string {
    switch (node.action) {
      case 'navigate':
        return generateNavigate(node);
      case 'click':
        return generateClick(node);
      case 'type':
        return generateType(node);
      case 'scroll':
        return generateScroll(node);
      case 'read':
        return generateRead(node);
      case 'zoom':
        return generateZoom(node);
      case 'select':
        return generateSelect(node);
      case 'back':
        return generateBack(node);
      case 'forward':
        return generateForward(node);
      case 'focus':
        return generateFocus(node);
      case 'close':
        return generateClose(node);
      case 'open':
        return generateOpen(node);
      case 'search':
        return generateSearch(node);
      case 'help':
        return generateHelp(node);
      default:
        return `// Unknown voice command: ${node.action}`;
    }
  },
};
