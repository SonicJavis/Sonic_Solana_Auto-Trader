/**
 * Phase 8 — Token Intelligence v1: Holder concentration scoring.
 *
 * Scores holder distribution from local/fixture metric data.
 * Deterministic, no network calls, no provider APIs.
 */

import type { TokenMetricSnapshot } from './token-profile.js';
import type { HolderConcentrationScore } from './score-types.js';

/** Minimum holder count for a good score */
const MIN_GOOD_HOLDER_COUNT = 50;
/** Top holder percent threshold that triggers a high penalty */
const HIGH_CONCENTRATION_THRESHOLD = 30;
/** Top holder percent threshold that triggers a critical penalty */
const CRITICAL_CONCENTRATION_THRESHOLD = 50;

/**
 * Score holder count quality 0–1.
 * More holders = higher quality.
 */
function scoreHolderCountQuality(holderCount: number): number {
  if (holderCount <= 0) return 0;
  if (holderCount >= MIN_GOOD_HOLDER_COUNT) return 1;
  return holderCount / MIN_GOOD_HOLDER_COUNT;
}

/**
 * Compute top holder penalty 0–1.
 * Higher top holder percent = higher penalty.
 */
function computeTopHolderPenalty(topHolderPercent: number): number {
  if (topHolderPercent >= CRITICAL_CONCENTRATION_THRESHOLD) return 1;
  if (topHolderPercent >= HIGH_CONCENTRATION_THRESHOLD) {
    return (
      0.5 +
      ((topHolderPercent - HIGH_CONCENTRATION_THRESHOLD) /
        (CRITICAL_CONCENTRATION_THRESHOLD - HIGH_CONCENTRATION_THRESHOLD)) *
        0.5
    );
  }
  return topHolderPercent / HIGH_CONCENTRATION_THRESHOLD / 2;
}

/**
 * Compute a HolderConcentrationScore from a TokenMetricSnapshot.
 * Deterministic from fixture data only. No network calls.
 */
export function scoreHolderConcentration(metrics: TokenMetricSnapshot): HolderConcentrationScore {
  const holderCountQuality = scoreHolderCountQuality(metrics.holderCount);
  const topHolderPenalty = computeTopHolderPenalty(metrics.topHolderPercent);
  const concentrationRisk = Math.min(1, Math.max(0, topHolderPenalty));

  // Weighted composite: holder count 50%, concentration risk inverse 50%
  const raw = holderCountQuality * 0.5 + (1 - concentrationRisk) * 0.5;

  const score = Math.round(Math.min(100, Math.max(0, raw * 100)));

  const reasons: string[] = [];
  if (metrics.holderCount < 10) reasons.push('Very few holders detected');
  else if (metrics.holderCount < MIN_GOOD_HOLDER_COUNT) reasons.push('Low holder count');
  if (metrics.topHolderPercent >= CRITICAL_CONCENTRATION_THRESHOLD) {
    reasons.push('Top holder(s) hold a critical concentration of supply');
  } else if (metrics.topHolderPercent >= HIGH_CONCENTRATION_THRESHOLD) {
    reasons.push('Top holder(s) hold a high concentration of supply');
  }
  if (score >= 70) reasons.push('Holder distribution is acceptable for fixture analysis');

  return {
    topHolderPenalty,
    holderCountQuality,
    concentrationRisk,
    score,
    reasons,
  };
}
