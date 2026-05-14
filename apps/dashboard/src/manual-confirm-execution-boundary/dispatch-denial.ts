import type { ExecutionDispatchDenial } from './types.js';

export function buildExecutionDispatchDenial(input: {
  dispatchDenialId: string;
  reasonCodes: readonly string[];
}): ExecutionDispatchDenial {
  return {
    dispatchDenialId: input.dispatchDenialId,
    dispatchBlocked: true,
    sendBlocked: true,
    networkSubmitBlocked: true,
    sendAllowed: false,
    reasonCodes: input.reasonCodes,
  };
}
