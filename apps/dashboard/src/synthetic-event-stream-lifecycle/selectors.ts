/**
 * Phase 56 — Synthetic Event Stream Lifecycle v1: selectors.
 */

import {
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURE_MAP,
  SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES,
} from './fixtures.js';
import type {
  SyntheticEventStreamEnvelope,
  SyntheticEventStreamLifecycleApiSummaryContract,
  SyntheticEventStreamLifecycleDerivedState,
  SyntheticEventStreamLifecycleFixture,
  SyntheticEventStreamLifecycleSelectorQuery,
  SyntheticEventStreamLifecycleSelectorResult,
  SyntheticEventStreamLifecycleViewModel,
} from './types.js';

export function selectSyntheticEventStreamLifecycleFixture(
  query: SyntheticEventStreamLifecycleSelectorQuery = {},
): SyntheticEventStreamLifecycleSelectorResult {
  const fromId = query.fixtureId
    ? (SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURE_MAP.get(query.fixtureId) ?? null)
    : null;

  const fixture =
    fromId ??
    SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES.find(candidate => {
      if (query.fixtureName && candidate.fixtureName !== query.fixtureName) {
        return false;
      }
      if (query.streamKind && candidate.fixtureKind !== query.streamKind) {
        return false;
      }
      if (
        query.lifecycleStatus &&
        candidate.derivedLifecycleState.lifecycleStatus !== query.lifecycleStatus
      ) {
        return false;
      }
      if (
        query.safetyStatus &&
        candidate.derivedLifecycleState.safetyState.status !== query.safetyStatus
      ) {
        return false;
      }
      return true;
    }) ?? SYNTHETIC_EVENT_STREAM_LIFECYCLE_FIXTURES[0];

  const matched =
    fixture !== undefined &&
    (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
    (!query.fixtureName || fixture.fixtureName === query.fixtureName) &&
    (!query.streamKind || fixture.fixtureKind === query.streamKind) &&
    (!query.lifecycleStatus ||
      fixture.derivedLifecycleState.lifecycleStatus === query.lifecycleStatus) &&
    (!query.safetyStatus || fixture.derivedLifecycleState.safetyState.status === query.safetyStatus);

  return {
    selectorId: `phase56-selector-${fixture?.fixtureId ?? 'none'}`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase56-none',
    selectedStreamKind: fixture?.fixtureKind ?? 'clean_launch_lifecycle',
    matched,
    source: 'synthetic_fixture_only',
  };
}

export function selectSyntheticEventStreamLifecycleEvents(
  fixture: SyntheticEventStreamLifecycleFixture,
): readonly SyntheticEventStreamEnvelope[] {
  return fixture.events;
}

export function selectSyntheticEventStreamLifecycleDerivedState(
  fixture: SyntheticEventStreamLifecycleFixture,
): SyntheticEventStreamLifecycleDerivedState {
  return fixture.derivedLifecycleState;
}

export function selectSyntheticEventStreamLifecycleViewModel(
  fixture: SyntheticEventStreamLifecycleFixture,
): SyntheticEventStreamLifecycleViewModel {
  return fixture.viewModel;
}

export function selectSyntheticEventStreamLifecycleApiSummary(
  fixture: SyntheticEventStreamLifecycleFixture,
): SyntheticEventStreamLifecycleApiSummaryContract {
  return fixture.apiContracts.summary;
}
