/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1: view models.
 */

import type {
  SyntheticEventStreamLifecycleFixture,
  SyntheticEventStreamLifecycleViewModel,
} from './types.js';

export function buildSyntheticEventStreamLifecycleViewModel(
  fixture: SyntheticEventStreamLifecycleFixture,
): SyntheticEventStreamLifecycleViewModel {
  const state = fixture.derivedLifecycleState;

  return {
    viewModelId: `phase56-view-${fixture.fixtureId}`,
    streamLabel: fixture.streamIdentity.streamName,
    lifecycleStatusLabel: state.lifecycleStatus,
    safetyStatusLabel: state.safetyState.status,
    liquidityLabel: state.liquidityState.liquidityLabel,
    metadataLabel: state.metadataState.metadataCompletenessLabel,
    holderLabel: state.holderState.concentrationLabel,
    creatorLabel: state.creatorState.creatorRiskLabel,
    anomalyLabel: state.anomalyState.anomalyLabel,
    evidenceEventCount: state.eventReferences.length,
    nonAdvisorySummary:
      'Lifecycle summary is fixture-only, non-actionable, and requires review context; not a signal.',
  };
}
