import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { PreLiveSafetyCertificationName } from '../pre-live-safety-certification/types.js';
import type { DossierCertificationLinkage, DossierLinkStatus } from './types.js';

export function buildDossierCertificationLinkage(input: {
  id: string;
  sourceCertPhases: readonly (75 | 69)[];
  sourceCertRefs: readonly (PreLiveSafetyCertificationName | LiveSmokeSafetyCertificationName)[];
  linkageStatus: DossierLinkStatus;
}): DossierCertificationLinkage {
  return {
    certificationLinkageId: input.id,
    sourceCertPhases: input.sourceCertPhases,
    sourceCertRefs: input.sourceCertRefs,
    linkageStatus: input.linkageStatus,
    liveCertificationLookupAllowed: false,
  };
}
