import { SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES } from './fixtures.js';
import type {
  SafetyGateManualReviewDossierFixture,
  SafetyGateManualReviewDossierKind,
  SafetyGateManualReviewDossierName,
} from './types.js';

export interface SafetyGateManualReviewDossierSelectorQuery {
  readonly fixtureId?: string;
  readonly fixtureName?: SafetyGateManualReviewDossierName;
  readonly fixtureKind?: SafetyGateManualReviewDossierKind;
}

export interface SafetyGateManualReviewDossierSelectorResult {
  readonly selectorId: string;
  readonly selectedFixtureId: string;
  readonly selectedFixtureKind: SafetyGateManualReviewDossierKind;
  readonly matched: boolean;
  readonly source: 'deterministic_fixture_only';
}

function matchesQuery(
  fixture: SafetyGateManualReviewDossierFixture,
  query: SafetyGateManualReviewDossierSelectorQuery,
): boolean {
  if (query.fixtureId !== undefined && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName !== undefined && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind !== undefined && fixture.fixtureKind !== query.fixtureKind) return false;
  return true;
}

export function selectSafetyGateManualReviewDossierFixture(
  query: SafetyGateManualReviewDossierSelectorQuery,
): SafetyGateManualReviewDossierSelectorResult {
  const selected = SAFETY_GATE_MANUAL_REVIEW_DOSSIER_FIXTURES.find(f => matchesQuery(f, query));
  if (!selected) {
    return {
      selectorId: 'phase89-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'manual_review_dossier_ready' as SafetyGateManualReviewDossierKind,
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
