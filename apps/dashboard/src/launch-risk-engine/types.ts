/**
 * Phase 58 — Launch Risk Engine v1: types.
 *
 * Deterministic, synthetic, local-only, read-only, rule-based risk engine types.
 * Non-advisory, non-executing, non-networked. No wallet, no RPC, no paper simulation.
 */

import type {
  SyntheticEventStreamLifecycleStreamName,
} from '../synthetic-event-stream-lifecycle/types.js';
import type {
  SyntheticEventStreamReplayHarnessScenarioName,
} from '../synthetic-event-stream-replay-harness/types.js';

// ─── Phase / Version Constants ────────────────────────────────────────────────

export const LAUNCH_RISK_ENGINE_PHASE = 58 as const;

export const PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT =
  '2026-02-13T00:00:00.000Z' as const;

export const PHASE_58_LAUNCH_RISK_ENGINE_SOURCE =
  'phase58_launch_risk_engine_v1' as const;

export const PHASE_58_LAUNCH_RISK_ENGINE_VERSION = '1.0.0' as const;

export const PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION = '1.0.0' as const;

// ─── Assessment Names / Kinds ─────────────────────────────────────────────────

export const LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES = [
  'clean-launch-risk-assessment',
  'thin-liquidity-risk-assessment',
  'concentrated-holders-risk-assessment',
  'suspicious-creator-risk-assessment',
  'possible-bundle-cluster-risk-assessment',
  'metadata-incomplete-risk-assessment',
  'high-early-volume-risk-assessment',
  'safety-rejected-risk-assessment',
] as const;

export const LAUNCH_RISK_ENGINE_ASSESSMENT_KINDS = [
  'clean_launch_risk',
  'thin_liquidity_risk',
  'concentrated_holders_risk',
  'suspicious_creator_risk',
  'possible_bundle_cluster_risk',
  'metadata_incomplete_risk',
  'high_early_volume_risk',
  'safety_rejected_risk',
] as const;

export type LaunchRiskEngineAssessmentName =
  (typeof LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES)[number];

export type LaunchRiskEngineAssessmentKind =
  (typeof LAUNCH_RISK_ENGINE_ASSESSMENT_KINDS)[number];

// ─── Factor Kinds ─────────────────────────────────────────────────────────────

export const LAUNCH_RISK_FACTOR_KINDS = [
  'metadata_completeness_risk',
  'mint_authority_risk',
  'freeze_authority_risk',
  'thin_liquidity_risk',
  'liquidity_volatility_risk',
  'holder_concentration_risk',
  'creator_activity_risk',
  'wallet_cluster_risk',
  'early_volume_burst_risk',
  'bundle_like_pattern_risk',
  'replay_integrity_risk',
  'safety_rejection_risk',
] as const;

export type LaunchRiskFactorKind = (typeof LAUNCH_RISK_FACTOR_KINDS)[number];

// ─── Severity / Confidence ────────────────────────────────────────────────────

export const LAUNCH_RISK_SEVERITY_VALUES = [
  'none',
  'low',
  'moderate',
  'elevated',
  'high',
  'critical',
] as const;

export type LaunchRiskSeverity = (typeof LAUNCH_RISK_SEVERITY_VALUES)[number];

export const LAUNCH_RISK_CONFIDENCE_LABELS = [
  'high_confidence',
  'moderate_confidence',
  'low_confidence',
  'insufficient_evidence',
] as const;

export type LaunchRiskConfidenceLabel = (typeof LAUNCH_RISK_CONFIDENCE_LABELS)[number];

// ─── Risk Bands ───────────────────────────────────────────────────────────────

export const LAUNCH_RISK_BANDS = [
  'low',
  'moderate',
  'elevated',
  'high',
  'rejected',
] as const;

export type LaunchRiskBand = (typeof LAUNCH_RISK_BANDS)[number];

// ─── Assessment Status ────────────────────────────────────────────────────────

export type LaunchRiskAssessmentStatus =
  | 'assessed'
  | 'safety_rejected'
  | 'insufficient_evidence';

// ─── Core Interfaces ──────────────────────────────────────────────────────────

export interface LaunchRiskIdentity {
  readonly assessmentId: string;
  readonly assessmentName: LaunchRiskEngineAssessmentName;
  readonly assessmentKind: LaunchRiskEngineAssessmentKind;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly schemaVersion: typeof PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION;
  readonly deterministicSeed: string;
  readonly generatedAt: typeof PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT;
}

export interface LaunchRiskFactorOutput {
  readonly factorId: string;
  readonly factorKind: LaunchRiskFactorKind;
  readonly severity: LaunchRiskSeverity;
  readonly scoreContribution: number;
  readonly weight: number;
  readonly confidenceLabel: LaunchRiskConfidenceLabel;
  readonly reasonCode: string;
  readonly summary: string;
  readonly sourceLifecycleEventIds: readonly string[];
  readonly sourceReplaySnapshotIds: readonly string[];
  readonly evidenceReferenceIds: readonly string[];
  readonly safetyNotes: readonly string[];
}

export interface LaunchRiskThresholds {
  readonly low: number;
  readonly moderate: number;
  readonly elevated: number;
  readonly high: number;
  readonly rejected: number;
}

export interface LaunchRiskAssessment {
  readonly assessmentId: string;
  readonly assessmentStatus: LaunchRiskAssessmentStatus;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly totalRiskScore: number;
  readonly riskBand: LaunchRiskBand;
  readonly hardRejectionReasons: readonly string[];
  readonly softWarningReasons: readonly string[];
  readonly factorCount: number;
  readonly evidenceCount: number;
  readonly summary: string;
  readonly validationSummary: string;
  readonly safetySummary: string;
  readonly meta: {
    readonly generatedAt: typeof PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT;
    readonly source: typeof PHASE_58_LAUNCH_RISK_ENGINE_SOURCE;
    readonly schemaVersion: typeof PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION;
    readonly deterministic: true;
  };
}

export interface LaunchRiskEngineViewModel {
  readonly viewModelId: string;
  readonly assessmentName: LaunchRiskEngineAssessmentName;
  readonly assessmentKind: LaunchRiskEngineAssessmentKind;
  readonly assessmentStatus: LaunchRiskAssessmentStatus;
  readonly totalRiskScore: number;
  readonly riskBand: LaunchRiskBand;
  readonly factorCount: number;
  readonly hardRejectionCount: number;
  readonly softWarningCount: number;
  readonly nonAdvisorySummary: string;
}

export interface LaunchRiskEngineApiListContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'list';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT;
  readonly source: typeof PHASE_58_LAUNCH_RISK_ENGINE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureIds: readonly string[];
    readonly totalCount: number;
  };
}

export interface LaunchRiskEngineApiDetailContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'detail';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT;
  readonly source: typeof PHASE_58_LAUNCH_RISK_ENGINE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: LaunchRiskEngineViewModel;
}

export interface LaunchRiskEngineApiSummaryContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'summary';
  readonly statusCode: 200;
  readonly generatedAt: typeof PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT;
  readonly source: typeof PHASE_58_LAUNCH_RISK_ENGINE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly data: {
    readonly fixtureId: string;
    readonly riskBand: LaunchRiskBand;
    readonly totalRiskScore: number;
    readonly assessmentStatus: LaunchRiskAssessmentStatus;
    readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
    readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  };
}

export interface LaunchRiskEngineApiErrorContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly contractKind: 'error';
  readonly statusCode: 400 | 404;
  readonly generatedAt: typeof PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT;
  readonly source: typeof PHASE_58_LAUNCH_RISK_ENGINE_SOURCE;
  readonly fixtureOnly: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly errorCode:
    | 'LAUNCH_RISK_ENGINE_INVALID_REQUEST'
    | 'LAUNCH_RISK_ENGINE_NOT_FOUND';
  readonly message: string;
}

export interface LaunchRiskEngineApiContracts {
  readonly list: LaunchRiskEngineApiListContract;
  readonly detail: LaunchRiskEngineApiDetailContract;
  readonly summary: LaunchRiskEngineApiSummaryContract;
  readonly errors: readonly [
    LaunchRiskEngineApiErrorContract,
    LaunchRiskEngineApiErrorContract,
  ];
}

export interface LaunchRiskEngineSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: LaunchRiskEngineAssessmentName;
  readonly fixtureKind?: LaunchRiskEngineAssessmentKind;
  readonly riskBand?: LaunchRiskBand;
  readonly assessmentStatus?: LaunchRiskAssessmentStatus;
}

export interface LaunchRiskEngineSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: LaunchRiskEngineAssessmentKind;
  readonly matched: boolean;
  readonly source: 'synthetic_fixture_only';
}

export interface LaunchRiskEngineCapabilities {
  readonly launchRiskEngine: true;
  readonly launchRiskEngineFixtures: true;
  readonly deterministicLaunchRiskEngine: true;
  readonly localOnlyLaunchRiskEngine: true;
  readonly readOnlyLaunchRiskEngine: true;
  readonly fixtureDerivedLaunchRiskEngine: true;
  readonly ruleBasedLaunchRiskEngine: true;
  readonly launchRiskFactorOutputs: true;
  readonly launchRiskAssessments: true;
  readonly launchRiskThresholds: true;
  readonly launchRiskViewModels: true;
  readonly launchRiskApiContracts: true;
  readonly launchRiskSelectors: true;
  readonly launchRiskLiveData: false;
  readonly launchRiskNetworkAccess: false;
  readonly launchRiskRealProviders: false;
  readonly launchRiskProviderAdapters: false;
  readonly launchRiskSolanaRpc: false;
  readonly launchRiskWebSocketAccess: false;
  readonly launchRiskGeyserYellowstone: false;
  readonly launchRiskPumpFunIntegration: false;
  readonly launchRiskDexIntegration: false;
  readonly launchRiskJitoIntegration: false;
  readonly launchRiskPersistence: false;
  readonly launchRiskFilesystemWrites: false;
  readonly launchRiskDownloads: false;
  readonly launchRiskRouteHandlers: false;
  readonly launchRiskHttpServer: false;
  readonly launchRiskRuntimeRequests: false;
  readonly launchRiskUiRendering: false;
  readonly launchRiskDomAccess: false;
  readonly launchRiskBackgroundJobs: false;
  readonly launchRiskScheduledJobs: false;
  readonly launchRiskWalletLogic: false;
  readonly launchRiskPrivateKeyHandling: false;
  readonly launchRiskSigning: false;
  readonly launchRiskTransactionSending: false;
  readonly launchRiskExecution: false;
  readonly launchRiskTradingSignals: false;
  readonly launchRiskRecommendations: false;
  readonly launchRiskInvestmentAdvice: false;
  readonly launchRiskPaperSimulation: false;
  readonly launchRiskLiveExecution: false;
  readonly launchRiskStrategySelection: false;
}

export interface LaunchRiskEngineFixture {
  readonly fixtureId: string;
  readonly fixtureName: LaunchRiskEngineAssessmentName;
  readonly fixtureKind: LaunchRiskEngineAssessmentKind;
  readonly phase: typeof LAUNCH_RISK_ENGINE_PHASE;
  readonly schemaVersion: typeof PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION;
  readonly sourceLifecycleFixtureName: SyntheticEventStreamLifecycleStreamName;
  readonly sourceReplayFixtureName: SyntheticEventStreamReplayHarnessScenarioName;
  readonly riskIdentity: LaunchRiskIdentity;
  readonly factorOutputs: readonly LaunchRiskFactorOutput[];
  readonly thresholds: LaunchRiskThresholds;
  readonly assessment: LaunchRiskAssessment;
  readonly viewModel: LaunchRiskEngineViewModel;
  readonly apiContracts: LaunchRiskEngineApiContracts;
  readonly selectorExamples: readonly LaunchRiskEngineSelectorResult[];
  readonly capabilityFlags: LaunchRiskEngineCapabilities;
  readonly meta: {
    readonly generatedAt: typeof PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT;
    readonly source: typeof PHASE_58_LAUNCH_RISK_ENGINE_SOURCE;
    readonly version: typeof PHASE_58_LAUNCH_RISK_ENGINE_VERSION;
    readonly phase: typeof LAUNCH_RISK_ENGINE_PHASE;
    readonly deterministicSeed: string;
  };
  readonly safety: {
    readonly fixtureOnly: true;
    readonly localOnly: true;
    readonly readOnly: true;
    readonly noLiveData: true;
    readonly noNetworkAccess: true;
    readonly nonAdvisory: true;
    readonly notASignal: true;
  };
}

export interface BuildLaunchRiskEngineFixtureInput {
  readonly fixtureName: LaunchRiskEngineAssessmentName;
}

export interface LaunchRiskEngineValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface LaunchRiskEngineValidationResult {
  readonly valid: boolean;
  readonly issues: readonly LaunchRiskEngineValidationIssue[];
}

export interface LaunchRiskEngineSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}
