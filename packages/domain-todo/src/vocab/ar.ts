/**
 * Arabic todo vocabulary. Grammar (VSO, RTL, Arabic script) comes from
 * `@lokascript/framework`'s Arabic grammar via the framework bridge.
 */

import type { DomainVocabulary } from '@lokascript/framework';

export const arVocabulary: DomainVocabulary = {
  keywords: {
    add: { primary: 'أضف' },
    complete: { primary: 'أكمل' },
    list: { primary: 'اعرض' },
  },
  // Schema marker: list → 'إلى'.
  tokenizerKeywords: ['إلى'],
};
