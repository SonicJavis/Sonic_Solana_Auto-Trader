import type { OutcomeStatusPlaceholder } from './types.js';

export function buildOutcomeStatusPlaceholder(input: {
  outcomeStatusPlaceholderId: string;
  reasonCodes: readonly string[];
}): OutcomeStatusPlaceholder {
  return {
    outcomeStatusPlaceholderId: input.outcomeStatusPlaceholderId,
    deterministicLabelOnly: true,
    liveStatusFetched: false,
    outcomeStatusProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
