import {
  OUTCOME_RISK_FEEDBACK_CONTRACTS_KINDS,
  OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES,
  PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT,
  PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SCHEMA_VERSION,
  PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SOURCE,
  type OutcomeRiskFeedbackContractKind,
  type OutcomeRiskFeedbackContractName,
  type OutcomeRiskFeedbackFixture,
} from './types.js';

export function stableDeterministicOutcomeRiskFeedbackChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b, 'en-US'))
      .reduce<Record<string, unknown>>((acc, [key, nested]) => {
        acc[key] = sortKeysDeep(nested);
        return acc;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidOutcomeRiskFeedbackContractName(
  value: unknown,
): value is OutcomeRiskFeedbackContractName {
  return (
    typeof value === 'string' &&
    (OUTCOME_RISK_FEEDBACK_CONTRACTS_NAMES as readonly string[]).includes(value)
  );
}

export function isValidOutcomeRiskFeedbackContractKind(
  value: unknown,
): value is OutcomeRiskFeedbackContractKind {
  return (
    typeof value === 'string' &&
    (OUTCOME_RISK_FEEDBACK_CONTRACTS_KINDS as readonly string[]).includes(value)
  );
}

export function isValidOutcomeRiskFeedbackGeneratedAt(
  value: unknown,
): value is typeof PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT {
  return value === PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_GENERATED_AT;
}

export function isValidOutcomeRiskFeedbackSource(
  value: unknown,
): value is typeof PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SOURCE {
  return value === PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SOURCE;
}

export function isValidOutcomeRiskFeedbackSchemaVersion(
  value: unknown,
): value is typeof PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SCHEMA_VERSION {
  return value === PHASE_87_OUTCOME_RISK_FEEDBACK_CONTRACTS_SCHEMA_VERSION;
}

export function normalizeOutcomeRiskFeedbackFixture(
  fixture: OutcomeRiskFeedbackFixture,
): OutcomeRiskFeedbackFixture {
  return JSON.parse(stablePrettyJsonStringify(fixture)) as OutcomeRiskFeedbackFixture;
}

export function serializeOutcomeRiskFeedbackFixture(fixture: OutcomeRiskFeedbackFixture): string {
  return stablePrettyJsonStringify(fixture);
}

export function areOutcomeRiskFeedbackFixturesEqual(
  a: OutcomeRiskFeedbackFixture,
  b: OutcomeRiskFeedbackFixture,
): boolean {
  return stablePrettyJsonStringify(a) === stablePrettyJsonStringify(b);
}
