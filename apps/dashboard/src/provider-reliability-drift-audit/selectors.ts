import { PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES } from './fixtures.js';
import type {
  ProviderReliabilityDriftAuditFixture,
  ProviderReliabilityDriftAuditSelectorQuery,
  ProviderReliabilityDriftAuditSelectorResult,
} from './types.js';

function matchesQuery(
  fixture: ProviderReliabilityDriftAuditFixture,
  query: ProviderReliabilityDriftAuditSelectorQuery,
): boolean {
  if (query.fixtureId && fixture.fixtureId !== query.fixtureId) return false;
  if (query.fixtureName && fixture.fixtureName !== query.fixtureName) return false;
  if (query.fixtureKind && fixture.fixtureKind !== query.fixtureKind) return false;
  if (query.providerId && fixture.telemetrySample.providerId !== query.providerId) return false;
  if (query.driftKind && fixture.driftAudit.driftKind !== query.driftKind) return false;
  return true;
}

export function selectProviderReliabilityDriftAuditFixture(
  query: ProviderReliabilityDriftAuditSelectorQuery,
): ProviderReliabilityDriftAuditSelectorResult {
  const selected = PROVIDER_RELIABILITY_DRIFT_AUDIT_FIXTURES.find(fixture => matchesQuery(fixture, query));
  if (!selected) {
    return {
      selectorId: 'phase70-selector-miss',
      selectedFixtureId: 'not-found',
      selectedFixtureKind: 'healthy_provider_stable_telemetry',
      matched: false,
      source: 'synthetic_fixture_only',
    };
  }
  return {
    selectorId: `${selected.fixtureId}-selector`,
    selectedFixtureId: selected.fixtureId,
    selectedFixtureKind: selected.fixtureKind,
    matched: true,
    source: 'synthetic_fixture_only',
  };
}
