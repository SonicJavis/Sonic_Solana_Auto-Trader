import type {
  SafetyGateManualReviewDossierFixture,
  SafetyGateManualReviewDossierViewModel,
} from './types.js';

export function buildSafetyGateManualReviewDossierViewModel(
  fixture: SafetyGateManualReviewDossierFixture,
): SafetyGateManualReviewDossierViewModel {
  return {
    viewModelId: `${fixture.fixtureId}-vm`,
    fixtureName: fixture.fixtureName,
    phase: fixture.phase,
    gateStatus: fixture.dossierGate.gateStatus,
    safetyConfirmed: true,
    deterministicOnly: true,
    failClosed: true,
  };
}
