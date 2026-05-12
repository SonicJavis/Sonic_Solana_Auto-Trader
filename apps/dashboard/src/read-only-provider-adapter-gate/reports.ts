import type {
  BuildReadOnlyProviderAdapterGateReportInput,
  ReadOnlyProviderAdapterGateReport,
} from './types.js';

export function buildReadOnlyProviderGateReport(
  input: BuildReadOnlyProviderAdapterGateReportInput,
): ReadOnlyProviderAdapterGateReport {
  const capabilityPassCount = input.capabilityChecks.filter(check => check.pass).length;
  const capabilityFailCount = input.capabilityChecks.length - capabilityPassCount;

  return {
    reportId: `${input.fixtureId}-report`,
    gateState: input.state.stateKind,
    policySummary: `${input.resolution.policyResults.filter(result => result.passed).length}/${input.resolution.policyResults.length} policy checks passed.`,
    capabilitySummary: `${capabilityPassCount}/${input.capabilityChecks.length} capability checks passed; ${capabilityFailCount} failed.`,
    providerCandidateSummary: input.state.allowed
      ? 'Provider candidate allowed for synthetic fixture only.'
      : 'Provider candidate rejected by fail-closed gate policy checks.',
    rejectionSummary:
      input.resolution.rejectionReasons.length === 0
        ? 'No rejection reasons for this synthetic fixture.'
        : input.resolution.rejectionReasons.join(' | '),
    futureBoundaryNotes: [
      'Future phase only: manual unlock required before any non-synthetic provider boundary.',
      'This report is deterministic, local-only, and read-only.',
    ],
    noLiveExecution: true,
    noRecommendationOutput: true,
  };
}
