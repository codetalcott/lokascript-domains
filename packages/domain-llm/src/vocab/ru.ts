/**
 * Russian LLM vocabulary (bridge-era language, arc Phase 2). Grammar (SVO,
 * Cyrillic script) comes from `@lokascript/framework`'s Russian grammar via the
 * framework bridge — one vocab file, no hand-authored profile/tokenizer.
 */

import type { DomainVocabulary } from '@lokascript/framework';
import { SCHEMA_OWNED_MARKERS } from './shared';

export const ruVocabulary: DomainVocabulary = {
  keywords: {
    ask: { primary: 'спросить' },
    summarize: { primary: 'суммировать' },
    analyze: { primary: 'анализировать' },
    translate: { primary: 'перевести' },
  },
  // Schema marker words (source→из, manner→как, quantity→в, destination→на)
  // + connectives.
  tokenizerKeywords: ['из', 'как', 'в', 'на', 'и', 'или'],
  roleMarkerOverrides: { ...SCHEMA_OWNED_MARKERS },
};
