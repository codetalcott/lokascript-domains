# Changelog

## 3.0.1

- **Accepts `@lokascript/framework`, `semantic` and `intent` 4.x as well as
  3.x** (peers `^3.1.0 || ^4.0.0`). hyperfixi 4.0 retires `@hyperfixi/core`'s
  own engine; framework, semantic and intent reach 4.0.0 only because every
  hyperfixi package shares one version, with no change to the contract this
  family uses. Proven before 4.0 was published: the full build, typecheck and
  test gate and the pack smoke pass against those three packages packed from
  hyperfixi's 4.0 tree. Without this, a consumer of `@hyperfixi/mcp-server`
  4.x would get a second framework copy nested under this package.
- Built and tested against the latest 3.x (lockfile 3.1.0 → 3.3.0). The voice
  domain's generated `show`/`hide` patterns follow semantic 3.2.0's schemas:
  the target is optional (bare `show` shows the element itself, as in
  \_hyperscript) and the style accepts an expression. Golden snapshot
  regenerated; 4.0 generates the identical snapshot.
- `scripts/pack-smoke.sh` accepts `UPSTREAM_TARBALLS` (tarballs installed in
  place of the registry's framework/semantic/intent), and its peer guard
  accepts a `^X || ^X+1` range: the first alternative must be the lockfile's
  major, and the consumer's copy must be on a major the range lists.
  `version:validate` accepts the same bridge shape and nothing looser.

## 3.0.0

- **BREAKING: built for `@lokascript/framework` 3.x.** The family now targets
  framework/semantic/intent `^3.1.0` (hyperfixi's current line). No source
  changed — every suite and the pack smoke pass unmodified — but the major
  bumps because of the next item.
- **BREAKING: framework, semantic and intent are `peerDependencies`**, no
  longer `dependencies`. A content pack against a contract must not carry its
  own copy of the contract: with a bundled copy, any consumer on a different
  framework line (hyperfixi at 3.x, `lokascript-learn`/`-examples` at 2.x)
  got a second nested framework, and `DomainRegistry` instances and schema
  singletons forked across that boundary. The consumer's single copy now
  satisfies the aggregate; npm 7+ installs the peer automatically for
  consumers that lack one.
- **Versioning policy** (README "Versioning"): the aggregate's **major tracks
  the framework major it is built against**; minor and patch are this repo's
  own. Hyperfixi's minor/patch releases are not chased. 2.11.1 is the
  terminal 2.x release for consumers still on framework 2.x.
- Tooling: `npm run version:set <v>` sets one version across all 20 manifests
  and rewrites every internal workspace range (a stale range made npm fetch
  the deprecated registry copy of a private package instead of linking the
  workspace); `npm run version:validate` runs in CI and as the first publish
  step. `scripts/pack-smoke.sh` additionally asserts the tarball's peer majors
  equal the majors the repo's lockfile built and tested against. Dependabot
  groups the four upstream packages into one weekly PR that runs the full gate.

## 2.11.1

- **Fix: subpath types no longer silently degrade to `any`.** 2.11.0 shipped
  13 of the 16 d.ts files (all but `flow`, `llm` and the root) re-exporting
  their types from relative paths (`from './parser/spec-parser.js'`) that never
  shipped — under `skipLibCheck` (every consumer) the imports don't error, the
  types just turn to `any`. Cause: the private domain packages' `build:types`
  step (`tsc --emitDeclarationOnly --noEmit false`) overwrote tsup's bundled
  `index.d.ts` with a per-module tsc tree the aggregate's dts `resolve` can't
  follow. All domain packages now emit a single bundled, self-contained d.ts
  (`bdd`/`jsx`/`todo` gained `dts: true`; `sprites` bundles dts from its index
  entry only), and the tree-emitting override is gone.
- Declare `@lokascript/intent` as a dependency: `flow`'s d.ts imports its types
  at the top level, and an undeclared transitive dep is unresolvable for types
  under pnpm's isolated layout (same silent-`any` failure mode).
- New guards so this class can't ship again: a `dts-integrity` vitest suite and
  a d.ts self-containment check in `scripts/pack-smoke.sh` — every published
  declaration file must contain no `@lokascript/domain-*` names, no relative
  imports whose target doesn't ship, and no bare imports outside declared
  dependencies.

## 2.11.0

- First release of the consolidated `@lokascript/domains` aggregate: one published
  package with per-domain subpath exports (`@lokascript/domains/sql`, `/flow`,
  `/bdd`, …). Supersedes the individual `@lokascript/domain-*` packages, which
  are deprecated in favor of this one. The root entry absorbs
  `@lokascript/domain-config` (registry wiring, `DOMAIN_PRIORITY`, language sets)
  and adds `registerAllDomains(registry)` for callers that need to await schema
  attachment.
