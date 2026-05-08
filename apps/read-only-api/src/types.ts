/**
 * apps/read-only-api/src/types.ts
 *
 * Phase 22 — Local Read-Only API Shell types (extends Phase 21).
 *
 * All output models carry:
 *   fixtureOnly: true
 *   liveData: false
 *   safeToDisplay: true
 *   analysisOnly: true
 *   nonExecutable: true
 *   readOnly: true
 *   localOnly: true
 *
 * Phase 21 additions:
 *   - canFilterFixtureData, canPaginateFixtureData, canSortFixtureData capabilities
 *   - LroApiQueryMeta — query/filter/pagination metadata in responses
 *
 * Phase 22 additions:
 *   - ReadOnlyApiMethod — literal 'GET'
 *   - ReadOnlyApiErrorCode — stable Phase 22 error code constants
 *   - ReadOnlyApiErrorDetail — field-level error detail
 *   - ReadOnlyApiError — structured error with code, message, details
 *   - ReadOnlyApiContractMeta — Phase 22 deterministic response metadata
 *   - ReadOnlyApiSuccessEnvelope<T> — Phase 22 success envelope
 *   - ReadOnlyApiErrorEnvelope — Phase 22 error envelope
 *   - ReadOnlyApiEnvelope<T> — union type
 *   - ReadOnlyApiEndpointContract — per-endpoint contract descriptor
 *   - Phase 22 capability flags on LocalReadOnlyApiCapabilities
 *
 * IMPORTANT: LocalReadOnlyApi is NOT a trading system, live data source, or UI.
 * It is a localhost-only, GET-only, fixture-only, read-only, analysis-only,
 * non-executable Fastify API shell serving safe contract/read-model fixtures.
 * It must never create real trade intents, execution plans, orders,
 * paper trades, live data access, or any actionable output.
 * It must only bind to 127.0.0.1.
 */

// ─── Capabilities ────────────────────────────────────────────────────────────

/**
 * LocalReadOnlyApiCapabilities.
 * All unsafe fields are permanently false.
 * Safe/allowed local fields are true.
 * canStartLocalhostServer may be true only for 127.0.0.1 binding.
 */
export interface LocalReadOnlyApiCapabilities {
  // Unsafe — permanently false
  readonly canUseLiveData: false;
  readonly canUseSolanaRpc: false;
  readonly canUseProviderApis: false;
  readonly canAccessPrivateKeys: false;
  readonly canCreateTradeIntents: false;
  readonly canCreateExecutionPlans: false;
  readonly canPaperTrade: false;
  readonly canTrade: false;
  readonly canExecute: false;
  readonly canWriteToDatabase: false;
  readonly canSendTelegramAlerts: false;
  readonly canConstructTransactions: false;
  readonly canSimulateTransactions: false;
  readonly canCreateOrders: false;
  readonly canCreatePositions: false;
  readonly canCalculateLivePnl: false;
  readonly canMutatePriorEvidence: false;
  readonly canRenderUi: false;
  readonly canUseExternalNetwork: false;
  // Allowed — for 127.0.0.1-only server
  readonly canStartLocalhostServer: true;
  readonly canServeReadOnlyContracts: true;
  readonly canServeFixtureReadModels: true;
  // Phase 21 — allowed query/filter/pagination capabilities
  readonly canFilterFixtureData: true;
  readonly canPaginateFixtureData: true;
  readonly canSortFixtureData: true;
  // Phase 22 — response contract capabilities
  readonly canServeResponseEnvelopes: true;
  readonly canReturnErrorEnvelopes: true;
  readonly canValidateQueryErrors: true;
  readonly canProvideDeterministicMetadata: true;
  readonly canProvideEndpointContracts: true;
  // Phase 23 — local consumer SDK capabilities
  readonly consumerSdk: true;
  readonly contractFixtures: true;
  readonly typedRequestBuilders: true;
  readonly responseParsers: true;
  readonly fixtureValidation: true;
  readonly inProcessOnlyClient: true;
  readonly externalNetworkClient: false;
  // Phase 24 — dashboard view-model adapter capabilities
  readonly dashboardDataAdapter: true;
  readonly dashboardViewModels: true;
  readonly fixtureBackedViewModels: true;
  readonly uiReadyDataShapes: true;
  readonly pureViewModelTransforms: true;
  readonly dashboardUi: false;
  readonly externalDashboardData: false;
  // Phase 25 — local read-only dashboard UI shell capabilities
  readonly dashboardUiShell: true;
  readonly localReadOnlyDashboard: true;
  readonly fixtureBackedDashboardUi: true;
  readonly dashboardUsesViewModels: true;
  readonly dashboardInteractionState: true;
  readonly localDashboardFilters: true;
  readonly inMemoryDashboardState: true;
  readonly deterministicDashboardState: true;
  readonly dashboardPanelVisibility: true;
  readonly dashboardFilterSelectors: true;
  readonly dashboardPersistentState: false;
  readonly dashboardExternalStateSync: false;
  readonly dashboardLiveFilters: false;
  readonly dashboardExternalNetwork: false;
  readonly dashboardLiveData: false;
  readonly dashboardTradingControls: false;
  readonly dashboardWalletControls: false;
  readonly dashboardMutationControls: false;
  readonly dashboardExecutionControls: false;
  readonly dashboardWalletConnection: false;
  readonly dashboardRealTimeUpdates: false;
  // Phase 28 — dashboard report export model capabilities
  readonly dashboardReportModels: true;
  readonly dashboardReportFixtures: true;
  readonly deterministicReportModels: true;
  readonly reportSafetyValidation: true;
  readonly fixtureBackedReports: true;
  readonly dashboardReportFileExport: false;
  readonly dashboardReportPersistence: false;
  readonly dashboardReportExternalNetwork: false;
  readonly dashboardReportLiveData: false;
  readonly dashboardReportMutationControls: false;
  // Phase 29 — dashboard report serialization preview capabilities
  readonly dashboardReportSerializationPreview: true;
  readonly dashboardReportJsonPreview: true;
  readonly dashboardReportMarkdownPreview: true;
  readonly dashboardReportTextPreview: true;
  readonly dashboardReportMetadataPreview: true;
  readonly dashboardReportActualFileExport: false;
  readonly dashboardReportDownloadSupport: false;
  // Phase 30 — creator intelligence fixture capabilities
  readonly creatorIntelligenceFixtures: true;
  readonly syntheticCreatorProfiles: true;
  readonly creatorNarrativeFixtures: true;
  readonly creatorRiskIndicators: true;
  readonly creatorCredibilityIndicators: true;
  readonly creatorFixtureSafetyValidation: true;
  readonly creatorLiveData: false;
  readonly creatorSocialApiAccess: false;
  readonly creatorScraping: false;
  readonly creatorIdentityResolution: false;
  readonly creatorInvestmentAdvice: false;
  readonly creatorTradingSignals: false;
  readonly creatorExternalNetwork: false;
  readonly creatorPersistence: false;
  // Phase 31 wallet cluster fixture capabilities
  readonly walletClusterIntelligenceFixtures: true;
  readonly syntheticWalletClusters: true;
  readonly walletClusterSignalFixtures: true;
  readonly walletClusterRiskIndicators: true;
  readonly walletClusterQualityIndicators: true;
  readonly walletClusterFixtureSafetyValidation: true;
  readonly walletClusterLiveData: false;
  readonly walletClusterChainAccess: false;
  readonly walletClusterRpcAccess: false;
  readonly walletClusterIdentityResolution: false;
  readonly walletClusterInvestmentAdvice: false;
  readonly walletClusterTradingSignals: false;
  readonly walletClusterExternalNetwork: false;
  readonly walletClusterPersistence: false;
  // Phase 32 manipulation evidence fixture capabilities
  readonly manipulationEvidenceFixtures: true;
  readonly syntheticBundleEvidence: true;
  readonly syntheticLaunchStructureEvidence: true;
  readonly syntheticLiquidityPatternEvidence: true;
  readonly syntheticCoordinationEvidence: true;
  readonly manipulationRiskIndicators: true;
  readonly manipulationQualityIndicators: true;
  readonly manipulationEvidenceSafetyValidation: true;
  readonly manipulationLiveData: false;
  readonly manipulationSolanaRpc: false;
  readonly manipulationProviderApis: false;
  readonly manipulationJitoIntegration: false;
  readonly manipulationMempoolAccess: false;
  readonly manipulationTradingSignals: false;
  readonly manipulationInvestmentAdvice: false;
  readonly manipulationExternalNetwork: false;
  readonly manipulationPersistence: false;
  readonly manipulationExecution: false;
  // Phase 33 composite evidence fixture capabilities
  readonly compositeEvidenceFixtures: true;
  readonly syntheticCompositeEvidence: true;
  readonly compositeCreatorEvidenceRefs: true;
  readonly compositeWalletClusterEvidenceRefs: true;
  readonly compositeManipulationEvidenceRefs: true;
  readonly compositeRiskIndicators: true;
  readonly compositeQualityIndicators: true;
  readonly compositeConfidenceIndicators: true;
  readonly compositeEvidenceWeighting: true;
  readonly compositeEvidenceSafetyValidation: true;
  readonly compositeLiveData: false;
  readonly compositeExternalNetwork: false;
  readonly compositeTradingSignals: false;
  readonly compositeInvestmentAdvice: false;
  readonly compositeExecution: false;
  readonly compositePersistence: false;
  // Phase 34 offline intelligence report integration capabilities
  readonly offlineIntelligenceReportModels: true;
  readonly offlineIntelligenceReportFixtures: true;
  readonly offlineIntelligenceCompositeReportIntegration: true;
  readonly offlineIntelligenceReportRiskSections: true;
  readonly offlineIntelligenceReportQualitySections: true;
  readonly offlineIntelligenceReportConfidenceSections: true;
  readonly offlineIntelligenceReportSourceReferences: true;
  readonly offlineIntelligenceReportSafetyValidation: true;
  readonly offlineIntelligenceReportLiveData: false;
  readonly offlineIntelligenceReportSolanaRpc: false;
  readonly offlineIntelligenceReportProviderApis: false;
  readonly offlineIntelligenceReportJitoIntegration: false;
  readonly offlineIntelligenceReportMempoolAccess: false;
  readonly offlineIntelligenceReportTradingSignals: false;
  readonly offlineIntelligenceReportInvestmentAdvice: false;
  readonly offlineIntelligenceReportExternalNetwork: false;
  readonly offlineIntelligenceReportPersistence: false;
  readonly offlineIntelligenceReportExecution: false;
  readonly offlineIntelligenceReportFileExport: false;
  readonly offlineIntelligenceReportDownloadSupport: false;
  // Phase 36 replay outcome fixture capabilities
  readonly replayOutcomeFixtures: true;
  readonly syntheticReplayOutcomes: true;
  readonly replayOutcomeBuilders: true;
  readonly replayOutcomeSafetyValidation: true;
  readonly replayOutcomeCompositeEvidenceReferences: true;
  readonly replayOutcomeReportReferences: true;
  readonly replayOutcomeDashboardReferences: true;
  readonly replayOutcomeLiveData: false;
  readonly replayOutcomeRealBacktesting: false;
  readonly replayOutcomePaperTrading: false;
  readonly replayOutcomeLiveTrading: false;
  readonly replayOutcomeExecution: false;
  readonly replayOutcomeSolanaRpc: false;
  readonly replayOutcomeExternalNetwork: false;
  readonly replayOutcomePersistence: false;
  readonly replayOutcomeFileExport: false;
  readonly replayOutcomeInvestmentAdvice: false;
  readonly replayOutcomeTradingSignals: false;
  // Safety labels
  readonly fixtureOnly: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly localOnly: true;
}

// ─── Config ───────────────────────────────────────────────────────────────────

/** Safe server config. Host must always be 127.0.0.1. Port must be valid. */
export interface LocalReadOnlyApiConfig {
  readonly host: '127.0.0.1';
  readonly port: number;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
}

// ─── Safety metadata ──────────────────────────────────────────────────────────

/** Safety metadata included in every response. */
export interface LroApiSafetyMeta {
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly localOnly: true;
}

// ─── Response envelope ────────────────────────────────────────────────────────

/** Deterministic response envelope for all read-only API shell responses. */
export interface LroApiResponseEnvelope<T = unknown> {
  readonly envelopeId: string;
  readonly status: 'ok' | 'degraded' | 'failed' | 'inconclusive';
  readonly data: T | null;
  readonly warnings: readonly string[];
  readonly errors: readonly LroApiErrorDetail[];
  readonly meta: LroApiSafetyMeta;
  readonly generatedAt: string;
}

/** A safe, serialisable error detail (no stack traces, no Error objects). */
export interface LroApiErrorDetail {
  readonly code: LocalReadOnlyApiErrorCode;
  readonly message: string;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

export type LocalReadOnlyApiErrorCode =
  | 'INVALID_LRO_API_INPUT'
  | 'UNSAFE_LRO_API_OUTPUT'
  | 'UNSAFE_HOST_REJECTED'
  | 'UNSAFE_PORT_REJECTED'
  | 'LIVE_DATA_FORBIDDEN'
  | 'FIXTURE_ONLY_REQUIRED'
  | 'ANALYSIS_ONLY_REQUIRED'
  | 'NON_EXECUTABLE_REQUIRED'
  | 'SAFE_TO_DISPLAY_REQUIRED'
  | 'READ_ONLY_REQUIRED'
  | 'LOCAL_ONLY_REQUIRED'
  | 'UNSAFE_CONTENT_DETECTED'
  | 'UNSAFE_ACTION_TEXT_DETECTED'
  | 'SECRET_PATTERN_DETECTED'
  | 'URL_PATTERN_DETECTED'
  | 'UNSAFE_CAPABILITY_DETECTED'
  | 'EXTERNAL_BIND_FORBIDDEN'
  | 'LRO_API_FIXTURE_ONLY'
  // Phase 21 — query/filter/pagination error codes
  | 'UNSAFE_QUERY_FIELD'
  | 'UNSAFE_SORT_FIELD'
  | 'UNSAFE_FILTER_VALUE'
  | 'PAGINATION_LIMIT_EXCEEDED'
  | 'PAGINATION_NEGATIVE_VALUE'
  | 'UNSAFE_CURSOR';

// ─── Phase 21 — Query metadata types ─────────────────────────────────────────

/** Metadata about the applied query in a paginated response. */
export interface LroApiQueryMeta {
  readonly query: {
    readonly limit: number;
    readonly offset: number;
    readonly cursor: string | undefined;
    readonly sortBy: string;
    readonly sortDirection: string;
    readonly severity: string | undefined;
    readonly panel: string | undefined;
    readonly sourceKind: string | undefined;
    readonly classification: string | undefined;
    readonly status: string | undefined;
  };
  readonly appliedFilters: {
    readonly severity: string | undefined;
    readonly panel: string | undefined;
    readonly sourceKind: string | undefined;
    readonly classification: string | undefined;
    readonly status: string | undefined;
    readonly filtersActive: boolean;
    readonly fixtureOnly: true;
  };
  readonly sort: {
    readonly sortBy: string;
    readonly sortDirection: string;
    readonly fixtureOnly: true;
  };
  readonly pagination: {
    readonly limit: number;
    readonly offset: number;
    readonly totalCount: number;
    readonly resultCount: number;
    readonly hasMore: boolean;
    readonly nextCursor: string | undefined;
    readonly fixtureOnly: true;
  };
  readonly fixtureOnly: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly localOnly: true;
}

// ─── Phase 22 — Response contract types ──────────────────────────────────────

/** The HTTP method supported by the read-only API (GET only). */
export type ReadOnlyApiMethod = 'GET';

/**
 * Stable Phase 22 error codes for the read-only API contract layer.
 * These codes appear in ReadOnlyApiError.code in error envelopes.
 */
export type ReadOnlyApiErrorCode =
  | 'READ_ONLY_API_INVALID_QUERY'
  | 'READ_ONLY_API_UNSUPPORTED_ENDPOINT'
  | 'READ_ONLY_API_METHOD_NOT_ALLOWED'
  | 'READ_ONLY_API_SAFETY_REJECTION'
  | 'READ_ONLY_API_INTERNAL_CONTRACT_ERROR';

/** Field-level error detail in a ReadOnlyApiError. Safe — no stack traces, no paths. */
export interface ReadOnlyApiErrorDetail {
  readonly field: string;
  readonly reason: string;
  readonly received: string;
}

/** Structured error object for Phase 22 error envelopes. */
export interface ReadOnlyApiError {
  readonly code: ReadOnlyApiErrorCode;
  readonly message: string;
  readonly details: readonly ReadOnlyApiErrorDetail[];
}

/**
 * Phase 22 deterministic contract metadata.
 * Extends the Phase 21 safety metadata fields for backward compatibility.
 * Includes optional query/filter/sort/pagination for queryable endpoints.
 */
export interface ReadOnlyApiContractMeta {
  readonly phase: 22;
  readonly apiMode: 'local_read_only';
  readonly deterministic: true;
  readonly mutating: false;
  readonly externalNetwork: false;
  readonly generatedAt: string;
  // Optional query/filter/sort/pagination for queryable endpoints
  readonly query?: Record<string, unknown>;
  readonly filters?: Record<string, unknown>;
  readonly sort?: Record<string, unknown>;
  readonly pagination?: Record<string, unknown>;
  readonly capabilities?: Record<string, boolean>;
  // Phase 21 safety meta fields — included for backward compatibility
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly localOnly: true;
}

/**
 * Phase 22 success envelope.
 * Includes Phase 21 backward-compat fields (status, envelopeId, warnings, errors, generatedAt).
 */
export interface ReadOnlyApiSuccessEnvelope<T = unknown> {
  readonly ok: true;
  readonly status: 'ok'; // backward compat with Phase 21 HTTP tests
  readonly envelopeId: string; // backward compat
  readonly endpoint: string;
  readonly method: ReadOnlyApiMethod;
  readonly data: T;
  readonly warnings: readonly string[]; // backward compat
  readonly errors: readonly LroApiErrorDetail[]; // backward compat (always [])
  readonly meta: ReadOnlyApiContractMeta;
  readonly generatedAt: string; // backward compat
}

/**
 * Phase 22 error envelope.
 * Includes Phase 21 backward-compat fields (status, envelopeId, data, warnings, errors, generatedAt).
 */
export interface ReadOnlyApiErrorEnvelope {
  readonly ok: false;
  readonly status: 'failed'; // backward compat with Phase 21 HTTP tests
  readonly envelopeId: string; // backward compat
  readonly endpoint: string;
  readonly method: ReadOnlyApiMethod;
  readonly data: null; // backward compat
  readonly error: ReadOnlyApiError;
  readonly errors: readonly LroApiErrorDetail[]; // backward compat
  readonly warnings: readonly string[]; // backward compat
  readonly meta: ReadOnlyApiContractMeta;
  readonly generatedAt: string; // backward compat
}

/** Union of Phase 22 success and error envelopes. */
export type ReadOnlyApiEnvelope<T = unknown> =
  | ReadOnlyApiSuccessEnvelope<T>
  | ReadOnlyApiErrorEnvelope;

/** Per-endpoint contract descriptor for Phase 22. */
export interface ReadOnlyApiEndpointContract {
  readonly endpoint: string;
  readonly method: ReadOnlyApiMethod;
  readonly description: string;
  readonly phase: number;
  readonly supportsQuery: boolean;
  readonly queryParams: readonly string[];
}
