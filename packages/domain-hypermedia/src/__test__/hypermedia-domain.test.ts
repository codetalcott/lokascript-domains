/**
 * Hypermedia Domain Tests
 *
 * Validates the multilingual Hypermedia DSL across 8 languages (EN, ES, JA, AR, KO, ZH, TR, FR)
 * covering SVO, SOV, and VSO word orders, with compilation assertions,
 * role value verification, renderer round-trips, and edge cases.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createHypermediaDSL, renderHypermedia } from '../index';
import { hypermediaCodeGenerator } from '../generators/hypermedia-generator';
import type { MultilingualDSL } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

describe('Hypermedia Domain', () => {
  let hypermedia: MultilingualDSL;

  beforeAll(() => {
    hypermedia = createHypermediaDSL();
  });

  // ===========================================================================
  // Language Support
  // ===========================================================================

  describe('Language Support', () => {
    it('should support 8 languages', () => {
      const languages = hypermedia.getSupportedLanguages();
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
      expect(() => hypermedia.parse('request /api/users into #list', 'de')).toThrow();
    });
  });

  // ===========================================================================
  // English (SVO)
  // ===========================================================================

  describe('English (SVO)', () => {
    it('should parse REQUEST', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      expect(node.action).toBe('request');
      expect(node.roles.has('url')).toBe(true);
      expect(node.roles.has('destination')).toBe(true);
    });

    it('should extract correct role values from REQUEST', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      expect(extractRoleValue(node, 'url')).toBe('/api/users');
      expect(extractRoleValue(node, 'destination')).toBe('#list');
    });

    it('should compile REQUEST to _hyperscript', () => {
      const result = hypermedia.compile('request /api/users into #list', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('fetch /api/users then put the result into #list');
    });

    it('should parse SWAP', () => {
      const node = hypermedia.parse('swap response into #container', 'en');
      expect(node.action).toBe('swap');
      expect(extractRoleValue(node, 'content')).toBe('response');
      expect(extractRoleValue(node, 'target')).toBe('#container');
    });

    it('should compile SWAP to _hyperscript', () => {
      const result = hypermedia.compile('swap response into #container', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('swap innerHTML of #container with response');
    });

    it('should parse SWAP with strategy', () => {
      const node = hypermedia.parse('swap response into #container with outerHTML', 'en');
      expect(node.action).toBe('swap');
      expect(extractRoleValue(node, 'strategy')).toBe('outerHTML');
    });

    it('should compile SWAP with strategy to _hyperscript', () => {
      const result = hypermedia.compile('swap response into #container with outerHTML', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('swap outerHTML of #container with response');
    });

    it('should parse MORPH', () => {
      const node = hypermedia.parse('morph response into #panel', 'en');
      expect(node.action).toBe('morph');
      expect(extractRoleValue(node, 'content')).toBe('response');
      expect(extractRoleValue(node, 'target')).toBe('#panel');
    });

    it('should compile MORPH to _hyperscript', () => {
      const result = hypermedia.compile('morph response into #panel', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('morph #panel with response');
    });

    it('should parse PUSH', () => {
      const node = hypermedia.parse('push /products/1', 'en');
      expect(node.action).toBe('push');
      expect(extractRoleValue(node, 'url')).toBe('/products/1');
    });

    it('should compile PUSH to _hyperscript', () => {
      const result = hypermedia.compile('push /products/1', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('push url "/products/1"');
    });

    it('should parse REPLACE', () => {
      const node = hypermedia.parse('replace /products/1', 'en');
      expect(node.action).toBe('replace');
      expect(extractRoleValue(node, 'url')).toBe('/products/1');
    });

    it('should compile REPLACE to _hyperscript', () => {
      const result = hypermedia.compile('replace /products/1', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toBe('replace url "/products/1"');
    });

    it('should validate correct command', () => {
      const result = hypermedia.validate('request /api/users into #list', 'en');
      expect(result.valid).toBe(true);
      expect(result.node).toBeDefined();
    });

    it('should reject invalid command', () => {
      const result = hypermedia.validate('invalid command syntax', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  // ===========================================================================
  // Spanish (SVO)
  // ===========================================================================

  describe('Spanish (SVO)', () => {
    it('should parse Spanish REQUEST', () => {
      const node = hypermedia.parse('solicitar /api/users en #list', 'es');
      expect(node.action).toBe('request');
      expect(node.roles.has('url')).toBe(true);
      expect(node.roles.has('destination')).toBe(true);
    });

    it('should compile Spanish REQUEST to _hyperscript', () => {
      const result = hypermedia.compile('solicitar /api/users en #list', 'es');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('/api/users');
    });

    it('should parse Spanish SWAP', () => {
      const node = hypermedia.parse('intercambiar response en #container', 'es');
      expect(node.action).toBe('swap');
    });

    it('should parse Spanish PUSH', () => {
      const node = hypermedia.parse('empujar /products/1', 'es');
      expect(node.action).toBe('push');
    });
  });

  // ===========================================================================
  // Japanese (SOV)
  // ===========================================================================

  describe('Japanese (SOV)', () => {
    it('should parse Japanese REQUEST (SOV: verb last)', () => {
      const node = hypermedia.parse('#list に /api/users リクエスト', 'ja');
      expect(node.action).toBe('request');
      expect(node.roles.has('url')).toBe(true);
      expect(node.roles.has('destination')).toBe(true);
    });

    it('should compile Japanese REQUEST to _hyperscript', () => {
      const result = hypermedia.compile('#list に /api/users リクエスト', 'ja');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('/api/users');
    });

    it('should parse Japanese SWAP', () => {
      const node = hypermedia.parse('#container に response 入れ替え', 'ja');
      expect(node.action).toBe('swap');
    });

    it('should parse Japanese PUSH', () => {
      const node = hypermedia.parse('/products/1 プッシュ', 'ja');
      expect(node.action).toBe('push');
    });
  });

  // ===========================================================================
  // Arabic (VSO)
  // ===========================================================================

  describe('Arabic (VSO)', () => {
    it('should parse Arabic REQUEST (VSO: verb first)', () => {
      const node = hypermedia.parse('اطلب /api/users في #list', 'ar');
      expect(node.action).toBe('request');
      expect(node.roles.has('url')).toBe(true);
      expect(node.roles.has('destination')).toBe(true);
    });

    it('should compile Arabic REQUEST to _hyperscript', () => {
      const result = hypermedia.compile('اطلب /api/users في #list', 'ar');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('/api/users');
    });

    it('should parse Arabic SWAP', () => {
      const node = hypermedia.parse('بدّل response في #container', 'ar');
      expect(node.action).toBe('swap');
    });

    it('should parse Arabic PUSH', () => {
      const node = hypermedia.parse('ادفع /products/1', 'ar');
      expect(node.action).toBe('push');
    });
  });

  // ===========================================================================
  // Korean (SOV)
  // ===========================================================================

  describe('Korean (SOV)', () => {
    it('should parse Korean REQUEST (SOV order)', () => {
      const node = hypermedia.parse('#list 에 /api/users 요청', 'ko');
      expect(node.action).toBe('request');
      expect(node.roles.has('url')).toBe(true);
      expect(node.roles.has('destination')).toBe(true);
    });

    it('should compile Korean REQUEST to _hyperscript', () => {
      const result = hypermedia.compile('#list 에 /api/users 요청', 'ko');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('/api/users');
    });

    it('should parse Korean PUSH', () => {
      const node = hypermedia.parse('/products/1 푸시', 'ko');
      expect(node.action).toBe('push');
    });
  });

  // ===========================================================================
  // Chinese (SVO)
  // ===========================================================================

  describe('Chinese (SVO)', () => {
    it('should parse Chinese REQUEST', () => {
      const node = hypermedia.parse('请求 /api/users 到 #list', 'zh');
      expect(node.action).toBe('request');
      expect(node.roles.has('url')).toBe(true);
      expect(node.roles.has('destination')).toBe(true);
    });

    it('should compile Chinese REQUEST to _hyperscript', () => {
      const result = hypermedia.compile('请求 /api/users 到 #list', 'zh');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('/api/users');
    });

    it('should parse Chinese PUSH', () => {
      const node = hypermedia.parse('推送 /products/1', 'zh');
      expect(node.action).toBe('push');
    });
  });

  // ===========================================================================
  // Turkish (SOV)
  // ===========================================================================

  describe('Turkish (SOV)', () => {
    it('should parse Turkish REQUEST (SOV order)', () => {
      const node = hypermedia.parse('#list içine /api/users iste', 'tr');
      expect(node.action).toBe('request');
      expect(node.roles.has('url')).toBe(true);
      expect(node.roles.has('destination')).toBe(true);
    });

    it('should compile Turkish REQUEST to _hyperscript', () => {
      const result = hypermedia.compile('#list içine /api/users iste', 'tr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('/api/users');
    });

    it('should parse Turkish PUSH', () => {
      const node = hypermedia.parse('/products/1 it', 'tr');
      expect(node.action).toBe('push');
    });
  });

  // ===========================================================================
  // French (SVO)
  // ===========================================================================

  describe('French (SVO)', () => {
    it('should parse French REQUEST', () => {
      const node = hypermedia.parse('demander /api/users dans #list', 'fr');
      expect(node.action).toBe('request');
      expect(node.roles.has('url')).toBe(true);
      expect(node.roles.has('destination')).toBe(true);
    });

    it('should compile French REQUEST to _hyperscript', () => {
      const result = hypermedia.compile('demander /api/users dans #list', 'fr');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('/api/users');
    });

    it('should parse French PUSH', () => {
      const node = hypermedia.parse('pousser /products/1', 'fr');
      expect(node.action).toBe('push');
    });
  });

  // ===========================================================================
  // Cross-Language Semantic Equivalence
  // ===========================================================================

  describe('Semantic Equivalence', () => {
    it('should parse REQUEST across all 8 languages to same action', () => {
      const nodes = [
        hypermedia.parse('request /api/users into #list', 'en'),
        hypermedia.parse('solicitar /api/users en #list', 'es'),
        hypermedia.parse('#list に /api/users リクエスト', 'ja'),
        hypermedia.parse('اطلب /api/users في #list', 'ar'),
        hypermedia.parse('#list 에 /api/users 요청', 'ko'),
        hypermedia.parse('请求 /api/users 到 #list', 'zh'),
        hypermedia.parse('#list içine /api/users iste', 'tr'),
        hypermedia.parse('demander /api/users dans #list', 'fr'),
      ];
      for (const node of nodes) {
        expect(node.action).toBe('request');
        expect(node.roles.has('url')).toBe(true);
        expect(node.roles.has('destination')).toBe(true);
      }
    });

    it('should parse PUSH across all 8 languages to same action', () => {
      const nodes = [
        hypermedia.parse('push /products/1', 'en'),
        hypermedia.parse('empujar /products/1', 'es'),
        hypermedia.parse('/products/1 プッシュ', 'ja'),
        hypermedia.parse('ادفع /products/1', 'ar'),
        hypermedia.parse('/products/1 푸시', 'ko'),
        hypermedia.parse('推送 /products/1', 'zh'),
        hypermedia.parse('/products/1 it', 'tr'),
        hypermedia.parse('pousser /products/1', 'fr'),
      ];
      for (const node of nodes) {
        expect(node.action).toBe('push');
        expect(node.roles.has('url')).toBe(true);
      }
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle empty input', () => {
      expect(() => hypermedia.parse('', 'en')).toThrow();
    });

    it('should handle whitespace-only input', () => {
      expect(() => hypermedia.parse('   ', 'en')).toThrow();
    });

    it('should provide error info for unrecognized input', () => {
      const result = hypermedia.validate('xyzzy foobar', 'en');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});

// =============================================================================
// Natural Language Renderer
// =============================================================================

describe('Hypermedia Renderer', () => {
  let hypermedia: MultilingualDSL;

  beforeAll(() => {
    hypermedia = createHypermediaDSL();
  });

  describe('English Rendering', () => {
    it('should render REQUEST to English', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      const rendered = renderHypermedia(node, 'en');
      expect(rendered).toContain('request');
      expect(rendered).toContain('/api/users');
      expect(rendered).toContain('into');
      expect(rendered).toContain('#list');
    });

    it('should render SWAP to English', () => {
      const node = hypermedia.parse('swap response into #container', 'en');
      const rendered = renderHypermedia(node, 'en');
      expect(rendered).toContain('swap');
      expect(rendered).toContain('response');
      expect(rendered).toContain('into');
      expect(rendered).toContain('#container');
    });

    it('should render MORPH to English', () => {
      const node = hypermedia.parse('morph response into #panel', 'en');
      const rendered = renderHypermedia(node, 'en');
      expect(rendered).toContain('morph');
      expect(rendered).toContain('response');
      expect(rendered).toContain('#panel');
    });

    it('should render PUSH to English', () => {
      const node = hypermedia.parse('push /products/1', 'en');
      const rendered = renderHypermedia(node, 'en');
      expect(rendered).toContain('push');
      expect(rendered).toContain('/products/1');
    });

    it('should render REPLACE to English', () => {
      const node = hypermedia.parse('replace /products/1', 'en');
      const rendered = renderHypermedia(node, 'en');
      expect(rendered).toContain('replace');
      expect(rendered).toContain('/products/1');
    });
  });

  describe('Cross-Language Rendering', () => {
    it('should render REQUEST to Japanese (SOV word order)', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      const rendered = renderHypermedia(node, 'ja');
      expect(rendered).toContain('リクエスト');
      expect(rendered).toContain('に');
      // SOV: verb should come last
      const keywordIdx = rendered.indexOf('リクエスト');
      const markerIdx = rendered.indexOf('に');
      expect(markerIdx).toBeLessThan(keywordIdx);
    });

    it('should render REQUEST to Spanish', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      const rendered = renderHypermedia(node, 'es');
      expect(rendered).toContain('solicitar');
      expect(rendered).toContain('en');
    });

    it('should render REQUEST to Arabic', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      const rendered = renderHypermedia(node, 'ar');
      expect(rendered).toContain('اطلب');
      expect(rendered).toContain('في');
    });

    it('should render REQUEST to Korean (SOV word order)', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      const rendered = renderHypermedia(node, 'ko');
      expect(rendered).toContain('요청');
      expect(rendered).toContain('에');
    });

    it('should render REQUEST to Chinese', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      const rendered = renderHypermedia(node, 'zh');
      expect(rendered).toContain('请求');
      expect(rendered).toContain('到');
    });

    it('should render REQUEST to Turkish (SOV word order)', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      const rendered = renderHypermedia(node, 'tr');
      expect(rendered).toContain('iste');
      expect(rendered).toContain('içine');
    });

    it('should render REQUEST to French', () => {
      const node = hypermedia.parse('request /api/users into #list', 'en');
      const rendered = renderHypermedia(node, 'fr');
      expect(rendered).toContain('demander');
      expect(rendered).toContain('dans');
    });

    it('should render PUSH to Japanese (SOV word order)', () => {
      const node = hypermedia.parse('push /products/1', 'en');
      const rendered = renderHypermedia(node, 'ja');
      expect(rendered).toContain('プッシュ');
      expect(rendered).toContain('/products/1');
      // SOV: verb should come last
      const keywordIdx = rendered.indexOf('プッシュ');
      const urlIdx = rendered.indexOf('/products/1');
      expect(urlIdx).toBeLessThan(keywordIdx);
    });
  });
});

// =============================================================================
// Code Generator Direct Tests
// =============================================================================

describe('Hypermedia Code Generator', () => {
  it('should handle unknown action gracefully', () => {
    const fakeNode: any = {
      action: 'unknown',
      roles: new Map(),
    };
    expect(() => hypermediaCodeGenerator.generate(fakeNode)).toThrow('Unknown hypermedia command: unknown');
  });

  it('should use default values for REQUEST with missing roles', () => {
    const node: any = {
      action: 'request',
      roles: new Map(),
    };
    const code = hypermediaCodeGenerator.generate(node);
    expect(code).toBe('fetch /api/data');
  });

  it('should generate SWAP with default values', () => {
    const node: any = {
      action: 'swap',
      roles: new Map(),
    };
    const code = hypermediaCodeGenerator.generate(node);
    expect(code).toBe('swap innerHTML of #container with response');
  });

  it('should generate MORPH with default values', () => {
    const node: any = {
      action: 'morph',
      roles: new Map(),
    };
    const code = hypermediaCodeGenerator.generate(node);
    expect(code).toBe('morph #panel with response');
  });

  it('should generate PUSH with default values', () => {
    const node: any = {
      action: 'push',
      roles: new Map(),
    };
    const code = hypermediaCodeGenerator.generate(node);
    expect(code).toBe('push url "/"');
  });

  it('should generate REPLACE with default values', () => {
    const node: any = {
      action: 'replace',
      roles: new Map(),
    };
    const code = hypermediaCodeGenerator.generate(node);
    expect(code).toBe('replace url "/"');
  });
});
