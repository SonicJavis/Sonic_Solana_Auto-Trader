import type { SlotObservationPlaceholder } from './types.js';

export function buildSlotObservationPlaceholder(input: {
  slotObservationPlaceholderId: string;
  reasonCodes: readonly string[];
}): SlotObservationPlaceholder {
  return {
    slotObservationPlaceholderId: input.slotObservationPlaceholderId,
    liveSlotFetchAllowed: false,
    deterministicLabelOnly: true,
    reasonCodes: [...input.reasonCodes],
  };
}
