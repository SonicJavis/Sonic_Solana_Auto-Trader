import type { SnapshotScenarioGenerationPlan } from './types.js';

export function buildHistoricalSnapshotGenerationPlan(input: {
  fixtureId: string;
  generationPlanName: string;
  generationPlanKind: SnapshotScenarioGenerationPlan['generationPlanKind'];
  sourceSnapshotFixtureName: SnapshotScenarioGenerationPlan['sourceSnapshotFixtureName'];
  generatorMode: SnapshotScenarioGenerationPlan['generatorMode'];
  deterministicSeedLabel: string;
  failClosed: boolean;
}): SnapshotScenarioGenerationPlan {
  return {
    generationPlanId: `${input.fixtureId}-generation-plan`,
    generationPlanName: input.generationPlanName,
    generationPlanKind: input.generationPlanKind,
    phase: 72,
    sourceSnapshotFixtureName: input.sourceSnapshotFixtureName,
    generatorMode: input.generatorMode,
    deterministicSeedLabel: input.deterministicSeedLabel,
    fixtureOnly: true,
    liveData: false,
    requiresNetwork: false,
    requiresFilesystem: false,
    failClosed: input.failClosed,
  };
}
