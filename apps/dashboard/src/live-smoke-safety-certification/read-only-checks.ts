import type { ReadOnlySmokeCheck, ReadOnlySmokeCheckKind } from './types.js';

export function buildReadOnlySmokeCheck(input: {
  fixtureId: string;
  checkKind: ReadOnlySmokeCheckKind;
  providerId: string;
  passed: boolean;
  reasonCode: string;
  expectedCapability: string;
  observedCapability: string;
  sourceRefs: readonly string[];
}): ReadOnlySmokeCheck {
  return {
    checkId: `${input.fixtureId}-check-${input.checkKind}`,
    checkKind: input.checkKind,
    providerId: input.providerId,
    expectedCapability: input.expectedCapability,
    observedCapability: input.observedCapability,
    passed: input.passed,
    reasonCode: input.reasonCode,
    sourceRefs: [...input.sourceRefs],
    writeMethodDetected: false,
  };
}
