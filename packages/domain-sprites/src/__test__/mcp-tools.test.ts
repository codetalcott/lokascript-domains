import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleSpriteDomainTool, spriteDomainTools } from '../mcp/tools.js';

function parseResult(response: { content: Array<{ text: string }> }) {
  return JSON.parse(response.content[0].text);
}

describe('MCP Sprite Tools', () => {

  // ===========================================================================
  // Tool definitions
  // ===========================================================================

  describe('tool definitions', () => {
    it('should export 5 tools', () => {
      expect(spriteDomainTools).toHaveLength(5);
    });

    it('should have correct tool names', () => {
      const names = spriteDomainTools.map(t => t.name);
      expect(names).toEqual([
        'parse_sprite',
        'compile_sprite',
        'validate_sprite',
        'execute_sprite',
        'translate_sprite',
      ]);
    });

    it('should require "command" for parse/compile/validate/execute', () => {
      for (const tool of spriteDomainTools.slice(0, 4)) {
        expect(tool.inputSchema.required).toContain('command');
      }
    });
  });

  // ===========================================================================
  // parse_sprite
  // ===========================================================================

  describe('parse_sprite', () => {
    it('should parse a command and return action + roles', async () => {
      const result = await handleSpriteDomainTool('parse_sprite', {
        command: 'create myenv',
      });

      const data = parseResult(result);
      expect(data.action).toBe('create');
      expect(data.roles).toBeDefined();
      expect(data.language).toBe('en');
    });

    it('should parse run with target and command roles', async () => {
      const result = await handleSpriteDomainTool('parse_sprite', {
        command: 'run tests on ci',
      });

      const data = parseResult(result);
      expect(data.action).toBe('run');
    });

    it('should error on missing command', async () => {
      const result = await handleSpriteDomainTool('parse_sprite', {});
      expect(result.isError).toBe(true);
    });
  });

  // ===========================================================================
  // compile_sprite
  // ===========================================================================

  describe('compile_sprite', () => {
    it('should compile and return SDK code', async () => {
      const result = await handleSpriteDomainTool('compile_sprite', {
        command: 'create myenv',
      });

      const data = parseResult(result);
      expect(data.ok).toBe(true);
      expect(data.code).toContain('createSprite');
      expect(data.code).toContain('myenv');
    });

    it('should compile run to exec call', async () => {
      const result = await handleSpriteDomainTool('compile_sprite', {
        command: 'run tests on ci',
      });

      const data = parseResult(result);
      expect(data.ok).toBe(true);
      expect(data.code).toContain('.exec(');
    });

    it('should error on missing command', async () => {
      const result = await handleSpriteDomainTool('compile_sprite', {});
      expect(result.isError).toBe(true);
    });
  });

  // ===========================================================================
  // validate_sprite
  // ===========================================================================

  describe('validate_sprite', () => {
    it('should validate a valid command', async () => {
      const result = await handleSpriteDomainTool('validate_sprite', {
        command: 'create myenv',
      });

      const data = parseResult(result);
      expect(data.valid).toBe(true);
    });

    it('should error on missing command', async () => {
      const result = await handleSpriteDomainTool('validate_sprite', {});
      expect(result.isError).toBe(true);
    });
  });

  // ===========================================================================
  // execute_sprite
  // ===========================================================================

  describe('execute_sprite', () => {
    const originalEnv = process.env.SPRITE_TOKEN;

    afterEach(() => {
      if (originalEnv !== undefined) {
        process.env.SPRITE_TOKEN = originalEnv;
      } else {
        delete process.env.SPRITE_TOKEN;
      }
    });

    it('should return error when SPRITE_TOKEN is not set', async () => {
      delete process.env.SPRITE_TOKEN;

      const result = await handleSpriteDomainTool('execute_sprite', {
        command: 'create myenv',
      });

      expect(result.isError).toBe(true);
      const data = parseResult(result);
      expect(data.error).toContain('SPRITE_TOKEN');
    });

    it('should error on missing command', async () => {
      const result = await handleSpriteDomainTool('execute_sprite', {});
      expect(result.isError).toBe(true);
    });
  });

  // ===========================================================================
  // translate_sprite
  // ===========================================================================

  describe('translate_sprite', () => {
    it('should error on missing required params', async () => {
      const result = await handleSpriteDomainTool('translate_sprite', {
        command: 'create myenv',
      });

      expect(result.isError).toBe(true);
    });
  });

  // ===========================================================================
  // Unknown tool
  // ===========================================================================

  describe('unknown tool', () => {
    it('should return error for unknown tool name', async () => {
      const result = await handleSpriteDomainTool('unknown_tool', {});
      expect(result.isError).toBe(true);
      const data = parseResult(result);
      expect(data.error).toContain('Unknown sprite tool');
    });
  });
});
