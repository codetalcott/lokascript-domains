/**
 * Japanese todo vocabulary. Grammar (SOV, particles, CJK script) comes from
 * `@lokascript/framework`'s Japanese grammar via the framework bridge.
 */

import type { DomainVocabulary } from '@lokascript/framework';

export const jaVocabulary: DomainVocabulary = {
  keywords: {
    add: { primary: '追加' },
    complete: { primary: '完了' },
    list: { primary: '一覧' },
  },
  // Schema marker particles: item → 'を', list → 'に'.
  tokenizerKeywords: ['を', 'に'],
};
