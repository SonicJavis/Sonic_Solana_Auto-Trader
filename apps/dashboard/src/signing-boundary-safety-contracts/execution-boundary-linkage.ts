import type { SigningExecutionBoundaryLinkage } from './types.js';

export function buildSigningExecutionBoundaryLinkage(input: {
  executionBoundaryLinkageId: string;
  sourceExecutionBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): SigningExecutionBoundaryLinkage {
  return {
    executionBoundaryLinkageId: input.executionBoundaryLinkageId,
    sourceExecutionBoundaryRef: input.sourceExecutionBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
