import type { SnapshotSourceSelection } from './types.js';

export function buildSnapshotSourceSelection(input: {
  fixtureId: string;
  selectedSnapshotIds: readonly string[];
  selectedProviderIds: readonly string[];
  selectedReliabilityRefs: SnapshotSourceSelection['selectedReliabilityRefs'];
  selectionReasonCode: string;
  selectionWarnings: readonly string[];
}): SnapshotSourceSelection {
  return {
    sourceSelectionId: `${input.fixtureId}-source-selection`,
    selectedSnapshotIds: [...input.selectedSnapshotIds],
    selectedProviderIds: [...input.selectedProviderIds],
    selectedReliabilityRefs: [...input.selectedReliabilityRefs],
    selectionReasonCode: input.selectionReasonCode,
    selectionWarnings: [...input.selectionWarnings],
  };
}
