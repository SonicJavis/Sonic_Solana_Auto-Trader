/**
 * Phase 33 — Offline Intelligence Composite Evidence Models v1: types.
 *
 * Local-only, synthetic-only, deterministic fixture contracts for future offline
 * composite intelligence analysis. Combines synthetic creator, wallet-cluster, and
 * manipulation evidence references into composite offline intelligence fixtures.
 *
 * This layer is fixture-backed only and does not inspect live data, transactions,
 * mempools, providers, wallets, or any external sources.
 */

import type { CreatorIntelligenceFixtureName } from '@sonic/creator-intelligence';
import type { WalletClusterIntelligenceFixtureName } from '@sonic/wallet-intelligence';
import type { ManipulationEvidenceFixtureName } from '@sonic/manipulation-detector';

export const PHASE_33_COMPOSITE_EVIDENCE_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_33_COMPOSITE_EVIDENCE_SOURCE =
  'phase33_offline_intelligence_composite_evidence_models_v1';

export const OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES = [
  'clean-low-risk-composite',
  'creator-credible-wallet-benign-composite',
  'creator-unknown-wallet-low-signal-composite',
  'creator-risk-wallet-risk-composite',
  'manipulation-risk-dominates-composite',
  'wallet-cluster-risk-dominates-composite',
  'creator-risk-dominates-composite',
  'mixed-signal-watchlist-composite',
  'false-positive-protected-composite',
  'insufficient-data-composite',
  'high-risk-multi-evidence-composite',
  'safety-boundary-composite',
  'malformed-input-safe-composite',
  'no-action-non-advisory-composite',
  'report-ready-composite',
  'dashboard-ready-composite',
] as const;

export type OfflineCompositeEvidenceFixtureName =
  (typeof OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_NAMES)[number];

export const OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS = [
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
  'malformed-safe',
  'no-action-non-advisory',
  'report-ready',
  'dashboard-ready',
] as const;

export type OfflineCompositeEvidenceFixtureKind =
  (typeof OFFLINE_COMPOSITE_EVIDENCE_FIXTURE_KINDS)[number];

export interface OfflineCompositeEvidenceFixtureCapabilities {
  readonly compositeEvidenceFixtures: true;
  readonly syntheticCompositeEvidence: true;
  readonly compositeCreatorEvidenceRefs: true;
  readonly compositeWalletClusterEvidenceRefs: true;
  readonly compositeManipulationEvidenceRefs: true;
  readonly compositeEvidenceWeighting: true;
  readonly compositeRiskIndicators: true;
  readonly compositeQualityIndicators: true;
  readonly compositeConfidenceIndicators: true;
  readonly compositeEvidenceSafetyValidation: true;
  readonly compositeLiveData: false;
  readonly compositeTradingSignals: false;
  readonly compositeInvestmentAdvice: false;
  readonly compositeExternalNetwork: false;
  readonly compositePersistence: false;
  readonly compositeExecution: false;
}

export interface CompositeCreatorEvidenceReference {
  readonly creatorFixtureName: CreatorIntelligenceFixtureName;
  readonly creatorRiskLevel: 'low' | 'medium' | 'high' | 'unknown';
  readonly credibilityBand: 'credible' | 'moderate' | 'poor' | 'unknown';
  readonly notes: readonly string[];
}

export interface CompositeWalletClusterEvidenceReference {
  readonly walletClusterFixtureName: WalletClusterIntelligenceFixtureName;
  readonly clusterRiskLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  readonly qualityBand: 'high' | 'moderate' | 'low' | 'unknown';
  readonly notes: readonly string[];
}

export interface CompositeManipulationEvidenceReference {
  readonly manipulationEvidenceFixtureName: ManipulationEvidenceFixtureName;
  readonly manipulationRiskLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  readonly bundleRiskBand: 'none' | 'watchlist' | 'elevated' | 'high' | 'unknown';
  readonly notes: readonly string[];
}

export interface CompositeEvidenceSourceReference {
  readonly creator: CompositeCreatorEvidenceReference | null;
  readonly walletCluster: CompositeWalletClusterEvidenceReference | null;
  readonly manipulation: CompositeManipulationEvidenceReference | null;
  readonly sourceCount: number;
  readonly notes: readonly string[];
}

export interface CompositeRiskIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'medium' | 'high' | 'critical';
  readonly sourceCategory: 'creator' | 'wallet-cluster' | 'manipulation' | 'composite';
  readonly rationale: string;
}

export interface CompositeQualityIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high';
  readonly sourceCategory: 'creator' | 'wallet-cluster' | 'manipulation' | 'composite';
  readonly rationale: string;
}

export interface CompositeConfidenceIndicator {
  readonly code: string;
  readonly label: string;
  readonly confidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly evidenceCount: number;
  readonly rationale: string;
}

export interface CompositeEvidenceWeighting {
  readonly creatorWeight: 'none' | 'low' | 'moderate' | 'high';
  readonly walletClusterWeight: 'none' | 'low' | 'moderate' | 'high';
  readonly manipulationWeight: 'none' | 'low' | 'moderate' | 'high';
  readonly dominantCategory: 'creator' | 'wallet-cluster' | 'manipulation' | 'balanced' | 'none';
  readonly notes: readonly string[];
}

export interface CompositeEvidenceSummary {
  readonly phase: 33;
  readonly name: OfflineCompositeEvidenceFixtureName;
  readonly kind: OfflineCompositeEvidenceFixtureKind;
  readonly overallRiskBand: 'low' | 'moderate' | 'elevated' | 'high' | 'critical' | 'unknown';
  readonly overallQualityBand: 'low' | 'moderate' | 'high' | 'unknown';
  readonly overallConfidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly signalBalance: 'quality-dominant' | 'risk-dominant' | 'balanced' | 'insufficient-data';
  readonly creatorAssessment: 'credible' | 'moderate' | 'risk' | 'unknown' | 'not-referenced';
  readonly walletClusterAssessment: 'benign' | 'watchlist' | 'risk' | 'unknown' | 'not-referenced';
  readonly manipulationAssessment: 'clean' | 'watchlist' | 'elevated' | 'high-risk' | 'unknown' | 'not-referenced';
  readonly falsePositiveRisk: 'low' | 'moderate' | 'high' | 'unknown';
  readonly dataCompleteness: 'complete' | 'partial' | 'insufficient';
  readonly riskCount: number;
  readonly qualityCount: number;
  readonly confidenceCount: number;
  readonly topRiskCodes: readonly string[];
  readonly topQualityCodes: readonly string[];
  readonly referencedCreatorFixtureName?: CreatorIntelligenceFixtureName;
  readonly referencedWalletClusterFixtureName?: WalletClusterIntelligenceFixtureName;
  readonly referencedManipulationFixtureName?: ManipulationEvidenceFixtureName;
  readonly generatedAt: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly nonAdvisory: true;
  readonly safeToDisplay: true;
  readonly notes: readonly string[];
}

export interface OfflineCompositeEvidenceFixtureMeta {
  readonly phase: 33;
  readonly generatedAt: string;
  readonly source: typeof PHASE_33_COMPOSITE_EVIDENCE_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly persistence: false;
  readonly deterministic: true;
  readonly readOnly: true;
  readonly nonAdvisory: true;
  readonly nonAccusatory: true;
  readonly notes: readonly string[];
}

export interface OfflineCompositeEvidenceFixture {
  readonly name: OfflineCompositeEvidenceFixtureName;
  readonly kind: OfflineCompositeEvidenceFixtureKind;
  readonly sourceReferences: CompositeEvidenceSourceReference;
  readonly riskIndicators: readonly CompositeRiskIndicator[];
  readonly qualityIndicators: readonly CompositeQualityIndicator[];
  readonly confidenceIndicators: readonly CompositeConfidenceIndicator[];
  readonly weighting: CompositeEvidenceWeighting;
  readonly summary: CompositeEvidenceSummary;
  readonly safeNotes: readonly string[];
  readonly meta: OfflineCompositeEvidenceFixtureMeta;
}

export interface CompositeEvidenceValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface CompositeEvidenceValidationResult {
  readonly valid: boolean;
  readonly issues: readonly CompositeEvidenceValidationIssue[];
}

export interface CompositeEvidenceSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface CompositeEvidenceBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly sourceReferences: CompositeEvidenceSourceReference;
  readonly riskIndicators?: readonly CompositeRiskIndicator[] | null;
  readonly qualityIndicators?: readonly CompositeQualityIndicator[] | null;
  readonly confidenceIndicators?: readonly CompositeConfidenceIndicator[] | null;
  readonly weighting?: CompositeEvidenceWeighting | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface CompositeEvidenceBuildResult {
  readonly success: boolean;
  readonly fixture: OfflineCompositeEvidenceFixture | null;
  readonly validation: CompositeEvidenceValidationResult;
  readonly safety: CompositeEvidenceSafetyResult;
}
