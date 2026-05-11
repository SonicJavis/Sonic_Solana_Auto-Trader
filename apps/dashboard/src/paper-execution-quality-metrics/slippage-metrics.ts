/**
 * Phase 61 — Paper Execution Quality Metrics v1: slippage metrics.
 */

import type {
  BuildPaperSlippageMetricsInput,
  PaperExecutionLiquiditySensitivityLabel,
  PaperExecutionPriceImpactBucket,
  PaperExecutionSlippageBucket,
  PaperExecutionSlippageQualityLabel,
  PaperSlippageMetrics,
} from './types.js';

function mapSlippageBucket(
  sourceSlippageBucket: BuildPaperSlippageMetricsInput['sourceSlippageBucket'],
): PaperExecutionSlippageBucket {
  if (sourceSlippageBucket === 'minimal') return 'negligible';
  if (sourceSlippageBucket === 'low') return 'low';
  if (sourceSlippageBucket === 'medium') return 'medium';
  if (sourceSlippageBucket === 'high') return 'high';
  return 'extreme';
}

function mapPriceImpactBucket(
  slippageBucket: PaperExecutionSlippageBucket,
): PaperExecutionPriceImpactBucket {
  if (slippageBucket === 'negligible') return 'minimal';
  if (slippageBucket === 'low') return 'light';
  if (slippageBucket === 'medium') return 'moderate';
  return 'heavy';
}

function mapLiquiditySensitivity(
  sourceLiquidityBucket: BuildPaperSlippageMetricsInput['sourceLiquidityBucket'],
): PaperExecutionLiquiditySensitivityLabel {
  if (sourceLiquidityBucket === 'deep') return 'insensitive';
  if (sourceLiquidityBucket === 'balanced') return 'moderate';
  if (sourceLiquidityBucket === 'thin') return 'sensitive';
  return 'fragile';
}

function mapSlippageQualityLabel(
  slippageBucket: PaperExecutionSlippageBucket,
): PaperExecutionSlippageQualityLabel {
  if (slippageBucket === 'negligible' || slippageBucket === 'low') return 'quality_high';
  if (slippageBucket === 'medium') return 'quality_moderate';
  if (slippageBucket === 'high') return 'quality_limited';
  return 'quality_degraded';
}

export function buildPaperSlippageMetrics(
  input: BuildPaperSlippageMetricsInput,
): PaperSlippageMetrics {
  const simulatedSlippageBucket = mapSlippageBucket(input.sourceSlippageBucket);

  return {
    metricsId: `phase61-slippage-${input.fixtureId}`,
    simulatedSlippageBucket,
    syntheticPriceImpactBucket: mapPriceImpactBucket(simulatedSlippageBucket),
    liquiditySensitivityLabel: mapLiquiditySensitivity(input.sourceLiquidityBucket),
    slippageQualityLabel: mapSlippageQualityLabel(simulatedSlippageBucket),
    qualityNotes: [
      'Slippage metrics are synthetic and fixture-derived only.',
      'No live quotes or real market prices are used.',
    ],
  };
}
