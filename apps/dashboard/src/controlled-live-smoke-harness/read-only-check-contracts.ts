import type { ReadOnlySmokeCheckContract } from './types.js';

export function buildReadOnlySmokeCheckContract(input: {
  checkId: string;
  checkKind: string;
  expectedOutcome: string;
}): ReadOnlySmokeCheckContract {
  return {
    checkId: input.checkId,
    checkKind: input.checkKind,
    readOnly: true,
    mutationAllowed: false,
    transactionAllowed: false,
    expectedOutcome: input.expectedOutcome,
    deterministicFixtureOnly: true,
  };
}
