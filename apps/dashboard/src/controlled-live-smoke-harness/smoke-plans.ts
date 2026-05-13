import {
  CONTROLLED_LIVE_SMOKE_HARNESS_PHASE,
  type SmokePlan,
  type SmokePlanKind,
} from './types.js';
import type { LiveSmokeSafetyCertificationName } from '../live-smoke-safety-certification/types.js';

export function buildControlledSmokePlan(input: {
  smokePlanId: string;
  smokePlanName: string;
  smokePlanKind: SmokePlanKind;
  targetProviderId: string;
  sourceCertificationFixtureName: LiveSmokeSafetyCertificationName;
}): SmokePlan {
  return {
    smokePlanId: input.smokePlanId,
    smokePlanName: input.smokePlanName,
    smokePlanKind: input.smokePlanKind,
    phase: CONTROLLED_LIVE_SMOKE_HARNESS_PHASE,
    targetProviderId: input.targetProviderId,
    sourceCertificationFixtureName: input.sourceCertificationFixtureName,
    fixtureOnly: true,
    disabledByDefault: true,
    liveNetworkDefault: false,
    failClosed: true,
  };
}
