import type { OutcomeSendBoundaryLinkage } from './types.js';

export function buildOutcomeSendBoundaryLinkage(input: {
  sendBoundaryLinkageId: string;
  sourceSendBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): OutcomeSendBoundaryLinkage {
  return {
    sendBoundaryLinkageId: input.sendBoundaryLinkageId,
    sourceSendBoundaryRef: input.sourceSendBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
