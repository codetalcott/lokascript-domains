# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The LokaScript multilingual domain-DSL family: 8 domain DSLs (SQL, flow, BDD, behavior specs, LLM
prompts, todo, voice, learn) built on `@lokascript/framework`, published as **one** npm package,
`@lokascript/domains` (`packages/domains`). Every other `packages/*` directory is a **private**
workspace package that the aggregate bundles into its dist at build time. Extracted from hyperfixi in
2026-08. 4.0.0 retired jsx, animation, control, events, html, hypermedia, sprites and the private
mcp-multilingual-intent (sources under the tag `archived/domains-preview-2026-10`).

**The family is being rebuilt.** hyperfixi's `docs-internal/DOMAINS_RETHINK.md` (decisions D1–D6,
2026-10-14) moves every kept domain onto one matcher built from semantic's, with a round-trip gate in
this repo first (its Phase 2). Read it before changing a domain's schemas or the factory it uses.

Upstream deps (`@lokascript/framework`, `@lokascript/semantic`, `@lokascript/intent`,
`@hyperfixi/patterns-reference`) come from the npm registry. Nothing here assumes a sibling hyperfixi
checkout; use `npm link` explicitly if you need a local one. In the aggregate, framework/semantic/intent
are **peerDependencies** (mirrored in devDependencies for local dev); the consumer owns the single copy.

## Commands

```bash
npm install              # root; npm workspaces
npm run build            # topological: scripts/build-all.sh (toolkit → 8 domains → domain-config → domains)
npm run typecheck        # every package with a typecheck script
npm run test:check       # compact gate over every package with a test:check script
bash scripts/pack-smoke.sh   # npm pack the aggregate, install into a clean tmp dir, smoke every subpath + d.ts
```

CI runs exactly those four steps in that order. Build before testing: `packages/domains` and
`packages/domain-config` test against **built** dist of their dependencies (a `pretest` hook runs
`scripts/ensure-fresh.sh`, which rebuilds any workspace package whose `src/` is newer than its
`dist/index.js`, and `domains` rebuilds itself).

Per package (run from `packages/<name>`):

```bash
npm test                                  # vitest watch
npm run test:run                          # vitest run (full output)
npm run test:check                        # quiet gate via scripts/vitest-run.sh
npx vitest run src/__test__/lint.test.ts  # one file
npx vitest run -t "select patterns"       # one test by name
npx tsx scripts/generate-golden-patterns.ts   # regenerate the golden snapshot after an intentional change
```

`scripts/vitest-run.sh` decides pass/fail from vitest's reporter summary, not the exit code: a
timeout (124) *after* a "Test Files … passed" summary is a benign esbuild-daemon hang and passes; a
timeout with no summary, or a non-zero exit with a passing summary (coverage miss), fails.
`VITEST_TIMEOUT` (seconds, default 120) and `VITEST_QUIET=1` are the knobs.

Never pipe `pack-smoke.sh` through `tail`/`head`; the pipeline exit code lies.

## Release and versioning

One version across all 12 manifests, never hand-edited:

```bash
npm run version:set 4.1.0     # every package + root, rewrites internal ranges to ^4.1.0
npm install                   # refresh package-lock.json
npm run version:validate      # CI + first publish step run this too
```

The aggregate's **major tracks the framework major** it is built against; minor/patch are this
repo's own (README "Versioning"). Upstream ranges are not touched by `version:set`; a framework
major is a deliberate bump of those ranges plus a `version:set` to the new major.
`version:validate` fails if internal ranges drift (npm would then silently fetch the deprecated
registry copy of a private package instead of the workspace link) or if upstream majors disagree
with the aggregate's own major.

Add the entry to `packages/domains/CHANGELOG.md` (the only published surface), then run the
"Publish @lokascript/domains" GitHub workflow (`workflow_dispatch`; `dry-run` defaults to true, run it
once that way first). It re-runs validate/build/tests/pack-smoke, publishes from `packages/domains`,
tags `v<version>`, and polls the registry. `deprecate-old-names.yml` is a re-runnable one-shot that
deprecates the old `@lokascript/domain-*` names at `<=2.10.0`. Dependabot (`.github/dependabot.yml`)
groups the four upstream packages into one weekly PR that runs the full gate.

## Architecture

### The aggregate (`packages/domains`)

- `src/<domain>.ts` is one line: `export * from '@lokascript/domain-<domain>'`. `src/index.ts`
  re-exports `@lokascript/domain-config`. `package.json#exports` maps `./<domain>` to
  `dist/<domain>.js`.
- `tsup.config.ts`: ESM-only, `noExternal: [/^@lokascript\/domain-/]` inlines the private packages,
  `dts.resolve` inlines their types, and `splitting: true` is **required**: a module reached by
  both a static subpath entry and one of domain-config's lazy `import()`s must land in one chunk or
  singletons fork at the dist level.
- Two suites import the **built** `../../dist` on purpose: `dist-identity.test.ts` asserts schema
  objects from the registry are `===` the subpath export's (the singleton-fork guard) and every
  subpath exposes its `create<X>DSL` factory + `allSchemas`; `dts-integrity.test.ts` asserts every
  emitted `.d.ts` is self-contained (no `@lokascript/domain-*` names, no relative imports whose target
  didn't ship, no bare imports outside declared `dependencies`/`peerDependencies`). `pack-smoke.sh`
  repeats the d.ts check against the installed tarball and asserts the peer majors equal the majors
  the repo lockfile resolved.
- Private domain packages must emit a **single bundled** `index.d.ts` (tsup `dts: true`). Their
  tsconfig has `noEmit: true`, so the `build:types` script is a no-op; do not add `--noEmit false`
  to it. That override is what shipped 2.11.0 with subpath types silently degraded to `any`
  (per-module tsc tree overwrote tsup's bundle; consumers use `skipLibCheck`). See the changelog.

### The domain gate (`packages/domains/gate`)

`src/__tests__/round-trip.test.ts` runs every command of every domain, in each of its languages, on
the built dist (hyperfixi's `docs-internal/DOMAINS_RETHINK.md`, Phase 2). A case is a command
(bracket syntax, read in English) and a language:

- **round trip**: the domain's renderer writes it, its parser reads it back. `pass` when the parse is
  the reference node or (every domain but learn, whose output is a sentence per language) when the
  text compiles to the English reference's code: bdd's parser keeps ja `表示` and its generator
  normalizes it to `visible`. `refused` when there is no render or the parse throws; `silent` when it
  reads, or compiles to, something else.
- **leftover**: the same render plus one unknown word (`zzqx`). Expected `refused`; a parse that
  returns accepted input it did not read (`silent`).

The values each role gets are in `gate/values.ts`: realistic shapes (selectors, URLs, durations,
quoted strings), and for a role that takes fixed words every word the domain's renderer and generator
know, so a word one of the two tables lacks fails in the languages where it is missing. A test holds
every key there to a role the domain has. `baselines/round-trip.json` lists every case not at its best
outcome, and the upstream versions it was measured on: the gate fails on a case worse than listed, on
one better (prune), and on a listed case that no longer exists. Regenerate after a change:

```bash
cd packages/domains
npm run gate:regen                  # rebuilds, rewrites the baseline; refuses a worse case
npm run gate:regen -- --allow-new   # records worse cases (a decision, say why in the PR)
npm run gate:regen -- --report      # the per-domain queue, by language and by what went wrong
```

`baselines/parse-snapshot.json` (`parse-snapshot.test.ts`) records every round trip's parse as one
line, `action role:type=value …` or `refused`, and fails on any that moved, so a change shows what it
moved even where no outcome did (a value's type, a role a passing case gained, what a silent case
reads now). `gate:regen` rewrites it with the baseline; its diff is the review.

A framework bump (Dependabot's upstream group) moves the gate too: its numbers are always the
framework the lockfile holds.

### The registry choke point (`packages/domain-config`)

`src/index.ts` is the single source of truth for which domains exist for dispatch:
`registerAllDomains(registry)` registers the **8** domains (sql, bdd, behaviorspec, todo, llm,
flow, voice, learn) with lazy `import()` loaders, then awaits an async
schema-attachment pass (failures swallowed; `createDomainRegistry()` fires and forgets it).
`DOMAIN_PRIORITY` is the `CrossDomainDispatcher` tie-break order and is load-bearing: `sql` before
`todo` (natural-language `add X into Y` routes to sql), `learn` last (generic verbs overmatch).
Language sets (`BRIDGE_LANGUAGES` 11, `LEARN_LANGUAGES` 10, `CLASSIC_LANGUAGES` 8) are static so
registration stays lazy; `languages.test.ts` catches drift against the DSLs.

### Anatomy of a domain package

Every `packages/domain-<x>` follows the same layout; the framework↔semantic bridge means grammar is
never hand-authored per language:

- `src/vocab/<lang>.ts`: a `DomainVocabulary` (verb keywords + alternatives, `tokenizerKeywords`,
  `roleMarkerOverrides`). **This is the only per-language authoring.** `vocab/index.ts` pairs each
  vocab with the language's `GrammarProfileSlice` from `@lokascript/semantic/languages/<lang>`.
- `src/profiles/index.ts`: `buildPatternProfile(slice, vocab)` per language.
- `src/tokenizers/index.ts`: `buildDomainTokenizer(slice, vocab, opts)` per language.
- `src/schemas/index.ts`: `defineCommand`/`defineRole` command schemas with per-language
  `markerOverride` (bridge-era languages derive markers via `deriveRoleMarkers`).
- `src/generators/`: a `CodeGenerator` (compile target: SQL string, Playwright code, JSON spec, …)
  and a `render<X>` natural-language renderer with `COMMAND_KEYWORDS`/`MARKERS` tables.
- `src/index.ts`: `create<X>DSL()` calls `createMultilingualDSL({ schemas, languages, codeGenerator,
  renderer })`, re-exports schemas/profiles/tokenizers, and exports an `<x>ScanConfig` for AOT/Vite
  scanning. `domain-learn` is the odd one: its compiled output *is* natural language with morphology.

Standard suites in `src/__test__/`:

- `<x>-domain.test.ts`: parse/compile/translate behavior per language.
- `lint.test.ts`: `lintDomain()` from `@lokascript/domain-toolkit` (rules R1–R10: schema structure,
  keyword classification/coverage, marker tokenization, position ordering, renderer coherence).
  Errors fail; warnings print. `waivers` exist but are debt (only `domain-learn` uses them).
- `pattern-parity.test.ts`: `generatePatternVariants` output for every profile × schema must be
  byte-identical to `golden/generated-patterns.golden.json`. Any profile/schema/framework change
  shows up as a reviewed golden diff; regenerate with the package's `scripts/generate-golden-patterns.ts`.
- `schema-renderer-parity.test.ts`: the hand-written renderer and `createSchemaRenderer` over the
  same schemas must agree. The renderer's output is frozen for downstream, so fix the **schema**,
  never the renderer.

### Checklists

Adding a language to a domain: add `src/vocab/<lang>.ts`, register it in `vocab/index.ts`, add the
profile/tokenizer exports and the `languages` entry in `src/index.ts`, add the tokenizer to
`lint.test.ts`, regenerate the golden file, and update the language set in `domain-config` (plus its
`languages.test.ts`) if the domain's set diverges from `BRIDGE_LANGUAGES`.

Adding a domain: create the package, then wire the aggregate in `packages/domains`
(`src/<name>.ts`, `tsup.config.ts` entry, `package.json#exports`, `SUBPATH_FACTORIES` in
`dist-identity.test.ts`), add it to `SUBPATHS` in `scripts/pack-smoke.sh` and `ORDER` in
`scripts/build-all.sh`, and to `domains`' `pretest` list. If it should dispatch, also register it in
`domain-config` (`registerAllDomains`, `loadAllSchemas`, `DOMAIN_PRIORITY`).
