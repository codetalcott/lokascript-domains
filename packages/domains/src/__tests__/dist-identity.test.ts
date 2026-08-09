/**
 * Dist-level identity + smoke suite for the aggregate.
 *
 * Imports the BUILT output (../../dist) directly — no aliases, no src — because
 * the risk it guards is a build artifact: tsup emitting a shared module into two
 * chunks would fork singletons in ways src-level tests can never see. The
 * hyperfixi memory that motivates this: "tsup multi-entry splitting:false forks
 * singletons; verify at dist level, not via test-config aliases."
 */
import { describe, it, expect } from 'vitest';
import { DomainRegistry } from '@lokascript/framework';
// eslint-disable-next-line import/no-relative-packages -- dist-level on purpose
import { createDomainRegistry, registerAllDomains, DOMAIN_PRIORITY } from '../../dist/index.js';
import * as sqlEntry from '../../dist/sql.js';

/** subpath → its DSL factory export (the 9 registry-wired + 6 strays). */
const SUBPATH_FACTORIES: Record<string, string> = {
  sql: 'createSQLDSL',
  flow: 'createFlowDSL',
  bdd: 'createBDDDSL',
  behaviorspec: 'createBehaviorSpecDSL',
  jsx: 'createJSXDSL',
  llm: 'createLLMDSL',
  todo: 'createTodoDSL',
  voice: 'createVoiceDSL',
  learn: 'createLearnDSL',
  animation: 'createAnimationDSL',
  control: 'createControlDSL',
  events: 'createEventsDSL',
  html: 'createHtmlDSL',
  hypermedia: 'createHypermediaDSL',
  sprites: 'createSpriteDSL',
};

describe('every subpath entry loads and exposes its factory', () => {
  for (const [subpath, factory] of Object.entries(SUBPATH_FACTORIES)) {
    it(`./${subpath} exports ${factory} and allSchemas`, async () => {
      const mod = await import(`../../dist/${subpath}.js`);
      expect(typeof mod[factory], `${subpath}.${factory}`).toBe('function');
      expect(mod.allSchemas, `${subpath}.allSchemas`).toBeDefined();
    });
  }
});

describe('dist-level module identity (singleton-fork guard)', () => {
  it('registry schema objects ARE the subpath-export schema objects, all 9 domains', async () => {
    const registry = new DomainRegistry();
    await registerAllDomains(registry);

    for (const name of DOMAIN_PRIORITY) {
      const entry = (await import(`../../dist/${name}.js`)) as {
        allSchemas: readonly unknown[];
      };
      const registered = registry.getSchemas(name);
      expect(registered, `${name}: schemas attached`).not.toBeNull();
      expect(registered!.length, `${name}: schema count`).toBe(entry.allSchemas.length);
      // Element identity (===) is the whole point: if the lazy chunk the
      // registry loaded and the static subpath entry were separate copies of
      // the domain module, these would be structurally equal but not identical.
      entry.allSchemas.forEach((schema, i) => {
        expect(registered![i], `${name}: schema[${i}] identity`).toBe(schema);
      });
    }
  });

  it('the registry-loaded DSL and the subpath factory share generator identity', async () => {
    const registry = new DomainRegistry();
    await registerAllDomains(registry);
    const viaRegistry = await registry.getDSLForDomain('sql');
    expect(viaRegistry).not.toBeNull();
    // Both parses must agree — and come from the same module instance's tables.
    const a = viaRegistry!.parse('select name from users', 'en');
    const b = sqlEntry.createSQLDSL().parse('select name from users', 'en');
    expect(a.action).toBe(b.action);
    expect(a.action).toBe('select');
  });
});

describe('aggregate smoke (per plan Phase 0)', () => {
  it('createSQLDSL().compile("select name from users", "en") works from the subpath', () => {
    const dsl = sqlEntry.createSQLDSL();
    const result = dsl.compile('select name from users', 'en');
    expect(result.ok).toBe(true);
    expect(String(result.code)).toMatch(/SELECT/i);
  });

  it('parse_sql dispatches through a createDomainRegistry() registry', async () => {
    const registry = createDomainRegistry();
    expect(registry.canHandle('parse_sql')).toBe(true);
    const response = await registry.handleToolCall('parse_sql', {
      query: 'select name from users',
      language: 'en',
    });
    expect(response).not.toBeNull();
    expect(response!.isError).toBeFalsy();
    const payload = JSON.parse((response!.content[0] as { text: string }).text);
    expect(payload.action).toBe('select');
  });

  it('DOMAIN_PRIORITY survives the re-export with sql before todo', () => {
    expect(DOMAIN_PRIORITY.indexOf('sql')).toBeGreaterThanOrEqual(0);
    expect(DOMAIN_PRIORITY.indexOf('sql')).toBeLessThan(DOMAIN_PRIORITY.indexOf('todo'));
  });
});
