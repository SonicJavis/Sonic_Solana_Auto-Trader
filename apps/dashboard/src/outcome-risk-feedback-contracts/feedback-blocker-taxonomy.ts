import type { FeedbackBlocker } from './types.js';

export function buildFeedbackBlocker(input: {
  blockerId: string;
  blockerCode: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocking: boolean;
  reason: string;
}): FeedbackBlocker {
  return {
    blockerId: input.blockerId,
    blockerCode: input.blockerCode,
    severity: input.severity,
    blocking: input.blocking,
    reason: input.reason,
  };
}
