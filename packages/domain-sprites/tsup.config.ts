import { defineConfig } from 'tsup';

export default defineConfig([
  // Library builds (DSL + client + executor)
  {
    entry: ['src/index.ts', 'src/client.ts', 'src/executor.ts', 'src/types.ts'],
    format: ['esm', 'cjs'],
    // Single-entry dts bundle: multi-entry dts would dedupe shared types into
    // relative imports between entry d.ts files, which the aggregate's dts
    // resolve cannot follow (and the deep subpaths never declared types).
    dts: { entry: { index: 'src/index.ts' } },
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
