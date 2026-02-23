/**
 * Event Handling Command Schemas
 *
 * Defines the semantic structure of event handling commands using the
 * framework's defineCommand/defineRole helpers. Each schema specifies roles
 * and per-language marker overrides for 8 languages.
 *
 * 6 verbs: listen, trigger, filter, delegate, throttle, debounce
 */

import { defineCommand, defineRole } from '@lokascript/framework';

// =============================================================================
// LISTEN — bind an event handler to an element
// =============================================================================

export const listenSchema = defineCommand({
  action: 'listen',
  description: 'Bind an event listener to an element',
  category: 'binding',
  primaryRole: 'event',
  roles: [
    defineRole({
      role: 'event',
      description: 'Event type to listen for (click, input, submit, etc.)',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'target',
      description: 'Element to attach the listener to',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'on',
        es: 'en',
        ja: 'で',
        ar: 'على',
        ko: '에서',
        zh: '在',
        tr: 'de',
        fr: 'sur',
      },
    }),
  ],
});

// =============================================================================
// TRIGGER — dispatch an event on an element
// =============================================================================

export const triggerSchema = defineCommand({
  action: 'trigger',
  description: 'Dispatch a custom event on an element',
  category: 'dispatch',
  primaryRole: 'event',
  roles: [
    defineRole({
      role: 'event',
      description: 'Event type to dispatch',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'target',
      description: 'Element to dispatch the event on',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'on',
        es: 'en',
        ja: 'で',
        ar: 'على',
        ko: '에서',
        zh: '在',
        tr: 'de',
        fr: 'sur',
      },
    }),
  ],
});

// =============================================================================
// FILTER — listen for an event only when a condition is met
// =============================================================================

export const filterSchema = defineCommand({
  action: 'filter',
  description: 'Listen for an event filtered by a condition (e.g. specific key)',
  category: 'binding',
  primaryRole: 'event',
  roles: [
    defineRole({
      role: 'event',
      description: 'Event type to filter',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'condition',
      description: 'Condition to match (key name, property, etc.)',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'by',
        es: 'por',
        ja: 'で',
        ar: 'بـ',
        ko: '로',
        zh: '按',
        tr: 'ile',
        fr: 'par',
      },
    }),
  ],
});

// =============================================================================
// DELEGATE — listen for events on child elements via delegation
// =============================================================================

export const delegateSchema = defineCommand({
  action: 'delegate',
  description: 'Listen for events delegated from child elements',
  category: 'binding',
  primaryRole: 'event',
  roles: [
    defineRole({
      role: 'event',
      description: 'Event type to delegate',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'selector',
      description: 'Child selector to delegate from',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'from',
        es: 'de',
        ja: 'から',
        ar: 'من',
        ko: '에서',
        zh: '从',
        tr: 'den',
        fr: 'de',
      },
    }),
    defineRole({
      role: 'container',
      description: 'Parent container element',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 0,
      sovPosition: 0,
      markerOverride: {
        en: 'in',
        es: 'en',
        ja: 'の中',
        ar: 'في',
        ko: '안',
        zh: '里',
        tr: 'içinde',
        fr: 'dans',
      },
    }),
  ],
});

// =============================================================================
// THROTTLE — rate-limit event handling
// =============================================================================

export const throttleSchema = defineCommand({
  action: 'throttle',
  description: 'Rate-limit an event handler to fire at most once per interval',
  category: 'performance',
  primaryRole: 'event',
  roles: [
    defineRole({
      role: 'event',
      description: 'Event type to throttle',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'duration',
      description: 'Minimum interval between handler calls',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'by',
        es: 'cada',
        ja: 'ごと',
        ar: 'كل',
        ko: '마다',
        zh: '每',
        tr: 'her',
        fr: 'chaque',
      },
    }),
    defineRole({
      role: 'target',
      description: 'Element to throttle events on',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 0,
      sovPosition: 0,
      markerOverride: {
        en: 'on',
        es: 'en',
        ja: 'で',
        ar: 'على',
        ko: '에서',
        zh: '在',
        tr: 'de',
        fr: 'sur',
      },
    }),
  ],
});

// =============================================================================
// DEBOUNCE — delay event handling until activity stops
// =============================================================================

export const debounceSchema = defineCommand({
  action: 'debounce',
  description: 'Delay event handling until no new events fire within a window',
  category: 'performance',
  primaryRole: 'event',
  roles: [
    defineRole({
      role: 'event',
      description: 'Event type to debounce',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'duration',
      description: 'Quiet window before handler fires',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'by',
        es: 'cada',
        ja: 'ごと',
        ar: 'كل',
        ko: '마다',
        zh: '每',
        tr: 'her',
        fr: 'chaque',
      },
    }),
    defineRole({
      role: 'target',
      description: 'Element to debounce events on',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 0,
      sovPosition: 0,
      markerOverride: {
        en: 'on',
        es: 'en',
        ja: 'で',
        ar: 'على',
        ko: '에서',
        zh: '在',
        tr: 'de',
        fr: 'sur',
      },
    }),
  ],
});

// =============================================================================
// All Schemas
// =============================================================================

export const allSchemas = [
  listenSchema,
  triggerSchema,
  filterSchema,
  delegateSchema,
  throttleSchema,
  debounceSchema,
];
