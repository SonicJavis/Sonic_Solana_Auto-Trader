/**
 * Phase 36 — Replay Outcome Fixture Models v1: types.
 */

import type {
  OfflineCompositeEvidenceFixtureKind,
  OfflineCompositeEvidenceFixtureName,
} from '../types.js';
import type {
  OfflineIntelligenceReportKind,
  OfflineIntelligenceReportFixtureName,
} from '../report-integration/types.js';

export const PHASE_36_REPLAY_OUTCOMES_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_36_REPLAY_OUTCOMES_SOURCE =
  'phase36_replay_outcome_fixture_models_v1';

export const PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_REFERENCE_NAMES = [
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

export type ReplayOutcomePhase35ReferenceName =
  (typeof PHASE_35_COMPOSITE_EVIDENCE_DASHBOARD_REPORT_FIXTURE_REFERENCE_NAMES)[number];

export const REPLAY_OUTCOME_FIXTURE_NAMES = [
  'avoided-high-risk-loss-outcome',
  'clean-low-risk-flat-outcome',
  'clean-low-risk-positive-outcome',
  'mixed-signal-watchlist-flat-outcome',
  'high-risk-false-positive-outcome',
  'high-risk-true-positive-outcome',
  'insufficient-data-skipped-outcome',
  'manipulation-risk-avoided-outcome',
  'wallet-risk-avoided-outcome',
  'creator-risk-avoided-outcome',
  'missed-opportunity-outcome',
  'drawdown-contained-outcome',
  'no-action-safety-outcome',
  'malformed-input-safe-outcome',
  'dashboard-ready-replay-outcome',
  'report-ready-replay-outcome',
] as const;

export type ReplayOutcomeFixtureName = (typeof REPLAY_OUTCOME_FIXTURE_NAMES)[number];

export const REPLAY_OUTCOME_FIXTURE_KINDS = [
  'avoided-high-risk-loss',
  'clean-low-risk-flat',
  'clean-low-risk-positive',
  'mixed-signal-watchlist-flat',
  'high-risk-false-positive',
  'high-risk-true-positive',
  'insufficient-data-skipped',
  'manipulation-risk-avoided',
  'wallet-risk-avoided',
  'creator-risk-avoided',
  'missed-opportunity',
  'drawdown-contained',
  'no-action-safety',
  'malformed-input-safe',
  'dashboard-ready',
  'report-ready',
] as const;

export type ReplayOutcomeFixtureKind = (typeof REPLAY_OUTCOME_FIXTURE_KINDS)[number];

export interface ReplayOutcomeScenarioReference {
  readonly phase33CompositeFixtureName: OfflineCompositeEvidenceFixtureName;
  readonly phase33CompositeFixtureKind: OfflineCompositeEvidenceFixtureKind;
  readonly phase34ReportFixtureName: OfflineIntelligenceReportFixtureName;
  readonly phase34ReportFixtureKind: OfflineIntelligenceReportKind;
  readonly phase35DashboardReportFixtureName: ReplayOutcomePhase35ReferenceName;
  readonly sourceCount: 3;
  readonly notes: readonly string[];
}

export interface ReplayOutcomeEntryObservation {
  readonly observationId: string;
  readonly syntheticDecision: 'observe' | 'watchlist' | 'skip';
  readonly safetyGateStatus: 'passed' | 'blocked' | 'unknown';
  readonly confidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly notes: readonly string[];
}

export interface ReplayOutcomeExitObservation {
  readonly observationId: string;
  readonly syntheticResult: 'flat' | 'positive' | 'negative-avoided' | 'drawdown-contained' | 'skipped';
  readonly durationBucket: 'instant' | 'short' | 'medium' | 'long' | 'unknown';
  readonly closureReason:
    | 'risk-avoidance'
    | 'quality-confirmed'
    | 'insufficient-data'
    | 'safety-boundary'
    | 'watchlist-hold'
    | 'malformed-safe'
    | 'no-action';
  readonly notes: readonly string[];
}

export interface ReplayOutcomeSyntheticObservation {
  readonly outcomeCategory:
    | 'positive'
    | 'flat'
    | 'risk-avoided'
    | 'skipped'
    | 'missed-opportunity'
    | 'drawdown-contained'
    | 'safety-no-action';
  readonly entry: ReplayOutcomeEntryObservation;
  readonly exit: ReplayOutcomeExitObservation;
  readonly notes: readonly string[];
}

export interface ReplayOutcomeRiskIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high' | 'critical';
  readonly category: 'creator' | 'wallet-cluster' | 'manipulation' | 'composite' | 'outcome';
  readonly rationale: string;
}

export interface ReplayOutcomeQualityIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high';
  readonly category: 'creator' | 'wallet-cluster' | 'manipulation' | 'composite' | 'outcome';
  readonly rationale: string;
}

export interface ReplayOutcomeSummary {
  readonly phase: 36;
  readonly name: ReplayOutcomeFixtureName;
  readonly kind: ReplayOutcomeFixtureKind;
  readonly outcomeCategory: ReplayOutcomeSyntheticObservation['outcomeCategory'];
  readonly syntheticOutcomeBand: 'safe-positive' | 'safe-flat' | 'risk-avoided' | 'skipped' | 'watchlist' | 'contained';
  readonly observedDirection: 'upside-observed' | 'flat-observed' | 'risk-avoided' | 'no-action';
  readonly outcomeConfidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly riskCount: number;
  readonly qualityCount: number;
  readonly topRiskCodes: readonly string[];
  readonly topQualityCodes: readonly string[];
  readonly sourceCount: 3;
  readonly referencedPhase33CompositeFixtureName: OfflineCompositeEvidenceFixtureName;
  readonly referencedPhase34ReportFixtureName: OfflineIntelligenceReportFixtureName;
  readonly referencedPhase35DashboardReportFixtureName: ReplayOutcomePhase35ReferenceName;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly liveData: false;
  readonly realReplay: false;
  readonly realBacktesting: false;
  readonly paperTrading: false;
  readonly liveTrading: false;
  readonly execution: false;
  readonly nonAdvisory: true;
  readonly nonAccusatory: true;
  readonly safeToDisplay: true;
  readonly generatedAt: string;
  readonly notes: readonly string[];
}

export interface ReplayOutcomeFixtureMeta {
  readonly phase: 36;
  readonly generatedAt: string;
  readonly source: typeof PHASE_36_REPLAY_OUTCOMES_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly inMemoryOnly: true;
  readonly liveData: false;
  readonly realReplay: false;
  readonly realBacktesting: false;
  readonly paperTrading: false;
  readonly liveTrading: false;
  readonly execution: false;
  readonly externalNetwork: false;
  readonly persistence: false;
  readonly fileExport: false;
  readonly nonAdvisory: true;
  readonly nonAccusatory: true;
  readonly notes: readonly string[];
}

export interface ReplayOutcomeFixture {
  readonly name: ReplayOutcomeFixtureName;
  readonly kind: ReplayOutcomeFixtureKind;
  readonly scenarioReference: ReplayOutcomeScenarioReference;
  readonly observation: ReplayOutcomeSyntheticObservation;
  readonly riskIndicators: readonly ReplayOutcomeRiskIndicator[];
  readonly qualityIndicators: readonly ReplayOutcomeQualityIndicator[];
  readonly summary: ReplayOutcomeSummary;
  readonly safeNotes: readonly string[];
  readonly meta: ReplayOutcomeFixtureMeta;
}

export interface ReplayOutcomeValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface ReplayOutcomeValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ReplayOutcomeValidationIssue[];
}

export interface ReplayOutcomeSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface ReplayOutcomeBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly scenarioReference: ReplayOutcomeScenarioReference;
  readonly observation: ReplayOutcomeSyntheticObservation;
  readonly riskIndicators?: readonly ReplayOutcomeRiskIndicator[] | null;
  readonly qualityIndicators?: readonly ReplayOutcomeQualityIndicator[] | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface ReplayOutcomeBuildResult {
  readonly success: boolean;
  readonly fixture: ReplayOutcomeFixture | null;
  readonly validation: ReplayOutcomeValidationResult;
  readonly safety: ReplayOutcomeSafetyResult;
}

export interface ReplayOutcomeFixtureCapabilities {
  readonly replayOutcomeFixtures: true;
  readonly syntheticReplayOutcomes: true;
  readonly replayOutcomeBuilders: true;
  readonly replayOutcomeSafetyValidation: true;
  readonly replayOutcomeCompositeEvidenceReferences: true;
  readonly replayOutcomeReportReferences: true;
  readonly replayOutcomeDashboardReferences: true;
  readonly replayOutcomeLiveData: false;
  readonly replayOutcomeRealBacktesting: false;
  readonly replayOutcomePaperTrading: false;
  readonly replayOutcomeLiveTrading: false;
  readonly replayOutcomeExecution: false;
  readonly replayOutcomeSolanaRpc: false;
  readonly replayOutcomeExternalNetwork: false;
  readonly replayOutcomePersistence: false;
  readonly replayOutcomeFileExport: false;
  readonly replayOutcomeInvestmentAdvice: false;
  readonly replayOutcomeTradingSignals: false;
}
