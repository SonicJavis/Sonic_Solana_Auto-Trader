import type { OutcomeSigningBoundaryLinkage } from './types.js';

export function buildOutcomeSigningBoundaryLinkage(input: {
  signingBoundaryLinkageId: string;
  sourceSigningBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): OutcomeSigningBoundaryLinkage {
  return {
    signingBoundaryLinkageId: input.signingBoundaryLinkageId,
    sourceSigningBoundaryRef: input.sourceSigningBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
