/**
 * Events Domain Tests
 *
 * Validates the multilingual Events DSL across 8 languages (EN, ES, JA, AR, KO, ZH, TR, FR)
 * covering SVO, SOV, and VSO word orders, with compilation assertions,
 * role value verification, renderer round-trips, and edge cases.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createEventsDSL, renderEvents } from '../index';
import { eventsCodeGenerator } from '../generators/events-generator';
import type { MultilingualDSL } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

describe('Events Domain', () => {
  let events: MultilingualDSL;

  beforeAll(() => {
    events = createEventsDSL();
  });

  // ===========================================================================
  // Language Support
  // ===========================================================================

  describe('Language Support', () => {
    it('should support 8 languages', () => {
      const languages = events.getSupportedLanguages();
      expect(languages).toContain('en');
      expect(languages).toContain('es');
      expect(languages).toContain('ja');
      expect(languages).toContain('ar');
      expect(languages).toContain('ko');
      expect(languages).toContain('zh');
      expect(languages).toContain('tr');
      expect(languages).toContain('fr');
      expect(languages).toHaveLength(8);
    });

    it('should reject unsupported language', () => {
      expect(() => events.parse('listen click on #button', 'de')).toThrow();
    });
  });

  // ===========================================================================
  // English (SVO)
  // ===========================================================================

  describe('English (SVO)', () => {
    it('should parse LISTEN', () => {
      const node = events.parse('listen click on #button', 'en');
      expect(node.action).toBe('listen');
      expect(node.roles.has('event')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should extract correct role values from LISTEN', () => {
      const node = events.parse('listen click on #button', 'en');
      expect(extractRoleValue(node, 'event')).toBe('click');
      expect(extractRoleValue(node, 'target')).toBe('#button');
    });

    it('should compile LISTEN to _hyperscript', () => {
      const result = events.compile('listen click on #button', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('on click from #button');
    });

    it('should parse TRIGGER', () => {
      const node = events.parse('trigger submit on #form', 'en');
      expect(node.action).toBe('trigger');
      expect(extractRoleValue(node, 'event')).toBe('submit');
      expect(extractRoleValue(node, 'target')).toBe('#form');
    });

    it('should compile TRIGGER to _hyperscript', () => {
      const result = events.compile('trigger submit on #form', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('trigger submit on #form');
    });

    it('should parse FILTER', () => {
      const node = events.parse('filter keydown by Enter', 'en');
      expect(node.action).toBe('filter');
      expect(extractRoleValue(node, 'event')).toBe('keydown');
      expect(extractRoleValue(node, 'condition')).toBe('Enter');
    });

    it('should compile FILTER to _hyperscript', () => {
      const result = events.compile('filter keydown by Enter', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('keydown');
      expect(result.code).toContain('Enter');
    });

    it('should parse DELEGATE', () => {
      const node = events.parse('delegate click from .item in #list', 'en');
      expect(node.action).toBe('delegate');
      expect(extractRoleValue(node, 'event')).toBe('click');
      expect(extractRoleValue(node, 'selector')).toBe('.item');
      expect(extractRoleValue(node, 'container')).toBe('#list');
    });

    it('should compile DELEGATE to _hyperscript', () => {
      const result = events.compile('delegate click from .item in #list', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('click');
      expect(result.code).toContain('.item');
      expect(result.code).toContain('#list');
    });

    it('should parse THROTTLE', () => {
      const node = events.parse('throttle scroll by 200ms on window', 'en');
      expect(node.action).toBe('throttle');
      expect(extractRoleValue(node, 'event')).toBe('scroll');
      expect(extractRoleValue(node, 'duration')).toBe('200ms');
    });

    it('should compile THROTTLE to _hyperscript', () => {
      const result = events.compile('throttle scroll by 200ms on window', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('scroll');
      expect(result.code).toContain('throttle');
      expect(result.code).toContain('200ms');
    });

    it('should parse DEBOUNCE', () => {
      const node = events.parse('debounce input by 300ms on #search', 'en');
      expect(node.action).toBe('debounce');
      expect(extractRoleValue(node, 'event')).toBe('input');
      expect(extractRoleValue(node, 'duration')).toBe('300ms');
    });

    it('should compile DEBOUNCE to _hyperscript', () => {
      const result = events.compile('debounce input by 300ms on #search', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('input');
      expect(result.code).toContain('debounce');
      expect(result.code).toContain('300ms');
    });

    it('should validate correct command', () => {
      const result = events.validate('listen click on #button', 'en');
      expect(result.valid).toBe(true);
      expect(result.node).toBeDefined();
    });

    it('should reject invalid command', () => {
      const result = events.validate('invalid command syntax', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  // ===========================================================================
  // Spanish (SVO)
  // ===========================================================================

  describe('Spanish (SVO)', () => {
    it('should parse Spanish LISTEN', () => {
      const node = events.parse('escuchar click en #button', 'es');
      expect(node.action).toBe('listen');
      expect(node.roles.has('event')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should compile Spanish LISTEN to _hyperscript', () => {
      const result = events.compile('escuchar click en #button', 'es');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('click');
    });

    it('should parse Spanish TRIGGER', () => {
      const node = events.parse('disparar submit en #form', 'es');
      expect(node.action).toBe('trigger');
    });
  });

  // ===========================================================================
  // Japanese (SOV)
  // ===========================================================================

  describe('Japanese (SOV)', () => {
    it('should parse Japanese LISTEN (SOV: verb last)', () => {
      const node = events.parse('#button で click 聞く', 'ja');
      expect(node.action).toBe('listen');
      expect(node.roles.has('event')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should compile Japanese LISTEN to _hyperscript', () => {
      const result = events.compile('#button で click 聞く', 'ja');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('click');
    });

    it('should parse Japanese TRIGGER', () => {
      const node = events.parse('#form で submit 発火', 'ja');
      expect(node.action).toBe('trigger');
    });
  });

  // ===========================================================================
  // Arabic (VSO)
  // ===========================================================================

  describe('Arabic (VSO)', () => {
    it('should parse Arabic LISTEN (VSO: verb first)', () => {
      const node = events.parse('استمع click على #button', 'ar');
      expect(node.action).toBe('listen');
      expect(node.roles.has('event')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should compile Arabic LISTEN to _hyperscript', () => {
      const result = events.compile('استمع click على #button', 'ar');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('click');
    });

    it('should parse Arabic TRIGGER', () => {
      const node = events.parse('أطلق submit على #form', 'ar');
      expect(node.action).toBe('trigger');
    });
  });

  // ===========================================================================
  // Korean (SOV)
  // ===========================================================================

  describe('Korean (SOV)', () => {
    it('should parse Korean LISTEN (SOV order)', () => {
      const node = events.parse('#button 에서 click 듣기', 'ko');
      expect(node.action).toBe('listen');
      expect(node.roles.has('event')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should compile Korean LISTEN to _hyperscript', () => {
      const result = events.compile('#button 에서 click 듣기', 'ko');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('click');
    });
  });

  // ===========================================================================
  // Chinese (SVO)
  // ===========================================================================

  describe('Chinese (SVO)', () => {
    it('should parse Chinese LISTEN', () => {
      const node = events.parse('监听 click 在 #button', 'zh');
      expect(node.action).toBe('listen');
      expect(node.roles.has('event')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should compile Chinese LISTEN to _hyperscript', () => {
      const result = events.compile('监听 click 在 #button', 'zh');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('click');
    });
  });

  // ===========================================================================
  // Turkish (SOV)
  // ===========================================================================

  describe('Turkish (SOV)', () => {
    it('should parse Turkish LISTEN (SOV order)', () => {
      const node = events.parse('#button de click dinle', 'tr');
      expect(node.action).toBe('listen');
      expect(node.roles.has('event')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should compile Turkish LISTEN to _hyperscript', () => {
      const result = events.compile('#button de click dinle', 'tr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('click');
    });
  });

  // ===========================================================================
  // French (SVO)
  // ===========================================================================

  describe('French (SVO)', () => {
    it('should parse French LISTEN', () => {
      const node = events.parse('écouter click sur #button', 'fr');
      expect(node.action).toBe('listen');
      expect(node.roles.has('event')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should compile French LISTEN to _hyperscript', () => {
      const result = events.compile('écouter click sur #button', 'fr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('click');
    });
  });

  // ===========================================================================
  // Cross-Language Semantic Equivalence
  // ===========================================================================

  describe('Semantic Equivalence', () => {
    it('should parse LISTEN across all 8 languages to same action', () => {
      const nodes = [
        events.parse('listen click on #button', 'en'),
        events.parse('escuchar click en #button', 'es'),
        events.parse('#button で click 聞く', 'ja'),
        events.parse('استمع click على #button', 'ar'),
        events.parse('#button 에서 click 듣기', 'ko'),
        events.parse('监听 click 在 #button', 'zh'),
        events.parse('#button de click dinle', 'tr'),
        events.parse('écouter click sur #button', 'fr'),
      ];
      for (const node of nodes) {
        expect(node.action).toBe('listen');
        expect(node.roles.has('event')).toBe(true);
        expect(node.roles.has('target')).toBe(true);
      }
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle empty input', () => {
      expect(() => events.parse('', 'en')).toThrow();
    });

    it('should handle whitespace-only input', () => {
      expect(() => events.parse('   ', 'en')).toThrow();
    });

    it('should provide error info for unrecognized input', () => {
      const result = events.validate('xyzzy foobar', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});

// =============================================================================
// Natural Language Renderer
// =============================================================================

describe('Events Renderer', () => {
  let events: MultilingualDSL;

  beforeAll(() => {
    events = createEventsDSL();
  });

  describe('English Rendering', () => {
    it('should render LISTEN to English', () => {
      const node = events.parse('listen click on #button', 'en');
      const rendered = renderEvents(node, 'en');
      expect(rendered).toContain('listen');
      expect(rendered).toContain('click');
      expect(rendered).toContain('on');
      expect(rendered).toContain('#button');
    });

    it('should render TRIGGER to English', () => {
      const node = events.parse('trigger submit on #form', 'en');
      const rendered = renderEvents(node, 'en');
      expect(rendered).toContain('trigger');
      expect(rendered).toContain('submit');
    });

    it('should render FILTER to English', () => {
      const node = events.parse('filter keydown by Enter', 'en');
      const rendered = renderEvents(node, 'en');
      expect(rendered).toContain('filter');
      expect(rendered).toContain('keydown');
      expect(rendered).toContain('by');
      expect(rendered).toContain('Enter');
    });

    it('should render DELEGATE to English', () => {
      const node = events.parse('delegate click from .item in #list', 'en');
      const rendered = renderEvents(node, 'en');
      expect(rendered).toContain('delegate');
      expect(rendered).toContain('click');
      expect(rendered).toContain('from');
      expect(rendered).toContain('.item');
    });
  });

  describe('Cross-Language Rendering', () => {
    it('should render LISTEN to Japanese (SOV word order)', () => {
      const node = events.parse('listen click on #button', 'en');
      const rendered = renderEvents(node, 'ja');
      expect(rendered).toContain('聞く');
      expect(rendered).toContain('で');
      // SOV: verb should come last
      const keywordIdx = rendered.indexOf('聞く');
      const markerIdx = rendered.indexOf('で');
      expect(markerIdx).toBeLessThan(keywordIdx);
    });

    it('should render LISTEN to Spanish', () => {
      const node = events.parse('listen click on #button', 'en');
      const rendered = renderEvents(node, 'es');
      expect(rendered).toContain('escuchar');
      expect(rendered).toContain('en');
    });

    it('should render LISTEN to Arabic', () => {
      const node = events.parse('listen click on #button', 'en');
      const rendered = renderEvents(node, 'ar');
      expect(rendered).toContain('استمع');
      expect(rendered).toContain('على');
    });

    it('should render LISTEN to Korean (SOV word order)', () => {
      const node = events.parse('listen click on #button', 'en');
      const rendered = renderEvents(node, 'ko');
      expect(rendered).toContain('듣기');
      expect(rendered).toContain('에서');
    });

    it('should render LISTEN to Chinese', () => {
      const node = events.parse('listen click on #button', 'en');
      const rendered = renderEvents(node, 'zh');
      expect(rendered).toContain('监听');
      expect(rendered).toContain('在');
    });

    it('should render LISTEN to Turkish (SOV word order)', () => {
      const node = events.parse('listen click on #button', 'en');
      const rendered = renderEvents(node, 'tr');
      expect(rendered).toContain('dinle');
      expect(rendered).toContain('de');
    });

    it('should render LISTEN to French', () => {
      const node = events.parse('listen click on #button', 'en');
      const rendered = renderEvents(node, 'fr');
      expect(rendered).toContain('écouter');
      expect(rendered).toContain('sur');
    });
  });
});

// =============================================================================
// Code Generator Direct Tests
// =============================================================================

describe('Events Code Generator', () => {
  it('should handle unknown action gracefully', () => {
    const fakeNode: any = {
      action: 'unknown',
      roles: new Map(),
    };
    expect(() => eventsCodeGenerator.generate(fakeNode)).toThrow('Unknown events command: unknown');
  });

  it('should use default values for LISTEN with missing roles', () => {
    const node: any = {
      action: 'listen',
      roles: new Map(),
    };
    const code = eventsCodeGenerator.generate(node);
    expect(code).toBe('on click');
  });

  it('should generate TRIGGER with default event', () => {
    const node: any = {
      action: 'trigger',
      roles: new Map(),
    };
    const code = eventsCodeGenerator.generate(node);
    expect(code).toBe('trigger click');
  });

  it('should generate FILTER with defaults', () => {
    const node: any = {
      action: 'filter',
      roles: new Map(),
    };
    const code = eventsCodeGenerator.generate(node);
    expect(code).toContain('keydown');
    expect(code).toContain('Enter');
  });
});
