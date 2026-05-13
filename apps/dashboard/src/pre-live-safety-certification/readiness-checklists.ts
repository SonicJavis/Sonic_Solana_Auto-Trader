import type { PreLiveChecklistStatus, PreLiveReadinessChecklist } from './types.js';

export function buildPreLiveReadinessChecklist(input: {
  checklistId: string;
  checklistName: string;
  checklistItems: readonly string[];
  requiredItemCount: number;
  passedItemCount: number;
  failedItemCount: number;
  warningItemCount: number;
  checklistStatus: PreLiveChecklistStatus;
}): PreLiveReadinessChecklist {
  return {
    checklistId: input.checklistId,
    checklistName: input.checklistName,
    checklistItems: [...input.checklistItems],
    requiredItemCount: input.requiredItemCount,
    passedItemCount: input.passedItemCount,
    failedItemCount: input.failedItemCount,
    warningItemCount: input.warningItemCount,
    checklistStatus: input.checklistStatus,
    failClosed: true,
  };
}
