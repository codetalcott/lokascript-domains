/**
 * HTML Structure Language Profiles
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
    create: { primary: 'create' },
    nest: { primary: 'nest' },
    link: { primary: 'link' },
    label: { primary: 'label' },
    input: { primary: 'input' },
  },
};

// =============================================================================
// Spanish (SVO)
// =============================================================================

export const spanishProfile: PatternGenLanguageProfile = {
  code: 'es',
  wordOrder: 'SVO',
  keywords: {
    create: { primary: 'crear' },
    nest: { primary: 'anidar' },
    link: { primary: 'enlazar' },
    label: { primary: 'etiquetar' },
    input: { primary: 'entrada' },
  },
};

// =============================================================================
// Japanese (SOV)
// =============================================================================

export const japaneseProfile: PatternGenLanguageProfile = {
  code: 'ja',
  wordOrder: 'SOV',
  keywords: {
    create: { primary: '作成' },
    nest: { primary: '入れ子' },
    link: { primary: 'リンク' },
    label: { primary: 'ラベル' },
    input: { primary: '入力' },
  },
  roleMarkers: {
    parent: { primary: 'の中', position: 'after' },
  },
};

// =============================================================================
// Arabic (VSO)
// =============================================================================

export const arabicProfile: PatternGenLanguageProfile = {
  code: 'ar',
  wordOrder: 'VSO',
  keywords: {
    create: { primary: 'أنشئ' },
    nest: { primary: 'أدخل' },
    link: { primary: 'اربط' },
    label: { primary: 'وسم' },
    input: { primary: 'حقل' },
  },
};

// =============================================================================
// Korean (SOV)
// =============================================================================

export const koreanProfile: PatternGenLanguageProfile = {
  code: 'ko',
  wordOrder: 'SOV',
  keywords: {
    create: { primary: '생성' },
    nest: { primary: '중첩' },
    link: { primary: '링크' },
    label: { primary: '라벨' },
    input: { primary: '입력' },
  },
  roleMarkers: {
    parent: { primary: '안에', position: 'after' },
  },
};

// =============================================================================
// Chinese (SVO)
// =============================================================================

export const chineseProfile: PatternGenLanguageProfile = {
  code: 'zh',
  wordOrder: 'SVO',
  keywords: {
    create: { primary: '创建' },
    nest: { primary: '嵌套' },
    link: { primary: '链接' },
    label: { primary: '标签' },
    input: { primary: '输入' },
  },
};

// =============================================================================
// Turkish (SOV)
// =============================================================================

export const turkishProfile: PatternGenLanguageProfile = {
  code: 'tr',
  wordOrder: 'SOV',
  keywords: {
    create: { primary: 'oluştur' },
    nest: { primary: 'yerleştir' },
    link: { primary: 'bağla' },
    label: { primary: 'etiketle' },
    input: { primary: 'giriş' },
  },
  roleMarkers: {
    parent: { primary: 'içine', position: 'after' },
  },
};

// =============================================================================
// French (SVO)
// =============================================================================

export const frenchProfile: PatternGenLanguageProfile = {
  code: 'fr',
  wordOrder: 'SVO',
  keywords: {
    create: { primary: 'créer' },
    nest: { primary: 'imbriquer' },
    link: { primary: 'lier' },
    label: { primary: 'étiqueter' },
    input: { primary: 'saisie' },
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
