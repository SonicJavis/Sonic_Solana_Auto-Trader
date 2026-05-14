import { MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES } from './fixtures.js';
import type {
  ExecutionBoundarySelector,
  ExecutionBoundarySelectorQuery,
  ManualConfirmExecutionBoundaryFixture,
  ManualConfirmExecutionBoundaryKind,
} from './types.js';

function matchesQuery(fixture: ManualConfirmExecutionBoundaryFixture, query: ExecutionBoundarySelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectManualConfirmExecutionBoundaryFixture(query: ExecutionBoundarySelectorQuery): ExecutionBoundarySelector {
  const selected = MANUAL_CONFIRM_EXECUTION_BOUNDARY_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase81-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'execution_boundary_design_ready' as ManualConfirmExecutionBoundaryKind,
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
