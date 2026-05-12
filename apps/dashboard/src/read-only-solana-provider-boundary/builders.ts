import { READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES } from '../read-only-provider-adapter-gate/index.js';
import { READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES } from '../read-only-provider-adapter-mocks/index.js';
import { READ_ONLY_PROVIDER_CONTRACT_NAMES } from '../read-only-provider-contracts/index.js';
import { getReadOnlySolanaProviderBoundaryCapabilities } from './capabilities.js';
import { buildReadOnlySolanaBoundaryState } from './boundary-state.js';
import { buildReadOnlySolanaConformanceCheck } from './conformance.js';
import { buildReadOnlySolanaProviderBoundaryApiContract } from './contracts.js';
import { buildReadOnlySolanaErrorNormalizationRule } from './error-normalization.js';
import { buildReadOnlySolanaFieldMappingRule } from './field-mapping.js';
import { buildReadOnlySolanaMockToRealMapping } from './mock-to-real-mapping.js';
import { stableDeterministicReadOnlySolanaProviderBoundaryChecksum } from './normalization.js';
import { buildReadOnlySolanaBoundaryReport } from './reports.js';
import type {
  BuildReadOnlySolanaProviderBoundaryFixtureInput,
  ReadOnlySolanaProviderBoundaryFixture,
  ReadOnlySolanaProviderBoundaryKind,
  ReadOnlySolanaProviderBoundaryName,
  ReadOnlySolanaProviderBoundaryStateKind,
} from './types.js';
import {
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SCHEMA_VERSION,
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE,
  PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_VERSION,
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE,
} from './types.js';
import { buildReadOnlySolanaProviderBoundaryViewModel } from './view-models.js';

interface Scenario {
  readonly fixtureKind: ReadOnlySolanaProviderBoundaryKind;
  readonly sourceGateFixtureName: (typeof READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES)[number];
  readonly sourceProviderContractName: (typeof READ_ONLY_PROVIDER_CONTRACT_NAMES)[number];
  readonly sourceMockAdapterName: (typeof READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES)[number];
  readonly boundaryStateKind: ReadOnlySolanaProviderBoundaryStateKind;
  readonly fieldCoverageStatus: 'covered' | 'unmapped';
  readonly gateBlocked: boolean;
}

const SCENARIOS: Readonly<Record<ReadOnlySolanaProviderBoundaryName, Scenario>> = {
  'account-info-boundary-ready': {
    fixtureKind: 'account_info_boundary_ready',
    sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
    sourceProviderContractName: 'solana-rpc-contract',
    sourceMockAdapterName: 'solana-rpc-adapter-mock',
    boundaryStateKind: 'mock_contract_parity_ready',
    fieldCoverageStatus: 'covered',
    gateBlocked: false,
  },
  'token-metadata-boundary-ready': {
    fixtureKind: 'token_metadata_boundary_ready',
    sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
    sourceProviderContractName: 'token-metadata-contract',
    sourceMockAdapterName: 'token-metadata-adapter-mock',
    boundaryStateKind: 'field_mapping_ready',
    fieldCoverageStatus: 'covered',
    gateBlocked: false,
  },
  'mint-authority-boundary-ready': {
    fixtureKind: 'mint_authority_boundary_ready',
    sourceGateFixtureName: 'safe-synthetic-mock-closed-by-default-gate',
    sourceProviderContractName: 'pump-launch-contract',
    sourceMockAdapterName: 'pump-launch-adapter-mock',
    boundaryStateKind: 'mock_contract_parity_ready',
    fieldCoverageStatus: 'covered',
    gateBlocked: false,
  },
  'holder-distribution-boundary-ready': {
    fixtureKind: 'holder_distribution_boundary_ready',
    sourceGateFixtureName: 'safe-synthetic-mock-closed-by-default-gate',
    sourceProviderContractName: 'holder-distribution-contract',
    sourceMockAdapterName: 'holder-distribution-adapter-mock',
    boundaryStateKind: 'field_mapping_ready',
    fieldCoverageStatus: 'covered',
    gateBlocked: false,
  },
  'liquidity-snapshot-boundary-ready': {
    fixtureKind: 'liquidity_snapshot_boundary_ready',
    sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
    sourceProviderContractName: 'dex-liquidity-contract',
    sourceMockAdapterName: 'dex-liquidity-adapter-mock',
    boundaryStateKind: 'conformance_ready_for_future_provider',
    fieldCoverageStatus: 'covered',
    gateBlocked: false,
  },
  'provider-health-boundary-ready': {
    fixtureKind: 'provider_health_boundary_ready',
    sourceGateFixtureName: 'network-access-rejected-gate',
    sourceProviderContractName: 'risk-intelligence-contract',
    sourceMockAdapterName: 'risk-intelligence-adapter-mock',
    boundaryStateKind: 'field_mapping_incomplete',
    fieldCoverageStatus: 'unmapped',
    gateBlocked: true,
  },
  'error-normalization-boundary-ready': {
    fixtureKind: 'error_normalization_boundary_ready',
    sourceGateFixtureName: 'missing-contract-rejected-gate',
    sourceProviderContractName: 'disabled-unsafe-contract',
    sourceMockAdapterName: 'disabled-unsafe-adapter-mock',
    boundaryStateKind: 'error_mapping_ready',
    fieldCoverageStatus: 'covered',
    gateBlocked: true,
  },
  'unsafe-write-capability-boundary-rejected': {
    fixtureKind: 'unsafe_write_capability_boundary_rejected',
    sourceGateFixtureName: 'execution-capability-rejected-gate',
    sourceProviderContractName: 'disabled-unsafe-contract',
    sourceMockAdapterName: 'disabled-unsafe-adapter-mock',
    boundaryStateKind: 'future_real_provider_blocked_by_gate',
    fieldCoverageStatus: 'unmapped',
    gateBlocked: true,
  },
};

function buildFieldMappings(fixtureId: string, sourceProviderContractName: Scenario['sourceProviderContractName'], coverageStatus: 'covered' | 'unmapped') {
  const ruleKinds = [
    'account_address_mapping',
    'mint_address_mapping',
    'token_metadata_reference_mapping',
    'owner_program_reference_mapping',
    'mint_authority_status_mapping',
    'freeze_authority_status_mapping',
    'holder_distribution_snapshot_mapping',
    'liquidity_snapshot_mapping',
    'risk_source_evidence_reference_mapping',
    'provider_health_metadata_mapping',
    'response_freshness_metadata_mapping',
    'error_code_category_mapping',
  ] as const;

  return ruleKinds.map((mappingKind, index) =>
    buildReadOnlySolanaFieldMappingRule({
      fixtureId,
      sourceContractName: sourceProviderContractName,
      mappingKind,
      sourceMockField: `mock.${mappingKind}`,
      futureRealField: `future.${mappingKind}`,
      normalizedField: mappingKind,
      required: true,
      nullable: index % 3 === 0,
      coverageStatus: coverageStatus === 'unmapped' && index === ruleKinds.length - 1 ? 'unmapped' : 'covered',
      semanticCaveat: 'Boundary mapping only; not connected.',
    }),
  );
}

function buildErrorNormalizationRules(fixtureId: string) {
  const categories = [
    'provider_unavailable_future',
    'rate_limited_future',
    'malformed_response_future',
    'missing_required_field',
    'unsupported_write_capability',
    'network_access_blocked',
    'gate_closed',
    'unknown_future_provider_error',
  ] as const;

  return categories.map(category =>
    buildReadOnlySolanaErrorNormalizationRule({
      fixtureId,
      category,
      sourceErrorCode: category.toUpperCase(),
      normalizedErrorCode: `BOUNDARY_${category.toUpperCase()}`,
      normalizedCategory: 'boundary',
      safetyNote: 'Deterministic future-only normalization rule.',
    }),
  );
}

function buildConformanceChecks(fixtureId: string, mappingReady: boolean, gateBlocked: boolean) {
  return [
    buildReadOnlySolanaConformanceCheck({
      fixtureId,
      checkKind: 'mock_to_contract_conformance',
      pass: mappingReady,
      summary: 'Mock fixture shape aligns to provider contract fields.',
    }),
    buildReadOnlySolanaConformanceCheck({
      fixtureId,
      checkKind: 'future_placeholder_to_contract_conformance',
      pass: true,
      summary: 'Future placeholder shape aligns to contract fields.',
    }),
    buildReadOnlySolanaConformanceCheck({
      fixtureId,
      checkKind: 'required_field_coverage',
      pass: mappingReady,
      summary: 'Required field coverage is deterministic.',
    }),
    buildReadOnlySolanaConformanceCheck({
      fixtureId,
      checkKind: 'nullability_handling',
      pass: true,
      summary: 'Nullability handling is deterministic.',
    }),
    buildReadOnlySolanaConformanceCheck({
      fixtureId,
      checkKind: 'error_normalization_coverage',
      pass: true,
      summary: 'Error normalization coverage is complete.',
    }),
    buildReadOnlySolanaConformanceCheck({
      fixtureId,
      checkKind: 'gate_compatibility',
      pass: !gateBlocked,
      summary: 'Boundary remains gate-aware.',
    }),
    buildReadOnlySolanaConformanceCheck({
      fixtureId,
      checkKind: 'no_live_provider_readiness_claim',
      pass: true,
      summary: 'Boundary does not claim live readiness.',
    }),
  ] as const;
}

export function buildReadOnlySolanaProviderBoundaryFixture(
  input: BuildReadOnlySolanaProviderBoundaryFixtureInput,
): ReadOnlySolanaProviderBoundaryFixture {
  const scenario = SCENARIOS[input.fixtureName];
  const fixtureId = `phase64-fixture-${input.fixtureName}`;
  const deterministicSeed = stableDeterministicReadOnlySolanaProviderBoundaryChecksum(
    `phase64-${input.fixtureName}`,
  );

  const fieldMappings = buildFieldMappings(
    fixtureId,
    scenario.sourceProviderContractName,
    scenario.fieldCoverageStatus,
  );
  const mockToRealMapping = buildReadOnlySolanaMockToRealMapping({
    fixtureId,
    sourceMockAdapterName: scenario.sourceMockAdapterName,
    sourceProviderContractName: scenario.sourceProviderContractName,
    fieldMappings,
  });
  const boundaryState = buildReadOnlySolanaBoundaryState({
    fixtureId,
    stateKind: scenario.boundaryStateKind,
    futureOnly: true,
    allowedByGate: !scenario.gateBlocked,
  });
  const errorNormalizationRules = buildErrorNormalizationRules(fixtureId);
  const conformanceChecks = buildConformanceChecks(
    fixtureId,
    mockToRealMapping.mappingStatus === 'ready',
    scenario.gateBlocked,
  );

  const partial = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE,
    schemaVersion: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SCHEMA_VERSION,
    sourceGateFixtureName: scenario.sourceGateFixtureName,
    sourceProviderContractName: scenario.sourceProviderContractName,
    sourceMockAdapterName: scenario.sourceMockAdapterName,
    boundaryIdentity: {
      boundaryId: `${fixtureId}-identity`,
      boundaryName: input.fixtureName,
      boundaryKind: scenario.fixtureKind,
      sourceGateFixtureName: scenario.sourceGateFixtureName,
      sourceProviderContractName: scenario.sourceProviderContractName,
      sourceMockAdapterName: scenario.sourceMockAdapterName,
      sourceGateFixtureNames: READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
      sourceProviderContractNames: READ_ONLY_PROVIDER_CONTRACT_NAMES,
      sourceMockAdapterNames: READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES,
      schemaVersion: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SCHEMA_VERSION,
      deterministicSeed,
      generatedAt: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
    },
    boundaryState,
    mockToRealMapping,
    mockResponseShape: {
      mockResponseId: `${fixtureId}-mock-shape`,
      sourceMockAdapterFixtureName: scenario.sourceMockAdapterName,
      sourceProviderContractName: scenario.sourceProviderContractName,
      normalizedShape: 'read_only_solana_boundary_normalized_shape_v1',
      fieldMappingStatus: mockToRealMapping.mappingStatus,
      unmappedFieldList: mockToRealMapping.unmappedRequiredFields,
      semanticCaveats: ['Boundary mapping only; not connected.'],
      livePayload: false as const,
      rpcPayload: false as const,
      endpoint: null,
    },
    futureRealResponsePlaceholder: {
      placeholderId: `${fixtureId}-future-placeholder`,
      placeholderKind: 'future_read_only_solana_provider_response_placeholder' as const,
      futureOnly: true as const,
      liveData: false as const,
      networkEndpoint: null,
      providerSdk: null,
      apiKeyRequired: false as const,
      writeCapability: false as const,
      walletRequired: false as const,
      signingRequired: false as const,
      transactionSendingRequired: false as const,
    },
    fieldMappings,
    errorNormalizationRules,
    conformanceChecks,
    boundaryReport: undefined as unknown as ReadOnlySolanaProviderBoundaryFixture['boundaryReport'],
    viewModel: undefined as unknown as ReadOnlySolanaProviderBoundaryFixture['viewModel'],
    apiContracts: undefined as unknown as ReadOnlySolanaProviderBoundaryFixture['apiContracts'],
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: scenario.fixtureKind,
        selectedBoundaryState: scenario.boundaryStateKind,
        matched: true,
        source: 'synthetic_fixture_only' as const,
      },
    ],
    capabilityFlags: getReadOnlySolanaProviderBoundaryCapabilities(),
    meta: {
      generatedAt: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT,
      source: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE,
      version: PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_VERSION,
      phase: READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true as const,
      localOnly: true as const,
      readOnly: true as const,
      boundaryOnly: true as const,
      noLiveData: true as const,
      noNetworkAccess: true as const,
      nonAdvisory: true as const,
      notExecutable: true as const,
    },
  };

  const boundaryReport = buildReadOnlySolanaBoundaryReport({
    fixtureId,
    boundaryState,
    fieldMappings,
    conformanceChecks,
    errorNormalizationRules,
    gateBlocked: scenario.gateBlocked,
  });
  const fixtureWithReport = { ...partial, boundaryReport };
  const viewModel = buildReadOnlySolanaProviderBoundaryViewModel(
    fixtureWithReport as ReadOnlySolanaProviderBoundaryFixture,
  );
  const fixture = { ...fixtureWithReport, viewModel } as ReadOnlySolanaProviderBoundaryFixture;
  return { ...fixture, apiContracts: buildReadOnlySolanaProviderBoundaryApiContract(fixture) };
}

