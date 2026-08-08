/**
 * MCP Tool Utilities
 *
 * Input validation, parameter extraction, and response formatting helpers.
 * Adapted from @hyperfixi/mcp-server's utils.ts.
 */

// =============================================================================
// Types
// =============================================================================

export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

// =============================================================================
// Input Validation
// =============================================================================

export function validateRequired(
  args: Record<string, unknown>,
  required: string[],
): ToolResponse | null {
  for (const param of required) {
    if (args[param] === undefined || args[param] === null) {
      return errorResponse(`Missing required parameter: ${param}`, {
        required,
        received: Object.keys(args),
      });
    }
  }
  return null;
}

// =============================================================================
// Parameter Extraction
// =============================================================================

export function getString(args: Record<string, unknown>, name: string, defaultValue = ''): string {
  const value = args[name];
  return typeof value === 'string' ? value : defaultValue;
}

// =============================================================================
// Response Helpers
// =============================================================================

export function jsonResponse(data: unknown): ToolResponse {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

export function errorResponse(error: string, details?: Record<string, unknown>): ToolResponse {
  return {
    isError: true,
    content: [{ type: 'text', text: JSON.stringify({ error, ...details }, null, 2) }],
  };
}
