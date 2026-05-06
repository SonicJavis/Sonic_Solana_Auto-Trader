/**
 * Phase 15 — @sonic/strategy-intent public API barrel.
 *
 * Exports all Phase 15 Strategy Intent types, models, builders,
 * validation helpers, fixtures, and capabilities guard.
 *
 * What this package provides:
 *   - StrategyIntentCapabilities (all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable true)
 *   - StrategyFamily, StrategyEvidenceQuality, StrategyIntentClassification type unions
 *   - StrategyIntentSeverity, StrategySafetyGateStatus type unions
 *   - StrategySafetyGate, StrategyIntentRationale, StrategyIntentFinding model types
 *   - StrategyIntent — analysis-only, non-executable intent model
 *   - StrategyIntentInput, StrategyIntentFixture, StrategyIntentSourceKind types
 *   - StrategyIntentErrorCode, StrategyIntentError, SiResult<T>, siOk, siErr
 *   - getStrategyIntentCapabilities — permanently-safe capabilities
 *   - classifyStrategyFamily — fixture-only family classification
 *   - assessStrategyEvidence — fixture-only evidence quality assessment
 *   - buildStrategySafetyGates — analysis-only safety gates
 *   - buildStrategyIntentRationale — non-actionable rationale builder
 *   - buildStrategyIntent — intent builder (fixture-only, analysis-only)
 *   - validateStrategyIntent — safety invariant validation
 *   - validateStrategyIntentCapabilities — capabilities validation
 *   - containsUnsafeActionText, containsSecretPattern, containsUrlPattern, isDisplaySafe
 *   - 6 deterministic synthetic fixtures + ALL_STRATEGY_INTENT_FIXTURES
 *
 * What this package does NOT provide:
 *   - No real trade intents
 *   - No execution plans
 *   - No order, fill, route, swap models
 *   - No Solana RPC
 *   - No live market data
 *   - No provider API keys or connections
 *   - No wallet / private key handling
 *   - No paper trading
 *   - No trade execution
 *   - No network calls of any kind
 *   - No database writes
 *   - No Telegram alerts
 *   - No transaction construction, simulation, signing, or sending
 *
 * IMPORTANT: StrategyIntent is NOT a real trade intent.
 * It is an internal, fixture-only, analysis-only, non-executable model.
 */

import type { StrategyIntentCapabilities } from './types.js';

export type {
  StrategyIntentCapabilities,
  StrategyFamily,
  StrategyEvidenceQuality,
  StrategyIntentClassification,
  StrategyIntentSeverity,
  StrategySafetyGateStatus,
  StrategySafetyGate,
  StrategyIntentRationale,
  StrategyIntentFinding,
  StrategyIntentSourceKind,
  StrategyIntent,
  StrategyIntentInput,
  StrategyIntentFixture,
  StrategyIntentErrorCode,
} from './types.js';

export type { StrategyIntentError, SiResult } from './errors.js';
export { siOk, siErr } from './errors.js';

export { getStrategyIntentCapabilities } from './capabilities.js';

export type { EvidenceAssessment } from './evidence.js';
export { assessStrategyEvidence } from './evidence.js';

export { classifyStrategyFamily } from './strategy-family.js';

export { buildStrategySafetyGates } from './safety-gates.js';

export { buildStrategyIntentRationale } from './rationale.js';

export { buildStrategyIntent } from './intent-builder.js';

export {
  validateStrategyIntent,
  validateStrategyIntentCapabilities,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
} from './validation.js';

export {
  CLEAN_STRATEGY_INTENT_FIXTURE,
  DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE,
  DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE,
  FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE,
  INCONCLUSIVE_STRATEGY_INTENT_FIXTURE,
  REGRESSION_STRATEGY_INTENT_FIXTURE,
  ALL_STRATEGY_INTENT_FIXTURES,
} from './fixtures.js';

export function getStrategyIntentCapabilitiesGuard(): StrategyIntentCapabilities {
  return {
    canUseLiveData: false,
    canUseSolanaRpc: false,
    canUseProviderApis: false,
    canAccessPrivateKeys: false,
    canCreateTradeIntents: false,
    canCreateExecutionPlans: false,
    canPaperTrade: false,
    canTrade: false,
    canExecute: false,
    canWriteToDatabase: false,
    canSendTelegramAlerts: false,
    canConstructTransactions: false,
    canSimulateTransactions: false,
    fixtureOnly: true,
    analysisOnly: true,
    nonExecutable: true,
  };
}
