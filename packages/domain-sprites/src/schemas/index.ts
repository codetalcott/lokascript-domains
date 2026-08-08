/**
 * Sprite Command Schemas
 *
 * Defines the semantic structure of Sprites DSL commands using the framework's
 * defineCommand/defineRole helpers. 10 commands covering all Sprites API categories:
 * lifecycle (create, destroy, list), execution (run), state (checkpoint, restore),
 * services (serve), network (proxy, allow, deny).
 *
 * svoPosition: higher = earlier in SVO patterns (closer to verb).
 * sovPosition: higher = earlier in SOV patterns (Japanese, Korean, Turkish).
 * e.g., SVO `run <command:3> on <target:2> in <directory:1>`
 * e.g., SOV `<target:3> で <command:2> を <directory:1> に 実行`
 */

import { defineCommand, defineRole } from '@lokascript/framework';

// =============================================================================
// CREATE — Provision a new sprite
// =============================================================================

export const createSchema = defineCommand({
  action: 'create',
  description: 'Provision a new sprite',
  category: 'lifecycle',
  primaryRole: 'name',
  roles: [
    defineRole({
      role: 'name',
      description: 'Sprite name',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      markerOverride: { ja: 'を' },
    }),
  ],
});

// =============================================================================
// DESTROY — Permanently delete a sprite
// =============================================================================

export const destroySchema = defineCommand({
  action: 'destroy',
  description: 'Permanently delete a sprite',
  category: 'lifecycle',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Sprite to destroy',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      markerOverride: { ja: 'を' },
    }),
  ],
});

// =============================================================================
// LIST — List all sprites
// =============================================================================

export const listSchema = defineCommand({
  action: 'list',
  description: 'List all sprites',
  category: 'query',
  primaryRole: 'resource',
  roles: [
    defineRole({
      role: 'resource',
      description: 'Resource type (sprites)',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
    }),
  ],
});

// =============================================================================
// RUN — Execute a command inside a sprite
// run <command> on <target> in <directory>
// =============================================================================

export const runSchema = defineCommand({
  action: 'run',
  description: 'Execute a command inside a sprite',
  category: 'execution',
  primaryRole: 'command',
  roles: [
    defineRole({
      role: 'command',
      description: 'Command to execute',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 3,
      sovPosition: 2,
      markerOverride: { ja: 'を' },
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 3,
      markerOverride: { en: 'on', es: 'en', ja: 'で', ar: 'على' },
    }),
    defineRole({
      role: 'directory',
      description: 'Working directory',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
      markerOverride: { en: 'in', es: 'dentro', ja: 'に', ar: 'في' },
    }),
  ],
});

// =============================================================================
// CHECKPOINT — Snapshot the filesystem
// checkpoint <target> comment <comment>
// =============================================================================

export const checkpointSchema = defineCommand({
  action: 'checkpoint',
  description: 'Snapshot the filesystem state',
  category: 'state',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Sprite to checkpoint',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      markerOverride: { ja: 'を' },
    }),
    defineRole({
      role: 'comment',
      description: 'Checkpoint description',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
      markerOverride: { en: 'comment', es: 'comentario', ja: 'コメント', ar: 'تعليق' },
    }),
  ],
});

// =============================================================================
// RESTORE — Roll back to a checkpoint
// restore <target> to <checkpoint>
// =============================================================================

export const restoreSchema = defineCommand({
  action: 'restore',
  description: 'Roll back to a checkpoint',
  category: 'state',
  primaryRole: 'target',
  roles: [
    defineRole({
      role: 'target',
      description: 'Sprite to restore',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      markerOverride: { ja: 'を' },
    }),
    defineRole({
      role: 'checkpoint',
      description: 'Checkpoint ID to restore to',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 1,
      markerOverride: { en: 'to', es: 'a', ja: 'に', ar: 'إلى' },
    }),
  ],
});

// =============================================================================
// SERVE — Create a persistent background service
// serve <command> as <name> on <target>
// =============================================================================

export const serveSchema = defineCommand({
  action: 'serve',
  description: 'Create a persistent background service',
  category: 'services',
  primaryRole: 'command',
  roles: [
    defineRole({
      role: 'command',
      description: 'Service command to run',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 3,
      sovPosition: 2,
      markerOverride: { ja: 'を' },
    }),
    defineRole({
      role: 'name',
      description: 'Service name',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
      markerOverride: { en: 'as', es: 'como', ja: 'として', ar: 'كـ' },
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 3,
      markerOverride: { en: 'on', es: 'en', ja: 'で', ar: 'على' },
    }),
  ],
});

// =============================================================================
// PROXY — Tunnel a local port to a sprite
// proxy <localPort> to <remotePort> on <target>
// =============================================================================

export const proxySchema = defineCommand({
  action: 'proxy',
  description: 'Tunnel a local port to a sprite',
  category: 'network',
  primaryRole: 'localPort',
  roles: [
    defineRole({
      role: 'localPort',
      description: 'Local port number',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 3,
      sovPosition: 2,
      markerOverride: { ja: 'を' },
    }),
    defineRole({
      role: 'remotePort',
      description: 'Remote port (if different from local)',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
      markerOverride: { en: 'to', es: 'a', ja: 'に', ar: 'إلى' },
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 3,
      markerOverride: { en: 'on', es: 'en', ja: 'で', ar: 'على' },
    }),
  ],
});

// =============================================================================
// ALLOW — Allow outbound network access
// allow <domain> on <target>
// =============================================================================

export const allowSchema = defineCommand({
  action: 'allow',
  description: 'Allow outbound network access to a domain',
  category: 'policy',
  primaryRole: 'domain',
  roles: [
    defineRole({
      role: 'domain',
      description: 'Domain pattern to allow',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
      markerOverride: { ja: 'を' },
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: { en: 'on', es: 'en', ja: 'で', ar: 'على' },
    }),
  ],
});

// =============================================================================
// DENY — Deny outbound network access
// deny <domain> on <target>
// =============================================================================

export const denySchema = defineCommand({
  action: 'deny',
  description: 'Deny outbound network access to a domain',
  category: 'policy',
  primaryRole: 'domain',
  roles: [
    defineRole({
      role: 'domain',
      description: 'Domain pattern to deny',
      required: true,
      expectedTypes: ['expression'],
      svoPosition: 2,
      sovPosition: 1,
      markerOverride: { ja: 'を' },
    }),
    defineRole({
      role: 'target',
      description: 'Target sprite',
      required: false,
      expectedTypes: ['expression'],
      svoPosition: 1,
      sovPosition: 2,
      markerOverride: { en: 'on', es: 'en', ja: 'で', ar: 'على' },
    }),
  ],
});

// =============================================================================
// All Schemas
// =============================================================================

export const allSchemas = [
  createSchema,
  destroySchema,
  listSchema,
  runSchema,
  checkpointSchema,
  restoreSchema,
  serveSchema,
  proxySchema,
  allowSchema,
  denySchema,
];
