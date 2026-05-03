export interface AuditLogRecord {
  id: string;
  timestamp: string;
  eventType: string;
  severity: 'info' | 'warn' | 'error';
  details: string;
}

export interface ModeChangeRecord {
  id: string;
  timestamp: string;
  fromMode: string;
  toMode: string;
  triggeredBy: string;
  reason?: string;
}

export interface SystemEventRecord {
  id: string;
  timestamp: string;
  eventType: string;
  message: string;
  data?: string;
}

export interface SettingRecord {
  key: string;
  value: string;
  updatedAt: string;
}
