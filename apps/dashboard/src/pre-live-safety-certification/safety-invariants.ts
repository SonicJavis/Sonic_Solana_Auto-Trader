import type { PreLiveInvariantKind, PreLiveRejectionSeverity, PreLiveSafetyInvariant } from './types.js';

export function buildPreLiveSafetyInvariant(input: {
  invariantId: string;
  invariantKind: PreLiveInvariantKind;
  satisfied: boolean;
  violationSeverity: PreLiveRejectionSeverity;
  sourceRefs: readonly string[];
}): PreLiveSafetyInvariant {
  return {
    invariantId: input.invariantId,
    invariantKind: input.invariantKind,
    required: true,
    satisfied: input.satisfied,
    violationSeverity: input.violationSeverity,
    sourceRefs: [...input.sourceRefs],
  };
}
