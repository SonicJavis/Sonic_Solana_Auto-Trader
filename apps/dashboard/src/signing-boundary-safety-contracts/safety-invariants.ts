import type { SigningSafetyInvariants } from './types.js';

export function buildSigningSafetyInvariants(input: { safetyInvariantId: string }): SigningSafetyInvariants {
  return {
    safetyInvariantId: input.safetyInvariantId,
    readOnlyDefault: true,
    fullAutoLocked: true,
    limitedLiveLocked: true,
    noSigningRuntime: true,
  };
}
