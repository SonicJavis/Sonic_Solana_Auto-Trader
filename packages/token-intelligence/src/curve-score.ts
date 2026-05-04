/**
 * Phase 8 — Token Intelligence v1: Curve quality scoring.
 *
 * Scores bonding curve progress from local/fixture metric data.
 * Deterministic, no network calls, no provider APIs.
 */

import type { TokenMetricSnapshot } from './token-profile.js';
import type { CurveQualityScore } from './score-types.js';

/** Ideal curve progress lower bound */
const IDEAL_CURVE_MIN = 0.05;
/** Ideal curve progress upper bound */
const IDEAL_CURVE_MAX = 0.85;

/**
 * Score the curve progress position 0–1.
 * Penalises very early (<5%) and very advanced (>85%) curves.
 */
function scoreCurveProgressQuality(curveProgress: number): number {
  if (curveProgress < IDEAL_CURVE_MIN) return curveProgress / IDEAL_CURVE_MIN; // linear ramp up from 0
  if (curveProgress > IDEAL_CURVE_MAX)
    return 1 - (curveProgress - IDEAL_CURVE_MAX) / (1 - IDEAL_CURVE_MAX);
  return 1;
}

/**
 * Compute the too-early/too-advanced penalty 0–1.
 * 0 = no penalty, 1 = maximum penalty.
 */
function computeTooEarlyOrTooLatePenalty(curveProgress: number): number {
  if (curveProgress < IDEAL_CURVE_MIN) {
    return 1 - curveProgress / IDEAL_CURVE_MIN;
  }
  if (curveProgress > IDEAL_CURVE_MAX) {
    return (curveProgress - IDEAL_CURVE_MAX) / (1 - IDEAL_CURVE_MAX);
  }
  return 0;
}

/**
 * Compute a CurveQualityScore from a TokenMetricSnapshot.
 * Deterministic from fixture data only. No network calls.
 */
export function scoreCurve(metrics: TokenMetricSnapshot): CurveQualityScore {
  const curveProgressQuality = Math.min(1, Math.max(0, scoreCurveProgressQuality(metrics.curveProgress)));
  const reserveQuality = Math.min(1, Math.max(0, metrics.reserveQuality));
  const tooEarlyOrTooLatePenalty = computeTooEarlyOrTooLatePenalty(metrics.curveProgress);

  // Weighted composite: curve progress quality 50%, reserve quality 30%, penalty -20%
  const raw =
    curveProgressQuality * 0.5 +
    reserveQuality * 0.3 +
    (1 - tooEarlyOrTooLatePenalty) * 0.2;

  const score = Math.round(Math.min(100, Math.max(0, raw * 100)));

  const reasons: string[] = [];
  if (metrics.curveProgress < IDEAL_CURVE_MIN) {
    reasons.push('Curve is very early — insufficient on-curve activity observed');
  } else if (metrics.curveProgress > IDEAL_CURVE_MAX) {
    reasons.push('Curve is very advanced — limited window for analysis');
  } else {
    reasons.push('Curve progress is within the analysis window');
  }
  if (reserveQuality < 0.3) reasons.push('Reserve quality is low');
  if (tooEarlyOrTooLatePenalty > 0.5) reasons.push('Significant early/late curve penalty applied');

  return {
    curveProgressQuality,
    reserveQuality,
    tooEarlyOrTooLatePenalty,
    score,
    reasons,
  };
}
