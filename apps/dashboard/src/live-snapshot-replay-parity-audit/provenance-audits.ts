import type { LiveSnapshotProvenanceAudit } from './types.js';

export function buildLiveSnapshotProvenanceAudit(input: {
  provenanceAuditId: string;
  auditStatus: 'pass' | 'warning' | 'fail';
  sourcePhaseRefs: readonly string[];
  sourceFixtureRefs: readonly string[];
  missingRefs: readonly string[];
}): LiveSnapshotProvenanceAudit {
  return {
    provenanceAuditId: input.provenanceAuditId,
    auditStatus: input.auditStatus,
    sourcePhaseRefs: input.sourcePhaseRefs,
    sourceFixtureRefs: input.sourceFixtureRefs,
    missingRefs: input.missingRefs,
    failClosed: true,
  };
}
