import type { ConfirmationDenialContract } from './types.js';

export function buildConfirmationDenialContract(input: {
  confirmationDenialId: string;
  reasonCodes: readonly string[];
}): ConfirmationDenialContract {
  return {
    confirmationDenialId: input.confirmationDenialId,
    confirmationPollingAllowed: false,
    scheduledTimersAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
