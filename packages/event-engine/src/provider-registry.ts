/**
 * Phase 7B — Provider registry.
 *
 * Maintains a registry of disabled event provider boundaries.
 * All registered providers are permanently disabled.
 * No provider is started, connected, or given live capability.
 *
 * Safety invariants:
 *   - All registered providers are DisabledEventProvider instances.
 *   - getProvider() never returns a live or network-capable provider.
 *   - listProviders() returns only disabled status entries.
 *   - No SDK is loaded. No network calls are made.
 */

import type { EventProviderType, EventProviderStatus } from './provider-types.js';
import type { EventProviderBoundary } from './disabled-provider.js';
import { DisabledEventProvider } from './disabled-provider.js';

/**
 * A read-only snapshot of a registered provider's status.
 */
export interface ProviderRegistryEntry {
  /** The provider type classification. */
  readonly type: EventProviderType;
  /** The provider operational status. Always 'disabled' in Phase 7B. */
  readonly status: EventProviderStatus;
  /** Human-readable explanation of why this provider is disabled. Safe to display. */
  readonly disabledReason: string;
}

/**
 * Interface for the event provider registry.
 */
export interface IEventProviderRegistry {
  /** Get the provider boundary for a given type. Always returns a disabled provider. */
  getProvider(type: EventProviderType): EventProviderBoundary;
  /** List all registered provider status entries. All entries are disabled. */
  listProviders(): readonly ProviderRegistryEntry[];
  /** List all registered provider types. */
  listProviderTypes(): readonly EventProviderType[];
}

/**
 * The set of provider types registered by default.
 * All are disabled in Phase 7B.
 */
const DEFAULT_PROVIDER_TYPES: readonly EventProviderType[] = [
  'helius_disabled',
  'websocket_disabled',
  'yellowstone_disabled',
  'polling_disabled',
  'mock_disabled',
] as const;

/**
 * Registry of disabled event provider boundaries.
 *
 * Pre-registers all known disabled provider types on construction.
 * All providers are permanently disabled — no live or network capability.
 */
export class EventProviderRegistry implements IEventProviderRegistry {
  private readonly _providers: Map<EventProviderType, DisabledEventProvider>;

  constructor() {
    this._providers = new Map();
    for (const type of DEFAULT_PROVIDER_TYPES) {
      this._providers.set(type, new DisabledEventProvider(type));
    }
  }

  /**
   * Get the provider boundary for the given type.
   * Returns a disabled provider for known types.
   * Returns an 'unknown_disabled' provider for unrecognised types.
   */
  getProvider(type: EventProviderType): EventProviderBoundary {
    return this._providers.get(type) ?? new DisabledEventProvider('unknown_disabled');
  }

  /**
   * List all registered provider status entries.
   * All entries report 'disabled' status.
   */
  listProviders(): readonly ProviderRegistryEntry[] {
    return [...this._providers.values()].map((p) => ({
      type: p.getType(),
      status: p.getStatus(),
      disabledReason: p.explainDisabledReason(),
    }));
  }

  /**
   * List all registered provider types.
   */
  listProviderTypes(): readonly EventProviderType[] {
    return [...this._providers.keys()];
  }
}

let _sharedRegistry: EventProviderRegistry | null = null;

/**
 * Get the shared event provider registry singleton.
 * All registered providers are disabled.
 */
export function getEventProviderRegistry(): EventProviderRegistry {
  if (_sharedRegistry === null) {
    _sharedRegistry = new EventProviderRegistry();
  }
  return _sharedRegistry;
}
