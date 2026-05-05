/**
 * Phase 10 — Wallet Cluster Intelligence v1: Wallet quality score.
 *
 * Deterministic scoring of a single wallet profile.
 * No network calls, no Solana RPC, no provider APIs.
 * Scores are bounded 0–100. Higher = better wallet quality indicators.
 */

import type { WalletProfile } from './wallet-profile.js';
import type { WalletQualityScore } from './score-types.js';

/** Wallet age (days) thresholds */
const WALLET_AGE_GOOD = 180;
const WALLET_AGE_WARN = 30;

/** Hold time (seconds) thresholds */
const HOLD_TIME_GOOD = 3600;   // 1 hour
const HOLD_TIME_WARN = 120;    // 2 minutes

/** Penalty scaling constants */
const FAST_DUMP_PENALTY_PER_SIGNAL = 12;
const BOT_NOISE_PENALTY_PER_SIGNAL = 10;
const MAX_FAST_DUMP_PENALTY = 60;
const MAX_BOT_NOISE_PENALTY = 50;

/** clamp helper */
function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val));
}

/**
 * Score a single wallet profile deterministically.
 * Returns a WalletQualityScore with all components bounded 0–100.
 */
export function scoreWalletProfile(wallet: WalletProfile): WalletQualityScore {
  const reasons: string[] = [];

  // Wallet age quality (0–100)
  const walletAgeQuality = clamp(
    (wallet.walletAgeDays / WALLET_AGE_GOOD) * 100,
  );
  if (wallet.walletAgeDays < WALLET_AGE_WARN) {
    reasons.push(`Low wallet age: ${wallet.walletAgeDays} days`);
  }

  // Hold time quality (0–100)
  const holdTimeQuality = clamp(
    (wallet.averageHoldTimeSeconds / HOLD_TIME_GOOD) * 100,
  );
  if (wallet.averageHoldTimeSeconds < HOLD_TIME_WARN) {
    reasons.push(`Low average hold time: ${wallet.averageHoldTimeSeconds}s`);
  }

  // Entry timing quality (0–100)
  const entryTimingQuality = clamp(wallet.averageEntryTimingQuality * 100);

  // Exit timing quality (0–100)
  const exitTimingQuality = clamp(wallet.averageExitTimingQuality * 100);

  // Profitability placeholder quality (0–100)
  const profitabilityPlaceholderQuality = clamp(
    wallet.profitabilityQualityPlaceholder * 100,
  );

  // Fast dump penalty (0–100, higher = more penalty applied)
  const fastDumpPenalty = clamp(
    wallet.fastDumpSignalCount * FAST_DUMP_PENALTY_PER_SIGNAL,
    0,
    MAX_FAST_DUMP_PENALTY,
  );
  if (wallet.fastDumpSignalCount > 0) {
    reasons.push(`Fast dump signals: ${wallet.fastDumpSignalCount}`);
  }

  // Bot noise penalty (0–100, higher = more noise)
  const botNoisePenalty = clamp(
    wallet.botNoiseSignalCount * BOT_NOISE_PENALTY_PER_SIGNAL,
    0,
    MAX_BOT_NOISE_PENALTY,
  );
  if (wallet.botNoiseSignalCount > 0) {
    reasons.push(`Bot noise signals: ${wallet.botNoiseSignalCount}`);
  }

  // Positive component average
  const positiveAvg =
    (walletAgeQuality +
      holdTimeQuality +
      entryTimingQuality +
      exitTimingQuality +
      profitabilityPlaceholderQuality) /
    5;

  // Combined penalty (capped)
  const totalPenalty = clamp((fastDumpPenalty + botNoisePenalty) / 2, 0, 60);

  const score = clamp(Math.round(positiveAvg - totalPenalty));

  if (score >= 70) {
    reasons.push('Good overall wallet fixture quality indicators');
  } else if (score >= 40) {
    reasons.push('Moderate wallet fixture quality indicators');
  } else {
    reasons.push('Low wallet fixture quality indicators');
  }

  return {
    walletAgeQuality,
    holdTimeQuality,
    entryTimingQuality,
    exitTimingQuality,
    profitabilityPlaceholderQuality,
    fastDumpPenalty,
    botNoisePenalty,
    score,
    reasons,
  };
}
