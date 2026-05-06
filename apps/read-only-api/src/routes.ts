/**
 * apps/read-only-api/src/routes.ts
 *
 * Phase 20 — Local Read-Only API route registration.
 *
 * Registers GET-only read-only routes on the Fastify instance.
 * All routes return deterministic fixture/contract data.
 * No POST/PUT/PATCH/DELETE handlers.
 * No mutations. No live data. No network calls.
 */

import type { FastifyInstance } from 'fastify';
import {
  handleHealth,
  handleCapabilities,
  handleContracts,
  handleContractsOpenApiShape,
  handleDashboard,
  handleDashboardOverview,
  handleDashboardReplay,
  handleDashboardStrategy,
  handleDashboardEvaluation,
  handleDashboardEvidence,
  handleDashboardSafety,
} from './handlers.js';

/**
 * Registers all GET-only read-only routes on the provided Fastify instance.
 *
 * Routes registered:
 *   GET /health
 *   GET /capabilities
 *   GET /contracts
 *   GET /contracts/openapi-shape
 *   GET /dashboard
 *   GET /dashboard/overview
 *   GET /dashboard/replay
 *   GET /dashboard/strategy
 *   GET /dashboard/evaluation
 *   GET /dashboard/evidence
 *   GET /dashboard/safety
 */
export async function registerReadOnlyApiRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => handleHealth());

  app.get('/capabilities', async () => handleCapabilities());

  app.get('/contracts', async () => handleContracts());

  app.get('/contracts/openapi-shape', async () => handleContractsOpenApiShape());

  app.get('/dashboard', async () => handleDashboard());

  app.get('/dashboard/overview', async () => handleDashboardOverview());

  app.get('/dashboard/replay', async () => handleDashboardReplay());

  app.get('/dashboard/strategy', async () => handleDashboardStrategy());

  app.get('/dashboard/evaluation', async () => handleDashboardEvaluation());

  app.get('/dashboard/evidence', async () => handleDashboardEvidence());

  app.get('/dashboard/safety', async () => handleDashboardSafety());
}
