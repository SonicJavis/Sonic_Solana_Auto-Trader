import type { DossierRollbackContract } from './types.js';

export function buildDossierRollbackContract(input: {
  id: string;
  reasonCodes?: readonly string[];
}): DossierRollbackContract {
  return {
    rollbackContractId: input.id,
    rollbackRequired: true,
    scheduledTimersAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
