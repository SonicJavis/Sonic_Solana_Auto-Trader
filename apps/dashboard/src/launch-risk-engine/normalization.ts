/**
 * Phase 58 — Launch Risk Engine v1: normalization.
 *
 * Deterministic checksum, serialization, normalization, equality.
 * Non-advisory, synthetic, local-only.
 */

import {
  PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT,
  PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION,
  PHASE_58_LAUNCH_RISK_ENGINE_SOURCE,
  LAUNCH_RISK_ENGINE_ASSESSMENT_KINDS,
  LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES,
  type LaunchRiskEngineFixture,
  type LaunchRiskEngineAssessmentKind,
  type LaunchRiskEngineAssessmentName,
} from './types.js';

export function stableDeterministicLaunchRiskEngineChecksum(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right, 'en-US'))
      .reduce<Record<string, unknown>>((accumulator, [key, nextValue]) => {
        accumulator[key] = sortKeysDeep(nextValue);
        return accumulator;
      }, {});
  }
  return value;
}

function stablePrettyJsonStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

export function isValidLaunchRiskEngineAssessmentName(
  value: unknown,
): value is LaunchRiskEngineAssessmentName {
  return (
    typeof value === 'string' &&
    (LAUNCH_RISK_ENGINE_ASSESSMENT_NAMES as readonly string[]).includes(value)
  );
}

export function isValidLaunchRiskEngineAssessmentKind(
  value: unknown,
): value is LaunchRiskEngineAssessmentKind {
  return (
    typeof value === 'string' &&
    (LAUNCH_RISK_ENGINE_ASSESSMENT_KINDS as readonly string[]).includes(value)
  );
}

export function isValidLaunchRiskEngineGeneratedAt(value: unknown): value is typeof PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT {
  return value === PHASE_58_LAUNCH_RISK_ENGINE_GENERATED_AT;
}

export function isValidLaunchRiskEngineSource(value: unknown): value is typeof PHASE_58_LAUNCH_RISK_ENGINE_SOURCE {
  return value === PHASE_58_LAUNCH_RISK_ENGINE_SOURCE;
}

export function isValidLaunchRiskEngineSchemaVersion(value: unknown): value is typeof PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION {
  return value === PHASE_58_LAUNCH_RISK_ENGINE_SCHEMA_VERSION;
}

export function normalizeLaunchRiskEngineFixture(
  fixture: LaunchRiskEngineFixture,
): LaunchRiskEngineFixture {
  return JSON.parse(JSON.stringify(fixture)) as LaunchRiskEngineFixture;
}

export function serializeLaunchRiskEngineFixture(
  fixture: LaunchRiskEngineFixture,
): string {
  return stablePrettyJsonStringify(fixture);
}

export function areLaunchRiskEngineFixturesEqual(
  left: LaunchRiskEngineFixture,
  right: LaunchRiskEngineFixture,
): boolean {
  return (
    stableDeterministicLaunchRiskEngineChecksum(stablePrettyJsonStringify(left)) ===
    stableDeterministicLaunchRiskEngineChecksum(stablePrettyJsonStringify(right))
  );
}
