/**
 * HTML Domain Tests
 *
 * Validates the multilingual HTML DSL across 8 languages (EN, ES, JA, AR, KO, ZH, TR, FR)
 * covering SVO, SOV, and VSO word orders, with compilation assertions,
 * role value verification, renderer round-trips, and edge cases.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createHtmlDSL, renderHtml } from '../index';
import { htmlCodeGenerator } from '../generators/html-generator';
import type { MultilingualDSL } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

describe('HTML Domain', () => {
  let html: MultilingualDSL;

  beforeAll(() => {
    html = createHtmlDSL();
  });

  // ===========================================================================
  // Language Support
  // ===========================================================================

  describe('Language Support', () => {
    it('should support 8 languages', () => {
      const languages = html.getSupportedLanguages();
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
      expect(() => html.parse('create button', 'de')).toThrow();
    });
  });

  // ===========================================================================
  // English (SVO)
  // ===========================================================================

  describe('English (SVO)', () => {
    it('should parse CREATE', () => {
      const node = html.parse('create button with class "primary"', 'en');
      expect(node.action).toBe('create');
      expect(node.roles.has('element')).toBe(true);
    });

    it('should extract correct role values from CREATE', () => {
      const node = html.parse('create button with class "primary"', 'en');
      expect(extractRoleValue(node, 'element')).toBe('button');
    });

    it('should compile CREATE to HTML', () => {
      const result = html.compile('create button', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<button>');
    });

    it('should compile CREATE with attribute to HTML', () => {
      const result = html.compile('create button with "primary"', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<button');
      expect(result.code).toContain('primary');
    });

    it('should parse NEST', () => {
      const node = html.parse('nest paragraph inside container', 'en');
      expect(node.action).toBe('nest');
      expect(node.roles.has('child')).toBe(true);
      expect(node.roles.has('parent')).toBe(true);
    });

    it('should extract correct role values from NEST', () => {
      const node = html.parse('nest paragraph inside container', 'en');
      expect(extractRoleValue(node, 'child')).toBe('paragraph');
      expect(extractRoleValue(node, 'parent')).toBe('container');
    });

    it('should compile NEST to HTML', () => {
      const result = html.compile('nest paragraph inside container', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<p>');
      expect(result.code).toContain('container');
    });

    it('should parse LINK', () => {
      const node = html.parse('link "Home" to /home', 'en');
      expect(node.action).toBe('link');
      expect(node.roles.has('text')).toBe(true);
      expect(node.roles.has('url')).toBe(true);
    });

    it('should extract correct role values from LINK', () => {
      const node = html.parse('link "Home" to /home', 'en');
      expect(extractRoleValue(node, 'text')).toBe('Home');
      expect(extractRoleValue(node, 'url')).toBe('/home');
    });

    it('should compile LINK to HTML', () => {
      const result = html.compile('link "Home" to /home', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<a');
      expect(result.code).toContain('href="/home"');
      expect(result.code).toContain('Home');
    });

    it('should parse LABEL', () => {
      const node = html.parse('label #email with "Email Address"', 'en');
      expect(node.action).toBe('label');
      expect(node.roles.has('target')).toBe(true);
      expect(node.roles.has('text')).toBe(true);
    });

    it('should extract correct role values from LABEL', () => {
      const node = html.parse('label #email with "Email Address"', 'en');
      expect(extractRoleValue(node, 'target')).toBe('#email');
      expect(extractRoleValue(node, 'text')).toBe('Email Address');
    });

    it('should compile LABEL to HTML', () => {
      const result = html.compile('label #email with "Email Address"', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<label');
      expect(result.code).toContain('for="email"');
      expect(result.code).toContain('Email Address');
    });

    it('should parse INPUT', () => {
      const node = html.parse('input text named "email"', 'en');
      expect(node.action).toBe('input');
      expect(node.roles.has('type')).toBe(true);
      expect(node.roles.has('name')).toBe(true);
    });

    it('should extract correct role values from INPUT', () => {
      const node = html.parse('input text named "email"', 'en');
      expect(extractRoleValue(node, 'type')).toBe('text');
      expect(extractRoleValue(node, 'name')).toBe('email');
    });

    it('should compile INPUT to HTML', () => {
      const result = html.compile('input text named "email"', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<input');
      expect(result.code).toContain('type="text"');
      expect(result.code).toContain('name="email"');
    });

    it('should validate correct command', () => {
      const result = html.validate('create button', 'en');
      expect(result.valid).toBe(true);
      expect(result.node).toBeDefined();
    });

    it('should reject invalid command', () => {
      const result = html.validate('invalid command syntax', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  // ===========================================================================
  // Spanish (SVO)
  // ===========================================================================

  describe('Spanish (SVO)', () => {
    it('should parse Spanish CREATE', () => {
      const node = html.parse('crear button con "primary"', 'es');
      expect(node.action).toBe('create');
      expect(node.roles.has('element')).toBe(true);
    });

    it('should compile Spanish CREATE to HTML', () => {
      const result = html.compile('crear button', 'es');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<button');
    });

    it('should parse Spanish NEST', () => {
      const node = html.parse('anidar paragraph dentro container', 'es');
      expect(node.action).toBe('nest');
    });

    it('should parse Spanish LINK', () => {
      const node = html.parse('enlazar "Home" a /home', 'es');
      expect(node.action).toBe('link');
    });

    it('should compile Spanish LINK to HTML', () => {
      const result = html.compile('enlazar "Home" a /home', 'es');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<a');
      expect(result.code).toContain('Home');
    });
  });

  // ===========================================================================
  // Japanese (SOV)
  // ===========================================================================

  describe('Japanese (SOV)', () => {
    it('should parse Japanese CREATE (SOV: verb last)', () => {
      const node = html.parse('button 作成', 'ja');
      expect(node.action).toBe('create');
      expect(node.roles.has('element')).toBe(true);
    });

    it('should compile Japanese CREATE to HTML', () => {
      const result = html.compile('button 作成', 'ja');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<button');
    });

    it('should parse Japanese NEST', () => {
      const node = html.parse('container の中 paragraph 入れ子', 'ja');
      expect(node.action).toBe('nest');
    });

    it('should parse Japanese LINK', () => {
      const node = html.parse('/home へ "Home" リンク', 'ja');
      expect(node.action).toBe('link');
    });
  });

  // ===========================================================================
  // Arabic (VSO)
  // ===========================================================================

  describe('Arabic (VSO)', () => {
    it('should parse Arabic CREATE (VSO: verb first)', () => {
      const node = html.parse('أنشئ button', 'ar');
      expect(node.action).toBe('create');
      expect(node.roles.has('element')).toBe(true);
    });

    it('should compile Arabic CREATE to HTML', () => {
      const result = html.compile('أنشئ button', 'ar');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<button');
    });

    it('should parse Arabic NEST', () => {
      const node = html.parse('أدخل paragraph داخل container', 'ar');
      expect(node.action).toBe('nest');
    });

    it('should parse Arabic LINK', () => {
      const node = html.parse('اربط "Home" إلى /home', 'ar');
      expect(node.action).toBe('link');
    });
  });

  // ===========================================================================
  // Korean (SOV)
  // ===========================================================================

  describe('Korean (SOV)', () => {
    it('should parse Korean CREATE (SOV order)', () => {
      const node = html.parse('button 생성', 'ko');
      expect(node.action).toBe('create');
      expect(node.roles.has('element')).toBe(true);
    });

    it('should compile Korean CREATE to HTML', () => {
      const result = html.compile('button 생성', 'ko');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<button');
    });

    it('should parse Korean LINK', () => {
      const node = html.parse('/home 로 "Home" 링크', 'ko');
      expect(node.action).toBe('link');
    });
  });

  // ===========================================================================
  // Chinese (SVO)
  // ===========================================================================

  describe('Chinese (SVO)', () => {
    it('should parse Chinese CREATE', () => {
      const node = html.parse('创建 button', 'zh');
      expect(node.action).toBe('create');
      expect(node.roles.has('element')).toBe(true);
    });

    it('should compile Chinese CREATE to HTML', () => {
      const result = html.compile('创建 button', 'zh');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<button');
    });

    it('should parse Chinese LINK', () => {
      const node = html.parse('链接 "Home" 到 /home', 'zh');
      expect(node.action).toBe('link');
    });
  });

  // ===========================================================================
  // Turkish (SOV)
  // ===========================================================================

  describe('Turkish (SOV)', () => {
    it('should parse Turkish CREATE (SOV order)', () => {
      const node = html.parse('button oluştur', 'tr');
      expect(node.action).toBe('create');
      expect(node.roles.has('element')).toBe(true);
    });

    it('should compile Turkish CREATE to HTML', () => {
      const result = html.compile('button oluştur', 'tr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<button');
    });

    it('should parse Turkish LINK', () => {
      const node = html.parse('/home ye "Home" bağla', 'tr');
      expect(node.action).toBe('link');
    });
  });

  // ===========================================================================
  // French (SVO)
  // ===========================================================================

  describe('French (SVO)', () => {
    it('should parse French CREATE', () => {
      const node = html.parse('créer button', 'fr');
      expect(node.action).toBe('create');
      expect(node.roles.has('element')).toBe(true);
    });

    it('should compile French CREATE to HTML', () => {
      const result = html.compile('créer button', 'fr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<button');
    });

    it('should parse French LINK', () => {
      const node = html.parse('lier "Home" vers /home', 'fr');
      expect(node.action).toBe('link');
    });

    it('should compile French LINK to HTML', () => {
      const result = html.compile('lier "Home" vers /home', 'fr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('<a');
      expect(result.code).toContain('Home');
    });
  });

  // ===========================================================================
  // Cross-Language Semantic Equivalence
  // ===========================================================================

  describe('Semantic Equivalence', () => {
    it('should parse CREATE across all 8 languages to same action', () => {
      const nodes = [
        html.parse('create button', 'en'),
        html.parse('crear button', 'es'),
        html.parse('button 作成', 'ja'),
        html.parse('أنشئ button', 'ar'),
        html.parse('button 생성', 'ko'),
        html.parse('创建 button', 'zh'),
        html.parse('button oluştur', 'tr'),
        html.parse('créer button', 'fr'),
      ];
      for (const node of nodes) {
        expect(node.action).toBe('create');
        expect(node.roles.has('element')).toBe(true);
      }
    });

    it('should compile CREATE across all 8 languages to same HTML', () => {
      const results = [
        html.compile('create button', 'en'),
        html.compile('crear button', 'es'),
        html.compile('button 作成', 'ja'),
        html.compile('أنشئ button', 'ar'),
        html.compile('button 생성', 'ko'),
        html.compile('创建 button', 'zh'),
        html.compile('button oluştur', 'tr'),
        html.compile('créer button', 'fr'),
      ];
      for (const result of results) {
        expect(result.ok).toBe(true);
        expect(result.code).toContain('<button');
      }
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle empty input', () => {
      expect(() => html.parse('', 'en')).toThrow();
    });

    it('should handle whitespace-only input', () => {
      expect(() => html.parse('   ', 'en')).toThrow();
    });

    it('should provide error info for unrecognized input', () => {
      const result = html.validate('xyzzy foobar', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});

// =============================================================================
// Natural Language Renderer
// =============================================================================

describe('HTML Renderer', () => {
  let html: MultilingualDSL;

  beforeAll(() => {
    html = createHtmlDSL();
  });

  describe('English Rendering', () => {
    it('should render CREATE to English', () => {
      const node = html.parse('create button', 'en');
      const rendered = renderHtml(node, 'en');
      expect(rendered).toContain('create');
      expect(rendered).toContain('button');
    });

    it('should render NEST to English', () => {
      const node = html.parse('nest paragraph inside container', 'en');
      const rendered = renderHtml(node, 'en');
      expect(rendered).toContain('nest');
      expect(rendered).toContain('paragraph');
      expect(rendered).toContain('inside');
      expect(rendered).toContain('container');
    });

    it('should render LINK to English', () => {
      const node = html.parse('link "Home" to /home', 'en');
      const rendered = renderHtml(node, 'en');
      expect(rendered).toContain('link');
      expect(rendered).toContain('to');
      expect(rendered).toContain('/home');
    });

    it('should render LABEL to English', () => {
      const node = html.parse('label #email with "Email Address"', 'en');
      const rendered = renderHtml(node, 'en');
      expect(rendered).toContain('label');
      expect(rendered).toContain('#email');
      expect(rendered).toContain('with');
    });

    it('should render INPUT to English', () => {
      const node = html.parse('input text named "email"', 'en');
      const rendered = renderHtml(node, 'en');
      expect(rendered).toContain('input');
      expect(rendered).toContain('text');
      expect(rendered).toContain('named');
    });
  });

  describe('Cross-Language Rendering', () => {
    it('should render CREATE to Japanese (SOV word order)', () => {
      const node = html.parse('create button', 'en');
      const rendered = renderHtml(node, 'ja');
      expect(rendered).toContain('作成');
      // SOV: verb should come last
      const keywordIdx = rendered.indexOf('作成');
      const elementIdx = rendered.indexOf('button');
      expect(elementIdx).toBeLessThan(keywordIdx);
    });

    it('should render CREATE to Spanish', () => {
      const node = html.parse('create button', 'en');
      const rendered = renderHtml(node, 'es');
      expect(rendered).toContain('crear');
      expect(rendered).toContain('button');
    });

    it('should render CREATE to Arabic', () => {
      const node = html.parse('create button', 'en');
      const rendered = renderHtml(node, 'ar');
      expect(rendered).toContain('أنشئ');
    });

    it('should render CREATE to Korean (SOV word order)', () => {
      const node = html.parse('create button', 'en');
      const rendered = renderHtml(node, 'ko');
      expect(rendered).toContain('생성');
    });

    it('should render CREATE to Chinese', () => {
      const node = html.parse('create button', 'en');
      const rendered = renderHtml(node, 'zh');
      expect(rendered).toContain('创建');
    });

    it('should render CREATE to Turkish (SOV word order)', () => {
      const node = html.parse('create button', 'en');
      const rendered = renderHtml(node, 'tr');
      expect(rendered).toContain('oluştur');
    });

    it('should render CREATE to French', () => {
      const node = html.parse('create button', 'en');
      const rendered = renderHtml(node, 'fr');
      expect(rendered).toContain('créer');
    });

    it('should render NEST to Japanese with correct markers', () => {
      const node = html.parse('nest paragraph inside container', 'en');
      const rendered = renderHtml(node, 'ja');
      expect(rendered).toContain('入れ子');
      expect(rendered).toContain('の中');
    });

    it('should render LINK to Spanish with correct markers', () => {
      const node = html.parse('link "Home" to /home', 'en');
      const rendered = renderHtml(node, 'es');
      expect(rendered).toContain('enlazar');
      expect(rendered).toContain('a');
    });

    it('should render INPUT to French with correct markers', () => {
      const node = html.parse('input text named "email"', 'en');
      const rendered = renderHtml(node, 'fr');
      expect(rendered).toContain('saisie');
      expect(rendered).toContain('nommé');
    });
  });
});

// =============================================================================
// Code Generator Direct Tests
// =============================================================================

describe('HTML Code Generator', () => {
  it('should handle unknown action gracefully', () => {
    const fakeNode: any = {
      action: 'unknown',
      roles: new Map(),
    };
    expect(() => htmlCodeGenerator.generate(fakeNode)).toThrow('Unknown HTML command: unknown');
  });

  it('should use default values for CREATE with missing roles', () => {
    const node: any = {
      action: 'create',
      roles: new Map(),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toBe('<div></div>');
  });

  it('should generate NEST with default values', () => {
    const node: any = {
      action: 'nest',
      roles: new Map(),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toContain('<p>');
    expect(code).toContain('</p>');
  });

  it('should generate LINK with default values', () => {
    const node: any = {
      action: 'link',
      roles: new Map(),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toContain('<a');
    expect(code).toContain('href="#"');
    expect(code).toContain('Link');
  });

  it('should generate LABEL with default values', () => {
    const node: any = {
      action: 'label',
      roles: new Map(),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toContain('<label');
    expect(code).toContain('for="field"');
    expect(code).toContain('Label');
  });

  it('should generate INPUT with default values', () => {
    const node: any = {
      action: 'input',
      roles: new Map(),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toContain('<input');
    expect(code).toContain('type="text"');
    expect(code).toContain('name="field"');
  });

  it('should generate self-closing INPUT tag', () => {
    const node: any = {
      action: 'input',
      roles: new Map([
        ['type', { type: 'expression', raw: 'email' }],
        ['name', { type: 'expression', raw: 'username' }],
      ]),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toBe('<input type="email" name="username" />');
  });

  it('should strip # from label target ID', () => {
    const node: any = {
      action: 'label',
      roles: new Map([
        ['target', { type: 'expression', raw: '#email' }],
        ['text', { type: 'expression', raw: 'Email Address' }],
      ]),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toBe('<label for="email">Email Address</label>');
  });

  it('should resolve paragraph alias to p tag', () => {
    const node: any = {
      action: 'create',
      roles: new Map([
        ['element', { type: 'expression', raw: 'paragraph' }],
      ]),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toBe('<p></p>');
  });

  it('should resolve container alias in NEST to div with class', () => {
    const node: any = {
      action: 'nest',
      roles: new Map([
        ['child', { type: 'expression', raw: 'paragraph' }],
        ['parent', { type: 'expression', raw: 'container' }],
      ]),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toBe('<div class="container"><p></p></div>');
  });

  it('should generate LINK with proper href and text', () => {
    const node: any = {
      action: 'link',
      roles: new Map([
        ['text', { type: 'expression', raw: 'Home' }],
        ['url', { type: 'expression', raw: '/home' }],
      ]),
    };
    const code = htmlCodeGenerator.generate(node);
    expect(code).toBe('<a href="/home">Home</a>');
  });
});
