/**
 * packages/strategy-evaluation/src/gate-summary.ts
 *
 * Phase 16 — Strategy safety gate summary builder.
 *
 * Aggregates all safety gate statuses across a set of strategy intents.
 * Analysis-only — no gate triggers any action or side effect.
 */

import type { StrategyIntent } from '@sonic/strategy-intent';
import type { StrategySafetyGateSummary } from './types.js';

/**
 * Builds a StrategySafetyGateSummary from a list of strategy intents.
 * Analysis-only — counts gate statuses; no side effects.
 */
export function buildStrategySafetyGateSummary(intents: readonly StrategyIntent[]): StrategySafetyGateSummary {
  let passed = 0;
  let warning = 0;
  let blocked = 0;
  let inconclusive = 0;

  const blockedGateIdCounts: Record<string, number> = {};

  for (const intent of intents) {
    for (const gate of intent.safetyGates) {
      switch (gate.status) {
        case 'passed': passed++; break;
        case 'warning': warning++; break;
        case 'blocked': blocked++; break;
        case 'inconclusive': inconclusive++; break;
      }

      if (gate.status === 'blocked') {
        blockedGateIdCounts[gate.gateId] = (blockedGateIdCounts[gate.gateId] ?? 0) + 1;
      }
    }
  }

  const total = passed + warning + blocked + inconclusive;

  // Sort blocked gate IDs by frequency, then alphabetically for determinism
  const mostCommonBlockedGateIds = Object.entries(blockedGateIdCounts)
    .sort((a, b) => {
      const diff = (b[1] ?? 0) - (a[1] ?? 0);
      return diff !== 0 ? diff : a[0].localeCompare(b[0]);
    })
    .slice(0, 5)
    .map(([id]) => id);

  const summaryText = total === 0
    ? 'No safety gates evaluated. Gate summary is empty.'
    : `Safety gate summary (${total} gate${total === 1 ? '' : 's'} across ${intents.length} intent${intents.length === 1 ? '' : 's'}): ` +
      `${passed} passed, ${warning} warning, ${blocked} blocked, ${inconclusive} inconclusive. ` +
      `fixture-only review; no action implied.`;

  return {
    total,
    passed,
    warning,
    blocked,
    inconclusive,
    mostCommonBlockedGateIds,
    summaryText,
  };
}
