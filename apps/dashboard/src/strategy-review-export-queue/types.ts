/**
 * Phase 44 — Strategy Review Export Queue Fixtures v1: types.
 *
 * Defines deterministic, synthetic export-queue fixtures for future local review
 * workflow orchestration based on Phase 43 export-planning fixtures. These fixtures
 * are queue-modelling-only and do not perform any actual queuing, export, download,
 * filesystem, or execution behavior.
 *
 * Safety: synthetic-only, local-only, read-only, deterministic, offline, in-memory,
 * non-persistent, non-mutating, external-network-free, file-write-free,
 * download-free, execution-free, queue-worker-free, and non-advisory.
 */

import type {
  StrategyReviewExportPlanFixtureKind,
  StrategyReviewExportPlanFixtureName,
  StrategyReviewExportPlanTarget,
} from '../strategy-review-export-planning/types.js';

export const PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE =
  'phase44_strategy_review_export_queue_fixtures_v1';

// ---------------------------------------------------------------------------
// Queue fixture names
// ---------------------------------------------------------------------------

export const STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES = [
  'defensive-vs-aggressive-export-queued',
  'creator-led-export-queued',
  'wallet-led-export-queued',
  'manipulation-avoidance-export-queued',
  'no-action-safety-export-queued',
  'insufficient-data-export-queued',
  'high-score-positive-export-queued',
  'high-score-false-positive-export-queued',
  'missed-opportunity-export-queued',
  'drawdown-contained-export-queued',
  'mixed-signal-watchlist-export-queued',
  'false-positive-protection-export-queued',
  'malformed-input-safe-export-queued',
  'dashboard-ready-export-queue',
  'serialization-ready-export-queue',
  'safety-boundary-export-queue',
] as const;

export type StrategyReviewExportQueueFixtureName =
  (typeof STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_NAMES)[number];

// ---------------------------------------------------------------------------
// Queue fixture kinds
// ---------------------------------------------------------------------------

export const STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS = [
  'comparison-export-queued',
  'creator-export-queued',
  'wallet-export-queued',
  'manipulation-export-queued',
  'safety-export-queued',
  'insufficient-data-export-queued',
  'positive-export-queued',
  'false-positive-export-queued',
  'missed-opportunity-export-queued',
  'drawdown-export-queued',
  'watchlist-export-queued',
  'protection-export-queued',
  'safe-export-queued',
  'dashboard-ready-export-queue',
  'serialization-ready-export-queue',
  'safety-boundary-export-queue',
] as const;

export type StrategyReviewExportQueueFixtureKind =
  (typeof STRATEGY_REVIEW_EXPORT_QUEUE_FIXTURE_KINDS)[number];

// ---------------------------------------------------------------------------
// Queue state / priority
// ---------------------------------------------------------------------------

export const STRATEGY_REVIEW_EXPORT_QUEUE_STATES = [
  'queued',
  'pending-review',
  'reviewed',
  'skipped',
  'safety-blocked',
] as const;

export type StrategyReviewExportQueueState =
  (typeof STRATEGY_REVIEW_EXPORT_QUEUE_STATES)[number];

export const STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES = [
  'high',
  'normal',
  'low',
] as const;

export type StrategyReviewExportQueuePriority =
  (typeof STRATEGY_REVIEW_EXPORT_QUEUE_PRIORITIES)[number];

// ---------------------------------------------------------------------------
// Phase 43 export-plan reference (synthetic only)
// ---------------------------------------------------------------------------

export interface StrategyReviewExportPlanReference {
  readonly sourcePhase: 43;
  readonly sourcePlanFixtureName: StrategyReviewExportPlanFixtureName;
  readonly sourcePlanFixtureKind: StrategyReviewExportPlanFixtureKind;
  readonly sourcePlanTargetFormat: StrategyReviewExportPlanTarget;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

// ---------------------------------------------------------------------------
// Queue item fixture
// ---------------------------------------------------------------------------

export interface StrategyReviewExportQueueItemFixture {
  readonly queueItemId: string;
  readonly state: StrategyReviewExportQueueState;
  readonly priority: StrategyReviewExportQueuePriority;
  readonly planReference: StrategyReviewExportPlanReference;
  readonly queuedAt: typeof PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

// ---------------------------------------------------------------------------
// Safety boundary
// ---------------------------------------------------------------------------

export interface StrategyReviewExportQueueSafetyBoundary {
  readonly strategyReviewExportQueueFixtures: true;
  readonly syntheticStrategyReviewExportQueues: true;
  readonly strategyReviewExportQueueBuilders: true;
  readonly strategyReviewExportQueueSafetyValidation: true;
  readonly strategyReviewExportPlanReferences: true;
  readonly strategyReviewActualQueueWorkers: false;
  readonly strategyReviewScheduledJobs: false;
  readonly strategyReviewBackgroundJobs: false;
  readonly strategyReviewActualFileExport: false;
  readonly strategyReviewDownloadSupport: false;
  readonly strategyReviewPdfGeneration: false;
  readonly strategyReviewCsvGeneration: false;
  readonly strategyReviewHtmlGeneration: false;
  readonly strategyReviewExportQueueExternalNetwork: false;
  readonly strategyReviewExportQueuePersistence: false;
  readonly strategyReviewExportQueueExecution: false;
  readonly strategyReviewExportQueueTradingSignals: false;
  readonly strategyReviewExportQueueInvestmentAdvice: false;
}

// ---------------------------------------------------------------------------
// Queue summary / metadata
// ---------------------------------------------------------------------------

export interface StrategyReviewExportQueueSummary {
  readonly phase: 44;
  readonly fixtureName: StrategyReviewExportQueueFixtureName;
  readonly fixtureKind: StrategyReviewExportQueueFixtureKind;
  readonly state: StrategyReviewExportQueueState;
  readonly priority: StrategyReviewExportQueuePriority;
  readonly sourcePlanFixtureName: StrategyReviewExportPlanFixtureName;
  readonly sourcePlanTargetFormat: StrategyReviewExportPlanTarget;
  readonly itemCount: number;
  readonly queuedAt: typeof PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly serializable: true;
  readonly generatedAt: typeof PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT;
  readonly notes: readonly string[];
}

// ---------------------------------------------------------------------------
// Queue meta
// ---------------------------------------------------------------------------

export interface StrategyReviewExportQueueMeta {
  readonly phase: 44;
  readonly sourcePlanPhase: 43;
  readonly sourcePhases: readonly [40, 41, 42, 43, 44];
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly queueExecutionDisabled: true;
  readonly generatedAt: typeof PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_GENERATED_AT;
  readonly source: typeof PHASE_44_STRATEGY_REVIEW_EXPORT_QUEUE_SOURCE;
  readonly sourcePlanFixtureName: StrategyReviewExportPlanFixtureName;
  readonly actualQueueWorkers: false;
  readonly scheduledJobs: false;
  readonly backgroundJobs: false;
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

// ---------------------------------------------------------------------------
// Main fixture type
// ---------------------------------------------------------------------------

export interface StrategyReviewExportQueueFixture {
  readonly name: StrategyReviewExportQueueFixtureName;
  readonly kind: StrategyReviewExportQueueFixtureKind;
  readonly title: string;
  readonly description: string;
  readonly queueItem: StrategyReviewExportQueueItemFixture;
  readonly summary: StrategyReviewExportQueueSummary;
  readonly meta: StrategyReviewExportQueueMeta;
  readonly safetyBoundary: StrategyReviewExportQueueSafetyBoundary;
  readonly safeNotes: readonly string[];
}

// ---------------------------------------------------------------------------
// Validation types
// ---------------------------------------------------------------------------

export interface StrategyReviewExportQueueValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewExportQueueValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewExportQueueValidationIssue[];
}

export interface StrategyReviewExportQueueSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

// ---------------------------------------------------------------------------
// Build types
// ---------------------------------------------------------------------------

export interface StrategyReviewExportQueueBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly state: StrategyReviewExportQueueState;
  readonly priority: StrategyReviewExportQueuePriority;
  readonly sourcePlanFixtureName: StrategyReviewExportPlanFixtureName;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface StrategyReviewExportQueueBuildResult {
  readonly success: boolean;
  readonly fixture: StrategyReviewExportQueueFixture | null;
  readonly validation: StrategyReviewExportQueueValidationResult;
  readonly safety: StrategyReviewExportQueueSafetyResult;
}

// ---------------------------------------------------------------------------
// Capabilities type
// ---------------------------------------------------------------------------

export interface StrategyReviewExportQueueCapabilities {
  readonly strategyReviewExportQueueFixtures: true;
  readonly syntheticStrategyReviewExportQueues: true;
  readonly strategyReviewExportQueueBuilders: true;
  readonly strategyReviewExportQueueSafetyValidation: true;
  readonly strategyReviewExportPlanReferences: true;
  readonly strategyReviewActualQueueWorkers: false;
  readonly strategyReviewScheduledJobs: false;
  readonly strategyReviewBackgroundJobs: false;
  readonly strategyReviewActualFileExport: false;
  readonly strategyReviewDownloadSupport: false;
  readonly strategyReviewPdfGeneration: false;
  readonly strategyReviewCsvGeneration: false;
  readonly strategyReviewHtmlGeneration: false;
  readonly strategyReviewExportQueueExternalNetwork: false;
  readonly strategyReviewExportQueuePersistence: false;
  readonly strategyReviewExportQueueExecution: false;
  readonly strategyReviewExportQueueTradingSignals: false;
  readonly strategyReviewExportQueueInvestmentAdvice: false;
}
