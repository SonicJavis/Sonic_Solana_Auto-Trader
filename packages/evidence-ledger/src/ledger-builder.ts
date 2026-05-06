/**
 * packages/evidence-ledger/src/ledger-builder.ts
 *
 * Phase 17 — EvidenceLedger builder.
 *
 * Creates a safe ledger from traces and/or entries.
 * Includes id, traces, entries, summary, integrity, and required safety fields.
 */

import { elOk, elErr } from './errors.js';
import type { ElResult } from './errors.js';
import type {
  EvidenceLedger,
  EvidenceLedgerInput,
  EvidenceEntry,
  DecisionTrace,
  DecisionTraceSummary,
  EvidenceEntrySeverity,
  EvidenceSourceKind,
  DecisionTraceClassification,
} from './types.js';
import { checkEvidenceIntegrity } from './integrity.js';

const ALL_SEVERITIES: readonly EvidenceEntrySeverity[] = ['info', 'warning', 'risk', 'failure', 'inconclusive'];
const ALL_SOURCE_KINDS: readonly EvidenceSourceKind[] = [
  'replay_run',
  'replay_report',
  'strategy_intent',
  'strategy_evaluation',
  'fixture_only_source',
];

function buildLedgerSummary(
  id: string,
  allEntries: readonly EvidenceEntry[],
  traces: readonly DecisionTrace[],
): DecisionTraceSummary {
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

  for (const entry of allEntries) {
    const sev = entry.severity;
    if (sev in severityCounts) severityCounts[sev] = (severityCounts[sev] ?? 0) + 1;
    const sk = entry.sourceRef.sourceKind;
    if (sk in sourceKindCounts) sourceKindCounts[sk] = (sourceKindCounts[sk] ?? 0) + 1;
    if (entry.kind === 'rejection_reason') blockedReasonCount++;
    if (entry.kind === 'warning_reason') warningReasonCount++;
    if (entry.kind === 'inconclusive_reason') inconclusiveReasonCount++;
  }

  const totalSteps = traces.reduce((acc, t) => acc + t.steps.length, 0);

  // Derive overall classification from all trace classifications
  const classificationPriority: Record<DecisionTraceClassification, number> = {
    rejected_by_evidence: 4,
    watch_only_by_evidence: 3,
    analysis_only_by_evidence: 1,
    insufficient_evidence: 2,
    fixture_only_trace: 0,
  };

  let topClassification: DecisionTraceClassification = 'fixture_only_trace';
  let topPriority = -1;

  for (const trace of traces) {
    const priority = classificationPriority[trace.classification] ?? 0;
    if (priority > topPriority) {
      topPriority = priority;
      topClassification = trace.classification;
    }
  }

  const summaryText =
    `Ledger ${id} summary: ${allEntries.length} entr${allEntries.length === 1 ? 'y' : 'ies'}, ` +
    `${traces.length} trace${traces.length === 1 ? '' : 's'}, ` +
    `${totalSteps} step${totalSteps === 1 ? '' : 's'}, ` +
    `classification=${topClassification}. ` +
    `Blocked=${blockedReasonCount}, Warning=${warningReasonCount}, Inconclusive=${inconclusiveReasonCount}. ` +
    `Fixture-only, analysis-only, non-executable, append-only.`;

  return {
    traceId: id,
    totalEntries: allEntries.length,
    totalSteps,
    severityCounts: Object.fromEntries(ALL_SEVERITIES.map(s => [s, severityCounts[s] ?? 0])) as Readonly<Record<EvidenceEntrySeverity, number>>,
    sourceKindCounts: Object.fromEntries(ALL_SOURCE_KINDS.map(k => [k, sourceKindCounts[k] ?? 0])) as Readonly<Record<EvidenceSourceKind, number>>,
    blockedReasonCount,
    warningReasonCount,
    inconclusiveReasonCount,
    classification: topClassification,
    summaryText,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    appendOnly: true,
  };
}

/**
 * Builds a safe, deterministic EvidenceLedger.
 * Returns elErr if any safety invariant is violated.
 */
export function buildEvidenceLedger(input: EvidenceLedgerInput): ElResult<EvidenceLedger> {
  if (!input.id || input.id.trim().length === 0)
    return elErr('INVALID_EVIDENCE_LEDGER_INPUT', 'id must be non-empty');

  if (input.fixtureOnly !== true)
    return elErr('FIXTURE_ONLY_REQUIRED', 'fixtureOnly must be true');

  if (input.liveData !== false)
    return elErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');

  const traces = input.traces ? [...input.traces] : [];
  const entries = input.entries ? [...input.entries] : [];

  // Collect all entries (from top-level and from all traces)
  const allEntries = [...entries];
  for (const trace of traces) {
    for (const entry of trace.entries) {
      allEntries.push(entry);
    }
  }

  const summary = buildLedgerSummary(input.id, allEntries, traces);

  // Build a partial ledger for integrity checking (without integrity field)
  const partialLedger = {
    id: input.id,
    traces,
    entries,
    fixtureOnly: true as const,
    liveData: false as const,
    safeToDisplay: true as const,
    analysisOnly: true as const,
    nonExecutable: true as const,
    appendOnly: true as const,
  };

  const integrity = checkEvidenceIntegrity(partialLedger as unknown as EvidenceLedger);

  const ledger: EvidenceLedger = {
    id: input.id,
    traces,
    entries,
    summary,
    integrity,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    appendOnly: true,
  };

  return elOk(ledger);
}
