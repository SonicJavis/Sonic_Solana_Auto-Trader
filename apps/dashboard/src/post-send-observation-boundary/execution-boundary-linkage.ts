import type { ObservationExecutionBoundaryLinkage } from './types.js';

export function buildObservationExecutionBoundaryLinkage(input: {
  executionBoundaryLinkageId: string;
  sourceExecutionBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): ObservationExecutionBoundaryLinkage {
  return {
    executionBoundaryLinkageId: input.executionBoundaryLinkageId,
    sourceExecutionBoundaryRef: input.sourceExecutionBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
