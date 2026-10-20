/**
 * Spanish todo vocabulary. Grammar (SVO, Latin script) comes from
 * `@lokascript/framework`'s Spanish grammar via the framework bridge.
 */

import type { DomainVocabulary } from '@lokascript/framework';

export const esVocabulary: DomainVocabulary = {
  keywords: {
    add: { primary: 'agregar', alternatives: ['añadir'] },
    complete: { primary: 'completar', alternatives: ['terminar'] },
    list: { primary: 'listar', alternatives: ['mostrar'] },
  },
  tokenizerKeywords: ['a'],
};
