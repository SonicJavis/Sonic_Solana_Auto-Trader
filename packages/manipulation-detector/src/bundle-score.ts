/**
 * Phase 11 — Bundle / Manipulation Detector v1: Bundle risk scoring.
 *
 * Computes BundleRiskScore from bundle signals and coordinated activity.
 * Deterministic, local/fixture-only — no network, no Solana RPC.
 *
 * Higher score = fewer bundle risk indicators (safer).
 */

import type { BundleSignal } from './bundle-signal.js';
import type { CoordinatedActivitySnapshot } from './coordinated-activity.js';
import type { BundleRiskScore } from './score-types.js';

/** Cap for same-slot count penalty scaling */
const SAME_SLOT_CAP = 10;
/** Cap for same-funding count penalty scaling */
const SAME_FUNDING_CAP = 8;
/** Cap for coordinated-entry count penalty scaling */
const COORDINATED_ENTRY_CAP = 8;
/** Cap for coordinated-exit count penalty scaling */
const COORDINATED_EXIT_CAP = 8;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Score bundle signals and coordinated activity for bundle risk.
 * Returns a BundleRiskScore with all fields bounded 0–100.
 */
export function scoreBundleSignals(
  signals: readonly BundleSignal[],
  activity: CoordinatedActivitySnapshot,
): BundleRiskScore {
  const reasons: string[] = [];

  // Aggregate signal counts across all signals
  const totalSameSlot =
    signals.reduce((sum, s) => sum + s.sameSlotParticipationCount, 0) +
    activity.sameSlotWalletCount;
  const totalSameFunding =
    signals.reduce((sum, s) => sum + s.sameFundingSourceSignalCount, 0) +
    activity.sameFundingWalletCount;
  const totalCoordEntry =
    signals.reduce((sum, s) => sum + s.coordinatedEntrySignalCount, 0) +
    activity.coordinatedEntryCount;
  const totalCoordExit =
    signals.reduce((sum, s) => sum + s.coordinatedExitSignalCount, 0) +
    activity.coordinatedExitCount;

  // Compute penalties: higher raw count = higher penalty (0–100)
  const sameSlotPenalty = clamp(
    Math.round((Math.min(totalSameSlot, SAME_SLOT_CAP) / SAME_SLOT_CAP) * 100),
    0,
    100,
  );
  const sameFundingPenalty = clamp(
    Math.round((Math.min(totalSameFunding, SAME_FUNDING_CAP) / SAME_FUNDING_CAP) * 100),
    0,
    100,
  );
  const coordinatedEntryPenalty = clamp(
    Math.round((Math.min(totalCoordEntry, COORDINATED_ENTRY_CAP) / COORDINATED_ENTRY_CAP) * 100),
    0,
    100,
  );
  const coordinatedExitPenalty = clamp(
    Math.round((Math.min(totalCoordExit, COORDINATED_EXIT_CAP) / COORDINATED_EXIT_CAP) * 100),
    0,
    100,
  );

  if (sameSlotPenalty > 0) {
    reasons.push(`Same-slot participation signals: ${totalSameSlot}`);
  }
  if (sameFundingPenalty > 0) {
    reasons.push(`Same-funding-source signals: ${totalSameFunding}`);
  }
  if (coordinatedEntryPenalty > 0) {
    reasons.push(`Coordinated-entry signals: ${totalCoordEntry}`);
  }
  if (coordinatedExitPenalty > 0) {
    reasons.push(`Coordinated-exit signals: ${totalCoordExit}`);
  }

  // Final score: start at 100 and subtract weighted penalties
  const avgPenalty =
    (sameSlotPenalty * 0.35 +
      sameFundingPenalty * 0.30 +
      coordinatedEntryPenalty * 0.20 +
      coordinatedExitPenalty * 0.15);

  const score = clamp(Math.round(100 - avgPenalty), 0, 100);

  if (reasons.length === 0) {
    reasons.push('No bundle risk signals detected (fixture/placeholder)');
  }

  return {
    sameSlotPenalty,
    sameFundingPenalty,
    coordinatedEntryPenalty,
    coordinatedExitPenalty,
    score,
    reasons,
  };
}
