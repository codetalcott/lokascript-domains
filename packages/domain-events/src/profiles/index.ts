/**
 * Event Handling Language Profiles
 *
 * Pattern generation profiles for each supported language (8 total).
 * Defines keyword translations and word order for pattern generation.
 */

import type { PatternGenLanguageProfile } from '@lokascript/framework';

// =============================================================================
// English (SVO)
// =============================================================================

export const englishProfile: PatternGenLanguageProfile = {
  code: 'en',
  wordOrder: 'SVO',
  keywords: {
    listen: { primary: 'listen' },
    trigger: { primary: 'trigger' },
    filter: { primary: 'filter' },
    delegate: { primary: 'delegate' },
    throttle: { primary: 'throttle' },
    debounce: { primary: 'debounce' },
  },
};

// =============================================================================
// Spanish (SVO)
// =============================================================================

export const spanishProfile: PatternGenLanguageProfile = {
  code: 'es',
  wordOrder: 'SVO',
  keywords: {
    listen: { primary: 'escuchar' },
    trigger: { primary: 'disparar' },
    filter: { primary: 'filtrar' },
    delegate: { primary: 'delegar' },
    throttle: { primary: 'limitar' },
    debounce: { primary: 'retardar' },
  },
};

// =============================================================================
// Japanese (SOV)
// =============================================================================

export const japaneseProfile: PatternGenLanguageProfile = {
  code: 'ja',
  wordOrder: 'SOV',
  keywords: {
    listen: { primary: '聞く' },
    trigger: { primary: '発火' },
    filter: { primary: 'フィルター' },
    delegate: { primary: '委任' },
    throttle: { primary: '制限' },
    debounce: { primary: '遅延' },
  },
  roleMarkers: {
    container: { primary: 'の中', position: 'after' },
  },
};

// =============================================================================
// Arabic (VSO)
// =============================================================================

export const arabicProfile: PatternGenLanguageProfile = {
  code: 'ar',
  wordOrder: 'VSO',
  keywords: {
    listen: { primary: 'استمع' },
    trigger: { primary: 'أطلق' },
    filter: { primary: 'صفّي' },
    delegate: { primary: 'فوّض' },
    throttle: { primary: 'قيّد' },
    debounce: { primary: 'أخّر' },
  },
};

// =============================================================================
// Korean (SOV)
// =============================================================================

export const koreanProfile: PatternGenLanguageProfile = {
  code: 'ko',
  wordOrder: 'SOV',
  keywords: {
    listen: { primary: '듣기' },
    trigger: { primary: '발생' },
    filter: { primary: '필터' },
    delegate: { primary: '위임' },
    throttle: { primary: '제한' },
    debounce: { primary: '지연' },
  },
  roleMarkers: {
    container: { primary: '안', position: 'after' },
  },
};

// =============================================================================
// Chinese (SVO)
// =============================================================================

export const chineseProfile: PatternGenLanguageProfile = {
  code: 'zh',
  wordOrder: 'SVO',
  keywords: {
    listen: { primary: '监听' },
    trigger: { primary: '触发' },
    filter: { primary: '过滤' },
    delegate: { primary: '委托' },
    throttle: { primary: '节流' },
    debounce: { primary: '防抖' },
  },
};

// =============================================================================
// Turkish (SOV)
// =============================================================================

export const turkishProfile: PatternGenLanguageProfile = {
  code: 'tr',
  wordOrder: 'SOV',
  keywords: {
    listen: { primary: 'dinle' },
    trigger: { primary: 'tetikle' },
    filter: { primary: 'filtrele' },
    delegate: { primary: 'devret' },
    throttle: { primary: 'kısıtla' },
    debounce: { primary: 'geciktir' },
  },
  roleMarkers: {
    container: { primary: 'içinde', position: 'after' },
  },
};

// =============================================================================
// French (SVO)
// =============================================================================

export const frenchProfile: PatternGenLanguageProfile = {
  code: 'fr',
  wordOrder: 'SVO',
  keywords: {
    listen: { primary: 'écouter' },
    trigger: { primary: 'déclencher' },
    filter: { primary: 'filtrer' },
    delegate: { primary: 'déléguer' },
    throttle: { primary: 'limiter' },
    debounce: { primary: 'temporiser' },
  },
};

// =============================================================================
// All Profiles
// =============================================================================

export const allProfiles = [
  englishProfile,
  spanishProfile,
  japaneseProfile,
  arabicProfile,
  koreanProfile,
  chineseProfile,
  turkishProfile,
  frenchProfile,
];
