/**
 * Dispatcher routing guard: `add` across domain-sql + domain-todo.
 *
 * Moved here from mcp-multilingual-intent's detect-domain.test.ts when that
 * package was retired (4.0.0): DOMAIN_PRIORITY lives in this package, so the
 * guard that makes its order load-bearing lives here too.
 *
 * domain-sql aliases `add` → `insert` (requires `into <table>`). domain-todo
 * uses `action: 'add'` (required `<item>`, one word or a quoted phrase,
 * optional `to <list>`). With both registered, routing depends on the
 * `into`/`to` markers and the DOMAIN_PRIORITY tiebreak. `add Alice into users`
 * reads in sql only: todo refuses the `into users` it does not read (framework
 * 4.6.0's whole-input rule), so the priority case below holds even if the
 * tiebreak breaks.
 *
 * These tests pin:
 *   1. Constant-order invariant (cheap — blocks blind reorders of the array).
 *   2. `add X into Y` → sql. Load-bearing on priority (both domains parse it).
 *      Catches: priority reorder; sql's `add` alias or `into` marker breaking.
 *   3. `add "buy milk" to groceries` → todo. Semantics-driven (sql has no `to`).
 *      Catches: sql expanding to accept `to`; todo losing the `to` marker. The
 *      item is quoted: unquoted, framework's classic engine read `buy` and
 *      dropped `milk` without a word; on the core todo refuses it.
 *   4. Bare `add X` → todo. Only todo parses it (sql requires `into`). If sql
 *      ever relaxes its destination requirement this test flips, prompting a
 *      new priority-tiebreak case.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { CrossDomainDispatcher, extractRoleValue } from '@lokascript/framework';
import { createDomainRegistry, DOMAIN_PRIORITY } from '../index';

let dispatcher: CrossDomainDispatcher;

beforeAll(() => {
  dispatcher = new CrossDomainDispatcher(createDomainRegistry(), {
    minConfidence: 0.5,
    priority: DOMAIN_PRIORITY,
  });
});

describe('dispatcher routing: sql vs todo for `add`', () => {
  it('DOMAIN_PRIORITY places sql before todo (blocks blind reorders)', () => {
    expect(DOMAIN_PRIORITY.indexOf('sql')).toBeLessThan(DOMAIN_PRIORITY.indexOf('todo'));
  });

  it('"select name from users" routes to sql', async () => {
    const detected = await dispatcher.detect('select name from users', 'en');
    expect(detected?.domain).toBe('sql');
    expect(String(detected?.node.action)).toBe('select');
  });

  it('"add Alice into users" routes to sql', async () => {
    const detected = await dispatcher.detect('add Alice into users', 'en');
    expect(detected?.domain).toBe('sql');
  });

  it('"add \"buy milk\" to groceries" routes to todo (semantics: sql has no `to` marker)', async () => {
    const detected = await dispatcher.detect('add "buy milk" to groceries', 'en');
    expect(detected?.domain).toBe('todo');
    expect(detected && extractRoleValue(detected.node, 'item')).toBe('buy milk');
  });

  it('bare "add Alice" routes to todo (sql requires `into`; documents the current boundary)', async () => {
    const detected = await dispatcher.detect('add Alice', 'en');
    expect(detected?.domain).toBe('todo');
  });

  it('unrecognized input matches no domain', async () => {
    expect(await dispatcher.detect('zxqw', 'en')).toBeNull();
  });
});
