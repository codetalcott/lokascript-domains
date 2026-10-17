/**
 * Gloss Generator — Interlinear Gloss for Learning
 *
 * Produces interlinear glosses from a SemanticNode, showing:
 *   tokens:  target language tokens  ["#buttonに", ".activeを", "追加"]
 *   roles:   grammatical labels      ["DEST", "PAT", "VERB"]
 *   english: English gloss           ["to #button", ".active", "add (command)"]
 *
 * The commanding gloss follows the sentence `@lokascript/semantic` writes (the product's, D2),
 * word by word; the other functions' follow learn's own frames.
 *
 * Glosses help ESL students understand the grammatical function of each
 * word/particle in context, and help code students understand the mapping
 * between natural language and programming operations.
 */

import type { SemanticNode } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';
import type { InterlinearGloss, CommunicativeFunction } from '../types';
import { resolveMarker, attachMarker, getProfile, patientOf } from './sentence-generator';
import { commandingGloss } from '../commanding';

/** Abbreviated role labels for gloss display */
const ROLE_LABELS: Record<string, string> = {
  patient: 'PAT',
  destination: 'DEST',
  source: 'SRC',
  instrument: 'INST',
  style: 'STYLE',
  manner: 'MANNER',
};

const FUNCTION_LABELS: Record<string, string> = {
  commanding: 'imperative',
  describing: 'present',
  narrating: 'past',
  questioning: 'question',
  negating: 'negative',
  planning: 'future',
  progressing: 'progressive',
};

/** SOV languages where particles attach to nouns */
const POSTPOSITIONAL = new Set(['ja', 'ko']);

/** Command profiles for gloss generation */
const PROFILES: Record<string, { hasPatient: boolean; targetRole: string | null }> = {
  add: { hasPatient: true, targetRole: 'destination' },
  remove: { hasPatient: true, targetRole: 'source' },
  toggle: { hasPatient: true, targetRole: 'destination' },
  put: { hasPatient: true, targetRole: 'destination' },
  set: { hasPatient: true, targetRole: 'destination' },
  show: { hasPatient: true, targetRole: null },
  hide: { hasPatient: true, targetRole: null },
  get: { hasPatient: false, targetRole: 'source' },
  wait: { hasPatient: true, targetRole: null },
  fetch: { hasPatient: false, targetRole: 'source' },
  send: { hasPatient: true, targetRole: 'destination' },
  go: { hasPatient: false, targetRole: 'destination' },
  increment: { hasPatient: true, targetRole: null },
  decrement: { hasPatient: true, targetRole: null },
  take: { hasPatient: true, targetRole: 'source' },
};

/**
 * Generate an interlinear gloss for a SemanticNode.
 */
export function generateGloss(
  node: SemanticNode,
  fn: CommunicativeFunction,
  language: string
): InterlinearGloss | null {
  const profile = getProfile(language);
  if (!profile) return null;

  const verb = node.action;
  const cmdProfile = PROFILES[verb];
  if (!cmdProfile) return null;

  const forms = profile.morphologyTable[verb];
  if (!forms) return null;

  const frame = profile.frames.frames.find(f => f.function === fn);
  if (!frame) return null;

  // The commanding sentence is semantic's (D2): its gloss follows the words semantic wrote.
  if (fn === 'commanding') {
    try {
      return commandingGloss(node, language, role => {
        const learnRole = role === 'event' || role === 'duration' ? 'patient' : role;
        return resolveMarker(verb, learnRole, 'en').marker;
      });
    } catch {
      return null;
    }
  }

  const tokens: string[] = [];
  const roles: string[] = [];
  const english: string[] = [];

  const patientValue = patientOf(node) || '';
  const targetRole = cmdProfile.targetRole;
  const targetValue = targetRole ? extractRoleValue(node, targetRole) || '' : '';

  const isSOV = profile.frames.wordOrder === 'SOV';

  const pushTarget = () => {
    if (!targetValue || !targetRole) return;
    const marker = resolveMarker(verb, targetRole, language);
    tokens.push(attachMarker(targetValue, marker));
    roles.push(ROLE_LABELS[targetRole] || targetRole.toUpperCase());
    english.push(attachMarker(targetValue, resolveMarker(verb, targetRole, 'en')));
  };
  const pushPatient = () => {
    if (!patientValue || !cmdProfile.hasPatient) return;
    const marker = resolveMarker(verb, 'patient', language);
    tokens.push(attachMarker(patientValue, marker));
    roles.push(ROLE_LABELS.patient);
    english.push(attachMarker(patientValue, resolveMarker(verb, 'patient', 'en')));
  };

  // SOV: target, patient, verb. SVO: patient, target — except `set`, which writes the variable
  // (its target) before the value in every language, as the sentence generator does.
  if (isSOV || verb === 'set') {
    pushTarget();
    pushPatient();
  } else {
    pushPatient();
    pushTarget();
  }

  // Resolve verb form
  const verbFormPath = frame.verbForm;
  const parts = verbFormPath.split('.');
  let verbValue: unknown = forms;
  for (const part of parts) {
    if (verbValue == null || typeof verbValue !== 'object') break;
    verbValue = (verbValue as Record<string, unknown>)[part];
  }
  const verbStr = typeof verbValue === 'string' ? verbValue : verb;

  if (isSOV) {
    // Verb last in SOV
    tokens.push(verbStr);
    roles.push('VERB');
    english.push(`${verb} (${FUNCTION_LABELS[fn] || fn})`);
  } else {
    // Verb first in SVO — prepend
    tokens.unshift(verbStr);
    roles.unshift('VERB');
    english.unshift(`${verb} (${FUNCTION_LABELS[fn] || fn})`);
  }

  return { tokens, roles, english };
}
