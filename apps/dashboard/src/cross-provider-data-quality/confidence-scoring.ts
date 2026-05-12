import type { DataQualityConfidenceLabel, ProviderConfidenceScore } from './types.js';

export function classifyProviderConfidenceLabel(score: number): DataQualityConfidenceLabel {
  if (score >= 90) return 'very_high';
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  if (score > 0) return 'low';
  return 'none';
}

export function buildProviderConfidenceScore(input: {
  fixtureId: string;
  score: number;
  reasonCodes: readonly string[];
  healthImpact: number;
  freshnessImpact: number;
  mismatchImpact: number;
  conformanceImpact: number;
  sourceRefs: readonly string[];
}): ProviderConfidenceScore {
  return {
    confidenceScoreId: `${input.fixtureId}-confidence`,
    score: input.score,
    label: classifyProviderConfidenceLabel(input.score),
    reasonCodes: [...input.reasonCodes],
    healthImpact: input.healthImpact,
    freshnessImpact: input.freshnessImpact,
    mismatchImpact: input.mismatchImpact,
    conformanceImpact: input.conformanceImpact,
    sourceRefs: [...input.sourceRefs],
  };
}
