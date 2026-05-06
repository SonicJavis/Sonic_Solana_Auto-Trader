/**
 * Phase 19 — Local Read-Only API Contracts v1 tests.
 *
 * Covers:
 *   A. Package exports
 *   B. Capabilities — all unsafe fields false, fixtureOnly/analysisOnly/nonExecutable/readOnly/contractOnly true
 *   C. getReadOnlyApiCapabilities
 *   D. buildReadOnlyApiEndpointContracts
 *   E. buildReadOnlyApiRequestModel
 *   F. buildReadOnlyApiResponseEnvelope
 *   G. buildReadOnlyApiHealthContract
 *   H. buildReadOnlyDashboardContract
 *   I. buildReadOnlyEvidenceContract
 *   J. buildReadOnlySafetyContract
 *   K. buildReadOnlyApiContractBundle
 *   L. validateReadOnlyApiContractBundle
 *   M. JSON export — deterministic
 *   N. OpenAPI-like shape — deterministic and safe
 *   O. Safety invariants — rejection of liveData/fixtureOnly/safeToDisplay/analysisOnly/nonExecutable/readOnly/contractOnly
 *   P. Validation rejects unsafe action text, private-key strings, seed-phrase strings, API keys, RPC URLs
 *   Q. Validation rejects HTTP server/listener/port text
 *   R. No trade intents, execution plans, paper trades, orders, positions, PnL
 *   S. No live data, provider APIs, wallet/private key handling
 *   T. No transaction construction/simulation
 *   U. No UI rendering capability
 *   V. No API server, HTTP listener, framework, open port
 *   W. Fixtures — deterministic, fixture-only, safeToDisplay, analysisOnly, nonExecutable, readOnly, contractOnly
 *   X. Dependency checks — no @solana/web3.js etc in package.json
 *   Y. Phase 13/14/15/16/17/18 regression — imports still work
 *   Z. roacOk / roacErr helpers
 *   AA. validateReadOnlyApiCapabilities
 *   AB. validateReadOnlyApiHealthContract, validateReadOnlyDashboardContract, etc.
 *   AC. containsUnsafeActionText, containsSecretPattern, containsUrlPattern, containsServerPattern, isDisplaySafe
 *
 * No network, no Solana RPC, no WebSocket, no provider SDK, no API keys,
 * no wallet private key, no trade execution, no paper trading,
 * no HTTP server, no open port, no API framework.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import {
  // Capabilities
  getReadOnlyApiCapabilities,
  // Errors
  roacOk,
  roacErr,
  // Builders
  buildReadOnlyApiEndpointContracts,
  buildReadOnlyApiRequestModel,
  buildReadOnlyApiResponseEnvelope,
  buildReadOnlyApiHealthContract,
  buildReadOnlyDashboardContract,
  buildReadOnlyEvidenceContract,
  buildReadOnlySafetyContract,
  buildReadOnlyApiContractBundle,
  // Exports
  exportReadOnlyApiContractJson,
  exportReadOnlyApiContractOpenApiShape,
  // Validation
  validateReadOnlyApiCapabilities,
  validateReadOnlyApiHealthContract,
  validateReadOnlyDashboardContract,
  validateReadOnlyEvidenceContract,
  validateReadOnlySafetyContract,
  validateReadOnlyApiContractBundle,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  containsServerPattern,
  isDisplaySafe,
  // Fixtures
  CLEAN_READ_ONLY_API_CONTRACT_FIXTURE,
  DEGRADED_READ_ONLY_API_CONTRACT_FIXTURE,
  FAILED_READ_ONLY_API_CONTRACT_FIXTURE,
  INCONCLUSIVE_READ_ONLY_API_CONTRACT_FIXTURE,
  MIXED_READ_ONLY_API_CONTRACT_FIXTURE,
  REGRESSION_READ_ONLY_API_CONTRACT_FIXTURE,
  ALL_READ_ONLY_API_CONTRACT_FIXTURES,
} from '@sonic/read-only-api-contracts';

import type {
  ReadOnlyApiContractBundle,
  ReadOnlyApiEndpointContract,
  ReadOnlyApiContractFixture,
} from '@sonic/read-only-api-contracts';

// Phase 13–18 regression imports
import { getReplayLabCapabilities } from '@sonic/replay-lab';
import { getReplayReportingCapabilities } from '@sonic/replay-reporting';
import { getStrategyIntentCapabilities } from '@sonic/strategy-intent';
import { getStrategyEvaluationCapabilities } from '@sonic/strategy-evaluation';
import { getEvidenceLedgerCapabilities } from '@sonic/evidence-ledger';
import { getDashboardReadModelCapabilities } from '@sonic/dashboard-read-models';

// ─── Helper: build a minimal valid bundle ─────────────────────────────────────

function makeValidBundle(): ReadOnlyApiContractBundle {
  const result = buildReadOnlyApiContractBundle({
    bundleId: 'test_bundle',
    health: { healthId: 'test_health', fixtureOnly: true, liveData: false },
    dashboard: {
      dashboardContractId: 'test_dashboard',
      severity: 'info',
      summaryText: 'Fixture dashboard contract analysis.',
      panelsAvailable: ['replay_panel', 'safety_panel'],
      totalFindings: 2,
      evidenceLedgerId: 'test_evidence_ledger',
      fixtureOnly: true,
      liveData: false,
    },
    evidence: {
      evidenceContractId: 'test_evidence',
      evidenceLedgerId: 'test_evidence_ledger',
      severity: 'info',
      summaryText: 'Fixture evidence contract analysis.',
      entryCount: 2,
      fixtureOnly: true,
      liveData: false,
    },
    safety: { safetyContractId: 'test_safety', fixtureOnly: true, liveData: false },
    fixtureOnly: true,
    liveData: false,
  });
  if (!result.ok) throw new Error(`Failed to build test bundle: ${result.message}`);
  return result.value;
}

// ─── A. Package exports ───────────────────────────────────────────────────────

describe('A. Package exports', () => {
  it('exports getReadOnlyApiCapabilities as a function', () => {
    expect(typeof getReadOnlyApiCapabilities).toBe('function');
  });
  it('exports roacOk as a function', () => {
    expect(typeof roacOk).toBe('function');
  });
  it('exports roacErr as a function', () => {
    expect(typeof roacErr).toBe('function');
  });
  it('exports buildReadOnlyApiEndpointContracts as a function', () => {
    expect(typeof buildReadOnlyApiEndpointContracts).toBe('function');
  });
  it('exports buildReadOnlyApiRequestModel as a function', () => {
    expect(typeof buildReadOnlyApiRequestModel).toBe('function');
  });
  it('exports buildReadOnlyApiResponseEnvelope as a function', () => {
    expect(typeof buildReadOnlyApiResponseEnvelope).toBe('function');
  });
  it('exports buildReadOnlyApiHealthContract as a function', () => {
    expect(typeof buildReadOnlyApiHealthContract).toBe('function');
  });
  it('exports buildReadOnlyDashboardContract as a function', () => {
    expect(typeof buildReadOnlyDashboardContract).toBe('function');
  });
  it('exports buildReadOnlyEvidenceContract as a function', () => {
    expect(typeof buildReadOnlyEvidenceContract).toBe('function');
  });
  it('exports buildReadOnlySafetyContract as a function', () => {
    expect(typeof buildReadOnlySafetyContract).toBe('function');
  });
  it('exports buildReadOnlyApiContractBundle as a function', () => {
    expect(typeof buildReadOnlyApiContractBundle).toBe('function');
  });
  it('exports exportReadOnlyApiContractJson as a function', () => {
    expect(typeof exportReadOnlyApiContractJson).toBe('function');
  });
  it('exports exportReadOnlyApiContractOpenApiShape as a function', () => {
    expect(typeof exportReadOnlyApiContractOpenApiShape).toBe('function');
  });
  it('exports validateReadOnlyApiContractBundle as a function', () => {
    expect(typeof validateReadOnlyApiContractBundle).toBe('function');
  });
  it('exports validateReadOnlyApiCapabilities as a function', () => {
    expect(typeof validateReadOnlyApiCapabilities).toBe('function');
  });
  it('exports containsUnsafeActionText as a function', () => {
    expect(typeof containsUnsafeActionText).toBe('function');
  });
  it('exports containsSecretPattern as a function', () => {
    expect(typeof containsSecretPattern).toBe('function');
  });
  it('exports containsUrlPattern as a function', () => {
    expect(typeof containsUrlPattern).toBe('function');
  });
  it('exports containsServerPattern as a function', () => {
    expect(typeof containsServerPattern).toBe('function');
  });
  it('exports isDisplaySafe as a function', () => {
    expect(typeof isDisplaySafe).toBe('function');
  });
  it('exports CLEAN_READ_ONLY_API_CONTRACT_FIXTURE', () => {
    expect(CLEAN_READ_ONLY_API_CONTRACT_FIXTURE).toBeDefined();
  });
  it('exports ALL_READ_ONLY_API_CONTRACT_FIXTURES as an array', () => {
    expect(Array.isArray(ALL_READ_ONLY_API_CONTRACT_FIXTURES)).toBe(true);
  });
});

// ─── B. Capabilities — all unsafe false ──────────────────────────────────────

describe('B. Capabilities — all unsafe flags false', () => {
  const caps = getReadOnlyApiCapabilities();

  it('canUseLiveData is false', () => { expect(caps.canUseLiveData).toBe(false); });
  it('canUseSolanaRpc is false', () => { expect(caps.canUseSolanaRpc).toBe(false); });
  it('canUseProviderApis is false', () => { expect(caps.canUseProviderApis).toBe(false); });
  it('canAccessPrivateKeys is false', () => { expect(caps.canAccessPrivateKeys).toBe(false); });
  it('canCreateTradeIntents is false', () => { expect(caps.canCreateTradeIntents).toBe(false); });
  it('canCreateExecutionPlans is false', () => { expect(caps.canCreateExecutionPlans).toBe(false); });
  it('canPaperTrade is false', () => { expect(caps.canPaperTrade).toBe(false); });
  it('canTrade is false', () => { expect(caps.canTrade).toBe(false); });
  it('canExecute is false', () => { expect(caps.canExecute).toBe(false); });
  it('canWriteToDatabase is false', () => { expect(caps.canWriteToDatabase).toBe(false); });
  it('canSendTelegramAlerts is false', () => { expect(caps.canSendTelegramAlerts).toBe(false); });
  it('canConstructTransactions is false', () => { expect(caps.canConstructTransactions).toBe(false); });
  it('canSimulateTransactions is false', () => { expect(caps.canSimulateTransactions).toBe(false); });
  it('canCreateOrders is false', () => { expect(caps.canCreateOrders).toBe(false); });
  it('canCreatePositions is false', () => { expect(caps.canCreatePositions).toBe(false); });
  it('canCalculateLivePnl is false', () => { expect(caps.canCalculateLivePnl).toBe(false); });
  it('canMutatePriorEvidence is false', () => { expect(caps.canMutatePriorEvidence).toBe(false); });
  it('canRenderUi is false', () => { expect(caps.canRenderUi).toBe(false); });
  it('canStartHttpServer is false', () => { expect(caps.canStartHttpServer).toBe(false); });
  it('canOpenNetworkPort is false', () => { expect(caps.canOpenNetworkPort).toBe(false); });
  it('canUseApiFramework is false', () => { expect(caps.canUseApiFramework).toBe(false); });
  it('fixtureOnly is true', () => { expect(caps.fixtureOnly).toBe(true); });
  it('analysisOnly is true', () => { expect(caps.analysisOnly).toBe(true); });
  it('nonExecutable is true', () => { expect(caps.nonExecutable).toBe(true); });
  it('readOnly is true', () => { expect(caps.readOnly).toBe(true); });
  it('contractOnly is true', () => { expect(caps.contractOnly).toBe(true); });
});

// ─── C. getReadOnlyApiCapabilities ───────────────────────────────────────────

describe('C. getReadOnlyApiCapabilities', () => {
  it('returns a new object each call', () => {
    const a = getReadOnlyApiCapabilities();
    const b = getReadOnlyApiCapabilities();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('is deterministic across calls', () => {
    const caps1 = getReadOnlyApiCapabilities();
    const caps2 = getReadOnlyApiCapabilities();
    expect(JSON.stringify(caps1)).toBe(JSON.stringify(caps2));
  });
});

// ─── D. buildReadOnlyApiEndpointContracts ─────────────────────────────────────

describe('D. buildReadOnlyApiEndpointContracts', () => {
  const contracts = buildReadOnlyApiEndpointContracts();

  it('returns an array', () => {
    expect(Array.isArray(contracts)).toBe(true);
  });

  it('returns 9 endpoint contracts', () => {
    expect(contracts.length).toBe(9);
  });

  it('all contracts have method GET', () => {
    for (const c of contracts) {
      expect(c.method).toBe('GET');
    }
  });

  it('all contracts have fixtureOnly: true', () => {
    for (const c of contracts) {
      expect(c.fixtureOnly).toBe(true);
    }
  });

  it('all contracts have liveData: false', () => {
    for (const c of contracts) {
      expect(c.liveData).toBe(false);
    }
  });

  it('all contracts have safeToDisplay: true', () => {
    for (const c of contracts) {
      expect(c.safeToDisplay).toBe(true);
    }
  });

  it('all contracts have analysisOnly: true', () => {
    for (const c of contracts) {
      expect(c.analysisOnly).toBe(true);
    }
  });

  it('all contracts have nonExecutable: true', () => {
    for (const c of contracts) {
      expect(c.nonExecutable).toBe(true);
    }
  });

  it('all contracts have readOnly: true', () => {
    for (const c of contracts) {
      expect(c.readOnly).toBe(true);
    }
  });

  it('all contracts have contractOnly: true', () => {
    for (const c of contracts) {
      expect(c.contractOnly).toBe(true);
    }
  });

  it('includes health endpoint', () => {
    expect(contracts.some(c => c.endpointId === 'health')).toBe(true);
  });

  it('includes capabilities endpoint', () => {
    expect(contracts.some(c => c.endpointId === 'capabilities')).toBe(true);
  });

  it('includes dashboard_overview endpoint', () => {
    expect(contracts.some(c => c.endpointId === 'dashboard_overview')).toBe(true);
  });

  it('includes evidence_panel endpoint', () => {
    expect(contracts.some(c => c.endpointId === 'evidence_panel')).toBe(true);
  });

  it('includes safety_panel endpoint', () => {
    expect(contracts.some(c => c.endpointId === 'safety_panel')).toBe(true);
  });

  it('is deterministic across calls', () => {
    const c1 = buildReadOnlyApiEndpointContracts();
    const c2 = buildReadOnlyApiEndpointContracts();
    expect(JSON.stringify(c1)).toBe(JSON.stringify(c2));
  });

  it('no endpoint contracts have HTTP handlers or routers (no runtime implementation)', () => {
    // Contracts are plain objects — no functions attached
    for (const c of contracts) {
      const keys = Object.keys(c) as (keyof ReadOnlyApiEndpointContract)[];
      for (const k of keys) {
        expect(typeof c[k]).not.toBe('function');
      }
    }
  });
});

// ─── E. buildReadOnlyApiRequestModel ─────────────────────────────────────────

describe('E. buildReadOnlyApiRequestModel', () => {
  it('builds a valid request model', () => {
    const model = buildReadOnlyApiRequestModel('health');
    expect(model.endpointId).toBe('health');
    expect(model.fixtureOnly).toBe(true);
    expect(model.liveData).toBe(false);
    expect(model.safeToDisplay).toBe(true);
    expect(model.analysisOnly).toBe(true);
    expect(model.nonExecutable).toBe(true);
    expect(model.readOnly).toBe(true);
    expect(model.contractOnly).toBe(true);
  });

  it('includes queryParams', () => {
    const model = buildReadOnlyApiRequestModel('evidence_panel', { limit: '10' });
    expect(model.queryParams).toEqual({ limit: '10' });
  });

  it('defaults to empty queryParams', () => {
    const model = buildReadOnlyApiRequestModel('capabilities');
    expect(model.queryParams).toEqual({});
  });
});

// ─── F. buildReadOnlyApiResponseEnvelope ─────────────────────────────────────

describe('F. buildReadOnlyApiResponseEnvelope', () => {
  it('builds ok envelope', () => {
    const env = buildReadOnlyApiResponseEnvelope({
      envelopeId: 'env_1',
      status: 'ok',
      data: { result: 'fixture' },
    });
    expect(env.status).toBe('ok');
    expect(env.fixtureOnly).toBe(true);
    expect(env.liveData).toBe(false);
    expect(env.safeToDisplay).toBe(true);
    expect(env.analysisOnly).toBe(true);
    expect(env.nonExecutable).toBe(true);
    expect(env.readOnly).toBe(true);
    expect(env.contractOnly).toBe(true);
  });

  it('builds failed envelope', () => {
    const env = buildReadOnlyApiResponseEnvelope({
      envelopeId: 'env_2',
      status: 'failed',
      data: null,
      errors: [{ code: 'LIVE_DATA_FORBIDDEN', message: 'live data not allowed' }],
    });
    expect(env.status).toBe('failed');
    expect(env.errors).toHaveLength(1);
    expect(env.errors[0]?.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('includes warnings', () => {
    const env = buildReadOnlyApiResponseEnvelope({
      envelopeId: 'env_3',
      status: 'degraded',
      data: null,
      warnings: ['fixture warning'],
    });
    expect(env.warnings).toContain('fixture warning');
  });

  it('metadata has contractVersion', () => {
    const env = buildReadOnlyApiResponseEnvelope({ envelopeId: 'env_4', status: 'ok', data: null });
    expect(env.metadata.contractVersion).toBeDefined();
    expect(typeof env.metadata.contractVersion).toBe('string');
  });

  it('metadata has fixtureOnly: true', () => {
    const env = buildReadOnlyApiResponseEnvelope({ envelopeId: 'env_5', status: 'ok', data: null });
    expect(env.metadata.fixtureOnly).toBe(true);
    expect(env.metadata.analysisOnly).toBe(true);
    expect(env.metadata.nonExecutable).toBe(true);
    expect(env.metadata.readOnly).toBe(true);
    expect(env.metadata.contractOnly).toBe(true);
  });

  it('errors have fixtureOnly and safeToDisplay', () => {
    const env = buildReadOnlyApiResponseEnvelope({
      envelopeId: 'env_6',
      status: 'failed',
      data: null,
      errors: [{ code: 'FIXTURE_ONLY_REQUIRED', message: 'fixture only' }],
    });
    expect(env.errors[0]?.fixtureOnly).toBe(true);
    expect(env.errors[0]?.safeToDisplay).toBe(true);
  });
});

// ─── G. buildReadOnlyApiHealthContract ───────────────────────────────────────

describe('G. buildReadOnlyApiHealthContract', () => {
  it('builds a valid health contract', () => {
    const result = buildReadOnlyApiHealthContract({
      healthId: 'test_health',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.fixtureOnly).toBe(true);
    expect(result.value.liveData).toBe(false);
    expect(result.value.safeToDisplay).toBe(true);
    expect(result.value.analysisOnly).toBe(true);
    expect(result.value.nonExecutable).toBe(true);
    expect(result.value.readOnly).toBe(true);
    expect(result.value.contractOnly).toBe(true);
  });

  it('health status is fixture_only or contract_only', () => {
    const result = buildReadOnlyApiHealthContract({
      healthId: 'h1',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(['fixture_only', 'contract_only']).toContain(result.value.status);
  });

  it('capabilities in health contract have all unsafe flags false', () => {
    const result = buildReadOnlyApiHealthContract({
      healthId: 'h2',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.capabilities.canTrade).toBe(false);
    expect(result.value.capabilities.canStartHttpServer).toBe(false);
    expect(result.value.capabilities.canOpenNetworkPort).toBe(false);
    expect(result.value.capabilities.canUseApiFramework).toBe(false);
  });

  it('health message does not contain unsafe patterns', () => {
    const result = buildReadOnlyApiHealthContract({
      healthId: 'h3',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(isDisplaySafe(result.value.message)).toBe(true);
  });
});

// ─── H. buildReadOnlyDashboardContract ───────────────────────────────────────

describe('H. buildReadOnlyDashboardContract', () => {
  it('builds a valid dashboard contract', () => {
    const result = buildReadOnlyDashboardContract({
      dashboardContractId: 'dash_1',
      severity: 'info',
      summaryText: 'Fixture dashboard analysis complete.',
      panelsAvailable: ['replay_panel', 'safety_panel'],
      totalFindings: 2,
      evidenceLedgerId: 'evidence_001',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.fixtureOnly).toBe(true);
    expect(result.value.liveData).toBe(false);
    expect(result.value.safeToDisplay).toBe(true);
    expect(result.value.analysisOnly).toBe(true);
    expect(result.value.nonExecutable).toBe(true);
    expect(result.value.readOnly).toBe(true);
    expect(result.value.contractOnly).toBe(true);
  });

  it('rejects negative totalFindings', () => {
    const result = buildReadOnlyDashboardContract({
      dashboardContractId: 'dash_err',
      severity: 'info',
      summaryText: 'test',
      panelsAvailable: [],
      totalFindings: -1,
      evidenceLedgerId: 'e1',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(false);
  });

  it('sorts panelsAvailable deterministically', () => {
    const result = buildReadOnlyDashboardContract({
      dashboardContractId: 'dash_sort',
      severity: 'info',
      summaryText: 'test',
      panelsAvailable: ['z_panel', 'a_panel', 'm_panel'],
      totalFindings: 0,
      evidenceLedgerId: 'e1',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.panelsAvailable).toEqual(['a_panel', 'm_panel', 'z_panel']);
  });
});

// ─── I. buildReadOnlyEvidenceContract ────────────────────────────────────────

describe('I. buildReadOnlyEvidenceContract', () => {
  it('builds a valid evidence contract', () => {
    const result = buildReadOnlyEvidenceContract({
      evidenceContractId: 'ev_1',
      evidenceLedgerId: 'ledger_001',
      severity: 'info',
      summaryText: 'Fixture evidence analysis.',
      entryCount: 5,
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.fixtureOnly).toBe(true);
    expect(result.value.liveData).toBe(false);
    expect(result.value.safeToDisplay).toBe(true);
    expect(result.value.analysisOnly).toBe(true);
    expect(result.value.nonExecutable).toBe(true);
    expect(result.value.readOnly).toBe(true);
    expect(result.value.contractOnly).toBe(true);
  });

  it('rejects negative entryCount', () => {
    const result = buildReadOnlyEvidenceContract({
      evidenceContractId: 'ev_err',
      evidenceLedgerId: 'ledger_001',
      severity: 'info',
      summaryText: 'test',
      entryCount: -1,
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(false);
  });
});

// ─── J. buildReadOnlySafetyContract ──────────────────────────────────────────

describe('J. buildReadOnlySafetyContract', () => {
  it('builds a valid safety contract', () => {
    const result = buildReadOnlySafetyContract({
      safetyContractId: 'safety_1',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.fixtureOnly).toBe(true);
    expect(result.value.liveData).toBe(false);
    expect(result.value.safeToDisplay).toBe(true);
    expect(result.value.analysisOnly).toBe(true);
    expect(result.value.nonExecutable).toBe(true);
    expect(result.value.readOnly).toBe(true);
    expect(result.value.contractOnly).toBe(true);
    expect(result.value.safetyInvariantsSatisfied).toBe(true);
  });

  it('has all unsafe capabilities false', () => {
    const result = buildReadOnlySafetyContract({
      safetyContractId: 'safety_2',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const caps = result.value.capabilities;
    expect(caps.canTrade).toBe(false);
    expect(caps.canExecute).toBe(false);
    expect(caps.canStartHttpServer).toBe(false);
    expect(caps.canOpenNetworkPort).toBe(false);
    expect(caps.canUseApiFramework).toBe(false);
    expect(caps.canCreateTradeIntents).toBe(false);
    expect(caps.canCreateExecutionPlans).toBe(false);
  });

  it('lockedCapabilityNames is sorted', () => {
    const result = buildReadOnlySafetyContract({
      safetyContractId: 'safety_3',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const names = result.value.lockedCapabilityNames;
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  it('includes canStartHttpServer in lockedCapabilityNames', () => {
    const result = buildReadOnlySafetyContract({
      safetyContractId: 'safety_4',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.lockedCapabilityNames).toContain('canStartHttpServer');
    expect(result.value.lockedCapabilityNames).toContain('canOpenNetworkPort');
    expect(result.value.lockedCapabilityNames).toContain('canUseApiFramework');
  });
});

// ─── K. buildReadOnlyApiContractBundle ───────────────────────────────────────

describe('K. buildReadOnlyApiContractBundle', () => {
  it('builds a valid bundle', () => {
    const bundle = makeValidBundle();
    expect(bundle.fixtureOnly).toBe(true);
    expect(bundle.liveData).toBe(false);
    expect(bundle.safeToDisplay).toBe(true);
    expect(bundle.analysisOnly).toBe(true);
    expect(bundle.nonExecutable).toBe(true);
    expect(bundle.readOnly).toBe(true);
    expect(bundle.contractOnly).toBe(true);
  });

  it('bundle contains endpointContracts', () => {
    const bundle = makeValidBundle();
    expect(Array.isArray(bundle.endpointContracts)).toBe(true);
    expect(bundle.endpointContracts.length).toBeGreaterThan(0);
  });

  it('bundle contains healthContract', () => {
    const bundle = makeValidBundle();
    expect(bundle.healthContract).toBeDefined();
    expect(bundle.healthContract.healthId).toBe('test_health');
  });

  it('bundle contains dashboardContract', () => {
    const bundle = makeValidBundle();
    expect(bundle.dashboardContract).toBeDefined();
  });

  it('bundle contains evidenceContract', () => {
    const bundle = makeValidBundle();
    expect(bundle.evidenceContract).toBeDefined();
  });

  it('bundle contains safetyContract', () => {
    const bundle = makeValidBundle();
    expect(bundle.safetyContract).toBeDefined();
    expect(bundle.safetyContract.safetyInvariantsSatisfied).toBe(true);
  });

  it('rejects when fixtureOnly is not true', () => {
    const result = buildReadOnlyApiContractBundle({
      bundleId: 'b1',
      // @ts-expect-error testing invalid input
      fixtureOnly: false,
      liveData: false,
      health: { healthId: 'h', fixtureOnly: true, liveData: false },
      dashboard: {
        dashboardContractId: 'd',
        severity: 'info',
        summaryText: 'test',
        panelsAvailable: [],
        totalFindings: 0,
        evidenceLedgerId: 'e',
        fixtureOnly: true,
        liveData: false,
      },
      evidence: {
        evidenceContractId: 'ev',
        evidenceLedgerId: 'e',
        severity: 'info',
        summaryText: 'test',
        entryCount: 0,
        fixtureOnly: true,
        liveData: false,
      },
      safety: { safetyContractId: 's', fixtureOnly: true, liveData: false },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('rejects when liveData is not false', () => {
    const result = buildReadOnlyApiContractBundle({
      bundleId: 'b2',
      fixtureOnly: true,
      // @ts-expect-error testing invalid input
      liveData: true,
      health: { healthId: 'h', fixtureOnly: true, liveData: false },
      dashboard: {
        dashboardContractId: 'd',
        severity: 'info',
        summaryText: 'test',
        panelsAvailable: [],
        totalFindings: 0,
        evidenceLedgerId: 'e',
        fixtureOnly: true,
        liveData: false,
      },
      evidence: {
        evidenceContractId: 'ev',
        evidenceLedgerId: 'e',
        severity: 'info',
        summaryText: 'test',
        entryCount: 0,
        fixtureOnly: true,
        liveData: false,
      },
      safety: { safetyContractId: 's', fixtureOnly: true, liveData: false },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });
});

// ─── L. validateReadOnlyApiContractBundle ────────────────────────────────────

describe('L. validateReadOnlyApiContractBundle', () => {
  it('validates a clean bundle successfully', () => {
    const bundle = makeValidBundle();
    const result = validateReadOnlyApiContractBundle(bundle);
    expect(result.ok).toBe(true);
  });

  it('rejects bundle with fixtureOnly=false', () => {
    const bundle = makeValidBundle();
    const bad = { ...bundle, fixtureOnly: false as unknown as true };
    const result = validateReadOnlyApiContractBundle(bad);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('FIXTURE_ONLY_REQUIRED');
  });

  it('rejects bundle with liveData=true', () => {
    const bundle = makeValidBundle();
    const bad = { ...bundle, liveData: true as unknown as false };
    const result = validateReadOnlyApiContractBundle(bad);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('rejects bundle with safeToDisplay=false', () => {
    const bundle = makeValidBundle();
    const bad = { ...bundle, safeToDisplay: false as unknown as true };
    const result = validateReadOnlyApiContractBundle(bad);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('SAFE_TO_DISPLAY_REQUIRED');
  });

  it('rejects bundle with analysisOnly=false', () => {
    const bundle = makeValidBundle();
    const bad = { ...bundle, analysisOnly: false as unknown as true };
    const result = validateReadOnlyApiContractBundle(bad);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('ANALYSIS_ONLY_REQUIRED');
  });

  it('rejects bundle with nonExecutable=false', () => {
    const bundle = makeValidBundle();
    const bad = { ...bundle, nonExecutable: false as unknown as true };
    const result = validateReadOnlyApiContractBundle(bad);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('NON_EXECUTABLE_REQUIRED');
  });

  it('rejects bundle with readOnly=false', () => {
    const bundle = makeValidBundle();
    const bad = { ...bundle, readOnly: false as unknown as true };
    const result = validateReadOnlyApiContractBundle(bad);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('READ_ONLY_REQUIRED');
  });

  it('rejects bundle with contractOnly=false', () => {
    const bundle = makeValidBundle();
    const bad = { ...bundle, contractOnly: false as unknown as true };
    const result = validateReadOnlyApiContractBundle(bad);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('CONTRACT_ONLY_REQUIRED');
  });
});

// ─── M. JSON export — deterministic ──────────────────────────────────────────

describe('M. JSON export — deterministic', () => {
  it('produces a JSON-safe export', () => {
    const bundle = makeValidBundle();
    const exported = exportReadOnlyApiContractJson(bundle);
    expect(exported.exportKind).toBe('read_only_api_contract_export');
    expect(exported.fixtureOnly).toBe(true);
    expect(exported.liveData).toBe(false);
    expect(exported.safeToDisplay).toBe(true);
    expect(exported.analysisOnly).toBe(true);
    expect(exported.nonExecutable).toBe(true);
    expect(exported.readOnly).toBe(true);
    expect(exported.contractOnly).toBe(true);
  });

  it('JSON export is deterministic across calls', () => {
    const bundle = makeValidBundle();
    const e1 = exportReadOnlyApiContractJson(bundle);
    const e2 = exportReadOnlyApiContractJson(bundle);
    expect(JSON.stringify(e1)).toBe(JSON.stringify(e2));
  });

  it('JSON.stringify produces valid JSON', () => {
    const bundle = makeValidBundle();
    const exported = exportReadOnlyApiContractJson(bundle);
    const json = JSON.stringify(exported);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('export bundle has all safety flags', () => {
    const bundle = makeValidBundle();
    const exported = exportReadOnlyApiContractJson(bundle);
    expect(exported.bundle.fixtureOnly).toBe(true);
    expect(exported.bundle.liveData).toBe(false);
    expect(exported.bundle.contractOnly).toBe(true);
  });
});

// ─── N. OpenAPI-like shape — deterministic and safe ──────────────────────────

describe('N. OpenAPI-like shape — deterministic and safe', () => {
  it('produces an OpenAPI-like shape', () => {
    const bundle = makeValidBundle();
    const shape = exportReadOnlyApiContractOpenApiShape(bundle);
    expect(shape.fixtureOnly).toBe(true);
    expect(shape.liveData).toBe(false);
    expect(shape.safeToDisplay).toBe(true);
    expect(shape.analysisOnly).toBe(true);
    expect(shape.nonExecutable).toBe(true);
    expect(shape.readOnly).toBe(true);
    expect(shape.contractOnly).toBe(true);
  });

  it('OpenAPI shape is deterministic across calls', () => {
    const bundle = makeValidBundle();
    const s1 = exportReadOnlyApiContractOpenApiShape(bundle);
    const s2 = exportReadOnlyApiContractOpenApiShape(bundle);
    expect(JSON.stringify(s1)).toBe(JSON.stringify(s2));
  });

  it('OpenAPI shape paths are sorted', () => {
    const bundle = makeValidBundle();
    const shape = exportReadOnlyApiContractOpenApiShape(bundle);
    const keys = Object.keys(shape.paths);
    expect(keys).toEqual([...keys].sort());
  });

  it('all path operations have contractOnly: true', () => {
    const bundle = makeValidBundle();
    const shape = exportReadOnlyApiContractOpenApiShape(bundle);
    for (const path of Object.values(shape.paths)) {
      expect(path.get.contractOnly).toBe(true);
      expect(path.get.nonExecutable).toBe(true);
      expect(path.get.readOnly).toBe(true);
    }
  });

  it('title mentions Phase 19 contracts', () => {
    const bundle = makeValidBundle();
    const shape = exportReadOnlyApiContractOpenApiShape(bundle);
    expect(shape.title).toContain('Phase 19');
  });

  it('note mentions FUTURE ONLY', () => {
    const bundle = makeValidBundle();
    const shape = exportReadOnlyApiContractOpenApiShape(bundle);
    expect(shape.note.toLowerCase()).toContain('future');
  });

  it('no real server URLs in description', () => {
    const bundle = makeValidBundle();
    const shape = exportReadOnlyApiContractOpenApiShape(bundle);
    expect(shape.description.toLowerCase()).not.toContain('localhost');
    expect(isDisplaySafe(shape.description)).toBe(true);
  });
});

// ─── O. Safety invariants — rejection tests ───────────────────────────────────

describe('O. Safety invariants — rejection of invalid fields', () => {
  it('health contract rejects fixtureOnly=false', () => {
    // @ts-expect-error testing invalid input
    const result = buildReadOnlyApiHealthContract({ healthId: 'h', fixtureOnly: false, liveData: false });
    expect(result.ok).toBe(false);
  });

  it('health contract rejects liveData=true', () => {
    // @ts-expect-error testing invalid input
    const result = buildReadOnlyApiHealthContract({ healthId: 'h', fixtureOnly: true, liveData: true });
    expect(result.ok).toBe(false);
  });

  it('dashboard contract rejects fixtureOnly=false', () => {
    const result = buildReadOnlyDashboardContract({
      dashboardContractId: 'd',
      severity: 'info',
      summaryText: 'test',
      panelsAvailable: [],
      totalFindings: 0,
      evidenceLedgerId: 'e',
      // @ts-expect-error testing invalid input
      fixtureOnly: false,
      liveData: false,
    });
    expect(result.ok).toBe(false);
  });

  it('evidence contract rejects liveData=true', () => {
    const result = buildReadOnlyEvidenceContract({
      evidenceContractId: 'ev',
      evidenceLedgerId: 'el',
      severity: 'info',
      summaryText: 'test',
      entryCount: 0,
      fixtureOnly: true,
      // @ts-expect-error testing invalid input
      liveData: true,
    });
    expect(result.ok).toBe(false);
  });

  it('safety contract rejects fixtureOnly=false', () => {
    // @ts-expect-error testing invalid input
    const result = buildReadOnlySafetyContract({ safetyContractId: 's', fixtureOnly: false, liveData: false });
    expect(result.ok).toBe(false);
  });

  it('validateReadOnlyDashboardContract rejects safeToDisplay=false', () => {
    const result = buildReadOnlyDashboardContract({
      dashboardContractId: 'd',
      severity: 'info',
      summaryText: 'test',
      panelsAvailable: [],
      totalFindings: 0,
      evidenceLedgerId: 'e',
      fixtureOnly: true,
      liveData: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const bad = { ...result.value, safeToDisplay: false as unknown as true };
    const v = validateReadOnlyDashboardContract(bad);
    expect(v.ok).toBe(false);
  });

  it('validateReadOnlyEvidenceContract rejects nonExecutable=false', () => {
    const r = buildReadOnlyEvidenceContract({
      evidenceContractId: 'ev',
      evidenceLedgerId: 'el',
      severity: 'info',
      summaryText: 'test',
      entryCount: 1,
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const bad = { ...r.value, nonExecutable: false as unknown as true };
    const v = validateReadOnlyEvidenceContract(bad);
    expect(v.ok).toBe(false);
  });

  it('validateReadOnlySafetyContract rejects contractOnly=false', () => {
    const r = buildReadOnlySafetyContract({
      safetyContractId: 's',
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const bad = { ...r.value, contractOnly: false as unknown as true };
    const v = validateReadOnlySafetyContract(bad);
    expect(v.ok).toBe(false);
  });
});

// ─── P. Validation rejects unsafe text ───────────────────────────────────────

describe('P. Validation rejects unsafe action text, secrets, URLs', () => {
  it('containsUnsafeActionText detects "buy"', () => {
    expect(containsUnsafeActionText('ready to buy some tokens')).toBe(true);
  });
  it('containsUnsafeActionText detects "sell"', () => {
    expect(containsUnsafeActionText('signal to sell')).toBe(true);
  });
  it('containsUnsafeActionText detects "execute"', () => {
    expect(containsUnsafeActionText('ready to execute trade')).toBe(true);
  });
  it('containsUnsafeActionText detects "snipe"', () => {
    expect(containsUnsafeActionText('snipe entry point')).toBe(true);
  });
  it('containsUnsafeActionText detects "full auto"', () => {
    expect(containsUnsafeActionText('running in full auto mode')).toBe(true);
  });
  it('containsUnsafeActionText does NOT flag safe analysis text', () => {
    expect(containsUnsafeActionText('fixture analysis complete, no anomalies')).toBe(false);
  });

  it('containsSecretPattern detects private_key', () => {
    expect(containsSecretPattern('this is my private_key value')).toBe(true);
  });
  it('containsSecretPattern detects seed phrase', () => {
    expect(containsSecretPattern('my seed phrase is secret')).toBe(true);
  });
  it('containsSecretPattern detects api_key', () => {
    expect(containsSecretPattern('send api_key in header')).toBe(true);
  });
  it('containsSecretPattern detects mnemonic', () => {
    expect(containsSecretPattern('wallet mnemonic words')).toBe(true);
  });
  it('containsSecretPattern does NOT flag safe text', () => {
    expect(containsSecretPattern('fixture analysis result info')).toBe(false);
  });

  it('containsUrlPattern detects wss://', () => {
    expect(containsUrlPattern('connect to wss://stream')).toBe(true);
  });
  it('containsUrlPattern detects mainnet-beta.solana.com', () => {
    expect(containsUrlPattern('using mainnet-beta.solana.com rpc')).toBe(true);
  });
  it('containsUrlPattern detects helius.dev', () => {
    expect(containsUrlPattern('helius.dev api endpoint')).toBe(true);
  });
  it('containsUrlPattern does NOT flag safe text', () => {
    expect(containsUrlPattern('fixture analysis panel data')).toBe(false);
  });
});

// ─── Q. Validation rejects HTTP server/listener/port text ────────────────────

describe('Q. Validation rejects HTTP server/listener/port text', () => {
  it('containsServerPattern detects "http listener"', () => {
    expect(containsServerPattern('starting http listener on port 3000')).toBe(true);
  });
  it('containsServerPattern detects "open port"', () => {
    expect(containsServerPattern('will open port 8080')).toBe(true);
  });
  it('containsServerPattern detects "start server"', () => {
    expect(containsServerPattern('start server command')).toBe(true);
  });
  it('containsServerPattern detects "api router"', () => {
    expect(containsServerPattern('configure api router middleware')).toBe(true);
  });
  it('containsServerPattern detects "fastify("', () => {
    expect(containsServerPattern('fastify() app instance')).toBe(true);
  });
  it('containsServerPattern does NOT flag safe analysis text', () => {
    expect(containsServerPattern('fixture contract analysis complete')).toBe(false);
  });

  it('isDisplaySafe returns false for server text', () => {
    expect(isDisplaySafe('start server now')).toBe(false);
  });

  it('isDisplaySafe returns true for safe fixture text', () => {
    expect(isDisplaySafe('fixture contract analysis result')).toBe(true);
  });
});

// ─── R. No trade intents / execution plans ────────────────────────────────────

describe('R. No trade intents, execution plans, paper trades, orders, positions, PnL', () => {
  it('capabilities.canCreateTradeIntents is false', () => {
    expect(getReadOnlyApiCapabilities().canCreateTradeIntents).toBe(false);
  });
  it('capabilities.canCreateExecutionPlans is false', () => {
    expect(getReadOnlyApiCapabilities().canCreateExecutionPlans).toBe(false);
  });
  it('capabilities.canPaperTrade is false', () => {
    expect(getReadOnlyApiCapabilities().canPaperTrade).toBe(false);
  });
  it('capabilities.canCreateOrders is false', () => {
    expect(getReadOnlyApiCapabilities().canCreateOrders).toBe(false);
  });
  it('capabilities.canCreatePositions is false', () => {
    expect(getReadOnlyApiCapabilities().canCreatePositions).toBe(false);
  });
  it('capabilities.canCalculateLivePnl is false', () => {
    expect(getReadOnlyApiCapabilities().canCalculateLivePnl).toBe(false);
  });
  it('capabilities.canTrade is false', () => {
    expect(getReadOnlyApiCapabilities().canTrade).toBe(false);
  });
  it('capabilities.canExecute is false', () => {
    expect(getReadOnlyApiCapabilities().canExecute).toBe(false);
  });
});

// ─── S. No live data / provider APIs ──────────────────────────────────────────

describe('S. No live data, provider APIs, wallet/private key handling', () => {
  it('capabilities.canUseLiveData is false', () => {
    expect(getReadOnlyApiCapabilities().canUseLiveData).toBe(false);
  });
  it('capabilities.canUseSolanaRpc is false', () => {
    expect(getReadOnlyApiCapabilities().canUseSolanaRpc).toBe(false);
  });
  it('capabilities.canUseProviderApis is false', () => {
    expect(getReadOnlyApiCapabilities().canUseProviderApis).toBe(false);
  });
  it('capabilities.canAccessPrivateKeys is false', () => {
    expect(getReadOnlyApiCapabilities().canAccessPrivateKeys).toBe(false);
  });
  it('capabilities.canMutatePriorEvidence is false', () => {
    expect(getReadOnlyApiCapabilities().canMutatePriorEvidence).toBe(false);
  });
  it('capabilities.canWriteToDatabase is false', () => {
    expect(getReadOnlyApiCapabilities().canWriteToDatabase).toBe(false);
  });
});

// ─── T. No transaction construction/simulation ────────────────────────────────

describe('T. No transaction construction/simulation', () => {
  it('capabilities.canConstructTransactions is false', () => {
    expect(getReadOnlyApiCapabilities().canConstructTransactions).toBe(false);
  });
  it('capabilities.canSimulateTransactions is false', () => {
    expect(getReadOnlyApiCapabilities().canSimulateTransactions).toBe(false);
  });
});

// ─── U. No UI rendering capability ───────────────────────────────────────────

describe('U. No UI rendering capability', () => {
  it('capabilities.canRenderUi is false', () => {
    expect(getReadOnlyApiCapabilities().canRenderUi).toBe(false);
  });
});

// ─── V. No API server / HTTP listener / framework / open port ─────────────────

describe('V. No API server, HTTP listener, framework, open port', () => {
  it('capabilities.canStartHttpServer is false', () => {
    expect(getReadOnlyApiCapabilities().canStartHttpServer).toBe(false);
  });
  it('capabilities.canOpenNetworkPort is false', () => {
    expect(getReadOnlyApiCapabilities().canOpenNetworkPort).toBe(false);
  });
  it('capabilities.canUseApiFramework is false', () => {
    expect(getReadOnlyApiCapabilities().canUseApiFramework).toBe(false);
  });
  it('package.json does not depend on fastify', () => {
    const pkgPath = resolve(process.cwd(), 'packages/read-only-api-contracts/package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
    const deps = { ...(pkg['dependencies'] ?? {}), ...(pkg['devDependencies'] ?? {}) } as Record<string, string>;
    expect(Object.keys(deps).some(k => k.toLowerCase().includes('fastify'))).toBe(false);
  });
  it('package.json does not depend on hono', () => {
    const pkgPath = resolve(process.cwd(), 'packages/read-only-api-contracts/package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
    const deps = { ...(pkg['dependencies'] ?? {}), ...(pkg['devDependencies'] ?? {}) } as Record<string, string>;
    expect(Object.keys(deps).some(k => k.toLowerCase().includes('hono'))).toBe(false);
  });
  it('package.json does not depend on trpc', () => {
    const pkgPath = resolve(process.cwd(), 'packages/read-only-api-contracts/package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
    const deps = { ...(pkg['dependencies'] ?? {}), ...(pkg['devDependencies'] ?? {}) } as Record<string, string>;
    expect(Object.keys(deps).some(k => k.toLowerCase().includes('trpc'))).toBe(false);
  });
  it('package.json does not depend on express', () => {
    const pkgPath = resolve(process.cwd(), 'packages/read-only-api-contracts/package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
    const deps = { ...(pkg['dependencies'] ?? {}), ...(pkg['devDependencies'] ?? {}) } as Record<string, string>;
    expect(Object.keys(deps).some(k => k.toLowerCase().includes('express'))).toBe(false);
  });
  it('package.json does not depend on @solana/web3.js', () => {
    const pkgPath = resolve(process.cwd(), 'packages/read-only-api-contracts/package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
    const deps = { ...(pkg['dependencies'] ?? {}), ...(pkg['devDependencies'] ?? {}) } as Record<string, string>;
    expect(Object.keys(deps).some(k => k.includes('@solana/web3.js'))).toBe(false);
  });
});

// ─── W. Fixtures ──────────────────────────────────────────────────────────────

describe('W. Fixtures — deterministic, fixture-only, all safety flags', () => {
  const fixtures: ReadOnlyApiContractFixture[] = [
    CLEAN_READ_ONLY_API_CONTRACT_FIXTURE,
    DEGRADED_READ_ONLY_API_CONTRACT_FIXTURE,
    FAILED_READ_ONLY_API_CONTRACT_FIXTURE,
    INCONCLUSIVE_READ_ONLY_API_CONTRACT_FIXTURE,
    MIXED_READ_ONLY_API_CONTRACT_FIXTURE,
    REGRESSION_READ_ONLY_API_CONTRACT_FIXTURE,
  ];

  it('ALL_READ_ONLY_API_CONTRACT_FIXTURES has 6 entries', () => {
    expect(ALL_READ_ONLY_API_CONTRACT_FIXTURES.length).toBe(6);
  });

  it('all fixtures have fixtureOnly: true', () => {
    for (const f of fixtures) { expect(f.fixtureOnly).toBe(true); }
  });

  it('all fixtures have liveData: false', () => {
    for (const f of fixtures) { expect(f.liveData).toBe(false); }
  });

  it('all fixtures have safeToDisplay: true', () => {
    for (const f of fixtures) { expect(f.safeToDisplay).toBe(true); }
  });

  it('all fixtures have analysisOnly: true', () => {
    for (const f of fixtures) { expect(f.analysisOnly).toBe(true); }
  });

  it('all fixtures have nonExecutable: true', () => {
    for (const f of fixtures) { expect(f.nonExecutable).toBe(true); }
  });

  it('all fixtures have readOnly: true', () => {
    for (const f of fixtures) { expect(f.readOnly).toBe(true); }
  });

  it('all fixtures have contractOnly: true', () => {
    for (const f of fixtures) { expect(f.contractOnly).toBe(true); }
  });

  it('all fixtures have unique fixtureIds', () => {
    const ids = fixtures.map(f => f.fixtureId);
    expect(new Set(ids).size).toBe(fixtures.length);
  });

  it('clean fixture has fixtureId clean_read_only_api_contract_fixture', () => {
    expect(CLEAN_READ_ONLY_API_CONTRACT_FIXTURE.fixtureId).toBe(
      'clean_read_only_api_contract_fixture',
    );
  });

  it('degraded fixture has fixtureId degraded_read_only_api_contract_fixture', () => {
    expect(DEGRADED_READ_ONLY_API_CONTRACT_FIXTURE.fixtureId).toBe(
      'degraded_read_only_api_contract_fixture',
    );
  });

  it('failed fixture has fixtureId failed_read_only_api_contract_fixture', () => {
    expect(FAILED_READ_ONLY_API_CONTRACT_FIXTURE.fixtureId).toBe(
      'failed_read_only_api_contract_fixture',
    );
  });

  it('inconclusive fixture has fixtureId inconclusive_read_only_api_contract_fixture', () => {
    expect(INCONCLUSIVE_READ_ONLY_API_CONTRACT_FIXTURE.fixtureId).toBe(
      'inconclusive_read_only_api_contract_fixture',
    );
  });

  it('mixed fixture has fixtureId mixed_read_only_api_contract_fixture', () => {
    expect(MIXED_READ_ONLY_API_CONTRACT_FIXTURE.fixtureId).toBe(
      'mixed_read_only_api_contract_fixture',
    );
  });

  it('regression fixture has fixtureId regression_read_only_api_contract_fixture', () => {
    expect(REGRESSION_READ_ONLY_API_CONTRACT_FIXTURE.fixtureId).toBe(
      'regression_read_only_api_contract_fixture',
    );
  });

  it('fixture bundles pass validation', () => {
    for (const f of fixtures) {
      const result = validateReadOnlyApiContractBundle(f.bundle);
      expect(result.ok).toBe(true);
    }
  });

  it('ALL_READ_ONLY_API_CONTRACT_FIXTURES contains all 6 fixtures', () => {
    expect(ALL_READ_ONLY_API_CONTRACT_FIXTURES).toContain(CLEAN_READ_ONLY_API_CONTRACT_FIXTURE);
    expect(ALL_READ_ONLY_API_CONTRACT_FIXTURES).toContain(DEGRADED_READ_ONLY_API_CONTRACT_FIXTURE);
    expect(ALL_READ_ONLY_API_CONTRACT_FIXTURES).toContain(FAILED_READ_ONLY_API_CONTRACT_FIXTURE);
    expect(ALL_READ_ONLY_API_CONTRACT_FIXTURES).toContain(
      INCONCLUSIVE_READ_ONLY_API_CONTRACT_FIXTURE,
    );
    expect(ALL_READ_ONLY_API_CONTRACT_FIXTURES).toContain(MIXED_READ_ONLY_API_CONTRACT_FIXTURE);
    expect(ALL_READ_ONLY_API_CONTRACT_FIXTURES).toContain(
      REGRESSION_READ_ONLY_API_CONTRACT_FIXTURE,
    );
  });

  it('fixture JSON export is deterministic', () => {
    for (const f of fixtures) {
      const e1 = exportReadOnlyApiContractJson(f.bundle);
      const e2 = exportReadOnlyApiContractJson(f.bundle);
      expect(JSON.stringify(e1)).toBe(JSON.stringify(e2));
    }
  });
});

// ─── X. Dependency checks ─────────────────────────────────────────────────────

describe('X. Dependency checks', () => {
  it('no @solana/web3.js in package.json', () => {
    const pkgPath = resolve(process.cwd(), 'packages/read-only-api-contracts/package.json');
    const content = readFileSync(pkgPath, 'utf-8');
    expect(content.includes('@solana/web3.js')).toBe(false);
  });

  it('no helius in package.json', () => {
    const pkgPath = resolve(process.cwd(), 'packages/read-only-api-contracts/package.json');
    const content = readFileSync(pkgPath, 'utf-8');
    expect(content.toLowerCase().includes('helius')).toBe(false);
  });

  it('no yellowstone in package.json', () => {
    const pkgPath = resolve(process.cwd(), 'packages/read-only-api-contracts/package.json');
    const content = readFileSync(pkgPath, 'utf-8');
    expect(content.toLowerCase().includes('yellowstone')).toBe(false);
  });

  it('no jito in package.json', () => {
    const pkgPath = resolve(process.cwd(), 'packages/read-only-api-contracts/package.json');
    const content = readFileSync(pkgPath, 'utf-8');
    expect(content.toLowerCase().includes('jito')).toBe(false);
  });
});

// ─── Y. Phase 13–18 regression ───────────────────────────────────────────────

describe('Y. Phase 13/14/15/16/17/18 regression', () => {
  it('Phase 13 @sonic/replay-lab capabilities still work', () => {
    const caps = getReplayLabCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 14 @sonic/replay-reporting capabilities still work', () => {
    const caps = getReplayReportingCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 15 @sonic/strategy-intent capabilities still work', () => {
    const caps = getStrategyIntentCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 16 @sonic/strategy-evaluation capabilities still work', () => {
    const caps = getStrategyEvaluationCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 17 @sonic/evidence-ledger capabilities still work', () => {
    const caps = getEvidenceLedgerCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 18 @sonic/dashboard-read-models capabilities still work', () => {
    const caps = getDashboardReadModelCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
    expect(caps.canRenderUi).toBe(false);
  });
});

// ─── Z. roacOk / roacErr helpers ─────────────────────────────────────────────

describe('Z. roacOk / roacErr helpers', () => {
  it('roacOk wraps a value', () => {
    const r = roacOk('hello');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value).toBe('hello');
  });

  it('roacErr produces an error', () => {
    const e = roacErr('LIVE_DATA_FORBIDDEN', 'live data not allowed');
    expect(e.ok).toBe(false);
    expect(e.code).toBe('LIVE_DATA_FORBIDDEN');
    expect(e.message).toBe('live data not allowed');
  });

  it('roacOk with object value', () => {
    const r = roacOk({ x: 1 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value).toEqual({ x: 1 });
  });

  it('roacErr with CONTRACT_ONLY_REQUIRED code', () => {
    const e = roacErr('CONTRACT_ONLY_REQUIRED', 'contract only required');
    expect(e.code).toBe('CONTRACT_ONLY_REQUIRED');
  });
});

// ─── AA. validateReadOnlyApiCapabilities ─────────────────────────────────────

describe('AA. validateReadOnlyApiCapabilities', () => {
  it('validates good capabilities', () => {
    const caps = getReadOnlyApiCapabilities();
    const result = validateReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(true);
  });

  it('rejects canUseLiveData=true', () => {
    const caps = { ...getReadOnlyApiCapabilities(), canUseLiveData: true as unknown as false };
    const result = validateReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('rejects canTrade=true', () => {
    const caps = { ...getReadOnlyApiCapabilities(), canTrade: true as unknown as false };
    const result = validateReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
  });

  it('rejects canStartHttpServer=true', () => {
    const caps = { ...getReadOnlyApiCapabilities(), canStartHttpServer: true as unknown as false };
    const result = validateReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('HTTP_SERVER_FORBIDDEN');
  });

  it('rejects canOpenNetworkPort=true', () => {
    const caps = { ...getReadOnlyApiCapabilities(), canOpenNetworkPort: true as unknown as false };
    const result = validateReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('NETWORK_PORT_FORBIDDEN');
  });

  it('rejects canUseApiFramework=true', () => {
    const caps = { ...getReadOnlyApiCapabilities(), canUseApiFramework: true as unknown as false };
    const result = validateReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('API_FRAMEWORK_FORBIDDEN');
  });

  it('rejects fixtureOnly=false', () => {
    const caps = { ...getReadOnlyApiCapabilities(), fixtureOnly: false as unknown as true };
    const result = validateReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
  });

  it('rejects contractOnly=false', () => {
    const caps = { ...getReadOnlyApiCapabilities(), contractOnly: false as unknown as true };
    const result = validateReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('CONTRACT_ONLY_REQUIRED');
  });
});

// ─── AB. Validate sub-contracts ───────────────────────────────────────────────

describe('AB. validateReadOnlyApiHealthContract, validateReadOnlyDashboardContract, etc.', () => {
  it('validates a good health contract', () => {
    const r = buildReadOnlyApiHealthContract({ healthId: 'h', fixtureOnly: true, liveData: false });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const v = validateReadOnlyApiHealthContract(r.value);
    expect(v.ok).toBe(true);
  });

  it('validates a good dashboard contract', () => {
    const r = buildReadOnlyDashboardContract({
      dashboardContractId: 'd',
      severity: 'info',
      summaryText: 'Fixture dashboard analysis.',
      panelsAvailable: ['replay_panel'],
      totalFindings: 1,
      evidenceLedgerId: 'e1',
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const v = validateReadOnlyDashboardContract(r.value);
    expect(v.ok).toBe(true);
  });

  it('validates a good evidence contract', () => {
    const r = buildReadOnlyEvidenceContract({
      evidenceContractId: 'ev',
      evidenceLedgerId: 'el',
      severity: 'info',
      summaryText: 'Fixture evidence analysis.',
      entryCount: 3,
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const v = validateReadOnlyEvidenceContract(r.value);
    expect(v.ok).toBe(true);
  });

  it('validates a good safety contract', () => {
    const r = buildReadOnlySafetyContract({
      safetyContractId: 's',
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const v = validateReadOnlySafetyContract(r.value);
    expect(v.ok).toBe(true);
  });

  it('dashboard contract rejects summaryText with unsafe action text', () => {
    const r = buildReadOnlyDashboardContract({
      dashboardContractId: 'd',
      severity: 'info',
      summaryText: 'Fixture dashboard analysis.',
      panelsAvailable: [],
      totalFindings: 0,
      evidenceLedgerId: 'e1',
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const bad = { ...r.value, summaryText: 'ready to buy tokens' };
    const v = validateReadOnlyDashboardContract(bad);
    expect(v.ok).toBe(false);
    if (v.ok) return;
    expect(v.code).toBe('UNSAFE_ACTION_TEXT_DETECTED');
  });

  it('evidence contract rejects summaryText with secret-like pattern', () => {
    const r = buildReadOnlyEvidenceContract({
      evidenceContractId: 'ev',
      evidenceLedgerId: 'el',
      severity: 'info',
      summaryText: 'safe text',
      entryCount: 0,
      fixtureOnly: true,
      liveData: false,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const bad = { ...r.value, summaryText: 'contains api_key secret' };
    const v = validateReadOnlyEvidenceContract(bad);
    expect(v.ok).toBe(false);
    if (v.ok) return;
    expect(v.code).toBe('SECRET_PATTERN_DETECTED');
  });
});

// ─── AC. Text pattern helpers ─────────────────────────────────────────────────

describe('AC. containsUnsafeActionText, containsSecretPattern, containsUrlPattern, containsServerPattern, isDisplaySafe', () => {
  it('isDisplaySafe returns true for safe text', () => {
    expect(isDisplaySafe('Fixture analysis review complete.')).toBe(true);
  });
  it('isDisplaySafe returns false for buy text', () => {
    expect(isDisplaySafe('signal to buy token')).toBe(false);
  });
  it('isDisplaySafe returns false for private_key text', () => {
    expect(isDisplaySafe('private_key abc')).toBe(false);
  });
  it('isDisplaySafe returns false for wss:// text', () => {
    expect(isDisplaySafe('connect wss://stream.example')).toBe(false);
  });
  it('isDisplaySafe returns false for server text', () => {
    expect(isDisplaySafe('runtime handler started')).toBe(false);
  });
  it('containsUnsafeActionText case-insensitive', () => {
    expect(containsUnsafeActionText('BUY the token')).toBe(true);
    expect(containsUnsafeActionText('SELL signal')).toBe(true);
  });
  it('containsSecretPattern case-insensitive', () => {
    expect(containsSecretPattern('API_KEY=abc')).toBe(true);
    expect(containsSecretPattern('SEED_PHRASE=words')).toBe(true);
  });
  it('containsServerPattern case-insensitive', () => {
    expect(containsServerPattern('HTTP LISTENER active')).toBe(true);
  });
});
