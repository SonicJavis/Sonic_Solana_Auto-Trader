import type { RiskExplanationEvidenceName } from '../risk-explanation-evidence/types.js';
import type { DossierLinkStatus, DossierRiskLinkage } from './types.js';

export function buildDossierRiskLinkage(input: {
  id: string;
  sourceRiskPhases: readonly (58 | 59)[];
  sourceRiskRefs: readonly RiskExplanationEvidenceName[];
  linkageStatus: DossierLinkStatus;
}): DossierRiskLinkage {
  return {
    riskLinkageId: input.id,
    sourceRiskPhases: input.sourceRiskPhases,
    sourceRiskRefs: input.sourceRiskRefs,
    linkageStatus: input.linkageStatus,
    liveRiskUpdateAllowed: false,
  };
}
