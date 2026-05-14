import type { ExecutionBoundaryBlocker } from './types.js';

export function buildExecutionBoundaryBlocker(input: {
  blockerId: string;
  blockerCode: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocking: boolean;
  reason: string;
}): ExecutionBoundaryBlocker {
  return {
    blockerId: input.blockerId,
    blockerCode: input.blockerCode,
    severity: input.severity,
    blocking: input.blocking,
    reason: input.reason,
  };
}
