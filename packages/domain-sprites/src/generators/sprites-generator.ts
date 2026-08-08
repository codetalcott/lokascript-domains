/**
 * Sprites Code Generator
 *
 * Transforms semantic AST nodes into @fly/sprites TypeScript SDK calls.
 * Generates snippet-mode output (single statement, assumes `client` exists).
 */

import type { SemanticNode, CodeGenerator } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';

function q(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`;
}

function generateCreate(node: SemanticNode): string {
  const name = extractRoleValue(node, 'name') || 'my-sprite';
  return `await client.createSprite(${q(name)});`;
}

function generateDestroy(node: SemanticNode): string {
  const target = extractRoleValue(node, 'target') || 'my-sprite';
  return `await client.deleteSprite(${q(target)});`;
}

function generateList(): string {
  return `await client.listAllSprites();`;
}

function generateRun(node: SemanticNode): string {
  const command = extractRoleValue(node, 'command') || 'echo hello';
  const target = extractRoleValue(node, 'target');
  const dir = extractRoleValue(node, 'directory');

  const spriteRef = target ? `client.sprite(${q(target)})` : 'sprite';
  const opts: string[] = [];
  if (dir) opts.push(`cwd: ${q(dir)}`);

  const optsStr = opts.length > 0 ? `, { ${opts.join(', ')} }` : '';
  return `await ${spriteRef}.exec(${q(command)}${optsStr});`;
}

function generateCheckpoint(node: SemanticNode): string {
  const target = extractRoleValue(node, 'target') || 'my-sprite';
  const comment = extractRoleValue(node, 'comment');

  const spriteRef = `client.sprite(${q(target)})`;
  const opts = comment ? `{ comment: ${q(comment)} }` : '';
  return `await ${spriteRef}.checkpoint(${opts});`;
}

function generateRestore(node: SemanticNode): string {
  const target = extractRoleValue(node, 'target') || 'my-sprite';
  const checkpointId = extractRoleValue(node, 'checkpoint') || 'latest';

  return `await client.sprite(${q(target)}).restore(${q(checkpointId)});`;
}

function generateServe(node: SemanticNode): string {
  const command = extractRoleValue(node, 'command') || 'node server.js';
  const name = extractRoleValue(node, 'name');
  const target = extractRoleValue(node, 'target');

  const spriteRef = target ? `client.sprite(${q(target)})` : 'sprite';
  const opts: string[] = [`cmd: ${q(command)}`];
  if (name) opts.push(`name: ${q(name)}`);

  return `await ${spriteRef}.createService({ ${opts.join(', ')} });`;
}

function generateProxy(node: SemanticNode): string {
  const localPort = extractRoleValue(node, 'localPort') || '8080';
  const remotePort = extractRoleValue(node, 'remotePort');
  const target = extractRoleValue(node, 'target');

  const spriteRef = target ? `client.sprite(${q(target)})` : 'sprite';
  const remote = remotePort || localPort;
  return `await ${spriteRef}.proxy(${localPort}, ${remote});`;
}

function generateAllow(node: SemanticNode): string {
  const domain = extractRoleValue(node, 'domain') || '*';
  const target = extractRoleValue(node, 'target');

  const spriteRef = target ? `client.sprite(${q(target)})` : 'sprite';
  return `await ${spriteRef}.addPolicy({ action: "allow", domain: ${q(domain)} });`;
}

function generateDeny(node: SemanticNode): string {
  const domain = extractRoleValue(node, 'domain') || '*';
  const target = extractRoleValue(node, 'target');

  const spriteRef = target ? `client.sprite(${q(target)})` : 'sprite';
  return `await ${spriteRef}.addPolicy({ action: "deny", domain: ${q(domain)} });`;
}

export const spritesCodeGenerator: CodeGenerator = {
  generate(node: SemanticNode): string {
    switch (node.action) {
      case 'create':
        return generateCreate(node);
      case 'destroy':
        return generateDestroy(node);
      case 'list':
        return generateList();
      case 'run':
        return generateRun(node);
      case 'checkpoint':
        return generateCheckpoint(node);
      case 'restore':
        return generateRestore(node);
      case 'serve':
        return generateServe(node);
      case 'proxy':
        return generateProxy(node);
      case 'allow':
        return generateAllow(node);
      case 'deny':
        return generateDeny(node);
      default:
        throw new Error(`Unknown sprite command: ${node.action}`);
    }
  },
};
