/**
 * Phase 12 — Risk Engine v1: Confidence calculation.
 */

import type { RiskAssessmentInput } from './risk-input.js';
import type { RiskPolicy } from './risk-policy.js';

export function calculateRiskConfidence(
  input: RiskAssessmentInput,
  _policy: RiskPolicy,
): number {
  let presentCount = 0;
  let confidenceSum = 0;

  if (input.tokenIntelligence) {
    presentCount++;
    confidenceSum += input.tokenIntelligence.confidence;
  }
  if (input.creatorIntelligence) {
    presentCount++;
    confidenceSum += input.creatorIntelligence.confidence;
  }
  if (input.walletClusterIntelligence) {
    presentCount++;
    confidenceSum += input.walletClusterIntelligence.confidence;
  }
  if (input.manipulationDetection) {
    presentCount++;
    confidenceSum += input.manipulationDetection.confidence;
  }

  if (presentCount === 0) return 0;

  const avgComponentConfidence = confidenceSum / presentCount;
  const coverageRatio = presentCount / 4;

  return Math.min(1, Math.max(0, avgComponentConfidence * 0.6 + coverageRatio * 0.4));
}
