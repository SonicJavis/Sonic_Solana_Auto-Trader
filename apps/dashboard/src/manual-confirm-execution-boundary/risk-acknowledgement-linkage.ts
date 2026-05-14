import type { ExecutionRiskAcknowledgementLinkage } from './types.js';

export function buildExecutionRiskAcknowledgementLinkage(input: {
  riskAcknowledgementLinkageId: string;
  sourceRiskAcknowledgementRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): ExecutionRiskAcknowledgementLinkage {
  return {
    riskAcknowledgementLinkageId: input.riskAcknowledgementLinkageId,
    sourceRiskAcknowledgementRef: input.sourceRiskAcknowledgementRef,
    linkageStatus: input.linkageStatus,
  };
}
