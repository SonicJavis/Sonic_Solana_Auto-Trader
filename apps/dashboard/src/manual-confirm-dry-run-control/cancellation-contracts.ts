import type { ManualConfirmCancellationContract, ManualConfirmDryRunCancellationStatus } from './types.js';

export function buildManualConfirmCancellationContract(input: {
  cancellationId: string;
  status: ManualConfirmDryRunCancellationStatus;
}): ManualConfirmCancellationContract {
  return {
    cancellationId: input.cancellationId,
    cancellationAllowed: true,
    automaticTransitionAllowed: false,
    usesRuntimeTimers: false,
    status: input.status,
  };
}
