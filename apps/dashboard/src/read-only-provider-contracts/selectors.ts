/**
 * Phase 54 — Read-Only Provider Interface Contracts v1: selectors.
 */

import {
  READ_ONLY_PROVIDER_CONTRACT_FIXTURES,
  READ_ONLY_PROVIDER_CONTRACT_FIXTURE_MAP,
} from './fixtures.js';
import type {
  ReadOnlyProviderContractFixture,
  ReadOnlyProviderContractSelectorQuery,
  ReadOnlyProviderContractSelectorResult,
} from './types.js';

export function selectReadOnlyProviderContractFixture(
  query: ReadOnlyProviderContractSelectorQuery = {},
): ReadOnlyProviderContractSelectorResult {
  const fromId = query.fixtureId
    ? (READ_ONLY_PROVIDER_CONTRACT_FIXTURE_MAP.get(query.fixtureId) ?? null)
    : null;

  const fixture: ReadOnlyProviderContractFixture | undefined =
    fromId ??
    READ_ONLY_PROVIDER_CONTRACT_FIXTURES.find(candidate => {
      if (query.providerKind && candidate.fixtureKind !== query.providerKind) {
        return false;
      }
      if (query.domain && candidate.providerIdentity.providerDomain !== query.domain) {
        return false;
      }
      if (
        query.disabledByDefault !== undefined &&
        candidate.providerIdentity.disabledByDefault !== query.disabledByDefault
      ) {
        return false;
      }
      return true;
    }) ??
    READ_ONLY_PROVIDER_CONTRACT_FIXTURES[0];

  const matched =
    fixture !== undefined &&
    (!query.fixtureId || fixture.fixtureId === query.fixtureId) &&
    (!query.providerKind || fixture.fixtureKind === query.providerKind) &&
    (!query.domain ||
      fixture.providerIdentity.providerDomain === query.domain) &&
    (query.disabledByDefault === undefined ||
      fixture.providerIdentity.disabledByDefault === query.disabledByDefault);

  return {
    selectorId: `phase54-selector-${fixture?.fixtureId ?? 'none'}`,
    selectedFixtureId: fixture?.fixtureId ?? 'phase54-none',
    selectedProviderKind: fixture?.fixtureKind ?? 'solana_rpc_contract',
    matched,
    source: 'synthetic_fixture_only',
  };
}
