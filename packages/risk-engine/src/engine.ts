/**
 * Phase 1 — RiskEngine: Safety gate for mode-manager actions.
 *
 * This class provides the Phase 1 action evaluation gate used by the worker
 * and tested by tests/index.test.ts. It is distinct from the Phase 12 Risk
 * Engine model layer (aggregate.ts / buildRiskAssessmentResult).
 *
 * No live data. No Solana RPC. No trading. No execution.
 */

import type { ActionType, RiskDecision } from '@sonic/shared';
import { BLOCKED_ACTIONS } from '@sonic/shared';
import type { ModeManager } from '@sonic/mode-manager';

export class RiskEngine {
  constructor(private readonly modeManager: ModeManager) {}

  evaluate(action: ActionType): RiskDecision {
    if (this.modeManager.isKillSwitchActive()) {
      if (action !== 'READ' && action !== 'AUDIT_LOG') {
        return { allowed: false, reason: 'KILL_SWITCH is active - all non-read operations blocked' };
      }
    }

    if (this.modeManager.isReadOnly() && action !== 'READ' && action !== 'AUDIT_LOG' && action !== 'CHANGE_MODE') {
      return { allowed: false, reason: `Mode ${this.modeManager.getMode()} does not allow action ${action}` };
    }

    if ((BLOCKED_ACTIONS as ActionType[]).includes(action)) {
      return { allowed: false, reason: `Action ${action} is permanently blocked in Phase 1` };
    }

    return { allowed: true };
  }
}
