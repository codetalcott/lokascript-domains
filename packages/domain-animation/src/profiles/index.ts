/**
 * Animation Language Profiles
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
    transition: { primary: 'transition' },
    settle: { primary: 'settle' },
    measure: { primary: 'measure' },
    fade: { primary: 'fade' },
    slide: { primary: 'slide' },
  },
};

// =============================================================================
// Spanish (SVO)
// =============================================================================

export const spanishProfile: PatternGenLanguageProfile = {
  code: 'es',
  wordOrder: 'SVO',
  keywords: {
    transition: { primary: 'transición' },
    settle: { primary: 'establecer' },
    measure: { primary: 'medir' },
    fade: { primary: 'desvanecer' },
    slide: { primary: 'deslizar' },
  },
};

// =============================================================================
// Japanese (SOV)
// =============================================================================

export const japaneseProfile: PatternGenLanguageProfile = {
  code: 'ja',
  wordOrder: 'SOV',
  keywords: {
    transition: { primary: '遷移' },
    settle: { primary: '安定' },
    measure: { primary: '測定' },
    fade: { primary: 'フェード' },
    slide: { primary: 'スライド' },
  },
};

// =============================================================================
// Arabic (VSO)
// =============================================================================

export const arabicProfile: PatternGenLanguageProfile = {
  code: 'ar',
  wordOrder: 'VSO',
  keywords: {
    transition: { primary: 'انتقال' },
    settle: { primary: 'استقر' },
    measure: { primary: 'قس' },
    fade: { primary: 'تلاشى' },
    slide: { primary: 'انزلق' },
  },
};

// =============================================================================
// Korean (SOV)
// =============================================================================

export const koreanProfile: PatternGenLanguageProfile = {
  code: 'ko',
  wordOrder: 'SOV',
  keywords: {
    transition: { primary: '전환' },
    settle: { primary: '정착' },
    measure: { primary: '측정' },
    fade: { primary: '페이드' },
    slide: { primary: '슬라이드' },
  },
};

// =============================================================================
// Chinese (SVO)
// =============================================================================

export const chineseProfile: PatternGenLanguageProfile = {
  code: 'zh',
  wordOrder: 'SVO',
  keywords: {
    transition: { primary: '过渡' },
    settle: { primary: '稳定' },
    measure: { primary: '测量' },
    fade: { primary: '淡化' },
    slide: { primary: '滑动' },
  },
};

// =============================================================================
// Turkish (SOV)
// =============================================================================

export const turkishProfile: PatternGenLanguageProfile = {
  code: 'tr',
  wordOrder: 'SOV',
  keywords: {
    transition: { primary: 'geçiş' },
    settle: { primary: 'yerleş' },
    measure: { primary: 'ölç' },
    fade: { primary: 'soldur' },
    slide: { primary: 'kaydır' },
  },
};

// =============================================================================
// French (SVO)
// =============================================================================

export const frenchProfile: PatternGenLanguageProfile = {
  code: 'fr',
  wordOrder: 'SVO',
  keywords: {
    transition: { primary: 'transition' },
    settle: { primary: 'stabiliser' },
    measure: { primary: 'mesurer' },
    fade: { primary: 'fondu' },
    slide: { primary: 'glisser' },
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
