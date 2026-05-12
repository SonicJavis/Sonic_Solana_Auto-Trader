/**
 * Phase 63 — Read-Only Provider Adapter Gate v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE,
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
  READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS,
  READ_ONLY_PROVIDER_GATE_POLICY_KINDS,
  READ_ONLY_PROVIDER_GATE_STATE_KINDS,
  READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES,
  READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURE_MAP,
  listReadOnlyProviderAdapterGateFixtures,
  getReadOnlyProviderAdapterGateFixture,
  buildReadOnlyProviderAdapterGateFixture,
  buildReadOnlyProviderGatePolicy,
  buildReadOnlyProviderGateState,
  buildReadOnlyProviderResolutionResult,
  buildReadOnlyProviderCapabilityCheck,
  buildReadOnlyProviderCompatibilityCheck,
  buildReadOnlyProviderGateReport,
  buildReadOnlyProviderAdapterGateViewModel,
  buildReadOnlyProviderAdapterGateApiContract,
  selectReadOnlyProviderAdapterGateFixture,
  validateReadOnlyProviderAdapterGateFixture,
  validateReadOnlyProviderAdapterGateSafety,
  normalizeReadOnlyProviderAdapterGateFixture,
  serializeReadOnlyProviderAdapterGateFixture,
  areReadOnlyProviderAdapterGateFixturesEqual,
  stableDeterministicReadOnlyProviderAdapterGateChecksum,
  getReadOnlyProviderAdapterGateCapabilities,
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION,
} from '../apps/dashboard/src/read-only-provider-adapter-gate/index.js';
import {
  READ_ONLY_PROVIDER_CONTRACT_NAMES,
} from '../apps/dashboard/src/read-only-provider-contracts/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES,
} from '../apps/dashboard/src/read-only-provider-adapter-mocks/index.js';
import {
  SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES,
} from '../apps/dashboard/src/synthetic-strategy-comparison-lab/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE as ROOT_PHASE,
  READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_63_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/read-only-provider-adapter-gate');
const PHASE_63_FILES = [
  'types.ts',
  'gate-policies.ts',
  'gate-state.ts',
  'provider-resolution.ts',
  'capability-checks.ts',
  'compatibility.ts',
  'builders.ts',
  'fixtures.ts',
  'reports.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 63 — source file existence', () => {
  for (const file of PHASE_63_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_63_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/READ_ONLY_PROVIDER_ADAPTER_GATE.md exists', () => {
    const content = readFileSync(
      resolve(REPO_ROOT, 'docs/READ_ONLY_PROVIDER_ADAPTER_GATE.md'),
      'utf-8',
    );
    expect(content.length).toBeGreaterThan(0);
    expect(content).toContain('Phase 64 — Read-Only Solana Provider Adapter Mock-to-Real Boundary v1');
    expect(content.toLowerCase()).toContain('not implemented');
  });
});

describe('Phase 63 — constants, names, kinds, fixtures, root exports', () => {
  it('constants and root exports align', () => {
    expect(READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE).toBe(63);
    expect(ROOT_PHASE).toBe(63);
    expect(ROOT_FIXTURES).toEqual(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES);
    expect(PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT).toBe('2026-05-12T00:00:00.000Z');
    expect(PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE).toBe(
      'phase63_read_only_provider_adapter_gate_v1',
    );
    expect(PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION).toBe('1.0.0');
  });

  it('has deterministic names, kinds, policies, states, and fixture count', () => {
    expect(READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES).toHaveLength(8);
    expect(READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS).toHaveLength(8);
    expect(READ_ONLY_PROVIDER_GATE_POLICY_KINDS).toHaveLength(10);
    expect(READ_ONLY_PROVIDER_GATE_STATE_KINDS).toHaveLength(7);
    expect(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES).toHaveLength(8);
  });

  it('map/list/get helpers are deterministic', () => {
    expect(listReadOnlyProviderAdapterGateFixtures()).toEqual(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES);
    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES) {
      expect(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getReadOnlyProviderAdapterGateFixture(fixture.fixtureId)).toBe(fixture);
    }
    expect(getReadOnlyProviderAdapterGateFixture('missing')).toBeNull();
  });
});

describe('Phase 63 — fixture structure, linkage, and fail-closed behavior', () => {
  it('fixture IDs and names are unique', () => {
    const ids = READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES.map(fixture => fixture.fixtureId);
    const names = READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES.map(fixture => fixture.fixtureName);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('fixtures include required deterministic surfaces', () => {
    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES) {
      expect(fixture.phase).toBe(63);
      expect(fixture.schemaVersion).toBe('1.0.0');
      expect(fixture.meta.generatedAt).toBe(PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT);
      expect(fixture.gateState.failClosed).toBe(true);
      expect(fixture.gateState.closedByDefault).toBe(true);
      expect(fixture.resolutionResult.failClosed).toBe(true);
      expect(fixture.resolutionResult.manualUnlockRequired).toBe(true);
      expect(fixture.providerCandidate.liveProvider).toBe(false);
      expect(fixture.capabilityChecks.length).toBeGreaterThanOrEqual(10);
      expect(fixture.compatibilityChecks.length).toBeGreaterThanOrEqual(6);
      expect(fixture.gatePolicies).toHaveLength(10);
      expect(fixture.apiContracts.errors).toHaveLength(2);
      expect(fixture.selectorExamples.length).toBeGreaterThan(0);
      expect(fixture.gateIdentity.sourceComparisonLabFixtureName).toBeDefined();
      expect(SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES).toContain(
        fixture.gateIdentity.sourceComparisonLabFixtureName as (typeof SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES)[number],
      );
    }
  });

  it('fixtures reference Phase 54 contracts and Phase 55 mocks where practical', () => {
    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES) {
      if (fixture.sourceProviderContractName) {
        expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain(
          fixture.sourceProviderContractName as (typeof READ_ONLY_PROVIDER_CONTRACT_NAMES)[number],
        );
      }
      if (fixture.sourceProviderMockName) {
        expect(READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES).toContain(
          fixture.sourceProviderMockName as (typeof READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES)[number],
        );
      }
    }
  });

  it('includes explicit acceptance and rejection fixture categories', () => {
    const accepted = READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES.find(
      fixture => fixture.fixtureName === 'safe-synthetic-mock-accepted-gate',
    );
    expect(accepted?.resolutionResult.allowed).toBe(true);
    expect(accepted?.gateState.stateKind).toBe('open_for_synthetic_mocks_only');

    const closed = READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES.find(
      fixture => fixture.fixtureName === 'safe-synthetic-mock-closed-by-default-gate',
    );
    expect(closed?.resolutionResult.allowed).toBe(false);
    expect(closed?.gateState.stateKind).toBe('closed_by_default');

    const missingContract = READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES.find(
      fixture => fixture.fixtureName === 'missing-contract-rejected-gate',
    );
    expect(missingContract?.sourceProviderContractName).toBeNull();
    expect(missingContract?.gateState.stateKind).toBe('rejected_missing_contract');
  });
});

describe('Phase 63 — builders, reports, view models, contracts, selectors', () => {
  it('fixture builder is deterministic', () => {
    const a = buildReadOnlyProviderAdapterGateFixture({
      fixtureName: 'safe-synthetic-mock-accepted-gate',
    });
    const b = buildReadOnlyProviderAdapterGateFixture({
      fixtureName: 'safe-synthetic-mock-accepted-gate',
    });
    expect(a).toEqual(b);
  });

  it('builder helpers produce deterministic structures', () => {
    const policy = buildReadOnlyProviderGatePolicy({
      fixtureId: 'fixture-x',
      policyKind: 'read_only_capability_required',
      enabled: true,
    });
    expect(policy.required).toBe(true);

    const state = buildReadOnlyProviderGateState({
      fixtureId: 'fixture-x',
      stateKind: 'closed_by_default',
      allowed: false,
      mockOnly: true,
    });
    expect(state.failClosed).toBe(true);

    const resolution = buildReadOnlyProviderResolutionResult({
      fixtureId: 'fixture-x',
      state,
      policies: [policy],
      candidate: {
        candidateId: 'candidate-x',
        candidateKind: 'synthetic_provider_candidate',
        candidateName: 'candidate',
        syntheticOnly: true,
        mockOnly: true,
        liveProvider: false,
        networkEndpoint: null,
        providerSdk: null,
        providerClientReference: null,
        requestedCapabilities: {
          readOnly: true,
          networkAccess: false,
          liveProvider: false,
          executionCapability: false,
          walletCapability: false,
          signingCapability: false,
          transactionSendingCapability: false,
          runtimeRequestCapability: false,
          unsafeProvider: false,
          advisoryOutput: false,
        },
        sourceContractName: 'token-metadata-contract',
        sourceMockName: 'token-metadata-adapter-mock',
      },
      rejectionReasons: [],
    });
    expect(resolution.failClosed).toBe(true);

    const capabilityCheck = buildReadOnlyProviderCapabilityCheck({
      fixtureId: 'fixture-x',
      checkKind: 'read_only_required',
      expectedSafeValue: true,
      actualFixtureValue: true,
      safetyNotes: ['ok'],
    });
    expect(capabilityCheck.pass).toBe(true);

    const compatibilityCheck = buildReadOnlyProviderCompatibilityCheck({
      fixtureId: 'fixture-x',
      checkKind: 'contract_to_mock_compatibility',
      pass: true,
      sourceContractName: 'token-metadata-contract',
      sourceMockName: 'token-metadata-adapter-mock',
      notes: ['ok'],
    });
    expect(compatibilityCheck.pass).toBe(true);

    const report = buildReadOnlyProviderGateReport({
      fixtureId: 'fixture-x',
      state,
      resolution,
      capabilityChecks: [capabilityCheck],
    });
    expect(report.noLiveExecution).toBe(true);
    expect(report.noRecommendationOutput).toBe(true);
  });

  it('view-model, contract, and selector helpers are deterministic', () => {
    const fixture = READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!;
    const viewModel = buildReadOnlyProviderAdapterGateViewModel(fixture);
    const contracts = buildReadOnlyProviderAdapterGateApiContract({ ...fixture, viewModel });
    expect(contracts.list.contractKind).toBe('list');
    expect(contracts.detail.contractKind).toBe('detail');
    expect(contracts.summary.contractKind).toBe('summary');

    const selector = selectReadOnlyProviderAdapterGateFixture({ fixtureId: fixture.fixtureId });
    expect(selector.matched).toBe(true);
    expect(selector.selectedFixtureId).toBe(fixture.fixtureId);

    const unmatched = selectReadOnlyProviderAdapterGateFixture({ fixtureId: 'missing-fixture-id' });
    expect(unmatched.matched).toBe(false);
  });
});

describe('Phase 63 — normalization, serialization, equality, determinism', () => {
  it('normalization/serialization/equality are deterministic', () => {
    const base = clone(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!);
    const scrambled = {
      ...clone(base),
      gatePolicies: [...base.gatePolicies].reverse(),
      capabilityChecks: [...base.capabilityChecks].reverse(),
      compatibilityChecks: [...base.compatibilityChecks].reverse(),
      selectorExamples: [...base.selectorExamples].reverse(),
      resolutionResult: {
        ...base.resolutionResult,
        policyResults: [...base.resolutionResult.policyResults].reverse(),
        rejectionReasons: [...base.resolutionResult.rejectionReasons].reverse(),
      },
    };

    expect(normalizeReadOnlyProviderAdapterGateFixture(scrambled)).toEqual(
      normalizeReadOnlyProviderAdapterGateFixture(base),
    );
    expect(serializeReadOnlyProviderAdapterGateFixture(scrambled)).toBe(
      serializeReadOnlyProviderAdapterGateFixture(base),
    );
    expect(areReadOnlyProviderAdapterGateFixturesEqual(scrambled, base)).toBe(true);
  });

  it('checksum helper is stable', () => {
    const checksum = stableDeterministicReadOnlyProviderAdapterGateChecksum('phase63-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicReadOnlyProviderAdapterGateChecksum('phase63-check')).toBe(checksum);
  });

  it('source immutability holds when clone is mutated', () => {
    const source = READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!;
    const copy = clone(source);
    copy.resolutionResult.rejectionReasons = ['changed'] as never;
    expect(source.resolutionResult.rejectionReasons).not.toEqual(['changed']);
  });
});

describe('Phase 63 — validation and safety', () => {
  it('validation and safety pass for baseline fixtures', () => {
    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES) {
      const validation = validateReadOnlyProviderAdapterGateFixture(fixture);
      if (!validation.valid) throw new Error(JSON.stringify(validation.issues));
      expect(validation.valid).toBe(true);
      expect(validateReadOnlyProviderAdapterGateSafety(fixture)).toEqual({ safe: true, violations: [] });
    }
  });

  it('validation rejects missing source contract', () => {
    const fixture = clone(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!);
    fixture.sourceProviderContractName = 'missing-contract' as never;
    const validation = validateReadOnlyProviderAdapterGateFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'MISSING_SOURCE_CONTRACT')).toBe(true);
  });

  it('validation rejects invalid gate state', () => {
    const fixture = clone(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!);
    fixture.gateState.stateKind = 'invalid_state' as never;
    const validation = validateReadOnlyProviderAdapterGateFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'INVALID_GATE_STATE')).toBe(true);
  });

  it('validation rejects unsafe capability true', () => {
    const fixture = clone(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!);
    fixture.capabilityFlags.readOnlyProviderGateExecution = true as never;
    const validation = validateReadOnlyProviderAdapterGateFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
  });

  it('validation rejects network endpoint and provider sdk references', () => {
    const fixture = clone(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!);
    fixture.providerCandidate.networkEndpoint = 'https://unsafe.example' as never;
    fixture.providerCandidate.providerSdk = 'unsafe-sdk' as never;
    const validation = validateReadOnlyProviderAdapterGateFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'NETWORK_ENDPOINT_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'PROVIDER_SDK_FORBIDDEN')).toBe(true);
  });

  it('validation rejects wallet/signing/sending references', () => {
    const fixture = clone(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!);
    fixture.providerCandidate.requestedCapabilities.walletCapability = true;
    fixture.providerCandidate.requestedCapabilities.signingCapability = true;
    fixture.providerCandidate.requestedCapabilities.transactionSendingCapability = true;
    const validation = validateReadOnlyProviderAdapterGateFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_WALLET_CAPABILITY')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_SIGNING_CAPABILITY')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_SENDING_CAPABILITY')).toBe(true);
  });

  it('validation rejects live provider candidate and advisory text', () => {
    const fixture = clone(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!);
    fixture.providerCandidate.liveProvider = true as never;
    fixture.gateReport.rejectionSummary = 'buy now profit recommendation';
    const validation = validateReadOnlyProviderAdapterGateFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'LIVE_PROVIDER_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
  });

  it('safety validator rejects unsafe capability mutations', () => {
    const fixture = clone(READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES[0]!);
    fixture.capabilityFlags.readOnlyProviderGateNetworkAccess = true as never;
    const safety = validateReadOnlyProviderAdapterGateSafety(fixture);
    expect(safety.safe).toBe(false);
    expect(safety.violations.length).toBeGreaterThan(0);
  });
});

describe('Phase 63 — capabilities and propagation', () => {
  it('module capability flags are correct', () => {
    const caps = getReadOnlyProviderAdapterGateCapabilities();
    expect(caps.readOnlyProviderAdapterGate).toBe(true);
    expect(caps.readOnlyProviderAdapterGateFixtures).toBe(true);
    expect(caps.readOnlyProviderGateExecution).toBe(false);
    expect(caps.readOnlyProviderGateRealPnL).toBe(false);
  });

  it('dashboard and read-only-api capabilities include Phase 63 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities() as Record<string, unknown>;
    expect(dashboardCaps['readOnlyProviderAdapterGate']).toBe(true);
    expect(dashboardCaps['readOnlyProviderAdapterGateFixtures']).toBe(true);
    expect(dashboardCaps['readOnlyProviderGateExecution']).toBe(false);

    const dashboardCapsSource = readFileSync(resolve(REPO_ROOT, 'apps/dashboard/src/capabilities.ts'), 'utf-8');
    expect(dashboardCapsSource.toLowerCase()).not.toContain('websocket');

    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(apiCaps['readOnlyProviderAdapterGate']).toBe(true);
    expect(apiCaps['readOnlyProviderAdapterGateFixtures']).toBe(true);
    expect(apiCaps['readOnlyProviderGateWebSocketAccess']).toBe(false);
  });
});

describe('Phase 63 — safety scan and forbidden runtime primitives', () => {
  it('phase files avoid nondeterministic and runtime primitives', () => {
    for (const file of PHASE_63_FILES) {
      const content = readFileSync(resolve(PHASE_63_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Date\.now\(/);
      expect(content).not.toMatch(/new Date\(/);
      expect(content).not.toMatch(/Math\.random\(/);
      expect(content).not.toMatch(/randomUUID\(/);
      expect(content).not.toMatch(/process\.env/);
      expect(content).not.toMatch(/setInterval\(/);
      expect(content).not.toMatch(/setTimeout\(/);
      if (file !== 'validation.ts') {
        expect(content).not.toMatch(/fetch\(/);
        expect(content).not.toMatch(/writeFile\(/);
        expect(content).not.toMatch(/createWriteStream\(/);
        expect(content).not.toMatch(/document\./);
        expect(content).not.toMatch(/window\./);
        expect(content).not.toMatch(/localStorage\./);
        expect(content).not.toMatch(/indexedDB\./);
        expect(content).not.toMatch(/listen\(/);
      }
    }
  });

  it('no fixture includes real endpoints, api keys, or real provider data claims', () => {
    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_GATE_FIXTURES) {
      expect(fixture.providerCandidate.networkEndpoint).toBeNull();
      expect(fixture.providerCandidate.providerSdk).toBeNull();
      expect(fixture.providerCandidate.providerClientReference).toBeNull();
      expect(JSON.stringify(fixture).toLowerCase()).not.toContain('api_key');
      expect(JSON.stringify(fixture).toLowerCase()).not.toContain('private key');
    }
  });

  it('phase 64 remains preview only and not implemented in phase 63', () => {
    const docs = readFileSync(resolve(REPO_ROOT, 'docs/READ_ONLY_PROVIDER_ADAPTER_GATE.md'), 'utf-8');
    expect(docs).toContain('Phase 64 — Read-Only Solana Provider Adapter Mock-to-Real Boundary v1');
    expect(docs).toContain('not implemented');
  });
});
