/**
 * packages/evidence-ledger/src/fixtures.ts
 *
 * Phase 17 — Deterministic synthetic EvidenceLedger fixtures.
 *
 * Rules:
 *   - synthetic data only
 *   - fixtureOnly: true, liveData: false, safeToDisplay: true
 *   - analysisOnly: true, nonExecutable: true, appendOnly: true
 *   - no real token mints, wallet addresses, private data
 *   - no real URLs, no provider names requiring live access
 *   - no network calls
 *   - deterministic across test runs (no Date.now() or random)
 */

import type { EvidenceLedgerFixture } from './types.js';
import { buildEvidenceSourceReference } from './source-reference.js';
import { buildEvidenceEntry } from './evidence-entry.js';
import { buildDecisionTrace } from './decision-trace.js';
import { buildEvidenceLedger } from './ledger-builder.js';

// ─── Shared fixture timestamp ─────────────────────────────────────────────────

const FIXTURE_TS = '2024-01-01T00:00:00.000Z';

// ─── Helper: build source ref ─────────────────────────────────────────────────

function makeSourceRef(id: string, kind: import('./types.js').EvidenceSourceKind, label: string, desc: string) {
  const result = buildEvidenceSourceReference({
    referenceId: id,
    sourceKind: kind,
    label,
    description: desc,
    fixtureOnly: true,
    liveData: false,
  });
  if (!result.ok) throw new Error(`Failed to build fixture source ref ${id}: ${result.message}`);
  return result.value;
}

// ─── Helper: build entry ──────────────────────────────────────────────────────

function makeEntry(
  id: string,
  sourceRef: import('./types.js').EvidenceSourceReference,
  kind: import('./types.js').EvidenceEntryKind,
  severity: import('./types.js').EvidenceEntrySeverity,
  title: string,
  summary: string,
  reasons: string[],
) {
  const result = buildEvidenceEntry({
    id,
    sourceRef,
    kind,
    severity,
    title,
    summary,
    reasons,
    timestamp: FIXTURE_TS,
    fixtureOnly: true,
    liveData: false,
  });
  if (!result.ok) throw new Error(`Failed to build fixture entry ${id}: ${result.message}`);
  return result.value;
}

// ─── Helper: build trace ──────────────────────────────────────────────────────

function makeTrace(
  id: string,
  entries: import('./types.js').EvidenceEntry[],
  classification: import('./types.js').DecisionTraceClassification,
  summary: string,
) {
  const result = buildDecisionTrace({
    id,
    entries,
    classification,
    summary,
    fixtureOnly: true,
    liveData: false,
  });
  if (!result.ok) throw new Error(`Failed to build fixture trace ${id}: ${result.message}`);
  return result.value;
}

// ─── Helper: build ledger ─────────────────────────────────────────────────────

function makeLedger(
  id: string,
  traces: import('./types.js').DecisionTrace[],
  entries: import('./types.js').EvidenceEntry[],
) {
  const result = buildEvidenceLedger({
    id,
    traces,
    entries,
    fixtureOnly: true,
    liveData: false,
  });
  if (!result.ok) throw new Error(`Failed to build fixture ledger ${id}: ${result.message}`);
  return result.value;
}

// ─── Clean fixture ────────────────────────────────────────────────────────────

const cleanSourceRef = makeSourceRef(
  'clean_strategy_evaluation_ref',
  'strategy_evaluation',
  'Clean Strategy Evaluation Reference',
  'A synthetic clean strategy evaluation fixture reference for audit tracing.',
);

const cleanEntry1 = makeEntry(
  'clean_entry_classification',
  cleanSourceRef,
  'classification_reason',
  'info',
  'Analysis-only classification observed',
  'The fixture evaluation reached analysis_only classification with strong evidence quality.',
  ['Evidence quality meets threshold for analysis_only review.', 'No safety gates were blocked.'],
);

const cleanEntry2 = makeEntry(
  'clean_entry_evidence_quality',
  cleanSourceRef,
  'evidence_quality_reason',
  'info',
  'Evidence quality assessment complete',
  'Fixture evidence shows strong quality distribution across all evaluated intents.',
  ['Strong score bands dominate the evaluation.', 'No degraded or failed intents detected.'],
);

const cleanTrace = makeTrace(
  'clean_trace_001',
  [cleanEntry1, cleanEntry2],
  'analysis_only_by_evidence',
  'Clean trace: all evidence strong, analysis_only classification. Fixture-only, analysis-only, non-executable, append-only.',
);

const CLEAN_LEDGER = makeLedger('clean_evidence_ledger', [cleanTrace], []);

export const CLEAN_EVIDENCE_LEDGER_FIXTURE: EvidenceLedgerFixture = {
  fixtureId: 'clean_evidence_ledger_fixture',
  displayName: 'Clean Evidence Ledger Fixture',
  description: 'A synthetic clean evidence ledger with strong evidence and analysis_only classification.',
  ledger: CLEAN_LEDGER,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  appendOnly: true,
};

// ─── Degraded fixture ─────────────────────────────────────────────────────────

const degradedSourceRef = makeSourceRef(
  'degraded_strategy_evaluation_ref',
  'strategy_evaluation',
  'Degraded Strategy Evaluation Reference',
  'A synthetic degraded strategy evaluation fixture reference for audit tracing.',
);

const degradedEntry1 = makeEntry(
  'degraded_entry_evidence_quality',
  degradedSourceRef,
  'evidence_quality_reason',
  'warning',
  'Degraded evidence quality detected',
  'Fixture evaluation shows degraded evidence quality with warning-level concerns.',
  ['Degraded score bands detected in evaluation.', 'Multiple intents did not meet strong evidence threshold.'],
);

const degradedEntry2 = makeEntry(
  'degraded_entry_warning',
  degradedSourceRef,
  'warning_reason',
  'warning',
  'Analysis warning observed',
  'Fixture evidence includes creator and wallet degradation signals.',
  ['Creator quality metrics are below threshold.', 'Wallet pattern analysis indicates degraded signals.'],
);

const degradedTrace = makeTrace(
  'degraded_trace_001',
  [degradedEntry1, degradedEntry2],
  'watch_only_by_evidence',
  'Degraded trace: evidence quality degraded, watch_only classification. Fixture-only, analysis-only, non-executable, append-only.',
);

const DEGRADED_LEDGER = makeLedger('degraded_evidence_ledger', [degradedTrace], []);

export const DEGRADED_EVIDENCE_LEDGER_FIXTURE: EvidenceLedgerFixture = {
  fixtureId: 'degraded_evidence_ledger_fixture',
  displayName: 'Degraded Evidence Ledger Fixture',
  description: 'A synthetic degraded evidence ledger with degraded evidence quality and watch_only classification.',
  ledger: DEGRADED_LEDGER,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  appendOnly: true,
};

// ─── Failed fixture ───────────────────────────────────────────────────────────

const failedSourceRef = makeSourceRef(
  'failed_strategy_evaluation_ref',
  'strategy_evaluation',
  'Failed Strategy Evaluation Reference',
  'A synthetic failed strategy evaluation fixture reference for audit tracing.',
);

const failedEntry1 = makeEntry(
  'failed_entry_rejection',
  failedSourceRef,
  'rejection_reason',
  'failure',
  'Fixture evidence indicates rejection',
  'Fixture evaluation demonstrates failure-level evidence with manipulation signals detected.',
  ['Manipulation patterns detected in fixture data.', 'Safety gate analysis shows blocked status.'],
);

const failedEntry2 = makeEntry(
  'failed_entry_safety_gate',
  failedSourceRef,
  'safety_gate_reason',
  'failure',
  'Safety gate analysis shows blocked status',
  'Fixture evaluation safety gates are blocked due to manipulation risk signals.',
  ['Bundle activity detected in fixture.', 'Coordinated activity patterns observed.'],
);

const failedTrace = makeTrace(
  'failed_trace_001',
  [failedEntry1, failedEntry2],
  'rejected_by_evidence',
  'Failed trace: evidence indicates rejection classification. Fixture-only, analysis-only, non-executable, append-only.',
);

const FAILED_LEDGER = makeLedger('failed_evidence_ledger', [failedTrace], []);

export const FAILED_EVIDENCE_LEDGER_FIXTURE: EvidenceLedgerFixture = {
  fixtureId: 'failed_evidence_ledger_fixture',
  displayName: 'Failed Evidence Ledger Fixture',
  description: 'A synthetic failed evidence ledger with rejection classification.',
  ledger: FAILED_LEDGER,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  appendOnly: true,
};

// ─── Inconclusive fixture ─────────────────────────────────────────────────────

const inconclusiveSourceRef = makeSourceRef(
  'inconclusive_strategy_evaluation_ref',
  'strategy_evaluation',
  'Inconclusive Strategy Evaluation Reference',
  'A synthetic inconclusive strategy evaluation fixture reference for audit tracing.',
);

const inconclusiveEntry = makeEntry(
  'inconclusive_entry_001',
  inconclusiveSourceRef,
  'inconclusive_reason',
  'inconclusive',
  'Insufficient evidence for classification',
  'Fixture evaluation has insufficient evidence to reach a definitive analysis classification.',
  ['Evidence quality is inconclusive.', 'Insufficient intents evaluated to determine pattern.'],
);

const inconclusiveTrace = makeTrace(
  'inconclusive_trace_001',
  [inconclusiveEntry],
  'insufficient_evidence',
  'Inconclusive trace: insufficient evidence for classification. Fixture-only, analysis-only, non-executable, append-only.',
);

const INCONCLUSIVE_LEDGER = makeLedger('inconclusive_evidence_ledger', [inconclusiveTrace], []);

export const INCONCLUSIVE_EVIDENCE_LEDGER_FIXTURE: EvidenceLedgerFixture = {
  fixtureId: 'inconclusive_evidence_ledger_fixture',
  displayName: 'Inconclusive Evidence Ledger Fixture',
  description: 'A synthetic inconclusive evidence ledger with insufficient evidence classification.',
  ledger: INCONCLUSIVE_LEDGER,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  appendOnly: true,
};

// ─── Mixed fixture ────────────────────────────────────────────────────────────

const mixedReplayRef = makeSourceRef(
  'mixed_replay_ref',
  'replay_run',
  'Mixed Replay Run Reference',
  'A synthetic replay run fixture reference used in mixed evidence audit.',
);

const mixedReportRef = makeSourceRef(
  'mixed_replay_report_ref',
  'replay_report',
  'Mixed Replay Report Reference',
  'A synthetic replay report fixture reference used in mixed evidence audit.',
);

const mixedIntentRef = makeSourceRef(
  'mixed_strategy_intent_ref',
  'strategy_intent',
  'Mixed Strategy Intent Reference',
  'A synthetic strategy intent fixture reference used in mixed evidence audit.',
);

const mixedEvalRef = makeSourceRef(
  'mixed_strategy_evaluation_ref',
  'strategy_evaluation',
  'Mixed Strategy Evaluation Reference',
  'A synthetic strategy evaluation fixture reference used in mixed evidence audit.',
);

const mixedEntry1 = makeEntry(
  'mixed_entry_replay_snapshot',
  mixedReplayRef,
  'source_snapshot',
  'info',
  'Replay run snapshot captured',
  'Fixture replay run data snapshot captured for audit record.',
  ['Replay run completed in fixture mode.', 'No live data accessed.'],
);

const mixedEntry2 = makeEntry(
  'mixed_entry_report_classification',
  mixedReportRef,
  'classification_reason',
  'warning',
  'Replay report shows mixed classification',
  'Fixture replay report indicates mixed classification results across runs.',
  ['Some runs show degraded patterns.', 'Analysis is inconclusive for some token samples.'],
);

const mixedEntry3 = makeEntry(
  'mixed_entry_intent_quality',
  mixedIntentRef,
  'evidence_quality_reason',
  'info',
  'Strategy intent evidence quality assessed',
  'Fixture strategy intent evidence shows mixed quality across intent families.',
  ['Some families show strong evidence.', 'Other families show weaker evidence patterns.'],
);

const mixedEntry4 = makeEntry(
  'mixed_entry_eval_rejection',
  mixedEvalRef,
  'rejection_reason',
  'failure',
  'Strategy evaluation indicates rejection for some fixture intents',
  'Fixture strategy evaluation rejects some intents based on failed evidence analysis.',
  ['Failed fixture intents detected.', 'Manipulation patterns present in failed subset.'],
);

const mixedTrace1 = makeTrace(
  'mixed_trace_replay',
  [mixedEntry1, mixedEntry2],
  'watch_only_by_evidence',
  'Mixed trace from replay sources: analysis shows watch_only signals. Fixture-only, analysis-only, non-executable, append-only.',
);

const mixedTrace2 = makeTrace(
  'mixed_trace_strategy',
  [mixedEntry3, mixedEntry4],
  'rejected_by_evidence',
  'Mixed trace from strategy sources: some rejection signals present. Fixture-only, analysis-only, non-executable, append-only.',
);

const mixedTopEntry = makeEntry(
  'mixed_top_level_entry',
  mixedEvalRef,
  'fixture_only_reason',
  'info',
  'Mixed ledger fixture summary note',
  'This is a synthetic mixed ledger combining multiple source kinds for audit tracing.',
  ['Combining replay, report, intent, and evaluation evidence sources.'],
);

const MIXED_LEDGER = makeLedger('mixed_evidence_ledger', [mixedTrace1, mixedTrace2], [mixedTopEntry]);

export const MIXED_EVIDENCE_LEDGER_FIXTURE: EvidenceLedgerFixture = {
  fixtureId: 'mixed_evidence_ledger_fixture',
  displayName: 'Mixed Evidence Ledger Fixture',
  description: 'A synthetic mixed evidence ledger combining multiple source kinds: replay, report, intent, and evaluation.',
  ledger: MIXED_LEDGER,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  appendOnly: true,
};

// ─── Regression fixture ───────────────────────────────────────────────────────

const regressionSourceRef = makeSourceRef(
  'regression_strategy_evaluation_ref',
  'strategy_evaluation',
  'Regression Strategy Evaluation Reference',
  'A synthetic regression strategy evaluation fixture reference for audit tracing.',
);

const regressionEntry = makeEntry(
  'regression_entry_001',
  regressionSourceRef,
  'evidence_quality_reason',
  'risk',
  'Regression risk pattern detected in fixture',
  'Fixture regression evaluation detects risk-level evidence quality deviation between baseline and candidate.',
  ['Candidate shows degraded metrics vs baseline fixture.', 'Risk-level deviation detected in evidence quality.'],
);

const regressionTrace = makeTrace(
  'regression_trace_001',
  [regressionEntry],
  'watch_only_by_evidence',
  'Regression trace: risk-level evidence deviation detected. Fixture-only, analysis-only, non-executable, append-only.',
);

const REGRESSION_LEDGER = makeLedger('regression_evidence_ledger', [regressionTrace], []);

export const REGRESSION_EVIDENCE_LEDGER_FIXTURE: EvidenceLedgerFixture = {
  fixtureId: 'regression_evidence_ledger_fixture',
  displayName: 'Regression Evidence Ledger Fixture',
  description: 'A synthetic regression evidence ledger detecting risk-level deviation between baseline and candidate.',
  ledger: REGRESSION_LEDGER,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  appendOnly: true,
};

// ─── All fixtures ─────────────────────────────────────────────────────────────

export const ALL_EVIDENCE_LEDGER_FIXTURES: readonly EvidenceLedgerFixture[] = [
  CLEAN_EVIDENCE_LEDGER_FIXTURE,
  DEGRADED_EVIDENCE_LEDGER_FIXTURE,
  FAILED_EVIDENCE_LEDGER_FIXTURE,
  INCONCLUSIVE_EVIDENCE_LEDGER_FIXTURE,
  MIXED_EVIDENCE_LEDGER_FIXTURE,
  REGRESSION_EVIDENCE_LEDGER_FIXTURE,
];
