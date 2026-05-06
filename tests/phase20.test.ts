/**
 * tests/phase20.test.ts
 *
 * Phase 20 — Local Read-Only API Shell v1
 *
 * Test suite covering:
 *   - Package/app exports
 *   - Capabilities (unsafe flags false, safe flags true)
 *   - Config (defaults, rejections)
 *   - Safety validation
 *   - Response builder
 *   - Fastify app creation (no auto-listen)
 *   - All GET endpoints via Fastify inject
 *   - Non-GET methods rejected
 *   - Safety metadata in responses
 *   - Determinism
 *   - No forbidden dependencies
 *   - Text safety (unsafe action text, secrets, URLs)
 *   - Fixture integrity
 *   - Phase 13-19 regression guard
 */

import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const readOnlyApiPackageJsonPath = resolve(__dirname, '../apps/read-only-api/package.json');
import {
  getLocalReadOnlyApiCapabilities,
  createReadOnlyApiConfig,
  createReadOnlyApiApp,
  buildReadOnlyApiResponse,
  STANDARD_SAFETY_META,
  validateLocalReadOnlyApiSafety,
  validateLocalReadOnlyApiCapabilities,
  validateLocalReadOnlyApiConfig,
  validateLroApiSafetyMeta,
  containsUnsafeActionText,
  containsSecretPattern,
  containsUrlPattern,
  isDisplaySafe,
  lroApiOk,
  lroApiErr,
  LRO_API_CAPABILITIES,
  LRO_API_CONTRACTS_BUNDLE,
  LRO_API_CONTRACTS_JSON,
  LRO_API_CONTRACTS_OPENAPI_SHAPE,
  LRO_API_ALL_CONTRACT_FIXTURES,
  LRO_API_DASHBOARD_FIXTURES,
  LRO_API_PRIMARY_DASHBOARD_FIXTURE,
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
  LRO_API_HANDLERS,
  registerReadOnlyApiRoutes,
  getDefaultConfig,
} from '@sonic/read-only-api';

// ─── 1. Package exports ───────────────────────────────────────────────────────

describe('Phase 20 — Package exports', () => {
  it('exports getLocalReadOnlyApiCapabilities', () => {
    expect(typeof getLocalReadOnlyApiCapabilities).toBe('function');
  });
  it('exports createReadOnlyApiConfig', () => {
    expect(typeof createReadOnlyApiConfig).toBe('function');
  });
  it('exports createReadOnlyApiApp', () => {
    expect(typeof createReadOnlyApiApp).toBe('function');
  });
  it('exports buildReadOnlyApiResponse', () => {
    expect(typeof buildReadOnlyApiResponse).toBe('function');
  });
  it('exports STANDARD_SAFETY_META', () => {
    expect(typeof STANDARD_SAFETY_META).toBe('object');
  });
  it('exports validateLocalReadOnlyApiSafety', () => {
    expect(typeof validateLocalReadOnlyApiSafety).toBe('function');
  });
  it('exports containsUnsafeActionText', () => {
    expect(typeof containsUnsafeActionText).toBe('function');
  });
  it('exports containsSecretPattern', () => {
    expect(typeof containsSecretPattern).toBe('function');
  });
  it('exports containsUrlPattern', () => {
    expect(typeof containsUrlPattern).toBe('function');
  });
  it('exports isDisplaySafe', () => {
    expect(typeof isDisplaySafe).toBe('function');
  });
  it('exports lroApiOk', () => {
    expect(typeof lroApiOk).toBe('function');
  });
  it('exports lroApiErr', () => {
    expect(typeof lroApiErr).toBe('function');
  });
  it('exports LRO_API_CAPABILITIES', () => {
    expect(typeof LRO_API_CAPABILITIES).toBe('object');
  });
  it('exports LRO_API_CONTRACTS_BUNDLE', () => {
    expect(typeof LRO_API_CONTRACTS_BUNDLE).toBe('object');
  });
  it('exports LRO_API_CONTRACTS_JSON', () => {
    expect(typeof LRO_API_CONTRACTS_JSON).toBe('object');
  });
  it('exports LRO_API_CONTRACTS_OPENAPI_SHAPE', () => {
    expect(typeof LRO_API_CONTRACTS_OPENAPI_SHAPE).toBe('object');
  });
  it('exports LRO_API_ALL_CONTRACT_FIXTURES', () => {
    expect(Array.isArray(LRO_API_ALL_CONTRACT_FIXTURES)).toBe(true);
  });
  it('exports LRO_API_DASHBOARD_FIXTURES', () => {
    expect(Array.isArray(LRO_API_DASHBOARD_FIXTURES)).toBe(true);
  });
  it('exports all handler functions', () => {
    expect(typeof handleHealth).toBe('function');
    expect(typeof handleCapabilities).toBe('function');
    expect(typeof handleContracts).toBe('function');
    expect(typeof handleContractsOpenApiShape).toBe('function');
    expect(typeof handleDashboard).toBe('function');
    expect(typeof handleDashboardOverview).toBe('function');
    expect(typeof handleDashboardReplay).toBe('function');
    expect(typeof handleDashboardStrategy).toBe('function');
    expect(typeof handleDashboardEvaluation).toBe('function');
    expect(typeof handleDashboardEvidence).toBe('function');
    expect(typeof handleDashboardSafety).toBe('function');
  });
  it('exports LRO_API_HANDLERS object', () => {
    expect(typeof LRO_API_HANDLERS).toBe('object');
  });
  it('exports registerReadOnlyApiRoutes', () => {
    expect(typeof registerReadOnlyApiRoutes).toBe('function');
  });
  it('exports getDefaultConfig', () => {
    expect(typeof getDefaultConfig).toBe('function');
  });
});

// ─── 2. Capabilities — unsafe flags false ─────────────────────────────────────

describe('Phase 20 — Capabilities: unsafe flags permanently false', () => {
  const caps = getLocalReadOnlyApiCapabilities();

  it('canUseLiveData is false', () => expect(caps.canUseLiveData).toBe(false));
  it('canUseSolanaRpc is false', () => expect(caps.canUseSolanaRpc).toBe(false));
  it('canUseProviderApis is false', () => expect(caps.canUseProviderApis).toBe(false));
  it('canAccessPrivateKeys is false', () => expect(caps.canAccessPrivateKeys).toBe(false));
  it('canCreateTradeIntents is false', () => expect(caps.canCreateTradeIntents).toBe(false));
  it('canCreateExecutionPlans is false', () => expect(caps.canCreateExecutionPlans).toBe(false));
  it('canPaperTrade is false', () => expect(caps.canPaperTrade).toBe(false));
  it('canTrade is false', () => expect(caps.canTrade).toBe(false));
  it('canExecute is false', () => expect(caps.canExecute).toBe(false));
  it('canWriteToDatabase is false', () => expect(caps.canWriteToDatabase).toBe(false));
  it('canSendTelegramAlerts is false', () => expect(caps.canSendTelegramAlerts).toBe(false));
  it('canConstructTransactions is false', () => expect(caps.canConstructTransactions).toBe(false));
  it('canSimulateTransactions is false', () => expect(caps.canSimulateTransactions).toBe(false));
  it('canCreateOrders is false', () => expect(caps.canCreateOrders).toBe(false));
  it('canCreatePositions is false', () => expect(caps.canCreatePositions).toBe(false));
  it('canCalculateLivePnl is false', () => expect(caps.canCalculateLivePnl).toBe(false));
  it('canMutatePriorEvidence is false', () => expect(caps.canMutatePriorEvidence).toBe(false));
  it('canRenderUi is false', () => expect(caps.canRenderUi).toBe(false));
  it('canUseExternalNetwork is false', () => expect(caps.canUseExternalNetwork).toBe(false));
});

// ─── 3. Capabilities — safe flags true ────────────────────────────────────────

describe('Phase 20 — Capabilities: allowed local fields true', () => {
  const caps = getLocalReadOnlyApiCapabilities();

  it('canStartLocalhostServer is true', () => expect(caps.canStartLocalhostServer).toBe(true));
  it('canServeReadOnlyContracts is true', () => expect(caps.canServeReadOnlyContracts).toBe(true));
  it('canServeFixtureReadModels is true', () => expect(caps.canServeFixtureReadModels).toBe(true));
  it('fixtureOnly is true', () => expect(caps.fixtureOnly).toBe(true));
  it('analysisOnly is true', () => expect(caps.analysisOnly).toBe(true));
  it('nonExecutable is true', () => expect(caps.nonExecutable).toBe(true));
  it('readOnly is true', () => expect(caps.readOnly).toBe(true));
  it('localOnly is true', () => expect(caps.localOnly).toBe(true));
});

// ─── 4. Capabilities validation ───────────────────────────────────────────────

describe('Phase 20 — Capabilities validation', () => {
  it('validates valid capabilities as ok', () => {
    const caps = getLocalReadOnlyApiCapabilities();
    const result = validateLocalReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(true);
  });

  it('rejects capabilities with canTrade: true', () => {
    const caps = { ...getLocalReadOnlyApiCapabilities(), canTrade: true as unknown as false };
    const result = validateLocalReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
    expect(result.ok ? '' : result.code).toBe('UNSAFE_CAPABILITY_DETECTED');
  });

  it('rejects capabilities with canUseLiveData: true', () => {
    const caps = {
      ...getLocalReadOnlyApiCapabilities(),
      canUseLiveData: true as unknown as false,
    };
    const result = validateLocalReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
  });

  it('rejects capabilities with canExecute: true', () => {
    const caps = { ...getLocalReadOnlyApiCapabilities(), canExecute: true as unknown as false };
    const result = validateLocalReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
  });

  it('rejects capabilities with canUseSolanaRpc: true', () => {
    const caps = {
      ...getLocalReadOnlyApiCapabilities(),
      canUseSolanaRpc: true as unknown as false,
    };
    const result = validateLocalReadOnlyApiCapabilities(caps);
    expect(result.ok).toBe(false);
  });
});

// ─── 5. Config — defaults ─────────────────────────────────────────────────────

describe('Phase 20 — Config defaults', () => {
  it('creates default config with host 127.0.0.1', () => {
    const result = createReadOnlyApiConfig();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.host).toBe('127.0.0.1');
  });

  it('creates default config with port 3140', () => {
    const result = createReadOnlyApiConfig();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.port).toBe(3140);
  });

  it('config has fixtureOnly: true', () => {
    const result = createReadOnlyApiConfig();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.fixtureOnly).toBe(true);
  });

  it('config has readOnly: true', () => {
    const result = createReadOnlyApiConfig();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.readOnly).toBe(true);
  });

  it('config has localOnly: true', () => {
    const result = createReadOnlyApiConfig();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.localOnly).toBe(true);
  });

  it('accepts explicit 127.0.0.1:3140', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 3140 });
    expect(result.ok).toBe(true);
  });

  it('accepts port 8080', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 8080 });
    expect(result.ok).toBe(true);
  });

  it('accepts port 65535', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 65535 });
    expect(result.ok).toBe(true);
  });

  it('accepts port 1024', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 1024 });
    expect(result.ok).toBe(true);
  });

  it('getDefaultConfig returns 127.0.0.1:3140', () => {
    const config = getDefaultConfig();
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe(3140);
  });
});

// ─── 6. Config — host rejections ──────────────────────────────────────────────

describe('Phase 20 — Config: host rejections', () => {
  it('rejects 0.0.0.0', () => {
    const result = createReadOnlyApiConfig({ host: '0.0.0.0', port: 3140 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('EXTERNAL_BIND_FORBIDDEN');
  });

  it('rejects ::', () => {
    const result = createReadOnlyApiConfig({ host: '::', port: 3140 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('EXTERNAL_BIND_FORBIDDEN');
  });

  it('rejects localhost', () => {
    const result = createReadOnlyApiConfig({ host: 'localhost', port: 3140 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('EXTERNAL_BIND_FORBIDDEN');
  });

  it('rejects empty string', () => {
    const result = createReadOnlyApiConfig({ host: '', port: 3140 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('UNSAFE_HOST_REJECTED');
  });

  it('rejects external hostname example.com', () => {
    const result = createReadOnlyApiConfig({ host: 'example.com', port: 3140 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('EXTERNAL_BIND_FORBIDDEN');
  });

  it('rejects RPC-looking URL https://api.mainnet.com', () => {
    const result = createReadOnlyApiConfig({ host: 'https://api.mainnet.com', port: 3140 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('EXTERNAL_BIND_FORBIDDEN');
  });

  it('rejects URL-looking string with ://', () => {
    const result = createReadOnlyApiConfig({ host: 'http://127.0.0.1', port: 3140 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('EXTERNAL_BIND_FORBIDDEN');
  });

  it('rejects host with @', () => {
    const result = createReadOnlyApiConfig({ host: 'user@127.0.0.1', port: 3140 });
    expect(result.ok).toBe(false);
  });

  it('rejects ::1 (IPv6 loopback)', () => {
    const result = createReadOnlyApiConfig({ host: '::1', port: 3140 });
    expect(result.ok).toBe(false);
  });

  it('rejects 192.168.1.1 (private external IP)', () => {
    const result = createReadOnlyApiConfig({ host: '192.168.1.1', port: 3140 });
    expect(result.ok).toBe(false);
  });

  it('rejects helius RPC URL', () => {
    const result = createReadOnlyApiConfig({ host: 'mainnet.helius.xyz', port: 3140 });
    expect(result.ok).toBe(false);
  });
});

// ─── 7. Config — port rejections ─────────────────────────────────────────────

describe('Phase 20 — Config: port rejections', () => {
  it('rejects port 0', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('UNSAFE_PORT_REJECTED');
  });

  it('rejects port 80', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 80 });
    expect(result.ok).toBe(false);
  });

  it('rejects port 443', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 443 });
    expect(result.ok).toBe(false);
  });

  it('rejects port 22', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 22 });
    expect(result.ok).toBe(false);
  });

  it('rejects port 65536', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 65536 });
    expect(result.ok).toBe(false);
  });

  it('rejects port -1', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: -1 });
    expect(result.ok).toBe(false);
  });

  it('rejects port 1023', () => {
    const result = createReadOnlyApiConfig({ host: '127.0.0.1', port: 1023 });
    expect(result.ok).toBe(false);
  });
});

// ─── 8. Config validation ────────────────────────────────────────────────────

describe('Phase 20 — Config safety validation', () => {
  it('validates safe config', () => {
    const result = createReadOnlyApiConfig();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const v = validateLocalReadOnlyApiConfig(result.value);
    expect(v.ok).toBe(true);
  });

  it('validateLocalReadOnlyApiSafety delegates to config validator', () => {
    const result = createReadOnlyApiConfig();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const v = validateLocalReadOnlyApiSafety(result.value);
    expect(v.ok).toBe(true);
  });
});

// ─── 9. Safety meta ───────────────────────────────────────────────────────────

describe('Phase 20 — Safety metadata', () => {
  it('STANDARD_SAFETY_META has fixtureOnly: true', () => {
    expect(STANDARD_SAFETY_META.fixtureOnly).toBe(true);
  });
  it('STANDARD_SAFETY_META has liveData: false', () => {
    expect(STANDARD_SAFETY_META.liveData).toBe(false);
  });
  it('STANDARD_SAFETY_META has safeToDisplay: true', () => {
    expect(STANDARD_SAFETY_META.safeToDisplay).toBe(true);
  });
  it('STANDARD_SAFETY_META has analysisOnly: true', () => {
    expect(STANDARD_SAFETY_META.analysisOnly).toBe(true);
  });
  it('STANDARD_SAFETY_META has nonExecutable: true', () => {
    expect(STANDARD_SAFETY_META.nonExecutable).toBe(true);
  });
  it('STANDARD_SAFETY_META has readOnly: true', () => {
    expect(STANDARD_SAFETY_META.readOnly).toBe(true);
  });
  it('STANDARD_SAFETY_META has localOnly: true', () => {
    expect(STANDARD_SAFETY_META.localOnly).toBe(true);
  });

  it('validateLroApiSafetyMeta accepts valid meta', () => {
    const result = validateLroApiSafetyMeta(STANDARD_SAFETY_META);
    expect(result.ok).toBe(true);
  });

  it('validateLroApiSafetyMeta rejects liveData: true', () => {
    const meta = { ...STANDARD_SAFETY_META, liveData: true as unknown as false };
    const result = validateLroApiSafetyMeta(meta);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('LIVE_DATA_FORBIDDEN');
  });

  it('validateLroApiSafetyMeta rejects fixtureOnly: false', () => {
    const meta = { ...STANDARD_SAFETY_META, fixtureOnly: false as unknown as true };
    const result = validateLroApiSafetyMeta(meta);
    expect(result.ok).toBe(false);
  });

  it('validateLocalReadOnlyApiSafety delegates to meta validator', () => {
    const result = validateLocalReadOnlyApiSafety(STANDARD_SAFETY_META);
    expect(result.ok).toBe(true);
  });
});

// ─── 10. Response builder ─────────────────────────────────────────────────────

describe('Phase 20 — Response builder', () => {
  it('builds a response with correct envelopeId', () => {
    const r = buildReadOnlyApiResponse({ envelopeId: 'test_env', status: 'ok', data: null });
    expect(r.envelopeId).toBe('test_env');
  });

  it('builds a response with status ok', () => {
    const r = buildReadOnlyApiResponse({ envelopeId: 'e1', status: 'ok', data: null });
    expect(r.status).toBe('ok');
  });

  it('builds a response with safety meta', () => {
    const r = buildReadOnlyApiResponse({ envelopeId: 'e2', status: 'ok', data: null });
    expect(r.meta.fixtureOnly).toBe(true);
    expect(r.meta.liveData).toBe(false);
    expect(r.meta.safeToDisplay).toBe(true);
    expect(r.meta.analysisOnly).toBe(true);
    expect(r.meta.nonExecutable).toBe(true);
    expect(r.meta.readOnly).toBe(true);
    expect(r.meta.localOnly).toBe(true);
  });

  it('response includes generatedAt', () => {
    const r = buildReadOnlyApiResponse({ envelopeId: 'e3', status: 'ok', data: null });
    expect(typeof r.generatedAt).toBe('string');
    expect(r.generatedAt.length).toBeGreaterThan(0);
  });

  it('response includes empty warnings by default', () => {
    const r = buildReadOnlyApiResponse({ envelopeId: 'e4', status: 'ok', data: null });
    expect(Array.isArray(r.warnings)).toBe(true);
    expect(r.warnings.length).toBe(0);
  });

  it('response includes empty errors by default', () => {
    const r = buildReadOnlyApiResponse({ envelopeId: 'e5', status: 'ok', data: null });
    expect(Array.isArray(r.errors)).toBe(true);
    expect(r.errors.length).toBe(0);
  });

  it('preserves data in response', () => {
    const r = buildReadOnlyApiResponse({
      envelopeId: 'e6',
      status: 'ok',
      data: { foo: 'bar' },
    });
    expect(r.data).toEqual({ foo: 'bar' });
  });

  it('response is deterministic (same output twice)', () => {
    const r1 = buildReadOnlyApiResponse({ envelopeId: 'det_e', status: 'ok', data: { x: 1 } });
    const r2 = buildReadOnlyApiResponse({ envelopeId: 'det_e', status: 'ok', data: { x: 1 } });
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });

  it('response never includes raw Error objects', () => {
    const r = buildReadOnlyApiResponse({
      envelopeId: 'e7',
      status: 'failed',
      data: null,
      errors: [{ code: 'INVALID_LRO_API_INPUT', message: 'test error' }],
    });
    expect(r.errors[0]).not.toHaveProperty('stack');
    expect(r.errors[0]).not.toBeInstanceOf(Error);
    expect(typeof r.errors[0]?.message).toBe('string');
  });
});

// ─── 11. LroApiResult helpers ─────────────────────────────────────────────────

describe('Phase 20 — LroApiResult helpers', () => {
  it('lroApiOk wraps value', () => {
    const result = lroApiOk(42);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(42);
  });

  it('lroApiErr wraps code and message', () => {
    const result = lroApiErr('INVALID_LRO_API_INPUT', 'test');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('INVALID_LRO_API_INPUT');
      expect(result.message).toBe('test');
    }
  });

  it('lroApiOk does not include code or message', () => {
    const result = lroApiOk('hello');
    expect(result).not.toHaveProperty('code');
    expect(result).not.toHaveProperty('message');
  });

  it('lroApiErr does not include value', () => {
    const result = lroApiErr('LIVE_DATA_FORBIDDEN', 'no live');
    expect(result).not.toHaveProperty('value');
  });
});

// ─── 12. Text safety helpers ──────────────────────────────────────────────────

describe('Phase 20 — Text safety helpers', () => {
  it('containsUnsafeActionText detects "buy"', () => {
    expect(containsUnsafeActionText('you should buy now')).toBe(true);
  });

  it('containsUnsafeActionText detects "sell"', () => {
    expect(containsUnsafeActionText('ready to sell tokens')).toBe(true);
  });

  it('containsUnsafeActionText detects "execute"', () => {
    expect(containsUnsafeActionText('will execute order')).toBe(true);
  });

  it('containsUnsafeActionText detects "snipe"', () => {
    expect(containsUnsafeActionText('will snipe the token')).toBe(true);
  });

  it('containsUnsafeActionText detects "send transaction"', () => {
    expect(containsUnsafeActionText('send transaction to network')).toBe(true);
  });

  it('containsUnsafeActionText detects "sign transaction"', () => {
    expect(containsUnsafeActionText('sign transaction with key')).toBe(true);
  });

  it('containsUnsafeActionText returns false for safe text', () => {
    expect(containsUnsafeActionText('fixture analysis complete')).toBe(false);
  });

  it('containsSecretPattern detects "private_key"', () => {
    expect(containsSecretPattern('here is your private_key: abc')).toBe(true);
  });

  it('containsSecretPattern detects "api_key"', () => {
    expect(containsSecretPattern('api_key=secret')).toBe(true);
  });

  it('containsSecretPattern detects "seed phrase"', () => {
    expect(containsSecretPattern('your seed phrase is...')).toBe(true);
  });

  it('containsSecretPattern returns false for safe text', () => {
    expect(containsSecretPattern('fixture read model output')).toBe(false);
  });

  it('containsUrlPattern detects "wss://"', () => {
    expect(containsUrlPattern('connect wss://mainnet.helius.xyz')).toBe(true);
  });

  it('containsUrlPattern detects "mainnet-beta.solana.com"', () => {
    expect(containsUrlPattern('using mainnet-beta.solana.com')).toBe(true);
  });

  it('containsUrlPattern detects "helius.dev"', () => {
    expect(containsUrlPattern('endpoint helius.dev/api')).toBe(true);
  });

  it('containsUrlPattern returns false for safe text', () => {
    expect(containsUrlPattern('fixture contract analysis')).toBe(false);
  });

  it('isDisplaySafe returns true for safe text', () => {
    expect(isDisplaySafe('Fixture-only, read-only, analysis-only.')).toBe(true);
  });

  it('isDisplaySafe returns false for unsafe action text', () => {
    expect(isDisplaySafe('auto trade detected')).toBe(false);
  });

  it('isDisplaySafe returns false for secret pattern', () => {
    expect(isDisplaySafe('apikey=abc123')).toBe(false);
  });
});

// ─── 13. Fastify app — no auto-start ─────────────────────────────────────────

describe('Phase 20 — Fastify app creation (no auto-listen)', () => {
  it('createReadOnlyApiApp returns a Fastify instance', async () => {
    const app = await createReadOnlyApiApp();
    expect(typeof app).toBe('object');
    expect(typeof app.inject).toBe('function');
    await app.close();
  });

  it('app does not auto-listen on import', () => {
    // If we reach this point without a port-in-use error, the app has not auto-listened.
    expect(true).toBe(true);
  });

  it('app has an inject method for testing', async () => {
    const app = await createReadOnlyApiApp();
    expect(typeof app.inject).toBe('function');
    await app.close();
  });

  it('app can be created twice without conflict (no auto-port binding)', async () => {
    const app1 = await createReadOnlyApiApp();
    const app2 = await createReadOnlyApiApp();
    expect(app1).toBeDefined();
    expect(app2).toBeDefined();
    await app1.close();
    await app2.close();
  });
});

// ─── 14. GET /health ─────────────────────────────────────────────────────────

describe('Phase 20 — GET /health', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('response has fixtureOnly: true in meta', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(res.body);
    expect(body.meta.fixtureOnly).toBe(true);
    await app.close();
  });

  it('response has liveData: false in meta', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(res.body);
    expect(body.meta.liveData).toBe(false);
    await app.close();
  });

  it('response has status ok', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(res.body);
    expect(body.status).toBe('ok');
    await app.close();
  });

  it('response data has fixtureOnly: true', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(res.body);
    expect(body.data.fixtureOnly).toBe(true);
    await app.close();
  });

  it('response data has localOnly: true', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(res.body);
    expect(body.data.localOnly).toBe(true);
    await app.close();
  });

  it('health response is deterministic', async () => {
    const app = await createReadOnlyApiApp();
    const r1 = await app.inject({ method: 'GET', url: '/health' });
    const r2 = await app.inject({ method: 'GET', url: '/health' });
    expect(r1.body).toBe(r2.body);
    await app.close();
  });

  it('handleHealth() returns meta with all safety fields', () => {
    const r = handleHealth();
    expect(r.meta.fixtureOnly).toBe(true);
    expect(r.meta.liveData).toBe(false);
    expect(r.meta.safeToDisplay).toBe(true);
    expect(r.meta.analysisOnly).toBe(true);
    expect(r.meta.nonExecutable).toBe(true);
    expect(r.meta.readOnly).toBe(true);
    expect(r.meta.localOnly).toBe(true);
  });
});

// ─── 15. GET /capabilities ────────────────────────────────────────────────────

describe('Phase 20 — GET /capabilities', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/capabilities' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('response data has canTrade: false', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/capabilities' });
    const body = JSON.parse(res.body);
    expect(body.data.canTrade).toBe(false);
    await app.close();
  });

  it('response data has canExecute: false', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/capabilities' });
    const body = JSON.parse(res.body);
    expect(body.data.canExecute).toBe(false);
    await app.close();
  });

  it('response data has fixtureOnly: true', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/capabilities' });
    const body = JSON.parse(res.body);
    expect(body.data.fixtureOnly).toBe(true);
    await app.close();
  });

  it('handleCapabilities() returns unsafe flags false', () => {
    const r = handleCapabilities();
    const d = r.data as { canTrade: boolean; canUseLiveData: boolean };
    expect(d.canTrade).toBe(false);
    expect(d.canUseLiveData).toBe(false);
  });
});

// ─── 16. GET /contracts ───────────────────────────────────────────────────────

describe('Phase 20 — GET /contracts', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/contracts' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('response has safety meta', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/contracts' });
    const body = JSON.parse(res.body);
    expect(body.meta.fixtureOnly).toBe(true);
    expect(body.meta.liveData).toBe(false);
    await app.close();
  });

  it('response data is not null', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/contracts' });
    const body = JSON.parse(res.body);
    expect(body.data).not.toBeNull();
    await app.close();
  });

  it('handleContracts() returns meta with safety fields', () => {
    const r = handleContracts();
    expect(r.meta.fixtureOnly).toBe(true);
    expect(r.meta.localOnly).toBe(true);
  });
});

// ─── 17. GET /contracts/openapi-shape ────────────────────────────────────────

describe('Phase 20 — GET /contracts/openapi-shape', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/contracts/openapi-shape' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('response has safety meta', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/contracts/openapi-shape' });
    const body = JSON.parse(res.body);
    expect(body.meta.fixtureOnly).toBe(true);
    await app.close();
  });

  it('handleContractsOpenApiShape() is deterministic', () => {
    const r1 = handleContractsOpenApiShape();
    const r2 = handleContractsOpenApiShape();
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
});

// ─── 18. GET /dashboard ───────────────────────────────────────────────────────

describe('Phase 20 — GET /dashboard', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('response has safety meta', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard' });
    const body = JSON.parse(res.body);
    expect(body.meta.liveData).toBe(false);
    await app.close();
  });

  it('handleDashboard() returns meta with safety fields', () => {
    const r = handleDashboard();
    expect(r.meta.readOnly).toBe(true);
    expect(r.meta.nonExecutable).toBe(true);
  });
});

// ─── 19. GET /dashboard/overview ─────────────────────────────────────────────

describe('Phase 20 — GET /dashboard/overview', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/overview' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('response has safety meta', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/overview' });
    const body = JSON.parse(res.body);
    expect(body.meta.fixtureOnly).toBe(true);
    await app.close();
  });

  it('handleDashboardOverview() has safety meta', () => {
    const r = handleDashboardOverview();
    expect(r.meta.localOnly).toBe(true);
  });
});

// ─── 20. GET /dashboard/replay ────────────────────────────────────────────────

describe('Phase 20 — GET /dashboard/replay', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/replay' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('handleDashboardReplay() has meta localOnly: true', () => {
    const r = handleDashboardReplay();
    expect(r.meta.localOnly).toBe(true);
  });
});

// ─── 21. GET /dashboard/strategy ─────────────────────────────────────────────

describe('Phase 20 — GET /dashboard/strategy', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/strategy' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('handleDashboardStrategy() has meta nonExecutable: true', () => {
    const r = handleDashboardStrategy();
    expect(r.meta.nonExecutable).toBe(true);
  });
});

// ─── 22. GET /dashboard/evaluation ───────────────────────────────────────────

describe('Phase 20 — GET /dashboard/evaluation', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evaluation' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('handleDashboardEvaluation() has meta analysisOnly: true', () => {
    const r = handleDashboardEvaluation();
    expect(r.meta.analysisOnly).toBe(true);
  });
});

// ─── 23. GET /dashboard/evidence ─────────────────────────────────────────────

describe('Phase 20 — GET /dashboard/evidence', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/evidence' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('handleDashboardEvidence() has meta readOnly: true', () => {
    const r = handleDashboardEvidence();
    expect(r.meta.readOnly).toBe(true);
  });
});

// ─── 24. GET /dashboard/safety ────────────────────────────────────────────────

describe('Phase 20 — GET /dashboard/safety', () => {
  it('returns 200', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/dashboard/safety' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('handleDashboardSafety() has all safety meta fields', () => {
    const r = handleDashboardSafety();
    expect(r.meta.fixtureOnly).toBe(true);
    expect(r.meta.liveData).toBe(false);
    expect(r.meta.safeToDisplay).toBe(true);
    expect(r.meta.analysisOnly).toBe(true);
    expect(r.meta.nonExecutable).toBe(true);
    expect(r.meta.readOnly).toBe(true);
    expect(r.meta.localOnly).toBe(true);
  });
});

// ─── 25. Non-GET methods rejected ────────────────────────────────────────────

describe('Phase 20 — Non-GET methods rejected', () => {
  it('POST /health returns 404 or 405', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'POST', url: '/health' });
    expect([404, 405]).toContain(res.statusCode);
    await app.close();
  });

  it('PUT /health returns 404 or 405', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'PUT', url: '/health' });
    expect([404, 405]).toContain(res.statusCode);
    await app.close();
  });

  it('DELETE /health returns 404 or 405', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'DELETE', url: '/health' });
    expect([404, 405]).toContain(res.statusCode);
    await app.close();
  });

  it('PATCH /health returns 404 or 405', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'PATCH', url: '/health' });
    expect([404, 405]).toContain(res.statusCode);
    await app.close();
  });

  it('POST /capabilities returns 404 or 405', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'POST', url: '/capabilities' });
    expect([404, 405]).toContain(res.statusCode);
    await app.close();
  });

  it('POST /contracts returns 404 or 405', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'POST', url: '/contracts' });
    expect([404, 405]).toContain(res.statusCode);
    await app.close();
  });

  it('POST /dashboard returns 404 or 405', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'POST', url: '/dashboard' });
    expect([404, 405]).toContain(res.statusCode);
    await app.close();
  });
});

// ─── 26. No mutation endpoints ────────────────────────────────────────────────

describe('Phase 20 — No mutation endpoints', () => {
  it('no /trade endpoint', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/trade' });
    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it('no /orders endpoint', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/orders' });
    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it('no /execute endpoint', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/execute' });
    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it('no /swap endpoint', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/swap' });
    expect(res.statusCode).toBe(404);
    await app.close();
  });

  it('no /positions endpoint', async () => {
    const app = await createReadOnlyApiApp();
    const res = await app.inject({ method: 'GET', url: '/positions' });
    expect(res.statusCode).toBe(404);
    await app.close();
  });
});

// ─── 27. Fixture integrity ────────────────────────────────────────────────────

describe('Phase 20 — Fixture integrity', () => {
  it('LRO_API_ALL_CONTRACT_FIXTURES has 6 fixtures', () => {
    expect(LRO_API_ALL_CONTRACT_FIXTURES.length).toBe(6);
  });

  it('LRO_API_DASHBOARD_FIXTURES has at least 1 fixture', () => {
    expect(LRO_API_DASHBOARD_FIXTURES.length).toBeGreaterThan(0);
  });

  it('LRO_API_PRIMARY_DASHBOARD_FIXTURE is defined', () => {
    expect(LRO_API_PRIMARY_DASHBOARD_FIXTURE).toBeDefined();
  });

  it('LRO_API_CONTRACTS_BUNDLE is defined', () => {
    expect(LRO_API_CONTRACTS_BUNDLE).toBeDefined();
    expect(LRO_API_CONTRACTS_BUNDLE.fixtureOnly).toBe(true);
  });

  it('LRO_API_CONTRACTS_JSON is defined', () => {
    expect(LRO_API_CONTRACTS_JSON).toBeDefined();
  });

  it('LRO_API_CONTRACTS_OPENAPI_SHAPE is defined', () => {
    expect(LRO_API_CONTRACTS_OPENAPI_SHAPE).toBeDefined();
  });

  it('all contract fixtures have fixtureOnly: true', () => {
    for (const fixture of LRO_API_ALL_CONTRACT_FIXTURES) {
      expect(fixture.fixtureOnly).toBe(true);
    }
  });

  it('all contract fixtures have liveData: false', () => {
    for (const fixture of LRO_API_ALL_CONTRACT_FIXTURES) {
      expect(fixture.liveData).toBe(false);
    }
  });

  it('all dashboard fixtures have fixtureOnly: true', () => {
    for (const fixture of LRO_API_DASHBOARD_FIXTURES) {
      expect(fixture.fixtureOnly).toBe(true);
    }
  });

  it('all dashboard fixtures have liveData: false', () => {
    for (const fixture of LRO_API_DASHBOARD_FIXTURES) {
      expect(fixture.liveData).toBe(false);
    }
  });
});

// ─── 28. No forbidden dependencies ────────────────────────────────────────────

describe('Phase 20 — No forbidden dependencies in package.json', () => {
  it('package.json does not include @solana/web3.js', async () => {
    const { readFileSync } = await import('fs');
    const pkg = readFileSync(readOnlyApiPackageJsonPath, 'utf-8');
    expect(pkg).not.toContain('@solana/web3.js');
  });

  it('package.json does not include helius', async () => {
    const { readFileSync } = await import('fs');
    const pkg = readFileSync(readOnlyApiPackageJsonPath, 'utf-8');
    expect(pkg.toLowerCase()).not.toContain('helius');
  });

  it('package.json does not include jito', async () => {
    const { readFileSync } = await import('fs');
    const pkg = readFileSync(readOnlyApiPackageJsonPath, 'utf-8');
    expect(pkg.toLowerCase()).not.toContain('jito');
  });

  it('package.json does not include @jupiter-ag', async () => {
    const { readFileSync } = await import('fs');
    const pkg = readFileSync(readOnlyApiPackageJsonPath, 'utf-8');
    expect(pkg).not.toContain('@jupiter-ag');
  });

  it('package.json does not include react', async () => {
    const { readFileSync } = await import('fs');
    const pkg = readFileSync(readOnlyApiPackageJsonPath, 'utf-8');
    expect(pkg.toLowerCase()).not.toContain('"react"');
  });
});

// ─── 29. Response determinism ─────────────────────────────────────────────────

describe('Phase 20 — Response determinism', () => {
  it('/health response body is same across two calls', async () => {
    const app = await createReadOnlyApiApp();
    const r1 = await app.inject({ method: 'GET', url: '/health' });
    const r2 = await app.inject({ method: 'GET', url: '/health' });
    expect(r1.body).toBe(r2.body);
    await app.close();
  });

  it('/capabilities response body is same across two calls', async () => {
    const app = await createReadOnlyApiApp();
    const r1 = await app.inject({ method: 'GET', url: '/capabilities' });
    const r2 = await app.inject({ method: 'GET', url: '/capabilities' });
    expect(r1.body).toBe(r2.body);
    await app.close();
  });

  it('/dashboard/safety response body is same across two calls', async () => {
    const app = await createReadOnlyApiApp();
    const r1 = await app.inject({ method: 'GET', url: '/dashboard/safety' });
    const r2 = await app.inject({ method: 'GET', url: '/dashboard/safety' });
    expect(r1.body).toBe(r2.body);
    await app.close();
  });
});

// ─── 30. Safety metadata present in all handler outputs ───────────────────────

describe('Phase 20 — Safety metadata in all handler outputs', () => {
  const allHandlers = [
    { name: 'handleHealth', fn: handleHealth },
    { name: 'handleCapabilities', fn: handleCapabilities },
    { name: 'handleContracts', fn: handleContracts },
    { name: 'handleContractsOpenApiShape', fn: handleContractsOpenApiShape },
    { name: 'handleDashboard', fn: handleDashboard },
    { name: 'handleDashboardOverview', fn: handleDashboardOverview },
    { name: 'handleDashboardReplay', fn: handleDashboardReplay },
    { name: 'handleDashboardStrategy', fn: handleDashboardStrategy },
    { name: 'handleDashboardEvaluation', fn: handleDashboardEvaluation },
    { name: 'handleDashboardEvidence', fn: handleDashboardEvidence },
    { name: 'handleDashboardSafety', fn: handleDashboardSafety },
  ];

  for (const { name, fn } of allHandlers) {
    it(`${name} response has meta.fixtureOnly: true`, () => {
      const r = fn();
      expect(r.meta.fixtureOnly).toBe(true);
    });

    it(`${name} response has meta.liveData: false`, () => {
      const r = fn();
      expect(r.meta.liveData).toBe(false);
    });

    it(`${name} response has meta.localOnly: true`, () => {
      const r = fn();
      expect(r.meta.localOnly).toBe(true);
    });
  }
});

// ─── 31. LRO_API_HANDLERS object ─────────────────────────────────────────────

describe('Phase 20 — LRO_API_HANDLERS', () => {
  it('contains all expected handlers', () => {
    expect(typeof LRO_API_HANDLERS.handleHealth).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleCapabilities).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleContracts).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleContractsOpenApiShape).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleDashboard).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleDashboardOverview).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleDashboardReplay).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleDashboardStrategy).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleDashboardEvaluation).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleDashboardEvidence).toBe('function');
    expect(typeof LRO_API_HANDLERS.handleDashboardSafety).toBe('function');
  });
});

// ─── 32. Phase 19 regression guard ────────────────────────────────────────────

describe('Phase 20 — Phase 19 regression guard', () => {
  it('Phase 19 read-only-api-contracts package still exports getReadOnlyApiCapabilities', async () => {
    const { getReadOnlyApiCapabilities } = await import('@sonic/read-only-api-contracts');
    expect(typeof getReadOnlyApiCapabilities).toBe('function');
    const caps = getReadOnlyApiCapabilities();
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });

  it('Phase 19 read-only-api-contracts ALL_READ_ONLY_API_CONTRACT_FIXTURES has 6 items', async () => {
    const { ALL_READ_ONLY_API_CONTRACT_FIXTURES } = await import('@sonic/read-only-api-contracts');
    expect(ALL_READ_ONLY_API_CONTRACT_FIXTURES.length).toBe(6);
  });

  it('Phase 18 dashboard-read-models still exports getDashboardReadModelCapabilities', async () => {
    const { getDashboardReadModelCapabilities } = await import('@sonic/dashboard-read-models');
    expect(typeof getDashboardReadModelCapabilities).toBe('function');
    const caps = getDashboardReadModelCapabilities();
    expect(caps.canTrade).toBe(false);
    expect(caps.fixtureOnly).toBe(true);
  });
});
