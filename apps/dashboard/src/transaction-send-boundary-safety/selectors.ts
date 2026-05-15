import { TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES } from './fixtures.js';
import type {
  TransactionSendBoundarySafetyContractKind,
  TransactionSendBoundarySafetyFixture,
  TransactionSendBoundarySelector,
  TransactionSendBoundarySelectorQuery,
} from './types.js';

function matchesQuery(fixture: TransactionSendBoundarySafetyFixture, query: TransactionSendBoundarySelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectTransactionSendBoundarySafetyFixture(
  query: TransactionSendBoundarySelectorQuery,
): TransactionSendBoundarySelector {
  const selected = TRANSACTION_SEND_BOUNDARY_SAFETY_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase84-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'send_boundary_design_ready' as TransactionSendBoundarySafetyContractKind,
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
