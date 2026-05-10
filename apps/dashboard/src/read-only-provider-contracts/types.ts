/**
 * Phase 54 — Read-Only Provider Interface Contracts v1: types.
 */

export const READ_ONLY_PROVIDER_CONTRACTS_PHASE = 54 as const;

export const PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT =
  '2026-01-16T00:00:00.000Z' as const;

export const PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE =
  'phase54_read_only_provider_interface_contracts_v1' as const;

export const PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_VERSION = '1.0.0' as const;

export const READ_ONLY_PROVIDER_CONTRACT_NAMES = [
  'solana-rpc-contract',
  'pump-launch-contract',
  'dex-liquidity-contract',
  'token-metadata-contract',
  'holder-distribution-contract',
  'wallet-cluster-contract',
  'risk-intelligence-contract',
  'disabled-unsafe-contract',
] as const;

export const READ_ONLY_PROVIDER_CONTRACT_KINDS = [
  'solana_rpc_contract',
  'pump_launch_contract',
  'dex_liquidity_contract',
  'token_metadata_contract',
  'holder_distribution_contract',
  'wallet_cluster_contract',
  'risk_intelligence_contract',
  'disabled_unsafe_contract',
] as const;

export type ReadOnlyProviderContractName =
  (typeof READ_ONLY_PROVIDER_CONTRACT_NAMES)[number];

export type ReadOnlyProviderContractKind =
  (typeof READ_ONLY_PROVIDER_CONTRACT_KINDS)[number];

export type ReadOnlyProviderDomain =
  | 'solana_rpc_contract'
  | 'pump_launch_contract'
  | 'dex_liquidity_contract'
  | 'token_metadata_contract'
  | 'holder_distribution_contract'
  | 'wallet_cluster_contract'
  | 'risk_intelligence_contract'
  | 'disabled_unsafe_contract';

export type ReadOnlyProviderHealthStatus =
  | 'synthetic_healthy'
  | 'synthetic_degraded'
  | 'synthetic_unavailable'
  | 'synthetic_disabled'
  | 'synthetic_contract_only';

export type ReadOnlyProviderLatencyBucket =
  | 'synthetic_fast'
  | 'synthetic_medium'
  | 'synthetic_slow'
  | 'synthetic_unknown';

export type ReadOnlyProviderReliabilityLabel =
  | 'synthetic_reliable'
  | 'synthetic_variable'
  | 'synthetic_unreliable'
  | 'synthetic_not_applicable';

export type ReadOnlyProviderResponseKind =
  | 'synthetic_launch_event'
  | 'synthetic_token_profile'
  | 'synthetic_pool_liquidity'
  | 'synthetic_creator_profile'
  | 'synthetic_holder_distribution'
  | 'synthetic_wallet_cluster'
  | 'synthetic_risk_factor'
  | 'synthetic_error';

export type ReadOnlyProviderErrorCode =
  | 'PROVIDER_DISABLED'
  | 'LIVE_NETWORK_UNAVAILABLE'
  | 'UNSAFE_CAPABILITY_REQUESTED'
  | 'UNSUPPORTED_PROVIDER_DOMAIN'
  | 'INVALID_DETERMINISTIC_FIXTURE_QUERY';

// ─── Provider Identity ───────────────────────────────────────

export interface ReadOnlyProviderIdentity {
  readonly providerId: string;
  readonly providerName: string;
  readonly providerKind: ReadOnlyProviderContractKind;
  readonly providerDomain: ReadOnlyProviderDomain;
  readonly sourceCategory: string;
  readonly disabledByDefault: boolean;
  readonly liveNetworkAccess: false;
  readonly walletAccess: false;
  readonly executionAccess: false;
  readonly supportedSyntheticDataDomains: readonly string[];
  readonly safetyNote: string;
}

// ─── Provider Interface Contract ─────────────────────────────

export interface ReadOnlyProviderRequestShape {
  readonly domainQuery: string;
  readonly fixtureQueryId: string;
  readonly localOnly: true;
  readonly synthetic: true;
}

export interface ReadOnlyProviderResponseShape {
  readonly responseId: string;
  readonly statusCode: number;
  readonly success: boolean;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly dataShape: string;
}

export interface ReadOnlyProviderErrorShape {
  readonly errorCode: ReadOnlyProviderErrorCode;
  readonly message: string;
  readonly recoverable: boolean;
  readonly safetyNote: string;
}

export interface ReadOnlyProviderHealthShape {
  readonly status: ReadOnlyProviderHealthStatus;
  readonly latencyBucket: ReadOnlyProviderLatencyBucket;
  readonly reliabilityLabel: ReadOnlyProviderReliabilityLabel;
  readonly syntheticOnly: true;
  readonly noActualHealthCheck: true;
}

export interface ReadOnlyProviderInterfaceContract {
  readonly contractId: string;
  readonly contractVersion: string;
  readonly requestShape: ReadOnlyProviderRequestShape;
  readonly responseShape: ReadOnlyProviderResponseShape;
  readonly errorShape: ReadOnlyProviderErrorShape;
  readonly supportedDomains: readonly ReadOnlyProviderDomain[];
  readonly unsupportedLiveCapabilities: readonly string[];
  readonly safetyNotes: readonly string[];
}

// ─── Provider Capability Contract ────────────────────────────

export interface ReadOnlyProviderCapabilityContract {
  readonly capabilityContractId: string;
  readonly readOnlySupport: true;
  readonly syntheticFixtureSupport: true;
  readonly liveNetworkDisabled: true;
  readonly walletDisabled: true;
  readonly executionDisabled: true;
  readonly tradingSignalsDisabled: true;
  readonly recommendationsDisabled: true;
  readonly investmentAdviceDisabled: true;
  readonly source: string;
}

// ─── Provider Health/Status Contract ─────────────────────────

export interface ReadOnlyProviderHealthContract {
  readonly healthContractId: string;
  readonly deterministicStatus: ReadOnlyProviderHealthStatus;
  readonly syntheticLatencyBucket: ReadOnlyProviderLatencyBucket;
  readonly syntheticReliabilityLabel: ReadOnlyProviderReliabilityLabel;
  readonly deterministicFailureExamples: readonly string[];
  readonly noActualHealthCheck: true;
  readonly syntheticOnly: true;
}

// ─── Synthetic Response Contracts ────────────────────────────

export interface ReadOnlySyntheticResponse {
  readonly responseId: string;
  readonly responseKind: ReadOnlyProviderResponseKind;
  readonly sourceSyntheticLaunchFixtureName: string;
  readonly statusCode: number;
  readonly success: boolean;
  readonly dataShape: string;
  readonly error: ReadOnlyProviderErrorShape | null;
  readonly meta: ReadOnlySyntheticResponseMeta;
  readonly safety: ReadOnlySyntheticResponseSafety;
}

export interface ReadOnlySyntheticResponseMeta {
  readonly generatedAt: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT;
  readonly source: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE;
  readonly fixtureOnly: true;
}

export interface ReadOnlySyntheticResponseSafety {
  readonly nonAdvisory: true;
  readonly contractOnly: true;
  readonly noLiveData: true;
}

// ─── View Model ──────────────────────────────────────────────

export interface ReadOnlyProviderContractViewModel {
  readonly viewModelId: string;
  readonly displayTitle: string;
  readonly displaySubtitle: string;
  readonly providerLabel: string;
  readonly domainLabel: string;
  readonly statusLabel: string;
  readonly capabilitySummary: string;
  readonly disabledSummary: string;
  readonly nonAdvisorySummary: string;
  readonly safetyBadge: string;
}

// ─── API Contract Fixtures ────────────────────────────────────

export interface ReadOnlyProviderApiListContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'list';
  readonly statusCode: number;
  readonly generatedAt: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT;
  readonly source: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: { readonly fixtureIds: readonly string[]; readonly totalCount: number };
}

export interface ReadOnlyProviderApiDetailContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'detail';
  readonly statusCode: number;
  readonly generatedAt: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT;
  readonly source: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: ReadOnlyProviderContractViewModel;
}

export interface ReadOnlyProviderApiSummaryContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'summary';
  readonly statusCode: number;
  readonly generatedAt: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT;
  readonly source: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly providerKind: ReadOnlyProviderContractKind;
    readonly healthStatus: ReadOnlyProviderHealthStatus;
    readonly disabledByDefault: boolean;
  };
}

export interface ReadOnlyProviderApiErrorContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'error';
  readonly statusCode: number;
  readonly generatedAt: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT;
  readonly source: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode: ReadOnlyProviderErrorCode;
  readonly message: string;
}

export interface ReadOnlyProviderApiContracts {
  readonly list: ReadOnlyProviderApiListContract;
  readonly detail: ReadOnlyProviderApiDetailContract;
  readonly summary: ReadOnlyProviderApiSummaryContract;
  readonly errors: readonly [ReadOnlyProviderApiErrorContract, ReadOnlyProviderApiErrorContract];
}

// ─── Selector ────────────────────────────────────────────────

export interface ReadOnlyProviderContractSelectorQuery {
  readonly fixtureId?: string;
  readonly providerKind?: ReadOnlyProviderContractKind;
  readonly domain?: ReadOnlyProviderDomain;
  readonly disabledByDefault?: boolean;
}

export interface ReadOnlyProviderContractSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedProviderKind: ReadOnlyProviderContractKind;
  readonly matched: boolean;
  readonly source: string;
}

// ─── Top-Level Fixture ────────────────────────────────────────

export interface ReadOnlyProviderContractFixture {
  readonly fixtureId: string;
  readonly fixtureName: ReadOnlyProviderContractName;
  readonly fixtureKind: ReadOnlyProviderContractKind;
  readonly phase: typeof READ_ONLY_PROVIDER_CONTRACTS_PHASE;
  readonly providerIdentity: ReadOnlyProviderIdentity;
  readonly providerInterfaceContract: ReadOnlyProviderInterfaceContract;
  readonly providerCapabilityContract: ReadOnlyProviderCapabilityContract;
  readonly providerHealthContract: ReadOnlyProviderHealthContract;
  readonly syntheticResponses: readonly ReadOnlySyntheticResponse[];
  readonly viewModel: ReadOnlyProviderContractViewModel;
  readonly apiContracts: ReadOnlyProviderApiContracts;
  readonly selectorExamples: readonly ReadOnlyProviderContractSelectorResult[];
  readonly capabilityFlags: ReadOnlyProviderContractCapabilities;
  readonly meta: ReadOnlyProviderContractMeta;
  readonly safety: ReadOnlyProviderContractSafety;
}

export interface BuildReadOnlyProviderContractFixtureInput {
  readonly fixtureName: ReadOnlyProviderContractName;
}

// ─── Meta / Safety ────────────────────────────────────────────

export interface ReadOnlyProviderContractMeta {
  readonly generatedAt: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT;
  readonly source: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE;
  readonly version: typeof PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_VERSION;
  readonly phase: typeof READ_ONLY_PROVIDER_CONTRACTS_PHASE;
}

export interface ReadOnlyProviderContractSafety {
  readonly nonAdvisory: true;
  readonly contractOnly: true;
  readonly noLiveData: true;
  readonly noNetworkAccess: true;
  readonly noWalletAccess: true;
  readonly noExecution: true;
}

// ─── Capabilities ─────────────────────────────────────────────

export interface ReadOnlyProviderContractCapabilities {
  readonly readOnlyProviderContracts: true;
  readonly syntheticReadOnlyProviderContracts: true;
  readonly deterministicReadOnlyProviderContracts: true;
  readonly localOnlyReadOnlyProviderContracts: true;
  readonly fixtureDerivedReadOnlyProviderContracts: true;
  readonly readOnlyProviderContractViewModels: true;
  readonly readOnlyProviderApiContracts: true;
  readonly readOnlyProviderSelectors: true;
  readonly readOnlyProviderAdapterGate: true;
  readonly readOnlyProviderLiveData: false;
  readonly readOnlyProviderNetworkAccess: false;
  readonly readOnlyProviderAdapters: false;
  readonly readOnlyProviderSolanaRpc: false;
  readonly readOnlyProviderWebSockets: false;
  readonly readOnlyProviderGeyserYellowstone: false;
  readonly readOnlyProviderPumpFunIntegration: false;
  readonly readOnlyProviderDexIntegration: false;
  readonly readOnlyProviderJitoIntegration: false;
  readonly readOnlyProviderPersistence: false;
  readonly readOnlyProviderFilesystemWrites: false;
  readonly readOnlyProviderDownloads: false;
  readonly readOnlyProviderRouteHandlers: false;
  readonly readOnlyProviderHttpServer: false;
  readonly readOnlyProviderRuntimeRequests: false;
  readonly readOnlyProviderUiRendering: false;
  readonly readOnlyProviderDomAccess: false;
  readonly readOnlyProviderBackgroundJobs: false;
  readonly readOnlyProviderScheduledJobs: false;
  readonly readOnlyProviderWalletLogic: false;
  readonly readOnlyProviderPrivateKeyHandling: false;
  readonly readOnlyProviderSigning: false;
  readonly readOnlyProviderTransactionSending: false;
  readonly readOnlyProviderExecution: false;
  readonly readOnlyProviderTradingSignals: false;
  readonly readOnlyProviderRecommendations: false;
  readonly readOnlyProviderInvestmentAdvice: false;
}

// ─── Validation ───────────────────────────────────────────────

export interface ReadOnlyProviderContractValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ReadOnlyProviderContractValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ReadOnlyProviderContractValidationIssue[];
}

export interface ReadOnlyProviderContractSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
