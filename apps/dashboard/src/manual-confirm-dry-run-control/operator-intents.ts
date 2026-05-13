import type { ManualConfirmDryRunIntentStatus, ManualConfirmOperatorIntent } from './types.js';

export function buildManualConfirmOperatorIntent(input: {
  intentId: string;
  intentKind: string;
  operatorIntentLabel: string;
  intentStatus: ManualConfirmDryRunIntentStatus;
}): ManualConfirmOperatorIntent {
  return {
    intentId: input.intentId,
    intentKind: input.intentKind,
    operatorIntentLabel: input.operatorIntentLabel,
    orderCreationAllowed: false,
    transactionConstructionAllowed: false,
    dispatchAllowed: false,
    intentStatus: input.intentStatus,
  };
}
