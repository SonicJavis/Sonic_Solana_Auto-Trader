/**
 * Phase 9 — Creator Intelligence v1: Creator success score.
 *
 * Scores historical launch success: migration rate, failure rate, peak quality.
 * Deterministic from fixture/local data only.
 * No network, no Solana RPC, no provider APIs.
 */

import type { CreatorLaunchHistorySnapshot } from './creator-history.js';
import type { CreatorSuccessScore } from './score-types.js';

/** Minimum launches considered "established" for full confidence */
const ESTABLISHED_LAUNCH_COUNT = 5;

/**
 * Score a creator's historical launch success from a history snapshot.
 * Returns a CreatorSuccessScore with component values and reasons.
 *
 * All scores bounded 0–100.
 * Missing or zero data gracefully produces low scores with explanatory reasons.
 */
export function scoreSuccess(history: CreatorLaunchHistorySnapshot): CreatorSuccessScore {
  const reasons: string[] = [];

  // Launch count quality: reward more launches up to ESTABLISHED_LAUNCH_COUNT
  const launchCountQuality = Math.min(
    100,
    (history.launchCount / ESTABLISHED_LAUNCH_COUNT) * 100,
  );
  if (history.launchCount === 0) {
    reasons.push('No launch history observed — insufficient data');
  } else if (history.launchCount < 3) {
    reasons.push(`Only ${history.launchCount} launch(es) observed — limited history`);
  }

  // Migration rate quality: reward high migration rate
  let migrationRateQuality = 0;
  if (history.launchCount > 0) {
    migrationRateQuality = (history.migratedLaunchCount / history.launchCount) * 100;
    if (migrationRateQuality < 20) {
      reasons.push('Low migration rate — few launches reached graduation');
    }
  } else {
    reasons.push('Migration rate unknown — no launches recorded');
  }

  // Peak quality: use the average peak quality directly (already 0–100)
  const peakQuality = Math.min(100, Math.max(0, history.averagePeakQuality));
  if (peakQuality < 30) {
    reasons.push('Average peak quality is low across observed launches');
  }

  // Failure penalty: penalise high failure rates
  let failurePenalty = 0;
  if (history.launchCount > 0) {
    const failureRate = history.failedLaunchCount / history.launchCount;
    failurePenalty = -(failureRate * 60);
    if (failureRate > 0.5) {
      reasons.push('High failure rate — majority of launches failed');
    }
  }

  const rawScore =
    launchCountQuality * 0.2 +
    migrationRateQuality * 0.35 +
    peakQuality * 0.3 +
    failurePenalty * 0.15;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  if (reasons.length === 0) {
    reasons.push(`Success score: ${score}/100 — fixture/local data only`);
  }

  return {
    launchCountQuality: Math.round(launchCountQuality),
    migrationRateQuality: Math.round(migrationRateQuality),
    peakQuality: Math.round(peakQuality),
    failurePenalty: Math.round(failurePenalty),
    score,
    reasons,
  };
}
