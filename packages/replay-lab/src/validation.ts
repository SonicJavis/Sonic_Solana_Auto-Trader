import type {
  ReplayScenario,
  ReplayStep,
  ReplayRun,
  ReplayStepResult,
  ReplayComparison,
  ReplayVerdict,
  RlResult,
} from './types.js';
import { rlErr, rlOk } from './errors.js';

const VALID_VERDICTS: readonly ReplayVerdict[] = [
  'passed',
  'failed',
  'degraded',
  'inconclusive',
  'fixture_only',
];
const FORBIDDEN_VERDICT_WORDS = [
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

export function validateVerdict(verdict: string): verdict is ReplayVerdict {
  if (!VALID_VERDICTS.includes(verdict as ReplayVerdict)) return false;
  if (FORBIDDEN_VERDICT_WORDS.some(w => verdict.toLowerCase().includes(w))) return false;
  return true;
}

export function validateReplayStep(step: ReplayStep): RlResult<ReplayStep> {
  if (!step.stepId || step.stepId.trim() === '')
    return rlErr('INVALID_REPLAY_STEP', 'stepId must be non-empty');
  if (typeof step.sequence !== 'number' || !isFinite(step.sequence))
    return rlErr('INVALID_REPLAY_STEP', 'sequence must be finite number');
  if (step.fixtureOnly !== true)
    return rlErr('INVALID_REPLAY_STEP', 'fixtureOnly must be true');
  if (step.liveData !== false)
    return rlErr('INVALID_REPLAY_STEP', 'liveData must be false');
  if (!step.safeToDisplay)
    return rlErr('UNSAFE_REPLAY_OUTPUT', 'safeToDisplay must be true');
  return rlOk(step);
}

export function validateReplayScenario(scenario: ReplayScenario): RlResult<ReplayScenario> {
  if (!scenario.scenarioId || scenario.scenarioId.trim() === '')
    return rlErr('INVALID_REPLAY_SCENARIO', 'scenarioId must be non-empty');
  if (!scenario.displayName || scenario.displayName.trim() === '')
    return rlErr('INVALID_REPLAY_SCENARIO', 'displayName must be non-empty');
  if (scenario.liveData !== false)
    return rlErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');
  if (!validateVerdict(scenario.expectedOutcome))
    return rlErr('INVALID_REPLAY_SCENARIO', 'expectedOutcome is not a valid safe verdict');
  if (!Array.isArray(scenario.steps as unknown[]) || scenario.steps.length === 0)
    return rlErr('INVALID_REPLAY_SCENARIO', 'steps must be a non-empty array');

  for (const step of scenario.steps) {
    const result = validateReplayStep(step);
    if (!result.ok) return result;
  }

  const sequences = scenario.steps.map(s => s.sequence);
  for (let i = 1; i < sequences.length; i++) {
    if ((sequences[i] ?? 0) <= (sequences[i - 1] ?? 0))
      return rlErr('INVALID_REPLAY_SCENARIO', 'step sequences must be strictly increasing');
  }

  return rlOk(scenario);
}

export function validateReplayStepResult(result: ReplayStepResult): RlResult<ReplayStepResult> {
  if (!result.stepId || result.stepId.trim() === '')
    return rlErr('INVALID_REPLAY_RESULT', 'stepId must be non-empty');
  if (typeof result.sequence !== 'number' || !isFinite(result.sequence))
    return rlErr('INVALID_REPLAY_RESULT', 'sequence must be finite');
  if (!validateVerdict(result.verdict))
    return rlErr('INVALID_REPLAY_RESULT', 'verdict is not a valid safe verdict');
  if (result.safeToDisplay !== true)
    return rlErr('UNSAFE_REPLAY_OUTPUT', 'safeToDisplay must be true');

  for (const summary of [
    result.tokenSummary,
    result.creatorSummary,
    result.walletSummary,
    result.manipulationSummary,
    result.riskSummary,
  ]) {
    if (summary) {
      if (summary.riskScore < 0 || summary.riskScore > 1)
        return rlErr('INVALID_REPLAY_RESULT', 'riskScore must be between 0 and 1');
      if (summary.confidence < 0 || summary.confidence > 1)
        return rlErr('INVALID_REPLAY_RESULT', 'confidence must be between 0 and 1');
    }
  }

  return rlOk(result);
}

export function validateReplayRun(run: ReplayRun): RlResult<ReplayRun> {
  if (!run.runId || run.runId.trim() === '')
    return rlErr('INVALID_REPLAY_RUN', 'runId must be non-empty');
  if (!run.scenarioId || run.scenarioId.trim() === '')
    return rlErr('INVALID_REPLAY_RUN', 'scenarioId must be non-empty');
  if (run.fixtureOnly !== true)
    return rlErr('INVALID_REPLAY_RUN', 'fixtureOnly must be true');
  if (run.liveData !== false)
    return rlErr('LIVE_DATA_FORBIDDEN', 'liveData must be false');
  if (run.safeToDisplay !== true)
    return rlErr('UNSAFE_REPLAY_OUTPUT', 'safeToDisplay must be true');
  return rlOk(run);
}

export function validateReplayComparison(comparison: ReplayComparison): RlResult<ReplayComparison> {
  if (!comparison.comparisonId || comparison.comparisonId.trim() === '')
    return rlErr('INVALID_REPLAY_COMPARISON', 'comparisonId must be non-empty');
  if (!comparison.baselineRunId || comparison.baselineRunId.trim() === '')
    return rlErr('INVALID_REPLAY_COMPARISON', 'baselineRunId must be non-empty');
  if (!comparison.candidateRunId || comparison.candidateRunId.trim() === '')
    return rlErr('INVALID_REPLAY_COMPARISON', 'candidateRunId must be non-empty');
  if (comparison.safeToDisplay !== true)
    return rlErr('UNSAFE_REPLAY_OUTPUT', 'safeToDisplay must be true');
  return rlOk(comparison);
}
