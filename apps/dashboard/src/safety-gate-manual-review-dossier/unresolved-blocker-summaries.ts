import type { UnresolvedBlockerSummary } from './types.js';

export function buildUnresolvedBlockerSummary(input: {
  id: string;
  unresolvedBlockerCount?: number;
}): UnresolvedBlockerSummary {
  return {
    blockerSummaryId: input.id,
    blockersPreserved: true,
    unresolvedBlockerCount: input.unresolvedBlockerCount ?? 1,
    blockerResolutionAllowed: false,
    automaticBlockerClearAllowed: false,
  };
}
