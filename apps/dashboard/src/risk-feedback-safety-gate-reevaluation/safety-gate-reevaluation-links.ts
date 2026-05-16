import type { ReevaluationLinkStatus, SafetyGateReevaluationLink } from './types.js';

export function buildSafetyGateReevaluationLink(input: {
  id: string;
  sourceSafetyGateRef: string;
  sourceFeedbackFixtureRef: string;
  linkStatus: ReevaluationLinkStatus;
}): SafetyGateReevaluationLink {
  return {
    safetyGateReevaluationLinkId: input.id,
    sourceSafetyGateRef: input.sourceSafetyGateRef,
    sourceFeedbackFixtureRef: input.sourceFeedbackFixtureRef,
    gateMutationAllowed: false,
    automaticStatusChangeAllowed: false,
    linkStatus: input.linkStatus,
  };
}
