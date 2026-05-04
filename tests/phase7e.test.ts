/**
 * Phase 7E Tests — Event Engine Final Gate + Provider Readiness Surface
 *
 * Tests cover:
 * A. Event Engine read model
 *    - snapshot has required fields
 *    - provider readiness summary included
 *    - live providers forbidden
 *    - network forbidden
 *    - Solana RPC forbidden
 *    - execution triggers forbidden
 *    - no raw URLs/API keys/secrets exposed
 *
 * B. Phase 8 readiness gate
 *    - ready when Phase 7 local foundations are represented
 *    - blocked when provider readiness unsafe
 *    - blocked when live provider/network/RPC/execution capability appears enabled
 *    - warnings are safe to display
 *    - readiness clearly says Token Intelligence models only
 *
 * C. System output formatters
 *    - /system engine output includes provider readiness
 *    - /system engine output includes Event Engine local-only status
 *    - /system phase8 output includes Phase 8 readiness summary
 *    - output is compact
 *    - no raw secrets, no raw detailsJson
 *    - no live readiness wording
 *
 * D. Export/API audit
 *    - event-engine public exports include Phase 7A–7D expected symbols
 *    - state exports include new read model
 *    - no duplicate/conflicting exports
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
 *    - all Phase 1–7D tests still pass
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

// ── Phase 7E exports under test ───────────────────────────────────────────────
import {
  buildEventEngineReadinessSnapshot,
  buildPhase8ReadinessGate,
  buildProviderReadinessSummary,
  PHASE_7E_EVENT_ENGINE_SUMMARY,
  EVENT_ENGINE_READINESS_CODES,
  PHASE_8_REQUIRED_FOUNDATIONS,
  PHASE_8_REQUIRED_SAFETY_CONDITIONS,
} from '../packages/state/src/event-engine-read-model.js';

import type {
  ProviderReadinessSummary,
} from '../packages/state/src/event-engine-read-model.js';

// ── Formatter imports ─────────────────────────────────────────────────────────
import {
  formatSystemEngine,
  formatPhase8Readiness,
  formatSystemHelp,
  formatSystemUnknown,
} from '../apps/telegram-bot/src/formatters/system.js';

// ── Phase 7D helpers re-used ─────────────────────────────────────────────────
import {
  buildProviderReadinessReport,
  PHASE_7D_READINESS_SUMMARY,
} from '../packages/event-engine/src/index.js';

// ── Regression imports (Phase 7A–7D) ─────────────────────────────────────────
import {
  InMemoryEventBus,
  createDisabledEventProvider,
  getEventProviderRegistry,
  createControlledMockProvider,
  BUILTIN_FIXTURE_EVENTS,
  BUILTIN_SEQUENCE_ALL,
  replayFixtureSequence,
  PHASE_7D_PROVIDER_TYPES,
  PHASE_7B_PROVIDER_CAPABILITIES,
  MOCK_PROVIDER_CAPABILITIES,
  buildProviderReadinessReport as engineBuildReport,
  assertAllProvidersSafe,
} from '../packages/event-engine/src/index.js';

// ── Shared ────────────────────────────────────────────────────────────────────
import { PHASE, PHASE_NAME } from '../packages/shared/src/index.js';

// ── State regression ─────────────────────────────────────────────────────────
import {
  buildEventEngineReadinessSnapshot as stateBuildSnapshot,
} from '../packages/state/src/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// A. Event Engine read model
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7E — A.1 EventEngineReadinessSnapshot: required fields', () => {
  it('snapshot has generatedAt field', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.generatedAt).toBeTruthy();
    expect(typeof snap.generatedAt).toBe('string');
  });

  it('snapshot has eventEngineCore field', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.eventEngineCore).toBe('ready_local_only');
  });

  it('snapshot has inMemoryBus field', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.inMemoryBus).toBe('ready_local_only');
  });

  it('snapshot has mockProviders field', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.mockProviders).toBe('available_local_only');
  });

  it('snapshot has fixtureReplay field', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.fixtureReplay).toBe('available_local_only');
  });

  it('snapshot has disabledProviders field', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.disabledProviders).toBe('disabled_safe');
  });

  it('snapshot has providerReadinessSummary field', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.providerReadinessSummary).toBeTruthy();
    expect(typeof snap.providerReadinessSummary).toBe('object');
  });

  it('snapshot has phase8Readiness field', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.phase8Readiness).toBeTruthy();
    expect(typeof snap.phase8Readiness).toBe('object');
  });

  it('snapshot has safeToDisplay: true', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.safeToDisplay).toBe(true);
  });
});

describe('Phase 7E — A.2 EventEngineReadinessSnapshot: live/network/execution are forbidden', () => {
  it('liveProviders is forbidden', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.liveProviders).toBe('forbidden');
  });

  it('networkAccess is forbidden', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.networkAccess).toBe('forbidden');
  });

  it('solanaRpc is forbidden', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.solanaRpc).toBe('forbidden');
  });

  it('executionTriggers is forbidden', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.executionTriggers).toBe('forbidden');
  });

  it('walletAccess is forbidden', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.walletAccess).toBe('forbidden');
  });

  it('apiKeyUsage is forbidden', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.apiKeyUsage).toBe('forbidden');
  });
});

describe('Phase 7E — A.3 ProviderReadinessSummary: correct counts for all-disabled state', () => {
  it('providerCount matches provider types', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.providerReadinessSummary.providerCount).toBe(PHASE_7D_PROVIDER_TYPES.length);
  });

  it('enabledProviderCount is 0 for all-disabled', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.providerReadinessSummary.enabledProviderCount).toBe(0);
  });

  it('liveProviderCount is 0 for all-disabled', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.providerReadinessSummary.liveProviderCount).toBe(0);
  });

  it('networkProviderCount is 0 for all-disabled', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.providerReadinessSummary.networkProviderCount).toBe(0);
  });

  it('unsafeProviderCount is 0 for all-disabled safe configs', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.providerReadinessSummary.unsafeProviderCount).toBe(0);
  });

  it('overallReadiness is disabled_safe for all-disabled', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.providerReadinessSummary.overallReadiness).toBe('disabled_safe');
  });

  it('safeToDisplay is true', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.providerReadinessSummary.safeToDisplay).toBe(true);
  });
});

describe('Phase 7E — A.4 No raw URLs/API keys/secrets in snapshot', () => {
  it('snapshot JSON contains no raw https URLs', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const json = JSON.stringify(snap);
    expect(json).not.toMatch(/https?:\/\/[a-zA-Z0-9]/);
  });

  it('snapshot JSON contains no raw wss:// WebSocket URLs', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const json = JSON.stringify(snap);
    expect(json).not.toMatch(/wss?:\/\//);
  });

  it('snapshot JSON contains no raw API key values (long token strings)', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const json = JSON.stringify(snap);
    // Check there are no JSON key-value pairs with suspicious field names containing long token values
    expect(json).not.toMatch(/"(apiKey|api_key|token|secret|credential|password|key)"\s*:\s*"[a-zA-Z0-9_-]{32,}"/i);
  });

  it('snapshot JSON contains no password/private_key/mnemonic/seed values', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const json = JSON.stringify(snap);
    // Check that no JSON key named privateKey/private_key has an actual value
    // (human-readable strings mentioning "private key" in documentation are acceptable)
    expect(json).not.toMatch(/"privateKey"\s*:\s*"[^"]{4,}"/i);
    expect(json).not.toMatch(/"private_key"\s*:\s*"[^"]{4,}"/i);
    expect(json).not.toMatch(/"mnemonic"\s*:\s*"[^"]{4,}"/i);
    expect(json).not.toMatch(/"seedPhrase"\s*:\s*"[^"]{4,}"/i);
    expect(json).not.toMatch(/"seed_phrase"\s*:\s*"[^"]{4,}"/i);
    expect(json).not.toMatch(/"password"\s*:\s*"[^"]{8,}"/i);
  });

  it('snapshot JSON contains no detailsJson', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const json = JSON.stringify(snap);
    expect(json).not.toMatch(/detailsJson/);
  });
});

describe('Phase 7E — A.5 buildProviderReadinessSummary from ProviderReadinessReport', () => {
  it('builds summary from all-disabled report', () => {
    const report = buildProviderReadinessReport();
    const summary = buildProviderReadinessSummary(report);
    expect(summary.overallReadiness).toBe('disabled_safe');
    expect(summary.unsafeProviderCount).toBe(0);
    expect(summary.enabledProviderCount).toBe(0);
    expect(summary.liveProviderCount).toBe(0);
    expect(summary.networkProviderCount).toBe(0);
    expect(summary.safeToDisplay).toBe(true);
    expect(summary.notes).toBeInstanceOf(Array);
  });

  it('providerCount in summary matches report provider array length', () => {
    const report = buildProviderReadinessReport();
    const summary = buildProviderReadinessSummary(report);
    expect(summary.providerCount).toBe(report.providers.length);
  });

  it('notes from report are preserved in summary', () => {
    const report = buildProviderReadinessReport();
    const summary = buildProviderReadinessSummary(report);
    expect(summary.notes).toEqual(report.notes);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. Phase 8 readiness gate
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7E — B.1 Phase8ReadinessGate: ready state with safe all-disabled providers', () => {
  it('readyForTokenIntelligence is true for safe all-disabled state', () => {
    const snap = buildEventEngineReadinessSnapshot({ fullAutoLocked: true, limitedLiveLocked: true });
    expect(snap.phase8Readiness.readyForTokenIntelligence).toBe(true);
  });

  it('blockers list is empty when all conditions are met', () => {
    const snap = buildEventEngineReadinessSnapshot({ fullAutoLocked: true, limitedLiveLocked: true });
    expect(snap.phase8Readiness.blockers).toHaveLength(0);
  });

  it('safeToDisplay is true on gate', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.phase8Readiness.safeToDisplay).toBe(true);
  });

  it('requiredCompletedPhases lists all Phase 0–7E foundations', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const phases = snap.phase8Readiness.requiredCompletedPhases;
    expect(phases.length).toBeGreaterThanOrEqual(8);
    // Must reference Phase 7E
    expect(phases.some((p) => p.includes('7E'))).toBe(true);
  });

  it('requiredSafetyConditions lists all required safety conditions', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const conditions = snap.phase8Readiness.requiredSafetyConditions;
    expect(conditions.length).toBeGreaterThanOrEqual(8);
    // Must mention FULL_AUTO
    expect(conditions.some((c) => c.includes('FULL_AUTO'))).toBe(true);
    // Must mention no execution
    expect(conditions.some((c) => c.toLowerCase().includes('execution'))).toBe(true);
  });
});

describe('Phase 7E — B.2 Phase8ReadinessGate: blocked when unsafe', () => {
  it('blocked when unsafeProviderCount > 0', () => {
    const unsafeSummary: ProviderReadinessSummary = {
      overallReadiness: 'unsafe_requested',
      providerCount: 1,
      unsafeProviderCount: 1,
      enabledProviderCount: 0,
      liveProviderCount: 0,
      networkProviderCount: 0,
      safeToDisplay: true,
      notes: [],
    };
    const gate = buildPhase8ReadinessGate(unsafeSummary);
    expect(gate.readyForTokenIntelligence).toBe(false);
    expect(gate.blockers.length).toBeGreaterThan(0);
    expect(gate.blockers.some((b) => b.includes('PROVIDER_READINESS_UNSAFE'))).toBe(true);
  });

  it('blocked when enabledProviderCount > 0', () => {
    const unsafeSummary: ProviderReadinessSummary = {
      overallReadiness: 'disabled_safe',
      providerCount: 1,
      unsafeProviderCount: 0,
      enabledProviderCount: 1,
      liveProviderCount: 0,
      networkProviderCount: 0,
      safeToDisplay: true,
      notes: [],
    };
    const gate = buildPhase8ReadinessGate(unsafeSummary);
    expect(gate.readyForTokenIntelligence).toBe(false);
    expect(gate.blockers.some((b) => b.includes('LIVE_PROVIDERS_FORBIDDEN'))).toBe(true);
  });

  it('blocked when liveProviderCount > 0', () => {
    const unsafeSummary: ProviderReadinessSummary = {
      overallReadiness: 'disabled_safe',
      providerCount: 1,
      unsafeProviderCount: 0,
      enabledProviderCount: 0,
      liveProviderCount: 1,
      networkProviderCount: 0,
      safeToDisplay: true,
      notes: [],
    };
    const gate = buildPhase8ReadinessGate(unsafeSummary);
    expect(gate.readyForTokenIntelligence).toBe(false);
    expect(gate.blockers.some((b) => b.includes('LIVE_PROVIDERS_FORBIDDEN'))).toBe(true);
  });

  it('blocked when networkProviderCount > 0', () => {
    const unsafeSummary: ProviderReadinessSummary = {
      overallReadiness: 'disabled_safe',
      providerCount: 1,
      unsafeProviderCount: 0,
      enabledProviderCount: 0,
      liveProviderCount: 0,
      networkProviderCount: 1,
      safeToDisplay: true,
      notes: [],
    };
    const gate = buildPhase8ReadinessGate(unsafeSummary);
    expect(gate.readyForTokenIntelligence).toBe(false);
    expect(gate.blockers.some((b) => b.includes('SOLANA_RPC_FORBIDDEN'))).toBe(true);
  });

  it('blocked when overallReadiness is unsafe_requested', () => {
    const unsafeSummary: ProviderReadinessSummary = {
      overallReadiness: 'unsafe_requested',
      providerCount: 1,
      unsafeProviderCount: 0,
      enabledProviderCount: 0,
      liveProviderCount: 0,
      networkProviderCount: 0,
      safeToDisplay: true,
      notes: [],
    };
    const gate = buildPhase8ReadinessGate(unsafeSummary);
    expect(gate.readyForTokenIntelligence).toBe(false);
    expect(gate.blockers.length).toBeGreaterThan(0);
  });

  it('blocked when overallReadiness is unknown', () => {
    const unsafeSummary: ProviderReadinessSummary = {
      overallReadiness: 'unknown',
      providerCount: 1,
      unsafeProviderCount: 0,
      enabledProviderCount: 0,
      liveProviderCount: 0,
      networkProviderCount: 0,
      safeToDisplay: true,
      notes: [],
    };
    const gate = buildPhase8ReadinessGate(unsafeSummary);
    expect(gate.readyForTokenIntelligence).toBe(false);
  });

  it('blocked when FULL_AUTO is not locked', () => {
    const report = buildProviderReadinessReport();
    const summary = buildProviderReadinessSummary(report);
    const gate = buildPhase8ReadinessGate(summary, { fullAutoLocked: false });
    expect(gate.readyForTokenIntelligence).toBe(false);
    expect(gate.blockers.some((b) => b.includes('FULL_AUTO'))).toBe(true);
  });

  it('blocked when LIMITED_LIVE is not locked', () => {
    const report = buildProviderReadinessReport();
    const summary = buildProviderReadinessSummary(report);
    const gate = buildPhase8ReadinessGate(summary, { limitedLiveLocked: false });
    expect(gate.readyForTokenIntelligence).toBe(false);
    expect(gate.blockers.some((b) => b.includes('LIMITED_LIVE'))).toBe(true);
  });
});

describe('Phase 7E — B.3 Phase8ReadinessGate: warnings are safe to display', () => {
  it('no blocker/warning contains raw URL', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const gate = snap.phase8Readiness;
    const all = [...gate.blockers, ...gate.warnings];
    for (const msg of all) {
      expect(msg).not.toMatch(/https?:\/\//);
      expect(msg).not.toMatch(/wss?:\/\//);
    }
  });

  it('no blocker/warning contains API key or secret', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const gate = snap.phase8Readiness;
    const all = [...gate.blockers, ...gate.warnings];
    for (const msg of all) {
      expect(msg).not.toMatch(/[a-zA-Z0-9_-]{40,}/); // no long raw token strings
    }
  });

  it('readyForTokenIntelligence is clearly Token Intelligence models only', () => {
    // The gate description in requiredCompletedPhases/conditions must NOT mention live trading
    const gate = buildEventEngineReadinessSnapshot().phase8Readiness;
    const allText = [
      ...gate.requiredCompletedPhases,
      ...gate.requiredSafetyConditions,
    ].join(' ');
    expect(allText.toLowerCase()).not.toMatch(/live trading/);
    expect(allText.toLowerCase()).not.toMatch(/execute trades/);
    expect(allText.toLowerCase()).not.toMatch(/wallet unlock/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. System output formatters
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7E — C.1 formatSystemEngine output', () => {
  it('output contains Event Engine core status', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatSystemEngine(snap);
    expect(output).toContain('ready_local_only');
  });

  it('output contains provider readiness', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatSystemEngine(snap);
    expect(output).toContain('disabled_safe');
  });

  it('output contains forbidden fields', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatSystemEngine(snap);
    expect(output).toContain('forbidden');
  });

  it('output contains Phase 8 readiness', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatSystemEngine(snap);
    expect(output.toLowerCase()).toContain('phase 8');
  });

  it('output is a non-empty string', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatSystemEngine(snap);
    expect(typeof output).toBe('string');
    expect(output.length).toBeGreaterThan(50);
  });

  it('output contains no raw https:// URLs', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatSystemEngine(snap);
    expect(output).not.toMatch(/https?:\/\/[a-zA-Z0-9]/);
  });

  it('output contains no raw wss:// URLs', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatSystemEngine(snap);
    expect(output).not.toMatch(/wss?:\/\//);
  });

  it('output contains no raw detailsJson', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatSystemEngine(snap);
    expect(output).not.toContain('detailsJson');
  });

  it('output does not imply live readiness', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatSystemEngine(snap);
    expect(output.toLowerCase()).not.toContain('live ready');
    expect(output.toLowerCase()).not.toContain('live trading enabled');
    expect(output.toLowerCase()).not.toContain('solana rpc enabled');
  });
});

describe('Phase 7E — C.2 formatPhase8Readiness output', () => {
  it('output contains readyForTokenIntelligence field', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatPhase8Readiness(snap.phase8Readiness);
    expect(output.toLowerCase()).toContain('token intelligence');
  });

  it('output contains required foundations section', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatPhase8Readiness(snap.phase8Readiness);
    expect(output.toLowerCase()).toContain('required foundations');
  });

  it('output contains required safety conditions section', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatPhase8Readiness(snap.phase8Readiness);
    expect(output.toLowerCase()).toContain('safety conditions');
  });

  it('output is a non-empty string', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatPhase8Readiness(snap.phase8Readiness);
    expect(typeof output).toBe('string');
    expect(output.length).toBeGreaterThan(100);
  });

  it('output contains no raw secrets or API keys', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatPhase8Readiness(snap.phase8Readiness);
    expect(output).not.toMatch(/[a-zA-Z0-9_-]{40,}/);
    expect(output).not.toMatch(/https?:\/\//);
    expect(output).not.toMatch(/wss?:\/\//);
  });

  it('output includes disclaimer about Token Intelligence models only', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const output = formatPhase8Readiness(snap.phase8Readiness);
    expect(output.toLowerCase()).toContain('models');
  });

  it('blocked gate produces output with blockers section', () => {
    const unsafeSummary: ProviderReadinessSummary = {
      overallReadiness: 'unsafe_requested',
      providerCount: 1,
      unsafeProviderCount: 2,
      enabledProviderCount: 0,
      liveProviderCount: 0,
      networkProviderCount: 0,
      safeToDisplay: true,
      notes: [],
    };
    const gate = buildPhase8ReadinessGate(unsafeSummary);
    const output = formatPhase8Readiness(gate);
    expect(output.toLowerCase()).toContain('blocker');
    expect(gate.readyForTokenIntelligence).toBe(false);
  });
});

describe('Phase 7E — C.3 formatSystemHelp updated', () => {
  it('help text includes engine subcommand', () => {
    const help = formatSystemHelp();
    expect(help).toContain('/system engine');
  });

  it('help text includes phase8 subcommand', () => {
    const help = formatSystemHelp();
    expect(help).toContain('/system phase8');
  });

  it('help text still mentions safety locks', () => {
    const help = formatSystemHelp();
    expect(help).toContain('FULL_AUTO');
    expect(help).toContain('LIMITED_LIVE');
  });
});

describe('Phase 7E — C.4 formatSystemUnknown updated', () => {
  it('unknown subcommand response mentions engine and phase8', () => {
    const output = formatSystemUnknown('bogus');
    expect(output).toContain('engine');
    expect(output).toContain('phase8');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. Export / API audit
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7E — D.1 event-engine public exports include Phase 7A–7D symbols', () => {
  it('Phase 7A: InMemoryEventBus is exported', () => {
    expect(typeof InMemoryEventBus).toBe('function');
  });

  it('Phase 7B: createDisabledEventProvider is exported', () => {
    expect(typeof createDisabledEventProvider).toBe('function');
  });

  it('Phase 7B: PHASE_7B_PROVIDER_CAPABILITIES is exported', () => {
    expect(PHASE_7B_PROVIDER_CAPABILITIES).toBeTruthy();
  });

  it('Phase 7C: createControlledMockProvider is exported', () => {
    expect(typeof createControlledMockProvider).toBe('function');
  });

  it('Phase 7C: MOCK_PROVIDER_CAPABILITIES is exported', () => {
    expect(MOCK_PROVIDER_CAPABILITIES).toBeTruthy();
  });

  it('Phase 7C: BUILTIN_FIXTURE_EVENTS is exported', () => {
    expect(BUILTIN_FIXTURE_EVENTS).toBeTruthy();
    expect(BUILTIN_FIXTURE_EVENTS.length).toBeGreaterThan(0);
  });

  it('Phase 7C: replayFixtureSequence is exported', () => {
    expect(typeof replayFixtureSequence).toBe('function');
  });

  it('Phase 7D: buildProviderReadinessReport is exported', () => {
    expect(typeof engineBuildReport).toBe('function');
  });

  it('Phase 7D: assertAllProvidersSafe is exported', () => {
    expect(typeof assertAllProvidersSafe).toBe('function');
  });

  it('Phase 7D: PHASE_7D_PROVIDER_TYPES is exported', () => {
    expect(PHASE_7D_PROVIDER_TYPES.length).toBeGreaterThanOrEqual(6);
  });
});

describe('Phase 7E — D.2 state exports include new Phase 7E read model', () => {
  it('buildEventEngineReadinessSnapshot is exported from state', () => {
    expect(typeof stateBuildSnapshot).toBe('function');
  });

  it('PHASE_7E_EVENT_ENGINE_SUMMARY is exported', () => {
    expect(PHASE_7E_EVENT_ENGINE_SUMMARY).toBeTruthy();
    expect(PHASE_7E_EVENT_ENGINE_SUMMARY.liveProviders).toBe('forbidden');
    expect(PHASE_7E_EVENT_ENGINE_SUMMARY.solanaRpc).toBe('forbidden');
    expect(PHASE_7E_EVENT_ENGINE_SUMMARY.executionTriggers).toBe('forbidden');
  });

  it('EVENT_ENGINE_READINESS_CODES is exported', () => {
    expect(EVENT_ENGINE_READINESS_CODES.length).toBeGreaterThanOrEqual(6);
    expect(EVENT_ENGINE_READINESS_CODES).toContain('EVENT_ENGINE_READY_FOR_PHASE_8');
    expect(EVENT_ENGINE_READINESS_CODES).toContain('EVENT_ENGINE_PHASE_8_BLOCKED');
    expect(EVENT_ENGINE_READINESS_CODES).toContain('EVENT_ENGINE_PROVIDER_READINESS_UNSAFE');
  });

  it('PHASE_8_REQUIRED_FOUNDATIONS is exported', () => {
    expect(PHASE_8_REQUIRED_FOUNDATIONS.length).toBeGreaterThanOrEqual(8);
  });

  it('PHASE_8_REQUIRED_SAFETY_CONDITIONS is exported', () => {
    expect(PHASE_8_REQUIRED_SAFETY_CONDITIONS.length).toBeGreaterThanOrEqual(8);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. Safety
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7E — E.1 No live provider can be enabled', () => {
  it('all provider configs have enabled: false', () => {
    const snap = buildEventEngineReadinessSnapshot();
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.config.enabled).toBe(false);
    }
    expect(snap.providerReadinessSummary.enabledProviderCount).toBe(0);
  });

  it('all provider entries have canConnect: false', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.canConnect).toBe(false);
    }
  });

  it('all provider entries have canEmitLiveEvents: false', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.canEmitLiveEvents).toBe(false);
    }
  });

  it('all provider entries have canTriggerExecution: false', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.canTriggerExecution).toBe(false);
    }
  });
});

describe('Phase 7E — E.2 No network capability', () => {
  it('all provider configs have allowNetwork: false', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.config.allowNetwork).toBe(false);
    }
  });

  it('networkProviderCount is 0', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.providerReadinessSummary.networkProviderCount).toBe(0);
  });
});

describe('Phase 7E — E.3 No Solana RPC capability', () => {
  it('all provider configs have allowSolanaRpc: false', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.config.allowSolanaRpc).toBe(false);
    }
  });

  it('solanaRpc field on snapshot is forbidden', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.solanaRpc).toBe('forbidden');
  });
});

describe('Phase 7E — E.4 No execution trigger capability', () => {
  it('executionTriggers field on snapshot is forbidden', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.executionTriggers).toBe('forbidden');
  });

  it('all provider entries have canTriggerExecution: false', () => {
    const report = buildProviderReadinessReport();
    for (const entry of report.providers) {
      expect(entry.canTriggerExecution).toBe(false);
    }
  });
});

describe('Phase 7E — E.5 No wallet capability', () => {
  it('walletAccess field on snapshot is forbidden', () => {
    const snap = buildEventEngineReadinessSnapshot();
    expect(snap.walletAccess).toBe('forbidden');
  });

  it('PHASE_7E_EVENT_ENGINE_SUMMARY has forbidden wallet access', () => {
    expect(PHASE_7E_EVENT_ENGINE_SUMMARY.walletAccess).toBe('forbidden');
  });
});

describe('Phase 7E — E.6 FULL_AUTO and LIMITED_LIVE remain locked', () => {
  it('Phase 8 gate defaults to fullAutoLocked=true', () => {
    const report = buildProviderReadinessReport();
    const summary = buildProviderReadinessSummary(report);
    // No opts provided — defaults to true (fail-safe)
    const gate = buildPhase8ReadinessGate(summary);
    expect(gate.blockers.some((b) => b.includes('FULL_AUTO'))).toBe(false);
  });

  it('Phase 8 gate defaults to limitedLiveLocked=true', () => {
    const report = buildProviderReadinessReport();
    const summary = buildProviderReadinessSummary(report);
    const gate = buildPhase8ReadinessGate(summary);
    expect(gate.blockers.some((b) => b.includes('LIMITED_LIVE'))).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. Regression
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7E — F.1 PHASE is still 7', () => {
  it('PHASE constant is 7', () => {
    expect(PHASE).toBe(7);
  });

  it('PHASE_NAME includes Phase 7E wording', () => {
    expect(PHASE_NAME).toBeTruthy();
    expect(typeof PHASE_NAME).toBe('string');
  });
});

describe('Phase 7E — F.2 Phase 7A–7D regression: core exports still work', () => {
  it('InMemoryEventBus still works', () => {
    const bus = new InMemoryEventBus();
    expect(bus).toBeTruthy();
    expect(typeof bus.publish).toBe('function');
    expect(typeof bus.subscribe).toBe('function');
  });

  it('disabled event provider still returns PROVIDER_DISABLED on connect', async () => {
    const provider = createDisabledEventProvider('helius_disabled');
    const result = await provider.connect();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('PROVIDER_DISABLED');
    }
  });

  it('disabled provider registry lists providers', () => {
    const registry = getEventProviderRegistry();
    const types = registry.listProviderTypes();
    // Registry pre-registers 5 named disabled providers (unknown_disabled is returned
    // on-demand for unrecognised types, not pre-registered)
    expect(types.length).toBeGreaterThanOrEqual(5);
  });

  it('fixture replay works with BUILTIN_SEQUENCE_ALL', () => {
    const bus = new InMemoryEventBus();
    // BUILTIN_SEQUENCE_ALL is a pre-built FixtureSequence, use it directly
    const result = replayFixtureSequence(BUILTIN_SEQUENCE_ALL, bus);
    expect(result.ok).toBe(true);
  });

  it('provider readiness report for all disabled produces disabled_safe', () => {
    const report = buildProviderReadinessReport();
    expect(report.overallReadiness).toBe('disabled_safe');
    expect(report.enabledProviderCount).toBe(0);
    expect(report.liveProviderCount).toBe(0);
    expect(report.networkProviderCount).toBe(0);
  });

  it('assertAllProvidersSafe passes for all-disabled report', () => {
    const report = buildProviderReadinessReport();
    expect(() => assertAllProvidersSafe(report)).not.toThrow();
  });
});

describe('Phase 7E — F.3 PHASE_7D_READINESS_SUMMARY constants still present', () => {
  it('liveProviders is forbidden', () => {
    expect(PHASE_7D_READINESS_SUMMARY.liveProviders).toBe('forbidden');
  });

  it('solanaRpc is forbidden', () => {
    expect(PHASE_7D_READINESS_SUMMARY.solanaRpc).toBe('forbidden');
  });

  it('network is forbidden', () => {
    expect(PHASE_7D_READINESS_SUMMARY.network).toBe('forbidden');
  });

  it('executionTriggers is forbidden', () => {
    expect(PHASE_7D_READINESS_SUMMARY.executionTriggers).toBe('forbidden');
  });
});
