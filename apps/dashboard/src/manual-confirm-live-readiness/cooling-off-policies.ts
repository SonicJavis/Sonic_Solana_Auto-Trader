import {
  type ManualConfirmCoolingOffPolicy,
  type ManualConfirmCoolingOffStatus,
} from './types.js';

export function buildManualConfirmCoolingOffPolicy(input: {
  coolingOffId: string;
  coolingOffRequired: boolean;
  deterministicWindowLabel: string;
  coolingOffStatus: ManualConfirmCoolingOffStatus;
}): ManualConfirmCoolingOffPolicy {
  return {
    coolingOffId: input.coolingOffId,
    coolingOffRequired: input.coolingOffRequired,
    deterministicWindowLabel: input.deterministicWindowLabel,
    usesRuntimeTimers: false,
    automaticTransitionAllowed: false,
    coolingOffStatus: input.coolingOffStatus,
  };
}
