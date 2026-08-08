/**
 * Japanese Grammar Profile for Sprites DSL Translation
 *
 * Maps Sprites DSL markers to standard semantic roles for the
 * GrammarTransformer. SOV word order with postpositions.
 */

import type { LanguageProfile } from '@lokascript/framework';

export const japaneseGrammar: LanguageProfile = {
  code: 'ja',
  name: '日本語',
  wordOrder: 'SOV',
  adpositionType: 'postposition',
  morphology: 'agglutinative',
  direction: 'ltr',
  markers: [
    { form: 'で', role: 'destination', position: 'postposition', required: false },
    { form: 'を', role: 'patient', position: 'postposition', required: false },
    { form: 'に', role: 'goal', position: 'postposition', required: false },
    { form: 'として', role: 'manner', position: 'postposition', required: false },
    { form: 'コメント', role: 'style', position: 'preposition', required: false },
  ],
  canonicalOrder: ['patient', 'destination', 'source', 'goal', 'manner', 'style', 'action'],
};
