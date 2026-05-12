import { READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES } from '../read-only-provider-adapter-gate/index.js';
import { READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES } from '../read-only-solana-provider-boundary/index.js';
import { getFirstReadOnlyProviderAdapterCapabilities } from './capabilities.js';
import { buildFirstReadOnlyProviderConformanceCheck } from './conformance.js';
import { buildFirstReadOnlyProviderAdapterApiContract } from './contracts.js';
import { buildFirstReadOnlyProviderErrorNormalization } from './error-normalization.js';
import { buildFirstReadOnlyProviderHealth } from './health.js';
import { stableDeterministicFirstReadOnlyProviderAdapterChecksum } from './normalization.js';
import { buildFirstReadOnlyProviderClientContract } from './provider-client.js';
import { buildFirstReadOnlyProviderConfig } from './provider-config.js';
import { buildFirstReadOnlyProviderCapabilities } from './provider-capabilities.js';
import { buildFirstReadOnlyProviderTransport } from './provider-transport.js';
import { buildFirstReadOnlyProviderAdapterReport } from './reports.js';
import { buildFirstReadOnlyProviderResponseMapping } from './response-mapping.js';
import { buildFirstReadOnlyProviderSmokeGuard } from './smoke-guard.js';
import type {
  BuildFirstReadOnlyProviderAdapterFixtureInput,
  FirstReadOnlyProviderAdapterFixture,
  FirstReadOnlyProviderAdapterKind,
  FirstReadOnlyProviderAdapterName,
  FirstReadOnlyProviderConfigState,
  FirstReadOnlyProviderErrorCategory,
  FirstReadOnlyProviderHealthState,
} from './types.js';
import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE,
  PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT,
  PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SCHEMA_VERSION,
  PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SOURCE,
  PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_VERSION,
} from './types.js';
import { buildFirstReadOnlyProviderAdapterViewModel } from './view-models.js';

interface Scenario {
  readonly fixtureKind: FirstReadOnlyProviderAdapterKind;
  readonly sourceBoundaryFixtureName: (typeof READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES)[number];
  readonly sourceGateFixtureName: (typeof READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES)[number];
  readonly configState: FirstReadOnlyProviderConfigState;
  readonly responseKind: FirstReadOnlyProviderAdapterFixture['frozenResponseFixture']['responseKind'];
  readonly errorCategory: FirstReadOnlyProviderErrorCategory;
  readonly healthState: FirstReadOnlyProviderHealthState;
  readonly mappingMissing: readonly string[];
  readonly gateOpen: boolean;
  readonly transportKind: FirstReadOnlyProviderAdapterFixture['transportContract']['transportKind'];
}

const SCENARIOS: Readonly<Record<FirstReadOnlyProviderAdapterName, Scenario>> = {
  'offline-account-info-success': {
    fixtureKind: 'offline_account_info_success',
    sourceBoundaryFixtureName: 'account-info-boundary-ready',
    sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
    configState: 'read_only_ready',
    responseKind: 'account_info_success',
    errorCategory: 'live_smoke_disabled',
    healthState: 'offline_fixture_ready',
    mappingMissing: [],
    gateOpen: true,
    transportKind: 'offline_fixture_transport',
  },
  'offline-mint-authority-success': {
    fixtureKind: 'offline_mint_authority_success',
    sourceBoundaryFixtureName: 'mint-authority-boundary-ready',
    sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
    configState: 'offline_fixture_mode',
    responseKind: 'mint_authority_success',
    errorCategory: 'live_smoke_disabled',
    healthState: 'offline_fixture_ready',
    mappingMissing: [],
    gateOpen: true,
    transportKind: 'offline_fixture_transport',
  },
  'offline-token-metadata-success': {
    fixtureKind: 'offline_token_metadata_success',
    sourceBoundaryFixtureName: 'token-metadata-boundary-ready',
    sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
    configState: 'offline_fixture_mode',
    responseKind: 'token_metadata_success',
    errorCategory: 'live_smoke_disabled',
    healthState: 'offline_fixture_ready',
    mappingMissing: [],
    gateOpen: true,
    transportKind: 'offline_fixture_transport',
  },
  'provider-unavailable-error': {
    fixtureKind: 'provider_unavailable_error',
    sourceBoundaryFixtureName: 'provider-health-boundary-ready',
    sourceGateFixtureName: 'network-access-rejected-gate',
    configState: 'missing_configuration',
    responseKind: 'provider_unavailable',
    errorCategory: 'provider_unavailable',
    healthState: 'provider_unavailable_fixture',
    mappingMissing: [],
    gateOpen: false,
    transportKind: 'future_live_smoke_transport_disabled',
  },
  'malformed-response-error': {
    fixtureKind: 'malformed_response_error',
    sourceBoundaryFixtureName: 'error-normalization-boundary-ready',
    sourceGateFixtureName: 'safe-synthetic-mock-closed-by-default-gate',
    configState: 'offline_fixture_mode',
    responseKind: 'malformed_response',
    errorCategory: 'malformed_response',
    healthState: 'conformance_failed',
    mappingMissing: ['providerStatus'],
    gateOpen: false,
    transportKind: 'offline_fixture_transport',
  },
  'rate-limited-error': {
    fixtureKind: 'rate_limited_error',
    sourceBoundaryFixtureName: 'error-normalization-boundary-ready',
    sourceGateFixtureName: 'safe-synthetic-mock-closed-by-default-gate',
    configState: 'offline_fixture_mode',
    responseKind: 'rate_limited',
    errorCategory: 'rate_limited',
    healthState: 'conformance_failed',
    mappingMissing: [],
    gateOpen: false,
    transportKind: 'offline_fixture_transport',
  },
  'gate-closed-rejected': {
    fixtureKind: 'gate_closed_rejected',
    sourceBoundaryFixtureName: 'unsafe-write-capability-boundary-rejected',
    sourceGateFixtureName: 'execution-capability-rejected-gate',
    configState: 'blocked_by_gate',
    responseKind: 'gate_closed',
    errorCategory: 'gate_closed',
    healthState: 'gate_closed',
    mappingMissing: [],
    gateOpen: false,
    transportKind: 'future_live_smoke_transport_disabled',
  },
  'unsupported-write-capability-rejected': {
    fixtureKind: 'unsupported_write_capability_rejected',
    sourceBoundaryFixtureName: 'unsafe-write-capability-boundary-rejected',
    sourceGateFixtureName: 'wallet-capability-rejected-gate',
    configState: 'disabled_by_default',
    responseKind: 'unsupported_write_capability',
    errorCategory: 'unsupported_write_capability',
    healthState: 'conformance_failed',
    mappingMissing: [],
    gateOpen: false,
    transportKind: 'future_live_smoke_transport_disabled',
  },
};

export function buildFirstReadOnlyProviderAdapterFixture(
  input: BuildFirstReadOnlyProviderAdapterFixtureInput,
): FirstReadOnlyProviderAdapterFixture {
  const scenario = SCENARIOS[input.fixtureName];
  const fixtureId = `phase65-fixture-${input.fixtureName}`;
  const deterministicSeed = stableDeterministicFirstReadOnlyProviderAdapterChecksum(
    `phase65-${input.fixtureName}`,
  );

  const providerConfig = buildFirstReadOnlyProviderConfig({
    fixtureId,
    mode: scenario.configState,
  });
  const providerCapabilities = buildFirstReadOnlyProviderCapabilities({ fixtureId });
  const transportContract = buildFirstReadOnlyProviderTransport({
    fixtureId,
    transportKind: scenario.transportKind,
  });
  const clientContract = buildFirstReadOnlyProviderClientContract({ fixtureId });

  const frozenResponseFixture: FirstReadOnlyProviderAdapterFixture['frozenResponseFixture'] = {
    responseId: `${fixtureId}-frozen-response`,
    responseKind: scenario.responseKind,
    fixtureOnly: true,
    liveData: false,
    endpoint: null,
    providerSdkReference: null,
    apiKeyRequired: false,
    payload: {
      accountAddress: scenario.responseKind === 'provider_unavailable' ? null : '11111111111111111111111111111111',
      mintAddress:
        scenario.responseKind === 'provider_unavailable' || scenario.responseKind === 'gate_closed'
          ? null
          : 'So11111111111111111111111111111111111111112',
      tokenMetadataRef:
        scenario.responseKind === 'token_metadata_success' ? 'token-metadata-ref-fixture' : null,
      authorityRef:
        scenario.responseKind === 'mint_authority_success' ? 'mint-authority-ref-fixture' : null,
      providerStatus:
        scenario.responseKind === 'provider_unavailable'
          ? 'unavailable'
          : scenario.responseKind === 'rate_limited'
            ? 'rate_limited'
            : 'ok',
      errorCode:
        scenario.responseKind.endsWith('success')
          ? null
          : scenario.errorCategory.toUpperCase(),
    },
  };

  const responseMapping = buildFirstReadOnlyProviderResponseMapping({
    fixtureId,
    missingRequiredFields: scenario.mappingMissing,
  });
  const errorNormalization = buildFirstReadOnlyProviderErrorNormalization({
    fixtureId,
    primaryCategory: scenario.errorCategory,
  });
  const conformanceChecks = buildFirstReadOnlyProviderConformanceCheck({
    fixtureId,
    mappingComplete: responseMapping.missingRequiredFields.length === 0,
    gateOpen: scenario.gateOpen,
  });
  const health = buildFirstReadOnlyProviderHealth({
    fixtureId,
    healthState: scenario.healthState,
  });
  const smokeGuard = buildFirstReadOnlyProviderSmokeGuard({
    fixtureId,
    config: {
      allowLiveSmoke: false,
      explicitGateAccepted: false,
      envProvided: false,
      allowNetworkInTests: false,
    },
  });

  const partial = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE,
    schemaVersion: PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SCHEMA_VERSION,
    sourceBoundaryFixtureName: scenario.sourceBoundaryFixtureName,
    sourceGateFixtureName: scenario.sourceGateFixtureName,
    adapterIdentity: {
      adapterId: `${fixtureId}-identity`,
      adapterName: input.fixtureName,
      adapterKind: scenario.fixtureKind,
      adapterProviderKind: 'solana_read_only_account_info' as const,
      sourceBoundaryFixtureName: scenario.sourceBoundaryFixtureName,
      sourceGateFixtureName: scenario.sourceGateFixtureName,
      sourceBoundaryFixtureNames: READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
      sourceGateFixtureNames: READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
      schemaVersion: PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SCHEMA_VERSION,
      deterministicSeed,
      generatedAt: PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT,
    },
    providerConfig,
    providerCapabilities,
    transportContract,
    clientContract,
    frozenResponseFixture,
    responseMapping,
    errorNormalization,
    conformanceChecks,
    health,
    smokeGuard,
    adapterReport: undefined as unknown as FirstReadOnlyProviderAdapterFixture['adapterReport'],
    viewModel: undefined as unknown as FirstReadOnlyProviderAdapterFixture['viewModel'],
    apiContracts: undefined as unknown as FirstReadOnlyProviderAdapterFixture['apiContracts'],
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: scenario.fixtureKind,
        matched: true,
        source: 'synthetic_fixture_only' as const,
      },
    ],
    capabilityFlags: getFirstReadOnlyProviderAdapterCapabilities(),
    meta: {
      generatedAt: PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_GENERATED_AT,
      source: PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_SOURCE,
      version: PHASE_65_FIRST_READ_ONLY_PROVIDER_ADAPTER_VERSION,
      phase: FIRST_READ_ONLY_PROVIDER_ADAPTER_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true as const,
      localOnly: true as const,
      readOnly: true as const,
      adapterOnly: true as const,
      noLiveData: true as const,
      noNetworkAccessByDefault: true as const,
      nonAdvisory: true as const,
      notExecutable: true as const,
    },
  };

  const adapterReport = buildFirstReadOnlyProviderAdapterReport({
    fixtureId,
    configState: providerConfig.mode,
    conformancePass: conformanceChecks.adapterToPhase64BoundaryConformance,
    smokeStatus: smokeGuard.status,
    healthState: health.healthState,
    transportKind: transportContract.transportKind,
  });

  const fixtureWithReport = {
    ...partial,
    adapterReport,
  } as FirstReadOnlyProviderAdapterFixture;

  const viewModel = buildFirstReadOnlyProviderAdapterViewModel(fixtureWithReport);
  const fixtureWithViewModel = {
    ...fixtureWithReport,
    viewModel,
  } as FirstReadOnlyProviderAdapterFixture;

  return {
    ...fixtureWithViewModel,
    apiContracts: buildFirstReadOnlyProviderAdapterApiContract(fixtureWithViewModel),
  };
}
