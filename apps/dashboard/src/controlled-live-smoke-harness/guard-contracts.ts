import type { SmokeGuardContract, SmokeGuardState } from './types.js';

export function buildSmokeGuardContract(input: {
  guardId: string;
  guardState: SmokeGuardState;
  unsafeCapabilityDetected: boolean;
  reasonCodes: readonly string[];
}): SmokeGuardContract {
  return {
    guardId: input.guardId,
    guardState: input.guardState,
    defaultDecision: 'skipped',
    liveNetworkAllowedByDefault: false,
    unsafeCapabilityDetected: input.unsafeCapabilityDetected,
    reasonCodes: [...input.reasonCodes],
    failClosed: true,
  };
}
