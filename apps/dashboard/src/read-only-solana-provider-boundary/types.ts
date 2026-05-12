import type { ReadOnlyProviderAdapterGateName } from '../read-only-provider-adapter-gate/types.js';
import type { ReadOnlyProviderAdapterMockName } from '../read-only-provider-adapter-mocks/types.js';
import type { ReadOnlyProviderContractName } from '../read-only-provider-contracts/types.js';

export const READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE = 64 as const;
export const PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT =
  '2026-05-12T00:00:00.000Z' as const;
export const PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE =
  'phase64_read_only_solana_provider_boundary_v1' as const;
export const PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_VERSION = '1.0.0' as const;
export const PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SCHEMA_VERSION = '1.0.0' as const;

export const READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES = [
  'account-info-boundary-ready',
  'token-metadata-boundary-ready',
  'mint-authority-boundary-ready',
  'holder-distribution-boundary-ready',
  'liquidity-snapshot-boundary-ready',
  'provider-health-boundary-ready',
  'error-normalization-boundary-ready',
  'unsafe-write-capability-boundary-rejected',
] as const;

export const READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS = [
  'account_info_boundary_ready',
  'token_metadata_boundary_ready',
  'mint_authority_boundary_ready',
  'holder_distribution_boundary_ready',
  'liquidity_snapshot_boundary_ready',
  'provider_health_boundary_ready',
  'error_normalization_boundary_ready',
  'unsafe_write_capability_boundary_rejected',
] as const;

export const READ_ONLY_SOLANA_PROVIDER_BOUNDARY_STATE_KINDS = [
  'boundary_not_live',
  'mock_contract_parity_ready',
  'mock_contract_parity_failed',
  'field_mapping_ready',
  'field_mapping_incomplete',
  'error_mapping_ready',
  'conformance_ready_for_future_provider',
  'future_real_provider_blocked_by_gate',
] as const;

export const READ_ONLY_SOLANA_FIELD_MAPPING_KINDS = [
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

export const READ_ONLY_SOLANA_ERROR_NORMALIZATION_CATEGORIES = [
  'provider_unavailable_future',
  'rate_limited_future',
  'malformed_response_future',
  'missing_required_field',
  'unsupported_write_capability',
  'network_access_blocked',
  'gate_closed',
  'unknown_future_provider_error',
] as const;

export const READ_ONLY_SOLANA_CONFORMANCE_CHECK_KINDS = [
  'mock_to_contract_conformance',
  'future_placeholder_to_contract_conformance',
  'required_field_coverage',
  'nullability_handling',
  'error_normalization_coverage',
  'gate_compatibility',
  'no_live_provider_readiness_claim',
] as const;

export type ReadOnlySolanaProviderBoundaryName =
  (typeof READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES)[number];
export type ReadOnlySolanaProviderBoundaryKind =
  (typeof READ_ONLY_SOLANA_PROVIDER_BOUNDARY_KINDS)[number];
export type ReadOnlySolanaProviderBoundaryStateKind =
  (typeof READ_ONLY_SOLANA_PROVIDER_BOUNDARY_STATE_KINDS)[number];
export type ReadOnlySolanaFieldMappingKind = (typeof READ_ONLY_SOLANA_FIELD_MAPPING_KINDS)[number];
export type ReadOnlySolanaErrorNormalizationCategory =
  (typeof READ_ONLY_SOLANA_ERROR_NORMALIZATION_CATEGORIES)[number];
export type ReadOnlySolanaConformanceCheckKind =
  (typeof READ_ONLY_SOLANA_CONFORMANCE_CHECK_KINDS)[number];

export interface ReadOnlySolanaBoundaryIdentity {
  readonly boundaryId: string;
  readonly boundaryName: ReadOnlySolanaProviderBoundaryName;
  readonly boundaryKind: ReadOnlySolanaProviderBoundaryKind;
  readonly sourceGateFixtureName: ReadOnlyProviderAdapterGateName;
  readonly sourceProviderContractName: ReadOnlyProviderContractName;
  readonly sourceMockAdapterName: ReadOnlyProviderAdapterMockName;
  readonly sourceGateFixtureNames: readonly ReadOnlyProviderAdapterGateName[];
  readonly sourceProviderContractNames: readonly ReadOnlyProviderContractName[];
  readonly sourceMockAdapterNames: readonly ReadOnlyProviderAdapterMockName[];
  readonly schemaVersion: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT;
}

export interface ReadOnlySolanaBoundaryState {
  readonly stateId: string;
  readonly stateKind: ReadOnlySolanaProviderBoundaryStateKind;
  readonly notLive: true;
  readonly gateAware: true;
  readonly futureOnly: boolean;
  readonly allowedByGate: boolean;
}

export interface ReadOnlySolanaFieldMappingRule {
  readonly mappingId: string;
  readonly mappingKind: ReadOnlySolanaFieldMappingKind;
  readonly sourceMockField: string;
  readonly futureRealField: string;
  readonly normalizedField: string;
  readonly required: boolean;
  readonly nullable: boolean;
  readonly coverageStatus: 'covered' | 'unmapped';
  readonly semanticCaveat: string;
  readonly sourceContractName: ReadOnlyProviderContractName;
}

export interface ReadOnlySolanaMockToRealMapping {
  readonly mappingModelId: string;
  readonly mappingModelKind: 'mock_to_real_boundary_mapping';
  readonly sourceMockAdapterName: ReadOnlyProviderAdapterMockName;
  readonly sourceProviderContractName: ReadOnlyProviderContractName;
  readonly fieldMappings: readonly ReadOnlySolanaFieldMappingRule[];
  readonly mappingStatus: 'ready' | 'incomplete';
  readonly unmappedRequiredFields: readonly string[];
}

export interface ReadOnlySolanaErrorNormalizationRule {
  readonly ruleId: string;
  readonly category: ReadOnlySolanaErrorNormalizationCategory;
  readonly sourceErrorCode: string;
  readonly normalizedErrorCode: string;
  readonly normalizedCategory: string;
  readonly safetyNote: string;
}

export interface ReadOnlySolanaConformanceCheck {
  readonly checkId: string;
  readonly checkKind: ReadOnlySolanaConformanceCheckKind;
  readonly pass: boolean;
  readonly summary: string;
}

export interface ReadOnlySolanaMockResponseShape {
  readonly mockResponseId: string;
  readonly sourceMockAdapterFixtureName: ReadOnlyProviderAdapterMockName;
  readonly sourceProviderContractName: ReadOnlyProviderContractName;
  readonly normalizedShape: string;
  readonly fieldMappingStatus: 'ready' | 'incomplete';
  readonly unmappedFieldList: readonly string[];
  readonly semanticCaveats: readonly string[];
  readonly livePayload: false;
  readonly rpcPayload: false;
  readonly endpoint: null;
}

export interface ReadOnlySolanaFutureRealResponsePlaceholder {
  readonly placeholderId: string;
  readonly placeholderKind: 'future_read_only_solana_provider_response_placeholder';
  readonly futureOnly: true;
  readonly liveData: false;
  readonly networkEndpoint: null | string;
  readonly providerSdk: null | string;
  readonly apiKeyRequired: false;
  readonly writeCapability: false;
  readonly walletRequired: false;
  readonly signingRequired: false;
  readonly transactionSendingRequired: false;
}

export interface ReadOnlySolanaBoundaryReport {
  readonly reportId: string;
  readonly boundaryState: ReadOnlySolanaProviderBoundaryStateKind;
  readonly mappingCoverageSummary: string;
  readonly conformanceSummary: string;
  readonly errorNormalizationSummary: string;
  readonly gateCompatibilitySummary: string;
  readonly unsafeCapabilitySummary: string;
  readonly futureProviderNotes: readonly string[];
  readonly noLiveExecution: true;
  readonly noRecommendationOutput: true;
}

export interface ReadOnlySolanaProviderBoundaryViewModel {
  readonly viewModelId: string;
  readonly fixtureId: string;
  readonly fixtureName: ReadOnlySolanaProviderBoundaryName;
  readonly boundaryState: ReadOnlySolanaProviderBoundaryStateKind;
  readonly mappingStatus: 'ready' | 'incomplete';
  readonly conformancePassCount: number;
  readonly conformanceFailCount: number;
  readonly summary: string;
}

export interface ReadOnlySolanaProviderBoundaryApiContracts {
  readonly list: {
    readonly contractId: string;
    readonly contractKind: 'list';
    readonly statusCode: 200;
    readonly generatedAt: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT;
    readonly source: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: { readonly fixtureIds: readonly string[]; readonly totalCount: number };
  };
  readonly detail: {
    readonly contractId: string;
    readonly contractKind: 'detail';
    readonly statusCode: 200;
    readonly generatedAt: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT;
    readonly source: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: ReadOnlySolanaProviderBoundaryViewModel;
  };
  readonly summary: {
    readonly contractId: string;
    readonly contractKind: 'summary';
    readonly statusCode: 200;
    readonly generatedAt: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT;
    readonly source: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE;
    readonly fixtureOnly: true;
    readonly readOnly: true;
    readonly localOnly: true;
    readonly data: {
      readonly fixtureId: string;
      readonly boundaryState: ReadOnlySolanaProviderBoundaryStateKind;
      readonly mappingStatus: 'ready' | 'incomplete';
      readonly gateBlocked: boolean;
    };
  };
  readonly errors: readonly [
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 400;
      readonly generatedAt: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT;
      readonly source: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE;
      readonly fixtureOnly: true;
      readonly readOnly: true;
      readonly localOnly: true;
      readonly errorCode: 'READ_ONLY_SOLANA_PROVIDER_BOUNDARY_INVALID_REQUEST';
      readonly message: string;
    },
    {
      readonly contractId: string;
      readonly contractKind: 'error';
      readonly statusCode: 404;
      readonly generatedAt: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT;
      readonly source: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE;
      readonly fixtureOnly: true;
      readonly readOnly: true;
      readonly localOnly: true;
      readonly errorCode: 'READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NOT_FOUND';
      readonly message: string;
    },
  ];
}

export interface ReadOnlySolanaProviderBoundarySelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: ReadOnlySolanaProviderBoundaryName;
  readonly fixtureKind?: ReadOnlySolanaProviderBoundaryKind;
  readonly boundaryState?: ReadOnlySolanaProviderBoundaryStateKind;
}

export interface ReadOnlySolanaProviderBoundarySelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: ReadOnlySolanaProviderBoundaryKind;
  readonly selectedBoundaryState: ReadOnlySolanaProviderBoundaryStateKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface ReadOnlySolanaProviderBoundaryCapabilities {
  readonly readOnlySolanaProviderBoundary: true;
  readonly readOnlySolanaProviderBoundaryFixtures: true;
  readonly deterministicReadOnlySolanaProviderBoundary: true;
  readonly localOnlyReadOnlySolanaProviderBoundary: true;
  readonly fixtureDerivedReadOnlySolanaProviderBoundary: true;
  readonly readOnlySolanaMockToRealMappings: true;
  readonly readOnlySolanaFieldMappingRules: true;
  readonly readOnlySolanaErrorNormalizationRules: true;
  readonly readOnlySolanaConformanceChecks: true;
  readonly readOnlySolanaBoundaryReports: true;
  readonly readOnlySolanaBoundaryViewModels: true;
  readonly readOnlySolanaBoundaryApiContracts: true;
  readonly readOnlySolanaBoundarySelectors: true;
  readonly readOnlySolanaBoundaryLiveData: false;
  readonly readOnlySolanaBoundaryNetworkAccess: false;
  readonly readOnlySolanaBoundaryRealProviders: false;
  readonly readOnlySolanaBoundaryProviderAdapters: false;
  readonly readOnlySolanaBoundaryProviderSdk: false;
  readonly readOnlySolanaBoundaryApiKeys: false;
  readonly readOnlySolanaBoundarySolanaRpc: false;
  readonly readOnlySolanaBoundaryWebSocketAccess: false;
  readonly readOnlySolanaBoundaryGeyserYellowstone: false;
  readonly readOnlySolanaBoundaryPumpFunIntegration: false;
  readonly readOnlySolanaBoundaryDexIntegration: false;
  readonly readOnlySolanaBoundaryJitoIntegration: false;
  readonly readOnlySolanaBoundaryPersistence: false;
  readonly readOnlySolanaBoundaryFilesystemWrites: false;
  readonly readOnlySolanaBoundaryDownloads: false;
  readonly readOnlySolanaBoundaryRouteHandlers: false;
  readonly readOnlySolanaBoundaryHttpServer: false;
  readonly readOnlySolanaBoundaryRuntimeRequests: false;
  readonly readOnlySolanaBoundaryUiRendering: false;
  readonly readOnlySolanaBoundaryDomAccess: false;
  readonly readOnlySolanaBoundaryBackgroundJobs: false;
  readonly readOnlySolanaBoundaryScheduledJobs: false;
  readonly readOnlySolanaBoundaryWalletLogic: false;
  readonly readOnlySolanaBoundaryPrivateKeyHandling: false;
  readonly readOnlySolanaBoundarySigning: false;
  readonly readOnlySolanaBoundaryTransactionSending: false;
  readonly readOnlySolanaBoundaryExecution: false;
  readonly readOnlySolanaBoundaryTradingSignals: false;
  readonly readOnlySolanaBoundaryRecommendations: false;
  readonly readOnlySolanaBoundaryInvestmentAdvice: false;
  readonly readOnlySolanaBoundaryLiveExecution: false;
  readonly readOnlySolanaBoundaryStrategySelection: false;
  readonly readOnlySolanaBoundaryRealOrders: false;
  readonly readOnlySolanaBoundaryRealFunds: false;
  readonly readOnlySolanaBoundaryRealPnL: false;
  readonly readOnlySolanaBoundaryWriteCapabilities: false;
}

export interface ReadOnlySolanaProviderBoundaryFixture {
  readonly fixtureId: string;
  readonly fixtureName: ReadOnlySolanaProviderBoundaryName;
  readonly fixtureKind: ReadOnlySolanaProviderBoundaryKind;
  readonly phase: typeof READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE;
  readonly schemaVersion: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SCHEMA_VERSION;
  readonly sourceGateFixtureName: ReadOnlyProviderAdapterGateName;
  readonly sourceProviderContractName: ReadOnlyProviderContractName;
  readonly sourceMockAdapterName: ReadOnlyProviderAdapterMockName;
  readonly boundaryIdentity: ReadOnlySolanaBoundaryIdentity;
  readonly boundaryState: ReadOnlySolanaBoundaryState;
  readonly mockToRealMapping: ReadOnlySolanaMockToRealMapping;
  readonly mockResponseShape: ReadOnlySolanaMockResponseShape;
  readonly futureRealResponsePlaceholder: ReadOnlySolanaFutureRealResponsePlaceholder;
  readonly fieldMappings: readonly ReadOnlySolanaFieldMappingRule[];
  readonly errorNormalizationRules: readonly ReadOnlySolanaErrorNormalizationRule[];
  readonly conformanceChecks: readonly ReadOnlySolanaConformanceCheck[];
  readonly boundaryReport: ReadOnlySolanaBoundaryReport;
  readonly viewModel: ReadOnlySolanaProviderBoundaryViewModel;
  readonly apiContracts: ReadOnlySolanaProviderBoundaryApiContracts;
  readonly selectorExamples: readonly ReadOnlySolanaProviderBoundarySelectorResult[];
  readonly capabilityFlags: ReadOnlySolanaProviderBoundaryCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_GENERATED_AT;
    readonly source: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_SOURCE;
    readonly version: typeof PHASE_64_READ_ONLY_SOLANA_PROVIDER_BOUNDARY_VERSION;
    readonly phase: typeof READ_ONLY_SOLANA_PROVIDER_BOUNDARY_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly boundaryOnly: true;
    readonly noLiveData: true;
    readonly noNetworkAccess: true;
    readonly nonAdvisory: true;
    readonly notExecutable: true;
  };
}

export interface BuildReadOnlySolanaProviderBoundaryFixtureInput {
  readonly fixtureName: ReadOnlySolanaProviderBoundaryName;
}
export interface BuildReadOnlySolanaBoundaryStateInput {
  readonly fixtureId: string;
  readonly stateKind: ReadOnlySolanaProviderBoundaryStateKind;
  readonly futureOnly: boolean;
  readonly allowedByGate: boolean;
}
export interface BuildReadOnlySolanaFieldMappingRuleInput {
  readonly fixtureId: string;
  readonly sourceContractName: ReadOnlyProviderContractName;
  readonly mappingKind: ReadOnlySolanaFieldMappingKind;
  readonly sourceMockField: string;
  readonly futureRealField: string;
  readonly normalizedField: string;
  readonly required: boolean;
  readonly nullable: boolean;
  readonly coverageStatus: 'covered' | 'unmapped';
  readonly semanticCaveat: string;
}
export interface BuildReadOnlySolanaErrorNormalizationRuleInput {
  readonly fixtureId: string;
  readonly category: ReadOnlySolanaErrorNormalizationCategory;
  readonly sourceErrorCode: string;
  readonly normalizedErrorCode: string;
  readonly normalizedCategory: string;
  readonly safetyNote: string;
}
export interface BuildReadOnlySolanaConformanceCheckInput {
  readonly fixtureId: string;
  readonly checkKind: ReadOnlySolanaConformanceCheckKind;
  readonly pass: boolean;
  readonly summary: string;
}
export interface BuildReadOnlySolanaBoundaryReportInput {
  readonly fixtureId: string;
  readonly boundaryState: ReadOnlySolanaBoundaryState;
  readonly fieldMappings: readonly ReadOnlySolanaFieldMappingRule[];
  readonly conformanceChecks: readonly ReadOnlySolanaConformanceCheck[];
  readonly errorNormalizationRules: readonly ReadOnlySolanaErrorNormalizationRule[];
  readonly gateBlocked: boolean;
}

export interface ReadOnlySolanaProviderBoundaryValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}
export interface ReadOnlySolanaProviderBoundaryValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ReadOnlySolanaProviderBoundaryValidationIssue[];
}
export interface ReadOnlySolanaProviderBoundarySafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
