import type { SafetyGateFeedbackLink } from './types.js';

export function buildSafetyGateFeedbackLink(input: {
  safetyGateFeedbackLinkId: string;
  reasonCodes: readonly string[];
}): SafetyGateFeedbackLink {
  return {
    safetyGateFeedbackLinkId: input.safetyGateFeedbackLinkId,
    safetyGateMutationAllowed: false,
    manualReviewRequired: true,
    automaticUnlockAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
