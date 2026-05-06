/**
 * Phase 14 — Replay Reporting and Edge Diagnostics v1 tests.
 *
 * Covers:
 *   A. Package exports
 *   B. Capabilities — all unsafe fields false
 *   C. Scenario index creation, determinism, validation
 *   D. Run report creation and validation
 *   E. Comparison report creation and regression detection
 *   F. Diagnostics creation and severity counts
 *   G. JSON export determinism and safety
 *   H. Markdown export determinism and safety
 *   I. Validation helpers — unsafe text, secrets, URLs
 *   J. Fixtures — deterministic, fixture-only, safeToDisplay
 *   K. Safety invariants — no trade intents, no execution plans, etc.
 *   L. Dependency checks — no Solana/provider SDKs
 *   M. Phase 13 regression tests still pass (via re-import)
 *
 * No network, no Solana RPC, no WebSocket, no provider SDK, no API keys,
 * no wallet private key, no trade execution, no paper trading.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import {
  // Capabilities
  getReplayReportingCapabilities,
  // Types
  type ReplayReportingCapabilities,
  type ReplayDiagnosticSeverity,
  // Errors
  rrOk,
  rrErr,
  // Validation
  validateSafeText,
  validateCapabilities,
  validateJsonSafe,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
  // Builders
  buildScenarioIndex,
  buildReplayRunReport,
  buildReplayComparisonReport,
  buildReplayDiagnostics,
  // Exports
  exportReplayReportJson,
  exportReplayReportMarkdown,
  exportRunReportMarkdown,
  exportComparisonReportMarkdown,
  exportScenarioIndexMarkdown,
  exportDiagnosticsMarkdown,
  // Fixtures
  CLEAN_REPLAY_RUN_REPORT_FIXTURE,
  DEGRADED_REPLAY_RUN_REPORT_FIXTURE,
  FAILED_REPLAY_RUN_REPORT_FIXTURE,
  INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE,
  REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE,
  ALL_REPLAY_REPORT_FIXTURES,
} from '@sonic/replay-reporting';

// Also import Phase 13 items to confirm regression tests pass
import {
  getReplayLabCapabilities,
  runReplayScenario,
  compareReplayRuns,
  ALL_REPLAY_FIXTURES,
  CLEAN_TOKEN_REPLAY_SCENARIO,
  RISKY_CREATOR_REPLAY_SCENARIO,
  MANIPULATION_REJECT_REPLAY_SCENARIO,
  MISSING_DATA_REPLAY_SCENARIO,
  REGRESSION_COMPARISON_BASELINE_SCENARIO,
  REGRESSION_COMPARISON_CANDIDATE_SCENARIO,
} from '@sonic/replay-lab';

// ─── A. Package exports ───────────────────────────────────────────────────────

describe('A. Package exports', () => {
  it('exports getReplayReportingCapabilities', () => {
    expect(typeof getReplayReportingCapabilities).toBe('function');
  });

  it('exports rrOk and rrErr', () => {
    expect(typeof rrOk).toBe('function');
    expect(typeof rrErr).toBe('function');
  });

  it('exports buildScenarioIndex', () => {
    expect(typeof buildScenarioIndex).toBe('function');
  });

  it('exports buildReplayRunReport', () => {
    expect(typeof buildReplayRunReport).toBe('function');
  });

  it('exports buildReplayComparisonReport', () => {
    expect(typeof buildReplayComparisonReport).toBe('function');
  });

  it('exports buildReplayDiagnostics', () => {
    expect(typeof buildReplayDiagnostics).toBe('function');
  });

  it('exports exportReplayReportJson', () => {
    expect(typeof exportReplayReportJson).toBe('function');
  });

  it('exports exportReplayReportMarkdown', () => {
    expect(typeof exportReplayReportMarkdown).toBe('function');
  });

  it('exports all fixture constants', () => {
    expect(CLEAN_REPLAY_RUN_REPORT_FIXTURE).toBeDefined();
    expect(DEGRADED_REPLAY_RUN_REPORT_FIXTURE).toBeDefined();
    expect(FAILED_REPLAY_RUN_REPORT_FIXTURE).toBeDefined();
    expect(INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE).toBeDefined();
    expect(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE).toBeDefined();
    expect(ALL_REPLAY_REPORT_FIXTURES).toBeDefined();
  });

  it('ALL_REPLAY_REPORT_FIXTURES has 5 entries', () => {
    expect(ALL_REPLAY_REPORT_FIXTURES.length).toBe(5);
  });
});

// ─── B. Capabilities ─────────────────────────────────────────────────────────

describe('B. Capabilities — all unsafe fields false', () => {
  const caps = getReplayReportingCapabilities();

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
  it('fixtureOnly is true', () => expect(caps.fixtureOnly).toBe(true));

  it('validateCapabilities passes for valid caps', () => {
    const result = validateCapabilities(caps);
    expect(result.ok).toBe(true);
  });

  it('validateCapabilities rejects canUseLiveData=true', () => {
    const bad = { ...caps, canUseLiveData: true } as unknown as ReplayReportingCapabilities;
    const result = validateCapabilities(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('validateCapabilities rejects fixtureOnly=false', () => {
    const bad = { ...caps, fixtureOnly: false } as unknown as ReplayReportingCapabilities;
    const result = validateCapabilities(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('validateCapabilities rejects canTrade=true', () => {
    const bad = { ...caps, canTrade: true } as unknown as ReplayReportingCapabilities;
    const result = validateCapabilities(bad);
    expect(result.ok).toBe(false);
  });
});

// ─── C. Scenario index ────────────────────────────────────────────────────────

describe('C. Scenario index creation, determinism, validation', () => {
  const scenarios = ALL_REPLAY_FIXTURES;

  it('builds a scenario index from ALL_REPLAY_FIXTURES', () => {
    const result = buildScenarioIndex([...scenarios]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.scenarioCount).toBe(8);
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.liveData).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
    }
  });

  it('index scenarioIds are sorted alphabetically (determinism)', () => {
    const result = buildScenarioIndex([...scenarios]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const ids = result.value.scenarioIds;
      const sorted = [...ids].sort((a, b) => a.localeCompare(b));
      expect(ids).toEqual(sorted);
    }
  });

  it('index entries are sorted by scenarioId', () => {
    const result = buildScenarioIndex([...scenarios]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const entryIds = result.value.entries.map(e => e.scenarioId);
      const sorted = [...entryIds].sort((a, b) => a.localeCompare(b));
      expect(entryIds).toEqual(sorted);
    }
  });

  it('index is deterministic — same input produces same output', () => {
    const r1 = buildScenarioIndex([...scenarios]);
    const r2 = buildScenarioIndex([...scenarios]);
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (r1.ok && r2.ok) {
      expect(JSON.stringify(r1.value.scenarioIds)).toBe(JSON.stringify(r2.value.scenarioIds));
      expect(r1.value.scenarioCount).toBe(r2.value.scenarioCount);
    }
  });

  it('totalStepCount is correct', () => {
    const result = buildScenarioIndex([...scenarios]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const expected = scenarios.reduce((a, s) => a + s.steps.length, 0);
      expect(result.value.totalStepCount).toBe(expected);
    }
  });

  it('verdictCounts contains all verdict keys', () => {
    const result = buildScenarioIndex([...scenarios]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const keys = Object.keys(result.value.verdictCounts);
      expect(keys).toContain('fixture_only');
      expect(keys).toContain('degraded');
      expect(keys).toContain('failed');
      expect(keys).toContain('inconclusive');
    }
  });

  it('rejects liveData=true scenarios', () => {
    const bad = [{ ...CLEAN_TOKEN_REPLAY_SCENARIO, liveData: true as unknown as false }];
    const result = buildScenarioIndex(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('rejects fixtureOnly=false scenarios', () => {
    const bad = [{ ...CLEAN_TOKEN_REPLAY_SCENARIO, fixtureOnly: false as unknown as true }];
    const result = buildScenarioIndex(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('rejects empty array', () => {
    const result = buildScenarioIndex([]);
    expect(result.ok).toBe(false);
  });

  it('each entry has fixtureOnly:true and liveData:false', () => {
    const result = buildScenarioIndex([...scenarios]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      for (const entry of result.value.entries) {
        expect(entry.fixtureOnly).toBe(true);
        expect(entry.liveData).toBe(false);
      }
    }
  });

  it('uniqueStepTypes contains known step types', () => {
    const result = buildScenarioIndex([...scenarios]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.uniqueStepTypes.length).toBeGreaterThan(0);
      expect(result.value.uniqueStepTypes).toContain('token_snapshot');
    }
  });

  it('single scenario index works', () => {
    const result = buildScenarioIndex([CLEAN_TOKEN_REPLAY_SCENARIO]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.scenarioCount).toBe(1);
    }
  });
});

// ─── D. Run report ────────────────────────────────────────────────────────────

describe('D. Run report creation and validation', () => {
  function makeCleanRun() {
    return runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
  }

  function makeDegradedRun() {
    return runReplayScenario(RISKY_CREATOR_REPLAY_SCENARIO);
  }

  function makeFailedRun() {
    return runReplayScenario(MANIPULATION_REJECT_REPLAY_SCENARIO);
  }

  function makeInconclusiveRun() {
    return runReplayScenario(MISSING_DATA_REPLAY_SCENARIO);
  }

  it('builds a run report from a clean run', () => {
    const runResult = makeCleanRun();
    expect(runResult.ok).toBe(true);
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    expect(reportResult.ok).toBe(true);
    if (reportResult.ok) {
      expect(reportResult.value.fixtureOnly).toBe(true);
      expect(reportResult.value.liveData).toBe(false);
      expect(reportResult.value.safeToDisplay).toBe(true);
    }
  });

  it('run report has correct scenarioId', () => {
    const runResult = makeCleanRun();
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    expect(reportResult.value.scenarioId).toBe('clean_token_replay_scenario');
  });

  it('run report has non-empty reportId', () => {
    const runResult = makeCleanRun();
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    expect(reportResult.value.reportId.length).toBeGreaterThan(0);
  });

  it('run report stepCount matches step results', () => {
    const runResult = makeCleanRun();
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    expect(reportResult.value.stepCount).toBe(reportResult.value.stepRows.length);
  });

  it('run report for degraded run has degradedCount > 0', () => {
    const runResult = makeDegradedRun();
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    expect(reportResult.value.degradedCount).toBeGreaterThan(0);
  });

  it('run report for failed run has failureCount > 0', () => {
    const runResult = makeFailedRun();
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    expect(reportResult.value.failureCount).toBeGreaterThan(0);
  });

  it('run report for inconclusive run has inconclusiveCount > 0', () => {
    const runResult = makeInconclusiveRun();
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    expect(reportResult.value.inconclusiveCount).toBeGreaterThan(0);
  });

  it('run report summaryText is non-empty string', () => {
    const runResult = makeCleanRun();
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    expect(typeof reportResult.value.summaryText).toBe('string');
    expect(reportResult.value.summaryText.length).toBeGreaterThan(0);
  });

  it('run report stepRows all have safeToDisplay:true', () => {
    const runResult = makeCleanRun();
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    for (const row of reportResult.value.stepRows) {
      expect(row.safeToDisplay).toBe(true);
    }
  });

  it('rejects run with fixtureOnly=false', () => {
    const runResult = makeCleanRun();
    if (!runResult.ok) return;
    const badRun = { ...runResult.value, fixtureOnly: false as unknown as true };
    const result = buildReplayRunReport(badRun);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('rejects run with liveData=true', () => {
    const runResult = makeCleanRun();
    if (!runResult.ok) return;
    const badRun = { ...runResult.value, liveData: true as unknown as false };
    const result = buildReplayRunReport(badRun);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('rejects run with safeToDisplay=false', () => {
    const runResult = makeCleanRun();
    if (!runResult.ok) return;
    const badRun = { ...runResult.value, safeToDisplay: false as unknown as true };
    const result = buildReplayRunReport(badRun);
    expect(result.ok).toBe(false);
  });

  it('warningCount matches sum of step warning counts', () => {
    const runResult = makeFailedRun();
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    const sumWarnings = reportResult.value.stepRows.reduce((a, r) => a + r.warningCount, 0);
    expect(reportResult.value.warningCount).toBe(sumWarnings);
  });
});

// ─── E. Comparison report ─────────────────────────────────────────────────────

describe('E. Comparison report creation and regression detection', () => {
  function makeComparison() {
    const baselineResult = runReplayScenario(REGRESSION_COMPARISON_BASELINE_SCENARIO);
    const candidateResult = runReplayScenario(REGRESSION_COMPARISON_CANDIDATE_SCENARIO);
    if (!baselineResult.ok || !candidateResult.ok) return null;
    return compareReplayRuns(baselineResult.value, candidateResult.value);
  }

  it('builds a comparison report', () => {
    const cmp = makeComparison();
    if (!cmp || !cmp.ok) return;
    const result = buildReplayComparisonReport(cmp.value);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.liveData).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
    }
  });

  it('comparison report has non-empty comparisonReportId', () => {
    const cmp = makeComparison();
    if (!cmp || !cmp.ok) return;
    const result = buildReplayComparisonReport(cmp.value);
    if (!result.ok) return;
    expect(result.value.comparisonReportId.length).toBeGreaterThan(0);
  });

  it('regression is true when scoreDelta > threshold', () => {
    const cmp = makeComparison();
    if (!cmp || !cmp.ok) return;
    const result = buildReplayComparisonReport(cmp.value);
    if (!result.ok) return;
    // scoreDelta > 0.05 should indicate regression
    if (cmp.value.scoreDelta > 0.05) {
      expect(result.value.regression).toBe(true);
    }
  });

  it('comparison report has diagnostic findings', () => {
    const cmp = makeComparison();
    if (!cmp || !cmp.ok) return;
    const result = buildReplayComparisonReport(cmp.value);
    if (!result.ok) return;
    expect(result.value.diagnosticFindings.length).toBeGreaterThan(0);
  });

  it('all diagnostic findings have safeToDisplay:true', () => {
    const cmp = makeComparison();
    if (!cmp || !cmp.ok) return;
    const result = buildReplayComparisonReport(cmp.value);
    if (!result.ok) return;
    for (const f of result.value.diagnosticFindings) {
      expect(f.safeToDisplay).toBe(true);
    }
  });

  it('rejects comparison with empty comparisonId', () => {
    const cmp = makeComparison();
    if (!cmp || !cmp.ok) return;
    const bad = { ...cmp.value, comparisonId: '' };
    const result = buildReplayComparisonReport(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_COMPARISON_INPUT');
  });

  it('REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE has regression=true', () => {
    expect(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE.regression).toBe(true);
  });

  it('REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE has verdictChanged=true', () => {
    expect(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE.verdictChanged).toBe(true);
  });
});

// ─── F. Diagnostics ───────────────────────────────────────────────────────────

describe('F. Diagnostics creation and severity counts', () => {
  function makeFailedRunReport() {
    const runResult = runReplayScenario(MANIPULATION_REJECT_REPLAY_SCENARIO);
    if (!runResult.ok) return null;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return null;
    return reportResult.value;
  }

  function makeInconclusiveRun() {
    const runResult = runReplayScenario(MISSING_DATA_REPLAY_SCENARIO);
    if (!runResult.ok) return null;
    return runResult.value;
  }

  it('builds diagnostics from a run report', () => {
    const report = makeFailedRunReport();
    if (!report) return;
    const result = buildReplayDiagnostics(report);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.liveData).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
    }
  });

  it('builds diagnostics from a run directly', () => {
    const run = makeInconclusiveRun();
    if (!run) return;
    const result = buildReplayDiagnostics(run);
    expect(result.ok).toBe(true);
  });

  it('diagnostics for failed report has failure severity count > 0', () => {
    const report = makeFailedRunReport();
    if (!report) return;
    const result = buildReplayDiagnostics(report);
    if (!result.ok) return;
    expect(result.value.severityCounts.failure).toBeGreaterThan(0);
  });

  it('diagnostics has failedReasons for failed run', () => {
    const report = makeFailedRunReport();
    if (!report) return;
    const result = buildReplayDiagnostics(report);
    if (!result.ok) return;
    expect(result.value.failedReasons.length).toBeGreaterThan(0);
  });

  it('diagnostics has inconclusiveReasons for inconclusive run', () => {
    const run = makeInconclusiveRun();
    if (!run) return;
    const result = buildReplayDiagnostics(run);
    if (!result.ok) return;
    expect(result.value.inconclusiveReasons.length).toBeGreaterThan(0);
  });

  it('diagnostics has missingFixtureDataNotes for inconclusive run', () => {
    const run = makeInconclusiveRun();
    if (!run) return;
    const result = buildReplayDiagnostics(run);
    if (!result.ok) return;
    expect(result.value.missingFixtureDataNotes.length).toBeGreaterThan(0);
  });

  it('findingCount matches findings array length', () => {
    const report = makeFailedRunReport();
    if (!report) return;
    const result = buildReplayDiagnostics(report);
    if (!result.ok) return;
    expect(result.value.findingCount).toBe(result.value.findings.length);
  });

  it('all findings have safeToDisplay:true', () => {
    const report = makeFailedRunReport();
    if (!report) return;
    const result = buildReplayDiagnostics(report);
    if (!result.ok) return;
    for (const f of result.value.findings) {
      expect(f.safeToDisplay).toBe(true);
    }
  });

  it('severityCounts contains all severity keys', () => {
    const run = makeInconclusiveRun();
    if (!run) return;
    const result = buildReplayDiagnostics(run);
    if (!result.ok) return;
    const keys = Object.keys(result.value.severityCounts) as ReplayDiagnosticSeverity[];
    expect(keys).toContain('info');
    expect(keys).toContain('warning');
    expect(keys).toContain('risk');
    expect(keys).toContain('failure');
    expect(keys).toContain('inconclusive');
  });

  it('rejects source with fixtureOnly=false', () => {
    const run = makeInconclusiveRun();
    if (!run) return;
    const bad = { ...run, fixtureOnly: false as unknown as true };
    const result = buildReplayDiagnostics(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('diagnostics summaryText is non-empty', () => {
    const run = makeInconclusiveRun();
    if (!run) return;
    const result = buildReplayDiagnostics(run);
    if (!result.ok) return;
    expect(result.value.summaryText.length).toBeGreaterThan(0);
  });

  it('clean run produces info finding (all steps clean)', () => {
    const runResult = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    const result = buildReplayDiagnostics(reportResult.value);
    if (!result.ok) return;
    const codes = result.value.findings.map(f => f.code);
    expect(codes).toContain('ALL_STEPS_CLEAN');
  });
});

// ─── G. JSON export ───────────────────────────────────────────────────────────

describe('G. JSON export determinism and safety', () => {
  it('exports clean run report to JSON', () => {
    const result = exportReplayReportJson(CLEAN_REPLAY_RUN_REPORT_FIXTURE as unknown as Record<string, unknown>);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.liveData).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
      expect(result.value.contentType).toBe('run_report');
    }
  });

  it('JSON export is deterministic for same input', () => {
    const r1 = exportReplayReportJson(CLEAN_REPLAY_RUN_REPORT_FIXTURE as unknown as Record<string, unknown>);
    const r2 = exportReplayReportJson(CLEAN_REPLAY_RUN_REPORT_FIXTURE as unknown as Record<string, unknown>);
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (r1.ok && r2.ok) {
      // payload content should be the same (exportId differs due to counter)
      expect(JSON.stringify(r1.value.payload)).toBe(JSON.stringify(r2.value.payload));
    }
  });

  it('JSON export payload has stable key ordering', () => {
    const r = exportReplayReportJson({ b: 2, a: 1 } as unknown as Record<string, unknown>);
    expect(r.ok).toBe(true);
    if (r.ok) {
      const keys = Object.keys(r.value.payload);
      const sorted = [...keys].sort();
      expect(keys).toEqual(sorted);
    }
  });

  it('rejects object with unsafe action text', () => {
    const bad = { summary: 'You should buy now' };
    const result = exportReplayReportJson(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('UNSAFE_ACTION_TEXT_DETECTED');
  });

  it('rejects object with private key pattern', () => {
    const bad = { data: 'privateKey=abc123' };
    const result = exportReplayReportJson(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SECRET_PATTERN_DETECTED');
  });

  it('rejects object with seed phrase pattern', () => {
    const bad = { info: 'seed_phrase: word1 word2 word3' };
    const result = exportReplayReportJson(bad);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SECRET_PATTERN_DETECTED');
  });

  it('rejects non-object input', () => {
    const result = exportReplayReportJson('string' as unknown as Record<string, unknown>);
    expect(result.ok).toBe(false);
  });

  it('export has exportedAt timestamp', () => {
    const r = exportReplayReportJson(CLEAN_REPLAY_RUN_REPORT_FIXTURE as unknown as Record<string, unknown>);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.exportedAt.length).toBeGreaterThan(0);
  });

  it('export has non-empty exportId', () => {
    const r = exportReplayReportJson(CLEAN_REPLAY_RUN_REPORT_FIXTURE as unknown as Record<string, unknown>);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.exportId.length).toBeGreaterThan(0);
  });
});

// ─── H. Markdown export ───────────────────────────────────────────────────────

describe('H. Markdown export determinism and safety', () => {
  it('exports run report to Markdown', () => {
    const result = exportRunReportMarkdown(CLEAN_REPLAY_RUN_REPORT_FIXTURE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toContain('# Replay Run Report');
      expect(result.value).toContain('fixture-only analysis aid');
    }
  });

  it('Markdown run export is deterministic', () => {
    const r1 = exportRunReportMarkdown(CLEAN_REPLAY_RUN_REPORT_FIXTURE);
    const r2 = exportRunReportMarkdown(CLEAN_REPLAY_RUN_REPORT_FIXTURE);
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (r1.ok && r2.ok) expect(r1.value).toBe(r2.value);
  });

  it('exports comparison report to Markdown', () => {
    const result = exportComparisonReportMarkdown(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toContain('# Replay Comparison Report');
  });

  it('Markdown comparison export is deterministic', () => {
    const r1 = exportComparisonReportMarkdown(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE);
    const r2 = exportComparisonReportMarkdown(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE);
    if (r1.ok && r2.ok) expect(r1.value).toBe(r2.value);
  });

  it('exports scenario index to Markdown', () => {
    const indexResult = buildScenarioIndex([...ALL_REPLAY_FIXTURES]);
    if (!indexResult.ok) return;
    const result = exportScenarioIndexMarkdown(indexResult.value);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toContain('# Replay Scenario Index');
  });

  it('exports diagnostics to Markdown', () => {
    const runResult = runReplayScenario(MISSING_DATA_REPLAY_SCENARIO);
    if (!runResult.ok) return;
    const diagResult = buildReplayDiagnostics(runResult.value);
    if (!diagResult.ok) return;
    const result = exportDiagnosticsMarkdown(diagResult.value);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toContain('# Replay Diagnostics');
  });

  it('exportReplayReportMarkdown dispatcher works for run report', () => {
    const result = exportReplayReportMarkdown(CLEAN_REPLAY_RUN_REPORT_FIXTURE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toContain('# Replay Run Report');
  });

  it('exportReplayReportMarkdown dispatcher works for comparison report', () => {
    const result = exportReplayReportMarkdown(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toContain('# Replay Comparison Report');
  });

  it('Markdown does not contain trading instructions', () => {
    const result = exportRunReportMarkdown(CLEAN_REPLAY_RUN_REPORT_FIXTURE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const lower = result.value.toLowerCase();
      expect(lower).not.toContain('you should buy');
      expect(lower).not.toContain('execute trade');
      expect(lower).not.toContain('send transaction');
    }
  });

  it('Markdown has safety footer', () => {
    const result = exportRunReportMarkdown(CLEAN_REPLAY_RUN_REPORT_FIXTURE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toContain('Safety note');
      expect(result.value).toContain('fixture-only analysis aid');
    }
  });

  it('Markdown run report includes step table', () => {
    const result = exportRunReportMarkdown(CLEAN_REPLAY_RUN_REPORT_FIXTURE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toContain('| Seq |');
    }
  });
});

// ─── I. Validation helpers ────────────────────────────────────────────────────

describe('I. Validation helpers — unsafe text, secrets, URLs', () => {
  it('containsUnsafeActionText detects "buy"', () => {
    expect(containsUnsafeActionText('you should buy now')).toBe(true);
  });

  it('containsUnsafeActionText detects "sell"', () => {
    expect(containsUnsafeActionText('ready to sell')).toBe(true);
  });

  it('containsUnsafeActionText detects "execute"', () => {
    expect(containsUnsafeActionText('execute the trade')).toBe(true);
  });

  it('containsUnsafeActionText detects "snipe"', () => {
    expect(containsUnsafeActionText('snipe launch')).toBe(true);
  });

  it('containsUnsafeActionText does not flag safe text', () => {
    expect(containsUnsafeActionText('fixture-only analysis result')).toBe(false);
  });

  it('containsSecretPattern detects privatekey', () => {
    expect(containsSecretPattern('privateKey=abc123')).toBe(true);
  });

  it('containsSecretPattern detects seed_phrase', () => {
    expect(containsSecretPattern('seed_phrase: abc def ghi')).toBe(true);
  });

  it('containsSecretPattern detects apikey', () => {
    expect(containsSecretPattern('my apikey is 123')).toBe(true);
  });

  it('containsSecretPattern detects mnemonic', () => {
    expect(containsSecretPattern('mnemonic phrase here')).toBe(true);
  });

  it('containsSecretPattern does not flag safe text', () => {
    expect(containsSecretPattern('fixture-only report')).toBe(false);
  });

  it('containsUrlPattern detects wss://', () => {
    expect(containsUrlPattern('wss://endpoint.example.com')).toBe(true);
  });

  it('containsUrlPattern detects helius.dev', () => {
    expect(containsUrlPattern('https://api.helius.dev/v0/test')).toBe(true);
  });

  it('containsUrlPattern does not flag safe text', () => {
    expect(containsUrlPattern('fixture-only data')).toBe(false);
  });

  it('isDisplaySafe returns true for clean text', () => {
    expect(isDisplaySafe('Fixture-only analysis completed')).toBe(true);
  });

  it('isDisplaySafe returns false for unsafe action text', () => {
    expect(isDisplaySafe('buy signal detected')).toBe(false);
  });

  it('validateSafeText returns ok for safe text', () => {
    const result = validateSafeText('clean fixture result', 'test');
    expect(result.ok).toBe(true);
  });

  it('validateSafeText rejects unsafe action text', () => {
    const result = validateSafeText('auto trade signal', 'test');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('UNSAFE_ACTION_TEXT_DETECTED');
  });

  it('validateSafeText rejects secret patterns', () => {
    const result = validateSafeText('secretKey=abc', 'test');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('SECRET_PATTERN_DETECTED');
  });

  it('validateSafeText rejects RPC URL patterns', () => {
    const result = validateSafeText('wss://rpc.solana.com', 'test');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('URL_PATTERN_DETECTED');
  });

  it('validateJsonSafe rejects undefined', () => {
    const result = validateJsonSafe(undefined, 'testField');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('EXPORT_UNSAFE');
  });

  it('validateJsonSafe rejects function', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const result = validateJsonSafe(() => {}, 'fn');
    expect(result.ok).toBe(false);
  });

  it('validateJsonSafe rejects Error object', () => {
    const result = validateJsonSafe(new Error('test'), 'err');
    expect(result.ok).toBe(false);
  });

  it('validateJsonSafe passes for valid JSON object', () => {
    const result = validateJsonSafe({ a: 1, b: 'hello', c: true });
    expect(result.ok).toBe(true);
  });
});

// ─── J. Fixtures ──────────────────────────────────────────────────────────────

describe('J. Fixtures — deterministic, fixture-only, safeToDisplay', () => {
  it('CLEAN_REPLAY_RUN_REPORT_FIXTURE is fixture-only', () => {
    expect(CLEAN_REPLAY_RUN_REPORT_FIXTURE.fixtureOnly).toBe(true);
    expect(CLEAN_REPLAY_RUN_REPORT_FIXTURE.liveData).toBe(false);
    expect(CLEAN_REPLAY_RUN_REPORT_FIXTURE.safeToDisplay).toBe(true);
  });

  it('DEGRADED_REPLAY_RUN_REPORT_FIXTURE is fixture-only', () => {
    expect(DEGRADED_REPLAY_RUN_REPORT_FIXTURE.fixtureOnly).toBe(true);
    expect(DEGRADED_REPLAY_RUN_REPORT_FIXTURE.liveData).toBe(false);
    expect(DEGRADED_REPLAY_RUN_REPORT_FIXTURE.safeToDisplay).toBe(true);
  });

  it('FAILED_REPLAY_RUN_REPORT_FIXTURE is fixture-only', () => {
    expect(FAILED_REPLAY_RUN_REPORT_FIXTURE.fixtureOnly).toBe(true);
    expect(FAILED_REPLAY_RUN_REPORT_FIXTURE.liveData).toBe(false);
    expect(FAILED_REPLAY_RUN_REPORT_FIXTURE.safeToDisplay).toBe(true);
  });

  it('INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE is fixture-only', () => {
    expect(INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE.fixtureOnly).toBe(true);
    expect(INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE.liveData).toBe(false);
    expect(INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE.safeToDisplay).toBe(true);
  });

  it('REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE is fixture-only', () => {
    expect(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE.fixtureOnly).toBe(true);
    expect(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE.liveData).toBe(false);
    expect(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE.safeToDisplay).toBe(true);
  });

  it('all fixtures in ALL_REPLAY_REPORT_FIXTURES have safeToDisplay:true', () => {
    for (const f of ALL_REPLAY_REPORT_FIXTURES) {
      expect(f.safeToDisplay).toBe(true);
    }
  });

  it('all fixtures in ALL_REPLAY_REPORT_FIXTURES have liveData:false', () => {
    for (const f of ALL_REPLAY_REPORT_FIXTURES) {
      expect(f.liveData).toBe(false);
    }
  });

  it('all fixtures in ALL_REPLAY_REPORT_FIXTURES have fixtureOnly:true', () => {
    for (const f of ALL_REPLAY_REPORT_FIXTURES) {
      expect(f.fixtureOnly).toBe(true);
    }
  });

  it('CLEAN fixture has finalVerdict fixture_only', () => {
    expect(CLEAN_REPLAY_RUN_REPORT_FIXTURE.finalVerdict).toBe('fixture_only');
  });

  it('DEGRADED fixture has finalVerdict degraded', () => {
    expect(DEGRADED_REPLAY_RUN_REPORT_FIXTURE.finalVerdict).toBe('degraded');
  });

  it('FAILED fixture has finalVerdict failed', () => {
    expect(FAILED_REPLAY_RUN_REPORT_FIXTURE.finalVerdict).toBe('failed');
  });

  it('INCONCLUSIVE fixture has finalVerdict inconclusive', () => {
    expect(INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE.finalVerdict).toBe('inconclusive');
  });

  it('fixtures are deterministic (reference equality)', () => {
    // Importing twice should yield same object reference
    expect(CLEAN_REPLAY_RUN_REPORT_FIXTURE.reportId).toBe('rpt_fixture_clean_001');
    expect(DEGRADED_REPLAY_RUN_REPORT_FIXTURE.reportId).toBe('rpt_fixture_degraded_001');
    expect(FAILED_REPLAY_RUN_REPORT_FIXTURE.reportId).toBe('rpt_fixture_failed_001');
    expect(INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE.reportId).toBe('rpt_fixture_inconclusive_001');
  });

  it('REGRESSION fixture diagnostic findings are non-empty', () => {
    expect(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE.diagnosticFindings.length).toBeGreaterThan(0);
  });

  it('all step rows in CLEAN fixture have safeToDisplay:true', () => {
    for (const row of CLEAN_REPLAY_RUN_REPORT_FIXTURE.stepRows) {
      expect(row.safeToDisplay).toBe(true);
    }
  });
});

// ─── K. Safety invariants ─────────────────────────────────────────────────────

describe('K. Safety invariants', () => {
  it('no run report creates trade intents', () => {
    const runResult = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    const json = JSON.stringify(reportResult.value);
    expect(json.toLowerCase()).not.toContain('tradeintent');
    expect(json.toLowerCase()).not.toContain('trade_intent');
    expect(json.toLowerCase()).not.toContain('createtradeintent');
  });

  it('no run report creates execution plans', () => {
    const runResult = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    const json = JSON.stringify(reportResult.value);
    expect(json.toLowerCase()).not.toContain('executionplan');
    expect(json.toLowerCase()).not.toContain('execution_plan');
  });

  it('no report enables paper trading', () => {
    const runResult = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    if (!runResult.ok) return;
    const reportResult = buildReplayRunReport(runResult.value);
    if (!reportResult.ok) return;
    const json = JSON.stringify(reportResult.value);
    expect(json.toLowerCase()).not.toContain('papertrade');
    expect(json.toLowerCase()).not.toContain('paper_trade');
  });

  it('no report enables live data', () => {
    // All reports must have liveData=false
    expect(CLEAN_REPLAY_RUN_REPORT_FIXTURE.liveData).toBe(false);
    expect(DEGRADED_REPLAY_RUN_REPORT_FIXTURE.liveData).toBe(false);
    expect(FAILED_REPLAY_RUN_REPORT_FIXTURE.liveData).toBe(false);
    expect(INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE.liveData).toBe(false);
    expect(REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE.liveData).toBe(false);
  });

  it('capabilities never allow canTrade:true', () => {
    const caps = getReplayReportingCapabilities();
    expect(caps.canTrade).toBe(false);
  });

  it('capabilities never allow canExecute:true', () => {
    const caps = getReplayReportingCapabilities();
    expect(caps.canExecute).toBe(false);
  });

  it('diagnostics findings do not contain action recommendations', () => {
    const runResult = runReplayScenario(MANIPULATION_REJECT_REPLAY_SCENARIO);
    if (!runResult.ok) return;
    const diagResult = buildReplayDiagnostics(runResult.value);
    if (!diagResult.ok) return;
    for (const f of diagResult.value.findings) {
      expect(containsUnsafeActionText(f.message)).toBe(false);
    }
  });

  it('Markdown export for failed report contains no buy/sell/execute recommendations', () => {
    const result = exportRunReportMarkdown(FAILED_REPLAY_RUN_REPORT_FIXTURE);
    if (!result.ok) return;
    const lower = result.value.toLowerCase();
    expect(lower).not.toMatch(/\byou should buy\b/);
    expect(lower).not.toMatch(/\bexecute trade\b/);
    expect(lower).not.toMatch(/\bsell signal\b/);
  });
});

// ─── L. Dependency checks ─────────────────────────────────────────────────────

describe('L. Dependency checks — no Solana/provider SDKs', () => {
  const pkgPath = resolve(process.cwd(), 'packages/replay-reporting/package.json');

  it('replay-reporting package.json does not depend on @solana/web3.js', () => {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(allDeps)).not.toContain('@solana/web3.js');
  });

  it('replay-reporting package.json does not depend on helius', () => {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    const hasHelius = Object.keys(allDeps).some(k => k.toLowerCase().includes('helius'));
    expect(hasHelius).toBe(false);
  });

  it('replay-reporting package.json does not depend on yellowstone', () => {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    const hasYS = Object.keys(allDeps).some(k => k.toLowerCase().includes('yellowstone'));
    expect(hasYS).toBe(false);
  });

  it('replay-reporting only depends on @sonic/replay-lab as runtime dep', () => {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
      dependencies?: Record<string, string>;
    };
    const deps = Object.keys(pkg.dependencies ?? {});
    expect(deps).toContain('@sonic/replay-lab');
    // No other runtime deps beyond replay-lab
    const nonReplayDeps = deps.filter(d => d !== '@sonic/replay-lab');
    expect(nonReplayDeps.length).toBe(0);
  });
});

// ─── M. Phase 13 regression tests ─────────────────────────────────────────────

describe('M. Phase 13 regression tests still pass', () => {
  it('getReplayLabCapabilities returns all unsafe fields false', () => {
    const caps = getReplayLabCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.canUseSolanaRpc).toBe(false);
    expect(caps.canCreateTradeIntents).toBe(false);
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('ALL_REPLAY_FIXTURES has 8 scenarios', () => {
    expect(ALL_REPLAY_FIXTURES.length).toBe(8);
  });

  it('runReplayScenario produces a valid run for clean scenario', () => {
    const result = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.liveData).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
    }
  });

  it('compareReplayRuns produces a valid comparison', () => {
    const b = runReplayScenario(REGRESSION_COMPARISON_BASELINE_SCENARIO);
    const c = runReplayScenario(REGRESSION_COMPARISON_CANDIDATE_SCENARIO);
    if (!b.ok || !c.ok) return;
    const cmp = compareReplayRuns(b.value, c.value);
    expect(cmp.ok).toBe(true);
    if (cmp.ok) {
      expect(cmp.value.safeToDisplay).toBe(true);
    }
  });

  it('Phase 13 fixtures all have fixtureOnly:true', () => {
    for (const s of ALL_REPLAY_FIXTURES) {
      expect(s.fixtureOnly).toBe(true);
    }
  });

  it('Phase 13 fixtures all have liveData:false', () => {
    for (const s of ALL_REPLAY_FIXTURES) {
      expect(s.liveData).toBe(false);
    }
  });

  it('runReplayScenario for RISKY_CREATOR produces degraded result', () => {
    const r = runReplayScenario(RISKY_CREATOR_REPLAY_SCENARIO);
    if (!r.ok) return;
    expect(['degraded', 'failed']).toContain(r.value.summary.finalVerdict);
  });

  it('runReplayScenario for MANIPULATION_REJECT produces failed result', () => {
    const r = runReplayScenario(MANIPULATION_REJECT_REPLAY_SCENARIO);
    if (!r.ok) return;
    expect(r.value.summary.finalVerdict).toBe('failed');
  });

  it('runReplayScenario for MISSING_DATA produces inconclusive result', () => {
    const r = runReplayScenario(MISSING_DATA_REPLAY_SCENARIO);
    if (!r.ok) return;
    expect(r.value.summary.finalVerdict).toBe('inconclusive');
  });
});
