/**
 * packages/read-only-api-contracts/src/fixtures.ts
 *
 * Phase 19 — Deterministic synthetic ReadOnlyApiContract fixtures.
 *
 * Rules:
 *   - synthetic data only
 *   - fixtureOnly: true, liveData: false, safeToDisplay: true
 *   - analysisOnly: true, nonExecutable: true, readOnly: true, contractOnly: true
 *   - no real token mints, wallet addresses, private data
 *   - no real URLs, no provider names requiring live access
 *   - no network calls
 *   - deterministic across test runs (no Date.now() or random)
 */

import type { ReadOnlyApiContractFixture } from './types.js';
import { buildReadOnlyApiContractBundle } from './bundle-builder.js';

// ─── Helper: build bundle ─────────────────────────────────────────────────────

function makeBundle(
  bundleId: string,
  healthId: string,
  dashboardContractId: string,
  evidenceContractId: string,
  evidenceLedgerId: string,
  safetyContractId: string,
  severity: 'info' | 'warning' | 'risk' | 'failure' | 'inconclusive',
  summaryText: string,
  entryCount: number,
  totalFindings: number,
  panelsAvailable: readonly string[],
) {
  const result = buildReadOnlyApiContractBundle({
    bundleId,
    health: { healthId, fixtureOnly: true, liveData: false },
    dashboard: {
      dashboardContractId,
      severity,
      summaryText,
      panelsAvailable,
      totalFindings,
      evidenceLedgerId,
      fixtureOnly: true,
      liveData: false,
    },
    evidence: {
      evidenceContractId,
      evidenceLedgerId,
      severity,
      summaryText,
      entryCount,
      fixtureOnly: true,
      liveData: false,
    },
    safety: { safetyContractId, fixtureOnly: true, liveData: false },
    fixtureOnly: true,
    liveData: false,
  });
  if (!result.ok) throw new Error(`Failed to build fixture bundle: ${result.message}`);
  return result.value;
}

// ─── Clean fixture ────────────────────────────────────────────────────────────

const cleanBundle = makeBundle(
  'clean_contract_bundle',
  'clean_health',
  'clean_dashboard_contract',
  'clean_evidence_contract',
  'clean_evidence_ledger',
  'clean_safety_contract',
  'info',
  'Fixture clean contract analysis: all invariants satisfied.',
  4,
  4,
  ['replay_panel', 'strategy_panel', 'evaluation_panel', 'evidence_panel', 'safety_panel'],
);

export const CLEAN_READ_ONLY_API_CONTRACT_FIXTURE: ReadOnlyApiContractFixture = {
  fixtureId: 'clean_read_only_api_contract_fixture',
  displayName: 'Clean Read-Only API Contract Fixture',
  description: 'A synthetic clean read-only API contract with all info-level analysis.',
  bundle: cleanBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
  contractOnly: true,
};

// ─── Degraded fixture ─────────────────────────────────────────────────────────

const degradedBundle = makeBundle(
  'degraded_contract_bundle',
  'degraded_health',
  'degraded_dashboard_contract',
  'degraded_evidence_contract',
  'degraded_evidence_ledger',
  'degraded_safety_contract',
  'warning',
  'Fixture degraded contract analysis: warning-level signals detected.',
  3,
  3,
  ['replay_panel', 'evaluation_panel', 'evidence_panel'],
);

export const DEGRADED_READ_ONLY_API_CONTRACT_FIXTURE: ReadOnlyApiContractFixture = {
  fixtureId: 'degraded_read_only_api_contract_fixture',
  displayName: 'Degraded Read-Only API Contract Fixture',
  description: 'A synthetic degraded read-only API contract with warning-level analysis.',
  bundle: degradedBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
  contractOnly: true,
};

// ─── Failed fixture ───────────────────────────────────────────────────────────

const failedBundle = makeBundle(
  'failed_contract_bundle',
  'failed_health',
  'failed_dashboard_contract',
  'failed_evidence_contract',
  'failed_evidence_ledger',
  'failed_safety_contract',
  'failure',
  'Fixture failed contract analysis: failure-level patterns detected.',
  5,
  5,
  ['replay_panel', 'strategy_panel', 'evidence_panel'],
);

export const FAILED_READ_ONLY_API_CONTRACT_FIXTURE: ReadOnlyApiContractFixture = {
  fixtureId: 'failed_read_only_api_contract_fixture',
  displayName: 'Failed Read-Only API Contract Fixture',
  description: 'A synthetic failed read-only API contract with failure-level analysis.',
  bundle: failedBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
  contractOnly: true,
};

// ─── Inconclusive fixture ─────────────────────────────────────────────────────

const inconclusiveBundle = makeBundle(
  'inconclusive_contract_bundle',
  'inconclusive_health',
  'inconclusive_dashboard_contract',
  'inconclusive_evidence_contract',
  'inconclusive_evidence_ledger',
  'inconclusive_safety_contract',
  'inconclusive',
  'Fixture inconclusive contract analysis: insufficient data for definitive conclusion.',
  1,
  1,
  ['evidence_panel'],
);

export const INCONCLUSIVE_READ_ONLY_API_CONTRACT_FIXTURE: ReadOnlyApiContractFixture = {
  fixtureId: 'inconclusive_read_only_api_contract_fixture',
  displayName: 'Inconclusive Read-Only API Contract Fixture',
  description: 'A synthetic inconclusive read-only API contract with inconclusive analysis.',
  bundle: inconclusiveBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
  contractOnly: true,
};

// ─── Mixed fixture ────────────────────────────────────────────────────────────

const mixedBundle = makeBundle(
  'mixed_contract_bundle',
  'mixed_health',
  'mixed_dashboard_contract',
  'mixed_evidence_contract',
  'mixed_evidence_ledger',
  'mixed_safety_contract',
  'risk',
  'Fixture mixed contract analysis: risk-level patterns across multiple areas.',
  6,
  6,
  ['replay_panel', 'strategy_panel', 'evaluation_panel', 'evidence_panel', 'safety_panel'],
);

export const MIXED_READ_ONLY_API_CONTRACT_FIXTURE: ReadOnlyApiContractFixture = {
  fixtureId: 'mixed_read_only_api_contract_fixture',
  displayName: 'Mixed Read-Only API Contract Fixture',
  description: 'A synthetic mixed read-only API contract combining multiple severity levels.',
  bundle: mixedBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
  contractOnly: true,
};

// ─── Regression fixture ───────────────────────────────────────────────────────

const regressionBundle = makeBundle(
  'regression_contract_bundle',
  'regression_health',
  'regression_dashboard_contract',
  'regression_evidence_contract',
  'regression_evidence_ledger',
  'regression_safety_contract',
  'risk',
  'Fixture regression contract analysis: risk-level deviation from baseline detected.',
  2,
  2,
  ['replay_panel', 'evaluation_panel'],
);

export const REGRESSION_READ_ONLY_API_CONTRACT_FIXTURE: ReadOnlyApiContractFixture = {
  fixtureId: 'regression_read_only_api_contract_fixture',
  displayName: 'Regression Read-Only API Contract Fixture',
  description: 'A synthetic regression read-only API contract detecting risk-level deviation.',
  bundle: regressionBundle,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
  readOnly: true,
  contractOnly: true,
};

// ─── All fixtures ─────────────────────────────────────────────────────────────

export const ALL_READ_ONLY_API_CONTRACT_FIXTURES: readonly ReadOnlyApiContractFixture[] = [
  CLEAN_READ_ONLY_API_CONTRACT_FIXTURE,
  DEGRADED_READ_ONLY_API_CONTRACT_FIXTURE,
  FAILED_READ_ONLY_API_CONTRACT_FIXTURE,
  INCONCLUSIVE_READ_ONLY_API_CONTRACT_FIXTURE,
  MIXED_READ_ONLY_API_CONTRACT_FIXTURE,
  REGRESSION_READ_ONLY_API_CONTRACT_FIXTURE,
];
