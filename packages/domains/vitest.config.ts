import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // The suite imports ../dist directly (dist-level assertions, no aliases) —
    // never alias @lokascript/domains to src here.
  },
});
