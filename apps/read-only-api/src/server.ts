/**
 * apps/read-only-api/src/server.ts
 *
 * Phase 20 — Explicit server start function.
 *
 * startReadOnlyApiServer() must be called explicitly.
 * It NEVER auto-starts on import.
 * It ONLY binds to 127.0.0.1 (enforced before listen).
 * It REJECTS all external bind hosts before calling listen.
 *
 * Usage:
 *   import { startReadOnlyApiServer } from '@sonic/read-only-api';
 *   const server = await startReadOnlyApiServer({ host: '127.0.0.1', port: 3140 });
 *   // ...
 *   await server.close();
 */

import type { FastifyInstance } from 'fastify';
import { createReadOnlyApiApp } from './app.js';
import { createReadOnlyApiConfig } from './config.js';
import { validateLocalReadOnlyApiConfig } from './safety.js';
import type { LocalReadOnlyApiConfig } from './types.js';
import type { CreateReadOnlyApiConfigInput } from './config.js';

/**
 * Explicitly starts the local read-only API server.
 * Validates config safety before calling listen.
 * Binds only to 127.0.0.1.
 * Must NOT be called automatically on import.
 *
 * @param configInput Optional config input. Defaults to 127.0.0.1:3140.
 * @returns The listening FastifyInstance.
 * @throws Error if config is unsafe or listen fails.
 */
export async function startReadOnlyApiServer(
  configInput?: CreateReadOnlyApiConfigInput,
): Promise<FastifyInstance> {
  // Build config
  const configResult = createReadOnlyApiConfig(configInput);
  if (!configResult.ok) {
    throw new Error(
      `startReadOnlyApiServer: config rejected: [${configResult.code}] ${configResult.message}`,
    );
  }

  const config: LocalReadOnlyApiConfig = configResult.value;

  // Validate safety invariants before listening
  const safetyResult = validateLocalReadOnlyApiConfig(config);
  if (!safetyResult.ok) {
    throw new Error(
      `startReadOnlyApiServer: safety validation failed: [${safetyResult.code}] ${safetyResult.message}`,
    );
  }

  // Create Fastify app (does not listen)
  const app = await createReadOnlyApiApp(config);

  // Only 127.0.0.1 is allowed — enforced here as final guard
  if (config.host !== '127.0.0.1') {
    throw new Error(
      `startReadOnlyApiServer: forbidden host '${config.host}'. Only 127.0.0.1 is allowed.`,
    );
  }

  await app.listen({ host: config.host, port: config.port });

  return app;
}
