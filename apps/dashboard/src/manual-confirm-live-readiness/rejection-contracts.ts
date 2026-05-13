import type {
  ManualConfirmRejectionContract,
  ManualConfirmRejectionKind,
  ManualConfirmRejectionSeverity,
} from './types.js';

export function buildManualConfirmRejectionContract(input: {
  rejectionId: string;
  rejectionKind: ManualConfirmRejectionKind;
  rejectionSeverity: ManualConfirmRejectionSeverity;
  rejectionReasonCodes: readonly string[];
}): ManualConfirmRejectionContract {
  return {
    rejectionId: input.rejectionId,
    rejectionKind: input.rejectionKind,
    rejectionSeverity: input.rejectionSeverity,
    rejectionReasonCodes: input.rejectionReasonCodes,
    failClosed: true,
    unlockAuthority: false,
    manualLiveAllowed: false,
  };
}
