import type {
  GeneratedSnapshotScenarioDescriptor,
  SnapshotReplayDescriptor,
  SnapshotScenarioGenerationAuditReport,
  SnapshotScenarioGenerationPlan,
  SnapshotScenarioIntegrityContract,
  SnapshotScenarioLineage,
  SnapshotScenarioValidationContract,
  SnapshotSourceSelection,
} from './types.js';

export function buildSnapshotScenarioAuditReport(input: {
  fixtureId: string;
  generationPlan: SnapshotScenarioGenerationPlan;
  sourceSelection: SnapshotSourceSelection;
  scenarioDescriptor: GeneratedSnapshotScenarioDescriptor;
  replayDescriptor: SnapshotReplayDescriptor;
  lineageModel: SnapshotScenarioLineage;
  integrityContract: SnapshotScenarioIntegrityContract;
  validationContract: SnapshotScenarioValidationContract;
}): SnapshotScenarioGenerationAuditReport {
  return {
    reportId: `${input.fixtureId}-scenario-generation-audit-report`,
    planSummary: `${input.generationPlan.generationPlanName} (${input.generationPlan.generationPlanKind})`,
    sourceSelectionSummary: `snapshots=${input.sourceSelection.selectedSnapshotIds.length} providers=${input.sourceSelection.selectedProviderIds.length}`,
    scenarioSummary: `${input.scenarioDescriptor.scenarioName} (${input.scenarioDescriptor.scenarioKind})`,
    replaySummary: `${input.replayDescriptor.replayKind} steps=${input.replayDescriptor.expectedStepCount}`,
    lineageSummary: input.lineageModel.lineageSummary,
    integritySummary: `${input.integrityContract.checksumAlgorithm}/${input.integrityContract.checksum}`,
    validationSummary: `rules=${input.validationContract.rules.length} failClosed=${String(input.validationContract.failClosed)}`,
    safetySummary:
      'Deterministic fixture-only scenario generation with no live ingestion, no live replay import, no network, no execution, and non-advisory outputs.',
  };
}
