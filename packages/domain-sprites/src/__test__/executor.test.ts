import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { SpriteExecutor } from '../executor.js';
import type { SpritesClient } from '../client.js';
import { createSpriteDSL } from '../index.js';
import type { MultilingualDSL } from '@lokascript/framework';

let dsl: MultilingualDSL;

beforeAll(() => {
  dsl = createSpriteDSL();
});

function createMockClient() {
  return {
    createSprite: vi.fn().mockResolvedValue({ id: 'abc', name: 'my-env', status: 'cold' }),
    getSprite: vi.fn().mockResolvedValue({ id: 'abc', name: 'my-env', status: 'running' }),
    deleteSprite: vi.fn().mockResolvedValue(undefined),
    listSprites: vi.fn().mockResolvedValue({ sprites: [{ name: 'a', org_slug: 'org' }] }),
    exec: vi.fn().mockResolvedValue({ stdout: 'ok\n', stderr: '', exit_code: 0 }),
    createCheckpoint: vi.fn().mockResolvedValue({ id: 'chk-1', comment: 'v1' }),
    restoreCheckpoint: vi.fn().mockResolvedValue(undefined),
    createService: vi.fn().mockResolvedValue({ name: 'api', cmd: 'node app.js' }),
    listServices: vi.fn().mockResolvedValue([]),
    getPolicy: vi.fn().mockResolvedValue({ rules: [] }),
    setPolicy: vi.fn().mockResolvedValue(undefined),
  } as unknown as SpritesClient;
}

describe('SpriteExecutor', () => {
  let mockClient: SpritesClient;
  let executor: SpriteExecutor;

  beforeEach(() => {
    mockClient = createMockClient();
    executor = new SpriteExecutor(mockClient);
  });

  // ===========================================================================
  // create
  // ===========================================================================

  describe('create', () => {
    it('should call createSprite with the parsed name', async () => {
      const node = dsl.parse('create myenv', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(result.action).toBe('create');
      expect(mockClient.createSprite).toHaveBeenCalledWith('myenv');
    });
  });

  // ===========================================================================
  // destroy
  // ===========================================================================

  describe('destroy', () => {
    it('should call deleteSprite with the parsed target', async () => {
      const node = dsl.parse('destroy myenv', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(result.action).toBe('destroy');
      expect(mockClient.deleteSprite).toHaveBeenCalledWith('myenv');
    });
  });

  // ===========================================================================
  // list
  // ===========================================================================

  describe('list', () => {
    it('should call listSprites', async () => {
      const node = dsl.parse('list sprites', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(result.action).toBe('list');
      expect(mockClient.listSprites).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // run
  // ===========================================================================

  describe('run', () => {
    it('should call exec with command and target', async () => {
      const node = dsl.parse('run tests on ci', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(result.action).toBe('run');
      expect(mockClient.exec).toHaveBeenCalledWith('ci', 'tests', undefined);
    });

    it('should pass directory option when provided', async () => {
      const node = dsl.parse('run tests on ci in /app', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      // The DSL tokenizer extracts the directory value; verify exec was called with a dir option
      expect(mockClient.exec).toHaveBeenCalledWith(
        'ci',
        'tests',
        expect.objectContaining({ dir: expect.any(String) }),
      );
    });
  });

  // ===========================================================================
  // checkpoint
  // ===========================================================================

  describe('checkpoint', () => {
    it('should call createCheckpoint with target', async () => {
      const node = dsl.parse('checkpoint myenv', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(result.action).toBe('checkpoint');
      expect(mockClient.createCheckpoint).toHaveBeenCalledWith('myenv', undefined);
    });

    it('should pass comment when provided', async () => {
      const node = dsl.parse('checkpoint myenv comment v1', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(mockClient.createCheckpoint).toHaveBeenCalledWith('myenv', 'v1');
    });
  });

  // ===========================================================================
  // restore
  // ===========================================================================

  describe('restore', () => {
    it('should call restoreCheckpoint with target and checkpoint id', async () => {
      const node = dsl.parse('restore myenv to chk123', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(result.action).toBe('restore');
      expect(mockClient.restoreCheckpoint).toHaveBeenCalledWith('myenv', 'chk123');
    });
  });

  // ===========================================================================
  // serve
  // ===========================================================================

  describe('serve', () => {
    it('should call createService with command, name, and target', async () => {
      const node = dsl.parse('serve app as api on myenv', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(result.action).toBe('serve');
      expect(mockClient.createService).toHaveBeenCalledWith('myenv', 'api', { cmd: 'app' });
    });
  });

  // ===========================================================================
  // proxy
  // ===========================================================================

  describe('proxy', () => {
    it('should return error (WebSocket only)', async () => {
      const node = dsl.parse('proxy 3000 on myenv', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(false);
      expect(result.action).toBe('proxy');
      expect(result.error).toContain('WebSocket');
    });
  });

  // ===========================================================================
  // allow / deny
  // ===========================================================================

  describe('allow', () => {
    it('should read-modify-write policy to add allow rule', async () => {
      const node = dsl.parse('allow npmjs on myenv', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(result.action).toBe('allow');
      expect(mockClient.getPolicy).toHaveBeenCalledWith('myenv');
      expect(mockClient.setPolicy).toHaveBeenCalledWith('myenv', [
        { action: 'allow', domain: 'npmjs' },
      ]);
    });

    it('should append to existing rules', async () => {
      (mockClient.getPolicy as ReturnType<typeof vi.fn>).mockResolvedValue({
        rules: [{ action: 'allow', domain: 'existing.com' }],
      });

      const node = dsl.parse('allow npmjs on myenv', 'en');
      await executor.execute(node);

      expect(mockClient.setPolicy).toHaveBeenCalledWith('myenv', [
        { action: 'allow', domain: 'existing.com' },
        { action: 'allow', domain: 'npmjs' },
      ]);
    });
  });

  describe('deny', () => {
    it('should read-modify-write policy to add deny rule', async () => {
      const node = dsl.parse('deny evil on myenv', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(true);
      expect(result.action).toBe('deny');
      expect(mockClient.setPolicy).toHaveBeenCalledWith('myenv', [
        { action: 'deny', domain: 'evil' },
      ]);
    });
  });

  // ===========================================================================
  // Error handling
  // ===========================================================================

  describe('error handling', () => {
    it('should catch client errors and return ok: false', async () => {
      (mockClient.createSprite as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Network error'),
      );

      const node = dsl.parse('create myenv', 'en');
      const result = await executor.execute(node);

      expect(result.ok).toBe(false);
      expect(result.action).toBe('create');
      expect(result.error).toBe('Network error');
    });

    it('should handle unknown action gracefully', async () => {
      // Create a fake node with an unknown action
      const fakeNode = { action: 'teleport', roles: new Map() } as any;
      const result = await executor.execute(fakeNode);

      expect(result.ok).toBe(false);
      expect(result.error).toContain('Unknown action');
    });
  });
});
