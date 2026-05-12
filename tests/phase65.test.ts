import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURE_MAP,
  listFirstReadOnlyProviderAdapterFixtures,
  getFirstReadOnlyProviderAdapterFixture,
  buildFirstReadOnlyProviderAdapterFixture,
  buildFirstReadOnlyProviderConfig,
  buildFirstReadOnlyProviderCapabilities,
  buildFirstReadOnlyProviderTransport,
  buildFirstReadOnlyProviderClientContract,
  buildFirstReadOnlyProviderResponseMapping,
  buildFirstReadOnlyProviderErrorNormalization,
  buildFirstReadOnlyProviderConformanceCheck,
  buildFirstReadOnlyProviderHealth,
  buildFirstReadOnlyProviderSmokeGuard,
  buildFirstReadOnlyProviderAdapterReport,
  buildFirstReadOnlyProviderAdapterViewModel,
  buildFirstReadOnlyProviderAdapterApiContract,
  selectFirstReadOnlyProviderAdapterFixture,
  validateFirstReadOnlyProviderAdapterFixture,
  validateFirstReadOnlyProviderAdapterSafety,
  normalizeFirstReadOnlyProviderAdapterFixture,
  serializeFirstReadOnlyProviderAdapterFixture,
  areFirstReadOnlyProviderAdapterFixturesEqual,
  stableDeterministicFirstReadOnlyProviderAdapterChecksum,
  getFirstReadOnlyProviderAdapterCapabilities,
  PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT,
  FIRST_READ_ONLY_PROVIDER_CONFIG_STATES,
  FIRST_READ_ONLY_PROVIDER_TRANSPORT_KINDS,
  FIRST_READ_ONLY_PROVIDER_ERROR_CATEGORIES,
  FIRST_READ_ONLY_PROVIDER_HEALTH_STATES,
} from '../apps/dashboard/src/first-read-only-provider-adapter/index.js';
import {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
} from '../apps/dashboard/src/read-only-solana-provider-boundary/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
} from '../apps/dashboard/src/read-only-provider-adapter-gate/index.js';
import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE as ROOT_PHASE,
  FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_65_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/first-read-only-provider-adapter');
const PHASE_65_FILES = [
  'types.ts',
  'provider-config.ts',
  'provider-capabilities.ts',
  'provider-transport.ts',
  'provider-client.ts',
  'response-mapping.ts',
  'error-normalization.ts',
  'conformance.ts',
  'health.ts',
  'smoke-guard.ts',
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

describe('Phase 65 — source file existence', () => {
  for (const file of PHASE_65_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_65_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/FIRST_REAL_READ_ONLY_PROVIDER_ADAPTER.md exists', () => {
    const content = readFileSync(
      resolve(REPO_ROOT, 'docs/FIRST_REAL_READ_ONLY_PROVIDER_ADAPTER.md'),
      'utf-8',
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 65 — constants, names, kinds, count, map, list', () => {
  it('constants and root exports align', () => {
    expect(FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE).toBe(65);
    expect(ROOT_PHASE).toBe(65);
    expect(ROOT_FIXTURES).toEqual(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES);
    expect(PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT).toBe('2026-05-12T00:00:00.000Z');
  });

  it('has deterministic names/kinds and fixture count', () => {
    expect(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES).toHaveLength(8);
    expect(FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS).toHaveLength(8);
    expect(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES).toHaveLength(8);
  });

  it('map/list/get helpers are deterministic', () => {
    expect(listFirstReadOnlyProviderAdapterFixtures()).toEqual(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES);
    for (const fixture of FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES) {
      expect(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getFirstReadOnlyProviderAdapterFixture(fixture.fixtureId)).toBe(fixture);
    }
    expect(getFirstReadOnlyProviderAdapterFixture('missing')).toBeNull();
  });
});

describe('Phase 65 — fixture structure and linkage', () => {
  it('fixtures include required deterministic surfaces', () => {
    for (const fixture of FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES) {
      expect(fixture.phase).toBe(65);
      expect(fixture.providerConfig.disabledByDefault).toBe(true);
      expect(fixture.providerConfig.offlineFixtureMode).toBe(true);
      expect(fixture.providerConfig.liveSmokeEnabled).toBe(false);
      expect(fixture.providerConfig.networkAccessDefault).toBe(false);
      expect(fixture.providerCapabilities.writeMethods).toBe(false);
      expect(fixture.providerCapabilities.walletRequired).toBe(false);
      expect(fixture.providerCapabilities.signingRequired).toBe(false);
      expect(fixture.providerCapabilities.transactionSending).toBe(false);
      expect(fixture.clientContract.readOnly).toBe(true);
      expect(fixture.frozenResponseFixture.fixtureOnly).toBe(true);
      expect(fixture.frozenResponseFixture.liveData).toBe(false);
      expect(fixture.frozenResponseFixture.endpoint).toBeNull();
      expect(fixture.frozenResponseFixture.providerSdkReference).toBeNull();
      expect(fixture.responseMapping.noLiveDataClaim).toBe(true);
      expect(fixture.responseMapping.noWriteCapability).toBe(true);
      expect(fixture.smokeGuard.canRun).toBe(false);
      expect(fixture.smokeGuard.status).toBe('disabled');
      expect(fixture.apiContracts.errors).toHaveLength(2);
      expect(fixture.selectorExamples.length).toBeGreaterThan(0);
    }
  });

  it('fixtures link to Phase 64 boundary and Phase 63 gate names', () => {
    for (const fixture of FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES) {
      expect(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES).toContain(
        fixture.sourceBoundaryFixtureName as (typeof READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES)[number],
      );
      expect(READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES).toContain(
        fixture.sourceGateFixtureName as (typeof READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES)[number],
      );
    }
  });

  it('config/transport/error/health state constants are complete', () => {
    expect(FIRST_READ_ONLY_PROVIDER_CONFIG_STATES).toHaveLength(7);
    expect(FIRST_READ_ONLY_PROVIDER_TRANSPORT_KINDS).toHaveLength(2);
    expect(FIRST_READ_ONLY_PROVIDER_ERROR_CATEGORIES).toHaveLength(8);
    expect(FIRST_READ_ONLY_PROVIDER_HEALTH_STATES).toHaveLength(6);
  });
});

describe('Phase 65 — helper builders', () => {
  it('fixture builder is deterministic', () => {
    const a = buildFirstReadOnlyProviderAdapterFixture({ fixtureName: 'offline-token-metadata-success' });
    const b = buildFirstReadOnlyProviderAdapterFixture({ fixtureName: 'offline-token-metadata-success' });
    expect(a).toEqual(b);
  });

  it('individual builders produce expected read-only contracts', () => {
    const config = buildFirstReadOnlyProviderConfig({
      fixtureId: 'phase65-fixture-sample',
      mode: 'offline_fixture_mode',
    });
    const providerCaps = buildFirstReadOnlyProviderCapabilities({ fixtureId: 'phase65-fixture-sample' });
    const transport = buildFirstReadOnlyProviderTransport({
      fixtureId: 'phase65-fixture-sample',
      transportKind: 'offline_fixture_transport',
    });
    const client = buildFirstReadOnlyProviderClientContract({ fixtureId: 'phase65-fixture-sample' });
    const mapping = buildFirstReadOnlyProviderResponseMapping({
      fixtureId: 'phase65-fixture-sample',
      missingRequiredFields: [],
    });
    const errors = buildFirstReadOnlyProviderErrorNormalization({
      fixtureId: 'phase65-fixture-sample',
      primaryCategory: 'provider_unavailable',
    });
    const conformance = buildFirstReadOnlyProviderConformanceCheck({
      fixtureId: 'phase65-fixture-sample',
      mappingComplete: true,
      gateOpen: true,
    });
    const health = buildFirstReadOnlyProviderHealth({
      fixtureId: 'phase65-fixture-sample',
      healthState: 'offline_fixture_ready',
    });
    const smokeGuard = buildFirstReadOnlyProviderSmokeGuard({
      fixtureId: 'phase65-fixture-sample',
      config: {
        allowLiveSmoke: false,
        explicitGateAccepted: false,
        envProvided: false,
        allowNetworkInTests: false,
      },
    });
    const report = buildFirstReadOnlyProviderAdapterReport({
      fixtureId: 'phase65-fixture-sample',
      configState: 'offline_fixture_mode',
      conformancePass: true,
      smokeStatus: smokeGuard.status,
      healthState: health.healthState,
      transportKind: transport.transportKind,
    });

    expect(config.liveSmokeEnabled).toBe(false);
    expect(providerCaps.writeMethods).toBe(false);
    expect(transport.networkAccessDefault).toBe(false);
    expect(client.unsupportedWriteMethods).toContain('sendTransaction');
    expect(mapping.requiredBoundaryFields).toHaveLength(5);
    expect(errors.categories).toHaveLength(8);
    expect(conformance.walletSigningSendingAbsence).toBe(true);
    expect(health.healthy).toBe(true);
    expect(smokeGuard.canRun).toBe(false);
    expect(report.safetySummary.toLowerCase()).toContain('read-only');
  });

  it('view-model and api contract builders are deterministic', () => {
    const fixture = FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES[0]!;
    const viewModel = buildFirstReadOnlyProviderAdapterViewModel(fixture);
    const contracts = buildFirstReadOnlyProviderAdapterApiContract({ ...fixture, viewModel });
    expect(contracts.list.contractKind).toBe('list');
    expect(contracts.detail.contractKind).toBe('detail');
    expect(contracts.summary.contractKind).toBe('summary');
  });
});

describe('Phase 65 — selectors, normalization, serialization, equality', () => {
  it('selectors return deterministic local-only results', () => {
    const fixture = FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES[0]!;
    const selected = selectFirstReadOnlyProviderAdapterFixture({ fixtureId: fixture.fixtureId });
    expect(selected.matched).toBe(true);
    expect(selected.selectedFixtureId).toBe(fixture.fixtureId);

    const unmatched = selectFirstReadOnlyProviderAdapterFixture({ fixtureId: 'missing' });
    expect(unmatched.matched).toBe(false);
  });

  it('normalization and serialization are stable', () => {
    const base = clone(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES[0]!);
    const scrambled = {
      ...clone(base),
      selectorExamples: [...base.selectorExamples].reverse(),
      responseMapping: {
        ...base.responseMapping,
        missingRequiredFields: [...base.responseMapping.missingRequiredFields].reverse(),
      },
    };

    expect(normalizeFirstReadOnlyProviderAdapterFixture(scrambled)).toEqual(
      normalizeFirstReadOnlyProviderAdapterFixture(base),
    );
    expect(serializeFirstReadOnlyProviderAdapterFixture(scrambled)).toBe(
      serializeFirstReadOnlyProviderAdapterFixture(base),
    );
    expect(areFirstReadOnlyProviderAdapterFixturesEqual(scrambled, base)).toBe(true);
  });

  it('checksum helper is stable', () => {
    const checksum = stableDeterministicFirstReadOnlyProviderAdapterChecksum('phase65-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicFirstReadOnlyProviderAdapterChecksum('phase65-check')).toBe(checksum);
  });
});

describe('Phase 65 — validation and safety rejection paths', () => {
  it('validation and safety pass for baseline fixtures', () => {
    for (const fixture of FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES) {
      const validation = validateFirstReadOnlyProviderAdapterFixture(fixture);
      if (!validation.valid) {
        throw new Error(`${fixture.fixtureName}: ${JSON.stringify(validation.issues)}`);
      }
      expect(validation.valid).toBe(true);
      expect(validateFirstReadOnlyProviderAdapterSafety(fixture)).toEqual({ safe: true, violations: [] });
    }
  });

  it('validation rejects write/sign/send/wallet violations', () => {
    const fixture = clone(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES[0]!);
    fixture.providerCapabilities.writeMethods = true as never;
    fixture.providerCapabilities.walletRequired = true as never;
    fixture.providerCapabilities.signingRequired = true as never;
    fixture.providerCapabilities.transactionSending = true as never;
    const validation = validateFirstReadOnlyProviderAdapterFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'WRITE_METHODS_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'WALLET_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'SIGNING_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'SENDING_FORBIDDEN')).toBe(true);
  });

  it('validation rejects unsafe live smoke, endpoint, api key, and sdk requirements', () => {
    const fixture = clone(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES[0]!);
    fixture.smokeGuard.canRun = true as never;
    fixture.frozenResponseFixture.endpoint = 'https://unsafe.example' as never;
    fixture.frozenResponseFixture.apiKeyRequired = true as never;
    fixture.frozenResponseFixture.providerSdkReference = 'sdk-ref' as never;
    const validation = validateFirstReadOnlyProviderAdapterFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'LIVE_SMOKE_UNSAFE_ENABLEMENT')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'NETWORK_ENDPOINT_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'API_KEY_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'PROVIDER_SDK_FORBIDDEN')).toBe(true);
  });

  it('validation rejects missing required field mapping and advisory text', () => {
    const fixture = clone(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES[0]!);
    fixture.responseMapping.requiredBoundaryFields = ['accountAddress'] as never;
    fixture.adapterReport.capabilitySummary = 'buy now signal with profit' as never;
    const validation = validateFirstReadOnlyProviderAdapterFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'MISSING_REQUIRED_FIELD_MAPPING')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
  });

  it('validation rejects unsafe capability flag mutation', () => {
    const fixture = clone(FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES[0]!);
    fixture.capabilityFlags.firstReadOnlyProviderExecution = true as never;
    const validation = validateFirstReadOnlyProviderAdapterFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
  });
});

describe('Phase 65 — capabilities and propagation', () => {
  it('module capability flags are correct', () => {
    const caps = getFirstReadOnlyProviderAdapterCapabilities();
    expect(caps.firstReadOnlyProviderAdapter).toBe(true);
    expect(caps.firstReadOnlyProviderAdapterFixtures).toBe(true);
    expect(caps.firstReadOnlyProviderLiveDataDefault).toBe(false);
    expect(caps.firstReadOnlyProviderNetworkAccessDefault).toBe(false);
    expect(caps.firstReadOnlyProviderExecution).toBe(false);
  });

  it('dashboard and read-only-api capabilities include phase 65 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities() as Record<string, unknown>;
    expect(dashboardCaps['firstReadOnlyProviderAdapter']).toBe(true);
    expect(dashboardCaps['firstReadOnlyProviderAdapterFixtures']).toBe(true);
    expect(dashboardCaps['firstReadOnlyProviderExecution']).toBe(false);

    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(apiCaps['firstReadOnlyProviderAdapter']).toBe(true);
    expect(apiCaps['firstReadOnlyProviderAdapterFixtures']).toBe(true);
    expect(apiCaps['firstReadOnlyProviderExecution']).toBe(false);
  });
});

describe('Phase 65 — safety scan and policy alignment', () => {
  it('phase files avoid nondeterministic/runtime primitives', () => {
    for (const file of PHASE_65_FILES) {
      const content = readFileSync(resolve(PHASE_65_SRC, file), 'utf-8');
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

  it('source immutability holds when clone is mutated', () => {
    const source = FIRST_READ_ONLY_PROVIDER_ADAPTER_FIXTURES[0]!;
    const copy = clone(source);
    copy.responseMapping.missingRequiredFields = ['mutated'];
    expect(source.responseMapping.missingRequiredFields).not.toEqual(['mutated']);
  });

  it('Phase 66 is preview only in docs', () => {
    const docs = readFileSync(resolve(REPO_ROOT, 'docs/FIRST_REAL_READ_ONLY_PROVIDER_ADAPTER.md'), 'utf-8');
    expect(docs).toContain('Phase 66 — Multi-Provider Read-Only Abstraction and Normalization v1');
    expect(docs.toLowerCase()).toContain('not implemented');
  });
});
