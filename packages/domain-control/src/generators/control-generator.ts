/**
 * Control Flow Code Generator
 *
 * Transforms semantic AST nodes into _hyperscript control flow syntax.
 * Always generates English _hyperscript output regardless of input language.
 *
 * Mappings:
 *   check  → if <condition> then ... end
 *   repeat → repeat <n> times ... end
 *   iterate → repeat for <var> in <collection> ... end
 *   guard  → if <condition> is false then return end
 *   loop while → repeat while <condition> ... end
 *   loop until → repeat until <condition> ... end
 */

import type { SemanticNode, CodeGenerator } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

function generateCheck(node: SemanticNode): string {
  const condition = extractRoleValue(node, 'condition') || '#input is empty';
  return `if ${condition} then ... end`;
}

function generateRepeat(node: SemanticNode): string {
  const count = extractRoleValue(node, 'count') || '5';
  return `repeat ${count} times ... end`;
}

function generateIterate(node: SemanticNode): string {
  const collection = extractRoleValue(node, 'collection') || '.items';
  const variable = extractRoleValue(node, 'variable') || 'item';
  return `repeat for ${variable} in ${collection} ... end`;
}

function generateGuard(node: SemanticNode): string {
  const condition = extractRoleValue(node, 'condition') || '#form is valid';
  // Guard inverts the condition — if NOT met, return early
  return `if ${condition} is false then return end`;
}

function generateLoop(node: SemanticNode): string {
  const condition = extractRoleValue(node, 'condition') || '#spinner is visible';
  const mode = extractRoleValue(node, 'mode') || 'while';
  return `repeat ${mode} ${condition} ... end`;
}

/**
 * Control flow code generator implementation.
 */
export const controlCodeGenerator: CodeGenerator = {
  generate(node: SemanticNode): string {
    switch (node.action) {
      case 'check':
        return generateCheck(node);
      case 'repeat':
        return generateRepeat(node);
      case 'iterate':
        return generateIterate(node);
      case 'guard':
        return generateGuard(node);
      case 'loop':
        return generateLoop(node);
      default:
        throw new Error(`Unknown control command: ${node.action}`);
    }
  },
};
