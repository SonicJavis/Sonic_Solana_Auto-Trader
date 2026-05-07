/**
 * packages/read-only-api-client/src/fixtures/success.ts
 *
 * Phase 23 — Static deterministic success envelope fixtures.
 *
 * All fixtures are:
 *   - deterministic (no wall-clock timestamps)
 *   - sanitized (no secrets, no stack traces, no local paths)
 *   - typed (using Phase 22 ReadOnlyApiSuccessEnvelope)
 *   - static (computed once at module load, never mutated)
 *   - fixture-only (no live data)
 *
 * These are built using the Phase 22 handler functions to ensure
 * they accurately reflect actual API contract behaviour.
 */

import {
  handleHealth,
  handleCapabilities,
  handleDashboard,
  handleDashboardEvidence,
  handleDashboardSafety,
} from '@sonic/read-only-api';
import type { ReadOnlyApiSuccessEnvelope } from '../types.js';
import { isReadOnlyApiSuccessEnvelope } from '../response-parser.js';

// ─── Helper ───────────────────────────────────────────────────────────────────

function toSuccess<T>(envelope: unknown): ReadOnlyApiSuccessEnvelope<T> {
  if (!isReadOnlyApiSuccessEnvelope<T>(envelope)) {
    throw new Error(
      'SDK fixture builder: expected a success envelope but got an error envelope. ' +
      'This indicates a bug in the Phase 22 handler functions.',
    );
  }
  return envelope;
}

// ─── Success fixtures ─────────────────────────────────────────────────────────

/** Deterministic fixture: GET /health success envelope. */
export const HEALTH_SUCCESS_FIXTURE: ReadOnlyApiSuccessEnvelope<unknown> =
  toSuccess(handleHealth('/health'));

/** Deterministic fixture: GET /capabilities success envelope. */
export const CAPABILITIES_SUCCESS_FIXTURE: ReadOnlyApiSuccessEnvelope<unknown> =
  toSuccess(handleCapabilities('/capabilities'));

/** Deterministic fixture: GET /dashboard success envelope (no query). */
export const DASHBOARD_SUCCESS_FIXTURE: ReadOnlyApiSuccessEnvelope<unknown> =
  toSuccess(handleDashboard(undefined, '/dashboard'));

/** Deterministic fixture: GET /dashboard/evidence success envelope (no query). */
export const DASHBOARD_EVIDENCE_SUCCESS_FIXTURE: ReadOnlyApiSuccessEnvelope<unknown> =
  toSuccess(handleDashboardEvidence(undefined, '/dashboard/evidence'));

/** Deterministic fixture: GET /dashboard/safety success envelope (no query). */
export const DASHBOARD_SAFETY_SUCCESS_FIXTURE: ReadOnlyApiSuccessEnvelope<unknown> =
  toSuccess(handleDashboardSafety(undefined, '/dashboard/safety'));
