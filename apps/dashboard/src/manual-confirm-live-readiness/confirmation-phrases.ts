import {
  type ManualConfirmPhraseContract,
  type ManualConfirmPhraseStatus,
} from './types.js';

export function buildManualConfirmPhraseContract(input: {
  phraseId: string;
  phraseKind: string;
  exactPhrase: string;
  phraseMatched: boolean;
  phraseStatus: ManualConfirmPhraseStatus;
}): ManualConfirmPhraseContract {
  return {
    phraseId: input.phraseId,
    phraseKind: input.phraseKind,
    phraseRequired: true,
    exactPhrase: input.exactPhrase,
    phraseMatched: input.phraseMatched,
    commandDispatchAllowed: false,
    executionAllowed: false,
    phraseStatus: input.phraseStatus,
  };
}
