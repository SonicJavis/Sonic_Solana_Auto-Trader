import { RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES } from './fixtures.js';
import type {
  RiskFeedbackSafetyGateReevaluationFixture,
  RiskFeedbackSafetyGateReevaluationKind,
  RiskFeedbackSafetyGateReevaluationName,
} from './types.js';

export interface ReevaluationSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: RiskFeedbackSafetyGateReevaluationName;
  readonly fixtureKind?: RiskFeedbackSafetyGateReevaluationKind;
}

export interface ReevaluationSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: RiskFeedbackSafetyGateReevaluationKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

function matchesQuery(
  fixture: RiskFeedbackSafetyGateReevaluationFixture,
  query: ReevaluationSelectorQuery,
): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectRiskFeedbackSafetyGateReevaluationFixture(
  query: ReevaluationSelectorQuery,
): ReevaluationSelectorResult {
  const selected = RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.find(f => matchesQuery(f, query));
  if (!selected) {
    return {
      selectorId: 'phase88-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'reevaluation_design_ready' as RiskFeedbackSafetyGateReevaluationKind,
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
