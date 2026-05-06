/**
 * packages/evidence-ledger/src/trace-summary.ts
 *
 * Phase 17 — DecisionTraceSummary builder.
 *
 * Returns total entries, total steps, severity counts, source-kind counts,
 * blocked/warning/inconclusive reason counts, and safe summary text.
 */

import type { DecisionTrace, DecisionTraceSummary, EvidenceEntrySeverity, EvidenceSourceKind } from './types.js';

const ALL_SEVERITIES: readonly EvidenceEntrySeverity[] = ['info', 'warning', 'risk', 'failure', 'inconclusive'];
const ALL_SOURCE_KINDS: readonly EvidenceSourceKind[] = [
  'replay_run',
  'replay_report',
  'strategy_intent',
  'strategy_evaluation',
  'fixture_only_source',
];

/**
 * Builds a DecisionTraceSummary from a DecisionTrace.
 * Fixture-only, analysis-only, non-executable, append-only.
 */
export function buildDecisionTraceSummary(trace: DecisionTrace): DecisionTraceSummary {
  const severityCounts: Record<EvidenceEntrySeverity, number> = {
    info: 0,
    warning: 0,
    risk: 0,
    failure: 0,
    inconclusive: 0,
  };

  const sourceKindCounts: Record<EvidenceSourceKind, number> = {
    replay_run: 0,
    replay_report: 0,
    strategy_intent: 0,
    strategy_evaluation: 0,
    fixture_only_source: 0,
  };

  let blockedReasonCount = 0;
  let warningReasonCount = 0;
  let inconclusiveReasonCount = 0;

  for (const entry of trace.entries) {
    const sev = entry.severity;
    if (sev in severityCounts) {
      severityCounts[sev] = (severityCounts[sev] ?? 0) + 1;
    }

    const sk = entry.sourceRef.sourceKind;
    if (sk in sourceKindCounts) {
      sourceKindCounts[sk] = (sourceKindCounts[sk] ?? 0) + 1;
    }

    if (entry.kind === 'rejection_reason') blockedReasonCount++;
    if (entry.kind === 'warning_reason') warningReasonCount++;
    if (entry.kind === 'inconclusive_reason') inconclusiveReasonCount++;
  }

  const summaryText =
    `Trace ${trace.id} summary: ${trace.entries.length} entr${trace.entries.length === 1 ? 'y' : 'ies'}, ` +
    `${trace.steps.length} step${trace.steps.length === 1 ? '' : 's'}, ` +
    `classification=${trace.classification}. ` +
    `Blocked=${blockedReasonCount}, Warning=${warningReasonCount}, Inconclusive=${inconclusiveReasonCount}. ` +
    `Fixture-only, analysis-only, non-executable, append-only.`;

  return {
    traceId: trace.id,
    totalEntries: trace.entries.length,
    totalSteps: trace.steps.length,
    severityCounts: Object.fromEntries(ALL_SEVERITIES.map(s => [s, severityCounts[s] ?? 0])) as Readonly<Record<EvidenceEntrySeverity, number>>,
    sourceKindCounts: Object.fromEntries(ALL_SOURCE_KINDS.map(k => [k, sourceKindCounts[k] ?? 0])) as Readonly<Record<EvidenceSourceKind, number>>,
    blockedReasonCount,
    warningReasonCount,
    inconclusiveReasonCount,
    classification: trace.classification,
    summaryText,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    appendOnly: true,
  };
}
