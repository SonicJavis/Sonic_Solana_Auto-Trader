import type { SigningOperatorAcknowledgement } from './types.js';

export function buildSigningOperatorAcknowledgement(input: {
  operatorAcknowledgementId: string;
  acknowledgementRecorded: boolean;
}): SigningOperatorAcknowledgement {
  return {
    operatorAcknowledgementId: input.operatorAcknowledgementId,
    acknowledgementRecorded: input.acknowledgementRecorded,
    acknowledgementAuthorizesSigning: false,
  };
}
