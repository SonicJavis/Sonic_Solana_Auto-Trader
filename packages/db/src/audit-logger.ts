import type { AuditEvent } from '@sonic/shared';
import type { AuditLogRecord } from './types.js';

export interface IAuditLogger {
  log(event: AuditEvent): Promise<void>;
  getRecent(limit?: number): Promise<AuditLogRecord[]>;
}

export class InMemoryAuditLogger implements IAuditLogger {
  private readonly records: AuditLogRecord[] = [];

  async log(event: AuditEvent): Promise<void> {
    this.records.push({
      id: event.id,
      timestamp: event.timestamp,
      eventType: event.eventType,
      severity: event.severity,
      details: JSON.stringify(event.details),
    });
  }

  async getRecent(limit = 100): Promise<AuditLogRecord[]> {
    return this.records.slice(-limit);
  }

  clear(): void {
    this.records.length = 0;
  }
}
