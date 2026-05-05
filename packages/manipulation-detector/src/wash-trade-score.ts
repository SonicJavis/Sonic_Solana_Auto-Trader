/**
 * Phase 11 — Bundle / Manipulation Detector v1: Wash trade scoring.
 *
 * Computes WashTradeScore from bundle signals, patterns, and coordinated activity.
 * Deterministic, local/fixture-only — no network, no Solana RPC.
 *
 * Higher score = fewer wash-trade indicators (safer).
 */

import type { BundleSignal } from './bundle-signal.js';
import type { ManipulationPattern } from './manipulation-pattern.js';
import type { CoordinatedActivitySnapshot } from './coordinated-activity.js';
import type { WashTradeScore } from './score-types.js';

const WASH_CYCLE_CAP = 6;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Score wash-trade patterns from signals and coordinated activity.
 * Returns a WashTradeScore with all fields bounded 0–100.
 */
export function scoreWashTradePatterns(
  signals: readonly BundleSignal[],
  patterns: readonly ManipulationPattern[],
  activity: CoordinatedActivitySnapshot,
): WashTradeScore {
  const reasons: string[] = [];

  const totalWashCycles =
    signals.reduce((sum, s) => sum + s.suspectedWashCycleCount, 0) +
    activity.washTradeCycleCount;

  // Wash cycle penalty
  const washCyclePenalty = clamp(
    Math.round((Math.min(totalWashCycles, WASH_CYCLE_CAP) / WASH_CYCLE_CAP) * 100),
    0,
    100,
  );

  // Repeated counterparty placeholder — based on wash trade patterns detected
  const washPatterns = patterns.filter(
    (p) => p.patternType === 'likely_wash_trade' || p.patternType === 'possible_wash_trade',
  );
  const repeatedCounterpartyPlaceholderPenalty = clamp(
    Math.round(Math.min(washPatterns.length * 25, 100)),
    0,
    100,
  );

  // Volume symmetry placeholder — based on likely wash trade patterns
  const likelyWashPatterns = patterns.filter((p) => p.patternType === 'likely_wash_trade');
  const volumeSymmetryPlaceholderPenalty = clamp(
    Math.round(Math.min(likelyWashPatterns.length * 30, 100)),
    0,
    100,
  );

  if (washCyclePenalty > 0) {
    reasons.push(`Suspected wash-trade cycles: ${totalWashCycles}`);
  }
  if (repeatedCounterpartyPlaceholderPenalty > 0) {
    reasons.push(`Wash-trade patterns detected: ${washPatterns.length} (placeholder)`);
  }
  if (volumeSymmetryPlaceholderPenalty > 0) {
    reasons.push(`Likely wash-trade patterns: ${likelyWashPatterns.length} (placeholder)`);
  }

  const avgPenalty =
    washCyclePenalty * 0.50 +
    repeatedCounterpartyPlaceholderPenalty * 0.30 +
    volumeSymmetryPlaceholderPenalty * 0.20;

  const score = clamp(Math.round(100 - avgPenalty), 0, 100);

  if (reasons.length === 0) {
    reasons.push('No wash-trade signals detected (fixture/placeholder)');
  }

  return {
    washCyclePenalty,
    repeatedCounterpartyPlaceholderPenalty,
    volumeSymmetryPlaceholderPenalty,
    score,
    reasons,
  };
}
