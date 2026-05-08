/**
 * Phase 38 — Strategy Candidate Evaluation Fixtures v1: deterministic fixtures.
 *
 * All 16 required synthetic strategy candidate evaluation fixtures.
 * References Phase 37 score-band outcome fixtures by name.
 */

import { buildStrategyCandidateEvaluationFixture } from './builders.js';
import type {
  StrategyCandidateBuildInput,
  StrategyCandidateConfidenceIndicator,
  StrategyCandidateEvaluationCriterion,
  StrategyCandidateEvaluationFixture,
  StrategyCandidateEvaluationFixtureKind,
  StrategyCandidateEvaluationFixtureName,
  StrategyCandidateProfile,
  StrategyCandidateQualityIndicator,
  StrategyCandidateRiskIndicator,
  StrategyCandidateScoreBandReference,
} from './types.js';
import type {
  ScoreBandOutcomeAnalysisFixtureKind,
  ScoreBandOutcomeAnalysisFixtureName,
} from '../score-band-outcomes/types.js';
import type { ReplayOutcomeFixtureName } from '../replay-outcomes/types.js';

function profile(
  candidateId: string,
  title: string,
  family: StrategyCandidateProfile['family'],
  objective: string,
  horizon: StrategyCandidateProfile['horizon'],
  notes: readonly string[],
): StrategyCandidateProfile {
  return {
    candidateId,
    title,
    family,
    objective,
    horizon,
    evaluationMode: 'analysis-only',
    fixtureOnly: true,
    syntheticOnly: true,
    notes,
  };
}

function criterion(
  code: string,
  label: string,
  dimension: StrategyCandidateEvaluationCriterion['dimension'],
  status: StrategyCandidateEvaluationCriterion['status'],
  rationale: string,
  notes: readonly string[],
): StrategyCandidateEvaluationCriterion {
  return { code, label, dimension, status, rationale, notes };
}

function scoreBandRef(
  scoreBandOutcomeFixtureName: ScoreBandOutcomeAnalysisFixtureName,
  scoreBandOutcomeFixtureKind: ScoreBandOutcomeAnalysisFixtureKind,
  scoreBandCategory: StrategyCandidateScoreBandReference['scoreBandCategory'],
  referencedReplayOutcomeFixtureName: ReplayOutcomeFixtureName,
  notes: readonly string[],
): StrategyCandidateScoreBandReference {
  return {
    scoreBandOutcomeFixtureName,
    scoreBandOutcomeFixtureKind,
    scoreBandCategory,
    referencedReplayOutcomeFixtureName,
    notes,
  };
}

function risk(
  code: string,
  label: string,
  level: StrategyCandidateRiskIndicator['level'],
  category: StrategyCandidateRiskIndicator['category'],
  rationale: string,
): StrategyCandidateRiskIndicator {
  return { code, label, level, category, rationale };
}

function quality(
  code: string,
  label: string,
  level: StrategyCandidateQualityIndicator['level'],
  category: StrategyCandidateQualityIndicator['category'],
  rationale: string,
): StrategyCandidateQualityIndicator {
  return { code, label, level, category, rationale };
}

function confidence(
  code: string,
  label: string,
  confidenceBand: StrategyCandidateConfidenceIndicator['confidenceBand'],
  referenceCount: number,
  rationale: string,
): StrategyCandidateConfidenceIndicator {
  return { code, label, confidenceBand, referenceCount, rationale };
}

function mustBuild(input: StrategyCandidateBuildInput): StrategyCandidateEvaluationFixture {
  const result = buildStrategyCandidateEvaluationFixture(input);
  if (!result.success || !result.fixture) {
    throw new Error(
      `Invalid Phase 38 fixture definition: ${input.name} — ${JSON.stringify(result.validation.issues)}`,
    );
  }
  return result.fixture;
}

function fixture(
  name: StrategyCandidateEvaluationFixtureName,
  kind: StrategyCandidateEvaluationFixtureKind,
  candidateProfile: StrategyCandidateProfile,
  reference: StrategyCandidateScoreBandReference,
  evaluationCriteria: readonly StrategyCandidateEvaluationCriterion[],
  riskIndicators: readonly StrategyCandidateRiskIndicator[],
  qualityIndicators: readonly StrategyCandidateQualityIndicator[],
  confidenceIndicators: readonly StrategyCandidateConfidenceIndicator[],
): StrategyCandidateEvaluationFixture {
  return mustBuild({
    name,
    kind,
    profile: candidateProfile,
    scoreBandReference: reference,
    evaluationCriteria,
    riskIndicators,
    qualityIndicators,
    confidenceIndicators,
    safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
  });
}

export const DEFENSIVE_NEW_LAUNCH_CANDIDATE_FIXTURE = fixture(
  'defensive-new-launch-candidate',
  'defensive-new-launch',
  profile(
    'sc-001',
    'Defensive new-launch candidate',
    'defensive',
    'Synthetic defensive candidate for new-launch uncertainty.',
    'short',
    ['Synthetic profile only.'],
  ),
  scoreBandRef(
    'low-score-safe-skip',
    'low-score-safe-skip',
    'low',
    'avoided-high-risk-loss-outcome',
    ['Synthetic Phase 37 reference.'],
  ),
  [
    criterion('SC-CRIT-DEF-RISK', 'Risk containment', 'risk-control', 'met', 'Safety-first containment present.', ['Synthetic criterion.']),
    criterion('SC-CRIT-DEF-QUAL', 'Quality sufficiency', 'quality-check', 'partial', 'Limited quality confidence in new-launch setup.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-DEF-LAUNCH', 'Defensive launch risk', 'moderate', 'strategy-candidate', 'Synthetic launch uncertainty remains.')],
  [quality('SC-QUAL-DEF-GUARD', 'Defensive quality guard', 'moderate', 'safety-boundary', 'Synthetic quality guard present.')],
  [confidence('SC-CONF-DEF', 'Defensive confidence', 'moderate', 1, 'Synthetic confidence from one score-band reference.')],
);

export const CREATOR_LEADERBOARD_CANDIDATE_FIXTURE = fixture(
  'creator-leaderboard-candidate',
  'creator-leaderboard',
  profile('sc-002', 'Creator leaderboard candidate', 'creator-pattern', 'Synthetic creator-pattern candidate with safety checks.', 'short', ['Synthetic profile only.']),
  scoreBandRef('creator-risk-avoidance', 'creator-risk-avoidance', 'low', 'creator-risk-avoided-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-CREATOR-RISK', 'Creator-risk guard', 'risk-control', 'met', 'Synthetic creator-risk guard satisfied.', ['Synthetic criterion.']),
    criterion('SC-CRIT-CREATOR-CONF', 'Creator confidence check', 'confidence-check', 'met', 'Synthetic confidence signals are consistent.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-CREATOR', 'Creator profile risk', 'moderate', 'score-band', 'Synthetic creator-profile variability.')],
  [quality('SC-QUAL-CREATOR', 'Creator quality consistency', 'high', 'strategy-candidate', 'Synthetic quality consistency appears high.')],
  [confidence('SC-CONF-CREATOR', 'Creator candidate confidence', 'high', 1, 'Synthetic confidence aligns with creator-risk-avoidance fixture.')],
);

export const WALLET_LEADER_COPY_CANDIDATE_FIXTURE = fixture(
  'wallet-leader-copy-candidate',
  'wallet-leader-copy',
  profile('sc-003', 'Wallet leader copy candidate', 'wallet-pattern', 'Synthetic wallet-pattern candidate with strict boundaries.', 'immediate', ['Synthetic profile only.']),
  scoreBandRef('wallet-risk-avoidance', 'wallet-risk-avoidance', 'low', 'wallet-risk-avoided-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-WALLET-RISK', 'Wallet-risk boundary', 'risk-control', 'met', 'Synthetic wallet-risk boundary satisfied.', ['Synthetic criterion.']),
    criterion('SC-CRIT-WALLET-DATA', 'Wallet data sufficiency', 'data-sufficiency', 'partial', 'Synthetic data remains partial.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-WALLET', 'Wallet pattern risk', 'moderate', 'strategy-candidate', 'Synthetic wallet-pattern concentration risk.')],
  [quality('SC-QUAL-WALLET', 'Wallet pattern quality', 'moderate', 'data-quality', 'Synthetic wallet evidence quality is moderate.')],
  [confidence('SC-CONF-WALLET', 'Wallet candidate confidence', 'moderate', 1, 'Synthetic confidence with one reference.')],
);

export const POST_BUNDLE_DIP_CANDIDATE_FIXTURE = fixture(
  'post-bundle-dip-candidate',
  'post-bundle-dip',
  profile('sc-004', 'Post-bundle dip candidate', 'structure-pattern', 'Synthetic structure-pattern candidate for post-bundle dip context.', 'short', ['Synthetic profile only.']),
  scoreBandRef('medium-score-mixed-outcome', 'medium-score-mixed-outcome', 'medium', 'high-risk-false-positive-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-BUNDLE-RISK', 'Structure risk check', 'risk-control', 'partial', 'Synthetic structure signals are mixed.', ['Synthetic criterion.']),
    criterion('SC-CRIT-BUNDLE-CONF', 'Structure confidence', 'confidence-check', 'partial', 'Synthetic confidence is partial.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-BUNDLE', 'Structure-pattern risk', 'high', 'strategy-candidate', 'Synthetic structure risk elevated in mixed context.')],
  [quality('SC-QUAL-BUNDLE', 'Structure quality guard', 'moderate', 'score-band', 'Synthetic quality guard limits exposure.')],
  [confidence('SC-CONF-BUNDLE', 'Structure candidate confidence', 'low', 1, 'Synthetic confidence is low in mixed context.')],
);

export const NO_ACTION_SAFETY_CANDIDATE_FIXTURE = fixture(
  'no-action-safety-candidate',
  'no-action-safety',
  profile('sc-005', 'No-action safety candidate', 'safety-boundary', 'Synthetic no-action candidate used to preserve safety boundaries.', 'unknown', ['Synthetic profile only.']),
  scoreBandRef('no-action-safety', 'no-action-safety', 'unknown', 'no-action-safety-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-NO-ACTION', 'No-action boundary', 'safety-boundary', 'met', 'Synthetic no-action boundary preserved.', ['Synthetic criterion.']),
    criterion('SC-CRIT-NO-ACTION-DATA', 'Data sufficiency gate', 'data-sufficiency', 'unknown', 'Synthetic data gate unresolved.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-NO-ACTION', 'No-action residual risk', 'low', 'safety-boundary', 'Synthetic no-action path keeps residual risk low.')],
  [quality('SC-QUAL-NO-ACTION', 'No-action quality', 'high', 'safety-boundary', 'Synthetic boundary quality remains high.')],
  [confidence('SC-CONF-NO-ACTION', 'No-action confidence', 'high', 1, 'Synthetic no-action confidence is high.')],
);

export const MANIPULATION_AVOIDANCE_CANDIDATE_FIXTURE = fixture(
  'manipulation-avoidance-candidate',
  'manipulation-avoidance',
  profile('sc-006', 'Manipulation avoidance candidate', 'defensive', 'Synthetic candidate focused on manipulation-risk avoidance.', 'immediate', ['Synthetic profile only.']),
  scoreBandRef('manipulation-risk-avoidance', 'manipulation-risk-avoidance', 'low', 'manipulation-risk-avoided-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-MANIP-SAFETY', 'Manipulation safety gate', 'safety-boundary', 'met', 'Synthetic safety gate is met.', ['Synthetic criterion.']),
    criterion('SC-CRIT-MANIP-QUALITY', 'Manipulation quality', 'quality-check', 'met', 'Synthetic quality gate is met.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-MANIP', 'Manipulation residual risk', 'moderate', 'safety-boundary', 'Synthetic residual manipulation risk remains moderate.')],
  [quality('SC-QUAL-MANIP', 'Manipulation avoidance quality', 'high', 'strategy-candidate', 'Synthetic quality is high after avoidance gate.')],
  [confidence('SC-CONF-MANIP', 'Manipulation candidate confidence', 'high', 1, 'Synthetic confidence aligns with avoidance fixture.')],
);

export const INSUFFICIENT_DATA_CANDIDATE_FIXTURE = fixture(
  'insufficient-data-candidate',
  'insufficient-data',
  profile('sc-007', 'Insufficient data candidate', 'defensive', 'Synthetic candidate that enforces insufficient-data fallback.', 'unknown', ['Synthetic profile only.']),
  scoreBandRef('insufficient-data', 'insufficient-data', 'unknown', 'insufficient-data-skipped-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-INSUF-DATA', 'Data sufficiency gate', 'data-sufficiency', 'unmet', 'Synthetic data sufficiency gate fails closed.', ['Synthetic criterion.']),
    criterion('SC-CRIT-INSUF-SAFETY', 'Safety fallback', 'safety-boundary', 'met', 'Synthetic safety fallback is active.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-INSUF', 'Insufficient-data risk', 'moderate', 'data-quality', 'Synthetic uncertainty risk remains moderate.')],
  [quality('SC-QUAL-INSUF', 'Insufficient-data quality', 'low', 'data-quality', 'Synthetic quality remains low without enough references.')],
  [confidence('SC-CONF-INSUF', 'Insufficient-data confidence', 'none', 1, 'Synthetic confidence is none in insufficient-data case.')],
);

export const HIGH_SCORE_POSITIVE_CANDIDATE_FIXTURE = fixture(
  'high-score-positive-candidate',
  'high-score-positive',
  profile('sc-008', 'High-score positive candidate', 'presentation-ready', 'Synthetic candidate mapped to high-score positive outcome.', 'short', ['Synthetic profile only.']),
  scoreBandRef('high-score-positive-outcome', 'high-score-positive-outcome', 'high', 'clean-low-risk-positive-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-HIGH-POS-QUAL', 'Quality threshold', 'quality-check', 'met', 'Synthetic quality threshold satisfied.', ['Synthetic criterion.']),
    criterion('SC-CRIT-HIGH-POS-CONF', 'Confidence threshold', 'confidence-check', 'met', 'Synthetic confidence threshold satisfied.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-HIGH-POS', 'High-score positive residual risk', 'low', 'score-band', 'Synthetic residual risk is low.')],
  [quality('SC-QUAL-HIGH-POS', 'High-score positive quality', 'high', 'score-band', 'Synthetic quality is high in this profile.')],
  [confidence('SC-CONF-HIGH-POS', 'High-score positive confidence', 'high', 1, 'Synthetic confidence is high.')],
);

export const HIGH_SCORE_FALSE_POSITIVE_CANDIDATE_FIXTURE = fixture(
  'high-score-false-positive-candidate',
  'high-score-false-positive',
  profile('sc-009', 'High-score false-positive candidate', 'defensive', 'Synthetic candidate for high-score false-positive containment.', 'short', ['Synthetic profile only.']),
  scoreBandRef('high-score-false-positive', 'high-score-false-positive', 'high', 'high-risk-false-positive-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-HIGH-FP-RISK', 'False-positive risk gate', 'risk-control', 'met', 'Synthetic false-positive risk gate is met.', ['Synthetic criterion.']),
    criterion('SC-CRIT-HIGH-FP-CONF', 'False-positive confidence gate', 'confidence-check', 'partial', 'Synthetic confidence is partial.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-HIGH-FP', 'High-score false-positive risk', 'high', 'score-band', 'Synthetic false-positive risk remains elevated.')],
  [quality('SC-QUAL-HIGH-FP', 'High-score false-positive quality', 'moderate', 'strategy-candidate', 'Synthetic quality guard is moderate.')],
  [confidence('SC-CONF-HIGH-FP', 'High-score false-positive confidence', 'moderate', 1, 'Synthetic confidence is moderate in this case.')],
);

export const MISSED_OPPORTUNITY_CANDIDATE_FIXTURE = fixture(
  'missed-opportunity-candidate',
  'missed-opportunity',
  profile('sc-010', 'Missed opportunity candidate', 'defensive', 'Synthetic candidate for missed-opportunity retrospection.', 'medium', ['Synthetic profile only.']),
  scoreBandRef('missed-opportunity', 'missed-opportunity', 'low', 'missed-opportunity-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-MISSED-RISK', 'Missed-opportunity risk gate', 'risk-control', 'partial', 'Synthetic risk gate partially met.', ['Synthetic criterion.']),
    criterion('SC-CRIT-MISSED-QUALITY', 'Missed-opportunity quality gate', 'quality-check', 'partial', 'Synthetic quality gate partially met.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-MISSED', 'Missed-opportunity risk', 'moderate', 'strategy-candidate', 'Synthetic missed-opportunity risk is moderate.')],
  [quality('SC-QUAL-MISSED', 'Missed-opportunity quality', 'moderate', 'score-band', 'Synthetic quality remains moderate.')],
  [confidence('SC-CONF-MISSED', 'Missed-opportunity confidence', 'low', 1, 'Synthetic confidence stays low.')],
);

export const DRAWDOWN_CONTAINED_CANDIDATE_FIXTURE = fixture(
  'drawdown-contained-candidate',
  'drawdown-contained',
  profile('sc-011', 'Drawdown contained candidate', 'defensive', 'Synthetic candidate for drawdown containment behavior.', 'medium', ['Synthetic profile only.']),
  scoreBandRef('drawdown-contained', 'drawdown-contained', 'medium', 'drawdown-contained-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-DRAWDOWN-RISK', 'Drawdown risk boundary', 'risk-control', 'met', 'Synthetic drawdown boundary met.', ['Synthetic criterion.']),
    criterion('SC-CRIT-DRAWDOWN-CONF', 'Drawdown confidence check', 'confidence-check', 'met', 'Synthetic confidence check met.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-DRAWDOWN', 'Drawdown residual risk', 'moderate', 'strategy-candidate', 'Synthetic residual drawdown risk is controlled.')],
  [quality('SC-QUAL-DRAWDOWN', 'Drawdown quality', 'moderate', 'strategy-candidate', 'Synthetic quality remains stable.')],
  [confidence('SC-CONF-DRAWDOWN', 'Drawdown confidence', 'moderate', 1, 'Synthetic confidence is moderate.')],
);

export const MIXED_SIGNAL_WATCHLIST_CANDIDATE_FIXTURE = fixture(
  'mixed-signal-watchlist-candidate',
  'mixed-signal-watchlist',
  profile('sc-012', 'Mixed signal watchlist candidate', 'structure-pattern', 'Synthetic candidate for mixed-signal watchlist handling.', 'short', ['Synthetic profile only.']),
  scoreBandRef('medium-score-watchlist-flat', 'medium-score-watchlist-flat', 'medium', 'mixed-signal-watchlist-flat-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-MIXED-RISK', 'Mixed-signal risk gate', 'risk-control', 'partial', 'Synthetic mixed-signal risk gate is partial.', ['Synthetic criterion.']),
    criterion('SC-CRIT-MIXED-DATA', 'Mixed-signal data gate', 'data-sufficiency', 'met', 'Synthetic data sufficiency gate is met.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-MIXED', 'Mixed-signal risk', 'moderate', 'strategy-candidate', 'Synthetic mixed-signal uncertainty remains.')],
  [quality('SC-QUAL-MIXED', 'Mixed-signal quality', 'moderate', 'data-quality', 'Synthetic quality remains moderate in mixed context.')],
  [confidence('SC-CONF-MIXED', 'Mixed-signal confidence', 'moderate', 1, 'Synthetic confidence is moderate.')],
);

export const MALFORMED_INPUT_SAFE_CANDIDATE_FIXTURE = fixture(
  'malformed-input-safe-candidate',
  'malformed-input-safe',
  profile('sc-013', 'Malformed input safe candidate', 'safety-boundary', 'Synthetic malformed-input candidate that remains safe.', 'unknown', ['Synthetic profile only.']),
  scoreBandRef('malformed-input-safe', 'malformed-input-safe', 'unknown', 'malformed-input-safe-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-MALFORMED-SAFE', 'Malformed-input safety gate', 'safety-boundary', 'met', 'Synthetic malformed-input safety gate met.', ['Synthetic criterion.']),
    criterion('SC-CRIT-MALFORMED-DATA', 'Malformed-input data gate', 'data-sufficiency', 'unmet', 'Synthetic malformed input prevents full data sufficiency.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-MALFORMED', 'Malformed-input risk', 'moderate', 'safety-boundary', 'Synthetic malformed-input risk is controlled by defaults.')],
  [quality('SC-QUAL-MALFORMED', 'Malformed-input quality', 'low', 'data-quality', 'Synthetic quality is low under malformed input.')],
  [confidence('SC-CONF-MALFORMED', 'Malformed-input confidence', 'none', 1, 'Synthetic confidence is none for malformed input.')],
);

export const DASHBOARD_READY_STRATEGY_CANDIDATE_FIXTURE = fixture(
  'dashboard-ready-strategy-candidate',
  'dashboard-ready',
  profile('sc-014', 'Dashboard ready strategy candidate', 'presentation-ready', 'Synthetic candidate suitable for dashboard presentation.', 'short', ['Synthetic profile only.']),
  scoreBandRef('dashboard-ready-score-band', 'dashboard-ready', 'high', 'dashboard-ready-replay-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-DASHBOARD-PRESENT', 'Dashboard presentation gate', 'presentation-readiness', 'met', 'Synthetic presentation gate is met.', ['Synthetic criterion.']),
    criterion('SC-CRIT-DASHBOARD-SAFETY', 'Dashboard safety gate', 'safety-boundary', 'met', 'Synthetic safety gate is met.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-DASHBOARD', 'Dashboard-ready risk', 'low', 'strategy-candidate', 'Synthetic dashboard-ready risk is low.')],
  [quality('SC-QUAL-DASHBOARD', 'Dashboard-ready quality', 'high', 'strategy-candidate', 'Synthetic dashboard-ready quality is high.')],
  [confidence('SC-CONF-DASHBOARD', 'Dashboard-ready confidence', 'high', 1, 'Synthetic dashboard-ready confidence is high.')],
);

export const REPORT_READY_STRATEGY_CANDIDATE_FIXTURE = fixture(
  'report-ready-strategy-candidate',
  'report-ready',
  profile('sc-015', 'Report ready strategy candidate', 'presentation-ready', 'Synthetic candidate suitable for report presentation.', 'medium', ['Synthetic profile only.']),
  scoreBandRef('report-ready-score-band', 'report-ready', 'high', 'report-ready-replay-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-REPORT-PRESENT', 'Report presentation gate', 'presentation-readiness', 'met', 'Synthetic report presentation gate is met.', ['Synthetic criterion.']),
    criterion('SC-CRIT-REPORT-SAFETY', 'Report safety gate', 'safety-boundary', 'met', 'Synthetic report safety gate is met.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-REPORT', 'Report-ready risk', 'low', 'strategy-candidate', 'Synthetic report-ready risk is low.')],
  [quality('SC-QUAL-REPORT', 'Report-ready quality', 'high', 'strategy-candidate', 'Synthetic report-ready quality is high.')],
  [confidence('SC-CONF-REPORT', 'Report-ready confidence', 'high', 1, 'Synthetic report-ready confidence is high.')],
);

export const SAFETY_BOUNDARY_STRATEGY_CANDIDATE_FIXTURE = fixture(
  'safety-boundary-strategy-candidate',
  'safety-boundary',
  profile('sc-016', 'Safety boundary strategy candidate', 'safety-boundary', 'Synthetic candidate for explicit safety-boundary regression.', 'unknown', ['Synthetic profile only.']),
  scoreBandRef('low-score-safe-skip', 'low-score-safe-skip', 'low', 'avoided-high-risk-loss-outcome', ['Synthetic Phase 37 reference.']),
  [
    criterion('SC-CRIT-SAFETY-BOUNDARY', 'Safety boundary gate', 'safety-boundary', 'met', 'Synthetic boundary gate is met.', ['Synthetic criterion.']),
    criterion('SC-CRIT-SAFETY-DATA', 'Safety data gate', 'data-sufficiency', 'partial', 'Synthetic data gate remains partial.', ['Synthetic criterion.']),
  ],
  [risk('SC-RISK-SAFETY', 'Safety-boundary residual risk', 'low', 'safety-boundary', 'Synthetic boundary residual risk is low.')],
  [quality('SC-QUAL-SAFETY', 'Safety-boundary quality', 'high', 'safety-boundary', 'Synthetic safety quality remains high.')],
  [confidence('SC-CONF-SAFETY', 'Safety-boundary confidence', 'moderate', 1, 'Synthetic safety confidence is moderate.')],
);

export const PHASE_38_STRATEGY_CANDIDATE_EVALUATION_FIXTURES: ReadonlyMap<
  StrategyCandidateEvaluationFixtureName,
  StrategyCandidateEvaluationFixture
> = new Map([
  ['defensive-new-launch-candidate', DEFENSIVE_NEW_LAUNCH_CANDIDATE_FIXTURE],
  ['creator-leaderboard-candidate', CREATOR_LEADERBOARD_CANDIDATE_FIXTURE],
  ['wallet-leader-copy-candidate', WALLET_LEADER_COPY_CANDIDATE_FIXTURE],
  ['post-bundle-dip-candidate', POST_BUNDLE_DIP_CANDIDATE_FIXTURE],
  ['no-action-safety-candidate', NO_ACTION_SAFETY_CANDIDATE_FIXTURE],
  ['manipulation-avoidance-candidate', MANIPULATION_AVOIDANCE_CANDIDATE_FIXTURE],
  ['insufficient-data-candidate', INSUFFICIENT_DATA_CANDIDATE_FIXTURE],
  ['high-score-positive-candidate', HIGH_SCORE_POSITIVE_CANDIDATE_FIXTURE],
  ['high-score-false-positive-candidate', HIGH_SCORE_FALSE_POSITIVE_CANDIDATE_FIXTURE],
  ['missed-opportunity-candidate', MISSED_OPPORTUNITY_CANDIDATE_FIXTURE],
  ['drawdown-contained-candidate', DRAWDOWN_CONTAINED_CANDIDATE_FIXTURE],
  ['mixed-signal-watchlist-candidate', MIXED_SIGNAL_WATCHLIST_CANDIDATE_FIXTURE],
  ['malformed-input-safe-candidate', MALFORMED_INPUT_SAFE_CANDIDATE_FIXTURE],
  ['dashboard-ready-strategy-candidate', DASHBOARD_READY_STRATEGY_CANDIDATE_FIXTURE],
  ['report-ready-strategy-candidate', REPORT_READY_STRATEGY_CANDIDATE_FIXTURE],
  ['safety-boundary-strategy-candidate', SAFETY_BOUNDARY_STRATEGY_CANDIDATE_FIXTURE],
]);

export function listStrategyCandidateEvaluationFixtures(): readonly StrategyCandidateEvaluationFixtureName[] {
  return [...PHASE_38_STRATEGY_CANDIDATE_EVALUATION_FIXTURES.keys()].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function getStrategyCandidateEvaluationFixture(
  name: StrategyCandidateEvaluationFixtureName,
): StrategyCandidateEvaluationFixture | undefined {
  return PHASE_38_STRATEGY_CANDIDATE_EVALUATION_FIXTURES.get(name);
}
