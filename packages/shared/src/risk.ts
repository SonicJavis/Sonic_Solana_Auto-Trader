export const ACTION_TYPES = [
  'READ',
  'TRADE',
  'SIGN_TRANSACTION',
  'SEND_TRANSACTION',
  'CHANGE_MODE',
  'AUDIT_LOG',
] as const;

export type ActionType = (typeof ACTION_TYPES)[number];

export type RiskDecision =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly reason: string };

export const BLOCKED_ACTIONS: ActionType[] = ['TRADE', 'SIGN_TRANSACTION', 'SEND_TRANSACTION'];
