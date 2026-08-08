/**
 * Hypermedia Language Profiles
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
    request: { primary: 'request' },
    swap: { primary: 'swap' },
    morph: { primary: 'morph' },
    push: { primary: 'push' },
    replace: { primary: 'replace' },
  },
};

// =============================================================================
// Spanish (SVO)
// =============================================================================

export const spanishProfile: PatternGenLanguageProfile = {
  code: 'es',
  wordOrder: 'SVO',
  keywords: {
    request: { primary: 'solicitar' },
    swap: { primary: 'intercambiar' },
    morph: { primary: 'transformar' },
    push: { primary: 'empujar' },
    replace: { primary: 'reemplazar' },
  },
};

// =============================================================================
// Japanese (SOV)
// =============================================================================

export const japaneseProfile: PatternGenLanguageProfile = {
  code: 'ja',
  wordOrder: 'SOV',
  keywords: {
    request: { primary: 'リクエスト' },
    swap: { primary: '入れ替え' },
    morph: { primary: '変形' },
    push: { primary: 'プッシュ' },
    replace: { primary: '置換' },
  },
};

// =============================================================================
// Arabic (VSO)
// =============================================================================

export const arabicProfile: PatternGenLanguageProfile = {
  code: 'ar',
  wordOrder: 'VSO',
  keywords: {
    request: { primary: 'اطلب' },
    swap: { primary: 'بدّل' },
    morph: { primary: 'حوّل' },
    push: { primary: 'ادفع' },
    replace: { primary: 'استبدل' },
  },
};

// =============================================================================
// Korean (SOV)
// =============================================================================

export const koreanProfile: PatternGenLanguageProfile = {
  code: 'ko',
  wordOrder: 'SOV',
  keywords: {
    request: { primary: '요청' },
    swap: { primary: '교체' },
    morph: { primary: '변환' },
    push: { primary: '푸시' },
    replace: { primary: '교환' },
  },
};

// =============================================================================
// Chinese (SVO)
// =============================================================================

export const chineseProfile: PatternGenLanguageProfile = {
  code: 'zh',
  wordOrder: 'SVO',
  keywords: {
    request: { primary: '请求' },
    swap: { primary: '交换' },
    morph: { primary: '变形' },
    push: { primary: '推送' },
    replace: { primary: '替换' },
  },
};

// =============================================================================
// Turkish (SOV)
// =============================================================================

export const turkishProfile: PatternGenLanguageProfile = {
  code: 'tr',
  wordOrder: 'SOV',
  keywords: {
    request: { primary: 'iste' },
    swap: { primary: 'değiştir' },
    morph: { primary: 'dönüştür' },
    push: { primary: 'it' },
    replace: { primary: 'yerleştir' },
  },
};

// =============================================================================
// French (SVO)
// =============================================================================

export const frenchProfile: PatternGenLanguageProfile = {
  code: 'fr',
  wordOrder: 'SVO',
  keywords: {
    request: { primary: 'demander' },
    swap: { primary: 'échanger' },
    morph: { primary: 'transformer' },
    push: { primary: 'pousser' },
    replace: { primary: 'remplacer' },
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
