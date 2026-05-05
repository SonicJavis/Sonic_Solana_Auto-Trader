/**
 * Phase 10 — Wallet Cluster Intelligence v1: Funding source score.
 *
 * Deterministic scoring of funding source risk signals in a cluster.
 * No network calls, no Solana RPC, no provider APIs.
 * No real funding-source graph analysis — placeholder flags only.
 * Higher final score = fewer suspicious funding source indicators.
 */

import type { WalletCluster } from './wallet-cluster.js';
import type { FundingSourceScore } from './score-types.js';

/** clamp helper */
function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val));
}

/**
 * Score the funding source risk of a wallet cluster.
 * Returns a FundingSourceScore with all components bounded 0–100.
 */
export function scoreFundingSource(cluster: WalletCluster): FundingSourceScore {
  const reasons: string[] = [];

  // Same funding signal penalty (placeholder)
  const sameFundingSignalPenalty = clamp(
    cluster.sameFundingSourceSignalCount * 15,
    0,
    75,
  );
  if (cluster.sameFundingSourceSignalCount > 0) {
    reasons.push(
      `Same-funding-source signals: ${cluster.sameFundingSourceSignalCount} (placeholder analysis only)`,
    );
  }

  // Suspicious funding placeholder penalty:
  // known rug clusters and same_funding_source types get additional placeholder penalty
  const isSuspiciousType =
    cluster.clusterType === 'known_rug_cluster' ||
    cluster.clusterType === 'same_funding_source' ||
    cluster.clusterType === 'fresh_wallet_farm';
  const suspiciousFundingPlaceholderPenalty = isSuspiciousType
    ? clamp(sameFundingSignalPenalty * 0.5 + 20, 0, 60)
    : 0;
  if (suspiciousFundingPlaceholderPenalty > 0) {
    reasons.push('Suspicious funding pattern placeholder detected');
  }

  // Source diversity placeholder quality: unknown in Phase 10 — use neutral value
  // unless signals suggest diverse funding
  const isBenignType =
    cluster.clusterType === 'smart_accumulators' ||
    cluster.clusterType === 'profitable_leaders';
  const sourceDiversityPlaceholderQuality = isBenignType ? 60 : 30;
  reasons.push(
    `Source diversity placeholder quality: ${sourceDiversityPlaceholderQuality} (model estimate only)`,
  );

  // Final score: diversity quality offset by penalties
  const rawScore =
    sourceDiversityPlaceholderQuality -
    sameFundingSignalPenalty * 0.4 -
    suspiciousFundingPlaceholderPenalty * 0.3;

  const score = clamp(Math.round(rawScore));

  if (score >= 50) {
    reasons.push('Moderate funding source indicators (fixture)');
  } else {
    reasons.push('Elevated funding source risk indicators (fixture/placeholder)');
  }

  return {
    sameFundingSignalPenalty,
    suspiciousFundingPlaceholderPenalty,
    sourceDiversityPlaceholderQuality,
    score,
    reasons,
  };
}
