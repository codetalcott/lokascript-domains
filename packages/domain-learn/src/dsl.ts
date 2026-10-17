/**
 * learn's DSL reads and writes commanding sentences with `@lokascript/semantic` (hyperfixi domains
 * rethink, decision D2): a learner's sentence is read as the product reads it, and a command is
 * written as the product writes it. learn's own grammar (its tokenizers and patterns) no longer
 * reads; its morphology, frames and glosses still write the other functions.
 *
 * What it accepts is what semantic's `translate` carries whole: input semantic reads only in part
 * is refused (`UnreadInputError`), and so is a translation semantic cannot make without a loss
 * (`TranslationReadBackError`, unless `{ lossy: 'allow' }`). It reads learn's fifteen verbs only.
 */

import {
  UnreadInputError,
  TranslationReadBackError,
  type CompileResult,
  type MultilingualDSL,
  type SemanticNode,
  type TranslateOptions,
  type ValidationResult,
} from '@lokascript/framework';
import {
  isExplicitSyntax,
  parse,
  parseExplicit,
  parseWithConfidence,
  translate,
} from '@lokascript/semantic';
import { ALL_VERBS } from './types';
import { allSchemas } from './schemas';
import { LEGACY_PATIENT, commandingSentence } from './commanding';

/** learn's languages. */
export const LEARN_LANGUAGES = [
  'en',
  'ja',
  'es',
  'ar',
  'zh',
  'ko',
  'fr',
  'tr',
  'de',
  'pt',
] as const;

const VERBS: ReadonlySet<string> = new Set(ALL_VERBS);

/** `[send patient:click …]`, as learn wrote `send`'s event and `wait`'s duration before. */
function withSemanticRoles(explicit: string): string {
  const action = /^\[\s*(\w+)/.exec(explicit)?.[1] ?? '';
  const role = LEGACY_PATIENT[action];
  return role ? explicit.replace(/(\s)patient:/, `$1${role}:`) : explicit;
}

function onlyLearnVerbs(node: SemanticNode, input: string): SemanticNode {
  if (!VERBS.has(node.action))
    throw new Error(`"${input}" is ${node.action}, which is not one of learn's commands`);
  return node;
}

/** Read `input` as the product does, refusing what it reads only in part. */
function read(input: string, language: string): { node: SemanticNode; confidence: number } {
  if (isExplicitSyntax(input)) {
    return {
      node: onlyLearnVerbs(parseExplicit(withSemanticRoles(input)) as SemanticNode, input),
      confidence: 1,
    };
  }
  try {
    translate(input, language, 'en');
  } catch (error) {
    const partial = (() => {
      try {
        return parse(input, language) as SemanticNode;
      } catch {
        return null;
      }
    })();
    if (!partial) throw error;
    const why = error instanceof Error ? error.message : String(error);
    throw new UnreadInputError(input, language, partial, why);
  }
  const result = parseWithConfidence(input, language);
  if (!result.node) throw new Error(`Could not parse input in ${language}: ${input}`);
  return {
    node: onlyLearnVerbs(withoutDefaults(result.node as SemanticNode), input),
    confidence: result.confidence,
  };
}

/**
 * Without the roles semantic fills where a sentence leaves them out (`add .active` adds to `me`,
 * `increment x` by 1, `go url "/home"` reads its `method`): a role with no place in the text that
 * learn does not teach, or that is the implicit `me`. A role the text wrote stays, taught or not; a
 * value semantic normalized (es `clic` is `click`) has no place either, and stays.
 */
function withoutDefaults(node: SemanticNode): SemanticNode {
  const taught = new Set(allSchemas.find(s => s.action === node.action)?.roles.map(r => r.role));
  const roles = new Map(
    [...node.roles].filter(([role, value]) => {
      const v = value as { position?: unknown; type?: string; value?: unknown };
      if (v.position !== undefined) return true;
      return taught.has(role) && !(v.type === 'reference' && v.value === 'me');
    })
  );
  return { ...node, roles } as SemanticNode;
}

function failure(error: unknown): { errors: string[]; errorCode?: string } {
  const message = error instanceof Error ? error.message : String(error);
  return error instanceof UnreadInputError
    ? { errors: [message], errorCode: 'unread-input' }
    : { errors: [message] };
}

/** learn's DSL: commanding sentences in its ten languages, read and written by semantic. */
export function createSemanticLearnDSL(): MultilingualDSL {
  return {
    parse: (input, language) => read(input, language).node,

    parseWithConfidence: (input, language) => read(input, language),

    validate(input, language): ValidationResult {
      try {
        return { valid: true, node: read(input, language).node };
      } catch (error) {
        return { valid: false, ...failure(error) };
      }
    },

    /** The commanding sentence in English (what the product runs). */
    compile(input, language): CompileResult {
      try {
        const { node, confidence } = read(input, language);
        return {
          ok: true,
          code: commandingSentence(node, 'en'),
          node,
          metadata: { parser: 'semantic', confidence },
        };
      } catch (error) {
        return { ok: false, ...failure(error) };
      }
    },

    translate(input, from, to, options?: TranslateOptions): string {
      const { node } = read(input, from);
      try {
        return translate(input, from, to, options?.lossy === 'allow' ? { lossy: 'allow' } : {});
      } catch (error) {
        const partial = (error as { partial?: string }).partial ?? '';
        const why = error instanceof Error ? error.message : String(error);
        throw new TranslationReadBackError(partial, from, to, node, null, why);
      }
    },

    /** The commanding sentence, or null where semantic cannot write it whole. */
    render(node, language) {
      try {
        return commandingSentence(node, language);
      } catch {
        return null;
      }
    },

    getSupportedLanguages: () => [...LEARN_LANGUAGES],
  };
}
