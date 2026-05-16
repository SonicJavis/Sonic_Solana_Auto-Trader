import type { ReevaluationSafetyInvariants } from './types.js';

export function buildReevaluationSafetyInvariants(input: { id: string }): ReevaluationSafetyInvariants {
  return {
    safetyInvariantsId: input.id,
    failClosed: true,
    unlockAuthority: false,
    automaticGateMutationAllowed: false,
    automaticUnlockAllowed: false,
    liveRiskUpdateAllowed: false,
    liveGateStatusFetched: false,
    networkReadAllowed: false,
    sendingAllowed: false,
    signingAllowed: false,
    persistenceAllowed: false,
    invariantsEnforced: true,
  };
}
