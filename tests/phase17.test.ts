/**
 * Phase 17 — Evidence Ledger and Decision Trace v1 tests.
 *
 * Covers:
 *   A. Package exports
 *   B. Capabilities — all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable/appendOnly true
 *   C. buildEvidenceSourceReference
 *   D. buildEvidenceEntry
 *   E. buildDecisionTrace
 *   F. buildDecisionTraceSummary
 *   G. buildEvidenceLedger
 *   H. checkEvidenceIntegrity
 *   I. validateEvidenceEntry / validateEvidenceLedger / validateEvidenceLedgerCapabilities
 *   J. JSON export — deterministic
 *   K. Markdown export — deterministic + safety footer
 *   L. Safety invariants — liveData/fixtureOnly/safeToDisplay/analysisOnly/nonExecutable/appendOnly rejection
 *   M. Validation rejects unsafe action text, private-key strings, seed-phrase strings, API keys, RPC URLs
 *   N. No ledger creates real trade intents/execution plans/paper trades/orders/positions/PnL
 *   O. Fixtures — fixture-only, safeToDisplay, analysisOnly, nonExecutable, appendOnly
 *   P. Dependency checks — no @solana/web3.js etc in package.json
 *   Q. Phase 13/14/15/16 regression — imports still work
 *   R. appendOnly enforcement
 *   S. Duplicate ID detection
 *   T. Mutation capability detection
 *
 * No network, no Solana RPC, no WebSocket, no provider SDK, no API keys,
 * no wallet private key, no trade execution, no paper trading.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import {
  // Capabilities
  getEvidenceLedgerCapabilities,
  // Errors
  elOk,
  elErr,
  // Builders
  buildEvidenceSourceReference,
  buildEvidenceEntry,
  buildDecisionTrace,
  buildDecisionTraceSummary,
  checkEvidenceIntegrity,
  buildEvidenceLedger,
  // Exports
  exportEvidenceLedgerJson,
  exportEvidenceLedgerMarkdown,
  // Validation
  validateEvidenceEntry,
  validateEvidenceLedger,
  validateEvidenceLedgerCapabilities,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
  // Fixtures
  CLEAN_EVIDENCE_LEDGER_FIXTURE,
  DEGRADED_EVIDENCE_LEDGER_FIXTURE,
  FAILED_EVIDENCE_LEDGER_FIXTURE,
  INCONCLUSIVE_EVIDENCE_LEDGER_FIXTURE,
  MIXED_EVIDENCE_LEDGER_FIXTURE,
  REGRESSION_EVIDENCE_LEDGER_FIXTURE,
  ALL_EVIDENCE_LEDGER_FIXTURES,
} from '@sonic/evidence-ledger';

import type {
  EvidenceLedger,
  EvidenceEntry,
  EvidenceSourceReference,
  DecisionTrace,
} from '@sonic/evidence-ledger';

// Phase 16 regression imports
import {
  getStrategyEvaluationCapabilities,
  CLEAN_STRATEGY_EVALUATION_FIXTURE,
  ALL_STRATEGY_EVALUATION_FIXTURES,
} from '@sonic/strategy-evaluation';

// Phase 15 regression imports
import {
  getStrategyIntentCapabilities,
  CLEAN_STRATEGY_INTENT_FIXTURE,
  ALL_STRATEGY_INTENT_FIXTURES,
} from '@sonic/strategy-intent';

// Phase 14 regression imports
import {
  getReplayReportingCapabilities,
  ALL_REPLAY_REPORT_FIXTURES,
} from '@sonic/replay-reporting';

// Phase 13 regression imports
import {
  getReplayLabCapabilities,
  ALL_REPLAY_FIXTURES,
} from '@sonic/replay-lab';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRef(id = 'test_ref'): EvidenceSourceReference {
  const r = buildEvidenceSourceReference({
    referenceId: id,
    sourceKind: 'strategy_evaluation',
    label: 'Test Reference',
    description: 'A test source reference for unit tests.',
    fixtureOnly: true,
    liveData: false,
  });
  if (!r.ok) throw new Error(r.message);
  return r.value;
}

function makeEntry(id = 'test_entry', sourceRef?: EvidenceSourceReference): EvidenceEntry {
  const ref = sourceRef ?? makeRef();
  const r = buildEvidenceEntry({
    id,
    sourceRef: ref,
    kind: 'classification_reason',
    severity: 'info',
    title: 'Test Entry Title',
    summary: 'A test evidence entry summary.',
    reasons: ['Test reason one.', 'Test reason two.'],
    timestamp: '2024-01-01T00:00:00.000Z',
    fixtureOnly: true,
    liveData: false,
  });
  if (!r.ok) throw new Error(r.message);
  return r.value;
}

function makeTrace(id = 'test_trace', entries?: EvidenceEntry[]): DecisionTrace {
  const es = entries ?? [makeEntry()];
  const r = buildDecisionTrace({
    id,
    entries: es,
    fixtureOnly: true,
    liveData: false,
  });
  if (!r.ok) throw new Error(r.message);
  return r.value;
}

function makeLedger(id = 'test_ledger', traces?: DecisionTrace[], entries?: EvidenceEntry[]): EvidenceLedger {
  const r = buildEvidenceLedger({
    id,
    traces: traces ?? [makeTrace()],
    entries: entries ?? [],
    fixtureOnly: true,
    liveData: false,
  });
  if (!r.ok) throw new Error(r.message);
  return r.value;
}

// ─── A. Package exports ───────────────────────────────────────────────────────

describe('A. Package exports', () => {
  it('exports getEvidenceLedgerCapabilities', () => {
    expect(typeof getEvidenceLedgerCapabilities).toBe('function');
  });

  it('exports elOk and elErr', () => {
    expect(typeof elOk).toBe('function');
    expect(typeof elErr).toBe('function');
  });

  it('exports buildEvidenceSourceReference', () => {
    expect(typeof buildEvidenceSourceReference).toBe('function');
  });

  it('exports buildEvidenceEntry', () => {
    expect(typeof buildEvidenceEntry).toBe('function');
  });

  it('exports buildDecisionTrace', () => {
    expect(typeof buildDecisionTrace).toBe('function');
  });

  it('exports buildDecisionTraceSummary', () => {
    expect(typeof buildDecisionTraceSummary).toBe('function');
  });

  it('exports checkEvidenceIntegrity', () => {
    expect(typeof checkEvidenceIntegrity).toBe('function');
  });

  it('exports buildEvidenceLedger', () => {
    expect(typeof buildEvidenceLedger).toBe('function');
  });

  it('exports exportEvidenceLedgerJson', () => {
    expect(typeof exportEvidenceLedgerJson).toBe('function');
  });

  it('exports exportEvidenceLedgerMarkdown', () => {
    expect(typeof exportEvidenceLedgerMarkdown).toBe('function');
  });

  it('exports validateEvidenceEntry', () => {
    expect(typeof validateEvidenceEntry).toBe('function');
  });

  it('exports validateEvidenceLedger', () => {
    expect(typeof validateEvidenceLedger).toBe('function');
  });

  it('exports validateEvidenceLedgerCapabilities', () => {
    expect(typeof validateEvidenceLedgerCapabilities).toBe('function');
  });

  it('exports containsUnsafeActionText', () => {
    expect(typeof containsUnsafeActionText).toBe('function');
  });

  it('exports containsSecretPattern', () => {
    expect(typeof containsSecretPattern).toBe('function');
  });

  it('exports containsUrlPattern', () => {
    expect(typeof containsUrlPattern).toBe('function');
  });

  it('exports isDisplaySafe', () => {
    expect(typeof isDisplaySafe).toBe('function');
  });

  it('exports 6 named fixtures', () => {
    expect(CLEAN_EVIDENCE_LEDGER_FIXTURE).toBeDefined();
    expect(DEGRADED_EVIDENCE_LEDGER_FIXTURE).toBeDefined();
    expect(FAILED_EVIDENCE_LEDGER_FIXTURE).toBeDefined();
    expect(INCONCLUSIVE_EVIDENCE_LEDGER_FIXTURE).toBeDefined();
    expect(MIXED_EVIDENCE_LEDGER_FIXTURE).toBeDefined();
    expect(REGRESSION_EVIDENCE_LEDGER_FIXTURE).toBeDefined();
  });

  it('exports ALL_EVIDENCE_LEDGER_FIXTURES with 6 items', () => {
    expect(ALL_EVIDENCE_LEDGER_FIXTURES).toHaveLength(6);
  });
});

// ─── B. Capabilities ──────────────────────────────────────────────────────────

describe('B. Capabilities', () => {
  const caps = getEvidenceLedgerCapabilities();

  it('canUseLiveData is false', () => expect(caps.canUseLiveData).toBe(false));
  it('canUseSolanaRpc is false', () => expect(caps.canUseSolanaRpc).toBe(false));
  it('canUseProviderApis is false', () => expect(caps.canUseProviderApis).toBe(false));
  it('canAccessPrivateKeys is false', () => expect(caps.canAccessPrivateKeys).toBe(false));
  it('canCreateTradeIntents is false', () => expect(caps.canCreateTradeIntents).toBe(false));
  it('canCreateExecutionPlans is false', () => expect(caps.canCreateExecutionPlans).toBe(false));
  it('canPaperTrade is false', () => expect(caps.canPaperTrade).toBe(false));
  it('canTrade is false', () => expect(caps.canTrade).toBe(false));
  it('canExecute is false', () => expect(caps.canExecute).toBe(false));
  it('canWriteToDatabase is false', () => expect(caps.canWriteToDatabase).toBe(false));
  it('canSendTelegramAlerts is false', () => expect(caps.canSendTelegramAlerts).toBe(false));
  it('canConstructTransactions is false', () => expect(caps.canConstructTransactions).toBe(false));
  it('canSimulateTransactions is false', () => expect(caps.canSimulateTransactions).toBe(false));
  it('canCreateOrders is false', () => expect(caps.canCreateOrders).toBe(false));
  it('canCreatePositions is false', () => expect(caps.canCreatePositions).toBe(false));
  it('canCalculateLivePnl is false', () => expect(caps.canCalculateLivePnl).toBe(false));
  it('canMutatePriorEvidence is false', () => expect(caps.canMutatePriorEvidence).toBe(false));
  it('fixtureOnly is true', () => expect(caps.fixtureOnly).toBe(true));
  it('analysisOnly is true', () => expect(caps.analysisOnly).toBe(true));
  it('nonExecutable is true', () => expect(caps.nonExecutable).toBe(true));
  it('appendOnly is true', () => expect(caps.appendOnly).toBe(true));

  it('validateEvidenceLedgerCapabilities returns ok', () => {
    const result = validateEvidenceLedgerCapabilities(caps);
    expect(result.ok).toBe(true);
  });

  it('capabilities object is frozen-style (all required fields present)', () => {
    const keys = Object.keys(caps);
    expect(keys).toContain('canUseLiveData');
    expect(keys).toContain('canMutatePriorEvidence');
    expect(keys).toContain('appendOnly');
  });
});

// ─── C. buildEvidenceSourceReference ─────────────────────────────────────────

describe('C. buildEvidenceSourceReference', () => {
  it('builds a valid source reference', () => {
    const result = buildEvidenceSourceReference({
      referenceId: 'ref_001',
      sourceKind: 'strategy_evaluation',
      label: 'Evaluation Ref',
      description: 'A synthetic evaluation reference.',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.referenceId).toBe('ref_001');
      expect(result.value.sourceKind).toBe('strategy_evaluation');
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.liveData).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
    }
  });

  it('rejects empty referenceId', () => {
    const result = buildEvidenceSourceReference({
      referenceId: '',
      sourceKind: 'replay_run',
      label: 'Label',
      description: 'Desc',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_EVIDENCE_LEDGER_INPUT');
  });

  it('accepts all EvidenceSourceKind values', () => {
    const kinds = ['replay_run', 'replay_report', 'strategy_intent', 'strategy_evaluation', 'fixture_only_source'] as const;
    for (const kind of kinds) {
      const r = buildEvidenceSourceReference({
        referenceId: `ref_${kind}`,
        sourceKind: kind,
        label: `Label ${kind}`,
        description: `Description for ${kind}.`,
        fixtureOnly: true,
        liveData: false,
      });
      expect(r.ok).toBe(true);
    }
  });

  it('rejects referenceId with secret pattern', () => {
    const r = buildEvidenceSourceReference({
      referenceId: 'private_key_abc',
      sourceKind: 'fixture_only_source',
      label: 'Label',
      description: 'Desc',
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('SECRET_PATTERN_DETECTED');
  });

  it('rejects description with URL pattern', () => {
    const r = buildEvidenceSourceReference({
      referenceId: 'ref_url',
      sourceKind: 'replay_run',
      label: 'Label',
      description: 'Connects to wss://some.provider',
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('URL_PATTERN_DETECTED');
  });

  it('rejects label with unsafe action text', () => {
    const r = buildEvidenceSourceReference({
      referenceId: 'ref_unsafe',
      sourceKind: 'replay_run',
      label: 'auto trade signal',
      description: 'Desc',
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('UNSAFE_ACTION_TEXT_DETECTED');
  });
});

// ─── D. buildEvidenceEntry ────────────────────────────────────────────────────

describe('D. buildEvidenceEntry', () => {
  it('builds a valid entry with all required fields', () => {
    const entry = makeEntry();
    expect(entry.id).toBe('test_entry');
    expect(entry.fixtureOnly).toBe(true);
    expect(entry.liveData).toBe(false);
    expect(entry.safeToDisplay).toBe(true);
    expect(entry.analysisOnly).toBe(true);
    expect(entry.nonExecutable).toBe(true);
    expect(entry.appendOnly).toBe(true);
  });

  it('uses fixture timestamp when not provided', () => {
    const ref = makeRef();
    const r = buildEvidenceEntry({
      id: 'entry_no_ts',
      sourceRef: ref,
      kind: 'fixture_only_reason',
      severity: 'info',
      title: 'No timestamp entry',
      summary: 'An entry without an explicit timestamp.',
      reasons: [],
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.timestamp).toBe('2024-01-01T00:00:00.000Z');
  });

  it('accepts all EvidenceEntryKind values', () => {
    const kinds = [
      'source_snapshot', 'classification_reason', 'safety_gate_reason',
      'evidence_quality_reason', 'rejection_reason', 'warning_reason',
      'inconclusive_reason', 'fixture_only_reason',
    ] as const;
    for (const kind of kinds) {
      const ref = makeRef(`ref_${kind}`);
      const r = buildEvidenceEntry({
        id: `entry_${kind}`,
        sourceRef: ref,
        kind,
        severity: 'info',
        title: `Title for ${kind}`,
        summary: `Summary for ${kind}.`,
        reasons: [],
        fixtureOnly: true,
        liveData: false,
      });
      expect(r.ok).toBe(true);
    }
  });

  it('accepts all EvidenceEntrySeverity values', () => {
    const severities = ['info', 'warning', 'risk', 'failure', 'inconclusive'] as const;
    for (const severity of severities) {
      const ref = makeRef(`ref_sev_${severity}`);
      const r = buildEvidenceEntry({
        id: `entry_sev_${severity}`,
        sourceRef: ref,
        kind: 'fixture_only_reason',
        severity,
        title: `Severity ${severity} entry`,
        summary: `Entry with severity ${severity}.`,
        reasons: [],
        fixtureOnly: true,
        liveData: false,
      });
      expect(r.ok).toBe(true);
    }
  });

  it('rejects empty id', () => {
    const ref = makeRef();
    const r = buildEvidenceEntry({
      id: '',
      sourceRef: ref,
      kind: 'info' as unknown as 'fixture_only_reason',
      severity: 'info',
      title: 'Title',
      summary: 'Summary',
      reasons: [],
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(false);
  });

  it('rejects title with unsafe action text', () => {
    const ref = makeRef();
    const r = buildEvidenceEntry({
      id: 'entry_unsafe_title',
      sourceRef: ref,
      kind: 'fixture_only_reason',
      severity: 'info',
      title: 'snipe this token now',
      summary: 'Safe summary.',
      reasons: [],
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('UNSAFE_ACTION_TEXT_DETECTED');
  });

  it('rejects summary with secret pattern', () => {
    const ref = makeRef();
    const r = buildEvidenceEntry({
      id: 'entry_secret_summary',
      sourceRef: ref,
      kind: 'fixture_only_reason',
      severity: 'info',
      title: 'Safe title',
      summary: 'Contains api_key value in text.',
      reasons: [],
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('SECRET_PATTERN_DETECTED');
  });

  it('rejects reasons containing URL pattern', () => {
    const ref = makeRef();
    const r = buildEvidenceEntry({
      id: 'entry_url_reason',
      sourceRef: ref,
      kind: 'fixture_only_reason',
      severity: 'info',
      title: 'Safe title',
      summary: 'Safe summary.',
      reasons: ['Use helius.dev for data'],
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('URL_PATTERN_DETECTED');
  });
});

// ─── E. buildDecisionTrace ────────────────────────────────────────────────────

describe('E. buildDecisionTrace', () => {
  it('builds a valid trace from entries', () => {
    const trace = makeTrace();
    expect(trace.id).toBe('test_trace');
    expect(trace.fixtureOnly).toBe(true);
    expect(trace.liveData).toBe(false);
    expect(trace.safeToDisplay).toBe(true);
    expect(trace.analysisOnly).toBe(true);
    expect(trace.nonExecutable).toBe(true);
    expect(trace.appendOnly).toBe(true);
  });

  it('derives steps from entries', () => {
    const trace = makeTrace('trace_with_steps', [makeEntry('e1'), makeEntry('e2', makeRef('r2'))]);
    expect(trace.steps).toHaveLength(2);
    expect(trace.steps[0]?.stepIndex).toBe(0);
    expect(trace.steps[1]?.stepIndex).toBe(1);
  });

  it('derives sourceIds from entries', () => {
    const ref = makeRef('shared_ref');
    const entries = [makeEntry('e_a', ref), makeEntry('e_b', ref)];
    const trace = makeTrace('trace_shared_ref', entries);
    expect(trace.sourceIds).toContain('shared_ref');
    expect(trace.sourceIds.length).toBe(1); // deduplicated
  });

  it('auto-classifies failure entries as rejected_by_evidence', () => {
    const ref = makeRef();
    const r = buildEvidenceEntry({
      id: 'failed_e',
      sourceRef: ref,
      kind: 'rejection_reason',
      severity: 'failure',
      title: 'Failure entry',
      summary: 'Fixture failure entry for classification test.',
      reasons: [],
      fixtureOnly: true,
      liveData: false,
    });
    if (!r.ok) throw new Error(r.message);
    const trace = makeTrace('trace_failure', [r.value]);
    expect(trace.classification).toBe('rejected_by_evidence');
  });

  it('auto-classifies risk entries as watch_only_by_evidence', () => {
    const ref = makeRef();
    const r = buildEvidenceEntry({
      id: 'risk_e',
      sourceRef: ref,
      kind: 'warning_reason',
      severity: 'risk',
      title: 'Risk entry',
      summary: 'Fixture risk entry for classification test.',
      reasons: [],
      fixtureOnly: true,
      liveData: false,
    });
    if (!r.ok) throw new Error(r.message);
    const trace = makeTrace('trace_risk', [r.value]);
    expect(trace.classification).toBe('watch_only_by_evidence');
  });

  it('auto-classifies inconclusive-only as insufficient_evidence', () => {
    const ref = makeRef();
    const r = buildEvidenceEntry({
      id: 'inc_e',
      sourceRef: ref,
      kind: 'inconclusive_reason',
      severity: 'inconclusive',
      title: 'Inconclusive entry',
      summary: 'Fixture inconclusive entry for classification test.',
      reasons: [],
      fixtureOnly: true,
      liveData: false,
    });
    if (!r.ok) throw new Error(r.message);
    const trace = makeTrace('trace_inc', [r.value]);
    expect(trace.classification).toBe('insufficient_evidence');
  });

  it('accepts explicit classification override', () => {
    const result = buildDecisionTrace({
      id: 'trace_explicit',
      entries: [makeEntry('e_explicit')],
      classification: 'fixture_only_trace',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.classification).toBe('fixture_only_trace');
  });

  it('rejects empty id', () => {
    const r = buildDecisionTrace({
      id: '',
      entries: [],
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(false);
  });

  it('each step has safeToDisplay=true', () => {
    const trace = makeTrace('trace_steps_safe');
    for (const step of trace.steps) {
      expect(step.safeToDisplay).toBe(true);
    }
  });
});

// ─── F. buildDecisionTraceSummary ─────────────────────────────────────────────

describe('F. buildDecisionTraceSummary', () => {
  it('returns summary with all required fields', () => {
    const trace = makeTrace();
    const summary = buildDecisionTraceSummary(trace);
    expect(summary.traceId).toBe('test_trace');
    expect(summary.fixtureOnly).toBe(true);
    expect(summary.liveData).toBe(false);
    expect(summary.safeToDisplay).toBe(true);
    expect(summary.analysisOnly).toBe(true);
    expect(summary.nonExecutable).toBe(true);
    expect(summary.appendOnly).toBe(true);
  });

  it('counts entries correctly', () => {
    const entries = [makeEntry('sum_e1'), makeEntry('sum_e2', makeRef('r2'))];
    const trace = makeTrace('trace_sum', entries);
    const summary = buildDecisionTraceSummary(trace);
    expect(summary.totalEntries).toBe(2);
  });

  it('counts steps correctly', () => {
    const trace = makeTrace('trace_sum_steps');
    const summary = buildDecisionTraceSummary(trace);
    expect(summary.totalSteps).toBe(trace.steps.length);
  });

  it('counts severity correctly', () => {
    const ref = makeRef();
    const e1 = buildEvidenceEntry({ id: 's1', sourceRef: ref, kind: 'rejection_reason', severity: 'failure', title: 'F', summary: 'Failure entry summary.', reasons: [], fixtureOnly: true, liveData: false });
    const e2 = buildEvidenceEntry({ id: 's2', sourceRef: ref, kind: 'warning_reason', severity: 'warning', title: 'W', summary: 'Warning entry summary.', reasons: [], fixtureOnly: true, liveData: false });
    if (!e1.ok || !e2.ok) throw new Error('build failed');
    const trace = makeTrace('trace_sev', [e1.value, e2.value]);
    const summary = buildDecisionTraceSummary(trace);
    expect(summary.severityCounts.failure).toBe(1);
    expect(summary.severityCounts.warning).toBe(1);
    expect(summary.severityCounts.info).toBe(0);
  });

  it('counts blocked/warning/inconclusive reason kinds', () => {
    const ref = makeRef();
    const e1 = buildEvidenceEntry({ id: 'bk1', sourceRef: ref, kind: 'rejection_reason', severity: 'failure', title: 'Blocked', summary: 'Blocked reason entry.', reasons: [], fixtureOnly: true, liveData: false });
    const e2 = buildEvidenceEntry({ id: 'bk2', sourceRef: ref, kind: 'warning_reason', severity: 'warning', title: 'Warning', summary: 'Warning reason entry.', reasons: [], fixtureOnly: true, liveData: false });
    const e3 = buildEvidenceEntry({ id: 'bk3', sourceRef: ref, kind: 'inconclusive_reason', severity: 'inconclusive', title: 'Inconclusive', summary: 'Inconclusive reason entry.', reasons: [], fixtureOnly: true, liveData: false });
    if (!e1.ok || !e2.ok || !e3.ok) throw new Error('build failed');
    const trace = makeTrace('trace_kinds', [e1.value, e2.value, e3.value]);
    const summary = buildDecisionTraceSummary(trace);
    expect(summary.blockedReasonCount).toBe(1);
    expect(summary.warningReasonCount).toBe(1);
    expect(summary.inconclusiveReasonCount).toBe(1);
  });

  it('summaryText is a non-empty string', () => {
    const summary = buildDecisionTraceSummary(makeTrace());
    expect(typeof summary.summaryText).toBe('string');
    expect(summary.summaryText.length).toBeGreaterThan(0);
  });

  it('all source kind counts are present', () => {
    const summary = buildDecisionTraceSummary(makeTrace());
    expect('replay_run' in summary.sourceKindCounts).toBe(true);
    expect('replay_report' in summary.sourceKindCounts).toBe(true);
    expect('strategy_intent' in summary.sourceKindCounts).toBe(true);
    expect('strategy_evaluation' in summary.sourceKindCounts).toBe(true);
    expect('fixture_only_source' in summary.sourceKindCounts).toBe(true);
  });
});

// ─── G. buildEvidenceLedger ───────────────────────────────────────────────────

describe('G. buildEvidenceLedger', () => {
  it('builds a valid ledger', () => {
    const ledger = makeLedger();
    expect(ledger.id).toBe('test_ledger');
    expect(ledger.fixtureOnly).toBe(true);
    expect(ledger.liveData).toBe(false);
    expect(ledger.safeToDisplay).toBe(true);
    expect(ledger.analysisOnly).toBe(true);
    expect(ledger.nonExecutable).toBe(true);
    expect(ledger.appendOnly).toBe(true);
  });

  it('includes summary and integrity fields', () => {
    const ledger = makeLedger();
    expect(ledger.summary).toBeDefined();
    expect(ledger.integrity).toBeDefined();
  });

  it('builds ledger with empty traces and entries', () => {
    const r = buildEvidenceLedger({ id: 'empty_ledger', fixtureOnly: true, liveData: false });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.traces).toHaveLength(0);
      expect(r.value.entries).toHaveLength(0);
    }
  });

  it('builds ledger with top-level entries', () => {
    const entry = makeEntry('top_entry');
    const r = buildEvidenceLedger({ id: 'ledger_with_entries', entries: [entry], fixtureOnly: true, liveData: false });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.entries).toHaveLength(1);
  });

  it('builds ledger combining traces and entries', () => {
    const trace = makeTrace('t_combined');
    const entry = makeEntry('e_combined', makeRef('r_combined'));
    const r = buildEvidenceLedger({ id: 'combined_ledger', traces: [trace], entries: [entry], fixtureOnly: true, liveData: false });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.traces).toHaveLength(1);
      expect(r.value.entries).toHaveLength(1);
    }
  });

  it('rejects empty id', () => {
    const r = buildEvidenceLedger({ id: '', fixtureOnly: true, liveData: false });
    expect(r.ok).toBe(false);
  });

  it('summary has correct entry count including trace entries', () => {
    const t = makeTrace('count_trace', [makeEntry('ct_e1'), makeEntry('ct_e2', makeRef('r_ct'))]);
    const topEntry = makeEntry('top_e', makeRef('r_top'));
    const r = buildEvidenceLedger({ id: 'count_ledger', traces: [t], entries: [topEntry], fixtureOnly: true, liveData: false });
    expect(r.ok).toBe(true);
    // Total entries = trace entries (2) + top-level (1) = 3
    if (r.ok) expect(r.value.summary.totalEntries).toBe(3);
  });
});

// ─── H. checkEvidenceIntegrity ────────────────────────────────────────────────

describe('H. checkEvidenceIntegrity', () => {
  it('passes for a clean ledger', () => {
    const ledger = makeLedger();
    const result = checkEvidenceIntegrity(ledger);
    expect(result.valid).toBe(true);
    expect(result.duplicateIds).toHaveLength(0);
    expect(result.fixtureOnly).toBe(true);
    expect(result.liveData).toBe(false);
    expect(result.safeToDisplay).toBe(true);
    expect(result.analysisOnly).toBe(true);
    expect(result.nonExecutable).toBe(true);
    expect(result.appendOnly).toBe(true);
  });

  it('detects duplicate entry IDs', () => {
    const ref = makeRef('dup_ref');
    const e1 = makeEntry('dup_id', ref);
    // Build a second entry with the same id
    const r2 = buildEvidenceEntry({
      id: 'dup_id',
      sourceRef: ref,
      kind: 'fixture_only_reason',
      severity: 'info',
      title: 'Duplicate entry',
      summary: 'Another entry with a duplicate ID.',
      reasons: [],
      fixtureOnly: true,
      liveData: false,
    });
    if (!r2.ok) throw new Error(r2.message);

    const trace = makeTrace('dup_trace', [e1]);
    const r = buildEvidenceLedger({
      id: 'dup_ledger',
      traces: [trace],
      entries: [r2.value],
      fixtureOnly: true,
      liveData: false,
    });
    if (!r.ok) throw new Error(r.message);
    // Re-check integrity directly
    const integ = checkEvidenceIntegrity(r.value);
    expect(integ.duplicateIds).toContain('dup_id');
    expect(integ.valid).toBe(false);
  });

  it('returns summaryText as string', () => {
    const result = checkEvidenceIntegrity(makeLedger());
    expect(typeof result.summaryText).toBe('string');
    expect(result.summaryText.length).toBeGreaterThan(0);
  });

  it('integrity check works on DecisionTrace', () => {
    const trace = makeTrace();
    const integ = checkEvidenceIntegrity(trace);
    expect(integ.valid).toBe(true);
    expect(integ.fixtureOnly).toBe(true);
    expect(integ.appendOnly).toBe(true);
  });

  it('passes integrity for all fixtures', () => {
    for (const fixture of ALL_EVIDENCE_LEDGER_FIXTURES) {
      const integ = checkEvidenceIntegrity(fixture.ledger);
      expect(integ.valid).toBe(true);
    }
  });
});

// ─── I. validateEvidenceEntry / validateEvidenceLedger / validateEvidenceLedgerCapabilities ─

describe('I. Validation', () => {
  it('validateEvidenceEntry passes for valid entry', () => {
    const r = validateEvidenceEntry(makeEntry());
    expect(r.ok).toBe(true);
  });

  it('validateEvidenceLedger passes for valid ledger', () => {
    const ledger = makeLedger();
    const r = validateEvidenceLedger(ledger);
    expect(r.ok).toBe(true);
  });

  it('validateEvidenceLedgerCapabilities passes for real caps', () => {
    const caps = getEvidenceLedgerCapabilities();
    const r = validateEvidenceLedgerCapabilities(caps);
    expect(r.ok).toBe(true);
  });

  it('validateEvidenceLedgerCapabilities rejects canMutatePriorEvidence=true', () => {
    const badCaps = { ...getEvidenceLedgerCapabilities(), canMutatePriorEvidence: true as unknown as false };
    const r = validateEvidenceLedgerCapabilities(badCaps);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('MUTATION_CAPABILITY_DETECTED');
  });

  it('validateEvidenceLedgerCapabilities rejects appendOnly=false', () => {
    const badCaps = { ...getEvidenceLedgerCapabilities(), appendOnly: false as unknown as true };
    const r = validateEvidenceLedgerCapabilities(badCaps);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('APPEND_ONLY_REQUIRED');
  });

  it('all fixtures pass validation', () => {
    for (const fixture of ALL_EVIDENCE_LEDGER_FIXTURES) {
      const r = validateEvidenceLedger(fixture.ledger);
      expect(r.ok).toBe(true);
    }
  });
});

// ─── J. JSON export ───────────────────────────────────────────────────────────

describe('J. JSON export', () => {
  it('returns an object with exportKind', () => {
    const exported = exportEvidenceLedgerJson(makeLedger());
    expect(exported.exportKind).toBe('evidence_ledger_export');
  });

  it('exported object has all safety flags set correctly', () => {
    const exported = exportEvidenceLedgerJson(makeLedger());
    expect(exported.fixtureOnly).toBe(true);
    expect(exported.liveData).toBe(false);
    expect(exported.safeToDisplay).toBe(true);
    expect(exported.analysisOnly).toBe(true);
    expect(exported.nonExecutable).toBe(true);
    expect(exported.appendOnly).toBe(true);
  });

  it('is JSON serialisable without errors', () => {
    const exported = exportEvidenceLedgerJson(makeLedger());
    expect(() => JSON.stringify(exported)).not.toThrow();
  });

  it('is deterministic — same ledger produces same JSON string', () => {
    const ledger = CLEAN_EVIDENCE_LEDGER_FIXTURE.ledger;
    const j1 = JSON.stringify(exportEvidenceLedgerJson(ledger));
    const j2 = JSON.stringify(exportEvidenceLedgerJson(ledger));
    expect(j1).toBe(j2);
  });

  it('includes trace entries in exported ledger', () => {
    const ledger = MIXED_EVIDENCE_LEDGER_FIXTURE.ledger;
    const exported = exportEvidenceLedgerJson(ledger);
    expect(exported.ledger.traces.length).toBeGreaterThan(0);
  });

  it('exported ledger integrity field is present', () => {
    const exported = exportEvidenceLedgerJson(makeLedger());
    expect(exported.ledger.integrity).toBeDefined();
    expect(exported.ledger.integrity.valid).toBe(true);
  });

  it('exported sourceIds are sorted', () => {
    const ref1 = makeRef('zzz_ref');
    const ref2 = makeRef('aaa_ref');
    const e1 = makeEntry('e_z', ref1);
    const e2 = makeEntry('e_a', ref2);
    const trace = makeTrace('sorted_trace', [e1, e2]);
    const ledger = makeLedger('sorted_ledger', [trace]);
    const exported = exportEvidenceLedgerJson(ledger);
    const traceExport = exported.ledger.traces[0];
    if (!traceExport) throw new Error('no trace');
    const ids = [...traceExport.sourceIds];
    expect(ids).toEqual([...ids].sort());
  });
});

// ─── K. Markdown export ───────────────────────────────────────────────────────

describe('K. Markdown export', () => {
  it('returns a non-empty string', () => {
    const md = exportEvidenceLedgerMarkdown(makeLedger());
    expect(typeof md).toBe('string');
    expect(md.length).toBeGreaterThan(0);
  });

  it('includes ledger ID in output', () => {
    const md = exportEvidenceLedgerMarkdown(makeLedger('my_test_ledger'));
    expect(md).toContain('my_test_ledger');
  });

  it('includes safety flags section', () => {
    const md = exportEvidenceLedgerMarkdown(makeLedger());
    expect(md).toContain('fixtureOnly: true');
    expect(md).toContain('liveData: false');
    expect(md).toContain('safeToDisplay: true');
    expect(md).toContain('analysisOnly: true');
    expect(md).toContain('nonExecutable: true');
    expect(md).toContain('appendOnly: true');
  });

  it('includes mandatory safety footer', () => {
    const md = exportEvidenceLedgerMarkdown(makeLedger());
    expect(md).toContain('SAFETY NOTICE');
    expect(md).toContain('fixture-only');
    expect(md).toContain('analysis-only');
    expect(md).toContain('non-executable');
    expect(md).toContain('append-only');
  });

  it('safety footer says prior evidence cannot be mutated', () => {
    const md = exportEvidenceLedgerMarkdown(makeLedger());
    expect(md).toContain('Prior evidence cannot be mutated');
  });

  it('does not contain trading instructions', () => {
    const md = exportEvidenceLedgerMarkdown(CLEAN_EVIDENCE_LEDGER_FIXTURE.ledger);
    expect(md.toLowerCase()).not.toContain('place a trade');
    expect(md.toLowerCase()).not.toContain('send transaction');
    expect(md.toLowerCase()).not.toContain('sign transaction');
  });

  it('is deterministic', () => {
    const ledger = CLEAN_EVIDENCE_LEDGER_FIXTURE.ledger;
    const m1 = exportEvidenceLedgerMarkdown(ledger);
    const m2 = exportEvidenceLedgerMarkdown(ledger);
    expect(m1).toBe(m2);
  });

  it('includes Evidence Ledger Report header', () => {
    const md = exportEvidenceLedgerMarkdown(makeLedger());
    expect(md).toContain('# Evidence Ledger Report');
  });

  it('includes Integrity Check section', () => {
    const md = exportEvidenceLedgerMarkdown(makeLedger());
    expect(md).toContain('## Integrity Check');
  });
});

// ─── L. Safety invariants rejection ──────────────────────────────────────────

describe('L. Safety invariants rejection', () => {
  it('validateEvidenceLedger rejects liveData=true', () => {
    const ledger = { ...makeLedger(), liveData: true as unknown as false };
    const r = validateEvidenceLedger(ledger);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('validateEvidenceLedger rejects fixtureOnly=false', () => {
    const ledger = { ...makeLedger(), fixtureOnly: false as unknown as true };
    const r = validateEvidenceLedger(ledger);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('validateEvidenceLedger rejects safeToDisplay=false', () => {
    const ledger = { ...makeLedger(), safeToDisplay: false as unknown as true };
    const r = validateEvidenceLedger(ledger);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('SAFE_TO_DISPLAY_REQUIRED');
  });

  it('validateEvidenceLedger rejects analysisOnly=false', () => {
    const ledger = { ...makeLedger(), analysisOnly: false as unknown as true };
    const r = validateEvidenceLedger(ledger);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('ANALYSIS_ONLY_REQUIRED');
  });

  it('validateEvidenceLedger rejects nonExecutable=false', () => {
    const ledger = { ...makeLedger(), nonExecutable: false as unknown as true };
    const r = validateEvidenceLedger(ledger);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('NON_EXECUTABLE_REQUIRED');
  });

  it('validateEvidenceLedger rejects appendOnly=false', () => {
    const ledger = { ...makeLedger(), appendOnly: false as unknown as true };
    const r = validateEvidenceLedger(ledger);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('APPEND_ONLY_REQUIRED');
  });

  it('buildEvidenceLedger rejects fixtureOnly=false in input', () => {
    const r = buildEvidenceLedger({ id: 'x', fixtureOnly: false as unknown as true, liveData: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('buildEvidenceLedger rejects liveData=true in input', () => {
    const r = buildEvidenceLedger({ id: 'x', fixtureOnly: true, liveData: true as unknown as false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('LIVE_DATA_FORBIDDEN');
  });
});

// ─── M. Validation rejects unsafe text and secrets ───────────────────────────

describe('M. Validation — unsafe text and secrets rejection', () => {
  it('containsUnsafeActionText detects "buy"', () => {
    expect(containsUnsafeActionText('buy this token')).toBe(true);
  });

  it('containsUnsafeActionText detects "sell"', () => {
    expect(containsUnsafeActionText('sell signal detected')).toBe(true);
  });

  it('containsUnsafeActionText detects "execute"', () => {
    expect(containsUnsafeActionText('execute the trade')).toBe(true);
  });

  it('containsUnsafeActionText detects "snipe"', () => {
    expect(containsUnsafeActionText('snipe this launch')).toBe(true);
  });

  it('containsUnsafeActionText detects "auto trade"', () => {
    expect(containsUnsafeActionText('auto trade mode')).toBe(true);
  });

  it('containsUnsafeActionText detects "send transaction"', () => {
    expect(containsUnsafeActionText('send transaction now')).toBe(true);
  });

  it('containsUnsafeActionText returns false for safe text', () => {
    expect(containsUnsafeActionText('analysis only fixture report')).toBe(false);
  });

  it('containsSecretPattern detects "private_key"', () => {
    expect(containsSecretPattern('private_key=abc')).toBe(true);
  });

  it('containsSecretPattern detects "seed phrase"', () => {
    expect(containsSecretPattern('seed phrase words here')).toBe(true);
  });

  it('containsSecretPattern detects "api_key"', () => {
    expect(containsSecretPattern('api_key=xyz')).toBe(true);
  });

  it('containsSecretPattern detects "mnemonic"', () => {
    expect(containsSecretPattern('mnemonic recovery')).toBe(true);
  });

  it('containsSecretPattern returns false for safe text', () => {
    expect(containsSecretPattern('fixture-only analysis report')).toBe(false);
  });

  it('containsUrlPattern detects "wss://"', () => {
    expect(containsUrlPattern('wss://provider.io')).toBe(true);
  });

  it('containsUrlPattern detects "helius.dev"', () => {
    expect(containsUrlPattern('helius.dev endpoint')).toBe(true);
  });

  it('containsUrlPattern detects "mainnet-beta.solana.com"', () => {
    expect(containsUrlPattern('mainnet-beta.solana.com')).toBe(true);
  });

  it('containsUrlPattern returns false for safe text', () => {
    expect(containsUrlPattern('fixture-only analysis result')).toBe(false);
  });

  it('isDisplaySafe returns true for safe text', () => {
    expect(isDisplaySafe('This is a safe analysis-only result.')).toBe(true);
  });

  it('isDisplaySafe returns false for unsafe text', () => {
    expect(isDisplaySafe('buy signal detected')).toBe(false);
  });

  it('isDisplaySafe returns false for secret-containing text', () => {
    expect(isDisplaySafe('apikey: abc123')).toBe(false);
  });
});

// ─── N. No forbidden capabilities ────────────────────────────────────────────

describe('N. No forbidden capabilities — trade/execution/order/position/PnL/mutation', () => {
  const caps = getEvidenceLedgerCapabilities();

  it('no trade intents capability', () => expect(caps.canCreateTradeIntents).toBe(false));
  it('no execution plan capability', () => expect(caps.canCreateExecutionPlans).toBe(false));
  it('no paper trade capability', () => expect(caps.canPaperTrade).toBe(false));
  it('no live data capability', () => expect(caps.canUseLiveData).toBe(false));
  it('no transaction construction capability', () => expect(caps.canConstructTransactions).toBe(false));
  it('no transaction simulation capability', () => expect(caps.canSimulateTransactions).toBe(false));
  it('no wallet/private key capability', () => expect(caps.canAccessPrivateKeys).toBe(false));
  it('no order capability', () => expect(caps.canCreateOrders).toBe(false));
  it('no position capability', () => expect(caps.canCreatePositions).toBe(false));
  it('no PnL capability', () => expect(caps.canCalculateLivePnl).toBe(false));
  it('no evidence mutation capability', () => expect(caps.canMutatePriorEvidence).toBe(false));
  it('no Solana RPC capability', () => expect(caps.canUseSolanaRpc).toBe(false));
  it('no provider API capability', () => expect(caps.canUseProviderApis).toBe(false));
  it('no database write capability', () => expect(caps.canWriteToDatabase).toBe(false));
  it('no telegram alert capability', () => expect(caps.canSendTelegramAlerts).toBe(false));
});

// ─── O. Fixtures ──────────────────────────────────────────────────────────────

describe('O. Fixtures', () => {
  it('all fixtures have fixtureOnly=true', () => {
    for (const f of ALL_EVIDENCE_LEDGER_FIXTURES) {
      expect(f.fixtureOnly).toBe(true);
      expect(f.ledger.fixtureOnly).toBe(true);
    }
  });

  it('all fixtures have liveData=false', () => {
    for (const f of ALL_EVIDENCE_LEDGER_FIXTURES) {
      expect(f.liveData).toBe(false);
      expect(f.ledger.liveData).toBe(false);
    }
  });

  it('all fixtures have safeToDisplay=true', () => {
    for (const f of ALL_EVIDENCE_LEDGER_FIXTURES) {
      expect(f.safeToDisplay).toBe(true);
      expect(f.ledger.safeToDisplay).toBe(true);
    }
  });

  it('all fixtures have analysisOnly=true', () => {
    for (const f of ALL_EVIDENCE_LEDGER_FIXTURES) {
      expect(f.analysisOnly).toBe(true);
      expect(f.ledger.analysisOnly).toBe(true);
    }
  });

  it('all fixtures have nonExecutable=true', () => {
    for (const f of ALL_EVIDENCE_LEDGER_FIXTURES) {
      expect(f.nonExecutable).toBe(true);
      expect(f.ledger.nonExecutable).toBe(true);
    }
  });

  it('all fixtures have appendOnly=true', () => {
    for (const f of ALL_EVIDENCE_LEDGER_FIXTURES) {
      expect(f.appendOnly).toBe(true);
      expect(f.ledger.appendOnly).toBe(true);
    }
  });

  it('all fixtures have unique fixtureIds', () => {
    const ids = ALL_EVIDENCE_LEDGER_FIXTURES.map(f => f.fixtureId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('all fixtures have unique ledger IDs', () => {
    const ids = ALL_EVIDENCE_LEDGER_FIXTURES.map(f => f.ledger.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('CLEAN fixture has analysis_only_by_evidence classification', () => {
    const trace = CLEAN_EVIDENCE_LEDGER_FIXTURE.ledger.traces[0];
    expect(trace?.classification).toBe('analysis_only_by_evidence');
  });

  it('FAILED fixture has rejected_by_evidence classification', () => {
    const trace = FAILED_EVIDENCE_LEDGER_FIXTURE.ledger.traces[0];
    expect(trace?.classification).toBe('rejected_by_evidence');
  });

  it('INCONCLUSIVE fixture has insufficient_evidence classification', () => {
    const trace = INCONCLUSIVE_EVIDENCE_LEDGER_FIXTURE.ledger.traces[0];
    expect(trace?.classification).toBe('insufficient_evidence');
  });

  it('MIXED fixture has multiple traces', () => {
    expect(MIXED_EVIDENCE_LEDGER_FIXTURE.ledger.traces.length).toBeGreaterThan(1);
  });

  it('MIXED fixture has top-level entries', () => {
    expect(MIXED_EVIDENCE_LEDGER_FIXTURE.ledger.entries.length).toBeGreaterThan(0);
  });

  it('fixtures are deterministic (IDs are stable)', () => {
    expect(CLEAN_EVIDENCE_LEDGER_FIXTURE.fixtureId).toBe('clean_evidence_ledger_fixture');
    expect(DEGRADED_EVIDENCE_LEDGER_FIXTURE.fixtureId).toBe('degraded_evidence_ledger_fixture');
    expect(FAILED_EVIDENCE_LEDGER_FIXTURE.fixtureId).toBe('failed_evidence_ledger_fixture');
    expect(INCONCLUSIVE_EVIDENCE_LEDGER_FIXTURE.fixtureId).toBe('inconclusive_evidence_ledger_fixture');
    expect(MIXED_EVIDENCE_LEDGER_FIXTURE.fixtureId).toBe('mixed_evidence_ledger_fixture');
    expect(REGRESSION_EVIDENCE_LEDGER_FIXTURE.fixtureId).toBe('regression_evidence_ledger_fixture');
  });

  it('ALL_EVIDENCE_LEDGER_FIXTURES contains all 6 named fixtures', () => {
    const ids = ALL_EVIDENCE_LEDGER_FIXTURES.map(f => f.fixtureId);
    expect(ids).toContain('clean_evidence_ledger_fixture');
    expect(ids).toContain('degraded_evidence_ledger_fixture');
    expect(ids).toContain('failed_evidence_ledger_fixture');
    expect(ids).toContain('inconclusive_evidence_ledger_fixture');
    expect(ids).toContain('mixed_evidence_ledger_fixture');
    expect(ids).toContain('regression_evidence_ledger_fixture');
  });
});

// ─── P. Dependency checks ─────────────────────────────────────────────────────

describe('P. Dependency checks', () => {
  const pkgPath = resolve(__dirname, '../packages/evidence-ledger/package.json');
  const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf8')) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
  const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };

  it('does not depend on @solana/web3.js', () => {
    expect('@solana/web3.js' in allDeps).toBe(false);
  });

  it('does not depend on helius', () => {
    const hasHelius = Object.keys(allDeps).some(k => k.toLowerCase().includes('helius'));
    expect(hasHelius).toBe(false);
  });

  it('does not depend on yellowstone', () => {
    const hasYS = Object.keys(allDeps).some(k => k.toLowerCase().includes('yellowstone'));
    expect(hasYS).toBe(false);
  });

  it('does not depend on jito', () => {
    const hasJito = Object.keys(allDeps).some(k => k.toLowerCase().includes('jito'));
    expect(hasJito).toBe(false);
  });

  it('does not depend on pump-adapter or pump runtime packages', () => {
    const hasPump = Object.keys(allDeps).some(k => k.toLowerCase().includes('pump-adapter'));
    expect(hasPump).toBe(false);
  });

  it('does not depend on drizzle or database packages', () => {
    const hasDb = Object.keys(allDeps).some(k =>
      k.includes('drizzle') || k.includes('better-sqlite') || k.includes('sqlite3')
    );
    expect(hasDb).toBe(false);
  });

  it('does not depend on telegraf or telegram', () => {
    const hasTelegram = Object.keys(allDeps).some(k =>
      k.toLowerCase().includes('telegraf') || k.toLowerCase().includes('telegram')
    );
    expect(hasTelegram).toBe(false);
  });

  it('package name is @sonic/evidence-ledger', () => {
    expect((pkgJson as { name?: string }).name).toBe('@sonic/evidence-ledger');
  });
});

// ─── Q. Phase 13/14/15/16 regression ─────────────────────────────────────────

describe('Q. Phase 13/14/15/16 regression', () => {
  it('Phase 13: ReplayLab capabilities still work', () => {
    const caps = getReplayLabCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 13: ALL_REPLAY_FIXTURES still loads', () => {
    expect(ALL_REPLAY_FIXTURES.length).toBeGreaterThan(0);
  });

  it('Phase 14: ReplayReporting capabilities still work', () => {
    const caps = getReplayReportingCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 14: ALL_REPLAY_REPORT_FIXTURES still loads', () => {
    expect(ALL_REPLAY_REPORT_FIXTURES.length).toBeGreaterThan(0);
  });

  it('Phase 15: StrategyIntent capabilities still work', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 15: CLEAN_STRATEGY_INTENT_FIXTURE still accessible', () => {
    expect(CLEAN_STRATEGY_INTENT_FIXTURE.fixtureId).toBeDefined();
  });

  it('Phase 15: ALL_STRATEGY_INTENT_FIXTURES still loads', () => {
    expect(ALL_STRATEGY_INTENT_FIXTURES.length).toBeGreaterThan(0);
  });

  it('Phase 16: StrategyEvaluation capabilities still work', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 16: CLEAN_STRATEGY_EVALUATION_FIXTURE still accessible', () => {
    expect(CLEAN_STRATEGY_EVALUATION_FIXTURE.fixtureId).toBeDefined();
  });

  it('Phase 16: ALL_STRATEGY_EVALUATION_FIXTURES still loads', () => {
    expect(ALL_STRATEGY_EVALUATION_FIXTURES.length).toBeGreaterThan(0);
  });
});

// ─── R. appendOnly enforcement ────────────────────────────────────────────────

describe('R. appendOnly enforcement', () => {
  it('all ledger outputs have appendOnly=true', () => {
    const ledger = makeLedger();
    expect(ledger.appendOnly).toBe(true);
  });

  it('all trace outputs have appendOnly=true', () => {
    const trace = makeTrace();
    expect(trace.appendOnly).toBe(true);
  });

  it('all entry outputs have appendOnly=true', () => {
    const entry = makeEntry();
    expect(entry.appendOnly).toBe(true);
  });

  it('all fixture ledgers have appendOnly=true', () => {
    for (const f of ALL_EVIDENCE_LEDGER_FIXTURES) {
      expect(f.ledger.appendOnly).toBe(true);
      for (const trace of f.ledger.traces) {
        expect(trace.appendOnly).toBe(true);
      }
    }
  });

  it('trace summaries have appendOnly=true', () => {
    const trace = makeTrace();
    const summary = buildDecisionTraceSummary(trace);
    expect(summary.appendOnly).toBe(true);
  });

  it('integrity checks have appendOnly=true', () => {
    const ledger = makeLedger();
    const integ = checkEvidenceIntegrity(ledger);
    expect(integ.appendOnly).toBe(true);
  });

  it('JSON export has appendOnly=true', () => {
    const exported = exportEvidenceLedgerJson(makeLedger());
    expect(exported.appendOnly).toBe(true);
    expect(exported.ledger.appendOnly).toBe(true);
  });

  it('validateEvidenceLedger rejects appendOnly=false', () => {
    const ledger = { ...makeLedger(), appendOnly: false as unknown as true };
    const r = validateEvidenceLedger(ledger);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('APPEND_ONLY_REQUIRED');
  });
});

// ─── S. Duplicate ID detection ────────────────────────────────────────────────

describe('S. Duplicate ID detection', () => {
  it('integrity check detects duplicate trace entry IDs', () => {
    const ref = makeRef('dup_ref_2');
    const e1 = makeEntry('same_id', ref);
    const e2r = buildEvidenceEntry({
      id: 'same_id',
      sourceRef: ref,
      kind: 'fixture_only_reason',
      severity: 'info',
      title: 'Duplicate ID entry',
      summary: 'Another entry reusing the same ID.',
      reasons: [],
      fixtureOnly: true,
      liveData: false,
    });
    if (!e2r.ok) throw new Error(e2r.message);

    const traceResult = buildDecisionTrace({ id: 'dup_trace_2', entries: [e1, e2r.value], fixtureOnly: true, liveData: false });
    if (!traceResult.ok) throw new Error(traceResult.message);

    const integ = checkEvidenceIntegrity(traceResult.value);
    expect(integ.duplicateIds).toContain('same_id');
    expect(integ.valid).toBe(false);
  });

  it('clean ledger has no duplicate IDs', () => {
    const integ = checkEvidenceIntegrity(makeLedger());
    expect(integ.duplicateIds).toHaveLength(0);
  });
});

// ─── T. Mutation capability detection ────────────────────────────────────────

describe('T. Mutation capability detection', () => {
  it('capabilities canMutatePriorEvidence is always false', () => {
    const caps = getEvidenceLedgerCapabilities();
    expect(caps.canMutatePriorEvidence).toBe(false);
  });

  it('validateEvidenceLedgerCapabilities rejects canMutatePriorEvidence=true', () => {
    const badCaps = { ...getEvidenceLedgerCapabilities(), canMutatePriorEvidence: true as unknown as false };
    const r = validateEvidenceLedgerCapabilities(badCaps);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('MUTATION_CAPABILITY_DETECTED');
  });

  it('elOk and elErr result helpers work correctly', () => {
    const ok = elOk(42);
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.value).toBe(42);

    const err = elErr('LIVE_DATA_FORBIDDEN', 'test error');
    expect(err.ok).toBe(false);
    expect(err.code).toBe('LIVE_DATA_FORBIDDEN');
    expect(err.message).toBe('test error');
  });

  it('ledger integrity check does not enable mutation of data', () => {
    // checkEvidenceIntegrity returns a new read-only check — it does not modify the ledger
    const ledger = makeLedger();
    const ledgerIdBefore = ledger.id;
    checkEvidenceIntegrity(ledger);
    expect(ledger.id).toBe(ledgerIdBefore);
  });
});
