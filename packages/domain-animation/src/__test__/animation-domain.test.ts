/**
 * Animation Domain Tests
 *
 * Validates the multilingual Animation DSL across 8 languages (EN, ES, JA, AR, KO, ZH, TR, FR)
 * covering SVO, SOV, and VSO word orders, with compilation assertions,
 * role value verification, renderer round-trips, and edge cases.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createAnimationDSL, renderAnimation } from '../index';
import { animationCodeGenerator } from '../generators/animation-generator';
import type { MultilingualDSL } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

describe('Animation Domain', () => {
  let animation: MultilingualDSL;

  beforeAll(() => {
    animation = createAnimationDSL();
  });

  // ===========================================================================
  // Language Support
  // ===========================================================================

  describe('Language Support', () => {
    it('should support 8 languages', () => {
      const languages = animation.getSupportedLanguages();
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
      expect(() => animation.parse('transition opacity to 0', 'de')).toThrow();
    });
  });

  // ===========================================================================
  // English (SVO)
  // ===========================================================================

  describe('English (SVO)', () => {
    it('should parse TRANSITION', () => {
      const node = animation.parse('transition opacity to 0 over 300ms', 'en');
      expect(node.action).toBe('transition');
      expect(node.roles.has('property')).toBe(true);
      expect(node.roles.has('value')).toBe(true);
    });

    it('should extract correct role values from TRANSITION', () => {
      const node = animation.parse('transition opacity to 0 over 300ms', 'en');
      expect(extractRoleValue(node, 'property')).toBe('opacity');
      expect(extractRoleValue(node, 'value')).toBe('0');
      expect(extractRoleValue(node, 'duration')).toBe('300ms');
    });

    it('should compile TRANSITION to _hyperscript', () => {
      const result = animation.compile('transition opacity to 0 over 300ms', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('transition opacity to 0 over 300ms');
    });

    it('should compile TRANSITION without duration', () => {
      const result = animation.compile('transition opacity to 0', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('transition opacity to 0');
    });

    it('should parse SETTLE', () => {
      const node = animation.parse('settle #modal', 'en');
      expect(node.action).toBe('settle');
      expect(extractRoleValue(node, 'target')).toBe('#modal');
    });

    it('should compile SETTLE to _hyperscript', () => {
      const result = animation.compile('settle #modal', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('settle #modal');
    });

    it('should parse MEASURE', () => {
      const node = animation.parse('measure #box width', 'en');
      expect(node.action).toBe('measure');
      expect(extractRoleValue(node, 'target')).toBe('#box');
      expect(extractRoleValue(node, 'property')).toBe('width');
    });

    it('should compile MEASURE to _hyperscript', () => {
      const result = animation.compile('measure #box width', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('measure #box.offsetWidth');
    });

    it('should parse FADE', () => {
      const node = animation.parse('fade #panel out over 500ms', 'en');
      expect(node.action).toBe('fade');
      expect(extractRoleValue(node, 'target')).toBe('#panel');
      expect(extractRoleValue(node, 'direction')).toBe('out');
      expect(extractRoleValue(node, 'duration')).toBe('500ms');
    });

    it('should compile FADE OUT to _hyperscript', () => {
      const result = animation.compile('fade #panel out over 500ms', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('transition opacity to 0 on #panel over 500ms');
    });

    it('should compile FADE IN to _hyperscript', () => {
      const result = animation.compile('fade #panel in over 500ms', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('transition opacity to 1 on #panel over 500ms');
    });

    it('should parse SLIDE', () => {
      const node = animation.parse('slide #menu down over 200ms', 'en');
      expect(node.action).toBe('slide');
      expect(extractRoleValue(node, 'target')).toBe('#menu');
      expect(extractRoleValue(node, 'direction')).toBe('down');
      expect(extractRoleValue(node, 'duration')).toBe('200ms');
    });

    it('should compile SLIDE DOWN to _hyperscript', () => {
      const result = animation.compile('slide #menu down over 200ms', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('transition transform to translateY(100%) on #menu over 200ms');
    });

    it('should compile SLIDE UP to _hyperscript', () => {
      const result = animation.compile('slide #menu up over 200ms', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('transition transform to translateY(-100%) on #menu over 200ms');
    });

    it('should validate correct command', () => {
      const result = animation.validate('transition opacity to 0 over 300ms', 'en');
      expect(result.valid).toBe(true);
      expect(result.node).toBeDefined();
    });

    it('should reject invalid command', () => {
      const result = animation.validate('invalid command syntax', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  // ===========================================================================
  // Spanish (SVO) — transición opacity a 0 en 300ms
  // ===========================================================================

  describe('Spanish (SVO)', () => {
    it('should parse Spanish TRANSITION', () => {
      const node = animation.parse('transición opacity a 0 en 300ms', 'es');
      expect(node.action).toBe('transition');
      expect(node.roles.has('property')).toBe(true);
      expect(node.roles.has('value')).toBe(true);
    });

    it('should compile Spanish TRANSITION to _hyperscript', () => {
      const result = animation.compile('transición opacity a 0 en 300ms', 'es');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('opacity');
      expect(result.code).toContain('transition');
    });

    it('should parse Spanish SETTLE', () => {
      const node = animation.parse('establecer #modal', 'es');
      expect(node.action).toBe('settle');
    });

    it('should parse Spanish FADE', () => {
      const node = animation.parse('desvanecer #panel out en 500ms', 'es');
      expect(node.action).toBe('fade');
    });
  });

  // ===========================================================================
  // Japanese (SOV) — property value に [duration で] verb
  // ===========================================================================

  describe('Japanese (SOV)', () => {
    it('should parse Japanese TRANSITION (SOV: verb last)', () => {
      const node = animation.parse('opacity 0 に 300ms で 遷移', 'ja');
      expect(node.action).toBe('transition');
      expect(node.roles.has('property')).toBe(true);
      expect(node.roles.has('value')).toBe(true);
    });

    it('should compile Japanese TRANSITION to _hyperscript', () => {
      const result = animation.compile('opacity 0 に 300ms で 遷移', 'ja');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('opacity');
      expect(result.code).toContain('transition');
    });

    it('should parse Japanese TRANSITION without duration', () => {
      const node = animation.parse('opacity 0 に 遷移', 'ja');
      expect(node.action).toBe('transition');
    });

    it('should parse Japanese SETTLE', () => {
      const node = animation.parse('#modal 安定', 'ja');
      expect(node.action).toBe('settle');
    });

    it('should parse Japanese FADE', () => {
      // SOV: target direction [duration で] keyword
      const node = animation.parse('#panel out 500ms で フェード', 'ja');
      expect(node.action).toBe('fade');
    });
  });

  // ===========================================================================
  // Arabic (VSO) — verb property marker value [marker duration]
  // ===========================================================================

  describe('Arabic (VSO)', () => {
    it('should parse Arabic TRANSITION (VSO: verb first)', () => {
      const node = animation.parse('انتقال opacity إلى 0 خلال 300ms', 'ar');
      expect(node.action).toBe('transition');
      expect(node.roles.has('property')).toBe(true);
      expect(node.roles.has('value')).toBe(true);
    });

    it('should compile Arabic TRANSITION to _hyperscript', () => {
      const result = animation.compile('انتقال opacity إلى 0 خلال 300ms', 'ar');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('opacity');
      expect(result.code).toContain('transition');
    });

    it('should parse Arabic SETTLE', () => {
      const node = animation.parse('استقر #modal', 'ar');
      expect(node.action).toBe('settle');
    });
  });

  // ===========================================================================
  // Korean (SOV) — property value 로 [duration 동안] verb
  // ===========================================================================

  describe('Korean (SOV)', () => {
    it('should parse Korean TRANSITION (SOV order)', () => {
      const node = animation.parse('opacity 0 로 300ms 동안 전환', 'ko');
      expect(node.action).toBe('transition');
      expect(node.roles.has('property')).toBe(true);
      expect(node.roles.has('value')).toBe(true);
    });

    it('should compile Korean TRANSITION to _hyperscript', () => {
      const result = animation.compile('opacity 0 로 300ms 동안 전환', 'ko');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('opacity');
      expect(result.code).toContain('transition');
    });

    it('should parse Korean SETTLE', () => {
      const node = animation.parse('#modal 정착', 'ko');
      expect(node.action).toBe('settle');
    });
  });

  // ===========================================================================
  // Chinese (SVO) — verb property marker value [marker duration]
  // ===========================================================================

  describe('Chinese (SVO)', () => {
    it('should parse Chinese TRANSITION', () => {
      const node = animation.parse('过渡 opacity 到 0 经过 300ms', 'zh');
      expect(node.action).toBe('transition');
      expect(node.roles.has('property')).toBe(true);
      expect(node.roles.has('value')).toBe(true);
    });

    it('should compile Chinese TRANSITION to _hyperscript', () => {
      const result = animation.compile('过渡 opacity 到 0 经过 300ms', 'zh');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('opacity');
      expect(result.code).toContain('transition');
    });

    it('should parse Chinese SETTLE', () => {
      const node = animation.parse('稳定 #modal', 'zh');
      expect(node.action).toBe('settle');
    });
  });

  // ===========================================================================
  // Turkish (SOV) — property value ye [duration sürede] verb
  // ===========================================================================

  describe('Turkish (SOV)', () => {
    it('should parse Turkish TRANSITION (SOV order)', () => {
      const node = animation.parse('opacity 0 ye 300ms sürede geçiş', 'tr');
      expect(node.action).toBe('transition');
      expect(node.roles.has('property')).toBe(true);
      expect(node.roles.has('value')).toBe(true);
    });

    it('should compile Turkish TRANSITION to _hyperscript', () => {
      const result = animation.compile('opacity 0 ye 300ms sürede geçiş', 'tr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('opacity');
      expect(result.code).toContain('transition');
    });

    it('should parse Turkish SETTLE', () => {
      const node = animation.parse('#modal yerleş', 'tr');
      expect(node.action).toBe('settle');
    });
  });

  // ===========================================================================
  // French (SVO) — verb property marker value [marker duration]
  // ===========================================================================

  describe('French (SVO)', () => {
    it('should parse French TRANSITION', () => {
      const node = animation.parse('transition opacity à 0 en 300ms', 'fr');
      expect(node.action).toBe('transition');
      expect(node.roles.has('property')).toBe(true);
      expect(node.roles.has('value')).toBe(true);
    });

    it('should compile French TRANSITION to _hyperscript', () => {
      const result = animation.compile('transition opacity à 0 en 300ms', 'fr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('opacity');
      expect(result.code).toContain('transition');
    });

    it('should parse French SETTLE', () => {
      const node = animation.parse('stabiliser #modal', 'fr');
      expect(node.action).toBe('settle');
    });
  });

  // ===========================================================================
  // Cross-Language Semantic Equivalence
  // ===========================================================================

  describe('Semantic Equivalence', () => {
    it('should parse TRANSITION across all 8 languages to same action', () => {
      const nodes = [
        animation.parse('transition opacity to 0 over 300ms', 'en'),
        animation.parse('transición opacity a 0 en 300ms', 'es'),
        animation.parse('opacity 0 に 300ms で 遷移', 'ja'),
        animation.parse('انتقال opacity إلى 0 خلال 300ms', 'ar'),
        animation.parse('opacity 0 로 300ms 동안 전환', 'ko'),
        animation.parse('过渡 opacity 到 0 经过 300ms', 'zh'),
        animation.parse('opacity 0 ye 300ms sürede geçiş', 'tr'),
        animation.parse('transition opacity à 0 en 300ms', 'fr'),
      ];
      for (const node of nodes) {
        expect(node.action).toBe('transition');
        expect(node.roles.has('property')).toBe(true);
        expect(node.roles.has('value')).toBe(true);
      }
    });

    it('should compile SETTLE to same output across languages', () => {
      const inputs = [
        { text: 'settle #modal', lang: 'en' },
        { text: 'establecer #modal', lang: 'es' },
        { text: '#modal 安定', lang: 'ja' },
        { text: 'استقر #modal', lang: 'ar' },
        { text: '#modal 정착', lang: 'ko' },
        { text: '稳定 #modal', lang: 'zh' },
        { text: '#modal yerleş', lang: 'tr' },
        { text: 'stabiliser #modal', lang: 'fr' },
      ];
      for (const { text, lang } of inputs) {
        const result = animation.compile(text, lang);
        expect(result.ok).toBe(true);
        expect(result.code).toBe('settle #modal');
      }
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle empty input', () => {
      expect(() => animation.parse('', 'en')).toThrow();
    });

    it('should handle whitespace-only input', () => {
      expect(() => animation.parse('   ', 'en')).toThrow();
    });

    it('should provide error info for unrecognized input', () => {
      const result = animation.validate('xyzzy foobar', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});

// =============================================================================
// Natural Language Renderer
// =============================================================================

describe('Animation Renderer', () => {
  let animation: MultilingualDSL;

  beforeAll(() => {
    animation = createAnimationDSL();
  });

  describe('English Rendering', () => {
    it('should render TRANSITION to English', () => {
      const node = animation.parse('transition opacity to 0 over 300ms', 'en');
      const rendered = renderAnimation(node, 'en');
      expect(rendered).toContain('transition');
      expect(rendered).toContain('opacity');
      expect(rendered).toContain('to');
      expect(rendered).toContain('0');
      expect(rendered).toContain('over');
      expect(rendered).toContain('300ms');
    });

    it('should render SETTLE to English', () => {
      const node = animation.parse('settle #modal', 'en');
      const rendered = renderAnimation(node, 'en');
      expect(rendered).toContain('settle');
      expect(rendered).toContain('#modal');
    });

    it('should render MEASURE to English', () => {
      const node = animation.parse('measure #box width', 'en');
      const rendered = renderAnimation(node, 'en');
      expect(rendered).toContain('measure');
      expect(rendered).toContain('#box');
      expect(rendered).toContain('width');
    });

    it('should render FADE to English', () => {
      const node = animation.parse('fade #panel out over 500ms', 'en');
      const rendered = renderAnimation(node, 'en');
      expect(rendered).toContain('fade');
      expect(rendered).toContain('#panel');
      expect(rendered).toContain('out');
      expect(rendered).toContain('over');
      expect(rendered).toContain('500ms');
    });

    it('should render SLIDE to English', () => {
      const node = animation.parse('slide #menu down over 200ms', 'en');
      const rendered = renderAnimation(node, 'en');
      expect(rendered).toContain('slide');
      expect(rendered).toContain('#menu');
      expect(rendered).toContain('down');
      expect(rendered).toContain('over');
      expect(rendered).toContain('200ms');
    });
  });

  describe('Cross-Language Rendering', () => {
    it('should render TRANSITION to Japanese (SOV word order)', () => {
      const node = animation.parse('transition opacity to 0 over 300ms', 'en');
      const rendered = renderAnimation(node, 'ja');
      expect(rendered).toContain('遷移');
      expect(rendered).toContain('に');
      // SOV: verb should come last
      const keywordIdx = rendered.indexOf('遷移');
      const markerIdx = rendered.indexOf('に');
      expect(markerIdx).toBeLessThan(keywordIdx);
    });

    it('should render TRANSITION to Spanish', () => {
      const node = animation.parse('transition opacity to 0', 'en');
      const rendered = renderAnimation(node, 'es');
      expect(rendered).toContain('transición');
      expect(rendered).toContain('a');
    });

    it('should render TRANSITION to Arabic', () => {
      const node = animation.parse('transition opacity to 0', 'en');
      const rendered = renderAnimation(node, 'ar');
      expect(rendered).toContain('انتقال');
      expect(rendered).toContain('إلى');
    });

    it('should render TRANSITION to Korean (SOV word order)', () => {
      const node = animation.parse('transition opacity to 0', 'en');
      const rendered = renderAnimation(node, 'ko');
      expect(rendered).toContain('전환');
      expect(rendered).toContain('로');
    });

    it('should render TRANSITION to Chinese', () => {
      const node = animation.parse('transition opacity to 0', 'en');
      const rendered = renderAnimation(node, 'zh');
      expect(rendered).toContain('过渡');
      expect(rendered).toContain('到');
    });

    it('should render TRANSITION to Turkish (SOV word order)', () => {
      const node = animation.parse('transition opacity to 0', 'en');
      const rendered = renderAnimation(node, 'tr');
      expect(rendered).toContain('geçiş');
      expect(rendered).toContain('ye');
    });

    it('should render TRANSITION to French', () => {
      const node = animation.parse('transition opacity to 0', 'en');
      const rendered = renderAnimation(node, 'fr');
      expect(rendered).toContain('transition');
      expect(rendered).toContain('à');
    });

    it('should render SETTLE to Japanese (SOV)', () => {
      const node = animation.parse('settle #modal', 'en');
      const rendered = renderAnimation(node, 'ja');
      expect(rendered).toContain('安定');
      expect(rendered).toContain('#modal');
      // SOV: verb last
      const keywordIdx = rendered.indexOf('安定');
      const targetIdx = rendered.indexOf('#modal');
      expect(targetIdx).toBeLessThan(keywordIdx);
    });

    it('should render FADE to Korean (SOV)', () => {
      const node = animation.parse('fade #panel out over 500ms', 'en');
      const rendered = renderAnimation(node, 'ko');
      expect(rendered).toContain('페이드');
      expect(rendered).toContain('#panel');
    });
  });
});

// =============================================================================
// Code Generator Direct Tests
// =============================================================================

describe('Animation Code Generator', () => {
  it('should handle unknown action gracefully', () => {
    const fakeNode: any = {
      action: 'unknown',
      roles: new Map(),
    };
    expect(() => animationCodeGenerator.generate(fakeNode)).toThrow('Unknown animation command: unknown');
  });

  it('should use default values for TRANSITION with missing roles', () => {
    const node: any = {
      action: 'transition',
      roles: new Map(),
    };
    const code = animationCodeGenerator.generate(node);
    expect(code).toBe('transition opacity to 0');
  });

  it('should generate SETTLE with default target', () => {
    const node: any = {
      action: 'settle',
      roles: new Map(),
    };
    const code = animationCodeGenerator.generate(node);
    expect(code).toBe('settle me');
  });

  it('should generate MEASURE with defaults', () => {
    const node: any = {
      action: 'measure',
      roles: new Map(),
    };
    const code = animationCodeGenerator.generate(node);
    expect(code).toContain('#box');
    expect(code).toContain('offsetWidth');
  });

  it('should generate FADE with default direction (out)', () => {
    const node: any = {
      action: 'fade',
      roles: new Map(),
    };
    const code = animationCodeGenerator.generate(node);
    expect(code).toContain('opacity to 0');
    expect(code).toContain('#panel');
  });

  it('should generate SLIDE with default direction (down)', () => {
    const node: any = {
      action: 'slide',
      roles: new Map(),
    };
    const code = animationCodeGenerator.generate(node);
    expect(code).toContain('translateY(100%)');
    expect(code).toContain('#menu');
  });

  it('should generate SLIDE LEFT', () => {
    const node: any = {
      action: 'slide',
      roles: new Map([['direction', { value: 'left' }]]),
    };
    const code = animationCodeGenerator.generate(node);
    expect(code).toContain('translateX(-100%)');
  });

  it('should generate SLIDE RIGHT', () => {
    const node: any = {
      action: 'slide',
      roles: new Map([['direction', { value: 'right' }]]),
    };
    const code = animationCodeGenerator.generate(node);
    expect(code).toContain('translateX(100%)');
  });

  it('should map measure property height to offsetHeight', () => {
    const node: any = {
      action: 'measure',
      roles: new Map([
        ['target', { value: '#box' }],
        ['property', { value: 'height' }],
      ]),
    };
    const code = animationCodeGenerator.generate(node);
    expect(code).toBe('measure #box.offsetHeight');
  });
});
