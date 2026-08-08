/**
 * Sprites DSL MCP Server
 *
 * Standalone Model Context Protocol server for managing Fly.io Sprites
 * via natural language. Provides 5 tools: parse, compile, validate,
 * execute, and translate.
 *
 * Usage:
 *   SPRITE_TOKEN=xxx sprites-mcp
 *
 * Claude Desktop / Claude Code config:
 *   {
 *     "mcpServers": {
 *       "sprites": {
 *         "command": "node",
 *         "args": ["/path/to/dist/mcp/index.js"],
 *         "env": { "SPRITE_TOKEN": "your-token" }
 *       }
 *     }
 *   }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { spriteDomainTools, handleSpriteDomainTool } from './tools.js';

const server = new Server(
  {
    name: '@lokascript/sprites-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: spriteDomainTools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return handleSpriteDomainTool(name, args as Record<string, unknown>);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Sprites DSL MCP server started');
}

main().catch((error) => {
  console.error('Failed to start Sprites MCP server:', error);
  process.exit(1);
});
