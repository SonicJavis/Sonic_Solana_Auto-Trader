import type { AppMode } from './modes.js';

export interface AuditEvent {
  readonly id: string;
  readonly timestamp: string;
  readonly eventType: string;
  readonly details: Record<string, unknown>;
  readonly severity: 'info' | 'warn' | 'error';
}

export interface ModeChangeEvent extends AuditEvent {
  readonly eventType: 'MODE_CHANGE';
  readonly details: {
    readonly fromMode: AppMode;
    readonly toMode: AppMode;
    readonly triggeredBy: string;
    readonly reason?: string;
  };
}
