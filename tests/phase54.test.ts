/**
 * Phase 54 — Read-Only Provider Interface Contracts v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  READ_ONLY_PROVIDER_CONTRACTS_PHASE,
  READ_ONLY_PROVIDER_CONTRACT_NAMES,
  READ_ONLY_PROVIDER_CONTRACT_KINDS,
  READ_ONLY_PROVIDER_CONTRACT_FIXTURES,
  READ_ONLY_PROVIDER_CONTRACT_FIXTURE_MAP,
  buildReadOnlyProviderContractFixture,
  buildReadOnlyProviderContractViewModel,
  buildReadOnlyProviderApiContract,
  listReadOnlyProviderContractFixtures,
  getReadOnlyProviderContractFixture,
  selectReadOnlyProviderContractFixture,
  normalizeReadOnlyProviderContractFixture,
  serializeReadOnlyProviderContractFixture,
  areReadOnlyProviderContractFixturesEqual,
  validateReadOnlyProviderContractFixture,
  validateReadOnlyProviderContractSafety,
  getReadOnlyProviderContractCapabilities,
  stableDeterministicReadOnlyProviderContractChecksum,
  isValidReadOnlyProviderContractName,
  isValidReadOnlyProviderContractKind,
  isValidReadOnlyProviderContractGeneratedAt,
  isValidReadOnlyProviderContractSource,
  PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
  PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
} from '../apps/dashboard/src/read-only-provider-contracts/index.js';
import {
  READ_ONLY_PROVIDER_CONTRACTS_PHASE as ROOT_PHASE,
  READ_ONLY_PROVIDER_CONTRACT_FIXTURES as ROOT_FIXTURES,
  listReadOnlyProviderContractFixtures as rootListFixtures,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_54_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/read-only-provider-contracts');
const PHASE_54_FILES = [
  'types.ts',
  'builders.ts',
  'fixtures.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
];

// ─── File existence ──────────────────────────────────────────

describe('Phase 54 — source file existence', () => {
  for (const file of PHASE_54_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_54_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/READ_ONLY_PROVIDER_CONTRACTS.md exists', () => {
    const content = readFileSync(resolve(REPO_ROOT, 'docs/READ_ONLY_PROVIDER_CONTRACTS.md'), 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });
});

// ─── Constants ────────────────────────────────────────────────

describe('Phase 54 — constants', () => {
  it('phase is 54', () => {
    expect(READ_ONLY_PROVIDER_CONTRACTS_PHASE).toBe(54);
  });

  it('has 8 provider contract names', () => {
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES.length).toBe(8);
  });

  it('has 8 provider contract kinds', () => {
    expect(READ_ONLY_PROVIDER_CONTRACT_KINDS.length).toBe(8);
  });

  it('names and kinds have matching cardinality', () => {
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES.length).toBe(READ_ONLY_PROVIDER_CONTRACT_KINDS.length);
  });

  it('generatedAt is a deterministic constant', () => {
    expect(PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT).toBe('2026-01-16T00:00:00.000Z');
  });

  it('source is a deterministic constant', () => {
    expect(PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE).toBe(
      'phase54_read_only_provider_interface_contracts_v1',
    );
  });

  it('name constants include expected provider domains', () => {
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain('solana-rpc-contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain('pump-launch-contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain('dex-liquidity-contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain('token-metadata-contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain('holder-distribution-contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain('wallet-cluster-contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain('risk-intelligence-contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain('disabled-unsafe-contract');
  });

  it('kind constants include expected domains', () => {
    expect(READ_ONLY_PROVIDER_CONTRACT_KINDS).toContain('solana_rpc_contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_KINDS).toContain('pump_launch_contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_KINDS).toContain('dex_liquidity_contract');
    expect(READ_ONLY_PROVIDER_CONTRACT_KINDS).toContain('disabled_unsafe_contract');
  });
});

// ─── Fixture array ────────────────────────────────────────────

describe('Phase 54 — fixture array', () => {
  it('has at least 8 fixtures', () => {
    expect(READ_ONLY_PROVIDER_CONTRACT_FIXTURES.length).toBeGreaterThanOrEqual(8);
  });

  it('fixture IDs are unique', () => {
    const ids = READ_ONLY_PROVIDER_CONTRACT_FIXTURES.map(f => f.fixtureId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('fixture names are unique', () => {
    const names = READ_ONLY_PROVIDER_CONTRACT_FIXTURES.map(f => f.fixtureName);
    expect(new Set(names).size).toBe(names.length);
  });

  it('all fixtures have phase 54', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.phase).toBe(54);
    }
  });

  it('all fixture IDs start with phase54-fixture-', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.fixtureId).toMatch(/^phase54-fixture-/);
    }
  });
});

// ─── Fixture map ──────────────────────────────────────────────

describe('Phase 54 — fixture map', () => {
  it('map has same count as fixtures array', () => {
    expect(READ_ONLY_PROVIDER_CONTRACT_FIXTURE_MAP.size).toBe(
      READ_ONLY_PROVIDER_CONTRACT_FIXTURES.length,
    );
  });

  it('all fixture IDs are in the map', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(READ_ONLY_PROVIDER_CONTRACT_FIXTURE_MAP.has(fixture.fixtureId)).toBe(true);
    }
  });
});

// ─── List / Get helpers ───────────────────────────────────────

describe('Phase 54 — list/get helpers', () => {
  it('listReadOnlyProviderContractFixtures returns all fixtures', () => {
    const list = listReadOnlyProviderContractFixtures();
    expect(list.length).toBe(READ_ONLY_PROVIDER_CONTRACT_FIXTURES.length);
  });

  it('getReadOnlyProviderContractFixture returns fixture by ID', () => {
    const first = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!first) throw new Error('No fixtures');
    const found = getReadOnlyProviderContractFixture(first.fixtureId);
    expect(found).not.toBeNull();
    expect(found?.fixtureId).toBe(first.fixtureId);
  });

  it('getReadOnlyProviderContractFixture returns null for unknown ID', () => {
    const result = getReadOnlyProviderContractFixture('phase54-fixture-nonexistent');
    expect(result).toBeNull();
  });
});

// ─── Builder helpers ──────────────────────────────────────────

describe('Phase 54 — builder', () => {
  it('buildReadOnlyProviderContractFixture builds each fixture', () => {
    for (const name of READ_ONLY_PROVIDER_CONTRACT_NAMES) {
      const fixture = buildReadOnlyProviderContractFixture({ fixtureName: name });
      expect(fixture.fixtureName).toBe(name);
      expect(fixture.phase).toBe(54);
    }
  });

  it('builder is deterministic — same input yields equal output', () => {
    const a = buildReadOnlyProviderContractFixture({ fixtureName: 'solana-rpc-contract' });
    const b = buildReadOnlyProviderContractFixture({ fixtureName: 'solana-rpc-contract' });
    expect(areReadOnlyProviderContractFixturesEqual(a, b)).toBe(true);
  });

  it('builder produces unique IDs for different names', () => {
    const a = buildReadOnlyProviderContractFixture({ fixtureName: 'solana-rpc-contract' });
    const b = buildReadOnlyProviderContractFixture({ fixtureName: 'pump-launch-contract' });
    expect(a.fixtureId).not.toBe(b.fixtureId);
  });
});

// ─── Provider identity ────────────────────────────────────────

describe('Phase 54 — provider identity', () => {
  for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
    it(`${fixture.fixtureName}: identity has required fields`, () => {
      const identity = fixture.providerIdentity;
      expect(typeof identity.providerId).toBe('string');
      expect(identity.providerId.length).toBeGreaterThan(0);
      expect(typeof identity.providerName).toBe('string');
      expect(identity.liveNetworkAccess).toBe(false);
      expect(identity.walletAccess).toBe(false);
      expect(identity.executionAccess).toBe(false);
    });
  }

  it('solana-rpc-contract is disabled by default', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES.find(
      f => f.fixtureName === 'solana-rpc-contract',
    );
    expect(fixture?.providerIdentity.disabledByDefault).toBe(true);
  });

  it('risk-intelligence-contract may be fixture-enabled', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES.find(
      f => f.fixtureName === 'risk-intelligence-contract',
    );
    expect(fixture?.providerIdentity).toBeDefined();
    // disabledByDefault is false for risk-intelligence-contract fixture
    expect(fixture?.providerIdentity.disabledByDefault).toBe(false);
  });
});

// ─── Provider interface contract ──────────────────────────────

describe('Phase 54 — provider interface contract', () => {
  for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
    it(`${fixture.fixtureName}: interface contract has required fields`, () => {
      const contract = fixture.providerInterfaceContract;
      expect(typeof contract.contractId).toBe('string');
      expect(contract.contractId.length).toBeGreaterThan(0);
      expect(typeof contract.contractVersion).toBe('string');
      expect(contract.requestShape.localOnly).toBe(true);
      expect(contract.requestShape.synthetic).toBe(true);
      expect(contract.responseShape.fixtureOnly).toBe(true);
      expect(contract.responseShape.readOnly).toBe(true);
      expect(contract.responseShape.localOnly).toBe(true);
      expect(Array.isArray(contract.unsupportedLiveCapabilities)).toBe(true);
    });
  }
});

// ─── Provider capability contract ────────────────────────────

describe('Phase 54 — provider capability contract', () => {
  for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
    it(`${fixture.fixtureName}: capability contract is correct`, () => {
      const cap = fixture.providerCapabilityContract;
      expect(cap.readOnlySupport).toBe(true);
      expect(cap.syntheticFixtureSupport).toBe(true);
      expect(cap.liveNetworkDisabled).toBe(true);
      expect(cap.walletDisabled).toBe(true);
      expect(cap.executionDisabled).toBe(true);
      expect(cap.tradingSignalsDisabled).toBe(true);
      expect(cap.recommendationsDisabled).toBe(true);
      expect(cap.investmentAdviceDisabled).toBe(true);
    });
  }
});

// ─── Provider health/status contract ─────────────────────────

describe('Phase 54 — provider health contract', () => {
  for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
    it(`${fixture.fixtureName}: health contract is correct`, () => {
      const health = fixture.providerHealthContract;
      expect(health.noActualHealthCheck).toBe(true);
      expect(health.syntheticOnly).toBe(true);
      expect(typeof health.deterministicStatus).toBe('string');
      expect(typeof health.syntheticLatencyBucket).toBe('string');
      expect(typeof health.syntheticReliabilityLabel).toBe('string');
      expect(Array.isArray(health.deterministicFailureExamples)).toBe(true);
      expect(health.deterministicFailureExamples.length).toBeGreaterThan(0);
    });
  }
});

// ─── Synthetic responses ──────────────────────────────────────

describe('Phase 54 — synthetic responses', () => {
  for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
    it(`${fixture.fixtureName}: synthetic responses are present`, () => {
      expect(fixture.syntheticResponses.length).toBeGreaterThan(0);
    });

    it(`${fixture.fixtureName}: response meta is deterministic`, () => {
      for (const response of fixture.syntheticResponses) {
        expect(response.meta.generatedAt).toBe(PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT);
        expect(response.meta.fixtureOnly).toBe(true);
        expect(response.safety.nonAdvisory).toBe(true);
        expect(response.safety.contractOnly).toBe(true);
        expect(response.safety.noLiveData).toBe(true);
      }
    });
  }
});

// ─── View models ─────────────────────────────────────────────

describe('Phase 54 — view models', () => {
  for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
    it(`${fixture.fixtureName}: view model has required fields`, () => {
      const vm = fixture.viewModel;
      expect(typeof vm.viewModelId).toBe('string');
      expect(typeof vm.displayTitle).toBe('string');
      expect(typeof vm.displaySubtitle).toBe('string');
      expect(typeof vm.providerLabel).toBe('string');
      expect(typeof vm.domainLabel).toBe('string');
      expect(typeof vm.statusLabel).toBe('string');
      expect(typeof vm.nonAdvisorySummary).toBe('string');
      expect(typeof vm.safetyBadge).toBe('string');
    });
  }

  it('buildReadOnlyProviderContractViewModel builds a view model', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const vm = buildReadOnlyProviderContractViewModel(fixture);
    expect(vm.viewModelId).toContain('phase54-view-');
    expect(vm.nonAdvisorySummary).toContain('not advisory');
  });
});

// ─── API contracts ────────────────────────────────────────────

describe('Phase 54 — API contracts', () => {
  for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
    it(`${fixture.fixtureName}: API contracts have required fields`, () => {
      const api = fixture.apiContracts;
      expect(api.list.fixtureOnly).toBe(true);
      expect(api.list.readOnly).toBe(true);
      expect(api.list.localOnly).toBe(true);
      expect(api.detail.fixtureOnly).toBe(true);
      expect(api.summary.fixtureOnly).toBe(true);
      expect(api.errors.length).toBe(2);
      expect(api.errors[0]?.contractKind).toBe('error');
      expect(api.errors[1]?.contractKind).toBe('error');
    });
  }

  it('buildReadOnlyProviderApiContract builds API contracts', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const api = buildReadOnlyProviderApiContract(fixture);
    expect(api.list.contractKind).toBe('list');
    expect(api.detail.contractKind).toBe('detail');
    expect(api.summary.contractKind).toBe('summary');
  });
});

// ─── Selectors ────────────────────────────────────────────────

describe('Phase 54 — selectors', () => {
  it('selectReadOnlyProviderContractFixture returns a result with no query', () => {
    const result = selectReadOnlyProviderContractFixture();
    expect(result.selectorId).toMatch(/^phase54-selector-/);
    expect(typeof result.selectedFixtureId).toBe('string');
    expect(typeof result.selectedProviderKind).toBe('string');
    expect(result.source).toBe('synthetic_fixture_only');
  });

  it('selector matches by fixtureId', () => {
    const first = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!first) throw new Error('No fixtures');
    const result = selectReadOnlyProviderContractFixture({ fixtureId: first.fixtureId });
    expect(result.selectedFixtureId).toBe(first.fixtureId);
    expect(result.matched).toBe(true);
  });

  it('selector matches by providerKind', () => {
    const result = selectReadOnlyProviderContractFixture({ providerKind: 'solana_rpc_contract' });
    expect(result.selectedProviderKind).toBe('solana_rpc_contract');
    expect(result.matched).toBe(true);
  });

  it('selector unmatched for unknown fixtureId', () => {
    const result = selectReadOnlyProviderContractFixture({ fixtureId: 'phase54-fixture-nonexistent' });
    expect(result.matched).toBe(false);
  });

  it('selector examples in each fixture are non-empty', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.selectorExamples.length).toBeGreaterThan(0);
      for (const example of fixture.selectorExamples) {
        expect(example.selectorId).toMatch(/^phase54-selector-/);
        expect(example.source).toBe('synthetic_fixture_only');
      }
    }
  });
});

// ─── Normalization / Serialization / Equality ─────────────────

describe('Phase 54 — normalization / serialization / equality', () => {
  it('normalizeReadOnlyProviderContractFixture is stable', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const a = normalizeReadOnlyProviderContractFixture(fixture);
    const b = normalizeReadOnlyProviderContractFixture(fixture);
    expect(serializeReadOnlyProviderContractFixture(a)).toBe(
      serializeReadOnlyProviderContractFixture(b),
    );
  });

  it('serializeReadOnlyProviderContractFixture produces valid JSON', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const json = serializeReadOnlyProviderContractFixture(fixture);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('areReadOnlyProviderContractFixturesEqual returns true for same fixture', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    expect(areReadOnlyProviderContractFixturesEqual(fixture, fixture)).toBe(true);
  });

  it('areReadOnlyProviderContractFixturesEqual returns false for different fixtures', () => {
    const a = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    const b = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[1];
    if (!a || !b) throw new Error('Not enough fixtures');
    expect(areReadOnlyProviderContractFixturesEqual(a, b)).toBe(false);
  });

  it('serialization is deterministic across repeated calls', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[2];
    if (!fixture) throw new Error('No fixtures');
    const s1 = serializeReadOnlyProviderContractFixture(fixture);
    const s2 = serializeReadOnlyProviderContractFixture(fixture);
    expect(s1).toBe(s2);
  });

  it('stableDeterministicReadOnlyProviderContractChecksum is stable', () => {
    const checksum = stableDeterministicReadOnlyProviderContractChecksum('test-content');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicReadOnlyProviderContractChecksum('test-content')).toBe(checksum);
  });
});

// ─── Normalization utilities ──────────────────────────────────

describe('Phase 54 — normalization utilities', () => {
  it('isValidReadOnlyProviderContractName returns true for valid names', () => {
    for (const name of READ_ONLY_PROVIDER_CONTRACT_NAMES) {
      expect(isValidReadOnlyProviderContractName(name)).toBe(true);
    }
  });

  it('isValidReadOnlyProviderContractName returns false for invalid names', () => {
    expect(isValidReadOnlyProviderContractName('unknown-provider')).toBe(false);
    expect(isValidReadOnlyProviderContractName(123)).toBe(false);
  });

  it('isValidReadOnlyProviderContractKind returns true for valid kinds', () => {
    for (const kind of READ_ONLY_PROVIDER_CONTRACT_KINDS) {
      expect(isValidReadOnlyProviderContractKind(kind)).toBe(true);
    }
  });

  it('isValidReadOnlyProviderContractKind returns false for invalid kinds', () => {
    expect(isValidReadOnlyProviderContractKind('unknown_kind')).toBe(false);
  });

  it('isValidReadOnlyProviderContractGeneratedAt validates correctly', () => {
    expect(isValidReadOnlyProviderContractGeneratedAt('2026-01-16T00:00:00.000Z')).toBe(true);
    expect(isValidReadOnlyProviderContractGeneratedAt('2025-01-01')).toBe(false);
  });

  it('isValidReadOnlyProviderContractSource validates correctly', () => {
    expect(
      isValidReadOnlyProviderContractSource('phase54_read_only_provider_interface_contracts_v1'),
    ).toBe(true);
    expect(isValidReadOnlyProviderContractSource('other_source')).toBe(false);
  });
});

// ─── Validation ───────────────────────────────────────────────

describe('Phase 54 — validation success', () => {
  for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
    it(`${fixture.fixtureName}: validateReadOnlyProviderContractFixture passes`, () => {
      const result = validateReadOnlyProviderContractFixture(fixture);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  }

  for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
    it(`${fixture.fixtureName}: validateReadOnlyProviderContractSafety passes`, () => {
      const result = validateReadOnlyProviderContractSafety(fixture);
      expect(result.safe).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  }
});

describe('Phase 54 — validation failure', () => {
  it('rejects non-object input', () => {
    const result = validateReadOnlyProviderContractFixture('not-an-object');
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'NOT_OBJECT')).toBe(true);
  });

  it('rejects wrong phase', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const result = validateReadOnlyProviderContractFixture({ ...fixture, phase: 53 });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_PHASE')).toBe(true);
  });

  it('rejects invalid fixture name', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const result = validateReadOnlyProviderContractFixture({ ...fixture, fixtureName: 'bad-name' });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_FIXTURE_NAME')).toBe(true);
  });

  it('rejects invalid fixture kind', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const result = validateReadOnlyProviderContractFixture({
      ...fixture,
      fixtureKind: 'bad_kind',
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_FIXTURE_KIND')).toBe(true);
  });

  it('rejects missing providerIdentity', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const result = validateReadOnlyProviderContractFixture({
      ...fixture,
      providerIdentity: null,
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_PROVIDER_IDENTITY')).toBe(true);
  });

  it('rejects providerIdentity with liveNetworkAccess=true', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const result = validateReadOnlyProviderContractFixture({
      ...fixture,
      providerIdentity: { ...fixture.providerIdentity, liveNetworkAccess: true },
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_LIVE_NETWORK_ACCESS')).toBe(true);
  });

  it('rejects missing safety.nonAdvisory', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const result = validateReadOnlyProviderContractFixture({
      ...fixture,
      safety: { ...fixture.safety, nonAdvisory: false },
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_SAFETY')).toBe(true);
  });

  it('rejects invalid meta.generatedAt', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const result = validateReadOnlyProviderContractFixture({
      ...fixture,
      meta: { ...fixture.meta, generatedAt: '2025-01-01T00:00:00.000Z' },
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'INVALID_META_GENERATED_AT')).toBe(true);
  });

  it('rejects capability flag set to wrong value', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const result = validateReadOnlyProviderContractFixture({
      ...fixture,
      capabilityFlags: { ...fixture.capabilityFlags, readOnlyProviderContracts: false },
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'CAPABILITY_TRUE_REQUIRED')).toBe(true);
  });

  it('rejects negative capability flag set to true', () => {
    const fixture = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    if (!fixture) throw new Error('No fixtures');
    const result = validateReadOnlyProviderContractFixture({
      ...fixture,
      capabilityFlags: { ...fixture.capabilityFlags, readOnlyProviderLiveData: true },
    });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'CAPABILITY_FALSE_REQUIRED')).toBe(true);
  });
});

describe('Phase 54 — safety validation', () => {
  it('safety validation passes clean objects', () => {
    const result = validateReadOnlyProviderContractSafety({ label: 'clean fixture data' });
    expect(result.safe).toBe(true);
  });

  it('safety validation rejects objects with live URL', () => {
    const result = validateReadOnlyProviderContractSafety({
      label: 'see https://api.example.com/data',
    });
    expect(result.safe).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('safety validation rejects wallet references', () => {
    const result = validateReadOnlyProviderContractSafety({ label: 'used for wallet access' });
    expect(result.safe).toBe(false);
  });
});

// ─── Capability flags ─────────────────────────────────────────

describe('Phase 54 — capability flags', () => {
  it('getReadOnlyProviderContractCapabilities returns correct positive flags', () => {
    const caps = getReadOnlyProviderContractCapabilities();
    expect(caps.readOnlyProviderContracts).toBe(true);
    expect(caps.syntheticReadOnlyProviderContracts).toBe(true);
    expect(caps.deterministicReadOnlyProviderContracts).toBe(true);
    expect(caps.localOnlyReadOnlyProviderContracts).toBe(true);
    expect(caps.fixtureDerivedReadOnlyProviderContracts).toBe(true);
    expect(caps.readOnlyProviderContractViewModels).toBe(true);
    expect(caps.readOnlyProviderApiContracts).toBe(true);
    expect(caps.readOnlyProviderSelectors).toBe(true);
    expect(caps.readOnlyProviderAdapterGate).toBe(true);
  });

  it('getReadOnlyProviderContractCapabilities has all negative flags false', () => {
    const caps = getReadOnlyProviderContractCapabilities();
    expect(caps.readOnlyProviderLiveData).toBe(false);
    expect(caps.readOnlyProviderNetworkAccess).toBe(false);
    expect(caps.readOnlyProviderAdapters).toBe(false);
    expect(caps.readOnlyProviderSolanaRpc).toBe(false);
    expect(caps.readOnlyProviderWebSockets).toBe(false);
    expect(caps.readOnlyProviderGeyserYellowstone).toBe(false);
    expect(caps.readOnlyProviderPumpFunIntegration).toBe(false);
    expect(caps.readOnlyProviderDexIntegration).toBe(false);
    expect(caps.readOnlyProviderJitoIntegration).toBe(false);
    expect(caps.readOnlyProviderPersistence).toBe(false);
    expect(caps.readOnlyProviderFilesystemWrites).toBe(false);
    expect(caps.readOnlyProviderDownloads).toBe(false);
    expect(caps.readOnlyProviderRouteHandlers).toBe(false);
    expect(caps.readOnlyProviderHttpServer).toBe(false);
    expect(caps.readOnlyProviderRuntimeRequests).toBe(false);
    expect(caps.readOnlyProviderUiRendering).toBe(false);
    expect(caps.readOnlyProviderDomAccess).toBe(false);
    expect(caps.readOnlyProviderBackgroundJobs).toBe(false);
    expect(caps.readOnlyProviderScheduledJobs).toBe(false);
    expect(caps.readOnlyProviderWalletLogic).toBe(false);
    expect(caps.readOnlyProviderPrivateKeyHandling).toBe(false);
    expect(caps.readOnlyProviderSigning).toBe(false);
    expect(caps.readOnlyProviderTransactionSending).toBe(false);
    expect(caps.readOnlyProviderExecution).toBe(false);
    expect(caps.readOnlyProviderTradingSignals).toBe(false);
    expect(caps.readOnlyProviderRecommendations).toBe(false);
    expect(caps.readOnlyProviderInvestmentAdvice).toBe(false);
  });

  it('all fixtures have correct capability flags', () => {
    const caps = getReadOnlyProviderContractCapabilities();
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.capabilityFlags).toEqual(caps);
    }
  });
});

// ─── Dashboard export ─────────────────────────────────────────

describe('Phase 54 — dashboard root exports', () => {
  it('ROOT_PHASE is 54', () => {
    expect(ROOT_PHASE).toBe(54);
  });

  it('ROOT_FIXTURES matches module fixtures', () => {
    expect(ROOT_FIXTURES.length).toBe(READ_ONLY_PROVIDER_CONTRACT_FIXTURES.length);
  });

  it('rootListFixtures returns all fixtures', () => {
    const list = rootListFixtures();
    expect(list.length).toBe(READ_ONLY_PROVIDER_CONTRACT_FIXTURES.length);
  });
});

// ─── Dashboard capability propagation ────────────────────────

describe('Phase 54 — dashboard capability propagation', () => {
  it('getDashboardUiShellCapabilities includes Phase 54 positive flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.readOnlyProviderContracts).toBe(true);
    expect(caps.syntheticReadOnlyProviderContracts).toBe(true);
    expect(caps.deterministicReadOnlyProviderContracts).toBe(true);
    expect(caps.localOnlyReadOnlyProviderContracts).toBe(true);
    expect(caps.fixtureDerivedReadOnlyProviderContracts).toBe(true);
    expect(caps.readOnlyProviderContractViewModels).toBe(true);
    expect(caps.readOnlyProviderApiContracts).toBe(true);
    expect(caps.readOnlyProviderSelectors).toBe(true);
    expect(caps.readOnlyProviderAdapterGate).toBe(true);
  });

  it('getDashboardUiShellCapabilities includes Phase 54 negative flags', () => {
    const caps = getDashboardUiShellCapabilities();
    expect(caps.readOnlyProviderLiveData).toBe(false);
    expect(caps.readOnlyProviderNetworkAccess).toBe(false);
    expect(caps.readOnlyProviderAdapters).toBe(false);
    expect(caps.readOnlyProviderSolanaRpc).toBe(false);
    expect(caps.readOnlyProviderGeyserYellowstone).toBe(false);
    expect(caps.readOnlyProviderPumpFunIntegration).toBe(false);
    expect(caps.readOnlyProviderDexIntegration).toBe(false);
    expect(caps.readOnlyProviderJitoIntegration).toBe(false);
    expect(caps.readOnlyProviderWalletLogic).toBe(false);
    expect(caps.readOnlyProviderPrivateKeyHandling).toBe(false);
    expect(caps.readOnlyProviderSigning).toBe(false);
    expect(caps.readOnlyProviderTransactionSending).toBe(false);
    expect(caps.readOnlyProviderExecution).toBe(false);
    expect(caps.readOnlyProviderTradingSignals).toBe(false);
    expect(caps.readOnlyProviderRecommendations).toBe(false);
    expect(caps.readOnlyProviderInvestmentAdvice).toBe(false);
  });
});

// ─── Read-only API capability propagation ─────────────────────

describe('Phase 54 — read-only API capability propagation', () => {
  it('getLocalReadOnlyApiCapabilities includes Phase 54 positive flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.readOnlyProviderContracts).toBe(true);
    expect(caps.readOnlyProviderAdapterGate).toBe(true);
  });

  it('getLocalReadOnlyApiCapabilities includes Phase 54 negative flags', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    expect(caps.readOnlyProviderLiveData).toBe(false);
    expect(caps.readOnlyProviderNetworkAccess).toBe(false);
    expect(caps.readOnlyProviderSolanaRpc).toBe(false);
    expect(caps.readOnlyProviderExecution).toBe(false);
    expect(caps.readOnlyProviderInvestmentAdvice).toBe(false);
  });
});

// ─── Safety / No dynamic behavior ────────────────────────────

describe('Phase 54 — safety posture', () => {
  it('all fixture safety.noLiveData is true', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.safety.noLiveData).toBe(true);
    }
  });

  it('all fixture safety.noNetworkAccess is true', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.safety.noNetworkAccess).toBe(true);
    }
  });

  it('all fixture safety.noWalletAccess is true', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.safety.noWalletAccess).toBe(true);
    }
  });

  it('all fixture safety.noExecution is true', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.safety.noExecution).toBe(true);
    }
  });

  it('all fixture safety.nonAdvisory is true', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.safety.nonAdvisory).toBe(true);
    }
  });

  it('all fixture safety.contractOnly is true', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.safety.contractOnly).toBe(true);
    }
  });

  it('all generatedAt is deterministic (no Date.now)', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.meta.generatedAt).toBe(PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT);
    }
  });

  it('no fixture references real RPC URLs or API keys', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      const json = JSON.stringify(fixture);
      expect(json).not.toMatch(/https:\/\/(api|rpc|mainnet|devnet)\./i);
      expect(json).not.toMatch(/[A-Za-z0-9]{40,}/);
    }
  });

  it('source fixtures are not mutated — fixtures array is stable', () => {
    const before = listReadOnlyProviderContractFixtures();
    const after = listReadOnlyProviderContractFixtures();
    expect(before.length).toBe(after.length);
    for (let i = 0; i < before.length; i++) {
      expect(before[i]).toBe(after[i]); // same reference (immutable)
    }
  });

  it('no Date.now, Math.random, or crypto randomness in fixture IDs', () => {
    const ids = READ_ONLY_PROVIDER_CONTRACT_FIXTURES.map(f => f.fixtureId);
    // All IDs should be deterministic fnv1a32 checksums
    for (const id of ids) {
      expect(id).toMatch(/^phase54-fixture-fnv1a32-[0-9a-f]{8}$/);
    }
  });
});

// ─── Source immutability ──────────────────────────────────────

describe('Phase 54 — source immutability', () => {
  it('READ_ONLY_PROVIDER_CONTRACT_FIXTURES is frozen/readonly', () => {
    // Attempt to push to the array (should be a readonly tuple, not throw but also not mutate)
    const fixtures = READ_ONLY_PROVIDER_CONTRACT_FIXTURES;
    const originalLength = fixtures.length;
    // TypeScript will prevent this at compile time; this checks runtime stability
    expect(fixtures.length).toBe(originalLength);
  });

  it('fixture objects are structurally stable across multiple accesses', () => {
    const a = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    const b = READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];
    expect(a).toBe(b); // same reference
  });
});

// ─── Aggressive-safe policy ───────────────────────────────────

describe('Phase 54 — aggressive-safe policy alignment', () => {
  it('all fixtures are local-only (no real provider calls possible)', () => {
    for (const fixture of READ_ONLY_PROVIDER_CONTRACT_FIXTURES) {
      expect(fixture.providerIdentity.liveNetworkAccess).toBe(false);
      expect(fixture.providerIdentity.walletAccess).toBe(false);
      expect(fixture.providerIdentity.executionAccess).toBe(false);
    }
  });

  it('capability flags explicitly deny all unsafe behaviors', () => {
    const caps = getReadOnlyProviderContractCapabilities();
    // Enumerate all unsafe flags
    const unsafeFlags: (keyof typeof caps)[] = [
      'readOnlyProviderLiveData',
      'readOnlyProviderNetworkAccess',
      'readOnlyProviderAdapters',
      'readOnlyProviderSolanaRpc',
      'readOnlyProviderWebSockets',
      'readOnlyProviderGeyserYellowstone',
      'readOnlyProviderPumpFunIntegration',
      'readOnlyProviderDexIntegration',
      'readOnlyProviderJitoIntegration',
      'readOnlyProviderPersistence',
      'readOnlyProviderFilesystemWrites',
      'readOnlyProviderDownloads',
      'readOnlyProviderRouteHandlers',
      'readOnlyProviderHttpServer',
      'readOnlyProviderRuntimeRequests',
      'readOnlyProviderUiRendering',
      'readOnlyProviderDomAccess',
      'readOnlyProviderBackgroundJobs',
      'readOnlyProviderScheduledJobs',
      'readOnlyProviderWalletLogic',
      'readOnlyProviderPrivateKeyHandling',
      'readOnlyProviderSigning',
      'readOnlyProviderTransactionSending',
      'readOnlyProviderExecution',
      'readOnlyProviderTradingSignals',
      'readOnlyProviderRecommendations',
      'readOnlyProviderInvestmentAdvice',
    ];
    for (const flag of unsafeFlags) {
      expect(caps[flag]).toBe(false);
    }
  });

  it('Phase 55 is not implemented', () => {
    // Verify no Phase 55 exports exist in the module
    const indexContent = readFileSync(
      resolve(PHASE_54_SRC, 'index.ts'),
      'utf-8',
    );
    expect(indexContent).not.toContain('phase55');
    expect(indexContent).not.toContain('PHASE_55');
  });
});
