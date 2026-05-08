/**
 * Phase 37 — Score Band Outcome Analysis Models v1: deterministic fixtures.
 *
 * All 16 required synthetic score-band outcome analysis fixtures.
 * References Phase 36 replay outcome fixtures by name.
 */

import { buildScoreBandOutcomeAnalysisFixture } from './builders.js';
import type {
  ScoreBandOutcomeAnalysisFixture,
  ScoreBandOutcomeAnalysisFixtureName,
  ScoreBandOutcomeBuildInput,
  ScoreBandConfidenceIndicator,
  ScoreBandOutcomeDistribution,
  ScoreBandOutcomeReference,
  ScoreBandQualityIndicator,
  ScoreBandRange,
  ScoreBandRiskIndicator,
} from './types.js';
import type { ReplayOutcomeFixtureKind, ReplayOutcomeFixtureName } from '../replay-outcomes/types.js';

function band(
  lowerLabel: string,
  upperLabel: string,
  category: ScoreBandRange['category'],
  notes: readonly string[],
): ScoreBandRange {
  return { lowerLabel, upperLabel, category, notes };
}

function outcomeRef(
  replayOutcomeFixtureName: ReplayOutcomeFixtureName,
  replayOutcomeFixtureKind: ReplayOutcomeFixtureKind,
  scoreBandCategory: ScoreBandOutcomeReference['scoreBandCategory'],
  notes: readonly string[],
): ScoreBandOutcomeReference {
  return { replayOutcomeFixtureName, replayOutcomeFixtureKind, scoreBandCategory, notes };
}

function risk(
  code: string,
  label: string,
  level: ScoreBandRiskIndicator['level'],
  category: ScoreBandRiskIndicator['category'],
  rationale: string,
): ScoreBandRiskIndicator {
  return { code, label, level, category, rationale };
}

function quality(
  code: string,
  label: string,
  level: ScoreBandQualityIndicator['level'],
  category: ScoreBandQualityIndicator['category'],
  rationale: string,
): ScoreBandQualityIndicator {
  return { code, label, level, category, rationale };
}

function confidence(
  code: string,
  label: string,
  confidenceBand: ScoreBandConfidenceIndicator['confidenceBand'],
  referenceCount: number,
  rationale: string,
): ScoreBandConfidenceIndicator {
  return { code, label, confidenceBand, referenceCount, rationale };
}

function dist(
  syntheticOutcomeCount: number,
  positiveOutcomeCount: number,
  flatOutcomeCount: number,
  riskAvoidedCount: number,
  skippedCount: number,
  missedOpportunityCount: number,
  containedCount: number,
  noActionCount: number,
  notes: readonly string[],
): ScoreBandOutcomeDistribution {
  return {
    syntheticOutcomeCount,
    positiveOutcomeCount,
    flatOutcomeCount,
    riskAvoidedCount,
    skippedCount,
    missedOpportunityCount,
    containedCount,
    noActionCount,
    notes,
  };
}

function mustBuild(input: ScoreBandOutcomeBuildInput): ScoreBandOutcomeAnalysisFixture {
  const result = buildScoreBandOutcomeAnalysisFixture(input);
  if (!result.success || !result.fixture) {
    throw new Error(
      `Invalid Phase 37 fixture definition: ${input.name} — ${JSON.stringify(result.validation.issues)}`,
    );
  }
  return result.fixture;
}

// ─── Fixture 1: low-score-safe-skip ─────────────────────────────────────────

export const LOW_SCORE_SAFE_SKIP_FIXTURE = mustBuild({
  name: 'low-score-safe-skip',
  kind: 'low-score-safe-skip',
  scoreBandRange: band('low-band-floor', 'low-band-ceiling', 'low', [
    'Synthetic low score band.',
    'No real scoring.',
  ]),
  outcomeReference: outcomeRef(
    'avoided-high-risk-loss-outcome',
    'avoided-high-risk-loss',
    'low',
    ['Synthetic Phase 36 replay reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-LOW-SAFE-SKIP',
      'Low-score safe skip indicator',
      'low',
      'score-band',
      'Synthetic low score band mapped to safe skip observation.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-LOW-SAFE',
      'Low-score safety quality',
      'moderate',
      'score-band',
      'Synthetic safety quality preserved in low-score band.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-LOW-SKIP',
      'Low-score skip confidence',
      'moderate',
      1,
      'Synthetic replay outcome confirmed safe skip in low band.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 1, 0, 0, 0, 0, ['Synthetic safe skip distribution.']),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 2: low-score-false-negative ────────────────────────────────────

export const LOW_SCORE_FALSE_NEGATIVE_FIXTURE = mustBuild({
  name: 'low-score-false-negative',
  kind: 'low-score-false-negative',
  scoreBandRange: band('low-band-floor', 'low-band-ceiling', 'low', [
    'Synthetic low score band.',
  ]),
  outcomeReference: outcomeRef(
    'missed-opportunity-outcome',
    'missed-opportunity',
    'low',
    ['Synthetic missed-opportunity reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-LOW-FN',
      'Low-score false-negative risk',
      'moderate',
      'score-band',
      'Synthetic low band may produce false negatives on missed opportunities.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-LOW-FN',
      'Low-score false-negative quality signal',
      'low',
      'score-band',
      'Synthetic quality band underweighted in false-negative case.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-LOW-FN',
      'Low-score false-negative confidence',
      'low',
      1,
      'Synthetic uncertainty about missed opportunities in low band.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 0, 0, 1, 0, 0, ['Synthetic false-negative distribution.']),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 3: medium-score-watchlist-flat ──────────────────────────────────

export const MEDIUM_SCORE_WATCHLIST_FLAT_FIXTURE = mustBuild({
  name: 'medium-score-watchlist-flat',
  kind: 'medium-score-watchlist-flat',
  scoreBandRange: band('medium-band-floor', 'medium-band-ceiling', 'medium', [
    'Synthetic medium score band.',
  ]),
  outcomeReference: outcomeRef(
    'mixed-signal-watchlist-flat-outcome',
    'mixed-signal-watchlist-flat',
    'medium',
    ['Synthetic watchlist-flat reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-MED-WATCHLIST',
      'Medium-score watchlist risk',
      'moderate',
      'score-band',
      'Synthetic medium band watchlist pattern observed.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-MED-WATCHLIST',
      'Medium-score watchlist quality',
      'moderate',
      'score-band',
      'Synthetic quality moderate in watchlist-flat band.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-MED-WATCHLIST',
      'Medium-score watchlist confidence',
      'moderate',
      1,
      'Synthetic moderate confidence in medium watchlist band.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 1, 0, 0, 0, 0, 0, [
    'Synthetic watchlist-flat distribution.',
  ]),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 4: medium-score-mixed-outcome ───────────────────────────────────

export const MEDIUM_SCORE_MIXED_OUTCOME_FIXTURE = mustBuild({
  name: 'medium-score-mixed-outcome',
  kind: 'medium-score-mixed-outcome',
  scoreBandRange: band('medium-band-floor', 'medium-band-ceiling', 'medium', [
    'Synthetic mixed medium score band.',
  ]),
  outcomeReference: outcomeRef(
    'high-risk-false-positive-outcome',
    'high-risk-false-positive',
    'medium',
    ['Synthetic false-positive reference in medium band.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-MED-MIXED',
      'Medium-score mixed risk',
      'moderate',
      'score-band',
      'Synthetic mixed signals in medium score band.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-MED-MIXED',
      'Medium-score mixed quality',
      'moderate',
      'score-band',
      'Synthetic quality indicators are mixed in this band.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-MED-MIXED',
      'Medium-score mixed confidence',
      'low',
      1,
      'Synthetic low confidence due to mixed signals.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 1, 0, 0, 0, 0, 0, ['Synthetic mixed outcome distribution.']),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 5: high-score-positive-outcome ──────────────────────────────────

export const HIGH_SCORE_POSITIVE_OUTCOME_FIXTURE = mustBuild({
  name: 'high-score-positive-outcome',
  kind: 'high-score-positive-outcome',
  scoreBandRange: band('high-band-floor', 'high-band-ceiling', 'high', [
    'Synthetic high score band.',
  ]),
  outcomeReference: outcomeRef(
    'clean-low-risk-positive-outcome',
    'clean-low-risk-positive',
    'high',
    ['Synthetic positive clean reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-HIGH-POS',
      'High-score positive risk profile',
      'low',
      'score-band',
      'Synthetic high score band with low risk profile.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-HIGH-POS',
      'High-score positive quality',
      'high',
      'score-band',
      'Synthetic quality indicators strongly positive in high band.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-HIGH-POS',
      'High-score positive confidence',
      'high',
      1,
      'Synthetic high confidence in positive high-score band.',
    ),
  ],
  outcomeDistribution: dist(1, 1, 0, 0, 0, 0, 0, 0, ['Synthetic positive distribution.']),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 6: high-score-false-positive ────────────────────────────────────

export const HIGH_SCORE_FALSE_POSITIVE_FIXTURE = mustBuild({
  name: 'high-score-false-positive',
  kind: 'high-score-false-positive',
  scoreBandRange: band('high-band-floor', 'high-band-ceiling', 'high', [
    'Synthetic high score band with false-positive risk.',
  ]),
  outcomeReference: outcomeRef(
    'high-risk-false-positive-outcome',
    'high-risk-false-positive',
    'high',
    ['Synthetic high-score false-positive reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-HIGH-FP',
      'High-score false-positive risk',
      'moderate',
      'score-band',
      'Synthetic elevated band score misclassified as high-confidence positive.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-HIGH-FP',
      'High-score false-positive quality guard',
      'moderate',
      'score-band',
      'Synthetic quality guards reduce false-positive impact in high band.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-HIGH-FP',
      'High-score false-positive confidence',
      'moderate',
      1,
      'Synthetic moderate confidence given false-positive protection.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 1, 0, 0, 0, 0, 0, [
    'Synthetic false-positive distribution.',
  ]),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 7: manipulation-risk-avoidance ──────────────────────────────────

export const MANIPULATION_RISK_AVOIDANCE_FIXTURE = mustBuild({
  name: 'manipulation-risk-avoidance',
  kind: 'manipulation-risk-avoidance',
  scoreBandRange: band('manipulation-risk-floor', 'manipulation-risk-ceiling', 'low', [
    'Synthetic manipulation-risk score band.',
  ]),
  outcomeReference: outcomeRef(
    'manipulation-risk-avoided-outcome',
    'manipulation-risk-avoided',
    'low',
    ['Synthetic manipulation-risk avoidance reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-MANIP',
      'Manipulation risk avoidance indicator',
      'high',
      'manipulation',
      'Synthetic manipulation-risk signal safely mapped to avoidance band.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-MANIP-SAFETY',
      'Manipulation avoidance safety quality',
      'high',
      'score-band',
      'Synthetic quality preserved through manipulation-risk avoidance path.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-MANIP',
      'Manipulation-risk avoidance confidence',
      'high',
      1,
      'Synthetic confident avoidance in manipulation-risk band.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 1, 0, 0, 0, 0, [
    'Synthetic manipulation-risk distribution.',
  ]),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 8: creator-risk-avoidance ───────────────────────────────────────

export const CREATOR_RISK_AVOIDANCE_FIXTURE = mustBuild({
  name: 'creator-risk-avoidance',
  kind: 'creator-risk-avoidance',
  scoreBandRange: band('creator-risk-floor', 'creator-risk-ceiling', 'low', [
    'Synthetic creator-risk score band.',
  ]),
  outcomeReference: outcomeRef(
    'creator-risk-avoided-outcome',
    'creator-risk-avoided',
    'low',
    ['Synthetic creator-risk avoidance reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-CREATOR',
      'Creator risk avoidance indicator',
      'high',
      'creator',
      'Synthetic creator-risk signal mapped to safe avoidance band.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-CREATOR-SAFETY',
      'Creator avoidance safety quality',
      'high',
      'score-band',
      'Synthetic quality preserved through creator-risk avoidance.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-CREATOR',
      'Creator-risk avoidance confidence',
      'high',
      1,
      'Synthetic confident avoidance in creator-risk band.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 1, 0, 0, 0, 0, ['Synthetic creator-risk distribution.']),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 9: wallet-risk-avoidance ────────────────────────────────────────

export const WALLET_RISK_AVOIDANCE_FIXTURE = mustBuild({
  name: 'wallet-risk-avoidance',
  kind: 'wallet-risk-avoidance',
  scoreBandRange: band('wallet-risk-floor', 'wallet-risk-ceiling', 'low', [
    'Synthetic wallet-risk score band.',
  ]),
  outcomeReference: outcomeRef(
    'wallet-risk-avoided-outcome',
    'wallet-risk-avoided',
    'low',
    ['Synthetic wallet-risk avoidance reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-WALLET',
      'Wallet risk avoidance indicator',
      'high',
      'wallet-cluster',
      'Synthetic wallet-cluster risk mapped to safe avoidance band.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-WALLET-SAFETY',
      'Wallet avoidance safety quality',
      'high',
      'score-band',
      'Synthetic quality preserved through wallet-risk avoidance.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-WALLET',
      'Wallet-risk avoidance confidence',
      'high',
      1,
      'Synthetic confident avoidance in wallet-risk band.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 1, 0, 0, 0, 0, ['Synthetic wallet-risk distribution.']),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 10: insufficient-data ───────────────────────────────────────────

export const INSUFFICIENT_DATA_FIXTURE = mustBuild({
  name: 'insufficient-data',
  kind: 'insufficient-data',
  scoreBandRange: band('unknown-floor', 'unknown-ceiling', 'unknown', [
    'Synthetic insufficient-data band.',
  ]),
  outcomeReference: outcomeRef(
    'insufficient-data-skipped-outcome',
    'insufficient-data-skipped',
    'unknown',
    ['Synthetic insufficient-data reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-INSUFFICIENT',
      'Insufficient-data uncertainty risk',
      'moderate',
      'score-band',
      'Synthetic uncertainty in insufficient-data band.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-INSUFFICIENT',
      'Insufficient-data quality flag',
      'low',
      'score-band',
      'Synthetic quality cannot be assessed without sufficient data.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-INSUFFICIENT',
      'Insufficient-data confidence',
      'none',
      1,
      'Synthetic no confidence due to insufficient evidence.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 0, 1, 0, 0, 0, [
    'Synthetic insufficient-data distribution.',
  ]),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 11: missed-opportunity ──────────────────────────────────────────

export const MISSED_OPPORTUNITY_FIXTURE = mustBuild({
  name: 'missed-opportunity',
  kind: 'missed-opportunity',
  scoreBandRange: band('low-band-floor', 'medium-band-ceiling', 'low', [
    'Synthetic missed-opportunity band spanning low-medium.',
  ]),
  outcomeReference: outcomeRef(
    'missed-opportunity-outcome',
    'missed-opportunity',
    'low',
    ['Synthetic missed-opportunity reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-MISSED',
      'Missed-opportunity risk indicator',
      'low',
      'score-band',
      'Synthetic low risk but missed upside synthetic opportunity.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-MISSED',
      'Missed-opportunity quality signal',
      'moderate',
      'score-band',
      'Synthetic quality was present but not captured in band.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-MISSED',
      'Missed-opportunity confidence',
      'low',
      1,
      'Synthetic low confidence in missed-opportunity classification.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 0, 0, 1, 0, 0, [
    'Synthetic missed-opportunity distribution.',
  ]),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 12: drawdown-contained ──────────────────────────────────────────

export const DRAWDOWN_CONTAINED_FIXTURE = mustBuild({
  name: 'drawdown-contained',
  kind: 'drawdown-contained',
  scoreBandRange: band('medium-band-floor', 'high-band-ceiling', 'medium', [
    'Synthetic drawdown-contained band.',
  ]),
  outcomeReference: outcomeRef(
    'drawdown-contained-outcome',
    'drawdown-contained',
    'medium',
    ['Synthetic drawdown-contained reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-DRAWDOWN',
      'Drawdown-contained risk indicator',
      'moderate',
      'outcome',
      'Synthetic drawdown risk contained by safety-first band logic.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-DRAWDOWN',
      'Drawdown-contained quality',
      'moderate',
      'score-band',
      'Synthetic quality preserved through drawdown-containment band.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-DRAWDOWN',
      'Drawdown-contained confidence',
      'moderate',
      1,
      'Synthetic moderate confidence in drawdown-contained band.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 0, 0, 0, 1, 0, [
    'Synthetic drawdown-contained distribution.',
  ]),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 13: no-action-safety ────────────────────────────────────────────

export const NO_ACTION_SAFETY_FIXTURE = mustBuild({
  name: 'no-action-safety',
  kind: 'no-action-safety',
  scoreBandRange: band('safety-band-floor', 'safety-band-ceiling', 'unknown', [
    'Synthetic no-action safety band.',
  ]),
  outcomeReference: outcomeRef(
    'no-action-safety-outcome',
    'no-action-safety',
    'unknown',
    ['Synthetic no-action safety reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-NO-ACTION',
      'No-action safety risk',
      'low',
      'score-band',
      'Synthetic no-action safety band preserves safety-first invariants.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-NO-ACTION',
      'No-action safety quality',
      'high',
      'score-band',
      'Synthetic quality flags confirm safety-first no-action path.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-NO-ACTION',
      'No-action safety confidence',
      'high',
      1,
      'Synthetic high confidence in no-action safety band.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 0, 0, 0, 0, 1, ['Synthetic no-action distribution.']),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 14: malformed-input-safe ────────────────────────────────────────

export const MALFORMED_INPUT_SAFE_FIXTURE = mustBuild({
  name: 'malformed-input-safe',
  kind: 'malformed-input-safe',
  scoreBandRange: band('malformed-floor', 'malformed-ceiling', 'unknown', [
    'Synthetic malformed-input safe band.',
  ]),
  outcomeReference: outcomeRef(
    'malformed-input-safe-outcome',
    'malformed-input-safe',
    'unknown',
    ['Synthetic malformed-input reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-MALFORMED',
      'Malformed input safety risk',
      'moderate',
      'score-band',
      'Synthetic malformed input gracefully handled with safe defaults.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-MALFORMED',
      'Malformed input quality',
      'low',
      'score-band',
      'Synthetic low quality due to malformed input band.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-MALFORMED',
      'Malformed input confidence',
      'none',
      1,
      'Synthetic no confidence due to malformed input scenario.',
    ),
  ],
  outcomeDistribution: dist(1, 0, 0, 0, 1, 0, 0, 0, [
    'Synthetic malformed-input distribution.',
  ]),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture 15: dashboard-ready-score-band ──────────────────────────────────

export const DASHBOARD_READY_SCORE_BAND_FIXTURE = mustBuild({
  name: 'dashboard-ready-score-band',
  kind: 'dashboard-ready',
  scoreBandRange: band('dashboard-band-floor', 'dashboard-band-ceiling', 'high', [
    'Synthetic dashboard-ready score band.',
  ]),
  outcomeReference: outcomeRef(
    'dashboard-ready-replay-outcome',
    'dashboard-ready',
    'high',
    ['Synthetic dashboard-ready Phase 36 reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-DASHBOARD',
      'Dashboard-ready score band risk',
      'low',
      'score-band',
      'Synthetic dashboard-ready fixture has low risk profile.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-DASHBOARD',
      'Dashboard-ready score band quality',
      'high',
      'score-band',
      'Synthetic dashboard-ready quality indicators confirmed.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-DASHBOARD',
      'Dashboard-ready confidence',
      'high',
      1,
      'Synthetic high confidence in dashboard-ready band.',
    ),
  ],
  outcomeDistribution: dist(1, 1, 0, 0, 0, 0, 0, 0, ['Synthetic dashboard-ready distribution.']),
  safeNotes: ['Fixture-only.', 'Synthetic-only.', 'Dashboard-ready.', 'No execution.'],
});

// ─── Fixture 16: report-ready-score-band ─────────────────────────────────────

export const REPORT_READY_SCORE_BAND_FIXTURE = mustBuild({
  name: 'report-ready-score-band',
  kind: 'report-ready',
  scoreBandRange: band('report-band-floor', 'report-band-ceiling', 'high', [
    'Synthetic report-ready score band.',
  ]),
  outcomeReference: outcomeRef(
    'report-ready-replay-outcome',
    'report-ready',
    'high',
    ['Synthetic report-ready Phase 36 reference.'],
  ),
  riskIndicators: [
    risk(
      'SB-RISK-REPORT',
      'Report-ready score band risk',
      'low',
      'score-band',
      'Synthetic report-ready fixture has low risk profile.',
    ),
  ],
  qualityIndicators: [
    quality(
      'SB-QUAL-REPORT',
      'Report-ready score band quality',
      'high',
      'score-band',
      'Synthetic report-ready quality indicators confirmed.',
    ),
  ],
  confidenceIndicators: [
    confidence(
      'SB-CONF-REPORT',
      'Report-ready confidence',
      'high',
      1,
      'Synthetic high confidence in report-ready band.',
    ),
  ],
  outcomeDistribution: dist(1, 1, 0, 0, 0, 0, 0, 0, ['Synthetic report-ready distribution.']),
  safeNotes: ['Fixture-only.', 'Report-ready.', 'Synthetic-only.', 'No execution.'],
});

// ─── Fixture registry ─────────────────────────────────────────────────────────

export const PHASE_37_SCORE_BAND_OUTCOME_ANALYSIS_FIXTURES: ReadonlyMap<
  ScoreBandOutcomeAnalysisFixtureName,
  ScoreBandOutcomeAnalysisFixture
> = new Map([
  ['low-score-safe-skip', LOW_SCORE_SAFE_SKIP_FIXTURE],
  ['low-score-false-negative', LOW_SCORE_FALSE_NEGATIVE_FIXTURE],
  ['medium-score-watchlist-flat', MEDIUM_SCORE_WATCHLIST_FLAT_FIXTURE],
  ['medium-score-mixed-outcome', MEDIUM_SCORE_MIXED_OUTCOME_FIXTURE],
  ['high-score-positive-outcome', HIGH_SCORE_POSITIVE_OUTCOME_FIXTURE],
  ['high-score-false-positive', HIGH_SCORE_FALSE_POSITIVE_FIXTURE],
  ['manipulation-risk-avoidance', MANIPULATION_RISK_AVOIDANCE_FIXTURE],
  ['creator-risk-avoidance', CREATOR_RISK_AVOIDANCE_FIXTURE],
  ['wallet-risk-avoidance', WALLET_RISK_AVOIDANCE_FIXTURE],
  ['insufficient-data', INSUFFICIENT_DATA_FIXTURE],
  ['missed-opportunity', MISSED_OPPORTUNITY_FIXTURE],
  ['drawdown-contained', DRAWDOWN_CONTAINED_FIXTURE],
  ['no-action-safety', NO_ACTION_SAFETY_FIXTURE],
  ['malformed-input-safe', MALFORMED_INPUT_SAFE_FIXTURE],
  ['dashboard-ready-score-band', DASHBOARD_READY_SCORE_BAND_FIXTURE],
  ['report-ready-score-band', REPORT_READY_SCORE_BAND_FIXTURE],
]);

export function listScoreBandOutcomeAnalysisFixtures(): readonly ScoreBandOutcomeAnalysisFixtureName[] {
  return [...PHASE_37_SCORE_BAND_OUTCOME_ANALYSIS_FIXTURES.keys()].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function getScoreBandOutcomeAnalysisFixture(
  name: ScoreBandOutcomeAnalysisFixtureName,
): ScoreBandOutcomeAnalysisFixture | undefined {
  return PHASE_37_SCORE_BAND_OUTCOME_ANALYSIS_FIXTURES.get(name);
}
