import { TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES } from './fixtures.js';
import type {
  ExecutionBoundarySelector,
  ExecutionBoundarySelectorQuery,
  TransactionConstructionContractMockFixture,
  TransactionConstructionContractMockKind,
} from './types.js';

function matchesQuery(fixture: TransactionConstructionContractMockFixture, query: ExecutionBoundarySelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectTransactionConstructionContractMockFixture(query: ExecutionBoundarySelectorQuery): ExecutionBoundarySelector {
  const selected = TRANSACTION_CONSTRUCTION_CONTRACT_MOCKS_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase82-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'execution_boundary_design_ready' as TransactionConstructionContractMockKind,
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

