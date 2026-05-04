/**
 * Phase 8 — Token Intelligence v1: Liquidity quality scoring.
 *
 * Scores liquidity depth from local/fixture metric data.
 * Deterministic, no network calls, no provider APIs.
 */

import type { TokenMetricSnapshot } from './token-profile.js';
import type { LiquidityQualityScore } from './score-types.js';

/** Virtual liquidity level considered minimal (SOL-equivalent units) */
const MIN_LIQUIDITY = 1;
/** Virtual liquidity level considered good (SOL-equivalent units) */
const GOOD_LIQUIDITY = 30;

/**
 * Score virtual liquidity quality 0–1.
 * More liquidity = higher quality, up to GOOD_LIQUIDITY.
 */
function scoreVirtualLiquidityQuality(virtualLiquidity: number): number {
  if (virtualLiquidity <= 0) return 0;
  if (virtualLiquidity >= GOOD_LIQUIDITY) return 1;
  if (virtualLiquidity < MIN_LIQUIDITY) return virtualLiquidity / MIN_LIQUIDITY * 0.3;
  return 0.3 + ((virtualLiquidity - MIN_LIQUIDITY) / (GOOD_LIQUIDITY - MIN_LIQUIDITY)) * 0.7;
}

/**
 * Compute a LiquidityQualityScore from a TokenMetricSnapshot.
 * Deterministic from fixture data only. No network calls.
 */
export function scoreLiquidity(metrics: TokenMetricSnapshot): LiquidityQualityScore {
  const virtualLiquidityQuality = Math.min(1, Math.max(0, scoreVirtualLiquidityQuality(metrics.virtualLiquidity)));
  const reserveQuality = Math.min(1, Math.max(0, metrics.reserveQuality));

  // Weighted composite: virtual liquidity 60%, reserve quality 40%
  const raw = virtualLiquidityQuality * 0.6 + reserveQuality * 0.4;

  const score = Math.round(Math.min(100, Math.max(0, raw * 100)));

  const reasons: string[] = [];
  if (metrics.virtualLiquidity <= 0) {
    reasons.push('No virtual liquidity detected');
  } else if (metrics.virtualLiquidity < MIN_LIQUIDITY) {
    reasons.push('Virtual liquidity is critically low');
  } else if (metrics.virtualLiquidity < GOOD_LIQUIDITY) {
    reasons.push('Virtual liquidity is below the good threshold');
  } else {
    reasons.push('Virtual liquidity is at a good level for fixture analysis');
  }
  if (reserveQuality < 0.3) reasons.push('Reserve quality is low');

  return {
    virtualLiquidityQuality,
    reserveQuality,
    exitLiquidityPlaceholder: null,
    score,
    reasons,
  };
}
