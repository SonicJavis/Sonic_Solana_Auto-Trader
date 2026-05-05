/**
 * Phase 11 — Bundle / Manipulation Detector v1: Funding pattern scoring.
 *
 * Computes FundingPatternScore from bundle signals and coordinated activity.
 * Deterministic, local/fixture-only — no network, no Solana RPC.
 *
 * Higher score = more diverse / less suspicious funding patterns (safer).
 */

import type { BundleSignal } from './bundle-signal.js';
import type { CoordinatedActivitySnapshot } from './coordinated-activity.js';
import type { FundingPatternScore } from './score-types.js';

const SAME_FUNDING_CAP = 8;
const TOTAL_WALLET_DIVERSITY_CAP = 15;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Score funding patterns from bundle signals and coordinated activity.
 * Returns a FundingPatternScore with all fields bounded 0–100.
 */
export function scoreFundingPatterns(
  signals: readonly BundleSignal[],
  activity: CoordinatedActivitySnapshot,
): FundingPatternScore {
  const reasons: string[] = [];

  const totalSameFunding =
    signals.reduce((sum, s) => sum + s.sameFundingSourceSignalCount, 0) +
    activity.sameFundingWalletCount;

  // Same-funding penalty
  const sameFundingPenalty = clamp(
    Math.round((Math.min(totalSameFunding, SAME_FUNDING_CAP) / SAME_FUNDING_CAP) * 100),
    0,
    100,
  );

  // Diversity placeholder quality: more wallets without same-funding = better
  const participatingTotal = activity.participatingWalletCount;
  const diverseWallets = Math.max(0, participatingTotal - activity.sameFundingWalletCount);
  const diversityPlaceholderQuality = clamp(
    Math.round(
      (Math.min(diverseWallets, TOTAL_WALLET_DIVERSITY_CAP) / TOTAL_WALLET_DIVERSITY_CAP) * 100,
    ),
    0,
    100,
  );

  // Suspicious funding placeholder: scaled from same-funding rate
  const sameFundingRate =
    participatingTotal > 0 ? totalSameFunding / participatingTotal : 0;
  const suspiciousFundingPlaceholderPenalty = clamp(
    Math.round(sameFundingRate * 100),
    0,
    100,
  );

  if (sameFundingPenalty > 0) {
    reasons.push(`Same-funding-source signals: ${totalSameFunding} (placeholder)`);
  }
  if (suspiciousFundingPlaceholderPenalty > 0) {
    reasons.push(
      `Suspicious funding rate: ${(sameFundingRate * 100).toFixed(0)}% (placeholder)`,
    );
  }

  const score = clamp(
    Math.round(
      diversityPlaceholderQuality * 0.40 -
        sameFundingPenalty * 0.40 -
        suspiciousFundingPlaceholderPenalty * 0.20,
    ),
    0,
    100,
  );

  if (reasons.length === 0) {
    reasons.push('No suspicious funding patterns detected (fixture/placeholder)');
  }

  return {
    diversityPlaceholderQuality,
    sameFundingPenalty,
    suspiciousFundingPlaceholderPenalty,
    score,
    reasons,
  };
}
