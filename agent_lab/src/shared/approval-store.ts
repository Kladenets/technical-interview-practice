import type { ActionEnvelope } from './action-envelope.js';

export type ApprovalState = 'proposed' | 'approved' | 'rejected' | 'expired' | 'executed' | 'failed';
export interface PendingAction extends ActionEnvelope { state: ApprovalState; bindingHash: string; approvedBy?: string; approvedAt?: string; rejectedBy?: string; rejectedAt?: string; reason?: string; }
export interface Receipt { actionId: string; tenantId: string; approvedBy?: string; approvedAt?: string; executedAt: string; toolName: 'proposeCoverageChange'; bindingHash: string; backendReference?: string; outcome: 'success' | 'failure'; error?: string; }
export interface AuditEvent { actionId: string; event: ApprovalState; at: string; actorId?: string; reason?: string; }
export interface ApprovalStoreState { actions: PendingAction[]; receipts: Array<[string, Receipt]>; audits: AuditEvent[]; }
export type ExecutionClaim = { claimed: true } | { claimed: false; existingReceipt?: Receipt };
/** Stage 04 implements this persistent contract; Stage 05 consumes the same store. */
export interface ApprovalStore {
  create(envelope: ActionEnvelope): Promise<PendingAction>; get(actionId: string): Promise<PendingAction | undefined>;
  save(action: PendingAction): Promise<void>; approve(actionId: string, approverId: string): Promise<PendingAction>;
  reject(actionId: string, rejectorId: string, reason: string): Promise<PendingAction>; listPending(tenantId: string): Promise<PendingAction[]>;
  getReceipt(idempotencyKey: string): Promise<Receipt | undefined>; saveReceipt(idempotencyKey: string, receipt: Receipt): Promise<void>;
  /**
   * Atomically reserves an idempotency key. Exactly one caller may receive `claimed: true`
   * for a key; all other callers must observe the winner's receipt (once available) and
   * must never execute the mutation. A production implementation needs a database unique
   * constraint or conditional write/transaction, not a process-local Map or lock.
   */
  claimExecution(idempotencyKey: string): Promise<ExecutionClaim>;
  appendAudit(event: AuditEvent): Promise<void>; listAudit(actionId: string): Promise<AuditEvent[]>;
  /** Export a serialisable snapshot and restore it into a fresh store instance after restart. */
  exportState(): Promise<ApprovalStoreState>; restoreState(state: ApprovalStoreState): Promise<void>;
}
