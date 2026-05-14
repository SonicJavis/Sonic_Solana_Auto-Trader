import type { FixturePromotionBlocker } from './types.js';

export function buildFixturePromotionBlocker(input: {
  blockerId: string;
  blockerKind: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reasonCode: string;
  promotionBlocked: boolean;
}): FixturePromotionBlocker {
  return {
    blockerId: input.blockerId,
    blockerKind: input.blockerKind,
    severity: input.severity,
    reasonCode: input.reasonCode,
    failClosed: true,
    promotionBlocked: input.promotionBlocked,
  };
}
