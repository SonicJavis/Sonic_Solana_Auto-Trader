import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_KINDS,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURE_MAP,
  listMultiProviderReadOnlyFoundationFixtures,
  getMultiProviderReadOnlyFoundationFixture,
  buildMultiProviderReadOnlyFoundationFixture,
  buildMultiProviderRegistry,
  buildMultiProviderNormalizedRecord,
  buildProviderHealthScore,
  buildStaleDataCheck,
  buildReadOnlyFreshnessPolicy,
  buildReadOnlyCachePolicy,
  buildProviderSelectionFixture,
  buildProviderFallbackFixture,
  buildMultiProviderConformanceReport,
  buildMultiProviderReadOnlyFoundationReport,
  buildMultiProviderViewModel,
  buildMultiProviderApiContract,
  selectMultiProviderReadOnlyFoundationFixture,
  validateMultiProviderReadOnlyFoundationFixture,
  validateMultiProviderReadOnlyFoundationSafety,
  normalizeMultiProviderReadOnlyFoundationFixture,
  serializeMultiProviderReadOnlyFoundationFixture,
  areMultiProviderReadOnlyFoundationFixturesEqual,
  stableDeterministicMultiProviderReadOnlyFoundationChecksum,
  getMultiProviderReadOnlyFoundationCapabilities,
  PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_GENERATED_AT,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE as ROOT_PHASE,
  MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES as ROOT_FIXTURES,
} from '../apps/dashboard/src/index.js';
import {
  FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES,
} from '../apps/dashboard/src/first-read-only-provider-adapter/index.js';
import {
  READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES,
} from '../apps/dashboard/src/read-only-solana-provider-boundary/index.js';
import {
  READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES,
} from '../apps/dashboard/src/read-only-provider-adapter-gate/index.js';
import { getDashboardUiShellCapabilities } from '../apps/dashboard/src/capabilities.js';
import { getLocalReadOnlyApiCapabilities } from '../apps/read-only-api/src/capabilities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const PHASE_66_SRC = resolve(REPO_ROOT, 'apps/dashboard/src/multi-provider-read-only-foundation');
const PHASE_66_FILES = [
  'types.ts',
  'provider-registry.ts',
  'provider-normalization.ts',
  'provider-health.ts',
  'stale-data.ts',
  'freshness-policy.ts',
  'cache-policy.ts',
  'provider-selection.ts',
  'provider-fallback.ts',
  'conformance.ts',
  'builders.ts',
  'fixtures.ts',
  'reports.ts',
  'view-models.ts',
  'contracts.ts',
  'selectors.ts',
  'normalization.ts',
  'validation.ts',
  'capabilities.ts',
  'index.ts',
] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe('Phase 66 — source file existence', () => {
  for (const file of PHASE_66_FILES) {
    it(`${file} exists`, () => {
      const content = readFileSync(resolve(PHASE_66_SRC, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('docs/MULTI_PROVIDER_READ_ONLY_FOUNDATION.md exists', () => {
    const content = readFileSync(
      resolve(REPO_ROOT, 'docs/MULTI_PROVIDER_READ_ONLY_FOUNDATION.md'),
      'utf-8',
    );
    expect(content.length).toBeGreaterThan(0);
  });
});

describe('Phase 66 — constants, names, kinds, count, map, list', () => {
  it('constants and root exports align', () => {
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_PHASE).toBe(66);
    expect(ROOT_PHASE).toBe(66);
    expect(ROOT_FIXTURES).toEqual(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES);
    expect(PHASE_66_MULTI_PROVIDER_READ_ONLY_FOUNDATION_GENERATED_AT).toBe('2026-05-12T00:00:00.000Z');
  });

  it('has deterministic names/kinds and fixture count', () => {
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toHaveLength(8);
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_KINDS).toHaveLength(8);
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES).toHaveLength(8);
  });

  it('map/list/get helpers are deterministic', () => {
    expect(listMultiProviderReadOnlyFoundationFixtures()).toEqual(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES);
    for (const fixture of MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES) {
      expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURE_MAP.get(fixture.fixtureId)).toBe(fixture);
      expect(getMultiProviderReadOnlyFoundationFixture(fixture.fixtureId)).toBe(fixture);
    }
    expect(getMultiProviderReadOnlyFoundationFixture('missing')).toBeNull();
  });
});

describe('Phase 66 — fixture structure and linkage', () => {
  it('fixtures include required deterministic read-only surfaces', () => {
    for (const fixture of MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES) {
      expect(fixture.phase).toBe(66);
      expect(fixture.providerRegistry.gateRequired).toBe(true);
      expect(fixture.providerRegistry.boundaryRequired).toBe(true);
      expect(fixture.providerRegistry.adapterRequired).toBe(true);
      expect(fixture.providerRegistry.providerEntries.length).toBeGreaterThan(0);
      expect(fixture.freshnessPolicy.noLiveRefresh).toBe(true);
      expect(fixture.cachePolicy.fixtureOnly).toBe(true);
      expect(fixture.cachePolicy.persistentCache).toBe(false);
      expect(fixture.cachePolicy.filesystemCache).toBe(false);
      expect(fixture.cachePolicy.browserCache).toBe(false);
      expect(fixture.providerSelection.failClosed).toBe(true);
      expect(fixture.providerFallback.unsafeFallbackBlocked).toBe(true);
      expect(fixture.apiContract.errors).toHaveLength(2);
      expect(fixture.selectorExamples.length).toBeGreaterThan(0);
    }
  });

  it('fixtures link to Phase 65/64/63 fixture names', () => {
    for (const fixture of MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES) {
      for (const entry of fixture.providerRegistry.providerEntries) {
        expect(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES).toContain(entry.sourceAdapterFixtureName);
        expect(READ_ONLY_SOLANA_PROVIDER_BOUNDARY_NAMES).toContain(entry.sourceBoundaryFixtureName);
        expect(READ_ONLY_PROVIDER_ADAPTER_GATE_NAMES).toContain(entry.sourceGateFixtureName);
      }
    }
  });

  it('required fixture scenarios are present', () => {
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain('single-provider-healthy');
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain('multi-provider-healthy');
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain('stale-primary-provider');
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain('fallback-to-secondary');
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain('all-providers-stale-fail-closed');
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain('disabled-provider-blocked');
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain('capability-mismatch-rejected');
    expect(MULTI_PROVIDER_READ_ONLY_FOUNDATION_NAMES).toContain('unsafe-write-capability-rejected');
  });
});

describe('Phase 66 — helper builders', () => {
  it('fixture builder is deterministic', () => {
    const a = buildMultiProviderReadOnlyFoundationFixture({ fixtureName: 'fallback-to-secondary' });
    const b = buildMultiProviderReadOnlyFoundationFixture({ fixtureName: 'fallback-to-secondary' });
    expect(a).toEqual(b);
  });

  it('individual model builders produce deterministic read-only structures', () => {
    const registry = buildMultiProviderRegistry({
      fixtureId: 'phase66-fixture-sample',
      registryName: 'sample-registry',
      providerEntries: [
        {
          providerId: 'phase66-fixture-sample-primary',
          providerName: 'sample',
          providerKind: 'first_read_only_provider_adapter_fixture',
          sourceAdapterFixtureName: 'offline-account-info-success',
          sourceBoundaryFixtureName: 'account-info-boundary-ready',
          sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
          readOnly: true,
          enabledByDefault: true,
          liveDataDefault: false,
          networkAccessDefault: false,
          capabilityFlags: {
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
          },
        },
      ],
      defaultProviderOrder: ['phase66-fixture-sample-primary'],
    });

    const normalized = buildMultiProviderNormalizedRecord({
      fixtureId: 'phase66-fixture-sample',
      providerId: 'phase66-fixture-sample-primary',
      normalizedFields: ['accountAddress'],
      missingFields: [],
      semanticCaveats: ['deterministic fixture only'],
      sourceFixtureRefs: {
        sourceAdapterFixtureName: 'offline-account-info-success',
        sourceBoundaryFixtureName: 'account-info-boundary-ready',
        sourceGateFixtureName: 'safe-synthetic-mock-accepted-gate',
      },
    });

    const health = buildProviderHealthScore({
      fixtureId: 'phase66-fixture-sample',
      providerId: 'phase66-fixture-sample-primary',
      status: 'healthy',
      reasonCodes: ['deterministic_fixture_health'],
      staleDataImpact: 0,
      gateImpact: 0,
      conformanceImpact: 0,
    });

    const stale = buildStaleDataCheck({
      fixtureId: 'phase66-fixture-sample',
      providerId: 'phase66-fixture-sample-primary',
      observedAt: '2026-05-12T00:00:00.000Z',
      freshnessWindow: 300000,
      stale: false,
      staleReason: 'within_freshness_window',
    });

    expect(registry.disabledProviderEntries).toEqual([]);
    expect(normalized.normalizedFields).toEqual(['accountAddress']);
    expect(health.score).toBe(100);
    expect(stale.deterministicOnly).toBe(true);

    const fixture = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[0]!;
    const viewModel = buildMultiProviderViewModel(fixture);
    const contracts = buildMultiProviderApiContract({ ...fixture, viewModel });
    const report = buildMultiProviderReadOnlyFoundationReport({ ...fixture, viewModel });
    const selection = buildProviderSelectionFixture({
      fixtureId: 'phase66-fixture-sample',
      selectedProviderId: 'phase66-fixture-sample-primary',
      fallbackProviderIds: [],
      selectionReason: 'deterministic_priority_order',
    });
    const fallback = buildProviderFallbackFixture({
      fixtureId: 'phase66-fixture-sample',
      primaryProviderId: 'phase66-fixture-sample-primary',
      fallbackProviderIds: [],
      fallbackReasonCodes: ['none'],
    });
    const freshness = buildReadOnlyFreshnessPolicy({
      fixtureId: 'phase66-fixture-sample',
      policyName: 'sample-freshness',
      maxAgeMs: 300000,
      staleAction: 'use_fallback',
    });
    const cache = buildReadOnlyCachePolicy({
      fixtureId: 'phase66-fixture-sample',
      policyName: 'sample-cache',
      deterministicTtlMs: 300000,
    });
    const conformance = buildMultiProviderConformanceReport({
      fixtureId: 'phase66-fixture-sample',
      providerRegistry: registry,
      noUnsafeCapabilities: true,
      phase65AdapterLinkageValid: true,
      phase64BoundaryLinkageValid: true,
      phase63GateLinkageValid: true,
    });

    expect(contracts.list.contractKind).toBe('list');
    expect(report.safetySummary.toLowerCase()).toContain('read-only');
    expect(selection.noLiveCall).toBe(true);
    expect(fallback.unsafeFallbackBlocked).toBe(true);
    expect(freshness.noLiveRefresh).toBe(true);
    expect(cache.browserCache).toBe(false);
    expect(conformance.registryOrderValid).toBe(true);
  });
});

describe('Phase 66 — selectors, normalization, serialization, equality', () => {
  it('selectors return deterministic local-only results', () => {
    const fixture = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[0]!;
    const selected = selectMultiProviderReadOnlyFoundationFixture({ fixtureId: fixture.fixtureId });
    expect(selected.matched).toBe(true);
    expect(selected.selectedFixtureId).toBe(fixture.fixtureId);

    const unmatched = selectMultiProviderReadOnlyFoundationFixture({ fixtureId: 'missing' });
    expect(unmatched.matched).toBe(false);
  });

  it('normalization and serialization are stable', () => {
    const base = clone(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[1]!);
    const scrambled = {
      ...clone(base),
      staleDataChecks: [...base.staleDataChecks].reverse(),
      providerHealthScores: [...base.providerHealthScores].reverse(),
      providerRegistry: {
        ...base.providerRegistry,
        providerEntries: [...base.providerRegistry.providerEntries].reverse(),
        defaultProviderOrder: [...base.providerRegistry.defaultProviderOrder].reverse(),
      },
    };

    expect(normalizeMultiProviderReadOnlyFoundationFixture(scrambled)).toEqual(
      normalizeMultiProviderReadOnlyFoundationFixture(base),
    );
    expect(serializeMultiProviderReadOnlyFoundationFixture(scrambled)).toBe(
      serializeMultiProviderReadOnlyFoundationFixture(base),
    );
    expect(areMultiProviderReadOnlyFoundationFixturesEqual(scrambled, base)).toBe(true);
  });

  it('checksum helper is stable', () => {
    const checksum = stableDeterministicMultiProviderReadOnlyFoundationChecksum('phase66-check');
    expect(checksum).toMatch(/^fnv1a32:[0-9a-f]{8}$/);
    expect(stableDeterministicMultiProviderReadOnlyFoundationChecksum('phase66-check')).toBe(checksum);
  });
});

describe('Phase 66 — validation and safety rejection paths', () => {
  it('validation and safety pass for baseline fixtures', () => {
    for (const fixture of MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES) {
      const validation = validateMultiProviderReadOnlyFoundationFixture(fixture);
      if (!validation.valid) {
        throw new Error(`${fixture.fixtureName}: ${JSON.stringify(validation.issues)}`);
      }
      expect(validation.valid).toBe(true);
      expect(validateMultiProviderReadOnlyFoundationSafety(fixture)).toEqual({ safe: true, violations: [] });
    }
  });

  it('validation rejects persistent/filesystem/browser cache enablement', () => {
    const fixture = clone(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[0]!);
    fixture.cachePolicy.persistentCache = true as never;
    fixture.cachePolicy.filesystemCache = true as never;
    fixture.cachePolicy.browserCache = true as never;
    const validation = validateMultiProviderReadOnlyFoundationFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_CACHE_POLICY')).toBe(true);
  });

  it('validation rejects unsafe fallback and gate bypass selection', () => {
    const fixture = clone(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[1]!);
    fixture.providerRegistry.providerEntries[1]!.sourceGateFixtureName =
      'execution-capability-rejected-gate' as never;
    fixture.providerFallback.fallbackProviderIds = [fixture.providerRegistry.providerEntries[1]!.providerId] as never;
    fixture.providerSelection.selectedProviderId = fixture.providerRegistry.providerEntries[1]!.providerId as never;

    const validation = validateMultiProviderReadOnlyFoundationFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_FALLBACK_PROVIDER')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'SELECTION_BYPASSES_GATE')).toBe(true);
  });

  it('validation rejects advisory language and unsafe source references', () => {
    const fixture = clone(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[0]!);
    fixture.report.selectionSummary = 'buy signal with guaranteed profit' as never;
    fixture.providerRegistry.providerEntries[0]!.sourceAdapterFixtureName =
      'offline-account-info-success-apiKey' as never;

    const validation = validateMultiProviderReadOnlyFoundationFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_EXECUTION_REFERENCE')).toBe(true);
    expect(validation.issues.some(issue => issue.code === 'INVALID_SOURCE_ADAPTER_REF')).toBe(true);
  });

  it('validation rejects unsafe write-capability enablement', () => {
    const fixture = clone(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[0]!);
    fixture.providerRegistry.providerEntries[0]!.capabilityFlags.writeMethods = true as never;
    fixture.providerRegistry.providerEntries[0]!.capabilityFlags.execution = true as never;
    const validation = validateMultiProviderReadOnlyFoundationFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'UNSAFE_ENABLED_PROVIDER')).toBe(true);
  });

  it('validation rejects dynamic timestamp values', () => {
    const fixture = clone(MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[0]!);
    fixture.staleDataChecks[0]!.observedAt = '2027-01-01T00:00:00.000Z' as never;
    const validation = validateMultiProviderReadOnlyFoundationFixture(fixture);
    expect(validation.valid).toBe(false);
    expect(validation.issues.some(issue => issue.code === 'DYNAMIC_TIMESTAMP_FORBIDDEN')).toBe(true);
  });
});

describe('Phase 66 — fixture scenarios and policy behavior', () => {
  it('includes stale primary and fallback fixture behavior', () => {
    const stalePrimary = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'stale-primary-provider',
    );
    expect(stalePrimary?.staleDataChecks.some(check => check.providerId.endsWith('-primary') && check.stale)).toBe(
      true,
    );

    const fallback = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'fallback-to-secondary',
    );
    expect(fallback?.providerSelection.selectedProviderId.endsWith('-secondary')).toBe(true);
  });

  it('includes all-stale fail-closed and disabled provider blocked fixtures', () => {
    const allStale = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'all-providers-stale-fail-closed',
    );
    expect(allStale?.providerSelection.selectedProviderId).toBe('none');
    expect(allStale?.providerSelection.selectionReason).toContain('fail_closed');

    const disabled = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'disabled-provider-blocked',
    );
    expect(disabled?.providerRegistry.disabledProviderEntries.length).toBeGreaterThan(0);
  });

  it('includes capability mismatch and unsafe write-capability rejection fixtures', () => {
    const mismatch = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'capability-mismatch-rejected',
    );
    expect(mismatch?.providerHealthScores.some(score => score.status === 'rejected')).toBe(true);

    const unsafeWrite = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES.find(
      fixture => fixture.fixtureName === 'unsafe-write-capability-rejected',
    );
    expect(unsafeWrite?.providerRegistry.providerEntries[0]?.sourceGateFixtureName).toBe(
      'execution-capability-rejected-gate',
    );
  });
});

describe('Phase 66 — capabilities and propagation', () => {
  it('module capability flags are correct', () => {
    const caps = getMultiProviderReadOnlyFoundationCapabilities();
    expect(caps.multiProviderReadOnlyFoundation).toBe(true);
    expect(caps.multiProviderReadOnlyRegistry).toBe(true);
    expect(caps.multiProviderLiveDataDefault).toBe(false);
    expect(caps.multiProviderNetworkAccessDefault).toBe(false);
    expect(caps.multiProviderExecution).toBe(false);
  });

  it('dashboard and read-only-api capabilities include phase 66 flags', () => {
    const dashboardCaps = getDashboardUiShellCapabilities() as Record<string, unknown>;
    expect(dashboardCaps['multiProviderReadOnlyFoundation']).toBe(true);
    expect(dashboardCaps['multiProviderReadOnlyRegistry']).toBe(true);
    expect(dashboardCaps['multiProviderExecution']).toBe(false);

    const apiCaps = getLocalReadOnlyApiCapabilities() as Record<string, unknown>;
    expect(apiCaps['multiProviderReadOnlyFoundation']).toBe(true);
    expect(apiCaps['multiProviderReadOnlyRegistry']).toBe(true);
    expect(apiCaps['multiProviderExecution']).toBe(false);
  });
});

describe('Phase 66 — safety scan and policy alignment', () => {
  it('phase files avoid nondeterministic/runtime primitives', () => {
    for (const file of PHASE_66_FILES) {
      const content = readFileSync(resolve(PHASE_66_SRC, file), 'utf-8');
      expect(content).not.toMatch(/Date\.now\(/);
      expect(content).not.toMatch(/new Date\(/);
      expect(content).not.toMatch(/Math\.random\(/);
      expect(content).not.toMatch(/randomUUID\(/);
      expect(content).not.toMatch(/process\.env/);
      expect(content).not.toMatch(/setInterval\(/);
      expect(content).not.toMatch(/setTimeout\(/);
      if (file !== 'validation.ts') {
        expect(content).not.toMatch(/fetch\(/);
        expect(content).not.toMatch(/writeFile\(/);
        expect(content).not.toMatch(/createWriteStream\(/);
        expect(content).not.toMatch(/document\./);
        expect(content).not.toMatch(/window\./);
        expect(content).not.toMatch(/localStorage\./);
        expect(content).not.toMatch(/indexedDB\./);
        expect(content).not.toMatch(/listen\(/);
      }
    }
  });

  it('source immutability holds when clone is mutated', () => {
    const source = MULTI_PROVIDER_READ_ONLY_FOUNDATION_FIXTURES[0]!;
    const copy = clone(source);
    copy.sourceAdapterFixtureSnapshot = ['offline-account-info-success'] as never;
    expect(source.sourceAdapterFixtureSnapshot).toEqual(FIRST_READ_ONLY_PROVIDER_ADAPTER_NAMES);
  });

  it('Phase 67 is preview only in docs', () => {
    const docs = readFileSync(resolve(REPO_ROOT, 'docs/MULTI_PROVIDER_READ_ONLY_FOUNDATION.md'), 'utf-8');
    expect(docs).toContain('Phase 67 — Cross-Provider Data Quality and Reconciliation v1');
    expect(docs.toLowerCase()).toContain('preview only');
  });
});
