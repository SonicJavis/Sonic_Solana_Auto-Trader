import type { ProviderFixtureRegenerationContract } from './types.js';

export function buildProviderFixtureRegenerationContract(input: {
  fixtureId: string;
  sourceQualityFixtureName: ProviderFixtureRegenerationContract['sourceQualityFixtureName'];
  targetScenarioName: ProviderFixtureRegenerationContract['targetScenarioName'];
}): ProviderFixtureRegenerationContract {
  return {
    regenerationContractId: `${input.fixtureId}-regeneration-contract`,
    sourceQualityFixtureName: input.sourceQualityFixtureName,
    targetScenarioName: input.targetScenarioName,
    regenerationMode: 'deterministic_preview_only',
    filesystemWrites: false,
    downloads: false,
    deterministicPreviewOnly: true,
    generatedArtifactPreviewId: `${input.fixtureId}-artifact-preview`,
  };
}
