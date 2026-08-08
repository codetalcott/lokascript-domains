/**
 * Japanese Pattern Profile for Sprites DSL
 *
 * Defines keyword translations and word order for Japanese (SOV).
 * Uses postposition markers: で (location/target), を (object),
 * に (destination/directory), として (as), コメント (comment).
 */

import type { PatternGenLanguageProfile } from '@lokascript/framework';

export const japaneseProfile: PatternGenLanguageProfile = {
  code: 'ja',
  wordOrder: 'SOV',
  keywords: {
    create: { primary: '作成' },
    destroy: { primary: '削除' },
    list: { primary: '一覧' },
    run: { primary: '実行' },
    checkpoint: { primary: 'チェックポイント' },
    restore: { primary: '復元' },
    serve: { primary: 'サーブ' },
    proxy: { primary: 'プロキシ' },
    allow: { primary: '許可' },
    deny: { primary: '拒否' },
  },
};
