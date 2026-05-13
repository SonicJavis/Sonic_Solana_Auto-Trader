import type { LiveSnapshotFixtureCandidateContract } from './types.js';

export function buildLiveSnapshotFixtureCandidateContract(input: {
  fixtureCandidateId: string;
  fixtureCandidatePath: string;
}): LiveSnapshotFixtureCandidateContract {
  return {
    fixtureCandidateId: input.fixtureCandidateId,
    fixtureCandidatePath: input.fixtureCandidatePath,
    fixtureCandidateOnly: true,
    persistenceAllowed: false,
  };
}
