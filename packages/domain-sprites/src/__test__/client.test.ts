import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SpritesClient } from '../client.js';
import { SpritesApiError } from '../types.js';

// Mock global fetch
const mockFetch = vi.fn();
const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = mockFetch;
  mockFetch.mockReset();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function jsonResponse(data: unknown, status = 200) {
  return {
    ok: true,
    status,
    statusText: 'OK',
    json: async () => data,
    text: async () => JSON.stringify(data),
  };
}

function ndjsonResponse(lines: unknown[]) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    text: async () => lines.map(l => JSON.stringify(l)).join('\n'),
  };
}

function errorResponse(status: number, statusText: string, body?: unknown) {
  return {
    ok: false,
    status,
    statusText,
    json: async () => body ?? { error: statusText },
  };
}

describe('SpritesClient', () => {
  let client: SpritesClient;

  beforeEach(() => {
    client = new SpritesClient({ token: 'test-token-123' });
  });

  // ===========================================================================
  // Auth
  // ===========================================================================

  describe('authentication', () => {
    it('should include Bearer token in all requests', async () => {
      mockFetch.mockResolvedValueOnce(jsonResponse({ sprites: [] }));
      await client.listSprites();
      const [, init] = mockFetch.mock.calls[0];
      expect(init.headers.Authorization).toBe('Bearer test-token-123');
    });
  });

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  describe('createSprite', () => {
    it('should POST /sprites with name', async () => {
      const sprite = { id: 'abc', name: 'my-env', status: 'cold' };
      mockFetch.mockResolvedValueOnce(jsonResponse(sprite));

      const result = await client.createSprite('my-env');

      expect(result.name).toBe('my-env');
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe('https://api.sprites.dev/v1/sprites');
      expect(init.method).toBe('POST');
      expect(JSON.parse(init.body)).toEqual({ name: 'my-env' });
    });
  });

  describe('getSprite', () => {
    it('should GET /sprites/{name}', async () => {
      const sprite = { id: 'abc', name: 'my-env', status: 'running' };
      mockFetch.mockResolvedValueOnce(jsonResponse(sprite));

      const result = await client.getSprite('my-env');

      expect(result.status).toBe('running');
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe('https://api.sprites.dev/v1/sprites/my-env');
      expect(init.method).toBe('GET');
    });
  });

  describe('deleteSprite', () => {
    it('should DELETE /sprites/{name}', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        statusText: 'No Content',
        json: async () => undefined,
      });

      await client.deleteSprite('my-env');

      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe('https://api.sprites.dev/v1/sprites/my-env');
      expect(init.method).toBe('DELETE');
    });
  });

  describe('listSprites', () => {
    it('should GET /sprites', async () => {
      const data = { sprites: [{ name: 'a', org_slug: 'org' }] };
      mockFetch.mockResolvedValueOnce(jsonResponse(data));

      const result = await client.listSprites();

      expect(result.sprites).toHaveLength(1);
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe('https://api.sprites.dev/v1/sprites');
    });
  });

  // ===========================================================================
  // Execution
  // ===========================================================================

  describe('exec', () => {
    it('should POST /sprites/{name}/exec with cmd param', async () => {
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ stdout: 'hello\n', stderr: '', exit_code: 0 }),
      );

      const result = await client.exec('my-env', 'echo hello');

      expect(result.stdout).toBe('hello\n');
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toContain('/sprites/my-env/exec');
      expect(url).toContain('cmd=echo+hello');
      expect(init.method).toBe('POST');
    });

    it('should include dir option as query param', async () => {
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ stdout: '', stderr: '', exit_code: 0 }),
      );

      await client.exec('my-env', 'ls', { dir: '/app' });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('dir=%2Fapp');
    });
  });

  // ===========================================================================
  // Checkpoints
  // ===========================================================================

  describe('createCheckpoint', () => {
    it('should POST /sprites/{name}/checkpoint and parse NDJSON', async () => {
      mockFetch.mockResolvedValueOnce(
        ndjsonResponse([
          { status: 'started' },
          { id: 'chk-1', comment: 'v1' },
        ]),
      );

      const result = await client.createCheckpoint('my-env', 'v1');

      expect(result.id).toBe('chk-1');
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toContain('/sprites/my-env/checkpoint');
      expect(init.method).toBe('POST');
      expect(JSON.parse(init.body)).toEqual({ comment: 'v1' });
    });

    it('should work without comment', async () => {
      mockFetch.mockResolvedValueOnce(
        ndjsonResponse([{ id: 'chk-2' }]),
      );

      const result = await client.createCheckpoint('my-env');

      expect(result.id).toBe('chk-2');
      const [, init] = mockFetch.mock.calls[0];
      expect(init.body).toBeUndefined();
    });
  });

  describe('restoreCheckpoint', () => {
    it('should POST /sprites/{name}/checkpoints/{id}/restore', async () => {
      mockFetch.mockResolvedValueOnce(
        ndjsonResponse([{ status: 'restoring' }, { status: 'complete' }]),
      );

      await client.restoreCheckpoint('my-env', 'chk-1');

      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toContain('/sprites/my-env/checkpoints/chk-1/restore');
      expect(init.method).toBe('POST');
    });
  });

  // ===========================================================================
  // Services
  // ===========================================================================

  describe('createService', () => {
    it('should PUT /sprites/{name}/services/{svc}', async () => {
      const service = { name: 'api', cmd: 'node app.js' };
      mockFetch.mockResolvedValueOnce(jsonResponse(service));

      const result = await client.createService('my-env', 'api', {
        cmd: 'node app.js',
      });

      expect(result.name).toBe('api');
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toContain('/sprites/my-env/services/api');
      expect(init.method).toBe('PUT');
    });
  });

  describe('listServices', () => {
    it('should GET /sprites/{name}/services', async () => {
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ services: [{ name: 'api', cmd: 'node app.js' }] }),
      );

      const result = await client.listServices('my-env');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('api');
    });
  });

  // ===========================================================================
  // Network Policy
  // ===========================================================================

  describe('getPolicy', () => {
    it('should GET /sprites/{name}/policy/network', async () => {
      mockFetch.mockResolvedValueOnce(
        jsonResponse({ rules: [{ action: 'allow', domain: '*.npmjs.org' }] }),
      );

      const result = await client.getPolicy('my-env');

      expect(result.rules).toHaveLength(1);
      expect(result.rules[0].action).toBe('allow');
    });
  });

  describe('setPolicy', () => {
    it('should POST /sprites/{name}/policy/network with rules', async () => {
      mockFetch.mockResolvedValueOnce(jsonResponse(undefined, 204));

      await client.setPolicy('my-env', [
        { action: 'allow', domain: '*.npmjs.org' },
        { action: 'deny', domain: '*.evil.com' },
      ]);

      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toContain('/sprites/my-env/policy/network');
      expect(init.method).toBe('POST');
      const body = JSON.parse(init.body);
      expect(body.rules).toHaveLength(2);
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe('error handling', () => {
    it('should throw SpritesApiError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce(
        errorResponse(404, 'Not Found', { error: 'sprite not found' }),
      );

      await expect(client.getSprite('nonexistent')).rejects.toThrow(SpritesApiError);
    });

    it('should include status and body in error', async () => {
      mockFetch.mockResolvedValueOnce(
        errorResponse(401, 'Unauthorized', { error: 'invalid token' }),
      );

      try {
        await client.listSprites();
        expect.fail('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(SpritesApiError);
        const apiErr = err as SpritesApiError;
        expect(apiErr.status).toBe(401);
        expect(apiErr.body).toEqual({ error: 'invalid token' });
      }
    });
  });

  // ===========================================================================
  // Custom base URL
  // ===========================================================================

  describe('custom baseUrl', () => {
    it('should use custom base URL', async () => {
      const customClient = new SpritesClient({
        token: 'tok',
        baseUrl: 'http://localhost:8080/v1',
      });
      mockFetch.mockResolvedValueOnce(jsonResponse({ sprites: [] }));

      await customClient.listSprites();

      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe('http://localhost:8080/v1/sprites');
    });

    it('should strip trailing slash from baseUrl', async () => {
      const customClient = new SpritesClient({
        token: 'tok',
        baseUrl: 'http://localhost:8080/v1/',
      });
      mockFetch.mockResolvedValueOnce(jsonResponse({ sprites: [] }));

      await customClient.listSprites();

      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe('http://localhost:8080/v1/sprites');
    });
  });
});
