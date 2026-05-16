import type { ApprovalDenialContract } from './types.js';

export function buildApprovalDenialContract(input: {
  id: string;
  reasonCodes?: readonly string[];
}): ApprovalDenialContract {
  return {
    approvalDenialContractId: input.id,
    approvalDeniedByDefault: true,
    automaticApprovalBlocked: true,
    unlockBlocked: true,
    reasonCodes: input.reasonCodes ?? [],
  };
}
