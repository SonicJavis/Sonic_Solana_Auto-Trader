import type { DossierAuditTrailLinkage, DossierLinkStatus } from './types.js';

export function buildDossierAuditTrailLinkage(input: {
  id: string;
  sourceAuditPhases: readonly (86 | 79 | 80)[];
  sourceAuditRefs: readonly string[];
  linkageStatus: DossierLinkStatus;
}): DossierAuditTrailLinkage {
  return {
    auditTrailLinkageId: input.id,
    sourceAuditPhases: input.sourceAuditPhases,
    sourceAuditRefs: input.sourceAuditRefs,
    linkageStatus: input.linkageStatus,
    mutableAuditTrail: false,
  };
}
