import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
} from '../first-read-only-provider-adapter/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
} from '../read-only-provider-adapter-gate/index.js';
import {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
} from '../read-only-solana-provider-boundary/index.js';
import { getMultiProviderReadOnlyFoundationCapabilities } from './capabilities.js';
import { buildReadOnlyCachePolicy } from './cache-policy.js';
import { buildMultiProviderConformanceReport } from './conformance.js';
import { buildMultiProviderApiContract } from './contracts.js';
import { buildProviderFallbackFixture } from './provider-fallback.js';
import { buildProviderHealthScore } from './provider-health.js';
import { buildMultiProviderNormalizedRecord } from './provider-normalization.js';
import { buildMultiProviderRegistry } from './provider-registry.js';
import { buildProviderSelectionFixture } from './provider-selection.js';
import { buildMultiProviderReadOnlyFoundationReport } from './reports.js';
import { buildStaleDataCheck } from './stale-data.js';
import { buildReadOnlyFreshnessPolicy } from './freshness-policy.js';
import {
  stableDeterministicMultiProviderReadOnlyFoundationChecksum,
} from './normalization.js';
import type {
  BuildMultiProviderReadOnlyFoundationFixtureInput,
  MultiProviderReadOnlyFoundationFixture,
  MultiProviderReadOnlyFoundationKind,
  MultiProviderReadOnlyFoundationName,
  MultiProviderRegistryEntry,
} from './types.js';
import {
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE,
  PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_GENERATED_AT,
  PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SCHEMA_VERSION,
  PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SOURCE,
  PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_VERSION,
} from './types.js';
import { buildMultiProviderViewModel } from './view-models.js';

const DETERMINISTIC_OBSERVED_AT = '2026-05-12T00:00:00.000Z' as const;
const STALE_OBSERVED_AT = '2026-05-11T00:00:00.000Z' as const;

const BASE_ENTRY_CAPABILITY_FLAGS = {
  readOnly: true,
  liveDataDefault: false,
  networkAccessDefault: false,
  writeMethods: false,
  walletLogic: false,
  privateKeyHandling: false,
  signing: false,
  transactionSending: false,
  execution: false,
  tradingSignals: false,
  recommendations: false,
  investmentAdvice: false,
  routeHandlers: false,
  runtimeRequests: false,
  uiRendering: false,
  domAccess: false,
  persistence: false,
  filesystemWrites: false,
  backgroundJobs: false,
  scheduledJobs: false,
  realOrders: false,
  realFunds: false,
  realPnL: false,
  gateBypass: false,
  providerSdkRequired: false,
  apiKeysRequired: false,
} as const;

function buildProviderEntry(input: {
  fixtureId: string;
  providerIdSuffix: 'primary' | 'secondary' | 'tertiary';
  providerName: string;
  sourceAdapterFixtureName: (typeof FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES)[number];
  sourceBoundaryFixtureName: (typeof READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES)[number];
  sourceGateFixtureName: (typeof READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES)[number];
  enabledByDefault: boolean;
}): MultiProviderRegistryEntry {
  return {
    providerId: `${input.fixtureId}-${input.providerIdSuffix}`,
    providerName: input.providerName,
    providerKind: 'first_read_only_provider_adapter_fixture',
    sourceAdapterFixtureName: input.sourceAdapterFixtureName,
    sourceBoundaryFixtureName: input.sourceBoundaryFixtureName,
    sourceGateFixtureName: input.sourceGateFixtureName,
    readOnly: true,
    enabledByDefault: input.enabledByDefault,
    liveDataDefault: false,
    networkAccessDefault: false,
    capabilityFlags: BASE_ENTRY_CAPABILITY_FLAGS,
  };
}

interface Scenario {
  readonly fixtureKind: MultiProviderReadOnlyFoundationKind;
  readonly providerCount: 1 | 2 | 3;
  readonly enabledProviders: readonly ('primary' | 'secondary' | 'tertiary')[];
  readonly staleProviders: readonly ('primary' | 'secondary' | 'tertiary')[];
  readonly selectedProvider: 'primary' | 'secondary' | 'tertiary' | 'none';
  readonly fallbackProviders: readonly ('primary' | 'secondary' | 'tertiary')[];
  readonly healthStatusByProvider: Readonly<Record<'primary' | 'secondary' | 'tertiary', 'healthy' | 'degraded' | 'stale' | 'blocked' | 'rejected'>>;
  readonly selectionReason: string;
  readonly fallbackReasonCodes: readonly string[];
  readonly freshnessAction: 'use_stale_with_warning' | 'use_fallback' | 'fail_closed';
  readonly staleReason: string;
  readonly normalizedMissingFields: readonly string[];
  readonly normalizedCaveats: readonly string[];
}

const SCENARIOS: Readonly<Record<MultiProviderReadOnlyFoundationName, Scenario>> = {
  'single-provider-healthy': {
    fixtureKind: 'single_provider_healthy',
    providerCount: 1,
    enabledProviders: ['primary'],
    staleProviders: [],
    selectedProvider: 'primary',
    fallbackProviders: [],
    healthStatusByProvider: {
      primary: 'healthy',
      secondary: 'blocked',
      tertiary: 'blocked',
    },
    selectionReason: 'deterministic_primary_available',
    fallbackReasonCodes: [],
    freshnessAction: 'use_stale_with_warning',
    staleReason: 'within_freshness_window',
    normalizedMissingFields: [],
    normalizedCaveats: ['single provider fixture path only'],
  },
  'multi-provider-healthy': {
    fixtureKind: 'multi_provider_healthy',
    providerCount: 3,
    enabledProviders: ['primary', 'secondary', 'tertiary'],
    staleProviders: [],
    selectedProvider: 'primary',
    fallbackProviders: ['secondary', 'tertiary'],
    healthStatusByProvider: {
      primary: 'healthy',
      secondary: 'healthy',
      tertiary: 'degraded',
    },
    selectionReason: 'deterministic_priority_order',
    fallbackReasonCodes: ['fallback_available'],
    freshnessAction: 'use_stale_with_warning',
    staleReason: 'within_freshness_window',
    normalizedMissingFields: [],
    normalizedCaveats: ['aggregated deterministic provider shape'],
  },
  'stale-primary-provider': {
    fixtureKind: 'stale_primary_provider',
    providerCount: 3,
    enabledProviders: ['primary', 'secondary', 'tertiary'],
    staleProviders: ['primary'],
    selectedProvider: 'primary',
    fallbackProviders: ['secondary', 'tertiary'],
    healthStatusByProvider: {
      primary: 'stale',
      secondary: 'healthy',
      tertiary: 'degraded',
    },
    selectionReason: 'stale_detected_primary_still_selected_for_audit',
    fallbackReasonCodes: ['primary_marked_stale'],
    freshnessAction: 'use_fallback',
    staleReason: 'synthetic_max_age_exceeded',
    normalizedMissingFields: ['tokenMetadataRef'],
    normalizedCaveats: ['primary stale state flagged before fallback policy application'],
  },
  'fallback-to-secondary': {
    fixtureKind: 'fallback_to_secondary',
    providerCount: 3,
    enabledProviders: ['primary', 'secondary', 'tertiary'],
    staleProviders: ['primary'],
    selectedProvider: 'secondary',
    fallbackProviders: ['tertiary'],
    healthStatusByProvider: {
      primary: 'stale',
      secondary: 'healthy',
      tertiary: 'degraded',
    },
    selectionReason: 'primary_stale_fallback_to_secondary',
    fallbackReasonCodes: ['stale_primary_provider', 'fail_closed_fallback_policy'],
    freshnessAction: 'use_fallback',
    staleReason: 'synthetic_max_age_exceeded',
    normalizedMissingFields: [],
    normalizedCaveats: ['fallback selected without live call'],
  },
  'all-providers-stale-fail-closed': {
    fixtureKind: 'all_providers_stale_fail_closed',
    providerCount: 3,
    enabledProviders: ['primary', 'secondary', 'tertiary'],
    staleProviders: ['primary', 'secondary', 'tertiary'],
    selectedProvider: 'none',
    fallbackProviders: [],
    healthStatusByProvider: {
      primary: 'stale',
      secondary: 'stale',
      tertiary: 'stale',
    },
    selectionReason: 'fail_closed_no_safe_provider',
    fallbackReasonCodes: ['all_providers_stale', 'unsafe_fallback_blocked'],
    freshnessAction: 'fail_closed',
    staleReason: 'all_providers_stale',
    normalizedMissingFields: ['providerStatus'],
    normalizedCaveats: ['explicit fail-closed selection state'],
  },
  'disabled-provider-blocked': {
    fixtureKind: 'disabled_provider_blocked',
    providerCount: 3,
    enabledProviders: ['primary', 'tertiary'],
    staleProviders: [],
    selectedProvider: 'primary',
    fallbackProviders: ['tertiary'],
    healthStatusByProvider: {
      primary: 'healthy',
      secondary: 'blocked',
      tertiary: 'degraded',
    },
    selectionReason: 'disabled_provider_removed_from_selection',
    fallbackReasonCodes: ['secondary_disabled_by_default'],
    freshnessAction: 'use_fallback',
    staleReason: 'within_freshness_window',
    normalizedMissingFields: [],
    normalizedCaveats: ['disabled provider retained in registry but blocked from selection'],
  },
  'capability-mismatch-rejected': {
    fixtureKind: 'capability_mismatch_rejected',
    providerCount: 2,
    enabledProviders: ['primary', 'secondary'],
    staleProviders: [],
    selectedProvider: 'secondary',
    fallbackProviders: [],
    healthStatusByProvider: {
      primary: 'rejected',
      secondary: 'healthy',
      tertiary: 'blocked',
    },
    selectionReason: 'primary_rejected_capability_mismatch',
    fallbackReasonCodes: ['capability_mismatch_rejected'],
    freshnessAction: 'use_fallback',
    staleReason: 'within_freshness_window',
    normalizedMissingFields: ['authorityRef'],
    normalizedCaveats: ['capability mismatch fixture rejected before selection'],
  },
  'unsafe-write-capability-rejected': {
    fixtureKind: 'unsafe_write_capability_rejected',
    providerCount: 2,
    enabledProviders: ['secondary'],
    staleProviders: [],
    selectedProvider: 'secondary',
    fallbackProviders: [],
    healthStatusByProvider: {
      primary: 'rejected',
      secondary: 'healthy',
      tertiary: 'blocked',
    },
    selectionReason: 'unsafe_write_capability_rejected',
    fallbackReasonCodes: ['unsafe_write_capability_blocked'],
    freshnessAction: 'use_fallback',
    staleReason: 'within_freshness_window',
    normalizedMissingFields: [],
    normalizedCaveats: ['unsafe write-capability path rejected by deterministic gate checks'],
  },
};

export function buildMultiProviderReadOnlyFoundationFixture(
  input: BuildMultiProviderReadOnlyFoundationFixtureInput,
): MultiProviderReadOnlyFoundationFixture {
  const scenario = SCENARIOS[input.fixtureName];
  const fixtureId = `phase66-fixture-${input.fixtureName}`;

  const entries = [
    buildProviderEntry({
      fixtureId,
      providerIdSuffix: 'primary',
      providerName: 'Primary deterministic provider',
      sourceAdapterFixtureName:
        input.fixtureName === 'unsafe-write-capability-rejected'
          ? 'unsupported-write-capability-rejected'
          : 'offline-account-info-success',
      sourceBoundaryFixtureName:
        input.fixtureName === 'unsafe-write-capability-rejected'
          ? 'unsafe-write-capability-boundary-rejected'
          : 'account-info-boundary-ready',
      sourceGateFixtureName:
        input.fixtureName === 'unsafe-write-capability-rejected'
          ? 'execution-capability-rejected-gate'
          : 'safe-synthetic-mock-accepted-gate',
      enabledByDefault: scenario.enabledProviders.includes('primary'),
    }),
    buildProviderEntry({
      fixtureId,
      providerIdSuffix: 'secondary',
      providerName: 'Secondary deterministic provider',
      sourceAdapterFixtureName: 'offline-mint-authority-success',
      sourceBoundaryFixtureName: 'mint-authority-boundary-ready',
      sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
      enabledByDefault: scenario.enabledProviders.includes('secondary'),
    }),
    buildProviderEntry({
      fixtureId,
      providerIdSuffix: 'tertiary',
      providerName: 'Tertiary deterministic provider',
      sourceAdapterFixtureName: 'offline-token-metadata-success',
      sourceBoundaryFixtureName: 'token-metadata-boundary-ready',
      sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
      enabledByDefault: scenario.enabledProviders.includes('tertiary'),
    }),
  ].slice(0, scenario.providerCount);

  const defaultProviderOrder = entries.map(entry => entry.providerId);
  const registry = buildMultiProviderRegistry({
    fixtureId,
    registryName: `phase66-registry-${input.fixtureName}`,
    providerEntries: entries,
    defaultProviderOrder,
  });

  const selectedProviderId =
    scenario.selectedProvider === 'none'
      ? 'none'
      : `${fixtureId}-${scenario.selectedProvider}`;

  const fallbackProviderIds = scenario.fallbackProviders
    .map(provider => `${fixtureId}-${provider}`)
    .filter(providerId => providerId !== selectedProviderId);

  const normalizedSourceProvider =
    selectedProviderId !== 'none' ? entries.find(entry => entry.providerId === selectedProviderId) ?? entries[0]! : entries[0]!;

  const normalizedProviderRecord = buildMultiProviderNormalizedRecord({
    fixtureId,
    providerId: normalizedSourceProvider.providerId,
    normalizedFields: [
      'accountAddress',
      'mintAddress',
      'tokenMetadataRef',
      'authorityRef',
      'providerStatus',
      'freshnessWindow',
    ],
    missingFields: scenario.normalizedMissingFields,
    semanticCaveats: scenario.normalizedCaveats,
    sourceFixtureRefs: {
      sourceAdapterFixtureName: normalizedSourceProvider.sourceAdapterFixtureName,
      sourceBoundaryFixtureName: normalizedSourceProvider.sourceBoundaryFixtureName,
      sourceGateFixtureName: normalizedSourceProvider.sourceGateFixtureName,
    },
  });

  const staleDataChecks = entries.map(entry => {
    const stale = scenario.staleProviders.includes(entry.providerId.split('-').at(-1) as 'primary' | 'secondary' | 'tertiary');
    return buildStaleDataCheck({
      fixtureId,
      providerId: entry.providerId,
      observedAt: stale ? STALE_OBSERVED_AT : DETERMINISTIC_OBSERVED_AT,
      freshnessWindow: 300000,
      stale,
      staleReason: stale ? scenario.staleReason : 'within_freshness_window',
    });
  });

  const healthScores = entries.map(entry => {
    const providerSuffix = entry.providerId.split('-').at(-1) as 'primary' | 'secondary' | 'tertiary';
    const stale = staleDataChecks.some(check => check.providerId === entry.providerId && check.stale);
    return buildProviderHealthScore({
      fixtureId,
      providerId: entry.providerId,
      status: scenario.healthStatusByProvider[providerSuffix],
      reasonCodes: stale ? ['stale_data_detected'] : ['deterministic_fixture_health'],
      staleDataImpact: stale ? 30 : 0,
      gateImpact:
        entry.sourceGateFixtureName === 'safe-synthetic-mock-accepted-gate' ? 0 : 30,
      conformanceImpact: scenario.healthStatusByProvider[providerSuffix] === 'rejected' ? 40 : 0,
    });
  });

  const freshnessPolicy = buildReadOnlyFreshnessPolicy({
    fixtureId,
    policyName: `phase66-freshness-${input.fixtureName}`,
    maxAgeMs: 300000,
    staleAction: scenario.freshnessAction,
  });

  const cachePolicy = buildReadOnlyCachePolicy({
    fixtureId,
    policyName: `phase66-cache-${input.fixtureName}`,
    deterministicTtlMs: 300000,
  });

  const providerSelection = buildProviderSelectionFixture({
    fixtureId,
    selectedProviderId,
    fallbackProviderIds,
    selectionReason: scenario.selectionReason,
  });

  const providerFallback = buildProviderFallbackFixture({
    fixtureId,
    primaryProviderId: `${fixtureId}-primary`,
    fallbackProviderIds,
    fallbackReasonCodes: scenario.fallbackReasonCodes,
  });

  const conformanceSummary = buildMultiProviderConformanceReport({
    fixtureId,
    providerRegistry: registry,
    noUnsafeCapabilities: true,
    phase65AdapterLinkageValid: entries.every(entry =>
      FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES.includes(entry.sourceAdapterFixtureName),
    ),
    phase64BoundaryLinkageValid: entries.every(entry =>
      READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES.includes(entry.sourceBoundaryFixtureName),
    ),
    phase63GateLinkageValid: entries.every(entry =>
      READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES.includes(entry.sourceGateFixtureName),
    ),
  });

  const deterministicSeed = stableDeterministicMultiProviderReadOnlyFoundationChecksum(
    `phase66-${input.fixtureName}`,
  );

  const base: Omit<MultiProviderReadOnlyFoundationFixture, 'report' | 'viewModel' | 'apiContract'> = {
    fixtureId,
    fixtureName: input.fixtureName,
    fixtureKind: scenario.fixtureKind,
    phase: MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE,
    schemaVersion: PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SCHEMA_VERSION,
    providerRegistry: registry,
    normalizedProviderRecord,
    providerHealthScores: healthScores,
    staleDataChecks,
    freshnessPolicy,
    cachePolicy,
    providerSelection,
    providerFallback,
    conformanceSummary,
    selectorExamples: [
      {
        selectorId: `${fixtureId}-selector`,
        selectedFixtureId: fixtureId,
        selectedFixtureKind: scenario.fixtureKind,
        selectedProviderId,
        matched: true,
        source: 'synthetic_fixture_only',
      },
    ],
    capabilityFlags: getMultiProviderReadOnlyFoundationCapabilities(),
    sourceAdapterFixtureSnapshot: FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
    sourceBoundaryFixtureSnapshot: READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
    sourceGateFixtureSnapshot: READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
    meta: {
      generatedAt: PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_GENERATED_AT,
      source: PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_SOURCE,
      version: PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_VERSION,
      phase: MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE,
      deterministicSeed,
    },
    safety: {
      fixtureOnly: true,
      localOnly: true,
      readOnly: true,
      failClosed: true,
      noLiveData: true,
      noNetworkAccessByDefault: true,
      nonAdvisory: true,
      notExecutable: true,
    },
  };

  const withViewModel = {
    ...base,
    viewModel: buildMultiProviderViewModel(base),
  };

  const withReport = {
    ...withViewModel,
    report: buildMultiProviderReadOnlyFoundationReport(withViewModel),
  };

  return {
    ...withReport,
    apiContract: buildMultiProviderApiContract(withReport),
  };
}
