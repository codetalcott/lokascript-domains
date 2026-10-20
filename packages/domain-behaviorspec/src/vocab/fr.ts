/**
 * French BehaviorSpec vocabulary. Grammar (SVO) comes from
 * `@lokascript/framework`'s French grammar via the framework bridge.
 */

import type { DomainVocabulary } from '@lokascript/framework';
import { SCHEMA_OWNED_MARKERS } from './shared';

export const frVocabulary: DomainVocabulary = {
  keywords: {
    test: { primary: 'test' },
    given: { primary: 'soit' },
    when: { primary: 'quand' },
    expect: { primary: 'attendre' },
    after: { primary: 'apres' },
    not: { primary: 'pas' },
  },
  roleMarkerOverrides: { ...SCHEMA_OWNED_MARKERS },
};
