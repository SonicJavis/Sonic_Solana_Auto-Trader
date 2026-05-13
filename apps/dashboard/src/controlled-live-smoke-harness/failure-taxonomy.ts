import type { SmokeFailureTaxonomy, SmokeFailureKind, SmokeFailureSeverity } from './types.js';

export function buildSmokeFailureTaxonomy(input: {
  failureId: string;
  failureKind: SmokeFailureKind;
  severity: SmokeFailureSeverity;
  failClosed: boolean;
  reasonCode: string;
  recoveryHint: string;
}): SmokeFailureTaxonomy {
  return {
    failureId: input.failureId,
    failureKind: input.failureKind,
    severity: input.severity,
    failClosed: input.failClosed,
    reasonCode: input.reasonCode,
    recoveryHint: input.recoveryHint,
  };
}
