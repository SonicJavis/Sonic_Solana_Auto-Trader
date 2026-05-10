/**
 * Phase 47 — Strategy Review Export Audit Report View Models v1: types.
 */

import type {
  StrategyReviewExportAuditReportFixture,
  StrategyReviewExportAuditReportFixtureKind,
  StrategyReviewExportAuditReportFixtureName,
  StrategyReviewExportAuditReportSeverity,
  StrategyReviewExportAuditReportState,
} from '../strategy-review-export-audit-report/types.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SEVERITIES,
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_STATES,
} from '../strategy-review-export-audit-report/types.js';

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE = 47 as const;
export const PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_GENERATED_AT =
  '2026-01-03T00:00:00.000Z';
export const PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SOURCE =
  'phase47_strategy_review_export_audit_report_view_models_v1';

export type StrategyReviewExportAuditReportViewModelName =
  `${StrategyReviewExportAuditReportFixtureName}-view-model`;
export type StrategyReviewExportAuditReportViewModelKind =
  `${StrategyReviewExportAuditReportFixtureKind}-view-model`;

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_NAMES =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES.map(
    name => `${name}-view-model` as StrategyReviewExportAuditReportViewModelName,
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_KINDS =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_KINDS.map(
    kind => `${kind}-view-model` as StrategyReviewExportAuditReportViewModelKind,
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_STATUSES =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_STATES;
export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SEVERITIES =
  STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SEVERITIES;

export type StrategyReviewExportAuditReportViewModelStatus =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_STATUSES)[number];
export type StrategyReviewExportAuditReportViewModelSeverity =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SEVERITIES)[number];

export interface StrategyReviewExportAuditReportSummaryCardViewModel {
  readonly cardId: string;
  readonly cardKind: 'findings' | 'severity' | 'state' | 'evidence' | 'validation';
  readonly title: string;
  readonly value: string;
  readonly description: string;
  readonly order: number;
  readonly safetyNotes: readonly string[];
}

export interface StrategyReviewExportAuditReportDetailSectionRowViewModel {
  readonly rowId: string;
  readonly label: string;
  readonly value: string;
  readonly order: number;
}

export interface StrategyReviewExportAuditReportDetailSectionViewModel {
  readonly sectionId: string;
  readonly sectionTitle: string;
  readonly sectionKind: string;
  readonly order: number;
  readonly summary: string;
  readonly rows: readonly StrategyReviewExportAuditReportDetailSectionRowViewModel[];
  readonly evidenceReferenceIds: readonly string[];
  readonly safetyNotes: readonly string[];
}

export interface StrategyReviewExportAuditReportEvidenceItemViewModel {
  readonly evidenceId: string;
  readonly label: string;
  readonly sourceReportId: string;
  readonly sourceSectionId: string;
  readonly description: string;
  readonly order: number;
  readonly syntheticOnly: true;
  readonly liveData: false;
}

export interface StrategyReviewExportAuditReportSafetyBadgeViewModel {
  readonly badgeId: string;
  readonly label: string;
  readonly value: string;
  readonly safe: true;
  readonly order: number;
}

export interface StrategyReviewExportAuditReportValidationBadgeViewModel {
  readonly badgeId: string;
  readonly label: string;
  readonly status: 'passed' | 'warning';
  readonly order: number;
}

export interface StrategyReviewExportAuditReportListItemViewModel {
  readonly viewModelId: string;
  readonly viewModelName: StrategyReviewExportAuditReportViewModelName;
  readonly viewModelKind: StrategyReviewExportAuditReportViewModelKind;
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE;
  readonly sourceReportId: string;
  readonly sourceReportName: StrategyReviewExportAuditReportFixtureName;
  readonly sourceReportKind: StrategyReviewExportAuditReportFixtureKind;
  readonly sourceAuditId: string;
  readonly sourceAuditName: string;
  readonly sourceQueueReference: string;
  readonly displayTitle: string;
  readonly displaySubtitle: string;
  readonly statusLabel: StrategyReviewExportAuditReportState;
  readonly severityLabel: StrategyReviewExportAuditReportSeverity;
}

export interface StrategyReviewExportAuditReportSummaryViewModel {
  readonly viewModelId: string;
  readonly summaryCards: readonly StrategyReviewExportAuditReportSummaryCardViewModel[];
  readonly safetyBadges: readonly StrategyReviewExportAuditReportSafetyBadgeViewModel[];
  readonly validationBadges: readonly StrategyReviewExportAuditReportValidationBadgeViewModel[];
}

export interface StrategyReviewExportAuditReportDetailViewModel {
  readonly viewModelId: string;
  readonly detailSections: readonly StrategyReviewExportAuditReportDetailSectionViewModel[];
  readonly evidenceItems: readonly StrategyReviewExportAuditReportEvidenceItemViewModel[];
  readonly limitationItems: readonly string[];
  readonly nextPhaseNotes: readonly string[];
}

export interface StrategyReviewExportAuditReportViewModelCapabilities {
  readonly strategyReviewExportAuditReportViewModels: true;
  readonly syntheticStrategyReviewExportAuditReportViewModels: true;
  readonly deterministicStrategyReviewExportAuditReportViewModels: true;
  readonly localOnlyStrategyReviewExportAuditReportViewModels: true;
  readonly readOnlyStrategyReviewExportAuditReportViewModels: true;
  readonly fixtureDerivedStrategyReviewExportAuditReportViewModels: true;
  readonly strategyReviewExportAuditReportViewModelLiveData: false;
  readonly strategyReviewExportAuditReportViewModelNetworkAccess: false;
  readonly strategyReviewExportAuditReportViewModelPersistence: false;
  readonly strategyReviewExportAuditReportViewModelFilesystemWrites: false;
  readonly strategyReviewExportAuditReportViewModelDownloads: false;
  readonly strategyReviewExportAuditReportViewModelPdfGeneration: false;
  readonly strategyReviewExportAuditReportViewModelCsvGeneration: false;
  readonly strategyReviewExportAuditReportViewModelHtmlGeneration: false;
  readonly strategyReviewExportAuditReportViewModelUiRendering: false;
  readonly strategyReviewExportAuditReportViewModelDomAccess: false;
  readonly strategyReviewExportAuditReportViewModelBackgroundJobs: false;
  readonly strategyReviewExportAuditReportViewModelScheduledJobs: false;
  readonly strategyReviewExportAuditReportViewModelExecution: false;
  readonly strategyReviewExportAuditReportViewModelTradingSignals: false;
  readonly strategyReviewExportAuditReportViewModelRecommendations: false;
  readonly strategyReviewExportAuditReportViewModelInvestmentAdvice: false;
}

export interface StrategyReviewExportAuditReportViewModel {
  readonly viewModelId: string;
  readonly viewModelName: StrategyReviewExportAuditReportViewModelName;
  readonly viewModelKind: StrategyReviewExportAuditReportViewModelKind;
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE;
  readonly sourceReportId: string;
  readonly sourceReportName: StrategyReviewExportAuditReportFixtureName;
  readonly sourceReportKind: StrategyReviewExportAuditReportFixtureKind;
  readonly sourceAuditId: string;
  readonly sourceAuditName: string;
  readonly sourceQueueReference: string;
  readonly displayTitle: string;
  readonly displaySubtitle: string;
  readonly statusLabel: StrategyReviewExportAuditReportViewModelStatus;
  readonly severityLabel: StrategyReviewExportAuditReportViewModelSeverity;
  readonly summaryCards: readonly StrategyReviewExportAuditReportSummaryCardViewModel[];
  readonly detailSections: readonly StrategyReviewExportAuditReportDetailSectionViewModel[];
  readonly evidenceItems: readonly StrategyReviewExportAuditReportEvidenceItemViewModel[];
  readonly safetyBadges: readonly StrategyReviewExportAuditReportSafetyBadgeViewModel[];
  readonly validationBadges: readonly StrategyReviewExportAuditReportValidationBadgeViewModel[];
  readonly limitationItems: readonly string[];
  readonly nextPhaseNotes: readonly string[];
  readonly capabilityFlags: StrategyReviewExportAuditReportViewModelCapabilities;
  readonly listItem: StrategyReviewExportAuditReportListItemViewModel;
  readonly detail: StrategyReviewExportAuditReportDetailViewModel;
  readonly summary: StrategyReviewExportAuditReportSummaryViewModel;
  readonly meta: {
    readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_PHASE;
    readonly sourceReportPhase: 46;
    readonly sourceAuditPhase: 45;
    readonly sourceQueuePhase: 44;
    readonly sourcePhases: readonly [44, 45, 46, 47];
    readonly generatedAt: typeof PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_GENERATED_AT;
    readonly source: typeof PHASE_47_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_VIEW_MODEL_SOURCE;
    readonly fixtureOnly: true;
    readonly syntheticOnly: true;
    readonly deterministic: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly inMemoryOnly: true;
    readonly liveData: false;
    readonly networkAccess: false;
    readonly persistence: false;
    readonly filesystemWrites: false;
    readonly uiRendering: false;
    readonly domAccess: false;
    readonly execution: false;
    readonly tradingSignals: false;
    readonly recommendations: false;
    readonly investmentAdvice: false;
  };
  readonly safety: {
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
  };
}

export interface StrategyReviewExportAuditReportViewModelBuildInput {
  readonly sourceReportFixture: StrategyReviewExportAuditReportFixture;
}

export interface StrategyReviewExportAuditReportViewModelValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewExportAuditReportViewModelValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewExportAuditReportViewModelValidationIssue[];
}

export interface StrategyReviewExportAuditReportViewModelSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
