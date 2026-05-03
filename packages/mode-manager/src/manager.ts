import { randomUUID } from 'crypto';
import {
  type AppMode,
  DEFAULT_MODE,
  LOCKED_MODES,
  type AuditEvent,
} from '@sonic/shared';
import type { IAuditLogger } from '@sonic/db';

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

  async setMode(
    newMode: AppMode,
    triggeredBy: string,
    reason?: string,
  ): Promise<{ success: true } | { success: false; error: string }> {
    if (LOCKED_MODES.includes(newMode)) {
      return {
        success: false,
        error: `Mode ${newMode} is locked and cannot be activated in Phase 1`,
      };
    }

    const fromMode = this.currentMode;
    this.currentMode = newMode;

    const details: Record<string, unknown> = reason !== undefined
      ? { fromMode, toMode: newMode, triggeredBy, reason }
      : { fromMode, toMode: newMode, triggeredBy };

    const event: AuditEvent = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      eventType: 'MODE_CHANGE',
      severity: 'info',
      details,
    };

    await this.auditLogger.log(event);

    return { success: true };
  }

  isKillSwitchActive(): boolean {
    return this.currentMode === 'KILL_SWITCH';
  }

  isReadOnly(): boolean {
    return this.currentMode === 'READ_ONLY' || this.currentMode === 'KILL_SWITCH';
  }
}
