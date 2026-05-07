/**
 * packages/read-only-api-client/src/endpoints.ts
 *
 * Phase 23 — Typed endpoint definitions for the local read-only API consumer SDK.
 *
 * Mirrors the Phase 22 PHASE_22_ENDPOINT_CONTRACTS but in the SDK-layer
 * ReadOnlyApiClientEndpoint shape, with strongly typed paths.
 *
 * Safety: no network, no live data, no mutation, no secrets.
 * All values are deterministic and static.
 */

import type { ReadOnlyApiClientEndpoint, ReadOnlyApiEndpointPath } from './types.js';
import { QUERY_PARAM_NAMES } from '@sonic/read-only-api';

// ─── Endpoint definitions ─────────────────────────────────────────────────────

/**
 * Typed client-side endpoint definitions for all Phase 22 GET endpoints.
 * These mirror PHASE_22_ENDPOINT_CONTRACTS but in the consumer SDK shape.
 */
export const READ_ONLY_API_CLIENT_ENDPOINTS: readonly ReadOnlyApiClientEndpoint[] = [
  {
    path: '/health',
    method: 'GET',
    description:
      'Returns fixture-only health status for the local read-only API shell. ' +
      'No live data. No trading. No execution.',
    supportsQuery: false,
    queryParams: [],
  },
  {
    path: '/capabilities',
    method: 'GET',
    description:
      'Returns the permanently-safe LocalReadOnlyApiCapabilities. ' +
      'All unsafe fields are false. All safe fields are true.',
    supportsQuery: false,
    queryParams: [],
  },
  {
    path: '/contracts',
    method: 'GET',
    description: 'Returns the read-only API contract bundle as JSON. Fixture-only.',
    supportsQuery: false,
    queryParams: [],
  },
  {
    path: '/contracts/openapi-shape',
    method: 'GET',
    description: 'Returns the OpenAPI-shaped contract descriptor. Fixture-only.',
    supportsQuery: false,
    queryParams: [],
  },
  {
    path: '/dashboard',
    method: 'GET',
    description:
      'Returns the fixture dashboard contract with optional query/filter/sort/pagination.',
    supportsQuery: true,
    queryParams: [...QUERY_PARAM_NAMES],
  },
  {
    path: '/dashboard/overview',
    method: 'GET',
    description: 'Returns the fixture dashboard overview panel. No query params.',
    supportsQuery: false,
    queryParams: [],
  },
  {
    path: '/dashboard/replay',
    method: 'GET',
    description: 'Returns the fixture dashboard replay panel. No query params.',
    supportsQuery: false,
    queryParams: [],
  },
  {
    path: '/dashboard/strategy',
    method: 'GET',
    description: 'Returns the fixture dashboard strategy panel. No query params.',
    supportsQuery: false,
    queryParams: [],
  },
  {
    path: '/dashboard/evaluation',
    method: 'GET',
    description: 'Returns the fixture dashboard evaluation panel. No query params.',
    supportsQuery: false,
    queryParams: [],
  },
  {
    path: '/dashboard/evidence',
    method: 'GET',
    description:
      'Returns paginated, filterable fixture evidence entries with optional query/filter/sort/pagination.',
    supportsQuery: true,
    queryParams: [...QUERY_PARAM_NAMES],
  },
  {
    path: '/dashboard/safety',
    method: 'GET',
    description:
      'Returns fixture safety panel data with optional query/filter/sort/pagination.',
    supportsQuery: true,
    queryParams: [...QUERY_PARAM_NAMES],
  },
] as const;

// ─── Lookup helper ────────────────────────────────────────────────────────────

/**
 * Returns the client endpoint definition for the given path, or undefined if not found.
 * Pure. Deterministic. No side effects.
 */
export function getClientEndpoint(
  path: string,
): ReadOnlyApiClientEndpoint | undefined {
  return READ_ONLY_API_CLIENT_ENDPOINTS.find(
    (e): e is ReadOnlyApiClientEndpoint => e.path === path,
  );
}

/**
 * Returns true when the given path is a known read-only API endpoint.
 * Pure. Deterministic.
 */
export function isKnownEndpointPath(path: string): path is ReadOnlyApiEndpointPath {
  return READ_ONLY_API_CLIENT_ENDPOINTS.some(e => e.path === path);
}

/**
 * Returns all endpoint paths supported by the local read-only API.
 * Pure. Deterministic.
 */
export function listEndpointPaths(): readonly ReadOnlyApiEndpointPath[] {
  return READ_ONLY_API_CLIENT_ENDPOINTS.map(e => e.path);
}
