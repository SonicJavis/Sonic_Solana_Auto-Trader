import type { ManualConfirmDryRunPreflight, ManualConfirmDryRunPreflightStatus } from './types.js';

export function buildManualConfirmDryRunPreflight(input: {
  preflightId: string;
  sourceReadinessRefs: readonly string[];
  sourceCertificationRefs: readonly string[];
  sourceSmokeRefs: readonly string[];
  preflightStatus: ManualConfirmDryRunPreflightStatus;
}): ManualConfirmDryRunPreflight {
  return {
    preflightId: input.preflightId,
    sourceReadinessRefs: input.sourceReadinessRefs,
    sourceCertificationRefs: input.sourceCertificationRefs,
    sourceSmokeRefs: input.sourceSmokeRefs,
    preflightStatus: input.preflightStatus,
    failClosed: true,
  };
}
