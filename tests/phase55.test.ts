/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1 tests.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURE_MAP,
  buildReadOnlyProviderAdapterMockFixture,
  buildReadOnlyProviderAdapterMockViewModel,
  buildReadOnlyProviderAdapterMockApiContract,
  listReadOnlyProviderAdapterMockFixtures,
  getReadOnlyProviderAdapterMockFixture,
  selectReadOnlyProviderAdapterMockFixture,
  runReadOnlyProviderAdapterMock,
  normalizeReadOnlyProviderAdapterMockFixture,
  serializeReadOnlyProviderAdapterMockFixture,
  areReadOnlyProviderAdapterMockFixturesEqual,
  validateReadOnlyProviderAdapterMockFixture,
  validateReadOnlyProviderAdapterMockSafety,
  getReadOnlyProviderAdapterMockCapabilities,
  stableDeterministicReadOnlyProviderAdapterMockChecksum,
  isValidReadOnlyProviderAdapterMockName,
  isValidReadOnlyProviderAdapterMockKind,
  isValidReadOnlyProviderAdapterMockGeneratedAt,
  isValidReadOnlyProviderAdapterMockSource,
  PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
  PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
} from '../apps/dashboard/src/read-only-provider-adapter-mocks/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE as ROOT_PHASE,
  READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES as ROOT_FIXTURES,
  listReadOnlyProviderAdapterMockFixtures as rootListFixtures,
} from '../apps/dashboard/src/index.js';
import {
  READ_ONLY_PROVIDER_CONTRACT_NAMES,
} from '../apps/dashboard/src/read-only-provider-contracts/index.js';
import {
  SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES,
} from '../apps/dashboard/src/synthetic-launch-intelligence/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_55_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/read-only-provider-adapter-mocks');
const PHASE_55_FILES = [
  'types.ts',
  'builders.ts',
  'fixtures.ts',
  'adapters.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 55 — source file existence', () => {
  for (const file of PHASE_55_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_55_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/READ_ONLY_PROVIDER_ADAPTER_MOCKS.md exists', () => {
    const content = readFileSync(
      resolve(REPO_ROOT, 'docs/READ_ONLY_PROVIDER_ADAPTER_MOCKS.md'),
      'utf-8',
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 55 — constants, names, kinds, count, map, list', () => {
  it('phase is 55 and root export is aligned', () => {
    expect(READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE).toBe(55);
    expect(ROOT_PHASE).toBe(55);
  });

  it('has 8 names and 8 kinds', () => {
    expect(READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES).toHaveLength(8);
    expect(READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS).toHaveLength(8);
  });

  it('fixtures and helpers are deterministic', () => {
    expect(READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES.length).toBeGreaterThanOrEqual(8);
    expect(rootListFixtures()).toEqual(READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES);
    expect(ROOT_FIXTURES).toEqual(READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES);

    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES) {
      expect(READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getReadOnlyProviderAdapterMockFixture(fixture.fixtureId)).toBe(fixture);
    }

    expect(getReadOnlyProviderAdapterMockFixture('missing')).toBeNull();
  });
});

describe('Phase 55 — runtime object structure and builder helpers', () => {
  it('build helpers are deterministic and produce stable IDs', () => {
    const fixtureA = buildReadOnlyProviderAdapterMockFixture({
      fixtureName: 'token-metadata-adapter-mock',
    });
    const fixtureB = buildReadOnlyProviderAdapterMockFixture({
      fixtureName: 'token-metadata-adapter-mock',
    });

    expect(fixtureA).toEqual(fixtureB);

    const viewA = buildReadOnlyProviderAdapterMockViewModel(fixtureA);
    const viewB = buildReadOnlyProviderAdapterMockViewModel(fixtureB);
    expect(viewA).toEqual(viewB);

    const contractA = buildReadOnlyProviderAdapterMockApiContract({ ...fixtureA, viewModel: viewA });
    const contractB = buildReadOnlyProviderAdapterMockApiContract({ ...fixtureB, viewModel: viewB });
    expect(contractA).toEqual(contractB);
  });

  it('all fixtures include required phase-55 surfaces', () => {
    const ids = READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES.map(fixture => fixture.fixtureId);
    const names = READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES.map(fixture => fixture.fixtureName);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);

    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES) {
      expect(fixture.phase).toBe(55);
      expect(fixture.adapterIdentity.mockOnly).toBe(true);
      expect(fixture.adapterIdentity.readOnly).toBe(true);
      expect(fixture.adapterIdentity.liveNetworkAccess).toBe(false);
      expect(fixture.adapterIdentity.walletAccess).toBe(false);
      expect(fixture.adapterIdentity.executionAccess).toBe(false);
      expect(fixture.adapterCapabilityProfile.fixtureOnlySupport).toBe(true);
      expect(fixture.adapterHealthProfile.noActualHealthCheck).toBe(true);
      expect(fixture.mockRequest.fixtureOnly).toBe(true);
      expect(fixture.mockRequest.readOnly).toBe(true);
      expect(fixture.mockRequest.unsafeLiveRequested).toBe(false);
      expect(fixture.mockResult.meta.generatedAt).toBe(
        PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
      );
      expect(fixture.mockResult.safety.nonAdvisory).toBe(true);
      expect(fixture.apiContracts.list.contractKind).toBe('list');
      expect(fixture.apiContracts.detail.contractKind).toBe('detail');
      expect(fixture.apiContracts.summary.contractKind).toBe('summary');
      expect(fixture.apiContracts.errors).toHaveLength(2);
      expect(fixture.selectorExamples.length).toBeGreaterThan(0);
    }
  });
});

describe('Phase 55 — adapter identities, requests, results, and run helper', () => {
  it('fixtures link to Phase 54 contract names and Phase 53 synthetic fixture names', () => {
    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES) {
      expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain(
        fixture.sourceProviderContractName as (typeof READ_ONLY_PROVIDER_CONTRACT_NAMES)[number],
      );
      expect(SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES).toContain(
        fixture.mockRequest.sourceSyntheticLaunchFixtureName as (typeof SYNTHETIC_LAUNCH_INTELLIGENCE_SCENARIO_NAMES)[number],
      );
    }
  });

  it('runReadOnlyProviderAdapterMock returns fixture result for valid deterministic query', () => {
    const fixture = READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES.find(
      entry => entry.fixtureKind === 'mock_token_metadata_adapter',
    );
    if (!fixture) throw new Error('missing token metadata fixture');

    const result = runReadOnlyProviderAdapterMock({
      fixtureId: fixture.fixtureId,
      requestedResponseKind: fixture.mockResult.resultKind,
      sourceSyntheticLaunchFixtureName: fixture.mockRequest.sourceSyntheticLaunchFixtureName,
    });

    expect(result.success).toBe(true);
    expect(result.matched).toBe(true);
    expect(result.error).toBeNull();
  });

  it('run helper returns deterministic safety errors for unsafe/invalid paths', () => {
    const unsafe = runReadOnlyProviderAdapterMock({ unsafeLiveRequested: true });
    expect(unsafe.success).toBe(false);
    expect(unsafe.error?.errorCode).toBe('UNSAFE_CAPABILITY_REQUESTED');

    const unsupported = runReadOnlyProviderAdapterMock({
      adapterKind: 'mock_token_metadata_adapter',
      requestedResponseKind: 'synthetic_wallet_cluster_response',
    });
    expect(unsupported.success).toBe(false);
    expect(unsupported.error?.errorCode).toBe('UNSUPPORTED_SYNTHETIC_DOMAIN');

    const invalid = runReadOnlyProviderAdapterMock({ fixtureId: 'phase55-missing' });
    expect(invalid.success).toBe(false);
    expect(invalid.error?.errorCode).toBe('INVALID_DETERMINISTIC_MOCK_QUERY');
  });

  it('disabled unsafe fixture always yields provider-disabled behavior', () => {
    const result = runReadOnlyProviderAdapterMock({ adapterKind: 'mock_disabled_unsafe_adapter' });
    expect(result.success).toBe(false);
    expect(result.error?.errorCode).toBe('PROVIDER_DISABLED');
  });
});

describe('Phase 55 — selectors, normalization, serialization, equality', () => {
  it('selectors return deterministic local-only results', () => {
    const fixture = READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES[0];
    const selectedById = selectReadOnlyProviderAdapterMockFixture({ fixtureId: fixture?.fixtureId });
    expect(selectedById.matched).toBe(true);
    expect(selectedById.selectedFixtureId).toBe(fixture?.fixtureId);

    const selectedByKind = selectReadOnlyProviderAdapterMockFixture({
      adapterKind: 'mock_wallet_cluster_adapter',
    });
    expect(selectedByKind.selectedAdapterKind).toBe('mock_wallet_cluster_adapter');

    const unmatched = selectReadOnlyProviderAdapterMockFixture({ fixtureId: 'phase55-missing' });
    expect(unmatched.matched).toBe(false);
  });

  it('normalization and serialization are stable', () => {
    const base = clone(READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES[0]);
    const scrambled = {
      ...clone(base),
      selectorExamples: [...base.selectorExamples].reverse(),
    };

    expect(normalizeReadOnlyProviderAdapterMockFixture(scrambled)).toEqual(
      normalizeReadOnlyProviderAdapterMockFixture(base),
    );
    expect(serializeReadOnlyProviderAdapterMockFixture(scrambled)).toBe(
      serializeReadOnlyProviderAdapterMockFixture(base),
    );
    expect(areReadOnlyProviderAdapterMockFixturesEqual(scrambled, base)).toBe(true);
  });

  it('checksum and isValid helpers are deterministic', () => {
    const checksum = stableDeterministicReadOnlyProviderAdapterMockChecksum('phase55-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicReadOnlyProviderAdapterMockChecksum('phase55-check')).toBe(checksum);

    for (const name of READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES) {
      expect(isValidReadOnlyProviderAdapterMockName(name)).toBe(true);
    }
    expect(isValidReadOnlyProviderAdapterMockName('bad')).toBe(false);

    for (const kind of READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS) {
      expect(isValidReadOnlyProviderAdapterMockKind(kind)).toBe(true);
    }
    expect(isValidReadOnlyProviderAdapterMockKind('bad_kind')).toBe(false);

    expect(
      isValidReadOnlyProviderAdapterMockGeneratedAt('2026-01-23T00:00:00.000Z'),
    ).toBe(true);
    expect(
      isValidReadOnlyProviderAdapterMockSource('phase55_read_only_provider_adapter_mocks_v1'),
    ).toBe(true);
  });
});

describe('Phase 55 — validation success/failure and safety rejection', () => {
  it('all fixtures validate and pass safety scan', () => {
    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES) {
      const validation = validateReadOnlyProviderAdapterMockFixture(fixture);
      expect(validation.valid).toBe(true);
      expect(validation.issues).toEqual([]);

      const safety = validateReadOnlyProviderAdapterMockSafety(fixture);
      expect(safety.safe).toBe(true);
      expect(safety.violations).toEqual([]);
    }
  });

  it('validation rejects corrupted fixtures', () => {
    const fixture = clone(READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES[0]);

    expect(validateReadOnlyProviderAdapterMockFixture({ ...fixture, phase: 54 }).valid).toBe(false);

    expect(
      validateReadOnlyProviderAdapterMockFixture({
        ...fixture,
        fixtureName: 'unsafe-name',
      }).valid,
    ).toBe(false);

    expect(
      validateReadOnlyProviderAdapterMockFixture({
        ...fixture,
        adapterIdentity: { ...fixture.adapterIdentity, liveNetworkAccess: true },
      }).valid,
    ).toBe(false);

    expect(
      validateReadOnlyProviderAdapterMockFixture({
        ...fixture,
        capabilityFlags: { ...fixture.capabilityFlags, readOnlyProviderAdapterMockNetworkAccess: true },
      }).valid,
    ).toBe(false);

    const unsafe = {
      ...fixture,
      unsafeText: 'https://unsafe.example fetch( wallet signTransaction',
    };
    const safetyResult = validateReadOnlyProviderAdapterMockSafety(unsafe);
    expect(safetyResult.safe).toBe(false);
    expect(safetyResult.violations.length).toBeGreaterThan(0);
    expect(validateReadOnlyProviderAdapterMockFixture(unsafe).valid).toBe(false);
  });
});

describe('Phase 55 — capabilities and propagation', () => {
  it('phase capability flags are correct', () => {
    const caps = getReadOnlyProviderAdapterMockCapabilities();
    expect(caps.readOnlyProviderAdapterMocks).toBe(true);
    expect(caps.syntheticReadOnlyProviderAdapterMocks).toBe(true);
    expect(caps.deterministicReadOnlyProviderAdapterMocks).toBe(true);
    expect(caps.readOnlyProviderAdapterMockApiContracts).toBe(true);

    expect(caps.readOnlyProviderAdapterMockLiveData).toBe(false);
    expect(caps.readOnlyProviderAdapterMockNetworkAccess).toBe(false);
    expect(caps.readOnlyProviderAdapterMockExecution).toBe(false);
    expect(caps.readOnlyProviderAdapterMockInvestmentAdvice).toBe(false);
  });

  it('dashboard/read-only-api capability propagation includes phase 55 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities();
    expect(dashboardCaps.readOnlyProviderAdapterMocks).toBe(true);
    expect(dashboardCaps.readOnlyProviderAdapterMockNetworkAccess).toBe(false);

    const apiCaps = getLocalReadOnlyApiCapabilities();
    expect(apiCaps.readOnlyProviderAdapterMocks).toBe(true);
    expect(apiCaps.readOnlyProviderAdapterMockExecution).toBe(false);
  });
});

describe('Phase 55 — safety posture, determinism, immutability, and policy alignment', () => {
  it('does not mutate source fixtures when clones are modified', () => {
    const source = READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES[0];
    const copy = clone(source);
    copy.mockResult.data = { touched: true };
    expect(source.mockResult.data).not.toEqual({ touched: true });
  });

  it('phase files avoid nondeterministic and runtime/network/server primitives', () => {
    for (const file of PHASE_55_FILES) {
      const content = readFileSync(resolve(PHASE_55_SRC, file), 'utf-8');
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
        expect(content).not.toMatch(/\bfastify\b/i);
        expect(content).not.toMatch(/\bexpress\b/i);
        expect(content).not.toMatch(/listen\(/);
      }
    }
  });

  it('all fixtures remain local-only, synthetic, and non-executable', () => {
    for (const fixture of READ_ONLY_PROVIDER_ADAPTER_MOCK_FIXTURES) {
      expect(fixture.safety.nonAdvisory).toBe(true);
      expect(fixture.safety.noLiveData).toBe(true);
      expect(fixture.safety.noNetworkAccess).toBe(true);
      expect(fixture.safety.noWalletAccess).toBe(true);
      expect(fixture.safety.noExecution).toBe(true);
    }
  });

  it('Phase 56 is preview only and not implemented here', () => {
    const file = readFileSync(
      resolve(REPO_ROOT, 'docs/READ_ONLY_PROVIDER_ADAPTER_MOCKS.md'),
      'utf-8',
    );
    expect(file).toContain('Phase 56 — Synthetic Event Stream Lifecycle v1');
    expect(file).toContain('not implemented');
  });
});
