/**
 * packages/read-only-api-client/src/fixtures/error.ts
 *
 * Phase 23 — Static deterministic error envelope fixtures.
 *
 * All fixtures are:
 *   - deterministic (no wall-clock timestamps)
 *   - sanitized (no secrets, no stack traces, no local paths)
 *   - typed (using Phase 22 ReadOnlyApiErrorEnvelope)
 *   - static (computed once at module load, never mutated)
 *   - fixture-only (no live data)
 *
 * Error fixtures are constructed using the Phase 22 envelope builders
 * to ensure they accurately reflect the actual contract error format.
 */

import {
  buildReadOnlyApiErrorEnvelope,
  buildReadOnlyApiContractMeta,
  READ_ONLY_API_ERROR_CODES,
  handleDashboard,
  handleDashboardEvidence,
} from '@sonic/read-only-api';
import type { ReadOnlyApiError, ReadOnlyApiErrorEnvelope } from '../types.js';
import { isReadOnlyApiErrorEnvelope } from '../response-parser.js';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const STATIC_META = buildReadOnlyApiContractMeta();

// ─── Helper ───────────────────────────────────────────────────────────────────

function toError(envelope: unknown): ReadOnlyApiErrorEnvelope {
  if (!isReadOnlyApiErrorEnvelope(envelope)) {
    throw new Error(
      'SDK fixture builder: expected an error envelope. ' +
      'This indicates a bug in the Phase 22 handler functions.',
    );
  }
  return envelope;
}

// ─── Invalid query error fixture ──────────────────────────────────────────────

/**
 * Deterministic fixture: invalid query error envelope.
 * Triggered by passing an invalid sortBy value to /dashboard.
 * The exact query that causes this is deterministic.
 */
export const INVALID_QUERY_ERROR_FIXTURE: ReadOnlyApiErrorEnvelope = toError(
  handleDashboard({ sortBy: 'not_a_real_field' }, '/dashboard'),
);

/**
 * Deterministic fixture: invalid query error envelope for /dashboard/evidence.
 * Triggered by a negative offset value.
 */
export const INVALID_QUERY_EVIDENCE_ERROR_FIXTURE: ReadOnlyApiErrorEnvelope = toError(
  handleDashboardEvidence({ offset: -1 }, '/dashboard/evidence'),
);

// ─── Unsupported endpoint error fixture ───────────────────────────────────────

/**
 * Deterministic fixture: unsupported endpoint error envelope.
 * Static example — represents what an unsupported endpoint response looks like.
 */
const unsupportedEndpointError: ReadOnlyApiError = {
  code: READ_ONLY_API_ERROR_CODES.UNSUPPORTED_ENDPOINT,
  message: 'The requested endpoint is not supported by this local read-only API.',
  details: [
    {
      field: 'endpoint',
      reason: 'Endpoint /not-found is not registered in the local read-only API.',
      received: '/not-found',
    },
  ],
};

export const UNSUPPORTED_ENDPOINT_ERROR_FIXTURE: ReadOnlyApiErrorEnvelope =
  buildReadOnlyApiErrorEnvelope('/not-found', 'fixture_unsupported_endpoint', unsupportedEndpointError, STATIC_META);

// ─── Method not allowed error fixture ────────────────────────────────────────

/**
 * Deterministic fixture: method not allowed error envelope.
 * Static example — represents what a method-not-allowed response looks like.
 */
const methodNotAllowedError: ReadOnlyApiError = {
  code: READ_ONLY_API_ERROR_CODES.METHOD_NOT_ALLOWED,
  message: 'This local read-only API supports GET requests only.',
  details: [
    {
      field: 'method',
      reason: 'Only GET is supported. POST, PUT, PATCH, DELETE are not allowed.',
      received: 'POST',
    },
  ],
};

export const METHOD_NOT_ALLOWED_ERROR_FIXTURE: ReadOnlyApiErrorEnvelope =
  buildReadOnlyApiErrorEnvelope('/health', 'fixture_method_not_allowed', methodNotAllowedError, STATIC_META);

// ─── Safety rejection error fixture ──────────────────────────────────────────

/**
 * Deterministic fixture: safety rejection error envelope.
 * Static sanitized example — no unsafe runtime behaviour.
 */
const safetyRejectionError: ReadOnlyApiError = {
  code: READ_ONLY_API_ERROR_CODES.SAFETY_REJECTION,
  message: 'Request was rejected due to unsafe content in query parameters.',
  details: [
    {
      field: 'query',
      reason: 'Query parameter contains unsafe content that cannot be processed.',
      received: '[redacted]',
    },
  ],
};

export const SAFETY_REJECTION_ERROR_FIXTURE: ReadOnlyApiErrorEnvelope =
  buildReadOnlyApiErrorEnvelope('/dashboard', 'fixture_safety_rejection', safetyRejectionError, STATIC_META);

// ─── Internal contract error fixture ─────────────────────────────────────────

/**
 * Deterministic fixture: internal contract error envelope.
 * Static sanitized example only — no real internal error is triggered.
 * This fixture demonstrates what a sanitized internal error looks like.
 */
const internalContractError: ReadOnlyApiError = {
  code: READ_ONLY_API_ERROR_CODES.INTERNAL_CONTRACT_ERROR,
  message: 'An internal contract error occurred. Details have been sanitized.',
  details: [],
};

export const INTERNAL_CONTRACT_ERROR_FIXTURE: ReadOnlyApiErrorEnvelope =
  buildReadOnlyApiErrorEnvelope('/health', 'fixture_internal_contract_error', internalContractError, STATIC_META);
