import type { SendExecutionBoundaryLinkage } from './types.js';

export function buildSendExecutionBoundaryLinkage(input: {
  executionBoundaryLinkageId: string;
  sourceExecutionBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): SendExecutionBoundaryLinkage {
  return {
    executionBoundaryLinkageId: input.executionBoundaryLinkageId,
    sourceExecutionBoundaryRef: input.sourceExecutionBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
