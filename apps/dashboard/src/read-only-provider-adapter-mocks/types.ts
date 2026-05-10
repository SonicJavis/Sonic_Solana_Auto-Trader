/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: types.
 */

export const READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE = 55 as const;

export const PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT =
  '2026-01-23T00:00:00.000Z' as const;

export const PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE =
  'phase55_read_only_provider_adapter_mocks_v1' as const;

export const PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_VERSION = '1.0.0' as const;

export const READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES = [
  'solana-rpc-adapter-mock',
  'pump-launch-adapter-mock',
  'dex-liquidity-adapter-mock',
  'token-metadata-adapter-mock',
  'holder-distribution-adapter-mock',
  'wallet-cluster-adapter-mock',
  'risk-intelligence-adapter-mock',
  'disabled-unsafe-adapter-mock',
] as const;

export const READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS = [
  'mock_solana_rpc_adapter',
  'mock_pump_launch_adapter',
  'mock_dex_liquidity_adapter',
  'mock_token_metadata_adapter',
  'mock_holder_distribution_adapter',
  'mock_wallet_cluster_adapter',
  'mock_risk_intelligence_adapter',
  'mock_disabled_unsafe_adapter',
] as const;

export type ReadOnlyProviderAdapterMockName =
  (typeof READ_ONLY_PROVIDER_ADAPTER_MOCK_NAMES)[number];

export type ReadOnlyProviderAdapterMockKind =
  (typeof READ_ONLY_PROVIDER_ADAPTER_MOCK_KINDS)[number];

export type ReadOnlyProviderAdapterMockDomain = ReadOnlyProviderAdapterMockKind;

export type ReadOnlyProviderAdapterMockHealthLabel =
  | 'synthetic_ready'
  | 'synthetic_limited'
  | 'synthetic_disabled';

export type ReadOnlyProviderAdapterMockLatencyBucket =
  | 'synthetic_fast'
  | 'synthetic_medium'
  | 'synthetic_slow'
  | 'synthetic_none';

export type ReadOnlyProviderAdapterMockReliabilityLabel =
  | 'synthetic_stable'
  | 'synthetic_variable'
  | 'synthetic_not_applicable';

export type ReadOnlyProviderAdapterMockRequestKind =
  | 'launch_event_query'
  | 'token_profile_query'
  | 'pool_liquidity_query'
  | 'creator_profile_query'
  | 'holder_distribution_query'
  | 'wallet_cluster_query'
  | 'risk_factor_query'
  | 'disabled_unsafe_query';

export type ReadOnlyProviderAdapterMockResultKind =
  | 'synthetic_launch_event_response'
  | 'synthetic_token_profile_response'
  | 'synthetic_pool_liquidity_response'
  | 'synthetic_creator_profile_response'
  | 'synthetic_holder_distribution_response'
  | 'synthetic_wallet_cluster_response'
  | 'synthetic_risk_factor_response'
  | 'synthetic_disabled_unsafe_response';

export type ReadOnlyProviderAdapterMockErrorCode =
  | 'LIVE_NETWORK_UNAVAILABLE'
  | 'PROVIDER_DISABLED'
  | 'UNSAFE_CAPABILITY_REQUESTED'
  | 'UNSUPPORTED_SYNTHETIC_DOMAIN'
  | 'INVALID_DETERMINISTIC_MOCK_QUERY';

export interface ReadOnlyProviderAdapterMockIdentity {
  readonly adapterId: string;
  readonly adapterName: string;
  readonly adapterKind: ReadOnlyProviderAdapterMockKind;
  readonly adapterDomain: ReadOnlyProviderAdapterMockDomain;
  readonly sourceProviderContractName: string;
  readonly disabledByDefault: boolean;
  readonly mockOnly: true;
  readonly readOnly: true;
  readonly liveNetworkAccess: false;
  readonly walletAccess: false;
  readonly executionAccess: false;
}

export interface ReadOnlyProviderAdapterMockCapabilityProfile {
  readonly profileId: string;
  readonly readOnlySupport: true;
  readonly fixtureOnlySupport: true;
  readonly liveNetworkDisabled: true;
  readonly walletDisabled: true;
  readonly executionDisabled: true;
  readonly tradingSignalsDisabled: true;
  readonly recommendationsDisabled: true;
  readonly investmentAdviceDisabled: true;
}

export interface ReadOnlyProviderAdapterMockHealthProfile {
  readonly healthProfileId: string;
  readonly healthLabel: ReadOnlyProviderAdapterMockHealthLabel;
  readonly latencyBucket: ReadOnlyProviderAdapterMockLatencyBucket;
  readonly reliabilityLabel: ReadOnlyProviderAdapterMockReliabilityLabel;
  readonly deterministicFailureExamples: readonly string[];
  readonly noActualHealthCheck: true;
  readonly syntheticOnly: true;
}

export interface ReadOnlyProviderAdapterMockRequest {
  readonly requestId: string;
  readonly requestKind: ReadOnlyProviderAdapterMockRequestKind;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly domain: ReadOnlyProviderAdapterMockDomain;
  readonly sourceSyntheticLaunchFixtureName: string;
  readonly requestedResponseKind: ReadOnlyProviderAdapterMockResultKind;
  readonly unsafeLiveRequested: false;
}

export interface ReadOnlyProviderAdapterMockError {
  readonly errorCode: ReadOnlyProviderAdapterMockErrorCode;
  readonly message: string;
  readonly recoverable: boolean;
}

export interface ReadOnlyProviderAdapterMockResult {
  readonly resultId: string;
  readonly resultKind: ReadOnlyProviderAdapterMockResultKind;
  readonly statusCode: number;
  readonly success: boolean;
  readonly matched: boolean;
  readonly data: Record<string, unknown> | null;
  readonly error: ReadOnlyProviderAdapterMockError | null;
  readonly meta: {
    readonly generatedAt: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT;
    readonly source: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE;
    readonly fixtureOnly: true;
  };
  readonly safety: {
    readonly nonAdvisory: true;
    readonly mockOnly: true;
    readonly noLiveData: true;
  };
}

export interface ReadOnlyProviderAdapterMockViewModel {
  readonly viewModelId: string;
  readonly displayTitle: string;
  readonly displaySubtitle: string;
  readonly adapterLabel: string;
  readonly domainLabel: string;
  readonly sourceProviderContractLabel: string;
  readonly statusLabel: string;
  readonly capabilitySummary: string;
  readonly disabledSummary: string;
  readonly nonAdvisorySummary: string;
  readonly safetyBadge: string;
}

export interface ReadOnlyProviderAdapterMockApiListContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'list';
  readonly statusCode: number;
  readonly generatedAt: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT;
  readonly source: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: { readonly fixtureIds: readonly string[]; readonly totalCount: number };
}

export interface ReadOnlyProviderAdapterMockApiDetailContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'detail';
  readonly statusCode: number;
  readonly generatedAt: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT;
  readonly source: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: ReadOnlyProviderAdapterMockViewModel;
}

export interface ReadOnlyProviderAdapterMockApiSummaryContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'summary';
  readonly statusCode: number;
  readonly generatedAt: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT;
  readonly source: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly adapterKind: ReadOnlyProviderAdapterMockKind;
    readonly domain: ReadOnlyProviderAdapterMockDomain;
    readonly sourceProviderContractName: string;
    readonly healthLabel: ReadOnlyProviderAdapterMockHealthLabel;
  };
}

export interface ReadOnlyProviderAdapterMockApiErrorContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'error';
  readonly statusCode: number;
  readonly generatedAt: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT;
  readonly source: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode: ReadOnlyProviderAdapterMockErrorCode;
  readonly message: string;
}

export interface ReadOnlyProviderAdapterMockApiContracts {
  readonly list: ReadOnlyProviderAdapterMockApiListContract;
  readonly detail: ReadOnlyProviderAdapterMockApiDetailContract;
  readonly summary: ReadOnlyProviderAdapterMockApiSummaryContract;
  readonly errors: readonly [
    ReadOnlyProviderAdapterMockApiErrorContract,
    ReadOnlyProviderAdapterMockApiErrorContract,
  ];
}

export interface ReadOnlyProviderAdapterMockSelectorQuery {
  readonly fixtureId?: string;
  readonly adapterKind?: ReadOnlyProviderAdapterMockKind;
  readonly domain?: ReadOnlyProviderAdapterMockDomain;
  readonly fixtureName?: ReadOnlyProviderAdapterMockName;
}

export interface ReadOnlyProviderAdapterMockSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedAdapterKind: ReadOnlyProviderAdapterMockKind;
  readonly selectedDomain: ReadOnlyProviderAdapterMockDomain;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface ReadOnlyProviderAdapterMockFixture {
  readonly fixtureId: string;
  readonly fixtureName: ReadOnlyProviderAdapterMockName;
  readonly fixtureKind: ReadOnlyProviderAdapterMockKind;
  readonly phase: typeof READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE;
  readonly sourceProviderContractName: string;
  readonly adapterIdentity: ReadOnlyProviderAdapterMockIdentity;
  readonly adapterCapabilityProfile: ReadOnlyProviderAdapterMockCapabilityProfile;
  readonly adapterHealthProfile: ReadOnlyProviderAdapterMockHealthProfile;
  readonly mockRequest: ReadOnlyProviderAdapterMockRequest;
  readonly mockResult: ReadOnlyProviderAdapterMockResult;
  readonly viewModel: ReadOnlyProviderAdapterMockViewModel;
  readonly apiContracts: ReadOnlyProviderAdapterMockApiContracts;
  readonly selectorExamples: readonly ReadOnlyProviderAdapterMockSelectorResult[];
  readonly capabilityFlags: ReadOnlyProviderAdapterMockCapabilities;
  readonly meta: ReadOnlyProviderAdapterMockMeta;
  readonly safety: ReadOnlyProviderAdapterMockSafety;
}

export interface BuildReadOnlyProviderAdapterMockFixtureInput {
  readonly fixtureName: ReadOnlyProviderAdapterMockName;
}

export interface ReadOnlyProviderAdapterMockMeta {
  readonly generatedAt: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT;
  readonly source: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE;
  readonly version: typeof PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_VERSION;
  readonly phase: typeof READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE;
  readonly seed: 'phase55-deterministic-seed-v1';
}

export interface ReadOnlyProviderAdapterMockSafety {
  readonly nonAdvisory: true;
  readonly mockOnly: true;
  readonly noLiveData: true;
  readonly noNetworkAccess: true;
  readonly noWalletAccess: true;
  readonly noExecution: true;
}

export interface ReadOnlyProviderAdapterMockCapabilities {
  readonly readOnlyProviderAdapterMocks: true;
  readonly syntheticReadOnlyProviderAdapterMocks: true;
  readonly deterministicReadOnlyProviderAdapterMocks: true;
  readonly localOnlyReadOnlyProviderAdapterMocks: true;
  readonly fixtureDerivedReadOnlyProviderAdapterMocks: true;
  readonly pureReadOnlyProviderAdapterMocks: true;
  readonly readOnlyProviderAdapterMockViewModels: true;
  readonly readOnlyProviderAdapterMockApiContracts: true;
  readonly readOnlyProviderAdapterMockSelectors: true;
  readonly readOnlyProviderAdapterMockLiveData: false;
  readonly readOnlyProviderAdapterMockNetworkAccess: false;
  readonly readOnlyProviderAdapterMockRealAdapters: false;
  readonly readOnlyProviderAdapterMockSolanaRpc: false;
  readonly readOnlyProviderAdapterMockWebSocketAccess: false;
  readonly readOnlyProviderAdapterMockGeyserYellowstone: false;
  readonly readOnlyProviderAdapterMockPumpFunIntegration: false;
  readonly readOnlyProviderAdapterMockDexIntegration: false;
  readonly readOnlyProviderAdapterMockJitoIntegration: false;
  readonly readOnlyProviderAdapterMockPersistence: false;
  readonly readOnlyProviderAdapterMockFilesystemWrites: false;
  readonly readOnlyProviderAdapterMockDownloads: false;
  readonly readOnlyProviderAdapterMockRouteHandlers: false;
  readonly readOnlyProviderAdapterMockHttpServer: false;
  readonly readOnlyProviderAdapterMockRuntimeRequests: false;
  readonly readOnlyProviderAdapterMockUiRendering: false;
  readonly readOnlyProviderAdapterMockDomAccess: false;
  readonly readOnlyProviderAdapterMockBackgroundJobs: false;
  readonly readOnlyProviderAdapterMockScheduledJobs: false;
  readonly readOnlyProviderAdapterMockWalletLogic: false;
  readonly readOnlyProviderAdapterMockPrivateKeyHandling: false;
  readonly readOnlyProviderAdapterMockSigning: false;
  readonly readOnlyProviderAdapterMockTransactionSending: false;
  readonly readOnlyProviderAdapterMockExecution: false;
  readonly readOnlyProviderAdapterMockTradingSignals: false;
  readonly readOnlyProviderAdapterMockRecommendations: false;
  readonly readOnlyProviderAdapterMockInvestmentAdvice: false;
}

export interface ReadOnlyProviderAdapterMockRunInput {
  readonly fixtureId?: string;
  readonly adapterKind?: ReadOnlyProviderAdapterMockKind;
  readonly domain?: ReadOnlyProviderAdapterMockDomain;
  readonly requestedResponseKind?: ReadOnlyProviderAdapterMockResultKind;
  readonly sourceSyntheticLaunchFixtureName?: string;
  readonly unsafeLiveRequested?: boolean;
}

export interface ReadOnlyProviderAdapterMockValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ReadOnlyProviderAdapterMockValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ReadOnlyProviderAdapterMockValidationIssue[];
}

export interface ReadOnlyProviderAdapterMockSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
