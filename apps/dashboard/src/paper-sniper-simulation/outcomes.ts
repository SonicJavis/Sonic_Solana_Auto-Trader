/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: outcomes.
 */

import type {
  BuildPaperSniperOutcomesSummaryInput,
  PaperSniperSimulationOutcomesSummary,
} from './types.js';

export function buildPaperSniperSimulationOutcomesSummary(
  input: BuildPaperSniperOutcomesSummaryInput,
): PaperSniperSimulationOutcomesSummary {
  return {
    summaryId: `phase60-summary-${input.fixtureId}`,
    projectedStatus: input.outcome.outcomeStatus,
    simulatedFillPct: input.outcome.expectedFillPct,
    simulatedSlippageBps: input.outcome.expectedSlippageBps,
    simulatedLatencyMs: input.outcome.expectedLatencyMs,
    simulatedFailureProbability: input.outcome.expectedFailureProbability,
    bucketSummary:
      `Buckets: liquidity=${input.marketModel.liquidityBucket}, volatility=${input.marketModel.volatilityBucket}, ` +
      `latency=${input.latencyModel.latencyBucket}, slippage=${input.slippageModel.slippageBucket}, ` +
      `failure=${input.failureModel.failureBucket}.`,
    nonAdvisorySummary:
      'Outcome summary is deterministic paper simulation output only; no executable path exists.',
  };
}
