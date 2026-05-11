/**
 * Phase 59 — Risk Explanation and Evidence Models v1: fixtures.
 */

import { buildRiskExplanationEvidenceFixture } from './builders.js';
import {
  RISK_EXPLANATION_EVIDENCE_KINDS,
  RISK_EXPLANATION_EVIDENCE_NAMES,
  type RiskExplanationEvidenceFixture,
  type RiskExplanationEvidenceKind,
  type RiskExplanationEvidenceName,
} from './types.js';

export const RISK_EXPLANATION_EVIDENCE_FIXTURES = RISK_EXPLANATION_EVIDENCE_NAMES.map(
  fixtureName => buildRiskExplanationEvidenceFixture({ fixtureName }),
) satisfies readonly RiskExplanationEvidenceFixture[];

export const RISK_EXPLANATION_EVIDENCE_FIXTURE_MAP: ReadonlyMap<string, RiskExplanationEvidenceFixture> =
  new Map(RISK_EXPLANATION_EVIDENCE_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (RISK_EXPLANATION_EVIDENCE_FIXTURES.length < 8) {
  throw new Error(
    `Phase 59 fixture count mismatch: expected >= 8, received ${RISK_EXPLANATION_EVIDENCE_FIXTURES.length}`,
  );
}

if (RISK_EXPLANATION_EVIDENCE_NAMES.length !== RISK_EXPLANATION_EVIDENCE_KINDS.length) {
  throw new Error('Phase 59 explanation name/kind cardinality mismatch');
}

export function listRiskExplanationEvidenceFixtures(): readonly RiskExplanationEvidenceFixture[] {
  return RISK_EXPLANATION_EVIDENCE_FIXTURES;
}

export function getRiskExplanationEvidenceFixture(
  fixtureId: string,
): RiskExplanationEvidenceFixture | null {
  return RISK_EXPLANATION_EVIDENCE_FIXTURE_MAP.get(fixtureId) ?? null;
}

export { RISK_EXPLANATION_EVIDENCE_NAMES, RISK_EXPLANATION_EVIDENCE_KINDS };

export type { RiskExplanationEvidenceName, RiskExplanationEvidenceKind };
