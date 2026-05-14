import type { ExecutionOperatorIntentLinkage } from './types.js';

export function buildExecutionOperatorIntentLinkage(input: {
  operatorIntentLinkageId: string;
  sourceDryRunIntentRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): ExecutionOperatorIntentLinkage {
  return {
    operatorIntentLinkageId: input.operatorIntentLinkageId,
    sourceDryRunIntentRef: input.sourceDryRunIntentRef,
    linkageStatus: input.linkageStatus,
    intentSupportsExecution: false,
  };
}
