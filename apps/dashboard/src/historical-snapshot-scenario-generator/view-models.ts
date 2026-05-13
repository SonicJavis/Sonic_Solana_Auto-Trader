import type {
  GeneratedSnapshotScenarioDescriptor,
  HistoricalSnapshotScenarioGeneratorName,
  HistoricalSnapshotScenarioGeneratorViewModel,
  SnapshotScenarioRejectionContract,
} from './types.js';

export function buildSnapshotScenarioViewModel(input: {
  fixtureId: string;
  fixtureName: HistoricalSnapshotScenarioGeneratorName;
  scenarioDescriptor: GeneratedSnapshotScenarioDescriptor;
  rejectionContract: SnapshotScenarioRejectionContract;
}): HistoricalSnapshotScenarioGeneratorViewModel {
  return {
    viewModelId: `${input.fixtureId}-view-model`,
    fixtureId: input.fixtureId,
    fixtureName: input.fixtureName,
    scenarioId: input.scenarioDescriptor.scenarioId,
    scenarioKind: input.scenarioDescriptor.scenarioKind,
    replayReady: input.scenarioDescriptor.replayReady,
    blocked: input.rejectionContract.failClosed && input.rejectionContract.severity === 'critical',
    quarantined: input.rejectionContract.rejectionKind === 'partial_snapshot' && input.rejectionContract.failClosed,
    summary: `${input.scenarioDescriptor.scenarioKind}/${input.rejectionContract.rejectionKind}/${input.rejectionContract.severity}`,
  };
}
