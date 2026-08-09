# @lokascript/domains

The LokaScript multilingual domain-DSL family, published as **one package** with
per-domain subpath exports. Each domain is a content pack — command schemas +
per-language vocabulary — behind the `DomainDescriptor` contract from
[`@lokascript/framework`](https://www.npmjs.com/package/@lokascript/framework).

```bash
npm install @lokascript/domains
```

```ts
// One domain — loads nothing else:
import { createSQLDSL } from '@lokascript/domains/sql';
createSQLDSL().compile('select name from users', 'en'); // → "SELECT name FROM users"
createSQLDSL().compile('usuarios から nombre を 選択', 'ja');

// The wired registry (what MCP servers use) — domains lazy-load on dispatch:
import { createDomainRegistry, registerAllDomains, DOMAIN_PRIORITY } from '@lokascript/domains';
const registry = createDomainRegistry();
await registry.handleToolCall('parse_sql', { query: 'select name from users', language: 'en' });
```

`registerAllDomains(registry)` registers the same nine domains into an existing
`DomainRegistry` and resolves once the async schema-attachment pass completes —
await it when `getSchemas`/`generatePrompt` must be populated.

## Domains

**Registry-wired** (in `DOMAIN_PRIORITY`, dispatched by `createDomainRegistry`):

| Subpath | DSL | Languages |
| --- | --- | --- |
| `/sql` | Natural-language SQL | 11 |
| `/flow` | Reactive data flow (fetch, poll, stream, submit) | 11 |
| `/bdd` | BDD/Gherkin → Playwright | 8 |
| `/behaviorspec` | Interaction-testing specs | 8 |
| `/jsx` | JSX/React description | 11 |
| `/llm` | LLM prompt specs | 11 |
| `/todo` | Todo management | 11 |
| `/voice` | Voice/accessibility commands | 11 |
| `/learn` | Language-learning drills with morphology | 10 |

**Strays** — earlier experiments absorbed for continuity. They build, parse, and
carry per-domain suites, but have seen far less production hardening and are
**not** registered in `DOMAIN_PRIORITY`; treat them as preview-quality:

| Subpath | DSL |
| --- | --- |
| `/animation` | Declarative animations |
| `/control` | Control flow |
| `/events` | Domain events |
| `/html` | HTML structure |
| `/hypermedia` | Hypermedia interactions |
| `/sprites` | Sprite/game scripting |

## Migrating from `@lokascript/domain-*`

The individual packages (`@lokascript/domain-sql` … and the wiring package
`@lokascript/domain-config`) are deprecated at their final version, 2.10.0.
The move is mechanical:

- deps: replace every `@lokascript/domain-X` entry with one `@lokascript/domains`
- imports: `@lokascript/domain-X` → `@lokascript/domains/X`
- `@lokascript/domain-config` → the root `@lokascript/domains` entry

This package is **ESM-only**. Extending the system with your own domain needs no
access to this package at all — publish your own content pack against
`@lokascript/framework`'s `DomainDescriptor` contract.
