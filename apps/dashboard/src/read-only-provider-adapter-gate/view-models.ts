import type {
  ReadOnlyProviderAdapterGateFixture,
  ReadOnlyProviderAdapterGateViewModel,
} from './types.js';

export function buildReadOnlyProviderAdapterGateViewModel(
  fixture: ReadOnlyProviderAdapterGateFixture,
): ReadOnlyProviderAdapterGateViewModel {
  const policyPassCount = fixture.resolutionResult.policyResults.filter(result => result.passed).length;
  const policyFailCount = fixture.resolutionResult.policyResults.length - policyPassCount;

  return {
    viewModelId: `${fixture.fixtureId}-view-model`,
    fixtureId: fixture.fixtureId,
    fixtureName: fixture.fixtureName,
    gateState: fixture.gateState.stateKind,
    allowed: fixture.resolutionResult.allowed,
    failClosed: true,
    candidateLabel: fixture.providerCandidate.candidateName,
    policyPassCount,
    policyFailCount,
    rejectionCount: fixture.resolutionResult.rejectionReasons.length,
    summary: fixture.resolutionResult.allowed
      ? 'Read-only provider adapter gate allows this synthetic mock fixture only.'
      : 'Read-only provider adapter gate rejects this fixture and remains fail-closed.',
  };
}
