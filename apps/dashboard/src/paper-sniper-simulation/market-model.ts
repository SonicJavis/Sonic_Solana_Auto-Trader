/**
 * Phase 60 — Paper Sniper Simulation Foundation v1: market model.
 */

import type {
  BuildPaperSniperMarketModelInput,
  PaperSniperMarketLiquidityBucket,
  PaperSniperMarketModel,
  PaperSniperMarketVolatilityBucket,
} from './types.js';

function deriveLiquidityBucket(
  riskBand: BuildPaperSniperMarketModelInput['riskBand'],
): PaperSniperMarketLiquidityBucket {
  if (riskBand === 'low') return 'deep';
  if (riskBand === 'moderate') return 'balanced';
  if (riskBand === 'elevated') return 'thin';
  return 'critical';
}

function deriveVolatilityBucket(
  riskBand: BuildPaperSniperMarketModelInput['riskBand'],
): PaperSniperMarketVolatilityBucket {
  if (riskBand === 'low') return 'calm';
  if (riskBand === 'moderate') return 'steady';
  if (riskBand === 'elevated') return 'elevated';
  return 'severe';
}

export function buildPaperSniperMarketModel(
  input: BuildPaperSniperMarketModelInput,
): PaperSniperMarketModel {
  const liquidityBucket = deriveLiquidityBucket(input.riskBand);
  const volatilityBucket = deriveVolatilityBucket(input.riskBand);

  const marketDepthUsd =
    liquidityBucket === 'deep'
      ? 125000
      : liquidityBucket === 'balanced'
        ? 74000
        : liquidityBucket === 'thin'
          ? 31000
          : 12000;

  const expectedSpreadBps =
    volatilityBucket === 'calm'
      ? 8
      : volatilityBucket === 'steady'
        ? 14
        : volatilityBucket === 'elevated'
          ? 28
          : 46;

  return {
    modelId: `phase60-market-${input.fixtureId}`,
    liquidityBucket,
    volatilityBucket,
    marketDepthUsd,
    expectedSpreadBps,
    safetyNotes: [
      `Synthetic market model linked to ${input.sourcePhase58FixtureName}.`,
      'No live market feed or executable order path is used.',
    ],
  };
}
