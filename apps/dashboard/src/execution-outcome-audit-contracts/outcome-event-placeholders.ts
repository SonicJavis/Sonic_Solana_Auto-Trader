import type { OutcomeEventPlaceholder } from './types.js';

export function buildOutcomeEventPlaceholder(input: {
  outcomeEventPlaceholderId: string;
  reasonCodes: readonly string[];
}): OutcomeEventPlaceholder {
  return {
    outcomeEventPlaceholderId: input.outcomeEventPlaceholderId,
    placeholderOnly: true,
    realOutcomeEventProduced: false,
    transactionSignatureRequired: false,
    reasonCodes: [...input.reasonCodes],
  };
}
