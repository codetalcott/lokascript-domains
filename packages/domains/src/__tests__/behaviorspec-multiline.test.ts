/**
 * The multi-line half of the domain gate (#54). The gate's round trips are single statements, and a
 * multi-line spec goes through a different path: `compileBehaviorSpec` parses it line by line, and it
 * used to return the test file without every line it could not read (`ok: true` through MCP's
 * `compile_behaviorspec`). A `given page` URL also took the rest of its line. Runs on the BUILT dist,
 * the module `@hyperfixi/mcp-server` imports.
 */
import { describe, it, expect } from 'vitest';
// eslint-disable-next-line import/no-relative-packages -- dist-level on purpose
import { BehaviorSpecError, compileBehaviorSpec, compileFeatureSpec, createBehaviorSpecDSL } from '../../dist/behaviorspec.js';

const steps = (code: string) => code.split('\n').filter(line => line.includes('await '));

function refusal(spec: string, compile = compileBehaviorSpec): BehaviorSpecError {
  try {
    compile(spec, 'en');
  } catch (err) {
    if (err instanceof BehaviorSpecError) return err;
    throw err;
  }
  throw new Error(`compiled without refusing: ${JSON.stringify(spec)}`);
}

describe('behaviorspec, multi-line', () => {
  it('compiles every step of a spec it reads', () => {
    const code = compileBehaviorSpec(
      `test "Login"
  given page /login
  when user types 'admin' into #user
  when user clicks on #submit
    #result appears`,
      'en'
    );
    expect(steps(code)).toEqual([
      "  await page.goto('/login');",
      "  await page.locator('#user').fill('admin');",
      "  await page.locator('#submit').click();",
      "  await expect(page.locator('#result')).toBeVisible();",
    ]);
  });

  it('refuses a spec with a line it cannot read, naming each line (the issue repro)', () => {
    const err = refusal(`test "Login"
  given page /login
  when I click #submit
  then #result is visible`);
    expect(err.errors).toHaveLength(2);
    expect(err.errors[0]).toMatch(/^Line 3: .*when I click #submit/);
    expect(err.errors[1]).toMatch(/^Line 4: .*then #result is visible/);
    // The file it used to return is kept for a caller that wants to show it, never returned.
    expect(steps(err.partial)).toEqual(["  await page.goto('/login');"]);
  });

  it('refuses a spec none of whose lines read, rather than an empty test', () => {
    const err = refusal('when I click #submit\nthen #result is visible');
    expect(err.errors).toHaveLength(2);
    expect(steps(err.partial)).toEqual([]);
  });

  it('refuses a feature spec with a line it cannot read', () => {
    const err = refusal(
      `feature "Auth"
  setup
    given page /login
  test "Bad step"
    when I click #submit`,
      compileFeatureSpec
    );
    expect(err.errors.some(e => e.includes('when I click #submit'))).toBe(true);
  });
});

describe('behaviorspec, given page', () => {
  const dsl = createBehaviorSpecDSL();

  it.each([
    ['given page /login when I click #b', 'when I click #b'],
    ['given page /login then #a is visible', 'then #a is visible'],
    ['given page /login and user clicks on #b', 'and user clicks on #b'],
  ])('a URL ends at whitespace: %s is refused', (input, unread) => {
    const result = dsl.compile(input, 'en');
    expect(result.ok).toBe(false);
    expect(result.errors?.[0]).toContain(`leaving "${unread}" unread`);
  });

  it('still reads a URL, a page state and a viewport', () => {
    expect(dsl.compile('given page /login', 'en').code).toBe("  await page.goto('/login');");
    expect(dsl.compile('given page is loaded', 'en').ok).toBe(true);
    expect(dsl.compile('given viewport 375x812', 'en').ok).toBe(true);
  });

  it('refuses the one-line spelling inside a multi-line spec', () => {
    expect(() => compileBehaviorSpec('test "B"\n  given page /login when user clicks on #b', 'en')).toThrow(
      /leaving "when user clicks on #b" unread/
    );
  });
});
