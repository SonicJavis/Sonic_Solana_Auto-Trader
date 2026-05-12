import type { ProviderAwareReplayGeneratedScenario } from './types.js';

export function buildProviderAwareReplayScenario(input: {
  fixtureId: string;
  scenarioName: ProviderAwareReplayGeneratedScenario['scenarioName'];
  scenarioKind: ProviderAwareReplayGeneratedScenario['scenarioKind'];
  sourceQualityFixtureName: ProviderAwareReplayGeneratedScenario['sourceQualityFixtureName'];
  sourceConfidenceLabel: string;
  sourceIssueIds: readonly string[];
  sourceMismatchReportIds: readonly string[];
  providerProvenanceRefs: readonly string[];
  generatedLifecyclePreviewIds: readonly string[];
  expectedReplaySnapshotIds: readonly string[];
  replayFixtureName: ProviderAwareReplayGeneratedScenario['replayFixtureName'];
  lifecycleFixtureName: ProviderAwareReplayGeneratedScenario['lifecycleFixtureName'];
  failClosed: boolean;
}): ProviderAwareReplayGeneratedScenario {
  return {
    scenarioId: `${input.fixtureId}-scenario`,
    scenarioName: input.scenarioName,
    scenarioKind: input.scenarioKind,
    sourceQualityFixtureName: input.sourceQualityFixtureName,
    sourceConfidenceLabel: input.sourceConfidenceLabel,
    sourceIssueIds: [...input.sourceIssueIds],
    sourceMismatchReportIds: [...input.sourceMismatchReportIds],
    providerProvenanceRefs: [...input.providerProvenanceRefs],
    generatedLifecyclePreviewIds: [...input.generatedLifecyclePreviewIds],
    expectedReplaySnapshotIds: [...input.expectedReplaySnapshotIds],
    replayFixtureName: input.replayFixtureName,
    lifecycleFixtureName: input.lifecycleFixtureName,
    safetyNotes: [
      'deterministic-fixture-only',
      'provider-aware-non-live',
      'replay-parity-not-profitability',
      input.failClosed ? 'fail-closed-critical-path' : 'non-critical-path',
    ],
  };
}
