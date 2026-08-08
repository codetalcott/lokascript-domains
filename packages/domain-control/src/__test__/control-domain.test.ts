/**
 * Control Flow Domain Tests
 *
 * Validates the multilingual Control Flow DSL across 8 languages (EN, ES, JA, AR, KO, ZH, TR, FR)
 * covering SVO, SOV, and VSO word orders, with compilation assertions,
 * role value verification, renderer round-trips, and edge cases.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createControlDSL, renderControl } from '../index';
import { controlCodeGenerator } from '../generators/control-generator';
import type { MultilingualDSL } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

describe('Control Flow Domain', () => {
  let control: MultilingualDSL;

  beforeAll(() => {
    control = createControlDSL();
  });

  // ===========================================================================
  // Language Support
  // ===========================================================================

  describe('Language Support', () => {
    it('should support 8 languages', () => {
      const languages = control.getSupportedLanguages();
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
      expect(() => control.parse('check #input is empty', 'de')).toThrow();
    });
  });

  // ===========================================================================
  // English (SVO) — all 5 verbs
  // ===========================================================================

  describe('English (SVO)', () => {
    // CHECK
    it('should parse CHECK', () => {
      const node = control.parse('check #input is empty', 'en');
      expect(node.action).toBe('check');
      expect(node.roles.has('condition')).toBe(true);
    });

    it('should extract correct role values from CHECK', () => {
      const node = control.parse('check #input is empty', 'en');
      const condition = extractRoleValue(node, 'condition');
      expect(condition).toContain('#input');
      expect(condition).toContain('is');
      expect(condition).toContain('empty');
    });

    it('should compile CHECK to _hyperscript', () => {
      const result = control.compile('check #input is empty', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('if');
      expect(result.code).toContain('then');
      expect(result.code).toContain('end');
    });

    // REPEAT
    it('should parse REPEAT', () => {
      const node = control.parse('repeat 5 times', 'en');
      expect(node.action).toBe('repeat');
      expect(node.roles.has('count')).toBe(true);
    });

    it('should extract correct role values from REPEAT', () => {
      const node = control.parse('repeat 5 times', 'en');
      const count = extractRoleValue(node, 'count');
      expect(count).toBe('5');
    });

    it('should compile REPEAT to _hyperscript', () => {
      const result = control.compile('repeat 5 times', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
      expect(result.code).toContain('5');
      expect(result.code).toContain('times');
    });

    it('should handle large repeat counts', () => {
      const node = control.parse('repeat 20 times', 'en');
      expect(node.action).toBe('repeat');
      expect(extractRoleValue(node, 'count')).toBe('20');
    });

    // ITERATE
    it('should parse ITERATE', () => {
      const node = control.parse('iterate .items as item', 'en');
      expect(node.action).toBe('iterate');
      expect(node.roles.has('collection')).toBe(true);
      expect(node.roles.has('variable')).toBe(true);
    });

    it('should extract correct role values from ITERATE', () => {
      const node = control.parse('iterate .items as item', 'en');
      expect(extractRoleValue(node, 'collection')).toBe('.items');
      expect(extractRoleValue(node, 'variable')).toBe('item');
    });

    it('should compile ITERATE to _hyperscript', () => {
      const result = control.compile('iterate .items as item', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat for');
      expect(result.code).toContain('item');
      expect(result.code).toContain('.items');
    });

    it('should parse ITERATE with id selector', () => {
      const node = control.parse('iterate #list as el', 'en');
      expect(node.action).toBe('iterate');
      expect(extractRoleValue(node, 'collection')).toBe('#list');
      expect(extractRoleValue(node, 'variable')).toBe('el');
    });

    // GUARD
    it('should parse GUARD', () => {
      const node = control.parse('guard #form is valid', 'en');
      expect(node.action).toBe('guard');
      expect(node.roles.has('condition')).toBe(true);
    });

    it('should extract correct role values from GUARD', () => {
      const node = control.parse('guard #form is valid', 'en');
      const condition = extractRoleValue(node, 'condition');
      expect(condition).toContain('#form');
    });

    it('should compile GUARD to _hyperscript', () => {
      const result = control.compile('guard #form is valid', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('if');
      expect(result.code).toContain('return');
      expect(result.code).toContain('end');
    });

    // LOOP while
    it('should parse LOOP with while', () => {
      const node = control.parse('loop while #spinner is visible', 'en');
      expect(node.action).toBe('loop');
      expect(node.roles.has('condition')).toBe(true);
      expect(node.roles.has('mode')).toBe(true);
    });

    it('should extract correct role values from LOOP while', () => {
      const node = control.parse('loop while #spinner is visible', 'en');
      const mode = extractRoleValue(node, 'mode');
      expect(mode).toBe('while');
    });

    it('should compile LOOP while to _hyperscript', () => {
      const result = control.compile('loop while #spinner is visible', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
      expect(result.code).toContain('while');
    });

    // LOOP until
    it('should parse LOOP with until', () => {
      const node = control.parse('loop until #done is true', 'en');
      expect(node.action).toBe('loop');
    });

    it('should extract mode as until from LOOP until', () => {
      const node = control.parse('loop until #done is true', 'en');
      const mode = extractRoleValue(node, 'mode');
      expect(mode).toBe('until');
    });

    it('should compile LOOP until to _hyperscript', () => {
      const result = control.compile('loop until #done is true', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
      expect(result.code).toContain('until');
    });

    // Validation
    it('should validate correct command', () => {
      const result = control.validate('check #input is empty', 'en');
      expect(result.valid).toBe(true);
      expect(result.node).toBeDefined();
    });

    it('should reject invalid command', () => {
      const result = control.validate('invalid command syntax', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  // ===========================================================================
  // Spanish (SVO) — all 5 verbs
  // ===========================================================================

  describe('Spanish (SVO)', () => {
    it('should parse Spanish CHECK', () => {
      const node = control.parse('verificar #input is empty', 'es');
      expect(node.action).toBe('check');
      expect(node.roles.has('condition')).toBe(true);
    });

    it('should compile Spanish CHECK to _hyperscript', () => {
      const result = control.compile('verificar #input is empty', 'es');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('if');
    });

    it('should parse Spanish REPEAT', () => {
      const node = control.parse('repetir 5 veces', 'es');
      expect(node.action).toBe('repeat');
      expect(extractRoleValue(node, 'count')).toBe('5');
    });

    it('should compile Spanish REPEAT to _hyperscript', () => {
      const result = control.compile('repetir 5 veces', 'es');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
      expect(result.code).toContain('5');
    });

    it('should parse Spanish ITERATE', () => {
      const node = control.parse('iterar .items como item', 'es');
      expect(node.action).toBe('iterate');
      expect(extractRoleValue(node, 'collection')).toBe('.items');
      expect(extractRoleValue(node, 'variable')).toBe('item');
    });

    it('should compile Spanish ITERATE to _hyperscript', () => {
      const result = control.compile('iterar .items como item', 'es');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat for');
    });

    it('should parse Spanish GUARD', () => {
      const node = control.parse('proteger #form is valid', 'es');
      expect(node.action).toBe('guard');
    });

    it('should parse Spanish LOOP while', () => {
      const node = control.parse('bucle mientras #spinner is visible', 'es');
      expect(node.action).toBe('loop');
      expect(extractRoleValue(node, 'mode')).toBe('while');
    });

    it('should parse Spanish LOOP until', () => {
      const node = control.parse('bucle hasta #done is true', 'es');
      expect(node.action).toBe('loop');
      expect(extractRoleValue(node, 'mode')).toBe('until');
    });
  });

  // ===========================================================================
  // Japanese (SOV) — all 5 verbs
  // ===========================================================================

  describe('Japanese (SOV)', () => {
    it('should parse Japanese CHECK (SOV: verb last)', () => {
      const node = control.parse('#input is empty 確認', 'ja');
      expect(node.action).toBe('check');
      expect(node.roles.has('condition')).toBe(true);
    });

    it('should compile Japanese CHECK to _hyperscript', () => {
      const result = control.compile('#input is empty 確認', 'ja');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('if');
    });

    it('should parse Japanese REPEAT', () => {
      const node = control.parse('5 回 繰り返す', 'ja');
      expect(node.action).toBe('repeat');
      expect(extractRoleValue(node, 'count')).toBe('5');
    });

    it('should compile Japanese REPEAT to _hyperscript', () => {
      const result = control.compile('5 回 繰り返す', 'ja');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
      expect(result.code).toContain('5');
    });

    it('should parse Japanese ITERATE', () => {
      const node = control.parse('.items として item 反復', 'ja');
      expect(node.action).toBe('iterate');
      expect(extractRoleValue(node, 'collection')).toBe('.items');
      expect(extractRoleValue(node, 'variable')).toBe('item');
    });

    it('should compile Japanese ITERATE to _hyperscript', () => {
      const result = control.compile('.items として item 反復', 'ja');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat for');
    });

    it('should parse Japanese GUARD', () => {
      const node = control.parse('#form 守る', 'ja');
      expect(node.action).toBe('guard');
    });

    it('should parse Japanese LOOP while', () => {
      const node = control.parse('#spinner is visible 間 ループ', 'ja');
      expect(node.action).toBe('loop');
      expect(extractRoleValue(node, 'mode')).toBe('while');
    });
  });

  // ===========================================================================
  // Arabic (VSO) — all 5 verbs
  // ===========================================================================

  describe('Arabic (VSO)', () => {
    it('should parse Arabic CHECK (VSO: verb first)', () => {
      const node = control.parse('تحقق #input is empty', 'ar');
      expect(node.action).toBe('check');
      expect(node.roles.has('condition')).toBe(true);
    });

    it('should compile Arabic CHECK to _hyperscript', () => {
      const result = control.compile('تحقق #input is empty', 'ar');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('if');
    });

    it('should parse Arabic REPEAT', () => {
      const node = control.parse('كرر 5 مرات', 'ar');
      expect(node.action).toBe('repeat');
      expect(extractRoleValue(node, 'count')).toBe('5');
    });

    it('should compile Arabic REPEAT to _hyperscript', () => {
      const result = control.compile('كرر 5 مرات', 'ar');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
      expect(result.code).toContain('5');
    });

    it('should parse Arabic ITERATE', () => {
      const node = control.parse('عدّد .items كـ item', 'ar');
      expect(node.action).toBe('iterate');
    });

    it('should parse Arabic GUARD', () => {
      const node = control.parse('احمِ #form is valid', 'ar');
      expect(node.action).toBe('guard');
    });

    it('should parse Arabic LOOP while', () => {
      const node = control.parse('حلقة بينما #spinner is visible', 'ar');
      expect(node.action).toBe('loop');
      expect(extractRoleValue(node, 'mode')).toBe('while');
    });

    it('should parse Arabic LOOP until', () => {
      const node = control.parse('حلقة حتى #done is true', 'ar');
      expect(node.action).toBe('loop');
      expect(extractRoleValue(node, 'mode')).toBe('until');
    });
  });

  // ===========================================================================
  // Korean (SOV) — all 5 verbs
  // ===========================================================================

  describe('Korean (SOV)', () => {
    it('should parse Korean CHECK (SOV order)', () => {
      const node = control.parse('#input is empty 확인', 'ko');
      expect(node.action).toBe('check');
      expect(node.roles.has('condition')).toBe(true);
    });

    it('should compile Korean CHECK to _hyperscript', () => {
      const result = control.compile('#input is empty 확인', 'ko');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('if');
    });

    it('should parse Korean REPEAT', () => {
      const node = control.parse('5 번 반복', 'ko');
      expect(node.action).toBe('repeat');
      expect(extractRoleValue(node, 'count')).toBe('5');
    });

    it('should compile Korean REPEAT to _hyperscript', () => {
      const result = control.compile('5 번 반복', 'ko');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
    });

    it('should parse Korean ITERATE', () => {
      const node = control.parse('.items 로 item 반복하기', 'ko');
      expect(node.action).toBe('iterate');
    });

    it('should parse Korean GUARD', () => {
      const node = control.parse('#form 보호', 'ko');
      expect(node.action).toBe('guard');
    });

    it('should parse Korean LOOP while', () => {
      const node = control.parse('#spinner is visible 동안 루프', 'ko');
      expect(node.action).toBe('loop');
      expect(extractRoleValue(node, 'mode')).toBe('while');
    });
  });

  // ===========================================================================
  // Chinese (SVO) — all 5 verbs
  // ===========================================================================

  describe('Chinese (SVO)', () => {
    it('should parse Chinese CHECK', () => {
      const node = control.parse('检查 #input is empty', 'zh');
      expect(node.action).toBe('check');
      expect(node.roles.has('condition')).toBe(true);
    });

    it('should compile Chinese CHECK to _hyperscript', () => {
      const result = control.compile('检查 #input is empty', 'zh');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('if');
    });

    it('should parse Chinese REPEAT', () => {
      const node = control.parse('重复 5 次', 'zh');
      expect(node.action).toBe('repeat');
      expect(extractRoleValue(node, 'count')).toBe('5');
    });

    it('should compile Chinese REPEAT to _hyperscript', () => {
      const result = control.compile('重复 5 次', 'zh');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
    });

    it('should parse Chinese ITERATE', () => {
      const node = control.parse('遍历 .items 作为 item', 'zh');
      expect(node.action).toBe('iterate');
    });

    it('should parse Chinese GUARD', () => {
      const node = control.parse('守卫 #form is valid', 'zh');
      expect(node.action).toBe('guard');
    });

    it('should parse Chinese LOOP while', () => {
      const node = control.parse('循环 当 #spinner is visible', 'zh');
      expect(node.action).toBe('loop');
      expect(extractRoleValue(node, 'mode')).toBe('while');
    });

    it('should parse Chinese LOOP until', () => {
      const node = control.parse('循环 直到 #done is true', 'zh');
      expect(node.action).toBe('loop');
      expect(extractRoleValue(node, 'mode')).toBe('until');
    });
  });

  // ===========================================================================
  // Turkish (SOV) — all 5 verbs
  // ===========================================================================

  describe('Turkish (SOV)', () => {
    it('should parse Turkish CHECK (SOV order)', () => {
      const node = control.parse('#input is empty kontrol', 'tr');
      expect(node.action).toBe('check');
      expect(node.roles.has('condition')).toBe(true);
    });

    it('should compile Turkish CHECK to _hyperscript', () => {
      const result = control.compile('#input is empty kontrol', 'tr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('if');
    });

    it('should parse Turkish REPEAT', () => {
      const node = control.parse('5 kez tekrarla', 'tr');
      expect(node.action).toBe('repeat');
      expect(extractRoleValue(node, 'count')).toBe('5');
    });

    it('should compile Turkish REPEAT to _hyperscript', () => {
      const result = control.compile('5 kez tekrarla', 'tr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
    });

    it('should parse Turkish ITERATE', () => {
      const node = control.parse('.items olarak item yinele', 'tr');
      expect(node.action).toBe('iterate');
    });

    it('should parse Turkish GUARD', () => {
      const node = control.parse('#form koru', 'tr');
      expect(node.action).toBe('guard');
    });

    it('should parse Turkish LOOP while', () => {
      const node = control.parse('#spinner is visible iken döngü', 'tr');
      expect(node.action).toBe('loop');
      expect(extractRoleValue(node, 'mode')).toBe('while');
    });
  });

  // ===========================================================================
  // French (SVO) — all 5 verbs
  // ===========================================================================

  describe('French (SVO)', () => {
    it('should parse French CHECK', () => {
      const node = control.parse('vérifier #input is empty', 'fr');
      expect(node.action).toBe('check');
      expect(node.roles.has('condition')).toBe(true);
    });

    it('should compile French CHECK to _hyperscript', () => {
      const result = control.compile('vérifier #input is empty', 'fr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('if');
    });

    it('should parse French REPEAT', () => {
      const node = control.parse('répéter 5 fois', 'fr');
      expect(node.action).toBe('repeat');
      expect(extractRoleValue(node, 'count')).toBe('5');
    });

    it('should compile French REPEAT to _hyperscript', () => {
      const result = control.compile('répéter 5 fois', 'fr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
    });

    it('should parse French ITERATE', () => {
      const node = control.parse('itérer .items comme item', 'fr');
      expect(node.action).toBe('iterate');
    });

    it('should parse French GUARD', () => {
      const node = control.parse('garder #form is valid', 'fr');
      expect(node.action).toBe('guard');
    });

    it('should parse French LOOP while', () => {
      const result = control.compile('boucle pendant #spinner is visible', 'fr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('repeat');
      expect(result.code).toContain('while');
    });
  });

  // ===========================================================================
  // Cross-Language Semantic Equivalence
  // ===========================================================================

  describe('Semantic Equivalence', () => {
    it('should parse CHECK across all 8 languages to same action', () => {
      const nodes = [
        control.parse('check #input is empty', 'en'),
        control.parse('verificar #input is empty', 'es'),
        control.parse('#input is empty 確認', 'ja'),
        control.parse('تحقق #input is empty', 'ar'),
        control.parse('#input is empty 확인', 'ko'),
        control.parse('检查 #input is empty', 'zh'),
        control.parse('#input is empty kontrol', 'tr'),
        control.parse('vérifier #input is empty', 'fr'),
      ];
      for (const node of nodes) {
        expect(node.action).toBe('check');
        expect(node.roles.has('condition')).toBe(true);
      }
    });

    it('should parse REPEAT across all 8 languages to same action', () => {
      const nodes = [
        control.parse('repeat 5 times', 'en'),
        control.parse('repetir 5 veces', 'es'),
        control.parse('5 回 繰り返す', 'ja'),
        control.parse('كرر 5 مرات', 'ar'),
        control.parse('5 번 반복', 'ko'),
        control.parse('重复 5 次', 'zh'),
        control.parse('5 kez tekrarla', 'tr'),
        control.parse('répéter 5 fois', 'fr'),
      ];
      for (const node of nodes) {
        expect(node.action).toBe('repeat');
        expect(node.roles.has('count')).toBe(true);
      }
    });

    it('should compile all REPEAT variants to same _hyperscript output', () => {
      const inputs: [string, string][] = [
        ['repeat 5 times', 'en'],
        ['repetir 5 veces', 'es'],
        ['5 回 繰り返す', 'ja'],
        ['كرر 5 مرات', 'ar'],
        ['5 번 반복', 'ko'],
        ['重复 5 次', 'zh'],
        ['5 kez tekrarla', 'tr'],
        ['répéter 5 fois', 'fr'],
      ];
      for (const [input, lang] of inputs) {
        const result = control.compile(input, lang);
        expect(result.ok).toBe(true);
        expect(result.code).toContain('repeat');
        expect(result.code).toContain('5');
        expect(result.code).toContain('times');
      }
    });

    it('should parse ITERATE across SVO languages', () => {
      const nodes = [
        control.parse('iterate .items as item', 'en'),
        control.parse('iterar .items como item', 'es'),
        control.parse('遍历 .items 作为 item', 'zh'),
        control.parse('itérer .items comme item', 'fr'),
      ];
      for (const node of nodes) {
        expect(node.action).toBe('iterate');
        expect(extractRoleValue(node, 'collection')).toBe('.items');
        expect(extractRoleValue(node, 'variable')).toBe('item');
      }
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle empty input', () => {
      expect(() => control.parse('', 'en')).toThrow();
    });

    it('should handle whitespace-only input', () => {
      expect(() => control.parse('   ', 'en')).toThrow();
    });

    it('should provide error info for unrecognized input', () => {
      const result = control.validate('xyzzy foobar', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should validate ITERATE with missing variable', () => {
      // "iterate .items" without "as item" - may still parse with partial match
      const result = control.validate('iterate .items', 'en');
      // Whether valid or not, it should not crash
      expect(typeof result.valid).toBe('boolean');
    });
  });
});

// =============================================================================
// Natural Language Renderer
// =============================================================================

describe('Control Flow Renderer', () => {
  let control: MultilingualDSL;

  beforeAll(() => {
    control = createControlDSL();
  });

  describe('English Rendering', () => {
    it('should render CHECK to English', () => {
      const node = control.parse('check #input is empty', 'en');
      const rendered = renderControl(node, 'en');
      expect(rendered).toContain('check');
      expect(rendered).toContain('#input');
    });

    it('should render REPEAT to English', () => {
      const node = control.parse('repeat 5 times', 'en');
      const rendered = renderControl(node, 'en');
      expect(rendered).toContain('repeat');
      expect(rendered).toContain('5');
      expect(rendered).toContain('times');
    });

    it('should render ITERATE to English', () => {
      const node = control.parse('iterate .items as item', 'en');
      const rendered = renderControl(node, 'en');
      expect(rendered).toContain('iterate');
      expect(rendered).toContain('.items');
      expect(rendered).toContain('as');
      expect(rendered).toContain('item');
    });

    it('should render GUARD to English', () => {
      const node = control.parse('guard #form is valid', 'en');
      const rendered = renderControl(node, 'en');
      expect(rendered).toContain('guard');
      expect(rendered).toContain('#form');
    });

    it('should render LOOP while to English', () => {
      const node = control.parse('loop while #spinner is visible', 'en');
      const rendered = renderControl(node, 'en');
      expect(rendered).toContain('loop');
      expect(rendered).toContain('while');
    });

    it('should render LOOP until to English', () => {
      const node = control.parse('loop until #done is true', 'en');
      const rendered = renderControl(node, 'en');
      expect(rendered).toContain('loop');
      expect(rendered).toContain('until');
    });
  });

  describe('Cross-Language Rendering', () => {
    // CHECK across all languages
    it('should render CHECK to Japanese (SOV word order)', () => {
      const node = control.parse('check #input is empty', 'en');
      const rendered = renderControl(node, 'ja');
      expect(rendered).toContain('確認');
      // SOV: verb should come last
      const keywordIdx = rendered.indexOf('確認');
      expect(keywordIdx).toBeGreaterThan(0);
    });

    it('should render CHECK to Spanish', () => {
      const node = control.parse('check #input is empty', 'en');
      const rendered = renderControl(node, 'es');
      expect(rendered).toContain('verificar');
    });

    it('should render CHECK to Arabic', () => {
      const node = control.parse('check #input is empty', 'en');
      const rendered = renderControl(node, 'ar');
      expect(rendered).toContain('تحقق');
    });

    it('should render CHECK to Korean (SOV word order)', () => {
      const node = control.parse('check #input is empty', 'en');
      const rendered = renderControl(node, 'ko');
      expect(rendered).toContain('확인');
    });

    it('should render CHECK to Chinese', () => {
      const node = control.parse('check #input is empty', 'en');
      const rendered = renderControl(node, 'zh');
      expect(rendered).toContain('检查');
    });

    it('should render CHECK to Turkish (SOV word order)', () => {
      const node = control.parse('check #input is empty', 'en');
      const rendered = renderControl(node, 'tr');
      expect(rendered).toContain('kontrol');
    });

    it('should render CHECK to French', () => {
      const node = control.parse('check #input is empty', 'en');
      const rendered = renderControl(node, 'fr');
      expect(rendered).toContain('vérifier');
    });

    // REPEAT across all languages
    it('should render REPEAT to Japanese (SOV)', () => {
      const node = control.parse('repeat 5 times', 'en');
      const rendered = renderControl(node, 'ja');
      expect(rendered).toContain('繰り返す');
      expect(rendered).toContain('回');
    });

    it('should render REPEAT to Spanish', () => {
      const node = control.parse('repeat 5 times', 'en');
      const rendered = renderControl(node, 'es');
      expect(rendered).toContain('repetir');
      expect(rendered).toContain('veces');
    });

    it('should render REPEAT to Arabic', () => {
      const node = control.parse('repeat 5 times', 'en');
      const rendered = renderControl(node, 'ar');
      expect(rendered).toContain('كرر');
      expect(rendered).toContain('مرات');
    });

    it('should render REPEAT to Korean (SOV)', () => {
      const node = control.parse('repeat 5 times', 'en');
      const rendered = renderControl(node, 'ko');
      expect(rendered).toContain('반복');
      expect(rendered).toContain('번');
    });

    it('should render REPEAT to Chinese', () => {
      const node = control.parse('repeat 5 times', 'en');
      const rendered = renderControl(node, 'zh');
      expect(rendered).toContain('重复');
      expect(rendered).toContain('次');
    });

    it('should render REPEAT to Turkish (SOV)', () => {
      const node = control.parse('repeat 5 times', 'en');
      const rendered = renderControl(node, 'tr');
      expect(rendered).toContain('tekrarla');
      expect(rendered).toContain('kez');
    });

    it('should render REPEAT to French', () => {
      const node = control.parse('repeat 5 times', 'en');
      const rendered = renderControl(node, 'fr');
      expect(rendered).toContain('répéter');
      expect(rendered).toContain('fois');
    });

    // ITERATE across languages
    it('should render ITERATE to Korean (SOV)', () => {
      const node = control.parse('iterate .items as item', 'en');
      const rendered = renderControl(node, 'ko');
      expect(rendered).toContain('반복하기');
      expect(rendered).toContain('로');
    });

    it('should render ITERATE to Japanese (SOV)', () => {
      const node = control.parse('iterate .items as item', 'en');
      const rendered = renderControl(node, 'ja');
      expect(rendered).toContain('反復');
      expect(rendered).toContain('として');
    });

    it('should render ITERATE to Chinese', () => {
      const node = control.parse('iterate .items as item', 'en');
      const rendered = renderControl(node, 'zh');
      expect(rendered).toContain('遍历');
      expect(rendered).toContain('作为');
    });

    // LOOP across languages
    it('should render LOOP to French', () => {
      const node = control.parse('loop while #spinner is visible', 'en');
      const rendered = renderControl(node, 'fr');
      expect(rendered).toContain('boucle');
      expect(rendered).toContain('pendant');
    });

    it('should render LOOP to Spanish', () => {
      const node = control.parse('loop while #spinner is visible', 'en');
      const rendered = renderControl(node, 'es');
      expect(rendered).toContain('bucle');
      expect(rendered).toContain('mientras');
    });

    it('should render LOOP until to Arabic', () => {
      const node = control.parse('loop until #done is true', 'en');
      const rendered = renderControl(node, 'ar');
      expect(rendered).toContain('حلقة');
      expect(rendered).toContain('حتى');
    });

    // GUARD across languages
    it('should render GUARD to Turkish (SOV)', () => {
      const node = control.parse('guard #form is valid', 'en');
      const rendered = renderControl(node, 'tr');
      expect(rendered).toContain('koru');
    });

    it('should render GUARD to Chinese', () => {
      const node = control.parse('guard #form is valid', 'en');
      const rendered = renderControl(node, 'zh');
      expect(rendered).toContain('守卫');
    });
  });
});

// =============================================================================
// Code Generator Direct Tests
// =============================================================================

describe('Control Flow Code Generator', () => {
  it('should handle unknown action gracefully', () => {
    const fakeNode: any = {
      action: 'unknown',
      roles: new Map(),
    };
    expect(() => controlCodeGenerator.generate(fakeNode)).toThrow('Unknown control command: unknown');
  });

  it('should use default values for CHECK with missing roles', () => {
    const node: any = {
      action: 'check',
      roles: new Map(),
    };
    const code = controlCodeGenerator.generate(node);
    expect(code).toBe('if #input is empty then ... end');
  });

  it('should generate REPEAT with default count', () => {
    const node: any = {
      action: 'repeat',
      roles: new Map(),
    };
    const code = controlCodeGenerator.generate(node);
    expect(code).toBe('repeat 5 times ... end');
  });

  it('should generate REPEAT with specific count', () => {
    const node: any = {
      action: 'repeat',
      roles: new Map([['count', { type: 'literal', value: 10 }]]),
    };
    const code = controlCodeGenerator.generate(node);
    expect(code).toContain('repeat');
    expect(code).toContain('10');
    expect(code).toContain('times');
  });

  it('should generate ITERATE with defaults', () => {
    const node: any = {
      action: 'iterate',
      roles: new Map(),
    };
    const code = controlCodeGenerator.generate(node);
    expect(code).toContain('repeat for');
    expect(code).toContain('item');
    expect(code).toContain('.items');
  });

  it('should generate ITERATE with specific collection and variable', () => {
    const node: any = {
      action: 'iterate',
      roles: new Map([
        ['collection', { type: 'selector', value: '#list' }],
        ['variable', { type: 'expression', raw: 'el' }],
      ]),
    };
    const code = controlCodeGenerator.generate(node);
    expect(code).toContain('repeat for');
    expect(code).toContain('el');
    expect(code).toContain('#list');
  });

  it('should generate GUARD with defaults', () => {
    const node: any = {
      action: 'guard',
      roles: new Map(),
    };
    const code = controlCodeGenerator.generate(node);
    expect(code).toContain('if');
    expect(code).toContain('is false');
    expect(code).toContain('return');
    expect(code).toContain('end');
  });

  it('should generate LOOP with default while mode', () => {
    const node: any = {
      action: 'loop',
      roles: new Map(),
    };
    const code = controlCodeGenerator.generate(node);
    expect(code).toContain('repeat');
    expect(code).toContain('while');
  });

  it('should generate LOOP with until mode', () => {
    const node: any = {
      action: 'loop',
      roles: new Map([
        ['condition', { type: 'expression', raw: '#done is true' }],
        ['mode', { type: 'literal', value: 'until' }],
      ]),
    };
    const code = controlCodeGenerator.generate(node);
    expect(code).toContain('repeat');
    expect(code).toContain('until');
    expect(code).toContain('#done is true');
  });

  it('should generate unknown action error message with action name', () => {
    const fakeNode: any = {
      action: 'foobar',
      roles: new Map(),
    };
    expect(() => controlCodeGenerator.generate(fakeNode)).toThrow('Unknown control command: foobar');
  });
});

// =============================================================================
// Renderer with unknown action
// =============================================================================

describe('Control Flow Renderer edge cases', () => {
  it('should handle unknown action gracefully', () => {
    const fakeNode: any = {
      action: 'unknown',
      roles: new Map(),
    };
    const rendered = renderControl(fakeNode, 'en');
    expect(rendered).toContain('Unknown');
  });
});
