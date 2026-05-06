/**
 * apps/read-only-api/src/fixtures.ts
 *
 * Phase 20 — Local Read-Only API shell fixtures.
 *
 * Deterministic fixture data for all GET endpoints.
 * All data is synthetic, fixture-only, read-only, analysis-only, non-executable.
 * No live data, no real token mints, no real wallet addresses.
 * No network calls.
 */

import {
  buildReadOnlyApiContractBundle,
  exportReadOnlyApiContractJson,
  exportReadOnlyApiContractOpenApiShape,
  ALL_READ_ONLY_API_CONTRACT_FIXTURES,
} from '@sonic/read-only-api-contracts';
import { ALL_DASHBOARD_READ_MODEL_FIXTURES } from '@sonic/dashboard-read-models';
import { getLocalReadOnlyApiCapabilities } from './capabilities.js';

// ─── Contracts fixture ────────────────────────────────────────────────────────

function buildContractsFixture() {
  const result = buildReadOnlyApiContractBundle({
    bundleId: 'lro_api_contracts_fixture',
    health: { healthId: 'lro_api_health', fixtureOnly: true, liveData: false },
    dashboard: {
      dashboardContractId: 'lro_api_dashboard_contract',
      severity: 'info',
      summaryText:
        'Local Read-Only API: fixture-only, analysis-only, non-executable, read-only, local-only.',
      panelsAvailable: [
        'overview',
        'replay',
        'strategy',
        'evaluation',
        'evidence',
        'safety',
      ],
      totalFindings: 6,
      evidenceLedgerId: 'lro_api_evidence_ledger',
      fixtureOnly: true,
      liveData: false,
    },
    evidence: {
      evidenceContractId: 'lro_api_evidence_contract',
      evidenceLedgerId: 'lro_api_evidence_ledger',
      severity: 'info',
      summaryText: 'Fixture evidence contract for local read-only API.',
      entryCount: 4,
      fixtureOnly: true,
      liveData: false,
    },
    safety: { safetyContractId: 'lro_api_safety_contract', fixtureOnly: true, liveData: false },
    fixtureOnly: true,
    liveData: false,
  });
  if (!result.ok) throw new Error(`Failed to build contracts fixture: ${result.message}`);
  return result.value;
}

export const LRO_API_CONTRACTS_BUNDLE = buildContractsFixture();

export const LRO_API_CONTRACTS_JSON = exportReadOnlyApiContractJson(LRO_API_CONTRACTS_BUNDLE);

export const LRO_API_CONTRACTS_OPENAPI_SHAPE = exportReadOnlyApiContractOpenApiShape(
  LRO_API_CONTRACTS_BUNDLE,
);

export const LRO_API_ALL_CONTRACT_FIXTURES = ALL_READ_ONLY_API_CONTRACT_FIXTURES;

// ─── Dashboard fixtures ────────────────────────────────────────────────────────

export const LRO_API_DASHBOARD_FIXTURES = ALL_DASHBOARD_READ_MODEL_FIXTURES;

/** The primary dashboard fixture (first clean fixture) */
export const LRO_API_PRIMARY_DASHBOARD_FIXTURE = LRO_API_DASHBOARD_FIXTURES[0];

// ─── Capabilities fixture ─────────────────────────────────────────────────────

export const LRO_API_CAPABILITIES = getLocalReadOnlyApiCapabilities();
