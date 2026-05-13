import type { PreLiveCertificationContract, PreLiveCertificationKind, PreLiveCertificationStatus } from './types.js';

export function buildPreLiveCertificationContract(input: {
  certificationId: string;
  certificationKind: PreLiveCertificationKind;
  readOnlyCertified: boolean;
  noExecutionCertified: boolean;
  noWalletCertified: boolean;
  noAdvisoryCertified: boolean;
  offlineCiCertified: boolean;
  certificationStatus: PreLiveCertificationStatus;
}): PreLiveCertificationContract {
  return {
    certificationId: input.certificationId,
    certificationKind: input.certificationKind,
    readOnlyCertified: input.readOnlyCertified,
    noExecutionCertified: input.noExecutionCertified,
    noWalletCertified: input.noWalletCertified,
    noAdvisoryCertified: input.noAdvisoryCertified,
    offlineCiCertified: input.offlineCiCertified,
    certificationStatus: input.certificationStatus,
    certificationDoesNotUnlockLive: true,
  };
}
