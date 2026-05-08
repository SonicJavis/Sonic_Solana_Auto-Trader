/**
 * apps/dashboard/src/composite-evidence-fixtures/types.ts
 *
 * Phase 35 — Composite Evidence Dashboard/Report Fixtures v1 — Types
 *
 * Defines strict TypeScript types for composite evidence dashboard/report
 * fixture structures. Bridges Phase 33 composite evidence models and Phase 34
 * report integration models into the existing local dashboard/report fixture
 * ecosystem.
 *
 * SAFETY: Synthetic-only, local-only, read-only, deterministic, in-memory,
 *         non-persistent, external-network-free, file-write-free, non-advisory,
 *         non-accusatory, and execution-free.
 */

import type {
  OfflineCompositeEvidenceFixtureName,
  OfflineCompositeEvidenceFixtureKind,
} from '@sonic/offline-intelligence';
import type {
  OfflineIntelligenceReportFixtureName,
  OfflineIntelligenceReportKind,
} from '@sonic/offline-intelligence';

// ─── Phase 35 constants ───────────────────────────────────────────────────────

export const PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT =
  '2026-01-01T00:00:00.000Z';
export const PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE =
  'phase35_composite_evidence_dashboard_report_fixtures_v1';

// ─── Fixture names ────────────────────────────────────────────────────────────

export const COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES = [
  'clean-low-risk-dashboard',
  'creator-credible-wallet-benign-dashboard',
  'creator-risk-wallet-risk-dashboard',
  'manipulation-risk-dominates-dashboard',
  'mixed-signal-watchlist-dashboard',
  'insufficient-data-dashboard',
  'high-risk-multi-evidence-dashboard',
  'safety-boundary-dashboard',
  'malformed-input-safe-dashboard',
  'clean-low-risk-report',
  'mixed-signal-watchlist-report',
  'high-risk-multi-evidence-report',
  'safety-boundary-report',
  'dashboard-ready-combined',
  'report-ready-combined',
  'serialization-preview-ready-combined',
] as const;

export type CompositeEvidenceDashboardReportFixtureName =
  (typeof COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_NAMES)[number];

// ─── Fixture kinds ────────────────────────────────────────────────────────────

export const COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS = [
  'dashboard',
  'report',
  'combined',
] as const;

export type CompositeEvidenceDashboardReportFixtureKind =
  (typeof COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_KINDS)[number];

// ─── Panel fixture ────────────────────────────────────────────────────────────

export interface CompositeEvidencePanelFixture {
  readonly panelId: string;
  readonly title: string;
  readonly kind: string;
  readonly riskBand: 'low' | 'moderate' | 'elevated' | 'high' | 'critical' | 'unknown';
  readonly qualityBand: 'low' | 'moderate' | 'high' | 'unknown';
  readonly confidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly sourceCount: number;
  readonly riskIndicators: readonly string[];
  readonly qualityIndicators: readonly string[];
  readonly confidenceIndicators: readonly string[];
  readonly notes: readonly string[];
}

// ─── Report section fixture ───────────────────────────────────────────────────

export interface CompositeEvidenceReportSectionFixture {
  readonly sectionId: string;
  readonly title: string;
  readonly kind: string;
  readonly summary: string;
  readonly notes: readonly string[];
}

// ─── Fixture meta ─────────────────────────────────────────────────────────────

export interface CompositeEvidenceFixtureMeta {
  readonly phase: 35;
  readonly generatedAt: typeof PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_GENERATED_AT;
  readonly source: typeof PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURES_SOURCE;
  readonly sourceCompositeFixtureName: OfflineCompositeEvidenceFixtureName | null;
  readonly sourceCompositeFixtureKind: OfflineCompositeEvidenceFixtureKind | null;
  readonly sourceReportFixtureName: OfflineIntelligenceReportFixtureName | null;
  readonly sourceReportFixtureKind: OfflineIntelligenceReportKind | null;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly persistence: false;
  readonly nonAdvisory: true;
  readonly nonAccusatory: true;
  readonly notes: readonly string[];
}

// ─── Fixture summary ──────────────────────────────────────────────────────────

export interface CompositeEvidenceFixtureSummary {
  readonly fixtureName: CompositeEvidenceDashboardReportFixtureName;
  readonly fixtureKind: CompositeEvidenceDashboardReportFixtureKind;
  readonly overallRiskBand: 'low' | 'moderate' | 'elevated' | 'high' | 'critical' | 'unknown';
  readonly overallQualityBand: 'low' | 'moderate' | 'high' | 'unknown';
  readonly overallConfidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly sourceCount: number;
  readonly panelCount: number;
  readonly sectionCount: number;
  readonly nonAdvisory: true;
  readonly nonActionable: true;
  readonly safeToDisplay: true;
  readonly generatedAt: string;
  readonly notes: readonly string[];
}

// ─── Dashboard fixture ────────────────────────────────────────────────────────

export interface CompositeEvidenceDashboardFixture {
  readonly name: CompositeEvidenceDashboardReportFixtureName;
  readonly kind: 'dashboard';
  readonly title: string;
  readonly panels: readonly CompositeEvidencePanelFixture[];
  readonly summary: CompositeEvidenceFixtureSummary;
  readonly meta: CompositeEvidenceFixtureMeta;
  readonly safeNotes: readonly string[];
}

// ─── Report fixture ───────────────────────────────────────────────────────────

export interface CompositeEvidenceReportFixture {
  readonly name: CompositeEvidenceDashboardReportFixtureName;
  readonly kind: 'report';
  readonly title: string;
  readonly sections: readonly CompositeEvidenceReportSectionFixture[];
  readonly summary: CompositeEvidenceFixtureSummary;
  readonly meta: CompositeEvidenceFixtureMeta;
  readonly safeNotes: readonly string[];
}

// ─── Combined fixture ─────────────────────────────────────────────────────────

export interface CompositeEvidenceDashboardReportFixture {
  readonly name: CompositeEvidenceDashboardReportFixtureName;
  readonly kind: CompositeEvidenceDashboardReportFixtureKind;
  readonly title: string;
  readonly description: string;
  readonly dashboard: CompositeEvidenceDashboardFixture | null;
  readonly report: CompositeEvidenceReportFixture | null;
  readonly summary: CompositeEvidenceFixtureSummary;
  readonly meta: CompositeEvidenceFixtureMeta;
  readonly safeNotes: readonly string[];
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface CompositeEvidenceFixtureValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface CompositeEvidenceFixtureValidationResult {
  readonly valid: boolean;
  readonly issues: readonly CompositeEvidenceFixtureValidationIssue[];
}

// ─── Safety result ────────────────────────────────────────────────────────────

export interface CompositeEvidenceFixtureSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

// ─── Build input/result ───────────────────────────────────────────────────────

export interface CompositeEvidenceFixtureBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly sourceCompositeFixtureName?: OfflineCompositeEvidenceFixtureName | null;
  readonly sourceCompositeFixtureKind?: OfflineCompositeEvidenceFixtureKind | null;
  readonly sourceReportFixtureName?: OfflineIntelligenceReportFixtureName | null;
  readonly sourceReportFixtureKind?: OfflineIntelligenceReportKind | null;
  readonly overallRiskBand?: CompositeEvidenceFixtureSummary['overallRiskBand'] | null;
  readonly overallQualityBand?: CompositeEvidenceFixtureSummary['overallQualityBand'] | null;
  readonly overallConfidenceBand?: CompositeEvidenceFixtureSummary['overallConfidenceBand'] | null;
  readonly sourceCount?: number | null;
  readonly riskIndicators?: readonly string[] | null;
  readonly qualityIndicators?: readonly string[] | null;
  readonly confidenceIndicators?: readonly string[] | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface CompositeEvidenceFixtureBuildResult {
  readonly success: boolean;
  readonly fixture: CompositeEvidenceDashboardReportFixture | null;
  readonly validation: CompositeEvidenceFixtureValidationResult;
  readonly safety: CompositeEvidenceFixtureSafetyResult;
}

// ─── Capability flags ─────────────────────────────────────────────────────────

export interface CompositeEvidenceDashboardReportFixtureCapabilities {
  readonly compositeEvidenceDashboardFixtures: true;
  readonly compositeEvidenceReportFixtures: true;
  readonly compositeEvidenceDashboardReportFixtures: true;
  readonly compositeEvidenceFixtureBuilders: true;
  readonly compositeEvidenceFixtureSafetyValidation: true;
  readonly compositeEvidenceFixtureLiveData: false;
  readonly compositeEvidenceFixtureSolanaRpc: false;
  readonly compositeEvidenceFixtureExternalNetwork: false;
  readonly compositeEvidenceFixtureTradingSignals: false;
  readonly compositeEvidenceFixtureInvestmentAdvice: false;
  readonly compositeEvidenceFixtureExecution: false;
  readonly compositeEvidenceFixturePersistence: false;
  readonly compositeEvidenceFixtureFileExport: false;
  readonly compositeEvidenceFixtureDownloadSupport: false;
}
