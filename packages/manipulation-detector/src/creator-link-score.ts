/**
 * Phase 11 — Bundle / Manipulation Detector v1: Creator link scoring.
 *
 * Computes CreatorLinkScore from bundle signals, patterns, and coordinated activity.
 * Deterministic, local/fixture-only — no network, no Solana RPC.
 *
 * Higher score = fewer creator-linked manipulation indicators (safer).
 */

import type { BundleSignal } from './bundle-signal.js';
import type { ManipulationPattern } from './manipulation-pattern.js';
import type { CoordinatedActivitySnapshot } from './coordinated-activity.js';
import type { CreatorLinkScore } from './score-types.js';

const CREATOR_LINKED_CAP = 6;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Score creator link patterns from signals, patterns, and coordinated activity.
 * Returns a CreatorLinkScore with all fields bounded 0–100.
 */
export function scoreCreatorLinks(
  signals: readonly BundleSignal[],
  patterns: readonly ManipulationPattern[],
  activity: CoordinatedActivitySnapshot,
): CreatorLinkScore {
  const reasons: string[] = [];

  const totalCreatorLinked =
    signals.reduce((sum, s) => sum + s.creatorLinkedWalletSignalCount, 0) +
    activity.creatorLinkedWalletCount;

  // Creator-linked wallet penalty
  const creatorLinkedWalletPenalty = clamp(
    Math.round((Math.min(totalCreatorLinked, CREATOR_LINKED_CAP) / CREATOR_LINKED_CAP) * 100),
    0,
    100,
  );

  // Creator history placeholder: from creator-linked manipulation patterns
  const creatorPatterns = patterns.filter(
    (p) => p.patternType === 'creator_linked_manipulation',
  );
  const creatorHistoryPlaceholderPenalty = clamp(
    Math.round(Math.min(creatorPatterns.length * 35, 100)),
    0,
    100,
  );

  // Relationship unknown penalty: placeholder when no creator context available
  const hasCreatorSignals = totalCreatorLinked > 0 || creatorPatterns.length > 0;
  const relationshipUnknownPenalty = hasCreatorSignals ? 10 : 5;

  if (creatorLinkedWalletPenalty > 0) {
    reasons.push(`Creator-linked wallet signals: ${totalCreatorLinked} (placeholder)`);
  }
  if (creatorHistoryPlaceholderPenalty > 0) {
    reasons.push(`Creator-linked manipulation patterns: ${creatorPatterns.length} (placeholder)`);
  }

  const score = clamp(
    Math.round(
      100 -
        creatorLinkedWalletPenalty * 0.50 -
        creatorHistoryPlaceholderPenalty * 0.35 -
        relationshipUnknownPenalty * 0.15,
    ),
    0,
    100,
  );

  if (reasons.length === 0) {
    reasons.push('No creator-link manipulation signals detected (fixture/placeholder)');
  }

  return {
    creatorLinkedWalletPenalty,
    creatorHistoryPlaceholderPenalty,
    relationshipUnknownPenalty,
    score,
    reasons,
  };
}
