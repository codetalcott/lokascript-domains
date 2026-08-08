/**
 * Sprite Executor
 *
 * Maps parsed SemanticNode AST to real Sprites API calls via SpritesClient.
 * This is the bridge between "natural language parsed" and "actually executed."
 */

import type { SemanticNode } from '@lokascript/framework';
import { extractRoleValue } from '@lokascript/framework';
import type { SpritesClient } from './client.js';
import type { ExecutionResult } from './types.js';

export class SpriteExecutor {
  constructor(private client: SpritesClient) {}

  async execute(node: SemanticNode): Promise<ExecutionResult> {
    try {
      switch (node.action) {
        case 'create':
          return await this.executeCreate(node);
        case 'destroy':
          return await this.executeDestroy(node);
        case 'list':
          return await this.executeList();
        case 'run':
          return await this.executeRun(node);
        case 'checkpoint':
          return await this.executeCheckpoint(node);
        case 'restore':
          return await this.executeRestore(node);
        case 'serve':
          return await this.executeServe(node);
        case 'proxy':
          return {
            ok: false,
            action: 'proxy',
            error: 'Proxy requires a persistent WebSocket connection and cannot be executed via the REST API. Use the @fly/sprites SDK directly for proxy.',
          };
        case 'allow':
          return await this.executePolicy(node, 'allow');
        case 'deny':
          return await this.executePolicy(node, 'deny');
        default:
          return { ok: false, action: node.action, error: `Unknown action: ${node.action}` };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, action: node.action, error: message };
    }
  }

  private async executeCreate(node: SemanticNode): Promise<ExecutionResult> {
    const name = role(node, 'name') || 'my-sprite';
    const data = await this.client.createSprite(name);
    return { ok: true, action: 'create', data };
  }

  private async executeDestroy(node: SemanticNode): Promise<ExecutionResult> {
    const target = role(node, 'target') || 'my-sprite';
    await this.client.deleteSprite(target);
    return { ok: true, action: 'destroy', data: { deleted: target } };
  }

  private async executeList(): Promise<ExecutionResult> {
    const data = await this.client.listSprites();
    return { ok: true, action: 'list', data };
  }

  private async executeRun(node: SemanticNode): Promise<ExecutionResult> {
    const command = role(node, 'command') || 'echo hello';
    const target = role(node, 'target');
    if (!target) {
      return { ok: false, action: 'run', error: 'No target sprite specified. Use: run <command> on <sprite>' };
    }
    const dir = role(node, 'directory') || undefined;
    const data = await this.client.exec(target, command, dir ? { dir } : undefined);
    return { ok: true, action: 'run', data };
  }

  private async executeCheckpoint(node: SemanticNode): Promise<ExecutionResult> {
    const target = role(node, 'target') || 'my-sprite';
    const comment = role(node, 'comment') || undefined;
    const data = await this.client.createCheckpoint(target, comment);
    return { ok: true, action: 'checkpoint', data };
  }

  private async executeRestore(node: SemanticNode): Promise<ExecutionResult> {
    const target = role(node, 'target') || 'my-sprite';
    const checkpointId = role(node, 'checkpoint') || 'latest';
    await this.client.restoreCheckpoint(target, checkpointId);
    return { ok: true, action: 'restore', data: { restored: target, checkpoint: checkpointId } };
  }

  private async executeServe(node: SemanticNode): Promise<ExecutionResult> {
    const cmd = role(node, 'command') || 'node server.js';
    const serviceName = role(node, 'name') || 'default';
    const target = role(node, 'target');
    if (!target) {
      return { ok: false, action: 'serve', error: 'No target sprite specified. Use: serve <command> as <name> on <sprite>' };
    }
    await this.client.createService(target, serviceName, { cmd });
    return { ok: true, action: 'serve', data: { service: serviceName, sprite: target } };
  }

  private async executePolicy(
    node: SemanticNode,
    action: 'allow' | 'deny',
  ): Promise<ExecutionResult> {
    const domain = role(node, 'domain') || '*';
    const target = role(node, 'target');
    if (!target) {
      return { ok: false, action, error: `No target sprite specified. Use: ${action} <domain> on <sprite>` };
    }
    // Read-modify-write: get current policy, append rule, set updated policy
    const policy = await this.client.getPolicy(target);
    policy.rules.push({ action, domain });
    await this.client.setPolicy(target, policy.rules);
    return { ok: true, action, data: { domain, sprite: target } };
  }
}

/**
 * Extract a role value from a SemanticNode.
 * The framework's extractRoleValue returns '' for missing roles,
 * so we normalize empty string to undefined for cleaner handling.
 */
function role(node: SemanticNode, name: string): string | undefined {
  const value = extractRoleValue(node, name);
  return value || undefined;
}
