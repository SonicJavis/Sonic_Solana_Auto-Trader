import type { PolicyReviewPlaceholder } from './types.js';

export function buildPolicyReviewPlaceholder(input: {
  id: string;
  reasonCodes?: readonly string[];
}): PolicyReviewPlaceholder {
  return {
    policyReviewPlaceholderId: input.id,
    deterministicOnly: true,
    livePolicyLookupAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
