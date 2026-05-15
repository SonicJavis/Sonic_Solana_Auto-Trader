import type { ConfirmationStatusPlaceholder } from './types.js';

export function buildConfirmationStatusPlaceholder(input: {
  confirmationStatusPlaceholderId: string;
  reasonCodes: readonly string[];
}): ConfirmationStatusPlaceholder {
  return {
    confirmationStatusPlaceholderId: input.confirmationStatusPlaceholderId,
    placeholderOnly: true,
    liveConfirmationFetched: false,
    confirmationStatusProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
