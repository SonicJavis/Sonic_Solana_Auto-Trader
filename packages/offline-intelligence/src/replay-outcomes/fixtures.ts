/**
 * Phase 36 — Replay Outcome Fixture Models v1: deterministic fixtures.
 */

import { buildReplayOutcomeFixture } from './builders.js';
import type {
  ReplayOutcomeBuildInput,
  ReplayOutcomeFixture,
  ReplayOutcomeFixtureName,
  ReplayOutcomeQualityIndicator,
  ReplayOutcomeRiskIndicator,
  ReplayOutcomeScenarioReference,
  ReplayOutcomeSyntheticObservation,
} from './types.js';

function scenarioReference(
  phase33CompositeFixtureName: ReplayOutcomeScenarioReference['phase33CompositeFixtureName'],
  phase33CompositeFixtureKind: ReplayOutcomeScenarioReference['phase33CompositeFixtureKind'],
  phase34ReportFixtureName: ReplayOutcomeScenarioReference['phase34ReportFixtureName'],
  phase34ReportFixtureKind: ReplayOutcomeScenarioReference['phase34ReportFixtureKind'],
  phase35DashboardReportFixtureName: ReplayOutcomeScenarioReference['phase35DashboardReportFixtureName'],
  notes: readonly string[],
): ReplayOutcomeScenarioReference {
  return {
    phase33CompositeFixtureName,
    phase33CompositeFixtureKind,
    phase34ReportFixtureName,
    phase34ReportFixtureKind,
    phase35DashboardReportFixtureName,
    sourceCount: 3,
    notes,
  };
}

function observation(
  outcomeCategory: ReplayOutcomeSyntheticObservation['outcomeCategory'],
  entryDecision: ReplayOutcomeSyntheticObservation['entry']['syntheticDecision'],
  entryGate: ReplayOutcomeSyntheticObservation['entry']['safetyGateStatus'],
  confidenceBand: ReplayOutcomeSyntheticObservation['entry']['confidenceBand'],
  exitResult: ReplayOutcomeSyntheticObservation['exit']['syntheticResult'],
  closureReason: ReplayOutcomeSyntheticObservation['exit']['closureReason'],
  notes: readonly string[],
): ReplayOutcomeSyntheticObservation {
  return {
    outcomeCategory,
    entry: {
      observationId: 'entry-observation',
      syntheticDecision: entryDecision,
      safetyGateStatus: entryGate,
      confidenceBand,
      notes,
    },
    exit: {
      observationId: 'exit-observation',
      syntheticResult: exitResult,
      durationBucket: 'short',
      closureReason,
      notes,
    },
    notes,
  };
}

function risk(
  code: string,
  label: string,
  level: ReplayOutcomeRiskIndicator['level'],
  category: ReplayOutcomeRiskIndicator['category'],
  rationale: string,
): ReplayOutcomeRiskIndicator {
  return { code, label, level, category, rationale };
}

function quality(
  code: string,
  label: string,
  level: ReplayOutcomeQualityIndicator['level'],
  category: ReplayOutcomeQualityIndicator['category'],
  rationale: string,
): ReplayOutcomeQualityIndicator {
  return { code, label, level, category, rationale };
}

function mustBuildFixture(input: ReplayOutcomeBuildInput): ReplayOutcomeFixture {
  const result = buildReplayOutcomeFixture(input);
  if (!result.success || !result.fixture) {
    throw new Error(
      `Invalid Phase 36 fixture definition: ${input.name} — ${JSON.stringify(result.validation.issues)}`,
    );
  }
  return result.fixture;
}

export const AVOIDED_HIGH_RISK_LOSS_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'avoided-high-risk-loss-outcome',
  kind: 'avoided-high-risk-loss',
  scenarioReference: scenarioReference(
    'high-risk-multi-evidence-composite',
    'high-risk-multi-evidence',
    'high-risk-multi-evidence-intelligence-report',
    'high-risk-multi-evidence',
    'high-risk-multi-evidence-report',
    ['Synthetic source references only.', 'Risk-heavy scenario safely avoided.'],
  ),
  observation: observation(
    'risk-avoided',
    'skip',
    'blocked',
    'high',
    'negative-avoided',
    'risk-avoidance',
    ['Safety gate prevented synthetic loss path.'],
  ),
  riskIndicators: [risk('OUT-RISK-HIGH-CONVERGENCE', 'High-risk convergence observed', 'critical', 'outcome', 'Synthetic high-risk convergence triggered a safe skip.')],
  qualityIndicators: [quality('OUT-QUAL-SAFETY-AVOIDED', 'Safety-first avoidance quality', 'high', 'outcome', 'Synthetic safety gate avoided adverse path.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

export const CLEAN_LOW_RISK_FLAT_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'clean-low-risk-flat-outcome',
  kind: 'clean-low-risk-flat',
  scenarioReference: scenarioReference('clean-low-risk-composite', 'clean-low-risk', 'clean-low-risk-intelligence-report', 'clean-low-risk', 'clean-low-risk-dashboard', ['Synthetic clean reference chain.']),
  observation: observation('flat', 'observe', 'passed', 'moderate', 'flat', 'watchlist-hold', ['Synthetic flat outcome with low risk.']),
  riskIndicators: [risk('OUT-RISK-LOW-FLAT', 'Low risk flat observation', 'low', 'outcome', 'Synthetic flat movement without risk escalation.')],
  qualityIndicators: [quality('OUT-QUAL-STABLE-FLAT', 'Stable flat quality', 'moderate', 'outcome', 'Synthetic quality remained stable in flat path.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Flat non-executing observation.'],
});

export const CLEAN_LOW_RISK_POSITIVE_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'clean-low-risk-positive-outcome',
  kind: 'clean-low-risk-positive',
  scenarioReference: scenarioReference('clean-low-risk-composite', 'clean-low-risk', 'clean-low-risk-intelligence-report', 'clean-low-risk', 'clean-low-risk-report', ['Synthetic positive low-risk reference chain.']),
  observation: observation('positive', 'observe', 'passed', 'high', 'positive', 'quality-confirmed', ['Synthetic positive quality outcome.']),
  riskIndicators: [risk('OUT-RISK-LOW-CONTROLLED', 'Low controlled risk', 'low', 'outcome', 'Synthetic path maintained low risk profile.')],
  qualityIndicators: [quality('OUT-QUAL-POSITIVE-CLEAN', 'Positive clean quality outcome', 'high', 'outcome', 'Synthetic clean quality factors aligned.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Positive non-advisory observation.'],
});

export const MIXED_SIGNAL_WATCHLIST_FLAT_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'mixed-signal-watchlist-flat-outcome',
  kind: 'mixed-signal-watchlist-flat',
  scenarioReference: scenarioReference('mixed-signal-watchlist-composite', 'mixed-signal-watchlist', 'mixed-signal-watchlist-intelligence-report', 'mixed-signal-watchlist', 'mixed-signal-watchlist-dashboard', ['Synthetic mixed-signal references.']),
  observation: observation('flat', 'watchlist', 'passed', 'low', 'flat', 'watchlist-hold', ['Synthetic watchlist remained flat.']),
  riskIndicators: [risk('OUT-RISK-MIXED-WATCHLIST', 'Mixed watchlist risk', 'moderate', 'outcome', 'Synthetic mixed evidence kept in watchlist band.')],
  qualityIndicators: [quality('OUT-QUAL-WATCHLIST-FLAT', 'Watchlist flat quality', 'moderate', 'outcome', 'Synthetic quality is mixed and non-directional.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Watchlist flat observation.'],
});

export const HIGH_RISK_FALSE_POSITIVE_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'high-risk-false-positive-outcome',
  kind: 'high-risk-false-positive',
  scenarioReference: scenarioReference('false-positive-protected-composite', 'false-positive-protected', 'false-positive-protected-intelligence-report', 'false-positive-protected', 'safety-boundary-report', ['Synthetic false-positive protected references.']),
  observation: observation('flat', 'watchlist', 'passed', 'moderate', 'flat', 'watchlist-hold', ['Synthetic elevated signal resolved as false positive.']),
  riskIndicators: [risk('OUT-RISK-FP-MISCLASSIFIED', 'False-positive risk signal', 'moderate', 'outcome', 'Synthetic high-risk signal downgraded by quality context.')],
  qualityIndicators: [quality('OUT-QUAL-FP-PROTECTED', 'False-positive protection quality', 'high', 'outcome', 'Synthetic quality guards reduced false-positive impact.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'False-positive protected outcome.'],
});

export const HIGH_RISK_TRUE_POSITIVE_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'high-risk-true-positive-outcome',
  kind: 'high-risk-true-positive',
  scenarioReference: scenarioReference('high-risk-multi-evidence-composite', 'high-risk-multi-evidence', 'high-risk-multi-evidence-intelligence-report', 'high-risk-multi-evidence', 'creator-risk-wallet-risk-dashboard', ['Synthetic true-positive high-risk references.']),
  observation: observation('risk-avoided', 'skip', 'blocked', 'high', 'negative-avoided', 'risk-avoidance', ['Synthetic true-positive risk classification resulted in safe avoidance.']),
  riskIndicators: [risk('OUT-RISK-TP-HIGH', 'True-positive high risk', 'critical', 'outcome', 'Synthetic evidence convergence confirmed high-risk path.')],
  qualityIndicators: [quality('OUT-QUAL-TP-SAFETY', 'Safety quality in true-positive handling', 'high', 'outcome', 'Synthetic guardrails converted true-positive to safe no-action.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'True-positive handled safely.'],
});

export const INSUFFICIENT_DATA_SKIPPED_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'insufficient-data-skipped-outcome',
  kind: 'insufficient-data-skipped',
  scenarioReference: scenarioReference('insufficient-data-composite', 'insufficient-data', 'insufficient-data-intelligence-report', 'insufficient-data', 'insufficient-data-dashboard', ['Synthetic insufficient-data references.']),
  observation: observation('skipped', 'skip', 'blocked', 'none', 'skipped', 'insufficient-data', ['Synthetic skip due to insufficient evidence.']),
  riskIndicators: [risk('OUT-RISK-INSUFFICIENT', 'Insufficient-data uncertainty', 'moderate', 'outcome', 'Synthetic uncertainty blocked observation path.')],
  qualityIndicators: [quality('OUT-QUAL-INSUFFICIENT-SAFE', 'Insufficient-data safety quality', 'moderate', 'outcome', 'Synthetic safety fallback used for insufficient evidence.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Insufficient-data skip outcome.'],
});

export const MANIPULATION_RISK_AVOIDED_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'manipulation-risk-avoided-outcome',
  kind: 'manipulation-risk-avoided',
  scenarioReference: scenarioReference('manipulation-risk-dominates-composite', 'manipulation-risk-dominates', 'manipulation-risk-dominates-intelligence-report', 'manipulation-risk-dominates', 'manipulation-risk-dominates-dashboard', ['Synthetic manipulation-dominant references.']),
  observation: observation('risk-avoided', 'skip', 'blocked', 'high', 'negative-avoided', 'risk-avoidance', ['Synthetic manipulation risk avoided by safety gate.']),
  riskIndicators: [risk('OUT-RISK-MANIP-AVOIDED', 'Manipulation risk avoided', 'high', 'manipulation', 'Synthetic manipulation signal triggered safe no-action path.')],
  qualityIndicators: [quality('OUT-QUAL-MANIP-SAFETY', 'Manipulation safety quality', 'high', 'outcome', 'Synthetic guardrails prevented manipulation-sensitive path.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Manipulation risk avoided.'],
});

export const WALLET_RISK_AVOIDED_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'wallet-risk-avoided-outcome',
  kind: 'wallet-risk-avoided',
  scenarioReference: scenarioReference('wallet-cluster-risk-dominates-composite', 'wallet-cluster-risk-dominates', 'wallet-cluster-risk-dominates-intelligence-report', 'wallet-cluster-risk-dominates', 'creator-risk-wallet-risk-dashboard', ['Synthetic wallet-risk references.']),
  observation: observation('risk-avoided', 'skip', 'blocked', 'high', 'negative-avoided', 'risk-avoidance', ['Synthetic wallet-cluster risk avoided.']),
  riskIndicators: [risk('OUT-RISK-WALLET-AVOIDED', 'Wallet risk avoided', 'high', 'wallet-cluster', 'Synthetic wallet-cluster risk dominance triggered safe skip.')],
  qualityIndicators: [quality('OUT-QUAL-WALLET-SAFETY', 'Wallet safety quality', 'high', 'outcome', 'Synthetic wallet risk was contained by safety checks.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Wallet risk avoided.'],
});

export const CREATOR_RISK_AVOIDED_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'creator-risk-avoided-outcome',
  kind: 'creator-risk-avoided',
  scenarioReference: scenarioReference('creator-risk-dominates-composite', 'creator-risk-dominates', 'creator-risk-dominates-intelligence-report', 'creator-risk-dominates', 'creator-risk-wallet-risk-dashboard', ['Synthetic creator-risk references.']),
  observation: observation('risk-avoided', 'skip', 'blocked', 'moderate', 'negative-avoided', 'risk-avoidance', ['Synthetic creator-risk path safely avoided.']),
  riskIndicators: [risk('OUT-RISK-CREATOR-AVOIDED', 'Creator risk avoided', 'high', 'creator', 'Synthetic creator-dominant risk path was safely blocked.')],
  qualityIndicators: [quality('OUT-QUAL-CREATOR-SAFETY', 'Creator safety quality', 'high', 'outcome', 'Synthetic safeguards prevented creator-risk escalation.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Creator risk avoided.'],
});

export const MISSED_OPPORTUNITY_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'missed-opportunity-outcome',
  kind: 'missed-opportunity',
  scenarioReference: scenarioReference('report-ready-composite', 'report-ready', 'serialization-preview-ready-intelligence-report', 'serialization-preview-ready', 'report-ready-combined', ['Synthetic report-ready references.']),
  observation: observation('missed-opportunity', 'watchlist', 'passed', 'low', 'flat', 'watchlist-hold', ['Synthetic opportunity remained unconfirmed in watchlist path.']),
  riskIndicators: [risk('OUT-RISK-MISSED-OPPORTUNITY', 'Missed-opportunity uncertainty', 'moderate', 'outcome', 'Synthetic non-action can miss benign upside without violating safety.')],
  qualityIndicators: [quality('OUT-QUAL-MISSED-NONACTION', 'Non-action quality posture', 'moderate', 'outcome', 'Synthetic non-action remained safety-compliant and non-executing.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Missed-opportunity non-advisory case.'],
});

export const DRAWDOWN_CONTAINED_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'drawdown-contained-outcome',
  kind: 'drawdown-contained',
  scenarioReference: scenarioReference('creator-risk-wallet-risk-composite', 'creator-risk-wallet-risk', 'creator-risk-wallet-risk-intelligence-report', 'creator-risk-wallet-risk', 'creator-risk-wallet-risk-dashboard', ['Synthetic drawdown-contained references.']),
  observation: observation('drawdown-contained', 'observe', 'passed', 'moderate', 'drawdown-contained', 'risk-avoidance', ['Synthetic drawdown remained bounded by safety thresholds.']),
  riskIndicators: [risk('OUT-RISK-DRAWDOWN-CONTAINED', 'Drawdown contained risk', 'moderate', 'outcome', 'Synthetic adverse movement remained contained.')],
  qualityIndicators: [quality('OUT-QUAL-DRAWDOWN-CONTROL', 'Drawdown control quality', 'high', 'outcome', 'Synthetic controls constrained downside path.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Drawdown-contained synthetic outcome.'],
});

export const NO_ACTION_SAFETY_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'no-action-safety-outcome',
  kind: 'no-action-safety',
  scenarioReference: scenarioReference('no-action-non-advisory-composite', 'no-action-non-advisory', 'no-action-non-advisory-intelligence-report', 'no-action-non-advisory', 'safety-boundary-dashboard', ['Synthetic no-action references.']),
  observation: observation('safety-no-action', 'skip', 'blocked', 'none', 'skipped', 'no-action', ['Synthetic no-action safety boundary outcome.']),
  riskIndicators: [risk('OUT-RISK-NO-ACTION', 'No-action safety posture', 'low', 'outcome', 'Synthetic no-action posture prevents unsafe interpretation.')],
  qualityIndicators: [quality('OUT-QUAL-NO-ACTION', 'No-action quality safeguard', 'high', 'outcome', 'Synthetic no-action outcome preserves safety boundaries.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No-action safety outcome.'],
});

export const MALFORMED_INPUT_SAFE_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'malformed-input-safe-outcome',
  kind: 'malformed-input-safe',
  scenarioReference: scenarioReference('malformed-input-safe-composite', 'malformed-safe', 'malformed-input-safe-intelligence-report', 'malformed-input-safe', 'malformed-input-safe-dashboard', ['Synthetic malformed-input-safe references.']),
  observation: observation('skipped', 'skip', 'blocked', 'none', 'skipped', 'malformed-safe', ['Synthetic malformed input safely normalized to skip.']),
  riskIndicators: [risk('OUT-RISK-MALFORMED-SAFE', 'Malformed input safely handled', 'low', 'outcome', 'Synthetic malformed input did not propagate unsafe state.')],
  qualityIndicators: [quality('OUT-QUAL-MALFORMED-GUARD', 'Malformed guardrail quality', 'high', 'outcome', 'Synthetic malformed input path uses deterministic safety handling.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Malformed-input safe outcome.'],
});

export const DASHBOARD_READY_REPLAY_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'dashboard-ready-replay-outcome',
  kind: 'dashboard-ready',
  scenarioReference: scenarioReference('dashboard-ready-composite', 'dashboard-ready', 'dashboard-ready-intelligence-report', 'dashboard-ready', 'dashboard-ready-combined', ['Synthetic dashboard-ready references.']),
  observation: observation('positive', 'observe', 'passed', 'high', 'positive', 'quality-confirmed', ['Synthetic dashboard-ready replay outcome for display compatibility.']),
  riskIndicators: [risk('OUT-RISK-DASHBOARD-LOW', 'Dashboard-ready low risk', 'low', 'outcome', 'Synthetic dashboard-ready chain preserved low risk.')],
  qualityIndicators: [quality('OUT-QUAL-DASHBOARD-READY', 'Dashboard-ready quality', 'high', 'outcome', 'Synthetic replay outcome is display-ready and deterministic.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Dashboard-ready replay outcome.'],
});

export const REPORT_READY_REPLAY_OUTCOME_FIXTURE = mustBuildFixture({
  name: 'report-ready-replay-outcome',
  kind: 'report-ready',
  scenarioReference: scenarioReference('report-ready-composite', 'report-ready', 'serialization-preview-ready-intelligence-report', 'serialization-preview-ready', 'serialization-preview-ready-combined', ['Synthetic report-ready references.']),
  observation: observation('flat', 'observe', 'passed', 'moderate', 'flat', 'quality-confirmed', ['Synthetic report-ready replay outcome for report workflows.']),
  riskIndicators: [risk('OUT-RISK-REPORT-LOW', 'Report-ready bounded risk', 'low', 'outcome', 'Synthetic report-ready chain has bounded risk profile.')],
  qualityIndicators: [quality('OUT-QUAL-REPORT-READY', 'Report-ready quality', 'high', 'outcome', 'Synthetic report-ready output supports deterministic reporting.')],
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Report-ready replay outcome.'],
});

export const PHASE_36_REPLAY_OUTCOME_FIXTURES = new Map<
  ReplayOutcomeFixtureName,
  ReplayOutcomeFixture
>([
  ['avoided-high-risk-loss-outcome', AVOIDED_HIGH_RISK_LOSS_OUTCOME_FIXTURE],
  ['clean-low-risk-flat-outcome', CLEAN_LOW_RISK_FLAT_OUTCOME_FIXTURE],
  ['clean-low-risk-positive-outcome', CLEAN_LOW_RISK_POSITIVE_OUTCOME_FIXTURE],
  ['mixed-signal-watchlist-flat-outcome', MIXED_SIGNAL_WATCHLIST_FLAT_OUTCOME_FIXTURE],
  ['high-risk-false-positive-outcome', HIGH_RISK_FALSE_POSITIVE_OUTCOME_FIXTURE],
  ['high-risk-true-positive-outcome', HIGH_RISK_TRUE_POSITIVE_OUTCOME_FIXTURE],
  ['insufficient-data-skipped-outcome', INSUFFICIENT_DATA_SKIPPED_OUTCOME_FIXTURE],
  ['manipulation-risk-avoided-outcome', MANIPULATION_RISK_AVOIDED_OUTCOME_FIXTURE],
  ['wallet-risk-avoided-outcome', WALLET_RISK_AVOIDED_OUTCOME_FIXTURE],
  ['creator-risk-avoided-outcome', CREATOR_RISK_AVOIDED_OUTCOME_FIXTURE],
  ['missed-opportunity-outcome', MISSED_OPPORTUNITY_OUTCOME_FIXTURE],
  ['drawdown-contained-outcome', DRAWDOWN_CONTAINED_OUTCOME_FIXTURE],
  ['no-action-safety-outcome', NO_ACTION_SAFETY_OUTCOME_FIXTURE],
  ['malformed-input-safe-outcome', MALFORMED_INPUT_SAFE_OUTCOME_FIXTURE],
  ['dashboard-ready-replay-outcome', DASHBOARD_READY_REPLAY_OUTCOME_FIXTURE],
  ['report-ready-replay-outcome', REPORT_READY_REPLAY_OUTCOME_FIXTURE],
]);

export function listReplayOutcomeFixtures(): readonly ReplayOutcomeFixtureName[] {
  return [...PHASE_36_REPLAY_OUTCOME_FIXTURES.keys()].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function getReplayOutcomeFixture(
  name: ReplayOutcomeFixtureName,
): ReplayOutcomeFixture | undefined {
  return PHASE_36_REPLAY_OUTCOME_FIXTURES.get(name);
}
