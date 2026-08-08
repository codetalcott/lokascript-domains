/**
 * Animation Command Schemas
 *
 * Defines the semantic structure of animation commands using the
 * framework's defineCommand/defineRole helpers. Each schema specifies roles
 * and per-language marker overrides for 8 languages.
 *
 * 5 verbs: transition, settle, measure, fade, slide
 */

import { defineCommand, defineRole } from '@lokascript/framework';

// =============================================================================
// TRANSITION — animate a CSS property to a value over a duration
// =============================================================================

export const transitionSchema = defineCommand({
  action: 'transition',
  description: 'Animate a CSS property to a target value over a duration',
  category: 'animation',
  primaryRole: 'property',
  roles: [
    defineRole({
      role: 'property',
      description: 'CSS property to animate (opacity, color, width, etc.)',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 2,
    }),
    defineRole({
      role: 'value',
      description: 'Target value for the CSS property',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 1,
      markerOverride: {
        en: 'to',
        es: 'a',
        ja: 'に',
        ar: 'إلى',
        ko: '로',
        zh: '到',
        tr: 'ye',
        fr: 'à',
      },
    }),
    defineRole({
      role: 'duration',
      description: 'Animation duration (e.g. 300ms, 1s)',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 0,
      sovPosition: 0,
      markerOverride: {
        en: 'over',
        es: 'en',
        ja: 'で',
        ar: 'خلال',
        ko: '동안',
        zh: '经过',
        tr: 'sürede',
        fr: 'en',
      },
    }),
  ],
});

// =============================================================================
// SETTLE — wait for all animations/transitions to complete on an element
// =============================================================================

export const settleSchema = defineCommand({
  action: 'settle',
  description: 'Wait for all animations and transitions to settle on an element',
  category: 'animation',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Element to wait for settling',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
    }),
  ],
});

// =============================================================================
// MEASURE — read a computed property value from an element
// =============================================================================

export const measureSchema = defineCommand({
  action: 'measure',
  description: 'Read a computed property or dimension from an element',
  category: 'animation',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Element to measure',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 2,
    }),
    defineRole({
      role: 'property',
      description: 'Property or dimension to measure (width, height, etc.)',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 1,
    }),
  ],
});

// =============================================================================
// FADE — convenience for opacity transitions (in/out)
// =============================================================================

export const fadeSchema = defineCommand({
  action: 'fade',
  description: 'Fade an element in or out by transitioning opacity',
  category: 'animation',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Element to fade',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 2,
    }),
    defineRole({
      role: 'direction',
      description: 'Fade direction: in or out',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 1,
    }),
    defineRole({
      role: 'duration',
      description: 'Fade duration (e.g. 500ms)',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 0,
      sovPosition: 0,
      markerOverride: {
        en: 'over',
        es: 'en',
        ja: 'で',
        ar: 'خلال',
        ko: '동안',
        zh: '经过',
        tr: 'sürede',
        fr: 'en',
      },
    }),
  ],
});

// =============================================================================
// SLIDE — convenience for transform transitions (up/down/left/right)
// =============================================================================

export const slideSchema = defineCommand({
  action: 'slide',
  description: 'Slide an element in a direction via CSS transform',
  category: 'animation',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Element to slide',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 2,
    }),
    defineRole({
      role: 'direction',
      description: 'Slide direction: up, down, left, or right',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 1,
    }),
    defineRole({
      role: 'duration',
      description: 'Slide duration (e.g. 200ms)',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 0,
      sovPosition: 0,
      markerOverride: {
        en: 'over',
        es: 'en',
        ja: 'で',
        ar: 'خلال',
        ko: '동안',
        zh: '经过',
        tr: 'sürede',
        fr: 'en',
      },
    }),
  ],
});

// =============================================================================
// All Schemas
// =============================================================================

export const allSchemas = [
  transitionSchema,
  settleSchema,
  measureSchema,
  fadeSchema,
  slideSchema,
];
