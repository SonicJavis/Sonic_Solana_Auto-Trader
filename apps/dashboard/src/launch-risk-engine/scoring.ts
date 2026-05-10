/**
 * Phase 58 — Launch Risk Engine v1: scoring.
 *
 * Deterministic rule-based risk score calculation.
 * Non-advisory, synthetic, local-only.
 */

import type { LaunchRiskFactorOutput } from './types.js';

export function calculateLaunchRiskScore(
  factorOutputs: readonly LaunchRiskFactorOutput[],
): number {
  if (factorOutputs.length === 0) {
    return 0;
  }
  const totalWeightedContribution = factorOutputs.reduce(
    (sum, factor) => sum + factor.scoreContribution * factor.weight,
    0,
  );
  const totalWeight = factorOutputs.reduce((sum, factor) => sum + factor.weight, 0);
  if (totalWeight === 0) {
    return 0;
  }
  const score = totalWeightedContribution / totalWeight;
  return Math.min(1, Math.max(0, score));
}
