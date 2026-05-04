/**
 * Phase 7D — Provider readiness models, evaluator, and report aggregation.
 *
 * Defines safe, fail-closed readiness states and report types.
 * All providers remain disabled. No live provider can become ready.
 *
 * Safety invariants:
 *   - canConnect, canEmitLiveEvents, canTriggerExecution are always false.
 *   - No readiness state implies live or network readiness.
 *   - Unsafe provider config attempts result in 'unsafe_requested' readiness.
 *   - All-disabled providers produce 'disabled_safe' overall readiness.
 *   - Notes and reasons are safe to display — no secrets, URLs, or API keys.
 *
 * No network, no Solana, no wallet, no SDK, no execution.
 */

import type { ProviderConfigSafe } from './provider-config.js';
import { PHASE_7D_PROVIDER_TYPES, createDisabledProviderConfig } from './provider-config.js';

/**
 * Safe machine-readable error codes for provider readiness.
 * All codes are safe to log and display.
 */
export type ProviderReadinessErrorCode =
  | 'PROVIDER_READINESS_UNSAFE'
  | 'PROVIDER_READINESS_UNKNOWN';

export const PROVIDER_READINESS_ERROR_CODES: readonly ProviderReadinessErrorCode[] = [
  'PROVIDER_READINESS_UNSAFE',
  'PROVIDER_READINESS_UNKNOWN',
] as const;

/**
 * Readiness states for a provider.
 *
 *   disabled_safe         — provider is fully disabled; safe state.
 *   mock_only_ready       — provider can replay local fixture events only; no network.
 *   unsafe_requested      — caller attempted to enable unsafe permission; fail-closed.
 *   unavailable           — provider type known but not usable.
 *   unknown               — provider type unrecognised or state indeterminate.
 */
export type ProviderReadiness =
  | 'disabled_safe'
  | 'mock_only_ready'
  | 'unsafe_requested'
  | 'unavailable'
  | 'unknown';

export const PROVIDER_READINESS_VALUES: readonly ProviderReadiness[] = [
  'disabled_safe',
  'mock_only_ready',
  'unsafe_requested',
  'unavailable',
  'unknown',
] as const;

/**
 * Overall system readiness across all providers.
 * Mirrors ProviderReadiness values but applies to the aggregate report.
 */
export type OverallProviderReadiness =
  | 'disabled_safe'
  | 'mock_only_ready'
  | 'unsafe_requested'
  | 'unavailable'
  | 'unknown';

/**
 * Per-provider readiness status entry in a readiness report.
 *
 * canConnect, canEmitLiveEvents, canTriggerExecution are always false.
 * No provider can become live, connected, or execution-capable in Phase 7D.
 */
export interface ProviderReadinessEntry {
  /** Provider type identifier */
  readonly providerType: string;
  /** Human-readable status string — safe to display */
  readonly status: string;
  /** Readiness state */
  readonly readiness: ProviderReadiness;
  /** Safe config snapshot — no raw URLs or API keys */
  readonly config: ProviderConfigSafe;
  /** Reasons for unsafe state if applicable — safe to display */
  readonly unsafeReasons: readonly string[];
  /** Whether provider can connect to anything. Always false. */
  readonly canConnect: false;
  /** Whether provider can emit live events. Always false. */
  readonly canEmitLiveEvents: false;
  /** Whether provider can trigger execution. Always false. */
  readonly canTriggerExecution: false;
}

/**
 * Aggregated provider readiness report.
 *
 * Summarises readiness across all known providers.
 * All network/live/execution counts must be 0 for safe Phase 7D state.
 */
export interface ProviderReadinessReport {
  /** ISO timestamp when the report was generated */
  readonly generatedAt: string;
  /** Per-provider readiness entries */
  readonly providers: readonly ProviderReadinessEntry[];
  /** Overall readiness state across all providers */
  readonly overallReadiness: OverallProviderReadiness;
  /** Number of providers with unsafe_requested readiness */
  readonly unsafeProviderCount: number;
  /** Number of providers that are enabled. Must be 0 in Phase 7D. */
  readonly enabledProviderCount: number;
  /** Number of live providers. Must be 0 in Phase 7D. */
  readonly liveProviderCount: number;
  /** Number of providers with network access. Must be 0 in Phase 7D. */
  readonly networkProviderCount: number;
  /** Human-readable notes about the readiness state — safe to display */
  readonly notes: readonly string[];
}

/**
 * Evaluate the readiness of a single provider given its safe config.
 *
 * Rules:
 *   - If unsafeRequested is true → 'unsafe_requested'
 *   - If mode is 'mock_only' and no unsafe requests → 'mock_only_ready'
 *   - If mode is 'disabled' → 'disabled_safe'
 *   - If mode is 'future_live_not_available' (and somehow no unsafe flags) → 'unavailable'
 *   - Otherwise → 'unknown'
 */
export function evaluateProviderReadiness(config: ProviderConfigSafe): ProviderReadiness {
  if (config.unsafeRequested) {
    return 'unsafe_requested';
  }
  switch (config.mode) {
    case 'disabled':
      return 'disabled_safe';
    case 'mock_only':
      return 'mock_only_ready';
    case 'future_live_not_available':
      return 'unavailable';
    default:
      return 'unknown';
  }
}

/**
 * Build a per-provider readiness entry from a safe config.
 */
export function buildProviderReadinessEntry(config: ProviderConfigSafe): ProviderReadinessEntry {
  const readiness = evaluateProviderReadiness(config);

  let status: string;
  switch (readiness) {
    case 'disabled_safe':
      status = `${config.providerType}: disabled (safe)`;
      break;
    case 'mock_only_ready':
      status = `${config.providerType}: mock-only replay ready (no network)`;
      break;
    case 'unsafe_requested':
      status = `${config.providerType}: UNSAFE — live/network permission was requested (fail-closed)`;
      break;
    case 'unavailable':
      status = `${config.providerType}: unavailable (future placeholder only)`;
      break;
    default:
      status = `${config.providerType}: unknown readiness state`;
  }

  return {
    providerType: config.providerType,
    status,
    readiness,
    config,
    unsafeReasons: config.unsafeReasons,
    canConnect: false,
    canEmitLiveEvents: false,
    canTriggerExecution: false,
  };
}

/**
 * Determine overall readiness from a list of per-provider entries.
 *
 * Rules (in priority order):
 *   1. Any unsafe_requested → overall is 'unsafe_requested'
 *   2. Any unknown → overall is 'unknown'
 *   3. Any unavailable → overall is 'unavailable'
 *   4. Any mock_only_ready (and no disabled) → overall is 'mock_only_ready'
 *   5. All disabled_safe → overall is 'disabled_safe'
 *   6. Empty list → 'disabled_safe' (vacuously safe)
 */
function computeOverallReadiness(entries: readonly ProviderReadinessEntry[]): OverallProviderReadiness {
  if (entries.length === 0) return 'disabled_safe';

  const states = new Set(entries.map((e) => e.readiness));

  if (states.has('unsafe_requested')) return 'unsafe_requested';
  if (states.has('unknown')) return 'unknown';
  if (states.has('unavailable')) return 'unavailable';
  if (states.has('mock_only_ready')) return 'mock_only_ready';
  return 'disabled_safe';
}

/**
 * Generate a readiness report from a list of safe provider configs.
 *
 * If no configs are provided, uses all Phase 7D default disabled configs.
 */
export function buildProviderReadinessReport(
  configs?: readonly ProviderConfigSafe[],
): ProviderReadinessReport {
  const resolvedConfigs =
    configs && configs.length > 0
      ? configs
      : PHASE_7D_PROVIDER_TYPES.map((t) => createDisabledProviderConfig(t));

  const providers = resolvedConfigs.map(buildProviderReadinessEntry);
  const overallReadiness = computeOverallReadiness(providers);

  const unsafeProviderCount = providers.filter((p) => p.readiness === 'unsafe_requested').length;
  const enabledProviderCount = providers.filter((p) => p.config.enabled).length;
  const liveProviderCount = providers.filter((p) => p.config.allowLiveEvents).length;
  const networkProviderCount = providers.filter((p) => p.config.allowNetwork).length;

  const notes: string[] = [
    'Phase 7D: All providers are disabled by default.',
    'No live providers. No network access. No Solana RPC. No WebSocket.',
    'No API key usage. No wallet access. No execution triggers.',
    `Overall readiness: ${overallReadiness}`,
  ];

  if (unsafeProviderCount > 0) {
    notes.push(
      `WARNING: ${unsafeProviderCount} provider(s) requested unsafe permissions. All fail-closed.`,
    );
  }

  return {
    generatedAt: new Date().toISOString(),
    providers,
    overallReadiness,
    unsafeProviderCount,
    enabledProviderCount,
    liveProviderCount,
    networkProviderCount,
    notes,
  };
}

/**
 * Assert that all providers in a report are safe.
 * Returns the report if safe, throws a safe display error if unsafe.
 *
 * Safe error message never contains secrets, URLs, or API keys.
 */
export function assertAllProvidersSafe(report: ProviderReadinessReport): ProviderReadinessReport {
  if (report.unsafeProviderCount > 0) {
    throw new Error(
      `PROVIDER_READINESS_UNSAFE: ${report.unsafeProviderCount} provider(s) requested unsafe permissions. ` +
        'All providers remain disabled and fail-closed. No live access is possible.',
    );
  }
  if (report.enabledProviderCount !== 0 || report.liveProviderCount !== 0 || report.networkProviderCount !== 0) {
    throw new Error(
      'PROVIDER_READINESS_UNSAFE: One or more providers unexpectedly reported enabled/live/network counts > 0. ' +
        'All providers must remain disabled.',
    );
  }
  return report;
}

/**
 * Phase 7D static summary constant.
 * Safe to include in `/system` or status outputs.
 */
export const PHASE_7D_READINESS_SUMMARY = {
  overall: 'disabled_safe',
  helius: 'disabled',
  webSocket: 'disabled',
  yellowstone: 'disabled',
  polling: 'disabled',
  liveProviders: 'forbidden',
  network: 'forbidden',
  solanaRpc: 'forbidden',
  executionTriggers: 'forbidden',
  walletAccess: 'forbidden',
  apiKeyUsage: 'forbidden',
} as const;
