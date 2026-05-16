import { buildOutcomeRiskFeedbackFixture } from './builders.js';
import {
  OUTCOME_RISK_FEEDBACK_CONTRACTS_KINDS,
  OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES,
  type OutcomeRiskFeedbackContractKind,
  type OutcomeRiskFeedbackContractName,
  type OutcomeRiskFeedbackFixture,
} from './types.js';
import { validateOutcomeRiskFeedbackFixtureTable } from './validation.js';

export const OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES = OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES.map(
  fixtureName => buildOutcomeRiskFeedbackFixture({ fixtureName }),
) satisfies readonly OutcomeRiskFeedbackFixture[];

export const OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURE_MAP: ReadonlyMap<
  string,
  OutcomeRiskFeedbackFixture
> = new Map(OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES.length < 8) {
  throw new Error(
    `Phase 87 fixture count mismatch: expected >= 8, received ${OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES.length}`,
  );
}
if (OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES.length !== OUTCOME_RISK_FEEDBACK_CONTRACTS_KINDS.length) {
  throw new Error('Phase 87 name/kind cardinality mismatch');
}

const tableValidation = validateOutcomeRiskFeedbackFixtureTable(OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES);
if (!tableValidation.valid) {
  throw new Error(`Phase 87 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listOutcomeRiskFeedbackFixtures(): readonly OutcomeRiskFeedbackFixture[] {
  return OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURES;
}

export function getOutcomeRiskFeedbackFixture(fixtureId: string): OutcomeRiskFeedbackFixture | null {
  return OUTCOME_RISK_FEEDBACK_CONTRACTS_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES, OUTCOME_RISK_FEEDBACK_CONTRACTS_KINDS };
export type { OutcomeRiskFeedbackContractName, OutcomeRiskFeedbackContractKind };
