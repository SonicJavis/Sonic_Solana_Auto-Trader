/**
 * Phase 54 — Read-Only Provider Interface Contracts v1: builders.
 */

import { getReadOnlyProviderContractCapabilities } from './capabilities.js';
import { buildReadOnlyProviderApiContract } from './contracts.js';
import { stableDeterministicReadOnlyProviderContractChecksum } from './normalization.js';
import {
  PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
  PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
  PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_VERSION,
  READ_ONLY_PROVIDER_CONTRACTS_PHASE,
  type BuildReadOnlyProviderContractFixtureInput,
  type ReadOnlyProviderCapabilityContract,
  type ReadOnlyProviderContractFixture,
  type ReadOnlyProviderContractKind,
  type ReadOnlyProviderContractName,
  type ReadOnlyProviderContractSelectorResult,
  type ReadOnlyProviderDomain,
  type ReadOnlyProviderErrorCode,
  type ReadOnlyProviderHealthContract,
  type ReadOnlyProviderHealthStatus,
  type ReadOnlyProviderIdentity,
  type ReadOnlyProviderInterfaceContract,
  type ReadOnlyProviderLatencyBucket,
  type ReadOnlyProviderReliabilityLabel,
  type ReadOnlySyntheticResponse,
} from './types.js';
import { buildReadOnlyProviderContractViewModel } from './view-models.js';

// ─── Scenario definitions ─────────────────────────────────────

interface ScenarioDefinition {
  readonly providerName: string;
  readonly providerKind: ReadOnlyProviderContractKind;
  readonly providerDomain: ReadOnlyProviderDomain;
  readonly sourceCategory: string;
  readonly disabledByDefault: boolean;
  readonly supportedSyntheticDataDomains: readonly string[];
  readonly safetyNote: string;
  readonly healthStatus: ReadOnlyProviderHealthStatus;
  readonly latencyBucket: ReadOnlyProviderLatencyBucket;
  readonly reliabilityLabel: ReadOnlyProviderReliabilityLabel;
  readonly deterministicFailureExamples: readonly string[];
  readonly unsupportedLiveCapabilities: readonly string[];
  readonly sourceSyntheticLaunchFixtureName: string;
}

const SCENARIO_DEFINITIONS: Readonly<
  Record<ReadOnlyProviderContractName, ScenarioDefinition>
> = {
  'solana-rpc-contract': {
    providerName: 'Synthetic Solana RPC Provider',
    providerKind: 'solana_rpc_contract',
    providerDomain: 'solana_rpc_contract',
    sourceCategory: 'blockchain_rpc_contract',
    disabledByDefault: true,
    supportedSyntheticDataDomains: ['block_data', 'account_state', 'transaction_status'],
    safetyNote:
      'Contract-only gate. No real Solana RPC connection. Disabled by default. Future adapter gate only.',
    healthStatus: 'synthetic_disabled',
    latencyBucket: 'synthetic_unknown',
    reliabilityLabel: 'synthetic_not_applicable',
    deterministicFailureExamples: [
      'PROVIDER_DISABLED: live Solana RPC not permitted in contract-only phase.',
      'LIVE_NETWORK_UNAVAILABLE: no network access in fixture-only mode.',
    ],
    unsupportedLiveCapabilities: [
      'live_rpc_calls',
      'websocket_subscriptions',
      'geyser_yellowstone',
      'real_account_queries',
    ],
    sourceSyntheticLaunchFixtureName: 'clean-launch-baseline',
  },
  'pump-launch-contract': {
    providerName: 'Synthetic Pump Launch Provider',
    providerKind: 'pump_launch_contract',
    providerDomain: 'pump_launch_contract',
    sourceCategory: 'launch_event_contract',
    disabledByDefault: true,
    supportedSyntheticDataDomains: ['launch_events', 'token_creation', 'early_volume'],
    safetyNote:
      'Contract-only gate. No Pump.fun integration. Disabled by default. Future adapter gate only.',
    healthStatus: 'synthetic_disabled',
    latencyBucket: 'synthetic_unknown',
    reliabilityLabel: 'synthetic_not_applicable',
    deterministicFailureExamples: [
      'PROVIDER_DISABLED: Pump.fun integration not permitted in contract-only phase.',
      'LIVE_NETWORK_UNAVAILABLE: no network access in fixture-only mode.',
    ],
    unsupportedLiveCapabilities: [
      'live_pump_launch_feed',
      'websocket_new_token_events',
      'real_bonding_curve_data',
      'real_creator_lookup',
    ],
    sourceSyntheticLaunchFixtureName: 'high-velocity-early-volume-launch',
  },
  'dex-liquidity-contract': {
    providerName: 'Synthetic DEX Liquidity Provider',
    providerKind: 'dex_liquidity_contract',
    providerDomain: 'dex_liquidity_contract',
    sourceCategory: 'dex_liquidity_contract',
    disabledByDefault: true,
    supportedSyntheticDataDomains: ['pool_data', 'liquidity_snapshots', 'price_impact'],
    safetyNote:
      'Contract-only gate. No Raydium/Jupiter/Orca/Meteora integration. Disabled by default. Future adapter gate only.',
    healthStatus: 'synthetic_disabled',
    latencyBucket: 'synthetic_unknown',
    reliabilityLabel: 'synthetic_not_applicable',
    deterministicFailureExamples: [
      'PROVIDER_DISABLED: DEX liquidity integration not permitted in contract-only phase.',
      'UNSUPPORTED_PROVIDER_DOMAIN: domain not available in fixture-only mode.',
    ],
    unsupportedLiveCapabilities: [
      'live_pool_queries',
      'real_price_feeds',
      'dex_swap_simulation',
      'raydium_jupiter_orca_meteora',
    ],
    sourceSyntheticLaunchFixtureName: 'low-liquidity-launch',
  },
  'token-metadata-contract': {
    providerName: 'Synthetic Token Metadata Provider',
    providerKind: 'token_metadata_contract',
    providerDomain: 'token_metadata_contract',
    sourceCategory: 'token_metadata_contract',
    disabledByDefault: true,
    supportedSyntheticDataDomains: ['token_symbol', 'token_name', 'metadata_completeness'],
    safetyNote:
      'Contract-only gate. No live metadata registry queries. Disabled by default. Future adapter gate only.',
    healthStatus: 'synthetic_contract_only',
    latencyBucket: 'synthetic_fast',
    reliabilityLabel: 'synthetic_reliable',
    deterministicFailureExamples: [
      'PROVIDER_DISABLED: live metadata registry not permitted in contract-only phase.',
      'INVALID_DETERMINISTIC_FIXTURE_QUERY: metadata fixture not matched.',
    ],
    unsupportedLiveCapabilities: [
      'live_metadata_registry_queries',
      'real_token_authority_lookups',
      'on_chain_metadata_fetch',
    ],
    sourceSyntheticLaunchFixtureName: 'metadata-incomplete-launch',
  },
  'holder-distribution-contract': {
    providerName: 'Synthetic Holder Distribution Provider',
    providerKind: 'holder_distribution_contract',
    providerDomain: 'holder_distribution_contract',
    sourceCategory: 'holder_distribution_contract',
    disabledByDefault: true,
    supportedSyntheticDataDomains: [
      'holder_concentration',
      'top_holders',
      'distribution_snapshots',
    ],
    safetyNote:
      'Contract-only gate. No live holder registry queries. Disabled by default. Future adapter gate only.',
    healthStatus: 'synthetic_contract_only',
    latencyBucket: 'synthetic_medium',
    reliabilityLabel: 'synthetic_variable',
    deterministicFailureExamples: [
      'PROVIDER_DISABLED: live holder data not permitted in contract-only phase.',
      'UNSUPPORTED_PROVIDER_DOMAIN: domain not available in fixture-only mode.',
    ],
    unsupportedLiveCapabilities: [
      'live_holder_registry_queries',
      'real_top_holder_lookups',
      'on_chain_distribution_fetch',
    ],
    sourceSyntheticLaunchFixtureName: 'concentrated-holder-launch',
  },
  'wallet-cluster-contract': {
    providerName: 'Synthetic Wallet Cluster Provider',
    providerKind: 'wallet_cluster_contract',
    providerDomain: 'wallet_cluster_contract',
    sourceCategory: 'wallet_cluster_contract',
    disabledByDefault: true,
    supportedSyntheticDataDomains: [
      'wallet_cluster_indicators',
      'bundle_patterns',
      'leader_follower',
    ],
    safetyNote:
      'Contract-only gate. No live wallet cluster queries. Disabled by default. Future adapter gate only.',
    healthStatus: 'synthetic_contract_only',
    latencyBucket: 'synthetic_slow',
    reliabilityLabel: 'synthetic_variable',
    deterministicFailureExamples: [
      'PROVIDER_DISABLED: live wallet cluster analysis not permitted in contract-only phase.',
      'LIVE_NETWORK_UNAVAILABLE: no network access in fixture-only mode.',
    ],
    unsupportedLiveCapabilities: [
      'live_cluster_graph_queries',
      'real_wallet_address_lookups',
      'on_chain_transaction_graph',
    ],
    sourceSyntheticLaunchFixtureName: 'possible-bundle-cluster-launch',
  },
  'risk-intelligence-contract': {
    providerName: 'Synthetic Risk Intelligence Provider',
    providerKind: 'risk_intelligence_contract',
    providerDomain: 'risk_intelligence_contract',
    sourceCategory: 'risk_intelligence_contract',
    disabledByDefault: false,
    supportedSyntheticDataDomains: [
      'risk_factors',
      'risk_severity',
      'creator_history_risk',
      'metadata_integrity_risk',
    ],
    safetyNote:
      'Contract-only gate. Fixture-derived risk intelligence only. No advisory outputs.',
    healthStatus: 'synthetic_healthy',
    latencyBucket: 'synthetic_fast',
    reliabilityLabel: 'synthetic_reliable',
    deterministicFailureExamples: [
      'INVALID_DETERMINISTIC_FIXTURE_QUERY: risk fixture query did not match known scenario.',
      'UNSUPPORTED_PROVIDER_DOMAIN: domain not available in fixture-only mode.',
    ],
    unsupportedLiveCapabilities: [
      'live_risk_scoring',
      'real_time_risk_updates',
      'advisory_outputs',
      'investment_signals',
    ],
    sourceSyntheticLaunchFixtureName: 'suspicious-creator-history-launch',
  },
  'disabled-unsafe-contract': {
    providerName: 'Synthetic Disabled Unsafe Provider',
    providerKind: 'disabled_unsafe_contract',
    providerDomain: 'disabled_unsafe_contract',
    sourceCategory: 'disabled_unsafe_contract',
    disabledByDefault: true,
    supportedSyntheticDataDomains: [],
    safetyNote:
      'Permanently disabled contract representing all unsafe provider categories. Cannot be enabled.',
    healthStatus: 'synthetic_unavailable',
    latencyBucket: 'synthetic_unknown',
    reliabilityLabel: 'synthetic_not_applicable',
    deterministicFailureExamples: [
      'PROVIDER_DISABLED: this provider category is permanently disabled.',
      'UNSAFE_CAPABILITY_REQUESTED: this domain requires explicit future-phase gate unlock.',
    ],
    unsupportedLiveCapabilities: [
      'wallet_access',
      'private_key_handling',
      'transaction_signing',
      'transaction_sending',
      'execution',
      'trading_signals',
      'recommendations',
      'investment_advice',
    ],
    sourceSyntheticLaunchFixtureName: 'safety-rejected-launch',
  },
};

// ─── Sub-builders ─────────────────────────────────────────────

function buildProviderIdentity(
  name: ReadOnlyProviderContractName,
  def: ScenarioDefinition,
  id: string,
): ReadOnlyProviderIdentity {
  return {
    providerId: `phase54-provider-${id}`,
    providerName: def.providerName,
    providerKind: def.providerKind,
    providerDomain: def.providerDomain,
    sourceCategory: def.sourceCategory,
    disabledByDefault: def.disabledByDefault,
    liveNetworkAccess: false,
    walletAccess: false,
    executionAccess: false,
    supportedSyntheticDataDomains: def.supportedSyntheticDataDomains,
    safetyNote: def.safetyNote,
  };
}

function buildProviderInterfaceContract(
  name: ReadOnlyProviderContractName,
  def: ScenarioDefinition,
  id: string,
): ReadOnlyProviderInterfaceContract {
  return {
    contractId: `phase54-interface-contract-${id}`,
    contractVersion: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_VERSION,
    requestShape: {
      domainQuery: def.providerDomain,
      fixtureQueryId: `phase54-query-${id}`,
      localOnly: true,
      synthetic: true,
    },
    responseShape: {
      responseId: `phase54-response-shape-${id}`,
      statusCode: 200,
      success: true,
      fixtureOnly: true,
      readOnly: true,
      localOnly: true,
      dataShape: `synthetic_${def.providerDomain}_response_shape`,
    },
    errorShape: {
      errorCode: 'PROVIDER_DISABLED' as ReadOnlyProviderErrorCode,
      message: def.deterministicFailureExamples[0] ?? 'PROVIDER_DISABLED: provider not active.',
      recoverable: false,
      safetyNote: def.safetyNote,
    },
    supportedDomains: [def.providerDomain],
    unsupportedLiveCapabilities: def.unsupportedLiveCapabilities,
    safetyNotes: [
      def.safetyNote,
      'No live network access. No real provider adapters. Contract-only gate.',
    ],
  };
}

function buildProviderCapabilityContract(id: string): ReadOnlyProviderCapabilityContract {
  return {
    capabilityContractId: `phase54-capability-contract-${id}`,
    readOnlySupport: true,
    syntheticFixtureSupport: true,
    liveNetworkDisabled: true,
    walletDisabled: true,
    executionDisabled: true,
    tradingSignalsDisabled: true,
    recommendationsDisabled: true,
    investmentAdviceDisabled: true,
    source: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
  };
}

function buildProviderHealthContract(
  def: ScenarioDefinition,
  id: string,
): ReadOnlyProviderHealthContract {
  return {
    healthContractId: `phase54-health-contract-${id}`,
    deterministicStatus: def.healthStatus,
    syntheticLatencyBucket: def.latencyBucket,
    syntheticReliabilityLabel: def.reliabilityLabel,
    deterministicFailureExamples: def.deterministicFailureExamples,
    noActualHealthCheck: true,
    syntheticOnly: true,
  };
}

function buildSyntheticResponses(
  name: ReadOnlyProviderContractName,
  def: ScenarioDefinition,
  id: string,
): readonly ReadOnlySyntheticResponse[] {
  const meta = {
    generatedAt: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
    source: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
    fixtureOnly: true as const,
  };
  const safety = {
    nonAdvisory: true as const,
    contractOnly: true as const,
    noLiveData: true as const,
  };

  const successResponse: ReadOnlySyntheticResponse = {
    responseId: `phase54-response-success-${id}`,
    responseKind: 'synthetic_launch_event',
    sourceSyntheticLaunchFixtureName: def.sourceSyntheticLaunchFixtureName,
    statusCode: 200,
    success: true,
    dataShape: `synthetic_${def.providerDomain}_success`,
    error: null,
    meta,
    safety,
  };

  const errorResponse: ReadOnlySyntheticResponse = {
    responseId: `phase54-response-error-${id}`,
    responseKind: 'synthetic_error',
    sourceSyntheticLaunchFixtureName: def.sourceSyntheticLaunchFixtureName,
    statusCode: 503,
    success: false,
    dataShape: `synthetic_${def.providerDomain}_error`,
    error: {
      errorCode: 'PROVIDER_DISABLED',
      message: `${def.providerName} is disabled in contract-only phase.`,
      recoverable: false,
      safetyNote: def.safetyNote,
    },
    meta,
    safety,
  };

  return [successResponse, errorResponse];
}

function buildSelectorExamples(
  name: ReadOnlyProviderContractName,
  def: ScenarioDefinition,
  fixtureId: string,
): readonly ReadOnlyProviderContractSelectorResult[] {
  return [
    {
      selectorId: `phase54-selector-by-id-${fixtureId}`,
      selectedFixtureId: fixtureId,
      selectedProviderKind: def.providerKind,
      matched: true,
      source: 'synthetic_fixture_only',
    },
    {
      selectorId: `phase54-selector-by-kind-${def.providerKind}`,
      selectedFixtureId: fixtureId,
      selectedProviderKind: def.providerKind,
      matched: true,
      source: 'synthetic_fixture_only',
    },
  ];
}

// ─── Main builder ─────────────────────────────────────────────

export function buildReadOnlyProviderContractFixture(
  input: BuildReadOnlyProviderContractFixtureInput,
): ReadOnlyProviderContractFixture {
  const { fixtureName } = input;
  const def = SCENARIO_DEFINITIONS[fixtureName];
  const checksumBase = `${PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE}:${fixtureName}`;
  const checksum = stableDeterministicReadOnlyProviderContractChecksum(checksumBase);
  const fixtureId = `phase54-fixture-${checksum.replace(':', '-')}`;

  const providerIdentity = buildProviderIdentity(fixtureName, def, fixtureId);
  const providerInterfaceContract = buildProviderInterfaceContract(fixtureName, def, fixtureId);
  const providerCapabilityContract = buildProviderCapabilityContract(fixtureId);
  const providerHealthContract = buildProviderHealthContract(def, fixtureId);
  const syntheticResponses = buildSyntheticResponses(fixtureName, def, fixtureId);
  const capabilityFlags = getReadOnlyProviderContractCapabilities();

  const meta = {
    generatedAt: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_GENERATED_AT,
    source: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_SOURCE,
    version: PHASE_54_READ_ONLY_PROVIDER_CONTRACTS_VERSION,
    phase: READ_ONLY_PROVIDER_CONTRACTS_PHASE,
  };

  const safety = {
    nonAdvisory: true as const,
    contractOnly: true as const,
    noLiveData: true as const,
    noNetworkAccess: true as const,
    noWalletAccess: true as const,
    noExecution: true as const,
  };

  // Build a partial fixture first (without viewModel/apiContracts/selectorExamples)
  // to pass to view model and contract builders
  const partialFixture = {
    fixtureId,
    fixtureName,
    fixtureKind: def.providerKind,
    phase: READ_ONLY_PROVIDER_CONTRACTS_PHASE,
    providerIdentity,
    providerInterfaceContract,
    providerCapabilityContract,
    providerHealthContract,
    syntheticResponses,
    capabilityFlags,
    meta,
    safety,
  } as const;

  const viewModel = buildReadOnlyProviderContractViewModel(
    partialFixture as unknown as ReadOnlyProviderContractFixture,
  );

  const withViewModel = {
    ...partialFixture,
    viewModel,
  } as unknown as ReadOnlyProviderContractFixture;

  const apiContracts = buildReadOnlyProviderApiContract(withViewModel);
  const selectorExamples = buildSelectorExamples(fixtureName, def, fixtureId);

  return {
    ...withViewModel,
    apiContracts,
    selectorExamples,
  };
}
