/**
 * Phase 9 — Creator Intelligence v1: Creator suspicious pattern score.
 *
 * Scores the ABSENCE of suspicious patterns (higher = safer).
 * Penalises suspicious funding, repeated metadata, bundle abuse, rug launches,
 * and fast dump history.
 *
 * IMPORTANT: Score range 0–100, where:
 *   100 = no suspicious patterns detected (safest)
 *   0   = maximum suspicious patterns detected (least safe)
 *
 * This score is used as a SAFETY QUALITY signal, not a quality signal.
 * High suspicious pattern score = fewer suspicious patterns observed.
 *
 * Deterministic from fixture/local data only.
 * No network, no Solana RPC, no provider APIs.
 * Wallet cluster and bundle detection are placeholder only in Phase 9.
 */

import type { CreatorLaunchHistorySnapshot } from './creator-history.js';
import type { CreatorSuspiciousPatternScore } from './score-types.js';

/**
 * Score a creator's suspicious pattern safety from a history snapshot.
 * Returns a CreatorSuspiciousPatternScore.
 *
 * Higher score = safer (fewer suspicious patterns).
 * All penalties are ≤0.
 */
export function scoreSuspiciousPatterns(
  history: CreatorLaunchHistorySnapshot,
): CreatorSuspiciousPatternScore {
  const reasons: string[] = [];

  // Suspicious funding penalty (placeholder)
  let suspiciousFundingPenalty = 0;
  if (history.suspiciousFundingSignals > 0) {
    suspiciousFundingPenalty = -Math.min(
      40,
      history.suspiciousFundingSignals * 15,
    );
    reasons.push(
      `${history.suspiciousFundingSignals} suspicious funding signal(s) detected (placeholder analysis)`,
    );
  }

  // Repeated metadata penalty (placeholder)
  let repeatedMetadataPenalty = 0;
  if (history.repeatedMetadataSignals > 0) {
    repeatedMetadataPenalty = -Math.min(
      30,
      history.repeatedMetadataSignals * 10,
    );
    reasons.push(
      `${history.repeatedMetadataSignals} repeated metadata signal(s) detected (placeholder analysis)`,
    );
  }

  // Bundle abuse penalty (placeholder)
  let bundleAbusePenalty = 0;
  if (history.bundleAbuseSignals > 0) {
    bundleAbusePenalty = -Math.min(
      40,
      history.bundleAbuseSignals * 20,
    );
    reasons.push(
      `${history.bundleAbuseSignals} bundle abuse signal(s) detected (placeholder analysis)`,
    );
  }

  // Rug-like launch penalty
  let rugLikeLaunchPenalty = 0;
  if (history.rugLikeLaunchCount > 0) {
    rugLikeLaunchPenalty = -Math.min(60, history.rugLikeLaunchCount * 25);
    reasons.push(`${history.rugLikeLaunchCount} rug-like launch(es) in history`);
  }

  // Fast dump penalty
  let fastDumpPenalty = 0;
  if (history.averageDumpSpeed > 0.5) {
    fastDumpPenalty = -Math.round(history.averageDumpSpeed * 40);
    reasons.push('High average dump speed indicates fast exit patterns');
  }

  const rawScore =
    100 +
    suspiciousFundingPenalty +
    repeatedMetadataPenalty +
    bundleAbusePenalty +
    rugLikeLaunchPenalty +
    fastDumpPenalty;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  if (reasons.length === 0) {
    reasons.push('No suspicious patterns detected in fixture data — analysis only');
  }

  return {
    suspiciousFundingPenalty: Math.round(suspiciousFundingPenalty),
    repeatedMetadataPenalty: Math.round(repeatedMetadataPenalty),
    bundleAbusePenalty: Math.round(bundleAbusePenalty),
    rugLikeLaunchPenalty: Math.round(rugLikeLaunchPenalty),
    fastDumpPenalty: Math.round(fastDumpPenalty),
    score,
    reasons,
  };
}
