import type { PreLiveRejectionContract, PreLiveRejectionKind, PreLiveRejectionSeverity } from './types.js';

export function buildPreLiveRejectionContract(input: {
  rejectionId: string;
  rejectionKind: PreLiveRejectionKind;
  severity: PreLiveRejectionSeverity;
  reasonCode: string;
  safetyNotes: string;
}): PreLiveRejectionContract {
  return {
    rejectionId: input.rejectionId,
    rejectionKind: input.rejectionKind,
    severity: input.severity,
    reasonCode: input.reasonCode,
    failClosed: true,
    safetyNotes: input.safetyNotes,
  };
}
