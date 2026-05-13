import { MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES } from './fixtures.js';
import type {
  ManualConfirmDryRunControlFixture,
  ManualConfirmDryRunControlKind,
  ManualConfirmDryRunSelector,
  ManualConfirmDryRunSelectorQuery,
} from './types.js';

function matchesQuery(fixture: ManualConfirmDryRunControlFixture, query: ManualConfirmDryRunSelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectManualConfirmDryRunControlFixture(query: ManualConfirmDryRunSelectorQuery): ManualConfirmDryRunSelector {
  const selected = MANUAL_CONFIRM_DRY_RUN_CONTROL_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase77-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'dry_run_control_ready' as ManualConfirmDryRunControlKind,
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
