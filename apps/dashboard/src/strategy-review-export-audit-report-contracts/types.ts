/**
 * Phase 48 — Strategy Review Export Audit Report Read-Only API Contracts v1: types.
 *
 * Defines types for deterministic, synthetic, read-only API contract fixtures
 * derived from Phase 47 strategy review export audit report view models.
 *
 * ARCHITECTURAL NOTE: This module is placed in apps/dashboard/src/ (not
 * apps/read-only-api/src/) because the Phase 47 view model source data lives
 * in the dashboard app and the project's tsconfig references create a
 * dashboard → read-only-api dependency. Placing Phase 48 in read-only-api
 * would require a circular apps/read-only-api → apps/dashboard reference.
 * Following the existing repo convention (Phases 40–47 all in dashboard),
 * Phase 48 contracts are colocated with their Phase 47 view model source.
 * The read-only-api capability surface is updated separately (no import
 * of this module from read-only-api source code).
 *
 * These are fixture-derived read-only API contract data only.
 * No real endpoints. No route handlers. No runtime request handling.
 * No real reports. No downloads. No PDF/CSV/HTML generation.
 * No filesystem writes. No persistence. No background jobs.
 * No network. No wallet. No execution. No recommendations.
 * No trading signals. No investment advice. No UI rendering.
 */

// ─── Phase constant ────────────────────────────────────────────────────────────

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE = 48 as const;

export const PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_GENERATED_AT =
  '2026-01-04T00:00:00.000Z' as const;

export const PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SOURCE =
  'phase48_strategy_review_export_audit_report_api_contracts_v1' as const;

export const PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_VERSION = '1.0.0' as const;

// ─── Contract kinds ────────────────────────────────────────────────────────────

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS = [
  'list',
  'detail',
  'summary',
  'error',
] as const;

export type StrategyReviewExportAuditReportApiContractKind =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_KINDS)[number];

// ─── Contract names ────────────────────────────────────────────────────────────

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES = [
  'strategy-review-export-audit-report-list-contract',
  'strategy-review-export-audit-report-summary-contract',
  'strategy-review-export-audit-report-error-not-found-contract',
  'strategy-review-export-audit-report-error-invalid-id-contract',
] as const;

export type StrategyReviewExportAuditReportApiContractStaticName =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_NAMES)[number];

export type StrategyReviewExportAuditReportApiContractDetailName =
  `strategy-review-export-audit-report-detail-contract-${string}`;

export type StrategyReviewExportAuditReportApiContractName =
  | StrategyReviewExportAuditReportApiContractStaticName
  | StrategyReviewExportAuditReportApiContractDetailName;

// ─── Safety envelope type ──────────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportApiContractSafetyEnvelope {
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly nonExecutable: true;
  readonly nonAdvisory: true;
  readonly noLiveData: true;
  readonly noNetworkAccess: true;
  readonly noPersistence: true;
  readonly noFilesystemWrites: true;
  readonly noDownloads: true;
  readonly noPdfGeneration: true;
  readonly noCsvGeneration: true;
  readonly noHtmlGeneration: true;
  readonly noUiRendering: true;
  readonly noDomAccess: true;
  readonly noBackgroundJobs: true;
  readonly noScheduledJobs: true;
  readonly noRouteHandlers: true;
  readonly noHttpServer: true;
  readonly noRuntimeRequests: true;
}

// ─── Metadata envelope type ────────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportApiContractMeta {
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE;
  readonly contractVersion: typeof PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_VERSION;
  readonly generatedAt: typeof PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_GENERATED_AT;
  readonly deterministicSeed: string;
  readonly source: typeof PHASE_48_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly liveData: false;
  readonly networkAccess: false;
  readonly persistence: false;
  readonly execution: false;
  readonly recommendations: false;
  readonly tradingSignals: false;
  readonly investmentAdvice: false;
}

// ─── Pagination metadata type ──────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportApiContractPagination {
  readonly totalCount: number;
  readonly pageCount: number;
  readonly page: number;
  readonly pageSize: number;
  readonly fixtureOnly: true;
}

// ─── Filter metadata type ──────────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportApiContractFilter {
  readonly field: string;
  readonly value: string;
  readonly fixtureOnly: true;
}

// ─── Sort metadata type ────────────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportApiContractSort {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
  readonly fixtureOnly: true;
}

// ─── Capability flags type ─────────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportApiContractCapabilities {
  readonly strategyReviewExportAuditReportApiContracts: true;
  readonly syntheticStrategyReviewExportAuditReportApiContracts: true;
  readonly deterministicStrategyReviewExportAuditReportApiContracts: true;
  readonly localOnlyStrategyReviewExportAuditReportApiContracts: true;
  readonly readOnlyStrategyReviewExportAuditReportApiContracts: true;
  readonly fixtureDerivedStrategyReviewExportAuditReportApiContracts: true;
  readonly strategyReviewExportAuditReportApiContractLiveData: false;
  readonly strategyReviewExportAuditReportApiContractNetworkAccess: false;
  readonly strategyReviewExportAuditReportApiContractPersistence: false;
  readonly strategyReviewExportAuditReportApiContractFilesystemWrites: false;
  readonly strategyReviewExportAuditReportApiContractDownloads: false;
  readonly strategyReviewExportAuditReportApiContractPdfGeneration: false;
  readonly strategyReviewExportAuditReportApiContractCsvGeneration: false;
  readonly strategyReviewExportAuditReportApiContractHtmlGeneration: false;
  readonly strategyReviewExportAuditReportApiContractRouteHandlers: false;
  readonly strategyReviewExportAuditReportApiContractHttpServer: false;
  readonly strategyReviewExportAuditReportApiContractRuntimeRequests: false;
  readonly strategyReviewExportAuditReportApiContractUiRendering: false;
  readonly strategyReviewExportAuditReportApiContractDomAccess: false;
  readonly strategyReviewExportAuditReportApiContractBackgroundJobs: false;
  readonly strategyReviewExportAuditReportApiContractScheduledJobs: false;
  readonly strategyReviewExportAuditReportApiContractExecution: false;
  readonly strategyReviewExportAuditReportApiContractTradingSignals: false;
  readonly strategyReviewExportAuditReportApiContractRecommendations: false;
  readonly strategyReviewExportAuditReportApiContractInvestmentAdvice: false;
}

// ─── Data shapes ───────────────────────────────────────────────────────────────

/** Data shape for a single item in a list response contract. */
export interface StrategyReviewExportAuditReportApiContractListItem {
  readonly viewModelId: string;
  readonly viewModelName: string;
  readonly viewModelKind: string;
  readonly sourceReportId: string;
  readonly sourceReportName: string;
  readonly sourceReportKind: string;
  readonly sourceAuditId: string;
  readonly sourceAuditName: string;
  readonly sourceQueueReference: string;
  readonly displayTitle: string;
  readonly displaySubtitle: string;
  readonly statusLabel: string;
  readonly severityLabel: string;
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE;
}

/** Data shape for a detail response contract. */
export interface StrategyReviewExportAuditReportApiContractDetail {
  readonly viewModelId: string;
  readonly viewModelName: string;
  readonly viewModelKind: string;
  readonly sourceReportId: string;
  readonly sourceReportName: string;
  readonly sourceReportKind: string;
  readonly sourceAuditId: string;
  readonly sourceAuditName: string;
  readonly sourceQueueReference: string;
  readonly displayTitle: string;
  readonly displaySubtitle: string;
  readonly statusLabel: string;
  readonly severityLabel: string;
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE;
  readonly summaryCards: readonly {
    readonly cardId: string;
    readonly cardKind: string;
    readonly title: string;
    readonly value: string;
    readonly description: string;
    readonly order: number;
  }[];
  readonly detailSections: readonly {
    readonly sectionId: string;
    readonly sectionTitle: string;
    readonly sectionKind: string;
    readonly order: number;
    readonly summary: string;
    readonly rowCount: number;
    readonly evidenceReferenceCount: number;
  }[];
  readonly evidenceItems: readonly {
    readonly evidenceId: string;
    readonly label: string;
    readonly description: string;
    readonly order: number;
    readonly syntheticOnly: true;
    readonly liveData: false;
  }[];
  readonly safetyBadges: readonly {
    readonly badgeId: string;
    readonly label: string;
    readonly value: string;
    readonly safe: true;
    readonly order: number;
  }[];
  readonly validationBadges: readonly {
    readonly badgeId: string;
    readonly label: string;
    readonly status: string;
    readonly order: number;
  }[];
  readonly limitationItems: readonly string[];
  readonly nextPhaseNotes: readonly string[];
}

/** Data shape for a summary response contract. */
export interface StrategyReviewExportAuditReportApiContractSummaryData {
  readonly totalViewModels: number;
  readonly byStatus: ReadonlyArray<{ readonly status: string; readonly count: number }>;
  readonly bySeverity: ReadonlyArray<{ readonly severity: string; readonly count: number }>;
  readonly byKind: ReadonlyArray<{ readonly kind: string; readonly count: number }>;
  readonly sourcePhases: readonly number[];
  readonly deterministicSeed: string;
}

/** Data shape for an error response contract. */
export interface StrategyReviewExportAuditReportApiContractErrorData {
  readonly code: string;
  readonly message: string;
  readonly fixtureOnly: true;
  readonly details?: string;
}

// ─── List response contract ────────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportListApiContract {
  readonly contractId: string;
  readonly contractName: 'strategy-review-export-audit-report-list-contract';
  readonly contractKind: 'list';
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE;
  readonly endpointPattern: '/api/v1/strategy-review-export-audit-report-contracts';
  readonly method: 'GET';
  readonly readOnly: true;
  readonly fixtureOnly: true;
  readonly sourceViewModelIds: readonly string[];
  readonly sourceReportIds: readonly string[];
  readonly sourceAuditIds: readonly string[];
  readonly statusCode: 200;
  readonly success: true;
  readonly data: readonly StrategyReviewExportAuditReportApiContractListItem[];
  readonly error: null;
  readonly meta: StrategyReviewExportAuditReportApiContractMeta;
  readonly pagination: StrategyReviewExportAuditReportApiContractPagination;
  readonly filters: readonly StrategyReviewExportAuditReportApiContractFilter[];
  readonly sorts: readonly StrategyReviewExportAuditReportApiContractSort[];
  readonly safety: StrategyReviewExportAuditReportApiContractSafetyEnvelope;
  readonly capabilityFlags: StrategyReviewExportAuditReportApiContractCapabilities;
}

// ─── Detail response contract ──────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportDetailApiContract {
  readonly contractId: string;
  readonly contractName: StrategyReviewExportAuditReportApiContractDetailName;
  readonly contractKind: 'detail';
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE;
  readonly endpointPattern: '/api/v1/strategy-review-export-audit-report-contracts/:viewModelId';
  readonly method: 'GET';
  readonly readOnly: true;
  readonly fixtureOnly: true;
  readonly sourceViewModelIds: readonly string[];
  readonly sourceReportIds: readonly string[];
  readonly sourceAuditIds: readonly string[];
  readonly statusCode: 200;
  readonly success: true;
  readonly data: StrategyReviewExportAuditReportApiContractDetail;
  readonly error: null;
  readonly meta: StrategyReviewExportAuditReportApiContractMeta;
  readonly pagination: null;
  readonly filters: readonly [];
  readonly sorts: readonly [];
  readonly safety: StrategyReviewExportAuditReportApiContractSafetyEnvelope;
  readonly capabilityFlags: StrategyReviewExportAuditReportApiContractCapabilities;
}

// ─── Summary response contract ─────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportSummaryApiContract {
  readonly contractId: string;
  readonly contractName: 'strategy-review-export-audit-report-summary-contract';
  readonly contractKind: 'summary';
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE;
  readonly endpointPattern: '/api/v1/strategy-review-export-audit-report-contracts/summary';
  readonly method: 'GET';
  readonly readOnly: true;
  readonly fixtureOnly: true;
  readonly sourceViewModelIds: readonly string[];
  readonly sourceReportIds: readonly string[];
  readonly sourceAuditIds: readonly string[];
  readonly statusCode: 200;
  readonly success: true;
  readonly data: StrategyReviewExportAuditReportApiContractSummaryData;
  readonly error: null;
  readonly meta: StrategyReviewExportAuditReportApiContractMeta;
  readonly pagination: null;
  readonly filters: readonly [];
  readonly sorts: readonly [];
  readonly safety: StrategyReviewExportAuditReportApiContractSafetyEnvelope;
  readonly capabilityFlags: StrategyReviewExportAuditReportApiContractCapabilities;
}

// ─── Error response contract ───────────────────────────────────────────────────

export type StrategyReviewExportAuditReportApiContractErrorName =
  | 'strategy-review-export-audit-report-error-not-found-contract'
  | 'strategy-review-export-audit-report-error-invalid-id-contract';

export interface StrategyReviewExportAuditReportErrorApiContract {
  readonly contractId: string;
  readonly contractName: StrategyReviewExportAuditReportApiContractErrorName;
  readonly contractKind: 'error';
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_API_CONTRACT_PHASE;
  readonly endpointPattern: string;
  readonly method: 'GET';
  readonly readOnly: true;
  readonly fixtureOnly: true;
  readonly sourceViewModelIds: readonly [];
  readonly sourceReportIds: readonly [];
  readonly sourceAuditIds: readonly [];
  readonly statusCode: 404 | 422;
  readonly success: false;
  readonly data: null;
  readonly error: StrategyReviewExportAuditReportApiContractErrorData;
  readonly meta: StrategyReviewExportAuditReportApiContractMeta;
  readonly pagination: null;
  readonly filters: readonly [];
  readonly sorts: readonly [];
  readonly safety: StrategyReviewExportAuditReportApiContractSafetyEnvelope;
  readonly capabilityFlags: StrategyReviewExportAuditReportApiContractCapabilities;
}

// ─── Union type ────────────────────────────────────────────────────────────────

export type StrategyReviewExportAuditReportApiContract =
  | StrategyReviewExportAuditReportListApiContract
  | StrategyReviewExportAuditReportDetailApiContract
  | StrategyReviewExportAuditReportSummaryApiContract
  | StrategyReviewExportAuditReportErrorApiContract;

// ─── Validation types ──────────────────────────────────────────────────────────

export interface StrategyReviewExportAuditReportApiContractValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewExportAuditReportApiContractValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewExportAuditReportApiContractValidationIssue[];
}

export interface StrategyReviewExportAuditReportApiContractSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
