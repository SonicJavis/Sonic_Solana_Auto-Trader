/**
 * Phase 9 — Creator Intelligence v1: Creator consistency score.
 *
 * Scores how consistently the creator produces quality launches over time.
 * Deterministic from fixture/local data only.
 * No network, no Solana RPC, no provider APIs.
 */

import type { CreatorLaunchHistorySnapshot } from './creator-history.js';
import type { CreatorConsistencyScore } from './score-types.js';

/** Launch count threshold for "consistent repeat creator" */
const REPEAT_THRESHOLD = 3;

/**
 * Score a creator's consistency from a history snapshot.
 * Returns a CreatorConsistencyScore with component values and reasons.
 *
 * All scores bounded 0–100.
 */
export function scoreConsistency(
  history: CreatorLaunchHistorySnapshot,
): CreatorConsistencyScore {
  const reasons: string[] = [];

  // Repeatability: reward having multiple launches
  const repeatabilityQuality = Math.min(
    100,
    (history.launchCount / REPEAT_THRESHOLD) * 100,
  );
  if (history.launchCount < REPEAT_THRESHOLD) {
    reasons.push(
      `Only ${history.launchCount} launch(es) — repeatability cannot be measured reliably`,
    );
  }

  // Positive history consistency: based on migration rate and peak quality
  let positiveHistoryConsistency = 0;
  if (history.launchCount > 0) {
    const migrationRate = history.migratedLaunchCount / history.launchCount;
    const peakFactor = history.averagePeakQuality / 100;
    positiveHistoryConsistency = Math.round(
      Math.min(100, (migrationRate * 0.6 + peakFactor * 0.4) * 100),
    );
  }

  // Negative history penalty: penalise rug-like behaviour and failures
  let negativeHistoryPenalty = 0;
  if (history.launchCount > 0) {
    const rugRate = history.rugLikeLaunchCount / history.launchCount;
    const failRate = history.failedLaunchCount / history.launchCount;
    negativeHistoryPenalty = -Math.round(
      Math.min(100, (rugRate * 80 + failRate * 40)),
    );
    if (rugRate > 0) {
      reasons.push('Rug-like launches in history reduce consistency score');
    }
    if (failRate > 0.5) {
      reasons.push('High failure rate reduces consistency score');
    }
  }

  const rawScore =
    repeatabilityQuality * 0.25 +
    positiveHistoryConsistency * 0.5 +
    negativeHistoryPenalty * 0.25;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  if (reasons.length === 0) {
    reasons.push(`Consistency score: ${score}/100 — fixture/local data only`);
  }

  return {
    repeatabilityQuality: Math.round(repeatabilityQuality),
    positiveHistoryConsistency,
    negativeHistoryPenalty,
    score,
    reasons,
  };
}
