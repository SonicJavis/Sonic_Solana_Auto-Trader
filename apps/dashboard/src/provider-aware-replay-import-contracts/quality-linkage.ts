import type { ReplayImportQualityLinkage } from './types.js';

export function buildReplayImportQualityLinkage(
  input: Omit<ReplayImportQualityLinkage, 'qualityLinkageId'> & { fixtureId: string },
): ReplayImportQualityLinkage {
  return {
    qualityLinkageId: `${input.fixtureId}-quality-linkage`,
    sourceQualityFixtureRef: input.sourceQualityFixtureRef,
    qualityStatus: input.qualityStatus,
    reasonCodes: [...input.reasonCodes],
    failClosed: input.failClosed,
  };
}
