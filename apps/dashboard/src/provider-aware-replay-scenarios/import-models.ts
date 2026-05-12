import type {
  ProviderAwareReplayImportModel,
  ProviderAwareReplayImportStatus,
  ProviderAwareReplayScenarioName,
} from './types.js';
import { PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT } from './types.js';

export function buildProviderAwareReplayImport(input: {
  fixtureName: ProviderAwareReplayScenarioName;
  sourceQualityFixtureName: ProviderAwareReplayImportModel['sourceQualityFixtureName'];
  sourceReconciliationIds: readonly string[];
  sourceProviderIds: readonly string[];
  replayFixtureName: ProviderAwareReplayImportModel['replayFixtureName'];
  lifecycleFixtureName: ProviderAwareReplayImportModel['lifecycleFixtureName'];
  importStatus: ProviderAwareReplayImportStatus;
}): ProviderAwareReplayImportModel {
  return {
    importId: `phase68-import-${input.fixtureName}`,
    importName: `${input.fixtureName}-import-envelope`,
    sourceQualityFixtureName: input.sourceQualityFixtureName,
    sourceReconciliationIds: [...input.sourceReconciliationIds],
    sourceProviderIds: [...input.sourceProviderIds].sort((left, right) => left.localeCompare(right, 'en-US')),
    replayFixtureName: input.replayFixtureName,
    lifecycleFixtureName: input.lifecycleFixtureName,
    importedAt: PHASE_68_PROVIDER_AWARE_REPLAY_SCENARIOS_GENERATED_AT,
    importStatus: input.importStatus,
    fixtureOnly: true,
    liveData: false,
  };
}
