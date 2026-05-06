/**
 * apps/read-only-api/src/config.ts
 *
 * Phase 20 — Local Read-Only API config builder.
 *
 * Default host: 127.0.0.1
 * Default port: 3140
 *
 * Rejects:
 *   - 0.0.0.0
 *   - ::
 *   - localhost (not normalised to 127.0.0.1 before binding)
 *   - empty host
 *   - external hostnames
 *   - RPC-looking URLs
 *   - URL strings
 *   - unsafe ports (< 1024 or > 65535, or 0)
 */

import type { LocalReadOnlyApiConfig } from './types.js';
import { lroApiOk, lroApiErr } from './errors.js';
import type { LroApiResult } from './errors.js';

const DEFAULT_HOST = '127.0.0.1' as const;
const DEFAULT_PORT = 3140;

// ─── Forbidden hosts ─────────────────────────────────────────────────────────

const FORBIDDEN_HOSTS: readonly string[] = [
  '0.0.0.0',
  '::',
  '::0',
  '::1', // loopback IPv6 — only 127.0.0.1 allowed
  'localhost',
  '0',
];

function isExternalHostname(host: string): boolean {
  // Reject anything that looks like a URL or external hostname
  if (host.includes('://')) return true;
  if (host.includes('/')) return true;
  if (host.includes('@')) return true;
  if (host.includes('?')) return true;
  if (host.includes('#')) return true;
  // Reject any hostname that contains dots but is not 127.0.0.1
  // (i.e., domain names, RPC endpoints)
  if (host.includes('.') && host !== '127.0.0.1') return true;
  return false;
}

function isUnsafePort(port: number): boolean {
  if (!Number.isInteger(port)) return true;
  if (port <= 0 || port > 65535) return true;
  if (port < 1024) return true;
  return false;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface CreateReadOnlyApiConfigInput {
  readonly host?: string;
  readonly port?: number;
}

/**
 * Creates a safe, validated LocalReadOnlyApiConfig.
 *
 * Host must be exactly '127.0.0.1'.
 * Port must be in range [1024, 65535].
 * Rejects external hosts, 0.0.0.0, ::, localhost, URL-looking strings, RPC endpoints.
 */
export function createReadOnlyApiConfig(
  input?: CreateReadOnlyApiConfigInput,
): LroApiResult<LocalReadOnlyApiConfig> {
  const host = input?.host ?? DEFAULT_HOST;
  const port = input?.port ?? DEFAULT_PORT;

  if (!host || host.trim().length === 0) {
    return lroApiErr('UNSAFE_HOST_REJECTED', 'Host must not be empty');
  }

  const trimmedHost = host.trim().toLowerCase();

  if (FORBIDDEN_HOSTS.includes(trimmedHost)) {
    return lroApiErr(
      'EXTERNAL_BIND_FORBIDDEN',
      `Host '${host}' is forbidden. Only 127.0.0.1 is allowed.`,
    );
  }

  if (isExternalHostname(trimmedHost)) {
    return lroApiErr(
      'EXTERNAL_BIND_FORBIDDEN',
      `Host '${host}' looks like an external hostname or URL. Only 127.0.0.1 is allowed.`,
    );
  }

  if (trimmedHost !== '127.0.0.1') {
    return lroApiErr(
      'EXTERNAL_BIND_FORBIDDEN',
      `Host '${host}' is not allowed. Only 127.0.0.1 is allowed.`,
    );
  }

  if (isUnsafePort(port)) {
    return lroApiErr(
      'UNSAFE_PORT_REJECTED',
      `Port ${port} is not allowed. Port must be an integer in range [1024, 65535].`,
    );
  }

  return lroApiOk({
    host: '127.0.0.1',
    port,
    fixtureOnly: true,
    readOnly: true,
    localOnly: true,
  });
}
