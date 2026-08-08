/**
 * Hypermedia Command Schemas
 *
 * Defines the semantic structure of hypermedia commands using the
 * framework's defineCommand/defineRole helpers. Each schema specifies roles
 * and per-language marker overrides for 8 languages.
 *
 * 5 verbs: request, swap, morph, push, replace
 */

import { defineCommand, defineRole } from '@lokascript/framework';

// =============================================================================
// REQUEST — fetch content from a URL into a destination element
// =============================================================================

export const requestSchema = defineCommand({
  action: 'request',
  description: 'Fetch content from a URL and place it into a destination element',
  category: 'fetching',
  primaryRole: 'url',
  roles: [
    defineRole({
      role: 'url',
      description: 'URL to fetch content from',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'destination',
      description: 'Element to place the fetched content into',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'into',
        es: 'en',
        ja: 'に',
        ar: 'في',
        ko: '에',
        zh: '到',
        tr: 'içine',
        fr: 'dans',
      },
    }),
    defineRole({
      role: 'method',
      description: 'HTTP method to use (GET, POST, etc.)',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 0,
      sovPosition: 0,
      markerOverride: {
        en: 'with',
        es: 'con',
        ja: 'で',
        ar: 'بـ',
        ko: '로',
        zh: '用',
        tr: 'ile',
        fr: 'avec',
      },
    }),
  ],
});

// =============================================================================
// SWAP — swap content into a target element
// =============================================================================

export const swapSchema = defineCommand({
  action: 'swap',
  description: 'Swap content into a target element with optional strategy',
  category: 'mutation',
  primaryRole: 'content',
  roles: [
    defineRole({
      role: 'content',
      description: 'Content to swap in (e.g. response)',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'target',
      description: 'Element to swap content into',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'into',
        es: 'en',
        ja: 'に',
        ar: 'في',
        ko: '에',
        zh: '到',
        tr: 'içine',
        fr: 'dans',
      },
    }),
    defineRole({
      role: 'strategy',
      description: 'Swap strategy (innerHTML, outerHTML, beforeend)',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 0,
      sovPosition: 0,
      markerOverride: {
        en: 'with',
        es: 'con',
        ja: 'で',
        ar: 'بـ',
        ko: '로',
        zh: '用',
        tr: 'ile',
        fr: 'avec',
      },
    }),
  ],
});

// =============================================================================
// MORPH — morph content into a target element
// =============================================================================

export const morphSchema = defineCommand({
  action: 'morph',
  description: 'Morph content into a target element preserving DOM state',
  category: 'mutation',
  primaryRole: 'content',
  roles: [
    defineRole({
      role: 'content',
      description: 'Content to morph into the target',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'target',
      description: 'Element to morph content into',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'into',
        es: 'en',
        ja: 'に',
        ar: 'في',
        ko: '에',
        zh: '到',
        tr: 'içine',
        fr: 'dans',
      },
    }),
  ],
});

// =============================================================================
// PUSH — push a URL to browser history
// =============================================================================

export const pushSchema = defineCommand({
  action: 'push',
  description: 'Push a URL to the browser history stack',
  category: 'navigation',
  primaryRole: 'url',
  roles: [
    defineRole({
      role: 'url',
      description: 'URL to push to history',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
  ],
});

// =============================================================================
// REPLACE — replace the current URL in browser history
// =============================================================================

export const replaceSchema = defineCommand({
  action: 'replace',
  description: 'Replace the current URL in browser history',
  category: 'navigation',
  primaryRole: 'url',
  roles: [
    defineRole({
      role: 'url',
      description: 'URL to replace in history',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
  ],
});

// =============================================================================
// All Schemas
// =============================================================================

export const allSchemas = [
  requestSchema,
  swapSchema,
  morphSchema,
  pushSchema,
  replaceSchema,
];
