/**
 * Phase 11 — Bundle / Manipulation Detector v1: Coordination scoring.
 *
 * Computes CoordinationScore from bundle signals and coordinated activity.
 * Deterministic, local/fixture-only — no network, no Solana RPC.
 *
 * Higher score = less coordinated manipulation detected (safer).
 */

import type { BundleSignal } from './bundle-signal.js';
import type { CoordinatedActivitySnapshot } from './coordinated-activity.js';
import type { CoordinationScore } from './score-types.js';

const TOTAL_WALLET_DIVERSITY_CAP = 20;
const COORD_SIGNAL_CAP = 10;
const DUMP_SIGNAL_CAP = 6;
const BOT_NOISE_CAP = 8;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Score coordination from bundle signals and coordinated activity.
 * Returns a CoordinationScore with all fields bounded 0–100.
 */
export function scoreCoordination(
  signals: readonly BundleSignal[],
  activity: CoordinatedActivitySnapshot,
): CoordinationScore {
  const reasons: string[] = [];

  // Participant quality: more diverse wallets = better (up to cap)
  const participantQuality = clamp(
    Math.round(
      (Math.min(activity.participatingWalletCount, TOTAL_WALLET_DIVERSITY_CAP) /
        TOTAL_WALLET_DIVERSITY_CAP) *
        100,
    ),
    0,
    100,
  );

  // Total coordination signals
  const totalCoordSignals =
    signals.reduce(
      (sum, s) =>
        sum +
        s.coordinatedEntrySignalCount +
        s.coordinatedExitSignalCount +
        s.sameSlotParticipationCount,
      0,
    ) +
    activity.coordinatedEntryCount +
    activity.coordinatedExitCount +
    activity.sameSlotWalletCount;

  const coordinationPenalty = clamp(
    Math.round((Math.min(totalCoordSignals, COORD_SIGNAL_CAP) / COORD_SIGNAL_CAP) * 100),
    0,
    100,
  );

  // Coordinated dump penalty: from coordinated exit signals
  const totalDumpSignals =
    signals.reduce((sum, s) => sum + s.coordinatedExitSignalCount, 0) +
    activity.coordinatedExitCount;
  const coordinatedDumpPenalty = clamp(
    Math.round((Math.min(totalDumpSignals, DUMP_SIGNAL_CAP) / DUMP_SIGNAL_CAP) * 100),
    0,
    100,
  );

  // Bot noise penalty
  const totalBotNoise =
    signals.reduce(
      (sum, s) => sum + (s.signalType === 'bot_noise' ? 1 : 0),
      0,
    ) + activity.botNoiseSignalCount;
  const botNoisePenalty = clamp(
    Math.round((Math.min(totalBotNoise, BOT_NOISE_CAP) / BOT_NOISE_CAP) * 100),
    0,
    100,
  );

  if (coordinationPenalty > 0) {
    reasons.push(`Coordination signals: ${totalCoordSignals}`);
  }
  if (coordinatedDumpPenalty > 0) {
    reasons.push(`Coordinated-dump signals: ${totalDumpSignals}`);
  }
  if (botNoisePenalty > 0) {
    reasons.push(`Bot-noise signals: ${totalBotNoise}`);
  }

  // Final score: participant quality contributes positively; penalties subtract.
  // Unlike bundle-score.ts (which starts at 100), this formula starts from participant
  // quality and subtracts penalties — producing lower raw scores for high-coordination
  // scenarios. Negative raw scores are clamped to 0. Absolute coefficient sum = 1.0.
  const rawScore =
    participantQuality * 0.30 -
    coordinationPenalty * 0.35 -
    coordinatedDumpPenalty * 0.20 -
    botNoisePenalty * 0.15;

  const score = clamp(Math.round(rawScore), 0, 100);

  if (reasons.length === 0) {
    reasons.push('No coordination risk signals detected (fixture/placeholder)');
  }

  return {
    participantQuality,
    coordinationPenalty,
    coordinatedDumpPenalty,
    botNoisePenalty,
    score,
    reasons,
  };
}
