/**
 * Phase 7D Tests — Disabled Provider Config + Readiness Checks
 *
 * Tests cover:
 * A. Provider config
 *    - default config disabled
 *    - all live/network fields false
 *    - unsafe enable attempts captured
 *    - endpoint/API key values not exposed
 *    - raw URL/API key never returned
 *
 * B. Readiness
 *    - all-disabled providers produce disabled_safe
 *    - mock-only safe state can produce mock_only_ready
 *    - unsafe network request produces unsafe_requested
 *    - unsafe RPC request produces unsafe_requested
 *    - unsafe WebSocket request produces unsafe_requested
 *    - unsafe polling/streaming request produces unsafe_requested
 *    - unsafe API-key request produces unsafe_requested
 *    - no readiness implies live readiness
 *
 * C. Aggregation
 *    - readiness report includes all disabled providers
 *    - unsafeProviderCount works
 *    - enabledProviderCount remains 0 for safe disabled config
 *    - liveProviderCount remains 0
 *    - networkProviderCount remains 0
 *    - notes are safe to display
 *
 * D. Error safety
 *    - errors safe to display
 *    - no stack traces
 *    - no env values
 *    - no RPC URLs
 *    - no API keys
 *    - no secrets
 *    - no credentials
 *    - no wallet data
 *
 * E. Safety
 *    - no live provider enabled
 *    - no network capability
 *    - no Solana RPC capability
 *    - no execution trigger capability
 *    - no wallet capability
 *    - FULL_AUTO and LIMITED_LIVE remain locked
 *
 * F. Regression
 *    - all Phase 1–7C tests still pass (verified by running full suite)
 *    - no public exports broken
 *    - PHASE is still 7
 *
 * Requirements:
 * - No network
 * - No Solana RPC
 * - No WebSocket server/client
 * - No provider SDK
 * - No API key
 * - No Telegram token
 * - No wallet
 * - No private key
 * - No external DB beyond existing temp/in-memory patterns
 */

import { describe, it, expect } from 'vitest';

// ── Phase 7D exports under test ───────────────────────────────────────────────
import {
  // Config types + constants
  PROVIDER_CONFIG_MODES,
  PROVIDER_CONFIG_ERROR_CODES,
  DEFAULT_PROVIDER_CONFIG_SAFE,
  PHASE_7D_PROVIDER_TYPES,
  // Config functions
  validateProviderConfig,
  createDisabledProviderConfig,
  // Readiness types + constants
  PROVIDER_READINESS_VALUES,
  PROVIDER_READINESS_ERROR_CODES,
  PHASE_7D_READINESS_SUMMARY,
  // Readiness functions
  evaluateProviderReadiness,
  buildProviderReadinessEntry,
  buildProviderReadinessReport,
  assertAllProvidersSafe,
} from '../packages/event-engine/src/index.js';

import type {
  ProviderConfigSafe,
  ProviderConfigInput,
} from '../packages/event-engine/src/index.js';

// ── Regression imports from earlier phases ───────────────────────────────────
import {
  EVENT_PROVIDER_TYPES,
  PHASE_7B_PROVIDER_CAPABILITIES,
  createDisabledEventProvider,
  getEventProviderRegistry,
  MOCK_PROVIDER_CAPABILITIES,
} from '../packages/event-engine/src/index.js';

import { PHASE, PHASE_NAME } from '../packages/shared/src/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// A. Provider Config
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7D — A.1 Provider config: default config shape', () => {
  it('DEFAULT_PROVIDER_CONFIG_SAFE has all permission flags false', () => {
    const cfg = DEFAULT_PROVIDER_CONFIG_SAFE;
    expect(cfg.enabled).toBe(false);
    expect(cfg.allowNetwork).toBe(false);
    expect(cfg.allowSolanaRpc).toBe(false);
    expect(cfg.allowWebSocket).toBe(false);
    expect(cfg.allowPolling).toBe(false);
    expect(cfg.allowStreaming).toBe(false);
    expect(cfg.allowLiveEvents).toBe(false);
    expect(cfg.allowApiKeyUsage).toBe(false);
  });

  it('DEFAULT_PROVIDER_CONFIG_SAFE has no unsafe request by default', () => {
    expect(DEFAULT_PROVIDER_CONFIG_SAFE.unsafeRequested).toBe(false);
    expect(DEFAULT_PROVIDER_CONFIG_SAFE.unsafeReasons).toHaveLength(0);
  });

  it('DEFAULT_PROVIDER_CONFIG_SAFE mode is disabled', () => {
    expect(DEFAULT_PROVIDER_CONFIG_SAFE.mode).toBe('disabled');
  });

  it('DEFAULT_PROVIDER_CONFIG_SAFE does not expose raw URLs or API keys', () => {
    const json = JSON.stringify(DEFAULT_PROVIDER_CONFIG_SAFE);
    expect(json).not.toMatch(/https?:\/\//);
    expect(json).not.toMatch(/wss?:\/\//);
    // Field names like "allowApiKeyUsage" are expected; check for raw key values only
    expect(json).not.toMatch(/"[a-zA-Z0-9_-]{32,}"/); // no long raw key strings
    expect(json).not.toMatch(/password.*:/i);
    expect(json).not.toMatch(/private_key.*:/i);
    expect(json).not.toMatch(/mnemonic.*:/i);
  });
});

describe('Phase 7D — A.2 Provider config: createDisabledProviderConfig', () => {
  it('creates a named disabled config', () => {
    const cfg = createDisabledProviderConfig('helius_disabled');
    expect(cfg.providerType).toBe('helius_disabled');
    expect(cfg.mode).toBe('disabled');
    expect(cfg.enabled).toBe(false);
  });

  it('all permissions false on named disabled config', () => {
    const cfg = createDisabledProviderConfig('websocket_disabled');
    expect(cfg.allowNetwork).toBe(false);
    expect(cfg.allowSolanaRpc).toBe(false);
    expect(cfg.allowWebSocket).toBe(false);
    expect(cfg.allowPolling).toBe(false);
    expect(cfg.allowStreaming).toBe(false);
    expect(cfg.allowLiveEvents).toBe(false);
    expect(cfg.allowApiKeyUsage).toBe(false);
  });

  it('falls back to unknown for empty providerType', () => {
    const cfg = createDisabledProviderConfig('');
    expect(cfg.providerType).toBe('unknown');
  });
});

describe('Phase 7D — A.3 Provider config: PHASE_7D_PROVIDER_TYPES', () => {
  it('contains all expected Phase 7B provider types', () => {
    for (const t of EVENT_PROVIDER_TYPES) {
      expect(PHASE_7D_PROVIDER_TYPES).toContain(t);
    }
  });

  it('has at least 6 provider types', () => {
    expect(PHASE_7D_PROVIDER_TYPES.length).toBeGreaterThanOrEqual(6);
  });
});

describe('Phase 7D — A.4 Provider config: validateProviderConfig — safe input', () => {
  it('validates a minimal disabled config', () => {
    const result = validateProviderConfig({ providerType: 'helius_disabled' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.enabled).toBe(false);
      expect(result.config.unsafeRequested).toBe(false);
    }
  });

  it('accepts endpointConfigured=true (boolean, no URL stored)', () => {
    const result = validateProviderConfig({
      providerType: 'polling_disabled',
      endpointConfigured: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.endpointConfigured).toBe(true);
      const json = JSON.stringify(result.config);
      expect(json).not.toMatch(/https?:\/\//);
    }
  });

  it('accepts apiKeyConfigured=true (boolean, no key stored)', () => {
    const result = validateProviderConfig({
      providerType: 'helius_disabled',
      apiKeyConfigured: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.apiKeyConfigured).toBe(true);
      const json = JSON.stringify(result.config);
      expect(json).not.toMatch(/Bearer/i);
      expect(json).not.toMatch(/sk-/i);
    }
  });

  it('rejects empty providerType', () => {
    const result = validateProviderConfig({ providerType: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
      expect(result.error.code).toBe('PROVIDER_CONFIG_DISABLED');
    }
  });

  it('rejects whitespace-only providerType', () => {
    const result = validateProviderConfig({ providerType: '   ' });
    expect(result.ok).toBe(false);
  });
});

describe('Phase 7D — A.5 Provider config: validateProviderConfig — unsafe attempts captured', () => {
  it('enabled=true captured as unsafe', () => {
    const result = validateProviderConfig({ providerType: 'helius_disabled', enabled: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.enabled).toBe(false);
      expect(result.config.unsafeRequested).toBe(true);
      expect(result.config.unsafeReasons.length).toBeGreaterThan(0);
      expect(result.config.mode).toBe('future_live_not_available');
    }
  });

  it('allowNetwork=true captured as unsafe', () => {
    const result = validateProviderConfig({ providerType: 'helius_disabled', allowNetwork: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.allowNetwork).toBe(false);
      expect(result.config.unsafeRequested).toBe(true);
      expect(result.config.unsafeReasons.some((r) => r.includes('NETWORK_FORBIDDEN'))).toBe(true);
    }
  });

  it('allowSolanaRpc=true captured as unsafe', () => {
    const result = validateProviderConfig({ providerType: 'helius_disabled', allowSolanaRpc: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.allowSolanaRpc).toBe(false);
      expect(result.config.unsafeRequested).toBe(true);
      expect(result.config.unsafeReasons.some((r) => r.includes('SOLANA_RPC_FORBIDDEN'))).toBe(true);
    }
  });

  it('allowWebSocket=true captured as unsafe', () => {
    const result = validateProviderConfig({ providerType: 'websocket_disabled', allowWebSocket: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.allowWebSocket).toBe(false);
      expect(result.config.unsafeRequested).toBe(true);
      expect(result.config.unsafeReasons.some((r) => r.includes('WEBSOCKET_FORBIDDEN'))).toBe(true);
    }
  });

  it('allowPolling=true captured as unsafe', () => {
    const result = validateProviderConfig({ providerType: 'polling_disabled', allowPolling: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.allowPolling).toBe(false);
      expect(result.config.unsafeRequested).toBe(true);
      expect(result.config.unsafeReasons.some((r) => r.includes('POLLING_FORBIDDEN'))).toBe(true);
    }
  });

  it('allowStreaming=true captured as unsafe', () => {
    const result = validateProviderConfig({ providerType: 'yellowstone_disabled', allowStreaming: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.allowStreaming).toBe(false);
      expect(result.config.unsafeRequested).toBe(true);
      expect(result.config.unsafeReasons.some((r) => r.includes('STREAMING_FORBIDDEN'))).toBe(true);
    }
  });

  it('allowLiveEvents=true captured as unsafe', () => {
    const result = validateProviderConfig({ providerType: 'helius_disabled', allowLiveEvents: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.allowLiveEvents).toBe(false);
      expect(result.config.unsafeRequested).toBe(true);
      expect(result.config.unsafeReasons.some((r) => r.includes('LIVE_EVENTS_FORBIDDEN'))).toBe(true);
    }
  });

  it('allowApiKeyUsage=true captured as unsafe', () => {
    const result = validateProviderConfig({ providerType: 'helius_disabled', allowApiKeyUsage: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.allowApiKeyUsage).toBe(false);
      expect(result.config.unsafeRequested).toBe(true);
      expect(result.config.unsafeReasons.some((r) => r.includes('API_KEY_FORBIDDEN'))).toBe(true);
    }
  });

  it('multiple unsafe flags all captured with multiple reasons', () => {
    const result = validateProviderConfig({
      providerType: 'helius_disabled',
      enabled: true,
      allowNetwork: true,
      allowSolanaRpc: true,
      allowApiKeyUsage: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.unsafeRequested).toBe(true);
      expect(result.config.unsafeReasons.length).toBeGreaterThanOrEqual(4);
      // All permissions remain false regardless
      expect(result.config.enabled).toBe(false);
      expect(result.config.allowNetwork).toBe(false);
      expect(result.config.allowSolanaRpc).toBe(false);
      expect(result.config.allowApiKeyUsage).toBe(false);
    }
  });

  it('unsafe reasons do not contain raw URLs or API keys', () => {
    const result = validateProviderConfig({
      providerType: 'helius_disabled',
      allowNetwork: true,
      allowApiKeyUsage: true,
    });
    if (result.ok) {
      const reasonsStr = result.config.unsafeReasons.join(' ');
      expect(reasonsStr).not.toMatch(/https?:\/\//);
      expect(reasonsStr).not.toMatch(/Bearer/i);
      expect(reasonsStr).not.toMatch(/sk-/);
    }
  });
});

describe('Phase 7D — A.6 Provider config: PROVIDER_CONFIG_MODES', () => {
  it('contains disabled, mock_only, future_live_not_available', () => {
    expect(PROVIDER_CONFIG_MODES).toContain('disabled');
    expect(PROVIDER_CONFIG_MODES).toContain('mock_only');
    expect(PROVIDER_CONFIG_MODES).toContain('future_live_not_available');
  });
});

describe('Phase 7D — A.7 Provider config: PROVIDER_CONFIG_ERROR_CODES', () => {
  it('contains all required error codes', () => {
    expect(PROVIDER_CONFIG_ERROR_CODES).toContain('PROVIDER_CONFIG_DISABLED');
    expect(PROVIDER_CONFIG_ERROR_CODES).toContain('PROVIDER_CONFIG_UNSAFE_REQUESTED');
    expect(PROVIDER_CONFIG_ERROR_CODES).toContain('PROVIDER_CONFIG_NETWORK_FORBIDDEN');
    expect(PROVIDER_CONFIG_ERROR_CODES).toContain('PROVIDER_CONFIG_SOLANA_RPC_FORBIDDEN');
    expect(PROVIDER_CONFIG_ERROR_CODES).toContain('PROVIDER_CONFIG_WEBSOCKET_FORBIDDEN');
    expect(PROVIDER_CONFIG_ERROR_CODES).toContain('PROVIDER_CONFIG_POLLING_FORBIDDEN');
    expect(PROVIDER_CONFIG_ERROR_CODES).toContain('PROVIDER_CONFIG_STREAMING_FORBIDDEN');
    expect(PROVIDER_CONFIG_ERROR_CODES).toContain('PROVIDER_CONFIG_LIVE_EVENTS_FORBIDDEN');
    expect(PROVIDER_CONFIG_ERROR_CODES).toContain('PROVIDER_CONFIG_API_KEY_FORBIDDEN');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. Readiness
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7D — B.1 Readiness: evaluateProviderReadiness for disabled configs', () => {
  it('disabled mode → disabled_safe', () => {
    const cfg = createDisabledProviderConfig('helius_disabled');
    expect(evaluateProviderReadiness(cfg)).toBe('disabled_safe');
  });

  it('all Phase 7D provider types produce disabled_safe by default', () => {
    for (const t of PHASE_7D_PROVIDER_TYPES) {
      const cfg = createDisabledProviderConfig(t);
      expect(evaluateProviderReadiness(cfg)).toBe('disabled_safe');
    }
  });
});

describe('Phase 7D — B.2 Readiness: mock_only_ready', () => {
  it('mock_only mode without unsafe flags → mock_only_ready', () => {
    const mockOnlyConfig: ProviderConfigSafe = {
      ...DEFAULT_PROVIDER_CONFIG_SAFE,
      providerType: 'mock_disabled',
      mode: 'mock_only',
      unsafeRequested: false,
      unsafeReasons: [],
    };
    expect(evaluateProviderReadiness(mockOnlyConfig)).toBe('mock_only_ready');
  });
});

describe('Phase 7D — B.3 Readiness: unsafe_requested for all unsafe flag types', () => {
  function unsafeConfig(overrides: Partial<ProviderConfigInput>): ProviderConfigSafe {
    const result = validateProviderConfig({ providerType: 'helius_disabled', ...overrides });
    if (!result.ok) throw new Error('Expected ok result');
    return result.config;
  }

  it('allowNetwork=true → unsafe_requested', () => {
    expect(evaluateProviderReadiness(unsafeConfig({ allowNetwork: true }))).toBe('unsafe_requested');
  });

  it('allowSolanaRpc=true → unsafe_requested', () => {
    expect(evaluateProviderReadiness(unsafeConfig({ allowSolanaRpc: true }))).toBe('unsafe_requested');
  });

  it('allowWebSocket=true → unsafe_requested', () => {
    expect(evaluateProviderReadiness(unsafeConfig({ allowWebSocket: true }))).toBe('unsafe_requested');
  });

  it('allowPolling=true → unsafe_requested', () => {
    expect(evaluateProviderReadiness(unsafeConfig({ allowPolling: true }))).toBe('unsafe_requested');
  });

  it('allowStreaming=true → unsafe_requested', () => {
    expect(evaluateProviderReadiness(unsafeConfig({ allowStreaming: true }))).toBe('unsafe_requested');
  });

  it('allowLiveEvents=true → unsafe_requested', () => {
    expect(evaluateProviderReadiness(unsafeConfig({ allowLiveEvents: true }))).toBe('unsafe_requested');
  });

  it('allowApiKeyUsage=true → unsafe_requested', () => {
    expect(evaluateProviderReadiness(unsafeConfig({ allowApiKeyUsage: true }))).toBe('unsafe_requested');
  });

  it('enabled=true → unsafe_requested', () => {
    expect(evaluateProviderReadiness(unsafeConfig({ enabled: true }))).toBe('unsafe_requested');
  });
});

describe('Phase 7D — B.4 Readiness: unavailable for future_live_not_available without unsafe', () => {
  it('future_live_not_available mode without unsafe → unavailable', () => {
    const cfg: ProviderConfigSafe = {
      ...DEFAULT_PROVIDER_CONFIG_SAFE,
      providerType: 'helius_disabled',
      mode: 'future_live_not_available',
      unsafeRequested: false,
      unsafeReasons: [],
    };
    expect(evaluateProviderReadiness(cfg)).toBe('unavailable');
  });
});

describe('Phase 7D — B.5 Readiness: no readiness state implies live readiness', () => {
  it('no ProviderReadiness value equals "live" or "connected"', () => {
    expect(PROVIDER_READINESS_VALUES).not.toContain('live');
    expect(PROVIDER_READINESS_VALUES).not.toContain('connected');
    expect(PROVIDER_READINESS_VALUES).not.toContain('ready_live');
    expect(PROVIDER_READINESS_VALUES).not.toContain('active');
  });

  it('disabled_safe entry has canConnect=false', () => {
    const cfg = createDisabledProviderConfig('helius_disabled');
    const entry = buildProviderReadinessEntry(cfg);
    expect(entry.canConnect).toBe(false);
    expect(entry.canEmitLiveEvents).toBe(false);
    expect(entry.canTriggerExecution).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. Aggregation
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7D — C.1 Readiness report: default report (all disabled)', () => {
  it('report contains all Phase 7D provider types', () => {
    const report = buildProviderReadinessReport();
    const providerTypes = report.providers.map((p) => p.providerType);
    for (const t of PHASE_7D_PROVIDER_TYPES) {
      expect(providerTypes).toContain(t);
    }
  });

  it('overallReadiness is disabled_safe when all providers disabled', () => {
    const report = buildProviderReadinessReport();
    expect(report.overallReadiness).toBe('disabled_safe');
  });

  it('enabledProviderCount is 0', () => {
    const report = buildProviderReadinessReport();
    expect(report.enabledProviderCount).toBe(0);
  });

  it('liveProviderCount is 0', () => {
    const report = buildProviderReadinessReport();
    expect(report.liveProviderCount).toBe(0);
  });

  it('networkProviderCount is 0', () => {
    const report = buildProviderReadinessReport();
    expect(report.networkProviderCount).toBe(0);
  });

  it('unsafeProviderCount is 0 for default disabled configs', () => {
    const report = buildProviderReadinessReport();
    expect(report.unsafeProviderCount).toBe(0);
  });

  it('generatedAt is a valid ISO timestamp', () => {
    const report = buildProviderReadinessReport();
    expect(() => new Date(report.generatedAt)).not.toThrow();
    expect(new Date(report.generatedAt).toISOString()).toBe(report.generatedAt);
  });
});

describe('Phase 7D — C.2 Readiness report: notes are safe to display', () => {
  it('notes do not contain raw URLs or secrets', () => {
    const report = buildProviderReadinessReport();
    const notesStr = report.notes.join(' ');
    expect(notesStr).not.toMatch(/https?:\/\//);
    expect(notesStr).not.toMatch(/wss?:\/\//);
    // Check for raw secret values, not field names
    expect(notesStr).not.toMatch(/"[a-zA-Z0-9_-]{32,}"/);
    expect(notesStr).not.toMatch(/password.*:/i);
    expect(notesStr).not.toMatch(/private_key.*:/i);
    expect(notesStr).not.toMatch(/mnemonic/i);
  });

  it('notes mention Phase 7D and disabled state', () => {
    const report = buildProviderReadinessReport();
    const notesStr = report.notes.join(' ');
    expect(notesStr).toMatch(/Phase 7D/i);
    expect(notesStr).toMatch(/disabled/i);
  });
});

describe('Phase 7D — C.3 Readiness report: unsafe provider is detected', () => {
  it('unsafeProviderCount is 1 when one unsafe config provided', () => {
    const unsafeResult = validateProviderConfig({ providerType: 'helius_disabled', allowNetwork: true });
    if (!unsafeResult.ok) throw new Error('Expected ok');
    const safeConfig = createDisabledProviderConfig('websocket_disabled');
    const report = buildProviderReadinessReport([unsafeResult.config, safeConfig]);
    expect(report.unsafeProviderCount).toBe(1);
  });

  it('overallReadiness is unsafe_requested when any unsafe config present', () => {
    const unsafeResult = validateProviderConfig({ providerType: 'helius_disabled', enabled: true });
    if (!unsafeResult.ok) throw new Error('Expected ok');
    const report = buildProviderReadinessReport([unsafeResult.config]);
    expect(report.overallReadiness).toBe('unsafe_requested');
  });

  it('notes warn about unsafe providers', () => {
    const unsafeResult = validateProviderConfig({ providerType: 'helius_disabled', allowSolanaRpc: true });
    if (!unsafeResult.ok) throw new Error('Expected ok');
    const report = buildProviderReadinessReport([unsafeResult.config]);
    const notesStr = report.notes.join(' ');
    expect(notesStr).toMatch(/WARNING/);
    expect(notesStr).toMatch(/unsafe/i);
    expect(notesStr).toMatch(/fail-closed/i);
  });
});

describe('Phase 7D — C.4 Readiness report: custom configs', () => {
  it('accepts explicit list of configs', () => {
    const configs = PHASE_7D_PROVIDER_TYPES.map((t) => createDisabledProviderConfig(t));
    const report = buildProviderReadinessReport(configs);
    expect(report.providers).toHaveLength(PHASE_7D_PROVIDER_TYPES.length);
  });

  it('empty configs list produces disabled_safe overall', () => {
    // Empty list falls back to default configs
    const report = buildProviderReadinessReport([]);
    expect(report.overallReadiness).toBe('disabled_safe');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. Error safety
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7D — D.1 Error safety: ProviderConfigError', () => {
  it('error from invalid providerType has safeToDisplay=true', () => {
    const result = validateProviderConfig({ providerType: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.safeToDisplay).toBe(true);
    }
  });

  it('error message does not contain raw URLs, API keys, or stack traces', () => {
    const result = validateProviderConfig({ providerType: '' });
    if (!result.ok) {
      expect(result.error.message).not.toMatch(/https?:\/\//);
      expect(result.error.message).not.toMatch(/at Object\./); // no stack trace
      expect(result.error.message).not.toMatch(/apiKey/i);
      expect(result.error.message).not.toMatch(/secret/i);
    }
  });
});

describe('Phase 7D — D.2 Error safety: assertAllProvidersSafe throws safe error', () => {
  it('throws with safe message when unsafe providers present', () => {
    const unsafeResult = validateProviderConfig({ providerType: 'helius_disabled', allowNetwork: true });
    if (!unsafeResult.ok) throw new Error('Expected ok');
    const report = buildProviderReadinessReport([unsafeResult.config]);
    expect(() => assertAllProvidersSafe(report)).toThrow(/PROVIDER_READINESS_UNSAFE/);
  });

  it('thrown error does not contain raw URLs or secrets', () => {
    const unsafeResult = validateProviderConfig({ providerType: 'helius_disabled', allowApiKeyUsage: true });
    if (!unsafeResult.ok) throw new Error('Expected ok');
    const report = buildProviderReadinessReport([unsafeResult.config]);
    let errorMessage = '';
    try {
      assertAllProvidersSafe(report);
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : String(e);
    }
    expect(errorMessage).not.toMatch(/https?:\/\//);
    expect(errorMessage).not.toMatch(/Bearer/i);
    expect(errorMessage).not.toMatch(/sk-/);
    expect(errorMessage).not.toMatch(/secret/i);
    expect(errorMessage).not.toMatch(/mnemonic/i);
  });

  it('does not throw for safe all-disabled report', () => {
    const report = buildProviderReadinessReport();
    expect(() => assertAllProvidersSafe(report)).not.toThrow();
  });
});

describe('Phase 7D — D.3 PROVIDER_READINESS_ERROR_CODES', () => {
  it('contains PROVIDER_READINESS_UNSAFE and PROVIDER_READINESS_UNKNOWN', () => {
    expect(PROVIDER_READINESS_ERROR_CODES).toContain('PROVIDER_READINESS_UNSAFE');
    expect(PROVIDER_READINESS_ERROR_CODES).toContain('PROVIDER_READINESS_UNKNOWN');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. Safety
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7D — E.1 Safety: all providers remain disabled', () => {
  it('no provider in default report has enabled=true', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.config.enabled).toBe(false);
    }
  });

  it('no provider has canConnect=true', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.canConnect).toBe(false);
    }
  });

  it('no provider has canEmitLiveEvents=true', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.canEmitLiveEvents).toBe(false);
    }
  });

  it('no provider has canTriggerExecution=true', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.canTriggerExecution).toBe(false);
    }
  });
});

describe('Phase 7D — E.2 Safety: no network, RPC, WebSocket, wallet capabilities', () => {
  it('no provider config has allowNetwork=true', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.config.allowNetwork).toBe(false);
    }
  });

  it('no provider config has allowSolanaRpc=true', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.config.allowSolanaRpc).toBe(false);
    }
  });

  it('no provider config has allowWebSocket=true', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.config.allowWebSocket).toBe(false);
    }
  });

  it('no provider config has allowApiKeyUsage=true', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.config.allowApiKeyUsage).toBe(false);
    }
  });
});

describe('Phase 7D — E.3 Safety: PHASE_7D_READINESS_SUMMARY', () => {
  it('overall is disabled_safe', () => {
    expect(PHASE_7D_READINESS_SUMMARY.overall).toBe('disabled_safe');
  });

  it('helius, webSocket, yellowstone, polling are all disabled', () => {
    expect(PHASE_7D_READINESS_SUMMARY.helius).toBe('disabled');
    expect(PHASE_7D_READINESS_SUMMARY.webSocket).toBe('disabled');
    expect(PHASE_7D_READINESS_SUMMARY.yellowstone).toBe('disabled');
    expect(PHASE_7D_READINESS_SUMMARY.polling).toBe('disabled');
  });

  it('liveProviders, network, solanaRpc, executionTriggers, walletAccess, apiKeyUsage are forbidden', () => {
    expect(PHASE_7D_READINESS_SUMMARY.liveProviders).toBe('forbidden');
    expect(PHASE_7D_READINESS_SUMMARY.network).toBe('forbidden');
    expect(PHASE_7D_READINESS_SUMMARY.solanaRpc).toBe('forbidden');
    expect(PHASE_7D_READINESS_SUMMARY.executionTriggers).toBe('forbidden');
    expect(PHASE_7D_READINESS_SUMMARY.walletAccess).toBe('forbidden');
    expect(PHASE_7D_READINESS_SUMMARY.apiKeyUsage).toBe('forbidden');
  });
});

describe('Phase 7D — E.4 Safety: Phase 7B capabilities remain false', () => {
  it('PHASE_7B_PROVIDER_CAPABILITIES all flags false', () => {
    const caps = PHASE_7B_PROVIDER_CAPABILITIES;
    expect(caps.canUseNetwork).toBe(false);
    expect(caps.canUseSolanaRpc).toBe(false);
    expect(caps.canUseWebSocket).toBe(false);
    expect(caps.canEmitLiveEvents).toBe(false);
    expect(caps.canTriggerExecution).toBe(false);
    expect(caps.canAccessWallets).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
  });

  it('MOCK_PROVIDER_CAPABILITIES has no live/network/execution capability', () => {
    expect(MOCK_PROVIDER_CAPABILITIES.canUseNetwork).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canUseSolanaRpc).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canEmitLiveEvents).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canTriggerExecution).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canAccessWallets).toBe(false);
    expect(MOCK_PROVIDER_CAPABILITIES.canAccessPrivateKeys).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. Regression
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7D — F.1 Regression: PHASE and PHASE_NAME', () => {
  it('PHASE is 7', () => {
    expect(PHASE).toBe(7);
  });

  it('PHASE_NAME references Event Engine', () => {
    expect(PHASE_NAME).toContain('Event Engine');
  });
});

describe('Phase 7D — F.2 Regression: Phase 7B provider exports intact', () => {
  it('EVENT_PROVIDER_TYPES has 6 entries', () => {
    expect(EVENT_PROVIDER_TYPES).toHaveLength(6);
  });

  it('createDisabledEventProvider still creates a disabled provider', () => {
    const provider = createDisabledEventProvider('helius_disabled');
    expect(provider.getStatus()).toBe('disabled');
    expect(provider.getCapabilities().canUseNetwork).toBe(false);
  });

  it('getEventProviderRegistry still returns a registry with all providers', () => {
    const registry = getEventProviderRegistry();
    const types = registry.listProviderTypes();
    // Registry registers 5 named provider types (unknown_disabled is not pre-registered)
    expect(types.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Phase 7D — F.3 Regression: Phase 7D config/readiness compatible with Phase 7B boundaries', () => {
  it('Phase 7D config providerType matches Phase 7B EventProviderType strings', () => {
    for (const t of EVENT_PROVIDER_TYPES) {
      const cfg = createDisabledProviderConfig(t);
      expect(cfg.providerType).toBe(t);
      expect(cfg.enabled).toBe(false);
    }
  });

  it('buildProviderReadinessReport with Phase 7B types produces all disabled_safe', () => {
    const configs = EVENT_PROVIDER_TYPES.map((t) => createDisabledProviderConfig(t));
    const report = buildProviderReadinessReport(configs);
    expect(report.overallReadiness).toBe('disabled_safe');
    expect(report.unsafeProviderCount).toBe(0);
  });
});

describe('Phase 7D — F.4 Regression: public exports not broken', () => {
  it('PROVIDER_READINESS_VALUES is exported and has expected values', () => {
    expect(PROVIDER_READINESS_VALUES).toContain('disabled_safe');
    expect(PROVIDER_READINESS_VALUES).toContain('mock_only_ready');
    expect(PROVIDER_READINESS_VALUES).toContain('unsafe_requested');
    expect(PROVIDER_READINESS_VALUES).toContain('unavailable');
    expect(PROVIDER_READINESS_VALUES).toContain('unknown');
  });
});
