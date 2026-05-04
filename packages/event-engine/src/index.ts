/**
 * Phase 7A/7B/7C — @sonic/event-engine public API barrel.
 *
 * Exports all Phase 7A, 7B, and 7C event engine types, interfaces, and implementations.
 *
 * What this package provides:
 *   Phase 7A:
 *   - EventEnvelope, EventPayload types
 *   - EventCategory, EventSourceType, EventSeverity literals + constants
 *   - EventSourceStatus, EventSourceCapabilities, EventSourceHealth
 *   - EventEngineError, EventEngineResult, error codes + helpers
 *   - IEventBus interface + subscription types
 *   - InMemoryEventBus implementation
 *   - DedupeStore + TTL/expiry helpers
 *   - Validation helpers
 *   - Event engine system status model
 *
 *   Phase 7B:
 *   - EventProviderType (6 disabled variants)
 *   - EventProviderCapabilities (12 false flags)
 *   - PHASE_7B_PROVIDER_CAPABILITIES constant
 *   - DisabledEventProvider interface + createDisabledEventProvider (fail-closed)
 *   - EventProviderBoundary interface
 *   - EventProviderRegistry interface + buildDisabledProviderRegistry()
 *
 *   Phase 7C:
 *   - MockProviderStatus, MockProviderCapabilities, MOCK_PROVIDER_CAPABILITIES
 *   - ControlledMockProvider interface + createControlledMockProvider()
 *   - FixtureEvent, validateFixtureEvent
 *   - Built-in fixture events (FIXTURE_SYSTEM_STARTUP, etc.)
 *   - FixtureSequence, validateFixtureSequence, buildFixtureSequence
 *   - BUILTIN_SEQUENCE_ALL
 *   - ReplayStatus, ReplayStats, ReplayResult
 *   - replayFixtureSequence, replayAndCollect
 *
 * What this package does NOT provide:
 *   - No Solana RPC
 *   - No Helius / WebSocket / Yellowstone / Geyser providers
 *   - No live market data ingestion
 *   - No wallet / private key handling
 *   - No transaction construction / signing / sending
 *   - No trade execution
 *   - No network calls of any kind
 */

export * from './types.js';
export * from './event-envelope.js';
export * from './source-status.js';
export * from './errors.js';
export * from './event-bus.js';
export * from './in-memory-event-bus.js';
export * from './dedupe.js';
export * from './validation.js';
// Phase 7B: disabled provider boundaries
export * from './disabled-provider.js';
// Phase 7C: mock providers and fixture replay
export * from './replay-types.js';
export * from './fixture-events.js';
export * from './fixture-sequence.js';
export * from './mock-provider.js';
export * from './replay-controller.js';
