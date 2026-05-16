import type { ReviewerChecklist } from './types.js';

export function buildReviewerChecklist(input: {
  id: string;
  checklistItems?: readonly string[];
  requiredReviewerCount?: number;
}): ReviewerChecklist {
  return {
    reviewerChecklistId: input.id,
    checklistItems: input.checklistItems ?? [],
    requiredReviewerCount: input.requiredReviewerCount ?? 2,
    makerCheckerRequired: true,
    allItemsDeterministic: true,
    liveReviewerLookupAllowed: false,
  };
}
