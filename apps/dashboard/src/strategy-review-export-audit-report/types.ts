/**
 * Phase 46 — Strategy Review Export Audit Report Fixtures v1: types.
 *
 * Deterministic, synthetic, local-only report-shaped fixtures derived strictly from
 * Phase 45 strategy review export audit fixtures.
 */

import type {
  StrategyReviewExportAuditFixture,
  StrategyReviewExportAuditFixtureKind,
  StrategyReviewExportAuditFixtureName,
  StrategyReviewExportAuditSeverity,
  StrategyReviewExportAuditState,
} from '../strategy-review-export-audit/types.js';
import {
  STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS,
  STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES,
} from '../strategy-review-export-audit/types.js';

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE = 46 as const;
export const PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT =
  '2026-01-02T00:00:00.000Z';
export const PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SOURCE =
  'phase46_strategy_review_export_audit_report_fixtures_v1';

export type StrategyReviewExportAuditReportFixtureName = `${StrategyReviewExportAuditFixtureName}-report`;
export type StrategyReviewExportAuditReportFixtureKind = `${StrategyReviewExportAuditFixtureKind}-report`;

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_NAMES =
  STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES.map(
    name => `${name}-report` as StrategyReviewExportAuditReportFixtureName,
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_FIXTURE_KINDS =
  STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS.map(
    kind => `${kind}-report` as StrategyReviewExportAuditReportFixtureKind,
  );

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_STATES = [
  'audit-pending',
  'audit-passed',
  'audit-failed',
  'audit-skipped',
  'audit-blocked',
] as const;

export type StrategyReviewExportAuditReportState =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_STATES)[number];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SEVERITIES = [
  'info',
  'warning',
  'error',
  'critical',
] as const;

export type StrategyReviewExportAuditReportSeverity =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SEVERITIES)[number];

export const STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SECTION_KINDS = [
  'overview',
  'source-audit-reference',
  'queue-reference',
  'findings-summary',
  'severity-summary',
  'validation-summary',
  'safety-constraints',
  'evidence-references',
  'limitations',
  'future-readiness',
] as const;

export type StrategyReviewExportAuditReportSectionKind =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SECTION_KINDS)[number];

export interface StrategyReviewExportAuditReportSection {
  readonly sectionId: string;
  readonly sectionTitle: string;
  readonly sectionKind: StrategyReviewExportAuditReportSectionKind;
  readonly order: number;
  readonly summary: string;
  readonly items: readonly string[];
  readonly evidenceReferenceIds: readonly string[];
  readonly safetyNotes: readonly string[];
}

export interface StrategyReviewExportAuditReportEvidenceReference {
  readonly evidenceReferenceId: string;
  readonly sourceAuditId: string;
  readonly sourceAuditFindingId: string;
  readonly sourceQueueFixtureName: string;
  readonly summary: string;
  readonly syntheticOnly: true;
  readonly fixtureOnly: true;
}

export interface StrategyReviewExportAuditReportValidationNote {
  readonly noteId: string;
  readonly noteKind: 'structural' | 'safety' | 'source-reference';
  readonly status: 'passed' | 'warning';
  readonly message: string;
}

export interface StrategyReviewExportAuditReportSafetyBlock {
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly reportGenerationDisabled: true;
  readonly reportDownloadsDisabled: true;
  readonly reportFilesystemWritesDisabled: true;
  readonly reportPersistenceDisabled: true;
  readonly reportBackgroundJobsDisabled: true;
  readonly reportScheduledJobsDisabled: true;
  readonly reportNetworkAccessDisabled: true;
  readonly reportExecutionDisabled: true;
  readonly reportRecommendationsDisabled: true;
  readonly reportTradingSignalsDisabled: true;
  readonly reportInvestmentAdviceDisabled: true;
}

export interface StrategyReviewExportAuditReportCapabilityFlags {
  readonly strategyReviewExportAuditReportFixtures: true;
  readonly syntheticStrategyReviewExportAuditReports: true;
  readonly deterministicStrategyReviewExportAuditReports: true;
  readonly localOnlyStrategyReviewExportAuditReports: true;
  readonly readOnlyStrategyReviewExportAuditReports: true;
  readonly strategyReviewActualAuditReports: false;
  readonly strategyReviewReportDownloads: false;
  readonly strategyReviewReportPdfGeneration: false;
  readonly strategyReviewReportCsvGeneration: false;
  readonly strategyReviewReportHtmlGeneration: false;
  readonly strategyReviewReportFilesystemWrites: false;
  readonly strategyReviewReportPersistence: false;
  readonly strategyReviewReportBackgroundJobs: false;
  readonly strategyReviewReportScheduledJobs: false;
  readonly strategyReviewReportLiveData: false;
  readonly strategyReviewReportNetworkAccess: false;
  readonly strategyReviewReportTradingSignals: false;
  readonly strategyReviewReportRecommendations: false;
  readonly strategyReviewReportInvestmentAdvice: false;
  readonly strategyReviewReportExecution: false;
}

export interface StrategyReviewExportAuditReportMeta {
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE;
  readonly sourceAuditPhase: 45;
  readonly sourceQueuePhase: 44;
  readonly sourcePhases: readonly [44, 45, 46];
  readonly generatedAt: typeof PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT;
  readonly source: typeof PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly liveData: false;
  readonly persistence: false;
  readonly filesystemWrites: false;
  readonly networkAccess: false;
  readonly execution: false;
  readonly recommendations: false;
  readonly tradingSignals: false;
  readonly investmentAdvice: false;
  readonly notes: readonly string[];
}

export interface StrategyReviewExportAuditReportFixture {
  readonly reportId: string;
  readonly reportName: StrategyReviewExportAuditReportFixtureName;
  readonly reportKind: StrategyReviewExportAuditReportFixtureKind;
  readonly phase: typeof STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_PHASE;
  readonly sourceAuditId: string;
  readonly sourceAuditName: StrategyReviewExportAuditFixtureName;
  readonly sourceAuditKind: StrategyReviewExportAuditFixtureKind;
  readonly sourceQueueReference: {
    readonly sourcePhase: 44;
    readonly sourceQueueFixtureName: string;
    readonly sourceQueueFixtureKind: string;
    readonly sourceQueueState: string;
    readonly sourceQueuePriority: string;
  };
  readonly reportState: StrategyReviewExportAuditReportState;
  readonly reportSeverity: StrategyReviewExportAuditReportSeverity;
  readonly generatedAt: typeof PHASE_46_STRATEGY_REVIEW_EXPORT_AUDIT_REPORT_GENERATED_AT;
  readonly deterministicSeed: string;
  readonly title: string;
  readonly subtitle: string;
  readonly summary: string;
  readonly executiveSummary: string;
  readonly sections: readonly StrategyReviewExportAuditReportSection[];
  readonly findingsOverview: {
    readonly totalFindings: number;
    readonly findingIds: readonly string[];
    readonly bySeverity: Readonly<Record<StrategyReviewExportAuditSeverity, number>>;
  };
  readonly queueReferenceOverview: {
    readonly sourceQueueFixtureName: string;
    readonly sourceQueueState: string;
    readonly sourceQueuePriority: string;
    readonly notes: readonly string[];
  };
  readonly safetyReview: {
    readonly blockedBySafetyBoundary: boolean;
    readonly safetyNotes: readonly string[];
  };
  readonly validationReview: {
    readonly status: 'passed';
    readonly notes: readonly StrategyReviewExportAuditReportValidationNote[];
  };
  readonly evidenceReferences: readonly StrategyReviewExportAuditReportEvidenceReference[];
  readonly limitations: readonly string[];
  readonly nextPhaseNotes: readonly string[];
  readonly capabilityFlags: StrategyReviewExportAuditReportCapabilityFlags;
  readonly meta: StrategyReviewExportAuditReportMeta;
  readonly safety: StrategyReviewExportAuditReportSafetyBlock;
}

export interface StrategyReviewExportAuditReportBuildInput {
  readonly sourceAuditFixture: StrategyReviewExportAuditFixture;
}

export interface StrategyReviewExportAuditReportValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewExportAuditReportValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewExportAuditReportValidationIssue[];
}

export interface StrategyReviewExportAuditReportSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface StrategyReviewExportAuditReportBuildResult {
  readonly success: boolean;
  readonly fixture: StrategyReviewExportAuditReportFixture | null;
  readonly validation: StrategyReviewExportAuditReportValidationResult;
  readonly safety: StrategyReviewExportAuditReportSafetyResult;
}
