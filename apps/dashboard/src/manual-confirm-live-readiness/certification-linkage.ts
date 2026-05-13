import type { ManualConfirmCertificationLinkage } from './types.js';

export function buildManualConfirmCertificationLinkage(input: {
  linkageId: string;
  phase75FixtureRef: string;
  certificationVerified: boolean;
  certificationStatus: string;
}): ManualConfirmCertificationLinkage {
  return {
    linkageId: input.linkageId,
    phase75FixtureRef: input.phase75FixtureRef,
    certificationVerified: input.certificationVerified,
    certificationStatus: input.certificationStatus,
    certificationDoesNotUnlockLive: true,
  };
}
