/**
 * @lokascript/domains — root entry.
 *
 * Absorbs @lokascript/domain-config's registration surface: the workspace
 * package stays the single source of truth (and keeps its languages.test.ts),
 * this entry bundles it. `createDomainRegistry` / `registerAllDomains` lazy-load
 * each domain through the same chunks the subpath exports use, so
 * `import '@lokascript/domains/sql'` never loads the other domains and module
 * identity is shared between the registry and direct subpath imports.
 */
export * from '@lokascript/domain-config';
