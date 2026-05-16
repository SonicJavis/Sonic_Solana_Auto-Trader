import type {
  RiskFeedbackSafetyGateReevaluationFixture,
  RiskFeedbackSafetyGateReevaluationViewModel,
} from './types.js';

export function buildRiskFeedbackSafetyGateReevaluationViewModel(
  fixture: RiskFeedbackSafetyGateReevaluationFixture,
): RiskFeedbackSafetyGateReevaluationViewModel {
  return {
    viewModelId: `${fixture.fixtureId}-vm`,
    fixtureName: fixture.fixtureName,
    phase: fixture.phase,
    gateStatus: fixture.reevaluationGate.gateStatus,
    safetyConfirmed: true,
    deterministicOnly: true,
    failClosed: true,
  };
}
