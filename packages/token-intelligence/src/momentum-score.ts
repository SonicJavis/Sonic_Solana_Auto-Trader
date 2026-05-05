/**
 * Phase 8 — Token Intelligence v1: Organic momentum scoring.
 *
 * Scores buy/sell balance and volume trend from local/fixture metric data.
 * Deterministic, no network calls, no provider APIs.
 */

import type { TokenMetricSnapshot } from './token-profile.js';
import type { OrganicMomentumScore } from './score-types.js';

/** Minimum unique buyer count for a good score */
const MIN_GOOD_UNIQUE_BUYERS = 20;

/**
 * Compute buy/sell balance -1 to 1.
 * Positive = buy-heavy, negative = sell-heavy.
 */
function computeBuySellBalance(buyVelocity: number, sellVelocity: number): number {
  const total = buyVelocity + sellVelocity;
  if (total <= 0) return 0;
  return (buyVelocity - sellVelocity) / total;
}

/**
 * Score unique buyer quality 0–1.
 * More unique buyers = higher quality.
 */
function scoreUniqueBuyerQuality(uniqueBuyerCount: number): number {
  if (uniqueBuyerCount <= 0) return 0;
  if (uniqueBuyerCount >= MIN_GOOD_UNIQUE_BUYERS) return 1;
  return uniqueBuyerCount / MIN_GOOD_UNIQUE_BUYERS;
}

/**
 * Score volume trend quality 0–1.
 * Positive trend = higher quality; maps -1..1 to 0..1.
 */
function scoreVolumeTrendQuality(volumeTrend: number): number {
  return Math.min(1, Math.max(0, (volumeTrend + 1) / 2));
}

/**
 * Compute an OrganicMomentumScore from a TokenMetricSnapshot.
 * Deterministic from fixture data only. No network calls.
 */
export function scoreMomentum(metrics: TokenMetricSnapshot): OrganicMomentumScore {
  const buySellBalance = computeBuySellBalance(metrics.buyVelocity, metrics.sellVelocity);
  const uniqueBuyerQuality = scoreUniqueBuyerQuality(metrics.uniqueBuyerCount);
  const volumeTrendQuality = scoreVolumeTrendQuality(metrics.volumeTrend);

  // Weighted composite:
  //   buy/sell balance (normalised to 0–1) 40%, unique buyers 35%, volume trend 25%
  const normalizedBalance = Math.min(1, Math.max(0, (buySellBalance + 1) / 2));
  const raw = normalizedBalance * 0.4 + uniqueBuyerQuality * 0.35 + volumeTrendQuality * 0.25;

  const score = Math.round(Math.min(100, Math.max(0, raw * 100)));

  const reasons: string[] = [];
  if (buySellBalance < -0.3) {
    reasons.push('Sell pressure is high relative to buy activity');
  } else if (buySellBalance > 0.3) {
    reasons.push('Buy activity dominates sell activity');
  } else {
    reasons.push('Buy/sell activity is roughly balanced');
  }
  if (metrics.uniqueBuyerCount < 5) reasons.push('Very few unique buyers detected');
  if (metrics.volumeTrend < -0.3) reasons.push('Volume trend is declining');
  if (score >= 65) reasons.push('Momentum metrics are acceptable for fixture analysis');

  return {
    buySellBalance,
    uniqueBuyerQuality,
    volumeTrendQuality,
    botNoisePlaceholder: false,
    score,
    reasons,
  };
}
