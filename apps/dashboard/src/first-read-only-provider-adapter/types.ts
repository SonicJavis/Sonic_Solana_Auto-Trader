import type { ReadOnlySolanaProviderBoundaryName } from '../read-only-solana-provider-boundary/types.js';
import type { ReadOnlyProviderAdapterGateName } from '../read-only-provider-adapter-gate/types.js';

export const FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE = 65 as const;
export const PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT =
  '2026-05-12T00:00:00.000Z' as const;
export const PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SOURCE =
  'phase65_first_read_only_provider_adapter_v1' as const;
export const PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_VERSION = '1.0.0' as const;
export const PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SCHEMA_VERSION = '1.0.0' as const;

export const FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES = [
  'offline-account-info-success',
  'offline-mint-authority-success',
  'offline-token-metadata-success',
  'provider-unavailable-error',
  'malformed-response-error',
  'rate-limited-error',
  'gate-closed-rejected',
  'unsupported-write-capability-rejected',
] as const;

export const FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS = [
  'offline_account_info_success',
  'offline_mint_authority_success',
  'offline_token_metadata_success',
  'provider_unavailable_error',
  'malformed_response_error',
  'rate_limited_error',
  'gate_closed_rejected',
  'unsupported_write_capability_rejected',
] as const;

export const FIRST_READ_ONLY_PROVIDER_CONFIG_STATES = [
  'disabled_by_default',
  'offline_fixture_mode',
  'live_smoke_disabled',
  'live_smoke_enabled_explicit_only',
  'missing_configuration',
  'blocked_by_gate',
  'read_only_ready',
] as const;

export const FIRST_READ_ONLY_PROVIDER_TRANSPORT_KINDS = [
  'offline_fixture_transport',
  'future_live_smoke_transport_disabled',
] as const;

export const FIRST_READ_ONLY_PROVIDER_ERROR_CATEGORIES = [
  'provider_unavailable',
  'rate_limited',
  'malformed_response',
  'missing_required_field',
  'unsupported_write_capability',
  'network_access_disabled',
  'gate_closed',
  'live_smoke_disabled',
] as const;

export const FIRST_READ_ONLY_PROVIDER_HEALTH_STATES = [
  'offline_fixture_ready',
  'live_smoke_disabled',
  'configuration_missing',
  'gate_closed',
  'provider_unavailable_fixture',
  'conformance_failed',
] as const;

export type FirstReadOnlyProviderAdapterName = (typeof FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES)[number];
export type FirstReadOnlyProviderAdapterKind = (typeof FIRST_READ_ONLY_PROVIDER_ADAPTER_KINDS)[number];
export type FirstReadOnlyProviderConfigState = (typeof FIRST_READ_ONLY_PROVIDER_CONFIG_STATES)[number];
export type FirstReadOnlyProviderTransportKind = (typeof FIRST_READ_ONLY_PROVIDER_TRANSPORT_KINDS)[number];
export type FirstReadOnlyProviderErrorCategory =
  (typeof FIRST_READ_ONLY_PROVIDER_ERROR_CATEGORIES)[number];
export type FirstReadOnlyProviderHealthState =
  (typeof FIRST_READ_ONLY_PROVIDER_HEALTH_STATES)[number];

export interface FirstReadOnlyProviderAdapterIdentity {
  readonly adapterId: string;
  readonly adapterName: FirstReadOnlyProviderAdapterName;
  readonly adapterKind: FirstReadOnlyProviderAdapterKind;
  readonly adapterProviderKind: 'solana_read_only_account_info';
  readonly sourceBoundaryFixtureName: ReadOnlySolanaProviderBoundaryName;
  readonly sourceGateFixtureName: ReadOnlyProviderAdapterGateName;
  readonly sourceBoundaryFixtureNames: readonly ReadOnlySolanaProviderBoundaryName[];
  readonly sourceGateFixtureNames: readonly ReadOnlyProviderAdapterGateName[];
  readonly schemaVersion: typeof PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT;
}

export interface FirstReadOnlyProviderConfig {
  readonly configId: string;
  readonly mode: FirstReadOnlyProviderConfigState;
  readonly disabledByDefault: true;
  readonly offlineFixtureMode: true;
  readonly liveSmokeEnabled: false;
  readonly liveSmokeRequiresExplicitOptIn: true;
  readonly networkAccessDefault: false;
  readonly apiKeysRequiredByDefault: false;
  readonly endpointRequiredByDefault: false;
  readonly gateRequired: true;
  readonly boundaryRequired: true;
}

export interface FirstReadOnlyProviderCapabilities {
  readonly capabilitiesId: string;
  readonly readOnlyAccountReadShapeSupported: true;
  readonly deterministicFixtureMode: true;
  readonly gateEnforced: true;
  readonly boundaryConformanceEnforced: true;
  readonly writeMethods: false;
  readonly walletRequired: false;
  readonly signingRequired: false;
  readonly transactionSending: false;
  readonly execution: false;
  readonly recommendationsSignalsAdvice: false;
  readonly liveSmokeByDefault: false;
}

export interface FirstReadOnlyProviderTransportContract {
  readonly transportId: string;
  readonly transportKind: FirstReadOnlyProviderTransportKind;
  readonly networkAccessDefault: false;
  readonly sideEffectsAtImport: false;
  readonly sideEffectsAtConstruction: false;
}

export interface FirstReadOnlyProviderClientContract {
  readonly clientContractId: string;
  readonly readOnly: true;
  readonly supportedReadMethods: readonly [
    'getAccountInfoShape',
    'getMintAuthorityShape',
    'getTokenMetadataShape',
    'getProviderHealthShape',
    'getProviderErrorShape',
  ];
  readonly unsupportedWriteMethods: readonly [
    'buildTransaction',
    'signTransaction',
    'sendTransaction',
    'executeOrder',
  ];
  readonly walletRequired: false;
  readonly signingRequired: false;
  readonly transactionSendingRequired: false;
  readonly executionRequired: false;
  readonly constructorHasSideEffects: false;
  readonly moduleImportHasSideEffects: false;
}

export interface FirstReadOnlyProviderFrozenResponseFixture {
  readonly responseId: string;
  readonly responseKind:
    | 'account_info_success'
    | 'mint_authority_success'
    | 'token_metadata_success'
    | 'provider_unavailable'
    | 'malformed_response'
    | 'rate_limited'
    | 'gate_closed'
    | 'unsupported_write_capability';
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly endpoint: null;
  readonly providerSdkReference: null;
  readonly apiKeyRequired: false;
  readonly payload: {
    readonly accountAddress: string | null;
    readonly mintAddress: string | null;
    readonly tokenMetadataRef: string | null;
    readonly authorityRef: string | null;
    readonly providerStatus: string;
    readonly errorCode: string | null;
  };
}

export interface FirstReadOnlyProviderResponseMapping {
  readonly mappingId: string;
  readonly requiredBoundaryFields: readonly [
    'accountAddress',
    'mintAddress',
    'tokenMetadataRef',
    'authorityRef',
    'providerStatus',
  ];
  readonly missingRequiredFields: readonly string[];
  readonly nullableFields: readonly ['tokenMetadataRef', 'authorityRef'];
  readonly semanticCaveat: string;
  readonly noLiveDataClaim: true;
  readonly noWriteCapability: true;
}

export interface FirstReadOnlyProviderErrorNormalization {
  readonly normalizationId: string;
  readonly categories: readonly FirstReadOnlyProviderErrorCategory[];
  readonly primaryCategory: FirstReadOnlyProviderErrorCategory;
}

export interface FirstReadOnlyProviderConformanceCheck {
  readonly conformanceId: string;
  readonly adapterToPhase64BoundaryConformance: boolean;
  readonly adapterToPhase63GateConformance: boolean;
  readonly offlineFixtureTransportConformance: boolean;
  readonly liveSmokeDisabledConformance: boolean;
  readonly writeCapabilityAbsence: boolean;
  readonly walletSigningSendingAbsence: boolean;
}

export interface FirstReadOnlyProviderHealth {
  readonly healthId: string;
  readonly healthState: FirstReadOnlyProviderHealthState;
  readonly healthy: boolean;
}

export interface FirstReadOnlyProviderSmokeGuardInput {
  readonly allowLiveSmoke: boolean;
  readonly explicitGateAccepted: boolean;
  readonly envProvided: boolean;
  readonly allowNetworkInTests: boolean;
}

export interface FirstReadOnlyProviderSmokeGuard {
  readonly smokeGuardId: string;
  readonly canRun: boolean;
  readonly status: 'disabled' | 'skipped' | 'enabled';
  readonly summary: string;
  readonly reasons: readonly string[];
}

export interface FirstReadOnlyProviderAdapterReport {
  readonly reportId: string;
  readonly configState: FirstReadOnlyProviderConfigState;
  readonly capabilitySummary: string;
  readonly gateCompatibility: string;
  readonly boundaryCompatibility: string;
  readonly transportSummary: string;
  readonly healthSummary: string;
  readonly conformanceSummary: string;
  readonly smokeGuardSummary: string;
  readonly safetySummary: string;
}

export interface FirstReadOnlyProviderAdapterViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: FirstReadOnlyProviderAdapterName;
  readonly configState: FirstReadOnlyProviderConfigState;
  readonly healthState: FirstReadOnlyProviderHealthState;
  readonly summary: string;
}

export interface FirstReadOnlyProviderAdapterApiContracts {
  readonly list: {
    readonly contractId: string;
    readonly contractKind: 'list';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: { readonly fixtureIds: readonly string[]; readonly totalCount: number };
  };
  readonly detail: {
    readonly contractId: string;
    readonly contractKind: 'detail';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: FirstReadOnlyProviderAdapterViewModel;
  };
  readonly summary: {
    readonly contractId: string;
    readonly contractKind: 'summary';
    readonly statusCode: 200;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: {
      readonly fixtureId: string;
      readonly configState: FirstReadOnlyProviderConfigState;
      readonly healthState: FirstReadOnlyProviderHealthState;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly errorCode: 'FIRST_READ_ONLY_PROVIDER_ADAPTER_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly errorCode: 'FIRST_READ_ONLY_PROVIDER_ADAPTER_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface FirstReadOnlyProviderAdapterSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: FirstReadOnlyProviderAdapterName;
  readonly fixtureKind?: FirstReadOnlyProviderAdapterKind;
  readonly configState?: FirstReadOnlyProviderConfigState;
}

export interface FirstReadOnlyProviderAdapterSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: FirstReadOnlyProviderAdapterKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface FirstReadOnlyProviderAdapterCapabilities {
  readonly firstReadOnlyProviderAdapter: true;
  readonly firstReadOnlyProviderAdapterFixtures: true;
  readonly deterministicFirstReadOnlyProviderAdapter: true;
  readonly localOnlyFirstReadOnlyProviderAdapter: true;
  readonly offlineFixtureFirstReadOnlyProviderAdapter: true;
  readonly readOnlyFirstProviderClientContract: true;
  readonly firstReadOnlyProviderFrozenResponses: true;
  readonly firstReadOnlyProviderResponseMappings: true;
  readonly firstReadOnlyProviderErrorNormalization: true;
  readonly firstReadOnlyProviderConformanceChecks: true;
  readonly firstReadOnlyProviderHealthModels: true;
  readonly firstReadOnlyProviderSmokeGuard: true;
  readonly firstReadOnlyProviderAdapterReports: true;
  readonly firstReadOnlyProviderAdapterViewModels: true;
  readonly firstReadOnlyProviderAdapterApiContracts: true;
  readonly firstReadOnlyProviderAdapterSelectors: true;
  readonly firstReadOnlyProviderLiveDataDefault: false;
  readonly firstReadOnlyProviderNetworkAccessDefault: false;
  readonly firstReadOnlyProviderLiveSmokeDefault: false;
  readonly firstReadOnlyProviderRealTrading: false;
  readonly firstReadOnlyProviderWriteMethods: false;
  readonly firstReadOnlyProviderProviderSdkRequired: false;
  readonly firstReadOnlyProviderApiKeysRequiredByDefault: false;
  readonly firstReadOnlyProviderSolanaWriteRpc: false;
  readonly firstReadOnlyProviderWalletLogic: false;
  readonly firstReadOnlyProviderPrivateKeyHandling: false;
  readonly firstReadOnlyProviderSigning: false;
  readonly firstReadOnlyProviderTransactionSending: false;
  readonly firstReadOnlyProviderExecution: false;
  readonly firstReadOnlyProviderTradingSignals: false;
  readonly firstReadOnlyProviderRecommendations: false;
  readonly firstReadOnlyProviderInvestmentAdvice: false;
  readonly firstReadOnlyProviderRouteHandlers: false;
  readonly firstReadOnlyProviderRuntimeRequests: false;
  readonly firstReadOnlyProviderUiRendering: false;
  readonly firstReadOnlyProviderDomAccess: false;
  readonly firstReadOnlyProviderPersistence: false;
  readonly firstReadOnlyProviderFilesystemWrites: false;
  readonly firstReadOnlyProviderBackgroundJobs: false;
  readonly firstReadOnlyProviderScheduledJobs: false;
  readonly firstReadOnlyProviderRealOrders: false;
  readonly firstReadOnlyProviderRealFunds: false;
  readonly firstReadOnlyProviderRealPnL: false;
}

export interface FirstReadOnlyProviderAdapterFixture {
  readonly fixtureId: string;
  readonly fixtureName: FirstReadOnlyProviderAdapterName;
  readonly fixtureKind: FirstReadOnlyProviderAdapterKind;
  readonly phase: typeof FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE;
  readonly schemaVersion: typeof PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SCHEMA_VERSION;
  readonly sourceBoundaryFixtureName: ReadOnlySolanaProviderBoundaryName;
  readonly sourceGateFixtureName: ReadOnlyProviderAdapterGateName;
  readonly adapterIdentity: FirstReadOnlyProviderAdapterIdentity;
  readonly providerConfig: FirstReadOnlyProviderConfig;
  readonly providerCapabilities: FirstReadOnlyProviderCapabilities;
  readonly transportContract: FirstReadOnlyProviderTransportContract;
  readonly clientContract: FirstReadOnlyProviderClientContract;
  readonly frozenResponseFixture: FirstReadOnlyProviderFrozenResponseFixture;
  readonly responseMapping: FirstReadOnlyProviderResponseMapping;
  readonly errorNormalization: FirstReadOnlyProviderErrorNormalization;
  readonly conformanceChecks: FirstReadOnlyProviderConformanceCheck;
  readonly health: FirstReadOnlyProviderHealth;
  readonly smokeGuard: FirstReadOnlyProviderSmokeGuard;
  readonly adapterReport: FirstReadOnlyProviderAdapterReport;
  readonly viewModel: FirstReadOnlyProviderAdapterViewModel;
  readonly apiContracts: FirstReadOnlyProviderAdapterApiContracts;
  readonly selectorExamples: readonly FirstReadOnlyProviderAdapterSelectorResult[];
  readonly capabilityFlags: FirstReadOnlyProviderAdapterCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT;
    readonly source: typeof PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SOURCE;
    readonly version: typeof PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_VERSION;
    readonly phase: typeof FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly adapterOnly: true;
    readonly noLiveData: true;
    readonly noNetworkAccessByDefault: true;
    readonly nonAdvisory: true;
    readonly notExecutable: true;
  };
}

export interface BuildFirstReadOnlyProviderAdapterFixtureInput {
  readonly fixtureName: FirstReadOnlyProviderAdapterName;
}

export interface FirstReadOnlyProviderAdapterValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface FirstReadOnlyProviderAdapterValidationResult {
  readonly valid: boolean;
  readonly issues: readonly FirstReadOnlyProviderAdapterValidationIssue[];
}

export interface FirstReadOnlyProviderAdapterSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
