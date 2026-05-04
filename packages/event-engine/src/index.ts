/**
 * Phase 7A — @sonic/event-engine public API barrel.
 *
 * Exports all Phase 7A event engine types, interfaces, and implementations.
 *
 * What this package provides:
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
 * What this package does NOT provide (Phase 7A):
 *   - No Solana RPC
 *   - No Helius / WebSocket / Yellowstone providers
 *   - No live market data ingestion
 *   - No wallet / private key handling
 *   - No transaction construction / signing / sending
 *   - No trade execution
 */

export * from './types.js';
export * from './event-envelope.js';
export * from './source-status.js';
export * from './errors.js';
export * from './event-bus.js';
export * from './in-memory-event-bus.js';
export * from './dedupe.js';
export * from './validation.js';
