/**
 * Sprites REST Client
 *
 * Thin HTTP client for the Fly.io Sprites API (https://api.sprites.dev/v1).
 * Uses global fetch() — no external dependencies beyond Node 18+.
 * Covers all 10 DSL commands including checkpoint, restore, services,
 * and network policy (which the @fly/sprites SDK does not).
 */

import type {
  SpritesClientConfig,
  Sprite,
  SpriteListResponse,
  ExecResult,
  Checkpoint,
  Service,
  NetworkPolicy,
} from './types.js';
import { SpritesApiError } from './types.js';

const DEFAULT_BASE_URL = 'https://api.sprites.dev/v1';

export class SpritesClient {
  private readonly token: string;
  private readonly baseUrl: string;

  constructor(config: SpritesClientConfig) {
    this.token = config.token;
    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  async createSprite(name: string): Promise<Sprite> {
    return this.request<Sprite>('POST', '/sprites', { name });
  }

  async getSprite(name: string): Promise<Sprite> {
    return this.request<Sprite>('GET', `/sprites/${enc(name)}`);
  }

  async deleteSprite(name: string): Promise<void> {
    await this.request<void>('DELETE', `/sprites/${enc(name)}`);
  }

  async listSprites(): Promise<SpriteListResponse> {
    return this.request<SpriteListResponse>('GET', '/sprites');
  }

  // ===========================================================================
  // Execution
  // ===========================================================================

  async exec(
    spriteName: string,
    command: string,
    options?: { dir?: string; env?: Record<string, string> },
  ): Promise<ExecResult> {
    const params = new URLSearchParams({ cmd: command });
    if (options?.dir) params.set('dir', options.dir);
    return this.request<ExecResult>(
      'POST',
      `/sprites/${enc(spriteName)}/exec?${params}`,
    );
  }

  // ===========================================================================
  // Checkpoints
  // ===========================================================================

  async createCheckpoint(spriteName: string, comment?: string): Promise<Checkpoint> {
    const body = comment ? { comment } : undefined;
    return this.requestNdjson<Checkpoint>(
      'POST',
      `/sprites/${enc(spriteName)}/checkpoint`,
      body,
    );
  }

  async restoreCheckpoint(spriteName: string, checkpointId: string): Promise<void> {
    await this.requestNdjson<void>(
      'POST',
      `/sprites/${enc(spriteName)}/checkpoints/${enc(checkpointId)}/restore`,
    );
  }

  // ===========================================================================
  // Services
  // ===========================================================================

  async createService(
    spriteName: string,
    serviceName: string,
    config: { cmd: string; args?: string[]; http_port?: number },
  ): Promise<Service> {
    return this.request<Service>(
      'PUT',
      `/sprites/${enc(spriteName)}/services/${enc(serviceName)}`,
      config,
    );
  }

  async listServices(spriteName: string): Promise<Service[]> {
    const result = await this.request<{ services: Service[] }>(
      'GET',
      `/sprites/${enc(spriteName)}/services`,
    );
    return result.services;
  }

  // ===========================================================================
  // Network Policy
  // ===========================================================================

  async getPolicy(spriteName: string): Promise<NetworkPolicy> {
    return this.request<NetworkPolicy>(
      'GET',
      `/sprites/${enc(spriteName)}/policy/network`,
    );
  }

  async setPolicy(spriteName: string, rules: NetworkPolicy['rules']): Promise<void> {
    await this.request<void>(
      'POST',
      `/sprites/${enc(spriteName)}/policy/network`,
      { rules },
    );
  }

  // ===========================================================================
  // HTTP Helpers
  // ===========================================================================

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json',
    };
    const init: RequestInit = { method, headers };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        // Body may not be JSON
      }
      throw new SpritesApiError(response.status, response.statusText, errorBody);
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  /**
   * Handle NDJSON streaming responses (used by checkpoint create/restore).
   * Reads the stream to completion and returns the last parsed JSON line.
   */
  private async requestNdjson<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/x-ndjson, application/json',
    };
    const init: RequestInit = { method, headers };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        // Body may not be JSON
      }
      throw new SpritesApiError(response.status, response.statusText, errorBody);
    }

    // Read the full body as text, split into NDJSON lines
    const text = await response.text();
    const lines = text.trim().split('\n').filter(Boolean);

    if (lines.length === 0) {
      return undefined as T;
    }

    // Return the last line parsed as JSON (the final/complete event)
    return JSON.parse(lines[lines.length - 1]) as T;
  }
}

/** URL-encode a path segment. */
function enc(value: string): string {
  return encodeURIComponent(value);
}
