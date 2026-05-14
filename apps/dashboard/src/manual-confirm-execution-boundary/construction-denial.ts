import type { ExecutionConstructionDenial } from './types.js';

export function buildExecutionConstructionDenial(input: {
  constructionDenialId: string;
  reasonCodes: readonly string[];
}): ExecutionConstructionDenial {
  return {
    constructionDenialId: input.constructionDenialId,
    transactionConstructionBlocked: true,
    serializationBlocked: true,
    simulationBlocked: true,
    reasonCodes: input.reasonCodes,
  };
}
