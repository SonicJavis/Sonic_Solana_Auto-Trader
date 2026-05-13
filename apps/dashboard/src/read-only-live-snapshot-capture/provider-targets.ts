import type { LiveSnapshotProviderTarget } from './types.js';

export function buildLiveSnapshotProviderTarget(input: {
  targetId: string;
  providerId: string;
  providerKind: string;
  readOnlyEligible: boolean;
  capabilityRefs: readonly string[];
}): LiveSnapshotProviderTarget {
  return {
    targetId: input.targetId,
    providerId: input.providerId,
    providerKind: input.providerKind,
    readOnlyEligible: input.readOnlyEligible,
    capabilityRefs: input.capabilityRefs,
    providerExpansionAllowed: false,
  };
}
