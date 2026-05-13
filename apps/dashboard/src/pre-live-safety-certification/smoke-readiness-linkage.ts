import type { ControlledLiveSmokeHarnessName } from '../controlled-live-smoke-harness/types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';
import type { PreLiveSmokeReadinessLinkage } from './types.js';

export function buildPreLiveSmokeReadinessLinkage(input: {
  linkageId: string;
  sourcePhase74FixtureName: ControlledLiveSmokeHarnessName;
  sourcePhase69FixtureName: LiveSmokeSafetyCertificationName;
  smokeCertified: boolean;
  linked: boolean;
  reasonCodes: readonly string[];
}): PreLiveSmokeReadinessLinkage {
  return {
    linkageId: input.linkageId,
    sourcePhase74FixtureName: input.sourcePhase74FixtureName,
    sourcePhase69FixtureName: input.sourcePhase69FixtureName,
    smokeCertified: input.smokeCertified,
    linked: input.linked,
    reasonCodes: [...input.reasonCodes],
  };
}
