/**
 * packages/read-only-api-client/src/index.ts
 *
 * Phase 23 — @sonic/read-only-api-client public API barrel.
 *
 * Exports the local in-process consumer SDK for Phase 22 read-only API contracts.
 *
 * What this package provides:
 *   - createReadOnlyApiClient — local in-process client factory
 *   - buildReadOnlyApiRequest — typed request builder
 *   - buildReadOnlyApiQuery — validated query builder
 *   - buildQueryString — query-to-string serializer
 *   - Individual query param builders (buildLimitParam, etc.)
 *   - parseReadOnlyApiEnvelope — parses unknown input to typed result
 *   - isReadOnlyApiSuccessEnvelope — type guard
 *   - isReadOnlyApiErrorEnvelope — type guard
 *   - assertReadOnlyApiSuccessEnvelope — assertion helper
 *   - assertReadOnlyApiErrorEnvelope — assertion helper
 *   - extractSuccessData — extracts data from success envelope
 *   - extractErrorInfo — extracts error code/details from error envelope
 *   - validateEnvelopeMeta — validates Phase 22 meta fields
 *   - isDeterministicGeneratedAt — checks Phase 22 generatedAt
 *   - ReadOnlyApiAssertionError — safe assertion error class
 *   - READ_ONLY_API_CLIENT_ENDPOINTS — typed endpoint definitions
 *   - getClientEndpoint — endpoint lookup by path
 *   - isKnownEndpointPath — type guard for endpoint paths
 *   - listEndpointPaths — all supported endpoint paths
 *   - listReadOnlyApiContractFixtures — lists all contract fixtures
 *   - getReadOnlyApiContractFixture — fixture lookup by name
 *   - listReadOnlyApiContractFixturesByKind — fixtures by kind
 *   - listReadOnlyApiContractFixturesByEndpoint — fixtures by endpoint
 *   - All success/error fixture constants
 *   - All Phase 23 SDK types
 *
 * What this package does NOT provide:
 *   - No HTTP client (fetch/axios)
 *   - No network requests
 *   - No port binding
 *   - No external I/O
 *   - No live data
 *   - No Solana RPC
 *   - No wallet/private key handling
 *   - No trade execution
 *   - No database writes
 *   - No UI components
 *   - No mutation
 *
 * IMPORTANT: This SDK is local/in-process only.
 * It is fixture-only, read-only, analysis-only, non-executable, and local-only.
 * It never makes real network requests.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  ReadOnlyApiSuccessEnvelope,
  ReadOnlyApiErrorEnvelope,
  ReadOnlyApiEnvelope,
  ReadOnlyApiContractMeta,
  ReadOnlyApiError,
  ReadOnlyApiErrorCode,
  ReadOnlyApiErrorDetail,
  ReadOnlyApiMethod,
  ReadOnlyApiEndpointContract,
  ReadOnlyApiEndpointPath,
  ReadOnlyApiClientEndpoint,
  ReadOnlyApiClientOptions,
  ReadOnlyApiClientRequest,
  ReadOnlyApiClientQueryParams,
  ReadOnlyApiClientResponse,
  ReadOnlyApiClientResult,
  ReadOnlyApiClient,
  ReadOnlyApiFixtureKind,
  ReadOnlyApiContractFixtureName,
  ReadOnlySdkContractFixture,
} from './types.js';

// ─── Client factory ───────────────────────────────────────────────────────────

export { createReadOnlyApiClient, buildReadOnlyApiRequest } from './client.js';

// ─── Endpoint definitions ─────────────────────────────────────────────────────

export {
  READ_ONLY_API_CLIENT_ENDPOINTS,
  getClientEndpoint,
  isKnownEndpointPath,
  listEndpointPaths,
} from './endpoints.js';

// ─── Query builders ───────────────────────────────────────────────────────────

export type { QueryBuilderResult, BuildQueryInput, BuildQueryResult } from './query-builder.js';
export {
  buildReadOnlyApiQuery,
  buildQueryString,
  buildLimitParam,
  buildOffsetParam,
  buildCursorParam,
  buildSeverityParam,
  buildPanelParam,
  buildSourceKindParam,
  buildClassificationParam,
  buildStatusParam,
  buildSortByParam,
  buildSortDirectionParam,
} from './query-builder.js';

// ─── Response parsers / type guards ──────────────────────────────────────────

export {
  isReadOnlyApiSuccessEnvelope,
  isReadOnlyApiErrorEnvelope,
  assertReadOnlyApiSuccessEnvelope,
  assertReadOnlyApiErrorEnvelope,
  parseReadOnlyApiEnvelope,
  extractSuccessData,
  extractErrorInfo,
  validateEnvelopeMeta,
  isDeterministicGeneratedAt,
  ReadOnlyApiAssertionError,
} from './response-parser.js';

// ─── Contract fixtures ────────────────────────────────────────────────────────

export {
  HEALTH_SUCCESS_FIXTURE,
  CAPABILITIES_SUCCESS_FIXTURE,
  DASHBOARD_SUCCESS_FIXTURE,
  DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
  DASHBOARD_SAFETY_SUCCESS_FIXTURE,
  INVALID_QUERY_ERROR_FIXTURE,
  INVALID_QUERY_EVIDENCE_ERROR_FIXTURE,
  UNSUPPORTED_ENDPOINT_ERROR_FIXTURE,
  METHOD_NOT_ALLOWED_ERROR_FIXTURE,
  SAFETY_REJECTION_ERROR_FIXTURE,
  INTERNAL_CONTRACT_ERROR_FIXTURE,
  listReadOnlyApiContractFixtures,
  getReadOnlyApiContractFixture,
  listReadOnlyApiContractFixturesByKind,
  listReadOnlyApiContractFixturesByEndpoint,
} from './fixtures/index.js';
