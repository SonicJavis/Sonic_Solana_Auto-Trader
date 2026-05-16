import type { OutcomeExecutionBoundaryLinkage } from './types.js';

export function buildOutcomeExecutionBoundaryLinkage(input: {
  executionBoundaryLinkageId: string;
  sourceExecutionBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): OutcomeExecutionBoundaryLinkage {
  return {
    executionBoundaryLinkageId: input.executionBoundaryLinkageId,
    sourceExecutionBoundaryRef: input.sourceExecutionBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
