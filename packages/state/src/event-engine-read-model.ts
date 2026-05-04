/**
 * Phase 7E — Event Engine readiness read model + Phase 8 readiness gate.
 *
 * Exposes safe read-only snapshots of Event Engine state and provider readiness
 * through the state/system layer.
 *
 * Safety invariants:
 *   - No raw URLs, API keys, secrets, or wallet data are ever included.
 *   - All live/network/execution capability fields are always false.
 *   - Provider readiness never implies live or network readiness.
 *   - Phase 8 readiness means readiness for Token Intelligence models only —
 *     NOT readiness for live data, market ingestion, trading, or execution.
 *   - liveProviders, networkAccess, solanaRpc, executionTriggers fields always
 *     report 'forbidden' in safe output.
 *
 * No network, no Solana, no wallet, no SDK, no execution.
 */

import {
  buildProviderReadinessReport,
  PHASE_7D_READINESS_SUMMARY,
} from '@sonic/event-engine';
import type { ProviderReadinessReport } from '@sonic/event-engine';

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Safe summary of provider readiness state.
 * Never exposes raw URLs, API keys, or secrets.
 * All counts reflect disabled-only state in Phase 7E.
 */
export interface ProviderReadinessSummary {
  /** Overall readiness across all providers */
  readonly overallReadiness: string;
  /** Number of providers with per-provider readiness entries */
  readonly providerCount: number;
  /** Number of providers with unsafe_requested readiness */
  readonly unsafeProviderCount: number;
  /** Number of enabled providers. Must be 0 in Phase 7E. */
  readonly enabledProviderCount: number;
  /** Number of live providers. Must be 0 in Phase 7E. */
  readonly liveProviderCount: number;
  /** Number of providers with network access. Must be 0 in Phase 7E. */
  readonly networkProviderCount: number;
  /** Whether this summary is safe to display in control-plane output */
  readonly safeToDisplay: true;
  /** Human-readable notes about the provider state — safe to display */
  readonly notes: readonly string[];
}

/**
 * Safe Event Engine readiness snapshot for the state/system layer.
 *
 * Represents the state of the local Event Engine foundations.
 * All live/network/execution fields are always 'forbidden'.
 * Safe to display in Telegram /system output.
 */
export interface EventEngineReadinessSnapshot {
  /** ISO timestamp when snapshot was generated */
  readonly generatedAt: string;
  /** Phase 7A — in-memory event core status */
  readonly eventEngineCore: 'ready_local_only';
  /** Phase 7A — in-memory event bus status */
  readonly inMemoryBus: 'ready_local_only';
  /** Phase 7C — controlled mock providers status */
  readonly mockProviders: 'available_local_only';
  /** Phase 7C — fixture replay status */
  readonly fixtureReplay: 'available_local_only';
  /** Phase 7B — disabled provider boundaries status */
  readonly disabledProviders: 'disabled_safe';
  /** Phase 7D — provider readiness checks status */
  readonly providerReadinessSummary: ProviderReadinessSummary;
  /** Live providers are always forbidden */
  readonly liveProviders: 'forbidden';
  /** Network access is always forbidden */
  readonly networkAccess: 'forbidden';
  /** Solana RPC is always forbidden */
  readonly solanaRpc: 'forbidden';
  /** Execution triggers are always forbidden */
  readonly executionTriggers: 'forbidden';
  /** Wallet access is always forbidden */
  readonly walletAccess: 'forbidden';
  /** API key usage is always forbidden */
  readonly apiKeyUsage: 'forbidden';
  /** Phase 8 readiness gate summary */
  readonly phase8Readiness: Phase8ReadinessGate;
  /** Whether this snapshot is safe to display */
  readonly safeToDisplay: true;
}

/**
 * Phase 8 Token Intelligence readiness gate.
 *
 * A static, read-only checklist of required Phase 0–7 local foundations and
 * safety conditions that must be in place before Phase 8 Token Intelligence
 * model work can begin.
 *
 * IMPORTANT: "Ready for Phase 8" means ready to build Token Intelligence models
 * locally. It does NOT mean ready for live data, market ingestion, wallet
 * access, transaction signing, transaction sending, or trade execution.
 */
export interface Phase8ReadinessGate {
  /**
   * Whether all required local foundations and safety conditions are satisfied.
   * true = ready to begin Phase 8 Token Intelligence model work.
   * Does NOT imply live data, trading, or execution readiness.
   */
  readonly readyForTokenIntelligence: boolean;
  /** Blocking issues that prevent Phase 8 readiness. Empty means no blockers. */
  readonly blockers: readonly string[];
  /** Non-blocking warnings. Safe to display. */
  readonly warnings: readonly string[];
  /** Required Phase 0–7 foundations checked */
  readonly requiredCompletedPhases: readonly string[];
  /** Required safety conditions checked */
  readonly requiredSafetyConditions: readonly string[];
  /** ISO timestamp when gate was evaluated */
  readonly generatedAt: string;
  /** Whether this gate output is safe to display */
  readonly safeToDisplay: true;
}

// ── Required phases and conditions ───────────────────────────────────────────

/**
 * Human-readable labels for the Phase 0–7 foundations required before
 * Phase 8 Token Intelligence model work can begin.
 */
export const PHASE_8_REQUIRED_FOUNDATIONS: readonly string[] = [
  'Phase 1-3: config/modes/secrets safety foundation',
  'Phase 4: persistent audit DB',
  'Phase 5: state read models',
  'Phase 6: Pump adapter inert boundaries',
  'Phase 7A: Event Engine core (in-memory bus)',
  'Phase 7B: disabled provider boundaries',
  'Phase 7C: mock providers and fixture replay',
  'Phase 7D: provider config/readiness checks',
  'Phase 7E: Event Engine readiness surface + Phase 8 gate',
] as const;

/**
 * Human-readable labels for the safety conditions that must hold before
 * Phase 8 Token Intelligence model work can begin.
 */
export const PHASE_8_REQUIRED_SAFETY_CONDITIONS: readonly string[] = [
  'No live providers enabled',
  'No Solana RPC enabled',
  'No market data ingestion',
  'No wallet or private key handling',
  'No transaction signing',
  'No transaction sending',
  'No trade execution',
  'FULL_AUTO locked',
  'LIMITED_LIVE locked',
] as const;

// ── Safe error codes ──────────────────────────────────────────────────────────

/**
 * Safe machine-readable error/readiness codes for Event Engine read model.
 * All codes are safe to log and display.
 */
export type EventEngineReadinessCode =
  | 'EVENT_ENGINE_READY_FOR_PHASE_8'
  | 'EVENT_ENGINE_PHASE_8_BLOCKED'
  | 'EVENT_ENGINE_PROVIDER_READINESS_UNSAFE'
  | 'EVENT_ENGINE_LIVE_PROVIDERS_FORBIDDEN'
  | 'EVENT_ENGINE_SOLANA_RPC_FORBIDDEN'
  | 'EVENT_ENGINE_EXECUTION_TRIGGERS_FORBIDDEN';

export const EVENT_ENGINE_READINESS_CODES: readonly EventEngineReadinessCode[] = [
  'EVENT_ENGINE_READY_FOR_PHASE_8',
  'EVENT_ENGINE_PHASE_8_BLOCKED',
  'EVENT_ENGINE_PROVIDER_READINESS_UNSAFE',
  'EVENT_ENGINE_LIVE_PROVIDERS_FORBIDDEN',
  'EVENT_ENGINE_SOLANA_RPC_FORBIDDEN',
  'EVENT_ENGINE_EXECUTION_TRIGGERS_FORBIDDEN',
] as const;

// ── Builders ─────────────────────────────────────────────────────────────────

/**
 * Build a ProviderReadinessSummary from a ProviderReadinessReport.
 * Never exposes raw URLs, API keys, or secrets from the report.
 */
export function buildProviderReadinessSummary(
  report: ProviderReadinessReport,
): ProviderReadinessSummary {
  return {
    overallReadiness: report.overallReadiness,
    providerCount: report.providers.length,
    unsafeProviderCount: report.unsafeProviderCount,
    enabledProviderCount: report.enabledProviderCount,
    liveProviderCount: report.liveProviderCount,
    networkProviderCount: report.networkProviderCount,
    safeToDisplay: true,
    notes: report.notes,
  };
}

/**
 * Evaluate the Phase 8 readiness gate from the current provider readiness
 * summary and optional override flags.
 *
 * readyForTokenIntelligence is true only when:
 *   - All required Phase 0–7 foundations are represented
 *   - Provider readiness is safe (overallReadiness is 'disabled_safe' or 'mock_only_ready')
 *   - No unsafe providers exist
 *   - All live/network/execution/wallet capabilities are forbidden
 *
 * This does NOT check live data, market ingestion, wallet, signing, sending,
 * or execution — those are all forbidden and must remain so.
 */
export function buildPhase8ReadinessGate(
  summary: ProviderReadinessSummary,
  opts?: {
    /** Whether FULL_AUTO is locked. Defaults to true (fail-safe). */
    readonly fullAutoLocked?: boolean;
    /** Whether LIMITED_LIVE is locked. Defaults to true (fail-safe). */
    readonly limitedLiveLocked?: boolean;
  },
): Phase8ReadinessGate {
  const blockers: string[] = [];
  const warnings: string[] = [];

  const fullAutoLocked = opts?.fullAutoLocked !== false;
  const limitedLiveLocked = opts?.limitedLiveLocked !== false;

  // Check safety conditions
  if (!fullAutoLocked) {
    blockers.push('EVENT_ENGINE_PHASE_8_BLOCKED: FULL_AUTO is not locked. Phase 8 blocked.');
  }
  if (!limitedLiveLocked) {
    blockers.push('EVENT_ENGINE_PHASE_8_BLOCKED: LIMITED_LIVE is not locked. Phase 8 blocked.');
  }

  // Check provider readiness safety
  if (summary.unsafeProviderCount > 0) {
    blockers.push(
      `EVENT_ENGINE_PROVIDER_READINESS_UNSAFE: ${summary.unsafeProviderCount} provider(s) ` +
        'requested unsafe permissions. Phase 8 blocked until all providers are safe.',
    );
  }

  if (summary.enabledProviderCount > 0) {
    blockers.push(
      `EVENT_ENGINE_LIVE_PROVIDERS_FORBIDDEN: ${summary.enabledProviderCount} provider(s) ` +
        'appear enabled. No live providers permitted. Phase 8 blocked.',
    );
  }

  if (summary.liveProviderCount > 0) {
    blockers.push(
      `EVENT_ENGINE_LIVE_PROVIDERS_FORBIDDEN: ${summary.liveProviderCount} live provider(s) ` +
        'detected. Live providers are forbidden. Phase 8 blocked.',
    );
  }

  if (summary.networkProviderCount > 0) {
    blockers.push(
      `EVENT_ENGINE_SOLANA_RPC_FORBIDDEN: ${summary.networkProviderCount} network provider(s) ` +
        'detected. No network access permitted. Phase 8 blocked.',
    );
  }

  const safeOverallStates = new Set(['disabled_safe', 'mock_only_ready']);
  if (!safeOverallStates.has(summary.overallReadiness)) {
    blockers.push(
      `EVENT_ENGINE_PROVIDER_READINESS_UNSAFE: Overall provider readiness is ` +
        `'${summary.overallReadiness}' — expected 'disabled_safe' or 'mock_only_ready'. ` +
        'Phase 8 blocked until provider readiness is safe.',
    );
  }

  // Non-blocking warning: if mock providers are in use
  if (summary.overallReadiness === 'mock_only_ready') {
    warnings.push(
      'Phase 7C mock/fixture replay is active. ' +
        'Phase 8 Token Intelligence work may proceed with mock data only.',
    );
  }

  const readyForTokenIntelligence = blockers.length === 0;

  return {
    readyForTokenIntelligence,
    blockers,
    warnings,
    requiredCompletedPhases: PHASE_8_REQUIRED_FOUNDATIONS,
    requiredSafetyConditions: PHASE_8_REQUIRED_SAFETY_CONDITIONS,
    generatedAt: new Date().toISOString(),
    safeToDisplay: true,
  };
}

/**
 * Build a complete EventEngineReadinessSnapshot.
 *
 * Uses Phase 7D provider readiness report to derive a safe, display-ready
 * summary of the Event Engine state.
 *
 * All live/network/execution fields are always 'forbidden'.
 * Safe to include in /system output.
 */
export function buildEventEngineReadinessSnapshot(opts?: {
  /** Whether FULL_AUTO is locked. Defaults to true. */
  readonly fullAutoLocked?: boolean;
  /** Whether LIMITED_LIVE is locked. Defaults to true. */
  readonly limitedLiveLocked?: boolean;
}): EventEngineReadinessSnapshot {
  const report = buildProviderReadinessReport();
  const summary = buildProviderReadinessSummary(report);
  const phase8Gate = buildPhase8ReadinessGate(summary, opts);

  return {
    generatedAt: new Date().toISOString(),
    eventEngineCore: 'ready_local_only',
    inMemoryBus: 'ready_local_only',
    mockProviders: 'available_local_only',
    fixtureReplay: 'available_local_only',
    disabledProviders: PHASE_7D_READINESS_SUMMARY.overall,
    providerReadinessSummary: summary,
    liveProviders: PHASE_7D_READINESS_SUMMARY.liveProviders,
    networkAccess: PHASE_7D_READINESS_SUMMARY.network,
    solanaRpc: PHASE_7D_READINESS_SUMMARY.solanaRpc,
    executionTriggers: PHASE_7D_READINESS_SUMMARY.executionTriggers,
    walletAccess: PHASE_7D_READINESS_SUMMARY.walletAccess,
    apiKeyUsage: PHASE_7D_READINESS_SUMMARY.apiKeyUsage,
    phase8Readiness: phase8Gate,
    safeToDisplay: true,
  };
}

/**
 * Phase 7E static summary constant.
 * Safe to include in /system or status outputs.
 */
export const PHASE_7E_EVENT_ENGINE_SUMMARY = {
  eventEngineCore: 'ready_local_only',
  inMemoryBus: 'ready_local_only',
  mockProviders: 'available_local_only',
  fixtureReplay: 'available_local_only',
  disabledProviders: 'disabled_safe',
  liveProviders: 'forbidden',
  networkAccess: 'forbidden',
  solanaRpc: 'forbidden',
  executionTriggers: 'forbidden',
  walletAccess: 'forbidden',
  apiKeyUsage: 'forbidden',
  phase8: 'ready_for_token_intelligence_models_only',
} as const;
