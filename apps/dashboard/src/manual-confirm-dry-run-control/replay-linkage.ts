import type { ManualConfirmDryRunReplayLinkage } from './types.js';

export function buildManualConfirmDryRunReplayLinkage(input: {
  linkageId: string;
  phase73FixtureRef: string;
  phase72FixtureRef: string;
  phase70FixtureRef: string;
  phase68FixtureRef: string;
  replayLinked: boolean;
}): ManualConfirmDryRunReplayLinkage {
  return input;
}
