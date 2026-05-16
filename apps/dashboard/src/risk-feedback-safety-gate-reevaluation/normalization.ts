import {
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_GENERATED_AT,
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SCHEMA_VERSION,
  PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SOURCE,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_KINDS,
  RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES,
  type RiskFeedbackSafetyGateReevaluationFixture,
  type RiskFeedbackSafetyGateReevaluationKind,
  type RiskFeedbackSafetyGateReevaluationName,
} from './types.js';

export function isValidRiskFeedbackSafetyGateReevaluationContractName(
  name: unknown,
): name is RiskFeedbackSafetyGateReevaluationName {
  return (
    typeof name === 'string' &&
    (RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_NAMES as readonly string[]).includes(name)
  );
}

export function isValidRiskFeedbackSafetyGateReevaluationContractKind(
  kind: unknown,
): kind is RiskFeedbackSafetyGateReevaluationKind {
  return (
    typeof kind === 'string' &&
    (RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_KINDS as readonly string[]).includes(kind)
  );
}

export function isValidRiskFeedbackSafetyGateReevaluationGeneratedAt(value: unknown): boolean {
  return value === PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_GENERATED_AT;
}

export function isValidRiskFeedbackSafetyGateReevaluationSchemaVersion(value: unknown): boolean {
  return value === PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SCHEMA_VERSION;
}

export function isValidRiskFeedbackSafetyGateReevaluationSource(value: unknown): boolean {
  return value === PHASE_88_RISK_FEEDBACK_SAFETY_GATE_REEVALUATION_SOURCE;
}

export function stableDeterministicRiskFeedbackSafetyGateReevaluationChecksum(
  fixture: Omit<RiskFeedbackSafetyGateReevaluationFixture, 'checksum'>,
): string {
  const stable = JSON.stringify({
    fixtureId: fixture.fixtureId,
    fixtureName: fixture.fixtureName,
    fixtureKind: fixture.fixtureKind,
    phase: fixture.phase,
    schemaVersion: fixture.schemaVersion,
    generatedAt: fixture.meta.generatedAt,
  });
  let hash = 0;
  for (let i = 0; i < stable.length; i++) {
    const char = stable.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `ph88-chk-${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

export function normalizeRiskFeedbackSafetyGateReevaluationFixture(
  fixture: RiskFeedbackSafetyGateReevaluationFixture,
): RiskFeedbackSafetyGateReevaluationFixture {
  return { ...fixture };
}

export function serializeRiskFeedbackSafetyGateReevaluationFixture(
  fixture: RiskFeedbackSafetyGateReevaluationFixture,
): string {
  return JSON.stringify(fixture, null, 2);
}

export function areRiskFeedbackSafetyGateReevaluationFixturesEqual(
  a: RiskFeedbackSafetyGateReevaluationFixture,
  b: RiskFeedbackSafetyGateReevaluationFixture,
): boolean {
  return (
    a.fixtureId === b.fixtureId &&
    a.fixtureName === b.fixtureName &&
    a.fixtureKind === b.fixtureKind &&
    a.phase === b.phase &&
    a.checksum === b.checksum
  );
}
