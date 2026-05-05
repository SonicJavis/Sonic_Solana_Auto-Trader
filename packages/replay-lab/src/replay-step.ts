import type { ReplayStep, ReplayStepType, RlResult } from './types.js';
import { validateReplayStep } from './validation.js';

export interface BuildReplayStepInput {
  stepId: string;
  stepType: ReplayStepType;
  sequence: number;
  tokenFixtureRef?: string;
  creatorFixtureRef?: string;
  walletFixtureRef?: string;
  manipulationFixtureRef?: string;
  riskFixtureRef?: string;
  notes?: string;
}

export function buildReplayStep(input: BuildReplayStepInput): RlResult<ReplayStep> {
  const step: ReplayStep = {
    stepId: input.stepId,
    stepType: input.stepType,
    sequence: input.sequence,
    ...(input.tokenFixtureRef !== undefined ? { tokenFixtureRef: input.tokenFixtureRef } : {}),
    ...(input.creatorFixtureRef !== undefined
      ? { creatorFixtureRef: input.creatorFixtureRef }
      : {}),
    ...(input.walletFixtureRef !== undefined ? { walletFixtureRef: input.walletFixtureRef } : {}),
    ...(input.manipulationFixtureRef !== undefined
      ? { manipulationFixtureRef: input.manipulationFixtureRef }
      : {}),
    ...(input.riskFixtureRef !== undefined ? { riskFixtureRef: input.riskFixtureRef } : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };
  return validateReplayStep(step);
}
