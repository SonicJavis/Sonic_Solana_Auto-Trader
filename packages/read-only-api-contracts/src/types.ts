/**
 * packages/read-only-api-contracts/src/types.ts
 *
 * Phase 19 — Local Read-Only API Contract types.
 *
 * All output models carry:
 *   fixtureOnly: true
 *   liveData: false
 *   safeToDisplay: true
 *   analysisOnly: true
 *   nonExecutable: true
 *   readOnly: true
 *   contractOnly: true
 *
 * IMPORTANT: ReadOnlyApiContracts are NOT an API server, HTTP listener, UI, or trading system.
 * They are fixture-only, read-only, analysis-only, non-executable, contract-only
 * TypeScript models for future local API boundary documentation.
 * They must never create real trade intents, execution plans, orders,
 * paper trades, live data access, or any actionable output.
 * They must never open network ports, start HTTP servers, or use API frameworks.
 */

// ─── Capabilities ────────────────────────────────────────────────────────────

/** All unsafe capability flags are permanently false. */
export interface ReadOnlyApiCapabilities {
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
  readonly canStartHttpServer: false;
  readonly canOpenNetworkPort: false;
  readonly canUseApiFramework: false;
  readonly fixtureOnly: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── Severity ─────────────────────────────────────────────────────────────────

/** Analysis-only severity levels for API contract findings. */
export type ReadOnlyApiSeverity = 'info' | 'warning' | 'risk' | 'failure' | 'inconclusive';

// ─── Endpoint ID ──────────────────────────────────────────────────────────────

/** Deterministic endpoint identifiers for contract documentation only. */
export type ReadOnlyApiEndpointId =
  | 'health'
  | 'capabilities'
  | 'dashboard_overview'
  | 'dashboard_bundle'
  | 'replay_panel'
  | 'strategy_panel'
  | 'evaluation_panel'
  | 'evidence_panel'
  | 'safety_panel';

// ─── Endpoint method ──────────────────────────────────────────────────────────

/** All endpoint methods are documentation/contract metadata only. */
export type ReadOnlyApiEndpointMethod = 'GET';

// ─── Endpoint contract ────────────────────────────────────────────────────────

/**
 * A pure documentation-shaped contract for a single read-only API endpoint.
 * No HTTP handler, router, server, or runtime integration of any kind.
 */
export interface ReadOnlyApiEndpointContract {
  readonly endpointId: ReadOnlyApiEndpointId;
  readonly method: ReadOnlyApiEndpointMethod;
  readonly pathTemplate: string;
  readonly description: string;
  readonly responseTypeName: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── Request model ────────────────────────────────────────────────────────────

/**
 * A safe, documentation-shaped request model for a read-only endpoint.
 * No HTTP transport, no runtime binding.
 */
export interface ReadOnlyApiRequestModel {
  readonly requestModelId: string;
  readonly endpointId: ReadOnlyApiEndpointId;
  readonly queryParams: Readonly<Record<string, string>>;
  readonly description: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── Response envelope ────────────────────────────────────────────────────────

/**
 * A deterministic response envelope for all read-only API contract responses.
 * Wraps safe data with status, warnings, errors, metadata, and safety fields.
 * No stack traces, no raw Error objects.
 */
export interface ReadOnlyApiResponseEnvelope<T = unknown> {
  readonly envelopeId: string;
  readonly status: 'ok' | 'degraded' | 'failed' | 'inconclusive';
  readonly data: T | null;
  readonly warnings: readonly string[];
  readonly errors: readonly ReadOnlyApiErrorDetail[];
  readonly metadata: ReadOnlyApiResponseMetadata;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

/** Safe metadata for a response envelope. */
export interface ReadOnlyApiResponseMetadata {
  readonly contractVersion: string;
  readonly phase: string;
  readonly generatedAt: string;
  readonly fixtureOnly: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

/** A safe, serialisable error detail object (no stack traces, no Error objects). */
export interface ReadOnlyApiErrorDetail {
  readonly code: ReadOnlyApiContractErrorCode;
  readonly message: string;
  readonly fixtureOnly: true;
  readonly safeToDisplay: true;
}

// ─── Health contract ──────────────────────────────────────────────────────────

/**
 * A safe health contract model.
 * No runtime health checks, network checks, process checks, socket checks,
 * or live dependency checks of any kind.
 */
export interface ReadOnlyApiHealthContract {
  readonly healthId: string;
  readonly status: 'fixture_only' | 'contract_only';
  readonly message: string;
  readonly capabilities: ReadOnlyApiCapabilities;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── Dashboard contract ───────────────────────────────────────────────────────

/**
 * Shapes Dashboard Read Models into a safe API response contract model.
 * No UI rendering, no app state.
 */
export interface ReadOnlyDashboardContract {
  readonly dashboardContractId: string;
  readonly severity: ReadOnlyApiSeverity;
  readonly summaryText: string;
  readonly panelsAvailable: readonly string[];
  readonly totalFindings: number;
  readonly evidenceLedgerId: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── Evidence contract ────────────────────────────────────────────────────────

/**
 * Shapes Evidence Ledger outputs into a safe API response contract model.
 * Append-safe / read-only — no mutation of prior evidence.
 */
export interface ReadOnlyEvidenceContract {
  readonly evidenceContractId: string;
  readonly evidenceLedgerId: string;
  readonly severity: ReadOnlyApiSeverity;
  readonly summaryText: string;
  readonly entryCount: number;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── Safety contract ──────────────────────────────────────────────────────────

/**
 * Summarises locked safety capabilities for future API exposure.
 * All unsafe capability flags are false.
 */
export interface ReadOnlySafetyContract {
  readonly safetyContractId: string;
  readonly capabilities: ReadOnlyApiCapabilities;
  readonly lockedCapabilityNames: readonly string[];
  readonly safetyInvariantsSatisfied: boolean;
  readonly summaryText: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── Contract bundle ──────────────────────────────────────────────────────────

/**
 * A safe combined bundle of all API contract models.
 * Fixture-only, analysis-only, non-executable, read-only, contract-only.
 */
export interface ReadOnlyApiContractBundle {
  readonly bundleId: string;
  readonly endpointContracts: readonly ReadOnlyApiEndpointContract[];
  readonly healthContract: ReadOnlyApiHealthContract;
  readonly dashboardContract: ReadOnlyDashboardContract;
  readonly evidenceContract: ReadOnlyEvidenceContract;
  readonly safetyContract: ReadOnlySafetyContract;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── Contract export ──────────────────────────────────────────────────────────

/** Deterministic JSON-safe export of a ReadOnlyApiContractBundle. */
export interface ReadOnlyApiContractExport {
  readonly exportKind: 'read_only_api_contract_export';
  readonly bundle: ReadOnlyApiContractBundle;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── OpenAPI-like shape ───────────────────────────────────────────────────────

/**
 * A deterministic OpenAPI-like shape object for future documentation only.
 * No real server config. No real URLs. No live integration.
 * All endpoints marked future/read-only/contract-only.
 */
export interface ReadOnlyApiOpenApiShape {
  readonly openApiShapeId: string;
  readonly title: string;
  readonly version: string;
  readonly description: string;
  readonly note: string;
  readonly paths: Readonly<Record<string, ReadOnlyApiOpenApiPathItem>>;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

/** A single path item in the OpenAPI-like shape. */
export interface ReadOnlyApiOpenApiPathItem {
  readonly get: ReadOnlyApiOpenApiOperation;
}

/** A single operation in the OpenAPI-like shape. */
export interface ReadOnlyApiOpenApiOperation {
  readonly operationId: string;
  readonly summary: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly contractOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
}

// ─── Fixture ──────────────────────────────────────────────────────────────────

/** A named, deterministic ReadOnlyApiContractBundle fixture for test/review use. */
export interface ReadOnlyApiContractFixture {
  readonly fixtureId: string;
  readonly displayName: string;
  readonly description: string;
  readonly bundle: ReadOnlyApiContractBundle;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
  readonly analysisOnly: true;
  readonly nonExecutable: true;
  readonly readOnly: true;
  readonly contractOnly: true;
}

// ─── Error codes ──────────────────────────────────────────────────────────────

export type ReadOnlyApiContractErrorCode =
  | 'INVALID_READ_ONLY_API_CONTRACT_INPUT'
  | 'INVALID_READ_ONLY_API_CONTRACT_BUNDLE'
  | 'UNSAFE_READ_ONLY_API_CONTRACT_OUTPUT'
  | 'LIVE_DATA_FORBIDDEN'
  | 'FIXTURE_ONLY_REQUIRED'
  | 'ANALYSIS_ONLY_REQUIRED'
  | 'NON_EXECUTABLE_REQUIRED'
  | 'SAFE_TO_DISPLAY_REQUIRED'
  | 'READ_ONLY_REQUIRED'
  | 'CONTRACT_ONLY_REQUIRED'
  | 'UNSAFE_CONTENT_DETECTED'
  | 'UNSAFE_ACTION_TEXT_DETECTED'
  | 'SECRET_PATTERN_DETECTED'
  | 'URL_PATTERN_DETECTED'
  | 'UNSAFE_CAPABILITY_DETECTED'
  | 'HTTP_SERVER_FORBIDDEN'
  | 'NETWORK_PORT_FORBIDDEN'
  | 'API_FRAMEWORK_FORBIDDEN'
  | 'READ_ONLY_API_CONTRACT_FIXTURE_ONLY';
