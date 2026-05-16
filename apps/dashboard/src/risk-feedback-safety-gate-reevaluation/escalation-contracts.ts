import type { EscalationContract } from './types.js';

export function buildEscalationContract(input: {
  id: string;
  reasonCodes?: readonly string[];
}): EscalationContract {
  return {
    escalationContractId: input.id,
    escalationModeled: true,
    automaticEscalationAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
