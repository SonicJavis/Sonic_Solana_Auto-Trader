import type {
  ProviderAwareReplayGeneratedScenario,
  ProviderAwareReplayScenarioViewModel,
  ProviderReplayParityCheck,
} from './types.js';

export function buildProviderAwareReplayViewModel(input: {
  fixtureId: string;
  fixtureName: ProviderAwareReplayScenarioViewModel['fixtureName'];
  generatedScenario: ProviderAwareReplayGeneratedScenario;
  parityCheck: ProviderReplayParityCheck;
}): ProviderAwareReplayScenarioViewModel {
  return {
    viewModelId: `${input.fixtureId}-view-model`,
    fixtureId: input.fixtureId,
    fixtureName: input.fixtureName,
    sourceQualityFixtureName: input.generatedScenario.sourceQualityFixtureName,
    parityStatus: input.parityCheck.parityStatus,
    failClosed: input.parityCheck.failClosed,
    mismatchCount: input.parityCheck.mismatchIds.length,
    summary: input.parityCheck.summary,
  };
}
