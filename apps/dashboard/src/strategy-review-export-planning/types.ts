/**
 * Phase 43 — Strategy Review Report Export Planning Fixtures v1: types.
 *
 * Defines deterministic, synthetic export-planning fixtures for future report export
 * targets based on Phase 42 serialization previews. These fixtures are planning-only
 * and do not perform any export, download, or filesystem behavior.
 *
 * Safety: synthetic-only, local-only, read-only, deterministic, offline, in-memory,
 * non-persistent, non-mutating, external-network-free, file-write-free,
 * download-free, execution-free, and non-advisory.
 */

import type {
  StrategyReviewReportFixtureKind,
  StrategyReviewReportFixtureName,
} from '../strategy-review-reports/types.js';
import type {
  StrategyReviewSerializationPreviewFixtureKind,
  StrategyReviewSerializationPreviewFixtureName,
  StrategyReviewSerializationPreviewFormat,
  StrategyReviewSerializationSafetyBoundary,
} from '../strategy-review-serialization/types.js';

export const PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE =
  'phase43_strategy_review_report_export_planning_fixtures_v1';

export type StrategyReviewExportPlanTarget = 'json' | 'markdown' | 'text' | 'metadata';

export const STRATEGY_REVIEW_EXPORT_PLAN_FORMAT_TARGETS: readonly StrategyReviewExportPlanTarget[] = [
  'json',
  'markdown',
  'text',
  'metadata',
] as const;

export const STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES = [
  'json-export-plan-disabled',
  'markdown-export-plan-disabled',
  'text-export-plan-disabled',
  'metadata-export-plan-disabled',
  'defensive-vs-aggressive-export-plan',
  'creator-led-export-plan',
  'wallet-led-export-plan',
  'manipulation-avoidance-export-plan',
  'no-action-safety-export-plan',
  'insufficient-data-export-plan',
  'high-score-positive-export-plan',
  'mixed-signal-watchlist-export-plan',
  'malformed-input-safe-export-plan',
  'dashboard-ready-export-plan',
  'report-ready-export-plan',
  'safety-boundary-export-plan',
] as const;

export type StrategyReviewExportPlanFixtureName = (typeof STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_NAMES)[number];

export const STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_KINDS = [
  'format-disabled-export-plan',
  'comparison-export-plan',
  'creator-export-plan',
  'wallet-export-plan',
  'manipulation-export-plan',
  'safety-export-plan',
  'insufficient-data-export-plan',
  'positive-export-plan',
  'watchlist-export-plan',
  'safe-export-plan',
  'dashboard-ready-export-plan',
  'report-ready-export-plan',
  'safety-boundary-export-plan',
] as const;

export type StrategyReviewExportPlanFixtureKind = (typeof STRATEGY_REVIEW_EXPORT_PLAN_FIXTURE_KINDS)[number];

export interface StrategyReviewSerializationPreviewReference {
  readonly sourcePhase: 42;
  readonly sourcePreviewFixtureName: StrategyReviewSerializationPreviewFixtureName;
  readonly sourcePreviewFixtureKind: StrategyReviewSerializationPreviewFixtureKind;
  readonly sourcePreviewFormat: StrategyReviewSerializationPreviewFormat;
  readonly sourceReportFixtureName: StrategyReviewReportFixtureName;
  readonly sourceReportFixtureKind: StrategyReviewReportFixtureKind;
  readonly contentLength: number;
  readonly checksum: string;
  readonly hasContent: boolean;
  readonly hasMetadataPayload: boolean;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

export type StrategyReviewExportFileExtension = '.json' | '.md' | '.txt' | '.metadata.json';

export interface StrategyReviewExportPlanDefinition {
  readonly targetFormat: StrategyReviewExportPlanTarget;
  readonly exportMode: 'planning-only-disabled';
  readonly fileName: string;
  readonly fileExtension: StrategyReviewExportFileExtension;
  readonly mimeType: string;
  readonly previewContentKind: 'content' | 'metadata-only';
  readonly destination: 'disabled';
  readonly filePath: null;
  readonly downloadName: null;
  readonly enabled: false;
  readonly planSteps: readonly string[];
  readonly disabledReasons: readonly string[];
  readonly notes: readonly string[];
}

export interface StrategyReviewExportPlanMeta {
  readonly phase: 43;
  readonly sourcePreviewPhase: 42;
  readonly sourceReportPhase: 41;
  readonly sourcePhases: readonly [40, 41, 42, 43];
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly exportDisabled: true;
  readonly generatedAt: typeof PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT;
  readonly source: typeof PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_SOURCE;
  readonly sourcePreviewFixtureName: StrategyReviewSerializationPreviewFixtureName;
  readonly sourcePreviewFormat: StrategyReviewSerializationPreviewFormat;
  readonly sourceReportFixtureName: StrategyReviewReportFixtureName;
  readonly actualFileExport: false;
  readonly filesystemWrites: false;
  readonly downloadSupport: false;
  readonly pdfGeneration: false;
  readonly csvGeneration: false;
  readonly htmlGeneration: false;
  readonly externalNetwork: false;
  readonly persistence: false;
  readonly execution: false;
  readonly tradingSignals: false;
  readonly investmentAdvice: false;
  readonly notes: readonly string[];
}

export interface StrategyReviewExportPlanSafetyBoundary
  extends StrategyReviewSerializationSafetyBoundary {
  readonly strategyReviewExportPlanningFixtures: true;
  readonly syntheticStrategyReviewExportPlans: true;
  readonly strategyReviewExportPlanBuilders: true;
  readonly strategyReviewExportPlanSafetyValidation: true;
  readonly strategyReviewSerializationPreviewReferences: true;
  readonly strategyReviewFilesystemWrites: false;
  readonly strategyReviewPdfGeneration: false;
  readonly strategyReviewCsvGeneration: false;
  readonly strategyReviewHtmlGeneration: false;
  readonly strategyReviewExportExternalNetwork: false;
  readonly strategyReviewExportPersistence: false;
  readonly strategyReviewExportExecution: false;
  readonly strategyReviewExportTradingSignals: false;
  readonly strategyReviewExportInvestmentAdvice: false;
}

export interface StrategyReviewExportPlanSummary {
  readonly phase: 43;
  readonly fixtureName: StrategyReviewExportPlanFixtureName;
  readonly fixtureKind: StrategyReviewExportPlanFixtureKind;
  readonly targetFormat: StrategyReviewExportPlanTarget;
  readonly sourcePreviewFixtureName: StrategyReviewSerializationPreviewFixtureName;
  readonly sourceReportFixtureName: StrategyReviewReportFixtureName;
  readonly fileName: string;
  readonly planStepCount: number;
  readonly disabledReasonCount: number;
  readonly hasContentPreview: boolean;
  readonly hasMetadataPreview: boolean;
  readonly exportDisabled: true;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly serializable: true;
  readonly generatedAt: typeof PHASE_43_STRATEGY_REVIEW_EXPORT_PLAN_GENERATED_AT;
  readonly notes: readonly string[];
}

export interface StrategyReviewExportPlanFixture {
  readonly name: StrategyReviewExportPlanFixtureName;
  readonly kind: StrategyReviewExportPlanFixtureKind;
  readonly targetFormat: StrategyReviewExportPlanTarget;
  readonly title: string;
  readonly description: string;
  readonly previewReference: StrategyReviewSerializationPreviewReference;
  readonly exportPlan: StrategyReviewExportPlanDefinition;
  readonly summary: StrategyReviewExportPlanSummary;
  readonly meta: StrategyReviewExportPlanMeta;
  readonly safetyBoundary: StrategyReviewExportPlanSafetyBoundary;
  readonly safeNotes: readonly string[];
}

export interface StrategyReviewExportPlanValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewExportPlanValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewExportPlanValidationIssue[];
}

export interface StrategyReviewExportPlanSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface StrategyReviewExportPlanBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly targetFormat: StrategyReviewExportPlanTarget;
  readonly sourcePreviewFixtureName: StrategyReviewSerializationPreviewFixtureName;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface StrategyReviewExportPlanBuildResult {
  readonly success: boolean;
  readonly fixture: StrategyReviewExportPlanFixture | null;
  readonly validation: StrategyReviewExportPlanValidationResult;
  readonly safety: StrategyReviewExportPlanSafetyResult;
}

export interface StrategyReviewExportPlanCapabilities {
  readonly strategyReviewExportPlanningFixtures: true;
  readonly syntheticStrategyReviewExportPlans: true;
  readonly strategyReviewExportPlanBuilders: true;
  readonly strategyReviewExportPlanSafetyValidation: true;
  readonly strategyReviewSerializationPreviewReferences: true;
  readonly strategyReviewActualFileExport: false;
  readonly strategyReviewFilesystemWrites: false;
  readonly strategyReviewDownloadSupport: false;
  readonly strategyReviewPdfGeneration: false;
  readonly strategyReviewCsvGeneration: false;
  readonly strategyReviewHtmlGeneration: false;
  readonly strategyReviewExportExternalNetwork: false;
  readonly strategyReviewExportPersistence: false;
  readonly strategyReviewExportExecution: false;
  readonly strategyReviewExportTradingSignals: false;
  readonly strategyReviewExportInvestmentAdvice: false;
}
