/**
 * Phase 55 — Read-Only Provider Adapter Mocks v1: builders.
 */

import { getReadOnlyProviderAdapterMockCapabilities } from './capabilities.js';
import { buildReadOnlyProviderAdapterMockApiContract } from './contracts.js';
import { stableDeterministicReadOnlyProviderAdapterMockChecksum } from './normalization.js';
import {
  SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES,
} from '../synthetic-launch-intelligence/fixtures.js';
import type {
  BuildReadOnlyProviderAdapterMockFixtureInput,
  ReadOnlyProviderAdapterMockCapabilityProfile,
  ReadOnlyProviderAdapterMockFixture,
  ReadOnlyProviderAdapterMockHealthProfile,
  ReadOnlyProviderAdapterMockIdentity,
  ReadOnlyProviderAdapterMockKind,
  ReadOnlyProviderAdapterMockName,
  ReadOnlyProviderAdapterMockRequest,
  ReadOnlyProviderAdapterMockRequestKind,
  ReadOnlyProviderAdapterMockResult,
  ReadOnlyProviderAdapterMockResultKind,
  ReadOnlyProviderAdapterMockSelectorResult,
} from './types.js';
import {
  PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
  PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
  PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_VERSION,
  READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE,
} from './types.js';
import { buildReadOnlyProviderAdapterMockViewModel } from './view-models.js';

interface ScenarioDefinition {
  readonly adapterName: string;
  readonly adapterKind: ReadOnlyProviderAdapterMockKind;
  readonly adapterDomain: ReadOnlyProviderAdapterMockKind;
  readonly sourceProviderContractName: string;
  readonly disabledByDefault: boolean;
  readonly requestKind: ReadOnlyProviderAdapterMockRequestKind;
  readonly resultKind: ReadOnlyProviderAdapterMockResultKind;
  readonly sourceSyntheticLaunchFixtureName: string;
  readonly healthLabel: 'synthetic_ready' | 'synthetic_limited' | 'synthetic_disabled';
  readonly latencyBucket: 'synthetic_fast' | 'synthetic_medium' | 'synthetic_slow' | 'synthetic_none';
  readonly reliabilityLabel: 'synthetic_stable' | 'synthetic_variable' | 'synthetic_not_applicable';
  readonly deterministicFailureExamples: readonly string[];
}

const SCENARIO_DEFINITIONS: Readonly<Record<ReadOnlyProviderAdapterMockName, ScenarioDefinition>> = {
  'solana-rpc-adapter-mock': {
    adapterName: 'Mock Solana RPC Adapter',
    adapterKind: 'mock_solana_rpc_adapter',
    adapterDomain: 'mock_solana_rpc_adapter',
    sourceProviderContractName: 'solana-rpc-contract',
    disabledByDefault: true,
    requestKind: 'launch_event_query',
    resultKind: 'synthetic_launch_event_response',
    sourceSyntheticLaunchFixtureName: 'clean-launch-baseline',
    healthLabel: 'synthetic_limited',
    latencyBucket: 'synthetic_none',
    reliabilityLabel: 'synthetic_not_applicable',
    deterministicFailureExamples: [
      'LIVE_NETWORK_UNAVAILABLE: live RPC is disabled for mock-only adapter surface.',
      'PROVIDER_DISABLED: contract-conforming adapter gate remains local-only.',
    ],
  },
  'pump-launch-adapter-mock': {
    adapterName: 'Mock Pump Launch Adapter',
    adapterKind: 'mock_pump_launch_adapter',
    adapterDomain: 'mock_pump_launch_adapter',
    sourceProviderContractName: 'pump-launch-contract',
    disabledByDefault: true,
    requestKind: 'launch_event_query',
    resultKind: 'synthetic_launch_event_response',
    sourceSyntheticLaunchFixtureName: 'high-velocity-early-volume-launch',
    healthLabel: 'synthetic_limited',
    latencyBucket: 'synthetic_none',
    reliabilityLabel: 'synthetic_not_applicable',
    deterministicFailureExamples: [
      'PROVIDER_DISABLED: launch adapter mock is fixture-only and disabled for live access.',
      'UNSAFE_CAPABILITY_REQUESTED: live launch streaming is not available in mock-only mode.',
    ],
  },
  'dex-liquidity-adapter-mock': {
    adapterName: 'Mock DEX Liquidity Adapter',
    adapterKind: 'mock_dex_liquidity_adapter',
    adapterDomain: 'mock_dex_liquidity_adapter',
    sourceProviderContractName: 'dex-liquidity-contract',
    disabledByDefault: true,
    requestKind: 'pool_liquidity_query',
    resultKind: 'synthetic_pool_liquidity_response',
    sourceSyntheticLaunchFixtureName: 'low-liquidity-launch',
    healthLabel: 'synthetic_limited',
    latencyBucket: 'synthetic_medium',
    reliabilityLabel: 'synthetic_variable',
    deterministicFailureExamples: [
      'UNSUPPORTED_SYNTHETIC_DOMAIN: unsupported liquidity query domain for this adapter mock.',
      'LIVE_NETWORK_UNAVAILABLE: no DEX network connectivity in fixture-only mode.',
    ],
  },
  'token-metadata-adapter-mock': {
    adapterName: 'Mock Token Metadata Adapter',
    adapterKind: 'mock_token_metadata_adapter',
    adapterDomain: 'mock_token_metadata_adapter',
    sourceProviderContractName: 'token-metadata-contract',
    disabledByDefault: false,
    requestKind: 'token_profile_query',
    resultKind: 'synthetic_token_profile_response',
    sourceSyntheticLaunchFixtureName: 'metadata-incomplete-launch',
    healthLabel: 'synthetic_ready',
    latencyBucket: 'synthetic_fast',
    reliabilityLabel: 'synthetic_stable',
    deterministicFailureExamples: [
      'INVALID_DETERMINISTIC_MOCK_QUERY: no token metadata fixture matched.',
      'LIVE_NETWORK_UNAVAILABLE: metadata adapter remains local-only in this phase.',
    ],
  },
  'holder-distribution-adapter-mock': {
    adapterName: 'Mock Holder Distribution Adapter',
    adapterKind: 'mock_holder_distribution_adapter',
    adapterDomain: 'mock_holder_distribution_adapter',
    sourceProviderContractName: 'holder-distribution-contract',
    disabledByDefault: false,
    requestKind: 'holder_distribution_query',
    resultKind: 'synthetic_holder_distribution_response',
    sourceSyntheticLaunchFixtureName: 'concentrated-holder-launch',
    healthLabel: 'synthetic_ready',
    latencyBucket: 'synthetic_medium',
    reliabilityLabel: 'synthetic_variable',
    deterministicFailureExamples: [
      'UNSUPPORTED_SYNTHETIC_DOMAIN: holder distribution query is out of mocked domain.',
      'INVALID_DETERMINISTIC_MOCK_QUERY: holder distribution fixture not found.',
    ],
  },
  'wallet-cluster-adapter-mock': {
    adapterName: 'Mock Wallet Cluster Adapter',
    adapterKind: 'mock_wallet_cluster_adapter',
    adapterDomain: 'mock_wallet_cluster_adapter',
    sourceProviderContractName: 'wallet-cluster-contract',
    disabledByDefault: false,
    requestKind: 'wallet_cluster_query',
    resultKind: 'synthetic_wallet_cluster_response',
    sourceSyntheticLaunchFixtureName: 'possible-bundle-cluster-launch',
    healthLabel: 'synthetic_ready',
    latencyBucket: 'synthetic_slow',
    reliabilityLabel: 'synthetic_variable',
    deterministicFailureExamples: [
      'LIVE_NETWORK_UNAVAILABLE: cluster graph networking is disabled for mock-only mode.',
      'INVALID_DETERMINISTIC_MOCK_QUERY: wallet cluster fixture mapping mismatch.',
    ],
  },
  'risk-intelligence-adapter-mock': {
    adapterName: 'Mock Risk Intelligence Adapter',
    adapterKind: 'mock_risk_intelligence_adapter',
    adapterDomain: 'mock_risk_intelligence_adapter',
    sourceProviderContractName: 'risk-intelligence-contract',
    disabledByDefault: false,
    requestKind: 'risk_factor_query',
    resultKind: 'synthetic_risk_factor_response',
    sourceSyntheticLaunchFixtureName: 'suspicious-creator-history-launch',
    healthLabel: 'synthetic_ready',
    latencyBucket: 'synthetic_fast',
    reliabilityLabel: 'synthetic_stable',
    deterministicFailureExamples: [
      'INVALID_DETERMINISTIC_MOCK_QUERY: risk factor query did not match fixture data.',
      'UNSAFE_CAPABILITY_REQUESTED: advisory output is disabled in mock-only phase.',
    ],
  },
  'disabled-unsafe-adapter-mock': {
    adapterName: 'Mock Disabled Unsafe Adapter',
    adapterKind: 'mock_disabled_unsafe_adapter',
    adapterDomain: 'mock_disabled_unsafe_adapter',
    sourceProviderContractName: 'disabled-unsafe-contract',
    disabledByDefault: true,
    requestKind: 'disabled_unsafe_query',
    resultKind: 'synthetic_disabled_unsafe_response',
    sourceSyntheticLaunchFixtureName: 'safety-rejected-launch',
    healthLabel: 'synthetic_disabled',
    latencyBucket: 'synthetic_none',
    reliabilityLabel: 'synthetic_not_applicable',
    deterministicFailureExamples: [
      'PROVIDER_DISABLED: unsafe adapter category is permanently disabled.',
      'UNSAFE_CAPABILITY_REQUESTED: unsafe capability cannot be enabled in this phase.',
    ],
  },
};

function buildAdapterIdentity(
  fixtureId: string,
  def: ScenarioDefinition,
): ReadOnlyProviderAdapterMockIdentity {
  return {
    adapterId: `phase55-adapter-${fixtureId}`,
    adapterName: def.adapterName,
    adapterKind: def.adapterKind,
    adapterDomain: def.adapterDomain,
    sourceProviderContractName: def.sourceProviderContractName,
    disabledByDefault: def.disabledByDefault,
    mockOnly: true,
    readOnly: true,
    liveNetworkAccess: false,
    walletAccess: false,
    executionAccess: false,
  };
}

function buildAdapterCapabilityProfile(
  fixtureId: string,
): ReadOnlyProviderAdapterMockCapabilityProfile {
  return {
    profileId: `phase55-capability-profile-${fixtureId}`,
    readOnlySupport: true,
    fixtureOnlySupport: true,
    liveNetworkDisabled: true,
    walletDisabled: true,
    executionDisabled: true,
    tradingSignalsDisabled: true,
    recommendationsDisabled: true,
    investmentAdviceDisabled: true,
  };
}

function buildAdapterHealthProfile(
  fixtureId: string,
  def: ScenarioDefinition,
): ReadOnlyProviderAdapterMockHealthProfile {
  return {
    healthProfileId: `phase55-health-profile-${fixtureId}`,
    healthLabel: def.healthLabel,
    latencyBucket: def.latencyBucket,
    reliabilityLabel: def.reliabilityLabel,
    deterministicFailureExamples: def.deterministicFailureExamples,
    noActualHealthCheck: true,
    syntheticOnly: true,
  };
}

function buildMockRequest(
  fixtureId: string,
  def: ScenarioDefinition,
): ReadOnlyProviderAdapterMockRequest {
  return {
    requestId: `phase55-request-${fixtureId}`,
    requestKind: def.requestKind,
    fixtureOnly: true,
    readOnly: true,
    domain: def.adapterDomain,
    sourceSyntheticLaunchFixtureName: def.sourceSyntheticLaunchFixtureName,
    requestedResponseKind: def.resultKind,
    unsafeLiveRequested: false,
  };
}

function sourceFixtureByName(name: string) {
  return SYNTHETIC_LAUNCH_INTELLIGENCE_FIXTURES.find(fixture => fixture.fixtureName === name);
}

function buildMockData(def: ScenarioDefinition): Record<string, unknown> | null {
  const sourceFixture = sourceFixtureByName(def.sourceSyntheticLaunchFixtureName);
  if (!sourceFixture) {
    return null;
  }

  if (def.resultKind === 'synthetic_launch_event_response') {
    return {
      scenario: sourceFixture.fixtureName,
      launchEvent: sourceFixture.launchEvents[0] ?? null,
    };
  }

  if (def.resultKind === 'synthetic_token_profile_response') {
    return {
      scenario: sourceFixture.fixtureName,
      tokenProfile: sourceFixture.tokenProfile,
    };
  }

  if (def.resultKind === 'synthetic_pool_liquidity_response') {
    return {
      scenario: sourceFixture.fixtureName,
      poolLiquiditySnapshot: sourceFixture.poolLiquiditySnapshots[0] ?? null,
    };
  }

  if (def.resultKind === 'synthetic_creator_profile_response') {
    return {
      scenario: sourceFixture.fixtureName,
      creatorProfile: sourceFixture.creatorProfile,
    };
  }

  if (def.resultKind === 'synthetic_holder_distribution_response') {
    return {
      scenario: sourceFixture.fixtureName,
      holderDistributionSnapshot: sourceFixture.holderDistributionSnapshots[0] ?? null,
    };
  }

  if (def.resultKind === 'synthetic_wallet_cluster_response') {
    return {
      scenario: sourceFixture.fixtureName,
      walletClusterIndicator: sourceFixture.walletClusterIndicators[0] ?? null,
    };
  }

  if (def.resultKind === 'synthetic_risk_factor_response') {
    return {
      scenario: sourceFixture.fixtureName,
      riskFactor: sourceFixture.riskFactorSummaries[0] ?? null,
      riskReview: sourceFixture.riskReview,
    };
  }

  return null;
}

function buildMockResult(
  fixtureId: string,
  def: ScenarioDefinition,
): ReadOnlyProviderAdapterMockResult {
  const data = buildMockData(def);
  const success = def.resultKind !== 'synthetic_disabled_unsafe_response';
  return {
    resultId: `phase55-result-${fixtureId}`,
    resultKind: def.resultKind,
    statusCode: success ? 200 : 503,
    success,
    matched: success,
    data,
    error: success
      ? null
      : {
          errorCode: 'PROVIDER_DISABLED',
          message: 'Unsafe adapter category is disabled in read-only provider adapter mocks.',
          recoverable: false,
        },
    meta: {
      generatedAt: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
      source: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
      fixtureOnly: true,
    },
    safety: {
      nonAdvisory: true,
      mockOnly: true,
      noLiveData: true,
    },
  };
}

function buildSelectorExamples(
  fixtureId: string,
  def: ScenarioDefinition,
): readonly ReadOnlyProviderAdapterMockSelectorResult[] {
  return [
    {
      selectorId: `phase55-selector-by-id-${fixtureId}`,
      selectedFixtureId: fixtureId,
      selectedAdapterKind: def.adapterKind,
      selectedDomain: def.adapterDomain,
      matched: true,
      source: 'synthetic_fixture_only',
    },
    {
      selectorId: `phase55-selector-by-kind-${def.adapterKind}`,
      selectedFixtureId: fixtureId,
      selectedAdapterKind: def.adapterKind,
      selectedDomain: def.adapterDomain,
      matched: true,
      source: 'synthetic_fixture_only',
    },
  ];
}

export function buildReadOnlyProviderAdapterMockFixture(
  input: BuildReadOnlyProviderAdapterMockFixtureInput,
): ReadOnlyProviderAdapterMockFixture {
  const def = SCENARIO_DEFINITIONS[input.fixtureName];
  const checksumBase = `${PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE}:${input.fixtureName}`;
  const checksum = stableDeterministicReadOnlyProviderAdapterMockChecksum(checksumBase);
  const fixtureId = `phase55-fixture-${checksum.replace(':', '-')}`;

  const adapterIdentity = buildAdapterIdentity(fixtureId, def);
  const adapterCapabilityProfile = buildAdapterCapabilityProfile(fixtureId);
  const adapterHealthProfile = buildAdapterHealthProfile(fixtureId, def);
  const mockRequest = buildMockRequest(fixtureId, def);
  const mockResult = buildMockResult(fixtureId, def);
  const capabilityFlags = getReadOnlyProviderAdapterMockCapabilities();

  const meta = {
    generatedAt: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_GENERATED_AT,
    source: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_SOURCE,
    version: PHASE_55_READ_ONLY_PROVIDER_ADAPTER_MOCKS_VERSION,
    phase: READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE,
    seed: 'phase55-deterministic-seed-v1' as const,
  };

  const safety = {
    nonAdvisory: true as const,
    mockOnly: true as const,
    noLiveData: true as const,
    noNetworkAccess: true as const,
    noWalletAccess: true as const,
    noExecution: true as const,
  };

  const partialFixture = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: def.adapterKind,
    phase: READ_ONLY_PROVIDER_ADAPTER_MOCKS_PHASE,
    sourceProviderContractName: def.sourceProviderContractName,
    adapterIdentity,
    adapterCapabilityProfile,
    adapterHealthProfile,
    mockRequest,
    mockResult,
    capabilityFlags,
    meta,
    safety,
  } as const;

  const viewModel = buildReadOnlyProviderAdapterMockViewModel(
    partialFixture as unknown as ReadOnlyProviderAdapterMockFixture,
  );

  const withViewModel = {
    ...partialFixture,
    viewModel,
  } as unknown as ReadOnlyProviderAdapterMockFixture;

  const apiContracts = buildReadOnlyProviderAdapterMockApiContract(withViewModel);
  const selectorExamples = buildSelectorExamples(fixtureId, def);

  return {
    ...withViewModel,
    apiContracts,
    selectorExamples,
  };
}
