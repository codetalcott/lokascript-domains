/**
 * English Tokenizer for Sprites DSL
 *
 * Handles keyword classification and string literal extraction for
 * sprite names, commands, and identifiers.
 */

import { createSimpleTokenizer } from '@lokascript/framework';
import type { LanguageTokenizer } from '@lokascript/framework';

export const EnglishSpriteTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'en',
  keywords: [
    // Command keywords
    'create',
    'destroy',
    'list',
    'run',
    'checkpoint',
    'restore',
    'serve',
    'proxy',
    'allow',
    'deny',
    // Marker keywords
    'on',
    'in',
    'to',
    'as',
    'comment',
    // Filler keywords (ignored in parsing but recognized)
    'sprite',
    'sprites',
  ],
  includeOperators: false,
  caseInsensitive: true,
});
