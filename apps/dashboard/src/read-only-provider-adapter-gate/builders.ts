import {
  READ_ONLY_PROVIDER_CONTRACT_NAMES,
  type ReadOnlyProviderContractName,
} from '../read-only-provider-contracts/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES,
  type ReadOnlyProviderAdapterMockName,
} from '../read-only-provider-adapter-mocks/index.js';
import { SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES } from '../synthetic-strategy-comparison-lab/index.js';
import { getReadOnlyProviderAdapterGateCapabilities } from './capabilities.js';
import { buildReadOnlyProviderCompatibilityCheck } from './compatibility.js';
import { buildReadOnlyProviderAdapterGateApiContract } from './contracts.js';
import { buildDefaultReadOnlyProviderGatePolicies } from './gate-policies.js';
import { buildReadOnlyProviderGateState } from './gate-state.js';
import { stableDeterministicReadOnlyProviderAdapterGateChecksum } from './normalization.js';
import { buildReadOnlyProviderResolutionResult } from './provider-resolution.js';
import { buildReadOnlyProviderGateReport } from './reports.js';
import type {
  BuildReadOnlyProviderAdapterGateFixtureInput,
  ReadOnlyProviderAdapterGateFixture,
  ReadOnlyProviderAdapterGateKind,
  ReadOnlyProviderAdapterGateName,
  ReadOnlyProviderCandidate,
  ReadOnlyProviderCandidateCapabilities,
  ReadOnlyProviderGateStateKind,
} from './types.js';
import {
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION,
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
  PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_VERSION,
  READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE,
} from './types.js';
import { buildReadOnlyProviderAdapterGateViewModel } from './view-models.js';
import { buildReadOnlyProviderCapabilityCheck } from './capability-checks.js';

interface ScenarioDefinition {
  readonly fixtureKind: ReadOnlyProviderAdapterGateKind;
  readonly sourceProviderContractName: ReadOnlyProviderContractName | null;
  readonly sourceProviderMockName: ReadOnlyProviderAdapterMockName | null;
  readonly sourceComparisonLabFixtureName: (typeof SYNTHETIC_STRATEGY_COMPARISON_LAB_NAMES)[number];
  readonly stateKind: ReadOnlyProviderGateStateKind;
  readonly allowed: boolean;
  readonly mockOnly: boolean;
  readonly candidateName: string;
  readonly requestedCapabilities: ReadOnlyProviderCandidateCapabilities;
  readonly networkEndpoint: null | string;
  readonly providerSdk: null | string;
  readonly providerClientReference: null | string;
  readonly rejectionReasons: readonly string[];
}

const SCENARIOS: Readonly<Record<ReadOnlyProviderAdapterGateName, ScenarioDefinition>> = {
  'safe-synthetic-mock-accepted-gate': {
    fixtureKind: 'safe_synthetic_mock_accepted_gate',
    sourceProviderContractName: 'token-metadata-contract',
    sourceProviderMockName: 'token-metadata-adapter-mock',
    sourceComparisonLabFixtureName: 'clean-launch-synthetic-strategy-comparison-lab',
    stateKind: 'open_for_synthetic_mocks_only',
    allowed: true,
    mockOnly: true,
    candidateName: 'Safe Synthetic Token Metadata Mock Candidate',
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
    networkEndpoint: null,
    providerSdk: null,
    providerClientReference: null,
    rejectionReasons: [],
  },
  'safe-synthetic-mock-closed-by-default-gate': {
    fixtureKind: 'safe_synthetic_mock_closed_by_default_gate',
    sourceProviderContractName: 'holder-distribution-contract',
    sourceProviderMockName: 'holder-distribution-adapter-mock',
    sourceComparisonLabFixtureName: 'thin-liquidity-synthetic-strategy-comparison-lab',
    stateKind: 'closed_by_default',
    allowed: false,
    mockOnly: true,
    candidateName: 'Safe Synthetic Holder Distribution Mock Candidate',
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
    networkEndpoint: null,
    providerSdk: null,
    providerClientReference: null,
    rejectionReasons: ['Gate remains closed by default until explicit future-phase unlock.'],
  },
  'missing-contract-rejected-gate': {
    fixtureKind: 'missing_contract_rejected_gate',
    sourceProviderContractName: null,
    sourceProviderMockName: 'risk-intelligence-adapter-mock',
    sourceComparisonLabFixtureName: 'concentrated-holders-synthetic-strategy-comparison-lab',
    stateKind: 'rejected_missing_contract',
    allowed: false,
    mockOnly: true,
    candidateName: 'Missing Contract Synthetic Candidate',
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
    networkEndpoint: null,
    providerSdk: null,
    providerClientReference: null,
    rejectionReasons: ['Missing source provider contract reference.'],
  },
  'network-access-rejected-gate': {
    fixtureKind: 'network_access_rejected_gate',
    sourceProviderContractName: 'solana-rpc-contract',
    sourceProviderMockName: 'solana-rpc-adapter-mock',
    sourceComparisonLabFixtureName: 'suspicious-creator-synthetic-strategy-comparison-lab',
    stateKind: 'rejected_network_access',
    allowed: false,
    mockOnly: true,
    candidateName: 'Network Access Synthetic Candidate',
    requestedCapabilities: {
      readOnly: true,
      networkAccess: true,
      liveProvider: false,
      executionCapability: false,
      walletCapability: false,
      signingCapability: false,
      transactionSendingCapability: false,
      runtimeRequestCapability: false,
      unsafeProvider: false,
      advisoryOutput: false,
    },
    networkEndpoint: null,
    providerSdk: null,
    providerClientReference: null,
    rejectionReasons: ['Unsafe network capability requested by candidate.'],
  },
  'wallet-capability-rejected-gate': {
    fixtureKind: 'wallet_capability_rejected_gate',
    sourceProviderContractName: 'wallet-cluster-contract',
    sourceProviderMockName: 'wallet-cluster-adapter-mock',
    sourceComparisonLabFixtureName: 'possible-bundle-cluster-synthetic-strategy-comparison-lab',
    stateKind: 'rejected_unsafe_capability',
    allowed: false,
    mockOnly: true,
    candidateName: 'Wallet Capability Synthetic Candidate',
    requestedCapabilities: {
      readOnly: true,
      networkAccess: false,
      liveProvider: false,
      executionCapability: false,
      walletCapability: true,
      signingCapability: false,
      transactionSendingCapability: false,
      runtimeRequestCapability: false,
      unsafeProvider: false,
      advisoryOutput: false,
    },
    networkEndpoint: null,
    providerSdk: null,
    providerClientReference: null,
    rejectionReasons: ['Unsafe capability requested by candidate.'],
  },
  'signing-capability-rejected-gate': {
    fixtureKind: 'signing_capability_rejected_gate',
    sourceProviderContractName: 'pump-launch-contract',
    sourceProviderMockName: 'pump-launch-adapter-mock',
    sourceComparisonLabFixtureName: 'metadata-incomplete-synthetic-strategy-comparison-lab',
    stateKind: 'rejected_unsafe_capability',
    allowed: false,
    mockOnly: true,
    candidateName: 'Signing Capability Synthetic Candidate',
    requestedCapabilities: {
      readOnly: true,
      networkAccess: false,
      liveProvider: false,
      executionCapability: false,
      walletCapability: false,
      signingCapability: true,
      transactionSendingCapability: true,
      runtimeRequestCapability: false,
      unsafeProvider: false,
      advisoryOutput: false,
    },
    networkEndpoint: null,
    providerSdk: null,
    providerClientReference: null,
    rejectionReasons: ['Unsafe capability requested by candidate.'],
  },
  'execution-capability-rejected-gate': {
    fixtureKind: 'execution_capability_rejected_gate',
    sourceProviderContractName: 'dex-liquidity-contract',
    sourceProviderMockName: 'dex-liquidity-adapter-mock',
    sourceComparisonLabFixtureName: 'high-early-volume-synthetic-strategy-comparison-lab',
    stateKind: 'rejected_unsafe_capability',
    allowed: false,
    mockOnly: true,
    candidateName: 'Execution Capability Synthetic Candidate',
    requestedCapabilities: {
      readOnly: true,
      networkAccess: false,
      liveProvider: false,
      executionCapability: true,
      walletCapability: false,
      signingCapability: false,
      transactionSendingCapability: false,
      runtimeRequestCapability: false,
      unsafeProvider: false,
      advisoryOutput: false,
    },
    networkEndpoint: null,
    providerSdk: null,
    providerClientReference: null,
    rejectionReasons: ['Unsafe capability requested by candidate.'],
  },
  'live-provider-candidate-rejected-gate': {
    fixtureKind: 'live_provider_candidate_rejected_gate',
    sourceProviderContractName: 'disabled-unsafe-contract',
    sourceProviderMockName: 'disabled-unsafe-adapter-mock',
    sourceComparisonLabFixtureName: 'safety-rejected-synthetic-strategy-comparison-lab',
    stateKind: 'rejected_live_provider',
    allowed: false,
    mockOnly: false,
    candidateName: 'Live Provider Candidate',
    requestedCapabilities: {
      readOnly: true,
      networkAccess: true,
      liveProvider: true,
      executionCapability: false,
      walletCapability: false,
      signingCapability: false,
      transactionSendingCapability: false,
      runtimeRequestCapability: true,
      unsafeProvider: true,
      advisoryOutput: true,
    },
    networkEndpoint: null,
    providerSdk: null,
    providerClientReference: null,
    rejectionReasons: ['Live provider capability requested by candidate.', 'Unsafe candidate requested.'],
  },
} as const;

function buildProviderCandidate(
  fixtureId: string,
  scenario: ScenarioDefinition,
): ReadOnlyProviderCandidate {
  return {
    candidateId: `${fixtureId}-candidate`,
    candidateKind: 'synthetic_provider_candidate',
    candidateName: scenario.candidateName,
    syntheticOnly: true,
    mockOnly: scenario.mockOnly,
    liveProvider: false,
    networkEndpoint: scenario.networkEndpoint,
    providerSdk: scenario.providerSdk,
    providerClientReference: scenario.providerClientReference,
    requestedCapabilities: scenario.requestedCapabilities,
    sourceContractName: scenario.sourceProviderContractName,
    sourceMockName: scenario.sourceProviderMockName,
  };
}

function buildCapabilityChecks(
  fixtureId: string,
  candidate: ReadOnlyProviderCandidate,
) {
  return [
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'read_only_required',
      expectedSafeValue: true,
      actualFixtureValue: candidate.requestedCapabilities.readOnly,
      safetyNotes: ['Read-only capability is required by gate policy.'],
    }),
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'network_access_blocked',
      expectedSafeValue: true,
      actualFixtureValue: !candidate.requestedCapabilities.networkAccess,
      safetyNotes: ['Network access must remain disabled by default.'],
    }),
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'live_provider_blocked',
      expectedSafeValue: true,
      actualFixtureValue: !candidate.requestedCapabilities.liveProvider,
      safetyNotes: ['Live providers are forbidden in this phase.'],
    }),
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'execution_forbidden',
      expectedSafeValue: true,
      actualFixtureValue: !candidate.requestedCapabilities.executionCapability,
      safetyNotes: ['Execution capability must remain disabled.'],
    }),
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'wallet_forbidden',
      expectedSafeValue: true,
      actualFixtureValue: !candidate.requestedCapabilities.walletCapability,
      safetyNotes: ['Wallet capability must remain disabled.'],
    }),
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'signing_forbidden',
      expectedSafeValue: true,
      actualFixtureValue: !candidate.requestedCapabilities.signingCapability,
      safetyNotes: ['Signing capability must remain disabled.'],
    }),
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'transaction_sending_forbidden',
      expectedSafeValue: true,
      actualFixtureValue: !candidate.requestedCapabilities.transactionSendingCapability,
      safetyNotes: ['Transaction-sending capability must remain disabled.'],
    }),
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'runtime_request_forbidden',
      expectedSafeValue: true,
      actualFixtureValue: !candidate.requestedCapabilities.runtimeRequestCapability,
      safetyNotes: ['Runtime request capability must remain disabled.'],
    }),
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'provider_sdk_absent',
      expectedSafeValue: true,
      actualFixtureValue: candidate.providerSdk === null,
      safetyNotes: ['Provider SDK references are not allowed in this phase.'],
    }),
    buildReadOnlyProviderCapabilityCheck({
      fixtureId,
      checkKind: 'network_endpoint_absent',
      expectedSafeValue: true,
      actualFixtureValue: candidate.networkEndpoint === null,
      safetyNotes: ['Network endpoints are not allowed in this phase.'],
    }),
  ] as const;
}

function buildCompatibilityChecks(
  fixtureId: string,
  scenario: ScenarioDefinition,
  candidate: ReadOnlyProviderCandidate,
) {
  const hasContract = scenario.sourceProviderContractName !== null;
  const hasMock = scenario.sourceProviderMockName !== null;

  return [
    buildReadOnlyProviderCompatibilityCheck({
      fixtureId,
      checkKind: 'contract_to_mock_compatibility',
      pass: hasContract && hasMock,
      sourceContractName: scenario.sourceProviderContractName,
      sourceMockName: scenario.sourceProviderMockName,
      notes: ['Contract and mock references must be present for compatibility.'],
    }),
    buildReadOnlyProviderCompatibilityCheck({
      fixtureId,
      checkKind: 'mock_to_gate_compatibility',
      pass: candidate.mockOnly,
      sourceContractName: scenario.sourceProviderContractName,
      sourceMockName: scenario.sourceProviderMockName,
      notes: ['Gate accepts synthetic mock-only candidates only.'],
    }),
    buildReadOnlyProviderCompatibilityCheck({
      fixtureId,
      checkKind: 'missing_contract_fixture',
      pass: hasContract,
      sourceContractName: scenario.sourceProviderContractName,
      sourceMockName: scenario.sourceProviderMockName,
      notes: ['Missing contract fixtures must be rejected.'],
    }),
    buildReadOnlyProviderCompatibilityCheck({
      fixtureId,
      checkKind: 'unsafe_capability_fixture',
      pass:
        !candidate.requestedCapabilities.walletCapability &&
        !candidate.requestedCapabilities.signingCapability &&
        !candidate.requestedCapabilities.transactionSendingCapability &&
        !candidate.requestedCapabilities.executionCapability,
      sourceContractName: scenario.sourceProviderContractName,
      sourceMockName: scenario.sourceProviderMockName,
      notes: ['Unsafe capability fixtures must fail compatibility checks.'],
    }),
    buildReadOnlyProviderCompatibilityCheck({
      fixtureId,
      checkKind: 'disabled_by_default_fixture',
      pass: true,
      sourceContractName: scenario.sourceProviderContractName,
      sourceMockName: scenario.sourceProviderMockName,
      notes: ['Gate remains closed-by-default even for safe fixtures.'],
    }),
    buildReadOnlyProviderCompatibilityCheck({
      fixtureId,
      checkKind: 'live_provider_fixture',
      pass: !candidate.requestedCapabilities.liveProvider,
      sourceContractName: scenario.sourceProviderContractName,
      sourceMockName: scenario.sourceProviderMockName,
      notes: ['Live provider fixtures are rejected in this phase.'],
    }),
  ] as const;
}

function getSourceProviderContractNames(): readonly ReadOnlyProviderContractName[] {
  return READ_ONLY_PROVIDER_CONTRACT_NAMES;
}

function getSourceProviderMockNames(): readonly ReadOnlyProviderAdapterMockName[] {
  return READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES;
}

export function buildReadOnlyProviderAdapterGateFixture(
  input: BuildReadOnlyProviderAdapterGateFixtureInput,
): ReadOnlyProviderAdapterGateFixture {
  const scenario = SCENARIOS[input.fixtureName];

  const deterministicSeed = stableDeterministicReadOnlyProviderAdapterGateChecksum(
    `phase63-${input.fixtureName}-seed`,
  );
  const fixtureId = `phase63-fixture-${input.fixtureName}`;

  const gatePolicies = buildDefaultReadOnlyProviderGatePolicies(fixtureId);
  const gateState = buildReadOnlyProviderGateState({
    fixtureId,
    stateKind: scenario.stateKind,
    allowed: scenario.allowed,
    mockOnly: scenario.mockOnly,
    futurePhaseOnly: true,
  });

  const providerCandidate = buildProviderCandidate(fixtureId, scenario);

  const resolutionResult = buildReadOnlyProviderResolutionResult({
    fixtureId,
    state: gateState,
    policies: gatePolicies,
    candidate: providerCandidate,
    rejectionReasons: scenario.rejectionReasons,
  });

  const capabilityChecks = buildCapabilityChecks(fixtureId, providerCandidate);
  const compatibilityChecks = buildCompatibilityChecks(fixtureId, scenario, providerCandidate);

  const gateReport = buildReadOnlyProviderGateReport({
    fixtureId,
    state: gateState,
    resolution: resolutionResult,
    capabilityChecks,
  });

  const partialFixture = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE,
    schemaVersion: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION,
    sourceProviderContractName: scenario.sourceProviderContractName,
    sourceProviderMockName: scenario.sourceProviderMockName,
    gateIdentity: {
      gateId: `${fixtureId}-identity`,
      gateName: input.fixtureName,
      gateKind: scenario.fixtureKind,
      sourceProviderContractName: scenario.sourceProviderContractName,
      sourceProviderMockName: scenario.sourceProviderMockName,
      sourceComparisonLabFixtureName: scenario.sourceComparisonLabFixtureName,
      sourceProviderContractNames: getSourceProviderContractNames(),
      sourceProviderMockNames: getSourceProviderMockNames(),
      schemaVersion: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION,
      deterministicSeed,
      generatedAt: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
    },
    gatePolicies,
    gateState,
    providerCandidate,
    resolutionResult,
    capabilityChecks,
    compatibilityChecks,
    gateReport,
    viewModel: undefined as unknown as ReadOnlyProviderAdapterGateFixture['viewModel'],
    apiContracts: undefined as unknown as ReadOnlyProviderAdapterGateFixture['apiContracts'],
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: scenario.fixtureKind,
        selectedGateState: scenario.stateKind,
        matched: true,
        source: 'synthetic_fixture_only' as const,
      },
    ],
    capabilityFlags: getReadOnlyProviderAdapterGateCapabilities(),
    meta: {
      generatedAt: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT,
      source: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE,
      version: PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_VERSION,
      phase: READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true as const,
      localOnly: true as const,
      readOnly: true as const,
      failClosed: true as const,
      noLiveData: true as const,
      noNetworkAccess: true as const,
      nonAdvisory: true as const,
      notExecutable: true as const,
    },
  };

  const viewModel = buildReadOnlyProviderAdapterGateViewModel(
    partialFixture as unknown as ReadOnlyProviderAdapterGateFixture,
  );

  const fixture = { ...partialFixture, viewModel } as ReadOnlyProviderAdapterGateFixture;
  return {
    ...fixture,
    apiContracts: buildReadOnlyProviderAdapterGateApiContract(fixture),
  };
}
