/**
 * apps/read-only-api/src/types.ts
 *
 * Phase 20 — Local Read-Only API Shell types.
 *
 * All output models carry:
 *   fixtureOnly: true
 *   liveData: false
 *   safeToDisplay: true
 *   analysisOnly: true
 *   nonExecutable: true
 *   readOnly: true
 *   localOnly: true
 *
 * IMPORTANT: LocalReadOnlyApi is NOT a trading system, live data source, or UI.
 * It is a localhost-only, GET-only, fixture-only, read-only, analysis-only,
 * non-executable Fastify API shell serving safe contract/read-model fixtures.
 * It must never create real trade intents, execution plans, orders,
 * paper trades, live data access, or any actionable output.
 * It must only bind to 127.0.0.1.
 */

// ─── Capabilities ────────────────────────────────────────────────────────────

/**
 * LocalReadOnlyApiCapabilities.
 * All unsafe fields are permanently false.
 * Safe/allowed local fields are true.
 * canStartLocalhostServer may be true only for 127.0.0.1 binding.
 */
export interface LocalReadOnlyApiCapabilities {
  // Unsafe — permanently false
  readonly canUseLiveData: false;
  readonly canUseSolanaRpc: false;
  readonly canUseProviderApis: false;
  readonly canAccessPrivateKeys: false;
  readonly canCreateTradeIntents: false;
  readonly canCreateExecutionPlans: false;
  readonly canPaperTrade: false;
  readonly canTrade: false;
  readonly canExecute: false;
  readonly canWriteToDatabase: false;
  readonly canSendTelegramAlerts: false;
  readonly canConstructTransactions: false;
  readonly canSimulateTransactions: false;
  readonly canCreateOrders: false;
  readonly canCreatePositions: false;
  readonly canCalculateLivePnl: false;
  readonly canMutatePriorEvidence: false;
  readonly canRenderUi: false;
  readonly canUseExternalNetwork: false;
  // Allowed — for 127.0.0.1-only server
  readonly canStartLocalhostServer: true;
  readonly canServeReadOnlyContracts: true;
  readonly canServeFixtureReadModels: true;
  // Safety labels
  readonly fixtureOnly: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly localOnly: true;
}

// ─── Config ───────────────────────────────────────────────────────────────────

/** Safe server config. Host must always be 127.0.0.1. Port must be valid. */
export interface LocalReadOnlyApiConfig {
  readonly host: '127.0.0.1';
  readonly port: number;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
}

// ─── Safety metadata ──────────────────────────────────────────────────────────

/** Safety metadata included in every response. */
export interface LroApiSafetyMeta {
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly localOnly: true;
}

// ─── Response envelope ────────────────────────────────────────────────────────

/** Deterministic response envelope for all read-only API shell responses. */
export interface LroApiResponseEnvelope<T = unknown> {
  readonly envelopeId: string;
  readonly status: 'ok' | 'degraded' | 'failed' | 'inconclusive';
  readonly data: T | null;
  readonly warnings: readonly string[];
  readonly errors: readonly LroApiErrorDetail[];
  readonly meta: LroApiSafetyMeta;
  readonly generatedAt: string;
}

/** A safe, serialisable error detail (no stack traces, no Error objects). */
export interface LroApiErrorDetail {
  readonly code: LocalReadOnlyApiErrorCode;
  readonly message: string;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

export type LocalReadOnlyApiErrorCode =
  | 'INVALID_LRO_API_INPUT'
  | 'UNSAFE_LRO_API_OUTPUT'
  | 'UNSAFE_HOST_REJECTED'
  | 'UNSAFE_PORT_REJECTED'
  | 'LIVE_DATA_FORBIDDEN'
  | 'FIXTURE_ONLY_REQUIRED'
  | 'ANALYSIS_ONLY_REQUIRED'
  | 'NON_EXECUTABLE_REQUIRED'
  | 'SAFE_TO_DISPLAY_REQUIRED'
  | 'READ_ONLY_REQUIRED'
  | 'LOCAL_ONLY_REQUIRED'
  | 'UNSAFE_CONTENT_DETECTED'
  | 'UNSAFE_ACTION_TEXT_DETECTED'
  | 'SECRET_PATTERN_DETECTED'
  | 'URL_PATTERN_DETECTED'
  | 'UNSAFE_CAPABILITY_DETECTED'
  | 'EXTERNAL_BIND_FORBIDDEN'
  | 'LRO_API_FIXTURE_ONLY';
