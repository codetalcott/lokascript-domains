/**
 * Shared types for sprite-dsl client, executor, and MCP server.
 */

// =============================================================================
// Client Configuration
// =============================================================================

export interface SpritesClientConfig {
  token: string;
  baseUrl?: string; // default: https://api.sprites.dev/v1
}

// =============================================================================
// API Response Types
// =============================================================================

export interface Sprite {
  id: string;
  name: string;
  organization: string;
  status: 'cold' | 'warm' | 'running';
  url: string;
  url_settings?: { auth: 'sprite' | 'public' };
  created_at: string;
  updated_at: string;
  last_started_at?: string;
  last_active_at?: string;
}

export interface SpriteListResponse {
  sprites: Array<{ name: string; org_slug: string }>;
  continuation_token?: string;
}

export interface ExecResult {
  stdout: string;
  stderr: string;
  exit_code: number;
}

export interface Checkpoint {
  id: string;
  create_time?: string;
  comment?: string;
}

export interface Service {
  name: string;
  cmd: string;
  args?: string[];
  http_port?: number | null;
  state?: { status: string; pid?: number; started_at?: string };
}

export interface NetworkPolicy {
  rules: Array<{ action: 'allow' | 'deny'; domain: string }>;
}

// =============================================================================
// Executor Types
// =============================================================================

export interface ExecutionResult {
  ok: boolean;
  action: string;
  data?: unknown;
  error?: string;
}

// =============================================================================
// API Error
// =============================================================================

export class SpritesApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown,
  ) {
    super(`Sprites API error: ${status} ${statusText}`);
    this.name = 'SpritesApiError';
  }
}
