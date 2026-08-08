/**
 * Arabic Pattern Profile for Sprites DSL
 *
 * Defines keyword translations and word order for Arabic (VSO).
 * Uses preposition markers: على (on), في (in), إلى (to), كـ (as), تعليق (comment).
 */

import type { PatternGenLanguageProfile } from '@lokascript/framework';

export const arabicProfile: PatternGenLanguageProfile = {
  code: 'ar',
  wordOrder: 'VSO',
  keywords: {
    create: { primary: 'أنشئ' },
    destroy: { primary: 'احذف' },
    list: { primary: 'اعرض' },
    run: { primary: 'نفذ' },
    checkpoint: { primary: 'احفظ' },
    restore: { primary: 'استعد' },
    serve: { primary: 'قدم' },
    proxy: { primary: 'وصل' },
    allow: { primary: 'اسمح' },
    deny: { primary: 'ارفض' },
  },
};
