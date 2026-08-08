/**
 * Japanese Tokenizer for Sprites DSL
 *
 * Handles keyword classification for Japanese (SOV) sprite commands.
 * Postposition markers: で (on), を (object), に (to/in), として (as), コメント (comment).
 */

import { createSimpleTokenizer } from '@lokascript/framework';
import type { LanguageTokenizer } from '@lokascript/framework';

export const JapaneseSpriteTokenizer: LanguageTokenizer = createSimpleTokenizer({
  language: 'ja',
  keywords: [
    // Command keywords
    '作成',
    '削除',
    '一覧',
    '実行',
    'チェックポイント',
    '復元',
    'サーブ',
    'プロキシ',
    '許可',
    '拒否',
    // Marker keywords (postpositions)
    'で',
    'を',
    'に',
    'として',
    'コメント',
    // Filler keywords
    'スプライト',
  ],
  includeOperators: false,
  caseInsensitive: false,
});
