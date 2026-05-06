/**
 * apps/read-only-api/src/routes.ts
 *
 * Phase 21 — Local Read-Only API route registration (extends Phase 20).
 *
 * Registers GET-only read-only routes on the Fastify instance.
 * Phase 21: passes query parameters to handlers for filter/sort/pagination.
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
 *
 * Phase 21: /dashboard, /dashboard/evidence, /dashboard/safety accept
 * optional query params: limit, offset, cursor, severity, panel, sourceKind,
 * classification, status, sortBy, sortDirection.
 */
export async function registerReadOnlyApiRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => handleHealth());

  app.get('/capabilities', async () => handleCapabilities());

  app.get('/contracts', async () => handleContracts());

  app.get('/contracts/openapi-shape', async () => handleContractsOpenApiShape());

  app.get('/dashboard', async req => handleDashboard(req.query));

  app.get('/dashboard/overview', async () => handleDashboardOverview());

  app.get('/dashboard/replay', async () => handleDashboardReplay());

  app.get('/dashboard/strategy', async () => handleDashboardStrategy());

  app.get('/dashboard/evaluation', async () => handleDashboardEvaluation());

  app.get('/dashboard/evidence', async req => handleDashboardEvidence(req.query));

  app.get('/dashboard/safety', async req => handleDashboardSafety(req.query));
}
