import { defineConfig } from 'tsup';

export default defineConfig([
  // Library builds (DSL + client + executor)
  {
    entry: ['src/index.ts', 'src/client.ts', 'src/executor.ts', 'src/types.ts'],
    format: ['esm', 'cjs'],
    dts: false,
    sourcemap: true,
    clean: true,
  },
  // MCP server (standalone bin)
  {
    entry: ['src/mcp/index.ts'],
    format: ['esm'],
    dts: false,
    sourcemap: true,
    banner: { js: '#!/usr/bin/env node' },
    outDir: 'dist/mcp',
  },
]);
