/**
 * apps/read-only-api/src/response.ts
 *
 * Phase 20 — Local Read-Only API response envelope builder.
 *
 * Creates deterministic response envelopes with status, data, warnings,
 * errors, safety metadata, and generatedAt timestamp.
 * No stack traces, no raw Error objects.
 */

import type {
  LroApiResponseEnvelope,
  LroApiSafetyMeta,
  LroApiErrorDetail,
  LocalReadOnlyApiErrorCode,
} from './types.js';

const FIXTURE_GENERATED_AT = '2026-01-01T00:00:00.000Z';

/** The standard safety metadata included in every response. */
export const STANDARD_SAFETY_META: LroApiSafetyMeta = {
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
  localOnly: true,
};

export interface BuildReadOnlyApiResponseInput<T> {
  readonly envelopeId: string;
  readonly status: LroApiResponseEnvelope<T>['status'];
  readonly data: T | null;
  readonly warnings?: readonly string[];
  readonly errors?: ReadonlyArray<{
    code: LocalReadOnlyApiErrorCode;
    message: string;
  }>;
}

/**
 * Builds a deterministic response envelope.
 * All outputs are fixture-only, analysis-only, non-executable, read-only, local-only.
 * No stack traces, no raw Error objects.
 */
export function buildReadOnlyApiResponse<T>(
  input: BuildReadOnlyApiResponseInput<T>,
): LroApiResponseEnvelope<T> {
  const errors: LroApiErrorDetail[] = (input.errors ?? []).map(e => ({
    code: e.code,
    message: e.message,
  }));

  return {
    envelopeId: input.envelopeId,
    status: input.status,
    data: input.data,
    warnings: input.warnings ?? [],
    errors,
    meta: STANDARD_SAFETY_META,
    generatedAt: FIXTURE_GENERATED_AT,
  };
}
