import type { OutcomeSafetyInvariants } from './types.js';

export function buildOutcomeSafetyInvariants(input: { safetyInvariantId: string }): OutcomeSafetyInvariants {
  return {
    safetyInvariantId: input.safetyInvariantId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    noLiveOutcomeObservation: true,
  };
}
