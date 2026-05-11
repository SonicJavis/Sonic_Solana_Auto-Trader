/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: simulator.
 */

import type {
  PaperSniperSimulationOutcome,
  PaperSniperSimulationStatus,
  PaperSniperSimulationStep,
  RunPaperSniperSimulationInput,
} from './types.js';
import {
  PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
  PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
} from './types.js';

function computeStatus(input: RunPaperSniperSimulationInput): PaperSniperSimulationStatus {
  if (input.failureModel.rejectedBySafetyProbability >= 0.5) return 'simulated_reject';
  if (input.failureModel.aggregateFailureProbability >= 0.35) return 'simulated_partial_fill';
  return 'simulated_fill';
}

function confidenceFromFailure(
  aggregateFailureProbability: number,
): PaperSniperSimulationOutcome['expectedConfidenceLabel'] {
  if (aggregateFailureProbability <= 0.12) return 'high_confidence';
  if (aggregateFailureProbability <= 0.3) return 'moderate_confidence';
  return 'low_confidence';
}

function buildSteps(
  input: RunPaperSniperSimulationInput,
  status: PaperSniperSimulationStatus,
  fillPct: number,
): readonly PaperSniperSimulationStep[] {
  const expectedLatencyMs = input.latencyModel.endToEndLatencyMs;
  const expectedSlippageBps = input.slippageModel.expectedSlippageBps;

  return [
    {
      stepId: `${input.fixtureId}-step-1-quote`,
      stepSequence: 1,
      status,
      expectedFillPct: Math.min(100, fillPct + 8),
      expectedSlippageBps,
      expectedLatencyMs: input.latencyModel.quoteLatencyMs,
      failureReason: input.failureModel.staleQuoteProbability > 0.18 ? 'stale_quote' : 'none',
      summary: 'Synthetic quote phase modeled from deterministic latency/slippage buckets.',
    },
    {
      stepId: `${input.fixtureId}-step-2-submit`,
      stepSequence: 2,
      status,
      expectedFillPct: Math.min(100, fillPct + 3),
      expectedSlippageBps,
      expectedLatencyMs: input.latencyModel.quoteLatencyMs + input.latencyModel.submitLatencyMs,
      failureReason: input.failureModel.routeMismatchProbability > 0.18 ? 'route_mismatch' : 'none',
      summary: 'Synthetic submit phase without signing or sending behavior.',
    },
    {
      stepId: `${input.fixtureId}-step-3-finalize`,
      stepSequence: 3,
      status,
      expectedFillPct: fillPct,
      expectedSlippageBps,
      expectedLatencyMs,
      failureReason:
        status === 'simulated_reject'
          ? 'safety_rejection'
          : input.failureModel.liquidityFailureProbability > 0.2
            ? 'liquidity_failure'
            : 'none',
      summary: 'Synthetic finalize phase remains fixture-only and non-executable.',
    },
  ];
}

export function runPaperSniperSimulation(
  input: RunPaperSniperSimulationInput,
): PaperSniperSimulationOutcome {
  const status = computeStatus(input);
  const rawFill =
    status === 'simulated_reject'
      ? 0
      : status === 'simulated_partial_fill'
        ? 100 - Math.round(input.failureModel.aggregateFailureProbability * 80)
        : 100 - Math.round(input.failureModel.aggregateFailureProbability * 20);
  const expectedFillPct = Math.min(100, Math.max(0, rawFill));
  const expectedSlippageBps =
    input.slippageModel.expectedSlippageBps + input.marketModel.expectedSpreadBps;
  const expectedLatencyMs = input.latencyModel.endToEndLatencyMs;

  return {
    outcomeId: `phase60-outcome-${input.fixtureId}`,
    outcomeStatus: status,
    expectedFillPct,
    expectedSlippageBps,
    expectedLatencyMs,
    expectedFailureProbability: input.failureModel.aggregateFailureProbability,
    expectedConfidenceLabel: confidenceFromFailure(input.failureModel.aggregateFailureProbability),
    summary:
      status === 'simulated_reject'
        ? 'Simulation result: rejected by deterministic safety/failure model.'
        : `Simulation result: ${status} with projected fill ${expectedFillPct}% in deterministic paper context.`,
    safetySummary:
      'Paper sniper simulation is synthetic-only, non-executable, read-only, local-only, and not a trade signal.',
    steps: buildSteps(input, status, expectedFillPct),
    meta: {
      deterministic: true,
      generatedAt: PHASE_60_PAPER_SNIPER_SIMULATION_GENERATED_AT,
      source: PHASE_60_PAPER_SNIPER_SIMULATION_SOURCE,
    },
  };
}
