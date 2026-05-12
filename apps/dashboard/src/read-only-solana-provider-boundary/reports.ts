import type {
  BuildReadOnlySolanaBoundaryReportInput,
  ReadOnlySolanaBoundaryReport,
} from './types.js';

export function buildReadOnlySolanaBoundaryReport(
  input: BuildReadOnlySolanaBoundaryReportInput,
): ReadOnlySolanaBoundaryReport {
  const covered = input.fieldMappings.filter(mapping => mapping.coverageStatus === 'covered').length;
  const conformancePassCount = input.conformanceChecks.filter(check => check.pass).length;
  const conformanceFailCount = input.conformanceChecks.length - conformancePassCount;

  return {
    reportId: `${input.fixtureId}-report`,
    boundaryState: input.boundaryState.stateKind,
    mappingCoverageSummary: `${covered}/${input.fieldMappings.length} field mappings covered.`,
    conformanceSummary: `${conformancePassCount}/${input.conformanceChecks.length} conformance checks passed; ${conformanceFailCount} failed.`,
    errorNormalizationSummary: `${input.errorNormalizationRules.length} deterministic error normalization rules defined.`,
    gateCompatibilitySummary: input.gateBlocked
      ? 'Future real provider remains blocked by fail-closed gate.'
      : 'Boundary remains gate-aware and synthetic-only.',
    unsafeCapabilitySummary: 'Unsafe capabilities are rejected and remain disabled.',
    futureProviderNotes: [
      'Future-only placeholder contract; not connected.',
      'No live execution, recommendation output, or advisory behavior.',
    ],
    noLiveExecution: true,
    noRecommendationOutput: true,
  };
}

