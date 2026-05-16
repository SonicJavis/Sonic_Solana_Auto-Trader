import type { TransactionResultDenial } from './types.js';

export function buildTransactionResultDenial(input: {
  transactionResultDenialId: string;
  reasonCodes: readonly string[];
}): TransactionResultDenial {
  return {
    transactionResultDenialId: input.transactionResultDenialId,
    transactionLookupBlocked: true,
    transactionResultProduced: false,
    transactionMetaProduced: false,
    reasonCodes: [...input.reasonCodes],
  };
}
