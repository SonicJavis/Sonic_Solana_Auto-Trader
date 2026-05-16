import { EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES } from './fixtures.js';
import type {
  ExecutionOutcomeAuditContractKind,
  ExecutionOutcomeAuditFixture,
  ExecutionOutcomeAuditSelector,
  ExecutionOutcomeAuditSelectorQuery,
} from './types.js';

function matchesQuery(
  fixture: ExecutionOutcomeAuditFixture,
  query: ExecutionOutcomeAuditSelectorQuery,
): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectExecutionOutcomeAuditFixture(
  query: ExecutionOutcomeAuditSelectorQuery,
): ExecutionOutcomeAuditSelector {
  const selected = EXECUTION_OUTCOME_AUDIT_CONTRACTS_FIXTURES.find(fixture =>
    matchesQuery(fixture, query),
  );
  if (!selected) {
    return {
      selectorId: 'phase86-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'outcome_audit_design_ready' as ExecutionOutcomeAuditContractKind,
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
