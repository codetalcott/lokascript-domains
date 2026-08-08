/**
 * Events Code Generator
 *
 * Transforms semantic AST nodes into _hyperscript event handling syntax.
 * Always generates English _hyperscript output regardless of input language.
 */

import type { SemanticNode, CodeGenerator } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

function generateListen(node: SemanticNode): string {
  const event = extractRoleValue(node, 'event') || 'click';
  const target = extractRoleValue(node, 'target');

  if (target) {
    return `on ${event} from ${target}`;
  }
  return `on ${event}`;
}

function generateTrigger(node: SemanticNode): string {
  const event = extractRoleValue(node, 'event') || 'click';
  const target = extractRoleValue(node, 'target');

  if (target) {
    return `trigger ${event} on ${target}`;
  }
  return `trigger ${event}`;
}

function generateFilter(node: SemanticNode): string {
  const event = extractRoleValue(node, 'event') || 'keydown';
  const condition = extractRoleValue(node, 'condition') || 'Enter';

  return `on ${event}[key is '${condition}']`;
}

function generateDelegate(node: SemanticNode): string {
  const event = extractRoleValue(node, 'event') || 'click';
  const selector = extractRoleValue(node, 'selector') || '.item';
  const container = extractRoleValue(node, 'container');

  if (container) {
    return `on ${event} from ${selector} in ${container}`;
  }
  return `on ${event} from ${selector}`;
}

function generateThrottle(node: SemanticNode): string {
  const event = extractRoleValue(node, 'event') || 'scroll';
  const duration = extractRoleValue(node, 'duration') || '200ms';
  const target = extractRoleValue(node, 'target');

  let code = `on ${event}`;
  if (target) {
    code += ` from ${target}`;
  }
  code += ` throttle ${duration}`;
  return code;
}

function generateDebounce(node: SemanticNode): string {
  const event = extractRoleValue(node, 'event') || 'input';
  const duration = extractRoleValue(node, 'duration') || '300ms';
  const target = extractRoleValue(node, 'target');

  let code = `on ${event}`;
  if (target) {
    code += ` from ${target}`;
  }
  code += ` debounce ${duration}`;
  return code;
}

/**
 * Events code generator implementation.
 */
export const eventsCodeGenerator: CodeGenerator = {
  generate(node: SemanticNode): string {
    switch (node.action) {
      case 'listen':
        return generateListen(node);
      case 'trigger':
        return generateTrigger(node);
      case 'filter':
        return generateFilter(node);
      case 'delegate':
        return generateDelegate(node);
      case 'throttle':
        return generateThrottle(node);
      case 'debounce':
        return generateDebounce(node);
      default:
        throw new Error(`Unknown events command: ${node.action}`);
    }
  },
};
