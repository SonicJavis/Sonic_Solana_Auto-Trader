/**
 * packages/strategy-evaluation/src/family-comparison.ts
 *
 * Phase 16 — Strategy family comparison builder.
 *
 * Groups strategy intents by family, computes per-family analysis summaries.
 * Analysis-only — no "best trade", "top", "entry", "exit" language.
 */

import type { StrategyIntent } from '@sonic/strategy-intent';
import type { StrategyFamilyComparison } from './types.js';

/**
 * Compares strategy families by grouping intents and computing per-family summaries.
 * Analysis-only — no trade signals or action labels.
 */
export function compareStrategyFamilies(intents: readonly StrategyIntent[]): readonly StrategyFamilyComparison[] {
  const familyMap = new Map<string, StrategyIntent[]>();

  for (const intent of intents) {
    const key = intent.strategyFamily;
    const existing = familyMap.get(key);
    if (existing) {
      existing.push(intent);
    } else {
      familyMap.set(key, [intent]);
    }
  }

  // Sort family names for determinism
  const sortedFamilies = [...familyMap.keys()].sort();

  return sortedFamilies.map(familyName => {
    const familyIntents = familyMap.get(familyName) ?? [];
    const intentCount = familyIntents.length;

    const totalConfidence = familyIntents.reduce((sum, i) => sum + i.confidence, 0);
    const averageConfidence = intentCount > 0 ? totalConfidence / intentCount : 0;

    const evidenceQualityCounts: Record<string, number> = {};
    const gateStatusCounts: Record<string, number> = {};

    for (const intent of familyIntents) {
      const eq = intent.evidenceQuality;
      evidenceQualityCounts[eq] = (evidenceQualityCounts[eq] ?? 0) + 1;

      for (const gate of intent.safetyGates) {
        const gs = gate.status;
        gateStatusCounts[gs] = (gateStatusCounts[gs] ?? 0) + 1;
      }
    }

    const confidenceStr = (averageConfidence * 100).toFixed(1);
    const summaryText =
      `Family "${familyName}": ${intentCount} intent${intentCount === 1 ? '' : 's'}, ` +
      `average confidence ${confidenceStr}%. ` +
      `fixture-only review; no action implied.`;

    return {
      familyName,
      intentCount,
      averageConfidence,
      evidenceQualityCounts,
      gateStatusCounts,
      summaryText,
    };
  });
}
