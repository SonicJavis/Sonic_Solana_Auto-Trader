import type { LiveSnapshotDriftClassification } from './types.js';

export function buildLiveSnapshotDriftClassification(input: {
  driftClassificationId: string;
  driftStatus: 'none' | 'warning' | 'drifted';
  driftClass: 'none' | 'schema' | 'provenance' | 'integrity' | 'expectation';
  reviewRequired: boolean;
}): LiveSnapshotDriftClassification {
  const driftSeverity =
    input.driftStatus === 'none' ? 'low' : input.driftStatus === 'warning' ? 'medium' : input.driftClass === 'integrity' ? 'critical' : 'high';
  return {
    driftId: input.driftClassificationId,
    driftKind: input.driftClass,
    driftSeverity,
    promotionBlocked: input.reviewRequired || input.driftStatus === 'drifted',
    driftClassificationId: input.driftClassificationId,
    driftStatus: input.driftStatus,
    driftClass: input.driftClass,
    reviewRequired: input.reviewRequired,
  };
}
