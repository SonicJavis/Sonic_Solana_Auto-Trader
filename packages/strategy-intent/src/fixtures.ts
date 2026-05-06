/**
 * packages/strategy-intent/src/fixtures.ts
 *
 * Phase 15 — Deterministic synthetic StrategyIntent fixtures.
 *
 * Rules:
 *   - synthetic data only
 *   - fixtureOnly: true, liveData: false, safeToDisplay: true
 *   - analysisOnly: true, nonExecutable: true
 *   - no real token mints, wallet addresses, private data
 *   - no real URLs, no provider names requiring live access
 *   - no network calls
 *   - deterministic across test runs (no Date.now() or random)
 */

import type { StrategyIntentFixture, StrategyIntent } from './types.js';

// ─── Shared safety notes ──────────────────────────────────────────────────────

const BASE_SAFETY_NOTES = [
  'This StrategyIntent is fixture-only, analysis-only, and non-executable.',
  'It does not recommend or enable any trading action.',
  'It does not create real trade intents or execution plans.',
  'It does not use live data, providers, wallets, or Solana RPC.',
  'All safety gates confirm no execution capability is present.',
  'This output is safe to display for human review only.',
] as const;

const BASE_GATES = [
  {
    gateId: 'fixture_only_gate',
    gateName: 'Fixture-Only Gate',
    status: 'passed' as const,
    reason: 'Input is fixture-only (fixtureOnly=true, liveData=false). All data is synthetic.',
    analysisOnly: true as const,
    nonExecutable: true as const,
    safeToDisplay: true as const,
  },
  {
    gateId: 'live_data_forbidden_gate',
    gateName: 'Live Data Forbidden Gate',
    status: 'passed' as const,
    reason: 'Live data is permanently forbidden. liveData=false is enforced.',
    analysisOnly: true as const,
    nonExecutable: true as const,
    safeToDisplay: true as const,
  },
  {
    gateId: 'execution_forbidden_gate',
    gateName: 'Execution Forbidden Gate',
    status: 'passed' as const,
    reason: 'Execution is permanently forbidden. nonExecutable=true is enforced.',
    analysisOnly: true as const,
    nonExecutable: true as const,
    safeToDisplay: true as const,
  },
  {
    gateId: 'trade_intent_forbidden_gate',
    gateName: 'Trade Intent Forbidden Gate',
    status: 'passed' as const,
    reason: 'Trade intents are permanently forbidden. canCreateTradeIntents=false is enforced.',
    analysisOnly: true as const,
    nonExecutable: true as const,
    safeToDisplay: true as const,
  },
  {
    gateId: 'paper_trading_forbidden_gate',
    gateName: 'Paper Trading Forbidden Gate',
    status: 'passed' as const,
    reason: 'Paper trading is permanently forbidden. canPaperTrade=false is enforced.',
    analysisOnly: true as const,
    nonExecutable: true as const,
    safeToDisplay: true as const,
  },
  {
    gateId: 'wallet_forbidden_gate',
    gateName: 'Wallet Forbidden Gate',
    status: 'passed' as const,
    reason: 'Wallet and key access is permanently forbidden. All wallet capability flags are false.',
    analysisOnly: true as const,
    nonExecutable: true as const,
    safeToDisplay: true as const,
  },
  {
    gateId: 'provider_forbidden_gate',
    gateName: 'Provider Forbidden Gate',
    status: 'passed' as const,
    reason: 'Provider API access is permanently forbidden. All provider and RPC capability flags are false.',
    analysisOnly: true as const,
    nonExecutable: true as const,
    safeToDisplay: true as const,
  },
  {
    gateId: 'reporting_safety_gate',
    gateName: 'Reporting Safety Gate',
    status: 'passed' as const,
    reason: 'Reporting safety constraints satisfied. Input is fixture-only and non-live.',
    analysisOnly: true as const,
    nonExecutable: true as const,
    safeToDisplay: true as const,
  },
] as const;

const BASE_FINDINGS_TAIL = [
  {
    severity: 'info' as const,
    code: 'ANALYSIS_ONLY',
    message: 'This StrategyIntent is analysis-only, fixture-only, and non-executable. No action is implied.',
    safeToDisplay: true as const,
  },
  {
    severity: 'info' as const,
    code: 'NOT_A_REAL_TRADE_INTENT',
    message: 'StrategyIntent is NOT a real trade intent. It does not enable or recommend trading.',
    safeToDisplay: true as const,
  },
] as const;

// ─── Clean fixture ─────────────────────────────────────────────────────────────

const CLEAN_INTENT: StrategyIntent = {
  id: 'si_fixture_clean_001',
  strategyFamily: 'defensive_new_launch_filter',
  classification: 'analysis_only',
  evidenceQuality: 'strong_fixture_evidence',
  confidence: 0.6,
  safetyGates: [
    ...BASE_GATES,
    {
      gateId: 'evidence_quality_gate',
      gateName: 'Evidence Quality Gate',
      status: 'passed' as const,
      reason: 'Evidence quality is strong_fixture_evidence. Sufficient fixture evidence for analysis review.',
      analysisOnly: true as const,
      nonExecutable: true as const,
      safeToDisplay: true as const,
    },
  ],
  rationale: {
    summary:
      'Defensive new-launch filter: fixture evidence shows low risk signals and adequate confidence for review. Fixture evidence confidence is strong and risk score is within acceptable bounds. Classification: analysis_only — fixture evidence reviewed; no action implied.',
    evidenceNotes: [
      'Source kind: replay_run_report.',
      'Source ID: rpt_fixture_clean_001.',
      'Final verdict from fixture: fixture_only.',
      'Final risk score: 0.180.',
      'Average confidence: 0.600.',
      'Fixture evidence confidence is strong and risk score is within acceptable bounds.',
    ],
    safetyNotes: BASE_SAFETY_NOTES,
    limitationNotes: [
      'All fixture data is synthetic. No real market conditions are modeled.',
      'Fixture evidence may not reflect current or future real-world conditions.',
      'No progression beyond fixture-only review is implied by this output.',
    ],
    reviewNotes: [
      'This StrategyIntent is classified as: analysis_only.',
      'This classification is for human review only and is not actionable.',
      'Analysis-only scenarios have passed basic fixture review. No action is implied.',
    ],
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
  },
  findings: [
    ...BASE_FINDINGS_TAIL,
  ],
  sourceKind: 'replay_run_report',
  sourceId: 'rpt_fixture_clean_001',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
};

export const CLEAN_STRATEGY_INTENT_FIXTURE: StrategyIntentFixture = {
  fixtureId: 'clean_strategy_intent_fixture',
  displayName: 'Clean Strategy Intent Fixture',
  description: 'A synthetic clean fixture with strong evidence and analysis_only classification.',
  intent: CLEAN_INTENT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Degraded creator fixture ─────────────────────────────────────────────────

const DEGRADED_CREATOR_INTENT: StrategyIntent = {
  id: 'si_fixture_degraded_creator_001',
  strategyFamily: 'creator_leaderboard_review',
  classification: 'watch_only',
  evidenceQuality: 'degraded_fixture_evidence',
  confidence: 0.6,
  safetyGates: [
    ...BASE_GATES,
    {
      gateId: 'evidence_quality_gate',
      gateName: 'Evidence Quality Gate',
      status: 'warning' as const,
      reason: 'Evidence quality is degraded_fixture_evidence. Weak or degraded evidence requires review.',
      analysisOnly: true as const,
      nonExecutable: true as const,
      safeToDisplay: true as const,
    },
  ],
  rationale: {
    summary:
      'Creator leaderboard review: degraded creator risk flags present in fixture evidence. Fixture evidence is degraded. Elevated risk flags observed in fixture data. Classification: watch_only — fixture evidence is degraded; review-only, not actionable.',
    evidenceNotes: [
      'Source kind: replay_run_report.',
      'Source ID: rpt_fixture_degraded_001.',
      'Final verdict from fixture: degraded.',
      'Final risk score: 0.710.',
      'Average confidence: 0.600.',
      'Warning count: 2.',
      'Degraded count: 2.',
      'Fixture evidence is degraded. Elevated risk flags observed in fixture data.',
    ],
    safetyNotes: BASE_SAFETY_NOTES,
    limitationNotes: [
      'All fixture data is synthetic. No real market conditions are modeled.',
      'Fixture evidence may not reflect current or future real-world conditions.',
      'No progression beyond fixture-only review is implied by this output.',
    ],
    reviewNotes: [
      'This StrategyIntent is classified as: watch_only.',
      'This classification is for human review only and is not actionable.',
      'Watch-only scenarios require additional fixture evidence before any human review decision.',
    ],
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
  },
  findings: [
    {
      severity: 'warning',
      code: 'FIXTURE_EVIDENCE_DEGRADED',
      message: 'Fixture evidence shows degraded outcome. Elevated risk flags observed.',
      safeToDisplay: true,
    },
    ...BASE_FINDINGS_TAIL,
  ],
  sourceKind: 'replay_run_report',
  sourceId: 'rpt_fixture_degraded_001',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
};

export const DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE: StrategyIntentFixture = {
  fixtureId: 'degraded_creator_strategy_intent_fixture',
  displayName: 'Degraded Creator Strategy Intent Fixture',
  description: 'A synthetic fixture with degraded creator evidence and watch_only classification.',
  intent: DEGRADED_CREATOR_INTENT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Degraded wallet fixture ──────────────────────────────────────────────────

const DEGRADED_WALLET_INTENT: StrategyIntent = {
  id: 'si_fixture_degraded_wallet_001',
  strategyFamily: 'wallet_cluster_review',
  classification: 'watch_only',
  evidenceQuality: 'degraded_fixture_evidence',
  confidence: 0.6,
  safetyGates: [
    ...BASE_GATES,
    {
      gateId: 'evidence_quality_gate',
      gateName: 'Evidence Quality Gate',
      status: 'warning' as const,
      reason: 'Evidence quality is degraded_fixture_evidence. Weak or degraded evidence requires review.',
      analysisOnly: true as const,
      nonExecutable: true as const,
      safeToDisplay: true as const,
    },
  ],
  rationale: {
    summary:
      'Wallet cluster review: degraded wallet cluster risk signals detected in fixture evidence. Fixture evidence is degraded. Elevated risk flags observed in fixture data. Classification: watch_only — fixture evidence is degraded; review-only, not actionable.',
    evidenceNotes: [
      'Source kind: replay_run_report.',
      'Source ID: rpt_fixture_wallet_degraded_001.',
      'Final verdict from fixture: degraded.',
      'Fixture evidence is degraded. Elevated risk flags observed in fixture data.',
    ],
    safetyNotes: BASE_SAFETY_NOTES,
    limitationNotes: [
      'All fixture data is synthetic. No real market conditions are modeled.',
      'Fixture evidence may not reflect current or future real-world conditions.',
      'No progression beyond fixture-only review is implied by this output.',
    ],
    reviewNotes: [
      'This StrategyIntent is classified as: watch_only.',
      'This classification is for human review only and is not actionable.',
      'Watch-only scenarios require additional fixture evidence before any human review decision.',
    ],
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
  },
  findings: [
    {
      severity: 'warning',
      code: 'FIXTURE_EVIDENCE_DEGRADED',
      message: 'Fixture evidence shows degraded outcome. Elevated risk flags observed.',
      safeToDisplay: true,
    },
    ...BASE_FINDINGS_TAIL,
  ],
  sourceKind: 'replay_run_report',
  sourceId: 'rpt_fixture_wallet_degraded_001',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
};

export const DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE: StrategyIntentFixture = {
  fixtureId: 'degraded_wallet_strategy_intent_fixture',
  displayName: 'Degraded Wallet Strategy Intent Fixture',
  description: 'A synthetic fixture with degraded wallet cluster evidence and watch_only classification.',
  intent: DEGRADED_WALLET_INTENT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Failed manipulation fixture ──────────────────────────────────────────────

const FAILED_MANIPULATION_INTENT: StrategyIntent = {
  id: 'si_fixture_failed_manipulation_001',
  strategyFamily: 'manipulation_avoidance_review',
  classification: 'reject',
  evidenceQuality: 'failed_fixture_evidence',
  confidence: 0.6,
  safetyGates: [
    ...BASE_GATES,
    {
      gateId: 'evidence_quality_gate',
      gateName: 'Evidence Quality Gate',
      status: 'blocked' as const,
      reason: 'Evidence quality is failed_fixture_evidence. Insufficient or failed evidence blocks any progression.',
      analysisOnly: true as const,
      nonExecutable: true as const,
      safeToDisplay: true as const,
    },
  ],
  rationale: {
    summary:
      'Manipulation avoidance review: failed or critical risk signals detected in fixture evidence. Fixture evidence has failed verdict. This scenario does not pass analysis gates. Classification: reject — fixture evidence shows critical issues.',
    evidenceNotes: [
      'Source kind: replay_run_report.',
      'Source ID: rpt_fixture_failed_001.',
      'Final verdict from fixture: failed.',
      'Final risk score: 0.900.',
      'Average confidence: 0.600.',
      'Warning count: 2.',
      'Failure count: 2.',
      'Fixture evidence has failed verdict. This scenario does not pass analysis gates.',
    ],
    safetyNotes: BASE_SAFETY_NOTES,
    limitationNotes: [
      'All fixture data is synthetic. No real market conditions are modeled.',
      'Fixture evidence may not reflect current or future real-world conditions.',
      'Manipulation signals in fixtures are synthetic and not based on live chain data.',
      'No progression beyond fixture-only review is implied by this output.',
    ],
    reviewNotes: [
      'This StrategyIntent is classified as: reject.',
      'This classification is for human review only and is not actionable.',
      'Rejected scenarios should not be progressed until fixture evidence improves substantially.',
    ],
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
  },
  findings: [
    {
      severity: 'failure',
      code: 'FIXTURE_EVIDENCE_FAILED',
      message: 'Fixture evidence has a failed verdict. This scenario is rejected for analysis progression.',
      safeToDisplay: true,
    },
    {
      severity: 'failure',
      code: 'MANIPULATION_SIGNAL_DETECTED',
      message: 'Fixture evidence shows manipulation-like signals. Scenario is rejected for analysis progression.',
      safeToDisplay: true,
    },
    ...BASE_FINDINGS_TAIL,
  ],
  sourceKind: 'replay_run_report',
  sourceId: 'rpt_fixture_failed_001',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
};

export const FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE: StrategyIntentFixture = {
  fixtureId: 'failed_manipulation_strategy_intent_fixture',
  displayName: 'Failed Manipulation Strategy Intent Fixture',
  description: 'A synthetic fixture with failed manipulation evidence and reject classification.',
  intent: FAILED_MANIPULATION_INTENT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Inconclusive fixture ─────────────────────────────────────────────────────

const INCONCLUSIVE_INTENT: StrategyIntent = {
  id: 'si_fixture_inconclusive_001',
  strategyFamily: 'insufficient_evidence_review',
  classification: 'insufficient_evidence',
  evidenceQuality: 'inconclusive_fixture_evidence',
  confidence: 0.3,
  safetyGates: [
    ...BASE_GATES,
    {
      gateId: 'evidence_quality_gate',
      gateName: 'Evidence Quality Gate',
      status: 'blocked' as const,
      reason: 'Evidence quality is inconclusive_fixture_evidence. Insufficient or failed evidence blocks any progression.',
      analysisOnly: true as const,
      nonExecutable: true as const,
      safeToDisplay: true as const,
    },
  ],
  rationale: {
    summary:
      'Insufficient evidence review: fixture data is missing, inconclusive, or below threshold for classification. Fixture evidence is inconclusive. Insufficient data to determine quality. Classification: insufficient_evidence — fixture data is missing or inconclusive.',
    evidenceNotes: [
      'Source kind: replay_run_report.',
      'Source ID: rpt_fixture_inconclusive_001.',
      'Final verdict from fixture: inconclusive.',
      'Final risk score: 0.500.',
      'Average confidence: 0.300.',
      'Warning count: 2.',
      'Inconclusive count: 2.',
      'Fixture evidence is inconclusive. Insufficient data to determine quality.',
    ],
    safetyNotes: BASE_SAFETY_NOTES,
    limitationNotes: [
      'All fixture data is synthetic. No real market conditions are modeled.',
      'Fixture evidence may not reflect current or future real-world conditions.',
      'Insufficient fixture coverage limits the reliability of this analysis.',
      'No progression beyond fixture-only review is implied by this output.',
    ],
    reviewNotes: [
      'This StrategyIntent is classified as: insufficient_evidence.',
      'This classification is for human review only and is not actionable.',
      'Insufficient evidence scenarios need more fixture coverage before classification is reliable.',
    ],
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
  },
  findings: [
    {
      severity: 'inconclusive',
      code: 'FIXTURE_EVIDENCE_INCONCLUSIVE',
      message: 'Fixture evidence is inconclusive. Insufficient data to determine outcome.',
      safeToDisplay: true,
    },
    ...BASE_FINDINGS_TAIL,
  ],
  sourceKind: 'replay_run_report',
  sourceId: 'rpt_fixture_inconclusive_001',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
};

export const INCONCLUSIVE_STRATEGY_INTENT_FIXTURE: StrategyIntentFixture = {
  fixtureId: 'inconclusive_strategy_intent_fixture',
  displayName: 'Inconclusive Strategy Intent Fixture',
  description: 'A synthetic fixture with inconclusive evidence and insufficient_evidence classification.',
  intent: INCONCLUSIVE_INTENT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── Regression fixture ───────────────────────────────────────────────────────

const REGRESSION_INTENT: StrategyIntent = {
  id: 'si_fixture_regression_001',
  strategyFamily: 'replay_regression_review',
  classification: 'watch_only',
  evidenceQuality: 'degraded_fixture_evidence',
  confidence: 0.0,
  safetyGates: [
    ...BASE_GATES,
    {
      gateId: 'evidence_quality_gate',
      gateName: 'Evidence Quality Gate',
      status: 'warning' as const,
      reason: 'Evidence quality is degraded_fixture_evidence. Weak or degraded evidence requires review.',
      analysisOnly: true as const,
      nonExecutable: true as const,
      safeToDisplay: true as const,
    },
  ],
  rationale: {
    summary:
      'Replay regression review: score or verdict change detected between baseline and candidate fixture runs. Fixture evidence is degraded. Elevated risk flags observed in fixture data. Classification: watch_only — fixture evidence is degraded; review-only, not actionable.',
    evidenceNotes: [
      'Source kind: replay_comparison_report.',
      'Source ID: crpt_fixture_regression_001.',
      'Regression detected in comparison fixture data.',
      'Verdict changed between baseline and candidate fixture runs.',
      'Score delta: 0.210.',
      'Fixture evidence is degraded. Elevated risk flags observed in fixture data.',
    ],
    safetyNotes: BASE_SAFETY_NOTES,
    limitationNotes: [
      'All fixture data is synthetic. No real market conditions are modeled.',
      'Fixture evidence may not reflect current or future real-world conditions.',
      'Regression is detected between fixture baseline and candidate runs only.',
      'No progression beyond fixture-only review is implied by this output.',
    ],
    reviewNotes: [
      'This StrategyIntent is classified as: watch_only.',
      'This classification is for human review only and is not actionable.',
      'Watch-only scenarios require additional fixture evidence before any human review decision.',
    ],
    safeToDisplay: true,
    analysisOnly: true,
    nonExecutable: true,
  },
  findings: [
    {
      severity: 'warning',
      code: 'FIXTURE_EVIDENCE_DEGRADED',
      message: 'Fixture evidence shows degraded outcome. Elevated risk flags observed.',
      safeToDisplay: true,
    },
    {
      severity: 'risk',
      code: 'REGRESSION_DETECTED',
      message: 'Regression detected in comparison between baseline and candidate fixture runs.',
      safeToDisplay: true,
    },
    {
      severity: 'warning',
      code: 'VERDICT_CHANGED',
      message: 'Verdict changed between baseline and candidate fixture runs.',
      safeToDisplay: true,
    },
    ...BASE_FINDINGS_TAIL,
  ],
  sourceKind: 'replay_comparison_report',
  sourceId: 'crpt_fixture_regression_001',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
  analysisOnly: true,
  nonExecutable: true,
};

export const REGRESSION_STRATEGY_INTENT_FIXTURE: StrategyIntentFixture = {
  fixtureId: 'regression_strategy_intent_fixture',
  displayName: 'Regression Strategy Intent Fixture',
  description: 'A synthetic fixture detecting regression between baseline and candidate fixture runs.',
  intent: REGRESSION_INTENT,
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

// ─── All fixtures ─────────────────────────────────────────────────────────────

export const ALL_STRATEGY_INTENT_FIXTURES: readonly StrategyIntentFixture[] = [
  CLEAN_STRATEGY_INTENT_FIXTURE,
  DEGRADED_CREATOR_STRATEGY_INTENT_FIXTURE,
  DEGRADED_WALLET_STRATEGY_INTENT_FIXTURE,
  FAILED_MANIPULATION_STRATEGY_INTENT_FIXTURE,
  INCONCLUSIVE_STRATEGY_INTENT_FIXTURE,
  REGRESSION_STRATEGY_INTENT_FIXTURE,
];
