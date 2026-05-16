import type { ReadinessImpactPlaceholder } from './types.js';

export function buildReadinessImpactPlaceholder(input: {
  id: string;
  reasonCodes?: readonly string[];
}): ReadinessImpactPlaceholder {
  return {
    readinessImpactPlaceholderId: input.id,
    deterministicLabelOnly: true,
    liveReadinessFetchAllowed: false,
    readinessImpactProduced: false,
    reasonCodes: input.reasonCodes ?? [],
  };
}
