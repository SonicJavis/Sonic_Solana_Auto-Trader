import type { ReplayScenario } from './types.js';

export const CLEAN_TOKEN_REPLAY_SCENARIO: ReplayScenario = {
  scenarioId: 'clean_token_replay_scenario',
  displayName: 'Clean Token Replay',
  description: 'A synthetic clean token with low risk, high confidence, fixture-only replay.',
  steps: [
    {
      stepId: 'step_clean_token_1',
      stepType: 'token_snapshot',
      sequence: 1,
      tokenFixtureRef: 'fixture_clean_token_a',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_clean_token_2',
      stepType: 'risk_assessment',
      sequence: 2,
      tokenFixtureRef: 'fixture_clean_token_a',
      riskFixtureRef: 'fixture_risk_low',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
  ],
  expectedOutcome: 'fixture_only',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const RISKY_CREATOR_REPLAY_SCENARIO: ReplayScenario = {
  scenarioId: 'risky_creator_replay_scenario',
  displayName: 'Risky Creator Replay',
  description: 'A synthetic scenario with an elevated-risk creator profile.',
  steps: [
    {
      stepId: 'step_risky_creator_1',
      stepType: 'creator_snapshot',
      sequence: 1,
      creatorFixtureRef: 'fixture_risky_creator_b',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_risky_creator_2',
      stepType: 'risk_assessment',
      sequence: 2,
      creatorFixtureRef: 'fixture_risky_creator_b',
      riskFixtureRef: 'fixture_risk_high',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
  ],
  expectedOutcome: 'degraded',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const WALLET_CLUSTER_RISK_REPLAY_SCENARIO: ReplayScenario = {
  scenarioId: 'wallet_cluster_risk_replay_scenario',
  displayName: 'Wallet Cluster Risk Replay',
  description: 'A synthetic scenario with a high-risk wallet cluster.',
  steps: [
    {
      stepId: 'step_wallet_risk_1',
      stepType: 'wallet_cluster_snapshot',
      sequence: 1,
      walletFixtureRef: 'fixture_risk_wallet_cluster_c',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_wallet_risk_2',
      stepType: 'aggregate_checkpoint',
      sequence: 2,
      walletFixtureRef: 'fixture_risk_wallet_cluster_c',
      riskFixtureRef: 'fixture_risk_high',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
  ],
  expectedOutcome: 'degraded',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const MANIPULATION_REJECT_REPLAY_SCENARIO: ReplayScenario = {
  scenarioId: 'manipulation_reject_replay_scenario',
  displayName: 'Manipulation Reject Replay',
  description:
    'A synthetic scenario where bundle/manipulation detection triggers a failed outcome.',
  steps: [
    {
      stepId: 'step_manip_reject_1',
      stepType: 'manipulation_snapshot',
      sequence: 1,
      manipulationFixtureRef: 'fixture_manipulation_reject_d',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_manip_reject_2',
      stepType: 'risk_assessment',
      sequence: 2,
      manipulationFixtureRef: 'fixture_manipulation_reject_d',
      riskFixtureRef: 'fixture_risk_critical',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
  ],
  expectedOutcome: 'failed',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const MIXED_WARNING_REPLAY_SCENARIO: ReplayScenario = {
  scenarioId: 'mixed_warning_replay_scenario',
  displayName: 'Mixed Warning Replay',
  description:
    'A synthetic scenario with multiple warning signals across token, creator, and wallet layers.',
  steps: [
    {
      stepId: 'step_mixed_1',
      stepType: 'token_snapshot',
      sequence: 1,
      tokenFixtureRef: 'fixture_token_warnings_e',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_mixed_2',
      stepType: 'creator_snapshot',
      sequence: 2,
      creatorFixtureRef: 'fixture_creator_warnings_e',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_mixed_3',
      stepType: 'wallet_cluster_snapshot',
      sequence: 3,
      walletFixtureRef: 'fixture_wallet_warnings_e',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_mixed_4',
      stepType: 'aggregate_checkpoint',
      sequence: 4,
      tokenFixtureRef: 'fixture_token_warnings_e',
      creatorFixtureRef: 'fixture_creator_warnings_e',
      walletFixtureRef: 'fixture_wallet_warnings_e',
      riskFixtureRef: 'fixture_risk_mixed',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
  ],
  expectedOutcome: 'degraded',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const MISSING_DATA_REPLAY_SCENARIO: ReplayScenario = {
  scenarioId: 'missing_data_replay_scenario',
  displayName: 'Missing Data Replay',
  description:
    'A synthetic scenario with missing fixture data, expected to produce an inconclusive outcome.',
  steps: [
    {
      stepId: 'step_missing_1',
      stepType: 'token_snapshot',
      sequence: 1,
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_missing_2',
      stepType: 'risk_assessment',
      sequence: 2,
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
  ],
  expectedOutcome: 'inconclusive',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const REGRESSION_COMPARISON_BASELINE_SCENARIO: ReplayScenario = {
  scenarioId: 'regression_comparison_baseline',
  displayName: 'Regression Comparison Baseline',
  description: 'Baseline scenario for regression comparison testing.',
  steps: [
    {
      stepId: 'step_regression_base_1',
      stepType: 'token_snapshot',
      sequence: 1,
      tokenFixtureRef: 'fixture_regression_token_f',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_regression_base_2',
      stepType: 'risk_assessment',
      sequence: 2,
      tokenFixtureRef: 'fixture_regression_token_f',
      riskFixtureRef: 'fixture_risk_baseline',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
  ],
  expectedOutcome: 'fixture_only',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const REGRESSION_COMPARISON_CANDIDATE_SCENARIO: ReplayScenario = {
  scenarioId: 'regression_comparison_candidate',
  displayName: 'Regression Comparison Candidate',
  description:
    'Candidate scenario for regression comparison testing (slightly elevated risk vs baseline).',
  steps: [
    {
      stepId: 'step_regression_cand_1',
      stepType: 'token_snapshot',
      sequence: 1,
      tokenFixtureRef: 'fixture_regression_token_f',
      creatorFixtureRef: 'fixture_risky_creator_b',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
    {
      stepId: 'step_regression_cand_2',
      stepType: 'risk_assessment',
      sequence: 2,
      tokenFixtureRef: 'fixture_regression_token_f',
      creatorFixtureRef: 'fixture_risky_creator_b',
      riskFixtureRef: 'fixture_risk_elevated',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    },
  ],
  expectedOutcome: 'degraded',
  fixtureOnly: true,
  liveData: false,
  safeToDisplay: true,
};

export const ALL_REPLAY_FIXTURES = [
  CLEAN_TOKEN_REPLAY_SCENARIO,
  RISKY_CREATOR_REPLAY_SCENARIO,
  WALLET_CLUSTER_RISK_REPLAY_SCENARIO,
  MANIPULATION_REJECT_REPLAY_SCENARIO,
  MIXED_WARNING_REPLAY_SCENARIO,
  MISSING_DATA_REPLAY_SCENARIO,
  REGRESSION_COMPARISON_BASELINE_SCENARIO,
  REGRESSION_COMPARISON_CANDIDATE_SCENARIO,
] as const;
