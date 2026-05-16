import { buildSafetyGateManualReviewDossierFixture } from './builders.js';
import {
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_KINDS,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES,
  type SafetyGateManualReviewDossierFixture,
  type SafetyGateManualReviewDossierKind,
  type SafetyGateManualReviewDossierName,
} from './types.js';
import { validateSafetyGateManualReviewDossierFixtureTable } from './validation.js';

export const SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES =
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES.map(fixtureName =>
    buildSafetyGateManualReviewDossierFixture({ fixtureName }),
  ) satisfies readonly SafetyGateManualReviewDossierFixture[];

export const SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURE_MAP: ReadonlyMap<
  string,
  SafetyGateManualReviewDossierFixture
> = new Map(SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES.map(fixture => [fixture.fixtureId, fixture]));

if (SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES.length < 8) {
  throw new Error(
    `Phase 89 fixture count mismatch: expected >= 8, received ${SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES.length}`,
  );
}
if (SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES.length !== SAFETY_GATE_MANUAL_REVIEW_DOSSIER_KINDS.length) {
  throw new Error('Phase 89 name/kind cardinality mismatch');
}

const tableValidation = validateSafetyGateManualReviewDossierFixtureTable(
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES,
);
if (!tableValidation.valid) {
  throw new Error(`Phase 89 fixture table validation failed: ${JSON.stringify(tableValidation.issues)}`);
}

export function listSafetyGateManualReviewDossierFixtures(): readonly SafetyGateManualReviewDossierFixture[] {
  return SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES;
}

export function getSafetyGateManualReviewDossierFixture(
  fixtureId: string,
): SafetyGateManualReviewDossierFixture | null {
  return SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURE_MAP.get(fixtureId) ?? null;
}

export {
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_KINDS,
};
export type { SafetyGateManualReviewDossierName, SafetyGateManualReviewDossierKind };
