/**
 * Spanish Tokenizer for Sprites DSL
 *
 * Handles keyword classification for Spanish (SVO) sprite commands.
 * Markers: en (on), dentro (in), a (to), como (as), comentario (comment).
 */

import { createSimpleTokenizer } from '@lokascript/framework';
import type { LanguageTokenizer } from '@lokascript/framework';

export const SpanishSpriteTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'es',
  keywords: [
    // Command keywords
    'crear',
    'destruir',
    'listar',
    'ejecutar',
    'guardar',
    'restaurar',
    'servir',
    'proxy',
    'permitir',
    'denegar',
    // Marker keywords
    'en',
    'dentro',
    'a',
    'como',
    'comentario',
    // Filler keywords (ignored in parsing but recognized)
    'sprite',
    'sprites',
  ],
  includeOperators: false,
  caseInsensitive: true,
});
