# Event Engine — Phase 7A/7B

## Overview

Phase 7A introduces the `@sonic/event-engine` package: local, in-memory event infrastructure for the Sonic Solana Auto-Trader.

This is the foundation for future read-only event capture. It is entirely local — no network calls, no Solana RPC, no live providers, no wallet handling.

---

## Scope

### What Phase 7A provides

- Event category, source, and severity type definitions
- `EventEnvelope` — the canonical event container
- `EventSourceCapabilities` — all live/network/execution flags are `false`
- `EventSourceHealth` and `EventEngineSystemStatus` — read-only status models
- `IEventBus` interface and `InMemoryEventBus` implementation
- Bounded event history (default 1000 entries, configurable up to 10,000)
- Subscribe/unsubscribe with handler failure isolation
- `DedupeStore` — in-memory TTL-based deduplication
- `isEventExpired` / `buildDedupeKey` — TTL and key helpers
- `validateEventEnvelope` — full event validation
- Safe error/result model (`EventEngineResult`, `EventEngineError`)
- `buildEventEngineSystemStatus` — system-level status summary

### What Phase 7A does NOT provide

- Solana RPC connections
- Helius, QuickNode, Triton, Alchemy integrations
- WebSocket providers
- Yellowstone / Geyser
- Live market data ingestion
- Token launch detection
- Wallet / private key handling
- Transaction construction, signing, or sending
- Trade execution or swap logic
- Jito integration
- FULL_AUTO or LIMITED_LIVE unlock

---

## Architecture

```
packages/event-engine/
  src/
    types.ts              — EventCategory, EventSourceType, EventSeverity
    event-envelope.ts     — EventEnvelope, EventPayload
    source-status.ts      — EventSourceStatus, EventSourceCapabilities, EventSourceHealth
    errors.ts             — EventEngineErrorCode, EventEngineError, EventEngineResult
    event-bus.ts          — IEventBus interface, SubscriptionId, EventBusStats
    in-memory-event-bus.ts — InMemoryEventBus implementation, buildTestEvent
    dedupe.ts             — DedupeStore, isEventExpired, buildDedupeKey
    validation.ts         — validateEventEnvelope and helper validators
    index.ts              — public barrel
```

No dependency on other `@sonic/*` packages. No app, worker, Telegram, RPC, Solana SDK, Pump SDK, or wallet dependencies.

---

## Event Envelope

Every event published to the bus must conform to `EventEnvelope`:

| Field           | Type              | Required | Notes                                           |
|-----------------|-------------------|----------|-------------------------------------------------|
| `id`            | `string`          | Yes      | Non-empty unique identifier                     |
| `category`      | `EventCategory`   | Yes      | Domain classification                           |
| `type`          | `string`          | Yes      | Non-empty, no whitespace                        |
| `source`        | `EventSourceType` | Yes      | Origin system                                   |
| `severity`      | `EventSeverity`   | Yes      | debug / info / warn / error / critical          |
| `timestamp`     | `string`          | Yes      | ISO-8601, not in the future                     |
| `dedupeKey`     | `string`          | No       | Non-empty string when present                   |
| `ttlMs`         | `number`          | No       | Positive integer when present                   |
| `payload`       | `EventPayload`    | Yes      | Plain serializable object, max 10 KB, no secrets|
| `safeToPersist` | `boolean`         | Yes      | May be written to audit store                   |
| `safeToDisplay` | `boolean`         | Yes      | May be shown in logs or Telegram                |

Payload constraints:
- Must be a plain `Record<string, ...>` — no class instances, no `Error`, no functions
- No circular references
- No raw secrets, private keys, tokens, or credentials
- Max 10,240 characters when JSON-serialized

---

## Event Categories

| Category        | Description                                  | Phase 7A Network? |
|-----------------|----------------------------------------------|-------------------|
| `system`        | Internal system lifecycle events             | None              |
| `config`        | Configuration change notifications           | None              |
| `mode`          | Mode transitions                             | None              |
| `safety`        | Safety status changes                        | None              |
| `audit`         | Audit log notifications                      | None              |
| `pump_adapter`  | Pump adapter state events                    | None              |
| `future_chain`  | Placeholder — no provider in Phase 7A        | Forbidden         |
| `future_market` | Placeholder — no provider in Phase 7A        | Forbidden         |
| `unknown`       | Fallback                                     | None              |

`future_chain` and `future_market` are structural placeholders only. They carry no network behaviour and must not trigger any provider logic in Phase 7A.

---

## Event Bus Behaviour

### Publishing

```typescript
const bus = createInMemoryEventBus();
const result = bus.publish(envelope);
if (!result.ok) console.error(result.error.code);
```

- Validates the envelope before accepting it
- On validation failure: returns `EventEngineErr`, event is not added to history
- On success: dispatches to all registered handlers, adds to bounded history
- Returns `EventEngineOk<void>` on success

### Subscribing

```typescript
const id = bus.subscribe(event => {
  console.log(event.type);
});
// Later:
bus.unsubscribe(id);
```

- `subscribe` returns a `SubscriptionId` string
- `unsubscribe` is idempotent — safe to call multiple times or with unknown IDs
- Handler failures are caught and isolated — one failing handler does not crash the bus or prevent others from running

### History

```typescript
const recent = bus.getRecent(10); // last 10 events
```

- History is bounded (default 1000, min 1, max 10,000)
- When full, oldest entry is evicted
- `getRecent(limit)` returns up to `limit` most recent events, newest last

### Stats

```typescript
const stats = bus.getStats();
// { totalPublished, totalRejected, totalHandlerCalls, totalHandlerFailures, subscriberCount, historySize }
```

---

## Deduplication & TTL

### DedupeStore

```typescript
const store = new DedupeStore();
store.isDuplicate('key', 5000); // first call → false (registers key)
store.isDuplicate('key', 5000); // within 5s → true (duplicate)
// After 5s:
store.isDuplicate('key', 5000); // → false (TTL expired, re-registers)
```

- Inject a clock function for deterministic testing
- `prune()` removes all expired entries
- `clear()` clears all entries

### isEventExpired

```typescript
isEventExpired(event.timestamp, event.ttlMs!); // true if age >= ttlMs
```

### buildDedupeKey

```typescript
buildDedupeKey('system', 'startup'); // → 'system:startup'
buildDedupeKey('mode', 'change', 'READ_ONLY'); // → 'mode:change:READ_ONLY'
```

---

## Safety

All source capability flags are `false` in Phase 7A:

```typescript
PHASE_7A_SOURCE_CAPABILITIES = {
  canUseNetwork: false,
  canUseSolanaRpc: false,
  canEmitLiveEvents: false,
  canTriggerExecution: false,
  canAccessWallets: false,
}
```

System status:

```typescript
buildEventEngineSystemStatus() → {
  coreEventBus: 'available',
  liveProviders: 'disabled',
  networkEvents: 'forbidden',
  executionTriggers: 'forbidden',
  solanaRpc: 'forbidden',
  phase: 7,
}
```

`FULL_AUTO` and `LIMITED_LIVE` remain locked. `RuntimeSafetyStatus` still returns all unsafe capability flags as `false`.

---

## Error Codes

| Code                          | When                                               |
|-------------------------------|----------------------------------------------------|
| `INVALID_EVENT_ID`            | id is empty or missing                             |
| `INVALID_EVENT_CATEGORY`      | category is not a known EventCategory              |
| `INVALID_EVENT_TYPE`          | type is empty or contains whitespace               |
| `INVALID_EVENT_SOURCE`        | source is not a known EventSourceType              |
| `INVALID_EVENT_SEVERITY`      | severity is not a known EventSeverity              |
| `INVALID_EVENT_TIMESTAMP`     | timestamp is not parseable or is in the future     |
| `UNSAFE_EVENT_PAYLOAD`        | payload contains functions, class instances, etc.  |
| `EVENT_PAYLOAD_TOO_LARGE`     | payload exceeds 10,240 characters when serialized  |
| `NETWORK_EVENTS_FORBIDDEN`    | attempt to use a network event source              |
| `LIVE_PROVIDER_FORBIDDEN`     | attempt to use a live provider                     |
| `EXECUTION_TRIGGER_FORBIDDEN` | attempt to trigger execution                       |
| `INVALID_DEDUPE_KEY`          | dedupeKey is empty string when present             |
| `INVALID_TTL`                 | ttlMs is non-positive or non-integer when present  |

All errors have `safeToDisplay: true`. No stack traces or secrets are included.

---

---

## Phase 7B: Disabled Provider Boundaries

Phase 7B extends `packages/event-engine` with disabled read-only provider boundaries for future event providers.

### What Phase 7B provides

- `EventProviderType` — 6 disabled provider type values (helius_disabled, websocket_disabled, yellowstone_disabled, polling_disabled, mock_disabled, unknown_disabled)
- `EventProviderStatus` — 5 provider status values (disabled, unavailable, unsupported, mock_only, future_not_available)
- `EventProviderConfig` — provider config model; all 8 live/network/execution permission fields permanently `false`
- `EventProviderCapabilities` — provider capability model; all 12 capability flags permanently `false`
- `DISABLED_PROVIDER_CONFIG` / `DISABLED_PROVIDER_CAPABILITIES` / `PHASE_7B_PROVIDER_CAPABILITIES` — authoritative constants
- `ProviderErrorCode` — 13 safe provider error codes (PROVIDER_DISABLED, SOLANA_RPC_FORBIDDEN, WEBSOCKET_FORBIDDEN, etc.)
- `ProviderError` / `ProviderResult<T>` — safe provider result/error types, all with `safeToDisplay: true`
- `EventProviderBoundary` — interface for disabled provider boundaries
- `DisabledEventProvider` — single disabled implementation; returns disabled status, all caps false, safe errors from lifecycle methods
- `createDisabledEventProvider` — factory; always returns disabled provider; unsafe enable attempts are coerced to disabled (fail-closed)
- `createDisabledHeliusProvider` / `createDisabledWebSocketProvider` / `createDisabledYellowstoneProvider` / `createDisabledPollingProvider` — named factory helpers
- `EventProviderRegistry` / `getEventProviderRegistry` — registry of disabled providers; all entries disabled
- 195 new tests in `tests/phase7b.test.ts` — 862 total, all passing

### What Phase 7B does NOT provide

- Helius SDK or Helius runtime integration
- WebSocket client or WebSocket runtime integration
- Yellowstone / Geyser packages or gRPC runtime integration
- Solana RPC connections or `@solana/web3.js`
- Live polling, live streaming, live market data ingestion
- Live chain events or token launch detection
- Provider API keys or RPC URL usage for live connections
- Wallet / private key handling
- Transaction construction, signing, or sending
- Trade execution or swap logic
- Jito integration
- FULL_AUTO or LIMITED_LIVE unlock
- New Telegram event-stream or trade commands

### Phase 7B Architecture

```
packages/event-engine/src/
  provider-types.ts        — EventProviderType, EventProviderStatus
  provider-capabilities.ts — EventProviderConfig, EventProviderCapabilities,
                             DISABLED_PROVIDER_CONFIG, DISABLED_PROVIDER_CAPABILITIES,
                             PHASE_7B_PROVIDER_CAPABILITIES
  disabled-provider.ts     — ProviderErrorCode, ProviderError, ProviderResult<T>,
                             EventProviderBoundary interface, DisabledEventProvider class
  provider-factory.ts      — createDisabledEventProvider + named helpers
  provider-registry.ts     — EventProviderRegistry, getEventProviderRegistry
```

### Phase 7B Safety

All provider capability flags are `false`:

```typescript
PHASE_7B_PROVIDER_CAPABILITIES = {
  hasRuntimeDependency: false,
  canUseNetwork: false,
  canUseSolanaRpc: false,
  canUseWebSocket: false,
  canUseYellowstone: false,
  canUseGeyser: false,
  canPoll: false,
  canStream: false,
  canEmitLiveEvents: false,
  canTriggerExecution: false,
  canAccessWallets: false,
  canAccessPrivateKeys: false,
}
```

All provider config permissions are `false`:

```typescript
DISABLED_PROVIDER_CONFIG = {
  enabled: false,
  allowNetwork: false,
  allowSolanaRpc: false,
  allowWebSocket: false,
  allowLiveEvents: false,
  allowPolling: false,
  allowStreaming: false,
  allowExecutionTriggers: false,
}
```

### Phase 7B Provider Error Codes

| Code                          | When                                                    |
|-------------------------------|---------------------------------------------------------|
| `PROVIDER_DISABLED`           | connect/start called on disabled provider               |
| `PROVIDER_RUNTIME_NOT_INSTALLED` | provider SDK not installed (always true in Phase 7B) |
| `PROVIDER_NETWORK_FORBIDDEN`  | network access attempted                                |
| `SOLANA_RPC_FORBIDDEN`        | Solana RPC access attempted                             |
| `WEBSOCKET_FORBIDDEN`         | WebSocket connection attempted                          |
| `YELLOWSTONE_FORBIDDEN`       | Yellowstone gRPC access attempted                       |
| `GEYSER_FORBIDDEN`            | Geyser access attempted                                 |
| `LIVE_EVENTS_FORBIDDEN`       | subscribe/live events attempted                         |
| `POLLING_FORBIDDEN`           | poll() called on disabled provider                      |
| `STREAMING_FORBIDDEN`         | streaming attempted                                     |
| `EXECUTION_TRIGGER_FORBIDDEN` | execution trigger attempted                             |
| `WALLET_ACCESS_FORBIDDEN`     | wallet access attempted                                 |
| `API_KEY_USAGE_FORBIDDEN`     | API key usage attempted                                 |

All errors have `safeToDisplay: true`. No stack traces, no RPC URLs, no API keys, no secrets.

---

## Future Phases

- **Phase 7B** adds disabled read-only provider boundaries (Helius, Yellowstone, WebSocket, polling) — structurally present but not connected, no SDK loaded (complete)
- **Phase 7C** may add controlled mock providers or replayable fixture events — still without live providers, still no network, no Solana RPC, no execution
- Market data ingestion, wallet handling, signing, sending, and execution remain forbidden until explicit future phase unlocks after full safety gate validation

---

## Testing

```
tests/phase7a.test.ts — 119 tests
tests/phase7b.test.ts — 195 tests
```

Coverage (Phase 7A): types/models, event bus publish/reject/subscribe/unsubscribe/failure isolation/bounded history/stats, dedupe/TTL, validation/errors, safety capability checks, regression.

Coverage (Phase 7B): provider types/status/config/capability shapes, all capability flags false, disabled providers for all 4 types, lifecycle methods return disabled/forbidden, factory fail-closed on unsafe inputs, registry lists disabled providers only, error safety (no stack traces/secrets), regression.

No network, no Solana RPC, no wallet, no private keys required.
