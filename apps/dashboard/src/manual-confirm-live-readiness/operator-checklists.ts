import type {
  ManualConfirmChecklistStatus,
  ManualConfirmOperatorChecklist,
  ManualConfirmOperatorChecklistItem,
} from './types.js';

export function buildManualConfirmOperatorChecklist(input: {
  checklistId: string;
  checklistItems: readonly ManualConfirmOperatorChecklistItem[];
  checklistStatus: ManualConfirmChecklistStatus;
}): ManualConfirmOperatorChecklist {
  const passedItemCount = input.checklistItems.filter(item => item.status === 'passed').length;
  const failedItemCount = input.checklistItems.filter(item => item.status === 'failed').length;
  const warningItemCount = input.checklistItems.filter(item => item.status === 'warning').length;
  return {
    checklistId: input.checklistId,
    checklistItems: input.checklistItems,
    requiredItemCount: input.checklistItems.length,
    passedItemCount,
    failedItemCount,
    warningItemCount,
    checklistStatus: input.checklistStatus,
    failClosed: true,
  };
}
