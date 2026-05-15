import type { DispatchDenial } from './types.js';

export function buildDispatchDenial(input: { dispatchDenialId: string; reasonCodes: readonly string[] }): DispatchDenial {
  return {
    dispatchDenialId: input.dispatchDenialId,
    dispatchBlocked: true,
    queueDispatchAllowed: false,
    workerDispatchAllowed: false,
    routeDispatchAllowed: false,
    reasonCodes: [...input.reasonCodes],
  };
}
