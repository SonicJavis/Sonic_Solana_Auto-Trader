/**
 * Phase 45 — Strategy Review Export Audit Fixtures v1: types.
 *
 * Defines deterministic, synthetic export-audit fixtures for future local review
 * workflow auditing based on Phase 44 export-queue fixtures. These fixtures are
 * audit-modelling-only and do not perform any actual auditing, export, download,
 * filesystem, or execution behavior.
 *
 * Safety: synthetic-only, local-only, read-only, deterministic, offline, in-memory,
 * non-persistent, non-mutating, external-network-free, file-write-free,
 * download-free, execution-free, queue-worker-free, and non-advisory.
 */

import type {
  StrategyReviewExportQueueFixtureKind,
  StrategyReviewExportQueueFixtureName,
  StrategyReviewExportQueuePriority,
  StrategyReviewExportQueueState,
} from '../strategy-review-export-queue/types.js';

export const PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE =
  'phase45_strategy_review_export_audit_fixtures_v1';

// ---------------------------------------------------------------------------
// Audit fixture names
// ---------------------------------------------------------------------------

export const STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES = [
  'defensive-vs-aggressive-export-audited',
  'creator-led-export-audited',
  'wallet-led-export-audited',
  'manipulation-avoidance-export-audited',
  'no-action-safety-export-audited',
  'insufficient-data-export-audited',
  'high-score-positive-export-audited',
  'high-score-false-positive-export-audited',
  'missed-opportunity-export-audited',
  'drawdown-contained-export-audited',
  'mixed-signal-watchlist-export-audited',
  'false-positive-protection-export-audited',
  'malformed-input-safe-export-audited',
  'dashboard-ready-export-audit',
  'serialization-ready-export-audit',
  'safety-boundary-export-audit',
] as const;

export type StrategyReviewExportAuditFixtureName =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_NAMES)[number];

// ---------------------------------------------------------------------------
// Audit fixture kinds
// ---------------------------------------------------------------------------

export const STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS = [
  'comparison-export-audited',
  'creator-export-audited',
  'wallet-export-audited',
  'manipulation-export-audited',
  'safety-export-audited',
  'insufficient-data-export-audited',
  'positive-export-audited',
  'false-positive-export-audited',
  'missed-opportunity-export-audited',
  'drawdown-export-audited',
  'watchlist-export-audited',
  'protection-export-audited',
  'safe-export-audited',
  'dashboard-ready-export-audit',
  'serialization-ready-export-audit',
  'safety-boundary-export-audit',
] as const;

export type StrategyReviewExportAuditFixtureKind =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_FIXTURE_KINDS)[number];

// ---------------------------------------------------------------------------
// Audit state / severity
// ---------------------------------------------------------------------------

export const STRATEGY_REVIEW_EXPORT_AUDIT_STATES = [
  'audit-pending',
  'audit-passed',
  'audit-failed',
  'audit-skipped',
  'audit-blocked',
] as const;

export type StrategyReviewExportAuditState =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_STATES)[number];

export const STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES = [
  'info',
  'warning',
  'error',
  'critical',
] as const;

export type StrategyReviewExportAuditSeverity =
  (typeof STRATEGY_REVIEW_EXPORT_AUDIT_SEVERITIES)[number];

// ---------------------------------------------------------------------------
// Phase 44 export-queue reference (synthetic only)
// ---------------------------------------------------------------------------

export interface StrategyReviewExportQueueReference {
  readonly sourcePhase: 44;
  readonly sourceQueueFixtureName: StrategyReviewExportQueueFixtureName;
  readonly sourceQueueFixtureKind: StrategyReviewExportQueueFixtureKind;
  readonly sourceQueueState: StrategyReviewExportQueueState;
  readonly sourceQueuePriority: StrategyReviewExportQueuePriority;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

// ---------------------------------------------------------------------------
// Audit finding
// ---------------------------------------------------------------------------

export interface StrategyReviewExportAuditFinding {
  readonly findingId: string;
  readonly severity: StrategyReviewExportAuditSeverity;
  readonly category: string;
  readonly description: string;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
}

// ---------------------------------------------------------------------------
// Audit item fixture
// ---------------------------------------------------------------------------

export interface StrategyReviewExportAuditItemFixture {
  readonly auditItemId: string;
  readonly state: StrategyReviewExportAuditState;
  readonly severity: StrategyReviewExportAuditSeverity;
  readonly queueReference: StrategyReviewExportQueueReference;
  readonly findings: readonly StrategyReviewExportAuditFinding[];
  readonly auditedAt: typeof PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

// ---------------------------------------------------------------------------
// Safety boundary
// ---------------------------------------------------------------------------

export interface StrategyReviewExportAuditSafetyBoundary {
  readonly strategyReviewExportAuditFixtures: true;
  readonly syntheticStrategyReviewExportAudits: true;
  readonly strategyReviewExportAuditBuilders: true;
  readonly strategyReviewExportAuditSafetyValidation: true;
  readonly strategyReviewExportQueueReferences: true;
  readonly strategyReviewActualAuditLogs: false;
  readonly strategyReviewAuditPersistence: false;
  readonly strategyReviewAuditFileWrites: false;
  readonly strategyReviewAuditExternalNetwork: false;
  readonly strategyReviewAuditQueueWorkers: false;
  readonly strategyReviewAuditScheduledJobs: false;
  readonly strategyReviewAuditBackgroundJobs: false;
  readonly strategyReviewAuditActualFileExport: false;
  readonly strategyReviewAuditDownloadSupport: false;
  readonly strategyReviewAuditExecution: false;
  readonly strategyReviewAuditTradingSignals: false;
  readonly strategyReviewAuditInvestmentAdvice: false;
}

// ---------------------------------------------------------------------------
// Audit summary / metadata
// ---------------------------------------------------------------------------

export interface StrategyReviewExportAuditSummary {
  readonly phase: 45;
  readonly fixtureName: StrategyReviewExportAuditFixtureName;
  readonly fixtureKind: StrategyReviewExportAuditFixtureKind;
  readonly state: StrategyReviewExportAuditState;
  readonly severity: StrategyReviewExportAuditSeverity;
  readonly sourceQueueFixtureName: StrategyReviewExportQueueFixtureName;
  readonly findingCount: number;
  readonly auditedAt: typeof PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly serializable: true;
  readonly generatedAt: typeof PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT;
  readonly notes: readonly string[];
}

// ---------------------------------------------------------------------------
// Audit meta
// ---------------------------------------------------------------------------

export interface StrategyReviewExportAuditMeta {
  readonly phase: 45;
  readonly sourceQueuePhase: 44;
  readonly sourcePhases: readonly [40, 41, 42, 43, 44, 45];
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly auditExecutionDisabled: true;
  readonly generatedAt: typeof PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_GENERATED_AT;
  readonly source: typeof PHASE_45_STRATEGY_REVIEW_EXPORT_AUDIT_SOURCE;
  readonly sourceQueueFixtureName: StrategyReviewExportQueueFixtureName;
  readonly actualAuditLogs: false;
  readonly auditPersistence: false;
  readonly auditFileWrites: false;
  readonly auditExternalNetwork: false;
  readonly actualQueueWorkers: false;
  readonly scheduledJobs: false;
  readonly backgroundJobs: false;
  readonly actualFileExport: false;
  readonly filesystemWrites: false;
  readonly downloadSupport: false;
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

export interface StrategyReviewExportAuditFixture {
  readonly name: StrategyReviewExportAuditFixtureName;
  readonly kind: StrategyReviewExportAuditFixtureKind;
  readonly title: string;
  readonly description: string;
  readonly auditItem: StrategyReviewExportAuditItemFixture;
  readonly summary: StrategyReviewExportAuditSummary;
  readonly meta: StrategyReviewExportAuditMeta;
  readonly safetyBoundary: StrategyReviewExportAuditSafetyBoundary;
  readonly safeNotes: readonly string[];
}

// ---------------------------------------------------------------------------
// Validation types
// ---------------------------------------------------------------------------

export interface StrategyReviewExportAuditValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewExportAuditValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewExportAuditValidationIssue[];
}

export interface StrategyReviewExportAuditSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

// ---------------------------------------------------------------------------
// Build types
// ---------------------------------------------------------------------------

export interface StrategyReviewExportAuditBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly state: StrategyReviewExportAuditState;
  readonly severity: StrategyReviewExportAuditSeverity;
  readonly sourceQueueFixtureName: StrategyReviewExportQueueFixtureName;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface StrategyReviewExportAuditBuildResult {
  readonly success: boolean;
  readonly fixture: StrategyReviewExportAuditFixture | null;
  readonly validation: StrategyReviewExportAuditValidationResult;
  readonly safety: StrategyReviewExportAuditSafetyResult;
}

// ---------------------------------------------------------------------------
// Capabilities type
// ---------------------------------------------------------------------------

export interface StrategyReviewExportAuditCapabilities {
  readonly strategyReviewExportAuditFixtures: true;
  readonly syntheticStrategyReviewExportAudits: true;
  readonly strategyReviewExportAuditBuilders: true;
  readonly strategyReviewExportAuditSafetyValidation: true;
  readonly strategyReviewExportQueueReferences: true;
  readonly strategyReviewActualAuditLogs: false;
  readonly strategyReviewAuditPersistence: false;
  readonly strategyReviewAuditFileWrites: false;
  readonly strategyReviewAuditExternalNetwork: false;
  readonly strategyReviewAuditQueueWorkers: false;
  readonly strategyReviewAuditScheduledJobs: false;
  readonly strategyReviewAuditBackgroundJobs: false;
  readonly strategyReviewAuditActualFileExport: false;
  readonly strategyReviewAuditDownloadSupport: false;
  readonly strategyReviewAuditExecution: false;
  readonly strategyReviewAuditTradingSignals: false;
  readonly strategyReviewAuditInvestmentAdvice: false;
}
