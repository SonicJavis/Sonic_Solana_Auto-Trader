import { POST_SEND_OBSERVATION_BOUNDARY_FIXTURES } from './fixtures.js';
import type {
  PostSendObservationBoundaryFixture,
  PostSendObservationBoundaryKind,
  PostSendObservationBoundarySelector,
  PostSendObservationBoundarySelectorQuery,
} from './types.js';

function matchesQuery(fixture: PostSendObservationBoundaryFixture, query: PostSendObservationBoundarySelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectPostSendObservationBoundaryFixture(
  query: PostSendObservationBoundarySelectorQuery,
): PostSendObservationBoundarySelector {
  const selected = POST_SEND_OBSERVATION_BOUNDARY_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase85-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'observation_boundary_design_ready' as PostSendObservationBoundaryKind,
      matched: false,
      source: 'deterministic_fixture_only',
    };
  }

  return {
    selectorId: `${selected.fixtureId}-selector`,
    selectedFixtureId: selected.fixtureId,
    selectedFixtureKind: selected.fixtureKind,
    matched: true,
    source: 'deterministic_fixture_only',
  };
}
