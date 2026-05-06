/**
 * packages/replay-reporting/src/fixtures.ts
 *
 * Phase 14 — deterministic synthetic reporting fixtures.
 *
 * Rules:
 *   - synthetic data only
 *   - fixtureOnly: true, liveData: false, safeToDisplay: true
 *   - no real token mints, wallet addresses, private data
 *   - no real URLs, no provider names requiring live access
 *   - no network calls
 */

import type {
  ReplayRunReport,
  ReplayComparisonReport,
  ReplayDiagnosticFinding,
} from './types.js';

// ─── Clean run report ─────────────────────────────────────────────────────────

export const CLEAN_REPLAY_RUN_REPORT_FIXTURE: ReplayRunReport = {
  reportId: 'rpt_fixture_clean_001',
  runId: 'run_clean_token_replay_scenario_1_fixture',
  scenarioId: 'clean_token_replay_scenario',
  finalVerdict: 'fixture_only',
  finalRiskScore: 0.18,
  averageConfidence: 0.6,
  stepCount: 2,
  stepRows: [
    {
      stepId: 'step_clean_token_1',
      sequence: 1,
      stepVerdict: 'fixture_only',
      warningCount: 0,
      warnings: [],
      riskScore: 0.18,
      confidence: 0.6,
      safeToDisplay: true,
    },
    {
      stepId: 'step_clean_token_2',
      sequence: 2,
      stepVerdict: 'fixture_only',
      warningCount: 0,
      warnings: [],
      riskScore: 0.2,
      confidence: 0.6,
      safeToDisplay: true,
    },
  ],
  warningCount: 0,
  failureCount: 0,
  degradedCount: 0,
  inconclusiveCount: 0,
  summaryText: 'Fixture-only analysis completed. No warnings recorded.',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Degraded run report ──────────────────────────────────────────────────────

export const DEGRADED_REPLAY_RUN_REPORT_FIXTURE: ReplayRunReport = {
  reportId: 'rpt_fixture_degraded_001',
  runId: 'run_risky_creator_replay_scenario_1_fixture',
  scenarioId: 'risky_creator_replay_scenario',
  finalVerdict: 'degraded',
  finalRiskScore: 0.71,
  averageConfidence: 0.6,
  stepCount: 2,
  stepRows: [
    {
      stepId: 'step_risky_creator_1',
      sequence: 1,
      stepVerdict: 'degraded',
      warningCount: 1,
      warnings: ['elevated_risk_flags'],
      riskScore: 0.75,
      confidence: 0.6,
      safeToDisplay: true,
    },
    {
      stepId: 'step_risky_creator_2',
      sequence: 2,
      stepVerdict: 'degraded',
      warningCount: 1,
      warnings: ['elevated_risk_flags'],
      riskScore: 0.67,
      confidence: 0.6,
      safeToDisplay: true,
    },
  ],
  warningCount: 2,
  failureCount: 0,
  degradedCount: 2,
  inconclusiveCount: 0,
  summaryText: 'One or more steps degraded (elevated risk flags present). 2 warning(s) recorded.',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Failed run report ────────────────────────────────────────────────────────

export const FAILED_REPLAY_RUN_REPORT_FIXTURE: ReplayRunReport = {
  reportId: 'rpt_fixture_failed_001',
  runId: 'run_manipulation_reject_replay_scenario_1_fixture',
  scenarioId: 'manipulation_reject_replay_scenario',
  finalVerdict: 'failed',
  finalRiskScore: 0.9,
  averageConfidence: 0.6,
  stepCount: 2,
  stepRows: [
    {
      stepId: 'step_manip_reject_1',
      sequence: 1,
      stepVerdict: 'failed',
      warningCount: 1,
      warnings: ['manipulation_detected'],
      riskScore: 0.9,
      confidence: 0.6,
      safeToDisplay: true,
    },
    {
      stepId: 'step_manip_reject_2',
      sequence: 2,
      stepVerdict: 'failed',
      warningCount: 1,
      warnings: ['manipulation_detected'],
      riskScore: 0.9,
      confidence: 0.6,
      safeToDisplay: true,
    },
  ],
  warningCount: 2,
  failureCount: 2,
  degradedCount: 0,
  inconclusiveCount: 0,
  summaryText:
    'One or more steps failed (manipulation or critical risk detected). 2 warning(s) recorded.',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Inconclusive run report ──────────────────────────────────────────────────

export const INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE: ReplayRunReport = {
  reportId: 'rpt_fixture_inconclusive_001',
  runId: 'run_missing_data_replay_scenario_1_fixture',
  scenarioId: 'missing_data_replay_scenario',
  finalVerdict: 'inconclusive',
  finalRiskScore: 0.5,
  averageConfidence: 0.3,
  stepCount: 2,
  stepRows: [
    {
      stepId: 'step_missing_1',
      sequence: 1,
      stepVerdict: 'inconclusive',
      warningCount: 1,
      warnings: ['missing_fixture_data'],
      riskScore: 0.5,
      confidence: 0.3,
      safeToDisplay: true,
    },
    {
      stepId: 'step_missing_2',
      sequence: 2,
      stepVerdict: 'inconclusive',
      warningCount: 1,
      warnings: ['missing_fixture_data'],
      riskScore: 0.5,
      confidence: 0.3,
      safeToDisplay: true,
    },
  ],
  warningCount: 2,
  failureCount: 0,
  degradedCount: 0,
  inconclusiveCount: 2,
  summaryText:
    'Insufficient fixture data to determine outcome. 2 warning(s) recorded.',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Regression comparison report ────────────────────────────────────────────

const REGRESSION_FINDINGS: readonly ReplayDiagnosticFinding[] = [
  {
    severity: 'warning',
    code: 'VERDICT_CHANGED',
    message:
      'Verdict changed between baseline and candidate runs. risk score increased by 0.210; verdict changed from fixture_only to degraded',
    safeToDisplay: true,
  },
  {
    severity: 'risk',
    code: 'RISK_SCORE_REGRESSION',
    message: 'Candidate risk score regressed by 0.210 compared to baseline',
    safeToDisplay: true,
  },
];

export const REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE: ReplayComparisonReport = {
  comparisonReportId: 'crpt_fixture_regression_001',
  baselineRunId: 'run_regression_comparison_baseline_1_fixture',
  candidateRunId: 'run_regression_comparison_candidate_1_fixture',
  verdictChanged: true,
  scoreDelta: 0.21,
  confidenceDelta: 0.0,
  regression: true,
  summaryText:
    'risk score increased by 0.210; verdict changed from fixture_only to degraded. Regression detected in candidate run.',
  diagnosticFindings: REGRESSION_FINDINGS,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── All fixtures ─────────────────────────────────────────────────────────────

export const ALL_REPLAY_REPORT_FIXTURES = [
  CLEAN_REPLAY_RUN_REPORT_FIXTURE,
  DEGRADED_REPLAY_RUN_REPORT_FIXTURE,
  FAILED_REPLAY_RUN_REPORT_FIXTURE,
  INCONCLUSIVE_REPLAY_RUN_REPORT_FIXTURE,
  REGRESSION_REPLAY_COMPARISON_REPORT_FIXTURE,
] as const;
