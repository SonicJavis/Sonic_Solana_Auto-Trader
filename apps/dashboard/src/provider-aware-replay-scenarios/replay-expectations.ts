import type { ReplayExpectationModel } from './types.js';

export function buildReplayExpectationModel(input: {
  fixtureId: string;
  sourceScenarioId: string;
  expectedStepCount: number;
  expectedFinalStateKind: string;
  expectedMismatchCount: number;
  expectedFailClosed: boolean;
  sourceRefs: readonly string[];
}): ReplayExpectationModel {
  return {
    expectationId: `${input.fixtureId}-replay-expectation`,
    sourceScenarioId: input.sourceScenarioId,
    expectedStepCount: input.expectedStepCount,
    expectedFinalStateKind: input.expectedFinalStateKind,
    expectedMismatchCount: input.expectedMismatchCount,
    expectedFailClosed: input.expectedFailClosed,
    sourceRefs: [...input.sourceRefs],
  };
}
