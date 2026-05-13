import type { ReplayImportCandidate } from './types.js';

export function buildReplayImportCandidate(input: {
  fixtureId: string;
  candidateName: string;
  candidateKind: ReplayImportCandidate['candidateKind'];
  sourceScenarioFixtureName: ReplayImportCandidate['sourceScenarioFixtureName'];
  sourceSnapshotFixtureName: ReplayImportCandidate['sourceSnapshotFixtureName'];
  phase: ReplayImportCandidate['phase'];
  failClosed: boolean;
}): ReplayImportCandidate {
  return {
    candidateId: `${input.fixtureId}-candidate`,
    candidateName: input.candidateName,
    candidateKind: input.candidateKind,
    phase: input.phase,
    sourceScenarioFixtureName: input.sourceScenarioFixtureName,
    sourceSnapshotFixtureName: input.sourceSnapshotFixtureName,
    fixtureOnly: true,
    liveImport: false,
    runtimeImport: false,
    failClosed: input.failClosed,
  };
}
