/**
 * Phase 6B Tests — Local Instruction Intent Models
 *
 * Tests cover:
 * A. Type shapes/safety flags — intent, plan, request/result, all executable flags false
 * B. Mock builder — buy intent, sell intent, plan, rejects bad input
 * C. Safety capabilities — all 12 prohibited flags false
 * D. Error handling — all forbidden error codes, safe display, no secrets
 * E. Validation helpers — allowExecutableInstructions, quote, venue, amounts, slippage
 * F. Regression — all Phase 1–6A tests still pass, FULL_AUTO/LIMITED_LIVE locked
 */

import { describe, it, expect } from 'vitest';

// ── Phase 6B exports under test ───────────────────────────────────────────────
import {
  PHASE_6B_BUILDER_CAPABILITIES,
  getPhase6BBuilderCapabilities,
  MockInstructionBuilder,
  createMockInstructionBuilder,
  phase6bError,
  validateAllowExecutableInstructions,
  validateBuilderQuote,
  validateBuilderVenue,
  validateNumericAmount,
  validateBuilderSlippage,
  validateBuilderRequest,
  // Phase 6A re-exports used to build test fixtures
  createAvailableMockAdapter,
  pumpErr,
  isPumpOk,
} from '../packages/pump-adapter/src/index.js';

// Type-only imports for shape assertions
import type {
  PumpInstructionIntentType,
  PumpTradeSide,
  PumpInstructionIntent,
  PumpTransactionPlanType,
  PumpTransactionPlan,
  Phase6BWarningCode,
  Phase6BErrorCode,
  Phase6BErrorResult,
  Phase6BBuilderCapabilities,
  PumpInstructionBuilderRequest,
  PumpInstructionBuilderResult,
  PumpInstructionIntentBuilder,
} from '../packages/pump-adapter/src/index.js';

// Regression: shared safety locks
import { LOCKED_MODES } from '../packages/shared/src/index.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** A structurally plausible mock Solana token mint (32–44 base58 chars). */
const MOCK_MINT = 'So11111111111111111111111111111111111111112';

/** Build a successful Phase 6A buy quote result via the mock adapter. */
function makeMockBuyQuoteResult() {
  const adapter = createAvailableMockAdapter({ venue: 'pump_curve' });
  const result = adapter.getBuyQuote({
    tokenMint: MOCK_MINT,
    inputAmount: '0.1',
    inputUnit: 'sol',
    side: 'buy',
    maxSlippageBps: 100,
    requestedAt: new Date().toISOString(),
  });
  return result;
}

/** Build a successful Phase 6A sell quote result via the mock adapter. */
function makeMockSellQuoteResult() {
  const adapter = createAvailableMockAdapter({ venue: 'pump_curve' });
  const result = adapter.getSellQuote({
    tokenMint: MOCK_MINT,
    inputAmount: '1000000',
    inputUnit: 'token',
    side: 'sell',
    maxSlippageBps: 100,
    requestedAt: new Date().toISOString(),
  });
  return result;
}

/** A valid builder request wrapping a successful buy quote. */
function makeBuyRequest(): PumpInstructionBuilderRequest {
  return {
    quote: makeMockBuyQuoteResult(),
    requestedAt: new Date().toISOString(),
    allowExecutableInstructions: false,
  };
}

/** A valid builder request wrapping a successful sell quote. */
function makeSellRequest(): PumpInstructionBuilderRequest {
  return {
    quote: makeMockSellQuoteResult(),
    requestedAt: new Date().toISOString(),
    allowExecutableInstructions: false,
  };
}

// ── A. Types/shapes ───────────────────────────────────────────────────────────

describe('Phase 6B — A. Types/shapes', () => {
  it('PumpInstructionIntentType covers all expected values', () => {
    const types: PumpInstructionIntentType[] = [
      'buy_intent', 'sell_intent', 'approve_intent', 'close_intent', 'unknown_intent',
    ];
    expect(types).toHaveLength(5);
    expect(types).toContain('buy_intent');
    expect(types).toContain('sell_intent');
    expect(types).toContain('approve_intent');
    expect(types).toContain('close_intent');
    expect(types).toContain('unknown_intent');
  });

  it('PumpTradeSide covers buy and sell', () => {
    const sides: PumpTradeSide[] = ['buy', 'sell'];
    expect(sides).toHaveLength(2);
    expect(sides).toContain('buy');
    expect(sides).toContain('sell');
  });

  it('PumpTransactionPlanType covers all expected values', () => {
    const types: PumpTransactionPlanType[] = ['buy_plan', 'sell_plan', 'unknown_plan'];
    expect(types).toHaveLength(3);
    expect(types).toContain('buy_plan');
    expect(types).toContain('sell_plan');
    expect(types).toContain('unknown_plan');
  });

  it('PumpInstructionIntent shape has executionForbidden and isExecutable', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent(makeBuyRequest());
    expect(result.plan).not.toBeNull();
    const intent: PumpInstructionIntent = result.plan!.intents[0]!;
    expect(intent.executionForbidden).toBe(true);
    expect(intent.isExecutable).toBe(false);
    expect(intent.safeToDisplay).toBe(true);
    expect(typeof intent.intentId).toBe('string');
    expect(typeof intent.intentType).toBe('string');
    expect(typeof intent.tokenMint).toBe('string');
    expect(typeof intent.side).toBe('string');
    expect(typeof intent.inputAmount).toBe('number');
    expect(typeof intent.estimatedOutputAmount).toBe('number');
    expect(typeof intent.maxSlippageBps).toBe('number');
    expect(typeof intent.venue).toBe('string');
    expect(typeof intent.createdAt).toBe('string');
  });

  it('PumpInstructionIntent has no account metas', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent(makeBuyRequest());
    const intent = result.plan!.intents[0]!;
    expect('keys' in intent).toBe(false);
    expect('accounts' in intent).toBe(false);
    expect('accountMetas' in intent).toBe(false);
  });

  it('PumpInstructionIntent has no binary instruction data', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent(makeBuyRequest());
    const intent = result.plan!.intents[0]!;
    expect('data' in intent).toBe(false);
    expect('instructionData' in intent).toBe(false);
    expect('programId' in intent).toBe(false);
  });

  it('PumpInstructionIntent has no wallet/signer fields', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent(makeBuyRequest());
    const intent = result.plan!.intents[0]!;
    expect('wallet' in intent).toBe(false);
    expect('signer' in intent).toBe(false);
    expect('keypair' in intent).toBe(false);
    expect('privateKey' in intent).toBe(false);
  });

  it('PumpTransactionPlan shape has all required safety flags', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildPlanFromQuote(makeBuyRequest());
    expect(result.plan).not.toBeNull();
    const plan: PumpTransactionPlan = result.plan!;
    expect(plan.executionForbidden).toBe(true);
    expect(plan.isExecutable).toBe(false);
    expect(plan.requiresWallet).toBe(false);
    expect(plan.requiresSignature).toBe(false);
    expect(plan.requiresRpc).toBe(false);
    expect(typeof plan.planId).toBe('string');
    expect(typeof plan.planType).toBe('string');
    expect(Array.isArray(plan.intents)).toBe(true);
    expect(plan.intents.length).toBeGreaterThan(0);
    expect(typeof plan.tokenMint).toBe('string');
    expect(typeof plan.venue).toBe('string');
    expect(typeof plan.createdAt).toBe('string');
  });

  it('PumpTransactionPlan has no blockhash, fee payer, signatures, or transaction bytes', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildPlanFromQuote(makeBuyRequest());
    const plan = result.plan!;
    expect('blockhash' in plan).toBe(false);
    expect('recentBlockhash' in plan).toBe(false);
    expect('feePayer' in plan).toBe(false);
    expect('signatures' in plan).toBe(false);
    expect('transaction' in plan).toBe(false);
    expect('serializedTransaction' in plan).toBe(false);
  });

  it('Phase6BWarningCode values are all present', () => {
    const codes: Phase6BWarningCode[] = [
      'MODEL_ONLY',
      'EXECUTION_FORBIDDEN',
      'SIGNING_FORBIDDEN',
      'SENDING_FORBIDDEN',
      'LIVE_RPC_FORBIDDEN',
      'REAL_INSTRUCTIONS_FORBIDDEN',
    ];
    expect(codes).toHaveLength(6);
  });

  it('Phase6BErrorCode values cover all required forbidden codes', () => {
    const codes: Phase6BErrorCode[] = [
      'INSTRUCTION_BUILDING_FORBIDDEN',
      'EXECUTABLE_INSTRUCTIONS_FORBIDDEN',
      'TRANSACTION_BUILDING_FORBIDDEN',
      'SIMULATION_FORBIDDEN',
      'QUOTE_REQUIRED',
      'UNSAFE_QUOTE_RESULT',
      'UNSUPPORTED_INTENT',
      'UNSUPPORTED_VENUE',
      'ACCOUNT_METAS_FORBIDDEN',
      'BINARY_DATA_FORBIDDEN',
      'LIVE_RPC_FORBIDDEN',
      'WALLET_ACCESS_FORBIDDEN',
    ];
    expect(codes).toHaveLength(12);
  });

  it('PumpInstructionBuilderResult shape has plan, warnings, safety', () => {
    const builder = createMockInstructionBuilder();
    const result: PumpInstructionBuilderResult = builder.buildBuyIntent(makeBuyRequest());
    expect(result).toHaveProperty('plan');
    expect(result).toHaveProperty('warnings');
    expect(result).toHaveProperty('safety');
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(typeof result.safety).toBe('object');
  });
});

// ── B. Mock builder ───────────────────────────────────────────────────────────

describe('Phase 6B — B. Mock builder', () => {
  it('builder is a PumpInstructionIntentBuilder', () => {
    const builder: PumpInstructionIntentBuilder = createMockInstructionBuilder();
    expect(typeof builder.buildBuyIntent).toBe('function');
    expect(typeof builder.buildSellIntent).toBe('function');
    expect(typeof builder.buildPlanFromQuote).toBe('function');
    expect(typeof builder.getCapabilities).toBe('function');
  });

  it('MockInstructionBuilder can be instantiated directly', () => {
    const builder = new MockInstructionBuilder();
    expect(typeof builder.buildBuyIntent).toBe('function');
    expect(typeof builder.getCapabilities).toBe('function');
  });

  it('builds a safe buy intent from a valid buy quote', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent(makeBuyRequest());
    expect(result.plan).not.toBeNull();
    expect(result.error).toBeUndefined();
    const intent = result.plan!.intents[0]!;
    expect(intent.intentType).toBe('buy_intent');
    expect(intent.side).toBe('buy');
    expect(intent.executionForbidden).toBe(true);
    expect(intent.isExecutable).toBe(false);
  });

  it('builds a safe sell intent from a valid sell quote', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildSellIntent(makeSellRequest());
    expect(result.plan).not.toBeNull();
    expect(result.error).toBeUndefined();
    const intent = result.plan!.intents[0]!;
    expect(intent.intentType).toBe('sell_intent');
    expect(intent.side).toBe('sell');
    expect(intent.executionForbidden).toBe(true);
    expect(intent.isExecutable).toBe(false);
  });

  it('buildPlanFromQuote produces a buy_plan for a buy quote', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildPlanFromQuote(makeBuyRequest());
    expect(result.plan).not.toBeNull();
    expect(result.plan!.planType).toBe('buy_plan');
    expect(result.plan!.executionForbidden).toBe(true);
    expect(result.plan!.isExecutable).toBe(false);
  });

  it('buildPlanFromQuote produces a sell_plan for a sell quote', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildPlanFromQuote(makeSellRequest());
    expect(result.plan).not.toBeNull();
    expect(result.plan!.planType).toBe('sell_plan');
  });

  it('always includes all standard warnings on success', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent(makeBuyRequest());
    expect(result.warnings).toContain('MODEL_ONLY');
    expect(result.warnings).toContain('EXECUTION_FORBIDDEN');
    expect(result.warnings).toContain('SIGNING_FORBIDDEN');
    expect(result.warnings).toContain('SENDING_FORBIDDEN');
    expect(result.warnings).toContain('LIVE_RPC_FORBIDDEN');
    expect(result.warnings).toContain('REAL_INSTRUCTIONS_FORBIDDEN');
  });

  it('always includes all standard warnings on error', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent({
      quote: pumpErr('ADAPTER_DISABLED', 'disabled'),
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    });
    expect(result.plan).toBeNull();
    expect(result.warnings).toContain('MODEL_ONLY');
    expect(result.warnings).toContain('EXECUTION_FORBIDDEN');
  });

  it('rejects a failed (PumpAdapterErr) quote result', () => {
    const builder = createMockInstructionBuilder();
    const failedQuote = pumpErr('ADAPTER_DISABLED', 'adapter disabled in test');
    const result = builder.buildBuyIntent({
      quote: failedQuote,
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    });
    expect(result.plan).toBeNull();
    expect(result.error).toBeDefined();
    expect(result.error!.code).toBe('UNSAFE_QUOTE_RESULT');
  });

  it('rejects null quote', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent({
      quote: null,
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    });
    expect(result.plan).toBeNull();
    expect(result.error!.code).toBe('QUOTE_REQUIRED');
  });

  it('rejects undefined quote', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent({
      quote: undefined,
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    });
    expect(result.plan).toBeNull();
    expect(result.error!.code).toBe('QUOTE_REQUIRED');
  });

  it('rejects a buy quote passed to buildSellIntent', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildSellIntent(makeBuyRequest());
    expect(result.plan).toBeNull();
    expect(result.error!.code).toBe('UNSUPPORTED_INTENT');
  });

  it('rejects a sell quote passed to buildBuyIntent', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent(makeSellRequest());
    expect(result.plan).toBeNull();
    expect(result.error!.code).toBe('UNSUPPORTED_INTENT');
  });

  it('rejects unsupported venue (unknown)', () => {
    const adapter = createAvailableMockAdapter({ venue: 'unknown' });
    const quoteResult = adapter.getBuyQuote({
      tokenMint: MOCK_MINT,
      inputAmount: '0.1',
      inputUnit: 'sol',
      side: 'buy',
      maxSlippageBps: 100,
      requestedAt: new Date().toISOString(),
    });
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent({
      quote: quoteResult,
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    });
    expect(result.plan).toBeNull();
    expect(result.error!.code).toBe('UNSUPPORTED_VENUE');
  });

  it('rejects allowExecutableInstructions: true at runtime', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent({
      quote: makeMockBuyQuoteResult(),
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: true as unknown as false,
    });
    expect(result.plan).toBeNull();
    expect(result.error!.code).toBe('EXECUTABLE_INSTRUCTIONS_FORBIDDEN');
  });

  it('never reports execution as completed', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent(makeBuyRequest());
    const json = JSON.stringify(result);
    expect(json).not.toContain('executed');
    expect(json).not.toContain('submitted');
    expect(json).not.toContain('signed');
    expect(json).not.toContain('sent');
  });

  it('does not return executable instructions — isExecutable is false on every intent', () => {
    const builder = createMockInstructionBuilder();
    const buyResult = builder.buildBuyIntent(makeBuyRequest());
    const sellResult = builder.buildSellIntent(makeSellRequest());
    const planResult = builder.buildPlanFromQuote(makeBuyRequest());
    for (const result of [buyResult, sellResult, planResult]) {
      if (result.plan) {
        for (const intent of result.plan.intents) {
          expect(intent.isExecutable).toBe(false);
          expect(intent.executionForbidden).toBe(true);
        }
      }
    }
  });
});

// ── C. Safety capabilities ────────────────────────────────────────────────────

describe('Phase 6B — C. Safety capabilities', () => {
  it('PHASE_6B_BUILDER_CAPABILITIES is defined', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES).toBeDefined();
  });

  it('cannot sign transactions', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canSignTransactions).toBe(false);
  });

  it('cannot send transactions', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canSendTransactions).toBe(false);
  });

  it('cannot execute trades', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canExecuteTrades).toBe(false);
  });

  it('cannot access private keys', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canAccessPrivateKeys).toBe(false);
  });

  it('cannot use live RPC', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canUseLiveRpc).toBe(false);
  });

  it('cannot use Jito', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canUseJito).toBe(false);
  });

  it('cannot build transactions', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canBuildTransactions).toBe(false);
  });

  it('cannot build instructions', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canBuildInstructions).toBe(false);
  });

  it('cannot build executable instructions', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canBuildExecutableInstructions).toBe(false);
  });

  it('cannot simulate transactions', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canSimulateTransactions).toBe(false);
  });

  it('cannot return account metas', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canReturnAccountMetas).toBe(false);
  });

  it('cannot return binary instruction data', () => {
    expect(PHASE_6B_BUILDER_CAPABILITIES.canReturnBinaryInstructionData).toBe(false);
  });

  it('getPhase6BBuilderCapabilities returns the same constant', () => {
    const caps: Phase6BBuilderCapabilities = getPhase6BBuilderCapabilities();
    expect(caps).toBe(PHASE_6B_BUILDER_CAPABILITIES);
    expect(caps.canSignTransactions).toBe(false);
    expect(caps.canSendTransactions).toBe(false);
    expect(caps.canExecuteTrades).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
    expect(caps.canUseLiveRpc).toBe(false);
    expect(caps.canUseJito).toBe(false);
    expect(caps.canBuildTransactions).toBe(false);
    expect(caps.canBuildInstructions).toBe(false);
    expect(caps.canBuildExecutableInstructions).toBe(false);
    expect(caps.canSimulateTransactions).toBe(false);
    expect(caps.canReturnAccountMetas).toBe(false);
    expect(caps.canReturnBinaryInstructionData).toBe(false);
  });

  it('builder result carries capability snapshot with all false', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent(makeBuyRequest());
    const caps = result.safety;
    expect(caps.canSignTransactions).toBe(false);
    expect(caps.canSendTransactions).toBe(false);
    expect(caps.canExecuteTrades).toBe(false);
    expect(caps.canAccessPrivateKeys).toBe(false);
    expect(caps.canUseLiveRpc).toBe(false);
    expect(caps.canUseJito).toBe(false);
    expect(caps.canBuildTransactions).toBe(false);
    expect(caps.canBuildInstructions).toBe(false);
    expect(caps.canBuildExecutableInstructions).toBe(false);
    expect(caps.canSimulateTransactions).toBe(false);
    expect(caps.canReturnAccountMetas).toBe(false);
    expect(caps.canReturnBinaryInstructionData).toBe(false);
  });

  it('all 12 capability entries in PHASE_6B_BUILDER_CAPABILITIES are false', () => {
    const caps = PHASE_6B_BUILDER_CAPABILITIES;
    const values = Object.values(caps);
    expect(values.length).toBe(12);
    for (const value of values) {
      expect(value).toBe(false);
    }
  });
});

// ── D. Error handling ─────────────────────────────────────────────────────────

describe('Phase 6B — D. Error handling', () => {
  it('phase6bError constructs a safe error result', () => {
    const err: Phase6BErrorResult = phase6bError('QUOTE_REQUIRED', 'test message');
    expect(err.code).toBe('QUOTE_REQUIRED');
    expect(err.message).toBe('test message');
    expect(err.safeToDisplay).toBe(true);
  });

  it('all Phase6BErrorCode values can be used in phase6bError', () => {
    const codes: Phase6BErrorCode[] = [
      'INSTRUCTION_BUILDING_FORBIDDEN',
      'EXECUTABLE_INSTRUCTIONS_FORBIDDEN',
      'TRANSACTION_BUILDING_FORBIDDEN',
      'SIMULATION_FORBIDDEN',
      'QUOTE_REQUIRED',
      'UNSAFE_QUOTE_RESULT',
      'UNSUPPORTED_INTENT',
      'UNSUPPORTED_VENUE',
      'ACCOUNT_METAS_FORBIDDEN',
      'BINARY_DATA_FORBIDDEN',
      'LIVE_RPC_FORBIDDEN',
      'WALLET_ACCESS_FORBIDDEN',
    ];
    for (const code of codes) {
      const err = phase6bError(code, 'test');
      expect(err.code).toBe(code);
      expect(err.safeToDisplay).toBe(true);
    }
  });

  it('builder errors are always safe to display', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent({
      quote: null,
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    });
    expect(result.error).toBeDefined();
    expect(result.error!.safeToDisplay).toBe(true);
  });

  it('errors do not contain stack traces or raw objects', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent({
      quote: pumpErr('ADAPTER_DISABLED', 'boom'),
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    });
    const errJson = JSON.stringify(result.error);
    expect(errJson).not.toContain('at ');
    expect(errJson).not.toContain('Error:');
    expect(errJson).not.toContain('stack');
  });

  it('errors do not contain secret-like values', () => {
    const builder = createMockInstructionBuilder();
    const result = builder.buildBuyIntent({
      quote: null,
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    });
    const errJson = JSON.stringify(result.error);
    expect(errJson).not.toMatch(/private[_-]?key/i);
    expect(errJson).not.toMatch(/mnemonic/i);
    expect(errJson).not.toMatch(/seed[_-]?phrase/i);
    expect(errJson).not.toMatch(/TELEGRAM_BOT_TOKEN/i);
    expect(errJson).not.toMatch(/DATABASE_URL/i);
  });
});

// ── E. Validation helpers ─────────────────────────────────────────────────────

describe('Phase 6B — E. Validation helpers', () => {
  it('validateAllowExecutableInstructions returns null for false', () => {
    const req: PumpInstructionBuilderRequest = {
      quote: null,
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    };
    expect(validateAllowExecutableInstructions(req)).toBeNull();
  });

  it('validateAllowExecutableInstructions returns error for true (runtime cast)', () => {
    const req = {
      quote: null,
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: true,
    } as unknown as PumpInstructionBuilderRequest;
    const err = validateAllowExecutableInstructions(req);
    expect(err).not.toBeNull();
    expect(err!.code).toBe('EXECUTABLE_INSTRUCTIONS_FORBIDDEN');
    expect(err!.safeToDisplay).toBe(true);
  });

  it('validateBuilderQuote returns error for null quote', () => {
    const result = validateBuilderQuote(null);
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error.code).toBe('QUOTE_REQUIRED');
  });

  it('validateBuilderQuote returns error for failed PumpAdapterErr', () => {
    const failed = pumpErr('ADAPTER_DISABLED', 'disabled');
    const result = validateBuilderQuote(failed);
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error.code).toBe('UNSAFE_QUOTE_RESULT');
  });

  it('validateBuilderQuote returns quoteResult for successful PumpAdapterOk', () => {
    const buyResult = makeMockBuyQuoteResult();
    expect(isPumpOk(buyResult)).toBe(true);
    const result = validateBuilderQuote(buyResult);
    expect('quoteResult' in result).toBe(true);
  });

  it('validateBuilderVenue returns null for pump_curve', () => {
    expect(validateBuilderVenue('pump_curve')).toBeNull();
  });

  it('validateBuilderVenue returns null for pumpswap', () => {
    expect(validateBuilderVenue('pumpswap')).toBeNull();
  });

  it('validateBuilderVenue returns error for unknown venue', () => {
    const err = validateBuilderVenue('unknown');
    expect(err).not.toBeNull();
    expect(err!.code).toBe('UNSUPPORTED_VENUE');
  });

  it('validateBuilderVenue returns error for unsupported venue', () => {
    const err = validateBuilderVenue('unsupported');
    expect(err).not.toBeNull();
    expect(err!.code).toBe('UNSUPPORTED_VENUE');
  });

  it('validateBuilderVenue returns error for empty string', () => {
    const err = validateBuilderVenue('');
    expect(err).not.toBeNull();
    expect(err!.code).toBe('UNSUPPORTED_VENUE');
  });

  it('validateNumericAmount returns null for positive number string', () => {
    expect(validateNumericAmount('0.1', 'inputAmount')).toBeNull();
  });

  it('validateNumericAmount returns null for positive number', () => {
    expect(validateNumericAmount(1000000, 'inputAmount')).toBeNull();
  });

  it('validateNumericAmount returns error for zero', () => {
    const err = validateNumericAmount(0, 'inputAmount');
    expect(err).not.toBeNull();
    expect(err!.code).toBe('QUOTE_REQUIRED');
  });

  it('validateNumericAmount returns error for negative', () => {
    const err = validateNumericAmount(-1, 'inputAmount');
    expect(err).not.toBeNull();
  });

  it('validateNumericAmount returns error for NaN string', () => {
    const err = validateNumericAmount('not-a-number', 'inputAmount');
    expect(err).not.toBeNull();
  });

  it('validateBuilderSlippage returns null for valid bps (100)', () => {
    expect(validateBuilderSlippage(100)).toBeNull();
  });

  it('validateBuilderSlippage returns null for 0 bps', () => {
    expect(validateBuilderSlippage(0)).toBeNull();
  });

  it('validateBuilderSlippage returns null for 10000 bps', () => {
    expect(validateBuilderSlippage(10_000)).toBeNull();
  });

  it('validateBuilderSlippage returns error for negative bps', () => {
    const err = validateBuilderSlippage(-1);
    expect(err).not.toBeNull();
  });

  it('validateBuilderSlippage returns error for > 10000 bps', () => {
    const err = validateBuilderSlippage(10_001);
    expect(err).not.toBeNull();
  });

  it('validateBuilderSlippage returns error for non-integer', () => {
    const err = validateBuilderSlippage(100.5);
    expect(err).not.toBeNull();
  });

  it('validateBuilderRequest returns quoteResult for valid request', () => {
    const req = makeBuyRequest();
    const result = validateBuilderRequest(req);
    expect('quoteResult' in result).toBe(true);
    expect('error' in result).toBe(false);
  });

  it('validateBuilderRequest returns error for null quote', () => {
    const req: PumpInstructionBuilderRequest = {
      quote: null,
      requestedAt: new Date().toISOString(),
      allowExecutableInstructions: false,
    };
    const result = validateBuilderRequest(req);
    expect('error' in result).toBe(true);
  });
});

// ── F. Regression ─────────────────────────────────────────────────────────────

describe('Phase 6B — F. Regression', () => {
  it('FULL_AUTO and LIMITED_LIVE remain locked', () => {
    expect(LOCKED_MODES).toContain('FULL_AUTO');
    expect(LOCKED_MODES).toContain('LIMITED_LIVE');
  });

  it('Phase 6A PUMP_ADAPTER_CAPABILITIES exports still work', async () => {
    const { PUMP_ADAPTER_CAPABILITIES } = await import('../packages/pump-adapter/src/index.js');
    expect(PUMP_ADAPTER_CAPABILITIES.canSignTransactions).toBe(false);
    expect(PUMP_ADAPTER_CAPABILITIES.canSendTransactions).toBe(false);
    expect(PUMP_ADAPTER_CAPABILITIES.canExecuteTrades).toBe(false);
  });

  it('Phase 6A pumpOk / pumpErr helpers still work', async () => {
    const { pumpOk: ok, pumpErr: err } = await import('../packages/pump-adapter/src/index.js');
    expect(ok('test').ok).toBe(true);
    expect(err('ADAPTER_DISABLED', 'test').ok).toBe(false);
  });

  it('Phase 6A MockPumpAdapter still works', async () => {
    const { createAvailableMockAdapter: available } = await import('../packages/pump-adapter/src/index.js');
    const adapter = available();
    const status = adapter.getStatus();
    expect(status.executionForbidden).toBe(true);
    expect(status.isLiveCapable).toBe(false);
  });

  it('Phase 6B exports do not shadow or break Phase 6A exports', async () => {
    const pkg = await import('../packages/pump-adapter/src/index.js');
    // Phase 6A
    expect(pkg.PUMP_ADAPTER_CAPABILITIES).toBeDefined();
    expect(pkg.MockPumpAdapter).toBeDefined();
    expect(pkg.pumpOk).toBeDefined();
    expect(pkg.pumpErr).toBeDefined();
    // Phase 6B
    expect(pkg.PHASE_6B_BUILDER_CAPABILITIES).toBeDefined();
    expect(pkg.MockInstructionBuilder).toBeDefined();
    expect(pkg.createMockInstructionBuilder).toBeDefined();
  });
});
