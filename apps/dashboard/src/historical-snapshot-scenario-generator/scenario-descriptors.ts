import type { GeneratedSnapshotScenarioDescriptor } from './types.js';

export function buildGeneratedScenarioDescriptor(input: {
  fixtureId: string;
  scenarioName: string;
  scenarioKind: GeneratedSnapshotScenarioDescriptor['scenarioKind'];
  sourceSnapshotId: string;
  replayReady: boolean;
}): GeneratedSnapshotScenarioDescriptor {
  return {
    scenarioId: `${input.fixtureId}-generated-scenario`,
    scenarioName: input.scenarioName,
    scenarioKind: input.scenarioKind,
    sourceSnapshotId: input.sourceSnapshotId,
    generatedFromSnapshot: true,
    deterministic: true,
    replayReady: input.replayReady,
    advisory: false,
  };
}
