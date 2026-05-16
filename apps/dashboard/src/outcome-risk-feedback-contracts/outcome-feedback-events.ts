import type { OutcomeFeedbackEvent } from './types.js';

export function buildOutcomeFeedbackEvent(input: {
  outcomeFeedbackEventId: string;
  sourceOutcomeAuditRef: string;
  reasonCodes: readonly string[];
}): OutcomeFeedbackEvent {
  return {
    outcomeFeedbackEventId: input.outcomeFeedbackEventId,
    placeholderOnly: true,
    sourceOutcomeAuditRef: input.sourceOutcomeAuditRef,
    realOutcomeEventRequired: false,
    liveOutcomeLookupAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
