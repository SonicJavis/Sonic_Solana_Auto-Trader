/**
 * Phase 9 — Creator Intelligence v1: Creator launch quality score.
 *
 * Scores the average quality of a creator's launches: holders, liquidity,
 * metadata, and momentum placeholders.
 * Deterministic from fixture/local data only.
 * No network, no Solana RPC, no provider APIs.
 */

import type { CreatorLaunchHistorySnapshot } from './creator-history.js';
import type { CreatorLaunchQualityScore } from './score-types.js';

/**
 * Score the average launch quality for a creator from a history snapshot.
 * Returns a CreatorLaunchQualityScore with component values and reasons.
 *
 * All scores bounded 0–100.
 */
export function scoreLaunchQuality(
  history: CreatorLaunchHistorySnapshot,
): CreatorLaunchQualityScore {
  const reasons: string[] = [];

  // Holder quality: use averageHolderQuality (0–1) scaled to 0–100
  const holderQuality = Math.round(Math.min(100, Math.max(0, history.averageHolderQuality * 100)));
  if (holderQuality < 30) {
    reasons.push('Low average holder quality across launches');
  }

  // Liquidity quality: use averageLiquidityQuality (0–1) scaled to 0–100
  const liquidityQuality = Math.round(
    Math.min(100, Math.max(0, history.averageLiquidityQuality * 100)),
  );
  if (liquidityQuality < 30) {
    reasons.push('Low average liquidity quality across launches');
  }

  // Metadata quality placeholder: estimated from absence of repeated metadata signals
  let metadataQualityPlaceholder = 70; // base reasonable assumption
  if (history.launchCount > 0 && history.repeatedMetadataSignals > 0) {
    const repeatedRate = history.repeatedMetadataSignals / history.launchCount;
    metadataQualityPlaceholder = Math.round(Math.max(0, 70 - repeatedRate * 70));
    if (repeatedRate > 0.3) {
      reasons.push('Repeated metadata patterns detected in launches');
    }
  }

  // Momentum quality placeholder: estimated from average dump speed
  // Lower dump speed = better momentum
  const momentumQualityPlaceholder = Math.round(
    Math.min(100, Math.max(0, (1 - history.averageDumpSpeed) * 100)),
  );
  if (history.averageDumpSpeed > 0.7) {
    reasons.push('High average dump speed — poor post-launch momentum');
  }

  const rawScore =
    holderQuality * 0.3 +
    liquidityQuality * 0.3 +
    metadataQualityPlaceholder * 0.2 +
    momentumQualityPlaceholder * 0.2;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  if (reasons.length === 0) {
    reasons.push(`Launch quality score: ${score}/100 — fixture/local data only`);
  }

  return {
    holderQuality,
    liquidityQuality,
    metadataQualityPlaceholder,
    momentumQualityPlaceholder,
    score,
    reasons,
  };
}
