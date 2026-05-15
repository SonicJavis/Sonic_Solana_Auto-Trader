import type { SendBoundaryBlocker } from './types.js';

export function buildSendBoundaryBlocker(input: {
  blockerId: string;
  blockerCode: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocking: boolean;
  reason: string;
}): SendBoundaryBlocker {
  return {
    blockerId: input.blockerId,
    blockerCode: input.blockerCode,
    severity: input.severity,
    blocking: input.blocking,
    reason: input.reason,
  };
}
