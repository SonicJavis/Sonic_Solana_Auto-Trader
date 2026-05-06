/**
 * apps/read-only-api/src/contract.ts
 *
 * Phase 22 — Local Read-Only API contract constants and endpoint descriptors.
 *
 * Provides:
 *   - PHASE_22 — phase number constant
 *   - API_MODE — stable 'local_read_only' mode identifier
 *   - PHASE_22_GENERATED_AT — deterministic static timestamp (no wall-clock)
 *   - QUERY_PARAM_NAMES — ordered list of all supported query param names
 *   - PHASE_22_ENDPOINT_CONTRACTS — per-endpoint contract descriptors
 *   - PHASE_22_CONTRACT_CAPABILITIES — Phase 22 capability flags for meta
 *   - buildReadOnlyApiContractMeta — deterministic meta builder (no query context)
 *   - buildReadOnlyApiQueryContractMeta — meta builder for queryable endpoints
 *
 * Safety: no network, no live data, no mutation, no secrets.
 * All values are deterministic and static.
 */

import type {
  ReadOnlyApiContractMeta,
  ReadOnlyApiEndpointContract,
  ReadOnlyApiMethod,
} from './types.js';
import type { LroApiQueryMeta } from './types.js';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Phase number constant. */
export const PHASE_22 = 22 as const;

/** API mode identifier for all Phase 22 envelopes. */
export const API_MODE = 'local_read_only' as const;

/**
 * Deterministic static timestamp used in all Phase 22 envelopes.
 * Never uses wall-clock time — always this fixed fixture value.
 */
export const PHASE_22_GENERATED_AT = '2026-01-01T00:00:00.000Z' as const;

/** All supported query parameter names (Phase 21). */
export const QUERY_PARAM_NAMES = [
  'limit',
  'offset',
  'cursor',
  'severity',
  'panel',
  'sourceKind',
  'classification',
  'status',
  'sortBy',
  'sortDirection',
] as const;

// ─── Phase 22 contract capability flags ──────────────────────────────────────

/** Phase 22 contract capability flags included in envelope meta.capabilities. */
export const PHASE_22_CONTRACT_CAPABILITIES: Record<string, boolean> = {
  responseEnvelope: true,
  errorEnvelope: true,
  queryValidationErrors: true,
  deterministicMetadata: true,
  endpointContracts: true,
};

// ─── Endpoint contracts ───────────────────────────────────────────────────────

/** Complete list of Phase 22 endpoint contracts for all registered GET routes. */
export const PHASE_22_ENDPOINT_CONTRACTS: readonly ReadOnlyApiEndpointContract[] = [
  {
    endpoint: '/health',
    method: 'GET' as ReadOnlyApiMethod,
    description:
      'Returns fixture-only health status for the local read-only API shell. ' +
      'No live data. No trading. No execution.',
    phase: 22,
    supportsQuery: false,
    queryParams: [],
  },
  {
    endpoint: '/capabilities',
    method: 'GET' as ReadOnlyApiMethod,
    description:
      'Returns the permanently-safe LocalReadOnlyApiCapabilities. ' +
      'All unsafe fields are false. All safe fields are true.',
    phase: 22,
    supportsQuery: false,
    queryParams: [],
  },
  {
    endpoint: '/contracts',
    method: 'GET' as ReadOnlyApiMethod,
    description: 'Returns the read-only API contract bundle as JSON. Fixture-only.',
    phase: 22,
    supportsQuery: false,
    queryParams: [],
  },
  {
    endpoint: '/contracts/openapi-shape',
    method: 'GET' as ReadOnlyApiMethod,
    description: 'Returns the OpenAPI-shaped contract descriptor. Fixture-only.',
    phase: 22,
    supportsQuery: false,
    queryParams: [],
  },
  {
    endpoint: '/dashboard',
    method: 'GET' as ReadOnlyApiMethod,
    description:
      'Returns the fixture dashboard contract with optional query/filter/sort/pagination.',
    phase: 22,
    supportsQuery: true,
    queryParams: [...QUERY_PARAM_NAMES],
  },
  {
    endpoint: '/dashboard/overview',
    method: 'GET' as ReadOnlyApiMethod,
    description: 'Returns the fixture dashboard overview panel. No query params.',
    phase: 22,
    supportsQuery: false,
    queryParams: [],
  },
  {
    endpoint: '/dashboard/replay',
    method: 'GET' as ReadOnlyApiMethod,
    description: 'Returns the fixture dashboard replay panel. No query params.',
    phase: 22,
    supportsQuery: false,
    queryParams: [],
  },
  {
    endpoint: '/dashboard/strategy',
    method: 'GET' as ReadOnlyApiMethod,
    description: 'Returns the fixture dashboard strategy panel. No query params.',
    phase: 22,
    supportsQuery: false,
    queryParams: [],
  },
  {
    endpoint: '/dashboard/evaluation',
    method: 'GET' as ReadOnlyApiMethod,
    description: 'Returns the fixture dashboard evaluation panel. No query params.',
    phase: 22,
    supportsQuery: false,
    queryParams: [],
  },
  {
    endpoint: '/dashboard/evidence',
    method: 'GET' as ReadOnlyApiMethod,
    description:
      'Returns paginated, filterable fixture evidence entries with optional query/filter/sort/pagination.',
    phase: 22,
    supportsQuery: true,
    queryParams: [...QUERY_PARAM_NAMES],
  },
  {
    endpoint: '/dashboard/safety',
    method: 'GET' as ReadOnlyApiMethod,
    description:
      'Returns fixture safety panel data with optional query/filter/sort/pagination.',
    phase: 22,
    supportsQuery: true,
    queryParams: [...QUERY_PARAM_NAMES],
  },
];

// ─── Meta builder ─────────────────────────────────────────────────────────────

/**
 * Builds a deterministic Phase 22 ReadOnlyApiContractMeta for non-queryable endpoints.
 * Always deterministic — never uses wall-clock time.
 * Includes all Phase 21 safety meta fields for backward compatibility.
 */
export function buildReadOnlyApiContractMeta(): ReadOnlyApiContractMeta {
  return {
    phase: PHASE_22,
    apiMode: API_MODE,
    deterministic: true,
    mutating: false,
    externalNetwork: false,
    generatedAt: PHASE_22_GENERATED_AT,
    capabilities: { ...PHASE_22_CONTRACT_CAPABILITIES },
    // Phase 21 safety meta fields — backward compat
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    localOnly: true,
  };
}

/**
 * Builds a deterministic Phase 22 ReadOnlyApiContractMeta for queryable endpoints.
 * Populates query, filters, sort, pagination from the LroApiQueryMeta.
 * Always deterministic — never uses wall-clock time.
 */
export function buildReadOnlyApiQueryContractMeta(queryMeta: LroApiQueryMeta): ReadOnlyApiContractMeta {
  return {
    phase: PHASE_22,
    apiMode: API_MODE,
    deterministic: true,
    mutating: false,
    externalNetwork: false,
    generatedAt: PHASE_22_GENERATED_AT,
    query: queryMeta.query as unknown as Record<string, unknown>,
    filters: queryMeta.appliedFilters as unknown as Record<string, unknown>,
    sort: queryMeta.sort as unknown as Record<string, unknown>,
    pagination: queryMeta.pagination as unknown as Record<string, unknown>,
    capabilities: { ...PHASE_22_CONTRACT_CAPABILITIES },
    // Phase 21 safety meta fields — backward compat
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    localOnly: true,
  };
}
