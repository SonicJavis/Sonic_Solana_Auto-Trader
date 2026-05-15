import type { SubscriptionDenialContract } from './types.js';

export function buildSubscriptionDenialContract(input: {
  subscriptionDenialId: string;
  reasonCodes: readonly string[];
}): SubscriptionDenialContract {
  return {
    subscriptionDenialId: input.subscriptionDenialId,
    subscriptionRuntimeAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
