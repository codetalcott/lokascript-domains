# lokascript-domains

The **LokaScript multilingual domain-DSL family** — 16 domain DSLs built on
[`@lokascript/framework`](https://www.npmjs.com/package/@lokascript/framework),
each multilingual from day one. Extracted from
[hyperfixi](https://github.com/codetalcott/hyperfixi) in 2026-08 (tag
`moved/domain-family` there marks the split; per-file history is preserved in
this repo).

## One published package

The family publishes as **`@lokascript/domains`** (see
[packages/domains](packages/domains/README.md)) with one subpath export per
domain — `@lokascript/domains/sql`, `/flow`, `/bdd`, …. Its root entry carries
the registry wiring (`createDomainRegistry`, `registerAllDomains`,
`DOMAIN_PRIORITY`). The per-domain workspace packages below are **private**:
they keep their sources, suites, and golden files, and the aggregate bundles
them into its dist at publish time. The old `@lokascript/domain-*` npm names
are deprecated at 2.10.0.

The domain pattern is a content-pack/registry pattern, not a plugin pattern —
the extension seam for third parties is `@lokascript/framework`'s
`DomainDescriptor` contract, not an npm package boundary here.

## Workspace packages (private)

| Package | What |
| --- | --- |
| `@lokascript/domains` | **The published aggregate** — subpath exports + registry wiring |
| `@lokascript/domain-sql` | SQL DSL (11 languages) |
| `@lokascript/domain-bdd` | BDD/Gherkin DSL (8 languages) |
| `@lokascript/domain-behaviorspec` | Interaction-testing DSL (8 languages) |
| `@lokascript/domain-jsx` | JSX/React DSL (11 languages) |
| `@lokascript/domain-llm` | LLM prompt DSL (11 languages) |
| `@lokascript/domain-todo` | Todo DSL (11 languages) |
| `@lokascript/domain-flow` | Reactive data-flow DSL (11 languages) |
| `@lokascript/domain-voice` | Voice/accessibility DSL (11 languages) |
| `@lokascript/domain-learn` | Language-learning DSL (10 languages) |
| `@lokascript/domain-events` | Domain-events DSL (absorbed from lokascript-lessons) |
| `@lokascript/domain-animation` | Animation DSL (absorbed from lokascript-lessons) |
| `@lokascript/domain-control` | Control-flow DSL (absorbed from lokascript-lessons) |
| `@lokascript/domain-html` | HTML DSL (absorbed from lokascript-lessons) |
| `@lokascript/domain-hypermedia` | Hypermedia DSL (absorbed from lokascript-lessons) |
| `@lokascript/domain-sprites` | Sprite DSL (absorbed from sprite-dsl) |
| `@lokascript/domain-config` | The registry choke point — lazy imports, per-domain language sets, dispatcher priorities; re-exported by the aggregate's root entry |
| `@lokascript/domain-toolkit` | Shared test harness (dev-dep of the family) |
| `mcp-multilingual-intent` | Private MCP surface for the domain family |

## Versioning

The family releases in **lockstep** (one version, continuing hyperfixi's 2.x
line), now as a single publish of `@lokascript/domains`. Known consumers:
`lokascript-learn` (exercise engine), `lokascript-examples` (13 apps), and
hyperfixi's `@hyperfixi/mcp-server`.

## Development

```bash
npm install          # workspaces + hoisted tooling
npm run build        # topological (scripts/build-all.sh)
npm run test:check   # compact gate over every package with tests
npm run typecheck
```

Upstream deps (`@lokascript/framework`, `@lokascript/semantic`,
`@hyperfixi/patterns-reference`) come from the npm registry — this repo does
not build them. To develop against a local hyperfixi checkout, use
`npm link` explicitly; nothing here assumes a sibling checkout.
