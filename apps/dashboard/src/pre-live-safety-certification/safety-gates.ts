import { PRE_LIVE_SAFETY_CERTIFICATION_PHASE, type PreLiveGateKind, type PreLiveGateStatus, type PreLiveSafetyGate } from './types.js';

export function buildPreLiveSafetyGate(input: {
  gateId: string;
  gateName: string;
  gateKind: PreLiveGateKind;
  gateStatus: PreLiveGateStatus;
  blockingReasonCodes: readonly string[];
}): PreLiveSafetyGate {
  return {
    gateId: input.gateId,
    gateName: input.gateName,
    gateKind: input.gateKind,
    phase: PRE_LIVE_SAFETY_CERTIFICATION_PHASE,
    gateStatus: input.gateStatus,
    failClosed: true,
    unlockAuthority: false,
    liveTradingAllowed: false,
    manualTradingAllowed: false,
    executionAllowed: false,
    blockingReasonCodes: [...input.blockingReasonCodes],
  };
}
