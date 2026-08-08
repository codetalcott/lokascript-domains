/**
 * Spanish Grammar Profile for Sprites DSL Translation
 *
 * Maps Sprites DSL markers to standard semantic roles for the
 * GrammarTransformer. SVO word order with prepositions.
 */

import type { LanguageProfile } from '@lokascript/framework';

export const spanishGrammar: LanguageProfile = {
  code: 'es',
  name: 'Español',
  wordOrder: 'SVO',
  adpositionType: 'preposition',
  morphology: 'fusional',
  direction: 'ltr',
  markers: [
    { form: 'en', role: 'destination', position: 'preposition', required: false },
    { form: 'dentro', role: 'source', position: 'preposition', required: false },
    { form: 'a', role: 'goal', position: 'preposition', required: false },
    { form: 'como', role: 'manner', position: 'preposition', required: false },
    { form: 'comentario', role: 'style', position: 'preposition', required: false },
  ],
  canonicalOrder: ['action', 'patient', 'destination', 'source', 'goal', 'manner', 'style'],
};
