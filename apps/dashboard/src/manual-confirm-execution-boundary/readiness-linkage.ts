import type { ExecutionReadinessLinkage } from './types.js';

export function buildExecutionReadinessLinkage(input: {
  readinessLinkageId: string;
  sourceManualReadinessRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): ExecutionReadinessLinkage {
  return {
    readinessLinkageId: input.readinessLinkageId,
    sourceManualReadinessRef: input.sourceManualReadinessRef,
    linkageStatus: input.linkageStatus,
  };
}
