/**
 * Phase 59 — Risk Explanation and Evidence Models v1: normalization.
 */

import {
  PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION,
  PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE,
  RISK_EXPLANATION_EVIDENCE_KINDS,
  RISK_EXPLANATION_EVIDENCE_NAMES,
  type RiskExplanationEvidenceFixture,
  type RiskExplanationEvidenceKind,
  type RiskExplanationEvidenceName,
} from './types.js';

export function stableDeterministicRiskExplanationEvidenceChecksum(content: string): string {
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

export function isValidRiskExplanationEvidenceName(
  value: unknown,
): value is RiskExplanationEvidenceName {
  return (
    typeof value === 'string' &&
    (RISK_EXPLANATION_EVIDENCE_NAMES as readonly string[]).includes(value)
  );
}

export function isValidRiskExplanationEvidenceKind(
  value: unknown,
): value is RiskExplanationEvidenceKind {
  return (
    typeof value === 'string' &&
    (RISK_EXPLANATION_EVIDENCE_KINDS as readonly string[]).includes(value)
  );
}

export function isValidRiskExplanationEvidenceGeneratedAt(
  value: unknown,
): value is typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT {
  return value === PHASE_59_RISK_EXPLANATION_EVIDENCE_GENERATED_AT;
}

export function isValidRiskExplanationEvidenceSource(
  value: unknown,
): value is typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE {
  return value === PHASE_59_RISK_EXPLANATION_EVIDENCE_SOURCE;
}

export function isValidRiskExplanationEvidenceSchemaVersion(
  value: unknown,
): value is typeof PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION {
  return value === PHASE_59_RISK_EXPLANATION_EVIDENCE_SCHEMA_VERSION;
}

function sortById<T, K extends keyof T>(items: readonly T[], field: K): readonly T[] {
  return [...items].sort((left, right) =>
    String(left[field]).localeCompare(String(right[field]), 'en-US'),
  );
}

export function normalizeRiskExplanationEvidenceFixture(
  fixture: RiskExplanationEvidenceFixture,
): RiskExplanationEvidenceFixture {
  return {
    ...fixture,
    evidenceGraph: {
      ...fixture.evidenceGraph,
      nodes: sortById(fixture.evidenceGraph.nodes, 'nodeId'),
      edges: sortById(fixture.evidenceGraph.edges, 'edgeId'),
      orphanNodeIds: [...fixture.evidenceGraph.orphanNodeIds].sort((a, b) =>
        a.localeCompare(b, 'en-US'),
      ),
    },
    explanationTemplates: sortById(fixture.explanationTemplates, 'templateId'),
    explanationOutput: {
      ...fixture.explanationOutput,
      factorExplanations: sortById(fixture.explanationOutput.factorExplanations, 'factorId'),
      evidenceReferenceIds: [...fixture.explanationOutput.evidenceReferenceIds].sort((a, b) =>
        a.localeCompare(b, 'en-US'),
      ),
      limitations: [...fixture.explanationOutput.limitations].sort((a, b) =>
        a.localeCompare(b, 'en-US'),
      ),
      nonGoals: [...fixture.explanationOutput.nonGoals].sort((a, b) =>
        a.localeCompare(b, 'en-US'),
      ),
    },
    selectorExamples: sortById(fixture.selectorExamples, 'selectorId'),
  };
}

export function serializeRiskExplanationEvidenceFixture(
  fixture: RiskExplanationEvidenceFixture,
): string {
  return stablePrettyJsonStringify(normalizeRiskExplanationEvidenceFixture(fixture));
}

export function areRiskExplanationEvidenceFixturesEqual(
  left: RiskExplanationEvidenceFixture,
  right: RiskExplanationEvidenceFixture,
): boolean {
  return (
    stableDeterministicRiskExplanationEvidenceChecksum(
      serializeRiskExplanationEvidenceFixture(left),
    ) ===
    stableDeterministicRiskExplanationEvidenceChecksum(
      serializeRiskExplanationEvidenceFixture(right),
    )
  );
}
