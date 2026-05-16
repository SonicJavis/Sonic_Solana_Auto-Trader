import type { ExecutionOutcomeAuditContractName } from '../execution-outcome-audit-contracts/types.js';
import type { DossierLinkStatus, DossierOutcomeLinkage } from './types.js';

export function buildDossierOutcomeLinkage(input: {
  id: string;
  sourceOutcomeRefs: readonly ExecutionOutcomeAuditContractName[];
  linkageStatus: DossierLinkStatus;
}): DossierOutcomeLinkage {
  return {
    outcomeLinkageId: input.id,
    sourceOutcomePhase: 86,
    sourceOutcomeRefs: input.sourceOutcomeRefs,
    linkageStatus: input.linkageStatus,
    liveOutcomeLookupAllowed: false,
  };
}
