import type { ConfirmationOutcomePlaceholder } from './types.js';

export function buildConfirmationOutcomePlaceholder(input: {
  confirmationOutcomePlaceholderId: string;
  reasonCodes: readonly string[];
}): ConfirmationOutcomePlaceholder {
  return {
    confirmationOutcomePlaceholderId: input.confirmationOutcomePlaceholderId,
    deterministicLabelOnly: true,
    liveConfirmationFetched: false,
    reasonCodes: [...input.reasonCodes],
  };
}
