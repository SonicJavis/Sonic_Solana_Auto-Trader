import type { SmokeResultFixture, SmokeResultKind, SmokeResultStatus } from './types.js';

export function buildSmokeResultFixture(input: {
  resultId: string;
  resultKind: SmokeResultKind;
  status: SmokeResultStatus;
  skipped: boolean;
  disabled: boolean;
  providerId: string;
  checkedAt: string;
  safetySummary: string;
}): SmokeResultFixture {
  return {
    resultId: input.resultId,
    resultKind: input.resultKind,
    status: input.status,
    skipped: input.skipped,
    disabled: input.disabled,
    providerId: input.providerId,
    checkedAt: input.checkedAt,
    liveNetworkUsed: false,
    safetySummary: input.safetySummary,
  };
}
