import { OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES } from './fixtures.js';
import type {
  OutcomeRiskFeedbackContractKind,
  OutcomeRiskFeedbackFixture,
  OutcomeRiskFeedbackSelector,
  OutcomeRiskFeedbackSelectorQuery,
} from './types.js';

function matchesQuery(fixture: OutcomeRiskFeedbackFixture, query: OutcomeRiskFeedbackSelectorQuery): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectOutcomeRiskFeedbackFixture(
  query: OutcomeRiskFeedbackSelectorQuery,
): OutcomeRiskFeedbackSelector {
  const selected = OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase87-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'feedback_loop_design_ready' as OutcomeRiskFeedbackContractKind,
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
