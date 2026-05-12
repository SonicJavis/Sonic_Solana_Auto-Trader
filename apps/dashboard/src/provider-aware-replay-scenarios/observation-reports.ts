import type {
  ProviderAwareReplayGeneratedScenario,
  ProviderAwareReplayImportModel,
  ProviderFixtureRegenerationContract,
  ProviderObservationReplayReport,
  ProviderReplayParityCheck,
  ProviderReplayProvenanceMapping,
} from './types.js';

export function buildProviderObservationReplayReport(input: {
  fixtureId: string;
  importModel: ProviderAwareReplayImportModel;
  generatedScenario: ProviderAwareReplayGeneratedScenario;
  provenanceMappings: readonly ProviderReplayProvenanceMapping[];
  parityCheck: ProviderReplayParityCheck;
  regenerationContract: ProviderFixtureRegenerationContract;
}): ProviderObservationReplayReport {
  return {
    reportId: `${input.fixtureId}-observation-report`,
    importSummary: `Import ${input.importModel.importStatus} from ${input.importModel.sourceQualityFixtureName}.`,
    scenarioSummary: `Generated ${input.generatedScenario.scenarioKind} with ${input.generatedScenario.expectedReplaySnapshotIds.length} expected replay snapshots.`,
    provenanceSummary: `Mapped ${input.provenanceMappings.length} provider provenance path(s).`,
    paritySummary: `${input.parityCheck.parityStatus} with ${input.parityCheck.mismatchIds.length} mismatch id(s).`,
    regenerationSummary: `Regeneration mode ${input.regenerationContract.regenerationMode} with deterministic preview only.`,
    safetySummary:
      'Read-only deterministic fixture report. No live data, no network streaming, no key-based dispatch, no advisory content.',
  };
}
