/**
 * Control Flow Language Profiles
 *
 * Pattern generation profiles for each supported language (8 total).
 * Defines keyword translations and word order for pattern generation.
 *
 * The `count` role uses position: 'after' in all profiles because the
 * "times" marker naturally follows the number (e.g., "5 times", "5 回").
 */

import type { PatternGenLanguageProfile } from '@lokascript/framework';

// =============================================================================
// English (SVO)
// =============================================================================

export const englishProfile: PatternGenLanguageProfile = {
  code: 'en',
  wordOrder: 'SVO',
  keywords: {
    check: { primary: 'check' },
    repeat: { primary: 'repeat' },
    iterate: { primary: 'iterate' },
    guard: { primary: 'guard' },
    loop: { primary: 'loop' },
  },
  roleMarkers: {
    count: { primary: 'times', position: 'after' },
  },
};

// =============================================================================
// Spanish (SVO)
// =============================================================================

export const spanishProfile: PatternGenLanguageProfile = {
  code: 'es',
  wordOrder: 'SVO',
  keywords: {
    check: { primary: 'verificar' },
    repeat: { primary: 'repetir' },
    iterate: { primary: 'iterar' },
    guard: { primary: 'proteger' },
    loop: { primary: 'bucle' },
  },
  roleMarkers: {
    count: { primary: 'veces', position: 'after' },
  },
};

// =============================================================================
// Japanese (SOV)
// =============================================================================

export const japaneseProfile: PatternGenLanguageProfile = {
  code: 'ja',
  wordOrder: 'SOV',
  keywords: {
    check: { primary: '確認' },
    repeat: { primary: '繰り返す' },
    iterate: { primary: '反復' },
    guard: { primary: '守る' },
    loop: { primary: 'ループ' },
  },
  roleMarkers: {
    count: { primary: '回', position: 'after' },
    variable: { primary: 'として', position: 'before' },
  },
};

// =============================================================================
// Arabic (VSO)
// =============================================================================

export const arabicProfile: PatternGenLanguageProfile = {
  code: 'ar',
  wordOrder: 'VSO',
  keywords: {
    check: { primary: 'تحقق' },
    repeat: { primary: 'كرر' },
    iterate: { primary: 'عدّد' },
    guard: { primary: 'احمِ' },
    loop: { primary: 'حلقة' },
  },
  roleMarkers: {
    count: { primary: 'مرات', position: 'after' },
  },
};

// =============================================================================
// Korean (SOV)
// =============================================================================

export const koreanProfile: PatternGenLanguageProfile = {
  code: 'ko',
  wordOrder: 'SOV',
  keywords: {
    check: { primary: '확인' },
    repeat: { primary: '반복' },
    iterate: { primary: '반복하기' },
    guard: { primary: '보호' },
    loop: { primary: '루프' },
  },
  roleMarkers: {
    count: { primary: '번', position: 'after' },
    variable: { primary: '로', position: 'before' },
  },
};

// =============================================================================
// Chinese (SVO)
// =============================================================================

export const chineseProfile: PatternGenLanguageProfile = {
  code: 'zh',
  wordOrder: 'SVO',
  keywords: {
    check: { primary: '检查' },
    repeat: { primary: '重复' },
    iterate: { primary: '遍历' },
    guard: { primary: '守卫' },
    loop: { primary: '循环' },
  },
  roleMarkers: {
    count: { primary: '次', position: 'after' },
  },
};

// =============================================================================
// Turkish (SOV)
// =============================================================================

export const turkishProfile: PatternGenLanguageProfile = {
  code: 'tr',
  wordOrder: 'SOV',
  keywords: {
    check: { primary: 'kontrol' },
    repeat: { primary: 'tekrarla' },
    iterate: { primary: 'yinele' },
    guard: { primary: 'koru' },
    loop: { primary: 'döngü' },
  },
  roleMarkers: {
    count: { primary: 'kez', position: 'after' },
    variable: { primary: 'olarak', position: 'before' },
  },
};

// =============================================================================
// French (SVO)
// =============================================================================

export const frenchProfile: PatternGenLanguageProfile = {
  code: 'fr',
  wordOrder: 'SVO',
  keywords: {
    check: { primary: 'vérifier' },
    repeat: { primary: 'répéter' },
    iterate: { primary: 'itérer' },
    guard: { primary: 'garder' },
    loop: { primary: 'boucle' },
  },
  roleMarkers: {
    count: { primary: 'fois', position: 'after' },
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
