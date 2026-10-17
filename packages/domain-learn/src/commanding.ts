/**
 * The commanding sentence is the product's (hyperfixi domains rethink, decision D2): what
 * `@lokascript/semantic` writes for the command in each language, and so what the hyperscript
 * adapter runs. learn's other functions (describing, narrating, …), its morphology and its glosses
 * stay its own, as teaching around it.
 *
 * The sentence is semantic's English render of the command, translated with semantic's loss checks:
 * a command semantic cannot carry whole into a language is refused (`LossyTranslationError`), never
 * shortened.
 */

import type { SemanticNode, SemanticValue } from '@lokascript/framework';
import { render, translate, parse, tryGetProfile } from '@lokascript/semantic';
import type { InterlinearGloss } from './types';

/**
 * Roles learn named `patient` before it read with semantic (`send`'s event, `wait`'s duration): a
 * node built with the old name still reads.
 */
export const LEGACY_PATIENT: Readonly<Record<string, string>> = { send: 'event', wait: 'duration' };

/** The node with semantic's role names, and a bare text value to put as a string. */
export function toSemanticNode(node: SemanticNode): SemanticNode {
  const renamed = LEGACY_PATIENT[node.action];
  const roles = new Map<string, SemanticValue>();
  for (const [role, value] of node.roles) {
    const name = renamed && role === 'patient' && !node.roles.has(renamed) ? renamed : role;
    roles.set(name, name === 'patient' && node.action === 'put' ? asContent(value) : value);
  }
  return { ...node, roles } as SemanticNode;
}

/**
 * `put`'s content: a literal with no type that is not a selector, number or variable is text, so it
 * is written quoted (`put "hi" into #box`, not `put hi`, which reads `hi` as a variable).
 */
function asContent(value: SemanticValue): SemanticValue {
  if (value.type !== 'literal' || 'dataType' in value) return value;
  const text = String(value.value);
  if (/^([#.<[:$@/]|-?\d+(\.\d+)?$)/.test(text)) return value;
  return { ...value, dataType: 'string', quoted: true } as SemanticValue;
}

/** The commanding sentence in `language`; throws semantic's `LossyTranslationError` on a loss. */
export function commandingSentence(node: SemanticNode, language: string): string {
  // semantic's node type narrows `action` to its own actions; learn's are among them.
  const command = toSemanticNode(node) as unknown as Parameters<typeof render>[0];
  return translate(render(command, 'en'), 'en', language);
}

/** The word semantic writes for `verb` in `language` (`追加`, `agregar`). */
export function commandingVerb(verb: string, language: string): string | undefined {
  const keyword = (
    tryGetProfile(language) as { keywords?: Record<string, { primary?: string }> } | undefined
  )?.keywords?.[verb];
  return keyword?.primary;
}

const ROLE_LABELS: Readonly<Record<string, string>> = {
  patient: 'PAT',
  destination: 'DEST',
  source: 'SRC',
  event: 'PAT',
  duration: 'PAT',
};

/** Languages whose role markers follow the value they mark. */
const POSTPOSITIONAL = new Set(['ja', 'ko', 'tr']);

/**
 * The gloss of the commanding sentence, word by word as semantic wrote it: a word that holds a role's
 * value (with its particle, `#boxに`) is that role; the verb is VERB; a marker written apart (`给`, tr
 * `e`) belongs to the role it marks, the next value (or, where markers follow, the previous one).
 * `english` gives each role's value with its English marker (`englishMarker`), the verb as itself.
 */
export function commandingGloss(
  node: SemanticNode,
  language: string,
  englishMarker: (role: string) => string
): InterlinearGloss {
  const sentence = commandingSentence(node, language);
  const read = parse(sentence, language);
  const spans = [...read.roles].flatMap(([role, value]) => {
    const position = (value as { position?: { start: number; end: number } }).position;
    return position ? [{ role, ...position, value: String(sentenceValue(value)) }] : [];
  });
  const verbWords = new Set(
    [
      commandingVerb(node.action, language),
      ...((
        tryGetProfile(language) as
          { keywords?: Record<string, { alternatives?: string[] }> } | undefined
      )?.keywords?.[node.action]?.alternatives ?? []),
    ].filter(Boolean)
  );

  const words = [...sentence.matchAll(/\S+/g)].map(m => ({
    text: m[0],
    start: m.index!,
    end: m.index! + m[0].length,
  }));
  const owner = (w: { start: number; end: number }) =>
    spans.find(s => s.start < w.end && w.start < s.end);

  // A word that is neither a value nor the verb is a marker written apart: of the role it marks.
  const markerRole = words.map((word, i) => {
    if (owner(word) || verbWords.has(word.text)) return undefined;
    const neighbours = POSTPOSITIONAL.has(language)
      ? words.slice(0, i).reverse()
      : words.slice(i + 1);
    return neighbours.map(owner).find(Boolean)?.role ?? null;
  });
  const markedApart = new Set<string>(markerRole.filter((r): r is NonNullable<typeof r> => !!r));

  const tokens: string[] = [];
  const roles: string[] = [];
  const english: string[] = [];
  words.forEach((word, i) => {
    const span = owner(word);
    tokens.push(word.text);
    if (span) {
      roles.push(ROLE_LABELS[span.role] ?? span.role.toUpperCase());
      // Its English marker goes with the value, unless the sentence writes the marker apart.
      const marker = markedApart.has(span.role) ? '' : englishMarker(span.role);
      english.push(marker ? `${marker} ${span.value}` : span.value);
      return;
    }
    if (verbWords.has(word.text)) {
      roles.push('VERB');
      english.push(`${node.action} (command)`);
      return;
    }
    const role = markerRole[i];
    roles.push(role ? `${ROLE_LABELS[role] ?? role.toUpperCase()}.MARK` : 'MARK');
    english.push(role ? englishMarker(role) || `(${role} marker)` : '');
  });
  return { tokens, roles, english };
}

function sentenceValue(value: SemanticValue): unknown {
  return (value as { value?: unknown }).value ?? (value as { raw?: unknown }).raw ?? '';
}
