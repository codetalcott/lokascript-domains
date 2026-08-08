/**
 * Arabic Tokenizer for Sprites DSL
 *
 * Handles keyword classification for Arabic (VSO) sprite commands.
 * Markers: على (on), في (in), إلى (to), كـ (as), تعليق (comment).
 */

import { createSimpleTokenizer } from '@lokascript/framework';
import type { LanguageTokenizer } from '@lokascript/framework';

export const ArabicSpriteTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ar',
  keywords: [
    // Command keywords
    'أنشئ',
    'احذف',
    'اعرض',
    'نفذ',
    'احفظ',
    'استعد',
    'قدم',
    'وصل',
    'اسمح',
    'ارفض',
    // Marker keywords
    'على',
    'في',
    'إلى',
    'كـ',
    'تعليق',
    // Filler keywords
    'سبرايت',
  ],
  includeOperators: false,
  caseInsensitive: false,
});
