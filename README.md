# lokascript-domains

The **LokaScript multilingual domain-DSL family** — 16 domain DSLs built on
[`@lokascript/framework`](https://www.npmjs.com/package/@lokascript/framework),
each multilingual from day one. Extracted from
[hyperfixi](https://github.com/codetalcott/hyperfixi) in 2026-08 (tag
`moved/domain-family` there marks the split; per-file history is preserved in
this repo).

## Packages

| Package | What |
| --- | --- |
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
| `@lokascript/domain-config` | The registry choke point — lazy imports, per-domain language sets, dispatcher priorities |
| `@lokascript/domain-toolkit` | Shared test harness (dev-dep of the family) |
| `mcp-multilingual-intent` | Private MCP surface for the domain family |

## Versioning

The family releases in **lockstep** (all packages share one version, continuing
hyperfixi's 2.x line). Known consumers: `lokascript-learn` (exercise engine) and
`lokascript-examples` (13 apps).

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
