/**
 * HTML Code Generator
 *
 * Transforms semantic AST nodes into actual HTML output.
 * Always generates HTML regardless of input language.
 */

import type { SemanticNode, CodeGenerator } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

// =============================================================================
// Helpers
// =============================================================================

/** Strip surrounding quotes from a value like `"primary"` -> `primary` */
function unquote(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  return value;
}

/** Normalize common element aliases to actual HTML tag names */
function resolveTag(element: string): string {
  const aliases: Record<string, string> = {
    paragraph: 'p',
    container: 'div',
  };
  return aliases[element.toLowerCase()] || element.toLowerCase();
}

/** Check if the element value looks like it contains an attribute spec (e.g. "button class") */
function parseElementWithAttribute(raw: string): { tag: string; attrName?: string; attrValue?: string } {
  // Handle cases like: button
  const tag = resolveTag(raw);
  return { tag };
}

// =============================================================================
// Per-Command Generators
// =============================================================================

function generateCreate(node: SemanticNode): string {
  const elementRaw = extractRoleValue(node, 'element') || 'div';
  const attribute = extractRoleValue(node, 'attribute');
  const { tag } = parseElementWithAttribute(elementRaw);

  if (attribute) {
    // Attribute value can be: class "primary", class "btn-lg", etc.
    // Try to parse as "attrName attrValue" or just use as class
    const unquoted = unquote(attribute);
    const parts = unquoted.split(/\s+/);

    // Check if the first part is a known attribute name
    const knownAttrs = ['class', 'id', 'type', 'name', 'style', 'href', 'src', 'alt', 'title'];
    if (parts.length >= 2 && knownAttrs.includes(parts[0].toLowerCase())) {
      const attrName = parts[0].toLowerCase();
      const attrValue = unquote(parts.slice(1).join(' '));
      return `<${tag} ${attrName}="${attrValue}"></${tag}>`;
    }

    // Default: treat as class attribute
    return `<${tag} class="${unquoted}"></${tag}>`;
  }

  return `<${tag}></${tag}>`;
}

function generateNest(node: SemanticNode): string {
  const childRaw = extractRoleValue(node, 'child') || 'p';
  const parentRaw = extractRoleValue(node, 'parent') || 'div';
  const childTag = resolveTag(childRaw);
  const parentTag = resolveTag(parentRaw);

  // If parent looks like a class name (container -> div), wrap with class
  const parentLower = (parentRaw || 'div').toLowerCase();
  if (parentLower === 'container') {
    return `<div class="container"><${childTag}></${childTag}></div>`;
  }

  return `<${parentTag}><${childTag}></${childTag}></${parentTag}>`;
}

function generateLink(node: SemanticNode): string {
  const textRaw = extractRoleValue(node, 'text') || 'Link';
  const url = extractRoleValue(node, 'url') || '#';
  const text = unquote(textRaw);

  return `<a href="${url}">${text}</a>`;
}

function generateLabel(node: SemanticNode): string {
  const targetRaw = extractRoleValue(node, 'target') || '#field';
  const textRaw = extractRoleValue(node, 'text') || 'Label';
  const text = unquote(textRaw);

  // Strip leading # from target ID
  const forId = targetRaw.startsWith('#') ? targetRaw.slice(1) : targetRaw;

  return `<label for="${forId}">${text}</label>`;
}

function generateInput(node: SemanticNode): string {
  const inputType = extractRoleValue(node, 'type') || 'text';
  const nameRaw = extractRoleValue(node, 'name') || 'field';
  const name = unquote(nameRaw);

  return `<input type="${inputType}" name="${name}" />`;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * HTML code generator implementation.
 */
export const htmlCodeGenerator: CodeGenerator = {
  generate(node: SemanticNode): string {
    switch (node.action) {
      case 'create':
        return generateCreate(node);
      case 'nest':
        return generateNest(node);
      case 'link':
        return generateLink(node);
      case 'label':
        return generateLabel(node);
      case 'input':
        return generateInput(node);
      default:
        throw new Error(`Unknown HTML command: ${node.action}`);
    }
  },
};
