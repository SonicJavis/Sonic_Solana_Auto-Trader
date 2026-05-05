/**
 * Phase 10 — Wallet Cluster Intelligence v1: Cluster quality score.
 *
 * Deterministic scoring of a wallet cluster model.
 * No network calls, no Solana RPC, no provider APIs.
 * Scores are bounded 0–100. Higher = better cluster quality indicators.
 */

import type { WalletCluster, WalletClusterType } from './wallet-cluster.js';
import type { ClusterQualityScore } from './score-types.js';

/** Cluster type base quality scores */
const CLUSTER_TYPE_BASE_SCORES: Record<WalletClusterType, number> = {
  smart_accumulators: 80,
  profitable_leaders: 75,
  fast_dumpers: 15,
  fresh_wallet_farm: 10,
  creator_linked: 25,
  same_funding_source: 20,
  bot_noise: 10,
  known_rug_cluster: 0,
  unknown_fixture: 40,
};

/** clamp helper */
function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val));
}

/**
 * Score a wallet cluster model deterministically.
 * Returns a ClusterQualityScore with all components bounded 0–100.
 */
export function scoreWalletCluster(cluster: WalletCluster): ClusterQualityScore {
  const reasons: string[] = [];

  // Cluster type quality (0–100)
  const clusterTypeQuality = CLUSTER_TYPE_BASE_SCORES[cluster.clusterType] ?? 40;
  reasons.push(`Cluster type '${cluster.clusterType}': base quality ${clusterTypeQuality}`);

  // Representative wallet count quality (0–100)
  const representativeWalletQuality = clamp(
    (cluster.representativeWalletCount / 10) * 100,
  );
  if (cluster.representativeWalletCount < 3) {
    reasons.push(`Low representative wallet count: ${cluster.representativeWalletCount}`);
  }

  // Coordination risk penalty: combines same-slot and coordinated-sell signals
  const coordinationRiskPenalty = clamp(
    ((cluster.sameSlotParticipationSignalCount + cluster.coordinatedSellSignalCount) / 4) * 50,
    0,
    60,
  );
  if (coordinationRiskPenalty > 20) {
    reasons.push(
      `Coordination risk signals: ${cluster.sameSlotParticipationSignalCount} same-slot, ` +
        `${cluster.coordinatedSellSignalCount} coordinated-sell`,
    );
  }

  // Creator link risk penalty (placeholder)
  const creatorLinkRiskPenalty = clamp(
    cluster.creatorLinkedSignalCount * 15,
    0,
    45,
  );
  if (cluster.creatorLinkedSignalCount > 0) {
    reasons.push(`Creator-linked signals: ${cluster.creatorLinkedSignalCount} (placeholder)`);
  }

  // Final score: start from cluster type quality, penalise for risk signals
  const rawScore =
    clusterTypeQuality * 0.5 +
    representativeWalletQuality * 0.2 -
    coordinationRiskPenalty * 0.2 -
    creatorLinkRiskPenalty * 0.1;

  const score = clamp(Math.round(rawScore));

  return {
    clusterTypeQuality,
    representativeWalletQuality,
    coordinationRiskPenalty,
    creatorLinkRiskPenalty,
    score,
    reasons,
  };
}
