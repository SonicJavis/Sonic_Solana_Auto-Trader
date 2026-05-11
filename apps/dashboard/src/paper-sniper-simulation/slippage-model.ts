/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: slippage model.
 */

import type {
  BuildPaperSniperSlippageModelInput,
  PaperSniperSlippageBucket,
  PaperSniperSlippageModel,
} from './types.js';

function deriveSlippageBucket(
  riskBand: BuildPaperSniperSlippageModelInput['riskBand'],
): PaperSniperSlippageBucket {
  if (riskBand === 'low') return 'minimal';
  if (riskBand === 'moderate') return 'low';
  if (riskBand === 'elevated') return 'medium';
  if (riskBand === 'high') return 'high';
  return 'extreme';
}

export function buildPaperSniperSlippageModel(
  input: BuildPaperSniperSlippageModelInput,
): PaperSniperSlippageModel {
  const slippageBucket = deriveSlippageBucket(input.riskBand);
  const expectedSlippageBps =
    slippageBucket === 'minimal'
      ? 12
      : slippageBucket === 'low'
        ? 24
        : slippageBucket === 'medium'
          ? 52
          : slippageBucket === 'high'
            ? 85
            : 140;

  return {
    modelId: `phase60-slippage-${input.fixtureId}`,
    slippageBucket,
    expectedSlippageBps,
    maxSlippageBps: expectedSlippageBps + (slippageBucket === 'extreme' ? 90 : 40),
    safetyNotes: [
      'Slippage model is fixture-only and deterministic.',
      'No external quote integration is used.',
    ],
  };
}
