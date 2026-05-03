import { randomUUID } from 'crypto';
import {
  type AppMode,
  ALL_MODES,
  DEFAULT_MODE,
  LOCKED_MODES,
  type AuditEvent,
} from '@sonic/shared';
import type { IAuditLogger } from '@sonic/db';

export interface TransitionResult {
  readonly accepted: boolean;
  /** Alias for accepted — backward compatibility */
  readonly success: boolean;
  readonly previousMode: AppMode;
  readonly requestedMode: string;
  readonly resultingMode: AppMode;
  readonly reason: string | undefined;
  readonly rejectionReason: string | undefined;
  /** Alias for rejectionReason — backward compatibility */
  readonly error: string | undefined;
  readonly timestamp: string;
  readonly lockedMode: boolean;
}

export class ModeManager {
  private currentMode: AppMode;

  constructor(
    private readonly auditLogger: IAuditLogger,
    initialMode: AppMode = DEFAULT_MODE,
  ) {
    this.currentMode = initialMode;
  }

  getMode(): AppMode {
    return this.currentMode;
  }

  /**
   * Attempt a mode transition. Accepts a string to enable runtime detection of
   * unknown modes (e.g. from user input in Telegram commands). Type validation
   * is performed at runtime — unknown modes are rejected before any state change.
   * Both `accepted` and the backward-compatible `success` alias are returned.
   */
  async setMode(
    newMode: string,
    triggeredBy: string,
    reason?: string | undefined,
  ): Promise<TransitionResult> {
    const previousMode = this.currentMode;
    const timestamp = new Date().toISOString();

    // Reject unknown modes
    if (!(ALL_MODES as readonly string[]).includes(newMode)) {
      const rejectionReason = `Unknown mode: ${newMode}`;
      await this._auditTransition(previousMode, newMode, triggeredBy, false, rejectionReason, reason);
      return {
        accepted: false,
        success: false,
        previousMode,
        requestedMode: newMode,
        resultingMode: previousMode,
        reason,
        rejectionReason,
        error: rejectionReason,
        timestamp,
        lockedMode: false,
      };
    }

    // Reject locked modes
    if ((LOCKED_MODES as readonly string[]).includes(newMode)) {
      const rejectionReason = `Mode ${newMode} is locked and cannot be activated in Phase 3`;
      await this._auditTransition(previousMode, newMode, triggeredBy, false, rejectionReason, reason);
      return {
        accepted: false,
        success: false,
        previousMode,
        requestedMode: newMode,
        resultingMode: previousMode,
        reason,
        rejectionReason,
        error: rejectionReason,
        timestamp,
        lockedMode: true,
      };
    }

    const typedMode = newMode as AppMode;
    this.currentMode = typedMode;

    await this._auditTransition(previousMode, newMode, triggeredBy, true, undefined, reason);

    return {
      accepted: true,
      success: true,
      previousMode,
      requestedMode: newMode,
      resultingMode: typedMode,
      reason,
      rejectionReason: undefined,
      error: undefined,
      timestamp,
      lockedMode: false,
    };
  }

  private async _auditTransition(
    fromMode: AppMode,
    toMode: string,
    triggeredBy: string,
    accepted: boolean,
    rejectionReason?: string | undefined,
    reason?: string | undefined,
  ): Promise<void> {
    const details: Record<string, unknown> = {
      fromMode,
      toMode,
      triggeredBy,
      accepted,
    };
    if (reason !== undefined) details['reason'] = reason;
    if (rejectionReason !== undefined) details['rejectionReason'] = rejectionReason;

    const event: AuditEvent = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      eventType: 'MODE_CHANGE',
      severity: accepted ? 'info' : 'warn',
      details,
    };
    await this.auditLogger.log(event);
  }

  isKillSwitchActive(): boolean {
    return this.currentMode === 'KILL_SWITCH';
  }

  isReadOnly(): boolean {
    return this.currentMode === 'READ_ONLY' || this.currentMode === 'KILL_SWITCH';
  }
}
