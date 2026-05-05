/**
 * Phase 13 — @sonic/replay-lab public API barrel.
 *
 * Exports all Phase 13 Replay Lab types, models, validation, replay runner,
 * comparison utilities, and deterministic fixture scenarios.
 *
 * What this package provides:
 *   - ReplayVerdict, ReplayStepType, ReplayErrorCode types
 *   - ReplayLabCapabilities (all unsafe fields false, fixtureOnly true)
 *   - ReplayStep, ReplayScenario, ReplayRun, ReplayComparison model types
 *   - Summary types: TokenReplaySummary, CreatorReplaySummary, WalletReplaySummary,
 *     ManipulationReplaySummary, RiskReplaySummary, ReplaySummary
 *   - ReplayStepResult, ReplayLabError, RlResult<T>
 *   - rlOk, rlErr, isSafeErrorMessage error helpers
 *   - validateVerdict, validateReplayStep, validateReplayScenario,
 *     validateReplayStepResult, validateReplayRun, validateReplayComparison
 *   - buildReplayStep, buildReplayScenario builders
 *   - buildReplayStepResult, buildReplaySummary, runReplayScenario engine
 *   - compareReplayRuns comparison utility
 *   - getReplayLabCapabilities capabilities guard
 *   - 8 deterministic synthetic fixture scenarios + ALL_REPLAY_FIXTURES array
 *
 * What this package does NOT provide:
 *   - No Solana RPC
 *   - No live market data
 *   - No provider API keys or connections
 *   - No wallet / private key handling
 *   - No trade intents or execution plans
 *   - No paper trading
 *   - No trade execution
 *   - No network calls of any kind
 */

import type { ReplayLabCapabilities } from './types.js';

export type {
  ReplayVerdict,
  ReplayStepType,
  ReplayErrorCode,
  ReplayLabCapabilities,
  ReplayStep,
  ReplayScenario,
  TokenReplaySummary,
  CreatorReplaySummary,
  WalletReplaySummary,
  ManipulationReplaySummary,
  RiskReplaySummary,
  ReplayStepResult,
  ReplaySummary,
  ReplayRun,
  ReplayComparison,
  ReplayLabError,
  RlResult,
} from './types.js';

export { rlErr, rlOk, isSafeErrorMessage } from './errors.js';

export {
  validateVerdict,
  validateReplayStep,
  validateReplayScenario,
  validateReplayStepResult,
  validateReplayRun,
  validateReplayComparison,
} from './validation.js';

export type { BuildReplayScenarioInput } from './replay-scenario.js';
export { buildReplayScenario } from './replay-scenario.js';

export type { BuildReplayStepInput } from './replay-step.js';
export { buildReplayStep } from './replay-step.js';

export { buildReplayStepResult } from './replay-result.js';
export { buildReplaySummary } from './replay-summary.js';
export { runReplayScenario } from './replay-run.js';
export { compareReplayRuns } from './comparison.js';

export {
  CLEAN_TOKEN_REPLAY_SCENARIO,
  RISKY_CREATOR_REPLAY_SCENARIO,
  WALLET_CLUSTER_RISK_REPLAY_SCENARIO,
  MANIPULATION_REJECT_REPLAY_SCENARIO,
  MIXED_WARNING_REPLAY_SCENARIO,
  MISSING_DATA_REPLAY_SCENARIO,
  REGRESSION_COMPARISON_BASELINE_SCENARIO,
  REGRESSION_COMPARISON_CANDIDATE_SCENARIO,
  ALL_REPLAY_FIXTURES,
} from './fixtures.js';

export function getReplayLabCapabilities(): ReplayLabCapabilities {
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
    fixtureOnly: true,
  };
}
