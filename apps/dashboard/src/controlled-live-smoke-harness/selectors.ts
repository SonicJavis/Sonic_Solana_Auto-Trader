import { CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES } from './fixtures.js';
import type {
  ControlledLiveSmokeHarnessFixture,
  ControlledLiveSmokeHarnessKind,
  SmokeSelector,
  SmokeSelectorQuery,
} from './types.js';

function matchesQuery(
  fixture: ControlledLiveSmokeHarnessFixture,
  query: SmokeSelectorQuery,
): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectControlledLiveSmokeHarnessFixture(
  query: SmokeSelectorQuery,
): SmokeSelector {
  const selected = CONTROLLED_LIVE_SMOKE_HARNESS_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase74-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'default_disabled_smoke_plan' as ControlledLiveSmokeHarnessKind,
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
