import type { ReplayImportReliabilityLinkage } from './types.js';

export function buildReplayImportReliabilityLinkage(
  input: Omit<ReplayImportReliabilityLinkage, 'reliabilityLinkageId'> & { fixtureId: string },
): ReplayImportReliabilityLinkage {
  return {
    reliabilityLinkageId: `${input.fixtureId}-reliability-linkage`,
    sourceReliabilityFixtureRef: input.sourceReliabilityFixtureRef,
    reliabilityStatus: input.reliabilityStatus,
    driftSeverity: input.driftSeverity,
    failClosed: input.failClosed,
  };
}

export const buildSnapshotReliabilityLinkage = buildReplayImportReliabilityLinkage;
