/**
 * The values the gate writes into each role, per domain. A role not listed gets a plain name no
 * vocabulary uses (`v0x`, or `#box0` where only a selector fits): its value must come back verbatim.
 * A role that takes FIXED words lists every word the domain's renderer and generator know, in English:
 * the gate writes the command once per word, in every language, so a word one of the two tables lacks
 * fails in the languages where it is missing.
 *
 * Keys are `<action>.<role>` or `<role>` (every action). The first value is the one the other cases use.
 */

import type { GateFixture } from '@lokascript/framework/testing/gate';

/**
 * The kit's fixture (`@lokascript/framework/testing/gate`). `oracle: 'compile'`: a round trip also
 * passes when the text compiles to the command's own code (the domain compiles to something that does
 * not depend on the language); `'node'`: only the parse counts (learn compiles to a sentence in each
 * language).
 */
export type DomainFixture = GateFixture;

export const DOMAIN_VALUES: Record<string, DomainFixture> = {
  behaviorspec: {
    oracle: 'compile',
    values: {
      // mappings.ts: SETUP_MAPPINGS, INTERACTION_MAPPINGS, ASSERTION_MAPPINGS (their English words).
      'test.name': ['Login'],
      'given.subject': ['page'],
      'given.value': ['/home'],
      'when.actor': ['user'],
      'when.action': [
        'clicks',
        'types',
        'submits',
        'hovers',
        'scrolls',
        'drags',
        'double-clicks',
        'right-clicks',
        'focuses',
        'clears',
        // From domain-bdd.
        'presses',
        'checks',
        'unchecks',
        'selects',
        'waits',
      ],
      'when.target': ['#button'],
      'when.destination': ['#form'],
      // The text typed (`types 'hello' into #search`): a quoted string.
      'when.value': ["'hello'"],
      'expect.target': ['#toast'],
      // The assertions that take a value (mappings.ts: a template with `${value}`); the others,
      // which refuse one, are written without it below.
      'expect.assertion': ['has', 'shows', 'changes', 'contains', 'count', 'value', 'text'],
      'expect.value': ['hello'],
      'after.duration': ['2s', '300ms'],
    },
    commands: [
      ...['appears', 'disappears', 'enabled', 'disabled', 'checked', 'focused', 'editable', 'empty'].map(
        assertion => `[expect target:#toast assertion:${assertion}]`
      ),
      // `given`'s value depends on its subject: a URL for the page, a size for the viewport, a state
      // for an element (mappings.ts: SETUP_MAPPINGS, STATE_MAPPINGS).
      '[given subject:viewport value:1024x768]',
      ...[
        'exists',
        'visible',
        'hidden',
        'loaded',
        'disabled',
        'enabled',
        'checked',
        'focused',
        'editable',
        'empty',
      ].map(state => `[given subject:#box value:${state}]`),
    ],
  },
  flow: {
    oracle: 'compile',
    values: {
      // flow-generator.ts normalizeFormat: json, html, text, sse.
      style: ['json', 'html', 'text', 'sse'],
      'fetch.source': ['/api/users'],
      'poll.source': ['/api/status'],
      'poll.duration': ['5s'],
      'stream.source': ['/api/events'],
      destination: ['#list'],
      'submit.patient': ['#checkout'],
      'submit.destination': ['/api/order'],
      'transform.patient': ['data'],
      'transform.instrument': ['uppercase'],
      'enter.source': ['/api'],
      'follow.patient': ['orders'],
      'follow.instrument': ['next'],
      'perform.patient': ['createOrder'],
      'perform.source': ['#checkout'],
      'capture.patient': ['message'],
      'capture.destination': ['orders'],
    },
  },
  learn: {
    // learn's commands are hyperscript's, written and read by semantic (D2); the values are the
    // shapes its sentences carry.
    oracle: 'node',
    values: {
      'add.patient': ['.active'],
      'remove.patient': ['.active'],
      'toggle.patient': ['.active'],
      'put.patient': ['"hi"'],
      'set.destination': ['x'],
      'set.patient': ['5'],
      'wait.duration': ['2s'],
      'fetch.source': ['/api'],
      'send.event': ['click'],
      'go.destination': ['/home'],
      'increment.patient': ['x'],
      'decrement.patient': ['x'],
      'take.patient': ['.active'],
      destination: ['#box'],
      source: ['#box'],
      patient: ['#box'],
    },
  },
  llm: {
    oracle: 'compile',
    values: {
      'ask.patient': ['"What is this?"'],
      source: ['#article'],
      manner: ['bullets'],
      'summarize.patient': ['#document'],
      'summarize.quantity': ['3'],
      'analyze.patient': ['#text'],
      'analyze.manner': ['sentiment'],
      'translate.patient': ['#text'],
      'translate.source': ['english'],
      'translate.destination': ['japanese'],
    },
  },
  sql: {
    oracle: 'compile',
    values: {
      columns: ['name'],
      source: ['users'],
      destination: ['users'],
      values: ['Bob'],
      condition: ['active'],
      limit: ['10'],
    },
  },
  todo: {
    oracle: 'compile',
    values: {
      item: ['milk'],
      list: ['groceries'],
    },
  },
  voice: {
    oracle: 'compile',
    values: {
      // voice-generator.ts: scroll's manner switch, zoom's in / out / reset.
      'scroll.manner': ['down', 'up', 'left', 'right', 'top', 'bottom'],
      'scroll.quantity': ['500'],
      'zoom.manner': ['in', 'out', 'reset'],
      quantity: ['2'],
      'navigate.destination': ['/home'],
      'type.patient': ['hello'],
      'type.destination': ['#search'],
      'search.patient': ['hello'],
      'search.destination': ['#search'],
      'open.patient': ['/new-page'],
      // voice-generator.ts: TAB_WORDS and DIALOG_WORDS.
      'close.patient': ['tab', 'dialog', 'modal'],
      'help.patient': ['navigate'],
      'select.patient': ['all'],
      patient: ['#login'],
    },
  },
};
