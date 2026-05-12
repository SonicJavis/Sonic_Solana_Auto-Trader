import type { SyntheticEventStreamLifecycleEventKind } from '../synthetic-event-stream-lifecycle/types.js';
import type { GeneratedLifecyclePreview } from './types.js';

export function buildGeneratedLifecyclePreview(input: {
  fixtureId: string;
  sourceScenarioId: string;
  eventKinds: readonly SyntheticEventStreamLifecycleEventKind[];
}): GeneratedLifecyclePreview {
  const eventPreviewIds = input.eventKinds.map(
    (eventKind, index) => `${input.fixtureId}-lifecycle-event-preview-${index + 1}-${eventKind}`,
  );
  const causalLinks = eventPreviewIds.map((eventPreviewId, index) => ({
    eventPreviewId,
    parentEventPreviewIds: index === 0 ? [] : [eventPreviewIds[index - 1]!],
  }));
  return {
    lifecyclePreviewId: `${input.fixtureId}-lifecycle-preview`,
    sourceScenarioId: input.sourceScenarioId,
    eventPreviewIds,
    eventKinds: [...input.eventKinds],
    causalLinks,
    deterministicSequence: eventPreviewIds.map((_, index) => index + 1),
  };
}
