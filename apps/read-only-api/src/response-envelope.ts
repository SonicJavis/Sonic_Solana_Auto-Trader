/**
 * apps/read-only-api/src/response-envelope.ts
 *
 * Phase 22 — Read-Only API Phase 22 response envelope builders.
 *
 * Provides:
 *   - READ_ONLY_API_ERROR_CODES — stable error code constants
 *   - buildReadOnlyApiSuccessEnvelope — builds a Phase 22 success envelope
 *   - buildReadOnlyApiErrorEnvelope — builds a Phase 22 error envelope
 *   - buildQueryErrorFromLroError — maps Phase 21 LRO errors to Phase 22 format
 *   - mapLroErrorCodeToPhase22 — maps LocalReadOnlyApiErrorCode to ReadOnlyApiErrorCode
 *
 * Safety rules:
 *   - No stack traces in error details
 *   - No filesystem paths in error details
 *   - No secrets or credentials in error details
 *   - No live data, no network, no mutation
 *   - All outputs are deterministic
 */

import type {
  ReadOnlyApiSuccessEnvelope,
  ReadOnlyApiErrorEnvelope,
  ReadOnlyApiContractMeta,
  ReadOnlyApiError,
  ReadOnlyApiErrorCode,
  ReadOnlyApiErrorDetail,
  ReadOnlyApiMethod,
  LocalReadOnlyApiErrorCode,
  LroApiErrorDetail,
} from './types.js';
import { PHASE_22_GENERATED_AT } from './contract.js';

// ─── Stable error code constants ──────────────────────────────────────────────

/** Stable Phase 22 error code constants. Exported for use in tests and documentation. */
export const READ_ONLY_API_ERROR_CODES = {
  INVALID_QUERY: 'READ_ONLY_API_INVALID_QUERY' as const,
  UNSUPPORTED_ENDPOINT: 'READ_ONLY_API_UNSUPPORTED_ENDPOINT' as const,
  METHOD_NOT_ALLOWED: 'READ_ONLY_API_METHOD_NOT_ALLOWED' as const,
  SAFETY_REJECTION: 'READ_ONLY_API_SAFETY_REJECTION' as const,
  INTERNAL_CONTRACT_ERROR: 'READ_ONLY_API_INTERNAL_CONTRACT_ERROR' as const,
} satisfies Record<string, ReadOnlyApiErrorCode>;

// ─── Error code mapping ───────────────────────────────────────────────────────

/**
 * Maps a Phase 21 LocalReadOnlyApiErrorCode to a Phase 22 ReadOnlyApiErrorCode.
 * Never throws — returns a safe fallback code for unknown inputs.
 */
export function mapLroErrorCodeToPhase22(code: LocalReadOnlyApiErrorCode): ReadOnlyApiErrorCode {
  switch (code) {
    case 'INVALID_LRO_API_INPUT':
    case 'UNSAFE_QUERY_FIELD':
    case 'UNSAFE_SORT_FIELD':
    case 'UNSAFE_FILTER_VALUE':
    case 'PAGINATION_LIMIT_EXCEEDED':
    case 'PAGINATION_NEGATIVE_VALUE':
    case 'UNSAFE_CURSOR':
      return 'READ_ONLY_API_INVALID_QUERY';

    case 'UNSAFE_CONTENT_DETECTED':
    case 'UNSAFE_ACTION_TEXT_DETECTED':
    case 'SECRET_PATTERN_DETECTED':
    case 'URL_PATTERN_DETECTED':
    case 'UNSAFE_CAPABILITY_DETECTED':
    case 'UNSAFE_LRO_API_OUTPUT':
      return 'READ_ONLY_API_SAFETY_REJECTION';

    case 'EXTERNAL_BIND_FORBIDDEN':
    case 'UNSAFE_HOST_REJECTED':
    case 'UNSAFE_PORT_REJECTED':
      return 'READ_ONLY_API_METHOD_NOT_ALLOWED';

    default:
      return 'READ_ONLY_API_INTERNAL_CONTRACT_ERROR';
  }
}

// ─── Field name extraction ────────────────────────────────────────────────────

/**
 * Extracts the query field name from an error message.
 * Used to populate ReadOnlyApiErrorDetail.field.
 * Returns 'query' as a safe fallback when no known field is found.
 * NOTE: sortBy/sortDirection must be checked BEFORE severity/panel to avoid
 * false matches when error messages list allowed values (e.g., "sortBy must be one of: id, severity").
 */
export function extractQueryFieldFromMessage(message: string): string {
  const lower = message.toLowerCase();
  // Check sort fields FIRST — their error messages can contain other field names as values
  if (lower.includes('sortby')) return 'sortBy';
  if (lower.includes('sortdirection')) return 'sortDirection';
  // Check other fields
  if (lower.includes('sourcekind')) return 'sourceKind';
  if (lower.includes('classification')) return 'classification';
  if (lower.includes('severity')) return 'severity';
  if (lower.includes('panel')) return 'panel';
  if (lower.includes('cursor')) return 'cursor';
  if (lower.includes('offset')) return 'offset';
  if (lower.includes('limit')) return 'limit';
  if (lower.includes('status')) return 'status';
  return 'query';
}

// ─── Safe received-value sanitizer ───────────────────────────────────────────

const SECRET_PATTERNS_BRIEF: readonly string[] = [
  'private_key',
  'seed_phrase',
  'mnemonic',
  'apikey',
  'api_key',
  'password',
  'secret',
];

const URL_PATTERNS_BRIEF: readonly string[] = [
  'http://',
  'https://',
  'wss://',
  'ws://',
];

/**
 * Sanitizes a raw received query value for safe inclusion in error details.
 * Redacts values containing secrets or URLs.
 * Truncates long values.
 * Never exposes filesystem paths, stack traces, or sensitive data.
 */
export function sanitizeReceivedValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  const str = String(value);
  if (str.length > 80) return '[value too long]';
  const lower = str.toLowerCase();
  if (SECRET_PATTERNS_BRIEF.some(p => lower.includes(p))) return '[redacted]';
  if (URL_PATTERNS_BRIEF.some(p => lower.includes(p))) return '[redacted]';
  return str;
}

// ─── Error builder ────────────────────────────────────────────────────────────

/**
 * Builds a Phase 22 ReadOnlyApiError from a Phase 21 LRO error.
 * Extracts field from message, sanitizes received value.
 * Never exposes stack traces, filesystem paths, or secrets.
 */
export function buildQueryErrorFromLroError(
  code: LocalReadOnlyApiErrorCode,
  message: string,
  rawQuery?: Record<string, unknown>,
): ReadOnlyApiError {
  const phase22Code = mapLroErrorCodeToPhase22(code);
  const field = extractQueryFieldFromMessage(message);
  const received = rawQuery ? sanitizeReceivedValue(rawQuery[field]) : 'unknown';

  const details: ReadOnlyApiErrorDetail[] = [
    {
      field,
      reason: message,
      received,
    },
  ];

  return {
    code: phase22Code,
    message: 'Invalid read-only API query.',
    details,
  };
}

// ─── Envelope builders ────────────────────────────────────────────────────────

/** Builds a Phase 22 success envelope. */
export function buildReadOnlyApiSuccessEnvelope<T>(
  endpoint: string,
  envelopeId: string,
  data: T,
  meta: ReadOnlyApiContractMeta,
  warnings?: readonly string[],
): ReadOnlyApiSuccessEnvelope<T> {
  return {
    ok: true,
    status: 'ok',
    envelopeId,
    endpoint,
    method: 'GET' as ReadOnlyApiMethod,
    data,
    warnings: warnings ?? [],
    errors: [] as readonly LroApiErrorDetail[],
    meta,
    generatedAt: PHASE_22_GENERATED_AT,
  };
}

/** Builds a Phase 22 error envelope. */
export function buildReadOnlyApiErrorEnvelope(
  endpoint: string,
  envelopeId: string,
  error: ReadOnlyApiError,
  meta: ReadOnlyApiContractMeta,
): ReadOnlyApiErrorEnvelope {
  // Populate backward-compat errors array with a single entry mapped to Phase 21 format
  const legacyErrors: LroApiErrorDetail[] = [
    {
      code: 'INVALID_LRO_API_INPUT' as LocalReadOnlyApiErrorCode,
      message: error.message,
    },
  ];

  return {
    ok: false,
    status: 'failed',
    envelopeId,
    endpoint,
    method: 'GET' as ReadOnlyApiMethod,
    data: null,
    error,
    errors: legacyErrors,
    warnings: [],
    meta,
    generatedAt: PHASE_22_GENERATED_AT,
  };
}
