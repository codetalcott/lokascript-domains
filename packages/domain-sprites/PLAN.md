# Sprites DSL — Planning Document

A multilingual domain-specific language for managing [Fly.io Sprites](https://sprites.dev), built on `@lokascript/framework`.

---

## 1. Vision & Motivation

### What Are Sprites?

[Fly.io Sprites](https://fly.io/blog/code-and-let-live/) (launched January 2026) are lightweight persistent VMs based on [Firecracker microVMs](https://fly.io/blog/design-and-implementation/):

- **Instant creation**: 1-2 seconds to boot a full Linux environment
- **Persistent storage**: 100GB filesystem survives sleep/wake cycles
- **Auto-sleep**: Hibernates after inactivity, wakes in 100-500ms on demand
- **Scale-to-zero billing**: ~$0.46 for a 4-hour coding session
- **Pre-installed tools**: Node.js 22, Python 3.13, Go, Git, Claude Code
- **Checkpoint/restore**: Snapshot entire filesystem in ~300ms, restore in ~1 second

The primary use case is **AI agent sandboxes** — isolated environments where coding agents operate safely. But Sprites also serve as dev environments, API sandboxes for untrusted code, and lightweight app hosting.

**API surface**: REST at `https://api.sprites.dev/v1/` with [SDKs in Go, TypeScript, Python, and Elixir](https://docs.sprites.dev/api/v001-rc30/).

### Why a DSL?

Managing Sprites currently requires either CLI commands (`sprite create`, `sprite exec`) or SDK code. A DSL adds:

1. **Natural language control**: `create sprite "my-env"` instead of `client.createSprite("my-env")`
2. **MCP integration**: Manage sprites from Claude Code via natural language tools
3. **Multi-step workflows**: `create sprite "ci" then run "npm test" then checkpoint "passed"`
4. **Multilingual access**: Eventually manage sprites in Japanese, Spanish, Arabic, etc.
5. **Composable agent scripts**: Declarative sprite management for agentic workflows

### Target Example

```
Input:  create sprite "my-env"
Output: await client.createSprite("my-env");

Input:  run "npm install express" on "my-env"
Output: await client.sprite("my-env").exec("npm install express");

Input:  checkpoint "my-env" comment "deps installed"
Output: // checkpoint API call with comment metadata
```

---

## 2. Sprites API to DSL Command Mapping

The [Sprites API](https://docs.sprites.dev/api/v001-rc30/) has 7 categories. Each maps to one or more DSL commands:

| API Category | DSL Command | API Method | Primary Role | Example DSL |
| --- | --- | --- | --- | --- |
| Sprites | `create` | `createSprite(name)` | name | `create sprite "my-env"` |
| Sprites | `destroy` | `deleteSprite(name)` | target | `destroy sprite "my-env"` |
| Sprites | `list` | `listAllSprites()` | (none) | `list sprites` |
| Exec | `run` | `sprite.exec(cmd)` | command | `run "npm test" on "my-env"` |
| Checkpoints | `checkpoint` | checkpoint create | target | `checkpoint "my-env" comment "v1"` |
| Checkpoints | `restore` | checkpoint restore | target, id | `restore "my-env" to "abc123"` |
| Services | `serve` | services create | command, name | `serve "node app.js" as "api" on "my-env"` |
| Proxy | `proxy` | TCP tunnel | local port | `proxy 3000 on "my-env"` |
| Policy | `allow`/`deny` | network policy | domain | `allow "*.npmjs.org" on "my-env"` |

### Command Details

**`create`** — Provision a new sprite

```
create sprite "my-env"
create sprite "ci-runner"
```

**`destroy`** — Permanently delete a sprite (irreversible)

```
destroy sprite "my-env"
```

**`list`** — Show all sprites

```
list sprites
```

**`run`** — Execute a command inside a sprite

```
run "npm install" on "my-env"
run "python train.py" on "ml-box" in "/home/sprite/project"
```

**`checkpoint`** — Snapshot the filesystem

```
checkpoint "my-env"
checkpoint "my-env" comment "before upgrade"
```

**`restore`** — Roll back to a checkpoint

```
restore "my-env" to "chk_abc123"
```

**`serve`** — Create a persistent service (survives sleep)

```
serve "node server.js" as "api" on "my-env"
serve "python -m http.server 8080" on "my-env"
```

**`proxy`** — Tunnel a local port to the sprite

```
proxy 3000 on "my-env"
proxy 5432 to 5432 on "db-sprite"
```

**`allow`/`deny`** — Network policy (DNS-based filtering)

```
allow "*.npmjs.org" on "my-env"
deny "*.evil.com" on "my-env"
```

---

## 3. Concrete Schema Designs

Following the `defineCommand()`/`defineRole()` pattern from `@lokascript/framework` (reference: `packages/domain-sql/src/schemas/index.ts`).

### create

```typescript
export const createSchema = defineCommand({
  action: 'create',
  description: 'Provision a new sprite',
  category: 'lifecycle',
  primaryRole: 'name',
  roles: [
    defineRole({
      role: 'name',
      description: 'Sprite name',
      required: true,
      expectedTypes: ['literal'],
      svoPosition: 1,
    }),
  ],
});
```

### destroy

```typescript
export const destroySchema = defineCommand({
  action: 'destroy',
  description: 'Permanently delete a sprite',
  category: 'lifecycle',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Sprite to destroy',
      required: true,
      expectedTypes: ['literal'],
      svoPosition: 1,
    }),
  ],
});
```

### list

```typescript
export const listSchema = defineCommand({
  action: 'list',
  description: 'List all sprites',
  category: 'query',
  primaryRole: 'resource',
  roles: [
    defineRole({
      role: 'resource',
      description: 'Resource type (sprites)',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
    }),
  ],
});
```

### run

```typescript
export const runSchema = defineCommand({
  action: 'run',
  description: 'Execute a command inside a sprite',
  category: 'execution',
  primaryRole: 'command',
  roles: [
    defineRole({
      role: 'command',
      description: 'Command to execute',
      required: true,
      expectedTypes: ['literal'],
      svoPosition: 1,
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['literal'],
      svoPosition: 2,
      markerOverride: { en: 'on' },
    }),
    defineRole({
      role: 'directory',
      description: 'Working directory',
      required: false,
      expectedTypes: ['literal'],
      svoPosition: 3,
      markerOverride: { en: 'in' },
    }),
  ],
});
```

### checkpoint

```typescript
export const checkpointSchema = defineCommand({
  action: 'checkpoint',
  description: 'Snapshot the filesystem',
  category: 'state',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Sprite to checkpoint',
      required: true,
      expectedTypes: ['literal'],
      svoPosition: 1,
    }),
    defineRole({
      role: 'comment',
      description: 'Checkpoint description',
      required: false,
      expectedTypes: ['literal'],
      svoPosition: 2,
      markerOverride: { en: 'comment' },
    }),
  ],
});
```

### restore

```typescript
export const restoreSchema = defineCommand({
  action: 'restore',
  description: 'Roll back to a checkpoint',
  category: 'state',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Sprite to restore',
      required: true,
      expectedTypes: ['literal'],
      svoPosition: 1,
    }),
    defineRole({
      role: 'checkpoint',
      description: 'Checkpoint ID to restore to',
      required: true,
      expectedTypes: ['literal'],
      svoPosition: 2,
      markerOverride: { en: 'to' },
    }),
  ],
});
```

### serve

```typescript
export const serveSchema = defineCommand({
  action: 'serve',
  description: 'Create a persistent background service',
  category: 'services',
  primaryRole: 'command',
  roles: [
    defineRole({
      role: 'command',
      description: 'Service command to run',
      required: true,
      expectedTypes: ['literal'],
      svoPosition: 1,
    }),
    defineRole({
      role: 'name',
      description: 'Service name',
      required: false,
      expectedTypes: ['literal'],
      svoPosition: 2,
      markerOverride: { en: 'as' },
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['literal'],
      svoPosition: 3,
      markerOverride: { en: 'on' },
    }),
  ],
});
```

### proxy

```typescript
export const proxySchema = defineCommand({
  action: 'proxy',
  description: 'Tunnel a local port to a sprite',
  category: 'network',
  primaryRole: 'localPort',
  roles: [
    defineRole({
      role: 'localPort',
      description: 'Local port number',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
    }),
    defineRole({
      role: 'remotePort',
      description: 'Remote port (if different)',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 2,
      markerOverride: { en: 'to' },
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['literal'],
      svoPosition: 3,
      markerOverride: { en: 'on' },
    }),
  ],
});
```

### allow / deny (network policy)

```typescript
export const allowSchema = defineCommand({
  action: 'allow',
  description: 'Allow outbound network access to a domain',
  category: 'policy',
  primaryRole: 'domain',
  roles: [
    defineRole({
      role: 'domain',
      description: 'Domain pattern to allow',
      required: true,
      expectedTypes: ['literal'],
      svoPosition: 1,
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['literal'],
      svoPosition: 2,
      markerOverride: { en: 'on' },
    }),
  ],
});

export const denySchema = defineCommand({
  action: 'deny',
  description: 'Deny outbound network access to a domain',
  category: 'policy',
  primaryRole: 'domain',
  roles: [
    defineRole({
      role: 'domain',
      description: 'Domain pattern to deny',
      required: true,
      expectedTypes: ['literal'],
      svoPosition: 1,
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['literal'],
      svoPosition: 2,
      markerOverride: { en: 'on' },
    }),
  ],
});
```

---

## 4. Code Generator Design

The code generator transforms `SemanticNode` into [`@fly/sprites`](https://github.com/superfly/sprites-js) TypeScript SDK calls.

### SDK API Summary

```typescript
import { SpritesClient } from '@fly/sprites';

const client = new SpritesClient(token);

// Lifecycle
await client.createSprite("name");
await client.deleteSprite("name");
await client.listAllSprites();

// Execution
const sprite = client.sprite("name");
const result = await sprite.exec("command");           // buffered
const cmd = sprite.spawn("command", ["args"]);         // streaming

// Sessions (persistent exec)
const session = sprite.createSession("bash");
await sprite.listSessions();
```

### Generator Output Modes

**Snippet mode** (default) — single expression, assumes `client` and `sprite` exist:

```typescript
// "create sprite my-env"
await client.createSprite("my-env");

// "run npm install on my-env"
await client.sprite("my-env").exec("npm install");

// "checkpoint my-env comment deps installed"
// (checkpoint API — exact SDK method TBD per API docs)
await client.sprite("my-env").checkpoint({ comment: "deps installed" });
```

**Script mode** — full runnable program with imports:

```typescript
import { SpritesClient } from '@fly/sprites';

const client = new SpritesClient(process.env.SPRITE_TOKEN!);
const sprite = await client.createSprite("my-env");
await sprite.exec("npm install");
```

### Generator Implementation

Following the `sql-generator.ts` pattern:

```typescript
import type { SemanticNode, CodeGenerator } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

function generateCreate(node: SemanticNode): string {
  const name = extractRoleValue(node, 'name') || 'my-sprite';
  return `await client.createSprite("${name}");`;
}

function generateRun(node: SemanticNode): string {
  const command = extractRoleValue(node, 'command') || 'echo hello';
  const target = extractRoleValue(node, 'target');
  const dir = extractRoleValue(node, 'directory');

  const sprite = target ? `client.sprite("${target}")` : 'sprite';
  let opts = '';
  if (dir) opts = `, { cwd: "${dir}" }`;
  return `await ${sprite}.exec("${command}"${opts});`;
}

function generateCheckpoint(node: SemanticNode): string {
  const target = extractRoleValue(node, 'target') || 'sprite';
  const comment = extractRoleValue(node, 'comment');
  const opts = comment ? `{ comment: "${comment}" }` : '';
  return `await client.sprite("${target}").checkpoint(${opts});`;
}

// ... similar for restore, destroy, list, serve, proxy, allow, deny

export const spritesCodeGenerator: CodeGenerator = {
  generate(node: SemanticNode): string {
    switch (node.action) {
      case 'create':    return generateCreate(node);
      case 'run':       return generateRun(node);
      case 'checkpoint': return generateCheckpoint(node);
      case 'restore':   return generateRestore(node);
      case 'destroy':   return generateDestroy(node);
      case 'list':      return generateList(node);
      case 'serve':     return generateServe(node);
      case 'proxy':     return generateProxy(node);
      case 'allow':     return generateAllow(node);
      case 'deny':      return generateDeny(node);
      default:
        throw new Error(`Unknown sprite command: ${node.action}`);
    }
  },
};
```

---

## 5. Framework Fit Assessment

### Strong Fits

| Aspect | Why It Works |
| --- | --- |
| Command-role model | Every Sprites API call maps cleanly to an action + named roles |
| `defineCommand()`/`defineRole()` | Captures required/optional params, types, and markers |
| `CodeGenerator` interface | Straightforward transform from semantic → SDK code |
| `createMultilingualDSL()` factory | One function call wires up tokenizer + patterns + generator |
| String literal extraction | Framework's built-in `StringExtractor` handles quoted sprite names and commands |
| English-only MVP | Minimal setup: 1 tokenizer, 1 profile, immediate value |
| Pattern matching | Marker-based role extraction (e.g., "on", "to", "as") is the framework's sweet spot |

**Complexity comparison**: The Sprites DSL is very similar to `domain-sql` in scale — 10 commands (vs SQL's 4), but simpler role structures (mostly name + optional target).

### Challenges & Solutions

**Challenge 1: Multi-step workflows**

```
create sprite "ci" then run "npm test" then checkpoint "passed"
```

The framework handles single commands. Multi-step requires a batch parser.

**Solution**: Follow the BDD domain's `parseBDDScenario()` pattern — split on `then`/newline delimiters, parse each segment independently, return an array of `SemanticNode[]`. The code generator concatenates output:

```typescript
function compileBatch(input: string, language: string): string {
  const steps = input.split(/\s+then\s+/i);
  return steps.map(step => dsl.compile(step, language).code).join('\n');
}
```

**Challenge 2: Streaming exec output**

`sprite.exec()` returns buffered output. `sprite.spawn()` returns a streaming `SpriteCommand` with stdout/stderr events.

**Solution**: Default to `exec()` (simpler). Add an optional `stream` modifier: `run "tail -f log" on "my-env" stream` generates `spawn()` code instead. This can be a boolean flag on the `run` schema or a separate `stream` command.

**Challenge 3: Active sprite context**

The CLI has `sprite use <name>` to set a default. The DSL should support this too.

**Solution**: A `use` command that sets context, making `target` role optional for subsequent commands:

```
use "my-env"
run "npm install"       // implicitly targets "my-env"
checkpoint comment "v1" // implicitly targets "my-env"
```

Implementation: codegen maintains a `currentSprite` variable, omits `client.sprite()` wrapper when target is implicit.

**Challenge 4: Authentication**

The SDK requires `SPRITE_TOKEN`. This is a runtime concern, not a DSL concern.

**Solution**: Script mode generates `process.env.SPRITE_TOKEN!`. Snippet mode assumes `client` exists. No framework changes needed.

---

## 6. MCP Integration

Following the `sql-domain.ts` and `bdd-domain.ts` patterns in `packages/mcp-server/src/tools/`.

### Tool Definitions

```typescript
export const spriteTools = [
  {
    name: 'parse_sprite',
    description: 'Parse a sprite command into a semantic representation',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Sprite command (e.g., "create sprite my-env")' },
        language: { type: 'string', default: 'en', description: 'Language code' },
      },
      required: ['command'],
    },
  },
  {
    name: 'compile_sprite',
    description: 'Compile a sprite command to TypeScript SDK code',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Sprite command' },
        language: { type: 'string', default: 'en' },
        mode: { type: 'string', enum: ['snippet', 'script'], default: 'snippet' },
      },
      required: ['command'],
    },
  },
  {
    name: 'validate_sprite',
    description: 'Validate sprite command syntax',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string' },
        language: { type: 'string', default: 'en' },
      },
      required: ['command'],
    },
  },
  {
    name: 'translate_sprite',
    description: 'Translate a sprite command between languages',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string' },
        from: { type: 'string' },
        to: { type: 'string' },
      },
      required: ['command', 'from', 'to'],
    },
  },
];
```

### Potential: Execute Tool

Unique to this domain — actually run the compiled code:

```typescript
{
  name: 'execute_sprite',
  description: 'Parse, compile, and execute a sprite command (requires SPRITE_TOKEN)',
  inputSchema: {
    type: 'object',
    properties: {
      command: { type: 'string' },
      language: { type: 'string', default: 'en' },
    },
    required: ['command'],
  },
}
```

This would import `@fly/sprites`, compile the DSL input to SDK code, and execute it. Powerful for Claude Code workflows — manage sprites entirely through natural language MCP calls.

---

## 7. Opportunities Beyond MVP

### 7a. Agent Workflow Scripting

Multi-step sprite management for CI/CD-like pipelines:

```
create sprite "pr-123"
run "git clone https://github.com/org/repo" on "pr-123"
run "npm install" on "pr-123"
run "npm test" on "pr-123"
checkpoint "pr-123" comment "tests passed"
destroy sprite "pr-123"
```

Compiles to a complete TypeScript script. Could integrate with GitHub Actions or Claude Code agent workflows.

### 7b. MCP-Native Sprite Management

An MCP server that wraps the Sprites SDK, allowing Claude Code to:

- Create disposable environments for each task
- Run untrusted code in isolated sprites
- Checkpoint before risky operations, restore on failure
- Manage long-running services

This turns Claude Code into a full sprite orchestrator with natural language commands.

### 7c. Hyperscript Integration

Web UIs that manage sprites using hyperscript in the browser:

```html
<button _="on click
  fetch /api/sprites/create with method:'POST' body:{name:'demo'}
  put the result's url into #sprite-url">
  Create Sprite
</button>
```

The Sprites DSL could generate hyperscript fetch commands instead of SDK calls, enabling declarative web UIs for sprite management.

### 7d. Multilingual Expansion

Phase 4 adds 7+ languages. Example translations:

| Command | English | Spanish | Japanese | Arabic |
| --- | --- | --- | --- | --- |
| create | `create sprite "x"` | `crear sprite "x"` | `スプライト "x" を 作成` | `أنشئ sprite "x"` |
| run | `run "cmd" on "x"` | `ejecutar "cmd" en "x"` | `"x" で "cmd" を 実行` | `نفّذ "cmd" على "x"` |
| checkpoint | `checkpoint "x"` | `punto de control "x"` | `"x" を チェックポイント` | `نقطة حفظ "x"` |
| restore | `restore "x" to "id"` | `restaurar "x" a "id"` | `"x" を "id" に 復元` | `استعد "x" إلى "id"` |

The framework handles word order transformation automatically — SOV for Japanese/Korean, VSO for Arabic.

### 7e. Declarative Sprite Configs

Beyond imperative commands, a declarative format for describing desired sprite state:

```yaml
sprite: my-app
services:
  api: "node server.js"
  worker: "python worker.py"
policy:
  allow: ["*.npmjs.org", "*.pypi.org"]
  deny: ["*"]
```

The DSL could parse this and generate the full setup sequence.

---

## 8. Architecture

### Package Structure

```
sprite-dsl/
├── PLAN.md                          # This document
├── package.json                     # Standalone package
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts                     # createSpriteDSL() factory + exports
│   ├── schemas/
│   │   └── index.ts                 # All 10 command schemas
│   ├── profiles/
│   │   └── english.ts               # English pattern profile (MVP)
│   ├── tokenizers/
│   │   └── english.ts               # English tokenizer
│   ├── generators/
│   │   └── sprites-generator.ts     # SemanticNode → @fly/sprites SDK code
│   └── batch/
│       └── batch-parser.ts          # Multi-step "then" chaining (Phase 2)
├── test/
│   ├── parse.test.ts                # Parsing tests for all commands
│   ├── compile.test.ts              # Compilation output tests
│   └── batch.test.ts                # Multi-step workflow tests (Phase 2)
└── mcp/                             # MCP tool definitions (Phase 3)
    └── sprite-tools.ts
```

### Dependencies

```json
{
  "name": "@lokascript/domain-sprites",
  "dependencies": {
    "@lokascript/framework": "^1.0.0"
  },
  "devDependencies": {
    "@fly/sprites": "latest",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^4.0.0"
  }
}
```

Note: `@fly/sprites` is a devDependency — the DSL generates SDK code, it doesn't execute it (except for the optional `execute_sprite` MCP tool).

### Entry Point

```typescript
// src/index.ts
import { createMultilingualDSL } from '@lokascript/framework';
import { allSchemas } from './schemas';
import { englishProfile } from './profiles/english';
import { EnglishSpriteTokenizer } from './tokenizers/english';
import { spritesCodeGenerator } from './generators/sprites-generator';

export function createSpriteDSL() {
  return createMultilingualDSL({
    name: 'Sprites',
    schemas: allSchemas,
    languages: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        tokenizer: EnglishSpriteTokenizer,
        patternProfile: englishProfile,
      },
    ],
    codeGenerator: spritesCodeGenerator,
  });
}
```

---

## 9. Phased Implementation

### Phase 1 — English MVP

**Scope**: 10 commands, English only, TypeScript SDK compilation target

**Deliverables**:

- 10 command schemas (`create`, `destroy`, `list`, `run`, `checkpoint`, `restore`, `serve`, `proxy`, `allow`, `deny`)
- English tokenizer with keyword set + string literal extraction
- English pattern profile with markers (`on`, `to`, `as`, `in`, `comment`)
- TypeScript code generator (snippet mode)
- ~30 tests: parse + compile for each command, including optional roles

**Estimated size**: ~500 lines of source, ~200 lines of tests

**Validation**:

```typescript
const dsl = createSpriteDSL();

// Parse
const node = dsl.parse('create sprite "my-env"', 'en');
expect(node.action).toBe('create');
expect(extractRoleValue(node, 'name')).toBe('my-env');

// Compile
const result = dsl.compile('run "npm test" on "ci"', 'en');
expect(result.ok).toBe(true);
expect(result.code).toContain('sprite("ci").exec("npm test")');
```

### Phase 2 — Multi-Step Workflows

**Scope**: Batch parser, `then` chaining, script mode

**Deliverables**:

- `parseSpriteWorkflow()` function (splits on `then`/newlines)
- Script mode code generator (full program with imports, error handling)
- `use` command for setting active sprite context
- ~15 additional tests

**Example**:

```
create sprite "ci" then
run "npm install" on "ci" then
run "npm test" on "ci" then
checkpoint "ci" comment "tests passed"
```

Compiles to:

```typescript
import { SpritesClient } from '@fly/sprites';

const client = new SpritesClient(process.env.SPRITE_TOKEN!);
await client.createSprite("ci");
const sprite = client.sprite("ci");
await sprite.exec("npm install");
await sprite.exec("npm test");
// checkpoint with comment
```

### Phase 3 — MCP Tools

**Scope**: 4-5 MCP tools for Claude Code integration

**Deliverables**:

- `parse_sprite`, `compile_sprite`, `validate_sprite`, `translate_sprite` tools
- Optional `execute_sprite` tool (requires `SPRITE_TOKEN` at runtime)
- Integration into existing `packages/mcp-server/` or standalone MCP server

### Phase 4 — Multilingual Expansion

**Scope**: Add 7 languages (ES, JA, AR, KO, ZH, TR, FR)

**Deliverables per language**:

- Keyword translations in pattern profile
- Language-specific tokenizer
- Marker overrides on all schemas
- Natural language renderer for translation between languages
- ~10 tests per language

**Target end state**: 8 languages, 100+ tests, full MCP integration, multi-step workflows.

---

## References

- [Sprites.dev](https://sprites.dev/) — Product home
- [Sprites API Docs](https://docs.sprites.dev/api/v001-rc30/) — REST API reference
- [Sprites Quickstart](https://docs.sprites.dev/quickstart/) — Getting started
- [Working with Sprites](https://docs.sprites.dev/working-with-sprites/) — Lifecycle, services, checkpoints
- [sprites-js SDK](https://github.com/superfly/sprites-js) — TypeScript SDK
- [sprites-go SDK](https://github.com/superfly/sprites-go) — Go SDK
- [Simon Willison's analysis](https://simonwillison.net/2026/Jan/9/sprites-dev/) — Developer/API sandbox framing
- [Fly.io launch blog](https://fly.io/blog/code-and-let-live/) — Vision and motivation
- [Design & Implementation](https://fly.io/blog/design-and-implementation/) — Technical architecture
- `@lokascript/framework` — DSL framework ([`packages/framework/`](../hyperfixi/packages/framework/))
- `@lokascript/domain-sql` — Reference domain ([`packages/domain-sql/`](../hyperfixi/packages/domain-sql/))
- `@lokascript/domain-bdd` — Reference domain ([`packages/domain-bdd/`](../hyperfixi/packages/domain-bdd/))
