/**
 * packages/read-only-api-client/src/response-parser.ts
 *
 * Phase 23 — Response envelope type guards, parsers, and assertion helpers.
 *
 * Provides:
 *   - isReadOnlyApiSuccessEnvelope — type guard
 *   - isReadOnlyApiErrorEnvelope — type guard
 *   - assertReadOnlyApiSuccessEnvelope — assertion (throws safe error on fail)
 *   - assertReadOnlyApiErrorEnvelope — assertion (throws safe error on fail)
 *   - parseReadOnlyApiEnvelope — parse unknown input to a typed result
 *   - extractSuccessData — extract data from success envelope
 *   - extractErrorInfo — extract error code/details from error envelope
 *   - validateEnvelopeMeta — validate Phase 22 meta fields
 *
 * Safety rules:
 *   - Never expose stack traces.
 *   - Never expose raw unknown values in public errors.
 *   - Malformed input is handled deterministically.
 *   - No network calls. No mutation. No side effects.
 */

import type {
  ReadOnlyApiSuccessEnvelope,
  ReadOnlyApiErrorEnvelope,
  ReadOnlyApiContractMeta,
  ReadOnlyApiError,
  ReadOnlyApiClientResult,
} from './types.js';
import { PHASE_22_GENERATED_AT } from '@sonic/read-only-api';

// ─── Type guards ──────────────────────────────────────────────────────────────

/**
 * Returns true when the input is a Phase 22 success envelope.
 * Pure type guard — no side effects.
 */
export function isReadOnlyApiSuccessEnvelope<T = unknown>(
  value: unknown,
): value is ReadOnlyApiSuccessEnvelope<T> {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v['ok'] === true &&
    v['status'] === 'ok' &&
    typeof v['endpoint'] === 'string' &&
    v['method'] === 'GET' &&
    'data' in v &&
    typeof v['meta'] === 'object' &&
    v['meta'] !== null
  );
}

/**
 * Returns true when the input is a Phase 22 error envelope.
 * Pure type guard — no side effects.
 */
export function isReadOnlyApiErrorEnvelope(
  value: unknown,
): value is ReadOnlyApiErrorEnvelope {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v['ok'] === false &&
    v['status'] === 'failed' &&
    typeof v['endpoint'] === 'string' &&
    v['method'] === 'GET' &&
    v['data'] === null &&
    typeof v['error'] === 'object' &&
    v['error'] !== null &&
    typeof v['meta'] === 'object' &&
    v['meta'] !== null
  );
}

// ─── Assertions ───────────────────────────────────────────────────────────────

/** Safe assertion error — never exposes internal state. */
export class ReadOnlyApiAssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReadOnlyApiAssertionError';
  }
}

/**
 * Asserts the input is a Phase 22 success envelope.
 * Throws ReadOnlyApiAssertionError if not — never exposes stack traces.
 */
export function assertReadOnlyApiSuccessEnvelope<T = unknown>(
  value: unknown,
): asserts value is ReadOnlyApiSuccessEnvelope<T> {
  if (!isReadOnlyApiSuccessEnvelope<T>(value)) {
    throw new ReadOnlyApiAssertionError(
      'Expected a ReadOnlyApiSuccessEnvelope (ok: true, status: "ok") but received a different shape.',
    );
  }
}

/**
 * Asserts the input is a Phase 22 error envelope.
 * Throws ReadOnlyApiAssertionError if not — never exposes stack traces.
 */
export function assertReadOnlyApiErrorEnvelope(
  value: unknown,
): asserts value is ReadOnlyApiErrorEnvelope {
  if (!isReadOnlyApiErrorEnvelope(value)) {
    throw new ReadOnlyApiAssertionError(
      'Expected a ReadOnlyApiErrorEnvelope (ok: false, status: "failed") but received a different shape.',
    );
  }
}

// ─── Envelope parser ──────────────────────────────────────────────────────────

/**
 * Parses an unknown input as a Phase 22 envelope, returning a typed result.
 * Returns ok: false with a safe error description when input is malformed.
 * Deterministic — does not rely on wall-clock time.
 */
export function parseReadOnlyApiEnvelope<T = unknown>(
  value: unknown,
): ReadOnlyApiClientResult<T> {
  if (isReadOnlyApiSuccessEnvelope<T>(value)) {
    return {
      ok: true,
      data: value.data,
      meta: value.meta,
    };
  }

  if (isReadOnlyApiErrorEnvelope(value)) {
    return {
      ok: false,
      error: value.error,
      meta: value.meta,
    };
  }

  // Malformed — return deterministic safe fallback
  const fallbackMeta = buildFallbackMeta();
  const fallbackError: ReadOnlyApiError = {
    code: 'READ_ONLY_API_INTERNAL_CONTRACT_ERROR',
    message: 'Received a malformed or unrecognised envelope shape.',
    details: [],
  };

  return {
    ok: false,
    error: fallbackError,
    meta: fallbackMeta,
  };
}

// ─── Data/error extractors ────────────────────────────────────────────────────

/**
 * Extracts data from a success envelope.
 * Returns the data field directly.
 */
export function extractSuccessData<T = unknown>(
  envelope: ReadOnlyApiSuccessEnvelope<T>,
): T {
  return envelope.data;
}

/**
 * Extracts the error code and details from an error envelope.
 * Pure. No side effects.
 */
export function extractErrorInfo(envelope: ReadOnlyApiErrorEnvelope): {
  readonly code: string;
  readonly message: string;
  readonly details: readonly { readonly field: string; readonly reason: string; readonly received: string }[];
} {
  return {
    code: envelope.error.code,
    message: envelope.error.message,
    details: envelope.error.details,
  };
}

// ─── Meta validators ──────────────────────────────────────────────────────────

/**
 * Validates that a Phase 22 meta object has all required safety fields.
 * Returns an array of validation error messages (empty = valid).
 * Pure. Deterministic.
 */
export function validateEnvelopeMeta(meta: unknown): readonly string[] {
  const errors: string[] = [];

  if (typeof meta !== 'object' || meta === null) {
    return ['meta must be an object'];
  }

  const m = meta as Record<string, unknown>;

  if (m['phase'] !== 22) errors.push('meta.phase must be 22');
  if (m['apiMode'] !== 'local_read_only') errors.push('meta.apiMode must be "local_read_only"');
  if (m['deterministic'] !== true) errors.push('meta.deterministic must be true');
  if (m['mutating'] !== false) errors.push('meta.mutating must be false');
  if (m['externalNetwork'] !== false) errors.push('meta.externalNetwork must be false');
  if (m['fixtureOnly'] !== true) errors.push('meta.fixtureOnly must be true');
  if (m['liveData'] !== false) errors.push('meta.liveData must be false');
  if (m['safeToDisplay'] !== true) errors.push('meta.safeToDisplay must be true');
  if (m['analysisOnly'] !== true) errors.push('meta.analysisOnly must be true');
  if (m['nonExecutable'] !== true) errors.push('meta.nonExecutable must be true');
  if (m['readOnly'] !== true) errors.push('meta.readOnly must be true');
  if (m['localOnly'] !== true) errors.push('meta.localOnly must be true');

  return errors;
}

/**
 * Checks that an envelope meta's generatedAt matches the Phase 22 static value.
 * Returns true for deterministic envelopes, false for unexpected timestamps.
 */
export function isDeterministicGeneratedAt(generatedAt: unknown): boolean {
  return generatedAt === PHASE_22_GENERATED_AT;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Builds a deterministic fallback meta for malformed envelope handling.
 * Never uses wall-clock time.
 */
function buildFallbackMeta(): ReadOnlyApiContractMeta {
  return {
    phase: 22,
    apiMode: 'local_read_only',
    deterministic: true,
    mutating: false,
    externalNetwork: false,
    generatedAt: PHASE_22_GENERATED_AT,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    localOnly: true,
  };
}
