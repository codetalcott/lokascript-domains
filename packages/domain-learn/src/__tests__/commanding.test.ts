/**
 * The commanding sentence is the product's (hyperfixi domains rethink, decision D2): for each of
 * learn's fifteen commands, in each of its ten languages, learn writes what `@lokascript/semantic`
 * writes, and reads it back as the same command. It used to write its own (`#box .active 追加`, which
 * semantic, and so the hyperscript adapter, read as the source in 74 of 135 cases).
 */
import { describe, it, expect } from 'vitest';
import { UnreadInputError, extractRoleValue, type SemanticNode } from '@lokascript/framework';
import { translate } from '@lokascript/semantic';
import { createLearnDSL, generateForFunction, generateGloss, LEARN_LANGUAGES } from '../index';

const learn = createLearnDSL();

const COMMANDS = [
  'add .active to #box',
  'remove .active from #box',
  'toggle .active on #box',
  'put "hi" into #box',
  'set x to 5',
  'show #box',
  'hide #box',
  'wait 2s',
  'fetch /api',
  'send click to #box',
  // semantic's English for `go to /home`, so its sentences keep `url` (`url "/home"に 移動`).
  'go url "/home"',
  'increment x',
  'decrement x',
  'take .active from #box',
  'get #box',
];

const reading = (node: SemanticNode) =>
  [
    node.action,
    ...[...node.roles].map(([role]) => `${role}=${extractRoleValue(node, role)}`).sort(),
  ].join(' ');

describe('the commanding sentence is semantic’s', () => {
  const cases = COMMANDS.flatMap(command => LEARN_LANGUAGES.map(lang => [command, lang] as const));

  it.each(cases)(
    '%s, in %s: what semantic writes, read back as the same command',
    (command, lang) => {
      const node = learn.parse(command, 'en');
      const sentence = generateForFunction(node, 'commanding', lang)?.sentence;
      expect(sentence).toBe(translate(command, 'en', lang));
      expect(reading(learn.parse(sentence!, lang))).toBe(reading(node));
    }
  );

  it('accepts a node with learn’s old role names (send’s and wait’s patient)', () => {
    const literal = (value: string) => ({ type: 'literal' as const, value });
    const old = (action: string, roles: Record<string, string>): SemanticNode => ({
      kind: 'command',
      action,
      roles: new Map(Object.entries(roles).map(([k, v]) => [k, literal(v)])),
    });
    expect(
      generateForFunction(
        old('send', { patient: 'click', destination: '#box' }),
        'commanding',
        'ja'
      )?.sentence
    ).toBe(translate('send click to #box', 'en', 'ja'));
    expect(generateForFunction(old('wait', { patient: '2s' }), 'commanding', 'es')?.sentence).toBe(
      translate('wait 2s', 'en', 'es')
    );
    expect(
      generateForFunction(old('send', { patient: 'click' }), 'narrating', 'en')?.sentence
    ).toBe('the system sent click');
  });

  it('reads `go to /home` as the same command as `go url "/home"`', () => {
    expect(reading(learn.parse('go to /home', 'en'))).toBe(
      reading(learn.parse('go url "/home"', 'en'))
    );
  });

  it('compiles to the English command, as semantic writes it', () => {
    expect(learn.compile('#boxに .activeを 追加', 'ja').code).toBe('add .active to #box');
    expect(learn.compile('go to /home', 'en').code).toBe('go url "/home"');
  });

  it('glosses the sentence semantic wrote, word for word', () => {
    const node = learn.parse('add .active to #box', 'en');
    for (const lang of LEARN_LANGUAGES) {
      const gloss = generateGloss(node, 'commanding', lang)!;
      const sentence = generateForFunction(node, 'commanding', lang)!.sentence;
      expect(gloss.tokens.join(' ')).toBe(sentence);
      expect(gloss.roles).toContain('VERB');
      expect(gloss.roles.length).toBe(gloss.tokens.length);
    }
    expect(generateGloss(node, 'commanding', 'zh')).toEqual({
      tokens: ['给', '#box', '添加', '.active'],
      roles: ['DEST.MARK', 'DEST', 'VERB', 'PAT'],
      english: ['to', '#box', 'add (command)', '.active'],
    });
  });
});

describe('what it refuses', () => {
  it('input the product reads only in part', () => {
    expect(() => learn.parse('add .active to #box zzqx', 'en')).toThrow(UnreadInputError);
    expect(learn.validate('#boxに .activeを 追加 zzqx', 'ja')).toMatchObject({
      valid: false,
      errorCode: 'unread-input',
    });
  });

  it('a command that is not one of learn’s', () => {
    expect(() => learn.parse('log x', 'en')).toThrow(/not one of learn's commands/);
  });
});
