import type { ReadOnlyProviderContractName } from '../read-only-provider-contracts/types.js';
import type { ReadOnlyProviderAdapterMockName } from '../read-only-provider-adapter-mocks/types.js';
import type { SyntheticStrategyComparisonLabName } from '../synthetic-strategy-comparison-lab/types.js';

export const READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE = 63 as const;
export const PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT =
  '2026-05-12T00:00:00.000Z' as const;
export const PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE =
  'phase63_read_only_provider_adapter_gate_v1' as const;
export const PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_VERSION = '1.0.0' as const;
export const PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION = '1.0.0' as const;

export const READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES = [
  'safe-synthetic-mock-accepted-gate',
  'safe-synthetic-mock-closed-by-default-gate',
  'missing-contract-rejected-gate',
  'network-access-rejected-gate',
  'wallet-capability-rejected-gate',
  'signing-capability-rejected-gate',
  'execution-capability-rejected-gate',
  'live-provider-candidate-rejected-gate',
] as const;

export const READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS = [
  'safe_synthetic_mock_accepted_gate',
  'safe_synthetic_mock_closed_by_default_gate',
  'missing_contract_rejected_gate',
  'network_access_rejected_gate',
  'wallet_capability_rejected_gate',
  'signing_capability_rejected_gate',
  'execution_capability_rejected_gate',
  'live_provider_candidate_rejected_gate',
] as const;

export type ReadOnlyProviderAdapterGateName = (typeof READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES)[number];
export type ReadOnlyProviderAdapterGateKind = (typeof READ_ONLY_PROVIDER_ADAPTER_GATE_KINDS)[number];

export const READ_ONLY_PROVIDER_GATE_POLICY_KINDS = [
  'read_only_capability_required',
  'network_disabled_by_default',
  'live_provider_disabled_by_default',
  'execution_capability_forbidden',
  'wallet_capability_forbidden',
  'signing_capability_forbidden',
  'transaction_sending_forbidden',
  'runtime_request_forbidden',
  'unsafe_provider_rejected',
  'manual_unlock_required_for_future_phase',
] as const;

export type ReadOnlyProviderGatePolicyKind = (typeof READ_ONLY_PROVIDER_GATE_POLICY_KINDS)[number];

export const READ_ONLY_PROVIDER_GATE_STATE_KINDS = [
  'closed_by_default',
  'open_for_synthetic_mocks_only',
  'rejected_unsafe_capability',
  'rejected_missing_contract',
  'rejected_live_provider',
  'rejected_network_access',
  'ready_for_future_read_only_boundary',
] as const;

export type ReadOnlyProviderGateStateKind = (typeof READ_ONLY_PROVIDER_GATE_STATE_KINDS)[number];

export type ReadOnlyProviderCapabilityCheckKind =
  | 'read_only_required'
  | 'network_access_blocked'
  | 'live_provider_blocked'
  | 'execution_forbidden'
  | 'wallet_forbidden'
  | 'signing_forbidden'
  | 'transaction_sending_forbidden'
  | 'runtime_request_forbidden'
  | 'provider_sdk_absent'
  | 'network_endpoint_absent';

export type ReadOnlyProviderCompatibilityCheckKind =
  | 'contract_to_mock_compatibility'
  | 'mock_to_gate_compatibility'
  | 'missing_contract_fixture'
  | 'unsafe_capability_fixture'
  | 'disabled_by_default_fixture'
  | 'live_provider_fixture';

export interface ReadOnlyProviderAdapterGateIdentity {
  readonly gateId: string;
  readonly gateName: ReadOnlyProviderAdapterGateName;
  readonly gateKind: ReadOnlyProviderAdapterGateKind;
  readonly sourceProviderContractName: ReadOnlyProviderContractName | null;
  readonly sourceProviderMockName: ReadOnlyProviderAdapterMockName | null;
  readonly sourceComparisonLabFixtureName: SyntheticStrategyComparisonLabName;
  readonly sourceProviderContractNames: readonly ReadOnlyProviderContractName[];
  readonly sourceProviderMockNames: readonly ReadOnlyProviderAdapterMockName[];
  readonly schemaVersion: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT;
}

export interface ReadOnlyProviderGatePolicy {
  readonly policyId: string;
  readonly policyKind: ReadOnlyProviderGatePolicyKind;
  readonly required: boolean;
  readonly enabled: boolean;
  readonly evaluationNote: string;
}

export interface ReadOnlyProviderGateState {
  readonly stateId: string;
  readonly stateKind: ReadOnlyProviderGateStateKind;
  readonly failClosed: true;
  readonly closedByDefault: true;
  readonly syntheticOnly: true;
  readonly mockOnly: boolean;
  readonly allowed: boolean;
  readonly futurePhaseOnly: boolean;
}

export interface ReadOnlyProviderCandidateCapabilities {
  readonly readOnly: boolean;
  readonly networkAccess: boolean;
  readonly liveProvider: boolean;
  readonly executionCapability: boolean;
  readonly walletCapability: boolean;
  readonly signingCapability: boolean;
  readonly transactionSendingCapability: boolean;
  readonly runtimeRequestCapability: boolean;
  readonly unsafeProvider: boolean;
  readonly advisoryOutput: boolean;
}

export interface ReadOnlyProviderCandidate {
  readonly candidateId: string;
  readonly candidateKind: 'synthetic_provider_candidate';
  readonly candidateName: string;
  readonly syntheticOnly: true;
  readonly mockOnly: boolean;
  readonly liveProvider: false;
  readonly networkEndpoint: null | string;
  readonly providerSdk: null | string;
  readonly providerClientReference: null | string;
  readonly requestedCapabilities: ReadOnlyProviderCandidateCapabilities;
  readonly sourceContractName: ReadOnlyProviderContractName | null;
  readonly sourceMockName: ReadOnlyProviderAdapterMockName | null;
}

export interface ReadOnlyProviderPolicyEvaluationResult {
  readonly policyKind: ReadOnlyProviderGatePolicyKind;
  readonly passed: boolean;
  readonly expected: boolean;
  readonly actual: boolean;
  readonly note: string;
}

export interface ReadOnlyProviderResolutionResult {
  readonly resolutionId: string;
  readonly resolvedState: ReadOnlyProviderGateStateKind;
  readonly allowed: boolean;
  readonly failClosed: true;
  readonly policyResults: readonly ReadOnlyProviderPolicyEvaluationResult[];
  readonly rejectionReasons: readonly string[];
  readonly manualUnlockRequired: true;
  readonly futurePhaseOnly: true;
  readonly safetySummary: string;
  readonly validationSummary: string;
}

export interface ReadOnlyProviderCapabilityCheck {
  readonly checkId: string;
  readonly checkKind: ReadOnlyProviderCapabilityCheckKind;
  readonly expectedSafeValue: boolean;
  readonly actualFixtureValue: boolean;
  readonly pass: boolean;
  readonly safetyNotes: readonly string[];
}

export interface ReadOnlyProviderCompatibilityCheck {
  readonly checkId: string;
  readonly checkKind: ReadOnlyProviderCompatibilityCheckKind;
  readonly pass: boolean;
  readonly sourceContractName: ReadOnlyProviderContractName | null;
  readonly sourceMockName: ReadOnlyProviderAdapterMockName | null;
  readonly notes: readonly string[];
}

export interface ReadOnlyProviderAdapterGateReport {
  readonly reportId: string;
  readonly gateState: ReadOnlyProviderGateStateKind;
  readonly policySummary: string;
  readonly capabilitySummary: string;
  readonly providerCandidateSummary: string;
  readonly rejectionSummary: string;
  readonly futureBoundaryNotes: readonly string[];
  readonly noLiveExecution: true;
  readonly noRecommendationOutput: true;
}

export interface ReadOnlyProviderAdapterGateViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: ReadOnlyProviderAdapterGateName;
  readonly gateState: ReadOnlyProviderGateStateKind;
  readonly allowed: boolean;
  readonly failClosed: true;
  readonly candidateLabel: string;
  readonly policyPassCount: number;
  readonly policyFailCount: number;
  readonly rejectionCount: number;
  readonly summary: string;
}

export interface ReadOnlyProviderAdapterGateApiListContract {
  readonly contractId: string;
  readonly contractKind: 'list';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT;
  readonly source: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureIds: readonly string[];
    readonly totalCount: number;
  };
}

export interface ReadOnlyProviderAdapterGateApiDetailContract {
  readonly contractId: string;
  readonly contractKind: 'detail';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT;
  readonly source: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: ReadOnlyProviderAdapterGateViewModel;
}

export interface ReadOnlyProviderAdapterGateApiSummaryContract {
  readonly contractId: string;
  readonly contractKind: 'summary';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT;
  readonly source: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly gateState: ReadOnlyProviderGateStateKind;
    readonly allowed: boolean;
    readonly failClosed: true;
  };
}

export interface ReadOnlyProviderAdapterGateApiErrorContract {
  readonly contractId: string;
  readonly contractKind: 'error';
  readonly statusCode: 400 | 404;
  readonly generatedAt: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT;
  readonly source: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode:
    | 'READ_ONLY_PROVIDER_ADAPTER_GATE_INVALID_REQUEST'
    | 'READ_ONLY_PROVIDER_ADAPTER_GATE_NOT_FOUND';
  readonly message: string;
}

export interface ReadOnlyProviderAdapterGateApiContracts {
  readonly list: ReadOnlyProviderAdapterGateApiListContract;
  readonly detail: ReadOnlyProviderAdapterGateApiDetailContract;
  readonly summary: ReadOnlyProviderAdapterGateApiSummaryContract;
  readonly errors: readonly [
    ReadOnlyProviderAdapterGateApiErrorContract,
    ReadOnlyProviderAdapterGateApiErrorContract,
  ];
}

export interface ReadOnlyProviderAdapterGateSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: ReadOnlyProviderAdapterGateName;
  readonly fixtureKind?: ReadOnlyProviderAdapterGateKind;
  readonly gateState?: ReadOnlyProviderGateStateKind;
  readonly allowed?: boolean;
}

export interface ReadOnlyProviderAdapterGateSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ReadOnlyProviderAdapterGateKind;
  readonly selectedGateState: ReadOnlyProviderGateStateKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface ReadOnlyProviderAdapterGateCapabilities {
  readonly readOnlyProviderAdapterGate: true;
  readonly readOnlyProviderAdapterGateFixtures: true;
  readonly deterministicReadOnlyProviderAdapterGate: true;
  readonly localOnlyReadOnlyProviderAdapterGate: true;
  readonly fixtureDerivedReadOnlyProviderAdapterGate: true;
  readonly failClosedReadOnlyProviderAdapterGate: true;
  readonly readOnlyProviderGatePolicies: true;
  readonly readOnlyProviderGateStates: true;
  readonly readOnlyProviderResolutionFixtures: true;
  readonly readOnlyProviderCapabilityChecks: true;
  readonly readOnlyProviderCompatibilityChecks: true;
  readonly readOnlyProviderGateReports: true;
  readonly readOnlyProviderGateViewModels: true;
  readonly readOnlyProviderGateApiContracts: true;
  readonly readOnlyProviderGateSelectors: true;
  readonly readOnlyProviderGateLiveData: false;
  readonly readOnlyProviderGateNetworkAccess: false;
  readonly readOnlyProviderGateRealProviders: false;
  readonly readOnlyProviderGateProviderAdapters: false;
  readonly readOnlyProviderGateSolanaRpc: false;
  readonly readOnlyProviderGateWebSocketAccess: false;
  readonly readOnlyProviderGateGeyserYellowstone: false;
  readonly readOnlyProviderGatePumpFunIntegration: false;
  readonly readOnlyProviderGateDexIntegration: false;
  readonly readOnlyProviderGateJitoIntegration: false;
  readonly readOnlyProviderGatePersistence: false;
  readonly readOnlyProviderGateFilesystemWrites: false;
  readonly readOnlyProviderGateDownloads: false;
  readonly readOnlyProviderGateRouteHandlers: false;
  readonly readOnlyProviderGateHttpServer: false;
  readonly readOnlyProviderGateRuntimeRequests: false;
  readonly readOnlyProviderGateUiRendering: false;
  readonly readOnlyProviderGateDomAccess: false;
  readonly readOnlyProviderGateBackgroundJobs: false;
  readonly readOnlyProviderGateScheduledJobs: false;
  readonly readOnlyProviderGateWalletLogic: false;
  readonly readOnlyProviderGatePrivateKeyHandling: false;
  readonly readOnlyProviderGateSigning: false;
  readonly readOnlyProviderGateTransactionSending: false;
  readonly readOnlyProviderGateExecution: false;
  readonly readOnlyProviderGateTradingSignals: false;
  readonly readOnlyProviderGateRecommendations: false;
  readonly readOnlyProviderGateInvestmentAdvice: false;
  readonly readOnlyProviderGateLiveExecution: false;
  readonly readOnlyProviderGateStrategySelection: false;
  readonly readOnlyProviderGateRealOrders: false;
  readonly readOnlyProviderGateRealFunds: false;
  readonly readOnlyProviderGateRealPnL: false;
}

export interface ReadOnlyProviderAdapterGateFixture {
  readonly fixtureId: string;
  readonly fixtureName: ReadOnlyProviderAdapterGateName;
  readonly fixtureKind: ReadOnlyProviderAdapterGateKind;
  readonly phase: typeof READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE;
  readonly schemaVersion: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SCHEMA_VERSION;
  readonly sourceProviderContractName: ReadOnlyProviderContractName | null;
  readonly sourceProviderMockName: ReadOnlyProviderAdapterMockName | null;
  readonly gateIdentity: ReadOnlyProviderAdapterGateIdentity;
  readonly gatePolicies: readonly ReadOnlyProviderGatePolicy[];
  readonly gateState: ReadOnlyProviderGateState;
  readonly providerCandidate: ReadOnlyProviderCandidate;
  readonly resolutionResult: ReadOnlyProviderResolutionResult;
  readonly capabilityChecks: readonly ReadOnlyProviderCapabilityCheck[];
  readonly compatibilityChecks: readonly ReadOnlyProviderCompatibilityCheck[];
  readonly gateReport: ReadOnlyProviderAdapterGateReport;
  readonly viewModel: ReadOnlyProviderAdapterGateViewModel;
  readonly apiContracts: ReadOnlyProviderAdapterGateApiContracts;
  readonly selectorExamples: readonly ReadOnlyProviderAdapterGateSelectorResult[];
  readonly capabilityFlags: ReadOnlyProviderAdapterGateCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_GENERATED_AT;
    readonly source: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_SOURCE;
    readonly version: typeof PHASE_63_READ_ONLY_PROVIDER_ADAPTER_GATE_VERSION;
    readonly phase: typeof READ_ONLY_PROVIDER_ADAPTER_GATE_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly failClosed: true;
    readonly noLiveData: true;
    readonly noNetworkAccess: true;
    readonly nonAdvisory: true;
    readonly notExecutable: true;
  };
}

export interface BuildReadOnlyProviderAdapterGateFixtureInput {
  readonly fixtureName: ReadOnlyProviderAdapterGateName;
}

export interface BuildReadOnlyProviderGatePolicyInput {
  readonly fixtureId: string;
  readonly policyKind: ReadOnlyProviderGatePolicyKind;
  readonly enabled: boolean;
}

export interface BuildReadOnlyProviderGateStateInput {
  readonly fixtureId: string;
  readonly stateKind: ReadOnlyProviderGateStateKind;
  readonly allowed: boolean;
  readonly mockOnly: boolean;
  readonly futurePhaseOnly?: boolean;
}

export interface BuildReadOnlyProviderResolutionResultInput {
  readonly fixtureId: string;
  readonly state: ReadOnlyProviderGateState;
  readonly policies: readonly ReadOnlyProviderGatePolicy[];
  readonly candidate: ReadOnlyProviderCandidate;
  readonly rejectionReasons: readonly string[];
}

export interface BuildReadOnlyProviderCapabilityCheckInput {
  readonly fixtureId: string;
  readonly checkKind: ReadOnlyProviderCapabilityCheckKind;
  readonly expectedSafeValue: boolean;
  readonly actualFixtureValue: boolean;
  readonly safetyNotes: readonly string[];
}

export interface BuildReadOnlyProviderCompatibilityCheckInput {
  readonly fixtureId: string;
  readonly checkKind: ReadOnlyProviderCompatibilityCheckKind;
  readonly pass: boolean;
  readonly sourceContractName: ReadOnlyProviderContractName | null;
  readonly sourceMockName: ReadOnlyProviderAdapterMockName | null;
  readonly notes: readonly string[];
}

export interface BuildReadOnlyProviderAdapterGateReportInput {
  readonly fixtureId: string;
  readonly state: ReadOnlyProviderGateState;
  readonly resolution: ReadOnlyProviderResolutionResult;
  readonly capabilityChecks: readonly ReadOnlyProviderCapabilityCheck[];
}

export interface ReadOnlyProviderAdapterGateValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ReadOnlyProviderAdapterGateValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ReadOnlyProviderAdapterGateValidationIssue[];
}

export interface ReadOnlyProviderAdapterGateSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
