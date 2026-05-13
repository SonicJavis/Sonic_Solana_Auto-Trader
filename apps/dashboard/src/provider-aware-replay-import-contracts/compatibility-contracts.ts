import type { SnapshotSchemaContract } from './types.js';

export function buildSnapshotSchemaContract(input: {
  fixtureId: string;
  expectedSchemaVersion: string;
  compatibilityLevel: SnapshotSchemaContract['compatibilityLevel'];
  requiredFields: readonly string[];
  optionalFields: readonly string[];
  criticalFields: readonly string[];
  failClosedOnCriticalDrift: boolean;
}): SnapshotSchemaContract {
  return {
    schemaContractId: `${input.fixtureId}-schema-contract`,
    expectedSchemaVersion: input.expectedSchemaVersion,
    compatibilityLevel: input.compatibilityLevel,
    requiredFields: [...input.requiredFields],
    optionalFields: [...input.optionalFields],
    criticalFields: [...input.criticalFields],
    failClosedOnCriticalDrift: input.failClosedOnCriticalDrift,
  };
}
