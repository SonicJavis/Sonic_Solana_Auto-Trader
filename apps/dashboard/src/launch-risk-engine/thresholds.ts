/**
 * Phase 58 — Launch Risk Engine v1: thresholds.
 *
 * Deterministic risk band threshold definitions.
 * Non-advisory, synthetic, local-only.
 */

import type { LaunchRiskBand, LaunchRiskThresholds } from './types.js';

export const LAUNCH_RISK_ENGINE_DEFAULT_THRESHOLDS: LaunchRiskThresholds = {
  low: 0.20,
  moderate: 0.20,
  elevated: 0.40,
  high: 0.60,
  rejected: 1.00,
} as const;

export function classifyLaunchRiskBand(
  totalRiskScore: number,
  thresholds: LaunchRiskThresholds = LAUNCH_RISK_ENGINE_DEFAULT_THRESHOLDS,
): LaunchRiskBand {
  if (totalRiskScore >= thresholds.rejected) {
    return 'rejected';
  }
  if (totalRiskScore >= thresholds.high) {
    return 'high';
  }
  if (totalRiskScore >= thresholds.elevated) {
    return 'elevated';
  }
  if (totalRiskScore >= thresholds.moderate) {
    return 'moderate';
  }
  return 'low';
}
