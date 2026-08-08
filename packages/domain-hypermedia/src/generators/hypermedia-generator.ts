/**
 * Hypermedia Code Generator
 *
 * Transforms semantic AST nodes into _hyperscript hypermedia syntax.
 * Always generates English _hyperscript output regardless of input language.
 *
 * Code generation rules:
 * - request /api/users into #list        → fetch /api/users then put the result into #list
 * - swap response into #container        → swap innerHTML of #container with response
 * - swap response into #container with outerHTML → swap outerHTML of #container with response
 * - morph response into #panel           → morph #panel with response
 * - push /products/1                     → push url "/products/1"
 * - replace /products/1                  → replace url "/products/1"
 */

import type { SemanticNode, CodeGenerator } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

function generateRequest(node: SemanticNode): string {
  const url = extractRoleValue(node, 'url') || '/api/data';
  const destination = extractRoleValue(node, 'destination');

  if (destination) {
    return `fetch ${url} then put the result into ${destination}`;
  }
  return `fetch ${url}`;
}

function generateSwap(node: SemanticNode): string {
  const content = extractRoleValue(node, 'content') || 'response';
  const target = extractRoleValue(node, 'target') || '#container';
  const strategy = extractRoleValue(node, 'strategy') || 'innerHTML';

  return `swap ${strategy} of ${target} with ${content}`;
}

function generateMorph(node: SemanticNode): string {
  const content = extractRoleValue(node, 'content') || 'response';
  const target = extractRoleValue(node, 'target') || '#panel';

  return `morph ${target} with ${content}`;
}

function generatePush(node: SemanticNode): string {
  const url = extractRoleValue(node, 'url') || '/';

  return `push url "${url}"`;
}

function generateReplace(node: SemanticNode): string {
  const url = extractRoleValue(node, 'url') || '/';

  return `replace url "${url}"`;
}

/**
 * Hypermedia code generator implementation.
 */
export const hypermediaCodeGenerator: CodeGenerator = {
  generate(node: SemanticNode): string {
    switch (node.action) {
      case 'request':
        return generateRequest(node);
      case 'swap':
        return generateSwap(node);
      case 'morph':
        return generateMorph(node);
      case 'push':
        return generatePush(node);
      case 'replace':
        return generateReplace(node);
      default:
        throw new Error(`Unknown hypermedia command: ${node.action}`);
    }
  },
};
