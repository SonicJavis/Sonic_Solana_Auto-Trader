import type { SendSigningLinkage } from './types.js';

export function buildSendSigningLinkage(input: {
  signingLinkageId: string;
  sourceSigningBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): SendSigningLinkage {
  return {
    signingLinkageId: input.signingLinkageId,
    sourceSigningBoundaryRef: input.sourceSigningBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
