import type { SigningBoundaryBlocker } from './types.js';

export function buildSigningBoundaryBlocker(input: {
  blockerId: string;
  blockerCode: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocking: boolean;
  reason: string;
}): SigningBoundaryBlocker {
  return {
    blockerId: input.blockerId,
    blockerCode: input.blockerCode,
    severity: input.severity,
    blocking: input.blocking,
    reason: input.reason,
  };
}
