/**
 * packages/strategy-evaluation/src/evidence-summary.ts
 *
 * Phase 16 — Strategy evidence distribution builder.
 *
 * Counts evidence quality, classification, and strategy family
 * across a set of strategy intents. Analysis-only.
 */

import type { StrategyIntent } from '@sonic/strategy-intent';
import type { StrategyEvidenceDistribution } from './types.js';

/**
 * Builds a StrategyEvidenceDistribution from a list of strategy intents.
 * Analysis-only — no trade signals, no action labels.
 */
export function buildStrategyEvidenceDistribution(intents: readonly StrategyIntent[]): StrategyEvidenceDistribution {
  let strongCount = 0;
  let moderateCount = 0;
  let weakCount = 0;
  let degradedCount = 0;
  let failedCount = 0;
  let inconclusiveCount = 0;

  const classificationCounts: Record<string, number> = {};
  const familyCounts: Record<string, number> = {};

  for (const intent of intents) {
    switch (intent.evidenceQuality) {
      case 'strong_fixture_evidence': strongCount++; break;
      case 'moderate_fixture_evidence': moderateCount++; break;
      case 'weak_fixture_evidence': weakCount++; break;
      case 'degraded_fixture_evidence': degradedCount++; break;
      case 'failed_fixture_evidence': failedCount++; break;
      case 'inconclusive_fixture_evidence': inconclusiveCount++; break;
    }

    const cls = intent.classification;
    classificationCounts[cls] = (classificationCounts[cls] ?? 0) + 1;

    const fam = intent.strategyFamily;
    familyCounts[fam] = (familyCounts[fam] ?? 0) + 1;
  }

  const total = intents.length;

  const summaryText = total === 0
    ? 'No intents evaluated. Evidence distribution is empty.'
    : `Evidence distribution (${total} intent${total === 1 ? '' : 's'}): ` +
      `${strongCount} strong, ${moderateCount} moderate, ${weakCount} weak, ` +
      `${degradedCount} degraded, ${failedCount} failed, ${inconclusiveCount} inconclusive. ` +
      `fixture-only review; no action implied.`;

  return {
    total,
    strongCount,
    moderateCount,
    weakCount,
    degradedCount,
    failedCount,
    inconclusiveCount,
    classificationCounts,
    familyCounts,
    summaryText,
  };
}
