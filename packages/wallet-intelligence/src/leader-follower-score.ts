/**
 * Phase 10 — Wallet Cluster Intelligence v1: Leader-follower score.
 *
 * Deterministic scoring of leader-follower coordination signals in a cluster.
 * No network calls, no Solana RPC, no provider APIs.
 * Higher final score = fewer leader-follower coordination risks.
 */

import type { WalletCluster } from './wallet-cluster.js';
import type { LeaderFollowerScore } from './score-types.js';

/** clamp helper */
function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val));
}

/**
 * Score the leader-follower coordination risk of a wallet cluster.
 * Returns a LeaderFollowerScore with all components bounded 0–100.
 */
export function scoreLeaderFollower(cluster: WalletCluster): LeaderFollowerScore {
  const reasons: string[] = [];

  // Leader signal quality: higher leader-follower signal count indicates
  // structured coordination — treated as a risk (lower = less risk, but
  // medium leader signals can indicate a smart cluster).
  // We use a nuanced approach: very high leader signals are risky.
  const leaderSignalCount = cluster.leaderFollowerSignalCount;
  const leaderSignalQuality = clamp(
    leaderSignalCount <= 2 ? 80 : leaderSignalCount <= 5 ? 50 : 20,
  );

  // Follower noise penalty: same-slot participation signals indicate
  // potential follower bot noise
  const followerNoisePenalty = clamp(
    cluster.sameSlotParticipationSignalCount * 12,
    0,
    60,
  );
  if (cluster.sameSlotParticipationSignalCount > 0) {
    reasons.push(
      `Same-slot participation signals: ${cluster.sameSlotParticipationSignalCount} (placeholder)`,
    );
  }

  // Same-slot penalty: direct penalty for same-slot signals
  const sameSlotPenalty = clamp(
    cluster.sameSlotParticipationSignalCount * 8,
    0,
    40,
  );

  // Coordinated-sell penalty
  const coordinatedSellPenalty = clamp(
    cluster.coordinatedSellSignalCount * 15,
    0,
    60,
  );
  if (cluster.coordinatedSellSignalCount > 0) {
    reasons.push(
      `Coordinated sell signals: ${cluster.coordinatedSellSignalCount} (placeholder)`,
    );
  }

  // Combine: start from leader quality, apply penalties
  const rawScore =
    leaderSignalQuality -
    (followerNoisePenalty * 0.3 + sameSlotPenalty * 0.3 + coordinatedSellPenalty * 0.4);

  const score = clamp(Math.round(rawScore));

  if (score >= 60) {
    reasons.push('Low leader-follower coordination risk (fixture)');
  } else {
    reasons.push('Elevated leader-follower coordination signals (fixture)');
  }

  return {
    leaderSignalQuality,
    followerNoisePenalty,
    sameSlotPenalty,
    coordinatedSellPenalty,
    score,
    reasons,
  };
}
