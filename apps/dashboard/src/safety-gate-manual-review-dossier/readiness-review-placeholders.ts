import type { ReadinessReviewPlaceholder } from './types.js';

export function buildReadinessReviewPlaceholder(input: {
  id: string;
  reasonCodes?: readonly string[];
}): ReadinessReviewPlaceholder {
  return {
    readinessReviewPlaceholderId: input.id,
    deterministicOnly: true,
    liveReadinessLookupAllowed: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
