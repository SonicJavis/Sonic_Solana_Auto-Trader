import type { ReplayScenario, ReplayStep, ReplayVerdict, RlResult } from './types.js';
import { validateReplayScenario } from './validation.js';

export interface BuildReplayScenarioInput {
  scenarioId: string;
  displayName: string;
  description: string;
  steps: ReplayStep[];
  expectedOutcome: ReplayVerdict;
}

export function buildReplayScenario(input: BuildReplayScenarioInput): RlResult<ReplayScenario> {
  const scenario: ReplayScenario = {
    scenarioId: input.scenarioId,
    displayName: input.displayName,
    description: input.description,
    steps: input.steps,
    expectedOutcome: input.expectedOutcome,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };
  return validateReplayScenario(scenario);
}
