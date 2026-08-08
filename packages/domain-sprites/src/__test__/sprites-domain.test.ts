/**
 * Sprites Domain Tests
 *
 * Validates the Sprites DSL across all 10 commands:
 * create, destroy, list, run, checkpoint, restore, serve, proxy, allow, deny.
 * Tests cover parsing (action + role extraction) and compilation (SDK code output).
 *
 * Note: Uses simple single-token identifiers (no hyphens/dots) because
 * the framework's simple tokenizer splits on those characters. A custom
 * extractor can be added later for production hyphenated identifiers.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createSpriteDSL } from '../index';
import type { MultilingualDSL } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

describe('Sprites Domain', () => {
  let sprites: MultilingualDSL;

  beforeAll(() => {
    sprites = createSpriteDSL();
  });

  // ===========================================================================
  // Language Support
  // ===========================================================================

  describe('Language Support', () => {
    it('should support English', () => {
      const languages = sprites.getSupportedLanguages();
      expect(languages).toContain('en');
    });

    it('should reject unsupported language', () => {
      expect(() => sprites.parse('create sprite myenv', 'xx')).toThrow();
    });
  });

  // ===========================================================================
  // CREATE
  // ===========================================================================

  describe('create', () => {
    it('should parse create with name', () => {
      const node = sprites.parse('create myenv', 'en');
      expect(node.action).toBe('create');
      expect(node.roles.has('name')).toBe(true);
    });

    it('should parse create with "sprite" filler word', () => {
      const node = sprites.parse('create sprite myenv', 'en');
      expect(node.action).toBe('create');
    });

    it('should extract sprite name', () => {
      const node = sprites.parse('create myenv', 'en');
      expect(extractRoleValue(node, 'name')).toBe('myenv');
    });

    it('should compile create to SDK call', () => {
      const result = sprites.compile('create myenv', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('createSprite');
      expect(result.code).toContain('myenv');
    });
  });

  // ===========================================================================
  // DESTROY
  // ===========================================================================

  describe('destroy', () => {
    it('should parse destroy', () => {
      const node = sprites.parse('destroy myenv', 'en');
      expect(node.action).toBe('destroy');
      expect(node.roles.has('target')).toBe(true);
    });

    it('should extract target', () => {
      const node = sprites.parse('destroy myenv', 'en');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should compile destroy to SDK call', () => {
      const result = sprites.compile('destroy myenv', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('deleteSprite');
      expect(result.code).toContain('myenv');
    });
  });

  // ===========================================================================
  // LIST
  // ===========================================================================

  describe('list', () => {
    it('should parse list', () => {
      const node = sprites.parse('list sprites', 'en');
      expect(node.action).toBe('list');
    });

    it('should compile list to SDK call', () => {
      const result = sprites.compile('list sprites', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('listAllSprites');
    });
  });

  // ===========================================================================
  // RUN
  // ===========================================================================

  describe('run', () => {
    it('should parse run with command', () => {
      const node = sprites.parse('run tests', 'en');
      expect(node.action).toBe('run');
      expect(node.roles.has('command')).toBe(true);
    });

    it('should parse run with target', () => {
      const node = sprites.parse('run tests on ci', 'en');
      expect(node.action).toBe('run');
      expect(node.roles.has('command')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should extract command and target', () => {
      const node = sprites.parse('run tests on ci', 'en');
      expect(extractRoleValue(node, 'command')).toBe('tests');
      expect(extractRoleValue(node, 'target')).toBe('ci');
    });

    it('should compile run to SDK exec call', () => {
      const result = sprites.compile('run tests on ci', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('.exec(');
      expect(result.code).toContain('tests');
    });

    it('should compile run with directory', () => {
      const result = sprites.compile('run tests on ci in /app', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('.exec(');
      expect(result.code).toContain('cwd');
    });
  });

  // ===========================================================================
  // CHECKPOINT
  // ===========================================================================

  describe('checkpoint', () => {
    it('should parse checkpoint', () => {
      const node = sprites.parse('checkpoint myenv', 'en');
      expect(node.action).toBe('checkpoint');
      expect(node.roles.has('target')).toBe(true);
    });

    it('should parse checkpoint with comment', () => {
      const node = sprites.parse('checkpoint myenv comment v1', 'en');
      expect(node.action).toBe('checkpoint');
      expect(node.roles.has('comment')).toBe(true);
    });

    it('should extract target and comment', () => {
      const node = sprites.parse('checkpoint myenv comment v1', 'en');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
      expect(extractRoleValue(node, 'comment')).toBe('v1');
    });

    it('should compile checkpoint to SDK call', () => {
      const result = sprites.compile('checkpoint myenv', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('checkpoint');
      expect(result.code).toContain('myenv');
    });

    it('should compile checkpoint with comment', () => {
      const result = sprites.compile('checkpoint myenv comment v1', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('comment');
      expect(result.code).toContain('v1');
    });
  });

  // ===========================================================================
  // RESTORE
  // ===========================================================================

  describe('restore', () => {
    it('should parse restore', () => {
      const node = sprites.parse('restore myenv to chk123', 'en');
      expect(node.action).toBe('restore');
      expect(node.roles.has('target')).toBe(true);
      expect(node.roles.has('checkpoint')).toBe(true);
    });

    it('should extract target and checkpoint id', () => {
      const node = sprites.parse('restore myenv to chk123', 'en');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
      expect(extractRoleValue(node, 'checkpoint')).toBe('chk123');
    });

    it('should compile restore to SDK call', () => {
      const result = sprites.compile('restore myenv to chk123', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('restore');
      expect(result.code).toContain('chk123');
    });
  });

  // ===========================================================================
  // SERVE
  // ===========================================================================

  describe('serve', () => {
    it('should parse serve with command', () => {
      const node = sprites.parse('serve app on myenv', 'en');
      expect(node.action).toBe('serve');
      expect(node.roles.has('command')).toBe(true);
    });

    it('should parse serve with name and target', () => {
      const node = sprites.parse('serve app as api on myenv', 'en');
      expect(node.action).toBe('serve');
      expect(node.roles.has('name')).toBe(true);
      expect(node.roles.has('target')).toBe(true);
    });

    it('should compile serve to SDK call', () => {
      const result = sprites.compile('serve app as api on myenv', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('createService');
    });
  });

  // ===========================================================================
  // PROXY
  // ===========================================================================

  describe('proxy', () => {
    it('should parse proxy with port', () => {
      const node = sprites.parse('proxy 3000 on myenv', 'en');
      expect(node.action).toBe('proxy');
      expect(node.roles.has('localPort')).toBe(true);
    });

    it('should parse proxy with local and remote ports', () => {
      const node = sprites.parse('proxy 5432 to 5432 on db', 'en');
      expect(node.action).toBe('proxy');
      expect(node.roles.has('localPort')).toBe(true);
      expect(node.roles.has('remotePort')).toBe(true);
    });

    it('should compile proxy to SDK call', () => {
      const result = sprites.compile('proxy 3000 on myenv', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('proxy');
      expect(result.code).toContain('3000');
    });
  });

  // ===========================================================================
  // ALLOW / DENY
  // ===========================================================================

  describe('allow', () => {
    it('should parse allow with domain', () => {
      const node = sprites.parse('allow npmjs on myenv', 'en');
      expect(node.action).toBe('allow');
      expect(node.roles.has('domain')).toBe(true);
    });

    it('should extract domain and target', () => {
      const node = sprites.parse('allow npmjs on myenv', 'en');
      expect(extractRoleValue(node, 'domain')).toBe('npmjs');
      expect(extractRoleValue(node, 'target')).toBe('myenv');
    });

    it('should compile allow to SDK call', () => {
      const result = sprites.compile('allow npmjs on myenv', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('addPolicy');
      expect(result.code).toContain('allow');
      expect(result.code).toContain('npmjs');
    });
  });

  describe('deny', () => {
    it('should parse deny with domain', () => {
      const node = sprites.parse('deny evil on myenv', 'en');
      expect(node.action).toBe('deny');
      expect(node.roles.has('domain')).toBe(true);
    });

    it('should compile deny to SDK call', () => {
      const result = sprites.compile('deny evil on myenv', 'en');
      expect(result.ok).toBe(true);
      expect(result.code).toContain('addPolicy');
      expect(result.code).toContain('deny');
    });
  });

  // ===========================================================================
  // Cross-command compilation
  // ===========================================================================

  describe('Compilation Output', () => {
    it('should generate valid await expressions', () => {
      const commands = [
        'create myenv',
        'destroy myenv',
        'list sprites',
        'run tests on myenv',
        'checkpoint myenv',
        'restore myenv to v1',
      ];

      for (const cmd of commands) {
        const result = sprites.compile(cmd, 'en');
        expect(result.ok).toBe(true);
        expect(result.code).toMatch(/^await /);
      }
    });
  });
});
