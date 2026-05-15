import type { SendSafetyInvariants } from './types.js';

export function buildSendSafetyInvariants(input: { safetyInvariantId: string }): SendSafetyInvariants {
  return {
    safetyInvariantId: input.safetyInvariantId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    noSendRuntime: true,
  };
}
