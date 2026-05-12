import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURE_MAP,
  listReadOnlySolanaProviderBoundaryFixtures,
  getReadOnlySolanaProviderBoundaryFixture,
  buildReadOnlySolanaProviderBoundaryFixture,
  buildReadOnlySolanaMockToRealMapping,
  buildReadOnlySolanaFieldMappingRule,
  buildReadOnlySolanaErrorNormalizationRule,
  buildReadOnlySolanaConformanceCheck,
  buildReadOnlySolanaBoundaryState,
  buildReadOnlySolanaBoundaryReport,
  buildReadOnlySolanaProviderBoundaryViewModel,
  buildReadOnlySolanaProviderBoundaryApiContract,
  selectReadOnlySolanaProviderBoundaryFixture,
  validateReadOnlySolanaProviderBoundaryFixture,
  validateReadOnlySolanaProviderBoundarySafety,
  normalizeReadOnlySolanaProviderBoundaryFixture,
  serializeReadOnlySolanaProviderBoundaryFixture,
  areReadOnlySolanaProviderBoundaryFixturesEqual,
  stableDeterministicReadOnlySolanaProviderBoundaryChecksum,
  getReadOnlySolanaProviderBoundaryCapabilities,
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
} from '../apps/dashboard/src/read-only-solana-provider-boundary/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
} from '../apps/dashboard/src/read-only-provider-adapter-gate/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES,
} from '../apps/dashboard/src/read-only-provider-adapter-mocks/index.js';
import {
  READ_ONLY_PROVIDER_CONTRACT_NAMES,
} from '../apps/dashboard/src/read-only-provider-contracts/index.js';
import {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE as ROOT_PHASE,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_64_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/read-only-solana-provider-boundary');
const PHASE_64_FILES = [
  'types.ts',
  'mock-to-real-mapping.ts',
  'field-mapping.ts',
  'error-normalization.ts',
  'conformance.ts',
  'boundary-state.ts',
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

describe('Phase 64 — source file existence', () => {
  for (const file of PHASE_64_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_64_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/READ_ONLY_SOLANA_PROVIDER_BOUNDARY.md exists', () => {
    const content = readFileSync(
      resolve(REPO_ROOT, 'docs/READ_ONLY_SOLANA_PROVIDER_BOUNDARY.md'),
      'utf-8',
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 64 — constants, names, kinds, fixtures, root exports', () => {
  it('constants and root exports align', () => {
    expect(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE).toBe(64);
    expect(ROOT_PHASE).toBe(64);
    expect(ROOT_FIXTURES).toEqual(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES);
    expect(PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT).toBe('2026-05-12T00:00:00.000Z');
  });

  it('has deterministic names/kinds and fixture count', () => {
    expect(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES).toHaveLength(8);
    expect(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS).toHaveLength(8);
    expect(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES).toHaveLength(8);
  });

  it('map/list/get helpers are deterministic', () => {
    expect(listReadOnlySolanaProviderBoundaryFixtures()).toEqual(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES);
    for (const fixture of READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES) {
      expect(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getReadOnlySolanaProviderBoundaryFixture(fixture.fixtureId)).toBe(fixture);
    }
    expect(getReadOnlySolanaProviderBoundaryFixture('missing')).toBeNull();
  });
});

describe('Phase 64 — fixture structure, linkage, states, mappings, reports', () => {
  it('fixtures include required deterministic surfaces', () => {
    for (const fixture of READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES) {
      expect(fixture.phase).toBe(64);
      expect(fixture.safety.fixtureOnly).toBe(true);
      expect(fixture.safety.localOnly).toBe(true);
      expect(fixture.boundaryState.notLive).toBe(true);
      expect(fixture.futureRealResponsePlaceholder.futureOnly).toBe(true);
      expect(fixture.futureRealResponsePlaceholder.liveData).toBe(false);
      expect(fixture.futureRealResponsePlaceholder.networkEndpoint).toBeNull();
      expect(fixture.futureRealResponsePlaceholder.providerSdk).toBeNull();
      expect(fixture.futureRealResponsePlaceholder.writeCapability).toBe(false);
      expect(fixture.fieldMappings.length).toBeGreaterThanOrEqual(12);
      expect(fixture.errorNormalizationRules.length).toBe(8);
      expect(fixture.conformanceChecks.length).toBe(7);
      expect(fixture.boundaryReport.noLiveExecution).toBe(true);
      expect(fixture.boundaryReport.noRecommendationOutput).toBe(true);
    }
  });

  it('fixtures reference Phase 63/55/54 names where practical', () => {
    for (const fixture of READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES) {
      expect(READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES).toContain(
        fixture.sourceGateFixtureName as (typeof READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES)[number],
      );
      expect(READ_ONLY_PROVIDER_CONTRACT_NAMES).toContain(
        fixture.sourceProviderContractName as (typeof READ_ONLY_PROVIDER_CONTRACT_NAMES)[number],
      );
      expect(READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES).toContain(
        fixture.sourceMockAdapterName as (typeof READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES)[number],
      );
    }
  });

  it('builders and selectors work deterministically', () => {
    const builtA = buildReadOnlySolanaProviderBoundaryFixture({
      fixtureName: 'token-metadata-boundary-ready',
    });
    const builtB = buildReadOnlySolanaProviderBoundaryFixture({
      fixtureName: 'token-metadata-boundary-ready',
    });
    expect(builtA).toEqual(builtB);

    const selected = selectReadOnlySolanaProviderBoundaryFixture({ fixtureId: builtA.fixtureId });
    expect(selected.matched).toBe(true);
    expect(selected.selectedFixtureId).toBe(builtA.fixtureId);

    const unmatched = selectReadOnlySolanaProviderBoundaryFixture({ fixtureId: 'missing' });
    expect(unmatched.matched).toBe(false);
  });

  it('helper builders produce typed deterministic models', () => {
    const state = buildReadOnlySolanaBoundaryState({
      fixtureId: 'phase64-fixture-test',
      stateKind: 'field_mapping_ready',
      futureOnly: true,
      allowedByGate: true,
    });
    const mapping = buildReadOnlySolanaFieldMappingRule({
      fixtureId: 'phase64-fixture-test',
      sourceContractName: 'token-metadata-contract',
      mappingKind: 'token_metadata_reference_mapping',
      sourceMockField: 'mock.tokenMetadata',
      futureRealField: 'future.tokenMetadata',
      normalizedField: 'tokenMetadata',
      required: true,
      nullable: true,
      coverageStatus: 'covered',
      semanticCaveat: 'Boundary only.',
    });
    const mockToReal = buildReadOnlySolanaMockToRealMapping({
      fixtureId: 'phase64-fixture-test',
      sourceMockAdapterName: 'token-metadata-adapter-mock',
      sourceProviderContractName: 'token-metadata-contract',
      fieldMappings: [mapping],
    });
    const errorRule = buildReadOnlySolanaErrorNormalizationRule({
      fixtureId: 'phase64-fixture-test',
      category: 'gate_closed',
      sourceErrorCode: 'GATE_CLOSED',
      normalizedErrorCode: 'BOUNDARY_GATE_CLOSED',
      normalizedCategory: 'boundary',
      safetyNote: 'Deterministic.',
    });
    const conformance = buildReadOnlySolanaConformanceCheck({
      fixtureId: 'phase64-fixture-test',
      checkKind: 'gate_compatibility',
      pass: true,
      summary: 'ok',
    });
    const report = buildReadOnlySolanaBoundaryReport({
      fixtureId: 'phase64-fixture-test',
      boundaryState: state,
      fieldMappings: [mapping],
      conformanceChecks: [conformance],
      errorNormalizationRules: [errorRule],
      gateBlocked: false,
    });
    const fixture = READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES[0]!;
    const view = buildReadOnlySolanaProviderBoundaryViewModel(fixture);
    const api = buildReadOnlySolanaProviderBoundaryApiContract({ ...fixture, viewModel: view });

    expect(mockToReal.mappingStatus).toBe('ready');
    expect(report.noLiveExecution).toBe(true);
    expect(api.list.contractKind).toBe('list');
    expect(api.detail.contractKind).toBe('detail');
    expect(api.summary.contractKind).toBe('summary');
  });
});

describe('Phase 64 — normalization, serialization, equality, determinism', () => {
  it('normalization/serialization/equality are deterministic', () => {
    const base = clone(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES[0]!);
    const scrambled = {
      ...clone(base),
      fieldMappings: [...base.fieldMappings].reverse(),
      errorNormalizationRules: [...base.errorNormalizationRules].reverse(),
      conformanceChecks: [...base.conformanceChecks].reverse(),
      selectorExamples: [...base.selectorExamples].reverse(),
    };
    expect(normalizeReadOnlySolanaProviderBoundaryFixture(scrambled)).toEqual(
      normalizeReadOnlySolanaProviderBoundaryFixture(base),
    );
    expect(serializeReadOnlySolanaProviderBoundaryFixture(scrambled)).toBe(
      serializeReadOnlySolanaProviderBoundaryFixture(base),
    );
    expect(areReadOnlySolanaProviderBoundaryFixturesEqual(scrambled, base)).toBe(true);
  });

  it('checksum helper is stable', () => {
    const checksum = stableDeterministicReadOnlySolanaProviderBoundaryChecksum('phase64-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicReadOnlySolanaProviderBoundaryChecksum('phase64-check')).toBe(checksum);
  });
});

describe('Phase 64 — validation and safety rejection paths', () => {
  it('validation and safety pass for baseline fixtures', () => {
    for (const fixture of READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES) {
      const validation = validateReadOnlySolanaProviderBoundaryFixture(fixture);
      expect(validation.valid).toBe(true);
      expect(validateReadOnlySolanaProviderBoundarySafety(fixture)).toEqual({ safe: true, violations: [] });
    }
  });

  it('validation rejects missing source gate/contract/mock', () => {
    const fixture = clone(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES[0]!);
    fixture.sourceGateFixtureName = 'missing-gate' as never;
    fixture.sourceProviderContractName = 'missing-contract' as never;
    fixture.sourceMockAdapterName = 'missing-mock' as never;
    const validation = validateReadOnlySolanaProviderBoundaryFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'MISSING_SOURCE_GATE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'MISSING_SOURCE_CONTRACT')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'MISSING_SOURCE_MOCK')).toBe(true);
  });

  it('validation rejects unmapped required field mismatch', () => {
    const fixture = clone(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES[0]!);
    fixture.fieldMappings[0] = { ...fixture.fieldMappings[0], coverageStatus: 'unmapped' };
    const validation = validateReadOnlySolanaProviderBoundaryFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNMAPPED_REQUIRED_FIELD_MISMATCH')).toBe(true);
  });

  it('validation rejects live placeholder/network/sdk/api key/write/wallet/signing/sending flags', () => {
    const fixture = clone(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES[0]!);
    fixture.futureRealResponsePlaceholder.liveData = true as never;
    fixture.futureRealResponsePlaceholder.networkEndpoint = 'https://unsafe.example' as never;
    fixture.futureRealResponsePlaceholder.providerSdk = 'unsafe-sdk' as never;
    fixture.futureRealResponsePlaceholder.apiKeyRequired = true as never;
    fixture.futureRealResponsePlaceholder.writeCapability = true as never;
    fixture.futureRealResponsePlaceholder.walletRequired = true as never;
    fixture.futureRealResponsePlaceholder.signingRequired = true as never;
    fixture.futureRealResponsePlaceholder.transactionSendingRequired = true as never;
    const validation = validateReadOnlySolanaProviderBoundaryFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'NETWORK_ENDPOINT_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'PROVIDER_SDK_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'API_KEY_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'WRITE_CAPABILITY_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'WALLET_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'SIGNING_FORBIDDEN')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'SENDING_FORBIDDEN')).toBe(true);
  });

  it('validation rejects advisory/unsafe text and unsafe capability flag mutation', () => {
    const fixture = clone(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES[0]!);
    fixture.boundaryReport.unsafeCapabilitySummary = 'buy now signal with profit';
    fixture.capabilityFlags.readOnlySolanaBoundaryExecution = true as never;
    const validation = validateReadOnlySolanaProviderBoundaryFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CAPABILITY_FLAG')).toBe(true);
  });
});

describe('Phase 64 — capabilities and propagation', () => {
  it('module capability flags are correct', () => {
    const caps = getReadOnlySolanaProviderBoundaryCapabilities();
    expect(caps.readOnlySolanaProviderBoundary).toBe(true);
    expect(caps.readOnlySolanaProviderBoundaryFixtures).toBe(true);
    expect(caps.readOnlySolanaBoundaryNetworkAccess).toBe(false);
    expect(caps.readOnlySolanaBoundaryExecution).toBe(false);
    expect(caps.readOnlySolanaBoundaryWriteCapabilities).toBe(false);
  });

  it('dashboard and read-only-api capability surfaces include phase 64 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities() as Record<string, unknown>;
    expect(dashboardCaps['readOnlySolanaProviderBoundary']).toBe(true);
    expect(dashboardCaps['readOnlySolanaProviderBoundaryFixtures']).toBe(true);
    expect(dashboardCaps['readOnlySolanaBoundaryExecution']).toBe(false);
    const dashboardCapsSource = readFileSync(resolve(REPO_ROOT, 'apps/dashboard/src/capabilities.ts'), 'utf-8');
    expect(dashboardCapsSource.toLowerCase()).not.toContain('websocket');

    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(apiCaps['readOnlySolanaProviderBoundary']).toBe(true);
    expect(apiCaps['readOnlySolanaBoundaryWebSocketAccess']).toBe(false);
  });
});

describe('Phase 64 — safety scan and policy alignment', () => {
  it('phase files avoid nondeterministic and runtime primitives', () => {
    for (const file of PHASE_64_FILES) {
      const content = readFileSync(resolve(PHASE_64_SRC, file), 'utf-8');
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

  it('fixtures are source-immutable when clones are changed', () => {
    const source = READ_ONLY_SOLANA_PROVIDER_BOUNDARY_FIXTURES[0]!;
    const copy = clone(source);
    copy.fieldMappings[0] = { ...copy.fieldMappings[0], normalizedField: 'changed' };
    expect(source.fieldMappings[0].normalizedField).not.toBe('changed');
  });

  it('Phase 65 is preview only in phase64 docs', () => {
    const docs = readFileSync(resolve(REPO_ROOT, 'docs/READ_ONLY_SOLANA_PROVIDER_BOUNDARY.md'), 'utf-8');
    expect(docs).toContain('Phase 65 — First Real Read-Only Provider Adapter v1');
    expect(docs.toLowerCase()).toContain('not implemented');
  });
});

