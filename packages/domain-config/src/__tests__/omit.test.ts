/**
 * `createDomainRegistry({ omit })`: a consumer can leave domains out (no tools, no schemas). It
 * dropped bdd's tools from the MCP server while bdd was deprecated (4.2); bdd left in 5.0.0, and a
 * name no domain has is ignored.
 */
import { describe, it, expect } from 'vitest';
import { DomainRegistry } from '@lokascript/framework';
import { createDomainRegistry, registerAllDomains } from '../index';

describe('domain-config: omitting domains', () => {
  it('registers no tools and no schemas for an omitted domain', async () => {
    const registry = new DomainRegistry();
    await registerAllDomains(registry, { omit: ['voice'] });
    expect(registry.getDomainNames()).not.toContain('voice');
    expect(registry.getDomainNames()).toContain('behaviorspec');
    expect(registry.getSchemas('voice')).toBeNull();
    expect(registry.canHandle('parse_voice')).toBe(false);
    expect(registry.getToolDefinitions().some(t => t.name.endsWith('_voice'))).toBe(false);
  });

  it('registers every domain by default; an unknown name is ignored', () => {
    expect(createDomainRegistry().getDomainNames()).toHaveLength(7);
    expect(createDomainRegistry({ omit: ['bdd'] }).getDomainNames()).toHaveLength(7);
    expect(createDomainRegistry({ omit: ['sql', 'voice'] }).getDomainNames()).toHaveLength(5);
  });
});
