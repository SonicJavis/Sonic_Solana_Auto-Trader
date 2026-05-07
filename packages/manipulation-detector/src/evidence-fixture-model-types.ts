/**
 * Phase 32 — Bundle / Manipulation Evidence Fixture Models v1: fixture model types.
 *
 * Local-only, synthetic-only, deterministic fixture contracts for future offline
 * market-integrity analysis. This layer is fixture-backed only and does not
 * inspect live transactions, mempools, providers, or wallets.
 */

import type { CreatorIntelligenceFixtureName } from '@sonic/creator-intelligence';
import type { WalletClusterIntelligenceFixtureName } from '@sonic/wallet-intelligence';

export const PHASE_32_MANIPULATION_EVIDENCE_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_32_MANIPULATION_EVIDENCE_SOURCE =
  'phase32_bundle_manipulation_evidence_fixture_models_v1';

export const MANIPULATION_EVIDENCE_FIXTURE_NAMES = [
  'clean-organic-launch-evidence',
  'mild-concentration-watchlist-evidence',
  'same-block-bundle-like-concentration-evidence',
  'coordinated-early-buy-pattern-evidence',
  'coordinated-early-sell-pattern-evidence',
  'fresh-wallet-burst-pattern-evidence',
  'same-funding-source-synthetic-evidence',
  'staged-liquidity-pull-risk-pattern-evidence',
  'creator-linked-concentration-pattern-evidence',
  'bot-noise-false-positive-pattern-evidence',
  'benign-high-activity-launch-pattern-evidence',
  'high-risk-manipulation-evidence',
  'mixed-signal-manipulation-evidence',
  'malformed-input-safe-evidence',
  'safety-boundary-evidence',
  'unknown-insufficient-data-evidence',
] as const;

export type ManipulationEvidenceFixtureName =
  (typeof MANIPULATION_EVIDENCE_FIXTURE_NAMES)[number];

export const MANIPULATION_EVIDENCE_FIXTURE_KINDS = [
  'organic-launch',
  'concentration-watchlist',
  'bundle-like-concentration',
  'coordinated-early-buy',
  'coordinated-early-sell',
  'fresh-wallet-burst',
  'same-funding-source',
  'staged-liquidity-pull-risk',
  'creator-linked-concentration',
  'bot-noise-false-positive',
  'benign-high-activity',
  'high-risk-manipulation',
  'mixed-signal',
  'malformed-safe',
  'safety-boundary',
  'unknown-insufficient-data',
] as const;

export type ManipulationEvidenceFixtureKind =
  (typeof MANIPULATION_EVIDENCE_FIXTURE_KINDS)[number];

export interface ManipulationEvidenceFixtureCapabilities {
  readonly manipulationEvidenceFixtures: true;
  readonly syntheticBundleEvidence: true;
  readonly syntheticLaunchStructureEvidence: true;
  readonly syntheticLiquidityPatternEvidence: true;
  readonly syntheticCoordinationEvidence: true;
  readonly manipulationRiskIndicators: true;
  readonly manipulationQualityIndicators: true;
  readonly manipulationEvidenceSafetyValidation: true;
  readonly manipulationLiveData: false;
  readonly manipulationSolanaRpc: false;
  readonly manipulationProviderApis: false;
  readonly manipulationJitoIntegration: false;
  readonly manipulationMempoolAccess: false;
  readonly manipulationTradingSignals: false;
  readonly manipulationInvestmentAdvice: false;
  readonly manipulationExternalNetwork: false;
  readonly manipulationPersistence: false;
  readonly manipulationExecution: false;
}

export interface BundlePatternFixture {
  readonly pattern:
    | 'organic'
    | 'watchlist-concentration'
    | 'bundle-like-concentration'
    | 'benign-high-activity'
    | 'unknown';
  readonly sameBlockBand: 'none' | 'low' | 'moderate' | 'high' | 'extreme' | 'unknown';
  readonly bundleLikelihood: 'none' | 'watchlist' | 'elevated' | 'high' | 'unknown';
  readonly participationBand: 'small' | 'medium' | 'large' | 'unknown';
  readonly notes: readonly string[];
}

export interface LaunchStructureEvidenceFixture {
  readonly launchShape:
    | 'organic'
    | 'concentrated'
    | 'coordinated-early-buy'
    | 'coordinated-early-sell'
    | 'unknown';
  readonly allocationBand: 'broad' | 'mixed' | 'narrow' | 'unknown';
  readonly buyerDiversityBand: 'diverse' | 'mixed' | 'concentrated' | 'unknown';
  readonly openingWindowBand: 'calm' | 'active' | 'bursty' | 'layered' | 'unknown';
  readonly notes: readonly string[];
}

export interface LiquidityPatternEvidenceFixture {
  readonly liquidityState: 'stable' | 'watchlist' | 'staged-pull-risk' | 'high-risk' | 'unknown';
  readonly withdrawalPattern: 'none' | 'incremental' | 'staged' | 'abrupt' | 'unknown';
  readonly supportBand: 'stable' | 'mixed' | 'fragile' | 'unknown';
  readonly notes: readonly string[];
}

export interface CoordinationEvidenceFixture {
  readonly coordinationType:
    | 'organic'
    | 'early-buy'
    | 'early-sell'
    | 'funding-linked'
    | 'creator-linked'
    | 'bot-noise'
    | 'unknown';
  readonly intensity: 'none' | 'low' | 'moderate' | 'high' | 'critical' | 'unknown';
  readonly synchronization: 'none' | 'loose' | 'clustered' | 'tight' | 'layered' | 'unknown';
  readonly participantFreshness: 'established' | 'mixed' | 'fresh' | 'unknown';
  readonly notes: readonly string[];
}

export interface DistributionConcentrationFixture {
  readonly concentrationType:
    | 'launch-allocation'
    | 'early-buys'
    | 'early-sells'
    | 'holder-distribution'
    | 'unknown';
  readonly concentrationBand: 'low' | 'moderate' | 'high' | 'extreme' | 'unknown';
  readonly distributionSpread: 'broad' | 'mixed' | 'narrow' | 'unknown';
  readonly suspectedCreatorLink: 'none' | 'possible' | 'strong' | 'unknown';
  readonly notes: readonly string[];
}

export interface FundingPatternEvidenceFixture {
  readonly fundingType:
    | 'diverse'
    | 'same-source'
    | 'fresh-wallet-burst'
    | 'creator-linked'
    | 'unknown';
  readonly linkageBand: 'none' | 'partial' | 'clustered' | 'strong' | 'unknown';
  readonly freshnessBand: 'established' | 'mixed' | 'fresh' | 'unknown';
  readonly provenanceClarity:
    | 'clear-synthetic'
    | 'bounded-synthetic'
    | 'uncertain-synthetic'
    | 'unknown';
  readonly notes: readonly string[];
}

export interface ManipulationRiskIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'medium' | 'high' | 'critical';
  readonly rationale: string;
}

export interface ManipulationQualityIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high';
  readonly rationale: string;
}

export interface ManipulationEvidenceCrossReferenceInput {
  readonly creatorFixtureName?: CreatorIntelligenceFixtureName;
  readonly walletClusterFixtureName?: WalletClusterIntelligenceFixtureName;
  readonly sharedSignals?: readonly string[] | null;
  readonly cautionNotes?: readonly string[] | null;
}

export interface ManipulationEvidenceCrossReferenceSummary {
  readonly creatorFixtureName?: CreatorIntelligenceFixtureName;
  readonly walletClusterFixtureName?: WalletClusterIntelligenceFixtureName;
  readonly referenceStatus: 'none' | 'creator-only' | 'wallet-only' | 'creator-and-wallet';
  readonly sharedSignals: readonly string[];
  readonly cautionNotes: readonly string[];
  readonly generatedAt: string;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly nonAdvisory: true;
}

export interface ManipulationEvidenceFixtureMeta {
  readonly phase: 32;
  readonly generatedAt: string;
  readonly source: typeof PHASE_32_MANIPULATION_EVIDENCE_SOURCE;
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

export interface ManipulationEvidenceSummary {
  readonly phase: 32;
  readonly name: ManipulationEvidenceFixtureName;
  readonly kind: ManipulationEvidenceFixtureKind;
  readonly signalBalance:
    | 'quality-dominant'
    | 'risk-dominant'
    | 'balanced'
    | 'insufficient-data';
  readonly bundleRiskAssessment: 'none' | 'watchlist' | 'elevated' | 'high' | 'unknown';
  readonly coordinationAssessment: 'none' | 'low' | 'watchlist' | 'high' | 'unknown';
  readonly liquidityAssessment: 'stable' | 'watchlist' | 'staged-risk' | 'high-risk' | 'unknown';
  readonly concentrationAssessment: 'low' | 'moderate' | 'high' | 'extreme' | 'unknown';
  readonly fundingAssessment: 'diverse' | 'mixed' | 'linked' | 'unknown';
  readonly falsePositiveRisk: 'low' | 'moderate' | 'high' | 'unknown';
  readonly dataCompleteness: 'complete' | 'partial' | 'insufficient';
  readonly qualityCount: number;
  readonly riskCount: number;
  readonly topQualityCodes: readonly string[];
  readonly topRiskCodes: readonly string[];
  readonly referencedCreatorFixtureName?: CreatorIntelligenceFixtureName;
  readonly referencedWalletClusterFixtureName?: WalletClusterIntelligenceFixtureName;
  readonly generatedAt: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly nonAdvisory: true;
  readonly safeToDisplay: true;
  readonly notes: readonly string[];
}

export interface ManipulationEvidenceFixture {
  readonly name: ManipulationEvidenceFixtureName;
  readonly kind: ManipulationEvidenceFixtureKind;
  readonly bundlePattern: BundlePatternFixture;
  readonly launchStructure: LaunchStructureEvidenceFixture;
  readonly liquidityPattern: LiquidityPatternEvidenceFixture;
  readonly coordination: CoordinationEvidenceFixture;
  readonly distribution: DistributionConcentrationFixture;
  readonly fundingPattern: FundingPatternEvidenceFixture;
  readonly riskIndicators: readonly ManipulationRiskIndicator[];
  readonly qualityIndicators: readonly ManipulationQualityIndicator[];
  readonly summary: ManipulationEvidenceSummary;
  readonly crossReferenceSummary: ManipulationEvidenceCrossReferenceSummary;
  readonly safeNotes: readonly string[];
  readonly meta: ManipulationEvidenceFixtureMeta;
}

export interface ManipulationEvidenceValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ManipulationEvidenceValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ManipulationEvidenceValidationIssue[];
}

export interface ManipulationEvidenceSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface ManipulationEvidenceBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly bundlePattern: BundlePatternFixture;
  readonly launchStructure: LaunchStructureEvidenceFixture;
  readonly liquidityPattern: LiquidityPatternEvidenceFixture;
  readonly coordination: CoordinationEvidenceFixture;
  readonly distribution: DistributionConcentrationFixture;
  readonly fundingPattern: FundingPatternEvidenceFixture;
  readonly riskIndicators?: readonly ManipulationRiskIndicator[] | null;
  readonly qualityIndicators?: readonly ManipulationQualityIndicator[] | null;
  readonly crossReferences?: ManipulationEvidenceCrossReferenceInput | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface ManipulationEvidenceBuildResult {
  readonly success: boolean;
  readonly fixture: ManipulationEvidenceFixture | null;
  readonly validation: ManipulationEvidenceValidationResult;
  readonly safety: ManipulationEvidenceSafetyResult;
}
