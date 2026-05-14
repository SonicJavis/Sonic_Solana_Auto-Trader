import type { FixturePromotionCandidate, FixturePromotionCandidateStatus } from './types.js';

export function buildFixturePromotionCandidate(input: {
  candidateId: string;
  sourceParityAuditFixtureRef: string;
  sourceSnapshotCaptureFixtureRef: string;
  candidateStatus: FixturePromotionCandidateStatus;
}): FixturePromotionCandidate {
  return {
    candidateId: input.candidateId,
    sourceParityAuditFixtureRef: input.sourceParityAuditFixtureRef,
    sourceSnapshotCaptureFixtureRef: input.sourceSnapshotCaptureFixtureRef,
    candidateStatus: input.candidateStatus,
    stagedOnly: true,
    persisted: false,
    promotionAllowed: false,
  };
}
