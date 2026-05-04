/**
 * Phase 6B: Mock instruction intent builder.
 *
 * Accepts successful Phase 6A quote results and returns descriptive intent/plan
 * models.  Never returns executable instruction data, never connects to Solana,
 * never signs, sends, or simulates anything.
 *
 * All safety capability flags are permanently false.
 */

import type { PumpInstructionIntentBuilder } from './instruction-builder.js';
import type {
  Phase6BBuilderCapabilities,
  Phase6BWarningCode,
  PumpInstructionBuilderRequest,
  PumpInstructionBuilderResult,
} from './builder-types.js';
import type { PumpInstructionIntent, PumpTradeSide } from './instruction-intent-types.js';
import type { PumpTransactionPlan, PumpTransactionPlanType } from './transaction-plan-types.js';
import type { PumpQuoteResult } from './quote-types.js';
import { validateBuilderRequest, phase6bError } from './instruction-validation.js';

// ── Capability constant ────────────────────────────────────────────────────────

/**
 * Simple sequential ID generator for local-only intent/plan identifiers.
 * No crypto dependency required — these IDs are display-only, not cryptographic.
 */
let _idCounter = 0;
function nextLocalId(prefix: string): string {
  _idCounter += 1;
  return `${prefix}_${Date.now()}_${_idCounter}`;
}

/**
 * The Phase 6B builder safety capability guard.
 *
 * All 12 prohibited capability flags are permanently false.
 * No code path in Phase 6B may set any of these to true.
 */
export const PHASE_6B_BUILDER_CAPABILITIES: Phase6BBuilderCapabilities = {
  canSignTransactions: false,
  canSendTransactions: false,
  canExecuteTrades: false,
  canAccessPrivateKeys: false,
  canUseLiveRpc: false,
  canUseJito: false,
  canBuildTransactions: false,
  canBuildInstructions: false,
  canBuildExecutableInstructions: false,
  canSimulateTransactions: false,
  canReturnAccountMetas: false,
  canReturnBinaryInstructionData: false,
} as const;

/**
 * Returns the Phase 6B builder safety capability guard.
 * All prohibited capabilities are false.
 */
export function getPhase6BBuilderCapabilities(): Phase6BBuilderCapabilities {
  return PHASE_6B_BUILDER_CAPABILITIES;
}

// ── Standard warnings ─────────────────────────────────────────────────────────

/** Warnings always included in every successful builder result. */
const STANDARD_WARNINGS: readonly Phase6BWarningCode[] = [
  'MODEL_ONLY',
  'EXECUTION_FORBIDDEN',
  'SIGNING_FORBIDDEN',
  'SENDING_FORBIDDEN',
  'LIVE_RPC_FORBIDDEN',
  'REAL_INSTRUCTIONS_FORBIDDEN',
] as const;

// ── Intent/plan factory helpers ───────────────────────────────────────────────

function buildIntentFromQuote(
  quoteResult: PumpQuoteResult,
  side: PumpTradeSide,
): PumpInstructionIntent {
  return {
    intentId: nextLocalId('intent'),
    intentType: side === 'buy' ? 'buy_intent' : 'sell_intent',
    tokenMint: quoteResult.tokenMint,
    side,
    inputAmount: Number(quoteResult.inputAmount),
    estimatedOutputAmount: Number(quoteResult.estimatedOutputAmount),
    maxSlippageBps: quoteResult.slippageBps,
    venue: quoteResult.venue,
    createdAt: new Date().toISOString(),
    safeToDisplay: true,
    executionForbidden: true,
    isExecutable: false,
    notes:
      'Phase 6B local model only — not an executable instruction, no RPC, no signing',
  };
}

function buildPlan(
  intent: PumpInstructionIntent,
  planType: PumpTransactionPlanType,
): PumpTransactionPlan {
  return {
    planId: nextLocalId('plan'),
    planType,
    intents: [intent],
    tokenMint: intent.tokenMint,
    venue: intent.venue,
    createdAt: new Date().toISOString(),
    executionForbidden: true,
    isExecutable: false,
    requiresWallet: false,
    requiresSignature: false,
    requiresRpc: false,
    notes:
      'Phase 6B local placeholder only — not a Solana transaction, no wallet, no signature',
  };
}

function successResult(plan: PumpTransactionPlan): PumpInstructionBuilderResult {
  return {
    plan,
    warnings: STANDARD_WARNINGS,
    safety: PHASE_6B_BUILDER_CAPABILITIES,
  };
}

function errorResult(
  code: Parameters<typeof phase6bError>[0],
  message: string,
): PumpInstructionBuilderResult {
  return {
    plan: null,
    warnings: STANDARD_WARNINGS,
    safety: PHASE_6B_BUILDER_CAPABILITIES,
    error: phase6bError(code, message),
  };
}

// ── Mock builder ──────────────────────────────────────────────────────────────

/**
 * A mock PumpInstructionIntentBuilder for use in tests and local development.
 *
 * - Accepts successful Phase 6A quote results
 * - Rejects failed/unsafe quotes
 * - Rejects unsupported venues
 * - Rejects allowExecutableInstructions: true (runtime guard)
 * - Returns local intent/plan placeholder models only
 * - Never returns executable instruction data
 * - Never connects to Solana, never signs, never sends
 */
export class MockInstructionBuilder implements PumpInstructionIntentBuilder {
  buildBuyIntent(request: PumpInstructionBuilderRequest): PumpInstructionBuilderResult {
    const validation = validateBuilderRequest(request);
    if ('error' in validation) {
      return errorResult(validation.error.code, validation.error.message);
    }

    const { quoteResult } = validation;

    if (quoteResult.side !== 'buy') {
      return errorResult(
        'UNSUPPORTED_INTENT',
        `buildBuyIntent requires a buy-side quote — received side "${quoteResult.side}"`,
      );
    }

    const intent = buildIntentFromQuote(quoteResult, 'buy');
    const plan = buildPlan(intent, 'buy_plan');
    return successResult(plan);
  }

  buildSellIntent(request: PumpInstructionBuilderRequest): PumpInstructionBuilderResult {
    const validation = validateBuilderRequest(request);
    if ('error' in validation) {
      return errorResult(validation.error.code, validation.error.message);
    }

    const { quoteResult } = validation;

    if (quoteResult.side !== 'sell') {
      return errorResult(
        'UNSUPPORTED_INTENT',
        `buildSellIntent requires a sell-side quote — received side "${quoteResult.side}"`,
      );
    }

    const intent = buildIntentFromQuote(quoteResult, 'sell');
    const plan = buildPlan(intent, 'sell_plan');
    return successResult(plan);
  }

  buildPlanFromQuote(request: PumpInstructionBuilderRequest): PumpInstructionBuilderResult {
    const validation = validateBuilderRequest(request);
    if ('error' in validation) {
      return errorResult(validation.error.code, validation.error.message);
    }

    const { quoteResult } = validation;

    const side: PumpTradeSide = quoteResult.side === 'buy' ? 'buy' : 'sell';
    const planType: PumpTransactionPlanType =
      quoteResult.side === 'buy' ? 'buy_plan' : 'sell_plan';

    const intent = buildIntentFromQuote(quoteResult, side);
    const plan = buildPlan(intent, planType);
    return successResult(plan);
  }

  getCapabilities(): Phase6BBuilderCapabilities {
    return PHASE_6B_BUILDER_CAPABILITIES;
  }
}

/**
 * Create a new MockInstructionBuilder instance.
 */
export function createMockInstructionBuilder(): MockInstructionBuilder {
  return new MockInstructionBuilder();
}
