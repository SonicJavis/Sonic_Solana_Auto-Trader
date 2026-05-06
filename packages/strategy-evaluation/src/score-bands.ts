/**
 * packages/strategy-evaluation/src/score-bands.ts
 *
 * Phase 16 — Strategy score band summary builder.
 *
 * Maps fixture evidence quality to score bands for human review.
 * No trade signals, no action labels, no executable implications.
 */

import type { StrategyIntent } from '@sonic/strategy-intent';
import type { StrategyScoreBand, StrategyScoreBandSummary } from './types.js';

/**
 * Maps a StrategyIntent to its score band based on evidence quality and confidence.
 */
function intentToScoreBand(intent: StrategyIntent): StrategyScoreBand {
  switch (intent.evidenceQuality) {
    case 'failed_fixture_evidence':
      return 'failed_fixture_review';
    case 'degraded_fixture_evidence':
      return 'degraded_fixture_review';
    case 'inconclusive_fixture_evidence':
      return 'inconclusive_fixture_review';
    case 'weak_fixture_evidence':
      return 'weak_fixture_review';
    case 'moderate_fixture_evidence':
      return 'moderate_fixture_review';
    case 'strong_fixture_evidence':
      return intent.confidence > 0.9 ? 'excellent_fixture_review' : 'strong_fixture_review';
    default:
      return 'inconclusive_fixture_review';
  }
}

/**
 * Builds a StrategyScoreBandSummary from a list of strategy intents.
 * Analysis-only — no trade signals, no action labels.
 */
export function buildStrategyScoreBandSummary(intents: readonly StrategyIntent[]): StrategyScoreBandSummary {
  let excellent = 0;
  let strong = 0;
  let moderate = 0;
  let weak = 0;
  let degraded = 0;
  let failed = 0;
  let inconclusive = 0;

  for (const intent of intents) {
    const band = intentToScoreBand(intent);
    switch (band) {
      case 'excellent_fixture_review': excellent++; break;
      case 'strong_fixture_review': strong++; break;
      case 'moderate_fixture_review': moderate++; break;
      case 'weak_fixture_review': weak++; break;
      case 'degraded_fixture_review': degraded++; break;
      case 'failed_fixture_review': failed++; break;
      case 'inconclusive_fixture_review': inconclusive++; break;
    }
  }

  const total = intents.length;

  const parts: string[] = [];
  if (excellent > 0) parts.push(`${excellent} excellent`);
  if (strong > 0) parts.push(`${strong} strong`);
  if (moderate > 0) parts.push(`${moderate} moderate`);
  if (weak > 0) parts.push(`${weak} weak`);
  if (degraded > 0) parts.push(`${degraded} degraded`);
  if (failed > 0) parts.push(`${failed} failed`);
  if (inconclusive > 0) parts.push(`${inconclusive} inconclusive`);

  const summaryText = total === 0
    ? 'No intents evaluated. Score band summary is empty.'
    : `Score band summary (${total} intent${total === 1 ? '' : 's'}): ${parts.join(', ')}. fixture-only review; no action implied.`;

  return {
    excellent,
    strong,
    moderate,
    weak,
    degraded,
    failed,
    inconclusive,
    total,
    summaryText,
  };
}
