import { SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES } from './fixtures.js';
import type {
  SigningBoundarySafetyContractKind,
  SigningBoundarySafetyFixture,
  SigningBoundarySelector,
  SigningBoundarySelectorQuery,
} from './types.js';

function matchesQuery(fixture: SigningBoundarySafetyFixture, query: SigningBoundarySelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectSigningBoundarySafetyFixture(query: SigningBoundarySelectorQuery): SigningBoundarySelector {
  const selected = SIGNING_BOUNDARY_SAFETY_CONTRACTS_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase83-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'signing_boundary_design_ready' as SigningBoundarySafetyContractKind,
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
