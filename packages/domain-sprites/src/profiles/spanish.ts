/**
 * Spanish Pattern Profile for Sprites DSL
 *
 * Defines keyword translations and word order for Spanish (SVO).
 * Role markers come from schema markerOverride, not from the profile.
 */

import type { PatternGenLanguageProfile } from '@lokascript/framework';

export const spanishProfile: PatternGenLanguageProfile = {
  code: 'es',
  wordOrder: 'SVO',
  keywords: {
    create: { primary: 'crear' },
    destroy: { primary: 'destruir' },
    list: { primary: 'listar' },
    run: { primary: 'ejecutar' },
    checkpoint: { primary: 'guardar' },
    restore: { primary: 'restaurar' },
    serve: { primary: 'servir' },
    proxy: { primary: 'proxy' },
    allow: { primary: 'permitir' },
    deny: { primary: 'denegar' },
  },
};
