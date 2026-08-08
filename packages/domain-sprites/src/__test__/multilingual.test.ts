/**
 * Multilingual Sprites DSL Tests
 *
 * Tests parsing, compilation, and translation across all supported languages:
 * - Spanish (es) — SVO word order, prepositions
 * - Japanese (ja) — SOV word order, postpositions
 * - Arabic (ar) — VSO word order, prepositions
 *
 * All languages must produce identical SemanticNode ASTs and TypeScript output.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createSpriteDSL } from '../index';
import type { MultilingualDSL } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

describe('Multilingual Sprites DSL', () => {
  let sprites: MultilingualDSL;

  beforeAll(() => {
    sprites = createSpriteDSL();
  });

  // ===========================================================================
  // Language Support
  // ===========================================================================

  describe('Language Support', () => {
    it('should support all 4 languages', () => {
      const languages = sprites.getSupportedLanguages();
      expect(languages).toContain('en');
      expect(languages).toContain('es');
      expect(languages).toContain('ja');
      expect(languages).toContain('ar');
      expect(languages).toHaveLength(4);
    });
  });

  // ===========================================================================
  // SPANISH (es) — SVO
  // ===========================================================================

  describe('Spanish (es)', () => {
    it('should parse crear (create)', () => {
      const node = sprites.parse('crear myenv', 'es');
      expect(node.action).toBe('create');
      expect(extractRoleValue(node, 'name')).toBe('myenv');
    });

    it('should parse destruir (destroy)', () => {
      const node = sprites.parse('destruir myenv', 'es');
      expect(node.action).toBe('destroy');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should parse listar (list)', () => {
      const node = sprites.parse('listar sprites', 'es');
      expect(node.action).toBe('list');
    });

    it('should parse ejecutar (run) with target marker "en"', () => {
      const node = sprites.parse('ejecutar tests en ci', 'es');
      expect(node.action).toBe('run');
      expect(extractRoleValue(node, 'command')).toBe('tests');
      expect(extractRoleValue(node, 'target')).toBe('ci');
    });

    it('should parse guardar (checkpoint) with comentario marker', () => {
      const node = sprites.parse('guardar myenv comentario v1', 'es');
      expect(node.action).toBe('checkpoint');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
      expect(extractRoleValue(node, 'comment')).toBe('v1');
    });

    it('should parse restaurar (restore) with "a" marker', () => {
      const node = sprites.parse('restaurar myenv a chk123', 'es');
      expect(node.action).toBe('restore');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
      expect(extractRoleValue(node, 'checkpoint')).toBe('chk123');
    });

    it('should parse servir (serve) with como/en markers', () => {
      const node = sprites.parse('servir app como api en myenv', 'es');
      expect(node.action).toBe('serve');
      expect(extractRoleValue(node, 'command')).toBe('app');
      expect(extractRoleValue(node, 'name')).toBe('api');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should parse permitir (allow) with "en" marker', () => {
      const node = sprites.parse('permitir npmjs en myenv', 'es');
      expect(node.action).toBe('allow');
      expect(extractRoleValue(node, 'domain')).toBe('npmjs');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should parse denegar (deny)', () => {
      const node = sprites.parse('denegar evil en myenv', 'es');
      expect(node.action).toBe('deny');
      expect(extractRoleValue(node, 'domain')).toBe('evil');
    });

    it('should compile Spanish to same TypeScript as English', () => {
      const esResult = sprites.compile('crear myenv', 'es');
      const enResult = sprites.compile('create myenv', 'en');
      expect(esResult.ok).toBe(true);
      expect(esResult.code).toBe(enResult.code);
    });
  });

  // ===========================================================================
  // JAPANESE (ja) — SOV
  // ===========================================================================

  describe('Japanese (ja)', () => {
    it('should parse 作成 (create) with を marker', () => {
      const node = sprites.parse('myenv を 作成', 'ja');
      expect(node.action).toBe('create');
      expect(extractRoleValue(node, 'name')).toBe('myenv');
    });

    it('should parse 削除 (destroy) with を marker', () => {
      const node = sprites.parse('myenv を 削除', 'ja');
      expect(node.action).toBe('destroy');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should parse 一覧 (list)', () => {
      const node = sprites.parse('スプライト 一覧', 'ja');
      expect(node.action).toBe('list');
    });

    it('should parse 実行 (run) with で/を markers (SOV order)', () => {
      const node = sprites.parse('ci で tests を 実行', 'ja');
      expect(node.action).toBe('run');
      expect(extractRoleValue(node, 'command')).toBe('tests');
      expect(extractRoleValue(node, 'target')).toBe('ci');
    });

    it('should parse チェックポイント (checkpoint) with を marker', () => {
      const node = sprites.parse('myenv を チェックポイント', 'ja');
      expect(node.action).toBe('checkpoint');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should parse 復元 (restore) with を/に markers', () => {
      const node = sprites.parse('myenv を chk123 に 復元', 'ja');
      expect(node.action).toBe('restore');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
      expect(extractRoleValue(node, 'checkpoint')).toBe('chk123');
    });

    it('should parse 許可 (allow) with で/を markers', () => {
      const node = sprites.parse('myenv で npmjs を 許可', 'ja');
      expect(node.action).toBe('allow');
      expect(extractRoleValue(node, 'domain')).toBe('npmjs');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should parse 拒否 (deny) with で/を markers', () => {
      const node = sprites.parse('myenv で evil を 拒否', 'ja');
      expect(node.action).toBe('deny');
      expect(extractRoleValue(node, 'domain')).toBe('evil');
    });

    it('should compile Japanese to same TypeScript as English', () => {
      const jaResult = sprites.compile('myenv を 作成', 'ja');
      const enResult = sprites.compile('create myenv', 'en');
      expect(jaResult.ok).toBe(true);
      expect(jaResult.code).toBe(enResult.code);
    });
  });

  // ===========================================================================
  // ARABIC (ar) — VSO
  // ===========================================================================

  describe('Arabic (ar)', () => {
    it('should parse أنشئ (create)', () => {
      const node = sprites.parse('أنشئ myenv', 'ar');
      expect(node.action).toBe('create');
      expect(extractRoleValue(node, 'name')).toBe('myenv');
    });

    it('should parse احذف (destroy)', () => {
      const node = sprites.parse('احذف myenv', 'ar');
      expect(node.action).toBe('destroy');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should parse اعرض (list)', () => {
      const node = sprites.parse('اعرض سبرايت', 'ar');
      expect(node.action).toBe('list');
    });

    it('should parse نفذ (run) with على marker', () => {
      const node = sprites.parse('نفذ tests على ci', 'ar');
      expect(node.action).toBe('run');
      expect(extractRoleValue(node, 'command')).toBe('tests');
      expect(extractRoleValue(node, 'target')).toBe('ci');
    });

    it('should parse احفظ (checkpoint)', () => {
      const node = sprites.parse('احفظ myenv', 'ar');
      expect(node.action).toBe('checkpoint');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should parse استعد (restore) with إلى marker', () => {
      const node = sprites.parse('استعد myenv إلى chk123', 'ar');
      expect(node.action).toBe('restore');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
      expect(extractRoleValue(node, 'checkpoint')).toBe('chk123');
    });

    it('should parse اسمح (allow) with على marker', () => {
      const node = sprites.parse('اسمح npmjs على myenv', 'ar');
      expect(node.action).toBe('allow');
      expect(extractRoleValue(node, 'domain')).toBe('npmjs');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should parse ارفض (deny)', () => {
      const node = sprites.parse('ارفض evil على myenv', 'ar');
      expect(node.action).toBe('deny');
      expect(extractRoleValue(node, 'domain')).toBe('evil');
    });

    it('should compile Arabic to same TypeScript as English', () => {
      const arResult = sprites.compile('أنشئ myenv', 'ar');
      const enResult = sprites.compile('create myenv', 'en');
      expect(arResult.ok).toBe(true);
      expect(arResult.code).toBe(enResult.code);
    });
  });

  // ===========================================================================
  // Cross-language compilation equivalence
  // ===========================================================================

  describe('Cross-language equivalence', () => {
    it('should produce identical SDK code for create in all languages', () => {
      const en = sprites.compile('create myenv', 'en');
      const es = sprites.compile('crear myenv', 'es');
      const ja = sprites.compile('myenv を 作成', 'ja');
      const ar = sprites.compile('أنشئ myenv', 'ar');

      expect(en.ok).toBe(true);
      expect(en.code).toBe(es.code);
      expect(en.code).toBe(ja.code);
      expect(en.code).toBe(ar.code);
    });

    it('should produce identical SDK code for run with target in all languages', () => {
      const en = sprites.compile('run tests on ci', 'en');
      const es = sprites.compile('ejecutar tests en ci', 'es');
      const ja = sprites.compile('ci で tests を 実行', 'ja');
      const ar = sprites.compile('نفذ tests على ci', 'ar');

      expect(en.ok).toBe(true);
      expect(en.code).toBe(es.code);
      expect(en.code).toBe(ja.code);
      expect(en.code).toBe(ar.code);
    });

    it('should produce identical SDK code for restore in all languages', () => {
      const en = sprites.compile('restore myenv to chk123', 'en');
      const es = sprites.compile('restaurar myenv a chk123', 'es');
      const ja = sprites.compile('myenv を chk123 に 復元', 'ja');
      const ar = sprites.compile('استعد myenv إلى chk123', 'ar');

      expect(en.ok).toBe(true);
      expect(en.code).toBe(es.code);
      expect(en.code).toBe(ja.code);
      expect(en.code).toBe(ar.code);
    });
  });

  // ===========================================================================
  // Cross-language translation
  // ===========================================================================

  describe('Translation', () => {
    it('should translate simple create from English to Spanish', () => {
      const result = sprites.translate('create myenv', 'en', 'es');
      expect(result).toContain('crear');
    });

    it('should translate simple create from English to Arabic', () => {
      const result = sprites.translate('create myenv', 'en', 'ar');
      expect(result).toContain('أنشئ');
    });
  });
});
