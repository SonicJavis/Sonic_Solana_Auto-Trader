import type { ExecutionDryRunLinkage } from './types.js';

export function buildExecutionDryRunLinkage(input: {
  dryRunLinkageId: string;
  sourceDryRunControlRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): ExecutionDryRunLinkage {
  return {
    dryRunLinkageId: input.dryRunLinkageId,
    sourceDryRunControlRef: input.sourceDryRunControlRef,
    linkageStatus: input.linkageStatus,
  };
}
