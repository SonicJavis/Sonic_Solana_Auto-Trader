/**
 * apps/read-only-api/src/app.ts
 *
 * Phase 20 — Local Read-Only API Fastify app factory.
 *
 * Creates a Fastify instance with GET-only read-only routes registered.
 * Does NOT auto-start or listen on any port.
 * Must not import live provider or execution packages.
 *
 * Usage:
 *   const app = await createReadOnlyApiApp();
 *   // Use with inject() in tests — no real port opened.
 *   // For actual server: call startReadOnlyApiServer(config) explicitly.
 */

import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { registerReadOnlyApiRoutes } from './routes.js';
import { createReadOnlyApiConfig } from './config.js';
import type { LocalReadOnlyApiConfig } from './types.js';

/**
 * Creates a Fastify instance with all safe GET-only read-only routes registered.
 *
 * Does NOT listen — caller must call app.listen() explicitly and only after
 * safe host validation. Designed for use with Fastify inject() in tests.
 *
 * @param config Optional config. Defaults to 127.0.0.1:3140 if not provided.
 */
export async function createReadOnlyApiApp(
  _config?: LocalReadOnlyApiConfig,
): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });

  await registerReadOnlyApiRoutes(app);

  return app;
}

/**
 * Creates a default config and returns a Fastify app instance.
 * Exported for convenience — tests should use this with inject().
 */
export function getDefaultConfig(): LocalReadOnlyApiConfig {
  const result = createReadOnlyApiConfig();
  if (!result.ok) {
    throw new Error(`Failed to create default config: ${result.message}`);
  }
  return result.value;
}
