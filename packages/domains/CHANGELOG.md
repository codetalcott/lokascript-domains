# Changelog

## Unreleased

- **behaviorspec's `expect` reads its value without `saying`.** The renderer
  writes `expect #toast shows hello` and the parser required `shows saying
  hello`, so every `expect … value` round trip was refused (112 of 448), and
  so was the schema's own `expect #result shows "welcome"` and `expect #button
  has .active`. `saying` is optional now (`markerOptional`), and an assertion
  that takes no value (`appears`, `enabled`, …) refuses one at compile rather
  than dropping it (`expect #toast appears hello`). The gate writes those
  assertions without a value: behaviorspec 384 of 384 round trips, 0 refused.

- **behaviorspec reads `when user types 'hello' into #search`** (the owner's
  call, 2026-10-16; the test-writer demo's form, refused since 4.1.0). The
  typed text is `when`'s optional `value`: a quoted string (or a number) right
  after the action, no marker, and the renderer writes it so (SOV: first,
  `'hello' user #search に types 操作`). `types on 'hello'` still reads, as
  `target`. The gate writes `when` with every role, `value` among them (160
  parses moved, 0 worse).

- **framework 4.8.0** (hyperfixi #1546): behaviorspec, voice and the aggregate
  take `^4.8.0`; the lock holds framework, semantic and intent 4.8.0.
- **An unknown word read into a role is read, not accepted** (the gate's rule
  from framework 4.8.0, the owner's of 2026-10-16): where the parse is the
  text's own with the word in one role and the word reaches the code (sql's
  `where active zzqx`, todo's `list zzqx`, voice's `help zzqx`, learn's three),
  the gate counts it read; where it is read as something else, or goes
  nowhere, it must be refused.
- **behaviorspec's interaction and voice's thing to close read only the words
  their generators know** (`RoleSpec.words`). `when clicks zzqx` read actor
  `clicks`, action `zzqx`, and compiled to a comment, as did `when user frobs`;
  `close zzqx` compiled as a plain `close`. Both are refused now. voice's close
  words gain the vocab's own (pt `aba`, ru `вкладка`, `диалог`) and Arabic
  `الحوار`.
- The domain gate on 4.8.0: 0 worse, 135 better, 0 parses moved; leftover
  input accepted in 10 cases (behaviorspec's `given viewport`, next), down
  from 164 at 4.1.0.

- **voice's `back` and `forward` take a page count only.** `back pages`
  compiled as a plain `back`: the quantity read any word and the generator
  ignored one it could not count. The quantity now reads a number (`back 3`,
  `forward 2`), so a word there is refused (the domain gate: 22 leftover
  cases accepted → refused, 0 worse). The gate also writes `close` with each
  word its generator knows (`tab`, `dialog`, `modal`): 22 more round trips,
  all read back.
- **learn's commanding sentence is semantic's** (hyperfixi domains rethink,
  decision D2): the command a learner is shown and types is what
  `@lokascript/semantic` writes, and so what the hyperscript adapter runs.
  learn wrote its own (`#box .active 追加`, `agrega .active a #box`), which
  semantic read as the source in 74 of 135 cases; now 150 of 150 (15 commands
  × 10 languages) read back as the same command.
  - `createLearnDSL()` reads and writes with semantic: `parse` accepts what
    semantic's `translate` carries whole (input it reads only in part is
    refused, `UnreadInputError`), and only learn's fifteen verbs; `render`,
    `renderLearn` and `generateForFunction(node, 'commanding', lang)` give
    semantic's sentence (`#boxに .activeを 追加`, `agregar .active a #box`,
    `go url "/home"`); `compile` gives it in English; `translate` is
    semantic's, refused as `TranslationReadBackError` where semantic would
    lose part of it.
  - The other six functions (describing, narrating, …), the morphology and
    the glosses stay learn's. The commanding gloss follows semantic's
    sentence word by word; `verbValue` is semantic's word for the verb.
  - `send`'s event and `wait`'s duration take semantic's role names (`event`,
    `duration`; learn called both `patient`); a node with the old name still
    renders. `put` requires its destination, as semantic's does.
  - What semantic does not read, learn no longer reads: `add active to
    button` (no selectors), Spanish `agrega` (semantic reads `agregar`), a
    class name with diacritics (`.año`).
  - The domain gate: learn's round trip 200 of 200 (188 of 210 before; `put`
    without a destination is no longer a command). Three leftover cases read
    the word into a role semantic has and learn does not teach (ja `fetch`'s
    `as`, ar `increment`/`decrement`'s `by`): listed as accepted on framework
    4.7.0, read under 4.8.0's rule.

## 4.1.0

- **Six of the seven DSLs read and write on framework 4.7.0's core**
  (hyperfixi domains rethink Phase 5): sql, llm, flow, voice, todo and
  behaviorspec pass `engine: 'core'` to `createMultilingualDSL`, so the
  aggregate's `@lokascript/framework` peer is now `^4.7.0` (semantic and intent
  stay `^4.0.0`); bdd and learn stay on the classic engine for now. Measured
  on the domain gate: no case worse in any domain, behaviorspec 30 better.
  Two inputs that compiled with a word silently dropped are now refused
  (below).
- **behaviorspec reads and writes on framework's core** (`engine: 'core'`, as
  sql below), and reads 30 sentences it refused before: `when` with an action
  and no actor in ja, ko and tr (`clicks 操作`, for each of the ten actions).
  The domain gate: 336 of 448 round trips (306 before), 0 worse; the 30 new
  ones refuse an unknown word after them, so the 78 accepted leftover cases
  are unchanged.
- **behaviorspec refuses typed text it does not read.** `when user types
  'hello' into #search` compiled to `fill('')`: the classic engine skipped
  `'hello'` on its way to `into` and counted it as read. The typed text is
  `when`'s `target`, which English marks with `on` (`when user types on
  'hello' into #search` fills `hello`); unmarked, the core refuses it.
- The golden patterns differ from `generatePatternVariants`' in the
  template's bracket notation, and in `given`'s greedy `value` and `when`'s
  `actor`, optional roles without a marker, which are optional groups on the
  core (8 languages each).
- **todo reads and writes on framework's core** (`engine: 'core'`, as sql
  below). The domain gate moves no case and no parse: 55 of 55 round trips,
  the same 8 leftover cases accepted. The golden patterns differ from
  `generatePatternVariants`' in the template's bracket notation, and in
  `list`'s optional, marker-less `list` role, an optional group on the core
  (9 languages).
- **todo refuses a multi-word item it does not quote.** `add buy milk to
  groceries` added `buy` and dropped `milk` without a word: the classic engine
  skipped it on its way to `to`. An item is one word or a quoted phrase (`add
  "buy milk" to groceries`); unquoted, the core refuses the rest, and the
  domain dispatcher's routing test now uses the quoted form.
- **voice reads and writes on framework's core** (`engine: 'core'`, as sql
  below). The domain gate moves no case and no parse: 360 of 363 round trips,
  the same 3 refused, and the same 41 leftover cases accepted (an unknown word
  after a `back` / `forward` quantity, a `close` / `help` target). The golden
  patterns differ from `generatePatternVariants`' in the template's bracket
  notation; in the optional, marker-less roles, which are optional groups on
  the core (42: `back` and `forward`'s quantity, `close` and `help`'s
  target); and in ar `focus` and `search`, whose marker carries the schema's
  `renderOverride: { ar: '' }` as `renderSuppress` (voice renders with its
  own renderer, so nothing it writes changes).
- **flow reads and writes on framework's core** (`engine: 'core'`, as sql
  below). The domain gate moves no case and no parse: 297 of 308 round trips,
  the same 11 refused. The golden patterns differ from
  `generatePatternVariants`' in the template's bracket notation, and in
  `capture`: its optional `patient`, which has no marker, is an optional
  group on the core (11 languages), the shape the core's reader gives back to
  the required `destination` after it when it took that value.
- **llm reads and writes on framework's core** (`engine: 'core'`, as sql
  below). The domain gate moves no case and no parse: 61 of 66 round trips,
  the same 5 refused (one now says which words it left unread). The golden
  patterns differ from `generatePatternVariants`' only in the template's
  bracket notation for optional groups.
- **sql reads and writes on framework's core** (`engine: 'core'`, framework
  4.7.0; hyperfixi domains rethink Phase 5). The framework peer is `^4.7.0`;
  on 4.6.0 the option is ignored and sql reads with the classic engine, which
  reads it the same way today. The domain gate moves no case and no parse: 99
  of 99 round trips, and 32 leftover cases still accepted (an unknown word
  after `where …` or `set …`, read into the condition or the values). The
  golden pattern test now pins the patterns the DSL reads with; they differ
  from `generatePatternVariants`' only in the template's notation (optional
  groups in brackets: `select {columns} from {source} [where {condition}]`).
- **Built and tested against `@lokascript/framework`, `semantic` and `intent`
  4.7.0** (lockfile 4.6.0 → 4.7.0; the peers stay `^4.0.0`). The round-trip
  gate and the eight lint tests run on framework's gate kit
  (`@lokascript/framework/testing/gate`), which took this repo's gate code and
  `@lokascript/domain-toolkit`'s lint rules; the toolkit, a private dev
  harness, is retired. The gate reads every case as before (no outcome and no
  parse moved). Nothing a consumer runs changes.

## 4.0.1

- **Built and tested against `@lokascript/framework`, `semantic` and `intent`
  4.6.0** (lockfile 4.5.0 → 4.6.0; the peers stay `^4.0.0`). Framework 4.6.0
  refuses a domain command it did not read to the end, and a translation that
  does not read back as its source. With 4.0.0 it refuses bdd's and
  behaviorspec's hyphenated actions (`double-click`), bdd's `and` steps of
  more than one word, and voice's URL paths, all of which 4.0.0 misread
  without a word; this release reads them (below).
- **bdd and behaviorspec read a hyphenated word as one word.** `When
  double-click on #button`, es `doble-clic`, ar `نقر-مزدوج`, behaviorspec
  `user double-clicks` / `right-clicks` (in English, Arabic and Chinese
  renders too) split at the hyphen and read `double`, so they compiled to a
  comment, or to a plain `click()`. They now compile to `dblclick()` and
  `click({ button: 'right' })`. Found by the domain gate.
- **bdd renders fr `hover` without a target as `survol`**, not `vol sur`: the
  target marker was stripped from inside the word.
- **bdd's `and` reads the rest of its step.** `and #panel is visible` read
  `#panel` as the whole continuation, so a scenario rebuilt it as `given
  #panel` (which fails) and kept a bare `and` step. Its content now runs to
  the end of the step.
- **voice reads a URL path as one value.** `navigate to /home` and `open
  /new-page` read `/` and compiled to `window.location.href = '/'`; voice's
  tokenizers now take a path whole, as behaviorspec's do.
- These three were found by running the suites against framework 4.6.0's
  Phase 3 (a parse refuses input it did not read), which refuses each of
  them; behaviorspec's tests now write a class value with its marker
  (`expect #button has saying .active`), since the unmarked form dropped it.

## 4.0.0

- **BREAKING: built for `@lokascript/framework` 4.x.** The framework,
  semantic and intent peers are `^4.0.0` (3.x is dropped), and the family is
  built and tested against 4.5.0 (lockfile 3.3.0 → 4.5.0). 3.0.1 accepted 4.x
  but was only ever run on it from hyperfixi's side; this release runs its own
  build, typecheck, test gate and pack smoke on 4.x.
- **BREAKING: seven domains retired.** The subpaths `./jsx`, `./animation`,
  `./control`, `./events`, `./html`, `./hypermedia` and `./sprites` are gone,
  and `jsx` leaves `registerAllDomains` and `DOMAIN_PRIORITY` (8 registry
  domains, from 9). Their sources stay under the tag
  `archived/domains-preview-2026-10`. This is the first step of hyperfixi's
  domains rethink (`docs-internal/DOMAINS_RETHINK.md` there), which moves the
  family onto one shared matcher and keeps only the DSLs worth moving:
  events, hypermedia, animation and control emitted hyperscript or a skeleton
  (events partly invalid on the engine), html and sprites had no consumer,
  and sql, flow and behaviorspec already do jsx's job as a second example.
  2.x, which lokascript-learn and lokascript-examples pin, keeps all of them.
- **BREAKING: voice drops `toggle`, `add`, `remove`, `show` and `hide`.** They
  were semantic's hyperscript schemas, borrowed, and voice's generator
  compiled every one of them to `// Unknown voice command: <action>`. semantic
  4.x changed them under voice (toggle gained a `goal` role,
  `toggle between .a and .b`), which failed voice's lint and golden checks.
  `voiceToggleSchema`, `voiceAddSchema`, `voiceRemoveSchema`,
  `voiceShowSchema`, `voiceHideSchema` and `behaviorSchemas` are no longer
  exported. voice's 14 page-control commands are unchanged: their generated
  patterns are identical.
- The private `mcp-multilingual-intent` package (a stale copy of the registry
  behind a Hono Siren API) is retired. Its dispatcher routing guard
  (`add X into Y` → sql, `add X to Y` → todo) moves to domain-config's tests,
  beside the `DOMAIN_PRIORITY` it pins.

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
