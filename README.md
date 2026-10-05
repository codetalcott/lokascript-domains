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

One version across every manifest here, published as `@lokascript/domains`.
The **major tracks the `@lokascript/framework` major the family is built
against** (3.x → framework 3.x); minor and patch are this repo's own and do
not chase hyperfixi's. Framework, semantic and intent are **peer
dependencies** of the aggregate: the consumer owns the single copy of the
contract, so it can never fork against the consumer's own framework.

- `npm run version:set <version>` — sets every package + root and rewrites
  every internal workspace range to `^<version>` (npm has no `workspace:`
  protocol; a stale range makes npm silently fetch the deprecated registry
  copy of a private package instead of linking the workspace). Then
  `npm install` to refresh the lockfile.
- `npm run version:validate` — runs in CI and first in the publish workflow:
  one version everywhere, internal ranges in lockstep, upstream ranges on one
  major equal to the aggregate's own.
- `scripts/pack-smoke.sh` also asserts the published peer majors equal what
  the lockfile built and tested against.
- When a framework major renumbers the same contract (hyperfixi's lockstep
  versioning: 4.0 changed `@hyperfixi/core`, not framework/semantic/intent),
  a patch can **bridge** instead of a new major: peers `^3.1.0 || ^4.0.0`.
  The first alternative is the major the lockfile builds against; prove the
  second by packing hyperfixi's packages at that version and running
  `UPSTREAM_TARBALLS="…/framework.tgz …/semantic.tgz …/intent.tgz"
  bash scripts/pack-smoke.sh`, plus the test gate against them. The next real
  build against 4.x is a `version:set 4.0.0` release as usual.
- Dependabot groups framework/semantic/intent/patterns-reference into one
  weekly PR, so every hyperfixi release runs the full gate here. Green is the
  evidence to bump; a framework **major** is a deliberate `version:set`
  release, not an auto-merge.

2.11.1 is the terminal 2.x release (framework 2.x). A 2.x fix, if ever
needed, is cut from the `v2.11.1` tag on a maintenance branch. Known
consumers: hyperfixi (`framework`, `server-bridge`, `mcp-server`),
`lokascript-learn`, `lokascript-examples` (13 apps).

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
