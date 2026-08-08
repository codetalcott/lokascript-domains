/**
 * Arabic Grammar Profile for Sprites DSL Translation
 *
 * Maps Sprites DSL markers to standard semantic roles for the
 * GrammarTransformer. VSO word order with prepositions.
 */

import type { LanguageProfile } from '@lokascript/framework';

export const arabicGrammar: LanguageProfile = {
  code: 'ar',
  name: 'العربية',
  wordOrder: 'VSO',
  adpositionType: 'preposition',
  morphology: 'fusional',
  direction: 'rtl',
  markers: [
    { form: 'على', role: 'destination', position: 'preposition', required: false },
    { form: 'في', role: 'source', position: 'preposition', required: false },
    { form: 'إلى', role: 'goal', position: 'preposition', required: false },
    { form: 'كـ', role: 'manner', position: 'preposition', required: false },
    { form: 'تعليق', role: 'style', position: 'preposition', required: false },
  ],
  canonicalOrder: ['action', 'patient', 'destination', 'source', 'goal', 'manner', 'style'],
};
