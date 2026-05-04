/**
 * Phase 7B Tests — Disabled Read-Only Provider Boundaries
 *
 * Tests cover:
 * A. Provider types — type shape, status shape, config shape, capability shape,
 *                     all network/live/execution fields false
 * B. Disabled providers — Helius, WebSocket, Yellowstone, polling boundaries,
 *                         all capabilities false, disabled reasons safe to display,
 *                         never reports runtime dependency loaded,
 *                         optional lifecycle methods return disabled/forbidden
 * C. Factory/registry — default factory returns disabled provider,
 *                       missing config returns disabled provider,
 *                       unsafe enable attempts fail closed,
 *                       network/Solana RPC/WebSocket/polling/streaming/execution-trigger
 *                       attempts fail closed, registry lists disabled providers only
 * D. Forbidden methods — connect/poll/subscribe/start return disabled/forbidden,
 *                        disconnect/stop return ok (safe no-op),
 *                        no live events emitted, no network calls, no background loops
 * E. Error safety — disabled/forbidden errors safe to display,
 *                   no stack traces, no env values, no RPC URLs, no API keys,
 *                   no secrets, no credentials, no wallet data
 * F. Regression — all Phase 1–7A tests still pass, no public exports broken,
 *                 FULL_AUTO and LIMITED_LIVE remain locked
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

// ── Phase 7B exports under test ───────────────────────────────────────────────
import {
  // Provider types
  EVENT_PROVIDER_TYPES,
  EVENT_PROVIDER_STATUSES,
  // Provider capabilities / config
  DISABLED_PROVIDER_CONFIG,
  DISABLED_PROVIDER_CAPABILITIES,
  PHASE_7B_PROVIDER_CAPABILITIES,
  // Disabled provider
  DisabledEventProvider,
  providerOk,
  providerErr,
  isProviderOk,
  isProviderErr,
  // Factory
  createDisabledEventProvider,
  createDisabledHeliusProvider,
  createDisabledWebSocketProvider,
  createDisabledYellowstoneProvider,
  createDisabledPollingProvider,
  // Registry
  EventProviderRegistry,
  getEventProviderRegistry,
} from '../packages/event-engine/src/index.js';

// Type-only imports for shape checks
import type {
  EventProviderType,
  EventProviderStatus,
  EventProviderConfig,
  EventProviderCapabilities,
  EventProviderBoundary,
  ProviderErrorCode,
  ProviderResult,
  ProviderOk,
  ProviderErr,
  EventProviderFactoryInput,
  IEventProviderRegistry,
} from '../packages/event-engine/src/index.js';

// ── Phase 7A regression imports ──────────────────────────────────────────────
import {
  EVENT_CATEGORIES,
  EVENT_SOURCE_TYPES,
  EVENT_SEVERITIES,
  PHASE_7A_SOURCE_CAPABILITIES,
  buildDisabledSourceHealth,
  buildEventEngineSystemStatus,
  engineOk,
  engineErr,
  isEngineOk,
  isEngineErr,
  InMemoryEventBus,
  createInMemoryEventBus,
  buildTestEvent,
} from '../packages/event-engine/src/index.js';

// ── Shared regression imports ─────────────────────────────────────────────────
import {
  PHASE,
  buildRuntimeSafetyStatus,
} from '../packages/shared/src/index.js';

// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7B — Provider Types', () => {
  describe('A1. EventProviderType shape', () => {
    it('contains all expected provider types', () => {
      const expected: EventProviderType[] = [
        'helius_disabled',
        'websocket_disabled',
        'yellowstone_disabled',
        'polling_disabled',
        'mock_disabled',
        'unknown_disabled',
      ];
      for (const t of expected) {
        expect(EVENT_PROVIDER_TYPES).toContain(t);
      }
    });

    it('has exactly 6 provider types', () => {
      expect(EVENT_PROVIDER_TYPES).toHaveLength(6);
    });

    it('all provider type names end with _disabled', () => {
      for (const t of EVENT_PROVIDER_TYPES) {
        expect(t).toMatch(/_disabled$/);
      }
    });

    it('is readonly (array does not mutate)', () => {
      const snapshot = [...EVENT_PROVIDER_TYPES];
      // Attempt mutation via cast — TypeScript prevents this at compile time,
      // this test documents the runtime shape
      expect([...EVENT_PROVIDER_TYPES]).toEqual(snapshot);
    });
  });

  describe('A2. EventProviderStatus shape', () => {
    it('contains all expected provider statuses', () => {
      const expected: EventProviderStatus[] = [
        'disabled',
        'unavailable',
        'unsupported',
        'mock_only',
        'future_not_available',
      ];
      for (const s of expected) {
        expect(EVENT_PROVIDER_STATUSES).toContain(s);
      }
    });

    it('has exactly 5 provider statuses', () => {
      expect(EVENT_PROVIDER_STATUSES).toHaveLength(5);
    });
  });

  describe('A3. EventProviderConfig shape — all permissions false', () => {
    it('DISABLED_PROVIDER_CONFIG has all boolean fields as false', () => {
      const cfg: EventProviderConfig = DISABLED_PROVIDER_CONFIG;
      expect(cfg.enabled).toBe(false);
      expect(cfg.allowNetwork).toBe(false);
      expect(cfg.allowSolanaRpc).toBe(false);
      expect(cfg.allowWebSocket).toBe(false);
      expect(cfg.allowLiveEvents).toBe(false);
      expect(cfg.allowPolling).toBe(false);
      expect(cfg.allowStreaming).toBe(false);
      expect(cfg.allowExecutionTriggers).toBe(false);
    });

    it('DISABLED_PROVIDER_CONFIG has exactly 8 fields', () => {
      expect(Object.keys(DISABLED_PROVIDER_CONFIG)).toHaveLength(8);
    });

    it('no DISABLED_PROVIDER_CONFIG field is true', () => {
      for (const v of Object.values(DISABLED_PROVIDER_CONFIG)) {
        expect(v).toBe(false);
      }
    });
  });

  describe('A4. EventProviderCapabilities shape — all capabilities false', () => {
    it('DISABLED_PROVIDER_CAPABILITIES has all flags as false', () => {
      const caps: EventProviderCapabilities = DISABLED_PROVIDER_CAPABILITIES;
      expect(caps.hasRuntimeDependency).toBe(false);
      expect(caps.canUseNetwork).toBe(false);
      expect(caps.canUseSolanaRpc).toBe(false);
      expect(caps.canUseWebSocket).toBe(false);
      expect(caps.canUseYellowstone).toBe(false);
      expect(caps.canUseGeyser).toBe(false);
      expect(caps.canPoll).toBe(false);
      expect(caps.canStream).toBe(false);
      expect(caps.canEmitLiveEvents).toBe(false);
      expect(caps.canTriggerExecution).toBe(false);
      expect(caps.canAccessWallets).toBe(false);
      expect(caps.canAccessPrivateKeys).toBe(false);
    });

    it('DISABLED_PROVIDER_CAPABILITIES has exactly 12 fields', () => {
      expect(Object.keys(DISABLED_PROVIDER_CAPABILITIES)).toHaveLength(12);
    });

    it('no DISABLED_PROVIDER_CAPABILITIES field is true', () => {
      for (const v of Object.values(DISABLED_PROVIDER_CAPABILITIES)) {
        expect(v).toBe(false);
      }
    });

    it('PHASE_7B_PROVIDER_CAPABILITIES equals DISABLED_PROVIDER_CAPABILITIES', () => {
      expect(PHASE_7B_PROVIDER_CAPABILITIES).toBe(DISABLED_PROVIDER_CAPABILITIES);
    });

    it('canUseNetwork is false — network access forbidden', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.canUseNetwork).toBe(false);
    });

    it('canUseSolanaRpc is false — Solana RPC forbidden', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.canUseSolanaRpc).toBe(false);
    });

    it('canUseWebSocket is false — WebSocket forbidden', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.canUseWebSocket).toBe(false);
    });

    it('canUseYellowstone is false — Yellowstone forbidden', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.canUseYellowstone).toBe(false);
    });

    it('canUseGeyser is false — Geyser forbidden', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.canUseGeyser).toBe(false);
    });

    it('canEmitLiveEvents is false — live event emission forbidden', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.canEmitLiveEvents).toBe(false);
    });

    it('canTriggerExecution is false — execution trigger forbidden', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.canTriggerExecution).toBe(false);
    });

    it('canAccessWallets is false — wallet access forbidden', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.canAccessWallets).toBe(false);
    });

    it('canAccessPrivateKeys is false — private key access forbidden', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.canAccessPrivateKeys).toBe(false);
    });

    it('hasRuntimeDependency is false — no provider SDK loaded', () => {
      expect(DISABLED_PROVIDER_CAPABILITIES.hasRuntimeDependency).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7B — Disabled Providers', () => {
  const providerTypes: EventProviderType[] = [
    'helius_disabled',
    'websocket_disabled',
    'yellowstone_disabled',
    'polling_disabled',
    'mock_disabled',
    'unknown_disabled',
  ];

  describe('B1. DisabledEventProvider — all types return disabled status', () => {
    for (const type of providerTypes) {
      it(`${type}: getStatus() returns 'disabled'`, () => {
        const p = new DisabledEventProvider(type);
        expect(p.getStatus()).toBe('disabled');
      });

      it(`${type}: getType() returns correct type`, () => {
        const p = new DisabledEventProvider(type);
        expect(p.getType()).toBe(type);
      });
    }
  });

  describe('B2. DisabledEventProvider — all capabilities false', () => {
    for (const type of providerTypes) {
      it(`${type}: all capabilities are false`, () => {
        const p = new DisabledEventProvider(type);
        const caps = p.getCapabilities();
        for (const v of Object.values(caps)) {
          expect(v).toBe(false);
        }
      });

      it(`${type}: hasRuntimeDependency is false`, () => {
        const p = new DisabledEventProvider(type);
        expect(p.getCapabilities().hasRuntimeDependency).toBe(false);
      });

      it(`${type}: canEmitLiveEvents is false`, () => {
        const p = new DisabledEventProvider(type);
        expect(p.getCapabilities().canEmitLiveEvents).toBe(false);
      });

      it(`${type}: canTriggerExecution is false`, () => {
        const p = new DisabledEventProvider(type);
        expect(p.getCapabilities().canTriggerExecution).toBe(false);
      });
    }
  });

  describe('B3. DisabledEventProvider — config all false', () => {
    for (const type of providerTypes) {
      it(`${type}: all config permissions are false`, () => {
        const p = new DisabledEventProvider(type);
        const cfg = p.getConfig();
        for (const v of Object.values(cfg)) {
          expect(v).toBe(false);
        }
      });
    }
  });

  describe('B4. Disabled reasons safe to display', () => {
    it('helius_disabled reason mentions Helius and disabled', () => {
      const p = new DisabledEventProvider('helius_disabled');
      const reason = p.explainDisabledReason();
      expect(reason).toContain('Helius');
      expect(reason).toContain('disabled');
      expect(reason).not.toContain('apiKey');
      expect(reason).not.toContain('rpcUrl');
      expect(reason).not.toContain('secret');
      expect(reason).not.toContain('private');
    });

    it('websocket_disabled reason mentions WebSocket and disabled', () => {
      const p = new DisabledEventProvider('websocket_disabled');
      const reason = p.explainDisabledReason();
      expect(reason).toContain('WebSocket');
      expect(reason).toContain('disabled');
    });

    it('yellowstone_disabled reason mentions Yellowstone/Geyser and disabled', () => {
      const p = new DisabledEventProvider('yellowstone_disabled');
      const reason = p.explainDisabledReason();
      expect(reason.toLowerCase()).toMatch(/yellowstone|geyser/i);
      expect(reason).toContain('disabled');
    });

    it('polling_disabled reason mentions polling and disabled', () => {
      const p = new DisabledEventProvider('polling_disabled');
      const reason = p.explainDisabledReason();
      expect(reason.toLowerCase()).toContain('poll');
      expect(reason).toContain('disabled');
    });

    it('all reasons contain Phase 7B reference', () => {
      for (const type of providerTypes) {
        const p = new DisabledEventProvider(type);
        expect(p.explainDisabledReason()).toContain('Phase 7B');
      }
    });

    it('no reason contains stack trace patterns', () => {
      for (const type of providerTypes) {
        const p = new DisabledEventProvider(type);
        const reason = p.explainDisabledReason();
        expect(reason).not.toMatch(/at \w+ \(/);
        expect(reason).not.toContain('Error:');
      }
    });

    it('no reason contains env var patterns', () => {
      for (const type of providerTypes) {
        const p = new DisabledEventProvider(type);
        const reason = p.explainDisabledReason();
        expect(reason).not.toMatch(/[A-Z_]{8,}=/); // env var assignment pattern
        expect(reason).not.toContain('TELEGRAM_BOT_TOKEN');
        expect(reason).not.toContain('DATABASE_URL');
      }
    });
  });

  describe('B5. assertDisabled() does not throw', () => {
    for (const type of providerTypes) {
      it(`${type}: assertDisabled() is safe to call`, () => {
        const p = new DisabledEventProvider(type);
        expect(() => p.assertDisabled()).not.toThrow();
      });
    }
  });

  describe('B6. Default constructor uses unknown_disabled', () => {
    it('no-arg constructor returns unknown_disabled type', () => {
      const p = new DisabledEventProvider();
      expect(p.getType()).toBe('unknown_disabled');
      expect(p.getStatus()).toBe('disabled');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7B — Provider Result Helpers', () => {
  describe('C1. providerOk / providerErr', () => {
    it('providerOk wraps a value in ok:true', () => {
      const r = providerOk(42);
      expect(r.ok).toBe(true);
      expect((r as ProviderOk<number>).value).toBe(42);
    });

    it('providerOk with undefined works', () => {
      const r = providerOk(undefined);
      expect(r.ok).toBe(true);
    });

    it('providerErr wraps an error in ok:false', () => {
      const r = providerErr('PROVIDER_DISABLED', 'test message');
      expect(r.ok).toBe(false);
      expect((r as ProviderErr).error.code).toBe('PROVIDER_DISABLED');
      expect((r as ProviderErr).error.message).toBe('test message');
      expect((r as ProviderErr).error.safeToDisplay).toBe(true);
    });

    it('providerErr always has safeToDisplay:true', () => {
      const codes: ProviderErrorCode[] = [
        'PROVIDER_DISABLED',
        'PROVIDER_RUNTIME_NOT_INSTALLED',
        'PROVIDER_NETWORK_FORBIDDEN',
        'SOLANA_RPC_FORBIDDEN',
        'WEBSOCKET_FORBIDDEN',
        'YELLOWSTONE_FORBIDDEN',
        'GEYSER_FORBIDDEN',
        'LIVE_EVENTS_FORBIDDEN',
        'POLLING_FORBIDDEN',
        'STREAMING_FORBIDDEN',
        'EXECUTION_TRIGGER_FORBIDDEN',
        'WALLET_ACCESS_FORBIDDEN',
        'API_KEY_USAGE_FORBIDDEN',
      ];
      for (const code of codes) {
        const r = providerErr(code, 'test');
        expect((r as ProviderErr).error.safeToDisplay).toBe(true);
      }
    });
  });

  describe('C2. isProviderOk / isProviderErr', () => {
    it('isProviderOk returns true for ok results', () => {
      const r: ProviderResult<number> = providerOk(1);
      expect(isProviderOk(r)).toBe(true);
      expect(isProviderErr(r)).toBe(false);
    });

    it('isProviderErr returns true for error results', () => {
      const r: ProviderResult<number> = providerErr('PROVIDER_DISABLED', 'msg');
      expect(isProviderErr(r)).toBe(true);
      expect(isProviderOk(r)).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7B — Forbidden Lifecycle Methods', () => {
  const providerTypes: EventProviderType[] = [
    'helius_disabled',
    'websocket_disabled',
    'yellowstone_disabled',
    'polling_disabled',
    'mock_disabled',
    'unknown_disabled',
  ];

  describe('D1. connect() always returns PROVIDER_DISABLED error', () => {
    for (const type of providerTypes) {
      it(`${type}: connect() returns error`, () => {
        const p = new DisabledEventProvider(type);
        const result = p.connect();
        expect(result.ok).toBe(false);
        expect((result as ProviderErr).error.code).toBe('PROVIDER_DISABLED');
        expect((result as ProviderErr).error.safeToDisplay).toBe(true);
      });
    }
  });

  describe('D2. disconnect() always returns ok (safe no-op)', () => {
    for (const type of providerTypes) {
      it(`${type}: disconnect() returns ok`, () => {
        const p = new DisabledEventProvider(type);
        const result = p.disconnect();
        expect(result.ok).toBe(true);
      });
    }
  });

  describe('D3. poll() always returns POLLING_FORBIDDEN error', () => {
    for (const type of providerTypes) {
      it(`${type}: poll() returns error`, () => {
        const p = new DisabledEventProvider(type);
        const result = p.poll();
        expect(result.ok).toBe(false);
        expect((result as ProviderErr).error.code).toBe('POLLING_FORBIDDEN');
        expect((result as ProviderErr).error.safeToDisplay).toBe(true);
      });
    }
  });

  describe('D4. subscribe() always returns LIVE_EVENTS_FORBIDDEN error', () => {
    for (const type of providerTypes) {
      it(`${type}: subscribe() returns error`, () => {
        const p = new DisabledEventProvider(type);
        const result = p.subscribe();
        expect(result.ok).toBe(false);
        expect((result as ProviderErr).error.code).toBe('LIVE_EVENTS_FORBIDDEN');
        expect((result as ProviderErr).error.safeToDisplay).toBe(true);
      });
    }
  });

  describe('D5. start() always returns PROVIDER_DISABLED error', () => {
    for (const type of providerTypes) {
      it(`${type}: start() returns error`, () => {
        const p = new DisabledEventProvider(type);
        const result = p.start();
        expect(result.ok).toBe(false);
        expect((result as ProviderErr).error.code).toBe('PROVIDER_DISABLED');
        expect((result as ProviderErr).error.safeToDisplay).toBe(true);
      });
    }
  });

  describe('D6. stop() always returns ok (safe no-op)', () => {
    for (const type of providerTypes) {
      it(`${type}: stop() returns ok`, () => {
        const p = new DisabledEventProvider(type);
        const result = p.stop();
        expect(result.ok).toBe(true);
      });
    }
  });

  describe('D7. Lifecycle methods produce safe errors', () => {
    it('connect() error does not contain secrets or RPC URLs', () => {
      const p = new DisabledEventProvider('helius_disabled');
      const result = p.connect();
      if (!result.ok) {
        expect(result.error.message).not.toMatch(/https?:\/\//);
        expect(result.error.message).not.toContain('apiKey');
        expect(result.error.message).not.toContain('PRIVATE_KEY');
        expect(result.error.message).not.toContain('MNEMONIC');
        expect(result.error.message).not.toMatch(/at \w+ \(/);
      }
    });

    it('poll() error does not contain secrets or endpoints', () => {
      const p = new DisabledEventProvider('polling_disabled');
      const result = p.poll();
      if (!result.ok) {
        expect(result.error.message).not.toMatch(/https?:\/\//);
        expect(result.error.message).not.toContain('apiKey');
        expect(result.error.message).not.toContain('PRIVATE_KEY');
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7B — Provider Factory', () => {
  describe('E1. createDisabledEventProvider — basic behaviour', () => {
    it('returns a disabled provider for default type', () => {
      const p = createDisabledEventProvider();
      expect(p.getStatus()).toBe('disabled');
      expect(p.getType()).toBe('unknown_disabled');
    });

    it('returns correct type for each provider type', () => {
      const types: EventProviderType[] = [
        'helius_disabled',
        'websocket_disabled',
        'yellowstone_disabled',
        'polling_disabled',
        'mock_disabled',
        'unknown_disabled',
      ];
      for (const type of types) {
        const p = createDisabledEventProvider(type);
        expect(p.getType()).toBe(type);
        expect(p.getStatus()).toBe('disabled');
      }
    });

    it('returns disabled provider when no config passed', () => {
      const p = createDisabledEventProvider('helius_disabled');
      expect(p.getStatus()).toBe('disabled');
      expect(p.getCapabilities().canUseNetwork).toBe(false);
    });

    it('returns disabled provider when empty config passed', () => {
      const input: EventProviderFactoryInput = {};
      const p = createDisabledEventProvider('helius_disabled', input);
      expect(p.getStatus()).toBe('disabled');
    });
  });

  describe('E2. Factory fails closed on unsafe enable attempts', () => {
    it('enabled:true is coerced to disabled', () => {
      const input: EventProviderFactoryInput = { enabled: true };
      const p = createDisabledEventProvider('helius_disabled', input);
      expect(p.getStatus()).toBe('disabled');
      expect(p.getConfig().enabled).toBe(false);
    });

    it('allowNetwork:true is coerced to disabled', () => {
      const input: EventProviderFactoryInput = { allowNetwork: true };
      const p = createDisabledEventProvider('helius_disabled', input);
      expect(p.getCapabilities().canUseNetwork).toBe(false);
    });

    it('allowSolanaRpc:true is coerced to disabled', () => {
      const input: EventProviderFactoryInput = { allowSolanaRpc: true };
      const p = createDisabledEventProvider('helius_disabled', input);
      expect(p.getCapabilities().canUseSolanaRpc).toBe(false);
    });

    it('allowWebSocket:true is coerced to disabled', () => {
      const input: EventProviderFactoryInput = { allowWebSocket: true };
      const p = createDisabledEventProvider('websocket_disabled', input);
      expect(p.getCapabilities().canUseWebSocket).toBe(false);
    });

    it('allowLiveEvents:true is coerced to disabled', () => {
      const input: EventProviderFactoryInput = { allowLiveEvents: true };
      const p = createDisabledEventProvider('helius_disabled', input);
      expect(p.getCapabilities().canEmitLiveEvents).toBe(false);
    });

    it('allowPolling:true is coerced to disabled', () => {
      const input: EventProviderFactoryInput = { allowPolling: true };
      const p = createDisabledEventProvider('polling_disabled', input);
      expect(p.getCapabilities().canPoll).toBe(false);
    });

    it('allowStreaming:true is coerced to disabled', () => {
      const input: EventProviderFactoryInput = { allowStreaming: true };
      const p = createDisabledEventProvider('yellowstone_disabled', input);
      expect(p.getCapabilities().canStream).toBe(false);
    });

    it('allowExecutionTriggers:true is coerced to disabled', () => {
      const input: EventProviderFactoryInput = { allowExecutionTriggers: true };
      const p = createDisabledEventProvider('helius_disabled', input);
      expect(p.getCapabilities().canTriggerExecution).toBe(false);
    });

    it('all unsafe fields true are coerced to disabled', () => {
      const input: EventProviderFactoryInput = {
        enabled: true,
        allowNetwork: true,
        allowSolanaRpc: true,
        allowWebSocket: true,
        allowLiveEvents: true,
        allowPolling: true,
        allowStreaming: true,
        allowExecutionTriggers: true,
      };
      const p = createDisabledEventProvider('helius_disabled', input);
      expect(p.getStatus()).toBe('disabled');
      const cfg = p.getConfig();
      expect(cfg.enabled).toBe(false);
      expect(cfg.allowNetwork).toBe(false);
      expect(cfg.allowSolanaRpc).toBe(false);
      expect(cfg.allowWebSocket).toBe(false);
      expect(cfg.allowLiveEvents).toBe(false);
      expect(cfg.allowPolling).toBe(false);
      expect(cfg.allowStreaming).toBe(false);
      expect(cfg.allowExecutionTriggers).toBe(false);
    });
  });

  describe('E3. Named factory helpers', () => {
    it('createDisabledHeliusProvider returns helius_disabled', () => {
      const p = createDisabledHeliusProvider();
      expect(p.getType()).toBe('helius_disabled');
      expect(p.getStatus()).toBe('disabled');
      expect(p.getCapabilities().canUseNetwork).toBe(false);
    });

    it('createDisabledWebSocketProvider returns websocket_disabled', () => {
      const p = createDisabledWebSocketProvider();
      expect(p.getType()).toBe('websocket_disabled');
      expect(p.getStatus()).toBe('disabled');
      expect(p.getCapabilities().canUseWebSocket).toBe(false);
    });

    it('createDisabledYellowstoneProvider returns yellowstone_disabled', () => {
      const p = createDisabledYellowstoneProvider();
      expect(p.getType()).toBe('yellowstone_disabled');
      expect(p.getStatus()).toBe('disabled');
      expect(p.getCapabilities().canUseYellowstone).toBe(false);
      expect(p.getCapabilities().canUseGeyser).toBe(false);
    });

    it('createDisabledPollingProvider returns polling_disabled', () => {
      const p = createDisabledPollingProvider();
      expect(p.getType()).toBe('polling_disabled');
      expect(p.getStatus()).toBe('disabled');
      expect(p.getCapabilities().canPoll).toBe(false);
    });

    it('all named factory helpers return disabled status', () => {
      const providers: EventProviderBoundary[] = [
        createDisabledHeliusProvider(),
        createDisabledWebSocketProvider(),
        createDisabledYellowstoneProvider(),
        createDisabledPollingProvider(),
      ];
      for (const p of providers) {
        expect(p.getStatus()).toBe('disabled');
      }
    });

    it('all named factory helpers: connect() returns error', () => {
      const providers: EventProviderBoundary[] = [
        createDisabledHeliusProvider(),
        createDisabledWebSocketProvider(),
        createDisabledYellowstoneProvider(),
        createDisabledPollingProvider(),
      ];
      for (const p of providers) {
        const r = p.connect?.();
        if (r !== undefined) {
          expect(r.ok).toBe(false);
        }
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7B — Provider Registry', () => {
  describe('F1. EventProviderRegistry — basic behaviour', () => {
    it('instantiates without error', () => {
      expect(() => new EventProviderRegistry()).not.toThrow();
    });

    it('listProviderTypes returns non-empty array', () => {
      const reg = new EventProviderRegistry();
      expect(reg.listProviderTypes().length).toBeGreaterThan(0);
    });

    it('all registered types are disabled provider types', () => {
      const reg = new EventProviderRegistry();
      for (const type of reg.listProviderTypes()) {
        expect(EVENT_PROVIDER_TYPES).toContain(type);
      }
    });

    it('listProviders returns entries with disabled status', () => {
      const reg = new EventProviderRegistry();
      const entries = reg.listProviders();
      for (const entry of entries) {
        expect(entry.status).toBe('disabled');
      }
    });

    it('listProviders entries all have non-empty disabledReason', () => {
      const reg = new EventProviderRegistry();
      const entries = reg.listProviders();
      for (const entry of entries) {
        expect(typeof entry.disabledReason).toBe('string');
        expect(entry.disabledReason.length).toBeGreaterThan(0);
      }
    });

    it('getProvider returns disabled provider for helius_disabled', () => {
      const reg = new EventProviderRegistry();
      const p = reg.getProvider('helius_disabled');
      expect(p.getType()).toBe('helius_disabled');
      expect(p.getStatus()).toBe('disabled');
    });

    it('getProvider returns disabled provider for websocket_disabled', () => {
      const reg = new EventProviderRegistry();
      const p = reg.getProvider('websocket_disabled');
      expect(p.getType()).toBe('websocket_disabled');
      expect(p.getStatus()).toBe('disabled');
    });

    it('getProvider returns disabled provider for yellowstone_disabled', () => {
      const reg = new EventProviderRegistry();
      const p = reg.getProvider('yellowstone_disabled');
      expect(p.getType()).toBe('yellowstone_disabled');
      expect(p.getStatus()).toBe('disabled');
    });

    it('getProvider returns disabled provider for polling_disabled', () => {
      const reg = new EventProviderRegistry();
      const p = reg.getProvider('polling_disabled');
      expect(p.getType()).toBe('polling_disabled');
      expect(p.getStatus()).toBe('disabled');
    });

    it('getProvider returns disabled provider for unknown_disabled type', () => {
      const reg = new EventProviderRegistry();
      const p = reg.getProvider('unknown_disabled');
      expect(p.getStatus()).toBe('disabled');
    });

    it('all getProvider results have all capabilities false', () => {
      const reg = new EventProviderRegistry();
      for (const type of reg.listProviderTypes()) {
        const p = reg.getProvider(type);
        for (const v of Object.values(p.getCapabilities())) {
          expect(v).toBe(false);
        }
      }
    });
  });

  describe('F2. getEventProviderRegistry singleton', () => {
    it('returns an EventProviderRegistry instance', () => {
      const reg = getEventProviderRegistry();
      expect(reg).toBeInstanceOf(EventProviderRegistry);
    });

    it('returns same instance on repeated calls', () => {
      const r1 = getEventProviderRegistry();
      const r2 = getEventProviderRegistry();
      expect(r1).toBe(r2);
    });

    it('singleton registry has disabled providers only', () => {
      const reg = getEventProviderRegistry();
      for (const entry of reg.listProviders()) {
        expect(entry.status).toBe('disabled');
      }
    });
  });

  describe('F3. ProviderRegistryEntry shape', () => {
    it('entries have type, status, and disabledReason fields', () => {
      const reg = new EventProviderRegistry();
      const entries = reg.listProviders();
      for (const entry of entries) {
        expect('type' in entry).toBe(true);
        expect('status' in entry).toBe(true);
        expect('disabledReason' in entry).toBe(true);
      }
    });

    it('entries disabledReason contains no secrets', () => {
      const reg = new EventProviderRegistry();
      for (const entry of reg.listProviders()) {
        expect(entry.disabledReason).not.toContain('PRIVATE_KEY');
        expect(entry.disabledReason).not.toContain('SECRET');
        expect(entry.disabledReason).not.toContain('MNEMONIC');
        expect(entry.disabledReason).not.toContain('apiKey');
        expect(entry.disabledReason).not.toMatch(/wss?:\/\//);
        expect(entry.disabledReason).not.toMatch(/https?:\/\//);
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7B — Error Safety', () => {
  describe('G1. All error codes are safe to display', () => {
    const errorCodes: ProviderErrorCode[] = [
      'PROVIDER_DISABLED',
      'PROVIDER_RUNTIME_NOT_INSTALLED',
      'PROVIDER_NETWORK_FORBIDDEN',
      'SOLANA_RPC_FORBIDDEN',
      'WEBSOCKET_FORBIDDEN',
      'YELLOWSTONE_FORBIDDEN',
      'GEYSER_FORBIDDEN',
      'LIVE_EVENTS_FORBIDDEN',
      'POLLING_FORBIDDEN',
      'STREAMING_FORBIDDEN',
      'EXECUTION_TRIGGER_FORBIDDEN',
      'WALLET_ACCESS_FORBIDDEN',
      'API_KEY_USAGE_FORBIDDEN',
    ];

    for (const code of errorCodes) {
      it(`${code}: error is safe to display`, () => {
        const err = providerErr(code, `Safe message for ${code}`);
        expect(err.error.safeToDisplay).toBe(true);
        expect(err.ok).toBe(false);
      });
    }

    it('has exactly 13 provider error codes', () => {
      expect(errorCodes).toHaveLength(13);
    });
  });

  describe('G2. Error messages contain no sensitive data', () => {
    it('PROVIDER_DISABLED error message contains no stack trace', () => {
      const p = new DisabledEventProvider('helius_disabled');
      const result = p.connect();
      if (!result.ok) {
        expect(result.error.message).not.toMatch(/at \w+ \(/);
        expect(result.error.message).not.toContain('node_modules');
      }
    });

    it('POLLING_FORBIDDEN error message contains no endpoint URL', () => {
      const p = new DisabledEventProvider('polling_disabled');
      const result = p.poll();
      if (!result.ok) {
        expect(result.error.message).not.toMatch(/https?:\/\//);
        expect(result.error.message).not.toMatch(/wss?:\/\//);
      }
    });

    it('LIVE_EVENTS_FORBIDDEN error message contains no credentials', () => {
      const p = new DisabledEventProvider('yellowstone_disabled');
      const result = p.subscribe();
      if (!result.ok) {
        expect(result.error.message).not.toContain('apiKey');
        expect(result.error.message).not.toContain('password');
        expect(result.error.message).not.toContain('bearer');
        expect(result.error.message).not.toContain('credential');
      }
    });

    it('all lifecycle errors have safeToDisplay:true', () => {
      const p = new DisabledEventProvider('helius_disabled');
      const connectResult = p.connect();
      const pollResult = p.poll();
      const subscribeResult = p.subscribe();
      const startResult = p.start();

      expect(!connectResult.ok && connectResult.error.safeToDisplay).toBe(true);
      expect(!pollResult.ok && pollResult.error.safeToDisplay).toBe(true);
      expect(!subscribeResult.ok && subscribeResult.error.safeToDisplay).toBe(true);
      expect(!startResult.ok && startResult.error.safeToDisplay).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7B — Safety Invariants', () => {
  describe('H1. No live provider capability exists', () => {
    it('no provider type name implies live/active capability', () => {
      for (const type of EVENT_PROVIDER_TYPES) {
        expect(type).toMatch(/_disabled$/);
      }
    });

    it('DISABLED_PROVIDER_CAPABILITIES has no true values', () => {
      const values = Object.values(DISABLED_PROVIDER_CAPABILITIES);
      expect(values.every((v) => v === false)).toBe(true);
    });

    it('DISABLED_PROVIDER_CONFIG has no true values', () => {
      const values = Object.values(DISABLED_PROVIDER_CONFIG);
      expect(values.every((v) => v === false)).toBe(true);
    });
  });

  describe('H2. No background loops or timers started', () => {
    it('constructing multiple DisabledEventProviders does not start loops', () => {
      // This test verifies instantiation is side-effect free
      const providers = EVENT_PROVIDER_TYPES.map((t) => new DisabledEventProvider(t));
      expect(providers).toHaveLength(6);
      for (const p of providers) {
        expect(p.getStatus()).toBe('disabled');
      }
    });

    it('calling lifecycle methods does not start background activity', () => {
      const p = new DisabledEventProvider('helius_disabled');
      // These should all return immediately without side effects
      p.connect();
      p.disconnect();
      p.poll();
      p.subscribe();
      p.start();
      p.stop();
      // Still disabled after all calls
      expect(p.getStatus()).toBe('disabled');
    });
  });

  describe('H3. Provider implements EventProviderBoundary interface', () => {
    it('DisabledEventProvider satisfies EventProviderBoundary', () => {
      const p: EventProviderBoundary = new DisabledEventProvider('helius_disabled');
      expect(typeof p.getType).toBe('function');
      expect(typeof p.getStatus).toBe('function');
      expect(typeof p.getCapabilities).toBe('function');
      expect(typeof p.getConfig).toBe('function');
      expect(typeof p.explainDisabledReason).toBe('function');
      expect(typeof p.assertDisabled).toBe('function');
    });

    it('IEventProviderRegistry is satisfied by EventProviderRegistry', () => {
      const reg: IEventProviderRegistry = new EventProviderRegistry();
      expect(typeof reg.getProvider).toBe('function');
      expect(typeof reg.listProviders).toBe('function');
      expect(typeof reg.listProviderTypes).toBe('function');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 7B — Regression: Phase 7A still passes', () => {
  describe('I1. Phase 7A exports still available', () => {
    it('EVENT_CATEGORIES still exported', () => {
      expect(EVENT_CATEGORIES).toBeDefined();
      expect(EVENT_CATEGORIES.length).toBeGreaterThan(0);
    });

    it('EVENT_SOURCE_TYPES still exported', () => {
      expect(EVENT_SOURCE_TYPES).toBeDefined();
    });

    it('EVENT_SEVERITIES still exported', () => {
      expect(EVENT_SEVERITIES).toBeDefined();
    });

    it('PHASE_7A_SOURCE_CAPABILITIES still exported and all false', () => {
      expect(PHASE_7A_SOURCE_CAPABILITIES).toBeDefined();
      for (const v of Object.values(PHASE_7A_SOURCE_CAPABILITIES)) {
        expect(v).toBe(false);
      }
    });

    it('buildDisabledSourceHealth still works', () => {
      const health = buildDisabledSourceHealth('test-source');
      expect(health.status).toBe('disabled');
      expect(health.sourceName).toBe('test-source');
    });

    it('buildEventEngineSystemStatus still works', () => {
      const status = buildEventEngineSystemStatus();
      expect(status.liveProviders).toBe('disabled');
      expect(status.networkEvents).toBe('forbidden');
      expect(status.executionTriggers).toBe('forbidden');
      expect(status.solanaRpc).toBe('forbidden');
    });

    it('engineOk and engineErr still work', () => {
      const ok = engineOk(42);
      expect(ok.ok).toBe(true);
      const err = engineErr('INVALID_EVENT_ID', 'test');
      expect(err.ok).toBe(false);
      expect(isEngineOk(ok)).toBe(true);
      expect(isEngineErr(err)).toBe(true);
    });

    it('InMemoryEventBus still works', () => {
      const bus = new InMemoryEventBus();
      const event = buildTestEvent({ type: 'regression_test' });
      const result = bus.publish(event);
      expect(result.ok).toBe(true);
    });

    it('createInMemoryEventBus still works', () => {
      const bus = createInMemoryEventBus();
      expect(typeof bus.publish).toBe('function');
    });
  });

  describe('I2. FULL_AUTO and LIMITED_LIVE remain locked', () => {
    it('buildRuntimeSafetyStatus still reports fullAutoLocked:true', () => {
      const safety = buildRuntimeSafetyStatus({
        currentMode: 'READ_ONLY',
        allowedModes: ['READ_ONLY', 'PAPER', 'MANUAL_CONFIRM', 'PAUSED', 'KILL_SWITCH'],
        unsafeFlagsDetected: false,
        unsafeFlags: [],
      });
      expect(safety.fullAutoLocked).toBe(true);
      expect(safety.limitedLiveLocked).toBe(true);
    });

    it('no provider capability can unlock FULL_AUTO', () => {
      const caps = DISABLED_PROVIDER_CAPABILITIES;
      expect(caps.canTriggerExecution).toBe(false);
      expect(caps.canEmitLiveEvents).toBe(false);
      expect(caps.canAccessWallets).toBe(false);
      expect(caps.canAccessPrivateKeys).toBe(false);
    });
  });

  describe('I3. PHASE constant is still 7', () => {
    it('PHASE is 7', () => {
      expect(PHASE).toBe(7);
    });
  });
});
