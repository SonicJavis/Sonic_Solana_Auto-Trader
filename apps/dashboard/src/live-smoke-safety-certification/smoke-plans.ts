import type { LiveSmokeResultStatus, ReadOnlySmokeCheckKind, SmokePlan } from './types.js';

export function buildSmokePlan(input: {
  fixtureId: string;
  sourceProviderId: string;
  sourcePhase: 65 | 66 | 67 | 68;
  checkKinds: readonly ReadOnlySmokeCheckKind[];
  expectedOutcome: LiveSmokeResultStatus;
  safetyNotes: readonly string[];
}): SmokePlan {
  return {
    smokePlanId: `${input.fixtureId}-smoke-plan`,
    sourceProviderId: input.sourceProviderId,
    sourcePhase: input.sourcePhase,
    checkKinds: [...input.checkKinds],
    expectedOutcome: input.expectedOutcome,
    disabledByDefault: true,
    manualOnly: true,
    readOnlyOnly: true,
    safetyNotes: [...input.safetyNotes],
  };
}
