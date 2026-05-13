import type { ManualConfirmDryRunSmokeLinkage } from './types.js';

export function buildManualConfirmDryRunSmokeLinkage(input: {
  linkageId: string;
  phase74FixtureRef: string;
  phase69FixtureRef: string;
  smokeLinked: boolean;
}): ManualConfirmDryRunSmokeLinkage {
  return input;
}
