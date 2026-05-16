import type { DossierSafetyInvariants } from './types.js';

export function buildDossierSafetyInvariants(input: { id: string }): DossierSafetyInvariants {
  return {
    safetyInvariantsId: input.id,
    failClosed: true,
    approvalAuthority: false,
    unlockAuthority: false,
    automaticApprovalAllowed: false,
    automaticUnlockAllowed: false,
    liveReviewerLookupAllowed: false,
    liveRiskUpdateAllowed: false,
    liveFeedbackLookupAllowed: false,
    liveGateStatusFetchAllowed: false,
    liveOutcomeLookupAllowed: false,
    networkReadAllowed: false,
    pollingAllowed: false,
    subscriptionAllowed: false,
    retryRuntimeAllowed: false,
    sendingAllowed: false,
    dispatchAllowed: false,
    signingAllowed: false,
    walletLogicAllowed: false,
    persistenceAllowed: false,
    invariantsEnforced: true,
  };
}
