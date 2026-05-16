import type { PolicyCheckPlaceholder } from './types.js';

export function buildPolicyCheckPlaceholder(input: {
  id: string;
  reasonCodes?: readonly string[];
}): PolicyCheckPlaceholder {
  return {
    policyCheckPlaceholderId: input.id,
    deterministicOnly: true,
    livePolicyFetchAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
