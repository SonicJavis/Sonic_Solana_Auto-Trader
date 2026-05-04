/**
 * Phase 6A Tests — Pump Adapter Interfaces + Safe Quote Models
 *
 * Tests cover:
 * A. Types/interfaces — adapter status, venue, quote request/result, bonding curve, error shapes
 * B. Validation — rejects empty mint, invalid amount, invalid slippage; accepts valid input
 * C. Mock adapter — disabled/available/unavailable status, buy/sell quotes, bonding curve, venue detection
 * D. Safety guard — all prohibited capabilities are false, forbidden error codes exist
 * E. Redaction/safety — no raw secret-like values in errors/results
 * F. Regression — Phase 1–5 tests still pass, FULL_AUTO and LIMITED_LIVE remain locked
 */

import { describe, it, expect } from 'vitest';

// ── pump-adapter package under test ──────────────────────────────────────────
import {
  PUMP_ADAPTER_CAPABILITIES,
  getPumpAdapterCapabilities,
  MockPumpAdapter,
  createDisabledMockAdapter,
  createAvailableMockAdapter,
  validateTokenMint,
  validateInputAmount,
  validateSlippageBps,
  validateRequestedAt,
  validateQuoteRequest,
  pumpOk,
  pumpErr,
  isPumpOk,
  isPumpErr,
} from '../packages/pump-adapter/src/index.js';

// Types (imported as type-only for shape assertions)
import type {
  PumpVenueType,
  PumpAdapterStatus,
  PumpAdapterStatusReport,
  PumpQuoteSide,
  PumpBuyQuoteRequest,
  PumpSellQuoteRequest,
  PumpQuoteResult,
  BondingCurveState,
  PumpAdapterErrorCode,
  PumpAdapterError,
  PumpAdapterResult,
  PumpAdapterCapabilities,
} from '../packages/pump-adapter/src/index.js';

// Regression: shared safety locks
import { LOCKED_MODES } from '../packages/shared/src/index.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** A structurally plausible mock Solana token mint (32–44 base58 chars). */
const MOCK_MINT = 'So11111111111111111111111111111111111111112';

/** A valid buy quote request for tests. */
function makeBuyRequest(overrides: Partial<PumpBuyQuoteRequest> = {}): PumpBuyQuoteRequest {
  return {
    tokenMint: MOCK_MINT,
    inputAmount: '0.1',
    inputUnit: 'sol',
    side: 'buy',
    maxSlippageBps: 100,
    requestedAt: new Date().toISOString(),
    ...overrides,
  };
}

/** A valid sell quote request for tests. */
function makeSellRequest(overrides: Partial<PumpSellQuoteRequest> = {}): PumpSellQuoteRequest {
  return {
    tokenMint: MOCK_MINT,
    inputAmount: '1000000',
    inputUnit: 'token',
    side: 'sell',
    maxSlippageBps: 100,
    requestedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ── A. Types/interfaces ───────────────────────────────────────────────────────

describe('Phase 6A — A. Types/interfaces', () => {
  it('PumpAdapterStatus covers all expected values', () => {
    const statuses: PumpAdapterStatus[] = ['available', 'unavailable', 'disabled', 'unsupported'];
    expect(statuses).toHaveLength(4);
    expect(statuses).toContain('disabled');
    expect(statuses).toContain('available');
    expect(statuses).toContain('unavailable');
    expect(statuses).toContain('unsupported');
  });

  it('PumpVenueType covers all expected values', () => {
    const venues: PumpVenueType[] = ['pump_curve', 'pumpswap', 'unknown', 'unsupported'];
    expect(venues).toHaveLength(4);
    expect(venues).toContain('pump_curve');
    expect(venues).toContain('pumpswap');
    expect(venues).toContain('unknown');
    expect(venues).toContain('unsupported');
  });

  it('PumpQuoteSide covers buy and sell', () => {
    const sides: PumpQuoteSide[] = ['buy', 'sell'];
    expect(sides).toHaveLength(2);
    expect(sides).toContain('buy');
    expect(sides).toContain('sell');
  });

  it('PumpAdapterStatusReport shape is correct', () => {
    const adapter = createDisabledMockAdapter();
    const status: PumpAdapterStatusReport = adapter.getStatus();
    expect(typeof status.status).toBe('string');
    expect(status.isLiveCapable).toBe(false);
    expect(status.hasLiveRpc).toBe(false);
    expect(status.executionForbidden).toBe(true);
    expect(typeof status.message).toBe('string');
    expect(typeof status.phase).toBe('number');
    expect(typeof status.checkedAt).toBe('string');
  });

  it('PumpQuoteResult shape contains all required fields', () => {
    const adapter = createAvailableMockAdapter();
    const result = adapter.getBuyQuote(makeBuyRequest());
    expect(isPumpOk(result)).toBe(true);
    if (!result.ok) return;
    const q: PumpQuoteResult = result.value;
    expect(typeof q.side).toBe('string');
    expect(typeof q.tokenMint).toBe('string');
    expect(typeof q.inputAmount).toBe('string');
    expect(typeof q.inputUnit).toBe('string');
    expect(typeof q.estimatedOutputAmount).toBe('string');
    expect(typeof q.estimatedPrice).toBe('string');
    expect(typeof q.estimatedFees).toBe('string');
    expect(typeof q.slippageBps).toBe('number');
    expect(typeof q.venue).toBe('string');
    expect(q.safeToDisplay).toBe(true);
    expect(q.isMockResult).toBe(true);
    expect(typeof q.generatedAt).toBe('string');
  });

  it('BondingCurveState shape contains all required fields', () => {
    const adapter = createAvailableMockAdapter();
    const result = adapter.getBondingCurveState(MOCK_MINT);
    expect(isPumpOk(result)).toBe(true);
    if (!result.ok) return;
    const s: BondingCurveState = result.value;
    expect(typeof s.tokenMint).toBe('string');
    expect(typeof s.virtualSolReserves).toBe('bigint');
    expect(typeof s.virtualTokenReserves).toBe('bigint');
    expect(typeof s.realSolReserves).toBe('bigint');
    expect(typeof s.realTokenReserves).toBe('bigint');
    expect(typeof s.curveProgress).toBe('number');
    expect(typeof s.isGraduated).toBe('boolean');
    expect(typeof s.venue).toBe('string');
    expect(typeof s.modelledAt).toBe('string');
    expect(s.isMockState).toBe(true);
  });

  it('PumpAdapterError shape is safe and has required fields', () => {
    const errResult = pumpErr('ADAPTER_DISABLED', 'Test error message');
    expect(errResult.ok).toBe(false);
    const e: PumpAdapterError = errResult.error;
    expect(typeof e.code).toBe('string');
    expect(typeof e.message).toBe('string');
    expect(e.safeToDisplay).toBe(true);
  });

  it('PumpAdapterResult ok variant has value field', () => {
    const r: PumpAdapterResult<string> = pumpOk('hello');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('hello');
  });

  it('PumpAdapterResult err variant has error field', () => {
    const r: PumpAdapterResult<string> = pumpErr('QUOTE_UNAVAILABLE', 'not available');
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe('QUOTE_UNAVAILABLE');
      expect(r.error.message).toBe('not available');
    }
  });
});

// ── B. Validation ─────────────────────────────────────────────────────────────

describe('Phase 6A — B. Validation', () => {
  describe('validateTokenMint', () => {
    it('rejects empty string', () => {
      const r = validateTokenMint('');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });

    it('rejects null', () => {
      const r = validateTokenMint(null);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });

    it('rejects non-string', () => {
      const r = validateTokenMint(12345);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });

    it('rejects too-short string', () => {
      const r = validateTokenMint('abc');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });

    it('rejects too-long string', () => {
      const r = validateTokenMint('a'.repeat(50));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });

    it('rejects invalid characters (not base58)', () => {
      const r = validateTokenMint('0OIl' + 'a'.repeat(30));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });

    it('accepts a structurally plausible mint address', () => {
      const r = validateTokenMint(MOCK_MINT);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value).toBe(MOCK_MINT);
    });

    it('returns safe error with safeToDisplay: true', () => {
      const r = validateTokenMint('');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.safeToDisplay).toBe(true);
    });
  });

  describe('validateInputAmount', () => {
    it('rejects empty string', () => {
      const r = validateInputAmount('');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_AMOUNT');
    });

    it('rejects zero', () => {
      const r = validateInputAmount('0');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_AMOUNT');
    });

    it('rejects negative amount', () => {
      const r = validateInputAmount('-1');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_AMOUNT');
    });

    it('rejects non-numeric string', () => {
      const r = validateInputAmount('abc');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_AMOUNT');
    });

    it('rejects non-string', () => {
      const r = validateInputAmount(100);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_AMOUNT');
    });

    it('accepts a positive decimal', () => {
      const r = validateInputAmount('0.1');
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value).toBe('0.1');
    });

    it('accepts a positive integer', () => {
      const r = validateInputAmount('1000000');
      expect(r.ok).toBe(true);
    });
  });

  describe('validateSlippageBps', () => {
    it('rejects negative slippage', () => {
      const r = validateSlippageBps(-1);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_SLIPPAGE');
    });

    it('rejects slippage above 10000', () => {
      const r = validateSlippageBps(10001);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_SLIPPAGE');
    });

    it('rejects non-integer', () => {
      const r = validateSlippageBps(50.5);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_SLIPPAGE');
    });

    it('rejects non-number', () => {
      const r = validateSlippageBps('100');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_SLIPPAGE');
    });

    it('accepts 0 bps', () => {
      const r = validateSlippageBps(0);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value).toBe(0);
    });

    it('accepts 100 bps', () => {
      const r = validateSlippageBps(100);
      expect(r.ok).toBe(true);
    });

    it('accepts 10000 bps', () => {
      const r = validateSlippageBps(10000);
      expect(r.ok).toBe(true);
    });
  });

  describe('validateRequestedAt', () => {
    it('rejects empty string', () => {
      const r = validateRequestedAt('');
      expect(r.ok).toBe(false);
    });

    it('rejects non-ISO string', () => {
      const r = validateRequestedAt('not-a-date');
      expect(r.ok).toBe(false);
    });

    it('rejects non-string', () => {
      const r = validateRequestedAt(Date.now());
      expect(r.ok).toBe(false);
    });

    it('accepts a current ISO timestamp', () => {
      const r = validateRequestedAt(new Date().toISOString());
      expect(r.ok).toBe(true);
    });

    it('rejects a timestamp more than 60s in the future', () => {
      const future = new Date(Date.now() + 120_000).toISOString();
      const r = validateRequestedAt(future);
      expect(r.ok).toBe(false);
    });
  });

  describe('validateQuoteRequest', () => {
    it('accepts a valid buy request', () => {
      const r = validateQuoteRequest(makeBuyRequest());
      expect(r.ok).toBe(true);
    });

    it('accepts a valid sell request', () => {
      const r = validateQuoteRequest(makeSellRequest());
      expect(r.ok).toBe(true);
    });

    it('rejects request with empty token mint', () => {
      const r = validateQuoteRequest(makeBuyRequest({ tokenMint: '' }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });

    it('rejects request with zero amount', () => {
      const r = validateQuoteRequest(makeBuyRequest({ inputAmount: '0' }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_AMOUNT');
    });

    it('rejects request with invalid slippage', () => {
      const r = validateQuoteRequest(makeBuyRequest({ maxSlippageBps: -1 }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_SLIPPAGE');
    });

    it('returns safe error codes (safeToDisplay: true)', () => {
      const r = validateQuoteRequest(makeBuyRequest({ tokenMint: '' }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.safeToDisplay).toBe(true);
    });
  });
});

// ── C. Mock adapter ───────────────────────────────────────────────────────────

describe('Phase 6A — C. Mock adapter', () => {
  describe('getStatus', () => {
    it('disabled adapter reports disabled status', () => {
      const adapter = createDisabledMockAdapter();
      const status = adapter.getStatus();
      expect(status.status).toBe('disabled');
    });

    it('available adapter reports available status', () => {
      const adapter = createAvailableMockAdapter();
      const status = adapter.getStatus();
      expect(status.status).toBe('available');
    });

    it('unavailable adapter reports unavailable status', () => {
      const adapter = new MockPumpAdapter({ status: 'unavailable' });
      const status = adapter.getStatus();
      expect(status.status).toBe('unavailable');
    });

    it('isLiveCapable is always false', () => {
      const adapters = [
        createDisabledMockAdapter(),
        createAvailableMockAdapter(),
        new MockPumpAdapter({ status: 'unavailable' }),
      ];
      for (const adapter of adapters) {
        expect(adapter.getStatus().isLiveCapable).toBe(false);
      }
    });

    it('hasLiveRpc is always false', () => {
      const adapters = [
        createDisabledMockAdapter(),
        createAvailableMockAdapter(),
      ];
      for (const adapter of adapters) {
        expect(adapter.getStatus().hasLiveRpc).toBe(false);
      }
    });

    it('executionForbidden is always true', () => {
      const adapters = [
        createDisabledMockAdapter(),
        createAvailableMockAdapter(),
        new MockPumpAdapter({ status: 'unavailable' }),
      ];
      for (const adapter of adapters) {
        expect(adapter.getStatus().executionForbidden).toBe(true);
      }
    });

    it('status message is a non-empty string', () => {
      const status = createDisabledMockAdapter().getStatus();
      expect(typeof status.message).toBe('string');
      expect(status.message.length).toBeGreaterThan(0);
    });

    it('phase is 6', () => {
      expect(createDisabledMockAdapter().getStatus().phase).toBe(6);
    });
  });

  describe('detectVenue', () => {
    it('disabled adapter returns ADAPTER_DISABLED error', () => {
      const r = createDisabledMockAdapter().detectVenue(MOCK_MINT);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('ADAPTER_DISABLED');
    });

    it('unavailable adapter returns ADAPTER_UNAVAILABLE error', () => {
      const r = new MockPumpAdapter({ status: 'unavailable' }).detectVenue(MOCK_MINT);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('ADAPTER_UNAVAILABLE');
    });

    it('available adapter returns configured venue', () => {
      const r = createAvailableMockAdapter({ venue: 'pumpswap' }).detectVenue(MOCK_MINT);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value).toBe('pumpswap');
    });

    it('available adapter with pump_curve venue', () => {
      const r = createAvailableMockAdapter({ venue: 'pump_curve' }).detectVenue(MOCK_MINT);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value).toBe('pump_curve');
    });

    it('rejects invalid token mint', () => {
      const r = createAvailableMockAdapter().detectVenue('');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });
  });

  describe('getBondingCurveState', () => {
    it('disabled adapter returns ADAPTER_DISABLED error', () => {
      const r = createDisabledMockAdapter().getBondingCurveState(MOCK_MINT);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('ADAPTER_DISABLED');
    });

    it('available adapter returns a mock bonding curve state', () => {
      const r = createAvailableMockAdapter().getBondingCurveState(MOCK_MINT);
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.value.tokenMint).toBe(MOCK_MINT);
        expect(r.value.isMockState).toBe(true);
        expect(typeof r.value.curveProgress).toBe('number');
        expect(r.value.curveProgress).toBeGreaterThanOrEqual(0);
        expect(r.value.curveProgress).toBeLessThanOrEqual(1);
      }
    });

    it('available adapter respects configured curveProgress', () => {
      const r = createAvailableMockAdapter({ curveProgress: 0.75 }).getBondingCurveState(MOCK_MINT);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value.curveProgress).toBe(0.75);
    });

    it('available adapter respects configured isGraduated', () => {
      const r = createAvailableMockAdapter({ isGraduated: true }).getBondingCurveState(MOCK_MINT);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value.isGraduated).toBe(true);
    });

    it('bonding curve state has bigint reserve fields', () => {
      const r = createAvailableMockAdapter().getBondingCurveState(MOCK_MINT);
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(typeof r.value.virtualSolReserves).toBe('bigint');
        expect(typeof r.value.virtualTokenReserves).toBe('bigint');
        expect(typeof r.value.realSolReserves).toBe('bigint');
        expect(typeof r.value.realTokenReserves).toBe('bigint');
      }
    });

    it('rejects invalid token mint', () => {
      const r = createAvailableMockAdapter().getBondingCurveState('bad');
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });
  });

  describe('getBuyQuote', () => {
    it('disabled adapter returns ADAPTER_DISABLED error', () => {
      const r = createDisabledMockAdapter().getBuyQuote(makeBuyRequest());
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('ADAPTER_DISABLED');
    });

    it('unavailable adapter returns ADAPTER_UNAVAILABLE error', () => {
      const r = new MockPumpAdapter({ status: 'unavailable' }).getBuyQuote(makeBuyRequest());
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('ADAPTER_UNAVAILABLE');
    });

    it('available adapter returns a mock buy quote', () => {
      const r = createAvailableMockAdapter().getBuyQuote(makeBuyRequest());
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.value.side).toBe('buy');
        expect(r.value.isMockResult).toBe(true);
        expect(r.value.safeToDisplay).toBe(true);
        expect(r.value.tokenMint).toBe(MOCK_MINT);
      }
    });

    it('buy quote result does not report trade as executed', () => {
      const r = createAvailableMockAdapter().getBuyQuote(makeBuyRequest());
      expect(r.ok).toBe(true);
      if (r.ok) {
        // isMockResult: true ensures it's clearly not an executed trade
        expect(r.value.isMockResult).toBe(true);
        // safeToDisplay: true ensures no raw secrets
        expect(r.value.safeToDisplay).toBe(true);
      }
    });

    it('rejects buy request with invalid mint', () => {
      const r = createAvailableMockAdapter().getBuyQuote(makeBuyRequest({ tokenMint: '' }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_TOKEN_MINT');
    });

    it('rejects buy request with zero amount', () => {
      const r = createAvailableMockAdapter().getBuyQuote(makeBuyRequest({ inputAmount: '0' }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_AMOUNT');
    });

    it('rejects buy request with invalid slippage', () => {
      const r = createAvailableMockAdapter().getBuyQuote(makeBuyRequest({ maxSlippageBps: 20000 }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_SLIPPAGE');
    });
  });

  describe('getSellQuote', () => {
    it('disabled adapter returns ADAPTER_DISABLED error', () => {
      const r = createDisabledMockAdapter().getSellQuote(makeSellRequest());
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('ADAPTER_DISABLED');
    });

    it('available adapter returns a mock sell quote', () => {
      const r = createAvailableMockAdapter().getSellQuote(makeSellRequest());
      expect(r.ok).toBe(true);
      if (r.ok) {
        expect(r.value.side).toBe('sell');
        expect(r.value.isMockResult).toBe(true);
        expect(r.value.safeToDisplay).toBe(true);
      }
    });

    it('sell quote result does not report trade as executed', () => {
      const r = createAvailableMockAdapter().getSellQuote(makeSellRequest());
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value.isMockResult).toBe(true);
    });

    it('rejects sell request with invalid mint', () => {
      const r = createAvailableMockAdapter().getSellQuote(makeSellRequest({ tokenMint: 'bad' }));
      expect(r.ok).toBe(false);
    });

    it('rejects sell request with zero amount', () => {
      const r = createAvailableMockAdapter().getSellQuote(makeSellRequest({ inputAmount: '0' }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe('INVALID_AMOUNT');
    });
  });

  describe('result helpers', () => {
    it('pumpOk constructs ok result', () => {
      const r = pumpOk(42);
      expect(r.ok).toBe(true);
      expect(r.value).toBe(42);
    });

    it('pumpErr constructs error result', () => {
      const r = pumpErr('EXECUTION_FORBIDDEN', 'not allowed');
      expect(r.ok).toBe(false);
      expect(r.error.code).toBe('EXECUTION_FORBIDDEN');
      expect(r.error.safeToDisplay).toBe(true);
    });

    it('isPumpOk type guard works', () => {
      expect(isPumpOk(pumpOk('x'))).toBe(true);
      expect(isPumpOk(pumpErr('ADAPTER_DISABLED', 'x'))).toBe(false);
    });

    it('isPumpErr type guard works', () => {
      expect(isPumpErr(pumpErr('ADAPTER_DISABLED', 'x'))).toBe(true);
      expect(isPumpErr(pumpOk('x'))).toBe(false);
    });
  });
});

// ── D. Safety guard ───────────────────────────────────────────────────────────

describe('Phase 6A — D. Safety guard', () => {
  it('canSignTransactions is false', () => {
    expect(PUMP_ADAPTER_CAPABILITIES.canSignTransactions).toBe(false);
  });

  it('canSendTransactions is false', () => {
    expect(PUMP_ADAPTER_CAPABILITIES.canSendTransactions).toBe(false);
  });

  it('canExecuteTrades is false', () => {
    expect(PUMP_ADAPTER_CAPABILITIES.canExecuteTrades).toBe(false);
  });

  it('canAccessPrivateKeys is false', () => {
    expect(PUMP_ADAPTER_CAPABILITIES.canAccessPrivateKeys).toBe(false);
  });

  it('canUseLiveRpc is false', () => {
    expect(PUMP_ADAPTER_CAPABILITIES.canUseLiveRpc).toBe(false);
  });

  it('canUseJito is false', () => {
    expect(PUMP_ADAPTER_CAPABILITIES.canUseJito).toBe(false);
  });

  it('canBuildTransactions is false', () => {
    expect(PUMP_ADAPTER_CAPABILITIES.canBuildTransactions).toBe(false);
  });

  it('canBuildInstructions is false', () => {
    expect(PUMP_ADAPTER_CAPABILITIES.canBuildInstructions).toBe(false);
  });

  it('getPumpAdapterCapabilities() returns the same values', () => {
    const caps: PumpAdapterCapabilities = getPumpAdapterCapabilities();
    expect(caps.canSignTransactions).toBe(false);
    expect(caps.canSendTransactions).toBe(false);
    expect(caps.canExecuteTrades).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
    expect(caps.canUseLiveRpc).toBe(false);
    expect(caps.canUseJito).toBe(false);
    expect(caps.canBuildTransactions).toBe(false);
    expect(caps.canBuildInstructions).toBe(false);
  });

  it('all capability values are strictly false (not falsy)', () => {
    const caps = getPumpAdapterCapabilities();
    const values = Object.values(caps);
    for (const v of values) {
      expect(v).toStrictEqual(false);
    }
  });

  it('EXECUTION_FORBIDDEN error code exists', () => {
    const r = pumpErr('EXECUTION_FORBIDDEN', 'forbidden');
    expect(r.error.code).toBe('EXECUTION_FORBIDDEN');
  });

  it('SIGNING_FORBIDDEN error code exists', () => {
    const r = pumpErr('SIGNING_FORBIDDEN', 'forbidden');
    expect(r.error.code).toBe('SIGNING_FORBIDDEN');
  });

  it('SENDING_FORBIDDEN error code exists', () => {
    const r = pumpErr('SENDING_FORBIDDEN', 'forbidden');
    expect(r.error.code).toBe('SENDING_FORBIDDEN');
  });

  it('WALLET_ACCESS_FORBIDDEN error code exists', () => {
    const r = pumpErr('WALLET_ACCESS_FORBIDDEN', 'forbidden');
    expect(r.error.code).toBe('WALLET_ACCESS_FORBIDDEN');
  });

  it('NETWORK_NOT_IMPLEMENTED error code exists', () => {
    const r = pumpErr('NETWORK_NOT_IMPLEMENTED', 'not implemented');
    expect(r.error.code).toBe('NETWORK_NOT_IMPLEMENTED');
  });
});

// ── E. Redaction/safety ───────────────────────────────────────────────────────

describe('Phase 6A — E. Redaction/safety', () => {
  it('error messages do not contain DATABASE_URL-like patterns', () => {
    const errors = [
      pumpErr('ADAPTER_DISABLED', 'adapter disabled'),
      pumpErr('INVALID_TOKEN_MINT', 'invalid mint'),
      pumpErr('EXECUTION_FORBIDDEN', 'execution forbidden'),
    ];
    for (const e of errors) {
      expect(e.error.message).not.toMatch(/DATABASE_URL/i);
      expect(e.error.message).not.toMatch(/postgresql:\/\//i);
      expect(e.error.message).not.toMatch(/sqlite:\/\//i);
    }
  });

  it('error messages do not contain TELEGRAM_BOT_TOKEN-like patterns', () => {
    const errors = [
      pumpErr('ADAPTER_DISABLED', 'adapter disabled'),
      pumpErr('QUOTE_UNAVAILABLE', 'unavailable'),
    ];
    for (const e of errors) {
      expect(e.error.message).not.toMatch(/TELEGRAM_BOT_TOKEN/i);
      expect(e.error.message).not.toMatch(/bot.*token/i);
    }
  });

  it('all errors have safeToDisplay: true', () => {
    const errorCodes: PumpAdapterErrorCode[] = [
      'ADAPTER_DISABLED',
      'ADAPTER_UNAVAILABLE',
      'UNSUPPORTED_VENUE',
      'INVALID_TOKEN_MINT',
      'INVALID_AMOUNT',
      'INVALID_SLIPPAGE',
      'QUOTE_UNAVAILABLE',
      'NETWORK_NOT_IMPLEMENTED',
      'EXECUTION_FORBIDDEN',
      'SIGNING_FORBIDDEN',
      'SENDING_FORBIDDEN',
      'WALLET_ACCESS_FORBIDDEN',
    ];
    for (const code of errorCodes) {
      const e = pumpErr(code, 'test message');
      expect(e.error.safeToDisplay).toBe(true);
    }
  });

  it('mock quote results have safeToDisplay: true', () => {
    const adapter = createAvailableMockAdapter();
    const buyResult = adapter.getBuyQuote(makeBuyRequest());
    const sellResult = adapter.getSellQuote(makeSellRequest());
    if (buyResult.ok) expect(buyResult.value.safeToDisplay).toBe(true);
    if (sellResult.ok) expect(sellResult.value.safeToDisplay).toBe(true);
  });

  it('mock bonding curve state has isMockState: true (not live data)', () => {
    const adapter = createAvailableMockAdapter();
    const r = adapter.getBondingCurveState(MOCK_MINT);
    if (r.ok) expect(r.value.isMockState).toBe(true);
  });

  it('mock quote results have isMockResult: true (not executed trades)', () => {
    const adapter = createAvailableMockAdapter();
    const r = adapter.getBuyQuote(makeBuyRequest());
    if (r.ok) expect(r.value.isMockResult).toBe(true);
  });

  it('status message does not contain raw secret patterns', () => {
    const status = createDisabledMockAdapter().getStatus();
    expect(status.message).not.toMatch(/private[_\s]?key/i);
    expect(status.message).not.toMatch(/mnemonic/i);
    expect(status.message).not.toMatch(/seed[_\s]?phrase/i);
    expect(status.message).not.toMatch(/TELEGRAM_BOT_TOKEN/i);
    expect(status.message).not.toMatch(/DATABASE_URL/i);
  });

  it('validation errors do not contain raw secret patterns', () => {
    const r = validateTokenMint('');
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.message).not.toMatch(/private[_\s]?key/i);
      expect(r.error.message).not.toMatch(/mnemonic/i);
      expect(r.error.message).not.toMatch(/TELEGRAM_BOT_TOKEN/i);
    }
  });
});

// ── F. Regression ─────────────────────────────────────────────────────────────

describe('Phase 6A — F. Regression', () => {
  it('FULL_AUTO remains in LOCKED_MODES', () => {
    expect(LOCKED_MODES).toContain('FULL_AUTO');
  });

  it('LIMITED_LIVE remains in LOCKED_MODES', () => {
    expect(LOCKED_MODES).toContain('LIMITED_LIVE');
  });

  it('pump adapter package exports do not modify shared LOCKED_MODES', () => {
    // Importing pump-adapter must not mutate the shared safety constant
    expect(LOCKED_MODES).toContain('FULL_AUTO');
    expect(LOCKED_MODES).toContain('LIMITED_LIVE');
    expect(LOCKED_MODES.length).toBeGreaterThanOrEqual(2);
  });

  it('getPumpAdapterCapabilities does not unlock any mode', () => {
    // Calling this function must not side-effect any mode state
    const caps = getPumpAdapterCapabilities();
    expect(caps.canExecuteTrades).toBe(false);
    expect(LOCKED_MODES).toContain('FULL_AUTO');
    expect(LOCKED_MODES).toContain('LIMITED_LIVE');
  });

  it('createDisabledMockAdapter does not unlock modes', () => {
    createDisabledMockAdapter();
    expect(LOCKED_MODES).toContain('FULL_AUTO');
    expect(LOCKED_MODES).toContain('LIMITED_LIVE');
  });

  it('createAvailableMockAdapter does not unlock modes', () => {
    createAvailableMockAdapter();
    expect(LOCKED_MODES).toContain('FULL_AUTO');
    expect(LOCKED_MODES).toContain('LIMITED_LIVE');
  });
});
