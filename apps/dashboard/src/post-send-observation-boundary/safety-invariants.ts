import type { ObservationSafetyInvariants } from './types.js';

export function buildObservationSafetyInvariants(input: { safetyInvariantId: string }): ObservationSafetyInvariants {
  return {
    safetyInvariantId: input.safetyInvariantId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    noLiveObservationRuntime: true,
  };
}
