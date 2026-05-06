/**
 * packages/read-only-api-contracts/src/response-envelope.ts
 *
 * Phase 19 — Read-Only API response envelope builder.
 *
 * Creates deterministic response envelopes with status, data, warnings,
 * errors, metadata, and safety fields.
 * No stack traces, no raw Error objects.
 */

import type {
  ReadOnlyApiResponseEnvelope,
  ReadOnlyApiResponseMetadata,
  ReadOnlyApiErrorDetail,
  ReadOnlyApiContractErrorCode,
} from './types.js';

const CONTRACT_VERSION = '0.1.0';
const PHASE = 'phase-19';
const GENERATED_AT_FIXTURE = '2026-01-01T00:00:00.000Z';

function buildMetadata(): ReadOnlyApiResponseMetadata {
  return {
    contractVersion: CONTRACT_VERSION,
    phase: PHASE,
    generatedAt: GENERATED_AT_FIXTURE,
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  };
}

export interface BuildReadOnlyApiResponseEnvelopeInput<T> {
  readonly envelopeId: string;
  readonly status: ReadOnlyApiResponseEnvelope<T>['status'];
  readonly data: T | null;
  readonly warnings?: readonly string[];
  readonly errors?: ReadonlyArray<{
    code: ReadOnlyApiContractErrorCode;
    message: string;
  }>;
}

/**
 * Builds a deterministic response envelope.
 * All outputs are fixture-only, analysis-only, non-executable, read-only, contract-only.
 * No stack traces, no raw Error objects.
 */
export function buildReadOnlyApiResponseEnvelope<T>(
  input: BuildReadOnlyApiResponseEnvelopeInput<T>,
): ReadOnlyApiResponseEnvelope<T> {
  const errors: ReadOnlyApiErrorDetail[] = (input.errors ?? []).map(e => ({
    code: e.code,
    message: e.message,
    fixtureOnly: true,
    safeToDisplay: true,
  }));

  return {
    envelopeId: input.envelopeId,
    status: input.status,
    data: input.data,
    warnings: input.warnings ?? [],
    errors,
    metadata: buildMetadata(),
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
    contractOnly: true,
  };
}
