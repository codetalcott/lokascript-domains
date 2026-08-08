/**
 * English Grammar Profile for Sprites DSL Translation
 *
 * Maps Sprites DSL markers to standard semantic roles for the
 * GrammarTransformer. Enables cross-language translation via
 * the framework's translate() method.
 */

import type { LanguageProfile } from '@lokascript/framework';

export const englishGrammar: LanguageProfile = {
  code: 'en',
  name: 'English',
  wordOrder: 'SVO',
  adpositionType: 'preposition',
  morphology: 'fusional',
  direction: 'ltr',
  markers: [
    { form: 'on', role: 'destination', position: 'preposition', required: false },
    { form: 'in', role: 'source', position: 'preposition', required: false },
    { form: 'to', role: 'goal', position: 'preposition', required: false },
    { form: 'as', role: 'manner', position: 'preposition', required: false },
    { form: 'comment', role: 'style', position: 'preposition', required: false },
  ],
  canonicalOrder: ['action', 'patient', 'destination', 'source', 'goal', 'manner', 'style'],
};
