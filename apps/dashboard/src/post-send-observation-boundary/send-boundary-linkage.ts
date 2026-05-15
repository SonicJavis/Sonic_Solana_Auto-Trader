import type { ObservationSendBoundaryLinkage } from './types.js';

export function buildObservationSendBoundaryLinkage(input: {
  sendBoundaryLinkageId: string;
  sourceSendBoundaryRef: string;
  linkageStatus: 'linked' | 'warning' | 'blocked';
}): ObservationSendBoundaryLinkage {
  return {
    sendBoundaryLinkageId: input.sendBoundaryLinkageId,
    sourceSendBoundaryRef: input.sourceSendBoundaryRef,
    linkageStatus: input.linkageStatus,
  };
}
