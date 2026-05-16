import {
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT,
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SCHEMA_VERSION,
  PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SOURCE,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_KINDS,
  SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES,
  type SafetyGateManualReviewDossierFixture,
  type SafetyGateManualReviewDossierKind,
  type SafetyGateManualReviewDossierName,
} from './types.js';

export function isValidSafetyGateManualReviewDossierName(
  name: unknown,
): name is SafetyGateManualReviewDossierName {
  return (
    typeof name === 'string' &&
    (SAFETY_GATE_MANUAL_REVIEW_DOSSIER_NAMES as readonly string[]).includes(name)
  );
}

export function isValidSafetyGateManualReviewDossierKind(
  kind: unknown,
): kind is SafetyGateManualReviewDossierKind {
  return (
    typeof kind === 'string' &&
    (SAFETY_GATE_MANUAL_REVIEW_DOSSIER_KINDS as readonly string[]).includes(kind)
  );
}

export function isValidSafetyGateManualReviewDossierGeneratedAt(value: unknown): boolean {
  return value === PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_GENERATED_AT;
}

export function isValidSafetyGateManualReviewDossierSchemaVersion(value: unknown): boolean {
  return value === PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SCHEMA_VERSION;
}

export function isValidSafetyGateManualReviewDossierSource(value: unknown): boolean {
  return value === PHASE_89_SAFETY_GATE_MANUAL_REVIEW_DOSSIER_SOURCE;
}

export function stableDeterministicSafetyGateManualReviewDossierChecksum(
  fixture: Omit<SafetyGateManualReviewDossierFixture, 'checksum'>,
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
  return `ph89-chk-${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

export function normalizeSafetyGateManualReviewDossierFixture(
  fixture: SafetyGateManualReviewDossierFixture,
): SafetyGateManualReviewDossierFixture {
  return { ...fixture };
}

export function serializeSafetyGateManualReviewDossierFixture(
  fixture: SafetyGateManualReviewDossierFixture,
): string {
  return JSON.stringify(fixture, null, 2);
}

export function areSafetyGateManualReviewDossierFixturesEqual(
  a: SafetyGateManualReviewDossierFixture,
  b: SafetyGateManualReviewDossierFixture,
): boolean {
  return (
    a.fixtureId === b.fixtureId &&
    a.fixtureName === b.fixtureName &&
    a.fixtureKind === b.fixtureKind &&
    a.phase === b.phase &&
    a.checksum === b.checksum
  );
}
