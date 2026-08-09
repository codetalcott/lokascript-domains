import { defineConfig } from 'tsup';

/**
 * The aggregate bundles the (private) workspace domain packages into its own
 * dist; only framework/semantic stay external (both published from hyperfixi).
 *
 * ESM-only, `splitting: true` — REQUIRED, not stylistic: any module shared by
 * two entries (or reached by both a static subpath entry and one of
 * domain-config's lazy `import('@lokascript/domain-*')` calls) must land in
 * ONE chunk, or singletons fork at the dist level. The dist-identity test
 * asserts this against the built output.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    // the 9 registry-wired originals
    sql: 'src/sql.ts',
    flow: 'src/flow.ts',
    bdd: 'src/bdd.ts',
    behaviorspec: 'src/behaviorspec.ts',
    jsx: 'src/jsx.ts',
    llm: 'src/llm.ts',
    todo: 'src/todo.ts',
    voice: 'src/voice.ts',
    learn: 'src/learn.ts',
    // the 6 absorbed strays (not in the registry/DOMAIN_PRIORITY; see README)
    animation: 'src/animation.ts',
    control: 'src/control.ts',
    events: 'src/events.ts',
    html: 'src/html.ts',
    hypermedia: 'src/hypermedia.ts',
    sprites: 'src/sprites.ts',
  },
  format: ['esm'],
  // resolve: inline the (private) domain packages' types into the emitted
  // d.ts — a bare `export * from '@lokascript/domain-sql'` would point
  // consumers at a package they can't install. Framework/semantic types stay
  // external (real dependencies).
  dts: { resolve: [/^@lokascript\/domain-/] },
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ['@lokascript/framework', '@lokascript/semantic'],
  noExternal: [/^@lokascript\/domain-/],
});
