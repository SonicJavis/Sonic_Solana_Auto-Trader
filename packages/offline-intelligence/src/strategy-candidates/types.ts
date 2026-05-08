/**
 * Phase 38 — Strategy Candidate Evaluation Fixtures v1: types.
 *
 * Local-only, synthetic-only, deterministic fixture-backed strategy candidate evaluation
 * models referenced to Phase 37 score-band outcome fixtures.
 */

import type {
  ScoreBandCategory,
  ScoreBandOutcomeAnalysisFixtureKind,
  ScoreBandOutcomeAnalysisFixtureName,
} from '../score-band-outcomes/types.js';
import type { ReplayOutcomeFixtureName } from '../replay-outcomes/types.js';

export const PHASE_38_STRATEGY_CANDIDATES_GENERATED_AT = '2026-01-01T00:00:00.000Z';
export const PHASE_38_STRATEGY_CANDIDATES_SOURCE =
  'phase38_strategy_candidate_evaluation_fixtures_v1';

export const STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES = [
  'defensive-new-launch-candidate',
  'creator-leaderboard-candidate',
  'wallet-leader-copy-candidate',
  'post-bundle-dip-candidate',
  'no-action-safety-candidate',
  'manipulation-avoidance-candidate',
  'insufficient-data-candidate',
  'high-score-positive-candidate',
  'high-score-false-positive-candidate',
  'missed-opportunity-candidate',
  'drawdown-contained-candidate',
  'mixed-signal-watchlist-candidate',
  'malformed-input-safe-candidate',
  'dashboard-ready-strategy-candidate',
  'report-ready-strategy-candidate',
  'safety-boundary-strategy-candidate',
] as const;

export type StrategyCandidateEvaluationFixtureName =
  (typeof STRATEGY_CANDIDATE_EVALUATION_FIXTURE_NAMES)[number];

export const STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS = [
  'defensive-new-launch',
  'creator-leaderboard',
  'wallet-leader-copy',
  'post-bundle-dip',
  'no-action-safety',
  'manipulation-avoidance',
  'insufficient-data',
  'high-score-positive',
  'high-score-false-positive',
  'missed-opportunity',
  'drawdown-contained',
  'mixed-signal-watchlist',
  'malformed-input-safe',
  'dashboard-ready',
  'report-ready',
  'safety-boundary',
] as const;

export type StrategyCandidateEvaluationFixtureKind =
  (typeof STRATEGY_CANDIDATE_EVALUATION_FIXTURE_KINDS)[number];

export interface StrategyCandidateProfile {
  readonly candidateId: string;
  readonly title: string;
  readonly family:
    | 'defensive'
    | 'creator-pattern'
    | 'wallet-pattern'
    | 'structure-pattern'
    | 'safety-boundary'
    | 'presentation-ready';
  readonly objective: string;
  readonly horizon: 'immediate' | 'short' | 'medium' | 'unknown';
  readonly evaluationMode: 'analysis-only';
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly notes: readonly string[];
}

export interface StrategyCandidateEvaluationCriterion {
  readonly code: string;
  readonly label: string;
  readonly dimension:
    | 'risk-control'
    | 'quality-check'
    | 'confidence-check'
    | 'safety-boundary'
    | 'data-sufficiency'
    | 'presentation-readiness';
  readonly status: 'met' | 'partial' | 'unmet' | 'unknown';
  readonly rationale: string;
  readonly notes: readonly string[];
}

export interface StrategyCandidateScoreBandReference {
  readonly scoreBandOutcomeFixtureName: ScoreBandOutcomeAnalysisFixtureName;
  readonly scoreBandOutcomeFixtureKind: ScoreBandOutcomeAnalysisFixtureKind;
  readonly scoreBandCategory: ScoreBandCategory;
  readonly referencedReplayOutcomeFixtureName: ReplayOutcomeFixtureName;
  readonly notes: readonly string[];
}

export interface StrategyCandidateRiskIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high' | 'critical';
  readonly category:
    | 'strategy-candidate'
    | 'score-band'
    | 'safety-boundary'
    | 'data-quality'
    | 'composite';
  readonly rationale: string;
}

export interface StrategyCandidateQualityIndicator {
  readonly code: string;
  readonly label: string;
  readonly level: 'low' | 'moderate' | 'high';
  readonly category:
    | 'strategy-candidate'
    | 'score-band'
    | 'safety-boundary'
    | 'data-quality'
    | 'composite';
  readonly rationale: string;
}

export interface StrategyCandidateConfidenceIndicator {
  readonly code: string;
  readonly label: string;
  readonly confidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly referenceCount: number;
  readonly rationale: string;
}

export interface StrategyCandidateEvaluationSummary {
  readonly phase: 38;
  readonly name: StrategyCandidateEvaluationFixtureName;
  readonly kind: StrategyCandidateEvaluationFixtureKind;
  readonly profileId: string;
  readonly scoreBandCategory: ScoreBandCategory;
  readonly criteriaCount: number;
  readonly metCriteriaCount: number;
  readonly partialCriteriaCount: number;
  readonly unmetCriteriaCount: number;
  readonly unknownCriteriaCount: number;
  readonly overallRiskBand: 'low' | 'moderate' | 'elevated' | 'high' | 'critical' | 'unknown';
  readonly overallQualityBand: 'low' | 'moderate' | 'high' | 'unknown';
  readonly overallConfidenceBand: 'none' | 'low' | 'moderate' | 'high';
  readonly riskCount: number;
  readonly qualityCount: number;
  readonly confidenceCount: number;
  readonly topRiskCodes: readonly string[];
  readonly topQualityCodes: readonly string[];
  readonly referencedScoreBandOutcomeFixtureName: ScoreBandOutcomeAnalysisFixtureName;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly localOnly: true;
  readonly liveData: false;
  readonly realScoring: false;
  readonly realRanking: false;
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

export interface StrategyCandidateEvaluationFixtureMeta {
  readonly phase: 38;
  readonly generatedAt: string;
  readonly source: typeof PHASE_38_STRATEGY_CANDIDATES_SOURCE;
  readonly fixtureOnly: true;
  readonly syntheticOnly: true;
  readonly deterministic: true;
  readonly readOnly: true;
  readonly localOnly: true;
  readonly inMemoryOnly: true;
  readonly liveData: false;
  readonly realScoring: false;
  readonly realRanking: false;
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

export interface StrategyCandidateEvaluationFixture {
  readonly name: StrategyCandidateEvaluationFixtureName;
  readonly kind: StrategyCandidateEvaluationFixtureKind;
  readonly profile: StrategyCandidateProfile;
  readonly scoreBandReference: StrategyCandidateScoreBandReference;
  readonly evaluationCriteria: readonly StrategyCandidateEvaluationCriterion[];
  readonly riskIndicators: readonly StrategyCandidateRiskIndicator[];
  readonly qualityIndicators: readonly StrategyCandidateQualityIndicator[];
  readonly confidenceIndicators: readonly StrategyCandidateConfidenceIndicator[];
  readonly summary: StrategyCandidateEvaluationSummary;
  readonly safeNotes: readonly string[];
  readonly meta: StrategyCandidateEvaluationFixtureMeta;
}

export interface StrategyCandidateValidationIssue {
  readonly code: string;
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface StrategyCandidateValidationResult {
  readonly valid: boolean;
  readonly issues: readonly StrategyCandidateValidationIssue[];
}

export interface StrategyCandidateSafetyResult {
  readonly safe: boolean;
  readonly violations: readonly string[];
}

export interface StrategyCandidateBuildInput {
  readonly name: string;
  readonly kind: string;
  readonly profile: StrategyCandidateProfile;
  readonly scoreBandReference: StrategyCandidateScoreBandReference;
  readonly evaluationCriteria?: readonly StrategyCandidateEvaluationCriterion[] | null;
  readonly riskIndicators?: readonly StrategyCandidateRiskIndicator[] | null;
  readonly qualityIndicators?: readonly StrategyCandidateQualityIndicator[] | null;
  readonly confidenceIndicators?: readonly StrategyCandidateConfidenceIndicator[] | null;
  readonly safeNotes?: readonly string[] | null;
}

export interface StrategyCandidateBuildResult {
  readonly success: boolean;
  readonly fixture: StrategyCandidateEvaluationFixture | null;
  readonly validation: StrategyCandidateValidationResult;
  readonly safety: StrategyCandidateSafetyResult;
}

export interface StrategyCandidateFixtureCapabilities {
  readonly strategyCandidateEvaluationFixtures: true;
  readonly syntheticStrategyCandidates: true;
  readonly strategyCandidateBuilders: true;
  readonly strategyCandidateSafetyValidation: true;
  readonly strategyCandidateScoreBandReferences: true;
  readonly strategyCandidateRealScoring: false;
  readonly strategyCandidateRealRanking: false;
  readonly strategyCandidateRealBacktesting: false;
  readonly strategyCandidatePaperTrading: false;
  readonly strategyCandidateLiveTrading: false;
  readonly strategyCandidateExecution: false;
  readonly strategyCandidateSolanaRpc: false;
  readonly strategyCandidateExternalNetwork: false;
  readonly strategyCandidatePersistence: false;
  readonly strategyCandidateFileExport: false;
  readonly strategyCandidateInvestmentAdvice: false;
  readonly strategyCandidateTradingSignals: false;
  readonly strategyCandidateRecommendations: false;
}
