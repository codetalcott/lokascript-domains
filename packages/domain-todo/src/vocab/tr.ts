/**
 * Turkish todo vocabulary. Grammar (SOV, Latin script) comes from
 * `@lokascript/framework`'s Turkish grammar via the framework bridge.
 */

import type { DomainVocabulary } from '@lokascript/framework';

export const trVocabulary: DomainVocabulary = {
  keywords: {
    add: { primary: 'ekle' },
    complete: { primary: 'tamamla' },
    list: { primary: 'listele' },
  },
  // Schema marker: list → 'e'.
  tokenizerKeywords: ['e'],
};
