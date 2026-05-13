import type { SnapshotScenarioIntegrityContract } from './types.js';

export function buildSnapshotScenarioIntegrityContract(input: {
  fixtureId: string;
  checksum: string;
  sourceHash: string;
  generatedScenarioHash: string;
}): SnapshotScenarioIntegrityContract {
  return {
    integrityId: `${input.fixtureId}-scenario-integrity`,
    checksum: input.checksum,
    checksumAlgorithm: 'fnv1a32',
    sourceHash: input.sourceHash,
    generatedScenarioHash: input.generatedScenarioHash,
    deterministic: true,
  };
}
