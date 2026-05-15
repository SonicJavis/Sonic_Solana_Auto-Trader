import type { ObservationBlocker } from './types.js';

export function buildObservationBoundaryBlocker(input: {
  blockerId: string;
  blockerCode: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocking: boolean;
  reason: string;
}): ObservationBlocker {
  return {
    blockerId: input.blockerId,
    blockerCode: input.blockerCode,
    severity: input.severity,
    blocking: input.blocking,
    reason: input.reason,
  };
}
