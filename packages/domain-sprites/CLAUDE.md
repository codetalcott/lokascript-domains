# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**sprite-dsl** (`@lokascript/domain-sprites`) is a multilingual DSL for managing Fly.io Sprites (lightweight persistent VMs). It transforms natural language commands into `@fly/sprites` TypeScript SDK code. Built on the `@lokascript/framework` (linked locally from `../hyperfixi/packages/framework`).

Currently Phase 1 (English MVP) with 10 commands: create, destroy, list, run, checkpoint, restore, serve, proxy, allow, deny.

## Commands

```bash
npm run build          # Build with tsup (ESM + CJS) + type declarations
npm run test           # Run tests in watch mode (vitest)
npm run test:run       # Run tests once
npm run test:check     # Run tests with dot reporter (minimal output)
npm run typecheck      # TypeScript type checking only (tsc --noEmit)
```

Run a single test file:
```bash
npx vitest run src/__test__/sprites-domain.test.ts
```

Run a single test by name:
```bash
npx vitest run -t "create command"
```

## Architecture

The DSL follows a 4-layer pipeline defined by `@lokascript/framework`:

```
Natural Language Input → Tokenizer → Pattern Profile → Semantic Parser → Code Generator → SDK Code
```

### Key Layers

1. **Schemas** (`src/schemas/index.ts`) — Command definitions using `defineCommand()`/`defineRole()`. Each command has an action, category, primary role, and additional roles with markers (e.g., `on`, `to`, `as`, `in`, `comment`) and SVO positions for grammar ordering.

2. **Tokenizer** (`src/tokenizers/english.ts`) — English tokenizer via `createSimpleTokenizer()`. Case-insensitive keyword matching for commands, markers, and filler words.

3. **Pattern Profile** (`src/profiles/english.ts`) — English-specific SVO word order patterns. Maps action keywords to primary forms.

4. **Code Generator** (`src/generators/sprites-generator.ts`) — Transforms `SemanticNode` AST into TypeScript SDK calls (e.g., `await client.sprite("ci").exec("npm test")`). Operates in snippet mode (single statement, assumes `client` exists).

### Entry Point

`src/index.ts` exports `createSpriteDSL()` which wires all layers into a `MultilingualDSL` instance via `createMultilingualDSL()`.

### REST Client & Executor

5. **REST Client** (`src/client.ts`) — Thin HTTP client for `https://api.sprites.dev/v1` using global `fetch()`. Covers all 10 commands including checkpoint/restore/services/policy (which the `@fly/sprites` SDK does not). No external HTTP dependencies.

6. **Executor** (`src/executor.ts`) — `SpriteExecutor` maps parsed `SemanticNode` directly to REST client calls. Uses `extractRoleValue()` from framework. Returns `ExecutionResult` with `{ok, action, data?, error?}`. Proxy returns an error (WebSocket-only). Allow/deny use read-modify-write on the policy endpoint.

7. **Types** (`src/types.ts`) — Shared types: `SpritesClientConfig`, `Sprite`, `ExecResult`, `Checkpoint`, `ExecutionResult`, `SpritesApiError`.

### MCP Server

8. **MCP Tools** (`src/mcp/tools.ts`) — 5 tools following `sql-domain.ts` pattern: `parse_sprite`, `compile_sprite`, `validate_sprite`, `execute_sprite`, `translate_sprite`. Lazy-loads DSL instance.

9. **MCP Entry Point** (`src/mcp/index.ts`) — Standalone stdio MCP server (`@lokascript/sprites-mcp`). Binary: `sprites-mcp`.

MCP server test: `echo '{"jsonrpc":"2.0","id":1,"method":"initialize",...}' | node dist/mcp/index.js`

## Key Patterns

- **Command-Role Model**: Every command = action + named roles. Roles have `svoPosition` (grammar ordering), `markerOverride` (language keyword like "on"/"to"), `required` flag, and `expectedTypes`.
- **Snippet output mode**: Generator produces single `await` statements, not full programs.
- **REST over SDK**: The executor uses the Sprites REST API directly rather than the `@fly/sprites` SDK, because the SDK doesn't cover checkpoint, restore, services, proxy, or network policy.
- **`extractRoleValue` returns `''`** for missing roles (not `undefined`). Use `|| fallback` to normalize.
- **Tests**: 84 tests across 4 files — DSL parsing/compilation, REST client (mocked fetch), executor (mocked client), MCP tool handlers.
