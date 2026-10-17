/**
 * `createDomainRegistry({ omit })`: an MCP server can drop a deprecated domain's tools (bdd, for
 * behaviorspec) while its subpath stays through 4.x.
 */
import { describe, it, expect } from 'vitest';
import { DomainRegistry } from '@lokascript/framework';
import { createDomainRegistry, registerAllDomains } from '../index';

describe('domain-config: omitting domains', () => {
  it('registers no tools and no schemas for an omitted domain', async () => {
    const registry = new DomainRegistry();
    await registerAllDomains(registry, { omit: ['bdd'] });
    expect(registry.getDomainNames()).not.toContain('bdd');
    expect(registry.getDomainNames()).toContain('behaviorspec');
    expect(registry.getSchemas('bdd')).toBeNull();
    expect(registry.canHandle('parse_bdd')).toBe(false);
    expect(registry.getToolDefinitions().some(t => t.name.endsWith('_bdd'))).toBe(false);
  });

  it('registers every domain by default', () => {
    expect(createDomainRegistry().getDomainNames()).toContain('bdd');
    expect(createDomainRegistry({ omit: ['bdd', 'voice'] }).getDomainNames()).toHaveLength(6);
  });
});
