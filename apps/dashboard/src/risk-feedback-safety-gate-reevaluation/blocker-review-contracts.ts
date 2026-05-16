import type { BlockerReviewContract } from './types.js';

export function buildBlockerReviewContract(input: {
  id: string;
  reasonCodes?: readonly string[];
}): BlockerReviewContract {
  return {
    blockerReviewContractId: input.id,
    blockersPreserved: true,
    automaticEscalationAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
