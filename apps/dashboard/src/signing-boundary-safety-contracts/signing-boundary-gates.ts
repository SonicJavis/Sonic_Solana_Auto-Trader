import { SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE, type SigningBoundaryGate, type SigningBoundaryGateStatus } from './types.js';

export function buildSigningBoundaryGate(input: {
  signingBoundaryGateId: string;
  signingBoundaryGateName: string;
  gateStatus: SigningBoundaryGateStatus;
  blockingReasonCodes: readonly string[];
}): SigningBoundaryGate {
  return {
    signingBoundaryGateId: input.signingBoundaryGateId,
    signingBoundaryGateName: input.signingBoundaryGateName,
    phase: SIGNING_BOUNDARY_SAFETY_CONTRACTS_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    signingAllowed: false,
    walletPromptAllowed: false,
    signatureOutputAllowed: false,
    blockingReasonCodes: [...input.blockingReasonCodes],
  };
}
