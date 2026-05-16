import type { SignoffPlaceholder } from './types.js';

export function buildSignoffPlaceholder(input: {
  id: string;
  reasonCodes?: readonly string[];
}): SignoffPlaceholder {
  return {
    signoffPlaceholderId: input.id,
    placeholderOnly: true,
    realSignoffCaptured: false,
    signoffAuthorizesUnlock: false,
    separateFuturePhaseRequired: true,
    reasonCodes: input.reasonCodes ?? [],
  };
}
