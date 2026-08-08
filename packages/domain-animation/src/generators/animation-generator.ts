/**
 * Animation Code Generator
 *
 * Transforms semantic AST nodes into _hyperscript animation syntax.
 * Always generates English _hyperscript output regardless of input language.
 */

import type { SemanticNode, CodeGenerator } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

// =============================================================================
// Slide direction → CSS transform mapping
// =============================================================================

const SLIDE_TRANSFORMS: Record<string, string> = {
  up: 'translateY(-100%)',
  down: 'translateY(100%)',
  left: 'translateX(-100%)',
  right: 'translateX(100%)',
};

// =============================================================================
// Measure property → DOM property mapping
// =============================================================================

const MEASURE_PROPERTIES: Record<string, string> = {
  width: 'offsetWidth',
  height: 'offsetHeight',
  top: 'offsetTop',
  left: 'offsetLeft',
};

// =============================================================================
// Per-Command Generators
// =============================================================================

function generateTransition(node: SemanticNode): string {
  const property = extractRoleValue(node, 'property') || 'opacity';
  const value = extractRoleValue(node, 'value') || '0';
  const duration = extractRoleValue(node, 'duration');

  let code = `transition ${property} to ${value}`;
  if (duration) {
    code += ` over ${duration}`;
  }
  return code;
}

function generateSettle(node: SemanticNode): string {
  const target = extractRoleValue(node, 'target') || 'me';
  return `settle ${target}`;
}

function generateMeasure(node: SemanticNode): string {
  const target = extractRoleValue(node, 'target') || '#box';
  const property = extractRoleValue(node, 'property') || 'width';
  const domProp = MEASURE_PROPERTIES[property] || property;
  return `measure ${target}.${domProp}`;
}

function generateFade(node: SemanticNode): string {
  const target = extractRoleValue(node, 'target') || '#panel';
  const direction = extractRoleValue(node, 'direction') || 'out';
  const duration = extractRoleValue(node, 'duration');
  const opacityValue = direction === 'in' ? '1' : '0';

  let code = `transition opacity to ${opacityValue} on ${target}`;
  if (duration) {
    code += ` over ${duration}`;
  }
  return code;
}

function generateSlide(node: SemanticNode): string {
  const target = extractRoleValue(node, 'target') || '#menu';
  const direction = extractRoleValue(node, 'direction') || 'down';
  const duration = extractRoleValue(node, 'duration');
  const transform = SLIDE_TRANSFORMS[direction] || 'translateY(100%)';

  let code = `transition transform to ${transform} on ${target}`;
  if (duration) {
    code += ` over ${duration}`;
  }
  return code;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Animation code generator implementation.
 */
export const animationCodeGenerator: CodeGenerator = {
  generate(node: SemanticNode): string {
    switch (node.action) {
      case 'transition':
        return generateTransition(node);
      case 'settle':
        return generateSettle(node);
      case 'measure':
        return generateMeasure(node);
      case 'fade':
        return generateFade(node);
      case 'slide':
        return generateSlide(node);
      default:
        throw new Error(`Unknown animation command: ${node.action}`);
    }
  },
};
