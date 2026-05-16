import type { DossierAbortContract } from './types.js';

export function buildDossierAbortContract(input: {
  id: string;
  reasonCodes?: readonly string[];
}): DossierAbortContract {
  return {
    abortContractId: input.id,
    abortRequired: true,
    scheduledTimersAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
