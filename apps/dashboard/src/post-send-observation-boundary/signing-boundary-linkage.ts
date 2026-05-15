import type { ObservationSigningBoundaryLinkage } from './types.js';

export function buildObservationSigningBoundaryLinkage(input: {
  signingBoundaryLinkageId: string;
  sourceSigningBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): ObservationSigningBoundaryLinkage {
  return {
    signingBoundaryLinkageId: input.signingBoundaryLinkageId,
    sourceSigningBoundaryRef: input.sourceSigningBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
