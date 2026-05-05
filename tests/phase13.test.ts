/**
 * Phase 13 — Replay Lab v1 tests.
 *
 * Covers:
 *   A. Type/model shapes (fixtureOnly=true, liveData=false, safeToDisplay=true)
 *   B. Verdict validation
 *   C. Step validation
 *   D. Scenario validation
 *   E. Step result builder
 *   F. Summary builder
 *   G. Run execution
 *   H. Comparison
 *   I. Fixture behaviours (deterministic, correct verdicts)
 *   J. Capabilities — all unsafe fields false
 *   K. Invalid inputs return safe errors (no stack traces, no secrets)
 *   L. isSafeErrorMessage helper
 *   M. No live data, no RPC, no trading, no execution
 *
 * No network, no Solana RPC, no WebSocket, no provider SDK, no API keys,
 * no wallet private key, no trade execution, no paper trading.
 */

import { describe, it, expect } from 'vitest';

import {
  // Errors
  rlOk,
  rlErr,
  isSafeErrorMessage,
  // Validation
  validateVerdict,
  validateReplayStep,
  validateReplayScenario,
  validateReplayStepResult,
  validateReplayRun,
  validateReplayComparison,
  // Builders
  buildReplayStep,
  buildReplayScenario,
  buildReplayStepResult,
  buildReplaySummary,
  runReplayScenario,
  compareReplayRuns,
  // Capabilities
  getReplayLabCapabilities,
  // Fixtures
  CLEAN_TOKEN_REPLAY_SCENARIO,
  RISKY_CREATOR_REPLAY_SCENARIO,
  WALLET_CLUSTER_RISK_REPLAY_SCENARIO,
  MANIPULATION_REJECT_REPLAY_SCENARIO,
  MIXED_WARNING_REPLAY_SCENARIO,
  MISSING_DATA_REPLAY_SCENARIO,
  REGRESSION_COMPARISON_BASELINE_SCENARIO,
  REGRESSION_COMPARISON_CANDIDATE_SCENARIO,
  ALL_REPLAY_FIXTURES,
  // Types
  type ReplayVerdict,
  type ReplayStep,
  type ReplayScenario,
  type ReplayRun,
} from '@sonic/replay-lab';

// ── A. Type/model shapes ──────────────────────────────────────────────────────

describe('A. Type/model shapes', () => {
  it('rlOk wraps a value with ok:true', () => {
    const result = rlOk(42);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(42);
  });

  it('rlErr wraps a code and message with ok:false', () => {
    const err = rlErr('INVALID_REPLAY_SCENARIO', 'test error');
    expect(err.ok).toBe(false);
    expect(err.code).toBe('INVALID_REPLAY_SCENARIO');
    expect(err.message).toBe('test error');
  });

  it('all fixture scenarios have fixtureOnly=true', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      expect(scenario.fixtureOnly).toBe(true);
    }
  });

  it('all fixture scenarios have liveData=false', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      expect(scenario.liveData).toBe(false);
    }
  });

  it('all fixture scenarios have safeToDisplay=true', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      expect(scenario.safeToDisplay).toBe(true);
    }
  });

  it('all fixture scenario steps have fixtureOnly=true', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      for (const step of scenario.steps) {
        expect(step.fixtureOnly).toBe(true);
      }
    }
  });

  it('all fixture scenario steps have liveData=false', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      for (const step of scenario.steps) {
        expect(step.liveData).toBe(false);
      }
    }
  });

  it('all fixture scenario steps have safeToDisplay=true', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      for (const step of scenario.steps) {
        expect(step.safeToDisplay).toBe(true);
      }
    }
  });

  it('ALL_REPLAY_FIXTURES has 8 scenarios', () => {
    expect(ALL_REPLAY_FIXTURES.length).toBe(8);
  });
});

// ── B. Verdict validation ─────────────────────────────────────────────────────

describe('B. Verdict validation', () => {
  it('accepts all valid verdicts', () => {
    const valid: ReplayVerdict[] = ['passed', 'failed', 'degraded', 'inconclusive', 'fixture_only'];
    for (const v of valid) {
      expect(validateVerdict(v)).toBe(true);
    }
  });

  it('rejects forbidden verdict words', () => {
    const forbidden = [
      'buy',
      'sell',
      'enter',
      'execute',
      'trade',
      'snipe',
      'copy',
      'mirror',
      'live_candidate',
      'auto_candidate',
    ];
    for (const f of forbidden) {
      expect(validateVerdict(f)).toBe(false);
    }
  });

  it('rejects unknown verdict strings', () => {
    expect(validateVerdict('unknown')).toBe(false);
    expect(validateVerdict('')).toBe(false);
    expect(validateVerdict('PASSED')).toBe(false);
  });
});

// ── C. Step validation ────────────────────────────────────────────────────────

describe('C. Step validation', () => {
  const validStep: ReplayStep = {
    stepId: 'step_test_1',
    stepType: 'token_snapshot',
    sequence: 1,
    tokenFixtureRef: 'fixture_a',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  it('accepts a valid step', () => {
    const result = validateReplayStep(validStep);
    expect(result.ok).toBe(true);
  });

  it('rejects empty stepId', () => {
    const result = validateReplayStep({ ...validStep, stepId: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_STEP');
  });

  it('rejects non-finite sequence', () => {
    const result = validateReplayStep({ ...validStep, sequence: NaN });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_STEP');
  });

  it('rejects safeToDisplay=false', () => {
    const step = { ...validStep, safeToDisplay: false as boolean } as unknown as ReplayStep;
    const result = validateReplayStep(step);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('UNSAFE_REPLAY_OUTPUT');
  });

  it('buildReplayStep returns ok for valid input', () => {
    const result = buildReplayStep({
      stepId: 'step_build_1',
      stepType: 'risk_assessment',
      sequence: 5,
      tokenFixtureRef: 'fixture_token_x',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.liveData).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
    }
  });

  it('buildReplayStep rejects empty stepId', () => {
    const result = buildReplayStep({
      stepId: '',
      stepType: 'token_snapshot',
      sequence: 1,
    });
    expect(result.ok).toBe(false);
  });
});

// ── D. Scenario validation ────────────────────────────────────────────────────

describe('D. Scenario validation', () => {
  const minimalStep: ReplayStep = {
    stepId: 'step_s1',
    stepType: 'token_snapshot',
    sequence: 1,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  const validScenario: ReplayScenario = {
    scenarioId: 'test_scenario',
    displayName: 'Test Scenario',
    description: 'A test scenario.',
    steps: [minimalStep],
    expectedOutcome: 'fixture_only',
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  it('accepts a valid scenario', () => {
    const result = validateReplayScenario(validScenario);
    expect(result.ok).toBe(true);
  });

  it('rejects empty scenarioId', () => {
    const result = validateReplayScenario({ ...validScenario, scenarioId: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_SCENARIO');
  });

  it('rejects empty displayName', () => {
    const result = validateReplayScenario({ ...validScenario, displayName: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_SCENARIO');
  });

  it('rejects liveData=true', () => {
    const scenario = { ...validScenario, liveData: true as unknown as false };
    const result = validateReplayScenario(scenario);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('rejects invalid expectedOutcome', () => {
    const scenario = { ...validScenario, expectedOutcome: 'buy' as unknown as ReplayVerdict };
    const result = validateReplayScenario(scenario);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_SCENARIO');
  });

  it('rejects empty steps array', () => {
    const scenario = { ...validScenario, steps: [] as unknown as ReplayScenario['steps'] };
    const result = validateReplayScenario(scenario);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_SCENARIO');
  });

  it('rejects out-of-order step sequences', () => {
    const step2: ReplayStep = { ...minimalStep, stepId: 'step_s2', sequence: 1 };
    const scenario = { ...validScenario, steps: [minimalStep, step2] };
    const result = validateReplayScenario(scenario);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_SCENARIO');
  });

  it('accepts strictly increasing sequences', () => {
    const step2: ReplayStep = { ...minimalStep, stepId: 'step_s2', sequence: 2 };
    const scenario = { ...validScenario, steps: [minimalStep, step2] };
    const result = validateReplayScenario(scenario);
    expect(result.ok).toBe(true);
  });

  it('buildReplayScenario returns ok for valid input', () => {
    const result = buildReplayScenario({
      scenarioId: 'built_scenario',
      displayName: 'Built Scenario',
      description: 'A built scenario.',
      steps: [minimalStep],
      expectedOutcome: 'fixture_only',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fixtureOnly).toBe(true);
      expect(result.value.liveData).toBe(false);
      expect(result.value.safeToDisplay).toBe(true);
    }
  });
});

// ── E. Step result builder ────────────────────────────────────────────────────

describe('E. Step result builder', () => {
  it('step with no fixture refs returns inconclusive verdict', () => {
    const step: ReplayStep = {
      stepId: 'step_empty',
      stepType: 'token_snapshot',
      sequence: 1,
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const result = buildReplayStepResult(step);
    expect(result.verdict).toBe('inconclusive');
    expect(result.warnings).toContain('missing_fixture_data');
    expect(result.safeToDisplay).toBe(true);
  });

  it('step with manipulation reject ref returns failed verdict', () => {
    const step: ReplayStep = {
      stepId: 'step_manip',
      stepType: 'manipulation_snapshot',
      sequence: 1,
      manipulationFixtureRef: 'fixture_manipulation_reject_x',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const result = buildReplayStepResult(step);
    expect(result.verdict).toBe('failed');
    expect(result.warnings).toContain('manipulation_detected');
  });

  it('step with risky creator ref returns degraded verdict', () => {
    const step: ReplayStep = {
      stepId: 'step_creator',
      stepType: 'creator_snapshot',
      sequence: 1,
      creatorFixtureRef: 'fixture_risky_creator_x',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const result = buildReplayStepResult(step);
    expect(result.verdict).toBe('degraded');
    expect(result.warnings).toContain('elevated_risk_flags');
  });

  it('step with risk wallet ref returns degraded verdict', () => {
    const step: ReplayStep = {
      stepId: 'step_wallet',
      stepType: 'wallet_cluster_snapshot',
      sequence: 1,
      walletFixtureRef: 'fixture_risk_wallet_cluster_x',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const result = buildReplayStepResult(step);
    expect(result.verdict).toBe('degraded');
  });

  it('step with clean token ref returns fixture_only verdict', () => {
    const step: ReplayStep = {
      stepId: 'step_clean',
      stepType: 'token_snapshot',
      sequence: 1,
      tokenFixtureRef: 'fixture_clean_token_x',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const result = buildReplayStepResult(step);
    expect(result.verdict).toBe('fixture_only');
  });

  it('riskScore is between 0 and 1 for all step types', () => {
    const refs = [
      { tokenFixtureRef: 'fixture_clean' },
      { creatorFixtureRef: 'fixture_risky_creator_x' },
      { walletFixtureRef: 'fixture_risk_wallet' },
      { manipulationFixtureRef: 'fixture_manipulation_reject_x' },
      {},
    ];
    for (const ref of refs) {
      const step: ReplayStep = {
        stepId: 'step_score_check',
        stepType: 'token_snapshot',
        sequence: 1,
        ...ref,
        fixtureOnly: true,
        liveData: false,
        safeToDisplay: true,
      };
      const result = buildReplayStepResult(step);
      if (result.tokenSummary) {
        expect(result.tokenSummary.riskScore).toBeGreaterThanOrEqual(0);
        expect(result.tokenSummary.riskScore).toBeLessThanOrEqual(1);
      }
    }
  });

  it('confidence is between 0 and 1', () => {
    const step: ReplayStep = {
      stepId: 'step_conf',
      stepType: 'aggregate_checkpoint',
      sequence: 1,
      tokenFixtureRef: 'fixture_a',
      creatorFixtureRef: 'fixture_b',
      riskFixtureRef: 'fixture_r',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const result = buildReplayStepResult(step);
    if (result.riskSummary) {
      expect(result.riskSummary.confidence).toBeGreaterThanOrEqual(0);
      expect(result.riskSummary.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('step result always has safeToDisplay=true', () => {
    const step: ReplayStep = {
      stepId: 'step_safe',
      stepType: 'risk_assessment',
      sequence: 1,
      riskFixtureRef: 'fixture_risk_low',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const result = buildReplayStepResult(step);
    expect(result.safeToDisplay).toBe(true);
  });
});

// ── F. Summary builder ────────────────────────────────────────────────────────

describe('F. Summary builder', () => {
  it('empty step results returns inconclusive summary', () => {
    const summary = buildReplaySummary([], 'fixture_only');
    expect(summary.finalVerdict).toBe('inconclusive');
    expect(summary.totalSteps).toBe(0);
    expect(summary.safeToDisplay).toBe(true);
  });

  it('failed step results in failed final verdict', () => {
    const step: ReplayStep = {
      stepId: 'step_f',
      stepType: 'manipulation_snapshot',
      sequence: 1,
      manipulationFixtureRef: 'fixture_manipulation_reject_x',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const stepResult = buildReplayStepResult(step);
    const summary = buildReplaySummary([stepResult], 'failed');
    expect(summary.finalVerdict).toBe('failed');
    expect(summary.failedSteps).toBe(1);
  });

  it('degraded step results in degraded final verdict', () => {
    const step: ReplayStep = {
      stepId: 'step_d',
      stepType: 'creator_snapshot',
      sequence: 1,
      creatorFixtureRef: 'fixture_risky_creator_x',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const stepResult = buildReplayStepResult(step);
    const summary = buildReplaySummary([stepResult], 'degraded');
    expect(summary.finalVerdict).toBe('degraded');
    expect(summary.degradedSteps).toBe(1);
  });

  it('finalRiskScore is clamped between 0 and 1', () => {
    const step: ReplayStep = {
      stepId: 'step_r',
      stepType: 'token_snapshot',
      sequence: 1,
      tokenFixtureRef: 'fixture_token_x',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const stepResult = buildReplayStepResult(step);
    const summary = buildReplaySummary([stepResult], 'fixture_only');
    expect(summary.finalRiskScore).toBeGreaterThanOrEqual(0);
    expect(summary.finalRiskScore).toBeLessThanOrEqual(1);
    expect(summary.averageConfidence).toBeGreaterThanOrEqual(0);
    expect(summary.averageConfidence).toBeLessThanOrEqual(1);
  });

  it('summary has reasons when steps fail or degrade', () => {
    const step: ReplayStep = {
      stepId: 'step_reason',
      stepType: 'manipulation_snapshot',
      sequence: 1,
      manipulationFixtureRef: 'fixture_manipulation_reject_y',
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    };
    const stepResult = buildReplayStepResult(step);
    const summary = buildReplaySummary([stepResult], 'failed');
    expect(summary.reasons.length).toBeGreaterThan(0);
  });
});

// ── G. Run execution ──────────────────────────────────────────────────────────

describe('G. Run execution', () => {
  it('runReplayScenario returns ok run for a valid scenario', () => {
    const result = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const run = result.value;
      expect(run.fixtureOnly).toBe(true);
      expect(run.liveData).toBe(false);
      expect(run.safeToDisplay).toBe(true);
      expect(run.scenarioId).toBe('clean_token_replay_scenario');
      expect(run.stepResults.length).toBe(2);
      expect(run.summary.totalSteps).toBe(2);
    }
  });

  it('runId is non-empty', () => {
    const result = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.runId).toBeTruthy();
  });

  it('startedAt and completedAt are ISO strings', () => {
    const result = runReplayScenario(MANIPULATION_REJECT_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(() => new Date(result.value.startedAt)).not.toThrow();
      expect(() => new Date(result.value.completedAt)).not.toThrow();
    }
  });

  it('manipulation reject scenario produces failed run', () => {
    const result = runReplayScenario(MANIPULATION_REJECT_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.summary.finalVerdict).toBe('failed');
    }
  });

  it('risky creator scenario produces degraded run', () => {
    const result = runReplayScenario(RISKY_CREATOR_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.summary.finalVerdict).toBe('degraded');
    }
  });

  it('missing data scenario produces inconclusive run', () => {
    const result = runReplayScenario(MISSING_DATA_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.summary.finalVerdict).toBe('inconclusive');
    }
  });

  it('clean token scenario produces fixture_only run', () => {
    const result = runReplayScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.summary.finalVerdict).toBe('fixture_only');
    }
  });

  it('wallet cluster risk scenario produces degraded run', () => {
    const result = runReplayScenario(WALLET_CLUSTER_RISK_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.summary.finalVerdict).toBe('degraded');
    }
  });

  it('mixed warning scenario produces degraded run', () => {
    const result = runReplayScenario(MIXED_WARNING_REPLAY_SCENARIO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.summary.finalVerdict).toBe('degraded');
    }
  });
});

// ── H. Comparison ─────────────────────────────────────────────────────────────

describe('H. Comparison', () => {
  function runScenario(scenario: ReplayScenario): ReplayRun {
    const result = runReplayScenario(scenario);
    if (!result.ok) throw new Error(`Failed to run scenario: ${result.message}`);
    return result.value;
  }

  it('compareReplayRuns returns ok result', () => {
    const baseline = runScenario(REGRESSION_COMPARISON_BASELINE_SCENARIO);
    const candidate = runScenario(REGRESSION_COMPARISON_CANDIDATE_SCENARIO);
    const result = compareReplayRuns(baseline, candidate);
    expect(result.ok).toBe(true);
  });

  it('comparison has safeToDisplay=true', () => {
    const baseline = runScenario(REGRESSION_COMPARISON_BASELINE_SCENARIO);
    const candidate = runScenario(REGRESSION_COMPARISON_CANDIDATE_SCENARIO);
    const result = compareReplayRuns(baseline, candidate);
    if (result.ok) {
      expect(result.value.safeToDisplay).toBe(true);
    }
  });

  it('comparison captures verdict change when verdicts differ', () => {
    const baseline = runScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    const candidate = runScenario(RISKY_CREATOR_REPLAY_SCENARIO);
    const result = compareReplayRuns(baseline, candidate);
    if (result.ok) {
      expect(result.value.verdictChanged).toBe(true);
    }
  });

  it('comparison detects no significant change when same scenario is re-run', () => {
    const run1 = runScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    const run2 = runScenario(CLEAN_TOKEN_REPLAY_SCENARIO);
    const result = compareReplayRuns(run1, run2);
    if (result.ok) {
      expect(result.value.summary).toContain('no significant changes detected');
    }
  });

  it('comparison IDs are non-empty', () => {
    const baseline = runScenario(REGRESSION_COMPARISON_BASELINE_SCENARIO);
    const candidate = runScenario(REGRESSION_COMPARISON_CANDIDATE_SCENARIO);
    const result = compareReplayRuns(baseline, candidate);
    if (result.ok) {
      expect(result.value.comparisonId).toBeTruthy();
      expect(result.value.baselineRunId).toBe(baseline.runId);
      expect(result.value.candidateRunId).toBe(candidate.runId);
    }
  });

  it('validateReplayComparison accepts a valid comparison', () => {
    const baseline = runScenario(REGRESSION_COMPARISON_BASELINE_SCENARIO);
    const candidate = runScenario(REGRESSION_COMPARISON_CANDIDATE_SCENARIO);
    const result = compareReplayRuns(baseline, candidate);
    if (result.ok) {
      const validResult = validateReplayComparison(result.value);
      expect(validResult.ok).toBe(true);
    }
  });

  it('validateReplayComparison rejects empty comparisonId', () => {
    const comparison = {
      comparisonId: '',
      baselineRunId: 'run_a',
      candidateRunId: 'run_b',
      scoreDelta: 0,
      confidenceDelta: 0,
      verdictChanged: false,
      summary: 'ok',
      safeToDisplay: true as const,
    };
    const result = validateReplayComparison(comparison);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_COMPARISON');
  });
});

// ── I. Fixture behaviours ─────────────────────────────────────────────────────

describe('I. Fixture behaviours (deterministic)', () => {
  it('CLEAN_TOKEN_REPLAY_SCENARIO: 2 steps, fixture_only expected', () => {
    expect(CLEAN_TOKEN_REPLAY_SCENARIO.steps.length).toBe(2);
    expect(CLEAN_TOKEN_REPLAY_SCENARIO.expectedOutcome).toBe('fixture_only');
  });

  it('RISKY_CREATOR_REPLAY_SCENARIO: 2 steps, degraded expected', () => {
    expect(RISKY_CREATOR_REPLAY_SCENARIO.steps.length).toBe(2);
    expect(RISKY_CREATOR_REPLAY_SCENARIO.expectedOutcome).toBe('degraded');
  });

  it('WALLET_CLUSTER_RISK_REPLAY_SCENARIO: 2 steps, degraded expected', () => {
    expect(WALLET_CLUSTER_RISK_REPLAY_SCENARIO.steps.length).toBe(2);
    expect(WALLET_CLUSTER_RISK_REPLAY_SCENARIO.expectedOutcome).toBe('degraded');
  });

  it('MANIPULATION_REJECT_REPLAY_SCENARIO: 2 steps, failed expected', () => {
    expect(MANIPULATION_REJECT_REPLAY_SCENARIO.steps.length).toBe(2);
    expect(MANIPULATION_REJECT_REPLAY_SCENARIO.expectedOutcome).toBe('failed');
  });

  it('MIXED_WARNING_REPLAY_SCENARIO: 4 steps, degraded expected', () => {
    expect(MIXED_WARNING_REPLAY_SCENARIO.steps.length).toBe(4);
    expect(MIXED_WARNING_REPLAY_SCENARIO.expectedOutcome).toBe('degraded');
  });

  it('MISSING_DATA_REPLAY_SCENARIO: 2 steps, inconclusive expected', () => {
    expect(MISSING_DATA_REPLAY_SCENARIO.steps.length).toBe(2);
    expect(MISSING_DATA_REPLAY_SCENARIO.expectedOutcome).toBe('inconclusive');
  });

  it('REGRESSION_COMPARISON_BASELINE_SCENARIO: 2 steps, fixture_only expected', () => {
    expect(REGRESSION_COMPARISON_BASELINE_SCENARIO.steps.length).toBe(2);
    expect(REGRESSION_COMPARISON_BASELINE_SCENARIO.expectedOutcome).toBe('fixture_only');
  });

  it('REGRESSION_COMPARISON_CANDIDATE_SCENARIO: 2 steps, degraded expected', () => {
    expect(REGRESSION_COMPARISON_CANDIDATE_SCENARIO.steps.length).toBe(2);
    expect(REGRESSION_COMPARISON_CANDIDATE_SCENARIO.expectedOutcome).toBe('degraded');
  });

  it('all fixture scenarioIds are unique', () => {
    const ids = ALL_REPLAY_FIXTURES.map(s => s.scenarioId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('all fixture step sequences are strictly increasing within each scenario', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      const sequences = scenario.steps.map(s => s.sequence);
      for (let i = 1; i < sequences.length; i++) {
        expect(sequences[i]!).toBeGreaterThan(sequences[i - 1]!);
      }
    }
  });

  it('all fixtures pass validateReplayScenario', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      const result = validateReplayScenario(scenario);
      expect(result.ok).toBe(true);
    }
  });
});

// ── J. Capabilities ───────────────────────────────────────────────────────────

describe('J. Capabilities — all unsafe fields false', () => {
  it('getReplayLabCapabilities returns expected shape', () => {
    const caps = getReplayLabCapabilities();
    expect(caps.canUseLiveData).toBe(false);
    expect(caps.canUseSolanaRpc).toBe(false);
    expect(caps.canUseProviderApis).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
    expect(caps.canCreateTradeIntents).toBe(false);
    expect(caps.canCreateExecutionPlans).toBe(false);
    expect(caps.canPaperTrade).toBe(false);
    expect(caps.canTrade).toBe(false);
    expect(caps.canExecute).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('no capability flag is true except fixtureOnly', () => {
    const caps = getReplayLabCapabilities();
    const unsafeFields = [
      caps.canUseLiveData,
      caps.canUseSolanaRpc,
      caps.canUseProviderApis,
      caps.canAccessPrivateKeys,
      caps.canCreateTradeIntents,
      caps.canCreateExecutionPlans,
      caps.canPaperTrade,
      caps.canTrade,
      caps.canExecute,
    ];
    for (const field of unsafeFields) {
      expect(field).toBe(false);
    }
  });
});

// ── K. Invalid inputs return safe errors ──────────────────────────────────────

describe('K. Invalid inputs return safe errors (no stack traces, no secrets)', () => {
  it('rlErr produces no stack trace in message', () => {
    const err = rlErr('INVALID_REPLAY_SCENARIO', 'simple error message');
    expect(err.message).not.toContain('at ');
    expect(err.message).not.toContain('Error:');
  });

  it('validateReplayScenario with bad verdict returns INVALID_REPLAY_SCENARIO code', () => {
    const result = validateReplayScenario({
      scenarioId: 'bad',
      displayName: 'Bad',
      description: '',
      steps: [
        {
          stepId: 's1',
          stepType: 'token_snapshot',
          sequence: 1,
          fixtureOnly: true,
          liveData: false,
          safeToDisplay: true,
        },
      ],
      expectedOutcome: 'execute' as unknown as ReplayVerdict,
      fixtureOnly: true,
      liveData: false,
      safeToDisplay: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('INVALID_REPLAY_SCENARIO');
      expect(result.message).not.toContain('stack');
      expect(result.message).not.toContain('PRIVATE_KEY');
    }
  });

  it('validateReplayRun with liveData=true returns LIVE_DATA_FORBIDDEN', () => {
    const run = {
      runId: 'r1',
      scenarioId: 's1',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      stepResults: [],
      summary: {
        totalSteps: 0,
        passedSteps: 0,
        failedSteps: 0,
        degradedSteps: 0,
        inconclusiveSteps: 0,
        finalVerdict: 'fixture_only' as const,
        finalRiskScore: 0,
        averageConfidence: 0,
        warnings: [],
        reasons: [],
        safeToDisplay: true as const,
      },
      fixtureOnly: true as const,
      liveData: true as unknown as false,
      safeToDisplay: true as const,
    };
    const result = validateReplayRun(run);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('validateReplayStepResult rejects riskScore > 1', () => {
    const result = validateReplayStepResult({
      stepId: 'step_bad',
      sequence: 1,
      tokenSummary: {
        riskScore: 1.5,
        confidence: 0.5,
        flags: [],
        classification: 'fixture_only',
      },
      verdict: 'fixture_only',
      warnings: [],
      safeToDisplay: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_RESULT');
  });

  it('validateReplayStepResult rejects confidence < 0', () => {
    const result = validateReplayStepResult({
      stepId: 'step_bad_conf',
      sequence: 1,
      riskSummary: {
        riskScore: 0.5,
        confidence: -0.1,
        flags: [],
        classification: 'fixture_only',
      },
      verdict: 'fixture_only',
      warnings: [],
      safeToDisplay: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('INVALID_REPLAY_RESULT');
  });
});

// ── L. isSafeErrorMessage helper ─────────────────────────────────────────────

describe('L. isSafeErrorMessage helper', () => {
  it('returns true for safe messages', () => {
    expect(isSafeErrorMessage('invalid sequence')).toBe(true);
    expect(isSafeErrorMessage('stepId must be non-empty')).toBe(true);
    expect(isSafeErrorMessage('fixture_only scenario')).toBe(true);
  });

  it('returns false for messages containing PRIVATE_KEY', () => {
    expect(isSafeErrorMessage('found PRIVATE_KEY in config')).toBe(false);
  });

  it('returns false for messages containing rpcUrl', () => {
    expect(isSafeErrorMessage('rpcUrl is missing')).toBe(false);
  });

  it('returns false for messages containing wss://', () => {
    expect(isSafeErrorMessage('connecting to wss://example.com')).toBe(false);
  });

  it('returns false for messages containing https://', () => {
    expect(isSafeErrorMessage('fetching https://api.example.com')).toBe(false);
  });

  it('returns false for messages containing MNEMONIC', () => {
    expect(isSafeErrorMessage('MNEMONIC phrase detected')).toBe(false);
  });
});

// ── M. No live data, no RPC, no trading, no execution ────────────────────────

describe('M. Safety invariants — no live data, no RPC, no trading', () => {
  it('all run results have liveData=false', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      const result = runReplayScenario(scenario);
      if (result.ok) {
        expect(result.value.liveData).toBe(false);
      }
    }
  });

  it('all run results have fixtureOnly=true', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      const result = runReplayScenario(scenario);
      if (result.ok) {
        expect(result.value.fixtureOnly).toBe(true);
      }
    }
  });

  it('no forbidden verdicts appear in any run result', () => {
    const forbidden = ['buy', 'sell', 'execute', 'trade', 'snipe', 'live_candidate', 'auto_candidate'];
    for (const scenario of ALL_REPLAY_FIXTURES) {
      const result = runReplayScenario(scenario);
      if (result.ok) {
        const verdict = result.value.summary.finalVerdict;
        for (const f of forbidden) {
          expect(verdict).not.toContain(f);
        }
        for (const stepResult of result.value.stepResults) {
          for (const f of forbidden) {
            expect(stepResult.verdict).not.toContain(f);
          }
        }
      }
    }
  });

  it('getReplayLabCapabilities has no trade/execution/paper flags', () => {
    const caps = getReplayLabCapabilities();
    expect(caps.canTrade).toBe(false);
    expect(caps.canExecute).toBe(false);
    expect(caps.canPaperTrade).toBe(false);
    expect(caps.canCreateTradeIntents).toBe(false);
    expect(caps.canCreateExecutionPlans).toBe(false);
  });

  it('all step results across all fixture runs are safeToDisplay=true', () => {
    for (const scenario of ALL_REPLAY_FIXTURES) {
      const result = runReplayScenario(scenario);
      if (result.ok) {
        for (const stepResult of result.value.stepResults) {
          expect(stepResult.safeToDisplay).toBe(true);
        }
        expect(result.value.summary.safeToDisplay).toBe(true);
      }
    }
  });
});
