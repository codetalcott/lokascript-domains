import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // A gate test runs a whole domain: learn's (semantic's translate per case) takes ~2s locally,
    // and a CI run failed two of them once at vitest's 5s default.
    testTimeout: 30_000,
    // The suite imports ../dist directly (dist-level assertions, no aliases) —
    // never alias @lokascript/domains to src here.
  },
});
