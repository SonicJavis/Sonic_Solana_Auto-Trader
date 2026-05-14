import type { LiveSnapshotAuditEvidence } from './types.js';

export function buildLiveSnapshotAuditEvidence(input: {
  evidenceId: string;
  evidenceBundleId: string;
  sourceRefs: readonly string[];
  docsRefs: readonly string[];
  validationCommandRefs: readonly string[];
  evidenceComplete: boolean;
}): LiveSnapshotAuditEvidence {
  return {
    evidenceId: input.evidenceId,
    evidenceBundleId: input.evidenceBundleId,
    sourceRefs: input.sourceRefs,
    docsRefs: input.docsRefs,
    validationCommandRefs: input.validationCommandRefs,
    evidenceComplete: input.evidenceComplete,
  };
}
