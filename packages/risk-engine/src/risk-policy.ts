/**
 * Phase 12 — Risk Engine v1: Risk policy definition and defaults.
 */

export interface RiskPolicy {
  readonly minConfidence: number;
  readonly rejectBelowScore: number;
  readonly watchBelowScore: number;
  readonly blockOnCriticalFlags: boolean;
  readonly blockOnManipulationReject: boolean;
  readonly blockOnCreatorReject: boolean;
  readonly blockOnWalletReject: boolean;
  readonly blockOnTokenReject: boolean;
  readonly requireAllInputs: boolean;
  readonly fixtureOnly: true;
  readonly liveData: false;
  readonly safeToDisplay: true;
}

export function buildDefaultRiskPolicy(): RiskPolicy {
  return {
    minConfidence: 0.3,
    rejectBelowScore: 20,
    watchBelowScore: 50,
    blockOnCriticalFlags: true,
    blockOnManipulationReject: true,
    blockOnCreatorReject: true,
    blockOnWalletReject: true,
    blockOnTokenReject: true,
    requireAllInputs: false,
    fixtureOnly: true,
    liveData: false,
    safeToDisplay: true,
  };
}
