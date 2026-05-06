/**
 * packages/dashboard-read-models/src/fixtures.ts
 *
 * Phase 18 — Deterministic synthetic DashboardReadModel fixtures.
 *
 * Rules:
 *   - synthetic data only
 *   - fixtureOnly: true, liveData: false, safeToDisplay: true
 *   - analysisOnly: true, nonExecutable: true, readOnly: true
 *   - no real token mints, wallet addresses, private data
 *   - no real URLs, no provider names requiring live access
 *   - no network calls
 *   - deterministic across test runs (no Date.now() or random)
 */

import type {
  DashboardReadModelFixture,
  DashboardReadModelInput,
  DashboardReadModelFinding,
} from './types.js';
import { buildDashboardReadModelBundle } from './bundle-builder.js';

// ─── Helper: make finding ─────────────────────────────────────────────────────

function makeFinding(
  id: string,
  severity: DashboardReadModelFinding['severity'],
  title: string,
  description: string,
): DashboardReadModelFinding {
  return {
    findingId: id,
    severity,
    title,
    description,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
    readOnly: true,
  };
}

// ─── Helper: build bundle from input ─────────────────────────────────────────

function makeBundle(input: DashboardReadModelInput) {
  const result = buildDashboardReadModelBundle(input);
  if (!result.ok) throw new Error(`Failed to build fixture bundle: ${result.message}`);
  return result.value;
}

// ─── Clean fixture ────────────────────────────────────────────────────────────

const cleanInput: DashboardReadModelInput = {
  inputId: 'clean_fixture_input',
  evidenceLedgerId: 'clean_evidence_ledger',
  findings: [
    makeFinding(
      'clean_finding_replay_ok',
      'info',
      'Replay analysis complete',
      'Fixture replay analysis shows clean results with no anomalies detected.',
    ),
    makeFinding(
      'clean_finding_strategy_ok',
      'info',
      'Strategy intent analysis complete',
      'Fixture strategy intent analysis shows all intents within expected parameters.',
    ),
    makeFinding(
      'clean_finding_eval_ok',
      'info',
      'Evaluation analysis complete',
      'Fixture strategy evaluation shows strong evidence quality across all evaluated intents.',
    ),
    makeFinding(
      'clean_finding_evidence_ok',
      'info',
      'Evidence ledger analysis complete',
      'Fixture evidence ledger shows analysis_only classification with strong evidence quality.',
    ),
  ],
  fixtureOnly: true,
  liveData: false,
};

const cleanBundle = makeBundle(cleanInput);

export const CLEAN_DASHBOARD_READ_MODEL_FIXTURE: DashboardReadModelFixture = {
  fixtureId: 'clean_dashboard_read_model_fixture',
  displayName: 'Clean Dashboard Read Model Fixture',
  description: 'A synthetic clean dashboard read model with all info-level findings.',
  bundle: cleanBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
};

// ─── Degraded fixture ─────────────────────────────────────────────────────────

const degradedInput: DashboardReadModelInput = {
  inputId: 'degraded_fixture_input',
  evidenceLedgerId: 'degraded_evidence_ledger',
  findings: [
    makeFinding(
      'degraded_finding_replay_warn',
      'warning',
      'Replay analysis shows degraded patterns',
      'Fixture replay analysis detects degraded score bands across multiple scenarios.',
    ),
    makeFinding(
      'degraded_finding_strategy_warn',
      'warning',
      'Strategy intent analysis shows degraded signals',
      'Fixture strategy intent analysis shows below-threshold evidence quality.',
    ),
    makeFinding(
      'degraded_finding_eval_warn',
      'warning',
      'Evaluation analysis shows degraded evidence',
      'Fixture strategy evaluation shows degraded classification for multiple intents.',
    ),
    makeFinding(
      'degraded_finding_evidence_warn',
      'warning',
      'Evidence ledger shows degraded quality',
      'Fixture evidence ledger shows watch_only classification due to degraded evidence.',
    ),
  ],
  fixtureOnly: true,
  liveData: false,
};

const degradedBundle = makeBundle(degradedInput);

export const DEGRADED_DASHBOARD_READ_MODEL_FIXTURE: DashboardReadModelFixture = {
  fixtureId: 'degraded_dashboard_read_model_fixture',
  displayName: 'Degraded Dashboard Read Model Fixture',
  description: 'A synthetic degraded dashboard read model with warning-level findings.',
  bundle: degradedBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
};

// ─── Failed fixture ───────────────────────────────────────────────────────────

const failedInput: DashboardReadModelInput = {
  inputId: 'failed_fixture_input',
  evidenceLedgerId: 'failed_evidence_ledger',
  findings: [
    makeFinding(
      'failed_finding_replay_fail',
      'failure',
      'Replay analysis shows failure patterns',
      'Fixture replay analysis detects failure-level patterns requiring review.',
    ),
    makeFinding(
      'failed_finding_strategy_risk',
      'risk',
      'Strategy intent analysis shows risk signals',
      'Fixture strategy intent analysis detects risk-level evidence quality issues.',
    ),
    makeFinding(
      'failed_finding_eval_fail',
      'failure',
      'Evaluation analysis shows rejection signals',
      'Fixture strategy evaluation shows rejection classification for analysed intents.',
    ),
    makeFinding(
      'failed_finding_evidence_fail',
      'failure',
      'Evidence ledger shows rejection classification',
      'Fixture evidence ledger shows rejected_by_evidence classification.',
    ),
  ],
  fixtureOnly: true,
  liveData: false,
};

const failedBundle = makeBundle(failedInput);

export const FAILED_DASHBOARD_READ_MODEL_FIXTURE: DashboardReadModelFixture = {
  fixtureId: 'failed_dashboard_read_model_fixture',
  displayName: 'Failed Dashboard Read Model Fixture',
  description: 'A synthetic failed dashboard read model with failure-level findings.',
  bundle: failedBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
};

// ─── Inconclusive fixture ─────────────────────────────────────────────────────

const inconclusiveInput: DashboardReadModelInput = {
  inputId: 'inconclusive_fixture_input',
  evidenceLedgerId: 'inconclusive_evidence_ledger',
  findings: [
    makeFinding(
      'inconclusive_finding_replay',
      'inconclusive',
      'Replay analysis inconclusive',
      'Fixture replay analysis has insufficient data to reach a definitive conclusion.',
    ),
    makeFinding(
      'inconclusive_finding_evidence',
      'inconclusive',
      'Evidence ledger shows insufficient evidence',
      'Fixture evidence ledger shows insufficient_evidence classification.',
    ),
  ],
  fixtureOnly: true,
  liveData: false,
};

const inconclusiveBundle = makeBundle(inconclusiveInput);

export const INCONCLUSIVE_DASHBOARD_READ_MODEL_FIXTURE: DashboardReadModelFixture = {
  fixtureId: 'inconclusive_dashboard_read_model_fixture',
  displayName: 'Inconclusive Dashboard Read Model Fixture',
  description: 'A synthetic inconclusive dashboard read model with inconclusive findings.',
  bundle: inconclusiveBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
};

// ─── Mixed fixture ────────────────────────────────────────────────────────────

const mixedInput: DashboardReadModelInput = {
  inputId: 'mixed_fixture_input',
  evidenceLedgerId: 'mixed_evidence_ledger',
  findings: [
    makeFinding(
      'mixed_finding_replay_info',
      'info',
      'Replay snapshot captured',
      'Fixture replay run snapshot captured for analysis review.',
    ),
    makeFinding(
      'mixed_finding_report_warn',
      'warning',
      'Replay report shows mixed classification',
      'Fixture replay report shows mixed classification results across scenarios.',
    ),
    makeFinding(
      'mixed_finding_strategy_info',
      'info',
      'Strategy intent quality assessed',
      'Fixture strategy intent evidence shows mixed quality across intent families.',
    ),
    makeFinding(
      'mixed_finding_eval_fail',
      'failure',
      'Evaluation indicates rejection for some fixture intents',
      'Fixture strategy evaluation rejects some intents based on failed evidence analysis.',
    ),
    makeFinding(
      'mixed_finding_evidence_risk',
      'risk',
      'Evidence ledger shows risk-level signals',
      'Fixture evidence ledger shows risk-level evidence patterns from mixed sources.',
    ),
  ],
  fixtureOnly: true,
  liveData: false,
};

const mixedBundle = makeBundle(mixedInput);

export const MIXED_DASHBOARD_READ_MODEL_FIXTURE: DashboardReadModelFixture = {
  fixtureId: 'mixed_dashboard_read_model_fixture',
  displayName: 'Mixed Dashboard Read Model Fixture',
  description: 'A synthetic mixed dashboard read model combining multiple finding severities.',
  bundle: mixedBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
};

// ─── Regression fixture ───────────────────────────────────────────────────────

const regressionInput: DashboardReadModelInput = {
  inputId: 'regression_fixture_input',
  evidenceLedgerId: 'regression_evidence_ledger',
  findings: [
    makeFinding(
      'regression_finding_risk',
      'risk',
      'Regression risk pattern detected',
      'Fixture regression analysis detects risk-level deviation between baseline and candidate evidence.',
    ),
    makeFinding(
      'regression_finding_warn',
      'warning',
      'Regression baseline deviation observed',
      'Fixture regression analysis shows candidate metrics below baseline threshold.',
    ),
  ],
  fixtureOnly: true,
  liveData: false,
};

const regressionBundle = makeBundle(regressionInput);

export const REGRESSION_DASHBOARD_READ_MODEL_FIXTURE: DashboardReadModelFixture = {
  fixtureId: 'regression_dashboard_read_model_fixture',
  displayName: 'Regression Dashboard Read Model Fixture',
  description: 'A synthetic regression dashboard read model detecting risk-level deviation.',
  bundle: regressionBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
};

// ─── All fixtures ─────────────────────────────────────────────────────────────

export const ALL_DASHBOARD_READ_MODEL_FIXTURES: readonly DashboardReadModelFixture[] = [
  CLEAN_DASHBOARD_READ_MODEL_FIXTURE,
  DEGRADED_DASHBOARD_READ_MODEL_FIXTURE,
  FAILED_DASHBOARD_READ_MODEL_FIXTURE,
  INCONCLUSIVE_DASHBOARD_READ_MODEL_FIXTURE,
  MIXED_DASHBOARD_READ_MODEL_FIXTURE,
  REGRESSION_DASHBOARD_READ_MODEL_FIXTURE,
];
