import type { SmokeSkipFixture } from './types.js';

export function buildSmokeSkipFixture(input: {
  skipId: string;
  skipKind: string;
  reason: string;
  standardCi: boolean;
  manualTriggerRequired: boolean;
}): SmokeSkipFixture {
  return {
    skipId: input.skipId,
    skipKind: input.skipKind,
    reason: input.reason,
    standardCi: input.standardCi,
    manualTriggerRequired: input.manualTriggerRequired,
    failClosed: true,
  };
}
