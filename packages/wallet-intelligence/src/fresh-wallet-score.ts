/**
 * Phase 10 — Wallet Cluster Intelligence v1: Fresh-wallet risk score.
 *
 * Deterministic scoring of fresh-wallet risk signals in a cluster.
 * No network calls, no Solana RPC, no provider APIs.
 * Higher final score = fewer fresh-wallet risk indicators.
 */

import type { WalletCluster } from './wallet-cluster.js';
import type { WalletProfile } from './wallet-profile.js';
import type { FreshWalletRiskScore } from './score-types.js';

/** Minimum average wallet age (days) before low-age penalty applies */
const LOW_AGE_THRESHOLD_DAYS = 14;

/** clamp helper */
function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val));
}

/**
 * Score the fresh-wallet risk of a wallet cluster.
 * Returns a FreshWalletRiskScore with all components bounded 0–100.
 */
export function scoreFreshWalletRisk(
  wallets: readonly WalletProfile[],
  cluster: WalletCluster,
): FreshWalletRiskScore {
  const reasons: string[] = [];

  // Fresh wallet penalty: based on cluster's freshWalletSignalCount
  const freshWalletPenalty = clamp(
    cluster.freshWalletSignalCount * 12,
    0,
    72,
  );
  if (cluster.freshWalletSignalCount > 0) {
    reasons.push(`Fresh wallet signals: ${cluster.freshWalletSignalCount}`);
  }

  // Same funding source penalty (placeholder)
  const sameFundingSourcePenalty = clamp(
    cluster.sameFundingSourceSignalCount * 15,
    0,
    60,
  );
  if (cluster.sameFundingSourceSignalCount > 0) {
    reasons.push(
      `Same-funding-source signals: ${cluster.sameFundingSourceSignalCount} (placeholder)`,
    );
  }

  // Low age penalty: compute average wallet age from wallet profiles
  const avgAgeDays =
    wallets.length > 0
      ? wallets.reduce((sum, w) => sum + w.walletAgeDays, 0) / wallets.length
      : 0;
  const lowAgePenalty =
    avgAgeDays < LOW_AGE_THRESHOLD_DAYS && wallets.length > 0
      ? clamp((1 - avgAgeDays / LOW_AGE_THRESHOLD_DAYS) * 60)
      : 0;
  if (lowAgePenalty > 0) {
    reasons.push(`Low average wallet age: ${avgAgeDays.toFixed(1)} days`);
  }

  // Farm risk penalty: combination of fresh wallets and same funding in known farm cluster
  const isFarmCluster =
    cluster.clusterType === 'fresh_wallet_farm' ||
    cluster.clusterType === 'same_funding_source';
  const farmRiskPenalty = isFarmCluster
    ? clamp(freshWalletPenalty * 0.5 + sameFundingSourcePenalty * 0.5, 0, 60)
    : 0;
  if (farmRiskPenalty > 0) {
    reasons.push('Farm-like cluster pattern detected (placeholder)');
  }

  // Score: start from perfect (100) and subtract penalties
  const totalPenalty = clamp(
    (freshWalletPenalty * 0.3 +
      sameFundingSourcePenalty * 0.3 +
      lowAgePenalty * 0.2 +
      farmRiskPenalty * 0.2),
    0,
    80,
  );

  const score = clamp(Math.round(100 - totalPenalty));

  if (score >= 70) {
    reasons.push('Low fresh-wallet risk indicators (fixture)');
  } else {
    reasons.push('Elevated fresh-wallet risk indicators (fixture)');
  }

  return {
    freshWalletPenalty,
    sameFundingSourcePenalty,
    lowAgePenalty,
    farmRiskPenalty,
    score,
    reasons,
  };
}
