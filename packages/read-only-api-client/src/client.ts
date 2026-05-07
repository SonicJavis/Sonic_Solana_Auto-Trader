/**
 * packages/read-only-api-client/src/client.ts
 *
 * Phase 23 — Local in-process consumer client factory.
 *
 * Provides:
 *   - createReadOnlyApiClient — creates a typed in-process-only client
 *   - buildReadOnlyApiRequest — builds a typed request descriptor
 *
 * The client is local/in-process only:
 *   - No network calls
 *   - No port binding
 *   - No external I/O
 *   - No runtime mutation
 *   - Deterministic
 *
 * Safety: no network, no live data, no mutation, no secrets.
 */

import type {
  ReadOnlyApiClient,
  ReadOnlyApiClientOptions,
  ReadOnlyApiClientRequest,
  ReadOnlyApiClientQueryParams,
  ReadOnlyApiEndpointPath,
} from './types.js';

// ─── Request builder ──────────────────────────────────────────────────────────

/**
 * Builds a typed ReadOnlyApiClientRequest descriptor.
 * No network. No side effects. Pure. Deterministic.
 */
export function buildReadOnlyApiRequest(
  endpoint: ReadOnlyApiEndpointPath,
  query: ReadOnlyApiClientQueryParams = {},
): ReadOnlyApiClientRequest {
  return {
    endpoint,
    method: 'GET',
    query,
  };
}

// ─── Client factory ───────────────────────────────────────────────────────────

/**
 * Creates a local in-process read-only API client.
 *
 * The returned client:
 *   - Is local/in-process only (isNetworkClient: false, bindsPort: false)
 *   - Builds typed request descriptors
 *   - Does not perform real network requests
 *   - Does not bind ports
 *   - Is deterministic
 *
 * Usage:
 *   const client = createReadOnlyApiClient();
 *   const req = client.buildRequest('/health');
 *   const req2 = client.buildRequest('/dashboard', { limit: 10, severity: 'high' });
 */
export function createReadOnlyApiClient(
  options: ReadOnlyApiClientOptions = {},
): ReadOnlyApiClient {
  return {
    options,
    buildRequest(
      endpoint: ReadOnlyApiEndpointPath,
      query: ReadOnlyApiClientQueryParams = {},
    ): ReadOnlyApiClientRequest {
      return buildReadOnlyApiRequest(endpoint, query);
    },
    isNetworkClient: false as const,
    bindsPort: false as const,
  };
}
