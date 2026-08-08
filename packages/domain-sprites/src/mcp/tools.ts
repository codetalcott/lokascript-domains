/**
 * Sprites DSL MCP Tool Definitions & Handlers
 *
 * 5 tools: parse, compile, validate, execute, translate.
 * Follows the @hyperfixi/mcp-server sql-domain.ts pattern.
 */

import { validateRequired, getString, jsonResponse, errorResponse } from './utils.js';
import type { ToolResponse } from './utils.js';

// Lazy-loaded DSL and executor dependencies
let dsl: any = null;

async function getDSL() {
  if (dsl) return dsl;
  const mod = await import('../index.js');
  dsl = mod.createSpriteDSL();
  return dsl;
}

// =============================================================================
// Tool Definitions
// =============================================================================

export const spriteDomainTools = [
  {
    name: 'parse_sprite',
    description:
      'Parse a natural-language sprite command into a semantic AST. ' +
      'Returns the action and extracted roles (name, target, command, etc.).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        command: {
          type: 'string',
          description: 'Sprite command in natural language (e.g., "create sprite my-env")',
        },
        language: {
          type: 'string',
          description: 'Language code (default: en)',
          default: 'en',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'compile_sprite',
    description:
      'Compile a natural-language sprite command to @fly/sprites TypeScript SDK code. ' +
      'Returns the generated await expression as a string.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        command: {
          type: 'string',
          description: 'Sprite command (e.g., "run npm test on ci")',
        },
        language: {
          type: 'string',
          description: 'Language code (default: en)',
          default: 'en',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'validate_sprite',
    description:
      'Validate a sprite command. Returns whether it parses successfully and any errors.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        command: {
          type: 'string',
          description: 'Sprite command to validate',
        },
        language: {
          type: 'string',
          description: 'Language code (default: en)',
          default: 'en',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'execute_sprite',
    description:
      'Parse and execute a sprite command against the real Sprites API. ' +
      'Requires SPRITE_TOKEN environment variable to be set.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        command: {
          type: 'string',
          description: 'Sprite command to execute (e.g., "create sprite my-env")',
        },
        language: {
          type: 'string',
          description: 'Language code (default: en)',
          default: 'en',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'translate_sprite',
    description:
      'Translate a sprite command between natural languages. ' +
      'Currently only English is supported (MVP).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        command: {
          type: 'string',
          description: 'Sprite command to translate',
        },
        from: {
          type: 'string',
          description: 'Source language code',
        },
        to: {
          type: 'string',
          description: 'Target language code',
        },
      },
      required: ['command', 'from', 'to'],
    },
  },
];

// =============================================================================
// Handler
// =============================================================================

export async function handleSpriteDomainTool(
  name: string,
  args: Record<string, unknown>,
): Promise<ToolResponse> {
  try {
    switch (name) {
      case 'parse_sprite':
        return await parseSprite(args);
      case 'compile_sprite':
        return await compileSprite(args);
      case 'validate_sprite':
        return await validateSprite(args);
      case 'execute_sprite':
        return await executeSprite(args);
      case 'translate_sprite':
        return await translateSprite(args);
      default:
        return errorResponse(`Unknown sprite tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(`Sprite tool error: ${message}`);
  }
}

// =============================================================================
// Tool Implementations
// =============================================================================

async function parseSprite(args: Record<string, unknown>): Promise<ToolResponse> {
  const error = validateRequired(args, ['command']);
  if (error) return error;

  const command = getString(args, 'command');
  const language = getString(args, 'language', 'en');

  const sprites = await getDSL();
  const node = sprites.parse(command, language);

  // Convert roles Map to plain object for JSON serialization
  const roles: Record<string, unknown> = {};
  for (const [key, value] of node.roles) {
    roles[key] = value;
  }

  return jsonResponse({
    action: node.action,
    roles,
    language,
    command,
  });
}

async function compileSprite(args: Record<string, unknown>): Promise<ToolResponse> {
  const error = validateRequired(args, ['command']);
  if (error) return error;

  const command = getString(args, 'command');
  const language = getString(args, 'language', 'en');

  const sprites = await getDSL();
  const result = sprites.compile(command, language);

  return jsonResponse({
    ok: result.ok,
    code: result.code,
    errors: result.errors,
    language,
    input: command,
  });
}

async function validateSprite(args: Record<string, unknown>): Promise<ToolResponse> {
  const error = validateRequired(args, ['command']);
  if (error) return error;

  const command = getString(args, 'command');
  const language = getString(args, 'language', 'en');

  const sprites = await getDSL();
  const result = sprites.validate(command, language);

  return jsonResponse({
    valid: result.valid,
    errors: result.errors,
    language,
    command,
  });
}

async function executeSprite(args: Record<string, unknown>): Promise<ToolResponse> {
  const error = validateRequired(args, ['command']);
  if (error) return error;

  const token = process.env.SPRITE_TOKEN;
  if (!token) {
    return errorResponse(
      'SPRITE_TOKEN environment variable is not set. ' +
      'Set it to your Fly.io Sprites API token to execute commands.',
    );
  }

  const command = getString(args, 'command');
  const language = getString(args, 'language', 'en');

  const sprites = await getDSL();
  const node = sprites.parse(command, language);

  // Dynamic import to avoid loading client/executor unless executing
  const { SpritesClient } = await import('../client.js');
  const { SpriteExecutor } = await import('../executor.js');

  const client = new SpritesClient({ token });
  const executor = new SpriteExecutor(client);
  const result = await executor.execute(node);

  return jsonResponse({
    ...result,
    input: command,
    language,
  });
}

async function translateSprite(args: Record<string, unknown>): Promise<ToolResponse> {
  const error = validateRequired(args, ['command', 'from', 'to']);
  if (error) return error;

  const command = getString(args, 'command');
  const from = getString(args, 'from');
  const to = getString(args, 'to');

  const sprites = await getDSL();

  try {
    const translated = sprites.translate(command, from, to);
    return jsonResponse({
      input: { command, language: from },
      output: { command: translated, language: to },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse(`Translation failed: ${message}`);
  }
}
