/**
 * English Pattern Profile for Sprites DSL
 *
 * Defines keyword translations and word order for English (SVO).
 * Role markers come from schema markerOverride, not from the profile.
 */

import type { PatternGenLanguageProfile } from '@lokascript/framework';

export const englishProfile: PatternGenLanguageProfile = {
  code: 'en',
  wordOrder: 'SVO',
  keywords: {
    create: { primary: 'create' },
    destroy: { primary: 'destroy' },
    list: { primary: 'list' },
    run: { primary: 'run' },
    checkpoint: { primary: 'checkpoint' },
    restore: { primary: 'restore' },
    serve: { primary: 'serve' },
    proxy: { primary: 'proxy' },
    allow: { primary: 'allow' },
    deny: { primary: 'deny' },
  },
};
