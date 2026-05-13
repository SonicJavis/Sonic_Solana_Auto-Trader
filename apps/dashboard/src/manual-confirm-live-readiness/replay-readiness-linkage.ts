import type { ManualConfirmReplayReadinessLinkage } from './types.js';

export function buildManualConfirmReplayReadinessLinkage(input: {
  linkageId: string;
  phase68FixtureRef: string;
  phase73FixtureRef: string;
  replayImportComplete: boolean;
  replayStatus: string;
}): ManualConfirmReplayReadinessLinkage {
  return {
    linkageId: input.linkageId,
    phase68FixtureRef: input.phase68FixtureRef,
    phase73FixtureRef: input.phase73FixtureRef,
    replayImportComplete: input.replayImportComplete,
    replayStatus: input.replayStatus,
  };
}
