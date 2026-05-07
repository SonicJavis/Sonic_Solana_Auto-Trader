/**
 * Phase 31 — Wallet Cluster Fixture Models v1: fixture model types.
 *
 * Local-only, synthetic-only, deterministic fixture contracts for wallet
 * cluster intelligence work.
 */

import type { WalletClusterType } from './wallet-cluster.js';

export const PHASE_31_WALLET_CLUSTER_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_31_WALLET_CLUSTER_SOURCE = 'phase31_wallet_cluster_fixture_models_v1';

export const WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES = [
  'benign-low-activity-cluster',
  'bot-noise-cluster',
  'coordinated-sell-risk-cluster',
  'creator-linked-cluster',
  'fast-dump-risk-cluster',
  'fresh-wallet-farm-cluster',
  'high-quality-smart-accumulator-cluster',
  'high-risk-multi-signal-cluster',
  'known-rug-cluster',
  'low-signal-unknown-cluster',
  'malformed-input-safe-cluster',
  'mixed-signal-cluster',
  'profitable-leader-cluster',
  'safety-boundary-cluster',
  'same-funding-source-cluster',
] as const;

export type WalletClusterIntelligenceFixtureName =
  (typeof WALLET_CLUSTER_INTELLIGENCE_FIXTURE_NAMES)[number];

export const WALLET_CLUSTER_INTELLIGENCE_FIXTURE_KINDS = [
  'smart-accumulator',
  'profitable-leader',
  'fast-dumper',
  'fresh-wallet-farm',
  'creator-linked',
  'same-funding-source',
  'bot-noise',
  'known-rug',
  'unknown',
  'coordinated-sell-risk',
  'mixed-signal',
  'safety-boundary',
  'high-risk-multi',
  'benign-low-activity',
  'malformed-safe',
] as const;

export type WalletClusterIntelligenceFixtureKind =
  (typeof WALLET_CLUSTER_INTELLIGENCE_FIXTURE_KINDS)[number];

export interface WalletClusterFixtureModelCapabilities {
  readonly walletClusterIntelligenceFixtures: true;
  readonly syntheticWalletClusters: true;
  readonly walletClusterSignalFixtures: true;
  readonly walletClusterRiskIndicators: true;
  readonly walletClusterQualityIndicators: true;
  readonly walletClusterFixtureSafetyValidation: true;
  readonly walletClusterLiveData: false;
  readonly walletClusterChainAccess: false;
  readonly walletClusterRpcAccess: false;
  readonly walletClusterIdentityResolution: false;
  readonly walletClusterInvestmentAdvice: false;
  readonly walletClusterTradingSignals: false;
  readonly walletClusterExternalNetwork: false;
  readonly walletClusterPersistence: false;
}

export interface WalletClusterFixtureProfile {
  readonly clusterId: string;
  readonly clusterType: WalletClusterType;
  readonly displayLabel: string;
  readonly sizeBand: 'tiny' | 'small' | 'medium' | 'large' | 'unknown';
  readonly ageBand: 'new' | 'recent' | 'established' | 'unknown';
  readonly coordinationBand: 'none' | 'low' | 'moderate' | 'high' | 'unknown';
}

export interface WalletClusterSignalFixture {
  readonly signalType:
    | 'coordination'
    | 'funding-source'
    | 'creator-link'
    | 'fresh-wallet'
    | 'dump-pattern'
    | 'leader-follower'
    | 'bot-noise'
    | 'unknown';
  readonly intensity: 'low' | 'moderate' | 'high' | 'unknown';
  readonly pattern:
    | 'clustered'
    | 'distributed'
    | 'sporadic'
    | 'synchronized'
    | 'unknown';
  readonly notes: readonly string[];
}

export interface WalletClusterHistoryFixture {
  readonly observedLaunchCount: number;
  readonly averageHoldTimeBand: 'very-short' | 'short' | 'medium' | 'long' | 'unknown';
  readonly profitabilityBand: 'low' | 'moderate' | 'high' | 'unknown';
  readonly dumpSpeedBand: 'slow' | 'moderate' | 'fast' | 'very-fast' | 'unknown';
  readonly notes: readonly string[];
}

export interface WalletClusterRiskIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'medium' | 'high' | 'critical';
  readonly rationale: string;
}

export interface WalletClusterQualityIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high';
  readonly rationale: string;
}

export interface WalletClusterIntelligenceFixtureMeta {
  readonly phase: 31;
  readonly generatedAt: string;
  readonly source: typeof PHASE_31_WALLET_CLUSTER_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly persistence: false;
  readonly deterministic: true;
  readonly readOnly: true;
  readonly nonAdvisory: true;
  readonly notes: readonly string[];
}

export interface WalletClusterIntelligenceSummary {
  readonly phase: 31;
  readonly name: WalletClusterIntelligenceFixtureName;
  readonly kind: WalletClusterIntelligenceFixtureKind;
  readonly clusterId: string;
  readonly signalBalance:
    | 'quality-dominant'
    | 'risk-dominant'
    | 'balanced'
    | 'insufficient-data';
  readonly riskAssessment: 'low' | 'moderate' | 'high' | 'critical' | 'unknown';
  readonly coordinationAssessment: 'none' | 'low' | 'suspicious' | 'high' | 'unknown';
  readonly dumpRiskAssessment: 'none' | 'low' | 'moderate' | 'high' | 'unknown';
  readonly dataCompleteness: 'complete' | 'partial' | 'insufficient';
  readonly qualityCount: number;
  readonly riskCount: number;
  readonly topQualityCodes: readonly string[];
  readonly topRiskCodes: readonly string[];
  readonly generatedAt: string;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly externalNetwork: false;
  readonly nonAdvisory: true;
  readonly safeToDisplay: true;
  readonly notes: readonly string[];
}

export interface WalletClusterIntelligenceFixture {
  readonly name: WalletClusterIntelligenceFixtureName;
  readonly kind: WalletClusterIntelligenceFixtureKind;
  readonly profile: WalletClusterFixtureProfile;
  readonly signals: readonly WalletClusterSignalFixture[];
  readonly history: WalletClusterHistoryFixture;
  readonly riskIndicators: readonly WalletClusterRiskIndicator[];
  readonly qualityIndicators: readonly WalletClusterQualityIndicator[];
  readonly summary: WalletClusterIntelligenceSummary;
  readonly safeNotes: readonly string[];
  readonly meta: WalletClusterIntelligenceFixtureMeta;
}

export interface WalletClusterIntelligenceValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface WalletClusterIntelligenceValidationResult {
  readonly valid: boolean;
  readonly issues: readonly WalletClusterIntelligenceValidationIssue[];
}

export interface WalletClusterIntelligenceSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface WalletClusterIntelligenceBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly profile: WalletClusterFixtureProfile;
  readonly history: WalletClusterHistoryFixture;
  readonly signals?: readonly WalletClusterSignalFixture[] | null;
  readonly riskIndicators?: readonly WalletClusterRiskIndicator[] | null;
  readonly qualityIndicators?: readonly WalletClusterQualityIndicator[] | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface WalletClusterIntelligenceBuildResult {
  readonly success: boolean;
  readonly fixture: WalletClusterIntelligenceFixture | null;
  readonly validation: WalletClusterIntelligenceValidationResult;
  readonly safety: WalletClusterIntelligenceSafetyResult;
}
