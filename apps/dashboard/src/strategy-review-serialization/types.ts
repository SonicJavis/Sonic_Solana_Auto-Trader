/**
 * Phase 42 — Strategy Review Serialization Preview Fixtures v1: types.
 *
 * Defines in-memory preview fixture types for how Phase 41 strategy review reports
 * may be represented as JSON, Markdown, plain text, and metadata-only previews.
 *
 * Safety: synthetic-only, local-only, read-only, deterministic, offline, in-memory,
 * non-persistent, non-mutating, external-network-free, file-write-free, non-advisory,
 * execution-free.
 */

import type {
  StrategyReviewReportFixtureKind,
  StrategyReviewReportFixtureName,
  StrategyReviewReportSafetyBoundary,
} from '../strategy-review-reports/types.js';

// ─── Constants ───────────────────────────────────────────────────────────────

export const PHASE_42_STRATEGY_REVIEW_SERIALIZATION_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_42_STRATEGY_REVIEW_SERIALIZATION_SOURCE =
  'phase42_strategy_review_serialization_preview_fixtures_v1';

// ─── Preview format ──────────────────────────────────────────────────────────

export type StrategyReviewSerializationPreviewFormat =
  | 'json'
  | 'markdown'
  | 'text'
  | 'metadata';

export const STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FORMATS: readonly StrategyReviewSerializationPreviewFormat[] =
  ['json', 'markdown', 'text', 'metadata'] as const;

// ─── Fixture names ───────────────────────────────────────────────────────────

export const STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES = [
  'defensive-vs-aggressive-json-preview',
  'creator-led-markdown-preview',
  'wallet-led-text-preview',
  'manipulation-avoidance-metadata-preview',
  'no-action-safety-json-preview',
  'insufficient-data-markdown-preview',
  'high-score-positive-text-preview',
  'high-score-false-positive-metadata-preview',
  'missed-opportunity-json-preview',
  'drawdown-contained-markdown-preview',
  'mixed-signal-watchlist-text-preview',
  'false-positive-protection-metadata-preview',
  'malformed-input-safe-preview',
  'dashboard-ready-serialization-preview',
  'report-ready-serialization-preview',
  'safety-boundary-serialization-preview',
] as const;

export type StrategyReviewSerializationPreviewFixtureName =
  (typeof STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_NAMES)[number];

// ─── Fixture kinds ───────────────────────────────────────────────────────────

export const STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS = [
  'json-preview',
  'markdown-preview',
  'text-preview',
  'metadata-preview',
  'safe-preview',
  'dashboard-preview',
  'report-preview',
  'safety-boundary-preview',
] as const;

export type StrategyReviewSerializationPreviewFixtureKind =
  (typeof STRATEGY_REVIEW_SERIALIZATION_PREVIEW_FIXTURE_KINDS)[number];

// ─── Phase 41 report reference ────────────────────────────────────────────────

export interface StrategyReviewReportPreviewReference {
  readonly sourcePhase: 41;
  readonly sourceReportFixtureName: StrategyReviewReportFixtureName;
  readonly sourceReportFixtureKind: StrategyReviewReportFixtureKind;
  readonly sectionCount: number;
  readonly cardCount: number;
  readonly tableCount: number;
  readonly rowCount: number;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

// ─── Preview meta ─────────────────────────────────────────────────────────────

export interface StrategyReviewSerializationPreviewMeta {
  readonly phase: 42;
  readonly sourceReportPhase: 41;
  readonly sourcePhases: readonly [40, 41, 42];
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly deterministic: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly inMemoryOnly: true;
  readonly generatedAt: string;
  readonly source: string;
  readonly sourceReportFixtureName: StrategyReviewReportFixtureName;
  readonly sourceReportFixtureKind: StrategyReviewReportFixtureKind;
  readonly notes: readonly string[];
}

// ─── Safety boundary ─────────────────────────────────────────────────────────

export interface StrategyReviewSerializationSafetyBoundary extends StrategyReviewReportSafetyBoundary {
  readonly strategyReviewSerializationPreview: true;
  readonly strategyReviewJsonPreview: true;
  readonly strategyReviewMarkdownPreview: true;
  readonly strategyReviewTextPreview: true;
  readonly strategyReviewMetadataPreview: true;
  readonly strategyReviewActualFileExport: false;
  readonly strategyReviewDownloadSupport: false;
  readonly strategyReviewSerializationExternalNetwork: false;
  readonly strategyReviewSerializationPersistence: false;
  readonly strategyReviewSerializationExecution: false;
  readonly strategyReviewSerializationTradingSignals: false;
  readonly strategyReviewSerializationInvestmentAdvice: false;
}

// ─── Preview summary ─────────────────────────────────────────────────────────

export interface StrategyReviewSerializationPreviewSummary {
  readonly phase: 42;
  readonly fixtureName: StrategyReviewSerializationPreviewFixtureName;
  readonly fixtureKind: StrategyReviewSerializationPreviewFixtureKind;
  readonly format: StrategyReviewSerializationPreviewFormat;
  readonly contentLength: number;
  readonly checksum: string;
  readonly hasContent: boolean;
  readonly hasMetadataPayload: boolean;
  readonly sourceReportFixtureName: StrategyReviewReportFixtureName;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly readOnly: true;
  readonly serializable: true;
  readonly nonAdvisory: true;
  readonly generatedAt: string;
  readonly notes: readonly string[];
}

// ─── Core preview fixture ─────────────────────────────────────────────────────

export interface StrategyReviewSerializationPreviewFixture {
  readonly name: StrategyReviewSerializationPreviewFixtureName;
  readonly kind: StrategyReviewSerializationPreviewFixtureKind;
  readonly format: StrategyReviewSerializationPreviewFormat;
  readonly title: string;
  readonly description: string;
  readonly reportReference: StrategyReviewReportPreviewReference;
  readonly content: string | null;
  readonly metadataPayload: Record<string, unknown> | null;
  readonly contentLength: number;
  readonly checksum: string;
  readonly summary: StrategyReviewSerializationPreviewSummary;
  readonly meta: StrategyReviewSerializationPreviewMeta;
  readonly safetyBoundary: StrategyReviewSerializationSafetyBoundary;
  readonly safeNotes: readonly string[];
}

// ─── Validation types ─────────────────────────────────────────────────────────

export interface StrategyReviewSerializationValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyReviewSerializationValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyReviewSerializationValidationIssue[];
}

// ─── Safety result ────────────────────────────────────────────────────────────

export interface StrategyReviewSerializationSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

// ─── Build input/result ───────────────────────────────────────────────────────

export interface StrategyReviewSerializationBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly format: StrategyReviewSerializationPreviewFormat;
  readonly sourceReportFixtureName: StrategyReviewReportFixtureName;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface StrategyReviewSerializationBuildResult {
  readonly success: boolean;
  readonly fixture: StrategyReviewSerializationPreviewFixture | null;
  readonly validation: StrategyReviewSerializationValidationResult;
  readonly safety: StrategyReviewSerializationSafetyResult;
}

// ─── Capabilities ─────────────────────────────────────────────────────────────

export interface StrategyReviewSerializationPreviewCapabilities {
  // Phase 42 capabilities
  readonly strategyReviewSerializationPreviewFixtures: true;
  readonly syntheticStrategyReviewSerializationPreviews: true;
  readonly strategyReviewSerializationPreviewBuilders: true;
  readonly strategyReviewSerializationSafetyValidation: true;
  readonly strategyReviewReportReferences: true;
  readonly strategyReviewJsonPreview: true;
  readonly strategyReviewMarkdownPreview: true;
  readonly strategyReviewTextPreview: true;
  readonly strategyReviewMetadataPreview: true;
  readonly strategyReviewActualFileExport: false;
  readonly strategyReviewDownloadSupport: false;
  readonly strategyReviewSerializationExternalNetwork: false;
  readonly strategyReviewSerializationPersistence: false;
  readonly strategyReviewSerializationExecution: false;
  readonly strategyReviewSerializationTradingSignals: false;
  readonly strategyReviewSerializationInvestmentAdvice: false;
}
