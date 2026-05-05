import type { ReplayScenario, ReplayRun, RlResult } from './types.js';
import { buildReplayStepResult } from './replay-result.js';
import { buildReplaySummary } from './replay-summary.js';
import { validateReplayRun } from './validation.js';

let runCounter = 0;

function generateRunId(scenarioId: string): string {
  return `run_${scenarioId}_${++runCounter}_${Date.now()}`;
}

export function runReplayScenario(scenario: ReplayScenario): RlResult<ReplayRun> {
  const startedAt = new Date().toISOString();
  const stepResults = scenario.steps.map(step => buildReplayStepResult(step));
  const summary = buildReplaySummary(stepResults, scenario.expectedOutcome);
  const completedAt = new Date().toISOString();

  const run: ReplayRun = {
    runId: generateRunId(scenario.scenarioId),
    scenarioId: scenario.scenarioId,
    startedAt,
    completedAt,
    stepResults,
    summary,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };

  return validateReplayRun(run);
}
