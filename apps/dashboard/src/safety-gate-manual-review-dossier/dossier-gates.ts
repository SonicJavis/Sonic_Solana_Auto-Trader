import {
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
  type DossierGate,
  type DossierGateStatus,
} from './types.js';

export function buildDossierGate(input: {
  id: string;
  name: string;
  gateStatus: DossierGateStatus;
  blockingReasonCodes?: readonly string[];
}): DossierGate {
  return {
    dossierGateId: input.id,
    dossierGateName: input.name,
    phase: SAFETY_GATE_MANUAL_REVIEW_DOSSIER_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    approvalAuthority: false,
    unlockAuthority: false,
    automaticApprovalAllowed: false,
    automaticUnlockAllowed: false,
    blockingReasonCodes: input.blockingReasonCodes ?? [],
  };
}
