import { buildRiskFeedbackSafetyGateReevaluationFixture } from './builders.js';
import {
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_KINDS,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES,
  type RiskFeedbackSafetyGateReevaluationFixture,
  type RiskFeedbackSafetyGateReevaluationKind,
  type RiskFeedbackSafetyGateReevaluationName,
} from './types.js';
import { validateRiskFeedbackSafetyGateReevaluationFixtureTable } from './validation.js';

export const RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES =
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES.map(fixtureName =>
    buildRiskFeedbackSafetyGateReevaluationFixture({ fixtureName }),
  ) satisfies readonly RiskFeedbackSafetyGateReevaluationFixture[];

export const RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURE_MAP: ReadonlyMap<
  string,
  RiskFeedbackSafetyGateReevaluationFixture
> = new Map(
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.map(fixture => [fixture.fixtureId, fixture]),
);

if (RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.length < 8) {
  throw new Error(
    `Phase 88 fixture count mismatch: expected >= 8, received ${RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES.length}`,
  );
}
if (
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES.length !==
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_KINDS.length
) {
  throw new Error('Phase 88 name/kind cardinality mismatch');
}

const tableValidation = validateRiskFeedbackSafetyGateReevaluationFixtureTable(
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES,
);
if (!tableValidation.valid) {
  throw new Error(
    `Phase 88 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`,
  );
}

export function listRiskFeedbackSafetyGateReevaluationFixtures(): readonly RiskFeedbackSafetyGateReevaluationFixture[] {
  return RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURES;
}

export function getRiskFeedbackSafetyGateReevaluationFixture(
  fixtureId: string,
): RiskFeedbackSafetyGateReevaluationFixture | null {
  return RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_KINDS,
};
export type { RiskFeedbackSafetyGateReevaluationName, RiskFeedbackSafetyGateReevaluationKind };
