import type { SendRequestDenial } from './types.js';

export function buildSendRequestDenial(input: { sendRequestDenialId: string; reasonCodes: readonly string[] }): SendRequestDenial {
  return {
    sendRequestDenialId: input.sendRequestDenialId,
    sendRequestBlocked: true,
    sendTransactionBlocked: true,
    sendRawTransactionBlocked: true,
    transactionIdProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
