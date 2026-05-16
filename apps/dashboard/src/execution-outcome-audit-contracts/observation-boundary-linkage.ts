import type { OutcomeObservationBoundaryLinkage } from './types.js';

export function buildOutcomeObservationBoundaryLinkage(input: {
  observationBoundaryLinkageId: string;
  sourceObservationBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): OutcomeObservationBoundaryLinkage {
  return {
    observationBoundaryLinkageId: input.observationBoundaryLinkageId,
    sourceObservationBoundaryRef: input.sourceObservationBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
