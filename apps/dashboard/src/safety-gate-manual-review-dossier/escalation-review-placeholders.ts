import type { EscalationReviewPlaceholder } from './types.js';

export function buildEscalationReviewPlaceholder(input: {
  id: string;
  reasonCodes?: readonly string[];
}): EscalationReviewPlaceholder {
  return {
    escalationReviewPlaceholderId: input.id,
    deterministicOnly: true,
    autoEscalationAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
