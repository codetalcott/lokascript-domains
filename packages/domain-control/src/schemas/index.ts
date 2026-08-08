/**
 * Control Flow Command Schemas
 *
 * Defines the semantic structure of control flow commands using the
 * framework's defineCommand/defineRole helpers. Each schema specifies roles
 * and per-language marker overrides for 8 languages.
 *
 * 5 verbs: check, repeat, iterate, guard, loop
 * (loop is split into loopWhile and loopUntil for distinct marker patterns)
 */

import { defineCommand, defineRole } from '@lokascript/framework';

// =============================================================================
// CHECK — conditional check on an element's state
// =============================================================================

export const checkSchema = defineCommand({
  action: 'check',
  description: 'Check a condition on an element (if/then)',
  category: 'conditional',
  primaryRole: 'condition',
  roles: [
    defineRole({
      role: 'condition',
      description: 'Condition to evaluate (e.g. #input is empty)',
      required: true,
      expectedTypes: ['expression'],
      greedy: true,
      svoPosition: 1,
      sovPosition: 1,
    }),
  ],
});

// =============================================================================
// REPEAT — repeat a block a fixed number of times
// =============================================================================

export const repeatSchema = defineCommand({
  action: 'repeat',
  description: 'Repeat a block a fixed number of times',
  category: 'loop',
  primaryRole: 'count',
  roles: [
    defineRole({
      role: 'count',
      description: 'Number of times to repeat',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 1,
      markerOverride: {
        en: 'times',
        es: 'veces',
        ja: '回',
        ar: 'مرات',
        ko: '번',
        zh: '次',
        tr: 'kez',
        fr: 'fois',
      },
    }),
  ],
});

// =============================================================================
// ITERATE — iterate over a collection with a variable binding
// =============================================================================

export const iterateSchema = defineCommand({
  action: 'iterate',
  description: 'Iterate over a collection, binding each element to a variable',
  category: 'loop',
  primaryRole: 'collection',
  roles: [
    defineRole({
      role: 'collection',
      description: 'Collection to iterate over (CSS selector or expression)',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 2,
    }),
    defineRole({
      role: 'variable',
      description: 'Variable name to bind each element to',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 1,
      markerOverride: {
        en: 'as',
        es: 'como',
        ja: 'として',
        ar: 'كـ',
        ko: '로',
        zh: '作为',
        tr: 'olarak',
        fr: 'comme',
      },
    }),
  ],
});

// =============================================================================
// GUARD — guard clause that short-circuits if condition is false
// =============================================================================

export const guardSchema = defineCommand({
  action: 'guard',
  description: 'Guard clause: if condition is false, return early',
  category: 'conditional',
  primaryRole: 'condition',
  roles: [
    defineRole({
      role: 'condition',
      description: 'Condition to guard against (e.g. #form is valid)',
      required: true,
      expectedTypes: ['expression'],
      greedy: true,
      svoPosition: 1,
      sovPosition: 1,
    }),
  ],
});

// =============================================================================
// LOOP (while) — loop while a condition is true
// =============================================================================

export const loopWhileSchema = defineCommand({
  action: 'loop',
  description: 'Loop while a condition is true',
  category: 'loop',
  primaryRole: 'condition',
  roles: [
    defineRole({
      role: 'condition',
      description: 'Condition to evaluate each iteration',
      required: true,
      expectedTypes: ['expression'],
      greedy: true,
      svoPosition: 1,
      sovPosition: 1,
      markerOverride: {
        en: 'while',
        es: 'mientras',
        ja: '間',
        ar: 'بينما',
        ko: '동안',
        zh: '当',
        tr: 'iken',
        fr: 'pendant',
      },
    }),
    defineRole({
      role: 'mode',
      description: 'Loop mode (automatically set to while)',
      required: false,
      expectedTypes: ['expression'],
      default: { type: 'literal', value: 'while' },
    }),
  ],
});

// =============================================================================
// LOOP (until) — loop until a condition becomes true
// =============================================================================

export const loopUntilSchema = defineCommand({
  action: 'loop',
  description: 'Loop until a condition becomes true',
  category: 'loop',
  primaryRole: 'condition',
  roles: [
    defineRole({
      role: 'condition',
      description: 'Condition that stops the loop when true',
      required: true,
      expectedTypes: ['expression'],
      greedy: true,
      svoPosition: 1,
      sovPosition: 1,
      markerOverride: {
        en: 'until',
        es: 'hasta',
        ja: 'まで',
        ar: 'حتى',
        ko: '까지',
        zh: '直到',
        tr: 'kadar',
        fr: 'jusque',
      },
    }),
    defineRole({
      role: 'mode',
      description: 'Loop mode (automatically set to until)',
      required: false,
      expectedTypes: ['expression'],
      default: { type: 'literal', value: 'until' },
    }),
  ],
});

// =============================================================================
// All Schemas
// =============================================================================

export const allSchemas = [
  checkSchema,
  repeatSchema,
  iterateSchema,
  guardSchema,
  loopWhileSchema,
  loopUntilSchema,
];
