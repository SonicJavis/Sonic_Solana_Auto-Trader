/**
 * tests/phase24.test.ts
 *
 * Phase 24 — Local Read-Only Dashboard Data Adapter and View Models v1
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  HEALTH_SUCCESS_FIXTURE,
  CAPABILITIES_SUCCESS_FIXTURE,
  DASHBOARD_SUCCESS_FIXTURE,
  DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
  DASHBOARD_SAFETY_SUCCESS_FIXTURE,
  INVALID_QUERY_ERROR_FIXTURE,
  INVALID_QUERY_EVIDENCE_ERROR_FIXTURE,
  UNSUPPORTED_ENDPOINT_ERROR_FIXTURE,
  listReadOnlyApiContractFixtures,
} from '@sonic/read-only-api-client';

import {
  DASHBOARD_ADAPTER_ERROR_CODES,
  adaptReadOnlyApiEnvelopeToViewModel,
  buildCapabilitiesViewModel,
  buildDashboardEmptyViewModel,
  buildDashboardErrorViewModel,
  buildDashboardLoadingViewModel,
  buildDashboardOverviewViewModel,
  buildDashboardViewModel,
  buildEvidenceViewModel,
  buildHealthViewModel,
  buildSafetyViewModel,
  isStatusError,
  validateDashboardViewModel,
} from '@sonic/dashboard-view-models';

import { PHASE_22_GENERATED_AT, getLocalReadOnlyApiCapabilities } from '@sonic/read-only-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DASHBOARD_VM_SRC = resolve(__dirname, '../packages/dashboard-view-models/src');

const ENDPOINT_FIXTURES = [
  { endpoint: '/health', envelope: HEALTH_SUCCESS_FIXTURE },
  { endpoint: '/capabilities', envelope: CAPABILITIES_SUCCESS_FIXTURE },
  { endpoint: '/dashboard', envelope: DASHBOARD_SUCCESS_FIXTURE },
  { endpoint: '/dashboard/evidence', envelope: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE },
  { endpoint: '/dashboard/safety', envelope: DASHBOARD_SAFETY_SUCCESS_FIXTURE },
] as const;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// ─── 1. Package exports ───────────────────────────────────────────────────────

describe('Phase 24 — Package exports', () => {
  it('exports adaptReadOnlyApiEnvelopeToViewModel', () => {
    expect(typeof adaptReadOnlyApiEnvelopeToViewModel).toBe('function');
  });
  it('exports buildDashboardViewModel', () => {
    expect(typeof buildDashboardViewModel).toBe('function');
  });
  it('exports buildHealthViewModel', () => {
    expect(typeof buildHealthViewModel).toBe('function');
  });
  it('exports buildCapabilitiesViewModel', () => {
    expect(typeof buildCapabilitiesViewModel).toBe('function');
  });
  it('exports buildDashboardOverviewViewModel', () => {
    expect(typeof buildDashboardOverviewViewModel).toBe('function');
  });
  it('exports buildEvidenceViewModel', () => {
    expect(typeof buildEvidenceViewModel).toBe('function');
  });
  it('exports buildSafetyViewModel', () => {
    expect(typeof buildSafetyViewModel).toBe('function');
  });
  it('exports buildDashboardErrorViewModel', () => {
    expect(typeof buildDashboardErrorViewModel).toBe('function');
  });
  it('exports buildDashboardEmptyViewModel', () => {
    expect(typeof buildDashboardEmptyViewModel).toBe('function');
  });
  it('exports buildDashboardLoadingViewModel', () => {
    expect(typeof buildDashboardLoadingViewModel).toBe('function');
  });
  it('exports validateDashboardViewModel', () => {
    expect(typeof validateDashboardViewModel).toBe('function');
  });
  it('exports isStatusError', () => {
    expect(typeof isStatusError).toBe('function');
  });
  it('exports DASHBOARD_ADAPTER_ERROR_CODES', () => {
    expect(typeof DASHBOARD_ADAPTER_ERROR_CODES).toBe('object');
  });
});

// ─── 2. Success fixture adapters ──────────────────────────────────────────────

describe('Phase 24 — Success fixture adapters', () => {
  it('health fixture maps to health view model', () => {
    const vm = buildHealthViewModel({ envelope: HEALTH_SUCCESS_FIXTURE, endpoint: '/health', method: 'GET' });
    expect(vm.endpoint).toBe('/health');
    expect(vm.method).toBe('GET');
    expect(vm.status).toBe('ready');
    expect(vm.meta.phase).toBe(22);
  });

  it('capabilities fixture maps to capabilities view model', () => {
    const vm = buildCapabilitiesViewModel({ envelope: CAPABILITIES_SUCCESS_FIXTURE, endpoint: '/capabilities', method: 'GET' });
    expect(vm.endpoint).toBe('/capabilities');
    expect(vm.status).toBe('ready');
    expect(vm.capabilities['canUseLiveData']).toBe(false);
  });

  it('dashboard fixture maps to overview view model', () => {
    const vm = buildDashboardOverviewViewModel({ envelope: DASHBOARD_SUCCESS_FIXTURE, endpoint: '/dashboard', method: 'GET' });
    expect(vm.endpoint).toBe('/dashboard');
    expect(vm.status).toBe('ready');
    expect(vm.totalFindings).toBeGreaterThanOrEqual(0);
  });

  it('dashboard evidence fixture maps to evidence view model', () => {
    const vm = buildEvidenceViewModel({ envelope: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE, endpoint: '/dashboard/evidence', method: 'GET' });
    expect(vm.endpoint).toBe('/dashboard/evidence');
    expect(vm.totalEntries).toBeGreaterThanOrEqual(0);
    expect(['ready', 'empty']).toContain(vm.status);
  });

  it('dashboard safety fixture maps to safety view model', () => {
    const vm = buildSafetyViewModel({ envelope: DASHBOARD_SAFETY_SUCCESS_FIXTURE, endpoint: '/dashboard/safety', method: 'GET' });
    expect(vm.endpoint).toBe('/dashboard/safety');
    expect(vm.method).toBe('GET');
    expect(['ready', 'unavailable']).toContain(vm.status);
  });

  it('combined dashboard view model builds from all success fixtures', () => {
    const vm = buildDashboardViewModel({
      health: HEALTH_SUCCESS_FIXTURE,
      capabilities: CAPABILITIES_SUCCESS_FIXTURE,
      dashboard: DASHBOARD_SUCCESS_FIXTURE,
      evidence: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
      safety: DASHBOARD_SAFETY_SUCCESS_FIXTURE,
    });

    expect(vm.health.endpoint).toBe('/health');
    expect(vm.capabilities.endpoint).toBe('/capabilities');
    expect(vm.overview.endpoint).toBe('/dashboard');
    expect(vm.evidence.endpoint).toBe('/dashboard/evidence');
    expect(vm.safety.endpoint).toBe('/dashboard/safety');
    expect(vm.summary.totalPanels).toBe(3);
  });
});

// ─── 3. Error/empty/loading/malformed handling ────────────────────────────────

describe('Phase 24 — Error/empty/loading/malformed handling', () => {
  it('error envelope maps to safe error view model', () => {
    const result = adaptReadOnlyApiEnvelopeToViewModel({
      envelope: INVALID_QUERY_ERROR_FIXTURE,
      endpoint: '/dashboard',
      method: 'GET',
    });
    expect(result.status).toBe('error');
    expect(result.viewModel.status).toBe('error');
  });

  it('evidence invalid query envelope maps to safe error view model', () => {
    const result = adaptReadOnlyApiEnvelopeToViewModel({
      envelope: INVALID_QUERY_EVIDENCE_ERROR_FIXTURE,
      endpoint: '/dashboard/evidence',
      method: 'GET',
    });
    expect(result.status).toBe('error');
    expect(result.endpoint).toBe('/dashboard/evidence');
  });

  it('malformed input maps to deterministic adapter error', () => {
    const result = adaptReadOnlyApiEnvelopeToViewModel({
      envelope: { ok: 'not-boolean' },
      endpoint: '/dashboard',
      method: 'GET',
    });
    expect(result.status).toBe('error');
    expect(result.viewModel.status).toBe('error');
    expect(result.viewModel.code).toBe('DASHBOARD_ADAPTER_ERROR');
  });

  it('null input maps to safe error model', () => {
    const result = adaptReadOnlyApiEnvelopeToViewModel({
      envelope: null,
      endpoint: '/health',
      method: 'GET',
    });
    expect(result.status).toBe('error');
    expect(result.viewModel.status).toBe('error');
  });

  it('undefined input maps to safe error model', () => {
    const result = adaptReadOnlyApiEnvelopeToViewModel({
      envelope: undefined,
      endpoint: '/capabilities',
      method: 'GET',
    });
    expect(result.status).toBe('error');
    expect(result.viewModel.status).toBe('error');
  });

  it('unsupported endpoint maps to unavailable by default', () => {
    const result = adaptReadOnlyApiEnvelopeToViewModel({
      envelope: UNSUPPORTED_ENDPOINT_ERROR_FIXTURE,
      endpoint: '/not-found',
      method: 'GET',
    });
    expect(result.status).toBe('unavailable');
    expect(result.viewModel.status).toBe('error');
    expect(result.viewModel.code).toBe('DASHBOARD_UNSUPPORTED_ENDPOINT');
  });

  it('unsupported endpoint maps to loading state when configured', () => {
    const result = adaptReadOnlyApiEnvelopeToViewModel({
      envelope: UNSUPPORTED_ENDPOINT_ERROR_FIXTURE,
      endpoint: '/future-panel',
      method: 'GET',
      options: { unsupportedEndpointStatus: 'loading', loadingMessage: 'Waiting for fixture.' },
    });
    expect(result.status).toBe('loading');
    expect(result.viewModel.status).toBe('loading');
    expect(result.viewModel.code).toBe('DASHBOARD_LOADING');
  });

  it('empty evidence state is deterministic', () => {
    const envelope = clone(DASHBOARD_EVIDENCE_SUCCESS_FIXTURE) as Record<string, unknown>;
    const data = envelope['data'] as Record<string, unknown>;
    data['entries'] = [];
    const vm = buildEvidenceViewModel({ envelope, endpoint: '/dashboard/evidence', method: 'GET' });
    expect(vm.status).toBe('empty');
    expect(vm.emptyState?.status).toBe('empty');
    expect(vm.emptyState?.code).toBe('DASHBOARD_EMPTY');
  });

  it('buildDashboardLoadingViewModel returns loading status', () => {
    const vm = buildDashboardLoadingViewModel();
    expect(vm.status).toBe('loading');
    expect(vm.code).toBe('DASHBOARD_LOADING');
  });

  it('buildDashboardEmptyViewModel returns empty status', () => {
    const vm = buildDashboardEmptyViewModel('No entries');
    expect(vm.status).toBe('empty');
    expect(vm.code).toBe('DASHBOARD_EMPTY');
  });

  it('buildDashboardErrorViewModel returns error status', () => {
    const vm = buildDashboardErrorViewModel({
      code: 'DASHBOARD_ADAPTER_ERROR',
      message: 'safe',
      endpoint: '/dashboard',
      method: 'GET',
    });
    expect(vm.status).toBe('error');
    expect(vm.method).toBe('GET');
  });
});

// ─── 4. Metadata and determinism preservation ─────────────────────────────────

describe('Phase 24 — Metadata and determinism preservation', () => {
  ENDPOINT_FIXTURES.forEach(({ endpoint, envelope }) => {
    const result = adaptReadOnlyApiEnvelopeToViewModel({ envelope, endpoint, method: 'GET' });

    it(`${endpoint} keeps method GET`, () => {
      expect(result.method).toBe('GET');
    });

    it(`${endpoint} keeps endpoint string`, () => {
      expect(result.endpoint).toBe(endpoint);
    });

    it(`${endpoint} preserves generatedAt`, () => {
      const vm = result.viewModel as { meta?: { generatedAt?: string } };
      expect(vm.meta?.generatedAt).toBe(PHASE_22_GENERATED_AT);
    });

    it(`${endpoint} preserves phase 22`, () => {
      const vm = result.viewModel as { meta?: { phase?: number } };
      expect(vm.meta?.phase).toBe(22);
    });

    it(`${endpoint} preserves deterministic=true`, () => {
      const vm = result.viewModel as { meta?: { deterministic?: boolean } };
      expect(vm.meta?.deterministic).toBe(true);
    });

    it(`${endpoint} preserves fixtureOnly=true`, () => {
      const vm = result.viewModel as { meta?: { fixtureOnly?: boolean } };
      expect(vm.meta?.fixtureOnly).toBe(true);
    });

    it(`${endpoint} preserves mutating=false`, () => {
      const vm = result.viewModel as { meta?: { mutating?: boolean } };
      expect(vm.meta?.mutating).toBe(false);
    });

    it(`${endpoint} preserves externalNetwork=false`, () => {
      const vm = result.viewModel as { meta?: { externalNetwork?: boolean } };
      expect(vm.meta?.externalNetwork).toBe(false);
    });

    it(`${endpoint} preserves localOnly=true`, () => {
      const vm = result.viewModel as { meta?: { localOnly?: boolean } };
      expect(vm.meta?.localOnly).toBe(true);
    });

    it(`${endpoint} preserves analysisOnly=true`, () => {
      const vm = result.viewModel as { meta?: { analysisOnly?: boolean } };
      expect(vm.meta?.analysisOnly).toBe(true);
    });
  });

  it('dashboard query metadata is preserved', () => {
    const vm = buildDashboardOverviewViewModel({ envelope: DASHBOARD_SUCCESS_FIXTURE, endpoint: '/dashboard', method: 'GET' });
    expect(typeof vm.meta.query).toBe('object');
  });

  it('evidence filter metadata is preserved', () => {
    const vm = buildEvidenceViewModel({ envelope: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE, endpoint: '/dashboard/evidence', method: 'GET' });
    expect(typeof vm.meta.filters).toBe('object');
  });

  it('evidence sort metadata is preserved', () => {
    const vm = buildEvidenceViewModel({ envelope: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE, endpoint: '/dashboard/evidence', method: 'GET' });
    expect(typeof vm.meta.sort).toBe('object');
  });

  it('evidence pagination metadata is preserved', () => {
    const vm = buildEvidenceViewModel({ envelope: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE, endpoint: '/dashboard/evidence', method: 'GET' });
    expect(typeof vm.meta.pagination).toBe('object');
  });
});

// ─── 5. No input mutation and stable output ────────────────────────────────────

describe('Phase 24 — No input mutation and stable output', () => {
  ENDPOINT_FIXTURES.forEach(({ endpoint, envelope }) => {
    it(`${endpoint} does not mutate input envelope`, () => {
      const input = clone(envelope);
      const before = JSON.stringify(input);
      adaptReadOnlyApiEnvelopeToViewModel({ envelope: input, endpoint, method: 'GET' });
      const after = JSON.stringify(input);
      expect(after).toBe(before);
    });

    it(`${endpoint} adapter output is deterministic`, () => {
      const r1 = adaptReadOnlyApiEnvelopeToViewModel({ envelope, endpoint, method: 'GET' });
      const r2 = adaptReadOnlyApiEnvelopeToViewModel({ envelope, endpoint, method: 'GET' });
      expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
    });
  });

  it('combined dashboard view model output is deterministic', () => {
    const i = {
      health: HEALTH_SUCCESS_FIXTURE,
      capabilities: CAPABILITIES_SUCCESS_FIXTURE,
      dashboard: DASHBOARD_SUCCESS_FIXTURE,
      evidence: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
      safety: DASHBOARD_SAFETY_SUCCESS_FIXTURE,
    };
    const r1 = buildDashboardViewModel(i);
    const r2 = buildDashboardViewModel(i);
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });

  it('validation passes for a full dashboard view model', () => {
    const vm = buildDashboardViewModel({
      health: HEALTH_SUCCESS_FIXTURE,
      capabilities: CAPABILITIES_SUCCESS_FIXTURE,
      dashboard: DASHBOARD_SUCCESS_FIXTURE,
      evidence: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE,
      safety: DASHBOARD_SAFETY_SUCCESS_FIXTURE,
    });
    expect(validateDashboardViewModel(vm)).toEqual([]);
  });

  it('validation fails for invalid status', () => {
    const errors = validateDashboardViewModel({ status: 'bad_status' });
    expect(errors.some(e => e.includes('status'))).toBe(true);
  });
});

// ─── 6. Sanitization / safety boundaries ───────────────────────────────────────

describe('Phase 24 — Sanitization and safety boundaries', () => {
  const forbiddenJsonTerms = [
    'Error\\n',
    '/home/runner',
    '/Users/',
    'C:\\\\Users\\\\',
    'private_key',
    'seed_phrase',
    'mnemonic',
    'apikey',
  ];

  const models = [
    buildHealthViewModel({ envelope: HEALTH_SUCCESS_FIXTURE, endpoint: '/health', method: 'GET' }),
    buildCapabilitiesViewModel({ envelope: CAPABILITIES_SUCCESS_FIXTURE, endpoint: '/capabilities', method: 'GET' }),
    buildDashboardOverviewViewModel({ envelope: DASHBOARD_SUCCESS_FIXTURE, endpoint: '/dashboard', method: 'GET' }),
    buildEvidenceViewModel({ envelope: DASHBOARD_EVIDENCE_SUCCESS_FIXTURE, endpoint: '/dashboard/evidence', method: 'GET' }),
    buildSafetyViewModel({ envelope: DASHBOARD_SAFETY_SUCCESS_FIXTURE, endpoint: '/dashboard/safety', method: 'GET' }),
  ];

  forbiddenJsonTerms.forEach(term => {
    models.forEach((model, index) => {
      it(`model_${index} does not contain forbidden term: ${term}`, () => {
        expect(JSON.stringify(model).toLowerCase()).not.toContain(term.toLowerCase());
      });
    });
  });

  it('adapter error sanitizes stack-like message patterns', () => {
    const envelope = clone(INVALID_QUERY_ERROR_FIXTURE) as Record<string, unknown>;
    const error = (envelope['error'] ?? {}) as Record<string, unknown>;
    error['message'] = 'at Object.fn (/home/runner/test.ts:10:1)';
    envelope['error'] = error;

    const result = adaptReadOnlyApiEnvelopeToViewModel({
      envelope,
      endpoint: '/dashboard',
      method: 'GET',
    });

    expect(result.viewModel.status).toBe('error');
    expect(result.viewModel.message).toBe('A sanitized dashboard adapter error occurred.');
  });

  it('validateDashboardViewModel catches local paths', () => {
    const errors = validateDashboardViewModel({ status: 'ready', payload: '/home/runner/private' });
    expect(errors).toContain('view model must not contain local filesystem paths');
  });

  it('validateDashboardViewModel catches secret patterns', () => {
    const errors = validateDashboardViewModel({ status: 'ready', token: 'private_key=abc' });
    expect(errors).toContain('view model must not contain secrets');
  });

  it('validateDashboardViewModel catches stack trace patterns', () => {
    const errors = validateDashboardViewModel({ status: 'ready', stack: 'at Object.run (x.ts:1:1)' });
    expect(errors).toContain('view model must not contain stack traces');
  });

  it('isStatusError detects error', () => {
    expect(isStatusError('error')).toBe(true);
  });

  it('isStatusError is false for ready', () => {
    expect(isStatusError('ready')).toBe(false);
  });
});

// ─── 7. Capabilities and compatibility regressions ─────────────────────────────

describe('Phase 24 — Capabilities and compatibility regressions', () => {
  it('Phase 24 capability flag dashboardDataAdapter is true', () => {
    expect(getLocalReadOnlyApiCapabilities().dashboardDataAdapter).toBe(true);
  });
  it('Phase 24 capability flag dashboardViewModels is true', () => {
    expect(getLocalReadOnlyApiCapabilities().dashboardViewModels).toBe(true);
  });
  it('Phase 24 capability flag fixtureBackedViewModels is true', () => {
    expect(getLocalReadOnlyApiCapabilities().fixtureBackedViewModels).toBe(true);
  });
  it('Phase 24 capability flag uiReadyDataShapes is true', () => {
    expect(getLocalReadOnlyApiCapabilities().uiReadyDataShapes).toBe(true);
  });
  it('Phase 24 capability flag pureViewModelTransforms is true', () => {
    expect(getLocalReadOnlyApiCapabilities().pureViewModelTransforms).toBe(true);
  });
  it('Phase 24 capability flag dashboardUi is false', () => {
    expect(getLocalReadOnlyApiCapabilities().dashboardUi).toBe(false);
  });
  it('Phase 24 capability flag externalDashboardData is false', () => {
    expect(getLocalReadOnlyApiCapabilities().externalDashboardData).toBe(false);
  });

  it('Phase 22 compatibility: envelopes still parse', () => {
    for (const fixture of listReadOnlyApiContractFixtures()) {
      const adapted = adaptReadOnlyApiEnvelopeToViewModel({
        envelope: fixture.envelope,
        endpoint: fixture.endpoint,
        method: 'GET',
      });
      expect(typeof adapted.status).toBe('string');
    }
  });
});

// ─── 8. Runtime source safety checks ───────────────────────────────────────────

describe('Phase 24 — Runtime source safety checks', () => {
  const runtimeFiles = [
    resolve(DASHBOARD_VM_SRC, 'adapter.ts'),
    resolve(DASHBOARD_VM_SRC, 'types.ts'),
    resolve(DASHBOARD_VM_SRC, 'view-models.ts'),
    resolve(DASHBOARD_VM_SRC, 'index.ts'),
    resolve(DASHBOARD_VM_SRC, 'errors.ts'),
  ];

  const forbiddenRuntimeTerms = [
    'fetch(',
    'axios',
    'websocket',
    'signTransaction',
    'sendTransaction',
    'keypair',
    'private key',
    'seed phrase',
    'mnemonic',
    'swap',
    'order',
    'fill',
    'position',
    'balance',
    'pnl',
    'pump.fun',
    'jito',
    'solana rpc',
    'document',
    'window',
    'react',
    'child_process',
    'exec(',
    'eval(',
    ' function(',
    'post ',
    'put ',
    'patch ',
    'delete ',
  ];

  forbiddenRuntimeTerms.forEach(term => {
    runtimeFiles.forEach(file => {
      it(`${file.split('/').pop()} does not contain forbidden runtime term ${term}`, () => {
        const content = readFileSync(file, 'utf8').toLowerCase();
        expect(content).not.toContain(term);
      });
    });
  });

  it('runtime files contain no wall-clock timestamp usage', () => {
    for (const file of runtimeFiles) {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toContain('Date.now(');
      expect(content).not.toContain('new Date(');
    }
  });
});
