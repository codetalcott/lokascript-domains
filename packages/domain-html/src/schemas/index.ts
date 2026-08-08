/**
 * HTML Structure Command Schemas
 *
 * Defines the semantic structure of HTML structure commands using the
 * framework's defineCommand/defineRole helpers. Each schema specifies roles
 * and per-language marker overrides for 8 languages.
 *
 * 5 verbs: create, nest, link, label, input
 */

import { defineCommand, defineRole } from '@lokascript/framework';

// =============================================================================
// CREATE — create an HTML element with optional attributes
// =============================================================================

export const createSchema = defineCommand({
  action: 'create',
  description: 'Create an HTML element with optional attributes',
  category: 'structure',
  primaryRole: 'element',
  roles: [
    defineRole({
      role: 'element',
      description: 'HTML element to create (button, div, span, p, h1, h2, h3, section, article, nav, header, footer)',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'attribute',
      description: 'Attribute to set on the element (e.g. class "primary")',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
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
// NEST — nest a child element inside a parent element
// =============================================================================

export const nestSchema = defineCommand({
  action: 'nest',
  description: 'Nest a child element inside a parent container',
  category: 'structure',
  primaryRole: 'child',
  roles: [
    defineRole({
      role: 'child',
      description: 'Child element to nest',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'parent',
      description: 'Parent container element',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'inside',
        es: 'dentro',
        ja: 'の中',
        ar: 'داخل',
        ko: '안에',
        zh: '里面',
        tr: 'içine',
        fr: 'dans',
      },
    }),
  ],
});

// =============================================================================
// LINK — create a hyperlink with text and URL
// =============================================================================

export const linkSchema = defineCommand({
  action: 'link',
  description: 'Create a hyperlink with display text and target URL',
  category: 'navigation',
  primaryRole: 'text',
  roles: [
    defineRole({
      role: 'text',
      description: 'Display text for the link',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'url',
      description: 'Target URL for the link',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'to',
        es: 'a',
        ja: 'へ',
        ar: 'إلى',
        ko: '로',
        zh: '到',
        tr: 'ye',
        fr: 'vers',
      },
    }),
  ],
});

// =============================================================================
// LABEL — associate a label with a form element
// =============================================================================

export const labelSchema = defineCommand({
  action: 'label',
  description: 'Create a label for a form element',
  category: 'accessibility',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Target element ID to label (e.g. #email)',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'text',
      description: 'Label text to display',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
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
// INPUT — create a form input with type and name
// =============================================================================

export const inputSchema = defineCommand({
  action: 'input',
  description: 'Create a form input element with type and name',
  category: 'forms',
  primaryRole: 'type',
  roles: [
    defineRole({
      role: 'type',
      description: 'Input type (text, email, password, number, checkbox, radio)',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
    defineRole({
      role: 'name',
      description: 'Input field name attribute',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: {
        en: 'named',
        es: 'llamado',
        ja: '名前',
        ar: 'باسم',
        ko: '이름',
        zh: '名为',
        tr: 'adlı',
        fr: 'nommé',
      },
    }),
  ],
});

// =============================================================================
// All Schemas
// =============================================================================

export const allSchemas = [
  createSchema,
  nestSchema,
  linkSchema,
  labelSchema,
  inputSchema,
];
