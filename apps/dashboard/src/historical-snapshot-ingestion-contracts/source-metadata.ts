import type { SnapshotSourceMetadata } from './types.js';

export function buildSnapshotSourceMetadata(input: {
  fixtureId: string;
  sourceKind: SnapshotSourceMetadata['sourceKind'];
  providerId: string;
  providerName: string;
  reliabilityBand: string;
  freshnessBand: SnapshotSourceMetadata['freshnessBand'];
  observationWindow: string;
  sourceRefs: readonly string[];
}): SnapshotSourceMetadata {
  return {
    sourceMetadataId: `${input.fixtureId}-source-metadata`,
    sourceKind: input.sourceKind,
    providerId: input.providerId,
    providerName: input.providerName,
    reliabilityBand: input.reliabilityBand,
    freshnessBand: input.freshnessBand,
    observationWindow: input.observationWindow,
    sourceRefs: [...input.sourceRefs],
  };
}
