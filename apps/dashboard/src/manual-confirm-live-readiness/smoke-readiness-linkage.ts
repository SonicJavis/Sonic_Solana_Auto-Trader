import type { ManualConfirmSmokeReadinessLinkage } from './types.js';

export function buildManualConfirmSmokeReadinessLinkage(input: {
  linkageId: string;
  phase69FixtureRef: string;
  phase74FixtureRef: string;
  smokeCertified: boolean;
  smokeStatus: string;
}): ManualConfirmSmokeReadinessLinkage {
  return {
    linkageId: input.linkageId,
    phase69FixtureRef: input.phase69FixtureRef,
    phase74FixtureRef: input.phase74FixtureRef,
    smokeCertified: input.smokeCertified,
    smokeStatus: input.smokeStatus,
  };
}
