import type { ManualConfirmAbortContract, ManualConfirmDryRunAbortStatus } from './types.js';

export function buildManualConfirmAbortContract(input: {
  abortId: string;
  status: ManualConfirmDryRunAbortStatus;
}): ManualConfirmAbortContract {
  return {
    abortId: input.abortId,
    abortAllowed: true,
    automaticTransitionAllowed: false,
    usesRuntimeTimers: false,
    status: input.status,
  };
}
