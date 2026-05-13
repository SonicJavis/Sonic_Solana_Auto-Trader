import type { SnapshotReliabilityLinkage } from './types.js';

export function buildSnapshotReliabilityLinkage(input: {
  fixtureId: string;
  providerReliabilityRef: SnapshotReliabilityLinkage['providerReliabilityRef'];
  driftSeverity: SnapshotReliabilityLinkage['driftSeverity'];
  driftCompatible: boolean;
  failClosed: boolean;
  sourceRefs: readonly string[];
}): SnapshotReliabilityLinkage {
  return {
    reliabilityLinkageId: `${input.fixtureId}-reliability-linkage`,
    providerReliabilityRef: input.providerReliabilityRef,
    driftSeverity: input.driftSeverity,
    driftCompatible: input.driftCompatible,
    failClosed: input.failClosed,
    sourceRefs: [...input.sourceRefs],
  };
}
