import type { ManualConfirmDispatchBlock } from './types.js';

export function buildManualConfirmDispatchBlock(input: {
  blockId: string;
  blockKind: string;
  reasonCodes: readonly string[];
  safetyNotes: readonly string[];
}): ManualConfirmDispatchBlock {
  return {
    blockId: input.blockId,
    blockKind: input.blockKind,
    dispatchBlocked: true,
    transactionSendBlocked: true,
    reasonCodes: input.reasonCodes,
    safetyNotes: input.safetyNotes,
  };
}
