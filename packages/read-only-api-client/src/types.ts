/**
 * packages/read-only-api-client/src/types.ts
 *
 * Phase 23 — Local Read-Only API Consumer SDK types.
 *
 * Defines SDK-layer types for the local in-process consumer SDK.
 * Imports and re-exports the Phase 22 envelope types from @sonic/read-only-api
 * to avoid duplication.
 *
 * Safety: no network, no live data, no mutation, no secrets.
 * All types are deterministic and static.
 */

import type {
  ReadOnlyApiSuccessEnvelope,
  ReadOnlyApiErrorEnvelope,
  ReadOnlyApiEnvelope,
  ReadOnlyApiContractMeta,
  ReadOnlyApiError,
  ReadOnlyApiErrorCode,
  ReadOnlyApiErrorDetail,
  ReadOnlyApiMethod,
  ReadOnlyApiEndpointContract,
} from '@sonic/read-only-api';

// Re-export Phase 22 types used throughout this SDK
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
};

// ─── Endpoint path type ───────────────────────────────────────────────────────

/** All supported read-only API endpoint paths. */
export type ReadOnlyApiEndpointPath =
  | '/health'
  | '/capabilities'
  | '/contracts'
  | '/contracts/openapi-shape'
  | '/dashboard'
  | '/dashboard/overview'
  | '/dashboard/replay'
  | '/dashboard/strategy'
  | '/dashboard/evaluation'
  | '/dashboard/evidence'
  | '/dashboard/safety';

// ─── Client endpoint ──────────────────────────────────────────────────────────

/** Typed endpoint definition used by the consumer SDK. */
export interface ReadOnlyApiClientEndpoint {
  readonly path: ReadOnlyApiEndpointPath;
  readonly method: 'GET';
  readonly description: string;
  readonly supportsQuery: boolean;
  readonly queryParams: readonly string[];
}

// ─── Client options ───────────────────────────────────────────────────────────

/**
 * Options for the local in-process read-only API client.
 * No network — no host/port needed at runtime.
 */
export interface ReadOnlyApiClientOptions {
  /**
   * Optional override for the static generatedAt timestamp.
   * Must be a deterministic ISO 8601 string; defaults to the Phase 22 constant.
   * Never supply a wall-clock value here.
   */
  readonly generatedAt?: string;
}

// ─── Client request ───────────────────────────────────────────────────────────

/** A fully-described in-process API request. No network required. */
export interface ReadOnlyApiClientRequest {
  readonly endpoint: ReadOnlyApiEndpointPath;
  readonly method: 'GET';
  readonly query: ReadOnlyApiClientQueryParams;
}

/** Supported query params for the local client (mirrors Phase 21/22 query layer). */
export interface ReadOnlyApiClientQueryParams {
  readonly limit?: number;
  readonly offset?: number;
  readonly cursor?: string;
  readonly severity?: string;
  readonly panel?: string;
  readonly sourceKind?: string;
  readonly classification?: string;
  readonly status?: string;
  readonly sortBy?: string;
  readonly sortDirection?: string;
}

// ─── Client response ─────────────────────────────────────────────────────────

/** Wrapper around a Phase 22 envelope for the consumer SDK. */
export interface ReadOnlyApiClientResponse<T = unknown> {
  readonly request: ReadOnlyApiClientRequest;
  readonly envelope: ReadOnlyApiEnvelope<T>;
}

// ─── Client result ────────────────────────────────────────────────────────────

/** Discriminated union result from client helper calls. */
export type ReadOnlyApiClientResult<T = unknown> =
  | { readonly ok: true; readonly data: T; readonly meta: ReadOnlyApiContractMeta }
  | {
      readonly ok: false;
      readonly error: ReadOnlyApiError;
      readonly meta: ReadOnlyApiContractMeta;
    };

// ─── Client interface ─────────────────────────────────────────────────────────

/**
 * Local in-process consumer client.
 * No network. No port binding. No external I/O.
 */
export interface ReadOnlyApiClient {
  readonly options: ReadOnlyApiClientOptions;
  /** Build a typed request object for the given endpoint. */
  readonly buildRequest: (
    endpoint: ReadOnlyApiEndpointPath,
    query?: ReadOnlyApiClientQueryParams,
  ) => ReadOnlyApiClientRequest;
  /** Check whether this client ever performs real network requests. Always false. */
  readonly isNetworkClient: false;
  /** Check whether this client ever binds ports. Always false. */
  readonly bindsPort: false;
}

// ─── Contract fixture types ───────────────────────────────────────────────────

/** Discriminates fixture kind. */
export type ReadOnlyApiFixtureKind = 'success' | 'error';

/** Name of a known contract fixture. */
export type ReadOnlyApiContractFixtureName =
  | 'health_success'
  | 'capabilities_success'
  | 'dashboard_success'
  | 'dashboard_evidence_success'
  | 'dashboard_safety_success'
  | 'invalid_query_error'
  | 'unsupported_endpoint_error'
  | 'method_not_allowed_error'
  | 'safety_rejection_error'
  | 'internal_contract_error';

/** A typed Phase 23 contract fixture entry. */
export interface ReadOnlySdkContractFixture<T = unknown> {
  readonly name: ReadOnlyApiContractFixtureName;
  readonly kind: ReadOnlyApiFixtureKind;
  readonly endpoint: ReadOnlyApiEndpointPath;
  readonly envelope: ReadOnlyApiEnvelope<T>;
  readonly description: string;
}
