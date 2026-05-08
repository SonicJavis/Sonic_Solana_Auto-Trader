/**
 * Phase 34 — Offline Intelligence Report Integration Models v1: types.
 */

import type {
  CompositeEvidenceSourceReference,
  CompositeEvidenceWeighting,
  OfflineCompositeEvidenceFixture,
  OfflineCompositeEvidenceFixtureKind,
  OfflineCompositeEvidenceFixtureName,
} from '../types.js';

export const PHASE_34_OFFLINE_INTELLIGENCE_REPORT_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE =
  'phase34_offline_intelligence_report_integration_models_v1';

export const OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES = [
  'clean-low-risk-intelligence-report',
  'creator-credible-wallet-benign-intelligence-report',
  'creator-unknown-wallet-low-signal-intelligence-report',
  'creator-risk-wallet-risk-intelligence-report',
  'manipulation-risk-dominates-intelligence-report',
  'wallet-cluster-risk-dominates-intelligence-report',
  'creator-risk-dominates-intelligence-report',
  'mixed-signal-watchlist-intelligence-report',
  'false-positive-protected-intelligence-report',
  'insufficient-data-intelligence-report',
  'high-risk-multi-evidence-intelligence-report',
  'safety-boundary-intelligence-report',
  'malformed-input-safe-intelligence-report',
  'no-action-non-advisory-intelligence-report',
  'dashboard-ready-intelligence-report',
  'serialization-preview-ready-intelligence-report',
] as const;

export type OfflineIntelligenceReportFixtureName =
  (typeof OFFLINE_INTELLIGENCE_REPORT_FIXTURE_NAMES)[number];

export const OFFLINE_INTELLIGENCE_REPORT_KINDS = [
  'clean-low-risk',
  'creator-credible-wallet-benign',
  'creator-unknown-wallet-low-signal',
  'creator-risk-wallet-risk',
  'manipulation-risk-dominates',
  'wallet-cluster-risk-dominates',
  'creator-risk-dominates',
  'mixed-signal-watchlist',
  'false-positive-protected',
  'insufficient-data',
  'high-risk-multi-evidence',
  'safety-boundary',
  'malformed-input-safe',
  'no-action-non-advisory',
  'dashboard-ready',
  'serialization-preview-ready',
] as const;

export type OfflineIntelligenceReportKind =
  (typeof OFFLINE_INTELLIGENCE_REPORT_KINDS)[number];

export const OFFLINE_INTELLIGENCE_REPORT_SECTION_KINDS = [
  'summary',
  'risk',
  'quality',
  'confidence',
  'source-references',
  'weighting',
  'safety-boundary',
] as const;

export type OfflineIntelligenceReportSectionKind =
  (typeof OFFLINE_INTELLIGENCE_REPORT_SECTION_KINDS)[number];

export interface OfflineIntelligenceReportSection {
  readonly id: string;
  readonly title: string;
  readonly kind: OfflineIntelligenceReportSectionKind;
  readonly summary: string;
  readonly notes: readonly string[];
}

export interface OfflineIntelligenceRiskSection extends OfflineIntelligenceReportSection {
  readonly kind: 'risk';
  readonly overallRiskBand: OfflineIntelligenceReportSummary['overallRiskBand'];
  readonly indicators: readonly string[];
}

export interface OfflineIntelligenceQualitySection extends OfflineIntelligenceReportSection {
  readonly kind: 'quality';
  readonly overallQualityBand: OfflineIntelligenceReportSummary['overallQualityBand'];
  readonly indicators: readonly string[];
}

export interface OfflineIntelligenceConfidenceSection
  extends OfflineIntelligenceReportSection {
  readonly kind: 'confidence';
  readonly overallConfidenceBand: OfflineIntelligenceReportSummary['overallConfidenceBand'];
  readonly indicators: readonly string[];
}

export interface OfflineIntelligenceSourceReferenceSection
  extends OfflineIntelligenceReportSection {
  readonly kind: 'source-references';
  readonly sourceReferences: CompositeEvidenceSourceReference;
}

export interface OfflineIntelligenceSafetyBoundarySection
  extends OfflineIntelligenceReportSection {
  readonly kind: 'safety-boundary';
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly persistence: false;
  readonly nonAdvisory: true;
  readonly nonAccusatory: true;
}

export type OfflineIntelligenceTypedReportSection =
  | OfflineIntelligenceReportSection
  | OfflineIntelligenceRiskSection
  | OfflineIntelligenceQualitySection
  | OfflineIntelligenceConfidenceSection
  | OfflineIntelligenceSourceReferenceSection
  | OfflineIntelligenceSafetyBoundarySection;

export interface OfflineIntelligenceReportMeta {
  readonly phase: 34;
  readonly generatedAt: string;
  readonly source: typeof PHASE_34_OFFLINE_INTELLIGENCE_REPORT_SOURCE;
  readonly sourceCompositeFixtureName: OfflineCompositeEvidenceFixtureName;
  readonly sourceCompositeFixtureKind: OfflineCompositeEvidenceFixtureKind;
  readonly sourceCompositeGeneratedAt: string;
  readonly sourceCompositeWeighting: CompositeEvidenceWeighting;
  readonly sourceCompositeReferenceCount: number;
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
  readonly dashboardReportCompatible: true;
  readonly serializationPreviewCompatible: true;
  readonly notes: readonly string[];
}

export interface OfflineIntelligenceReportSummary {
  readonly phase: 34;
  readonly reportName: OfflineIntelligenceReportFixtureName;
  readonly reportKind: OfflineIntelligenceReportKind;
  readonly sourceCompositeFixtureName: OfflineCompositeEvidenceFixtureName;
  readonly sourceCompositeFixtureKind: OfflineCompositeEvidenceFixtureKind;
  readonly overallRiskBand: 'low' | 'moderate' | 'elevated' | 'high' | 'critical' | 'unknown';
  readonly overallQualityBand: 'low' | 'moderate' | 'high' | 'unknown';
  readonly overallConfidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly sourceCount: number;
  readonly sectionCount: number;
  readonly riskCount: number;
  readonly qualityCount: number;
  readonly confidenceCount: number;
  readonly dominantCategory: CompositeEvidenceWeighting['dominantCategory'];
  readonly nonAdvisory: true;
  readonly nonActionable: true;
  readonly safeToDisplay: true;
  readonly generatedAt: string;
  readonly notes: readonly string[];
}

export interface OfflineIntelligenceReportModel {
  readonly name: OfflineIntelligenceReportFixtureName;
  readonly kind: OfflineIntelligenceReportKind;
  readonly title: string;
  readonly sourceCompositeFixture: OfflineCompositeEvidenceFixture;
  readonly sections: readonly OfflineIntelligenceTypedReportSection[];
  readonly summary: OfflineIntelligenceReportSummary;
  readonly meta: OfflineIntelligenceReportMeta;
  readonly safeNotes: readonly string[];
}

export interface OfflineIntelligenceReportFixture {
  readonly name: OfflineIntelligenceReportFixtureName;
  readonly description: string;
  readonly report: OfflineIntelligenceReportModel;
}

export interface OfflineIntelligenceReportValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface OfflineIntelligenceReportValidationResult {
  readonly valid: boolean;
  readonly issues: readonly OfflineIntelligenceReportValidationIssue[];
}

export interface OfflineIntelligenceReportSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface OfflineIntelligenceReportBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly sourceCompositeFixture: OfflineCompositeEvidenceFixture | null | undefined;
  readonly title?: string | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface OfflineIntelligenceReportBuildResult {
  readonly success: boolean;
  readonly report: OfflineIntelligenceReportModel | null;
  readonly validation: OfflineIntelligenceReportValidationResult;
  readonly safety: OfflineIntelligenceReportSafetyResult;
}

export interface OfflineIntelligenceReportCapabilities {
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
}
