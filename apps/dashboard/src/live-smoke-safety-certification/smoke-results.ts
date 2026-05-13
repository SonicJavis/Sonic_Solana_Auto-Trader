import type { LiveSmokeResultStatus, SmokeResult } from './types.js';

export function buildSmokeResult(input: {
  fixtureId: string;
  planId: string;
  status: LiveSmokeResultStatus;
  reasonCodes: readonly string[];
  evidenceRefs: readonly string[];
}): SmokeResult {
  return {
    resultId: `${input.fixtureId}-smoke-result`,
    planId: input.planId,
    status: input.status,
    skipped: input.status === 'skipped',
    blocked: input.status === 'blocked' || input.status === 'certification_failed',
    certifiedOffline: input.status === 'certified_offline',
    reasonCodes: [...input.reasonCodes],
    evidenceRefs: [...input.evidenceRefs],
  };
}
